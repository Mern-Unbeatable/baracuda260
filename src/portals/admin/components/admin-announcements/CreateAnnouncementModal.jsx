import { X } from 'lucide-react';
import React, { memo, useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  ANNOUNCEMENT_EMOJI_OPTIONS,
  ANNOUNCEMENT_LINK_OPTIONS,
  ANNOUNCEMENT_MESSAGE_MAX,
  ANNOUNCEMENT_PRIORITY_OPTIONS,
  ANNOUNCEMENT_STATUS,
  ANNOUNCEMENT_TYPE_OPTIONS,
  EMPTY_ANNOUNCEMENT_FORM,
} from '@/portals/admin/data/adminAnnouncementsData';

const labelClass =
  'text-[14px] font-medium leading-5 text-[#455163] mb-1.5 block';
const inputClass =
  'box-border h-11 w-full rounded-lg border border-[#dfe4ea] bg-white px-3 py-2.5 text-[14px] leading-5 text-[#253043] outline-none placeholder:text-[#9aa3b2] focus:border-[#4048cd] disabled:cursor-not-allowed disabled:bg-[#f9fafb] disabled:text-[#9aa3b2]';
const selectClass = inputClass;
const textareaClass =
  'box-border min-h-28 w-full resize-y rounded-lg border border-[#dfe4ea] bg-white px-3 py-2.5 text-[14px] leading-5 text-[#253043] outline-none placeholder:text-[#9aa3b2] focus:border-[#4048cd]';
const hintClass = 'pt-1.5 text-[13px] leading-5 text-[#788293]';

const RequiredMark = () => (
  <span className="text-[#f31d2c]" aria-hidden="true">
    {' '}
    *
  </span>
);

/**
 * @param {{
 *   open: boolean,
 *   onClose: () => void,
 *   onCreate: (values: typeof EMPTY_ANNOUNCEMENT_FORM) => void,
 * }} props
 */
