const A = '/assets/home';

/** 6 Photos Story — set A: signs 1–6 (Aries → Virgo), red theme */
export const SIX_STORY_SLIDES = [
  {
    id: 'aries',
    sign: 'Aries',
    number: 1,
    icon: `${A}/icon-aries.svg`,
    thumb: `${A}/six-thumb-1.webp`,
    hero: `${A}/six-hero-aries.webp`,
  },
  {
    id: 'taurus',
    sign: 'Taurus',
    number: 2,
    icon: `${A}/icon-taurus.svg`,
    thumb: `${A}/six-thumb-2.webp`,
    hero: `${A}/six-thumb-2.webp`,
  },
  {
    id: 'gemini',
    sign: 'Gemini',
    number: 3,
    icon: `${A}/icon-gemini.svg`,
    thumb: `${A}/six-thumb-3.webp`,
    hero: `${A}/six-thumb-3.webp`,
  },
  {
    id: 'cancer',
    sign: 'Cancer',
    number: 4,
    icon: `${A}/icon-cancer.svg`,
    thumb: `${A}/six-thumb-4.webp`,
    hero: `${A}/six-thumb-4.webp`,
  },
  {
    id: 'leo',
    sign: 'Leo',
    number: 5,
    icon: `${A}/icon-leo.svg`,
    thumb: `${A}/six-thumb-5.webp`,
    hero: `${A}/six-thumb-5.webp`,
  },
  {
    id: 'virgo',
    sign: 'virgo',
    number: 6,
    icon: `${A}/icon-virgo.svg`,
    thumb: `${A}/six-thumb-5.webp`,
    hero: `${A}/six-thumb-5.webp`,
  },
];

export const GALLERY_SIX_STORIES = [
  {
    id: 'autumn-sequence',
    title: 'Autumn Sequence',
    photographer: 'Kasia L.',
    votes: '1488',
    views: '9240',
    badge: '6 Photos Story',
    category: 'Nature',
    cover: `${A}/photo-autumn.webp`,
    description:
      'A serene autumn forest sequence following a quiet yoga practice among orange and gold leaves. Warm seasonal light and layered foliage create a calm, story-driven atmosphere across six connected frames.',
    videoPoster: `${A}/six-hero-aries.webp`,
    slides: SIX_STORY_SLIDES,
  },
];

export const getGallerySixStoryById = (id) =>
  GALLERY_SIX_STORIES.find((story) => story.id === id) ||
  GALLERY_SIX_STORIES[0];

export const gallerySixStoryPath = (id) =>
  `/gallery/story/${id || GALLERY_SIX_STORIES[0].id}`;

export const isSixPhotoStoryBadge = (badge = '') =>
  /6\s*photos?\s*story/i.test(badge);
