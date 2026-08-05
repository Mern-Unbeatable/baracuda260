/** User dashboard assets — Figma node 111:1064. */
const A = '/assets/dashboard';

export const DASHBOARD_ASSETS = {
  logo: '/assets/logo/logo.png',
  avatar: `${A}/avatar.png`,
  competitions: {
    celestial: `${A}/comp-celestial.jpg`,
    urban: `${A}/comp-urban.jpg`,
    portrait: `${A}/comp-portrait.jpg`,
  },
};

/** Demo stats for the dashboard UI (Figma). */
export const DASHBOARD_STATS = [
  {
    id: 'rank',
    labelKey: 'dashboard.stats.rank',
    value: '#42',
    iconBg: 'bg-[#ffddb8]',
    iconColor: 'text-[#855300]',
    icon: 'trophy',
  },
  {
    id: 'photos',
    labelKey: 'dashboard.stats.photos',
    value: '156',
    iconBg: 'bg-[#ede9fe]',
    iconColor: 'text-[#7c3aed]',
    icon: 'camera',
  },
  {
    id: 'votes',
    labelKey: 'dashboard.stats.votes',
    value: '1.2k',
    iconBg: 'bg-[#f3e8ff]',
    iconColor: 'text-[#9333ea]',
    icon: 'heart',
  },
  {
    id: 'prizes',
    labelKey: 'dashboard.stats.prizes',
    value: '$2,450',
    iconBg: 'bg-[#fef3c7]',
    iconColor: 'text-[#b45309]',
    icon: 'wallet',
  },
  {
    id: 'competitions',
    labelKey: 'dashboard.stats.competitions',
    value: '8',
    iconBg: 'bg-[#dbeafe]',
    iconColor: 'text-[#2563eb]',
    icon: 'compass',
  },
];

/** Demo participating competitions (Figma). */
export const DASHBOARD_COMPETITIONS = [
  {
    id: 'celestial',
    titleKey: 'dashboard.competitions.items.celestial.title',
    badgeKey: 'dashboard.competitions.items.celestial.badge',
    badgeTone: 'gold',
    participantsKey: 'dashboard.competitions.items.celestial.participants',
    timingKey: 'dashboard.competitions.items.celestial.timing',
    statusLabelKey: 'dashboard.competitions.yourSubmission',
    statusValueKey: 'dashboard.competitions.items.celestial.status',
    statusTone: 'purple',
    image: DASHBOARD_ASSETS.competitions.celestial,
  },
  {
    id: 'urban',
    titleKey: 'dashboard.competitions.items.urban.title',
    badgeKey: 'dashboard.competitions.items.urban.badge',
    badgeTone: 'blue',
    participantsKey: 'dashboard.competitions.items.urban.participants',
    timingKey: 'dashboard.competitions.items.urban.timing',
    statusLabelKey: 'dashboard.competitions.yourSubmission',
    statusValueKey: 'dashboard.competitions.items.urban.status',
    statusTone: 'muted',
    image: DASHBOARD_ASSETS.competitions.urban,
  },
  {
    id: 'portrait',
    titleKey: 'dashboard.competitions.items.portrait.title',
    badgeKey: 'dashboard.competitions.items.portrait.badge',
    badgeTone: 'winner',
    participantsKey: 'dashboard.competitions.items.portrait.participants',
    timingKey: 'dashboard.competitions.items.portrait.timing',
    statusLabelKey: 'dashboard.competitions.finalStanding',
    statusValueKey: 'dashboard.competitions.items.portrait.status',
    statusTone: 'gold',
    showTrophy: true,
    image: DASHBOARD_ASSETS.competitions.portrait,
  },
];
