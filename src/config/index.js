export const APP_CONFIG = {
  NAME: process.env.REACT_APP_NAME || 'Gairewele',
  VERSION: process.env.REACT_APP_VERSION || '1.0.0',
};

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  SERVICES: '/services',
  CONTACT: '/contact',
  COMPETITIONS: '/competitions',
  GALLERY: '/gallery',
  GALLERY_DETAIL: '/gallery/:id',
  GALLERY_SIX_DETAIL: '/gallery/story/:id',
  GALLERY_SIX_BLUE_DETAIL: '/gallery/story-blue/:id',
  GALLERY_TWELVE_DETAIL: '/gallery/zodiac/:id',
  PHOTOGRAPHER_PROFILE: '/photographer',
  LEADERBOARD: '/leaderboard',
  WINNERS: '/winners',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  COOKIES: '/cookies',
  LOGIN: '/login',
  SIGNUP: '/signup',
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_UPLOAD_PHOTOS: '/admin/upload-photos',
  ADMIN_MY_COMPETITIONS: '/admin/my-competitions',
  ADMIN_BUSINESS_PHOTOS: '/admin/business-link-photos',
  ADMIN_CHAT: '/admin/chat',
  ADMIN_PRIZE_PAYMENTS: '/admin/prize-payments',
  ADMIN_PROFILE: '/admin/profile',
};

/** Site header nav — add new pages here AND register them in router.jsx */
export const SITE_NAV_LINKS = [
  { labelKey: 'nav.home', href: ROUTES.HOME, end: true },
  { labelKey: 'nav.competitions', href: ROUTES.COMPETITIONS },
  { labelKey: 'nav.gallery', href: ROUTES.GALLERY },
  { labelKey: 'nav.leaderboard', href: ROUTES.LEADERBOARD },
  { labelKey: 'nav.winners', href: ROUTES.WINNERS },
  { labelKey: 'nav.about', href: ROUTES.ABOUT },
];

export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://backend.c4r.co.uk',
  VITALS_ENDPOINT: process.env.REACT_APP_VITALS_ENDPOINT || '',
  TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT || '10000', 10),
  RETRY_ATTEMPTS: parseInt(process.env.REACT_APP_API_RETRY_ATTEMPTS || '3', 10),
  RETRY_DELAY: parseInt(process.env.REACT_APP_API_RETRY_DELAY || '1000', 10),
};

export const SEO_CONFIG = {
  DEFAULT_TITLE: process.env.REACT_APP_SEO_TITLE || 'Gairewele',
  DEFAULT_DESCRIPTION: process.env.REACT_APP_SEO_DESCRIPTION || 'A professional React application',
  DEFAULT_KEYWORDS: (process.env.REACT_APP_SEO_KEYWORDS || 'react,webpack,tailwind').split(','),
  SITE_URL: typeof window !== 'undefined' ? window.location.origin : '',
};

export const PERFORMANCE_BUDGETS = {
  LCP: 2500,
  FCP: 1800,
  CLS: 0.1,
  INP: 200,
  TTFB: 800,
};

export const TOAST_CONFIG = {
  POSITION: 'top-center',
  DURATION: 3000,
};

export const SOCKET_CONFIG = {
  URL: process.env.REACT_APP_SOCKET_URL || API_CONFIG.BASE_URL,
};
