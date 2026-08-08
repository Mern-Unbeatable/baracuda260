import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import PrivacyMain from './sections/PrivacyMain';

const Privacy = memo(() => {
  useSEO({
    title: 'Privacy Policy',
    description:
      'Learn how My12Photos collects, uses, stores, and protects your personal information on our photography competition platform.',
    keywords: ['privacy', 'privacy policy', 'My12Photos', 'data protection'],
  });

  return <PrivacyMain />;
});

Privacy.displayName = 'Privacy';

export default Privacy;
