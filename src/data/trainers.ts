import type { Trainer } from '../types';

/**
 * ============================================================================
 * XING FITNESS - TRAINER ROSTER DATA
 * ============================================================================
 * 
 * TEMPORARY PLACEHOLDER CONTENT:
 * The profiles below are structured placeholders using professional fitness
 * placeholder photography. Fictional names/credentials are deliberately NOT used.
 * 
 * TO REPLACE / UPDATE TRAINER PROFILES FOR PRODUCTION:
 * Simply replace the fields below for each coach:
 *   1. image:          Path to coach portrait (e.g. '/images/trainers/coach-name.jpg')
 *   2. name:           Official Coach Name (e.g. 'Rahul Sharma')
 *   3. role:           Title / Position (e.g. 'Head Strength & Conditioning Coach')
 *   4. specialization: Array of disciplines (e.g. ['Biomechanics', 'Hypertrophy'])
 *   5. bio:            Short coaching bio & philosophy
 *   6. experience:     (Optional) Years in fitness/coaching
 *   7. certifications: (Optional) Array of verified certifications
 * ============================================================================
 */

export const TRAINERS: Trainer[] = [
  {
    id: 'trainer-01',
    slug: 'trainer-profile-01',
    name: 'Trainer Profile 01',
    isPlaceholderName: true,
    role: '[Role / Designation Placeholder]',
    specialization: [
      '[Specialization Placeholder 01]',
      '[Specialization Placeholder 02]',
      '[Specialization Placeholder 03]'
    ],
    experience: '[Years Experience Placeholder]',
    certifications: [
      '[Certification Placeholder 01]',
      '[Certification Placeholder 02]'
    ],
    bio: '[Short bio placeholder - Certified floor coaching background, lifting philosophy, and strength progression methodology to be updated.]',
    image: '/images/trainers/trainer-placeholder-01.jpg',
    instagram: 'https://www.instagram.com/xing.fitnessclub'
  },
  {
    id: 'trainer-02',
    slug: 'trainer-profile-02',
    name: 'Trainer Profile 02',
    isPlaceholderName: true,
    role: '[Role / Designation Placeholder]',
    specialization: [
      '[Specialization Placeholder 01]',
      '[Specialization Placeholder 02]',
      '[Specialization Placeholder 03]'
    ],
    experience: '[Years Experience Placeholder]',
    certifications: [
      '[Certification Placeholder 01]',
      '[Certification Placeholder 02]'
    ],
    bio: '[Short bio placeholder - Functional conditioning background, mobility screening, and movement longevity guidance to be updated.]',
    image: '/images/trainers/trainer-placeholder-02.jpg',
    instagram: 'https://www.instagram.com/xing.fitnessclub'
  },
  {
    id: 'trainer-03',
    slug: 'trainer-profile-03',
    name: 'Trainer Profile 03',
    isPlaceholderName: true,
    role: '[Role / Designation Placeholder]',
    specialization: [
      '[Specialization Placeholder 01]',
      '[Specialization Placeholder 02]',
      '[Specialization Placeholder 03]'
    ],
    experience: '[Years Experience Placeholder]',
    certifications: [
      '[Certification Placeholder 01]',
      '[Certification Placeholder 02]'
    ],
    bio: '[Short bio placeholder - Athletic strength programming, periodized progression, and form correction track record to be updated.]',
    image: '/images/trainers/trainer-placeholder-03.jpg',
    instagram: 'https://www.instagram.com/xing.fitnessclub'
  }
];
