import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import { ROUTES } from '@/shared/config';
import { SitePageLayout } from '@/shared/site-chrome';
import ActiveCompetitions from '@/components/marketing/ActiveCompetitions/ActiveCompetitions';
import HowItWorks from '@/components/marketing/HowItWorks/HowItWorks';
import CommunityWork from '@/components/marketing/CommunityWork/CommunityWork';
import TopPhotographers from '@/components/marketing/TopPhotographers/TopPhotographers';
import HomeHero from './components/HomeHero';
import HomeStatsSection from '@/components/marketing/HomeStatsSection/HomeStatsSection';
import HomeWinnersSection from './sections/HomeWinnersSection';
import HomeFeaturesSection from './sections/HomeFeaturesSection';
import HomeTestimonialsSection from './sections/HomeTestimonialsSection';
import InViewWrapper from '@/components/common/InViewWrapper';

const Home = memo(() => {
  useSEO({
    title: '',
    description: 'Welcome to our React application',
    keywords: ['react', 'vite', 'tailwind', 'router'],
  });

  return (
    <SitePageLayout
      activeHref={ROUTES.HOME}
      rootClassName="home-page-root"
      announcementTone="navy"
      newsletterVariant="home"
    >
      <InViewWrapper><HomeHero /></InViewWrapper>
      <InViewWrapper><HomeStatsSection /></InViewWrapper>
      <InViewWrapper><ActiveCompetitions /></InViewWrapper>
      <InViewWrapper><HowItWorks /></InViewWrapper>
      <InViewWrapper><CommunityWork /></InViewWrapper>
      <InViewWrapper><TopPhotographers /></InViewWrapper>
      <InViewWrapper><HomeWinnersSection /></InViewWrapper>
      <InViewWrapper><HomeFeaturesSection /></InViewWrapper>
      <InViewWrapper><HomeTestimonialsSection /></InViewWrapper>
    </SitePageLayout>
  );
});

Home.displayName = 'Home';

export default Home;
