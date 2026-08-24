import { envInt, envVar } from '@/shared/config/env';

export const APP_CONFIG = {
  NAME: envVar('NAME', 'Gairewele'),
  VERSION: envVar('VERSION', '1.0.0'),
};

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  SERVICES: '/services',
  CONTACT: '/contact',
  COMPETITIONS: '/competitions',
  GALLERY: '/gallery',
  ALBUM_TYPES: '/album-types',
  BUY_PHOTOS: '/buy-photos',
  BUY_PHOTOS_DETAIL: '/buy-photos/:id',
  BUY_PHOTOS_CHECKOUT: '/buy-photos/checkout',
  BUY_PHOTOS_SUCCESS: '/buy-photos/success',
  GALLERY_DETAIL: '/gallery/:id',
  GALLERY_SIX_DETAIL: '/gallery/story/:id',
  GALLERY_SIX_BLUE_DETAIL: '/gallery/story-blue/:id',
  GALLERY_TWELVE_DETAIL: '/gallery/zodiac/:id',
  PHOTOGRAPHER_PROFILE: '/photographer',
  LEADERBOARD: '/leaderboard',
  WINNERS: '/winners',
  WINNERS_DETAIL: '/winners/:id',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  COOKIES: '/cookies',
  DEVELOPER: '/developer',
  DEVELOPER_COMPONENT: '/developer/:componentId',
  LOGIN: '/login',
  SIGNUP: '/signup',
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_UPLOAD_PHOTOS: '/admin/upload-photos',
  ADMIN_UPLOAD_SINGLE: '/admin/upload-photos/single',
  ADMIN_UPLOAD_SIX: '/admin/upload-photos/six',
  ADMIN_UPLOAD_ZODIAC12: '/admin/upload-photos/zodiac',
  ADMIN_MY_ARTWORK: '/admin/my-artwork',
  ADMIN_MY_ARTWORK_UPLOAD: '/admin/my-artwork/upload',
  ADMIN_MY_ARTWORK_UPLOAD_SINGLE: '/admin/my-artwork/upload/single',
  ADMIN_MY_ARTWORK_UPLOAD_SIX: '/admin/my-artwork/upload/six',
  ADMIN_MY_ARTWORK_UPLOAD_ZODIAC12: '/admin/my-artwork/upload/zodiac',
  ADMIN_NEWS_MESSAGES: '/admin/news-messages',
  ADMIN_NEWS_MESSAGES_UPLOAD: '/admin/news-messages/upload',
  ADMIN_SELL_PHOTOS: '/admin/sell-photos',
  ADMIN_SELL_PHOTOS_UPLOAD: '/admin/sell-photos/upload',
  ADMIN_SELL_PHOTOS_UPLOAD_SINGLE: '/admin/sell-photos/upload/single',
  ADMIN_SELL_PHOTOS_UPLOAD_SIX: '/admin/sell-photos/upload/six',
  ADMIN_SELL_PHOTOS_UPLOAD_ZODIAC12: '/admin/sell-photos/upload/zodiac',
  ADMIN_FAVOURITE_PHOTOGRAPHERS: '/admin/favourite-photographers',
  ADMIN_MY_COMPETITIONS: '/admin/my-competitions',
  ADMIN_MY_COMPETITION_DETAIL: '/admin/my-competitions/:id',
  ADMIN_GALLERY: '/admin/gallery',
  ADMIN_GALLERY_DETAIL: '/admin/gallery/:id',
  ADMIN_PREMIUM_PHOTOS: '/admin/premium-photos',
  ADMIN_PREMIUM_PHOTOS_DETAIL: '/admin/premium-photos/:id',
  ADMIN_PROMOTED_PRODUCTS: '/admin/promoted-products',
  ADMIN_PROMOTED_PRODUCTS_DETAIL: '/admin/promoted-products/:id',
  ADMIN_SUBMISSIONS: '/admin/submissions',
  ADMIN_BUSINESS_PHOTOS: '/admin/business-link-photos',
  ADMIN_BUSINESS_PHOTOS_DETAIL: '/admin/business-link-photos/:id',
  ADMIN_CHAT: '/admin/chat',
  ADMIN_NOTIFICATIONS: '/admin/notifications',
  ADMIN_PRIZE_PAYMENTS: '/admin/prize-payments',
  ADMIN_CONTACT_US: '/admin/contact-us',
  ADMIN_PROFILE: '/admin/profile',
  ADMIN_PROFILE_FOLLOWING: '/admin/profile/following',
  ADMIN_PROFILE_FOLLOWERS: '/admin/profile/followers',
  ADMIN_PROFILE_SETTINGS: '/admin/profile/settings',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_USERS: '/admin/users',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_ALBUM_TYPES: '/admin/album-types',
  ADMIN_WINNERS: '/admin/winners',
  ADMIN_PAYOUTS: '/admin/payouts',
  ADMIN_SUPPORT: '/admin/support',
  ADMIN_NEWSLETTER: '/admin/newsletter',
  ADMIN_COMMENT: '/admin/comment',
  ADMIN_DEMO_PROFILES: '/admin/demo-profiles',
  ADMIN_DEMO_PROFILES_CREATE: '/admin/demo-profiles/create',
};

/** Site header nav — add new pages here AND register them in router.jsx */
export const SITE_NAV_LINKS = [
  { labelKey: 'nav.competitions', href: ROUTES.COMPETITIONS },
  { labelKey: 'nav.gallery', href: ROUTES.GALLERY },
  { labelKey: 'nav.buyPhotos', href: ROUTES.BUY_PHOTOS },
  { labelKey: 'nav.albumTypes', href: ROUTES.ALBUM_TYPES },
  { labelKey: 'nav.leaderboard', href: ROUTES.LEADERBOARD },
  { labelKey: 'nav.winners', href: ROUTES.WINNERS },
  { labelKey: 'nav.about', href: ROUTES.ABOUT },
];

export const API_CONFIG = {
  BASE_URL: envVar('API_BASE_URL', 'https://backend.c4r.co.uk'),
  VITALS_ENDPOINT: envVar('VITALS_ENDPOINT', ''),
  TIMEOUT: envInt('API_TIMEOUT', 10000),
  RETRY_ATTEMPTS: envInt('API_RETRY_ATTEMPTS', 3),
  RETRY_DELAY: envInt('API_RETRY_DELAY', 1000),
};

export const SEO_CONFIG = {
  DEFAULT_TITLE: envVar('SEO_TITLE', 'Gairewele'),
  DEFAULT_DESCRIPTION: envVar('SEO_DESCRIPTION', 'A professional React application'),
  DEFAULT_KEYWORDS: envVar('SEO_KEYWORDS', 'react,vite,tailwind').split(','),
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
  URL: envVar('SOCKET_URL', API_CONFIG.BASE_URL),
};
