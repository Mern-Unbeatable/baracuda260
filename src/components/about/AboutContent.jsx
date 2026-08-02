import React, { memo } from 'react';
import { ROUTES } from '../../config';
import { SitePageLayout } from '../site';
import AboutHero from './AboutHero';
import AboutStats from './AboutStats';
import AboutStory from './AboutStory';
import AboutMissionVision from './AboutMissionVision';
import AboutHowItWorks from './AboutHowItWorks';
import AboutCommunity from './AboutCommunity';
import AboutCta from './AboutCta';

/**
 * About page body — Figma node 40:1688.
 * Chrome (announcement/header/newsletter/footer) comes from SitePageLayout.
 */
const AboutContent = memo(() => (
  <SitePageLayout
    activeHref={ROUTES.ABOUT}
    rootClassName="about-page-root"
    announcementTone="blue"
    newsletterVariant="page"
  >
    <AboutHero />
    <AboutStats />
    <AboutStory />
    <AboutMissionVision />
    <AboutHowItWorks />
    <AboutCommunity />
    <AboutCta />
  </SitePageLayout>
));

AboutContent.displayName = 'AboutContent';

export default AboutContent;
