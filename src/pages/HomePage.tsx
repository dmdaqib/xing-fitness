import React from 'react';
import { Hero } from '../components/home/Hero';
import { BrandIntro } from '../components/home/BrandIntro';
import { WhyChoosePreview } from '../components/home/WhyChoosePreview';
import { ProgramsPreview } from '../components/home/ProgramsPreview';
import { OffersPreview } from '../components/home/OffersPreview';
import { BlogPreview } from '../components/home/BlogPreview';
import { FinalCTASection } from '../components/home/FinalCTASection';
import { LocationSection } from '../components/home/LocationSection';

interface HomePageProps {
  onOpenTrialModal: (goal?: string) => void;
  onOpenEnquiryModal: (plan?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenTrialModal,
  onOpenEnquiryModal
}) => {
  return (
    <main className="bg-[#090A0D]">
      {/* 1. HERO SECTION (Conversion-Focused with Real Gym Photo, Headline, Trial CTA, WhatsApp CTA) */}
      <Hero onOpenTrialModal={() => onOpenTrialModal('General Free Trial')} />

      {/* 2. SHORT INTRODUCTION TO XING FITNESS (Warm Wood, Modern Lighting & Gym Ethos) */}
      <BrandIntro />

      {/* 3. QUICK PREVIEW OF WHY CHOOSE XING FITNESS */}
      <WhyChoosePreview />

      {/* 4. QUICK PREVIEW OF PROGRAMS (Group Classes, Memberships, Outcome Packages) */}
      <ProgramsPreview onOpenTrialModal={onOpenTrialModal} />

      {/* 5. CURRENT OFFERS PREVIEW (Founder 40% OFF Special) */}
      <OffersPreview
        onOpenEnquiryModal={onOpenEnquiryModal}
        onOpenTrialModal={onOpenTrialModal}
      />

      {/* 6. QUICK PREVIEW OF FITNESS BLOG (Evidence-Based Exercise & Nutrition) */}
      <BlogPreview />

      {/* 7. STRONG FINAL CTA SECTION */}
      <FinalCTASection onOpenTrialModal={() => onOpenTrialModal('Final Free Trial CTA')} />

      {/* 8. VISIT XING FITNESS / GOOGLE MAPS LOCATION SECTION */}
      <LocationSection />
    </main>
  );
};
