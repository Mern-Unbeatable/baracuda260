import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import TermsContent from '@/modules/public/views/TermsContent';

const Terms = memo(() => {
  useSEO({
    title: 'Terms of Service',
    description:
      'Read the My12Photos Terms of Service covering accounts, competitions, voting, intellectual property, and prize distribution.',
    keywords: ['terms', 'terms of service', 'My12Photos', 'competition rules'],
  });

  return <TermsContent />;
});

Terms.displayName = 'Terms';

export default Terms;
