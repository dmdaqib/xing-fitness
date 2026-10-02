import { db } from '../db/store.ts';
import type {
  MemberProfile,
  Membership,
  AttendanceRecord,
  FitnessProgressEntry,
  WorkoutPlan,
  Notification
} from '../types.ts';


export const memberService = {
  getMemberByUserId(userId: string): MemberProfile | null {
    const currentDb = db.get();
    return currentDb.members.find((m) => m.userId === userId) || null;
  },

  getProfile(memberId: string): MemberProfile {
    const currentDb = db.get();
    const member = currentDb.members.find((m) => m.id === memberId);
    if (!member) throw new Error('Member profile not found.');
    return member;
  },

  updateProfile(memberId: string, data: Partial<MemberProfile>): MemberProfile {
    const currentDb = db.get();
    const index = currentDb.members.findIndex((m) => m.id === memberId);
    if (index === -1) throw new Error('Member not found.');

    const updated: MemberProfile = {
      ...currentDb.members[index],
      ...data,
      id: memberId, // Immutable
      userId: currentDb.members[index].userId, // Immutable
      updatedAt: new Date().toISOString()
    };

    currentDb.members[index] = updated;
    db.save(currentDb);
    return updated;
  },

  getMembership(memberId: string): (Membership & { daysRemaining: number }) | null {
    const currentDb = db.get();
    const membership = currentDb.memberships.find((m) => m.memberId === memberId);
    if (!membership) return null;

    // Calculate actual days remaining
    const now = new Date();
    const expiry = new Date(membership.endDate);
    const diffTime = expiry.getTime() - now.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Dynamic status determination
    let dynamicStatus = membership.status;
    if (daysRemaining <= 0) {
      dynamicStatus = 'EXPIRED';
    } else if (daysRemaining <= 15) {
      dynamicStatus = 'EXPIRING_SOON';
    } else {
      dynamicStatus = 'ACTIVE';
    }

    return {
      ...membership,
      status: dynamicStatus,
      daysRemaining
    };
  },

  requestRenewal(memberId: string, planId?: string): { success: boolean; message: string } {
    const currentDb = db.get();
    const membership = currentDb.memberships.find((m) => m.memberId === memberId);
    const member = currentDb.members.find((m) => m.id === memberId);

    if (!member) throw new Error('Member record not found.');

    const targetPlan = planId
      ? currentDb.plans.find((p) => p.id === planId)
      : currentDb.plans.find((p) => p.id === membership?.planId) || currentDb.plans[3];

    const nowIso = new Date().toISOString();

    // 1. Create Lead/Enquiry for Staff Review
    const newLead = {
      id: `lead-renew-${Date.now()}`,
      name: member.name,
      phone: member.phone,
      email: member.email,
      type: 'Membership Renewal Request',
      source: 'Membership' as const,
      message: `Member ${member.name} (${member.membershipNumber}) requested renewal for plan: ${targetPlan?.name || 'Annual'}.`,
      status: 'NEW' as const,
      createdAt: nowIso,
      updatedAt: nowIso
    };
    currentDb.leads.unshift(newLead);

    // 2. Mark membership renewalRequested = true
    if (membership) {
      membership.renewalRequested = true;
      membership.renewalEnquiryId = newLead.id;
      membership.updatedAt = nowIso;
    }

    // 3. Create Notification for Member
    currentDb.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: member.userId,
      type: 'membership',
      title: 'Renewal Request Received',
      message: `Your renewal enquiry for ${targetPlan?.name} has been received. Our concierge desk will contact you to finalize onboarding.`,
      read: false,
      link: '/member/membership',
      createdAt: nowIso
    });

    db.save(currentDb);
    return {
      success: true,
      message: 'Your renewal request has been received. Our front desk concierge will contact you to lock in promotional rates.'
    };
  },

  getAttendance(memberId: string) {
    const currentDb = db.get();
    const records = currentDb.attendance
      .filter((a) => a.memberId === memberId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Compute weekly, monthly, total
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const weeklyVisits = records.filter((r) => new Date(r.date) >= oneWeekAgo).length;
    const monthlyVisits = records.filter((r) => new Date(r.date) >= oneMonthAgo).length;

    return {
      records,
      totalVisits: records.length,
      weeklyVisits,
      monthlyVisits
    };
  },

  checkIn(memberId: string): AttendanceRecord {
    const currentDb = db.get();
    const member = currentDb.members.find((m) => m.id === memberId);
    if (!member) throw new Error('Member not found.');

    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // Check if already checked in today
    const existing = currentDb.attendance.find((a) => a.memberId === memberId && a.date === today);
    if (existing) {
      if (!existing.checkOutTime) {
        existing.checkOutTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        existing.status = 'COMPLETED';
        db.save(currentDb);
        return existing;
      }
      throw new Error('You have already logged your training session for today.');
    }

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      memberId,
      date: today,
      checkInTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'PRESENT',
      createdAt: now.toISOString()
    };

    currentDb.attendance.unshift(newRecord);
    db.save(currentDb);
    return newRecord;
  },

  getProgress(memberId: string): FitnessProgressEntry[] {
    const currentDb = db.get();
    return currentDb.progress
      .filter((p) => p.memberId === memberId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },

  addProgress(memberId: string, input: {
    weightKg: number;
    heightCm: number;
    fitnessGoal: string;
    bodyFatPercentage?: number;
    notes?: string;
  }): FitnessProgressEntry {
    if (input.weightKg < 30 || input.weightKg > 250) {
      throw new Error('Please enter a realistic weight between 30 and 250 kg.');
    }
    if (input.heightCm < 100 || input.heightCm > 240) {
      throw new Error('Please enter a valid height between 100 and 240 cm.');
    }

    const heightM = input.heightCm / 100;
    const bmi = parseFloat((input.weightKg / (heightM * heightM)).toFixed(1));

    const currentDb = db.get();
    const newEntry: FitnessProgressEntry = {
      id: `prg-${Date.now()}`,
      memberId,
      date: new Date().toISOString().split('T')[0],
      weightKg: input.weightKg,
      heightCm: input.heightCm,
      bmi,
      fitnessGoal: input.fitnessGoal,
      bodyFatPercentage: input.bodyFatPercentage,
      notes: input.notes?.trim() || undefined,
      createdAt: new Date().toISOString()
    };

    currentDb.progress.push(newEntry);
    db.save(currentDb);
    return newEntry;
  },

  getWorkoutPlan(memberId: string): WorkoutPlan | null {
    const currentDb = db.get();
    return currentDb.workouts.find((w) => w.memberId === memberId && w.active) || null;
  },

  getBookings(memberId: string) {
    const currentDb = db.get();
    const classBookings = currentDb.classBookings
      .filter((b) => b.memberId === memberId)
      .sort((a, b) => new Date(b.classDate).getTime() - new Date(a.classDate).getTime());

    const trainerBookings = currentDb.trainerBookings
      .filter((b) => b.memberId === memberId)
      .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());

    return {
      classBookings,
      trainerBookings,
      totalUpcoming:
        classBookings.filter((c) => c.status === 'CONFIRMED' || c.status === 'REQUESTED').length +
        trainerBookings.filter((t) => t.status === 'CONFIRMED' || t.status === 'REQUESTED').length
    };
  },

  getNotifications(userId: string): { notifications: Notification[]; unreadCount: number } {
    const currentDb = db.get();
    const user = currentDb.users.find((u) => u.id === userId);
    const isStaffOrAdmin = user && (user.role === 'STAFF' || user.role === 'ADMIN');
    const list = currentDb.notifications
      .filter((n) => n.userId === userId || n.userId === 'ALL' || (isStaffOrAdmin && (n.userId === 'STAFF' || n.userId === 'ADMIN')))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const unreadCount = list.filter((n) => !n.read).length;
    return { notifications: list, unreadCount };
  },

  markNotificationRead(userId: string, notificationId: string): boolean {
    const currentDb = db.get();
    const user = currentDb.users.find((u) => u.id === userId);
    const isStaffOrAdmin = user && (user.role === 'STAFF' || user.role === 'ADMIN');
    const notif = currentDb.notifications.find(
      (n) => n.id === notificationId && (n.userId === userId || n.userId === 'ALL' || (isStaffOrAdmin && (n.userId === 'STAFF' || n.userId === 'ADMIN')))
    );
    if (notif) {
      notif.read = true;
      db.save(currentDb);
      return true;
    }
    return false;
  },

  markAllNotificationsRead(userId: string): void {
    const currentDb = db.get();
    const user = currentDb.users.find((u) => u.id === userId);
    const isStaffOrAdmin = user && (user.role === 'STAFF' || user.role === 'ADMIN');
    currentDb.notifications.forEach((n) => {
      if (n.userId === userId || n.userId === 'ALL' || (isStaffOrAdmin && (n.userId === 'STAFF' || n.userId === 'ADMIN'))) {
        n.read = true;
      }
    });
    db.save(currentDb);
  }
};
