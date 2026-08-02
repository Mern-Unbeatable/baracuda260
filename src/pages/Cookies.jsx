import React, { memo } from 'react';
import { useSEO } from '../hooks/useSEO';
import CookiesContent from '../components/cookies/CookiesContent';

const Cookies = memo(() => {
  useSEO({
    title: 'Cookie Policy',
    description:
      'Learn how My12Photos uses cookies for login, performance, analytics, advertising, and preferences.',
    keywords: ['cookies', 'cookie policy', 'My12Photos', 'privacy'],
  });

  return <CookiesContent />;
});

Cookies.displayName = 'Cookies';

export default Cookies;
