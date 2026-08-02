import { ABOUT_ASSETS } from './aboutAssets';

export const ABOUT_STATS = [
  { value: '12+', label: 'Zodiac Themes' },
  { value: '$10K+', label: 'Monthly Prizes' },
  { value: '150K+', label: 'Voters Engaged' },
];

export const ABOUT_STEPS = [
  {
    id: 1,
    title: 'Create Your Account',
    summary: 'Sign up for free and complete your profile.',
    detailTitle: 'Sign up for free and complete your profile.',
    detailBody:
      'Set up your personal gallery, link your photography socials, and tell the community about your artistic style.',
  },
  {
    id: 2,
    title: 'Choose Your Competition',
    summary: 'Select one of our competition categories.',
    detailTitle: 'Pick the album format that fits your story.',
    detailBody:
      'Enter Single Photo, 6-Photo Story, or the full 12-photo Zodiac Album — each with its own prizes and monthly theme.',
  },
  {
    id: 3,
    title: 'Upload Your Work',
    summary: 'Submit your best photographs before the monthly deadline.',
    detailTitle: 'Submit before the monthly deadline.',
    detailBody:
      'Upload high-quality images that match the competition rules. You can refine captions and sequence until submissions close.',
  },
  {
    id: 4,
    title: 'Receive Community Votes',
    summary: 'Your submission becomes available for public voting.',
    detailTitle: 'Earn votes from photographers worldwide.',
    detailBody:
      'Once live in the gallery, your work is open for transparent community voting throughout the competition window.',
  },
  {
    id: 5,
    title: 'Win Monthly Prizes',
    summary: 'Top-ranked photographers receive recognition, awards, and prizes.',
    detailTitle: 'Claim recognition and cash prizes.',
    detailBody:
      'Top-ranked photographers receive recognition, awards, and monthly cash prizes — with winners featured across the platform.',
  },
];

export const ABOUT_COMMUNITY_FEATURES = [
  {
    icon: ABOUT_ASSETS.user,
    title: 'Global Exchange',
    text: 'Connect with visual minds across 150+ countries.',
  },
  {
    icon: ABOUT_ASSETS.badge,
    title: 'Empathetic Critique',
    text: 'Acquire helpful reviews and votes from peers.',
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
