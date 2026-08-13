import {
  GALLERY_CARDS,
  filterGalleryCards,
  getGalleryDetailPath,
} from '@/portals/admin/data/adminGalleryData';
import { getAdminGalleryDetailById } from '@/portals/admin/data/adminGalleryDetailData';

describe('adminGalleryData', () => {
  it('exposes twelve showcase cards', () => {
    expect(GALLERY_CARDS).toHaveLength(12);
  });

  it('returns all cards when filter is all or empty', () => {
    expect(filterGalleryCards(GALLERY_CARDS, 'all')).toHaveLength(12);
    expect(filterGalleryCards(GALLERY_CARDS, null)).toHaveLength(12);
  });

  it('filters cards by album type', () => {
    expect(filterGalleryCards(GALLERY_CARDS, 'single')).toHaveLength(7);
    expect(filterGalleryCards(GALLERY_CARDS, 'zodiac')).toHaveLength(2);
  });

  it('builds gallery detail paths', () => {
    expect(getGalleryDetailPath('autumn', '/admin/gallery/:id')).toBe('/admin/gallery/autumn');
  });
});

describe('adminGalleryDetailData', () => {
  it('resolves detail variants including duplicate card ids', () => {
    expect(getAdminGalleryDetailById('autumn').variant).toBe('six-red');
    expect(getAdminGalleryDetailById('autumn-2').variant).toBe('twelve');
    expect(getAdminGalleryDetailById('tidal').variant).toBe('six-blue');
    expect(getAdminGalleryDetailById('wings').comments).toHaveLength(4);
  });

  it('uses total react instead of votes label field', () => {
    expect(getAdminGalleryDetailById('wings').totalReact).toBe('2150');
  });
});
