import React, { memo } from 'react';
import { useSEO } from '../../hooks/useSEO';
import ContactSupportContent from '../../components/contactSupport/ContactSupportContent';

const Chat = memo(() => {
  useSEO({
    title: 'Contact Us',
    description:
      'Contact My12Photos support and track your previous support conversations.',
    keywords: ['contact', 'support', 'help', 'My12Photos'],
  });

  return <ContactSupportContent />;
});

Chat.displayName = 'Chat';

export default Chat;
