import React, { memo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowUpFromLine, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { ROUTES } from '@/shared/config';
import { MarketingButton } from '@/shared/ui/marketing';

const MyMessageUploadContent = memo(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [message, setMessage] = useState('');
  const [copyrightOk, setCopyrightOk] = useState(false);
  const [fileName, setFileName] = useState('');
  const [errors, setErrors] = useState({});

  const handlePickFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setFileName(file?.name ?? '');
    if (file) {
      setErrors((current) => {
        const { media: _media, ...rest } = current;
        return rest;
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!message.trim()) nextErrors.message = t('myMessages.upload.errors.messageRequired');
    if (!fileName) nextErrors.media = t('myMessages.upload.errors.mediaRequired');
    if (!copyrightOk) nextErrors.copyright = t('myMessages.upload.errors.copyrightRequired');

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    toast.success(t('myMessages.upload.success'));
    navigate(ROUTES.ADMIN_NEWS_MESSAGES);
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 sm:gap-8">
      <Link
        to={ROUTES.ADMIN_NEWS_MESSAGES}
        className="inline-flex w-fit cursor-pointer items-center gap-2 text-[16px] font-medium leading-6 text-[#707070] transition hover:text-[#ee1c25]"
      >
        <ArrowLeft size={24} aria-hidden="true" className="shrink-0" />
        {t('myMessages.upload.back')}
      </Link>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-6 rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-white p-5 sm:p-8"
      >
        <div className="flex flex-col gap-2.5">
          <label
            htmlFor="message-body"
            className="text-[16px] font-medium leading-6 text-[#494453]"
          >
            {t('myMessages.upload.messageLabel')}
          </label>
          <textarea
            id="message-body"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder={t('myMessages.upload.messagePlaceholder')}
            rows={6}
            aria-invalid={Boolean(errors.message)}
            className="min-h-[160px] w-full resize-y rounded-xl border border-[rgba(0,0,0,0.08)] bg-[#fafaff] px-4 py-3.5 text-[16px] leading-6 text-[#161c27] placeholder:text-[#a8a8b0] outline-none focus:ring-2 focus:ring-[#4048cd]/30"
          />
          {errors.message ? (
            <p className="text-sm text-red-600" role="alert">
              {errors.message}
            </p>
          ) : null}
        </div>

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
            accept="image/jpeg,image/png,video/mp4"
            className="sr-only"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={handlePickFile}
            className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[#cbc3d5] bg-[#fafaff] px-6 py-10 transition hover:border-[#4048cd]/40 hover:bg-[#ecedfa]/40"
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
            {fileName ? (
              <span className="text-center text-[13px] font-medium text-[#4048cd]">{fileName}</span>
            ) : null}
          </button>
          {errors.media ? (
            <p className="text-sm text-red-600" role="alert">
              {errors.media}
            </p>
          ) : null}
        </div>

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={copyrightOk}
            onChange={(event) => {
              setCopyrightOk(event.target.checked);
              if (event.target.checked) {
                setErrors((current) => {
                  const { copyright: _copyright, ...rest } = current;
                  return rest;
                });
              }
            }}
            className="mt-1 size-4 shrink-0 accent-[#ee1c25]"
          />
          <span className="text-[14px] leading-6 text-[#494453]">
            {t('myMessages.upload.copyrightConfirm')}
          </span>
        </label>
        {errors.copyright ? (
          <p className="text-sm text-red-600" role="alert">
            {errors.copyright}
          </p>
        ) : null}

        <MarketingButton type="submit" className="w-full rounded-xl py-3.5">
          <Sparkles size={18} strokeWidth={2} aria-hidden="true" />
          {t('myMessages.upload.submit')}
        </MarketingButton>
      </form>
    </div>
  );
});

MyMessageUploadContent.displayName = 'MyMessageUploadContent';

export default MyMessageUploadContent;
