import { db } from '../db/store.ts';
import { hashPassword } from '../auth/crypto.ts';
import type {
  MemberProfile,
  MembershipPlan,
  TrainerEntity,
  ClassEntity,
  LeadStatus,
  Offer,
  User,
  Membership
} from '../types.ts';



export const adminService = {
  /**
   * Real database analytics (No fabricated stats)
   */
  getDashboardStats() {
    const currentDb = db.get();
    const now = new Date();

    const totalMembers = currentDb.members.length;
    const activeMembers = currentDb.members.filter((m) => m.active).length;

    let activeMemberships = 0;
    let expiringMemberships = 0;
    let expiredMemberships = 0;

    currentDb.memberships.forEach((m) => {
      const expiry = new Date(m.endDate);
      const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays <= 0) {
        expiredMemberships++;
      } else if (diffDays <= 15) {
        expiringMemberships++;
      } else {
        activeMemberships++;
      }
    });

    const newLeads = currentDb.leads.filter((l) => l.status === 'NEW').length;
    const freeTrialRequests = currentDb.leads.filter(
      (l) => l.source === 'Free Trial' || l.type.toLowerCase().includes('trial')
    ).length;

    const upcomingClassBookings = currentDb.classBookings.filter(
      (b) => b.status === 'CONFIRMED' || b.status === 'REQUESTED'
    ).length;

    const pendingTrainerRequests = currentDb.trainerBookings.filter(
      (b) => b.status === 'REQUESTED'
    ).length;

    return {
      totalMembers,
      activeMembers,
      activeMemberships,
      expiringMemberships,
      expiredMemberships,
      newLeads,
      freeTrialRequests,
      upcomingClassBookings,
      pendingTrainerRequests,
      totalTrainers: currentDb.trainers.length,
      totalClasses: currentDb.classes.length,
      activeOffers: currentDb.offers.filter((o) => o.active).length
    };
  },

  // ===================== MEMBER MANAGEMENT =====================

  getMembers(filter?: { search?: string; status?: 'active' | 'inactive' | 'all' }) {
    const currentDb = db.get();
    let result = currentDb.members.map((member) => {
      const membership = currentDb.memberships.find((m) => m.memberId === member.id);
      return {
        ...member,
        membershipPlan: membership?.planName || 'No Active Plan',
        membershipStatus: membership?.status || 'PENDING',
        membershipEndDate: membership?.endDate || null
      };
    });

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.phone.includes(q) ||
          m.membershipNumber.toLowerCase().includes(q)
      );
    }

    if (filter?.status && filter.status !== 'all') {
      const isActive = filter.status === 'active';
      result = result.filter((m) => m.active === isActive);
    }

    return result;
  },

  getMemberDetail(memberId: string) {
    const currentDb = db.get();
    const member = currentDb.members.find((m) => m.id === memberId);
    if (!member) throw new Error('Member not found.');

    const membership = currentDb.memberships.find((m) => m.memberId === memberId) || null;
    const attendance = currentDb.attendance
      .filter((a) => a.memberId === memberId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const progress = currentDb.progress
      .filter((p) => p.memberId === memberId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const classBookings = currentDb.classBookings
      .filter((b) => b.memberId === memberId)
      .sort((a, b) => new Date(b.classDate).getTime() - new Date(a.classDate).getTime());
    const trainerBookings = currentDb.trainerBookings
      .filter((b) => b.memberId === memberId)
      .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());
    const workoutPlan = currentDb.workouts.find((w) => w.memberId === memberId && w.active) || null;

    return {
      member,
      membership,
      attendance,
      progress,
      classBookings,
      trainerBookings,
      workoutPlan
    };
  },

  createMember(data: {
    name: string;
    email: string;
    phone: string;
    planId: string;
    dateOfBirth?: string;
    gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
    fitnessGoal?: string;
    emergencyContact?: string;
    address?: string;
  }) {
    const currentDb = db.get();

    const existingUser = currentDb.users.find((u) => u.email.toLowerCase() === data.email.toLowerCase().trim());
    if (existingUser) {
      throw new Error('An account with this email address already exists.');
    }

    const nowIso = new Date().toISOString();
    // Default temporary member password
    const defaultPassword = 'XingMember@2026';
    const { hash, salt } = hashPassword(defaultPassword);

    const newUser: User = {
      id: `usr-mem-${Date.now()}`,
      email: data.email.toLowerCase().trim(),
      passwordHash: hash,
      salt,
      role: 'MEMBER',
      createdAt: nowIso,
      updatedAt: nowIso
    };

    const newMemberId = `mem-${Date.now().toString().slice(-5)}`;
    const membershipNumber = `XING-${Math.floor(1000 + Math.random() * 9000)}`;

    const newMember: MemberProfile = {
      id: newMemberId,
      userId: newUser.id,
      membershipNumber,
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email.toLowerCase().trim(),
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      fitnessGoal: data.fitnessGoal,
      emergencyContact: data.emergencyContact,
      address: data.address,
      active: true,
      createdAt: nowIso,
      updatedAt: nowIso
    };

    // Find plan
    const plan = currentDb.plans.find((p) => p.id === data.planId) || currentDb.plans[0];
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + plan.durationMonths);

    const newMembership: Membership = {
      id: `ms-${Date.now()}`,
      memberId: newMember.id,
      planId: plan.id,
      planName: plan.name,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      status: 'ACTIVE',
      amount: plan.basePrice,
      paymentStatus: 'PAID_OFFLINE_VERIFIED',
      renewalRequested: false,
      createdAt: nowIso,
      updatedAt: nowIso
    };

    currentDb.users.push(newUser);
    currentDb.members.push(newMember);
    currentDb.memberships.push(newMembership);

    currentDb.notifications.push({
      id: `notif-${Date.now()}`,
      userId: newUser.id,
      type: 'announcement',
      title: 'Welcome to Xing Fitness Brookefield!',
      message: `Your membership (${membershipNumber}) is active. Default sign-in password: ${defaultPassword}`,
      read: false,
      link: '/member/dashboard',
      createdAt: nowIso
    });

    db.save(currentDb);
    return {
      member: newMember,
      membership: newMembership,
      tempPassword: defaultPassword
    };
  },

  updateMember(memberId: string, updates: Partial<MemberProfile>) {
    const currentDb = db.get();
    const index = currentDb.members.findIndex((m) => m.id === memberId);
    if (index === -1) throw new Error('Member not found.');

    const updated = {
      ...currentDb.members[index],
      ...updates,
      id: memberId,
      userId: currentDb.members[index].userId,
      updatedAt: new Date().toISOString()
    };

    currentDb.members[index] = updated;
    db.save(currentDb);
    return updated;
  },

  toggleMemberStatus(memberId: string, active: boolean) {
    const currentDb = db.get();
    const member = currentDb.members.find((m) => m.id === memberId);
    if (!member) throw new Error('Member not found.');

    member.active = active;
    member.updatedAt = new Date().toISOString();
    db.save(currentDb);
    return member;
  },

  // ===================== LEADS & ENQUIRY MANAGEMENT =====================

  getLeads(filter?: { status?: LeadStatus | 'all'; source?: string }) {
    const currentDb = db.get();
    let leads = [...currentDb.leads].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (filter?.status && filter.status !== 'all') {
      leads = leads.filter((l) => l.status === filter.status);
    }

    if (filter?.source && filter.source !== 'all') {
      leads = leads.filter((l) => l.source === filter.source);
    }

    return leads;
  },

  updateLeadStatus(leadId: string, status: LeadStatus, notes?: string) {
    const currentDb = db.get();
    const lead = currentDb.leads.find((l) => l.id === leadId);
    if (!lead) throw new Error('Lead not found.');

    lead.status = status;
    if (notes) {
      lead.followUpNotes = (lead.followUpNotes ? lead.followUpNotes + '\n' : '') + `[${new Date().toLocaleDateString()}]: ${notes.trim()}`;
    }
    lead.updatedAt = new Date().toISOString();
    db.save(currentDb);
    return lead;
  },

  // ===================== FREE TRIAL MANAGEMENT =====================

  getFreeTrials() {
    const currentDb = db.get();
    return currentDb.leads
      .filter((l) => l.source === 'Free Trial' || l.type.toLowerCase().includes('trial'))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  // ===================== MEMBERSHIP PLANS CRUD =====================

  getPlans() {
    return db.get().plans;
  },

  savePlan(planData: Omit<MembershipPlan, 'createdAt' | 'updatedAt'> & { id?: string }) {
    const currentDb = db.get();
    const nowIso = new Date().toISOString();

    if (planData.id) {
      const idx = currentDb.plans.findIndex((p) => p.id === planData.id);
      if (idx !== -1) {
        currentDb.plans[idx] = {
          ...currentDb.plans[idx],
          ...planData,
          updatedAt: nowIso
        };
        db.save(currentDb);
        return currentDb.plans[idx];
      }
    }

    const newPlan: MembershipPlan = {
      ...planData,
      id: planData.id || `plan-${Date.now()}`,
      createdAt: nowIso,
      updatedAt: nowIso
    };

    currentDb.plans.push(newPlan);
    db.save(currentDb);
    return newPlan;
  },

  deletePlan(planId: string) {
    const currentDb = db.get();
    currentDb.plans = currentDb.plans.filter((p) => p.id !== planId);
    db.save(currentDb);
    return { success: true };
  },

  // ===================== TRAINERS CRUD =====================

  getTrainers() {
    return db.get().trainers;
  },

  saveTrainer(trainerData: Omit<TrainerEntity, 'createdAt' | 'updatedAt'> & { id?: string }) {
    const currentDb = db.get();
    const nowIso = new Date().toISOString();

    if (trainerData.id) {
      const idx = currentDb.trainers.findIndex((t) => t.id === trainerData.id);
      if (idx !== -1) {
        currentDb.trainers[idx] = {
          ...currentDb.trainers[idx],
          ...trainerData,
          updatedAt: nowIso
        };
        db.save(currentDb);
        return currentDb.trainers[idx];
      }
    }

    const newTrainer: TrainerEntity = {
      ...trainerData,
      id: trainerData.id || `coach-${Date.now()}`,
      createdAt: nowIso,
      updatedAt: nowIso
    };

    currentDb.trainers.push(newTrainer);
    db.save(currentDb);
    return newTrainer;
  },

  // ===================== CLASSES CRUD =====================

  getClasses() {
    return db.get().classes;
  },

  saveClass(classData: Omit<ClassEntity, 'createdAt' | 'updatedAt'> & { id?: string }) {
    const currentDb = db.get();
    const nowIso = new Date().toISOString();

    if (classData.id) {
      const idx = currentDb.classes.findIndex((c) => c.id === classData.id);
      if (idx !== -1) {
        currentDb.classes[idx] = {
          ...currentDb.classes[idx],
          ...classData,
          updatedAt: nowIso
        };
        db.save(currentDb);
        return currentDb.classes[idx];
      }
    }

    const newClass: ClassEntity = {
      ...classData,
      id: classData.id || `cls-${Date.now()}`,
      createdAt: nowIso,
      updatedAt: nowIso
    };

    currentDb.classes.push(newClass);
    db.save(currentDb);
    return newClass;
  },

  // ===================== OFFERS CRUD =====================

  getOffers() {
    return db.get().offers;
  },

  saveOffer(offerData: Omit<Offer, 'createdAt' | 'updatedAt'> & { id?: string }) {
    const currentDb = db.get();
    const nowIso = new Date().toISOString();

    if (offerData.id) {
      const idx = currentDb.offers.findIndex((o) => o.id === offerData.id);
      if (idx !== -1) {
        currentDb.offers[idx] = {
          ...currentDb.offers[idx],
          ...offerData,
          updatedAt: nowIso
        };
        db.save(currentDb);
        return currentDb.offers[idx];
      }
    }

    const newOffer: Offer = {
      ...offerData,
      id: offerData.id || `off-${Date.now()}`,
      createdAt: nowIso,
      updatedAt: nowIso
    };

    currentDb.offers.push(newOffer);
    db.save(currentDb);
    return newOffer;
  },

  // ===================== BOOKINGS ADMIN =====================

  getAllBookings() {
    const currentDb = db.get();
    return {
      classBookings: currentDb.classBookings,
      trainerBookings: currentDb.trainerBookings
    };
  },

  updateClassBookingStatus(bookingId: string, status: any) {
    const currentDb = db.get();
    const b = currentDb.classBookings.find((x) => x.id === bookingId);
    if (!b) throw new Error('Booking not found.');
    b.status = status;
    b.updatedAt = new Date().toISOString();
    db.save(currentDb);
    return b;
  },

  updateTrainerBookingStatus(bookingId: string, status: any) {
    const currentDb = db.get();
    const b = currentDb.trainerBookings.find((x) => x.id === bookingId);
    if (!b) throw new Error('Booking not found.');
    b.status = status;
    b.updatedAt = new Date().toISOString();
    db.save(currentDb);
    return b;
  }
};
