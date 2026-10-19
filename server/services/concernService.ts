import crypto from 'crypto';
import { db } from '../db/store.ts';
import { googleSheetsService } from './googleSheetsService.ts';
import type {
  ConcernSubmission,
  ConcernCategory,
  ConcernStatus,
  ConcernNote,
  GoogleSheetsSyncStatus,
  UserRole
} from '../types.ts';

// Allowed concern categories
export const ALLOWED_CONCERN_CATEGORIES: ConcernCategory[] = [
  'Equipment or maintenance',
  'Cleanliness and hygiene',
  'Trainer or coaching',
  'Staff behaviour',
  'Membership or billing',
  'Group classes',
  'Safety concern',
  'Suggestion',
  'Other'
];

export const ALLOWED_CONCERN_STATUSES: ConcernStatus[] = [
  'NEW',
  'IN_PROGRESS',
  'RESOLVED',
  'CLOSED'
];

// In-memory rate limiting map: ipHash -> array of submission timestamps (ms)
const rateLimitStore = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX_REQUESTS = 5; // max 5 submissions per 10 mins

// Cleanup old rate limit entries every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamps] of rateLimitStore.entries()) {
    const valid = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (valid.length === 0) {
      rateLimitStore.delete(ip);
    } else {
      rateLimitStore.set(ip, valid);
    }
  }
}, 15 * 60 * 1000).unref();

function sanitizeString(input?: string): string {
  if (!input) return '';
  return String(input)
    .replace(/<[^>]*>?/gm, '') // Strip HTML tags
    .trim();
}

function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip + '-xing-concern-salt').digest('hex').substring(0, 16);
}

function generateReferenceId(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000); // 4-digit pin
  return `XF-CON-${yyyy}${mm}${dd}-${randomSuffix}`;
}

export interface CreateConcernInput {
  category: ConcernCategory;
  subject: string;
  description: string;
  incidentDate?: string;
  gymLocation?: string;
  name?: string;
  contactInfo?: string;
  phone?: string;
  email?: string;
  preferredContactMethod?: 'Phone Call' | 'WhatsApp' | 'Email' | 'No contact needed';
  isAnonymous?: boolean;
  websiteUrl?: string; // Honeypot field (must be empty)
}

