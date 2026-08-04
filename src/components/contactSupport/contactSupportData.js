/** Admin Contact Support — Figma node 195:800. */
const A = '/assets/contact-support';

export const CONTACT_SUPPORT_ASSETS = {
  send: `${A}/send.svg`,
  envelope: `${A}/envelope.svg`,
  chevron: `${A}/chevron.svg`,
};

export const SUBJECT_OPTIONS = [
  'technical',
  'billing',
  'competition',
  'account',
  'other',
];

export const FILTERS = ['all', 'pending', 'replied'];

export const CONVERSATIONS = [
  {
    id: 'conv-1',
    titleKey: 'contactSupport.threads.export.title',
    previewKey: 'contactSupport.threads.export.preview',
    status: 'replied',
    timeKey: 'contactSupport.threads.export.time',
  },
  {
    id: 'conv-2',
    titleKey: 'contactSupport.threads.export.title',
    previewKey: 'contactSupport.threads.export.preview',
    status: 'replied',
    timeKey: 'contactSupport.threads.export.time',
  },
  {
    id: 'conv-3',
    titleKey: 'contactSupport.threads.export.title',
    previewKey: 'contactSupport.threads.export.preview',
    status: 'pending',
    timeKey: 'contactSupport.threads.export.time',
  },
  {
    id: 'conv-4',
    titleKey: 'contactSupport.threads.export.title',
    previewKey: 'contactSupport.threads.export.preview',
    status: 'replied',
    timeKey: 'contactSupport.threads.export.time',
  },
];
