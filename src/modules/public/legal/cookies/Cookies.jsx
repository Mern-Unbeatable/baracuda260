import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import CookiesMain from './sections/CookiesMain';

const Cookies = memo(() => {
  useSEO({
    title: 'Cookie Policy',
    description:
      'Learn how My12Photos uses cookies for login, performance, analytics, advertising, and preferences.',
    keywords: ['cookies', 'cookie policy', 'My12Photos', 'privacy'],
  });

  return <CookiesMain />;
});

Cookies.displayName = 'Cookies';

export default Cookies;
