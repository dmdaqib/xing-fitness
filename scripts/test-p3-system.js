/**
 * XING FITNESS — P3 Platform Automated Verification Test Suite
 * Tests all requirements from P3 Prompt
 */

const BASE_URL = 'http://localhost:5173';

async function req(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const data = await res.json();
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

async function runTests() {
  console.log('====================================================');
  console.log('  XING FITNESS — P3 COMPREHENSIVE SYSTEM VERIFICATION');
  console.log('====================================================\n');

  // 1. PUBLIC ENDPOINTS
  console.log('[1/7] Testing Public Endpoints & Catalog Sync...');
  const publicPlans = await req('/api/public/plans');
  assert(publicPlans.ok && publicPlans.data.data.length >= 4, 'Public plans returned >= 4 plans');

  const publicOffers = await req('/api/public/offers');
  assert(publicOffers.ok && publicOffers.data.data.length >= 1, 'Public active offers returned');

  const leadSubmission = await req('/api/public/leads', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Automated Test Visitor',
      phone: '9845099999',
      type: 'Free Trial',
      source: 'Website',
      fitnessGoal: 'Cardio & Strength'
    })
  });
  assert(leadSubmission.ok && leadSubmission.data.data.name === 'Automated Test Visitor', 'Public lead capture stored in DB');

  // 2. AUTHENTICATION & SESSIONS
  console.log('\n[2/7] Testing Authentication & RBAC Access Control...');
  
  // Member Login
  const memberLogin = await req('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'member@xingfitness.com', password: 'Member@12345' })
  });
  assert(memberLogin.ok && memberLogin.data.data.user.role === 'MEMBER', 'Member login succeeds with role MEMBER');
  const memberToken = memberLogin.data.data.token;

  // Staff Login
  const staffLogin = await req('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'staff@xingfitness.com', password: 'Staff@12345' })
  });
  assert(staffLogin.ok && staffLogin.data.data.user.role === 'STAFF', 'Staff login succeeds with role STAFF');
  const staffToken = staffLogin.data.data.token;

  // Admin Login
  const adminLogin = await req('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'admin@xingfitness.com', password: 'Admin@12345' })
  });
  assert(adminLogin.ok && adminLogin.data.data.user.role === 'ADMIN', 'Admin login succeeds with role ADMIN');
  const adminToken = adminLogin.data.data.token;

  // Invalid login check
  const badLogin = await req('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'member@xingfitness.com', password: 'WrongPassword' })
  });
  assert(!badLogin.ok && badLogin.status >= 400, 'Invalid credentials rejected with status 4xx/5xx');

  // Forgot password
  const forgot = await req('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email: 'member@xingfitness.com' })
  });
  assert(forgot.ok && forgot.data.data.devResetToken, 'Forgot password dispatches secure reset token');

  // Registration of new member
  const newEmail = `member_test_${Date.now()}@example.com`;
  const registerNew = await req('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Sneha Patel',
      phone: '9888877777',
      email: newEmail,
      password: 'StrongPassword@123',
      fitnessGoal: 'Hypertrophy & Posture'
    })
  });
  assert(registerNew.ok && registerNew.data.data.user.role === 'MEMBER', 'New member registration establishes account and logs in');

  // 3. SECURITY & PRIVILEGE ENFORCEMENT
  console.log('\n[3/7] Testing Security Boundaries & Ownership Checks...');
  
  // MEMBER CANNOT access Admin Dashboard
  const memberAdminAttempt = await req('/api/admin/dashboard', {
    headers: { Authorization: `Bearer ${memberToken}` }
  });
  assert(memberAdminAttempt.status === 403, 'Member is strictly FORBIDDEN (403) from accessing Admin Dashboard');

  // MEMBER CANNOT access Admin Member List
  const memberMembersAttempt = await req('/api/admin/members', {
    headers: { Authorization: `Bearer ${memberToken}` }
  });
  assert(memberMembersAttempt.status === 403, 'Member is strictly FORBIDDEN (403) from accessing Admin Members List');

  // STAFF CAN access leads but CANNOT create membership plans
  const staffPlanCreate = await req('/api/admin/plans', {
    method: 'POST',
    headers: { Authorization: `Bearer ${staffToken}` },
    body: JSON.stringify({ name: 'Unauthorized Staff Plan', durationMonths: 1, basePrice: 1000 })
  });
  assert(staffPlanCreate.status === 403, 'Staff user is FORBIDDEN (403) from creating membership plans');

  // 4. MEMBER PLATFORM FEATURES
  console.log('\n[4/7] Testing Member Platform Features...');

  // Get Profile
  const profile = await req('/api/member/profile', {
    headers: { Authorization: `Bearer ${memberToken}` }
  });
  assert(profile.ok && profile.data.data.name === 'Arjun Verma', 'Member retrieves own personal profile');

  // Get Membership & Days Remaining
  const membership = await req('/api/member/membership', {
    headers: { Authorization: `Bearer ${memberToken}` }
  });
  assert(membership.ok && typeof membership.data.data.daysRemaining === 'number', 'Member retrieves membership with computed days remaining');

  // Request Renewal (creates structured enquiry, does not claim fake online payment)
  const renewReq = await req('/api/member/membership/renew', {
    method: 'POST',
    headers: { Authorization: `Bearer ${memberToken}` },
    body: JSON.stringify({ planId: 'plan-annual' })
  });
  assert(renewReq.ok && renewReq.data.data.success, 'Member submits renewal request to desk concierge');

  // Attendance Check-in
  const checkIn = await req('/api/member/attendance/check-in', {
    method: 'POST',
    headers: { Authorization: `Bearer ${memberToken}` }
  });
  assert(checkIn.ok || checkIn.data.error.includes('already logged'), 'Attendance check-in succeeds or notes daily logging');

  const attendance = await req('/api/member/attendance', {
    headers: { Authorization: `Bearer ${memberToken}` }
  });
  assert(attendance.ok && attendance.data.data.records.length >= 1, 'Member retrieves verified attendance history (Weekly/Monthly/Total)');

  // Fitness Progress Logging & Calculation
  const addProgress = await req('/api/member/progress', {
    method: 'POST',
    headers: { Authorization: `Bearer ${memberToken}` },
    body: JSON.stringify({
      weightKg: 78.5,
      heightCm: 178,
      fitnessGoal: 'Hypertrophy & Strength',
      notes: 'Automated test weigh-in'
    })
  });
  if (!addProgress.ok || !addProgress.data?.data?.bmi) {
    console.log('DEBUG addProgress:', JSON.stringify(addProgress));
  }
  assert(addProgress.ok && Math.abs(addProgress.data.data.bmi - 24.8) < 0.1, 'Progress check-in calculates accurate BMI (78.5kg / 1.78m^2 = 24.8)');

  const progressList = await req('/api/member/progress', {
    headers: { Authorization: `Bearer ${memberToken}` }
  });
  assert(progressList.ok && progressList.data.data.length >= 2, 'Member retrieves progress history for trend visualization');

  // Assigned Workout Plan
  const workouts = await req('/api/member/workouts', {
    headers: { Authorization: `Bearer ${memberToken}` }
  });
  assert(workouts.ok && workouts.data.data.days.length >= 1, 'Member retrieves assigned trainer-prescribed workout split');

  // 5. BOOKINGS: CLASSES & TRAINERS
  console.log('\n[5/7] Testing Studio Class & Trainer Bookings...');

  const classes = await req('/api/bookings/classes');
  assert(classes.ok && classes.data.data.length >= 1, 'Class schedule lists active studio classes');
  const targetClass = classes.data.data[0];

  // Pick a dynamic future date with large offset to avoid collision with previous test runs
  const futureDays = 100 + Math.floor(Math.random() * 500);
  const testDate = new Date(Date.now() + futureDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const bookClass = await req('/api/bookings/class', {
    method: 'POST',
    headers: { Authorization: `Bearer ${memberToken}` },
    body: JSON.stringify({
      classId: targetClass.id,
      classDate: testDate
    })
  });
  assert(bookClass.ok && bookClass.data.data.status === 'CONFIRMED', 'Class reservation confirmed with capacity check');

  // Duplicate class booking prevention
  const dupClass = await req('/api/bookings/class', {
    method: 'POST',
    headers: { Authorization: `Bearer ${memberToken}` },
    body: JSON.stringify({
      classId: targetClass.id,
      classDate: testDate
    })
  });
  assert(!dupClass.ok && dupClass.status >= 400, 'Duplicate booking on same date correctly prevented');

  // Trainer Booking with configured availability
  const trainers = await req('/api/bookings/trainers');
  assert(trainers.ok && trainers.data.data.length >= 1, 'Trainer roster lists active coaches');
  const targetTrainer = trainers.data.data[0];

  // Pick a future Monday and a slot directly from trainer's configured Monday availability
  const nextMonday = new Date();
  const dayOffset = ((1 + 7 - nextMonday.getDay()) % 7 || 7) + (Math.floor(Math.random() * 500) + 100) * 7;
  nextMonday.setDate(nextMonday.getDate() + dayOffset);
  const year = nextMonday.getFullYear();
  const month = String(nextMonday.getMonth() + 1).padStart(2, '0');
  const day = String(nextMonday.getDate()).padStart(2, '0');
  const mondayStr = `${year}-${month}-${day}`;
  const mondayAvail = targetTrainer.availability.find(a => a.dayOfWeek === 'Mon') || targetTrainer.availability[0];
  const chosenSlot = mondayAvail.timeSlots[Math.floor(Math.random() * mondayAvail.timeSlots.length)];

  const bookTrainer = await req('/api/bookings/trainer', {
    method: 'POST',
    headers: { Authorization: `Bearer ${memberToken}` },
    body: JSON.stringify({
      trainerId: targetTrainer.id,
      bookingDate: mondayStr,
      timeSlot: chosenSlot,
      notes: 'Initial squat screening'
    })
  });
  if (!bookTrainer.ok || bookTrainer.data?.data?.status !== 'REQUESTED') {
    console.log('DEBUG bookTrainer:', JSON.stringify(bookTrainer));
  }
  assert(bookTrainer.ok && bookTrainer.data.data.status === 'REQUESTED', 'Trainer 1-on-1 session submitted in REQUESTED state');

  // Notifications received
  const notifs = await req('/api/member/notifications', {
    headers: { Authorization: `Bearer ${memberToken}` }
  });
  assert(notifs.ok && notifs.data.data.notifications.length >= 1, 'System dispatched real notifications for bookings and renewal');

  // 6. ADMIN SYSTEM MANAGEMENT
  console.log('\n[6/7] Testing Admin Operations & Real Statistics...');

  const adminDash = await req('/api/admin/dashboard', {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert(adminDash.ok && adminDash.data.data.totalMembers >= 2, 'Admin dashboard returns real database analytics');

  // Admin Member Search & Filter
  const memberSearch = await req('/api/admin/members?search=Arjun', {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert(memberSearch.ok && memberSearch.data.data.length >= 1, 'Admin can search members by keyword');

  // Admin Update Lead Status
  const adminLeads = await req('/api/admin/leads', {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert(adminLeads.ok && adminLeads.data.data.length >= 1, 'Admin retrieves leads pipeline');
  const targetLead = adminLeads.data.data[0];

  const nextStatus = targetLead.status === 'NEW' ? 'CONTACTED' : targetLead.status === 'CONTACTED' ? 'TRIAL BOOKED' : 'CONTACTED';
  const updateLead = await req(`/api/admin/leads/${targetLead.id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({ status: nextStatus, notes: 'Automated test follow up' })
  });
  assert(updateLead.ok && updateLead.data.data.status === nextStatus, 'Staff/Admin updates lead status and follow-up notes');

  // Admin Free Trials Management
  const trials = await req('/api/admin/trials', {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert(trials.ok, 'Admin retrieves Free Trial requests queue');

  // Admin Plan Management (Create / Update)
  const newPlan = await req('/api/admin/plans', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({
      name: 'Corporate Executive 12M',
      tier: 'annual',
      durationMonths: 12,
      priceDisplay: 'Custom Corporate',
      basePrice: 24000,
      benefits: ['All annual benefits', 'Reserved executive locker'],
      active: true
    })
  });
  assert(newPlan.ok && newPlan.data.data.name === 'Corporate Executive 12M', 'Admin creates new dynamic membership plan');

  // Admin Offers Management
  const newOffer = await req('/api/admin/offers', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({
      title: 'Monsoon Kickstart Promo',
      badge: 'Limited Pass',
      discount: '25% OFF',
      description: 'Exclusive seasonal rate',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-31',
      eligibility: 'All new signups',
      active: true
    })
  });
  assert(newOffer.ok && newOffer.data.data.title === 'Monsoon Kickstart Promo', 'Admin creates and controls dynamic promotional offers');

  // 7. PRESERVE P1/P2 PUBLIC WEBSITE
  console.log('\n[7/7] Verifying P1/P2 Public Routes Intactness...');
  const publicPages = [
    '/',
    '/about',
    '/programs',
    '/trainers',
    '/membership',
    '/classes',
    '/transformations',
    '/facilities',
    '/gallery',
    '/fitness-tools',
    '/faq',
    '/contact',
    '/book-free-trial'
  ];

  let pagesOk = true;
  for (const page of publicPages) {
    const res = await fetch(`${BASE_URL}${page}`);
    if (res.status !== 200) {
      pagesOk = false;
      console.error(`Page ${page} failed with status ${res.status}`);
    }
  }
  assert(pagesOk, 'All 13 public P1/P2 routes load with HTTP 200 OK');

  console.log('\n====================================================');
  console.log(`  TEST RESULTS: ${testsPassed} PASSED, ${testsFailed} FAILED`);
  console.log('====================================================\n');

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
