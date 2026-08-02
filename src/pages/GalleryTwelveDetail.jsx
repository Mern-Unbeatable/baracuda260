import React, { memo } from 'react';
import { useParams } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import GalleryTwelveDetailContent from '../components/gallery/GalleryTwelveDetailContent';
import { getGalleryTwelveStoryById } from '../data/galleryTwelveStory';

const GalleryTwelveDetail = memo(() => {
  const { id } = useParams();
  const story = getGalleryTwelveStoryById(id);

  useSEO({
    title: `${story.title} — 12 Photo Zodiac Story`,
    description: story.description,
    keywords: ['gallery', '12 photos', 'zodiac story', story.title, 'my12photos'],
  });

  return <GalleryTwelveDetailContent />;
});

GalleryTwelveDetail.displayName = 'GalleryTwelveDetail';

export default GalleryTwelveDetail;
