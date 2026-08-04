import React, { memo, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import {
  CONVERSATIONS,
  CONTACT_SUPPORT_ASSETS,
  FILTERS,
  SUBJECT_OPTIONS,
} from './contactSupportData';

const inputClassName =
  'w-full rounded-[12px] border border-black/[0.22] bg-white p-[15px] text-[16px] leading-6 text-[#161c27] placeholder:text-[#a8a8b0] outline-none transition focus:ring-2 focus:ring-[#2563eb]/25';

const StatusBadge = memo(({ status }) => {
  const { t } = useTranslation();
  const isPending = status === 'pending';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[12px] font-medium leading-4 ${
        isPending
          ? 'border border-[#ffedd5] bg-[#fff7ed] px-[9px] py-[3px] text-[#c2410c]'
          : 'bg-[#dcfce7] text-[#15803d]'
      }`}
    >
      <span
        className={`size-1.5 shrink-0 rounded-full ${isPending ? 'bg-[#f97316]' : 'bg-[#22c55e]'}`}
        aria-hidden="true"
      />
      {t(`contactSupport.status.${status}`)}
    </span>
  );
});

StatusBadge.displayName = 'StatusBadge';

const ConversationItem = memo(({ thread }) => {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      className="flex w-full cursor-pointer items-start gap-4 p-6 text-left transition hover:bg-[#f9fafb]"
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-[12px] bg-[#eff6ff]">
        <img
          src={CONTACT_SUPPORT_ASSETS.envelope}
          alt=""
          width={24}
          height={24}
          className="size-6"
        />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-[15px] font-semibold leading-[22.5px] text-[#111827]">
          {t(thread.titleKey)}
        </span>
        <span className="text-[14px] font-normal leading-5 text-[#6b7280]">
          {t(thread.previewKey)}
        </span>
        <span className="flex flex-wrap items-center gap-2 pt-2">
          <StatusBadge status={thread.status} />
          <span className="text-[14px] leading-5 text-[#9ca3af]">{t(thread.timeKey)}</span>
        </span>
      </span>
      <span className="flex self-stretch items-center">
        <img
          src={CONTACT_SUPPORT_ASSETS.chevron}
          alt=""
          width={20}
          height={20}
          className="size-5 shrink-0"
        />
      </span>
    </button>
  );
});

ConversationItem.displayName = 'ConversationItem';

/**
 * Contact Support — Figma node 195:800 (admin main area; sidebar from Layout).
 */
const ContactSupportContent = memo(() => {
  const { t } = useTranslation();
  const subjectMenuRef = useRef(null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [subjectOpen, setSubjectOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!subjectOpen) return undefined;

    const onPointerDown = (event) => {
      if (subjectMenuRef.current && !subjectMenuRef.current.contains(event.target)) {
        setSubjectOpen(false);
      }
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setSubjectOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [subjectOpen]);

  const validate = () => {
    const nextErrors = {};
    if (!fullName.trim()) nextErrors.fullName = t('contactSupport.errors.nameRequired');
    if (!email.trim()) nextErrors.email = t('contactSupport.errors.emailRequired');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = t('contactSupport.errors.emailInvalid');
    }
    if (!subject) nextErrors.subject = t('contactSupport.errors.subjectRequired');
    if (!message.trim()) nextErrors.message = t('contactSupport.errors.messageRequired');
    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setFullName('');
    setEmail('');
    setSubject('');
    setMessage('');
    toast.success(t('contactSupport.success'));
  };

  const visibleThreads =
    filter === 'all'
      ? CONVERSATIONS
      : CONVERSATIONS.filter((thread) => thread.status === filter);

  return (
    <div className="mx-auto flex w-full max-w-[1580px] flex-col items-stretch gap-8 lg:flex-row lg:gap-[60px]">
      <section className="flex w-full min-w-0 flex-col gap-[30px] lg:max-w-[770px] lg:flex-1">
        <header className="flex flex-col gap-4">
          <h1 className="text-[28px] font-semibold tracking-[-0.75px] text-[#161c27] sm:text-[36px] lg:text-[40px]">
            {t('contactSupport.formTitle')}
          </h1>
          <p className="text-[16px] font-normal leading-6 text-[#494453]">
            {t('contactSupport.formSubtitle')}
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex w-full flex-col gap-6 rounded-[20px] bg-white p-5 sm:p-8 lg:p-10"
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:gap-5">
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <label
                  htmlFor="contact-support-name"
                  className="text-[16px] font-medium uppercase tracking-[1.2px] text-[#4e525b]"
                >
                  {t('contactSupport.fullName')}
                </label>
                <input
                  id="contact-support-name"
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder={t('contactSupport.fullNamePlaceholder')}
                  aria-invalid={Boolean(errors.fullName)}
                  className={inputClassName}
                />
                {errors.fullName ? (
                  <p className="text-sm text-red-600" role="alert">
                    {errors.fullName}
                  </p>
                ) : null}
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <label
                  htmlFor="contact-support-email"
                  className="text-[16px] font-medium uppercase tracking-[1.2px] text-[#4e525b]"
                >
                  {t('contactSupport.email')}
                </label>
                <input
                  id="contact-support-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={t('contactSupport.emailPlaceholder')}
                  aria-invalid={Boolean(errors.email)}
                  className={inputClassName}
                />
                {errors.email ? (
                  <p className="text-sm text-red-600" role="alert">
                    {errors.email}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="relative flex flex-col gap-3" ref={subjectMenuRef}>
              <p className="text-[16px] font-medium uppercase tracking-[1.2px] text-[#4e525b]">
                {t('contactSupport.subject')}
              </p>
              <button
                type="button"
                aria-expanded={subjectOpen}
                aria-haspopup="listbox"
                onClick={() => setSubjectOpen((open) => !open)}
                className={`${inputClassName} flex cursor-pointer items-center justify-between text-left`}
              >
                <span className={subject ? 'text-[#161c27]' : 'text-[#a8a8b0]'}>
                  {subject
                    ? t(`contactSupport.subjects.${subject}`)
                    : t('contactSupport.subjectPlaceholder')}
                </span>
                <img
                  src={CONTACT_SUPPORT_ASSETS.chevron}
                  alt=""
                  width={24}
                  height={12}
                  className={`h-3 w-6 shrink-0 transition ${subjectOpen ? 'rotate-90' : '-rotate-90'}`}
                />
              </button>
              {subjectOpen ? (
                <ul
                  role="listbox"
                  className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-[12px] border border-black/10 bg-white shadow-lg"
                >
                  {SUBJECT_OPTIONS.map((option) => (
                    <li key={option}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={option === subject}
                        onClick={() => {
                          setSubject(option);
                          setSubjectOpen(false);
                          setErrors((current) => {
                            const { subject: _subject, ...rest } = current;
                            return rest;
                          });
                        }}
                        className={`w-full cursor-pointer px-[15px] py-3 text-left text-[15px] transition hover:bg-[#eff6ff] ${
                          option === subject ? 'bg-[#eff6ff] text-[#2563eb]' : 'text-[#494453]'
                        }`}
                      >
                        {t(`contactSupport.subjects.${option}`)}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
              {errors.subject ? (
                <p className="text-sm text-red-600" role="alert">
                  {errors.subject}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-3">
              <label
                htmlFor="contact-support-message"
                className="text-[16px] font-medium uppercase tracking-[1.2px] text-[#4e525b]"
              >
                {t('contactSupport.message')}
              </label>
              <textarea
                id="contact-support-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={t('contactSupport.messagePlaceholder')}
                rows={5}
                aria-invalid={Boolean(errors.message)}
                className={`${inputClassName} min-h-[148px] resize-y`}
              />
              {errors.message ? (
                <p className="text-sm text-red-600" role="alert">
                  {errors.message}
                </p>
              ) : null}
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-[50px] bg-[#ee1c25] px-6 py-3 text-[16px] font-medium text-white transition hover:bg-[#d41921]"
          >
            <img
              src={CONTACT_SUPPORT_ASSETS.send}
              alt=""
              width={24}
              height={24}
              className="size-6 shrink-0 -rotate-[52deg]"
            />
            {t('contactSupport.send')}
          </button>
        </form>
      </section>

      <section className="flex w-full min-w-0 flex-col gap-[30px] lg:max-w-[750px] lg:flex-1">
        <header className="flex flex-col gap-4">
          <h2 className="text-[28px] font-semibold tracking-[-0.75px] text-[#161c27] sm:text-[36px] lg:text-[40px]">
            {t('contactSupport.conversationsTitle')}
          </h2>
          <p className="text-[16px] font-normal leading-6 text-[#494453]">
            {t('contactSupport.conversationsSubtitle')}
          </p>
        </header>

        <div className="overflow-hidden rounded-[24px] border border-[#f3f4f6] bg-white shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]">
          <div className="flex flex-wrap gap-2 px-6 pb-4 pt-6" role="tablist" aria-label={t('contactSupport.filtersAria')}>
            {FILTERS.map((item) => {
              const active = filter === item;
              return (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(item)}
                  className={`cursor-pointer rounded-full px-5 py-2 text-[14px] font-medium leading-5 transition ${
                    active
                      ? 'bg-[#2563eb] text-white'
                      : 'bg-[#f3f4f6] text-[#4b5563] hover:bg-[#e5e7eb]'
                  }`}
                >
                  {t(`contactSupport.filters.${item}`)}
                </button>
              );
            })}
          </div>

          <div className="h-px w-full bg-[#f3f4f6]" aria-hidden="true" />

          <div className="flex flex-col divide-y divide-[#f3f4f6]">
            {visibleThreads.length > 0 ? (
              visibleThreads.map((thread) => (
                <ConversationItem key={thread.id} thread={thread} />
              ))
            ) : (
              <p className="p-6 text-[14px] text-[#6b7280]">{t('contactSupport.empty')}</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
});

ContactSupportContent.displayName = 'ContactSupportContent';

export default ContactSupportContent;
