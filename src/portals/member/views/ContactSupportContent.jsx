import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import React, { memo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectUser } from '@/app/store/slices/authSlice';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import Input from '@/components/ui/Input';
import ConversationMessageModal from '@/portals/member/components/member-support/contactSupport/ConversationMessageModal';
import {
  CONTACT_SUPPORT_ASSETS,
  FILTERS,
  SUBJECT_OPTIONS,
} from '@/portals/member/data/contactSupportData';
import useUserProfileMe from '@/portals/member/hooks/useUserProfileMe';
import { getApiErrorMessage } from '@/shared/api/client';
import {
  createSupportTicketApi,
  getMySupportTicketsApi,
  USER_SUPPORT_QUERY_KEY,
} from '@/shared/api/support.api';

const inputClassName =
  'w-full rounded-[12px] border border-black/10 bg-white p-[15px] text-[16px] leading-6 text-[#161c27] placeholder:text-[#a8a8b0] outline-none transition focus:ring-2 focus:ring-[#2563eb]/25';

const StatusBadge = memo(({ status }) => {
  const { t } = useTranslation();
  const raw = String(status || '').toUpperCase();
  const isPending = raw === 'PENDING';

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
      {isPending
        ? t('contactSupport.status.pending', 'Pending')
        : t('contactSupport.status.answered', {
            defaultValue: t('contactSupport.status.replied', 'Answered'),
          })}
    </span>
  );
});

StatusBadge.displayName = 'StatusBadge';

