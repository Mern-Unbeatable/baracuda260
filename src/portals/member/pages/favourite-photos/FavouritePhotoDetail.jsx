import React, { memo } from 'react';
import MemberArtworkDetailContent from '@/portals/member/views/MemberArtworkDetailContent';
import { ROUTES } from '@/shared/config';
import { useSEO } from '@/shared/hooks/useSEO';

const FavouritePhotoDetail = memo(() => {
  useSEO({
    title: 'Favourite Photo Details',
    description:
      'View details, story, and stats for this favourite photo on My12Photos.',
    keywords: ['favourite photo', 'photo details', 'saved photo', 'My12Photos'],
  });

  return (
    <MemberArtworkDetailContent
      backTo={ROUTES.USER_FAVOURITE_PHOTOS}
      backLabel="Back to Favourite Photos"
    />
  );
});

FavouritePhotoDetail.displayName = 'FavouritePhotoDetail';

export default FavouritePhotoDetail;
