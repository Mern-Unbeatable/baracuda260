import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import { ROUTES } from '@/shared/config';
import { SitePageLayout } from '@/shared/site-chrome';
import ActiveCompetitions from '@/modules/public/shared/sections/ActiveCompetitions';
import HowItWorks from '@/modules/public/shared/sections/HowItWorks';
import CommunityWork from '@/modules/public/shared/sections/CommunityWork';
import TopPhotographers from '@/modules/public/shared/sections/TopPhotographers';
import HomeHero from './components/HomeHero';
import HomeStatsSection from './sections/HomeStatsSection';
import HomeWinnersSection from './sections/HomeWinnersSection';
import HomeFeaturesSection from './sections/HomeFeaturesSection';
import HomeTestimonialsSection from './sections/HomeTestimonialsSection';

const Home = memo(() => {
  useSEO({
    title: '',
    description: 'Welcome to our React application',
    keywords: ['react', 'webpack', 'tailwind', 'router'],
  });

  return (
    <SitePageLayout
      activeHref={ROUTES.HOME}
      rootClassName="home-page-root"
      announcementTone="navy"
      newsletterVariant="home"
    >
      <HomeHero />
      <HomeStatsSection />
      <ActiveCompetitions />
      <HowItWorks />
      <CommunityWork />
      <TopPhotographers />
      <HomeWinnersSection />
      <HomeFeaturesSection />
      <HomeTestimonialsSection />
    </SitePageLayout>
  );
});

Home.displayName = 'Home';

export default Home;
