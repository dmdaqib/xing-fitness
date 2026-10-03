import type { Trainer } from '../types';

/**
 * ============================================================================
 * XING FITNESS - TRAINER ROSTER DATA
 * ============================================================================
 * 
 * Verified Trainers:
 * 1. Preetam (Fitness Trainer)
 * 2. Arvind (Fitness Trainer)
 * 3. Surbhi (Zumba / Fitness Trainer)
 * 
 * PHOTO REPLACEMENT:
 * When official photos are ready, place them in public/images/trainers/:
 *   - /images/trainers/preetam.jpg
 *   - /images/trainers/arvind.jpg
 *   - /images/trainers/surbhi.jpg
 * ============================================================================
 */

export const TRAINERS: Trainer[] = [
  {
    id: 'preetam',
    slug: 'preetam',
    name: 'Preetam',
    role: 'Fitness Trainer',
    photo: '/images/trainers/preetam.jpg',
    image: '/images/trainers/preetam.jpg',
    hasRealPhoto: false,
    bio: 'Preetam provides disciplined, personalized fitness coaching designed to help members achieve lasting results through progressive strength training and proper exercise mechanics. He focuses on muscle building, safe weight-loss support, and step-by-step guidance that builds training confidence on the gym floor.',
    trainingFocus: [
      'Strength Training',
      'Weight Loss Support',
      'Muscle Building',
      'General Fitness',
      'Personalized Workout Guidance',
      'Proper Exercise Technique',
      'Progressive Training'
    ],
    specialization: [
      'Strength Training',
      'Weight Loss Support',
      'Muscle Building',
      'General Fitness',
      'Exercise Technique'
    ],
    instagram: 'https://www.instagram.com/xing.fitnessclub'
  },
  {
    id: 'arvind',
    slug: 'arvind',
    name: 'Arvind',
    role: 'Fitness Trainer',
    photo: '/images/trainers/arvind.jpg',
    image: '/images/trainers/arvind.jpg',
    hasRealPhoto: false,
    bio: 'Arvind takes a functional, movement-first approach to fitness, helping members develop full-body strength, mobility, and long-term physical conditioning. His coaching emphasizes workout consistency, effective fat-loss strategies, and refined technique so members move efficiently and stay injury-free.',
    trainingFocus: [
      'Functional Fitness',
      'Strength & Conditioning',
      'Fat Loss Support',
      'Mobility & Movement',
      'Fitness Consistency',
      'Personalized Training',
      'Exercise Technique'
    ],
    specialization: [
      'Functional Fitness',
      'Strength & Conditioning',
      'Fat Loss Support',
      'Mobility',
      'Fitness Consistency'
    ],
    instagram: 'https://www.instagram.com/xing.fitnessclub'
  },
  {
    id: 'surbhi',
    slug: 'surbhi',
    name: 'Surbhi',
    role: 'Zumba / Fitness Trainer',
    photo: '/images/trainers/surbhi.jpg',
    image: '/images/trainers/surbhi.jpg',
    hasRealPhoto: false,
    bio: 'Surbhi leads dynamic Zumba and group fitness sessions that combine uplifting music, dance-inspired rhythms, and cardio conditioning into a motivating full-body workout. Her classes prioritize coordination, high energy, and an inclusive, beginner-friendly atmosphere where staying active is genuinely enjoyable.',
    trainingFocus: [
      'Zumba Classes',
      'Dance-Based Fitness',
      'Cardio Conditioning',
      'Full-Body Movement',
      'Coordination & Rhythm',
      'Energy & Engagement',
      'Beginner-Friendly Workouts',
      'Enjoyable Group Workouts'
    ],
    specialization: [
      'Zumba Classes',
      'Dance-Based Fitness',
      'Cardio Conditioning',
      'Group Fitness',
      'Full-Body Movement'
    ],
    instagram: 'https://www.instagram.com/xing.fitnessclub'
  }
];
