/** Admin Business Link Photos + Details — Figma 345:679 / 345:1130. */

import { TWELVE_STORY_SLIDES } from '../../data/galleryTwelveStory';

const A = '/assets/admin-business-link';

export const ADMIN_BUSINESS_LINK_ASSETS = {
  eye: `${A}/icon-eye.svg`,
  hero: `${A}/hero.jpg`,
  arrow: `${A}/icon-arrow.svg`,
  copy: `${A}/icon-copy.svg`,
  ariesWhite: `${A}/icon-aries-white.svg`,
  photographer: `${A}/photographer.jpg`,
  curve: `${A}/curve.svg`,
  divider: `${A}/divider.svg`,
  thumbs: [
    `${A}/thumb-1.jpg`,
    `${A}/thumb-2.jpg`,
    `${A}/thumb-3.jpg`,
    `${A}/thumb-4.jpg`,
    `${A}/thumb-5.jpg`,
  ],
};

export const EYE_ICON_SIZE = 24;
export const ARROW_ICON_SIZE = 16;
export const COPY_ICON_SIZE = 20;
export const BUSINESS_LINK_PAGE_SIZE = 7;
export const BUSINESS_LINK_SLIDE_MS = 6000;

/** Mock rows matching Figma 345:679. */
export const ADMIN_BUSINESS_LINK_ROWS = [
  {
    id: 'john-anderson',
    userKey: 'adminBusinessLink.rows.john.user',
    email: 'john.anderson@company.com',
    phone: '+324 356 9876',
    countryKey: 'adminBusinessLink.rows.john.country',
    uploadDate: '6/9/2026',
  },
  {
    id: 'sarah-mitchell',
    userKey: 'adminBusinessLink.rows.sarah.user',
    email: 'sarah.m@email.com',
    phone: '+324 356 9876',
    countryKey: 'adminBusinessLink.rows.sarah.country',
    uploadDate: '6/9/2026',
  },
  {
    id: 'buildpro-corp',
    userKey: 'adminBusinessLink.rows.buildpro.user',
    email: 'admin@buildpro.com',
    phone: '+324 356 9876',
    countryKey: 'adminBusinessLink.rows.buildpro.country',
    uploadDate: '6/9/2026',
  },
  {
    id: 'mike-johnson',
    userKey: 'adminBusinessLink.rows.mike.user',
    email: 'contact@construction.com',
    phone: '+324 356 9876',
    countryKey: 'adminBusinessLink.rows.mike.country',
    uploadDate: '6/9/2026',
  },
  {
    id: 'construction-ltd',
    userKey: 'adminBusinessLink.rows.construction.user',
    email: 'emily.d@email.com',
    phone: '+324 356 9876',
    countryKey: 'adminBusinessLink.rows.construction.country',
    uploadDate: '6/9/2026',
  },
  {
    id: 'emily-davis',
    userKey: 'adminBusinessLink.rows.emily.user',
    email: 'emily.d@email.com',
    phone: '+324 356 9876',
    countryKey: 'adminBusinessLink.rows.emily.country',
    uploadDate: '6/9/2026',
  },
  {
    id: 'david-chen',
    userKey: 'adminBusinessLink.rows.david.user',
    email: 'david.chen@studio.com',
    phone: '+324 356 9876',
    countryKey: 'adminBusinessLink.rows.david.country',
    uploadDate: '6/9/2026',
  },
];

/** Figma 345:1130 album used for every table row detail (shared demo album). */
export const BUSINESS_LINK_DETAIL_ALBUM = {
  albumId: 'ALB-45215',
  initials: 'AC',
  nameKey: 'adminBusinessLink.detail.name',
  email: 'amelia.carter@northwind.co',
  phone: '+1 (415) 555-0132',
  countryKey: 'adminBusinessLink.detail.country',
  uploadedKey: 'adminBusinessLink.detail.uploaded',
  statusKey: 'adminBusinessLink.detail.statusBadge',
  titleKey: 'adminBusinessLink.detail.photoTitle',
  descriptionKey: 'adminBusinessLink.detail.photoDescription',
  typeBadgeKey: 'adminBusinessLink.detail.typeBadge',
  categoryBadgeKey: 'adminBusinessLink.detail.categoryBadge',
  businessLink: 'https://website.com/business/album-45215',
  photographerKey: 'adminBusinessLink.detail.photographer',
  photographerAvatar: ADMIN_BUSINESS_LINK_ASSETS.photographer,
  slides: TWELVE_STORY_SLIDES.map((slide, index) => ({
    id: slide.id,
    number: slide.number,
    sign: slide.sign,
    theme: slide.theme,
    icon: slide.icon,
    iconBoxed: Boolean(slide.iconBoxed),
    iconBg: slide.iconBg,
    iconOverlay: slide.iconOverlay,
    thumb:
      ADMIN_BUSINESS_LINK_ASSETS.thumbs[index % ADMIN_BUSINESS_LINK_ASSETS.thumbs.length] ||
      slide.thumb,
    hero: index === 0 ? ADMIN_BUSINESS_LINK_ASSETS.hero : slide.hero || slide.thumb,
  })),
};

/**
 * @param {typeof ADMIN_BUSINESS_LINK_ROWS} rows
 * @param {number} page
 * @param {number} pageSize
 */
export const paginateBusinessLinkRows = (rows, page, pageSize) => {
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * pageSize;
  return rows.slice(start, start + pageSize);
};

/**
 * @param {number} page
 * @param {number} pageSize
 * @param {number} total
 */
export const getBusinessLinkResultRange = (page, pageSize, total) => {
  if (total <= 0) return { from: 0, to: 0, total: 0 };
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  return { from, to, total };
};

/**
 * @param {string} id
 * @param {typeof ADMIN_BUSINESS_LINK_ROWS} [rows]
 */
export const findBusinessLinkRowById = (id, rows = ADMIN_BUSINESS_LINK_ROWS) =>
  rows.find((row) => row.id === id) || null;

/**
 * Detail path for a table row.
 * @param {string} id
 * @param {string} template
 */
export const getBusinessLinkDetailPath = (
  id,
  template = '/admin/business-link-photos/:id',
) => template.replace(':id', id);

/**
 * Album detail for a submission id (Figma 345:1130 demo album).
 * @param {string} id
 */
export const getBusinessLinkDetailById = (id) => {
  const row = findBusinessLinkRowById(id);
  if (!row) return null;
  return {
    ...BUSINESS_LINK_DETAIL_ALBUM,
    submissionId: row.id,
  };
};
