import {
  FAVOURITE_PHOTOGRAPHERS,
  FAVOURITE_PHOTOGRAPHERS_PAGE_SIZE,
  sortFavouritePhotographers,
} from '@/portals/member/data/favouritePhotographersData';

export const PROFILE_CONNECTIONS_PAGE_SIZE = FAVOURITE_PHOTOGRAPHERS_PAGE_SIZE;

const sortedPhotographers = sortFavouritePhotographers(FAVOURITE_PHOTOGRAPHERS);

export const PROFILE_FOLLOWING = sortedPhotographers.map((photographer) => ({
  ...photographer,
  defaultFollowing: true,
}));

const NOT_FOLLOWING_BACK_IDS = new Set(['fav-sofia-reyes', 'fav-jan-muller', 'fav-emma-clark', 'fav-tomasz-nowak']);

export const PROFILE_FOLLOWERS = sortedPhotographers.map((photographer) => ({
  ...photographer,
  defaultFollowing: !NOT_FOLLOWING_BACK_IDS.has(photographer.id),
}));

export const sortProfileConnections = (items) =>
  [...items].sort((a, b) => b.createdAt - a.createdAt);
