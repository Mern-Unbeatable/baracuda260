/** Profile slideshows: albums built from 2–12 of a user's single photos. */

export const SLIDESHOW_MIN_PHOTOS = 2;
export const SLIDESHOW_MAX_PHOTOS = 12;
export const SLIDESHOW_TITLE_MAX = 60;
/** How long each photo stays on screen in the player. */
export const SLIDESHOW_SLIDE_MS = 4500;
/** Query-string key that opens the player, so a slideshow link can be shared. */
export const SLIDESHOW_SEARCH_PARAM = 'slideshow';

export const isSlideshowPlayable = (slideshow) =>
  (slideshow?.photos?.length ?? 0) >= SLIDESHOW_MIN_PHOTOS;
