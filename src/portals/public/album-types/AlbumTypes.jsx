import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import { ROUTES } from '@/shared/config';
import { SitePageLayout } from '@/shared/site-chrome';
import ActiveCompetitions from '@/components/marketing/ActiveCompetitions/ActiveCompetitions';
import HowItWorks from '@/components/marketing/HowItWorks/HowItWorks';

const AlbumTypes = memo(() => {
  useSEO({
    title: 'Album Types',
    description:
      'Choose your album type and enter My12Photos competitions — Single Photo, 6-Photos Story, and Zodiac Story.',
    keywords: ['album types', 'competitions', 'photography', 'my12photos', 'prizes'],
  });

  return (
    <SitePageLayout
      activeHref={ROUTES.ALBUM_TYPES}
      rootClassName="album-types-page-root"
      announcementTone="navy"
      newsletterVariant="page"
    >
      <ActiveCompetitions />
      <HowItWorks />
    </SitePageLayout>
  );
});

AlbumTypes.displayName = 'AlbumTypes';

export default AlbumTypes;
