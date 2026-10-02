import React from 'react';
import { GalleryLightbox } from '../components/gallery/GalleryLightbox';
import { SectionHeading } from '../components/common/SectionHeading';

export const GalleryPage: React.FC = () => {
  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Visual Storytelling"
          title="XING FITNESS GALLERY"
          subtitle="Real photographs from our Brookefield, Whitefield training facility: strength arena, functional sprint turf, cardio deck, and community."
        />

        <GalleryLightbox />
      </div>
    </div>
  );
};
