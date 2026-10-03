import fs from 'fs';
import path from 'path';
import { hashPassword } from '../auth/crypto.ts';
import type {
  User,
  MemberProfile,
  MembershipPlan,
  Membership,
  AttendanceRecord,
  WorkoutPlan,
  TrainerEntity,
  ClassEntity,
  ClassBooking,
  TrainerBooking,
  Lead,
  Notification,
  Offer,
  FitnessProgressEntry
} from '../types.ts';


export interface DatabaseSchema {
  users: User[];
  members: MemberProfile[];
  plans: MembershipPlan[];
  memberships: Membership[];
  attendance: AttendanceRecord[];
  workouts: WorkoutPlan[];
  trainers: TrainerEntity[];
  classes: ClassEntity[];
  classBookings: ClassBooking[];
  trainerBookings: TrainerBooking[];
  leads: Lead[];
  notifications: Notification[];
  offers: Offer[];
  progress: FitnessProgressEntry[];
}

function getDbFilePath(): string {
  if (process.env.DB_PATH && process.env.DB_PATH.trim() !== '') {
    return path.resolve(process.env.DB_PATH.trim());
  }
  return path.resolve(process.cwd(), 'server', 'data', 'db.json');
}

// In-memory cache synced with disk
let cachedDb: DatabaseSchema | null = null;

