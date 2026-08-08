/** Shared assets + variant config for gallery detail pages. */

const A = '/assets/home';

export const GALLERY_DETAIL_ASSETS = {
  aries: `${A}/icon-aries.svg`,
  photographer: `${A}/avatar-photographer.jpg`,
  commentAvatar: `${A}/avatar-comment.jpg`,
  verified: `${A}/icon-verified.svg`,
  voteHeart: `${A}/icon-vote-heart.svg`,
  arrow: `${A}/icon-arrow-nav.svg`,
};

export const GALLERY_DETAIL_COMMENTS = [
  {
    name: 'Darrell Steward',
    text: 'I really like the composition and the colors. Amazing work!',
  },
  {
    name: 'Darrell Steward',
    text: 'Your creativity really stands out. Best of luck in the competition!',
  },
];

export const GALLERY_DETAIL_SLIDE_MS = 6000;

/**
 * @typedef {'single' | 'six' | 'sixBlue' | 'twelve'} GalleryDetailVariantId
 */

/** @type {Record<GalleryDetailVariantId, object>} */
export const GALLERY_DETAIL_VARIANTS = {
  single: {
    id: 'single',
    rootClassName: 'gallery-detail-page-root',
    stripLayout: null,
    curveSrc: null,
    curveHeightClass: '',
    curveObjectClass: '',
    submitLabelKey: 'galleryDetail.postComment',
    commentFieldId: 'gallery-comment',
    stripAccent: 'red',
  },
  six: {
    id: 'six',
    rootClassName: 'gallery-six-detail-page-root',
    stripLayout: 'six',
    curveSrc: `${A}/curve-story.svg`,
    curveHeightClass: 'h-8 sm:h-[52px]',
    curveObjectClass: 'object-fill',
    submitLabelKey: 'galleryDetail.submit',
    commentFieldId: 'gallery-six-comment',
    stripAccent: 'red',
  },
  sixBlue: {
    id: 'sixBlue',
    rootClassName: 'gallery-six-blue-detail-page-root',
    stripLayout: 'six',
    curveSrc: `${A}/curve-story-blue.svg`,
    curveHeightClass: 'h-8 sm:h-[52px]',
    curveObjectClass: 'object-fill',
    submitLabelKey: 'galleryDetail.submit',
    commentFieldId: 'gallery-six-blue-comment',
    stripAccent: 'blue',
  },
  twelve: {
    id: 'twelve',
    rootClassName: 'gallery-twelve-detail-page-root',
    stripLayout: 'twelve',
    curveSrc: `${A}/curve-story-12.svg`,
    curveHeightClass: 'h-10 sm:h-[72px] xl:h-[103px]',
    curveObjectClass: 'object-contain',
    submitLabelKey: 'galleryDetail.submit',
    commentFieldId: 'gallery-twelve-comment',
    stripAccent: 'mixed',
  },
};

/** Normalize a single-photo gallery entry into the shared story shape. */
export const toGalleryDetailEntry = (photo) => {
  if (photo.slides?.length) return photo;
  return {
    ...photo,
    slides: [
      {
        id: 'main',
        hero: photo.image,
        thumb: photo.image,
        sign: 'Aries',
        icon: GALLERY_DETAIL_ASSETS.aries,
        number: '1',
        theme: 'red',
      },
    ],
  };
};

export const isBlueSlide = (slide, stripAccent) => {
  if (stripAccent === 'blue') return true;
  if (stripAccent === 'red') return false;
  return slide?.theme === 'blue';
};