const ConversationItem = memo(({ thread, onOpen }) => {
  return (
    <Button
      unstyled
      type="button"
      onClick={() => onOpen(thread)}
      className="flex w-full cursor-pointer items-start gap-4 p-6 text-left transition hover:bg-[#f9fafb]"
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#eff6ff]">
        <Image
          src={CONTACT_SUPPORT_ASSETS.envelope}
          alt=""
          width={24}
          height={24}
          className="size-6"
        />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-[15px] font-semibold leading-[22.5px] text-[#111827]">
          {thread.title}
        </span>
        <span className="line-clamp-2 text-[14px] font-normal leading-5 text-[#6b7280]">
          {thread.message || thread.preview}
        </span>
        <span className="flex flex-wrap items-center gap-2 pt-2">
          <StatusBadge status={thread.status} />
          {thread.timeDisplay ? (
            <span className="text-[14px] leading-5 text-[#9ca3af]">
              · {thread.timeDisplay}
            </span>
          ) : null}
        </span>
      </span>
      <span className="flex self-stretch items-center">
        <Image
          src={CONTACT_SUPPORT_ASSETS.chevron}
          alt=""
          width={20}
          height={20}
          className="size-5 shrink-0"
        />
      </span>
    </Button>
  );
});

ConversationItem.displayName = 'ConversationItem';

/**
 * Contact Support — Figma node 195:800 (admin main area; sidebar from Layout).
 */
const ContactSupportContent = memo(() => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const user = useSelector(selectUser);
  const { data: profileData } = useUserProfileMe();

  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [activeThread, setActiveThread] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      fullName: user?.name || profileData?.name || '',
      email: user?.email || profileData?.email || '',
      subject: '',
      customSubject: '',
      message: '',
    },
  });

  const watchedSubject = watch('subject');

  useEffect(() => {
    if (profileData?.name || user?.name || profileData?.email || user?.email) {
      reset((prev) => ({
        ...prev,
        fullName: prev.fullName || profileData?.name || user?.name || '',
        email: prev.email || profileData?.email || user?.email || '',
      }));
    }
  }, [profileData?.name, profileData?.email, user?.name, user?.email, reset]);

  const {
    data: ticketsData,
    isLoading: isLoadingTickets,
    isError: isErrorTickets,
    error: ticketsError,
    refetch: refetchTickets,
  } = useQuery({
    queryKey: USER_SUPPORT_QUERY_KEY({ status: filter, page, limit: 10 }),
    queryFn: () => getMySupportTicketsApi({ status: filter, page, limit: 10 }),
    staleTime: 30 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: createSupportTicketApi,
    onSuccess: (res) => {
      toast.success(res?.message || t('contactSupport.success'));
      reset({
        fullName: user?.name || profileData?.name || '',
        email: user?.email || profileData?.email || '',
        subject: '',
        customSubject: '',
        message: '',
      });
      queryClient.invalidateQueries({ queryKey: ['user-support-tickets'] });
    },
    onError: (err) => {
      toast.error(
        getApiErrorMessage(
          err,
          t(
            'contactSupport.errors.sendFailed',
            'Failed to send message. Please try again.',
          ),
        ),
      );
    },
  });

  const onSubmit = (formData) => {
    const finalSubject =
      formData.subject === 'other' && formData.customSubject?.trim()
        ? formData.customSubject.trim()
        : formData.subject;

    createMutation.mutate({
      name: formData.fullName.trim(),
      email: formData.email.trim(),
      subject: finalSubject,
      message: formData.message.trim(),
    });
  };

  const tickets = ticketsData?.items || [];
  const meta = ticketsData?.meta || {};
  const currentPage = meta.currentPage || 1;
  const totalPages = meta.totalPages || 1;
  const hasNext = Boolean(meta.hasNext);
  const hasPrevious = Boolean(meta.hasPrevious);

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
                  {...register('fullName', {
                    required: t('contactSupport.errors.nameRequired'),
                  })}
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
                      message: t('contactSupport.errors.emailInvalid'),
                    },
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
                {...register('subject', {
                  required: t('contactSupport.errors.subjectRequired'),
                })}
              >
                {SUBJECT_OPTIONS.map((option) => (
                  <option
                    key={option.value || 'placeholder'}
                    value={option.value}
                    disabled={!option.value}
                  >
                    {t(option.labelKey, { defaultValue: option.defaultLabel })}
                  </option>
                ))}
              </select>
              {errors.subject ? (
                <p className="text-sm text-red-600" role="alert">
                  {errors.subject.message}
                </p>
              ) : null}

              {watchedSubject === 'other' ? (
                <div className="mt-2 flex flex-col gap-2">
                  <Input
                    id="contact-support-custom-subject"
                    type="text"
                    placeholder={t(
                      'contactSupport.customSubjectPlaceholder',
                      'Specify your subject...',
                    )}
                    error={errors.customSubject}
                    inputClassName={inputClassName}
                    labelClassName="hidden"
                    {...register('customSubject', {
                      required: t(
                        'contactSupport.errors.subjectRequired',
                        'Please specify a subject.',
                      ),
                    })}
                  />
                </div>
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
                {...register('message', {
                  required: t('contactSupport.errors.messageRequired'),
                })}
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
            disabled={createMutation.isPending}
            className="inline-flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-[50px] bg-[#ee1c25] px-6 py-3 text-[16px] font-medium text-white transition hover:bg-[#d41921] disabled:opacity-60"
          >
            {createMutation.isPending ? (
              <RefreshCw size={20} className="animate-spin text-white" />
            ) : (
              <Image
                src={CONTACT_SUPPORT_ASSETS.send}
                alt=""
                width={24}
                height={24}
                className="size-6 shrink-0 -rotate-52"
              />
            )}
            {createMutation.isPending
              ? t('common.sending', 'Sending...')
              : t('contactSupport.send')}
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
                <Button
                  unstyled
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setFilter(item);
                    setPage(1);
                  }}
                  className={`cursor-pointer rounded-full px-5 py-2 text-[14px] font-medium leading-5 transition ${
                    active
                      ? 'bg-[#2563eb] text-white'
                      : 'bg-[#f3f4f6] text-[#4b5563] hover:bg-[#e5e7eb]'
                  }`}
                >
                  {t(`contactSupport.filters.${item}`)}
                </Button>
              );
            })}
          </div>

          <div className="h-px w-full bg-[#f3f4f6]" aria-hidden="true" />

          {isLoadingTickets ? (
            <div className="flex min-h-[250px] items-center justify-center">
              <RefreshCw size={24} className="animate-spin text-[#2563eb]" />
            </div>
          ) : isErrorTickets ? (
            <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 p-6 text-center">
              <p className="text-[14px] text-red-500">
                {ticketsError?.message ||
                  t('common.error', 'Failed to load support tickets')}
              </p>
              <button
                type="button"
                onClick={() => refetchTickets()}
                className="rounded-lg bg-[#2563eb] px-4 py-2 text-[13px] font-medium text-white transition hover:bg-[#1d4ed8]"
              >
                {t('common.retry', 'Retry')}
              </button>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-[#f3f4f6]">
              {tickets.length > 0 ? (
                tickets.map((thread) => (
                  <ConversationItem
                    key={thread.id}
                    thread={thread}
                    onOpen={setActiveThread}
                  />
                ))
              ) : (
                <p className="p-6 text-[14px] text-[#6b7280]">
                  {t('contactSupport.empty')}
                </p>
              )}
            </div>
          )}

          {totalPages > 1 ? (
            <div className="flex items-center justify-between border-t border-[#f3f4f6] px-6 py-4">
              <span className="text-[13px] text-[#6b7280]">
                {t('common.pageOf', 'Page {{current}} of {{total}}', {
                  current: currentPage,
                  total: totalPages,
                })}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!hasPrevious}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="cursor-pointer rounded-lg border border-[#e5e7eb] px-3 py-1.5 text-[13px] font-medium text-[#374151] transition hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t('common.previous', 'Previous')}
                </button>
                <button
                  type="button"
                  disabled={!hasNext}
                  onClick={() => setPage((p) => p + 1)}
                  className="cursor-pointer rounded-lg border border-[#e5e7eb] px-3 py-1.5 text-[13px] font-medium text-[#374151] transition hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t('common.next', 'Next')}
                </button>
              </div>
            </div>
          ) : null}
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
