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
  {
    id: DEMO_PROFILE_STATUS.ACTIVE,
    labelKey: 'adminDemoProfiles.filters.active',
  },
  {
    id: DEMO_PROFILE_STATUS.INACTIVE,
    labelKey: 'adminDemoProfiles.filters.inactive',
  },
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
export const DEMO_PROFILE_DEFAULT_AVATAR =
  '/assets/competition-details/avatar-1.webp';
export const DEMO_PROFILE_DEFAULT_BANNER = '/assets/home/photo-forest.webp';

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
  active: profiles.filter(
    (profile) => profile.status === DEMO_PROFILE_STATUS.ACTIVE,
  ).length,
  inactive: profiles.filter(
    (profile) => profile.status === DEMO_PROFILE_STATUS.INACTIVE,
  ).length,
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

export const DEMO_PROFILES = [];

let demoProfilesStore = [];

export const getDemoProfilesStore = () => demoProfilesStore;

export const resetDemoProfilesStore = () => {
  demoProfilesStore = [];
};

export const appendDemoProfile = (profile) => {
  demoProfilesStore = [...demoProfilesStore, profile];
  return demoProfilesStore;
};

export const setDemoProfilesStore = (profiles) => {
  demoProfilesStore = [...profiles];
  return demoProfilesStore;
};

export const DEMO_PROFILES_STATS = { total: 0, active: 0, inactive: 0 };

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

export const isEmailValid = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());

export const isBioValid = (value) =>
  String(value || '').length <= DEMO_PROFILE_BIO_MAX_LENGTH;

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
    status: values.isActive
      ? DEMO_PROFILE_STATUS.ACTIVE
      : DEMO_PROFILE_STATUS.INACTIVE,
    banner: values.coverPhotoPreview || DEMO_PROFILE_DEFAULT_BANNER,
    avatar: values.profilePhotoPreview || DEMO_PROFILE_DEFAULT_AVATAR,
    socialUrl: socialLinks[0] || '',
    socialLinks,
  };
};
