import { BookOpen, Camera, Sparkles } from 'lucide-react';
import { ROUTES } from '@/shared/config';

/** Upload Photos tier cards — Figma node 111:1692. */
export const UPLOAD_TIERS = [
  {
    id: 'single',
    icon: Camera,
    titleKey: 'uploadPhotos.tiers.single.title',
    descriptionKey: 'uploadPhotos.tiers.single.description',
    featureKeys: [
      'uploadPhotos.tiers.single.features.0',
      'uploadPhotos.tiers.single.features.1',
      'uploadPhotos.tiers.single.features.2',
    ],
    price: '$1500.00',
    popular: false,
    titleUppercase: false,
  },
  {
    id: 'story6',
    icon: BookOpen,
    titleKey: 'uploadPhotos.tiers.story6.title',
    descriptionKey: 'uploadPhotos.tiers.story6.description',
    featureKeys: [
      'uploadPhotos.tiers.story6.features.0',
      'uploadPhotos.tiers.story6.features.1',
      'uploadPhotos.tiers.story6.features.2',
    ],
    price: '$2500.00',
    popular: true,
    titleUppercase: false,
  },
  {
    id: 'zodiac12',
    icon: Sparkles,
    titleKey: 'uploadPhotos.tiers.zodiac12.title',
    descriptionKey: 'uploadPhotos.tiers.zodiac12.description',
    featureKeys: [
      'uploadPhotos.tiers.zodiac12.features.0',
      'uploadPhotos.tiers.zodiac12.features.1',
      'uploadPhotos.tiers.zodiac12.features.2',
    ],
    price: '$3500.00',
    popular: false,
    titleUppercase: true,
  },
];

export const UPLOAD_ROUTE_SETS = {
  standalone: {
    hub: ROUTES.ADMIN_UPLOAD_PHOTOS,
    single: ROUTES.ADMIN_UPLOAD_SINGLE,
    story6: ROUTES.ADMIN_UPLOAD_SIX,
    zodiac12: ROUTES.ADMIN_UPLOAD_ZODIAC12,
  },
  artwork: {
    hub: ROUTES.ADMIN_MY_ARTWORK_UPLOAD,
    single: ROUTES.ADMIN_MY_ARTWORK_UPLOAD_SINGLE,
    story6: ROUTES.ADMIN_MY_ARTWORK_UPLOAD_SIX,
    zodiac12: ROUTES.ADMIN_MY_ARTWORK_UPLOAD_ZODIAC12,
  },
  sell: {
    hub: ROUTES.ADMIN_SELL_PHOTOS_UPLOAD,
    single: ROUTES.ADMIN_SELL_PHOTOS_UPLOAD_SINGLE,
    story6: ROUTES.ADMIN_SELL_PHOTOS_UPLOAD_SIX,
    zodiac12: ROUTES.ADMIN_SELL_PHOTOS_UPLOAD_ZODIAC12,
  },
};

export const getUploadTierHref = (tierId, routeSet = UPLOAD_ROUTE_SETS.artwork) => {
  if (tierId === 'single') return routeSet.single;
  if (tierId === 'story6') return routeSet.story6;
  if (tierId === 'zodiac12') return routeSet.zodiac12;
  return null;
};
