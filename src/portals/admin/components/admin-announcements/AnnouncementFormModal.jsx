import { X } from 'lucide-react';
import React, { memo, useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  ACTIVE_STATE,
  ANNOUNCEMENT_EMOJI_OPTIONS,
  ANNOUNCEMENT_MESSAGE_MAX,
  ANNOUNCEMENT_PRIORITY_OPTIONS,
  ANNOUNCEMENT_TYPE_OPTIONS,
  EMPTY_ANNOUNCEMENT_FORM,
  getAnnouncementFormValues,
  getAnnouncementTypeLabel,
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
 *   defaultValues: typeof EMPTY_ANNOUNCEMENT_FORM,
 *   isEdit: boolean,
 *   isSaving: boolean,
 *   onCancel: () => void,
 *   onSubmit: (values: typeof EMPTY_ANNOUNCEMENT_FORM) => void,
 * }} props
 */
const AnnouncementForm = ({
  defaultValues,
  isEdit,
  isSaving,
  onCancel,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const fieldId = useId();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({ defaultValues });

  const noEndDate = watch('noEndDate');
  const message = watch('message') || '';
  const icon = watch('icon');

  const typeOptions = ANNOUNCEMENT_TYPE_OPTIONS.includes(defaultValues.type)
    ? ANNOUNCEMENT_TYPE_OPTIONS
    : [defaultValues.type, ...ANNOUNCEMENT_TYPE_OPTIONS];
  const iconOptions = ANNOUNCEMENT_EMOJI_OPTIONS.includes(defaultValues.icon)
    ? ANNOUNCEMENT_EMOJI_OPTIONS
    : [defaultValues.icon, ...ANNOUNCEMENT_EMOJI_OPTIONS];

  const onFormError = () => {
    toast.error(
      t('form.errors.checkFields', {
        defaultValue: 'Please check the form for errors.',
      }),
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onFormError)}
      className="flex flex-1 flex-col overflow-hidden"
    >
      <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-5">
        <div>
          <label htmlFor={`${fieldId}-message`} className={labelClass}>
            {t('adminAnnouncements.modal.messageLabel')}
            <RequiredMark />
          </label>
          <textarea
            id={`${fieldId}-message`}
            maxLength={ANNOUNCEMENT_MESSAGE_MAX}
            placeholder={t('adminAnnouncements.modal.messagePlaceholder')}
            aria-invalid={!!errors.message}
            className={`${textareaClass} ${errors.message ? 'border-[#f31d2c]' : ''}`}
            {...register('message', {
              validate: (value) =>
                Boolean(value.trim()) ||
                t('adminAnnouncements.modal.messageRequired'),
            })}
          />
          <div className="flex items-center justify-between pt-1.5">
            {errors.message ? (
              <p className="text-[13px] leading-4 text-[#f31d2c]" role="alert">
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
            {iconOptions.map((option) => {
              const selected = icon === option;
              return (
                <Button
                  unstyled
                  key={option}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => setValue('icon', option)}
                  className={`inline-flex size-10 cursor-pointer items-center justify-center rounded-lg border text-[18px] transition ${
                    selected
                      ? 'border-[#111827] bg-[#111827] shadow-sm'
                      : 'border-[#e5e7eb] bg-white hover:border-[#cbd5e1] hover:bg-[#f9fafb]'
                  }`}
                >
                  {option}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={`${fieldId}-type`} className={labelClass}>
              {t('adminAnnouncements.modal.typeLabel')}
            </label>
            <select
              id={`${fieldId}-type`}
              className={selectClass}
              {...register('type')}
            >
              {typeOptions.map((type) => (
                <option key={type} value={type}>
                  {getAnnouncementTypeLabel(t, type)}
                </option>
              ))}
            </select>
          </div>

          <Input
            type="text"
            inputMode="url"
            label={t('adminAnnouncements.modal.linkLabel')}
            placeholder={t('adminAnnouncements.modal.linkPlaceholder')}
            inputClassName={inputClass}
            labelClassName={labelClass}
            {...register('link')}
          />
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
                required: t('adminAnnouncements.modal.startDateRequired'),
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
              error={noEndDate ? undefined : errors.endDate}
              disabled={noEndDate}
              {...register('endDate', {
                validate: (value) => {
                  if (getValues('noEndDate')) return true;
                  if (!value) {
                    return t('adminAnnouncements.modal.endDateRequired');
                  }
                  const startDate = getValues('startDate');
                  return (
                    !startDate ||
                    value >= startDate ||
                    t('adminAnnouncements.modal.endDateBeforeStart')
                  );
                },
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
            {[ACTIVE_STATE.ACTIVE, ACTIVE_STATE.INACTIVE].map((state) => (
              <label
                key={state}
                className="inline-flex cursor-pointer items-center gap-2"
              >
                <input
                  type="radio"
                  value={state}
                  className="size-4 cursor-pointer accent-[#4048cd]"
                  {...register('activeState')}
                />
                <span className="text-[14px] leading-5 text-[#253043]">
                  {t(`adminAnnouncements.status.${state}`)}
                </span>
              </label>
            ))}
          </div>
          <p className={hintClass}>
            {t('adminAnnouncements.modal.statusHint')}
          </p>
        </div>

        <div>
          <label htmlFor={`${fieldId}-priority`} className={labelClass}>
            {t('adminAnnouncements.modal.priorityLabel')}
          </label>
          <select
            id={`${fieldId}-priority`}
            className={selectClass}
            {...register('priority')}
          >
            {ANNOUNCEMENT_PRIORITY_OPTIONS.map((priority) => (
              <option key={priority} value={priority}>
                {t(`adminAnnouncements.priority.${priority}`)}
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
          onClick={onCancel}
          disabled={isSaving}
          className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-[#dfe4ea] px-5 py-2.5 text-[14px] font-medium leading-5 text-[#536070] transition hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {t('adminAnnouncements.modal.cancel')}
        </Button>
        <Button
          unstyled
          type="submit"
          disabled={isSaving}
          className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-[#ee1c25] px-5 py-2.5 text-[14px] font-semibold leading-5 text-white transition hover:bg-[#d41921] disabled:cursor-wait disabled:opacity-60"
        >
          {isSaving
            ? t('adminAnnouncements.modal.saving')
            : isEdit
              ? t('adminAnnouncements.modal.save')
              : t('adminAnnouncements.modal.submit')}
        </Button>
      </footer>
    </form>
  );
};

/**
 * Create / edit announcement dialog. In edit mode the form mounts once the
 * details have loaded, so background refetches never overwrite typed input.
 *
 * @param {{
 *   open: boolean,
 *   isEdit: boolean,
 *   announcement?: object | null,
 *   isLoading?: boolean,
 *   isError?: boolean,
 *   errorMessage?: string,
 *   onRetry?: () => void,
 *   isSaving?: boolean,
 *   onClose: () => void,
 *   onSubmit: (values: typeof EMPTY_ANNOUNCEMENT_FORM) => void,
 * }} props
 */
const AnnouncementFormModal = memo(
  ({
    open,
    isEdit,
    announcement = null,
    isLoading = false,
    isError = false,
    errorMessage = '',
    onRetry,
    isSaving = false,
    onClose,
    onSubmit,
  }) => {
    const { t } = useTranslation();
    const titleId = useId();

    useEffect(() => {
      if (!open) return undefined;

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
    }, [open, onClose]);

    if (!open) return null;

    let body;
    if (isEdit && isLoading) {
      body = (
        <div className="flex flex-col gap-4 px-6 py-6" aria-busy="true">
          {['h-28', 'h-10', 'h-11', 'h-24', 'h-11'].map((height, index) => (
            <div
              key={index}
              className={`${height} w-full animate-pulse rounded-lg bg-[#f3f4f6]`}
            />
          ))}
        </div>
      );
    } else if (isEdit && (isError || !announcement)) {
      body = (
        <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
          <p className="text-[15px] text-[#ee1c25]">{errorMessage}</p>
          <Button
            unstyled
            type="button"
            onClick={onRetry}
            className="cursor-pointer rounded-xl border border-[#4048cd] px-4 py-2 text-[15px] font-medium text-[#4048cd] transition hover:bg-[#f6fbff]"
          >
            {t('adminAnnouncements.retry')}
          </Button>
        </div>
      );
    } else {
      body = (
        <AnnouncementForm
          key={isEdit ? announcement.id : 'new'}
          defaultValues={
            isEdit
              ? getAnnouncementFormValues(announcement)
              : EMPTY_ANNOUNCEMENT_FORM
          }
          isEdit={isEdit}
          isSaving={isSaving}
          onCancel={onClose}
          onSubmit={onSubmit}
        />
      );
    }

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
                {isEdit
                  ? t('adminAnnouncements.modal.editTitle')
                  : t('adminAnnouncements.modal.title')}
              </h2>
              <p className="pt-1 text-[14px] leading-5 text-[#788293]">
                {isEdit
                  ? t('adminAnnouncements.modal.editSubtitle')
                  : t('adminAnnouncements.modal.subtitle')}
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

          {body}
        </div>
      </div>,
      document.body,
    );
  },
);

AnnouncementFormModal.displayName = 'AnnouncementFormModal';

export default AnnouncementFormModal;
