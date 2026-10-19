/**
 * ==============================================================================
 * XING FITNESS — MEMBER CONCERN & FEEDBACK SYSTEM
 * Google Apps Script Web App Integration
 * ==============================================================================
 * 
 * Target Spreadsheet: "Xing Fitness Member Concerns"
 * Target Tab Name:    "Member Concerns"
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open Google Sheets (https://sheets.google.com).
 * 2. Create a new spreadsheet named: "Xing Fitness Member Concerns".
 * 3. In the top menu, click Extensions > Apps Script.
 * 4. Delete any code in the editor, paste this entire Code.gs file, and click Save (disk icon).
 * 5. (Optional Security) In Apps Script, go to Project Settings (gear icon) > Script Properties:
 *    Add property: WEBHOOK_SECRET with a strong random string (e.g. xing_secret_2026).
 *    Set the same string in your server's GOOGLE_SHEETS_WEBHOOK_SECRET environment variable.
 * 6. Click "Deploy" > "New deployment".
 * 7. Click the gear icon next to "Select type" and choose "Web app".
 *    - Description: "Xing Fitness Member Concerns Webhook"
 *    - Execute as: "Me" (your Google account)
 *    - Who has access: "Anyone"
 * 8. Click "Deploy". Authorize permissions if prompted by Google.
 * 9. Copy the generated Web App URL (starts with https://script.google.com/macros/s/.../exec).
 * 10. Set the URL in your Xing Fitness server environment:
 *     GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
 * ==============================================================================
 */

var TAB_NAME = "Member Concerns";
var TIMEZONE = "Asia/Kolkata";

var HEADERS = [
  "Reference ID",
  "Submitted At",
  "Category",
  "Subject",
  "Description",
  "Incident Date",
  "Gym Location",
  "Member Name",
  "Phone",
  "Email",
  "Anonymous",
  "Status",
  "Internal Notes"
];

/**
 * Handle incoming GET requests for health check
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "ok",
    service: "Xing Fitness Member Concerns Webhook",
    timestamp: Utilities.formatDate(new Date(), TIMEZONE, "yyyy-MM-dd HH:mm:ss 'IST'")
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Helper to format a concern row
 */
function formatConcernRow(sheet, rowNum, status) {
  var rowRange = sheet.getRange(rowNum, 1, 1, HEADERS.length);
  rowRange.setFontSize(10);
  rowRange.setVerticalAlignment("middle");

  // Highlight status cell (Column 12)
  var statusCell = sheet.getRange(rowNum, 12);
  statusCell.setFontWeight("bold");

  var normalizedStatus = (status || "").toUpperCase();
  if (normalizedStatus === "NEW") {
    statusCell.setBackground("#FEE2E2"); // soft red
    statusCell.setFontColor("#991B1B");
  } else if (normalizedStatus === "IN_PROGRESS") {
    statusCell.setBackground("#FEF3C7"); // soft amber
    statusCell.setFontColor("#92400E");
  } else if (normalizedStatus === "RESOLVED") {
    statusCell.setBackground("#D1FAE5"); // soft green
    statusCell.setFontColor("#065F46");
  } else if (normalizedStatus === "CLOSED") {
    statusCell.setBackground("#F3F4F6"); // soft grey
    statusCell.setFontColor("#374151");
  }
}

