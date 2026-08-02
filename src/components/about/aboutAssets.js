const A = '/assets/about';

/** Auto-advance interval for About hero image slider (ms). */
export const ABOUT_HERO_SLIDE_MS = 6000;

export const ABOUT_ASSETS = {
  hero: `${A}/hero.jpg`,
  heroDots: `${A}/hero-dots.svg`,
  story: `${A}/story.jpg`,
  community1: `${A}/community-1.jpg`,
  community2: `${A}/community-2.jpg`,
  community3: `${A}/community-3.jpg`,
  community4: `${A}/community-4.jpg`,
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
