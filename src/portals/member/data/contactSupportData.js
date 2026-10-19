/** Admin Contact Support — Figma nodes 195:800 + 230:329. */
const A = '/assets/contact-support';

export const CONTACT_SUPPORT_ASSETS = {
  send: `${A}/send.svg`,
  envelope: `${A}/envelope.svg`,
  chevron: `${A}/chevron.svg`,
  modalClose: `${A}/modal-close.svg`,
  readCheck: `${A}/read-check.svg`,
  paperclip: `${A}/paperclip.svg`,
  lock: `${A}/lock.svg`,
};

export const FILTERS = ['all', 'pending', 'answered'];

export const SUBJECT_OPTIONS = [
  { value: '', labelKey: 'contactSupport.subjectPlaceholder', defaultLabel: 'Choose a subject' },
  { value: 'Technical issue', labelKey: 'contactSupport.subjects.technical', defaultLabel: 'Technical issue' },
  { value: 'App is crashing', labelKey: 'contactSupport.subjects.appCrashing', defaultLabel: 'App is crashing' },
  { value: 'Billing & payments', labelKey: 'contactSupport.subjects.billing', defaultLabel: 'Billing & payments' },
  { value: 'Competition help', labelKey: 'contactSupport.subjects.competition', defaultLabel: 'Competition help' },
  { value: 'Account & profile', labelKey: 'contactSupport.subjects.account', defaultLabel: 'Account & profile' },
  { value: 'other', labelKey: 'contactSupport.subjects.other', defaultLabel: 'Other' },
];

export const CONVERSATIONS = [
  {
    id: 'conv-1',
    titleKey: 'contactSupport.threads.export.title',
    previewKey: 'contactSupport.threads.export.preview',
    status: 'replied',
    timeKey: 'contactSupport.threads.export.time',
    detailKey: 'export',
  },
  {
    id: 'conv-2',
    titleKey: 'contactSupport.threads.export.title',
    previewKey: 'contactSupport.threads.export.preview',
    status: 'replied',
    timeKey: 'contactSupport.threads.export.time',
    detailKey: 'export',
  },
  {
    id: 'conv-3',
    titleKey: 'contactSupport.threads.export.title',
    previewKey: 'contactSupport.threads.export.preview',
    status: 'pending',
    timeKey: 'contactSupport.threads.export.time',
    detailKey: 'export',
  },
  {
    id: 'conv-4',
    titleKey: 'contactSupport.threads.export.title',
    previewKey: 'contactSupport.threads.export.preview',
    status: 'replied',
    timeKey: 'contactSupport.threads.export.time',
    detailKey: 'export',
  },
];

/** Thread detail payload for the message popup (Figma 230:329). */
export const THREAD_DETAILS = {
  export: {
    lastUpdatedKey: 'contactSupport.modal.lastUpdated',
    dayKey: 'contactSupport.modal.today',
    messages: [
      {
        id: 'msg-user-1',
        role: 'user',
        bodyKey: 'contactSupport.modal.messages.user1',
        timeKey: 'contactSupport.modal.times.user1',
        read: true,
      },
      {
        id: 'msg-support-1',
        role: 'support',
        bodyKey: 'contactSupport.modal.messages.support1',
        timeKey: 'contactSupport.modal.times.support1',
      },
      {
        id: 'msg-support-2',
        role: 'support',
        bodyKey: 'contactSupport.modal.messages.support2',
        timeKey: 'contactSupport.modal.times.support2',
        attachment: {
          nameKey: 'contactSupport.modal.attachment.name',
          sizeKey: 'contactSupport.modal.attachment.size',
        },
      },
    ],
  },
};
