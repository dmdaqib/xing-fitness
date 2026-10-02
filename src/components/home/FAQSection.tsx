import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { FAQ_DATA } from '../../data/faq';

export const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(FAQ_DATA[0].id);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Free Trial', 'Membership', 'Gym Timings', 'Facilities', 'Personal Training', 'Parking'];

  const filtered = selectedCategory === 'All'
    ? FAQ_DATA
    : FAQ_DATA.filter((f) => f.category === selectedCategory);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-20 md:py-28 bg-[#090A0D] relative overflow-hidden" id="faq-section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Help & Clear Answers"
          title="FREQUENTLY ASKED QUESTIONS"
          subtitle="Everything you need to know about starting your fitness journey at Xing Fitness Brookefield."
        />

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar justify-start sm:justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#D4AF37] text-black shadow-md font-bold'
                  : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordions */}
        <div className="space-y-3">
          {filtered.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="rounded-2xl bg-[#121620] border border-white/10 overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-display font-bold text-sm sm:text-base text-white">
                    {item.question}
                  </span>
                  <div className={`p-1.5 rounded-full bg-white/5 text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#D4AF37]' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#94A3B8] leading-relaxed border-t border-white/5 pt-3 animate-in fade-in duration-200">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