export const concernService = {
  /**
   * Submit a new member concern from the public unlisted form
   * Writes atomically to Google Sheets when configured, and persists locally.
   */
  async createConcern(input: CreateConcernInput, clientIp: string) {
    // 1. Honeypot check for spam bots
    if (input.websiteUrl && input.websiteUrl.trim() !== '') {
      throw { status: 400, message: 'Spam submission detected.' };
    }

    // 2. IP Rate limiting
    const ipHash = hashIp(clientIp || 'unknown-ip');
    const nowMs = Date.now();
    const timestamps = rateLimitStore.get(ipHash) || [];
    const recentTimestamps = timestamps.filter((t) => nowMs - t < RATE_LIMIT_WINDOW_MS);

    if (recentTimestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
      throw {
        status: 429,
        message: 'Too many submissions received from this network. Please wait a few minutes before submitting again.'
      };
    }

    // 3. Category validation
    if (!input.category || !ALLOWED_CONCERN_CATEGORIES.includes(input.category)) {
      throw {
        status: 400,
        message: `Please select a valid concern category from the list.`
      };
    }

    // 4. Subject validation
    const subject = sanitizeString(input.subject);
    if (!subject || subject.length < 3) {
      throw { status: 400, message: 'A brief subject of at least 3 characters is required.' };
    }
    if (subject.length > 150) {
      throw { status: 400, message: 'Subject must not exceed 150 characters.' };
    }

    // 5. Description validation
    const description = sanitizeString(input.description);
    if (!description || description.length < 10) {
      throw { status: 400, message: 'Please provide a detailed description of at least 10 characters.' };
    }
    if (description.length > 3000) {
      throw { status: 400, message: 'Description must not exceed 3000 characters.' };
    }

    // 6. Optional incident date validation
    let incidentDate: string | undefined = undefined;
    if (input.incidentDate && input.incidentDate.trim() !== '') {
      const parsed = new Date(input.incidentDate.trim());
      if (isNaN(parsed.getTime())) {
        throw { status: 400, message: 'Invalid incident date format.' };
      }
      const todayIso = new Date().toISOString().split('T')[0];
      const selectedIso = parsed.toISOString().split('T')[0];
      if (selectedIso > todayIso) {
        throw { status: 400, message: 'Incident date cannot be in the future.' };
      }
      incidentDate = selectedIso;
    }

    // 7. Optional gym location
    const gymLocation = input.gymLocation ? sanitizeString(input.gymLocation).substring(0, 100) : undefined;

    // 8. Anonymous vs. Contact Details Handling
    const isAnonymous = Boolean(input.isAnonymous);
    let name: string | undefined = undefined;
    let contactInfo: string | undefined = undefined;
    let phone: string | undefined = undefined;
    let email: string | undefined = undefined;
    let preferredContactMethod: 'Phone Call' | 'WhatsApp' | 'Email' | 'No contact needed' | undefined = undefined;

    if (!isAnonymous) {
      if (input.name && input.name.trim() !== '') {
        name = sanitizeString(input.name).substring(0, 100);
      }
      if (input.phone && input.phone.trim() !== '') {
        phone = sanitizeString(input.phone).substring(0, 50);
      }
      if (input.email && input.email.trim() !== '') {
        email = sanitizeString(input.email).substring(0, 100);
      }
      if (input.contactInfo && input.contactInfo.trim() !== '') {
        contactInfo = sanitizeString(input.contactInfo).substring(0, 120);
        // Distribute to phone/email if not explicitly provided
        if (!email && contactInfo.includes('@')) {
          email = contactInfo;
        } else if (!phone) {
          phone = contactInfo;
        }
      }
      if (input.preferredContactMethod) {
        preferredContactMethod = input.preferredContactMethod;
      }
    }

    const currentDb = db.get();
    if (!currentDb.concerns) {
      currentDb.concerns = [];
    }

    // 9. Duplicate submission prevention (same category, subject, description within 120s)
    const duplicateWindowMs = 2 * 60 * 1000;
    const isDuplicate = currentDb.concerns.some((c) => {
      const submissionTime = new Date(c.createdAt).getTime();
      return (
        nowMs - submissionTime < duplicateWindowMs &&
        c.category === input.category &&
        c.subject.toLowerCase() === subject.toLowerCase() &&
        c.description.toLowerCase() === description.toLowerCase()
      );
    });

    if (isDuplicate) {
      throw {
        status: 409,
        message: 'This concern appears to have already been submitted recently. Please avoid duplicate submissions.'
      };
    }

    // 10. Generate Unique Reference ID
    let referenceId = generateReferenceId();
    while (currentDb.concerns.some((c) => c.referenceId === referenceId)) {
      referenceId = generateReferenceId();
    }

    const nowIso = new Date().toISOString();
    let googleSheetsSyncStatus: GoogleSheetsSyncStatus = 'NOT_CONFIGURED';
    let googleSheetsSyncedAt: string | undefined = undefined;
    let googleSheetsError: string | undefined = undefined;

    const newConcern: ConcernSubmission = {
      id: `con-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      referenceId,
      category: input.category,
      subject,
      description,
      incidentDate,
      gymLocation,
      name,
      contactInfo: contactInfo || phone || email,
      phone,
      email,
      preferredContactMethod,
      isAnonymous,
      status: 'NEW',
      internalNotes: [],
      ipHash,
      googleSheetsSyncStatus,
      googleSheetsSyncedAt,
      googleSheetsError,
      createdAt: nowIso,
      updatedAt: nowIso
    };

    // 11. Google Sheets Automatic Synchronization
    const isSheetsConfigured = googleSheetsService.isConfigured();
    let sheetsSyncFailed = false;

    if (isSheetsConfigured) {
      const syncResult = await googleSheetsService.syncConcern(newConcern);
      if (syncResult.success) {
        newConcern.googleSheetsSyncStatus = 'SYNCED';
        newConcern.googleSheetsSyncedAt = new Date().toISOString();
        console.log(`[Google Sheets Success] Concern ${referenceId} synced: row ${syncResult.response?.rowNumber}, action: ${syncResult.response?.actionTaken}`);
      } else {
        newConcern.googleSheetsSyncStatus = 'FAILED';
        newConcern.googleSheetsError = syncResult.error;
        sheetsSyncFailed = true;

        // Secure technical error logging without exposing member information
        console.error(`[Google Sheets Error] Concern ${referenceId} failed to write to Google Sheets: ${syncResult.error}`);
      }
    } else {
      newConcern.googleSheetsSyncStatus = 'NOT_CONFIGURED';
    }

    // 12. Store in local DB persistently as audit trail & backup
    currentDb.concerns.unshift(newConcern);

    // Create In-App Notification for Management / Staff
    if (!currentDb.notifications) {
      currentDb.notifications = [];
    }
    currentDb.notifications.unshift({
      id: `notif-con-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: 'STAFF',
      type: 'concern',
      title: `New Concern [${referenceId}]: ${newConcern.category}`,
      message: `${isAnonymous ? 'Anonymous Member' : name || 'Member'}: "${subject}" — ${newConcern.category}${newConcern.googleSheetsSyncStatus === 'SYNCED' ? ' (Saved to Google Sheets)' : ''}`,
      read: false,
      link: '/admin/concerns',
      createdAt: nowIso
    });

    db.save(currentDb);

    // Record rate limit timestamp
    recentTimestamps.push(nowMs);
    rateLimitStore.set(ipHash, recentTimestamps);

    // If Google Sheets is configured but write failed, fail securely with friendly retry message
    if (sheetsSyncFailed) {
      throw {
        status: 502,
        message: 'We were unable to save your concern to our central Google Sheets system right now. Please retry in a moment, or notify front desk management directly.'
      };
    }

    // Return ONLY safe public confirmation data
    return {
      referenceId: newConcern.referenceId,
      category: newConcern.category,
      createdAt: newConcern.createdAt,
      status: newConcern.status,
      googleSheetsSynced: newConcern.googleSheetsSyncStatus === 'SYNCED'
    };
  },

  /**
   * Management: Retry syncing a specific concern to Google Sheets
   */
  async retrySyncToSheets(id: string): Promise<ConcernSubmission> {
    const currentDb = db.get();
    const concern = (currentDb.concerns || []).find((c) => c.id === id);
    if (!concern) {
      throw { status: 404, message: 'Concern submission not found.' };
    }

    const syncResult = await googleSheetsService.syncConcern(concern);
    if (syncResult.success) {
      concern.googleSheetsSyncStatus = 'SYNCED';
      concern.googleSheetsSyncedAt = new Date().toISOString();
      concern.googleSheetsError = undefined;
      console.log(`[Google Sheets Success] Concern ${concern.referenceId} retry synced: row ${syncResult.response?.rowNumber}, action: ${syncResult.response?.actionTaken}, isDuplicate: ${syncResult.response?.isDuplicate}`);
    } else {
      concern.googleSheetsSyncStatus = 'FAILED';
      concern.googleSheetsError = syncResult.error;
      throw {
        status: 502,
        message: `Google Sheets write failed: ${syncResult.error || 'Unknown error'}`
      };
    }

    concern.updatedAt = new Date().toISOString();
    db.save(currentDb);
    return concern;
  },

  /**
   * Management: Get concerns list with filters and search
   */
  getConcerns(filters?: {
    category?: string;
    status?: string;
    search?: string;
  }): ConcernSubmission[] {
    const currentDb = db.get();
    let list = [...(currentDb.concerns || [])];

    if (filters?.category && filters.category !== 'all') {
      list = list.filter((c) => c.category === filters.category);
    }

    if (filters?.status && filters.status !== 'all') {
      list = list.filter((c) => c.status === filters.status);
    }

    if (filters?.search && filters.search.trim() !== '') {
      const q = filters.search.trim().toLowerCase();
      list = list.filter((c) => {
        return (
          c.referenceId.toLowerCase().includes(q) ||
          c.subject.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          (c.name && c.name.toLowerCase().includes(q)) ||
          (c.phone && c.phone.toLowerCase().includes(q)) ||
          (c.email && c.email.toLowerCase().includes(q)) ||
          (c.contactInfo && c.contactInfo.toLowerCase().includes(q)) ||
          (c.gymLocation && c.gymLocation.toLowerCase().includes(q)) ||
          (c.assignedStaffName && c.assignedStaffName.toLowerCase().includes(q))
        );
      });
    }

    // Newest first
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  },

  /**
   * Management: Get single concern by ID or reference ID
   */
  getConcernById(idOrRef: string): ConcernSubmission {
    const currentDb = db.get();
    const concern = (currentDb.concerns || []).find(
      (c) => c.id === idOrRef || c.referenceId === idOrRef
    );
    if (!concern) {
      throw { status: 404, message: 'Concern submission not found.' };
    }
    return concern;
  },

  /**
   * Management: Update status and optional resolution details
   */
  updateConcernStatus(
    id: string,
    status: ConcernStatus,
    resolutionDetails?: string,
    user?: { email: string; name?: string; role: UserRole }
  ): ConcernSubmission {
    if (!ALLOWED_CONCERN_STATUSES.includes(status)) {
      throw { status: 400, message: 'Invalid concern status.' };
    }

    const currentDb = db.get();
    const concern = (currentDb.concerns || []).find((c) => c.id === id);
    if (!concern) {
      throw { status: 404, message: 'Concern submission not found.' };
    }

    const prevStatus = concern.status;
    concern.status = status;
    concern.updatedAt = new Date().toISOString();

    if (resolutionDetails !== undefined) {
      concern.resolutionDetails = sanitizeString(resolutionDetails);
    }

    if (status === 'RESOLVED' || status === 'CLOSED') {
      if (!concern.resolvedAt) {
        concern.resolvedAt = new Date().toISOString();
      }
      concern.resolvedBy = user?.email || 'Authorized Management';
    } else {
      concern.resolvedAt = undefined;
      concern.resolvedBy = undefined;
    }

    // Auto-log system note for audit trail
    if (prevStatus !== status) {
      if (!concern.internalNotes) concern.internalNotes = [];
      concern.internalNotes.push({
        id: `note-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        authorId: user?.email || 'system',
        authorName: user?.name || user?.email || 'Management Staff',
        authorRole: user?.role || 'STAFF',
        note: `Status changed from ${prevStatus} to ${status}.${resolutionDetails ? ` Note: ${resolutionDetails}` : ''}`,
        createdAt: new Date().toISOString()
      });
    }

    db.save(currentDb);
    return concern;
  },

  /**
   * Management: Assign staff member to concern
   */
  assignConcern(
    id: string,
    staffId: string,
    staffName: string,
    user?: { email: string; name?: string; role: UserRole }
  ): ConcernSubmission {
    const currentDb = db.get();
    const concern = (currentDb.concerns || []).find((c) => c.id === id);
    if (!concern) {
      throw { status: 404, message: 'Concern submission not found.' };
    }

    const prevAssigned = concern.assignedStaffName || 'Unassigned';
    concern.assignedStaffId = staffId || undefined;
    concern.assignedStaffName = staffName || undefined;
    concern.updatedAt = new Date().toISOString();

    if (!concern.internalNotes) concern.internalNotes = [];
    concern.internalNotes.push({
      id: `note-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      authorId: user?.email || 'system',
      authorName: user?.name || user?.email || 'Management Staff',
      authorRole: user?.role || 'STAFF',
      note: `Assignment updated: previously "${prevAssigned}", now assigned to "${staffName || 'Unassigned'}".`,
      createdAt: new Date().toISOString()
    });

    db.save(currentDb);
    return concern;
  },

  /**
   * Management: Add private internal note to a concern
   */
  addInternalNote(
    id: string,
    noteText: string,
    user: { userId: string; email: string; name?: string; role: UserRole }
  ): ConcernNote {
    const cleanNote = sanitizeString(noteText);
    if (!cleanNote || cleanNote.length < 2) {
      throw { status: 400, message: 'Note content cannot be empty.' };
    }

    const currentDb = db.get();
    const concern = (currentDb.concerns || []).find((c) => c.id === id);
    if (!concern) {
      throw { status: 404, message: 'Concern submission not found.' };
    }

    const newNote: ConcernNote = {
      id: `note-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      authorId: user.userId || user.email,
      authorName: user.name || user.email,
      authorRole: user.role,
      note: cleanNote,
      createdAt: new Date().toISOString()
    };

    if (!concern.internalNotes) {
      concern.internalNotes = [];
    }
    concern.internalNotes.push(newNote);
    concern.updatedAt = new Date().toISOString();

    db.save(currentDb);
    return newNote;
  },

  /**
   * Management: Get quick dashboard statistics for concerns
   */
  getConcernStats() {
    const currentDb = db.get();
    const concerns = currentDb.concerns || [];
    const total = concerns.length;
    const newCount = concerns.filter((c) => c.status === 'NEW').length;
    const inProgressCount = concerns.filter((c) => c.status === 'IN_PROGRESS').length;
    const resolvedCount = concerns.filter((c) => c.status === 'RESOLVED').length;
    const closedCount = concerns.filter((c) => c.status === 'CLOSED').length;
    const googleSheetsSyncedCount = concerns.filter((c) => c.googleSheetsSyncStatus === 'SYNCED').length;
    const googleSheetsFailedCount = concerns.filter((c) => c.googleSheetsSyncStatus === 'FAILED').length;

    return {
      total,
      newCount,
      inProgressCount,
      resolvedCount,
      closedCount,
      googleSheetsSyncedCount,
      googleSheetsFailedCount
    };
  }
};
