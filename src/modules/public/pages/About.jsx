import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import AboutContent from '@/modules/public/views/AboutContent';

const About = memo(() => {
  useSEO({
    title: 'About My12Photos',
    description:
      'Discover a global photography community where creativity is celebrated, stories are shared, and talented photographers compete for monthly recognition and cash prizes.',
    keywords: ['about', 'My12Photos', 'photography competitions', 'community'],
  });

  return <AboutContent />;
});

About.displayName = 'About';

export default About;
