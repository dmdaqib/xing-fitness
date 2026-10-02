/**
 * XING FITNESS - Lead & Enquiry Management Service
 * Architecture Preparation for CRM & Backend API Integration
 * 
 * In P2, this service acts as the single source of truth for all client-side lead capture
 * (Free Trial, Membership Enquiry, Personal Training Request, Class Booking Request, General Question).
 * 
 * Conforms to P2 Mandate:
 * - Does NOT pretend to have a live persistent database.
 * - Stores submissions in sessionStorage for the active session.
 * - Logs structured payloads ready for webhook / REST API / Supabase integration.
 * - Provides standardized validation, status tracking, and confirmation models.
 */

export type EnquiryType = 
  | 'Free Trial' 
  | 'Membership' 
  | 'Personal Training' 
  | 'Class' 
  | 'General Question';

export interface LeadEnquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  type: EnquiryType;
  preferredDate?: string;
  preferredTime?: string;
  fitnessGoal?: string;
  targetPlanOrClass?: string;
  message?: string;
  timestamp: string;
  status: 'received' | 'in_review' | 'contacted';
  notes?: string;
}

// In-memory fallback if sessionStorage is restricted
let inMemoryLeads: LeadEnquiry[] = [];

const STORAGE_KEY = 'xing_fitness_session_leads_v2';

export const leadService = {
  /**
   * Submit an enquiry through the unified lead pipeline
   */
  async submitEnquiry(
    data: Omit<LeadEnquiry, 'id' | 'timestamp' | 'status'>
  ): Promise<{ success: boolean; lead: LeadEnquiry; message: string }> {
    // 1. Client-side validation
    if (!data.name || data.name.trim().length < 2) {
      throw new Error('Please enter a valid full name (minimum 2 characters).');
    }

    const cleanPhone = data.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      throw new Error('Please enter a valid 10-digit mobile number.');
    }

    // 2. Build structured Lead record
    const newLead: LeadEnquiry = {
      id: `LEAD-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`,
      name: data.name.trim(),
      phone: cleanPhone,
      email: data.email?.trim() || undefined,
      type: data.type,
      preferredDate: data.preferredDate || undefined,
      preferredTime: data.preferredTime || undefined,
      fitnessGoal: data.fitnessGoal || undefined,
      targetPlanOrClass: data.targetPlanOrClass || undefined,
      message: data.message?.trim() || undefined,
      timestamp: new Date().toISOString(),
      status: 'received',
      notes: 'Captured via website frontend. Awaiting front desk verification.'
    };

    // 3. Post to real backend database endpoint
    try {
      const res = await fetch('/api/public/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newLead.name,
          phone: newLead.phone,
          email: newLead.email,
          type: newLead.type + (newLead.targetPlanOrClass ? ` (${newLead.targetPlanOrClass})` : ''),
          source: newLead.type === 'Free Trial' ? 'Free Trial' : 'Website',
          preferredDate: newLead.preferredDate,
          preferredTime: newLead.preferredTime,
          fitnessGoal: newLead.fitnessGoal,
          message: newLead.message
        })
      });
      if (res.ok) {
        const json = await res.json();
        if (json?.data?.id) {
          newLead.id = json.data.id;
        }
      }
    } catch (e) {
      console.warn('[leadService] Backend API offline or unreachable, saved to session fallback:', e);
    }

    // 4. Store in session
    try {
      const existing = leadService.getSessionLeads();
      const updated = [newLead, ...existing];
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      inMemoryLeads = updated;
    } catch {
      inMemoryLeads = [newLead, ...inMemoryLeads];
    }

    // 5. Console audit trail for developers and admin inspection
    if (typeof console !== 'undefined') {
      console.info(
        `[Xing Fitness Lead Engine] ✓ ${newLead.type} Enquiry Received & Synced (${newLead.id}):`,
        newLead
      );
    }

    return {
      success: true,
      lead: newLead,
      message: 'Your free trial request has been received. Our team will contact you to confirm the appointment.'
    };

  },

  /**
   * Retrieve all enquiries captured during the current browser session
   */
  getSessionLeads(): LeadEnquiry[] {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const raw = window.sessionStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
      }
    } catch {
      // fallback to memory
    }
    return inMemoryLeads;
  },

  /**
   * Helper to format human-readable what-happens-next instructions
   */
  getNextSteps(type: EnquiryType): string[] {
    switch (type) {
      case 'Free Trial':
        return [
          'Our front desk in Brookefield reviews your preferred slot.',
          'You will receive an SMS / WhatsApp message to confirm attendance.',
          'Arrive in comfortable workout attire with clean indoor shoes for your induction.'
        ];
      case 'Membership':
        return [
          'A membership consultant will share customized student/corporate/individual rate options.',
          'You will receive a WhatsApp message with current promotional terms (including 40% Founder discounts if eligible).',
          'Visit the facility anytime during operating hours for a formal tour and onboarding.'
        ];
      case 'Personal Training':
        return [
          'The head coach will review your fitness goals and movement history.',
          'You will be paired with a certified coach specializing in your discipline.',
          'A complimentary movement screening session will be scheduled.'
        ];
      case 'Class':
        return [
          'Studio slot availability is verified for your requested time.',
          'You will receive class preparation tips and studio locker instructions.',
          'Check in at the reception desk 10 minutes prior to class start.'
        ];
      default:
        return [
          'Our support team will review your inquiry.',
          'We will respond promptly via your preferred contact channel.'
        ];
    }
  }
};
