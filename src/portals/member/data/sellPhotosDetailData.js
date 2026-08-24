import { ROUTES } from '@/shared/config';
import { BUY_PHOTO_DEFAULT_SPECS } from '@/shared/data/buyPhotos';
import { SIX_STORY_SLIDES } from '@/shared/data/gallerySixStory';
import { SIX_BLUE_STORY_SLIDES } from '@/shared/data/gallerySixStoryBlue';
import { TWELVE_STORY_SLIDES } from '@/shared/data/galleryTwelveStory';
import {
  GALLERY_DETAIL_ASSETS,
  toGalleryDetailEntry,
} from '@/shared/data/galleryDetail';
import { SELL_PHOTOS_ITEMS } from '@/portals/member/data/sellPhotosData';

export const sellPhotoDetailPath = (id) =>
  `${ROUTES.ADMIN_SELL_PHOTOS}/${encodeURIComponent(id)}`;

const resolveVariant = (item) => {
  const albumBadge = item.albumBadge ?? '';
  if (/12\s*photos?/i.test(albumBadge)) return 'twelve';
  if (/6\s*photos?/i.test(albumBadge)) {
    return item.storyTheme === 'blue' ? 'sixBlue' : 'six';
  }
  return 'single';
};

const resolveSlides = (item, variant) => {
  if (variant === 'six') {
    return SIX_STORY_SLIDES.map((slide, index) => ({
      ...slide,
      hero: index === 0 ? item.image : slide.hero,
      thumb: index === 0 ? item.image : slide.thumb,
    }));
  }
  if (variant === 'sixBlue') {
    return SIX_BLUE_STORY_SLIDES.map((slide, index) => ({
      ...slide,
      hero: index === 0 ? item.image : slide.hero,
      thumb: index === 0 ? item.image : slide.thumb,
    }));
  }
  if (variant === 'twelve') {
    return TWELVE_STORY_SLIDES.map((slide, index) => ({
      ...slide,
      hero: index === 0 ? item.image : slide.hero,
      thumb: index === 0 ? item.image : slide.thumb,
    }));
  }
  return toGalleryDetailEntry(item).slides;
};

const parseMetric = (value, fallback) => {
  const normalized = String(value ?? '').replace(/,/g, '');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) && parsed > 0 ? value : fallback;
};

export const getSellPhotoDetailById = (id) => {
  const item = SELL_PHOTOS_ITEMS.find((entry) => entry.id === id);
  if (!item) return null;

  const variant = resolveVariant(item);
  const slides = resolveSlides(item, variant);

  return {
    ...item,
    variant,
    slides,
    badge: item.albumBadge,
    category: item.category ?? 'Nature',
    price: item.detailPrice ?? item.price,
    resolution: item.resolution ?? BUY_PHOTO_DEFAULT_SPECS.resolution,
    format: item.format ?? BUY_PHOTO_DEFAULT_SPECS.format,
    camera: item.camera ?? BUY_PHOTO_DEFAULT_SPECS.camera,
    likesMetric: parseMetric(item.hearts, '2150'),
    viewsMetric: parseMetric(item.views, '12400'),
    totalSellMetric: parseMetric(item.totalSell, '120'),
    videoPoster: item.image,
    commentAvatar: GALLERY_DETAIL_ASSETS.commentAvatar,
  };
};

export const getDefaultSellPhotoDetail = () =>
  getSellPhotoDetailById(SELL_PHOTOS_ITEMS[0]?.id) ?? null;
