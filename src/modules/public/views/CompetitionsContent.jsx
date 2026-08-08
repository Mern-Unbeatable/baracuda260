import React, { memo } from 'react';
import { ROUTES } from '@/shared/config';
import { SitePageLayout } from '@/shared/site-chrome';
import ActiveCompetitions from '@/modules/public/views/ActiveCompetitions';
import HowItWorks from '@/modules/public/views/HowItWorks';

const CompetitionsContent = memo(() => (
  <SitePageLayout
    activeHref={ROUTES.COMPETITIONS}
    rootClassName="competitions-page-root"
    announcementTone="navy"
    newsletterVariant="page"
  >
    <ActiveCompetitions headingAs="h1" />
    <HowItWorks />
  </SitePageLayout>
));

CompetitionsContent.displayName = 'CompetitionsContent';

export default CompetitionsContent;
