import React, { useState } from 'react';
import { Dumbbell, Activity, Sparkles } from 'lucide-react';
import type { Trainer } from '../../types';

interface TrainerPhotoPlaceholderProps {
  trainer: Trainer;
  aspectRatio?: string;
  className?: string;
}

export const TrainerPhotoPlaceholder: React.FC<TrainerPhotoPlaceholderProps> = ({
  trainer,
  aspectRatio = 'aspect-[3/4]',
  className = ''
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Focus icon based on trainer id or name
  const getTrainerIcon = () => {
    const id = trainer.id.toLowerCase();
    if (id.includes('preetam')) return <Dumbbell className="w-5 h-5 text-[#D4AF37]" />;
    if (id.includes('arvind')) return <Activity className="w-5 h-5 text-[#D4AF37]" />;
    if (id.includes('surbhi')) return <Sparkles className="w-5 h-5 text-[#D4AF37]" />;
    return <Dumbbell className="w-5 h-5 text-[#D4AF37]" />;
  };

  const initial = trainer.name.charAt(0).toUpperCase();
  const photoSrc = trainer.photo || trainer.image;

  return (
    <div
      className={`relative ${aspectRatio} w-full overflow-hidden bg-gradient-to-b from-[#181B26] via-[#11131B] to-[#0A0B0E] select-none ${className}`}
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#D4AF37]/10 via-transparent to-transparent pointer-events-none" />

      {/* Decorative subtle geometric grid lines */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Attempt real image if provided and not errored */}
      {!imageError && photoSrc && (
        <img
          src={photoSrc}
          alt={trainer.name}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-700 ${
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
          }`}
        />
      )}

      {/* Elegant Luxury Placeholder UI (Shown when photo is pending or fails) */}
      {(!imageLoaded || imageError) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
          {/* Circular Gold Monogram Emblem */}
          <div className="relative mb-4 group-hover:scale-105 transition-transform duration-300">
            {/* Outer soft ring */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-[#D4AF37]/30 bg-gradient-to-br from-[#D4AF37]/15 via-black/60 to-[#0A0B0E] flex flex-col items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.12)]">
              <div className="text-3xl sm:text-4xl font-display font-black text-white tracking-wider">
                {initial}
              </div>
              <div className="mt-1">{getTrainerIcon()}</div>
            </div>
            {/* Subtle orbital accent dot */}
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#D4AF37] border-2 border-black" />
          </div>

          {/* Xing Fitness Brand Mark */}
          <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4AF37] mb-1">
            Xing Fitness Coach
          </div>

          {/* Coach Name */}
          <h3 className="font-display font-black text-xl sm:text-2xl text-white tracking-wide uppercase">
            {trainer.name}
          </h3>
        </div>
      )}

      {/* Subtle bottom vignette gradient to blend seamlessly into card */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#14161D] to-transparent pointer-events-none" />
    </div>
  );
};
