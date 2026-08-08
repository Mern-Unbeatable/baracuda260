import React, { memo } from 'react';
import { useParams } from 'react-router-dom';
import { useSEO } from '@/shared/hooks/useSEO';
import GallerySixBlueDetailContent from '@/modules/public/views/GallerySixBlueDetailContent';
import { getGallerySixBlueStoryById } from '@/shared/data/gallerySixStoryBlue';

const GallerySixBlueDetail = memo(() => {
  const { id } = useParams();
  const story = getGallerySixBlueStoryById(id);

  useSEO({
    title: `${story.title} — 6 Photo Story (Libra)`,
    description: story.description,
    keywords: ['gallery', '6 photo story', 'libra', story.title, 'my12photos'],
  });

  return <GallerySixBlueDetailContent />;
});

GallerySixBlueDetail.displayName = 'GallerySixBlueDetail';

export default GallerySixBlueDetail;
