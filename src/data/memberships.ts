import type { MembershipPlan } from '../types';

/**
 * XING FITNESS - MEMBERSHIP TIERS
 * Note: Exact prices are not invented. Memberships use direct inquiry/contact CTAs
 * to connect prospective members with current verified desk rates and seasonal offers.
 */

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 'monthly',
    name: 'Monthly Membership',
    tier: 'monthly',
    periodLabel: 'per month',
    pricePlaceholder: 'Enquire for Rates',
    priceNote: 'Flexible month-to-month access, ideal for short-term projects or trying out the facility',
    features: [
      'Full access to all commercial Matrix strength equipment & free weights',
      'Access to commercial cardio deck with running treadmills and bikes',
      'Locker room and shower facilities',
      'Complimentary initial movement induction on the floor',
      'On-site two-wheeler and four-wheeler parking'
    ],
    nonFeatures: [
      'Complimentary personal training sessions'
    ],
    ctaText: 'Enquire for Monthly'
  },
  {
    id: 'quarterly',
    name: 'Quarterly Membership',
    tier: 'quarterly',
    periodLabel: '3 months',
    pricePlaceholder: 'Enquire for Rates',
    priceNote: 'Popular option for focused 90-day fitness targets and seasonal workout consistency',
    popular: false,
    features: [
      'Full access to main floor, strength zone & cardio deck',
      'Access to locker rooms and shower amenities',
      'Personalized gym floor guidance and routine walkthrough',
      'Workout tracking support from certified floor coaches',
      'On-site member parking in AECS Layout facility'
    ],
    ctaText: 'Enquire for Quarterly'
  },
  {
    id: 'half-yearly',
    name: 'Half-Yearly Pass',
    tier: 'half-yearly',
    periodLabel: '6 months',
    pricePlaceholder: 'Enquire for Rates',
    priceNote: 'Optimal balance of commitment, progressive strength development, and membership value',
    popular: true,
    features: [
      'Unlimited access across all gym operational hours (Mon-Sat & Sun)',
      'Floor coach guidance and technique form screening',
      'Complimentary workout freeze privilege (terms apply)',
      'Locker room, clean showers, and changing facilities',
      'On-site member parking with security'
    ],
    ctaText: 'Enquire for 6 Months'
  },
  {
    id: 'annual',
    name: 'Annual Membership',
    tier: 'annual',
    periodLabel: '12 months',
    pricePlaceholder: 'Enquire for Rates',
    priceNote: 'Best overall value for year-round fitness consistency and long-term health',
    bestValue: true,
    features: [
      '365 Days priority access to all Xing Fitness zones',
      'Eligible for inaugural and seasonal discount offers',
      'Comprehensive floor coaching and periodic goal check-ins',
      'Membership pause/freeze privilege for travel/leaves',
      'Locker room and shower amenities',
      'On-site parking in Brookefield facility'
    ],
    ctaText: 'Enquire for Annual'
  }
];
