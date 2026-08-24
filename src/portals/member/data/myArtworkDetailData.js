import { ROUTES } from '@/shared/config';
import { SIX_STORY_SLIDES } from '@/shared/data/gallerySixStory';
import { SIX_BLUE_STORY_SLIDES } from '@/shared/data/gallerySixStoryBlue';
import { TWELVE_STORY_SLIDES } from '@/shared/data/galleryTwelveStory';
import {
  GALLERY_DETAIL_ASSETS,
  toGalleryDetailEntry,
} from '@/shared/data/galleryDetail';
import { COMPETITION_DETAILS } from '@/portals/public/competition-details/data/competitionDetailsAssets';
import { MY_ARTWORK_ITEMS } from '@/portals/member/data/myArtworkData';

const DETAIL_DESCRIPTION_KEY = 'myArtwork.detail.description';

export const myArtworkDetailPath = (id) =>
  `${ROUTES.ADMIN_MY_ARTWORK}/${encodeURIComponent(id)}`;

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
  return Number.isFinite(parsed) && parsed > 0 ? normalized : fallback;
};

/** Live competition entry only — profile-only and ended artwork use gallery detail (no rankings). */
export const isCompetitionArtwork = (item) => item?.footerState === 'active';

export const getMyArtworkDetailById = (id) => {
  const item = MY_ARTWORK_ITEMS.find((entry) => entry.id === id);
  if (!item) return null;

  const variant = resolveVariant(item);
  const slides = resolveSlides(item, variant);
  const demoRankings = COMPETITION_DETAILS.monochrome.rankings;
  const inCompetition = isCompetitionArtwork(item);

  return {
    ...item,
    variant,
    slides,
    descriptionKey: DETAIL_DESCRIPTION_KEY,
    badge: item.albumBadge,
    votesMetric: parseMetric(item.votes ?? item.hearts, '2150'),
    viewsMetric: parseMetric(item.views, '12400'),
    reactMetric: parseMetric(item.hearts, '2150'),
    inCompetition,
    usesVotesViews: inCompetition,
    showRankings: inCompetition,
    rankings: inCompetition ? demoRankings : [],
    showingCount: 5,
    showingTotal: '24,802',
    videoPoster: item.image,
    commentAvatar: GALLERY_DETAIL_ASSETS.commentAvatar,
  };
};

export const getDefaultMyArtworkDetail = () =>
  getMyArtworkDetailById(MY_ARTWORK_ITEMS[0]?.id) ?? null;
