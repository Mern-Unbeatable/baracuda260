import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import ContactMain from './sections/ContactMain';

const Contact = memo(() => {
  useSEO({
    title: 'Contact Us',
    description: 'Get in touch with us',
    keywords: ['contact', 'email', 'message'],
  });

  return <ContactMain />;
});

Contact.displayName = 'Contact';

export default Contact;
