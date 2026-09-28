/** Profile slideshows: albums built from a minimum of 2 photos with no upper limit. */

export const SLIDESHOW_MIN_PHOTOS = 2;
export const SLIDESHOW_MAX_PHOTOS = Infinity;
export const SLIDESHOW_TITLE_MAX = 60;
/** How long each photo stays on screen in the player. */
export const SLIDESHOW_SLIDE_MS = 4500;
/** Query-string key that opens the player, so a slideshow link can be shared. */
export const SLIDESHOW_SEARCH_PARAM = 'slideshow';

export const isSlideshowPlayable = (slideshow) =>
  (slideshow?.photos?.length ?? 0) >= SLIDESHOW_MIN_PHOTOS;
