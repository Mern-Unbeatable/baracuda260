/** Admin Demo Profiles — list + detail modal. */

const A = '/assets/admin-users';
const H = '/assets/home';
const D = '/assets/admin-competition-detail';
const AV = '/assets/competition-details';

export const ADMIN_DEMO_PROFILES_ASSETS = {
  chevronDown: `${A}/icon-chevron-down.svg`,
  more: '/assets/admin-payouts/icon-more.svg',
  close: `${A}/icon-close.svg`,
  phone: '/assets/admin-support/icon-message.svg',
  email: '/assets/admin-support/icon-link.svg',
  external: '/assets/admin-business-link/icon-arrow.svg',
};

export const DEMO_PROFILE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

export const STATUS_FILTERS = [
  { id: 'all', labelKey: 'adminDemoProfiles.filters.all' },
  { id: DEMO_PROFILE_STATUS.ACTIVE, labelKey: 'adminDemoProfiles.filters.active' },
  { id: DEMO_PROFILE_STATUS.INACTIVE, labelKey: 'adminDemoProfiles.filters.inactive' },
];

export const STATUS_LABEL_KEYS = {
  [DEMO_PROFILE_STATUS.ACTIVE]: 'adminDemoProfiles.status.active',
  [DEMO_PROFILE_STATUS.INACTIVE]: 'adminDemoProfiles.status.inactive',
};

export const STATUS_STYLES = {
  [DEMO_PROFILE_STATUS.ACTIVE]: {
    bg: 'bg-[#eef7f3]',
    dot: 'bg-[#268262]',
    text: 'text-[#268262]',
  },
  [DEMO_PROFILE_STATUS.INACTIVE]: {
    bg: 'bg-[#f2f1f8]',
    dot: 'bg-[#766f9a]',
    text: 'text-[#766f9a]',
  },
};

export const DEMO_PROFILES_PAGE_SIZE = 10;
export const DEMO_PROFILE_BIO_MAX_LENGTH = 250;
export const DEMO_PROFILE_DEFAULT_AVATAR = '/assets/competition-details/avatar-1.jpg';
export const DEMO_PROFILE_DEFAULT_BANNER = '/assets/home/photo-forest.jpg';

export const EMPTY_DEMO_PROFILE_FORM = {
  fullName: '',
  username: '',
  phone: '',
  email: '',
  bio: '',
  socialLinks: [''],
  isActive: true,
  profilePhotoName: '',
  profilePhotoPreview: '',
  coverPhotoName: '',
  coverPhotoPreview: '',
};

export const computeDemoProfileStats = (profiles) => ({
  total: profiles.length,
  active: profiles.filter((profile) => profile.status === DEMO_PROFILE_STATUS.ACTIVE).length,
  inactive: profiles.filter((profile) => profile.status === DEMO_PROFILE_STATUS.INACTIVE).length,
});

export const DEMO_PROFILES_STAT_CARDS = [
  {
    id: 'total',
    labelKey: 'adminDemoProfiles.stats.total',
    icon: '1',
    iconBg: 'bg-[#eef2ff] text-[#4048cd]',
  },
  {
    id: 'active',
    labelKey: 'adminDemoProfiles.stats.active',
    icon: '9',
    iconBg: 'bg-[#eef7f3] text-[#268262]',
  },
  {
    id: 'inactive',
    labelKey: 'adminDemoProfiles.stats.inactive',
    icon: '3',
    iconBg: 'bg-[#f2f1f8] text-[#766f9a]',
  },
];

