import React, { memo } from 'react';
import { useParams } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import GallerySixDetailContent from '../components/gallery/GallerySixDetailContent';
import { getGallerySixStoryById } from '../data/gallerySixStory';

const GallerySixDetail = memo(() => {
  const { id } = useParams();
  const story = getGallerySixStoryById(id);

  useSEO({
    title: `${story.title} — 6 Photo Story`,
    description: story.description,
    keywords: ['gallery', '6 photo story', story.title, 'my12photos'],
  });

  return <GallerySixDetailContent />;
});

GallerySixDetail.displayName = 'GallerySixDetail';

export default GallerySixDetail;
