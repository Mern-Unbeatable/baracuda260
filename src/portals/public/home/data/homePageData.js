/** Static home page assets and section data. */

const A = '/assets/home';

export const homeAssets = {
  winnerEmma: `${A}/winner-emma.jpg`,
  winnerDavid: `${A}/winner-david.jpg`,
  winnerMarie: `${A}/winner-marie.jpg`,
  trophy: `${A}/icon-trophy.svg`,
  users: `${A}/icon-users.svg`,
  formats: `${A}/icon-formats.svg`,
  star: `${A}/icon-star.svg`,
  free: `${A}/icon-free.svg`,
  globe: `${A}/icon-globe.svg`,
  starFull: `${A}/star-full.svg`,
  starHalf: `${A}/star-half.svg`,
  avatarAnna: `${A}/avatar-anna.jpg`,
  avatarPiotr: `${A}/avatar-piotr.jpg`,
  avatarMarta: `${A}/avatar-marta.jpg`,
};

export const HOME_WINNERS = [
  {
    medal: '🥇',
    name: 'Emma Kowalska',
    work: 'Silence at Dusk',
    votesCount: '3,210',
    prize: '$300',
    image: homeAssets.winnerEmma,
  },
  {
    medal: '🥈',
    name: 'David Nowak',
    work: 'Urban Rivers',
    votesCount: '2,891',
    prize: '$150',
    image: homeAssets.winnerDavid,
  },
  {
    medal: '🥉',
    name: 'Marie Blanche',
    work: 'Salt Flats Journey',
    votesCount: '2,654',
    prize: '$50',
    image: homeAssets.winnerMarie,
  },
];

export const HOME_FEATURES = [
  { icon: homeAssets.trophy, titleKey: 'home.features.prizesTitle', textKey: 'home.features.prizesText' },
  { icon: homeAssets.users, titleKey: 'home.features.votingTitle', textKey: 'home.features.votingText' },
  { icon: homeAssets.formats, titleKey: 'home.features.formatsTitle', textKey: 'home.features.formatsText' },
  { icon: homeAssets.star, titleKey: 'home.features.hallTitle', textKey: 'home.features.hallText' },
  { icon: homeAssets.free, titleKey: 'home.features.freeTitle', textKey: 'home.features.freeText' },
  { icon: homeAssets.globe, titleKey: 'home.features.globalTitle', textKey: 'home.features.globalText' },
];

export const HOME_TESTIMONIALS = [
  {
    quoteKey: 'home.testimonials.a1quote',
    name: 'Anna Kowalska',
    roleKey: 'home.testimonials.a1role',
    avatar: homeAssets.avatarAnna,
    stars: 5,
  },
  {
    quoteKey: 'home.testimonials.a2quote',
    name: 'Piotr Mazur',
    roleKey: 'home.testimonials.a2role',
    avatar: homeAssets.avatarPiotr,
    stars: 5,
  },
  {
    quoteKey: 'home.testimonials.a3quote',
    name: 'Marta Wiśniewska',
    roleKey: 'home.testimonials.a3role',
    avatar: homeAssets.avatarMarta,
    stars: 4.5,
  },
];
