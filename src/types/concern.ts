export type ConcernCategory =
  | 'Equipment or maintenance'
  | 'Cleanliness and hygiene'
  | 'Trainer or coaching'
  | 'Staff behaviour'
  | 'Membership or billing'
  | 'Group classes'
  | 'Safety concern'
  | 'Suggestion'
  | 'Other';

export type ConcernStatus = 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface ConcernNote {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  note: string;
  createdAt: string;
}

export type GoogleSheetsSyncStatus = 'SYNCED' | 'PENDING' | 'FAILED' | 'NOT_CONFIGURED';

export interface ConcernSubmission {
  id: string;
  referenceId: string;
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
  isAnonymous: boolean;
  status: ConcernStatus;
  assignedStaffId?: string;
  assignedStaffName?: string;
  internalNotes: ConcernNote[];
  resolutionDetails?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  googleSheetsSyncStatus?: GoogleSheetsSyncStatus;
  googleSheetsSyncedAt?: string;
  googleSheetsError?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConcernPayload {
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
  isAnonymous: boolean;
  websiteUrl?: string; // honeypot
}

export interface ConcernStats {
  total: number;
  newCount: number;
  inProgressCount: number;
  resolvedCount: number;
  closedCount: number;
}
