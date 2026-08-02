const A = '/assets/home';

const DEFAULT_DESCRIPTION =
  'Captured in a cinematic, photorealistic style with shallow depth of field, ultra-realistic, high detail, 8K quality. Soft light, natural composition, and strong visual storytelling define this entry.';

export const GALLERY_PHOTOS = [
  {
    id: 'autumn-sequence',
    title: 'Autumn Sequence',
    author: 'Kasia L. · Poland',
    photographer: 'Kasia L.',
    votes: '1,488',
    views: '9,240',
    badge: '6 Photos Story',
    sixStoryVariant: 'aries', // signs 1–6 (red)
    category: 'Nature',
    image: `${A}/photo-autumn.jpg`,
    description:
      'A serene autumn forest sequence following a quiet yoga practice among orange and gold leaves. Warm seasonal light and layered foliage create a calm, story-driven atmosphere.',
  },
  {
    id: 'wings-over-the-marsh',
    title: 'Wings Over the Marsh',
    author: 'Kasia L. · Poland',
    photographer: 'Kasia L.',
    votes: '1,488',
    views: '8,110',
    badge: 'Single Photo',
    category: 'Wildlife',
    image: `${A}/photo-wings.jpg`,
    description:
      'A close portrait capturing expressive eyes and fine detail. Soft natural light and shallow depth of field keep the subject sharp against a gentle background.',
  },
  {
    id: 'city-after-midnight',
    title: 'City After Midnight',
    author: 'Kasia L. · Poland',
    photographer: 'Kasia L.',
    votes: '1,488',
    views: '12,400',
    badge: '6 Photos Story',
    sixStoryVariant: 'libra', // signs 7–12 (blue)
    category: 'Street Photography',
    image: `${A}/photo-city.jpg`,
    description:
      'Night city lights stretch across glass towers and wet streets. Cool blues and neon highlights build a cinematic after-midnight mood.',
  },
  {
    id: 'forest-cathedral',
    title: 'Forest Cathedral',
    author: 'Jan M. · Czech',
    photographer: 'Jan M.',
    votes: '1,488',
    views: '7,650',
    badge: 'Single Photo',
    category: 'Nature',
    image: `${A}/photo-forest.jpg`,
    description:
      'Tall trees form a natural cathedral of light and shadow. Mist and soft beams emphasize scale, stillness, and quiet grandeur.',
  },
  {
    id: 'morning-fields',
    title: 'Morning Fields',
    author: 'Kasia L. · Poland',
    photographer: 'Kasia L.',
    votes: '1,488',
    views: '6,980',
    badge: 'Single Photo',
    category: 'Landscape',
    image: `${A}/photo-morning.jpg`,
    description:
      'Early light washes across open fields. Long shadows and soft haze create a peaceful morning landscape full of warmth and space.',
  },
  {
    id: 'zodiac-journey',
    title: 'Zodiac Journey',
    author: 'Kasia L. · Poland',
    photographer: 'Kasia L.',
    votes: '1,488',
    views: '15,220',
    badge: '12 photos - full Zodiac Story',
    category: 'Fine Art',
    image: `${A}/photo-zodiac.jpg`,
    description:
      'A full zodiac story told through twelve connected frames. Symbolic motifs, rich color, and careful pacing guide the viewer through the journey.',
  },
  {
    id: 'forest-cathedral-2',
    title: 'Forest Cathedral',
    author: 'Jan M. · Czech',
    photographer: 'Jan M.',
    votes: '1,488',
    views: '7,650',
    badge: 'Single Photo',
    category: 'Nature',
    image: `${A}/photo-forest.jpg`,
    description:
      'Tall trees form a natural cathedral of light and shadow. Mist and soft beams emphasize scale, stillness, and quiet grandeur.',
  },
  {
    id: 'morning-fields-2',
    title: 'Morning Fields',
    author: 'Kasia L. · Poland',
    photographer: 'Kasia L.',
    votes: '1,488',
    views: '6,980',
    badge: 'Single Photo',
    category: 'Landscape',
    image: `${A}/photo-morning.jpg`,
    description:
      'Early light washes across open fields. Long shadows and soft haze create a peaceful morning landscape full of warmth and space.',
  },
  {
    id: 'zodiac-journey-2',
    title: 'Zodiac Journey',
    author: 'Kasia L. · Poland',
    photographer: 'Kasia L.',
    votes: '1,488',
    views: '15,220',
    badge: '12 photos - full Zodiac Story',
    category: 'Fine Art',
    image: `${A}/photo-zodiac.jpg`,
    description:
      'A full zodiac story told through twelve connected frames. Symbolic motifs, rich color, and careful pacing guide the viewer through the journey.',
  },
];

export const getGalleryPhotoById = (id) =>
  GALLERY_PHOTOS.find((photo) => photo.id === id) || GALLERY_PHOTOS[0];

export const galleryDetailPath = (id) => {
  const photo = getGalleryPhotoById(id);
  if (/12\s*photos?/i.test(photo.badge || '')) {
    return `/gallery/zodiac/${photo.id}`;
  }
  if (/6\s*photos?\s*story/i.test(photo.badge || '')) {
    if (photo.sixStoryVariant === 'libra') {
      return `/gallery/story-blue/${photo.id}`;
    }
    return `/gallery/story/${photo.id}`;
  }
  return `/gallery/${photo.id}`;
};

export { DEFAULT_DESCRIPTION };
