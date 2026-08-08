import React, { memo } from 'react';
import { ROUTES } from '@/shared/config';
import { SitePageLayout } from '@/shared/site-chrome';
import AboutHero from '@/modules/public/components/marketing-about/AboutHero';
import AboutStats from '@/modules/public/components/marketing-about/AboutStats';
import AboutStory from '@/modules/public/components/marketing-about/AboutStory';
import AboutMissionVision from '@/modules/public/components/marketing-about/AboutMissionVision';
import AboutHowItWorks from '@/modules/public/components/marketing-about/AboutHowItWorks';
import AboutCommunity from '@/modules/public/components/marketing-about/AboutCommunity';
import AboutCta from '@/modules/public/components/marketing-about/AboutCta';

/**
 * About page body — Figma node 40:1688.
 * Chrome (announcement/header/newsletter/footer) comes from SitePageLayout.
 */
const AboutContent = memo(() => (
  <SitePageLayout
    activeHref={ROUTES.ABOUT}
    rootclassName="about-page-root"
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
