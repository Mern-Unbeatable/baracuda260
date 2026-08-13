/** Admin Premium Photos detail — reuses gallery media variants with product metadata. */

import { getAdminGalleryDetailById } from '@/portals/admin/data/adminGalleryDetailData';

export { ADMIN_DETAIL_ASSETS } from '@/portals/admin/data/adminGalleryDetailData';

const SHARED_PRODUCT = {
  subtitleKey: 'adminPremiumPhotosDetail.subtitle',
  price: '$25.00',
  formatKey: 'adminPremiumPhotosDetail.specs.formatValue',
  cameraKey: 'adminPremiumPhotosDetail.specs.cameraValue',
  likes: '2150',
  views: '12400',
  totalSell: '120',
};

/** Map showcase card id → admin premium photo detail variant. */
export const getAdminPremiumPhotoDetailById = (id) => {
  const base = getAdminGalleryDetailById(id);
  const isSingle = base.variant === 'single';

  return {
    ...base,
    ...SHARED_PRODUCT,
    resolutionKey: isSingle
      ? 'adminPremiumPhotosDetail.specs.resolutionSingle'
      : 'adminPremiumPhotosDetail.specs.resolutionStory',
  };
};
