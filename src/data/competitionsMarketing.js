import { homeAsset } from '../components/site/siteAssets';

/** Shared marketing competitions + steps (Home + Competitions pages) */

export const COMPETITION_CARDS = [
  {
    icon: homeAsset('icon-camera.svg'),
    title: 'Single Photo',
    description:
      'Submit one outstanding photograph that speaks for itself. Pure skill, pure story — judged by the community.',
    features: ['Monthly competition', 'Public community voting', 'Top 3 win cash prizes'],
    prize: '$1500.00',
    check: homeAsset('icon-check.svg'),
  },
  {
    icon: homeAsset('icon-book.svg'),
    title: '6-Photos Story',
    description:
      'Craft a visual narrative using six carefully sequenced images that guide the viewer through an arc.',
    features: ['Sequential storytelling', 'Community votes', 'Best story wins'],
    prize: '$2500.00',
    popular: true,
    check: homeAsset('icon-check-alt.svg'),
  },
  {
    icon: homeAsset('icon-sparkle.svg'),
    title: '12 photos - full Zodiac Story',
    description:
      'Create a complete zodiac-themed visual journey across twelve stunning images — our grandest format.',
    features: ['12-sign visual arc', 'Zodiac-order display', 'Grand prize category'],
    prize: '$3500.00',
    check: homeAsset('icon-check.svg'),
  },
];

export const COMPETITION_STEPS = [
  {
    num: '01',
    title: 'Create an Account',
    text: 'Sign up for free in seconds. No fees, no hidden costs — ever.',
  },
  {
    num: '02',
    title: 'Submit Your Photos',
    text: 'Choose a competition category and upload your best work before the deadline.',
  },
  {
    num: '03',
    title: 'Earn Votes',
    text: 'The photography community votes for their favourites. The more votes, the higher your rank.',
  },
  {
    num: '04',
    title: 'Claim Your Prize',
    text: 'Winners receive cash prizes via PayPal. Fast, transparent, and reliable.',
  },
];
