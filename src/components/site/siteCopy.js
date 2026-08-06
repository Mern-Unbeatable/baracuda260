/** Shared chrome tokens for Figma marketing pages (copy lives in i18n locales). */

export const SITE_FOOTER_YEAR = 2026;

export const SITE_MARQUEE_DURATION_S = 28;

export const SITE_ANNOUNCEMENT_BG = {
  navy: 'bg-[#1b1e56]',
  blue: 'bg-[#4048cd]',
};

/** Footer column structure — titles/links resolved via i18n keys. */
export const SITE_FOOTER_COLUMNS = [
  {
    titleKey: 'footer.competitions',
    linkKeys: [
      'footer.singlePhoto',
      'footer.sixPhotoStory',
      'footer.zodiacAlbum',
      'footer.winners',
      'footer.leaderboard',
    ],
  },
  {
    titleKey: 'footer.platform',
    linkKeys: [
      'footer.gallery',
      'footer.about',
      'footer.faq',
      'footer.contact',
    ],
  },
  {
    titleKey: 'footer.legal',
    linkKeys: ['footer.privacy', 'footer.terms', 'footer.cookies'],
  },
];

export const MANROPE_FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap';
