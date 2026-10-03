/**
 * XING FITNESS — REAL VERIFIED OFFER POSTERS
 * Directly sourced from official Xing Fitness offer creatives.
 *
 * 1. 30% OFF Annual Membership
 * 2. Up to 40% OFF Annual Membership — Couples Offer
 * 3. 20% OFF Personal Training
 * 4. ₹1,999 — Body Workouts & HIIT Classes — 12 Sessions
 */

export interface VerifiedOffer {
  id: string;
  title: string;
  badge: string;
  discount: string;
  highlightText: string;
  posterImage: string;
  enquiryValue: string;
  whatsappMessage: string;
  callAction: string;
  altText: string;
  description: string;
}

export const VERIFIED_OFFERS: VerifiedOffer[] = [
  {
    id: 'offer-annual-30',
    title: '30% OFF Annual Membership',
    badge: '30% OFF',
    discount: '30% OFF',
    highlightText: 'Annual Membership — 30% Off',
    description: 'Build a workout routine that lasts with 365 days of full access to the Xing Fitness commercial Matrix equipment, free weights floor, and cardio deck.',
    posterImage: '/images/offers/offer-annual-30.png',
    enquiryValue: '30% OFF Annual Membership',
    whatsappMessage: 'Hi Xing Fitness, I am interested in the 30% Off Annual Membership offer. Please share the details.',
    callAction: 'tel:+918970000122',
    altText: 'Xing Fitness Original Poster: 30% Off Annual Membership - Fitness That Fits Your Goals'
  },
  {
    id: 'offer-couples-40',
    title: 'Up to 40% OFF Annual Membership — Couples Offer',
    badge: 'UP TO 40% OFF',
    discount: 'UP TO 40% OFF',
    highlightText: 'Couples Offer — Up to 40% Off on Annual Membership',
    description: 'Partner up and save with our special couples annual membership covering full club access, Matrix machinery, and group studio classes in Brookefield.',
    posterImage: '/images/offers/offer-couples-40.png',
    enquiryValue: 'Up to 40% OFF Couples Annual Membership',
    whatsappMessage: 'Hi Xing Fitness, I am interested in the Up to 40% Off Couples Annual Membership offer. Please share the details.',
    callAction: 'tel:+918970000122',
    altText: 'Xing Fitness Original Poster: Couples Offer Up to 40% Off on Annual Membership - Don’t Skip Workouts'
  },
  {
    id: 'offer-pt-20',
    title: '20% OFF Personal Training',
    badge: '20% OFF',
    discount: '20% OFF',
    highlightText: 'Personal Training — Flat 20% Off',
    description: 'Dedicated 1-on-1 coaching, tailored workout splits, biomechanical movement correction, and nutritional accountability with certified trainers.',
    posterImage: '/images/offers/offer-pt-20.png',
    enquiryValue: '20% OFF Personal Training',
    whatsappMessage: 'Hi Xing Fitness, I am interested in the 20% Off Personal Training offer. Please share the details.',
    callAction: 'tel:+918970000122',
    altText: 'Xing Fitness Original Poster: Flat 20% Off on Personal Training - A Stronger Fitter You'
  },
  {
    id: 'offer-hiit-1999',
    title: '₹1,999 — Body Workouts & HIIT Classes — 12 Sessions',
    badge: '₹1,999 ONLY',
    discount: '₹1,999 ONLY',
    highlightText: 'Body Workouts & HIIT Classes — 12 Sessions @ ₹1,999 Only',
    description: '12 high-energy HIIT and full body conditioning studio sessions designed to build functional cardiovascular stamina and burn fat.',
    posterImage: '/images/offers/offer-hiit-1999.png',
    enquiryValue: '12 HIIT Sessions for ₹1,999',
    whatsappMessage: 'Hi Xing Fitness, I am interested in the 12 HIIT Sessions for ₹1,999 offer. Please share the details.',
    callAction: 'tel:+918970000122',
    altText: 'Xing Fitness Original Poster: Body Workouts & HIIT Classes 12 Sessions ₹1,999 Only (Original ₹2,499)'
  }
];
