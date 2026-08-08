import React, { memo } from 'react';
import { useParams } from 'react-router-dom';
import { useSEO } from '@/shared/hooks/useSEO';
import GalleryDetailView from '@/modules/public/gallery/detail/GalleryDetailView';
import { getGallerySixStoryById } from '@/shared/data/gallerySixStory';

const GallerySixDetail = memo(() => {
  const { id } = useParams();
  const story = getGallerySixStoryById(id);

  useSEO({
    title: `${story.title} — 6 Photo Story`,
    description: story.description,
    keywords: ['gallery', '6 photo story', story.title, 'my12photos'],
  });

  return <GalleryDetailView entry={story} variant="six" />;
});

GallerySixDetail.displayName = 'GallerySixDetail';

export default GallerySixDetail;
