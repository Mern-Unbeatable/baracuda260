/** Admin Newsletter — Figma 346:1740. */

const A = '/assets/admin-newsletter';

export const ADMIN_NEWSLETTER_ASSETS = {
  composer: `${A}/icon-composer.svg`,
  close: `${A}/icon-close.svg`,
  alignLeft: `${A}/icon-align-left.svg`,
  alignCenter: `${A}/icon-align-center.svg`,
  alignRight: `${A}/icon-align-right.svg`,
  code: `${A}/icon-code.svg`,
  link: `${A}/icon-link.svg`,
  upload: `${A}/icon-upload.svg`,
  everyone: `${A}/icon-everyone.svg`,
  check: `${A}/icon-check.svg`,
  selected: `${A}/icon-selected.svg`,
  newSubscribers: `${A}/icon-new.svg`,
};

export const COMPOSER_ICON_SIZE = 20;
export const CLOSE_ICON_SIZE = 24;
export const TOOLBAR_ICON_SIZE = 16;
export const UPLOAD_ICON_SIZE = 24;
export const RECIPIENT_ICON_SIZE = 24;
export const CHECK_ICON_SIZE = 16;
export const BANNER_MAX_BYTES = 4 * 1024 * 1024;

/** Mock subscribers matching Figma 346:1740 list. */
export const ADMIN_NEWSLETTER_SUBSCRIBERS = [
  { id: 'sub-1', email: 'john.anderson@company.com', subscribedDate: '6/9/2026' },
  { id: 'sub-2', email: 'sarah.m@email.com', subscribedDate: '6/9/2026' },
  { id: 'sub-3', email: 'admin@buildpro.com', subscribedDate: '6/9/2026' },
  { id: 'sub-4', email: 'contact@construction.com', subscribedDate: '6/9/2026' },
  { id: 'sub-5', email: 'emily.d@email.com', subscribedDate: '6/9/2026' },
  { id: 'sub-6', email: 'emily.d@email.com', subscribedDate: '6/9/2026' },
  { id: 'sub-7', email: 'emily.d@email.com', subscribedDate: '6/9/2026' },
  { id: 'sub-8', email: 'emily.d@email.com', subscribedDate: '6/9/2026' },
  { id: 'sub-9', email: 'emily.d@email.com', subscribedDate: '6/9/2026' },
  { id: 'sub-10', email: 'emily.d@email.com', subscribedDate: '6/9/2026' },
  { id: 'sub-11', email: 'emily.d@email.com', subscribedDate: '6/9/2026' },
  { id: 'sub-12', email: 'emily.d@email.com', subscribedDate: '6/9/2026' },
  { id: 'sub-13', email: 'emily.d@email.com', subscribedDate: '6/9/2026' },
  { id: 'sub-14', email: 'emily.d@email.com', subscribedDate: '6/9/2026' },
  { id: 'sub-15', email: 'emily.d@email.com', subscribedDate: '6/9/2026' },
  { id: 'sub-16', email: 'emily.d@email.com', subscribedDate: '6/9/2026' },
  { id: 'sub-17', email: 'emily.d@email.com', subscribedDate: '6/9/2026' },
];

export const RECIPIENT_OPTIONS = [
  {
    id: 'everyone',
    titleKey: 'adminNewsletter.recipients.everyone.title',
    subtitleKey: 'adminNewsletter.recipients.everyone.subtitle',
    icon: 'everyone',
  },
  {
    id: 'selected',
    titleKey: 'adminNewsletter.recipients.selected.title',
    subtitleKey: 'adminNewsletter.recipients.selected.subtitle',
    icon: 'selected',
  },
  {
    id: 'new',
    titleKey: 'adminNewsletter.recipients.new.title',
    subtitleKey: 'adminNewsletter.recipients.new.subtitle',
    icon: 'newSubscribers',
  },
];

export const DEFAULT_RECIPIENT_ID = 'everyone';
export const DEFAULT_CTA_TEXT = 'Read more';

/**
 * @param {File | null | undefined} file
 * @param {number} [maxBytes]
 */
export const isBannerFileAllowed = (file, maxBytes = BANNER_MAX_BYTES) => {
  if (!file) return false;
  const typeOk = /image\/(png|jpeg|jpg)/i.test(file.type) || /\.(png|jpe?g)$/i.test(file.name);
  return typeOk && file.size <= maxBytes;
};
