/** Terms of Service body copy — Figma node 264:1562. */

export const TERMS_LAST_UPDATED = 'Last Updated: July 2026';

/**
 * Section shape:
 * - leads: 24px intro lines (Figma larger body)
 * - paragraphs: 20px body
 * - listIntro: 20px line before bullets
 * - bullets / footnotes: optional lists and trailing notes
 */
export const TERMS_SECTIONS = [
  {
    id: 'introduction',
    title: '1. Introduction',
    paragraphs: [
      'Welcome to My12Photos.',
      'By accessing or using this website, you agree to comply with these Terms of Service.',
    ],
  },
  {
    id: 'eligibility',
    title: '2. Eligibility',
    leads: [
      'You must be at least 18 years old or have permission from a parent or legal guardian.',
    ],
  },
  {
    id: 'accounts',
    title: '3. User Accounts',
    leads: ['Users are responsible for:'],
    bullets: [
      'Maintaining account security',
      'Providing accurate information',
      'Keeping login credentials confidential',
    ],
  },
  {
    id: 'competitions',
    title: '4. Photography Competitions',
    leads: ['Participation is completely free unless otherwise announced.'],
    listIntro: 'Users agree to:',
    bullets: [
      'Upload only original content.',
      'Respect competition rules.',
      'Avoid copyrighted material owned by others.',
      'Refrain from offensive, illegal, or inappropriate content.',
    ],
  },
  {
    id: 'voting',
    title: '5. Voting',
    paragraphs: [
      'The platform reserves the right to remove fraudulent votes or disqualify users engaging in manipulation.',
    ],
  },
  {
    id: 'ip',
    title: '6. Intellectual Property',
    paragraphs: [
      'Users retain ownership of their uploaded photographs.',
      'By participating, users grant My12Photos permission to display submitted images for competition purposes and promotional activities.',
    ],
  },
  {
    id: 'prizes',
    title: '7. Prize Distribution',
    leads: [
      'Cash prizes are distributed through PayPal unless otherwise specified.',
      'Winners may be required to verify their identity before receiving payments.',
    ],
  },
  {
    id: 'prohibited',
    title: '8. Prohibited Activities',
    leads: ['Users must not:'],
    bullets: [
      'Upload illegal content',
      'Impersonate others',
      'Use bots or automated voting',
      'Manipulate rankings',
      'Attempt unauthorized access',
      'Abuse the platform',
    ],
  },
  {
    id: 'suspension',
    title: '9. Account Suspension',
    leads: [
      'We reserve the right to suspend or terminate accounts that violate these Terms.',
    ],
  },
  {
    id: 'disclaimer',
    title: '10. Disclaimer',
    leads: [
      'While we strive to provide uninterrupted service, My12Photos cannot guarantee continuous availability.',
    ],
  },
  {
    id: 'changes',
    title: '11. Changes',
    leads: [
      'We may update these Terms at any time.',
      'Continued use of the platform constitutes acceptance of the updated Terms.',
    ],
  },
];
