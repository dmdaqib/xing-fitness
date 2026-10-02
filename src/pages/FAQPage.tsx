import React, { useState } from 'react';
import { SectionHeading } from '../components/common/SectionHeading';
import { FAQ_DATA } from '../data/faq';
import { ChevronDown, Search } from 'lucide-react';
import type { FAQItem } from '../types';

export const FAQPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState<string | null>(FAQ_DATA[0].id);
  const [selectedCat, setSelectedCat] = useState('All');

  const categories = ['All', 'Free Trial', 'Gym Timings', 'Membership', 'Personal Training', 'Facilities', 'Parking', 'Location', 'Payments', 'Cancellation'];

  const filtered = FAQ_DATA.filter((item: FAQItem) => {
    const matchesCat = selectedCat === 'All' || item.category === selectedCat;
    const matchesSearch = item.question.toLowerCase().includes(search.toLowerCase()) ||
                          item.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Knowledge Base"
          title="FREQUENTLY ASKED QUESTIONS"
          subtitle="Everything regarding memberships, trial workouts, equipment standards, and operating rules at Xing Fitness Brookefield."
        />

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions (e.g. parking, timing, trial, personal training)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#121620] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCat === cat
                  ? 'bg-[#D4AF37] text-black shadow-md font-bold'
                  : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Items List */}
        <div className="space-y-3">
          {filtered.length > 0 ? (
            filtered.map((item: FAQItem) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  className="rounded-2xl bg-[#121620] border border-white/10 overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  >
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-widest block mb-1">
                        {item.category}
                      </span>
                      <span className="font-display font-bold text-sm sm:text-base text-white">
                        {item.question}
                      </span>
                    </div>
                    <div className={`p-1.5 rounded-full bg-white/5 text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#D4AF37]' : ''}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-[#94A3B8] leading-relaxed border-t border-white/5 pt-3">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-gray-400 rounded-2xl bg-white/[0.02]">
              No questions found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
