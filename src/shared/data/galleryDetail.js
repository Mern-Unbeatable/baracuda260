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

export const GALLERY_DETAIL_DONATION_AMOUNTS = [5, 10, 25, 50, 100];

/** Demo video used when an entry has no explicit `videoSrc`. */
export const GALLERY_DETAIL_DEMO_VIDEO =
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';

export const resolveGalleryDetailMedia = (story, heroSrc) => ({
  videoPoster: story.videoPoster || heroSrc,
  videoSrc: story.videoSrc ?? GALLERY_DETAIL_DEMO_VIDEO,
  donationAvatar: story.donationAvatar || GALLERY_DETAIL_ASSETS.photographer,
  donationBio: story.donationBio || null,
});

export const DEFAULT_GALLERY_IMAGE_DETAILS = {
  credit: 'Wong kar-wai',
  creativeNumber: '2278500954',
  resolution: '1200×800',
  quality: '4K',
  fileType: 'JPEG',
  fileSize: '125 KB',
  uploadDate: '01 June, 2026',
  categories: 'Stock Photos Flower',
};

export const resolveGalleryImageDetails = (story) => {
  const fromStory = story.imageDetails ?? {};
  const categories = [story.category, story.badge].filter(Boolean).join(' ');

  return {
    credit: fromStory.credit ?? story.photographer ?? DEFAULT_GALLERY_IMAGE_DETAILS.credit,
    creativeNumber:
      fromStory.creativeNumber ?? story.creativeNumber ?? DEFAULT_GALLERY_IMAGE_DETAILS.creativeNumber,
    resolution: fromStory.resolution ?? story.resolution ?? DEFAULT_GALLERY_IMAGE_DETAILS.resolution,
    quality: fromStory.quality ?? DEFAULT_GALLERY_IMAGE_DETAILS.quality,
    fileType: fromStory.fileType ?? story.format ?? DEFAULT_GALLERY_IMAGE_DETAILS.fileType,
    fileSize: fromStory.fileSize ?? DEFAULT_GALLERY_IMAGE_DETAILS.fileSize,
    uploadDate: fromStory.uploadDate ?? story.date ?? DEFAULT_GALLERY_IMAGE_DETAILS.uploadDate,
    categories:
      fromStory.categories ?? (categories || DEFAULT_GALLERY_IMAGE_DETAILS.categories),
  };
};

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
