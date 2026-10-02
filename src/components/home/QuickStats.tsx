import { ShieldCheck, Dumbbell, Users, Trophy } from 'lucide-react';

export const QuickStats: React.FC = () => {
  const statItems = [
    {
      icon: <Dumbbell className="w-5 h-5 text-[#D4AF37]" />,
      value: '100%',
      label: 'Olympic Equipment Standard',
      caption: 'Calibrated barbells & heavy-duty steel power racks',
      isVerified: true
    },
    {
      icon: <Users className="w-5 h-5 text-[#38BDF8]" />,
      value: '[MEMBER COUNT]',
      label: 'Active Dedicated Community',
      caption: 'Placeholder pending verified gym roster update',
      isVerified: false
    },
    {
      icon: <Trophy className="w-5 h-5 text-[#F97316]" />,
      value: '[TRAINER COUNT]',
      label: 'Certified Fitness Specialists',
      caption: 'Strength, mobility & functional conditioning experts',
      isVerified: false
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#A855F7]" />,
      value: '6',
      label: 'Signature Training Programs',
      caption: 'Periodized pathways from strength to fat loss',
      isVerified: true
    }
  ];

  return (
    <section className="py-12 bg-[#090A0D] border-y border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statItems.map((stat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#11151D] border border-white/10 hover:border-white/20 transition-all duration-300 relative group overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  {stat.icon}
                </div>
                {!stat.isVerified && (
                  <span className="text-[9px] uppercase tracking-wider text-[#8F9CAE] bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                    Data Placeholder
                  </span>
                )}
              </div>

              <div className="font-athletic text-3xl sm:text-4xl text-white tracking-wide mb-1 group-hover:text-[#D4AF37] transition-colors">
                {stat.value}
              </div>

              <div className="font-display font-bold text-xs uppercase tracking-wider text-gray-200">
                {stat.label}
              </div>

              <div className="text-[11px] text-[#8F9CAE] mt-1 leading-snug">
                {stat.caption}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
