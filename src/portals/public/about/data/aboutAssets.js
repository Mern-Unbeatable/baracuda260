const A = '/assets/about';

/** Auto-advance interval for About hero image slider (ms). */
export const ABOUT_HERO_SLIDE_MS = 6000;

export const ABOUT_ASSETS = {
  hero: `${A}/hero.webp`,
  heroDots: `${A}/hero-dots.svg`,
  story: `${A}/story.webp`,
  community1: `${A}/community-1.webp`,
  community2: `${A}/community-2.webp`,
  community3: `${A}/community-3.webp`,
  community4: `${A}/community-4.webp`,
  fire: `${A}/icon-fire.svg`,
  user: `${A}/icon-user.svg`,
  badge: `${A}/icon-badge.svg`,
  userOutlined: `${A}/icon-user-outlined.svg`,
  arrowNext: `${A}/icon-arrow-next.svg`,
};

/** Hero slides — matches Figma 4-dot indicator. */
export const ABOUT_HERO_SLIDES = [
  ABOUT_ASSETS.hero,
  ABOUT_ASSETS.story,
  ABOUT_ASSETS.community4,
  ABOUT_ASSETS.community2,
];
