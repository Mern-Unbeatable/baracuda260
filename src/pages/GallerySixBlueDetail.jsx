import React, { memo } from 'react';
import { useParams } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import GalleryDetailView from '../components/gallery/GalleryDetailView';
import { getGallerySixBlueStoryById } from '../data/gallerySixStoryBlue';

const GallerySixBlueDetail = memo(() => {
  const { id } = useParams();
  const story = getGallerySixBlueStoryById(id);

  useSEO({
    title: `${story.title} — 6 Photo Story (Libra)`,
    description: story.description,
    keywords: ['gallery', '6 photo story', 'libra', story.title, 'my12photos'],
  });

  return <GalleryDetailView entry={story} variant="sixBlue" />;
});

GallerySixBlueDetail.displayName = 'GallerySixBlueDetail';

export default GallerySixBlueDetail;
