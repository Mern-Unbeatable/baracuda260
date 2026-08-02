const A = '/assets/home';

/** 6 Photos Story — set B: signs 7–12 (Libra → Pisces), blue theme */
export const SIX_BLUE_STORY_SLIDES = [
  {
    id: 'libra',
    sign: 'Libra',
    number: 7,
    icon: `${A}/icon-libra.svg`,
    thumb: `${A}/blue-thumb-1.jpg`,
    hero: `${A}/blue-hero-libra.jpg`,
    iconBoxed: true,
  },
  {
    id: 'scorpio',
    sign: 'Scorpio',
    number: 8,
    icon: `${A}/icon-scorpio.svg`,
    thumb: `${A}/blue-thumb-2.jpg`,
    hero: `${A}/blue-thumb-2.jpg`,
    iconBoxed: true,
  },
  {
    id: 'sagittarius',
    sign: 'Sagittarius',
    number: 9,
    icon: `${A}/icon-sagittarius.svg`,
    thumb: `${A}/blue-thumb-3.jpg`,
    hero: `${A}/blue-thumb-3.jpg`,
  },
  {
    id: 'capricorn',
    sign: 'Capricorn',
    number: 10,
    icon: `${A}/icon-capricorn.svg`,
    thumb: `${A}/blue-thumb-4.jpg`,
    hero: `${A}/blue-thumb-4.jpg`,
  },
  {
    id: 'aquarius',
    sign: 'Aquarius',
    number: 11,
    icon: `${A}/icon-aquarius.svg`,
    thumb: `${A}/blue-thumb-5.jpg`,
    hero: `${A}/blue-thumb-5.jpg`,
    iconBoxed: true,
  },
  {
    id: 'pisces',
    sign: 'Pisces',
    number: 12,
    icon: `${A}/icon-pisces.svg`,
    thumb: `${A}/blue-thumb-5.jpg`,
    hero: `${A}/blue-thumb-5.jpg`,
  },
];

export const GALLERY_SIX_BLUE_STORIES = [
  {
    id: 'city-after-midnight',
    title: 'City After Midnight',
    photographer: 'Wong Kar-Wai',
    votes: '2150',
    views: '12400',
    badge: '6 Photos Story',
    category: 'Nature',
    description:
      'A young man walking confidently along a quiet city street during golden hour, wearing a casual white t-shirt, black jeans, and clean white sneakers. His hands are relaxed by his sides, with a natural walking posture and a calm expression. Soft sunlight creates warm highlights and long shadows on the pavement. Modern buildings, green trees, and a slightly blurred urban background add depth to the scene. Captured in a cinematic, photorealistic style with shallow depth of field, ultra-realistic, high detail, 8K quality.',
    slides: SIX_BLUE_STORY_SLIDES,
  },
];

export const getGallerySixBlueStoryById = (id) =>
  GALLERY_SIX_BLUE_STORIES.find((story) => story.id === id) || GALLERY_SIX_BLUE_STORIES[0];

export const gallerySixBlueStoryPath = (id) =>
  `/gallery/story-blue/${id || GALLERY_SIX_BLUE_STORIES[0].id}`;