export const DEMO_PROFILES = [
  {
    id: 'elena-vasquez',
    nameKey: 'adminDemoProfiles.profiles.elena.name',
    usernameKey: 'adminDemoProfiles.profiles.elena.username',
    phone: '+1 555 201 3344',
    email: 'elena@photocraft.io',
    status: DEMO_PROFILE_STATUS.ACTIVE,
    banner: `${H}/photo-forest.jpg`,
    avatar: `${D}/photographer.jpg`,
    aboutKey: 'adminDemoProfiles.profiles.elena.about',
    socialUrl: 'instagram.com/elenavasquez',
  },
  {
    id: 'marcus-chen',
    nameKey: 'adminDemoProfiles.profiles.marcus.name',
    usernameKey: 'adminDemoProfiles.profiles.marcus.username',
    phone: '+44 7700 900123',
    email: 'marcus@studio.io',
    status: DEMO_PROFILE_STATUS.ACTIVE,
    banner: `${H}/photo-golden.jpg`,
    avatar: `${AV}/avatar-2.jpg`,
    aboutKey: 'adminDemoProfiles.profiles.marcus.about',
    socialUrl: 'instagram.com/marcuschen',
  },
  {
    id: 'sofia-rodriguez',
    nameKey: 'adminDemoProfiles.profiles.sofia.name',
    usernameKey: 'adminDemoProfiles.profiles.sofia.username',
    phone: '+34 612 345 678',
    email: 'sofia@lens.io',
    status: DEMO_PROFILE_STATUS.ACTIVE,
    banner: `${H}/photo-morning.jpg`,
    avatar: `${AV}/avatar-3.jpg`,
    aboutKey: 'adminDemoProfiles.profiles.sofia.about',
    socialUrl: 'instagram.com/sofiarod',
  },
  {
    id: 'james-okafor',
    nameKey: 'adminDemoProfiles.profiles.james.name',
    usernameKey: 'adminDemoProfiles.profiles.james.username',
    phone: '+234 803 456 7890',
    email: 'james@frame.io',
    status: DEMO_PROFILE_STATUS.ACTIVE,
    banner: `${H}/photo-city.jpg`,
    avatar: `${AV}/avatar-4.jpg`,
    aboutKey: 'adminDemoProfiles.profiles.james.about',
    socialUrl: 'instagram.com/jamesokafor',
  },
  {
    id: 'priya-sharma',
    nameKey: 'adminDemoProfiles.profiles.priya.name',
    usernameKey: 'adminDemoProfiles.profiles.priya.username',
    phone: '+91 98765 43210',
    email: 'priya@capture.io',
    status: DEMO_PROFILE_STATUS.ACTIVE,
    banner: `${H}/photo-wings.jpg`,
    avatar: `${AV}/avatar-5.jpg`,
    aboutKey: 'adminDemoProfiles.profiles.priya.about',
    socialUrl: 'instagram.com/priyasharma',
  },
  {
    id: 'liam-obrien',
    nameKey: 'adminDemoProfiles.profiles.liam.name',
    usernameKey: 'adminDemoProfiles.profiles.liam.username',
    phone: '+353 87 123 4567',
    email: 'liam@shot.io',
    status: DEMO_PROFILE_STATUS.INACTIVE,
    banner: `${H}/photo-harbor.jpg`,
    avatar: `${AV}/avatar-1.jpg`,
    aboutKey: 'adminDemoProfiles.profiles.liam.about',
    socialUrl: 'instagram.com/liamobrien',
  },
  {
    id: 'yuki-tanaka',
    nameKey: 'adminDemoProfiles.profiles.yuki.name',
    usernameKey: 'adminDemoProfiles.profiles.yuki.username',
    phone: '+81 90 1234 5678',
    email: 'yuki@photo.io',
    status: DEMO_PROFILE_STATUS.ACTIVE,
    banner: `${H}/photo-tidal.jpg`,
    avatar: `${AV}/avatar-2.jpg`,
    aboutKey: 'adminDemoProfiles.profiles.yuki.about',
    socialUrl: 'instagram.com/yukitanaka',
  },
  {
    id: 'amara-okonkwo',
    nameKey: 'adminDemoProfiles.profiles.amara.name',
    usernameKey: 'adminDemoProfiles.profiles.amara.username',
    phone: '+234 802 987 6543',
    email: 'amara@vision.io',
    status: DEMO_PROFILE_STATUS.ACTIVE,
    banner: `${H}/photo-silent.jpg`,
    avatar: `${AV}/avatar-3.jpg`,
    aboutKey: 'adminDemoProfiles.profiles.amara.about',
    socialUrl: 'instagram.com/amarao',
  },
  {
    id: 'carlos-mendez',
    nameKey: 'adminDemoProfiles.profiles.carlos.name',
    usernameKey: 'adminDemoProfiles.profiles.carlos.username',
    phone: '+52 55 1234 5678',
    email: 'carlos@lens.io',
    status: DEMO_PROFILE_STATUS.ACTIVE,
    banner: `${H}/photo-zodiac.jpg`,
    avatar: `${AV}/avatar-4.jpg`,
    aboutKey: 'adminDemoProfiles.profiles.carlos.about',
    socialUrl: 'instagram.com/carlosm',
  },
  {
    id: 'nina-kowalski',
    nameKey: 'adminDemoProfiles.profiles.nina.name',
    usernameKey: 'adminDemoProfiles.profiles.nina.username',
    phone: '+48 600 123 456',
    email: 'nina@foto.io',
    status: DEMO_PROFILE_STATUS.INACTIVE,
    banner: `${H}/photo-autumn.jpg`,
    avatar: `${AV}/avatar-5.jpg`,
    aboutKey: 'adminDemoProfiles.profiles.nina.about',
    socialUrl: 'instagram.com/ninak',
  },
];

