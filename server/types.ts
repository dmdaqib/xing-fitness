/**
 * XING FITNESS — Server-Side Normalized Data Models & Types
 * Conforms to P3 Architecture & Role Requirements
 */

export type UserRole = 'PUBLIC' | 'MEMBER' | 'STAFF' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: UserRole;
  resetToken?: string;
  resetTokenExpiry?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemberProfile {
  id: string;
  userId: string;
  membershipNumber: string;
  name: string;
  phone: string;
  email: string;
  dateOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  fitnessGoal?: string;
  emergencyContact?: string;
  address?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type MembershipTier = 'monthly' | 'quarterly' | 'half-yearly' | 'annual' | 'personal-training';

export interface MembershipPlan {
  id: string;
  name: string;
  tier: MembershipTier;
  durationMonths: number;
  priceDisplay: string;
  basePrice: number;
  benefits: string[];
  popular?: boolean;
  bestValue?: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type MembershipStatus = 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED' | 'PENDING';
export type PaymentStatus = 'UNPAID' | 'PAID_OFFLINE_VERIFIED' | 'PENDING_REVIEW';

export interface Membership {
  id: string;
  memberId: string;
  planId: string;
  planName: string;
  startDate: string;
  endDate: string;
  status: MembershipStatus;
  amount: number;
  paymentStatus: PaymentStatus;
  renewalRequested: boolean;
  renewalEnquiryId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceRecord {
  id: string;
  memberId: string;
  date: string; // YYYY-MM-DD
  checkInTime: string; // HH:MM
  checkOutTime?: string;
  status: 'PRESENT' | 'COMPLETED';
  createdAt: string;
}

export interface ExerciseItem {
  id: string;
  name: string;
  targetMuscle: string;
  sets: number;
  reps: string;
  restSeconds: number;
  notes?: string;
}

export interface WorkoutDay {
  id: string;
  dayName: string; // e.g. "Day 1: Upper Body Strength"
  targetGoal: string;
  exercises: ExerciseItem[];
}

export interface WorkoutPlan {
  id: string;
  memberId: string;
  title: string;
  goal: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  assignedByTrainerName: string;
  trainerNotes: string;
  days: WorkoutDay[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TrainerAvailability {
  dayOfWeek: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  timeSlots: string[]; // e.g. ["06:00 AM", "07:00 AM", "05:00 PM"]
}

export interface TrainerEntity {
  id: string;
  name: string;
  role: string;
  photoUrl: string;
  specialization: string[];
  experience?: string;
  certifications?: string[];
  bio: string;
  availability: TrainerAvailability[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ClassStatus = 'ACTIVE' | 'CANCELLED' | 'INACTIVE';

export interface ClassEntity {
  id: string;
  title: string;
  category: 'Strength' | 'HIIT' | 'Functional' | 'Zumba' | 'Yoga' | 'Dance Fitness';
  trainerName: string;
  dayOfWeek: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  time: string;
  duration: string;
  capacity: number;
  status: ClassStatus;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 'REQUESTED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface ClassBooking {
  id: string;
  memberId: string;
  memberName: string;
  memberPhone: string;
  classId: string;
  classTitle: string;
  classDate: string; // YYYY-MM-DD
  classTime: string;
  trainerName: string;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrainerBooking {
  id: string;
  memberId: string;
  memberName: string;
  memberPhone: string;
  trainerId: string;
  trainerName: string;
  bookingDate: string; // YYYY-MM-DD
  timeSlot: string;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type LeadSource = 
  | 'Website' 
  | 'WhatsApp' 
  | 'Free Trial' 
  | 'Membership' 
  | 'Trainer' 
  | 'Class' 
  | 'Contact Form';

export type LeadStatus = 
  | 'NEW' 
  | 'CONTACTED' 
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'TRIAL BOOKED' 
  | 'TRIAL COMPLETED' 
  | 'SCHEDULED'
  | 'JOINED' 
  | 'NOT INTERESTED';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  type: string;
  source: LeadSource;
  preferredDate?: string;
  preferredTime?: string;
  fitnessGoal?: string;
  message?: string;
  status: LeadStatus;
  followUpNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string; // member userId or 'ALL' or 'STAFF'
  type: 'membership' | 'booking' | 'trainer' | 'class' | 'announcement' | 'lead';
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface Offer {
  id: string;
  title: string;
  badge: string;
  description: string;
  discount: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  eligibility: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FitnessProgressEntry {
  id: string;
  memberId: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
  heightCm: number;
  bmi: number;
  fitnessGoal: string;
  bodyFatPercentage?: number;
  notes?: string;
  createdAt: string;
}

export interface AuthSession {
  token: string;
  user: {
    id: string;
    email: string;
    role: UserRole;
    name?: string;
    memberId?: string;
  };
}
