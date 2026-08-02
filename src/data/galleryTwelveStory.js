import { SIX_STORY_SLIDES } from './gallerySixStory';
import { SIX_BLUE_STORY_SLIDES } from './gallerySixStoryBlue';

const A = '/assets/home';

/** Full Zodiac Story — signs 1–12 (red 1–6 + blue 7–12) */
export const TWELVE_STORY_SLIDES = [
  ...SIX_STORY_SLIDES.map((slide) => ({
    ...slide,
    theme: 'red',
    iconBoxed: false,
  })),
  ...SIX_BLUE_STORY_SLIDES.map((slide) => ({
    ...slide,
    theme: 'blue',
  })),
];

export const GALLERY_TWELVE_STORIES = [
  {
    id: 'zodiac-journey',
    title: 'Zodiac Journey',
    photographer: 'Wong Kar-Wai',
    votes: '2150',
    views: '12400',
    badge: '12 photos - full Zodiac Story',
    category: 'Nature',
    cover: `${A}/photo-zodiac.jpg`,
    description:
      'A young man walking confidently along a quiet city street during golden hour, wearing a casual white t-shirt, black jeans, and clean white sneakers. His hands are relaxed by his sides, with a natural walking posture and a calm expression. Soft sunlight creates warm highlights and long shadows on the pavement. Modern buildings, green trees, and a slightly blurred urban background add depth to the scene. Captured in a cinematic, photorealistic style with shallow depth of field, ultra-realistic, high detail, 8K quality.',
    slides: TWELVE_STORY_SLIDES,
  },
  {
    id: 'zodiac-journey-2',
    title: 'Zodiac Journey',
    photographer: 'Kasia L.',
    votes: '1488',
    views: '15220',
    badge: '12 photos - full Zodiac Story',
    category: 'Fine Art',
    cover: `${A}/photo-zodiac.jpg`,
    description:
      'A full zodiac story told through twelve connected frames. Symbolic motifs, rich color, and careful pacing guide the viewer through the journey.',
    slides: TWELVE_STORY_SLIDES,
  },
];

export const getGalleryTwelveStoryById = (id) =>
  GALLERY_TWELVE_STORIES.find((story) => story.id === id) || GALLERY_TWELVE_STORIES[0];

export const galleryTwelveStoryPath = (id) =>
  `/gallery/zodiac/${id || GALLERY_TWELVE_STORIES[0].id}`;