let demoProfilesStore = [...DEMO_PROFILES];

export const getDemoProfilesStore = () => demoProfilesStore;

export const resetDemoProfilesStore = () => {
  demoProfilesStore = [...DEMO_PROFILES];
};

export const appendDemoProfile = (profile) => {
  demoProfilesStore = [...demoProfilesStore, profile];
  return demoProfilesStore;
};

export const setDemoProfilesStore = (profiles) => {
  demoProfilesStore = [...profiles];
  return demoProfilesStore;
};

export const DEMO_PROFILES_STATS = computeDemoProfileStats(DEMO_PROFILES);

export const CHEVRON_ICON_SIZE = 24;
export const MORE_ICON_SIZE = 20;
export const CLOSE_ICON_SIZE = 24;

export const filterDemoProfilesByStatus = (profiles, filterId) => {
  if (!filterId || filterId === 'all') return profiles;
  return profiles.filter((profile) => profile.status === filterId);
};

export const paginateDemoProfiles = (profiles, page, pageSize) => {
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * pageSize;
  return profiles.slice(start, start + pageSize);
};

export const updateDemoProfileStatus = (profiles, profileId, nextStatus) =>
  profiles.map((profile) =>
    profile.id === profileId ? { ...profile, status: nextStatus } : profile,
  );

export const getDemoProfileById = (profiles, profileId) =>
  profiles.find((profile) => profile.id === profileId) || null;

export const getDemoProfileDisplayName = (profile, t) =>
  profile.name ?? (profile.nameKey ? t(profile.nameKey) : '');

export const getDemoProfileDisplayUsername = (profile, t) =>
  profile.username ?? (profile.usernameKey ? t(profile.usernameKey) : '');

export const getDemoProfileDisplayAbout = (profile, t) =>
  profile.about ?? (profile.aboutKey ? t(profile.aboutKey) : '');

const slugifyUsername = (username) =>
  username
    .trim()
    .replace(/^@/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'demo-profile';

export const isRequiredTextValid = (value) => Boolean(value?.trim());

export const isEmailValid = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());

export const isBioValid = (value) => String(value || '').length <= DEMO_PROFILE_BIO_MAX_LENGTH;

export const normalizeUsername = (value) => {
  const trimmed = String(value || '').trim();
  if (!trimmed) return '';
  return trimmed.startsWith('@') ? trimmed : `@${trimmed}`;
};

export const normalizeSocialUrl = (value) =>
  String(value || '')
    .trim()
    .replace(/^https?:\/\//i, '');

export const isDemoProfileFormValid = (values) =>
  isRequiredTextValid(values.fullName) &&
  isRequiredTextValid(values.username) &&
  isRequiredTextValid(values.phone) &&
  isEmailValid(values.email) &&
  isBioValid(values.bio);

export const buildDemoProfileFromForm = (values) => {
  const username = normalizeUsername(values.username);
  const socialLinks = values.socialLinks
    .map(normalizeSocialUrl)
    .filter(Boolean);

  return {
    id: slugifyUsername(username),
    name: values.fullName.trim(),
    username,
    phone: values.phone.trim(),
    email: values.email.trim(),
    about: values.bio.trim(),
    status: values.isActive ? DEMO_PROFILE_STATUS.ACTIVE : DEMO_PROFILE_STATUS.INACTIVE,
    banner: values.coverPhotoPreview || DEMO_PROFILE_DEFAULT_BANNER,
    avatar: values.profilePhotoPreview || DEMO_PROFILE_DEFAULT_AVATAR,
    socialUrl: socialLinks[0] || '',
    socialLinks,
  };
};
