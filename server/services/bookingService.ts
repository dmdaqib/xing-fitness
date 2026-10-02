import { db } from '../db/store.ts';
import type { ClassEntity, ClassBooking, TrainerEntity, TrainerBooking } from '../types.ts';


export const bookingService = {
  /**
   * Get all active studio classes along with their next upcoming session date and booked count
   */
  getClasses(): Array<ClassEntity & { bookedCountToday: number }> {
    const currentDb = db.get();
    const today = new Date().toISOString().split('T')[0];

    return currentDb.classes.map((cls) => {
      const bookedCount = currentDb.classBookings.filter(
        (b) => b.classId === cls.id && b.classDate === today && b.status !== 'CANCELLED'
      ).length;

      return {
        ...cls,
        bookedCountToday: bookedCount
      };
    });
  },

  /**
   * Book a studio group fitness class
   */
  bookClass(
    memberId: string,
    classId: string,
    targetDate: string,
    notes?: string
  ): ClassBooking {
    const currentDb = db.get();
    const member = currentDb.members.find((m) => m.id === memberId);
    if (!member) throw new Error('Member profile not found.');

    const gymClass = currentDb.classes.find((c) => c.id === classId);
    if (!gymClass) throw new Error('Class not found.');
    if (gymClass.status !== 'ACTIVE') {
      throw new Error('This class is currently not active or has been cancelled.');
    }

    // Verify date is not in the past
    const today = new Date().toISOString().split('T')[0];
    if (targetDate < today) {
      throw new Error('Cannot book classes for a past date.');
    }

    // Check duplicate booking for this member on this date
    const existing = currentDb.classBookings.find(
      (b) =>
        b.memberId === memberId &&
        b.classId === classId &&
        b.classDate === targetDate &&
        b.status !== 'CANCELLED'
    );
    if (existing) {
      throw new Error('You have already reserved a spot in this class for the selected date.');
    }

    // Check capacity
    const currentBookedCount = currentDb.classBookings.filter(
      (b) => b.classId === classId && b.classDate === targetDate && b.status !== 'CANCELLED'
    ).length;

    if (currentBookedCount >= gymClass.capacity) {
      throw new Error(`This class is at full capacity (${gymClass.capacity}/${gymClass.capacity} booked).`);
    }

    const nowIso = new Date().toISOString();
    const newBooking: ClassBooking = {
      id: `bk-cls-${Date.now()}`,
      memberId,
      memberName: member.name,
      memberPhone: member.phone,
      classId: gymClass.id,
      classTitle: gymClass.title,
      classDate: targetDate,
      classTime: gymClass.time,
      trainerName: gymClass.trainerName,
      status: 'CONFIRMED',
      notes: notes?.trim() || undefined,
      createdAt: nowIso,
      updatedAt: nowIso
    };

    currentDb.classBookings.unshift(newBooking);

    // Send notification to member
    currentDb.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: member.userId,
      type: 'class',
      title: 'Class Confirmed',
      message: `Your spot for ${gymClass.title} on ${targetDate} at ${gymClass.time} has been confirmed.`,
      read: false,
      link: '/member/bookings',
      createdAt: nowIso
    });

    db.save(currentDb);
    return newBooking;
  },

  /**
   * Cancel a class booking (with member ownership check)
   */
  cancelClassBooking(memberId: string, bookingId: string): ClassBooking {
    const currentDb = db.get();
    const booking = currentDb.classBookings.find((b) => b.id === bookingId);
    if (!booking) throw new Error('Booking not found.');

    if (booking.memberId !== memberId) {
      throw new Error('Unauthorized to cancel this booking.');
    }

    if (booking.status === 'CANCELLED') {
      throw new Error('Booking is already cancelled.');
    }

    booking.status = 'CANCELLED';
    booking.updatedAt = new Date().toISOString();

    const member = currentDb.members.find((m) => m.id === memberId);
    if (member) {
      currentDb.notifications.unshift({
        id: `notif-${Date.now()}`,
        userId: member.userId,
        type: 'class',
        title: 'Class Booking Cancelled',
        message: `Your booking for ${booking.classTitle} on ${booking.classDate} has been cancelled.`,
        read: false,
        link: '/member/bookings',
        createdAt: new Date().toISOString()
      });
    }

    db.save(currentDb);
    return booking;
  },

  /**
   * Get all active personal trainers with their availability slots
   */
  getTrainers(): TrainerEntity[] {
    const currentDb = db.get();
    return currentDb.trainers.filter((t) => t.active);
  },

  /**
   * Request a Personal Trainer coaching session
   */
  bookTrainer(
    memberId: string,
    trainerId: string,
    bookingDate: string,
    timeSlot: string,
    notes?: string
  ): TrainerBooking {
    const currentDb = db.get();
    const member = currentDb.members.find((m) => m.id === memberId);
    if (!member) throw new Error('Member profile not found.');

    const trainer = currentDb.trainers.find((t) => t.id === trainerId);
    if (!trainer) throw new Error('Trainer not found.');
    if (!trainer.active) throw new Error('Trainer is currently not accepting new bookings.');

    // Validate date is not in the past
    const today = new Date().toISOString().split('T')[0];
    if (bookingDate < today) {
      throw new Error('Cannot schedule sessions for past dates.');
    }

    // Determine Day of Week for selected date
    const dateObj = new Date(bookingDate + 'T00:00:00');
    const dayNames: Array<'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat'> = [
      'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
    ];
    const dayOfWeek = dayNames[dateObj.getDay()];

    // Verify trainer availability for this day and time slot
    const dayAvail = trainer.availability.find((a) => a.dayOfWeek === dayOfWeek);
    if (!dayAvail || !dayAvail.timeSlots.includes(timeSlot)) {
      throw new Error(
        `${trainer.name} is not scheduled for training on ${dayOfWeek} at ${timeSlot}. Please select an available slot.`
      );
    }

    // Check if trainer already has a conflicting booking
    const conflict = currentDb.trainerBookings.find(
      (b) =>
        b.trainerId === trainerId &&
        b.bookingDate === bookingDate &&
        b.timeSlot === timeSlot &&
        (b.status === 'CONFIRMED' || b.status === 'REQUESTED')
    );
    if (conflict) {
      throw new Error('This trainer slot is already booked or requested by another member. Please choose another time.');
    }

    // Check if member already has a session on the same date and slot
    const memberConflict = currentDb.trainerBookings.find(
      (b) =>
        b.memberId === memberId &&
        b.bookingDate === bookingDate &&
        b.timeSlot === timeSlot &&
        b.status !== 'CANCELLED'
    );
    if (memberConflict) {
      throw new Error('You already have a trainer booking requested or confirmed for this time slot.');
    }

    const nowIso = new Date().toISOString();
    const newBooking: TrainerBooking = {
      id: `bk-trn-${Date.now()}`,
      memberId,
      memberName: member.name,
      memberPhone: member.phone,
      trainerId: trainer.id,
      trainerName: trainer.name,
      bookingDate,
      timeSlot,
      status: 'REQUESTED',
      notes: notes?.trim() || undefined,
      createdAt: nowIso,
      updatedAt: nowIso
    };

    currentDb.trainerBookings.unshift(newBooking);

    // Create Notification for Member
    currentDb.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: member.userId,
      type: 'trainer',
      title: 'Trainer Session Requested',
      message: `Your session request with ${trainer.name} for ${bookingDate} at ${timeSlot} has been submitted for scheduling confirmation.`,
      read: false,
      link: '/member/bookings',
      createdAt: nowIso
    });

    // Create Lead/Task for Staff Desk
    currentDb.leads.unshift({
      id: `lead-pt-${Date.now()}`,
      name: member.name,
      phone: member.phone,
      email: member.email,
      type: 'PT Session Request',
      source: 'Trainer' as const,
      preferredDate: bookingDate,
      preferredTime: timeSlot,
      message: `Member ${member.name} requested 1-on-1 session with ${trainer.name} on ${bookingDate} at ${timeSlot}. Notes: ${notes || 'None'}`,
      status: 'NEW' as const,
      createdAt: nowIso,
      updatedAt: nowIso
    });

    db.save(currentDb);
    return newBooking;
  },

  /**
   * Cancel a trainer booking (with member ownership check)
   */
  cancelTrainerBooking(memberId: string, bookingId: string): TrainerBooking {
    const currentDb = db.get();
    const booking = currentDb.trainerBookings.find((b) => b.id === bookingId);
    if (!booking) throw new Error('Trainer booking not found.');

    if (booking.memberId !== memberId) {
      throw new Error('Unauthorized to cancel this booking.');
    }

    if (booking.status === 'CANCELLED') {
      throw new Error('Booking is already cancelled.');
    }

    booking.status = 'CANCELLED';
    booking.updatedAt = new Date().toISOString();

    const member = currentDb.members.find((m) => m.id === memberId);
    if (member) {
      currentDb.notifications.unshift({
        id: `notif-${Date.now()}`,
        userId: member.userId,
        type: 'trainer',
        title: 'Trainer Session Cancelled',
        message: `Your trainer session with ${booking.trainerName} for ${booking.bookingDate} at ${booking.timeSlot} has been cancelled.`,
        read: false,
        link: '/member/bookings',
        createdAt: new Date().toISOString()
      });
    }

    db.save(currentDb);
    return booking;
  }
};
