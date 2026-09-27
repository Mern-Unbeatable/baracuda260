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
export const NEWSLETTER_PAGE_SIZE = 10;

/** `target` is the backend campaign audience; options without one are not supported by the API yet. */
export const RECIPIENT_OPTIONS = [
  {
    id: 'everyone',
    target: 'EVERYONE',
    titleKey: 'adminNewsletter.recipients.everyone.title',
    subtitleKey: 'adminNewsletter.recipients.everyone.subtitle',
    icon: 'everyone',
  },
  {
    id: 'selected',
    target: 'SELECTED',
    titleKey: 'adminNewsletter.recipients.selected.title',
    subtitleKey: 'adminNewsletter.recipients.selected.subtitle',
    icon: 'selected',
  },
  {
    id: 'new',
    target: 'NEW_SUBSCRIBERS',
    titleKey: 'adminNewsletter.recipients.new.title',
    subtitleKey: 'adminNewsletter.recipients.new.subtitle',
    icon: 'newSubscribers',
  },
];

export const DEFAULT_RECIPIENT_ID = 'everyone';
export const DEFAULT_CTA_TEXT = 'Read more';

export const NEWSLETTER_FORM_DEFAULTS = {
  subject: '',
  emailTitle: '',
  content: '',
  ctaText: DEFAULT_CTA_TEXT,
  ctaUrl: '',
};

/** @param {string} recipientId */
export const getRecipientTarget = (recipientId) =>
  RECIPIENT_OPTIONS.find((option) => option.id === recipientId)?.target ?? null;

/**
 * @param {string | null | undefined} isoDate
 * @param {string} [locale]
 */
export const formatSubscribedDate = (isoDate, locale) => {
  if (!isoDate) return '—';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
};

const escapeHtml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const HTML_TAG_PATTERN =
  /<\/?(p|br|hr|div|span|strong|b|em|i|u|a|img|ul|ol|li|h[1-6]|blockquote|table|thead|tbody|tr|td|th)(\s[^>]*)?\/?>/i;

/**
 * Plain text → `<p>` paragraphs (blank line = new paragraph, newline = `<br>`).
 * Content that already contains HTML tags is sent as written.
 * @param {string} content
 */
export const toNewsletterHtml = (content) => {
  const trimmed = String(content || '').trim();
  if (!trimmed || HTML_TAG_PATTERN.test(trimmed)) return trimmed;
  return trimmed
    .split(/\n\s*\n/)
    .map(
      (paragraph) =>
        `<p>${escapeHtml(paragraph.trim()).replace(/\n/g, '<br>')}</p>`,
    )
    .join('');
};

/** Backend stores campaign text as localized JSON strings, e.g. `{"en":"..."}`. */
const toLocalizedJson = (value) => JSON.stringify({ en: value });

/**
 * @param {typeof NEWSLETTER_FORM_DEFAULTS} values
 * @param {{ target: string, banner?: File | null, selectedEmails?: string[] }} options
 */
export const buildNewsletterCampaignFormData = (
  values,
  { target, banner, selectedEmails = [] },
) => {
  const formData = new FormData();
  formData.append('target', target);
  if (target === 'SELECTED') {
    formData.append('selectedIds', selectedEmails.join(', '));
  }
  formData.append('subject', toLocalizedJson(values.subject.trim()));
  if (values.emailTitle.trim()) {
    formData.append('title', toLocalizedJson(values.emailTitle.trim()));
  }
  formData.append('content', toLocalizedJson(toNewsletterHtml(values.content)));
  if (values.ctaText.trim()) formData.append('ctaText', values.ctaText.trim());
  if (values.ctaUrl.trim()) formData.append('ctaUrl', values.ctaUrl.trim());
  if (banner) formData.append('banner', banner);
  return formData;
};

/**
 * @param {File | null | undefined} file
 * @param {number} [maxBytes]
 */
export const isBannerFileAllowed = (file, maxBytes = BANNER_MAX_BYTES) => {
  if (!file) return false;
  const typeOk =
    /image\/(png|jpeg|jpg)/i.test(file.type) ||
    /\.(png|jpe?g)$/i.test(file.name);
  return typeOk && file.size <= maxBytes;
};
