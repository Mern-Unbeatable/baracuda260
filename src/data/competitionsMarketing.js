import { homeAsset } from '../components/site/siteAssets';

/** Shared marketing competitions + steps (Home + Competitions pages) */

export const COMPETITION_CARDS = [
  {
    icon: homeAsset('icon-camera.svg'),
    titleKey: 'competitionsPage.cards.singleTitle',
    descriptionKey: 'competitionsPage.cards.singleDesc',
    featureKeys: [
      'competitionsPage.cards.singleF0',
      'competitionsPage.cards.singleF1',
      'competitionsPage.cards.singleF2',
    ],
    prize: '$1500.00',
    check: homeAsset('icon-check.svg'),
  },
  {
    icon: homeAsset('icon-book.svg'),
    titleKey: 'competitionsPage.cards.sixTitle',
    descriptionKey: 'competitionsPage.cards.sixDesc',
    featureKeys: [
      'competitionsPage.cards.sixF0',
      'competitionsPage.cards.sixF1',
      'competitionsPage.cards.sixF2',
    ],
    prize: '$2500.00',
    popular: true,
    check: homeAsset('icon-check-alt.svg'),
  },
  {
    icon: homeAsset('icon-sparkle.svg'),
    titleKey: 'competitionsPage.cards.twelveTitle',
    descriptionKey: 'competitionsPage.cards.twelveDesc',
    featureKeys: [
      'competitionsPage.cards.twelveF0',
      'competitionsPage.cards.twelveF1',
      'competitionsPage.cards.twelveF2',
    ],
    prize: '$3500.00',
    check: homeAsset('icon-check.svg'),
  },
];

export const COMPETITION_STEPS = [
  {
    num: '01',
    titleKey: 'competitionsPage.steps.1title',
    textKey: 'competitionsPage.steps.1text',
  },
  {
    num: '02',
    titleKey: 'competitionsPage.steps.2title',
    textKey: 'competitionsPage.steps.2text',
  },
  {
    num: '03',
    titleKey: 'competitionsPage.steps.3title',
    textKey: 'competitionsPage.steps.3text',
  },
  {
    num: '04',
    titleKey: 'competitionsPage.steps.4title',
    textKey: 'competitionsPage.steps.4text',
  },
];
