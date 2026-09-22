import React, { memo } from 'react';
import InViewWrapper from '@/components/common/InViewWrapper';
import ActiveCompetitions from '@/components/marketing/ActiveCompetitions/ActiveCompetitions';
import CommunityWork from '@/components/marketing/CommunityWork/CommunityWork';
import HomeStatsSection from '@/components/marketing/HomeStatsSection/HomeStatsSection';
import HowItWorks from '@/components/marketing/HowItWorks/HowItWorks';
import TopPhotographers from '@/components/marketing/TopPhotographers/TopPhotographers';
import { ROUTES } from '@/shared/config';
import { useSEO } from '@/shared/hooks/useSEO';
import { SitePageLayout } from '@/shared/site-chrome';
import HomeHero from './components/HomeHero';
import HomeFeaturesSection from './sections/HomeFeaturesSection';
import HomeTestimonialsSection from './sections/HomeTestimonialsSection';
import HomeWinnersSection from './sections/HomeWinnersSection';

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
      <HomeHero />
      <InViewWrapper>
        <HomeStatsSection />
      </InViewWrapper>
      <InViewWrapper>
        <ActiveCompetitions />
      </InViewWrapper>
      <InViewWrapper>
        <HowItWorks />
      </InViewWrapper>
      <InViewWrapper>
        <CommunityWork />
      </InViewWrapper>
      <InViewWrapper>
        <TopPhotographers />
      </InViewWrapper>
      <InViewWrapper>
        <HomeWinnersSection />
      </InViewWrapper>
      <InViewWrapper>
        <HomeFeaturesSection />
      </InViewWrapper>
      <InViewWrapper>
        <HomeTestimonialsSection />
      </InViewWrapper>
    </SitePageLayout>
  );
});

Home.displayName = 'Home';

export default Home;
