import React, { memo } from 'react';
import { useParams } from 'react-router-dom';
import { useSEO } from '@/shared/hooks/useSEO';
import GalleryDetailView from '@/portals/public/gallery/detail/GalleryDetailView';
import { getGalleryTwelveStoryById } from '@/shared/data/galleryTwelveStory';

const GalleryTwelveDetail = memo(() => {
  const { id } = useParams();
  const story = getGalleryTwelveStoryById(id);

  useSEO({
    title: `${story.title} — 12 Photo Zodiac`,
    description: story.description,
    keywords: ['gallery', 'zodiac', story.title, 'my12photos'],
  });

  return <GalleryDetailView entry={story} variant="twelve" />;
});

GalleryTwelveDetail.displayName = 'GalleryTwelveDetail';

export default GalleryTwelveDetail;