/**
 * Handle incoming POST requests from Xing Fitness Backend
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  // Wait up to 10 seconds for concurrent writes
  try {
    lock.waitLock(10000);
  } catch (err) {
    return createJsonResponse(false, "Server busy locking spreadsheet. Please try again.");
  }

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse(false, "No payload received in request.");
    }

    var payload;
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return createJsonResponse(false, "Invalid JSON payload: " + parseErr.message);
    }

    // 1. Verify Secret if configured in Script Properties
    var scriptProperties = PropertiesService.getScriptProperties();
    var expectedSecret = scriptProperties.getProperty("WEBHOOK_SECRET");
    if (expectedSecret && expectedSecret.trim() !== "") {
      var providedSecret = payload.secret || (e.headers && e.headers["X-Webhook-Secret"]);
      if (providedSecret !== expectedSecret) {
        return createJsonResponse(false, "Unauthorized: Invalid or missing webhook secret.");
      }
    }

    // 2. Ping check
    if (payload.action === "ping") {
      return createJsonResponse(true, "Pong. Xing Fitness Google Sheets Webhook is active.");
    }

    // 3. Payload Validation
    if (!payload.referenceId || typeof payload.referenceId !== "string" || !payload.referenceId.trim()) {
      return createJsonResponse(false, "Validation failed: Missing referenceId.");
    }
    if (!payload.category || typeof payload.category !== "string" || !payload.category.trim()) {
      return createJsonResponse(false, "Validation failed: Missing category.");
    }
    if (!payload.subject || typeof payload.subject !== "string" || !payload.subject.trim()) {
      return createJsonResponse(false, "Validation failed: Missing subject.");
    }
    if (!payload.description || typeof payload.description !== "string" || !payload.description.trim()) {
      return createJsonResponse(false, "Validation failed: Missing description.");
    }

    // 4. Get or Create "Member Concerns" Sheet
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(TAB_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(TAB_NAME);
    }

    // Initialize Header Row if empty
    if (sheet.getLastRow() === 0) {
      var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
      headerRange.setValues([HEADERS]);
      headerRange.setBackground("#12141A");
      headerRange.setFontColor("#D4AF37");
      headerRange.setFontWeight("bold");
      headerRange.setFontSize(10);
      sheet.setFrozenRows(1);
    }

    // 5. Prepare Row Data matching the 13 Columns
    var submittedAt = payload.submittedAt || Utilities.formatDate(new Date(), TIMEZONE, "yyyy-MM-dd HH:mm:ss 'IST'");
    var rowData = [
      payload.referenceId,
      submittedAt,
      payload.category,
      payload.subject,
      payload.description,
      payload.incidentDate || "N/A",
      payload.gymLocation || "Not specified",
      payload.name || (payload.isAnonymous === "Yes" ? "Anonymous" : "Not provided"),
      payload.phone || "N/A",
      payload.email || "N/A",
      payload.isAnonymous === "Yes" || payload.isAnonymous === true ? "Yes" : "No",
      payload.status || "NEW",
      payload.internalNotes || ""
    ];

    // 6. Idempotency Check: Prevent duplicate rows on network retries
    var lastRow = sheet.getLastRow();
    var existingRow = -1;
    if (lastRow > 1) {
      var refColumnValues = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
      for (var r = 0; r < refColumnValues.length; r++) {
        if (refColumnValues[r][0] === payload.referenceId) {
          existingRow = r + 2; // 1-based index + header offset
          break;
        }
      }
    }

    if (existingRow > 0) {
      // Update existing row to maintain idempotency
      sheet.getRange(existingRow, 1, 1, HEADERS.length).setValues([rowData]);
      formatConcernRow(sheet, existingRow, payload.status);

      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        referenceId: payload.referenceId,
        rowNumber: existingRow,
        timestamp: submittedAt,
        isDuplicate: true,
        actionTaken: "updated"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 7. Append New Row
    sheet.appendRow(rowData);
    var targetRow = sheet.getLastRow();
    formatConcernRow(sheet, targetRow, payload.status);

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      referenceId: payload.referenceId,
      rowNumber: targetRow,
      timestamp: submittedAt,
      isDuplicate: false,
      actionTaken: "appended"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return createJsonResponse(false, "Internal Script Error: " + error.toString());
  } finally {
    lock.releaseLock();
  }
}

function createJsonResponse(success, message) {
  var output = {
    success: success,
    message: message,
    error: success ? undefined : message
  };
  return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);
}
