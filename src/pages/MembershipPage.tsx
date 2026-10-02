import React from 'react';
import { MembershipSection } from '../components/home/MembershipSection';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MembershipPageProps {
  onOpenEnquiryModal: (plan?: string) => void;
}

export const MembershipPage: React.FC<MembershipPageProps> = ({ onOpenEnquiryModal }) => {
  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MembershipSection onSelectPlan={(plan) => onOpenEnquiryModal(plan)} />

        {/* Member Privileges Deep Dive */}
        <div className="mt-16 max-w-4xl mx-auto p-8 rounded-3xl bg-[#121620] border border-white/10">
          <h3 className="font-display font-black text-2xl text-white mb-6">
            EVERY XING FITNESS MEMBERSHIP INCLUDES:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-gray-300">
            <div className="flex items-start gap-3">
              <Check className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <span>Full uninhibited access to all power racks, lifting platforms and cable suites</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <span>Access to the high-density indoor sprint turf and weighted prowler sleds</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <span>Digital keypad lockers, hot rainfall showers, and grooming amenities</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <span>Free high-speed WiFi, dedicated vehicle parking & security monitoring</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <span>Complimentary InBody biometric scan & movement screen upon joining</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <span>Freezing / pause allowance on 6-month and annual commitments</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-[#8F9CAE]">
            <span>Have questions about corporate or student discounts?</span>
            <Link to="/contact" className="text-[#D4AF37] font-semibold hover:underline">
              Contact Membership Desk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