const CreateAnnouncementModal = memo(({ open, onClose, onCreate }) => {
  const { t } = useTranslation();
  const titleId = useId();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: EMPTY_ANNOUNCEMENT_FORM,
  });

  const noEndDate = watch('noEndDate');
  const message = watch('message') || '';
  const emoji = watch('emoji');

  useEffect(() => {
    if (!open) return undefined;

    reset(EMPTY_ANNOUNCEMENT_FORM);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose, reset]);

  if (!open) return null;

  const onFormSubmit = (data) => {
    onCreate(data);
  };

  const onFormError = () => {
    toast.error(
      t('form.errors.checkFields', {
        defaultValue: 'Please check the form for errors.',
      }),
    );
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(24,32,51,0.35)] p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-[0px_22px_70px_0px_rgba(14,20,35,0.25)]"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-start justify-between border-b border-[#edf0f3] px-6 pb-5 pt-5">
          <div className="min-w-0 flex-1 pr-3">
            <h2
              id={titleId}
              className="font-manrope text-[22px] font-bold leading-8 text-[#202838]"
            >
              {t('adminAnnouncements.modal.title')}
            </h2>
            <p className="pt-1 text-[14px] leading-5 text-[#788293]">
              {t('adminAnnouncements.modal.subtitle')}
            </p>
          </div>
          <Button
            unstyled
            type="button"
            onClick={onClose}
            aria-label={t('adminAnnouncements.modal.close')}
            className="inline-flex cursor-pointer items-center justify-center rounded-full p-1 text-[#788293] transition hover:bg-black/5"
          >
            <X size={20} aria-hidden="true" />
          </Button>
        </header>

        <form
          onSubmit={handleSubmit(onFormSubmit, onFormError)}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-5">
            <div>
              <label htmlFor="announcement-message" className={labelClass}>
                {t('adminAnnouncements.modal.messageLabel')}
                <RequiredMark />
              </label>
              <textarea
                id="announcement-message"
                maxLength={ANNOUNCEMENT_MESSAGE_MAX}
                placeholder={t('adminAnnouncements.modal.messagePlaceholder')}
                aria-invalid={!!errors.message}
                className={`${textareaClass} ${errors.message ? 'border-[#f31d2c]' : ''}`}
                {...register('message', {
                  required: t('adminAnnouncements.modal.messageRequired'),
                })}
              />
              <div className="flex items-center justify-between pt-1.5">
                {errors.message ? (
                  <p
                    className="text-[13px] leading-4 text-[#f31d2c]"
                    role="alert"
                  >
                    {errors.message.message}
                  </p>
                ) : (
                  <span />
                )}
                <p className="text-[13px] leading-4 text-[#788293]">
                  {t('adminAnnouncements.modal.messageCount', {
                    count: message.length,
                    max: ANNOUNCEMENT_MESSAGE_MAX,
                  })}
                </p>
              </div>
            </div>

            <div>
              <p className={labelClass}>
                {t('adminAnnouncements.modal.emojiLabel')}
              </p>
              <div
                className="mt-2 flex flex-wrap gap-2"
                role="listbox"
                aria-label={t('adminAnnouncements.modal.emojiLabel')}
              >
                {ANNOUNCEMENT_EMOJI_OPTIONS.map((e) => {
                  const selected = emoji === e;
                  return (
                    <Button
                      unstyled
                      key={e}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => setValue('emoji', e)}
                      className={`inline-flex size-10 cursor-pointer items-center justify-center rounded-lg border text-[18px] transition ${
                        selected
                          ? 'border-[#111827] bg-[#111827] shadow-sm'
                          : 'border-[#e5e7eb] bg-white hover:border-[#cbd5e1] hover:bg-[#f9fafb]'
                      }`}
                    >
                      {e}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="announcement-type" className={labelClass}>
                  {t('adminAnnouncements.modal.typeLabel')}
                </label>
                <select
                  id="announcement-type"
                  className={selectClass}
                  {...register('type')}
                >
                  {ANNOUNCEMENT_TYPE_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {t(option.labelKey)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="announcement-link" className={labelClass}>
                  {t('adminAnnouncements.modal.linkLabel')}
                </label>
                <select
                  id="announcement-link"
                  className={selectClass}
                  {...register('link')}
                >
                  {ANNOUNCEMENT_LINK_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {t(option.labelKey)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <p className="text-[14px] font-semibold leading-5 text-[#202838]">
                {t('adminAnnouncements.modal.scheduleTitle')}
              </p>
              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  type="date"
                  label={
                    <>
                      {t('adminAnnouncements.modal.startDate')}
                      <RequiredMark />
                    </>
                  }
                  inputClassName={inputClass}
                  labelClassName={labelClass}
                  error={errors.startDate}
                  {...register('startDate', {
                    required: t(
                      'adminAnnouncements.modal.startDateRequired',
                      'Start date is required',
                    ),
                  })}
                />
                <Input
                  type="time"
                  label={t('adminAnnouncements.modal.startTime')}
                  inputClassName={inputClass}
                  labelClassName={labelClass}
                  {...register('startTime')}
                />
                <Input
                  type="date"
                  label={
                    <>
                      {t('adminAnnouncements.modal.endDate')}
                      {!noEndDate ? <RequiredMark /> : null}
                    </>
                  }
                  inputClassName={inputClass}
                  labelClassName={labelClass}
                  error={errors.endDate}
                  disabled={noEndDate}
                  {...register('endDate', {
                    required: !noEndDate
                      ? t(
                          'adminAnnouncements.modal.endDateRequired',
                          'End date is required',
                        )
                      : false,
                  })}
                />
                <Input
                  type="time"
                  label={t('adminAnnouncements.modal.endTime')}
                  inputClassName={inputClass}
                  labelClassName={labelClass}
                  disabled={noEndDate}
                  {...register('endTime')}
                />
              </div>
              <label className="mt-3 inline-flex cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  className="size-4 cursor-pointer rounded border-[#cbd5e1] accent-[#4048cd]"
                  {...register('noEndDate')}
                />
                <span className="text-[14px] leading-5 text-[#455163]">
                  {t('adminAnnouncements.modal.noEndDate')}
                </span>
              </label>
            </div>

            <div>
              <p className={labelClass}>
                {t('adminAnnouncements.modal.statusLabel')}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-5">
                {[ANNOUNCEMENT_STATUS.ACTIVE, ANNOUNCEMENT_STATUS.INACTIVE].map(
                  (s) => (
                    <label
                      key={s}
                      className="inline-flex cursor-pointer items-center gap-2"
                    >
                      <input
                        type="radio"
                        value={s}
                        className="size-4 cursor-pointer accent-[#4048cd]"
                        {...register('status')}
                      />
                      <span className="text-[14px] leading-5 text-[#253043]">
                        {t(`adminAnnouncements.status.${s}`)}
                      </span>
                    </label>
                  ),
                )}
              </div>
              <p className={hintClass}>
                {t('adminAnnouncements.modal.statusHint')}
              </p>
            </div>

            <div>
              <label htmlFor="announcement-priority" className={labelClass}>
                {t('adminAnnouncements.modal.priorityLabel')}
              </label>
              <select
                id="announcement-priority"
                className={selectClass}
                {...register('priority')}
              >
                {ANNOUNCEMENT_PRIORITY_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {t(option.labelKey)}
                  </option>
                ))}
              </select>
              <p className={hintClass}>
                {t('adminAnnouncements.modal.priorityHint')}
              </p>
            </div>
          </div>

          <footer className="flex flex-col-reverse gap-3 border-t border-[#edf0f3] px-6 py-5 sm:flex-row sm:justify-end">
            <Button
              unstyled
              type="button"
              onClick={onClose}
              className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-[#dfe4ea] px-5 py-2.5 text-[14px] font-medium leading-5 text-[#536070] transition hover:bg-[#f9fafb]"
            >
              {t('adminAnnouncements.modal.cancel')}
            </Button>
            <Button
              unstyled
              type="submit"
              className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-[#ee1c25] px-5 py-2.5 text-[14px] font-semibold leading-5 text-white transition hover:bg-[#d41921]"
            >
              {t('adminAnnouncements.modal.submit')}
            </Button>
          </footer>
        </form>
      </div>
    </div>,
    document.body,
  );
});

CreateAnnouncementModal.displayName = 'CreateAnnouncementModal';

export default CreateAnnouncementModal;
