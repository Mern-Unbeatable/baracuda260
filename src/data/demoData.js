/** Shared demo payloads for /developer previews and local UI work. */

import { GALLERY_SIX_STORIES } from '@/shared/data/gallerySixStory';
import { GALLERY_TWELVE_STORIES } from '@/shared/data/galleryTwelveStory';
import { BUY_PHOTOS } from '@/shared/data/buyPhotos';
import { COMPETITION_CARDS } from '@/shared/data/competitionsMarketing';
import { FAVOURITE_PHOTOGRAPHERS } from '@/portals/member/data/favouritePhotographersData';
import { MY_MESSAGES } from '@/portals/member/data/myMessagesData';
import { MEMBER_NOTIFICATIONS } from '@/portals/member/data/memberNotificationsData';
import { MY_ARTWORK_STATS } from '@/portals/member/data/myArtworkData';
import { DASHBOARD_STATS } from '@/portals/member/data/dashboardAssets';
import { SELL_PHOTOS_ITEMS } from '@/portals/member/data/sellPhotosData';
import { MEMBER_PROFILE } from '@/portals/member/data/memberProfileData';
import {
  PHOTOGRAPHER_PROFILE,
} from '@/portals/public/photographer/data/photographerProfileData';
import {
  DEFAULT_GALLERY_IMAGE_DETAILS,
  GALLERY_DETAIL_ASSETS,
  GALLERY_DETAIL_DEMO_VIDEO,
} from '@/shared/data/galleryDetail';
import { SIX_STORY_SLIDES } from '@/shared/data/gallerySixStory';
import { TWELVE_STORY_SLIDES } from '@/shared/data/galleryTwelveStory';
import { GALLERY_PHOTOS } from '@/shared/data/galleryPhotos';
import { COMPETITION_DETAILS } from '@/portals/public/competition-details/data/competitionDetailsAssets';

export const DEMO_SHOWCASE_PHOTO = GALLERY_PHOTOS[1];
export const DEMO_IMAGE_DETAILS = DEFAULT_GALLERY_IMAGE_DETAILS;
export const DEMO_GALLERY_ENTRY_SINGLE = GALLERY_PHOTOS[0];
export const DEMO_GALLERY_ENTRY_SIX = GALLERY_SIX_STORIES[0];
export const DEMO_GALLERY_ENTRY_TWELVE = GALLERY_TWELVE_STORIES[0];
export const DEMO_BUY_PHOTO = BUY_PHOTOS[0];
export const DEMO_SIX_STORY_SLIDES = SIX_STORY_SLIDES;
export const DEMO_TWELVE_STORY_SLIDES = TWELVE_STORY_SLIDES;
export const DEMO_COMPETITION_CARDS = COMPETITION_CARDS;
export const DEMO_PHOTOGRAPHER_PROFILE = PHOTOGRAPHER_PROFILE;
export const DEMO_MEMBER_PROFILE = MEMBER_PROFILE;
export const DEMO_FAVOURITE_PHOTOGRAPHER = FAVOURITE_PHOTOGRAPHERS[0];
export const DEMO_MESSAGE = MY_MESSAGES[0];
export const DEMO_NOTIFICATION = MEMBER_NOTIFICATIONS[0];
export const DEMO_ARTWORK_STAT = MY_ARTWORK_STATS[0];
export const DEMO_DASHBOARD_STAT = DASHBOARD_STATS[0];
export const DEMO_DONATION = {
  photographer: 'Kasia L.',
  avatar: GALLERY_DETAIL_ASSETS.photographer,
  bio: 'Nature and landscape photographer sharing seasonal stories from Poland.',
};
export const DEMO_VIDEO = {
  poster: DEMO_SHOWCASE_PHOTO.image,
  src: GALLERY_DETAIL_DEMO_VIDEO,
  title: DEMO_SHOWCASE_PHOTO.title,
};

export const DEMO_ARTWORK_ITEM = {
  id: 'demo-artwork',
  title: 'Golden Hour Silence',
  description: 'Warm golden-hour light settles over a quiet scene with cinematic glow.',
  image: DEMO_SHOWCASE_PHOTO.image,
  albumBadge: 'Single Photo',
  category: 'Landscape',
  uploadedDate: 'Aug 9, 2026',
  uploadedTime: '12:03 PM',
  views: '1,240',
  hearts: '1,000',
  footerState: 'active',
  competitionName: 'August Photography Competition',
  votes: '342',
  rank: '#12',
  votingEnds: 'Aug 30, 2026',
  progress: 65,
};

export const DEMO_ARTWORK_ITEM_PROFILE = {
  ...DEMO_ARTWORK_ITEM,
  id: 'demo-artwork-profile',
  footerState: 'profileOnly',
};

export const DEMO_ARTWORK_ITEM_ENDED = {
  ...DEMO_ARTWORK_ITEM,
  id: 'demo-artwork-ended',
  footerState: 'ended',
  endedVotes: '410',
};

export const DEMO_SELL_PHOTO_ITEM = {
  ...SELL_PHOTOS_ITEMS[0],
  price: '$2.00',
  expiryDate: 'Sep 30, 2026',
};

export const DEMO_SIGN_SLIDE = SIX_STORY_SLIDES[0];
export const DEMO_RANKINGS = COMPETITION_DETAILS.monochrome.rankings;
