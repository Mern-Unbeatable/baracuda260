import { DASHBOARD_ASSETS } from '@/portals/member/data/dashboardAssets';
import { resolveMediaUrl } from '@/shared/utils/media';
import { GALLERY_PHOTOS } from './galleryPhotos';

const A = '/assets/home';

export const GALLERY_DETAIL_ASSETS = {
  aries: `${A}/icon-aries.svg`,
  photographer: `${A}/avatar-photographer.webp`,
  commentAvatar: `${A}/avatar-comment.webp`,
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
  videoPoster:
    resolveMediaUrl(
      story.videoPoster ||
      story.video?.thumbnailUrl ||
      story.video?.poster
    ) || heroSrc,
  videoSrc: story.videoSrc ?? story.video?.url ?? GALLERY_DETAIL_DEMO_VIDEO,
  donationAvatar:
    resolveMediaUrl(
      story.donationAvatar ||
      story.user?.avatar ||
      story.photographerAvatar ||
      story.avatar
    ) || DASHBOARD_ASSETS.avatar,
  donationBio: story.donationBio || story.story || null,
});

/** Demo-only placeholders — do not use for live artwork/sell detail pages. */
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

const formatBytes = (bytes) => {
  const n = Number(bytes);
  if (!Number.isFinite(n) || n <= 0) return null;
  if (n >= 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  if (n >= 1024) return `${Math.round(n / 1024)} KB`;
  return `${n} B`;
};

const mimeToFileType = (format) => {
  if (!format || typeof format !== 'string') return null;
  if (format.includes('/')) {
    const subtype = format.split('/')[1]?.split('+')[0];
    return subtype ? subtype.toUpperCase() : format;
  }
  return format;
};

export const resolveGalleryImageDetails = (story) => {
  const fromStory = story?.imageDetails ?? {};
  const categories = [
    story?.categoryName || story?.category,
    story?.subcategoryName || story?.subcategory,
    story?.badge,
  ]
    .filter(Boolean)
    .join(', ');

  let formattedDate =
    fromStory.uploadDate || story?.uploadDate || story?.uploadedDate || story?.date;
  if (!formattedDate && story?.createdAt) {
    try {
      const d = new Date(story.createdAt);
      if (!Number.isNaN(d.getTime())) {
        formattedDate = d.toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        });
      }
    } catch {
      formattedDate = String(story.createdAt);
    }
  }

  const bytes =
    fromStory.bytes ??
    story?.bytes ??
    story?.video?.bytes ??
    (Array.isArray(story?.images)
      ? story.images[0]?.bytes
      : Object.values(story?.images || {})[0]?.bytes);

  return {
    credit:
      fromStory.credit ??
      story?.photographer ??
      story?.user?.name ??
      story?.user?.username ??
      null,
    creditHref: story?.user?.username
      ? `/photographer/${story.user.username}`
      : story?.user?.id
        ? `/photographer/${story.user.id}`
        : null,
    creativeNumber:
      fromStory.creativeNumber ??
      story?.creativeNumber ??
      (story?.id ? String(story.id).slice(0, 8).toUpperCase() : null),
    // Upload forms never collect camera — never surface seed/API leftovers
    camera: null,
    resolution: fromStory.resolution ?? story?.resolution ?? null,
    quality: fromStory.quality ?? story?.quality ?? null,
    fileType:
      fromStory.fileType ??
      mimeToFileType(story?.format) ??
      mimeToFileType(
        Array.isArray(story?.images)
          ? story.images[0]?.format
          : Object.values(story?.images || {})[0]?.format,
      ) ??
      null,
    fileSize: fromStory.fileSize ?? formatBytes(bytes),
    uploadDate: formattedDate || null,
    categories: fromStory.categories || categories || null,
    isAiGenerated: Boolean(
      fromStory.isAiGenerated ?? story?.isAiGenerated ?? story?.aiBadge,
    ),
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

/** Merge listing metadata (e.g. AI flag) when the detail id matches a gallery photo. */
export const mergeGalleryPhotoMeta = (id, entry) => {
  const photo = GALLERY_PHOTOS.find((item) => item.id === id);
  if (!photo || !entry) return entry;
  return {
    ...entry,
    isAiGenerated: entry.isAiGenerated ?? photo.isAiGenerated ?? false,
  };
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