function ensureDataDirectory(targetPath: string) {
  const dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getInitialDatabaseSeed(): DatabaseSchema {
  const adminPass = hashPassword('Admin@12345');
  const staffPass = hashPassword('Staff@12345');
  const memberPass = hashPassword('Member@12345');

  const now = new Date();
  const nowIso = now.toISOString();

  // Demo Member Dates
  const startDate = new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 45 days ago
  const expiryDate = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 15 days left (Expiring Soon!)

  const adminUser: User = {
    id: 'usr-admin-01',
    email: 'admin@xingfitness.com',
    passwordHash: adminPass.hash,
    salt: adminPass.salt,
    role: 'ADMIN',
    createdAt: nowIso,
    updatedAt: nowIso
  };

  const staffUser: User = {
    id: 'usr-staff-01',
    email: 'staff@xingfitness.com',
    passwordHash: staffPass.hash,
    salt: staffPass.salt,
    role: 'STAFF',
    createdAt: nowIso,
    updatedAt: nowIso
  };

  const memberUser: User = {
    id: 'usr-member-01',
    email: 'member@xingfitness.com',
    passwordHash: memberPass.hash,
    salt: memberPass.salt,
    role: 'MEMBER',
    createdAt: nowIso,
    updatedAt: nowIso
  };

  const memberProfile: MemberProfile = {
    id: 'mem-001',
    userId: memberUser.id,
    membershipNumber: 'XING-8821',
    name: 'Arjun Verma',
    phone: '9876543210',
    email: 'member@xingfitness.com',
    dateOfBirth: '1996-05-14',
    gender: 'Male',
    fitnessGoal: 'Hypertrophy & Posture Correction',
    emergencyContact: '+91 98765 00000 (Spouse)',
    address: 'Brookefield Main Road, Whitefield, Bengaluru',
    active: true,
    createdAt: nowIso,
    updatedAt: nowIso
  };

  const plans: MembershipPlan[] = [
    {
      id: 'plan-1-month',
      name: '1 Month Membership',
      tier: 'monthly',
      durationMonths: 1,
      priceDisplay: '[MEMBERSHIP PRICE]',
      basePrice: 0,
      benefits: [
        'Full training floor & Matrix machine access',
        'Standard digital locker access & shower suites',
        'Initial movement screening with certified coach',
        'Free Wi-Fi & member parking'
      ],
      active: true,
      createdAt: nowIso,
      updatedAt: nowIso
    },
    {
      id: 'plan-3-month',
      name: '3 Month Commitment',
      tier: 'quarterly',
      durationMonths: 3,
      priceDisplay: '[MEMBERSHIP PRICE]',
      basePrice: 0,
      benefits: [
        'Full facility, turf, and cardio deck access',
        '1 complimentary InBody biometric body scan',
        '1 private personal training coaching session',
        'Access to group studio Zumba & Yoga sessions',
        'Dedicated vehicle parking with security'
      ],
      popular: true,
      active: true,
      createdAt: nowIso,
      updatedAt: nowIso
    },
    {
      id: 'plan-6-month',
      name: '6 Month Transformation',
      tier: 'half-yearly',
      durationMonths: 6,
      priceDisplay: '[MEMBERSHIP PRICE]',
      basePrice: 0,
      benefits: [
        'All 3-Month benefits included',
        '2 complimentary personal coaching sessions',
        'Monthly InBody progress tracking & review',
        'Priority studio class booking window',
        '15-day membership freeze allowance'
      ],
      active: true,
      createdAt: nowIso,
      updatedAt: nowIso
    },
    {
      id: 'plan-12-month',
      name: 'Annual Club Membership',
      tier: 'annual',
      durationMonths: 12,
      priceDisplay: '[MEMBERSHIP PRICE]',
      basePrice: 0,
      benefits: [
        'All 6-Month benefits included',
        'Eligible for 40% OFF Founder discount (First 50)',
        'Free assigned locker & complimentary gym kit',
        '4 complimentary 1-on-1 coaching sessions',
        'Monthly InBody scans & coach consultation',
        '45-day membership freeze privilege',
        'Guest pass access (2 per quarter)'
      ],
      bestValue: true,
      active: true,
      createdAt: nowIso,
      updatedAt: nowIso
    }
  ];

  const membership: Membership = {
    id: 'msh-001',
    memberId: memberProfile.id,
    planId: 'plan-3-month',
    planName: '3 Month Commitment',
    startDate: startDate,
    endDate: expiryDate,
    status: 'EXPIRING_SOON',
    amount: 0,
    paymentStatus: 'PAID_OFFLINE_VERIFIED',
    renewalRequested: false,
    createdAt: nowIso,
    updatedAt: nowIso
  };

  const attendance: AttendanceRecord[] = [
    {
      id: 'att-1',
      memberId: memberProfile.id,
      date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      checkInTime: '06:45 AM',
      checkOutTime: '08:15 AM',
      status: 'COMPLETED',
      createdAt: nowIso
    },
    {
      id: 'att-2',
      memberId: memberProfile.id,
      date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      checkInTime: '07:05 AM',
      checkOutTime: '08:30 AM',
      status: 'COMPLETED',
      createdAt: nowIso
    },
    {
      id: 'att-3',
      memberId: memberProfile.id,
      date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      checkInTime: '06:50 AM',
      checkOutTime: '08:10 AM',
      status: 'COMPLETED',
      createdAt: nowIso
    }
  ];

  const progress: FitnessProgressEntry[] = [
    {
      id: 'prg-1',
      memberId: memberProfile.id,
      date: startDate,
      weightKg: 78.5,
      heightCm: 176,
      bmi: 25.3,
      fitnessGoal: 'Hypertrophy & Posture Correction',
      notes: 'Initial biometric benchmark taken at front desk.',
      createdAt: nowIso
    },
    {
      id: 'prg-2',
      memberId: memberProfile.id,
      date: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      weightKg: 76.8,
      heightCm: 176,
      bmi: 24.8,
      fitnessGoal: 'Hypertrophy & Posture Correction',
      notes: 'Noticeable upper back strength improvement and waist reduction.',
      createdAt: nowIso
    }
  ];

  const workoutPlan: WorkoutPlan = {
    id: 'wp-001',
    memberId: memberProfile.id,
    title: '4-Day Upper / Lower Strength Progression',
    goal: 'Hypertrophy & Postural Alignment',
    experienceLevel: 'Intermediate',
    assignedByTrainerName: 'Head Strength Coach',
    trainerNotes: 'Focus on 3-second eccentric descent on Matrix chest press and Romanian deadlifts. Keep core braced.',
    days: [
      {
        id: 'day-1',
        dayName: 'Day 1: Upper Body Strength & Hypertrophy',
        targetGoal: 'Chest, Back, Shoulders & Arms',
        exercises: [
          {
            id: 'ex-1',
            name: 'Barbell Flat Bench Press',
            targetMuscle: 'Pectorals & Triceps',
            sets: 4,
            reps: '6-8 reps',
            restSeconds: 90,
            notes: 'Pause 1s on chest, drive through feet.'
          },
          {
            id: 'ex-2',
            name: 'Matrix Selectorized Lat Pulldown',
            targetMuscle: 'Latissimus Dorsi',
            sets: 3,
            reps: '10-12 reps',
            restSeconds: 60,
            notes: 'Squeeze shoulder blades down and back.'
          },
          {
            id: 'ex-3',
            name: 'Incline Dumbbell Chest Press',
            targetMuscle: 'Upper Pectorals',
            sets: 3,
            reps: '8-10 reps',
            restSeconds: 75
          },
          {
            id: 'ex-4',
            name: 'Dual Cable Face Pulls',
            targetMuscle: 'Rear Deltoids & Rotator Cuff',
            sets: 3,
            reps: '15 reps',
            restSeconds: 60,
            notes: 'Essential for desk workers posture.'
          }
        ]
      },
      {
        id: 'day-2',
        dayName: 'Day 2: Lower Body & Posterior Chain',
        targetGoal: 'Quads, Hamstrings & Glutes',
        exercises: [
          {
            id: 'ex-5',
            name: 'Barbell Back Squat',
            targetMuscle: 'Quadriceps & Glutes',
            sets: 4,
            reps: '6-8 reps',
            restSeconds: 120,
            notes: 'Full depth on Olympic platform.'
          },
          {
            id: 'ex-6',
            name: 'Romanian Deadlift (Dumbbells/Barbell)',
            targetMuscle: 'Hamstrings & Erector Spinae',
            sets: 3,
            reps: '8-10 reps',
            restSeconds: 90,
            notes: 'Hinge hips backward, keep lats tight.'
          },
          {
            id: 'ex-7',
            name: 'Matrix Seated Leg Extension',
            targetMuscle: 'Quadriceps Isolation',
            sets: 3,
            reps: '12-15 reps',
            restSeconds: 60
          }
        ]
      }
    ],
    active: true,
    createdAt: nowIso,
    updatedAt: nowIso
  };

  const trainers: TrainerEntity[] = [
    {
      id: 'preetam',
      name: 'Preetam',
      role: 'Fitness Trainer',
      photoUrl: '/images/trainers/preetam.jpg',
      specialization: [
        'Strength Training',
        'Weight-Loss Support',
        'Muscle Building',
        'General Fitness',
        'Personalized Workout Guidance',
        'Proper Exercise Technique',
        'Progressive Training'
      ],
      bio: 'Preetam provides disciplined, personalized fitness coaching designed to help members achieve lasting results through progressive strength training and proper exercise mechanics. He focuses on muscle building, safe weight-loss support, and step-by-step guidance that builds training confidence on the gym floor.',
      availability: [
        { dayOfWeek: 'Mon', timeSlots: ['06:00 AM', '07:00 AM', '05:00 PM', '06:00 PM'] },
        { dayOfWeek: 'Wed', timeSlots: ['06:00 AM', '07:00 AM', '05:00 PM', '06:00 PM'] },
        { dayOfWeek: 'Fri', timeSlots: ['06:00 AM', '07:00 AM', '05:00 PM', '06:00 PM'] }
      ],
      active: true,
      createdAt: nowIso,
      updatedAt: nowIso
    },
    {
      id: 'arvind',
      name: 'Arvind',
      role: 'Fitness Trainer',
      photoUrl: '/images/trainers/arvind.jpg',
      specialization: [
        'Functional Fitness',
        'Strength & Conditioning',
        'Fat-Loss Support',
        'Mobility & Movement',
        'Fitness Consistency',
        'Personalized Training',
        'Exercise Technique'
      ],
      bio: 'Arvind takes a functional, movement-first approach to fitness, helping members develop full-body strength, mobility, and long-term physical conditioning. His coaching emphasizes workout consistency, effective fat-loss strategies, and refined technique so members move efficiently and stay injury-free.',
      availability: [
        { dayOfWeek: 'Tue', timeSlots: ['07:00 AM', '08:00 AM', '06:00 PM', '07:00 PM'] },
        { dayOfWeek: 'Thu', timeSlots: ['07:00 AM', '08:00 AM', '06:00 PM', '07:00 PM'] },
        { dayOfWeek: 'Sat', timeSlots: ['08:00 AM', '09:00 AM', '10:00 AM'] }
      ],
      active: true,
      createdAt: nowIso,
      updatedAt: nowIso
    },
    {
      id: 'surbhi',
      name: 'Surbhi',
      role: 'Zumba / Fitness Trainer',
      photoUrl: '/images/trainers/surbhi.jpg',
      specialization: [
        'Zumba Classes',
        'Dance-Based Fitness',
        'Cardio Conditioning',
        'Full-Body Movement',
        'Coordination & Rhythm',
        'Energy & Engagement',
        'Beginner-Friendly Workouts',
        'Enjoyable Group Workouts'
      ],
      bio: 'Surbhi leads dynamic Zumba and group fitness sessions that combine uplifting music, dance-inspired rhythms, and cardio conditioning into a motivating full-body workout. Her classes prioritize coordination, high energy, and an inclusive, beginner-friendly atmosphere where staying active is genuinely enjoyable.',
      availability: [
        { dayOfWeek: 'Mon', timeSlots: ['06:30 PM'] },
        { dayOfWeek: 'Wed', timeSlots: ['06:30 PM'] },
        { dayOfWeek: 'Fri', timeSlots: ['06:30 PM'] },
        { dayOfWeek: 'Sat', timeSlots: ['09:00 AM'] }
      ],
      active: true,
      createdAt: nowIso,
      updatedAt: nowIso
    }
  ];

  const classes: ClassEntity[] = [
    {
      id: 'cls-1',
      title: 'High-Energy Zumba Fitness',
      category: 'Zumba',
      trainerName: 'Surbhi',
      dayOfWeek: 'Mon',
      time: '06:30 PM',
      duration: '50 min',
      capacity: 15,
      status: 'ACTIVE',
      description: 'Dynamic Latin rhythms and aerobic conditioning in our purple studio with sprung wood flooring.',
      createdAt: nowIso,
      updatedAt: nowIso
    },
    {
      id: 'cls-2',
      title: 'Vinyasa Flow & Postural Yoga',
      category: 'Yoga',
      trainerName: 'Arvind',
      dayOfWeek: 'Wed',
      time: '07:00 AM',
      duration: '60 min',
      capacity: 12,
      status: 'ACTIVE',
      description: 'Spinal mobility, breath alignment, and hamstring flexibility tailored for tech desk workers.',
      createdAt: nowIso,
      updatedAt: nowIso
    },
    {
      id: 'cls-3',
      title: 'Aerobic Dance Fitness',
      category: 'Dance Fitness',
      trainerName: 'Surbhi',
      dayOfWeek: 'Fri',
      time: '06:30 PM',
      duration: '50 min',
      capacity: 15,
      status: 'ACTIVE',
      description: 'High-calorie burn dance choreography designed to improve agility, rhythm, and cardiovascular endurance.',
      createdAt: nowIso,
      updatedAt: nowIso
    },
    {
      id: 'cls-4',
      title: 'Weekend Strength & Conditioning Camp',
      category: 'Strength',
      trainerName: 'Preetam',
      dayOfWeek: 'Sat',
      time: '08:30 AM',
      duration: '55 min',
      capacity: 10,
      status: 'ACTIVE',
      description: 'Barbell technique stations, kettlebell complexes, and prowler sprint turf intervals.',
      createdAt: nowIso,
      updatedAt: nowIso
    }
  ];

  const offers: Offer[] = [
    {
      id: 'off-founder-40',
      title: '40% OFF Annual Membership for First 50 Members',
      badge: 'Limited Founder Special',
      description: 'Exclusive inaugural promotion verified from front desk reception flyer. Includes free locker facility, gym kit, and induction.',
      discount: '40% OFF',
      startDate: '2026-09-01',
      endDate: '2026-12-31',
      eligibility: 'First 50 Members who sign up for 12-Month Annual Membership.',
      active: true,
      createdAt: nowIso,
      updatedAt: nowIso
    }
  ];

  const leads: Lead[] = [
    {
      id: 'lead-001',
      name: 'Priya Sharma',
      phone: '9845012345',
      email: 'priya.sharma@example.com',
      type: 'Free Trial',
      source: 'Website',
      preferredDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      preferredTime: 'Evening (05:00 PM - 08:00 PM)',
      fitnessGoal: 'Lose Weight & Tone',
      message: 'Looking for group classes and personal coaching.',
      status: 'NEW',
      followUpNotes: 'Enquiry received online. Ready for front desk call.',
      createdAt: nowIso,
      updatedAt: nowIso
    },
    {
      id: 'lead-002',
      name: 'Rohan Deshmukh',
      phone: '9880198765',
      email: 'rohan.d@example.com',
      type: 'Membership',
      source: 'WhatsApp',
      fitnessGoal: 'Build Muscle',
      message: 'Interested in the 40% OFF Annual Membership.',
      status: 'CONTACTED',
      followUpNotes: 'Sent fee breakdown via WhatsApp. Scheduled floor visit for Saturday.',
      createdAt: nowIso,
      updatedAt: nowIso
    }
  ];

  const notifications: Notification[] = [
    {
      id: 'notif-1',
      userId: memberUser.id,
      type: 'membership',
      title: 'Membership Expiring Soon',
      message: 'Your 3 Month Commitment will expire in 15 days. Tap to submit a renewal enquiry.',
      read: false,
      link: '/member/membership',
      createdAt: nowIso
    },
    {
      id: 'notif-2',
      userId: memberUser.id,
      type: 'announcement',
      title: 'Saturday Conditioning Camp',
      message: 'Join Coach for the Weekend Strength & Conditioning Camp at 8:30 AM this Saturday.',
      read: true,
      link: '/member/classes',
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  return {
    users: [adminUser, staffUser, memberUser],
    members: [memberProfile],
    plans,
    memberships: [membership],
    attendance,
    workouts: [workoutPlan],
    trainers,
    classes,
    classBookings: [],
    trainerBookings: [],
    leads,
    notifications,
    offers,
    progress
  };
}

export const db = {
  get(): DatabaseSchema {
    if (cachedDb) return cachedDb;
    const dbFile = getDbFilePath();
    ensureDataDirectory(dbFile);

    if (!fs.existsSync(dbFile)) {
      const initial = getInitialDatabaseSeed();
      this.save(initial);
      cachedDb = initial;
      return initial;
    }

    try {
      const raw = fs.readFileSync(dbFile, 'utf-8');
      cachedDb = JSON.parse(raw);
      return cachedDb!;
    } catch (parseErr) {
      console.error('[Database Store] Warning: db.json corrupted or unreadable. Checking backup...', parseErr);
      const backupFile = `${dbFile}.bak`;
      if (fs.existsSync(backupFile)) {
        try {
          const rawBak = fs.readFileSync(backupFile, 'utf-8');
          cachedDb = JSON.parse(rawBak);
          console.info('[Database Store] Successfully recovered from db.json.bak!');
          return cachedDb!;
        } catch {}
      }
      const initial = getInitialDatabaseSeed();
      this.save(initial);
      cachedDb = initial;
      return initial;
    }
  },

  save(data: DatabaseSchema): void {
    const dbFile = getDbFilePath();
    ensureDataDirectory(dbFile);
    cachedDb = data;
    try {
      const serialized = JSON.stringify(data, null, 2);
      const tempFile = `${dbFile}.tmp.${Date.now()}.${Math.floor(Math.random() * 1000)}`;
      fs.writeFileSync(tempFile, serialized, 'utf-8');

      // Maintain a safe backup before atomic replacement
      if (fs.existsSync(dbFile)) {
        try {
          fs.copyFileSync(dbFile, `${dbFile}.bak`);
        } catch {}
      }

      // Atomic replace
      fs.renameSync(tempFile, dbFile);
    } catch (err) {
      console.error('Warning: could not write db.json directly:', err);
    }
  }
};
