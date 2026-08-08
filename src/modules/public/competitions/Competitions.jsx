import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import { ROUTES } from '@/shared/config';
import { SitePageLayout } from '@/shared/site-chrome';
import ActiveCompetitions from '@/modules/public/shared/sections/ActiveCompetitions';
import HowItWorks from '@/modules/public/shared/sections/HowItWorks';

const Competitions = memo(() => {
  useSEO({
    title: 'Competitions',
    description:
      'Choose your album type and enter My12Photos competitions — Single Photo, 6-Photos Story, and Zodiac Story.',
    keywords: ['competitions', 'photography', 'my12photos', 'prizes'],
  });

  return (
    <SitePageLayout
      activeHref={ROUTES.COMPETITIONS}
      rootClassName="competitions-page-root"
      announcementTone="navy"
      newsletterVariant="page"
    >
      <ActiveCompetitions />
      <HowItWorks />
    </SitePageLayout>
  );
});

Competitions.displayName = 'Competitions';

export default Competitions;
