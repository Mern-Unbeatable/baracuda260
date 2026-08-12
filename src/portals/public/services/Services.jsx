import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import ServicesMain from './sections/ServicesMain';

const Services = memo(() => {
  useSEO({
    title: 'Our Services',
    description: 'Explore our professional services',
    keywords: ['services', 'web development', 'mobile', 'design', 'consulting'],
  });

  return <ServicesMain />;
});

Services.displayName = 'Services';

export default Services;
