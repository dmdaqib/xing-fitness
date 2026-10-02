import type { IncomingMessage, ServerResponse } from 'http';
import { authService } from './services/authService.ts';
import { memberService } from './services/memberService.ts';
import { bookingService } from './services/bookingService.ts';
import { adminService } from './services/adminService.ts';
import { verifySessionToken } from './auth/crypto.ts';
import { db } from './db/store.ts';
import type { UserRole, LeadSource } from './types.ts';


// Helper to read incoming JSON body
function readJsonBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 2 * 1024 * 1024) {
        // 2MB limit
        reject(new Error('Payload too large.'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON payload.'));
      }
    });
    req.on('error', (err) => reject(err));
  });
}

// Helper to send json
function sendJson(res: ServerResponse, statusCode: number, data: any) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

// Helper to send error
function sendError(res: ServerResponse, statusCode: number, message: string) {
  sendJson(res, statusCode, { success: false, error: message });
}

export async function handleApiRequest(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const urlObj = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = urlObj.pathname;
  const method = req.method || 'GET';

  if (!pathname.startsWith('/api')) {
    return false; // Not handled by this router
  }

  // Extract auth token
  const authHeader = req.headers.authorization;
  let authUser: { userId: string; role: UserRole; email: string } | null = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    const verified = verifySessionToken(token);
    if (verified) {
      authUser = verified as { userId: string; role: UserRole; email: string };
    }
  }

  // Auth Guards
  const requireAuth = () => {
    if (!authUser) {
      throw { status: 401, message: 'Authentication required. Please sign in.' };
    }
    return authUser;
  };

  const requireRole = (allowedRoles: UserRole[]) => {
    const user = requireAuth();
    if (!allowedRoles.includes(user.role)) {
      throw { status: 403, message: 'Access denied: insufficient permissions.' };
    }
    return user;
  };

  const getMemberIdForUser = (userId: string): string => {
    const mem = memberService.getMemberByUserId(userId);
    if (!mem) {
      throw { status: 404, message: 'Member profile not found for this user.' };
    }
    return mem.id;
  };

  try {
    // ========================================================
    // PUBLIC ROUTES
    // ========================================================

    // Public active membership plans
    if (pathname === '/api/public/plans' && method === 'GET') {
      const plans = db.get().plans.filter((p: any) => p.active);
      sendJson(res, 200, { success: true, data: plans });
      return true;
    }

    // Public active promotional offers
    if (pathname === '/api/public/offers' && method === 'GET') {
      const today = new Date().toISOString().split('T')[0];
      const offers = db.get().offers.filter((o: any) => o.active && o.endDate >= today);
      sendJson(res, 200, { success: true, data: offers });
      return true;
    }


    // Public lead / free trial / enquiry capture
    if (pathname === '/api/public/leads' && method === 'POST') {
      const body = await readJsonBody(req);
      const { name, phone, email, type, source, preferredDate, preferredTime, fitnessGoal, message } = body;

      if (!name || !phone) {
        sendError(res, 400, 'Name and phone number are required.');
        return true;
      }

      const currentDb = db.get();
      const nowIso = new Date().toISOString();
      const newLead = {
        id: `lead-pub-${Date.now()}`,
        name: String(name).trim(),
        phone: String(phone).trim(),
        email: email ? String(email).trim().toLowerCase() : undefined,
        type: String(type || 'General Website Enquiry'),
        source: (source as LeadSource) || 'Website',
        preferredDate: preferredDate || undefined,
        preferredTime: preferredTime || undefined,
        fitnessGoal: fitnessGoal || undefined,
        message: message || undefined,
        status: 'NEW' as const,
        createdAt: nowIso,
        updatedAt: nowIso
      };

      currentDb.leads.unshift(newLead);

      // Create in-app notification for Staff / Admin
      if (!currentDb.notifications) {
        currentDb.notifications = [];
      }
      currentDb.notifications.unshift({
        id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        userId: 'STAFF',
        type: 'lead',
        title: `New ${newLead.source || 'Website'} Enquiry: ${newLead.name}`,
        message: `${newLead.name} (${newLead.phone}) enquired for "${newLead.type}". Preferred: ${newLead.preferredDate || 'Flexible'} ${newLead.preferredTime || ''}. Goal: ${newLead.fitnessGoal || 'Strength & Fitness'}.`,
        read: false,
        link: newLead.source === 'Free Trial' ? '/admin/trials' : '/admin/leads',
        createdAt: nowIso
      });

      db.save(currentDb);

      sendJson(res, 201, {
        success: true,
        data: newLead,
        message: 'Your free trial request has been received. Our team will contact you to confirm the appointment.'
      });
      return true;
    }

    // ========================================================
    // AUTHENTICATION ROUTES
    // ========================================================

    if (pathname === '/api/auth/register' && method === 'POST') {
      const body = await readJsonBody(req);
      const session = await authService.register(body);
      sendJson(res, 201, { success: true, data: session });
      return true;
    }

    if (pathname === '/api/auth/login' && method === 'POST') {
      const body = await readJsonBody(req);
      const session = await authService.login(body);
      sendJson(res, 200, { success: true, data: session });
      return true;
    }

    if (pathname === '/api/auth/forgot-password' && method === 'POST') {
      const body = await readJsonBody(req);
      const result = await authService.forgotPassword(body.email || '');
      sendJson(res, 200, { success: true, data: result });
      return true;
    }

    if (pathname === '/api/auth/reset-password' && method === 'POST') {
      const body = await readJsonBody(req);
      const result = await authService.resetPassword(body.token, body.newPassword);
      sendJson(res, 200, { success: true, data: result });
      return true;
    }

    if (pathname === '/api/auth/me' && method === 'GET') {
      const user = requireAuth();
      const me = await authService.getMe(user.userId);
      sendJson(res, 200, { success: true, data: me });
      return true;
    }

    // ========================================================
    // MEMBER PLATFORM ROUTES
    // ========================================================

    if (pathname === '/api/member/profile' && method === 'GET') {
      const user = requireRole(['MEMBER', 'STAFF', 'ADMIN']);
      const memberId = getMemberIdForUser(user.userId);
      const profile = memberService.getProfile(memberId);
      sendJson(res, 200, { success: true, data: profile });
      return true;
    }

    if (pathname === '/api/member/profile' && method === 'PUT') {
      const user = requireRole(['MEMBER', 'STAFF', 'ADMIN']);
      const memberId = getMemberIdForUser(user.userId);
      const body = await readJsonBody(req);
      const updated = memberService.updateProfile(memberId, body);
      sendJson(res, 200, { success: true, data: updated });
      return true;
    }

    if (pathname === '/api/member/membership' && method === 'GET') {
      const user = requireRole(['MEMBER', 'STAFF', 'ADMIN']);
      const memberId = getMemberIdForUser(user.userId);
      const membership = memberService.getMembership(memberId);
      sendJson(res, 200, { success: true, data: membership });
      return true;
    }

    if (pathname === '/api/member/membership/renew' && method === 'POST') {
      const user = requireRole(['MEMBER', 'STAFF', 'ADMIN']);
      const memberId = getMemberIdForUser(user.userId);
      const body = await readJsonBody(req);
      const result = memberService.requestRenewal(memberId, body.planId);
      sendJson(res, 200, { success: true, data: result });
      return true;
    }

    if (pathname === '/api/member/attendance' && method === 'GET') {
      const user = requireRole(['MEMBER', 'STAFF', 'ADMIN']);
      const memberId = getMemberIdForUser(user.userId);
      const attendance = memberService.getAttendance(memberId);
      sendJson(res, 200, { success: true, data: attendance });
      return true;
    }

    if (pathname === '/api/member/attendance/check-in' && method === 'POST') {
      const user = requireRole(['MEMBER', 'STAFF', 'ADMIN']);
      const memberId = getMemberIdForUser(user.userId);
      const record = memberService.checkIn(memberId);
      sendJson(res, 200, { success: true, data: record, message: 'Check-in successful.' });
      return true;
    }

    if (pathname === '/api/member/progress' && method === 'GET') {
      const user = requireRole(['MEMBER', 'STAFF', 'ADMIN']);
      const memberId = getMemberIdForUser(user.userId);
      const progress = memberService.getProgress(memberId);
      sendJson(res, 200, { success: true, data: progress });
      return true;
    }

    if (pathname === '/api/member/progress' && method === 'POST') {
      const user = requireRole(['MEMBER', 'STAFF', 'ADMIN']);
      const memberId = getMemberIdForUser(user.userId);
      const body = await readJsonBody(req);
      const entry = memberService.addProgress(memberId, body);
      sendJson(res, 201, { success: true, data: entry });
      return true;
    }

    if (pathname === '/api/member/workouts' && method === 'GET') {
      const user = requireRole(['MEMBER', 'STAFF', 'ADMIN']);
      const memberId = getMemberIdForUser(user.userId);
      const workouts = memberService.getWorkoutPlan(memberId);
      sendJson(res, 200, { success: true, data: workouts });
      return true;
    }

    if (pathname === '/api/member/bookings' && method === 'GET') {
      const user = requireRole(['MEMBER', 'STAFF', 'ADMIN']);
      const memberId = getMemberIdForUser(user.userId);
      const bookings = memberService.getBookings(memberId);
      sendJson(res, 200, { success: true, data: bookings });
      return true;
    }

    if (pathname === '/api/member/notifications' && method === 'GET') {
      const user = requireAuth();
      const notifs = memberService.getNotifications(user.userId);
      sendJson(res, 200, { success: true, data: notifs });
      return true;
    }

    if (pathname.startsWith('/api/member/notifications/') && pathname.endsWith('/read') && method === 'POST') {
      const user = requireAuth();
      const parts = pathname.split('/');
      const notifId = parts[parts.length - 2];
      const ok = memberService.markNotificationRead(user.userId, notifId);
      sendJson(res, 200, { success: ok });
      return true;
    }

    if (pathname === '/api/member/notifications/read-all' && method === 'POST') {
      const user = requireAuth();
      memberService.markAllNotificationsRead(user.userId);
      sendJson(res, 200, { success: true });
      return true;
    }

    // ========================================================
    // BOOKING OPERATIONS (MEMBER / PUBLIC AVAILABILITY)
    // ========================================================

    if (pathname === '/api/bookings/classes' && method === 'GET') {
      const classes = bookingService.getClasses();
      sendJson(res, 200, { success: true, data: classes });
      return true;
    }

    if (pathname === '/api/bookings/class' && method === 'POST') {
      const user = requireRole(['MEMBER', 'STAFF', 'ADMIN']);
      const memberId = getMemberIdForUser(user.userId);
      const body = await readJsonBody(req);
      const booking = bookingService.bookClass(memberId, body.classId, body.classDate, body.notes);
      sendJson(res, 201, { success: true, data: booking });
      return true;
    }

    if (pathname.startsWith('/api/bookings/class/') && pathname.endsWith('/cancel') && method === 'POST') {
      const user = requireRole(['MEMBER', 'STAFF', 'ADMIN']);
      const memberId = getMemberIdForUser(user.userId);
      const parts = pathname.split('/');
      const bookingId = parts[parts.length - 2];
      const cancelled = bookingService.cancelClassBooking(memberId, bookingId);
      sendJson(res, 200, { success: true, data: cancelled });
      return true;
    }

    if (pathname === '/api/bookings/trainers' && method === 'GET') {
      const trainers = bookingService.getTrainers();
      sendJson(res, 200, { success: true, data: trainers });
      return true;
    }

    if (pathname === '/api/bookings/trainer' && method === 'POST') {
      const user = requireRole(['MEMBER', 'STAFF', 'ADMIN']);
      const memberId = getMemberIdForUser(user.userId);
      const body = await readJsonBody(req);
      const booking = bookingService.bookTrainer(
        memberId,
        body.trainerId,
        body.bookingDate,
        body.timeSlot,
        body.notes
      );
      sendJson(res, 201, { success: true, data: booking });
      return true;
    }

    if (pathname.startsWith('/api/bookings/trainer/') && pathname.endsWith('/cancel') && method === 'POST') {
      const user = requireRole(['MEMBER', 'STAFF', 'ADMIN']);
      const memberId = getMemberIdForUser(user.userId);
      const parts = pathname.split('/');
      const bookingId = parts[parts.length - 2];
      const cancelled = bookingService.cancelTrainerBooking(memberId, bookingId);
      sendJson(res, 200, { success: true, data: cancelled });
      return true;
    }

    // ========================================================
    // ADMIN & STAFF OPERATIONS
    // ========================================================

    // Dashboard Overview
    if (pathname === '/api/admin/dashboard' && method === 'GET') {
      requireRole(['STAFF', 'ADMIN']);
      const stats = adminService.getDashboardStats();
      sendJson(res, 200, { success: true, data: stats });
      return true;
    }

    // Member Management
    if (pathname === '/api/admin/members' && method === 'GET') {
      requireRole(['STAFF', 'ADMIN']);
      const search = urlObj.searchParams.get('search') || undefined;
      const status = (urlObj.searchParams.get('status') as any) || undefined;
      const members = adminService.getMembers({ search, status });
      sendJson(res, 200, { success: true, data: members });
      return true;
    }

    if (pathname === '/api/admin/members' && method === 'POST') {
      requireRole(['ADMIN']);
      const body = await readJsonBody(req);
      const result = adminService.createMember(body);
      sendJson(res, 201, { success: true, data: result });
      return true;
    }

    if (pathname.startsWith('/api/admin/members/') && method === 'GET') {
      requireRole(['STAFF', 'ADMIN']);
      const memberId = pathname.replace('/api/admin/members/', '');
      const detail = adminService.getMemberDetail(memberId);
      sendJson(res, 200, { success: true, data: detail });
      return true;
    }

    if (pathname.startsWith('/api/admin/members/') && method === 'PUT') {
      requireRole(['STAFF', 'ADMIN']);
      const memberId = pathname.replace('/api/admin/members/', '');
      const body = await readJsonBody(req);
      const updated = adminService.updateMember(memberId, body);
      sendJson(res, 200, { success: true, data: updated });
      return true;
    }

    if (pathname.startsWith('/api/admin/members/') && pathname.endsWith('/status') && method === 'PATCH') {
      requireRole(['ADMIN']);
      const parts = pathname.split('/');
      const memberId = parts[parts.length - 2];
      const body = await readJsonBody(req);
      const updated = adminService.toggleMemberStatus(memberId, body.active);
      sendJson(res, 200, { success: true, data: updated });
      return true;
    }

    // Leads & Follow-up
    if (pathname === '/api/admin/leads' && method === 'GET') {
      requireRole(['STAFF', 'ADMIN']);
      const status = (urlObj.searchParams.get('status') as any) || undefined;
      const source = urlObj.searchParams.get('source') || undefined;
      const leads = adminService.getLeads({ status, source });
      sendJson(res, 200, { success: true, data: leads });
      return true;
    }

    if (pathname.startsWith('/api/admin/leads/') && method === 'PATCH') {
      requireRole(['STAFF', 'ADMIN']);
      const leadId = pathname.replace('/api/admin/leads/', '');
      const body = await readJsonBody(req);
      const updated = adminService.updateLeadStatus(leadId, body.status, body.notes);
      sendJson(res, 200, { success: true, data: updated });
      return true;
    }

    // Free Trials
    if (pathname === '/api/admin/trials' && method === 'GET') {
      requireRole(['STAFF', 'ADMIN']);
      const trials = adminService.getFreeTrials();
      sendJson(res, 200, { success: true, data: trials });
      return true;
    }

    // Bookings Admin
    if (pathname === '/api/admin/bookings' && method === 'GET') {
      requireRole(['STAFF', 'ADMIN']);
      const bookings = adminService.getAllBookings();
      sendJson(res, 200, { success: true, data: bookings });
      return true;
    }

    if (pathname.startsWith('/api/admin/bookings/class/') && method === 'PATCH') {
      requireRole(['STAFF', 'ADMIN']);
      const bookingId = pathname.replace('/api/admin/bookings/class/', '');
      const body = await readJsonBody(req);
      const updated = adminService.updateClassBookingStatus(bookingId, body.status);
      sendJson(res, 200, { success: true, data: updated });
      return true;
    }

    if (pathname.startsWith('/api/admin/bookings/trainer/') && method === 'PATCH') {
      requireRole(['STAFF', 'ADMIN']);
      const bookingId = pathname.replace('/api/admin/bookings/trainer/', '');
      const body = await readJsonBody(req);
      const updated = adminService.updateTrainerBookingStatus(bookingId, body.status);
      sendJson(res, 200, { success: true, data: updated });
      return true;
    }

    // Catalog: Plans
    if (pathname === '/api/admin/plans' && method === 'GET') {
      requireRole(['STAFF', 'ADMIN']);
      sendJson(res, 200, { success: true, data: adminService.getPlans() });
      return true;
    }

    if (pathname === '/api/admin/plans' && method === 'POST') {
      requireRole(['ADMIN']);
      const body = await readJsonBody(req);
      const plan = adminService.savePlan(body);
      sendJson(res, 200, { success: true, data: plan });
      return true;
    }

    if (pathname.startsWith('/api/admin/plans/') && method === 'DELETE') {
      requireRole(['ADMIN']);
      const planId = pathname.replace('/api/admin/plans/', '');
      const resData = adminService.deletePlan(planId);
      sendJson(res, 200, { success: true, data: resData });
      return true;
    }

    // Catalog: Trainers
    if (pathname === '/api/admin/trainers' && method === 'GET') {
      requireRole(['STAFF', 'ADMIN']);
      sendJson(res, 200, { success: true, data: adminService.getTrainers() });
      return true;
    }

    if (pathname === '/api/admin/trainers' && method === 'POST') {
      requireRole(['ADMIN']);
      const body = await readJsonBody(req);
      const trainer = adminService.saveTrainer(body);
      sendJson(res, 200, { success: true, data: trainer });
      return true;
    }

    // Catalog: Classes
    if (pathname === '/api/admin/classes' && method === 'GET') {
      requireRole(['STAFF', 'ADMIN']);
      sendJson(res, 200, { success: true, data: adminService.getClasses() });
      return true;
    }

    if (pathname === '/api/admin/classes' && method === 'POST') {
      requireRole(['ADMIN']);
      const body = await readJsonBody(req);
      const cls = adminService.saveClass(body);
      sendJson(res, 200, { success: true, data: cls });
      return true;
    }

    // Catalog: Offers
    if (pathname === '/api/admin/offers' && method === 'GET') {
      requireRole(['STAFF', 'ADMIN']);
      sendJson(res, 200, { success: true, data: adminService.getOffers() });
      return true;
    }

    if (pathname === '/api/admin/offers' && method === 'POST') {
      requireRole(['ADMIN']);
      const body = await readJsonBody(req);
      const offer = adminService.saveOffer(body);
      sendJson(res, 200, { success: true, data: offer });
      return true;
    }

    // Route not found in /api
    sendError(res, 404, `API route ${method} ${pathname} not found.`);
    return true;
  } catch (err: any) {
    const status = err.status || 500;
    const message = err.message || 'An unexpected error occurred.';
    sendError(res, status, message);
    return true;
  }
}
