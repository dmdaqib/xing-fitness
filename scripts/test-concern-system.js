/**
 * XING FITNESS — Member Concern & Feedback System Automated Test Suite
 * Validates:
 * 1. Public unlisted route isolation, robots.txt Disallow, sitemap exclusion, QR URL.
 * 2. Public concern submission with contact details & anonymous mode.
 * 3. Server-side validation, length limits, honeypot spam protection, duplicate protection.
 * 4. Management RBAC, role security (Member/Public blocked, Staff/Admin allowed).
 * 5. Admin filtering, searching, status transitions, staff assignment, private notes.
 * 6. Google Sheets Integration:
 *    - Admin status endpoint & connection ping test.
 *    - Automatic real-time write to Google Sheets on submission (13 columns, IST timezone).
 *    - Resilient error handling (HTTP 502 on failure, safe local DB backup, no false success).
 *    - Admin manual retry sync action.
 * 7. Local database persistence on disk.
 */

import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 3055;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const MOCK_GAS_PORT = 3056;

let serverInstance = null;
let mockGasServer = null;
let receivedMockPayloads = [];
let mockGasShouldFail = false;
const simulatedSheetRows = new Map();

async function req(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  return { status: res.status, ok: res.ok, data };
}

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    testsPassed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    testsFailed++;
  }
}

function startMockGasServer() {
  return new Promise((resolve) => {
    mockGasServer = http.createServer((request, response) => {
      let body = '';
      request.on('data', (chunk) => {
        body += chunk;
      });
      request.on('end', () => {
        let json = {};
        try {
          json = JSON.parse(body);
        } catch {
          json = { raw: body };
        }

        if (mockGasShouldFail) {
          response.writeHead(500, { 'Content-Type': 'application/json' });
          response.end(JSON.stringify({ success: false, error: 'Simulated Google Sheets API service failure (500).' }));
          return;
        }

        receivedMockPayloads.push({
          method: request.method,
          url: request.url,
          headers: request.headers,
          body: json
        });

        if (json.action === 'ping') {
          response.writeHead(200, { 'Content-Type': 'application/json' });
          response.end(JSON.stringify({ success: true, message: 'Pong. Xing Fitness Google Sheets Webhook is active.' }));
          return;
        }

        const isDuplicate = simulatedSheetRows.has(json.referenceId);
        simulatedSheetRows.set(json.referenceId, json);

        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({
          success: true,
          message: isDuplicate ? 'Updated existing row in Member Concerns' : 'Appended row to Member Concerns',
          referenceId: json.referenceId,
          isDuplicate,
          actionTaken: isDuplicate ? 'updated' : 'appended',
          totalUniqueRows: simulatedSheetRows.size
        }));
      });
    });

    mockGasServer.listen(MOCK_GAS_PORT, '127.0.0.1', () => {
      console.log(`[Mock Google Apps Script Web App] Listening on http://127.0.0.1:${MOCK_GAS_PORT}`);
      resolve();
    });
  });
}

function stopMockGasServer() {
  if (mockGasServer) {
    return new Promise((resolve) => {
      mockGasServer.close(() => {
        console.log('[Mock Google Apps Script Web App] Closed');
        resolve();
      });
    });
  }
}

async function startServer() {
  // Dynamically import compiled server
  const serverModule = await import('../dist-server/server.js');
  serverInstance = serverModule.server;
  return new Promise((resolve) => {
    serverInstance.listen(PORT, '127.0.0.1', () => {
      console.log(`[Test Server] Running on ${BASE_URL}`);
      resolve();
    });
  });
}

async function stopServer() {
  if (serverInstance) {
    return new Promise((resolve) => {
      serverInstance.close(() => {
        console.log('[Test Server] Closed');
        resolve();
      });
    });
  }
}

