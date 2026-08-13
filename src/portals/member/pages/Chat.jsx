import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import MemberChatContent from '@/portals/member/views/MemberChatContent';

const Chat = memo(() => {
  useSEO({
    title: 'Chat',
    description: 'Message photographers and manage your conversations on My12Photos.',
    keywords: ['chat', 'messages', 'conversations', 'My12Photos'],
  });

  return <MemberChatContent />;
});

Chat.displayName = 'Chat';

export default Chat;
