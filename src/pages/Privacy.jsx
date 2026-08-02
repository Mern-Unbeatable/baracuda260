import React, { memo } from 'react';
import { useSEO } from '../hooks/useSEO';
import PrivacyContent from '../components/privacy/PrivacyContent';

const Privacy = memo(() => {
  useSEO({
    title: 'Privacy Policy',
    description:
      'Learn how My12Photos collects, uses, stores, and protects your personal information on our photography competition platform.',
    keywords: ['privacy', 'privacy policy', 'My12Photos', 'data protection'],
  });

  return <PrivacyContent />;
});

Privacy.displayName = 'Privacy';

export default Privacy;
