const A = '/assets/home';

export const MEMBER_NOTIFICATIONS = [
  {
    id: 'notif-review-public',
    type: 'platform',
    icon: '/assets/logo/logo.webp',
    messageKey: 'memberNotifications.items.reviewPublic',
    date: 'March 1, 2026',
    createdAt: 6,
  },
  {
    id: 'notif-cohost-accepted',
    type: 'user',
    avatar: `${A}/avatar-piotr.webp`,
    messageKey: 'memberNotifications.items.cohostAccepted',
    date: 'February 28, 2026',
    createdAt: 5,
  },
  {
    id: 'notif-email-confirm',
    type: 'user',
    avatar: `${A}/avatar-marta.webp`,
    messageKey: 'memberNotifications.items.emailConfirm',
    date: 'February 27, 2026',
    createdAt: 4,
  },
  {
    id: 'notif-competition-vote',
    type: 'platform',
    icon: '/assets/logo/logo.webp',
    messageKey: 'memberNotifications.items.competitionVote',
    date: 'February 25, 2026',
    createdAt: 3,
  },
  {
    id: 'notif-sale-complete',
    type: 'user',
    avatar: `${A}/avatar-anna.webp`,
    messageKey: 'memberNotifications.items.saleComplete',
    date: 'February 22, 2026',
    createdAt: 2,
  },
  {
    id: 'notif-follow-back',
    type: 'user',
    avatar: `${A}/avatar-photographer.webp`,
    messageKey: 'memberNotifications.items.followBack',
    date: 'February 18, 2026',
    createdAt: 1,
  },
];

export const sortMemberNotifications = (items) =>
  [...items].sort((a, b) => b.createdAt - a.createdAt);
