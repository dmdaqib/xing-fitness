import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { GALLERY_PHOTOS, GALLERY_FILTERS, type GalleryFilter } from '../../data/gallery';

export const GalleryLightbox: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<GalleryFilter>('ALL');
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const filteredPhotos = activeFilter === 'ALL'
    ? GALLERY_PHOTOS
    : GALLERY_PHOTOS.filter((p) => p.tags.includes(activeFilter));

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePhotoIndex === null) return;
      if (e.key === 'Escape') setActivePhotoIndex(null);
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIndex, filteredPhotos.length]);

  const nextPhoto = () => {
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((activePhotoIndex + 1) % filteredPhotos.length);
  };

  const prevPhoto = () => {
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((activePhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
  };

  const currentPhoto = activePhotoIndex !== null ? filteredPhotos[activePhotoIndex] : null;

  return (
    <div>
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar justify-start sm:justify-center">
        {GALLERY_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => {
              setActiveFilter(f.id);
              setActivePhotoIndex(null);
            }}
            className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-display font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeFilter === f.id
                ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20'
                : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border border-white/10'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Responsive Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map((photo, idx) => (
          <div
            key={photo.id}
            onClick={() => setActivePhotoIndex(idx)}
            className="group relative rounded-3xl overflow-hidden aspect-[4/3] bg-[#121620] border border-white/10 hover:border-white/25 cursor-pointer shadow-xl transition-all duration-300"
          >
            <picture>
              <source srcSet={photo.thumbnail} type="image/webp" />
              <img
                src={photo.thumbnail}
                alt={photo.alt}
                width={600}
                height={400}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

            {/* Overlay content */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                  {photo.category}
                </span>
                <h4 className="font-display font-bold text-sm sm:text-base text-white mt-0.5">
                  {photo.title}
                </h4>
              </div>

              <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <Eye className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {currentPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setActivePhotoIndex(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50 cursor-pointer"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevPhoto();
            }}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50 cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextPhoto();
            }}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50 cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Modal Container */}
          <div className="relative max-w-5xl max-h-[85vh] flex flex-col items-center">
            <picture>
              <source srcSet={currentPhoto.image} type="image/webp" />
              <img
                src={currentPhoto.imageJpg}
                alt={currentPhoto.alt}
                className="max-h-[75vh] w-auto object-contain rounded-2xl shadow-2xl border border-white/10"
              />
            </picture>
            <div className="mt-4 text-center max-w-xl">
              <h4 className="font-display font-bold text-lg text-white">
                {currentPhoto.title}
              </h4>
              <p className="text-xs text-[#94A3B8] mt-1">
                {currentPhoto.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
