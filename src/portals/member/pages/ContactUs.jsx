import React, { memo } from 'react';
import ContactSupportContent from '@/portals/member/views/ContactSupportContent';
import { useSEO } from '@/shared/hooks/useSEO';

const ContactUs = memo(() => {
  useSEO({
    title: 'Contact Us',
    description:
      'Contact My12Photos support, send a message, and track your previous support conversations.',
    keywords: ['contact', 'support', 'help', 'My12Photos'],
  });

  return <ContactSupportContent />;
});

ContactUs.displayName = 'ContactUs';

export default ContactUs;
