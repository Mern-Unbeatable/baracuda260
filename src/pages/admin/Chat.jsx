import React, { memo } from 'react';
import UserSectionPlaceholder from './UserSectionPlaceholder';

const Chat = memo(() => <UserSectionPlaceholder titleKey="dashboard.nav.chat" />);

Chat.displayName = 'Chat';

export default Chat;
