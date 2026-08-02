/** Cookie Policy body copy — Figma node 264:1716 ("Cookie ploicy"). */

export const COOKIES_LAST_UPDATED = 'Last Updated: July 2026';

/** Opening blurb shown above the first section (no heading in Figma). */
export const COOKIES_INTRO =
  'This Cookie Policy explains how My12Photos uses cookies to improve your browsing experience.';

/**
 * Section shape matches Terms:
 * - leads: 24px intro lines
 * - paragraphs: 20px body
 * - listIntro: 20px line before bullets
 * - bullets / footnotes: optional
 */
export const COOKIES_SECTIONS = [
  {
    id: 'what-are-cookies',
    title: 'What Are Cookies?',
    leads: [
      'Cookies are small text files stored on your device that help websites remember your preferences and improve functionality.',
    ],
  },
  {
    id: 'types',
    title: 'Types of Cookies We Use',
    leads: ['Required for:'],
    bullets: ['Login', 'Account Security', 'Session Management', 'Language Preferences'],
  },
  {
    id: 'performance',
    title: 'Performance Cookies',
    listIntro: 'Used to:',
    bullets: [
      'Measure website performance',
      'Improve loading speed',
      'Analyze visitor behavior',
    ],
  },
  {
    id: 'analytics',
    title: 'Analytics Cookies',
    leads: ['We use Google Analytics to understand:'],
    bullets: [
      'Visitor traffic',
      'Popular pages',
      'User engagement',
      'Website performance',
    ],
  },
  {
    id: 'advertising',
    title: 'Advertising Cookies',
    leads: [
      'Google Ads may use cookies to display relevant advertisements and measure advertising effectiveness.',
    ],
  },
  {
    id: 'functional',
    title: 'Functional Cookies',
    leads: ['Remember:'],
    bullets: [
      'Selected language',
      'User preferences',
      'Competition filters',
      'Display settings',
    ],
  },
  {
    id: 'managing',
    title: 'Managing Cookies',
    leads: ['Most browsers allow you to:'],
    bullets: [
      'Accept all cookies',
      'Reject cookies',
      'Delete stored cookies',
      'Control cookie preferences',
    ],
  },
  {
    id: 'third-party',
    title: 'Third-Party Cookies',
    leads: ['Some cookies are provided by trusted third-party services including:'],
    bullets: ['Google Analytics', 'Google Ads', 'PayPal'],
  },
  {
    id: 'updates',
    title: 'Updates',
    leads: [
      'We may update this Cookie Policy periodically to reflect changes in technology or legal requirements.',
    ],
  },
];
