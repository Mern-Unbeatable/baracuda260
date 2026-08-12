import {
  ADMIN_BUSINESS_LINK_ROWS,
  getBusinessLinkDetailById,
  getBusinessLinkDetailPath,
  getBusinessLinkResultRange,
  paginateBusinessLinkRows,
} from '@/portals/admin/data/adminBusinessLinkData';

describe('adminBusinessLinkData helpers', () => {
  it('paginates rows by page size', () => {
    const pageOne = paginateBusinessLinkRows(ADMIN_BUSINESS_LINK_ROWS, 1, 3);
    const pageTwo = paginateBusinessLinkRows(ADMIN_BUSINESS_LINK_ROWS, 2, 3);

    expect(pageOne).toHaveLength(3);
    expect(pageOne[0].id).toBe('john-anderson');
    expect(pageTwo[0].id).toBe('mike-johnson');
  });

  it('builds inclusive result ranges', () => {
    expect(getBusinessLinkResultRange(1, 7, 7)).toEqual({ from: 1, to: 7, total: 7 });
    expect(getBusinessLinkResultRange(2, 3, 7)).toEqual({ from: 4, to: 6, total: 7 });
    expect(getBusinessLinkResultRange(1, 7, 0)).toEqual({ from: 0, to: 0, total: 0 });
  });

  it('includes seven Figma mock rows', () => {
    expect(ADMIN_BUSINESS_LINK_ROWS).toHaveLength(7);
  });

  it('builds detail paths and album lookups', () => {
    expect(getBusinessLinkDetailPath('john-anderson')).toBe(
      '/admin/business-link-photos/john-anderson',
    );
    expect(getBusinessLinkDetailById('missing')).toBeNull();
    const detail = getBusinessLinkDetailById('john-anderson');
    expect(detail?.albumId).toBe('ALB-45215');
    expect(detail?.slides).toHaveLength(12);
    expect(detail?.businessLink).toContain('album-45215');
  });
});
