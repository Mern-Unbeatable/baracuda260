import {
  PREMIUM_PHOTOS_CARDS,
  filterPremiumPhotosCards,
  getPremiumPhotoDetailPath,
} from '@/portals/admin/data/adminPremiumPhotosData';
import { getAdminPremiumPhotoDetailById } from '@/portals/admin/data/adminPremiumPhotosDetailData';

describe('adminPremiumPhotosData', () => {
  it('exposes twelve showcase cards', () => {
    expect(PREMIUM_PHOTOS_CARDS).toHaveLength(12);
  });

  it('returns all cards when filter is all', () => {
    expect(filterPremiumPhotosCards(PREMIUM_PHOTOS_CARDS, 'all')).toHaveLength(12);
  });

  it('builds premium photo detail paths', () => {
    expect(getPremiumPhotoDetailPath('wings', '/admin/premium-photos/:id')).toBe(
      '/admin/premium-photos/wings',
    );
  });
});

describe('adminPremiumPhotosDetailData', () => {
  it('includes product metadata and sales stats', () => {
    const detail = getAdminPremiumPhotoDetailById('wings');

    expect(detail.price).toBe('$25.00');
    expect(detail.totalSell).toBe('120');
    expect(detail.resolutionKey).toBe('adminPremiumPhotosDetail.specs.resolutionSingle');
  });

  it('uses story resolution for multi-photo variants', () => {
    const detail = getAdminPremiumPhotoDetailById('autumn');

    expect(detail.resolutionKey).toBe('adminPremiumPhotosDetail.specs.resolutionStory');
  });
});
