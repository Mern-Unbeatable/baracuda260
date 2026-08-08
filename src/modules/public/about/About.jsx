import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import { ROUTES } from '@/shared/config';
import { SitePageLayout } from '@/shared/site-chrome';
import AboutHero from './sections/AboutHero';
import AboutStats from './sections/AboutStats';
import AboutStory from './sections/AboutStory';
import AboutMissionVision from './sections/AboutMissionVision';
import AboutHowItWorks from './sections/AboutHowItWorks';
import AboutCommunity from './sections/AboutCommunity';
import AboutCta from './sections/AboutCta';

const About = memo(() => {
  useSEO({
    title: 'About My12Photos',
    description:
      'Discover a global photography community where creativity is celebrated, stories are shared, and talented photographers compete for monthly recognition and cash prizes.',
    keywords: ['about', 'My12Photos', 'photography competitions', 'community'],
  });

  return (
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
  );
});

About.displayName = 'About';

export default About;
