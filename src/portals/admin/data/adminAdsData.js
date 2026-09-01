/** Admin Ads Management — table + sidebar details drawer. */

const A = '/assets/admin-comment';

export const ADMIN_ADS_ASSETS = {
  more: `${A}/icon-more.svg`,
};

export const MORE_ICON_SIZE = 20;
export const ADS_PAGE_SIZE = 12;

export const ADS_STATUS = {
  ACTIVE: 'active',
  PUBLISHED: 'published',
  REJECTED: 'rejected',
};

export const ACTION_MENU_OPTIONS = [
  { id: 'details', labelKey: 'adminAds.actions.seeDetails', kind: 'details' },
  { id: ADS_STATUS.PUBLISHED, labelKey: 'adminAds.actions.publish', kind: 'status' },
  { id: ADS_STATUS.REJECTED, labelKey: 'adminAds.actions.reject', kind: 'status' },
];

const SHARED_IMAGE = '/assets/competition-details/hero.jpg';
const SHARED_AVATAR = '/assets/competition-details/avatar-1.jpg';

export const ADMIN_ADS_ROWS = [
  {
    id: 'ad-1',
    code: 'AD-0001',
    nameKey: 'adminAds.rows.elena.name',
    email: 'elena.v@mail.com',
    phone: '+01780053624',
    businessTypeKey: 'adminAds.businessTypes.online',
    pageNameKey: 'adminAds.pageNames.premiumPhotos',
    price: '$35',
    uploadDate: '8/25/2026',
    status: ADS_STATUS.ACTIVE,
    image: SHARED_IMAGE,
    businessNameKey: 'adminAds.rows.elena.businessName',
    businessLocationKey: 'adminAds.rows.elena.businessLocation',
    descriptionKey: 'adminAds.drawer.sampleDescription',
    avatar: SHARED_AVATAR,
    adsStartDate: '8/25/2026',
    adsEndDate: '9/6/2026',
    totalDaysKey: 'adminAds.drawer.totalDaysValue',
    subtotal: '$865.00',
  },
  {
    id: 'ad-2',
    code: 'AD-0002',
    nameKey: 'adminAds.rows.marcus.name',
    email: 'marcus.k@mail.com',
    phone: '+01780053625',
    businessTypeKey: 'adminAds.businessTypes.local',
    pageNameKey: 'adminAds.pageNames.buyPhotos',
    price: '$60',
    uploadDate: '8/24/2026',
    status: ADS_STATUS.ACTIVE,
    image: SHARED_IMAGE,
    businessNameKey: 'adminAds.rows.marcus.businessName',
    businessLocationKey: 'adminAds.rows.marcus.businessLocation',
    descriptionKey: 'adminAds.drawer.sampleDescription',
    avatar: '/assets/competition-details/avatar-2.jpg',
    adsStartDate: '8/24/2026',
    adsEndDate: '9/10/2026',
    totalDaysKey: 'adminAds.drawer.totalDaysValueAlt',
    subtotal: '$1,240.00',
  },
  {
    id: 'ad-3',
    code: 'AD-0003',
    nameKey: 'adminAds.rows.sofia.name',
    email: 'sofia.r@mail.com',
    phone: '+01780053626',
    businessTypeKey: 'adminAds.businessTypes.online',
    pageNameKey: 'adminAds.pageNames.gallery',
    price: '$35',
    uploadDate: '8/23/2026',
    status: ADS_STATUS.ACTIVE,
    image: SHARED_IMAGE,
    businessNameKey: 'adminAds.rows.sofia.businessName',
    businessLocationKey: 'adminAds.rows.sofia.businessLocation',
    descriptionKey: 'adminAds.drawer.sampleDescription',
    avatar: '/assets/competition-details/avatar-3.jpg',
    adsStartDate: '8/23/2026',
    adsEndDate: '9/2/2026',
    totalDaysKey: 'adminAds.drawer.totalDaysValue',
    subtotal: '$620.00',
  },
  {
    id: 'ad-4',
    code: 'AD-0004',
    nameKey: 'adminAds.rows.james.name',
    email: 'james.p@mail.com',
    phone: '+01780053627',
    businessTypeKey: 'adminAds.businessTypes.local',
    pageNameKey: 'adminAds.pageNames.competitions',
    price: '$60',
    uploadDate: '8/22/2026',
    status: ADS_STATUS.ACTIVE,
    image: SHARED_IMAGE,
    businessNameKey: 'adminAds.rows.james.businessName',
    businessLocationKey: 'adminAds.rows.james.businessLocation',
    descriptionKey: 'adminAds.drawer.sampleDescription',
    avatar: '/assets/competition-details/avatar-4.jpg',
    adsStartDate: '8/22/2026',
    adsEndDate: '9/8/2026',
    totalDaysKey: 'adminAds.drawer.totalDaysValueAlt',
    subtotal: '$980.00',
  },
  {
    id: 'ad-5',
    code: 'AD-0005',
    nameKey: 'adminAds.rows.amira.name',
    email: 'amira.h@mail.com',
    phone: '+01780053628',
    businessTypeKey: 'adminAds.businessTypes.online',
    pageNameKey: 'adminAds.pageNames.premiumPhotos',
    price: '$35',
    uploadDate: '8/21/2026',
    status: ADS_STATUS.ACTIVE,
    image: SHARED_IMAGE,
    businessNameKey: 'adminAds.rows.amira.businessName',
    businessLocationKey: 'adminAds.rows.amira.businessLocation',
    descriptionKey: 'adminAds.drawer.sampleDescription',
    avatar: '/assets/competition-details/avatar-5.jpg',
    adsStartDate: '8/21/2026',
    adsEndDate: '9/4/2026',
    totalDaysKey: 'adminAds.drawer.totalDaysValue',
    subtotal: '$735.00',
  },
  {
    id: 'ad-6',
    code: 'AD-0006',
    nameKey: 'adminAds.rows.luca.name',
    email: 'luca.m@mail.com',
    phone: '+01780053629',
    businessTypeKey: 'adminAds.businessTypes.local',
    pageNameKey: 'adminAds.pageNames.leaderboard',
    price: '$60',
    uploadDate: '8/20/2026',
    status: ADS_STATUS.ACTIVE,
    image: SHARED_IMAGE,
    businessNameKey: 'adminAds.rows.luca.businessName',
    businessLocationKey: 'adminAds.rows.luca.businessLocation',
    descriptionKey: 'adminAds.drawer.sampleDescription',
    avatar: SHARED_AVATAR,
    adsStartDate: '8/20/2026',
    adsEndDate: '9/12/2026',
    totalDaysKey: 'adminAds.drawer.totalDaysValueAlt',
    subtotal: '$1,560.00',
  },
  {
    id: 'ad-7',
    code: 'AD-0007',
    nameKey: 'adminAds.rows.nina.name',
    email: 'nina.w@mail.com',
    phone: '+01780053630',
    businessTypeKey: 'adminAds.businessTypes.online',
    pageNameKey: 'adminAds.pageNames.buyPhotos',
    price: '$35',
    uploadDate: '8/19/2026',
    status: ADS_STATUS.ACTIVE,
    image: SHARED_IMAGE,
    businessNameKey: 'adminAds.rows.nina.businessName',
    businessLocationKey: 'adminAds.rows.nina.businessLocation',
    descriptionKey: 'adminAds.drawer.sampleDescription',
    avatar: '/assets/competition-details/avatar-2.jpg',
    adsStartDate: '8/19/2026',
    adsEndDate: '9/1/2026',
    totalDaysKey: 'adminAds.drawer.totalDaysValue',
    subtotal: '$455.00',
  },
];

export const paginateAds = (rows, page, pageSize) => {
  const start = (page - 1) * pageSize;
  return rows.filter((row) => row.status !== ADS_STATUS.REJECTED).slice(start, start + pageSize);
};

export const getAdsTotal = (rows) =>
  rows.filter((row) => row.status !== ADS_STATUS.REJECTED).length;

export const updateAdStatus = (rows, rowId, nextStatus) =>
  rows.map((row) => (row.id === rowId ? { ...row, status: nextStatus } : row));
