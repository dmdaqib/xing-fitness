import type { ConcernSubmission } from '../types.ts';

/**
 * Format date in Asia/Kolkata (IST) timezone
 */
export function formatIstTimestamp(dateStr?: string | Date): string {
  const d = dateStr ? new Date(dateStr) : new Date();
  try {
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(d) + ' IST';
  } catch {
    return d.toISOString();
  }
}

export interface GoogleSheetsSyncResult {
  success: boolean;
  configured: boolean;
  error?: string;
  response?: any;
}

export const googleSheetsService = {
  /**
   * Check if Google Sheets webhook is configured in environment
   */
  isConfigured(): boolean {
    const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    return typeof url === 'string' && url.trim().startsWith('http');
  },

  /**
   * Get the configured Webhook URL (masked for admin view)
   */
  getConfigInfo() {
    const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    const isConfigured = this.isConfigured();
    let maskedUrl = 'Not Configured';

    if (isConfigured && url) {
      try {
        const parsed = new URL(url.trim());
        const pathname = parsed.pathname;
        const truncatedPath = pathname.length > 25 ? pathname.substring(0, 15) + '...' + pathname.slice(-6) : pathname;
        maskedUrl = `${parsed.protocol}//${parsed.hostname}${truncatedPath}`;
      } catch {
        maskedUrl = 'Configured (Custom Endpoint)';
      }
    }

    return {
      isConfigured,
      maskedUrl,
      targetSheetName: 'Xing Fitness Member Concerns',
      targetTabName: 'Member Concerns',
      hasSecret: Boolean(process.env.GOOGLE_SHEETS_WEBHOOK_SECRET)
    };
  },

  /**
   * Test connection to the Google Apps Script Web App
   */
  async testConnection(): Promise<{ ok: boolean; message: string }> {
    const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();
    if (!url) {
      return {
        ok: false,
        message: 'GOOGLE_SHEETS_WEBHOOK_URL environment variable is not set.'
      };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const secret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET?.trim() || '';
      const testPayload = {
        action: 'ping',
        secret,
        timestamp: new Date().toISOString()
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(secret ? { 'X-Webhook-Secret': secret } : {})
        },
        body: JSON.stringify(testPayload),
        signal: controller.signal,
        redirect: 'follow'
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        return {
          ok: false,
          message: `Google Sheets endpoint returned HTTP status ${res.status}.`
        };
      }

      const text = await res.text();
      let json = null;
      try {
        json = JSON.parse(text);
      } catch {
        json = { raw: text };
      }

      if (json && json.success === false) {
        return {
          ok: false,
          message: json.error || json.message || 'Google Sheets Web App reported an error.'
        };
      }

      if (json && (json.success || json.status === 'ok' || json.message)) {
        return {
          ok: true,
          message: 'Connection successful. Google Sheets Web App responded OK.'
        };
      }

      return {
        ok: true,
        message: 'Connection reached Web App endpoint successfully.'
      };
    } catch (err: any) {
      const isTimeout = err?.name === 'AbortError';
      return {
        ok: false,
        message: isTimeout
          ? 'Connection timed out after 8 seconds. Please check the Web App deployment URL.'
          : `Failed to connect: ${err?.message || 'Network error'}`
      };
    }
  },

  /**
   * Sync a member concern submission to Google Sheets
   * Appends 13 columns to "Member Concerns" tab:
   * 1. Reference ID
   * 2. Submitted At (Asia/Kolkata)
   * 3. Category
   * 4. Subject
   * 5. Description
   * 6. Incident Date
   * 7. Gym Location
   * 8. Member Name
   * 9. Phone
   * 10. Email
   * 11. Anonymous
   * 12. Status
   * 13. Internal Notes
   */
  async syncConcern(concern: ConcernSubmission): Promise<GoogleSheetsSyncResult> {
    const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();

    if (!url) {
      return {
        success: false,
        configured: false,
        error: 'GOOGLE_SHEETS_WEBHOOK_URL environment variable is not configured.'
      };
    }

    const secret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET?.trim() || '';
    const istTime = formatIstTimestamp(concern.createdAt);

    // Extract notes if any
    const notesSummary = concern.internalNotes && concern.internalNotes.length > 0
      ? concern.internalNotes.map((n) => `[${n.authorName}]: ${n.note}`).join(' | ')
      : '';

    // Prepare exactly the 13 columns specified
    const payload = {
      action: 'append_concern',
      secret,
      referenceId: concern.referenceId,
      submittedAt: istTime,
      category: concern.category,
      subject: concern.subject,
      description: concern.description,
      incidentDate: concern.incidentDate || 'N/A',
      gymLocation: concern.gymLocation || 'Not specified',
      name: concern.isAnonymous ? 'Anonymous' : (concern.name || 'Not provided'),
      phone: concern.isAnonymous ? 'N/A' : (concern.phone || concern.contactInfo || 'N/A'),
      email: concern.isAnonymous ? 'N/A' : (concern.email || (concern.contactInfo?.includes('@') ? concern.contactInfo : 'N/A')),
      isAnonymous: concern.isAnonymous ? 'Yes' : 'No',
      status: concern.status || 'NEW',
      internalNotes: notesSummary || (concern.resolutionDetails ? `Resolution: ${concern.resolutionDetails}` : '')
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(secret ? { 'X-Webhook-Secret': secret } : {})
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
        redirect: 'follow'
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        return {
          success: false,
          configured: true,
          error: `Google Sheets endpoint returned HTTP status ${res.status}`
        };
      }

      const text = await res.text();
      let jsonResponse: any = null;
      try {
        jsonResponse = JSON.parse(text);
      } catch {
        jsonResponse = { raw: text };
      }

      if (jsonResponse && jsonResponse.success === false) {
        return {
          success: false,
          configured: true,
          error: jsonResponse.error || jsonResponse.message || 'Google Apps Script reported an error while writing row.'
        };
      }

      return {
        success: true,
        configured: true,
        response: jsonResponse
      };
    } catch (err: any) {
      const isTimeout = err?.name === 'AbortError';
      const errorMessage = isTimeout
        ? 'Google Sheets sync timed out after 10 seconds.'
        : `Network error syncing with Google Sheets: ${err?.message || 'Unknown network error'}`;

      return {
        success: false,
        configured: true,
        error: errorMessage
      };
    }
  }
};