async function runAllTests() {
  console.log('================================================================');
  console.log('  XING FITNESS — MEMBER CONCERN & GOOGLE SHEETS TEST SUITE      ');
  console.log('================================================================\n');

  try {
    await startMockGasServer();
    await startServer();

    // -------------------------------------------------------------
    // 1. UNLISTED ROUTE & SITEMAP / ROBOTS EXCLUSION CHECKS
    // -------------------------------------------------------------
    console.log('[1/11] Testing Unlisted Route, Sitemap & Robots.txt Isolation...');

    const robotsTxt = fs.readFileSync(path.resolve('public', 'robots.txt'), 'utf8');
    assert(robotsTxt.includes('Disallow: /concern'), 'public/robots.txt contains Disallow: /concern');

    const sitemapXml = fs.readFileSync(path.resolve('public', 'sitemap.xml'), 'utf8');
    assert(!sitemapXml.includes('/concern'), 'public/sitemap.xml strictly excludes /concern');

    // -------------------------------------------------------------
    // 2. PUBLIC CONCERN SUBMISSION (Initial baseline without Sheets URL)
    // -------------------------------------------------------------
    console.log('\n[2/11] Testing Public Concern Submission (With Contact Details)...');

    delete process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    delete process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;

    const testRunId = Date.now();

    const sub1 = await req('/api/public/concerns', {
      method: 'POST',
      body: JSON.stringify({
        category: 'Equipment or maintenance',
        subject: `Lat Pulldown cable frayed at top pulley [${testRunId}]`,
        description: `The nylon coating on the lat pulldown cable on the middle cable stack is stripping off. Needs inspection for safety. (Run ${testRunId})`,
        incidentDate: new Date().toISOString().split('T')[0],
        gymLocation: 'Plate-Loaded & Pin-Loaded Machine Zone',
        name: 'Rohan Sharma',
        phone: '+91 98765 43210',
        email: 'rohan.sharma@example.com',
        preferredContactMethod: 'WhatsApp',
        isAnonymous: false
      })
    });

    assert(sub1.status === 201 && sub1.data.success, 'Public concern submitted successfully with 201 Created');
    assert(sub1.data.data.referenceId && sub1.data.data.referenceId.startsWith('XF-CON-'), 'Generated unique reference ID format (XF-CON-YYYYMMDD-XXXX)');
    assert(sub1.data.data.status === 'NEW', 'Initial status set to NEW');
    const createdRefId = sub1.data.data.referenceId;

    // Verify submission response does NOT expose internal notes or server IP hashes
    assert(sub1.data.data.internalNotes === undefined, 'Public response does NOT leak internalNotes');
    assert(sub1.data.data.ipHash === undefined, 'Public response does NOT leak server ipHash');

    // -------------------------------------------------------------
    // 3. PUBLIC ANONYMOUS SUBMISSION
    // -------------------------------------------------------------
    console.log('\n[3/11] Testing Anonymous Concern Submission...');

    const subAnon = await req('/api/public/concerns', {
      method: 'POST',
      body: JSON.stringify({
        category: 'Cleanliness and hygiene',
        subject: `Sanitizer bottle near dumbbell rack empty [${testRunId}]`,
        description: `The hand sanitizer and disinfectant spray bottle near the 20kg-30kg dumbbell rack is empty during evening peak hours. (Run ${testRunId})`,
        gymLocation: 'Main Training Floor (Free Weights / Dumbbells)',
        isAnonymous: true,
        name: 'ShouldBeOmitted',
        phone: '1234567890',
        email: 'should@omit.com'
      })
    });

    assert(subAnon.status === 201 && subAnon.data.success, 'Anonymous concern accepted with 201 Created');
    const anonRefId = subAnon.data.data.referenceId;
    assert(anonRefId && anonRefId.startsWith('XF-CON-'), 'Anonymous concern assigned unique reference ID');

    // -------------------------------------------------------------
    // 4. SERVER-SIDE INPUT VALIDATION & SPAM HONEYPOT
    // -------------------------------------------------------------
    console.log('\n[4/11] Testing Server-Side Validation & Honeypot Protection...');

    // Invalid category
    const badCat = await req('/api/public/concerns', {
      method: 'POST',
      body: JSON.stringify({
        category: 'InvalidNonExistentCategory',
        subject: 'Valid Subject Text',
        description: 'Valid detailed description of the issue.'
      })
    });
    assert(badCat.status === 400 && !badCat.data.success, 'Rejected invalid category with 400 Bad Request');

    // Too short subject
    const shortSub = await req('/api/public/concerns', {
      method: 'POST',
      body: JSON.stringify({
        category: 'Safety concern',
        subject: 'Hi',
        description: 'Valid detailed description of the issue.'
      })
    });
    assert(shortSub.status === 400 && !shortSub.data.success, 'Rejected short subject (<3 chars) with 400 Bad Request');

    // Too short description
    const shortDesc = await req('/api/public/concerns', {
      method: 'POST',
      body: JSON.stringify({
        category: 'Suggestion',
        subject: 'Music volume',
        description: 'Too loud'
      })
    });
    assert(shortDesc.status === 400 && !shortDesc.data.success, 'Rejected short description (<10 chars) with 400 Bad Request');

    // Future incident date
    const futureDate = await req('/api/public/concerns', {
      method: 'POST',
      body: JSON.stringify({
        category: 'Other',
        subject: 'Future incident',
        description: 'This is a test description with enough length.',
        incidentDate: '2099-12-31'
      })
    });
    assert(futureDate.status === 400 && !futureDate.data.success, 'Rejected future incident date with 400 Bad Request');

    // Honeypot spam test
    const botSubmission = await req('/api/public/concerns', {
      method: 'POST',
      body: JSON.stringify({
        category: 'Suggestion',
        subject: 'Spam Subject Offer',
        description: 'Spam bot automated message promoting backlinks.',
        websiteUrl: 'http://spam-backlinks-seo.biz' // Honeypot filled
      })
    });
    assert(botSubmission.status === 400 && !botSubmission.data.success, 'Honeypot caught spam bot and rejected with 400');

    // Duplicate submission test
    const dupSubmission = await req('/api/public/concerns', {
      method: 'POST',
      body: JSON.stringify({
        category: 'Cleanliness and hygiene',
        subject: `Sanitizer bottle near dumbbell rack empty [${testRunId}]`,
        description: `The hand sanitizer and disinfectant spray bottle near the 20kg-30kg dumbbell rack is empty during evening peak hours. (Run ${testRunId})`,
        isAnonymous: true
      })
    });
    assert(dupSubmission.status === 409, 'Duplicate submission within 2 minutes rejected with 409 Conflict');

    // -------------------------------------------------------------
    // 5. RBAC & SERVER-SIDE AUTHORIZATION CHECKS
    // -------------------------------------------------------------
    console.log('\n[5/11] Testing Management RBAC & Unauthorized Access Blocking...');

    // Public/Unauthenticated call to admin concerns endpoint
    const unauthGet = await req('/api/admin/concerns');
    assert(unauthGet.status === 401, 'Public user cannot browse concerns (401 Unauthorized)');

    // Login as MEMBER
    const memberLogin = await req('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'member@xingfitness.com', password: 'Member@12345' })
    });
    const memberToken = memberLogin.data.data.token;

    // Member trying to access admin concerns
    const memberForbidden = await req('/api/admin/concerns', {
      headers: { Authorization: `Bearer ${memberToken}` }
    });
    assert(memberForbidden.status === 403, 'Member role blocked from admin concerns (403 Forbidden)');

    // Login as ADMIN
    const adminLogin = await req('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@xingfitness.com', password: 'Admin@12345' })
    });
    assert(adminLogin.ok && adminLogin.data.data.user.role === 'ADMIN', 'Admin login succeeded');
    const adminToken = adminLogin.data.data.token;

    // Login as STAFF
    const staffLogin = await req('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'staff@xingfitness.com', password: 'Staff@12345' })
    });
    assert(staffLogin.ok && staffLogin.data.data.user.role === 'STAFF', 'Staff login succeeded');
    const staffToken = staffLogin.data.data.token;

    // -------------------------------------------------------------
    // 6. MANAGEMENT DASHBOARD API OPERATIONS
    // -------------------------------------------------------------
    console.log('\n[6/11] Testing Admin Concerns Management, Filters & Notes...');

    // Fetch concerns list as Admin
    const adminList = await req('/api/admin/concerns', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(adminList.ok && Array.isArray(adminList.data.data), 'Admin successfully retrieved concerns list');
    assert(adminList.data.data.length >= 2, `Concerns list contains submissions (count: ${adminList.data.data.length})`);

    // Verify anonymous concern has no contact info stored
    const foundAnon = adminList.data.data.find((c) => c.referenceId === anonRefId);
    assert(foundAnon && foundAnon.isAnonymous === true && !foundAnon.name && !foundAnon.phone && !foundAnon.email, 'Anonymous submission safely omitted name & contact info from database');

    // Search by Reference ID
    const searchResult = await req(`/api/admin/concerns?search=${createdRefId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(searchResult.ok && searchResult.data.data.length === 1 && searchResult.data.data[0].referenceId === createdRefId, 'Search by Reference ID works accurately');

    // Filter by Category
    const catResult = await req('/api/admin/concerns?category=Equipment%20or%20maintenance', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(catResult.ok && catResult.data.data.every((c) => c.category === 'Equipment or maintenance'), 'Category filter returns only matching records');

    // Update Status: Move to IN_PROGRESS
    const targetConcern = adminList.data.data.find((c) => c.referenceId === createdRefId);
    const updateStatus1 = await req(`/api/admin/concerns/${targetConcern.id}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        status: 'IN_PROGRESS',
        resolutionDetails: 'Maintenance vendor dispatched to replace wire.'
      })
    });
    assert(updateStatus1.ok && updateStatus1.data.data.status === 'IN_PROGRESS', 'Status updated to IN_PROGRESS');

    // Assign Staff Member
    const assignRes = await req(`/api/admin/concerns/${targetConcern.id}/assign`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${staffToken}` },
      body: JSON.stringify({
        staffId: 'usr-staff-01',
        staffName: 'Coach Vikram (Floor Supervisor)'
      })
    });
    assert(assignRes.ok && assignRes.data.data.assignedStaffName === 'Coach Vikram (Floor Supervisor)', 'Staff member assigned successfully');

    // Add Private Internal Management Note
    const addNoteRes = await req(`/api/admin/concerns/${targetConcern.id}/notes`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        note: 'Replacement cable ordered from Jerai Fitness authorized spares vendor. Expected delivery tomorrow morning.'
      })
    });
    assert(addNoteRes.status === 201 && addNoteRes.data.success, 'Internal note added to concern thread');

    // Resolve Concern
    const resolveRes = await req(`/api/admin/concerns/${targetConcern.id}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        status: 'RESOLVED',
        resolutionDetails: 'New steel cable installed and load-tested with 100kg. Machine approved for floor use.'
      })
    });
    assert(resolveRes.ok && resolveRes.data.data.status === 'RESOLVED', 'Concern updated to RESOLVED');
    assert(resolveRes.data.data.resolvedAt !== undefined && resolveRes.data.data.resolvedBy === 'admin@xingfitness.com', 'Resolution timestamp and resolver recorded');

    // Verify Concern Stats
    const statsRes = await req('/api/admin/concerns/stats', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(statsRes.ok && statsRes.data.data.total >= 2 && statsRes.data.data.resolvedCount >= 1, 'Concern statistics API accurately reflects resolved counts');

    // -------------------------------------------------------------
    // 7. GOOGLE SHEETS CONFIGURATION & TEST CONNECTION API
    // -------------------------------------------------------------
    console.log('\n[7/11] Testing Google Sheets Status & Ping Verification...');

    // Before configuring: should report not configured
    const unconfigStatus = await req('/api/admin/concerns/sheets-status', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(unconfigStatus.ok && unconfigStatus.data.data.isConfigured === false, 'Sheets status initially reports isConfigured: false');

    // Configure Mock Google Apps Script Webhook
    process.env.GOOGLE_SHEETS_WEBHOOK_URL = `http://127.0.0.1:${MOCK_GAS_PORT}/exec`;
    process.env.GOOGLE_SHEETS_WEBHOOK_SECRET = 'xing_webhook_secret_test_2026';

    const configStatus = await req('/api/admin/concerns/sheets-status', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(configStatus.ok && configStatus.data.data.isConfigured === true, 'Sheets status now reports isConfigured: true');
    assert(configStatus.data.data.targetSheetName === 'Xing Fitness Member Concerns', 'Target sheet name documented as "Xing Fitness Member Concerns"');
    assert(configStatus.data.data.targetTabName === 'Member Concerns', 'Target tab name documented as "Member Concerns"');
    assert(configStatus.data.data.hasSecret === true, 'Webhook secret flag confirmed');

    // Test connection via ping
    const testPing = await req('/api/admin/concerns/sheets-test', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(testPing.ok && testPing.data.data.ok === true, 'Google Sheets connection test ping succeeded');

    // -------------------------------------------------------------
    // 8. AUTOMATIC LIVE SYNC TO GOOGLE SHEETS (13 Columns + IST)
    // -------------------------------------------------------------
    console.log('\n[8/11] Testing Automatic Submission Sync to Google Sheets (13 Columns)...');

    receivedMockPayloads = [];

    const sheetsSub = await req('/api/public/concerns', {
      method: 'POST',
      body: JSON.stringify({
        category: 'Trainer or coaching',
        subject: `Personal trainer missed scheduled session [${testRunId}]`,
        description: `Trainer did not show up for the 7:00 AM personal training slot without prior notification. (Run ${testRunId})`,
        gymLocation: 'CrossFit & Functional Training Rig',
        name: 'Priya Patel',
        phone: '+91 91234 56789',
        email: 'priya.patel@example.com',
        preferredContactMethod: 'Phone Call',
        isAnonymous: false
      })
    });

    assert(sheetsSub.status === 201 && sheetsSub.data.success, 'Concern submitted while Google Sheets is configured');
    assert(sheetsSub.data.data.googleSheetsSynced === true, 'Public confirmation indicates googleSheetsSynced: true');

    const syncedRefId = sheetsSub.data.data.referenceId;
    assert(receivedMockPayloads.length === 1, 'Google Apps Script Web App received exactly 1 webhook call');

    const receivedPayload = receivedMockPayloads[0]?.body;
    assert(receivedPayload && receivedPayload.action === 'append_concern', 'Payload action is "append_concern"');
    assert(receivedPayload.referenceId === syncedRefId, 'Payload reference ID matches submission ID');
    assert(receivedPayload.category === 'Trainer or coaching', 'Category matches submission');
    assert(receivedPayload.name === 'Priya Patel', 'Member Name column correctly populated');
    assert(receivedPayload.phone === '+91 91234 56789', 'Phone column correctly populated');
    assert(receivedPayload.email === 'priya.patel@example.com', 'Email column correctly populated');
    assert(receivedPayload.isAnonymous === 'No', 'Anonymous flag is "No"');
    assert(receivedPayload.status === 'NEW', 'Initial Status is "NEW"');
    assert(receivedPayload.submittedAt && receivedPayload.submittedAt.includes('IST'), 'Timestamp formatted in Asia/Kolkata (IST)');
    assert(receivedPayload.secret === 'xing_webhook_secret_test_2026', 'Webhook secret successfully transmitted');

    // -------------------------------------------------------------
    // 9. GOOGLE SHEETS RESILIENCE & FAILURE HANDLING (No False Success)
    // -------------------------------------------------------------
    console.log('\n[9/11] Testing Failure Resilience & Error Semantics...');

    mockGasShouldFail = true;

    const failingSub = await req('/api/public/concerns', {
      method: 'POST',
      body: JSON.stringify({
        category: 'Safety concern',
        subject: `Fire exit door in cardio deck jammed [${testRunId}]`,
        description: `The emergency exit door next to the rowing machines appears to be locked or jammed shut. Immediate check needed. (Run ${testRunId})`,
        gymLocation: 'Cardio Deck (Treadmills / Ellipticals / Cycles)',
        name: 'Karan Mehra',
        phone: '+91 99887 76655',
        isAnonymous: false
      })
    });

    assert(failingSub.status === 502, 'When Google Sheets write fails, server returns HTTP 502 Bad Gateway');
    assert(failingSub.data && !failingSub.data.success, 'Does NOT falsely report success to the submitter');
    assert(failingSub.data.error && failingSub.data.error.includes('central Google Sheets system'), 'Friendly retry message shown to user');

    // Verify submission is safely backed up in local DB with FAILED status
    const adminCheck = await req('/api/admin/concerns?category=Safety%20concern', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const failedConcern = adminCheck.data.data.find((c) => c.subject.includes('Fire exit door'));
    assert(failedConcern !== undefined, 'Submission safely preserved in local database backup despite Sheets write failure');
    assert(failedConcern.googleSheetsSyncStatus === 'FAILED', 'Status accurately marked as "FAILED" for administrative attention');
    assert(failedConcern.googleSheetsError !== undefined, 'Technical error captured for troubleshooting without losing member data');

    // -------------------------------------------------------------
    // 10. ADMIN MANUAL RETRY SYNC TO GOOGLE SHEETS
    // -------------------------------------------------------------
    console.log('\n[10/11] Testing Admin One-Click Retry Sync...');

    // Restore Mock GAS to healthy state
    mockGasShouldFail = false;
    receivedMockPayloads = [];

    const retryRes = await req(`/api/admin/concerns/${failedConcern.id}/sync-sheets`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    assert(retryRes.ok && retryRes.data.success, 'Admin retry sync returned 200 OK');
    assert(retryRes.data.data.googleSheetsSyncStatus === 'SYNCED', 'Concern sync status updated to SYNCED');
    assert(receivedMockPayloads.length === 1, 'Mock Google Sheets received the retried submission');
    assert(receivedMockPayloads[0]?.body.referenceId === failedConcern.referenceId, 'Retried reference ID correctly matched');

    // Test Idempotency on repeated sync of the same concern
    const rowCountBeforeSecondSync = simulatedSheetRows.size;
    const secondSyncRes = await req(`/api/admin/concerns/${failedConcern.id}/sync-sheets`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(secondSyncRes.ok && secondSyncRes.data.success, 'Second manual sync returned 200 OK');
    assert(simulatedSheetRows.size === rowCountBeforeSecondSync, 'Second sync did NOT create a duplicate row (Idempotency confirmed)');

    // -------------------------------------------------------------
    // 11. PERSISTENCE IN DATABASE ON DISK
    // -------------------------------------------------------------
    console.log('\n[11/11] Testing Persistent Database Storage on Disk...');
    const diskDb = JSON.parse(fs.readFileSync(path.resolve('server', 'data', 'db.json'), 'utf8'));
    assert(Array.isArray(diskDb.concerns) && diskDb.concerns.length >= 3, 'db.json contains persistent concerns array');
    const persisted = diskDb.concerns.find((c) => c.referenceId === createdRefId);
    assert(persisted && persisted.status === 'RESOLVED', 'Persisted concern reflects latest RESOLVED status on disk');
    assert(persisted && persisted.internalNotes && persisted.internalNotes.length >= 3, 'Audit notes and staff actions persistently saved');

  } catch (err) {
    console.error('Test execution error:', err);
    testsFailed++;
  } finally {
    await stopMockGasServer();
    await stopServer();
    console.log('\n================================================================');
    console.log(`  TEST RESULTS: ${testsPassed} PASSED | ${testsFailed} FAILED`);
    console.log('================================================================\n');

    process.exit(testsFailed > 0 ? 1 : 0);
  }
}

runAllTests();
