/** Admin Business Link Photos — Figma node 345:679. */

const A = '/assets/admin-business-link';

export const ADMIN_BUSINESS_LINK_ASSETS = {
  eye: `${A}/icon-eye.svg`,
};

export const EYE_ICON_SIZE = 24;
export const BUSINESS_LINK_PAGE_SIZE = 7;

/** Mock rows matching Figma 345:679 (footer shows 7; sixth+seventh mirror design density). */
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
 * Inclusive range labels for "Showing X to Y of Z results".
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
