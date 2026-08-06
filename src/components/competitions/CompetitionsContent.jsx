import React, { memo } from 'react';
import { ROUTES } from '../../config';
import { SitePageLayout } from '../site';
import ActiveCompetitions from './ActiveCompetitions';
import HowItWorks from './HowItWorks';

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
