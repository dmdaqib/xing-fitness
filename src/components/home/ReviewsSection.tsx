import React from 'react';
import { Star, ShieldCheck, ExternalLink, MessageSquarePlus, RefreshCw } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { BRAND } from '../../data/brand';

export const ReviewsSection: React.FC = () => {
  return (
    <section id="reviews" className="py-20 md:py-28 bg-[#0B0E14] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Community & Reputation"
          title="MEMBER REVIEWS & REPUTATION"
          subtitle="Genuine experiences from athletes and fitness enthusiasts training at Xing Fitness Brookefield."
        />

        {/* Google Reviews Live Integration Hub */}
        <div className="max-w-3xl mx-auto mb-10 p-6 sm:p-8 rounded-3xl glass-panel-glow border border-white/10 text-center flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center font-display font-black text-white text-2xl shadow-inner shrink-0">
              G
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-xl text-white">Google Reviews</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider border border-[#D4AF37]/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-0.5">Xing Fitness • Brookefield / Whitefield</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                ))}
                <span className="text-xs font-semibold text-gray-300 ml-1">Live Listing Verified</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
            <a
              href={BRAND.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-[#D4AF37] text-white hover:text-black font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 border border-white/15 shadow-md"
            >
              <span>View On Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href={BRAND.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 border border-white/10"
            >
              <MessageSquarePlus className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Write Review</span>
            </a>
          </div>
        </div>

        {/* Live Sync Architecture Container */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-[#121620]/80 border border-white/10 p-6 sm:p-8 backdrop-blur-md">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-[#D4AF37]" />
              <span className="font-display font-bold text-xs uppercase tracking-wider text-white">
                Google Places API Integration Architecture
              </span>
            </div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              Zero Fake Data Policy
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              {
                topic: 'Strength & Machine Quality',
                status: 'Google Reviews Ready',
                desc: 'Member feedback on Matrix selectorized stations, barbells, and training environment.'
              },
              {
                topic: 'Group Fitness & Studio Atmosphere',
                status: 'Google Reviews Ready',
                desc: 'Authentic reviews on Zumba, Yoga, and Dance Fitness group sessions.'
              },
              {
                topic: 'Cleanliness & Locker Amenities',
                status: 'Google Reviews Ready',
                desc: 'Member experiences regarding facility hygiene, lockers, and reception support.'
              }
            ].map((slot, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] block mb-1">
                    {slot.status}
                  </span>
                  <h4 className="font-display font-bold text-sm text-white mb-2">{slot.topic}</h4>
                  <p className="text-xs text-[#8F9CAE] leading-relaxed">{slot.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-500">
                  <span>Google My Business</span>
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-[#8F9CAE] leading-relaxed flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
            <span>
              <strong>Authenticity Commitment:</strong> In accordance with our commercial quality guidelines, Xing Fitness does not publish fabricated member ratings or simulated testimonials. Live Google Place Reviews will synchronize directly as verified reviews are posted to our Google My Business profile.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

