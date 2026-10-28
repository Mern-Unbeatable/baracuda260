import { MY_ARTWORK_ITEMS } from '@/portals/member/data/myArtworkData';
import { COMPETITION_DETAILS } from '@/portals/public/competition-details/data/competitionDetailsAssets';
import { getArtworkPrimaryImage } from '@/shared/api/artworks.api';
import { ROUTES } from '@/shared/config';
import {
  GALLERY_DETAIL_ASSETS,
  toGalleryDetailEntry,
} from '@/shared/data/galleryDetail';
import { SIX_STORY_SLIDES } from '@/shared/data/gallerySixStory';
import { SIX_BLUE_STORY_SLIDES } from '@/shared/data/gallerySixStoryBlue';
import { TWELVE_STORY_SLIDES } from '@/shared/data/galleryTwelveStory';

const DETAIL_DESCRIPTION_KEY = 'myArtwork.detail.description';

export const myArtworkDetailPath = (id) =>
  `${ROUTES.USER_MY_ARTWORK}/${encodeURIComponent(id)}`;

const resolveVariant = (item) => {
  const albumBadge = item.albumBadge ?? '';
  const kind = String(item.kind || '').toUpperCase();
  if (kind.includes('TWELVE') || kind.includes('12') || /12\s*photos?/i.test(albumBadge)) return 'twelve';
  if (kind.includes('SIX') || kind.includes('6') || /6\s*photos?/i.test(albumBadge)) {
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
  return Number.isFinite(parsed) && parsed > 0 ? normalized : fallback;
};

/** Live competition entry only — profile-only and ended artwork use gallery detail (no rankings). */
export const isCompetitionArtwork = (item) => item?.footerState === 'active';

export const normalizeArtworkDetail = (item) => {
  if (!item) return null;

  const kind = String(item.kind || item.albumBadge || '').toUpperCase();
  let variant = 'single';
  let albumBadge = 'Single Photo';

  if (kind.includes('TWELVE') || kind.includes('12')) {
    variant = 'twelve';
    albumBadge = '12 photos - full Zodiac Story';
  } else if (kind.includes('SIX') || kind.includes('6')) {
    variant = item.storyTheme === 'blue' ? 'sixBlue' : 'six';
    albumBadge = '6 Photos Story';
  }

  const primaryImage =
    getArtworkPrimaryImage(item) ||
    item.image ||
    item.featuredImage ||
    '/assets/home/photo-wings.webp';

  let slides = [];
  if (variant === 'twelve') {
    slides = TWELVE_STORY_SLIDES.map((slide, index) => {
      const signKey = (slide.sign || '').toUpperCase();
      let imgUrl = null;
      if (item.images && typeof item.images === 'object') {
        if (!Array.isArray(item.images)) {
          imgUrl = item.images[signKey]?.url || item.images[slide.id]?.url;
        } else if (item.images[index]) {
          imgUrl = item.images[index]?.url || item.images[index];
        }
      }
      return {
        ...slide,
        hero: imgUrl || (index === 0 ? primaryImage : slide.hero),
        thumb: imgUrl || (index === 0 ? primaryImage : slide.thumb),
      };
    });
  } else if (variant === 'six' || variant === 'sixBlue') {
    const baseSlides =
      variant === 'sixBlue' ? SIX_BLUE_STORY_SLIDES : SIX_STORY_SLIDES;
    slides = baseSlides.map((slide, index) => {
      const signKey = (slide.sign || '').toUpperCase();
      let imgUrl = null;
      if (item.images && typeof item.images === 'object') {
        if (!Array.isArray(item.images)) {
          imgUrl = item.images[signKey]?.url || item.images[slide.id]?.url;
        } else if (item.images[index]) {
          imgUrl = item.images[index]?.url || item.images[index];
        }
      }
      return {
        ...slide,
        hero: imgUrl || (index === 0 ? primaryImage : slide.hero),
        thumb: imgUrl || (index === 0 ? primaryImage : slide.thumb),
      };
    });
  } else {
    slides = [
      {
        id: item.id || 'single',
        sign: item.zodiacSign || '',
        hero: primaryImage,
        thumb: primaryImage,
      },
    ];
  }

  const inCompetition =
    item.footerState === 'active' ||
    item.competitionState === 'IN_COMPETITION' ||
    Boolean(item.competition);
  const demoRankings = COMPETITION_DETAILS.monochrome.rankings;

  const createdDate = item.createdAt ? new Date(item.createdAt) : null;
  const uploadedDate =
    item.uploadedDate ||
    (createdDate && !isNaN(createdDate.getTime())
      ? createdDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : '');
  const uploadedTime =
    item.uploadedTime ||
    (createdDate && !isNaN(createdDate.getTime())
      ? createdDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })
      : '');

  return {
    ...item,
    id: item.id,
    title: item.title || 'Untitled Artwork',
    variant,
    slides,
    description: item.story || item.description || '',
    category:
      item.categoryName || item.category?.name || item.category || 'General',
    badge: albumBadge,
    albumBadge,
    image: primaryImage,
    isAiGenerated: Boolean(item.isAiGenerated),
    uploadedDate,
    uploadedTime,
    votesMetric: parseMetric(
      item.votesCount ?? item.votes ?? item.hearts,
      '0',
    ),
    viewsMetric: parseMetric(item.viewsCount ?? item.views, '0'),
    reactMetric: parseMetric(item.likesCount ?? item.hearts, '0'),
    isLiked: Boolean(
      item.isLiked ??
        item.liked ??
        item.isLikedByUser ??
        item.hasLiked ??
        false,
    ),
    isSaved: Boolean(
      item.isSaved ??
        item.saved ??
        item.isSavedByUser ??
        item.hasSaved ??
        false,
    ),
    inCompetition,
    footerState: inCompetition ? 'active' : item.footerState || 'profileOnly',
    usesVotesViews: inCompetition,
    showRankings: inCompetition,
    rankings: inCompetition ? item.globalRankings || demoRankings : [],
    showingCount: 5,
    showingTotal: '24,802',
    videoPoster: primaryImage,
    video: item.video,
    commentAvatar: GALLERY_DETAIL_ASSETS.commentAvatar,
  };
};

export const getMyArtworkDetailById = (id) => {
  const item = MY_ARTWORK_ITEMS.find((entry) => entry.id === id);
  if (!item) return null;

  return normalizeArtworkDetail(item);
};

export const getDefaultMyArtworkDetail = () =>
  getMyArtworkDetailById(MY_ARTWORK_ITEMS[0]?.id) ?? null;
