import { ABOUT_ASSETS } from '@/modules/public/data/aboutAssets';

export const ABOUT_STATS = [
  { value: '12+', labelKey: 'about.stats.zodiacThemes' },
  { value: '$10K+', labelKey: 'about.stats.monthlyPrizes' },
  { value: '150K+', labelKey: 'about.stats.votersEngaged' },
];

export const ABOUT_STEPS = [
  {
    id: 1,
    titleKey: 'about.howItWorks.s1title',
    summaryKey: 'about.howItWorks.s1summary',
    detailTitleKey: 'about.howItWorks.s1detailTitle',
    detailBodyKey: 'about.howItWorks.s1detailBody',
  },
  {
    id: 2,
    titleKey: 'about.howItWorks.s2title',
    summaryKey: 'about.howItWorks.s2summary',
    detailTitleKey: 'about.howItWorks.s2detailTitle',
    detailBodyKey: 'about.howItWorks.s2detailBody',
  },
  {
    id: 3,
    titleKey: 'about.howItWorks.s3title',
    summaryKey: 'about.howItWorks.s3summary',
    detailTitleKey: 'about.howItWorks.s3detailTitle',
    detailBodyKey: 'about.howItWorks.s3detailBody',
  },
  {
    id: 4,
    titleKey: 'about.howItWorks.s4title',
    summaryKey: 'about.howItWorks.s4summary',
    detailTitleKey: 'about.howItWorks.s4detailTitle',
    detailBodyKey: 'about.howItWorks.s4detailBody',
  },
  {
    id: 5,
    titleKey: 'about.howItWorks.s5title',
    summaryKey: 'about.howItWorks.s5summary',
    detailTitleKey: 'about.howItWorks.s5detailTitle',
    detailBodyKey: 'about.howItWorks.s5detailBody',
  },
];

export const ABOUT_COMMUNITY_FEATURES = [
  {
    icon: ABOUT_ASSETS.user,
    titleKey: 'about.community.exchangeTitle',
    textKey: 'about.community.exchangeText',
  },
  {
    icon: ABOUT_ASSETS.badge,
    titleKey: 'about.community.critiqueTitle',
    textKey: 'about.community.critiqueText',
  },
];

export const ABOUT_COMMUNITY_IMAGES = [
  {
    src: ABOUT_ASSETS.community1,
    className: 'col-start-1 row-start-1 h-[200px] sm:h-[240px] xl:h-[262px]',
  },
  {
    src: ABOUT_ASSETS.community4,
    className: 'col-start-2 row-start-1 mt-6 h-[240px] sm:h-[280px] xl:mt-10 xl:h-[336px]',
  },
  {
    src: ABOUT_ASSETS.community2,
    className: 'col-start-1 row-start-2 h-[280px] sm:h-[320px] xl:h-[371px]',
  },
  {
    src: ABOUT_ASSETS.community3,
    className: 'col-start-2 row-start-2 h-[240px] sm:h-[280px] xl:h-[313px]',
  },
];
