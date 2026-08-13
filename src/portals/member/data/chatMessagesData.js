const A = '/assets/home';

export const CHAT_TOTAL_UNREAD = 29;

export const CHAT_CONVERSATIONS = [
  {
    id: 'chat-azunyan',
    name: 'Azunyan U. Wu',
    handle: '@azusanakano_1997',
    avatar: `${A}/avatar-anna.jpg`,
    previewKey: 'memberChat.previews.azunyan',
    time: '12:25',
    unread: 0,
    online: true,
  },
  {
    id: 'chat-mckinsey',
    name: 'McKinsey Vermillion',
    handle: '@mckinsey_v',
    avatar: `${A}/avatar-marta.jpg`,
    previewKey: 'memberChat.previews.default',
    time: '12:25',
    unread: 999,
    online: false,
  },
  {
    id: 'chat-elena',
    name: 'Elena Vance',
    handle: '@elenavance',
    avatar: `${A}/avatar-photographer.jpg`,
    previewKey: 'memberChat.previews.default',
    time: '11:02',
    unread: 8,
    online: true,
  },
  {
    id: 'chat-piotr',
    name: 'Piotr Mazur',
    handle: '@piotrmazur',
    avatar: `${A}/avatar-piotr.jpg`,
    previewKey: 'memberChat.previews.default',
    time: '10:48',
    unread: 2,
    online: false,
  },
  {
    id: 'chat-sofia',
    name: 'Sofia Reyes',
    handle: '@sofiareyes',
    avatar: `${A}/avatar-anna.jpg`,
    previewKey: 'memberChat.previews.default',
    time: '09:15',
    unread: 7,
    online: false,
  },
  {
    id: 'chat-michael',
    name: 'Michael Brown',
    handle: '@michaelbrown',
    avatar: `${A}/avatar-piotr.jpg`,
    previewKey: 'memberChat.previews.default',
    time: 'Yesterday',
    unread: 0,
    online: false,
  },
  {
    id: 'chat-kasia',
    name: 'Kasia Lewandowska',
    handle: '@kasial',
    avatar: `${A}/avatar-marta.jpg`,
    previewKey: 'memberChat.previews.default',
    time: 'Yesterday',
    unread: 0,
    online: true,
  },
];

export const CHAT_DEMO_MESSAGES = {
  'chat-azunyan': [
    { type: 'date', labelKey: 'memberChat.dates.august19' },
    {
      type: 'received',
      variant: 'text',
      textKey: 'memberChat.messages.receivedIntro',
      time: '09:14',
    },
    {
      type: 'received',
      variant: 'file',
      fileName: 'Design_project_2025.docx',
      fileSize: '2.5gb',
      time: '09:16',
    },
    {
      type: 'received',
      variant: 'video',
      poster: `${A}/photo-golden.jpg`,
      time: '09:18',
    },
    { type: 'date', labelKey: 'memberChat.dates.today' },
    {
      type: 'sent',
      variant: 'text',
      textKey: 'memberChat.messages.sentReply',
      time: '11:42',
      read: true,
    },
    {
      type: 'sent',
      variant: 'voice',
      duration: '02:12',
      elapsed: '01:25',
      time: '12:01',
      read: true,
    },
    { type: 'typing' },
  ],
};

export const getDefaultChatConversationId = () => CHAT_CONVERSATIONS[0]?.id ?? null;

export const getChatMessages = (conversationId) =>
  CHAT_DEMO_MESSAGES[conversationId] ?? [
    { type: 'date', labelKey: 'memberChat.dates.today' },
    {
      type: 'received',
      variant: 'text',
      textKey: 'memberChat.previews.default',
      time: '12:25',
    },
  ];
