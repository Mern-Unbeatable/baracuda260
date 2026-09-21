import { useTranslation } from 'react-i18next';
import React, { memo, useState } from 'react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import ConversationMessageModal from '@/portals/member/components/member-support/contactSupport/ConversationMessageModal';
import {
  CONVERSATIONS,
  CONTACT_SUPPORT_ASSETS,
  FILTERS,
  SUBJECT_OPTIONS,
} from '@/portals/member/data/contactSupportData';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const inputClassName =
  'w-full rounded-[12px] border border-black/10 bg-white p-[15px] text-[16px] leading-6 text-[#161c27] placeholder:text-[#a8a8b0] outline-none transition focus:ring-2 focus:ring-[#2563eb]/25';

const StatusBadge = memo(({ status }) => {
  const { t } = useTranslation();
  const isPending = status === 'pending';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[12px] font-medium leading-4 ${
        isPending
          ? 'border border-[#ffedd5] bg-[#fff7ed] px-2.25 py-0.75 text-[#c2410c]'
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

const ConversationItem = memo(({ thread, onOpen }) => {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={() => onOpen(thread)}
      className="flex w-full cursor-pointer items-start gap-4 p-6 text-left transition hover:bg-[#f9fafb]"
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#eff6ff]">
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const [filter, setFilter] = useState('all');
  const [activeThread, setActiveThread] = useState(null);

  const onSubmit = (_data) => {
    reset();
    toast.success(t('contactSupport.success'));
  };

  const visibleThreads =
    filter === 'all'
      ? CONVERSATIONS
      : CONVERSATIONS.filter((thread) => thread.status === filter);

  return (
    <div className="mx-auto flex w-full max-w-395 flex-col items-stretch gap-8 lg:flex-row lg:gap-15">
      <section className="flex w-full min-w-0 flex-col gap-7.5 lg:max-w-192.5 lg:flex-1">
        <header className="flex flex-col gap-4">
          <h1 className="text-[28px] font-semibold tracking-[-0.75px] text-[#161c27] sm:text-[36px] lg:text-[40px]">
            {t('contactSupport.formTitle')}
          </h1>
          <p className="text-[16px] font-normal leading-6 text-[#494453]">
            {t('contactSupport.formSubtitle')}
          </p>
        </header>

        <form
          onSubmit={handleSubmit(onSubmit)}
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
                <Input
                  id="contact-support-name"
                  type="text"
                  placeholder={t('contactSupport.fullNamePlaceholder')}
                  error={errors.fullName}
                  inputClassName={inputClassName}
                  labelClassName="hidden"
                  {...register('fullName', { required: t('contactSupport.errors.nameRequired') })}
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <label
                  htmlFor="contact-support-email"
                  className="text-[16px] font-medium uppercase tracking-[1.2px] text-[#4e525b]"
                >
                  {t('contactSupport.email')}
                </label>
                <Input
                  id="contact-support-email"
                  type="email"
                  placeholder={t('contactSupport.emailPlaceholder')}
                  error={errors.email}
                  inputClassName={inputClassName}
                  labelClassName="hidden"
                  {...register('email', { 
                    required: t('contactSupport.errors.emailRequired'),
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: t('contactSupport.errors.emailInvalid')
                    }
                  })}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label
                htmlFor="contact-support-subject"
                className="text-[16px] font-medium uppercase tracking-[1.2px] text-[#4e525b]"
              >
                {t('contactSupport.subject')}
              </label>
              <select
                id="contact-support-subject"
                aria-invalid={Boolean(errors.subject)}
                className={`${inputClassName} appearance-none bg-size-[16px] bg-position-[right_15px_center] bg-no-repeat pr-11`}
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%237a7484' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                }}
                {...register('subject', { required: t('contactSupport.errors.subjectRequired') })}
              >

                {SUBJECT_OPTIONS.map((option) => (
                  <option key={option.value || 'placeholder'} value={option.value} disabled={!option.value}>
                    {t(option.labelKey)}
                  </option>
                ))}
              </select>
              {errors.subject ? (
                <p className="text-sm text-red-600" role="alert">
                  {errors.subject.message}
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
                placeholder={t('contactSupport.messagePlaceholder')}
                rows={5}
                aria-invalid={Boolean(errors.message)}
                className={`${inputClassName} min-h-37 resize-y`}
                {...register('message', { required: t('contactSupport.errors.messageRequired') })}
              />
              {errors.message ? (
                <p className="text-sm text-red-600" role="alert">
                  {errors.message.message}
                </p>
              ) : null}
            </div>
          </div>

          <Button
            type="submit"
            unstyled={true}
            className="inline-flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-[50px] bg-[#ee1c25] px-6 py-3 text-[16px] font-medium text-white transition hover:bg-[#d41921]"
          >
            <img
              src={CONTACT_SUPPORT_ASSETS.send}
              alt=""
              width={24}
              height={24}
              className="size-6 shrink-0 -rotate-52"
            />
            {t('contactSupport.send')}
          </Button>
        </form>
      </section>

      <section className="flex w-full min-w-0 flex-col gap-7.5 lg:max-w-187.5 lg:flex-1">
        <header className="flex flex-col gap-4">
          <h2 className="text-[28px] font-semibold tracking-[-0.75px] text-[#161c27] sm:text-[36px] lg:text-[40px]">
            {t('contactSupport.conversationsTitle')}
          </h2>
          <p className="text-[16px] font-normal leading-6 text-[#494453]">
            {t('contactSupport.conversationsSubtitle')}
          </p>
        </header>

        <div className="overflow-hidden rounded-3xl border border-[#f3f4f6] bg-white shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]">
          <div
            className="flex flex-wrap gap-2 px-6 pb-4 pt-6"
            role="tablist"
            aria-label={t('contactSupport.filtersAria')}
          >
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
                <ConversationItem
                  key={thread.id}
                  thread={thread}
                  onOpen={setActiveThread}
                />
              ))
            ) : (
              <p className="p-6 text-[14px] text-[#6b7280]">{t('contactSupport.empty')}</p>
            )}
          </div>
        </div>
      </section>

      <ConversationMessageModal
        open={Boolean(activeThread)}
        thread={activeThread}
        onClose={() => setActiveThread(null)}
      />
    </div>
  );
});

ContactSupportContent.displayName = 'ContactSupportContent';

export default ContactSupportContent;
