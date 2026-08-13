/** Admin Gallery Photo Details — reuses competition detail media variants. */

import {
  ADMIN_DETAIL_ASSETS,
  getAdminCompetitionDetailById,
} from '@/portals/admin/data/adminCompetitionDetailData';

export { ADMIN_DETAIL_ASSETS };

export const ADMIN_GALLERY_COMMENTS = [
  {
    id: 'comment-1',
    nameKey: 'adminGalleryDetail.comments.darrell',
    textKey: 'adminGalleryDetail.comments.text1',
  },
  {
    id: 'comment-2',
    nameKey: 'adminGalleryDetail.comments.darrell',
    textKey: 'adminGalleryDetail.comments.text2',
  },
  {
    id: 'comment-3',
    nameKey: 'adminGalleryDetail.comments.darrell',
    textKey: 'adminGalleryDetail.comments.text1',
  },
  {
    id: 'comment-4',
    nameKey: 'adminGalleryDetail.comments.darrell',
    textKey: 'adminGalleryDetail.comments.text2',
  },
];

const GALLERY_DETAIL_ID_MAP = {
  golden: 'wings',
  tidal: 'city',
  'autumn-2': 'zodiac',
  'wings-2': 'wings',
};

const resolveBaseId = (id) => GALLERY_DETAIL_ID_MAP[id] || id.replace(/-(2|b)$/, '');

/** Map showcase card id → admin gallery detail variant. */
export const getAdminGalleryDetailById = (id) => {
  const base = getAdminCompetitionDetailById(resolveBaseId(id));

  return {
    ...base,
    totalReact: base.votes ?? '2150',
    comments: ADMIN_GALLERY_COMMENTS,
  };
};
