/**
 * Dummy data for profile slideshows. Only `slideshows.api.js` reads this file,
 * so it can be deleted once that module calls the real backend.
 */

const A = '/assets/home';

/** The signed-in user's approved single photos (the only photos a slideshow may use). */
export const MOCK_SINGLE_PHOTOS = [
  {
    id: 'golden-hour-silence',
    title: 'Golden Hour Silence',
    image: `${A}/photo-golden.webp`,
    isAiGenerated: true,
  },
  {
    id: 'wings-over-the-marsh',
    title: 'Wings Over the Marsh',
    image: `${A}/photo-wings.webp`,
  },
  {
    id: 'forest-cathedral',
    title: 'Forest Cathedral',
    image: `${A}/photo-forest.webp`,
  },
  {
    id: 'morning-fields',
    title: 'Morning Fields',
    image: `${A}/photo-morning.webp`,
  },
  {
    id: 'bridge-over-the-bay',
    title: 'Bridge Over the Bay',
    image: `${A}/photo-harbor.webp`,
  },
  {
    id: 'shoreline-at-dusk',
    title: 'Shoreline at Dusk',
    image: `${A}/photo-silent.webp`,
  },
  {
    id: 'autumn-flow',
    title: 'Autumn Flow',
    image: `${A}/photo-autumn.webp`,
  },
  {
    id: 'skyline-at-moonrise',
    title: 'Skyline at Moonrise',
    image: `${A}/photo-city.webp`,
  },
  {
    id: 'evening-trail',
    title: 'Evening Trail',
    image: `${A}/detail-hero.webp`,
  },
  {
    id: 'tidal-light',
    title: 'Tidal Light',
    image: `${A}/photo-tidal.webp`,
  },
  {
    id: 'the-street-photographer',
    title: 'The Street Photographer',
    image: `${A}/six-thumb-1.webp`,
  },
  {
    id: 'rest-in-the-meadow',
    title: 'Rest in the Meadow',
    image: `${A}/six-thumb-2.webp`,
  },
  {
    id: 'lakeside-picnic',
    title: 'Lakeside Picnic',
    image: `${A}/six-thumb-3.webp`,
  },
  {
    id: 'first-spring-hepatica',
    title: 'First Spring Hepatica',
    image: `${A}/six-thumb-4.webp`,
  },
  {
    id: 'flowers-in-the-sink',
    title: 'Flowers in the Sink',
    image: `${A}/six-thumb-5.webp`,
  },
];

export const MOCK_SLIDESHOWS_SEED = [
  {
    id: 'slideshow-summer-moments',
    title: 'Summer Moments',
    photoIds: [
      'lakeside-picnic',
      'shoreline-at-dusk',
      'rest-in-the-meadow',
      'golden-hour-silence',
      'flowers-in-the-sink',
    ],
    createdAt: '2026-09-12T10:00:00.000Z',
    updatedAt: '2026-09-12T10:00:00.000Z',
  },
  {
    id: 'slideshow-city-and-forest',
    title: 'Between City and Forest',
    photoIds: [
      'skyline-at-moonrise',
      'bridge-over-the-bay',
      'evening-trail',
      'forest-cathedral',
      'autumn-flow',
      'morning-fields',
      'wings-over-the-marsh',
    ],
    createdAt: '2026-08-28T10:00:00.000Z',
    updatedAt: '2026-08-28T10:00:00.000Z',
  },
];
