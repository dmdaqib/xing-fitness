export interface Program {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: 'strength' | 'hypertrophy' | 'fat-loss' | 'functional' | 'coaching' | 'cardio';
  targetAudience: string;
  duration: string;
  frequency: string;
  features: string[];
  image: string;
  accent: string;
}

export interface Trainer {
  id: string;
  slug: string;
  name: string;
  role: string;
  photo?: string;
  image: string;
  hasRealPhoto?: boolean;
  isPlaceholderName?: boolean;
  bio: string;
  trainingFocus: string[];
  specialization?: string[];
  experience?: string;
  certifications?: string[];
  instagram?: string;
}

export interface LeadershipMember {
  name: string;
  role: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  tier: 'monthly' | 'quarterly' | 'half-yearly' | 'annual' | 'personal-training';
  periodLabel: string;
  pricePlaceholder: string; // [MEMBERSHIP PRICE]
  priceNote: string;
  popular?: boolean;
  bestValue?: boolean;
  features: string[];
  nonFeatures?: string[];
  ctaText: string;
}

export interface ClassSession {
  id: string;
  title: string;
  category: 'Strength' | 'HIIT' | 'Functional' | 'Mobility' | 'Boxing';
  trainerPlaceholder: string;
  days: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun')[];
  time: string;
  duration: string;
  capacity: string;
  intensity: 'High' | 'Medium' | 'All Levels';
  description: string;
}

export interface TransformationItem {
  id: string;
  title: string;
  tagline: string;
  category: string;
  duration: string;
  story: string;
  focus: string;
  image: string;
  disclaimer: string;
}

export interface FacilityZone {
  id: string;
  name: string;
  category: 'strength' | 'cardio' | 'functional' | 'recovery' | 'weights';
  highlight: string;
  description: string;
  features: string[];
  image: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: 'all' | 'gym' | 'equipment' | 'training' | 'trainers' | 'facilities';
  image: string;
  alt: string;
  caption: string;
}

export interface FAQItem {
  id: string;
  category: 'Membership' | 'Free Trial' | 'Gym Timings' | 'Personal Training' | 'Classes' | 'Facilities' | 'Parking' | 'Location' | 'Payments' | 'Cancellation';
  question: string;
  answer: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
  imageJpg?: string;
  imageAlt: string;
  imageWidth?: number;
  imageHeight?: number;
  imageSource?: string;
  imageLicense?: string;
  imagePhotographer?: string;
  content: string;
}

/**
 * P2 Admin Architecture Models
 * Skeletons prepared for Phase 3 Admin & CRM integration
 */
export interface Member {
  id: string;
  membershipNumber: string;
  fullName: string;
  phone: string;
  email?: string;
  planId: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'frozen' | 'expired' | 'pending';
  assignedTrainerId?: string;
  lockerNumber?: string;
}

export interface Booking {
  id: string;
  type: 'free_trial' | 'personal_training' | 'class_reservation' | 'facility_tour';
  leadId?: string;
  memberId?: string;
  contactName: string;
  contactPhone: string;
  scheduledDate: string;
  scheduledTimeSlot: string;
  status: 'pending_confirmation' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  createdAt: string;
}

export interface OfferItem {
  id: string;
  title: string;
  discountPercentage?: number;
  badge: string;
  description: string;
  eligibility: string;
  terms: string[];
  validUntil?: string;
  active: boolean;
}

export interface ReviewItem {
  id: string;
  source: 'google' | 'direct';
  authorName: string;
  rating: number;
  comment: string;
  publishDate: string;
  verifiedMember: boolean;
  googleReviewId?: string;
  responseFromOwner?: string;
}

