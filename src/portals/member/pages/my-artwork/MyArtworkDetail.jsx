import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import MemberArtworkDetailContent from '@/portals/member/views/MemberArtworkDetailContent';

const MyArtworkDetail = memo(() => {
  useSEO({
    title: 'Artwork Details',
    description: 'View your uploaded artwork details, votes, views, rankings, and comments on My12Photos.',
    keywords: ['artwork details', 'gallery', 'rankings', 'My12Photos'],
  });

  return <MemberArtworkDetailContent />;
});

MyArtworkDetail.displayName = 'MyArtworkDetail';

export default MyArtworkDetail;
