import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import ContactContent from '@/modules/public/views/ContactContent';

const Contact = memo(() => {
  useSEO({
    title: 'Contact Us',
    description: 'Get in touch with us',
    keywords: ['contact', 'email', 'message'],
  });

  return <ContactContent />;
});

Contact.displayName = 'Contact';

export default Contact;
