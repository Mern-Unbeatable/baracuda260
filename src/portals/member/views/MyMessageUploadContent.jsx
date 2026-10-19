import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ArrowUpFromLine, Loader2, Sparkles, X } from 'lucide-react';
import React, { memo, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import MarketingButton from '@/components/marketing/MarketingButton/MarketingButton';
import Button from '@/components/ui/Button';
import { getApiErrorMessage } from '@/shared/api/client';
import { createPostApi } from '@/shared/api/posts.api';
import { ROUTES } from '@/shared/config';

const MyMessageUploadContent = memo(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      message: '',
      copyrightOk: false,
    },
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [mediaError, setMediaError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl('');
      return undefined;
    }
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedFile]);

  const createMutation = useMutation({
    mutationFn: createPostApi,
    onSuccess: () => {
      toast.success(
        t('myMessages.upload.success', 'Your message was submitted successfully.'),
      );
      queryClient.invalidateQueries({ queryKey: ['user-posts'] });
      navigate(ROUTES.USER_NEWS_MESSAGES);
    },
    onError: (err) => {
      toast.error(
        getApiErrorMessage(
          err,
          t('myMessages.upload.errors.failed', 'Failed to publish post. Please try again.'),
        ),
      );
    },
  });

  const handlePickFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (file) => {
    if (!file) return;
    setSelectedFile(file);
    setMediaError('');
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    handleFileSelected(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelected(file);
    }
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = (data) => {
    if (!selectedFile) {
      setMediaError(t('myMessages.upload.errors.mediaRequired'));
      return;
    }

    createMutation.mutate({
      body: data.message,
      copyrightConfirmed: String(Boolean(data.copyrightOk)),
      media: selectedFile,
    });
  };

  const isSubmitting = createMutation.isPending;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 sm:gap-8">
      <Link
        to={ROUTES.USER_NEWS_MESSAGES}
        className="inline-flex w-fit cursor-pointer items-center gap-2 text-[16px] font-medium leading-6 text-[#707070] transition hover:text-[#ee1c25]"
      >
        <ArrowLeft size={24} aria-hidden="true" className="shrink-0" />
        {t('myMessages.upload.back')}
      </Link>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-6 rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-white p-5 sm:p-8"
      >
        {/* Message body */}
        <div className="flex flex-col gap-2.5">
          <label
            htmlFor="message-body"
            className="text-[16px] font-medium leading-6 text-[#494453]"
          >
            {t('myMessages.upload.messageLabel')}
          </label>
          <textarea
            id="message-body"
            placeholder={t('myMessages.upload.messagePlaceholder')}
            rows={6}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.message)}
            className="min-h-40 w-full resize-y rounded-xl border border-[rgba(0,0,0,0.08)] bg-[#fafaff] px-4 py-3.5 text-[16px] leading-6 text-[#161c27] placeholder:text-[#a8a8b0] outline-none focus:ring-2 focus:ring-[#4048cd]/30 disabled:opacity-60"
            {...register('message', {
              required: t('myMessages.upload.errors.messageRequired'),
            })}
          />
          {errors.message ? (
            <p className="text-sm text-red-600" role="alert">
              {errors.message.message}
            </p>
          ) : null}
        </div>

        {/* Media upload */}
        <div className="flex flex-col gap-2.5">
          <div>
            <h2 className="text-[16px] font-medium leading-6 text-[#494453]">
              {t('myMessages.upload.mediaTitle')}
            </h2>
            <p className="mt-1 text-[14px] leading-5 text-[#6b7280]">
              {t('myMessages.upload.mediaHint')}
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,video/mp4"
            className="sr-only"
            disabled={isSubmitting}
            onChange={handleFileChange}
          />

          {selectedFile && previewUrl ? (
            <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-[#fafaff] p-3">
              <div className="flex items-center gap-3">
                {selectedFile.type.startsWith('image/') ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="size-16 rounded-lg object-cover"
                  />
                ) : (
                  <video
                    src={previewUrl}
                    className="size-16 rounded-lg object-cover"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#161c27]">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-[#6b7280]">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    unstyled
                    type="button"
                    disabled={isSubmitting}
                    onClick={handlePickFile}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                  >
                    {t('common.change', 'Change')}
                  </Button>
                  <Button
                    unstyled
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleRemoveFile}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    aria-label="Remove file"
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <Button
              unstyled
              type="button"
              disabled={isSubmitting}
              onClick={handlePickFile}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed bg-[#fafaff] px-6 py-10 transition ${
                isDragOver
                  ? 'border-[#ee1c25] bg-red-50/20'
                  : 'border-[#cbc3d5] hover:border-[#4048cd]/40 hover:bg-[#ecedfa]/40'
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              <span className="inline-flex size-12 items-center justify-center rounded-full bg-[#ecedfa] text-[#4048cd]">
                <ArrowUpFromLine size={24} strokeWidth={2} aria-hidden="true" />
              </span>
              <span className="text-center text-[15px] font-medium text-[#494453]">
                {t('myMessages.upload.dropLabel')}
              </span>
              <span className="text-center text-[13px] text-[#6b7280]">
                {t('myMessages.upload.dropHint')}
              </span>
            </Button>
          )}

          {mediaError ? (
            <p className="text-sm text-red-600" role="alert">
              {mediaError}
            </p>
          ) : null}
        </div>

        {/* Copyright checkbox */}
        <div>
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              disabled={isSubmitting}
              className="mt-1 size-4 shrink-0 accent-[#ee1c25] disabled:opacity-50"
              {...register('copyrightOk', {
                required: t('myMessages.upload.errors.copyrightRequired'),
              })}
            />
            <span className="text-[14px] leading-6 text-[#494453]">
              {t('myMessages.upload.copyrightConfirm')}
            </span>
          </label>
          {errors.copyrightOk ? (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.copyrightOk.message}
            </p>
          ) : null}
        </div>

        {/* Submit button */}
        <MarketingButton
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl py-3.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Sparkles size={18} strokeWidth={2} aria-hidden="true" />
          )}
          {isSubmitting
            ? t('common.submitting', 'Submitting...')
            : t('myMessages.upload.submit')}
        </MarketingButton>
      </form>
    </div>
  );
});

MyMessageUploadContent.displayName = 'MyMessageUploadContent';

export default MyMessageUploadContent;
