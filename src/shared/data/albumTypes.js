/** Shared album-type options (Home Community Work tabs + Gallery Album Type filters). */

export const ALBUM_TYPES = [
  {
    id: 'single',
    value: 'Single Photo',
    labelKey: 'common.singlePhoto',
    shortLabelKey: 'common.filtersShort.single',
  },
  {
    id: 'six',
    value: '6 Photo Story',
    labelKey: 'common.sixPhotosStory',
    shortLabelKey: 'common.filtersShort.six',
  },
  {
    id: 'zodiac',
    value: '12 photos - Full Zodiac Story',
    labelKey: 'common.twelveZodiac',
    shortLabelKey: 'common.filtersShort.zodiac',
  },
];

export const ALBUM_TYPE_VALUES = ALBUM_TYPES.map((type) => type.value);

export const ALBUM_TYPE_LABEL_KEYS = Object.fromEntries(
  ALBUM_TYPES.map((type) => [type.value, type.labelKey]),
);

export const ALBUM_TYPE_SHORT_LABEL_KEYS = Object.fromEntries(
  ALBUM_TYPES.map((type) => [type.value, type.shortLabelKey]),
);

const normalize = (value = '') =>
  value.toLowerCase().replace(/[-–—]/g, ' ').replace(/\s+/g, ' ').trim();

/** Match a photo badge / filter string to an album type value. */
export const matchesAlbumType = (badge, albumType) => {
  const badgeNorm = normalize(badge);
  const typeNorm = normalize(albumType);
  if (typeNorm.includes('12')) return badgeNorm.includes('12') && badgeNorm.includes('zodiac');
  if (typeNorm.includes('6')) return badgeNorm.includes('6') && badgeNorm.includes('story');
  if (typeNorm.includes('single')) return badgeNorm.includes('single');
  return badgeNorm === typeNorm;
};
