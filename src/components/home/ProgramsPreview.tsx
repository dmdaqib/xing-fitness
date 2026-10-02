import React from 'react';
import { Link } from 'react-router-dom';
import { Users, CreditCard, Target, ArrowRight } from 'lucide-react';

interface ProgramsPreviewProps {
  onOpenTrialModal: (goal?: string) => void;
}

export const ProgramsPreview: React.FC<ProgramsPreviewProps> = ({ onOpenTrialModal }) => {
  const pillars = [
    {
      category: 'Category A',
      title: 'Group Classes',
      subtitle: 'Studio Sessions & Conditioning',
      desc: 'Coach-led HIIT, CrossFit, Zumba, Yoga, functional training, and group fitness classes inside our dedicated sprung-wood studio.',
      icon: Users,
      actionText: 'Explore Classes',
      anchor: '/programs#group-classes',
      image: '/images/real/group-studio/xing-fitness-aerobic-dance-studio-purple-md.webp',
      badge: 'HIIT • CrossFit • Zumba • Yoga'
    },
    {
      category: 'Category B',
      title: 'Facility Memberships',
      subtitle: 'Commercial Gym Access',
      desc: 'Flexible monthly, quarterly, half-yearly, and annual memberships with full Matrix machinery access and clean locker amenities.',
      icon: CreditCard,
      actionText: 'View Memberships',
      anchor: '/programs#memberships',
      image: '/images/real/training-floor/xing-fitness-training-floor-panoramic-md.webp',
      badge: 'Transparent Desk Rates'
    },
    {
      category: 'Category C',
      title: 'Outcome-Based Packages',
      subtitle: 'Targeted Fitness Roadmaps',
      desc: 'Tailored coaching frameworks for Strength Training, Weight Loss, 1-on-1 Personal Training, and General Longevity Fitness.',
      icon: Target,
      actionText: 'Explore Packages',
      anchor: '/programs#outcome-packages',
      image: '/images/real/equipment/xing-fitness-matrix-strength-stations-md.webp',
      badge: 'Customized Support'
    }
  ];

  return (
    <section className="py-20 bg-[#090A0D] border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
              Three Clear Categories
            </span>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-white mt-1">
              PROGRAMS & TRAINING OPTIONS
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] max-w-xl mt-2 leading-relaxed">
              We structure our offerings into three clear formats: group studio classes, gym floor access memberships, and customized outcome roadmaps.
            </p>
          </div>

          <Link
            to="/programs"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D4AF37] hover:text-[#C5A028] transition-colors group shrink-0"
          >
            <span>View Full Program Catalog</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="rounded-3xl bg-[#14161D] border border-white/10 hover:border-[#D4AF37]/40 transition-all flex flex-col justify-between overflow-hidden group shadow-xl"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-black">
                    <img
                      src={pillar.image}
                      alt={pillar.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#14161D] via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider border border-white/15">
                        {pillar.badge}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-2">
                      <Icon className="w-4 h-4" />
                      <span>{pillar.category}</span>
                    </div>

                    <h3 className="font-display font-black text-xl sm:text-2xl text-white mb-1">
                      {pillar.title}
                    </h3>
                    <div className="text-xs text-gray-400 font-medium mb-4">
                      {pillar.subtitle}
                    </div>

                    <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed mb-6">
                      {pillar.desc}
                    </p>
                  </div>
                </div>

                <div className="p-6 sm:p-8 pt-0 flex items-center gap-3">
                  <Link
                    to={pillar.anchor}
                    className="flex-1 py-3 rounded-full bg-white/5 hover:bg-[#D4AF37] hover:text-black border border-white/10 text-center font-display font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    {pillar.actionText}
                  </Link>
                  <button
                    type="button"
                    onClick={() => onOpenTrialModal(pillar.title)}
                    className="px-4 py-3 rounded-full bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                    title="Book Free Trial"
                  >
                    Trial Pass
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
