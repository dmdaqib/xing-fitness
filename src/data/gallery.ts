import { ALL_REAL_PHOTOS, type RealPhoto } from './realPhotos';

export type GalleryFilter = 'ALL' | 'GYM' | 'STRENGTH' | 'CARDIO' | 'EQUIPMENT' | 'GROUP FITNESS' | 'INTERIOR' | 'BRANDING';

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryFilter;
  tags: GalleryFilter[];
  image: string;
  imageJpg: string;
  imageMd: string;
  thumbnail: string;
  alt: string;
  caption: string;
}

export const GALLERY_FILTERS: { id: GalleryFilter; label: string }[] = [
  { id: 'ALL', label: 'All Photos' },
  { id: 'GYM', label: 'Gym Floor' },
  { id: 'STRENGTH', label: 'Strength' },
  { id: 'CARDIO', label: 'Cardio' },
  { id: 'EQUIPMENT', label: 'Equipment' },
  { id: 'GROUP FITNESS', label: 'Group Studio' },
  { id: 'INTERIOR', label: 'Interior & Murals' },
  { id: 'BRANDING', label: 'Club Branding' }
];

export const GALLERY_PHOTOS: GalleryItem[] = ALL_REAL_PHOTOS.map((photo: RealPhoto) => {
  return {
    id: photo.id,
    title: photo.title,
    category: photo.tags[1] || 'GYM',
    tags: photo.tags,
    image: photo.src,
    imageJpg: photo.srcJpg,
    imageMd: photo.srcMd,
    thumbnail: photo.srcThumb,
    alt: photo.alt,
    caption: photo.alt
  };
});
