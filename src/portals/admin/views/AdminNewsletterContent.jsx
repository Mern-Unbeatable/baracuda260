import { useTranslation } from 'react-i18next';
import React, { memo, useId } from 'react';
import {
  ADMIN_NEWSLETTER_ASSETS,
  CHECK_ICON_SIZE,
  CLOSE_ICON_SIZE,
  COMPOSER_ICON_SIZE,
  RECIPIENT_ICON_SIZE,
  RECIPIENT_OPTIONS,
  TOOLBAR_ICON_SIZE,
  UPLOAD_ICON_SIZE,
} from '@/portals/admin/data/adminNewsletterData';
import useAdminNewsletter from '@/portals/admin/hooks/useAdminNewsletter';
import AdminPageHeader from '@/portals/admin/components/ui/AdminPageHeader';

const fieldLabelClass =
  'text-[12px] font-bold uppercase leading-4 tracking-[0.6px] text-[#64748b]';
const inputClass =
  'w-full rounded-[12px] border border-[#e2e8f0] bg-white px-[17px] py-[15px] text-[16px] text-[#0f172a] outline-none placeholder:text-[#94a3b8] focus:border-[#4048cd]';

/**
 * @param {{
 *   option: { id: string, titleKey: string, subtitleKey: string, icon: string },
 *   selected: boolean,
 *   onSelect: () => void,
 * }} props
 */
const RecipientOption = memo(({ option, selected, onSelect }) => {
  const { t } = useTranslation();
  const iconSrc = ADMIN_NEWSLETTER_ASSETS[option.icon];

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex w-full cursor-pointer items-center justify-between rounded-2xl text-left transition ${
        selected
          ? 'border-2 border-[#4048cd] bg-[rgba(239,246,255,0.3)] p-4.5'
          : 'border border-[#e2e8f0] bg-white p-4.25 hover:border-[#cbd5e1]'
      }`}
    >
      <span className="flex min-w-0 items-center">
        <span
          className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${
            selected ? 'bg-[#4048cd]' : 'bg-[#f8fafc]'
          }`}
        >
          <img
            src={iconSrc}
            alt=""
            width={RECIPIENT_ICON_SIZE}
            height={RECIPIENT_ICON_SIZE}
            className="size-6"
          />
        </span>
        <span className="flex min-w-0 flex-col pl-4">
          <span className="text-[16px] font-semibold leading-6 text-[#0f172a]">
            {t(option.titleKey)}
          </span>
          <span className="text-[14px] leading-5.25 text-[#64748b]">{t(option.subtitleKey)}</span>
        </span>
      </span>
      {selected ? (
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#4048cd]">
          <img
            src={ADMIN_NEWSLETTER_ASSETS.check}
            alt=""
            width={CHECK_ICON_SIZE}
            height={CHECK_ICON_SIZE}
            className="size-4"
          />
        </span>
      ) : (
        <span className="size-6 shrink-0 rounded-full border-2 border-[#e2e8f0]" aria-hidden="true" />
      )}
    </button>
  );
});

RecipientOption.displayName = 'RecipientOption';

/**
 * Admin Newsletter — Figma node 346:1740.
 */
const AdminNewsletterContent = memo(() => {
  const { t } = useTranslation();
  const bannerInputId = useId();
  const {
    subscribers,
    subject,
    setSubject,
    emailTitle,
    setEmailTitle,
    content,
    setContent,
    ctaText,
    setCtaText,
    ctaUrl,
    setCtaUrl,
    bannerName,
    bannerError,
    handleBannerChange,
    recipientId,
    setRecipientId,
    selectedSubscriberIds,
    handleToggleSubscriber,
    composerOpen,
    setComposerOpen,
    sending,
    attempted,
    isRecipientsValid,
    handleSend,
  } = useAdminNewsletter();

  const isSelectMode = recipientId === 'selected';
  const selectedCount = selectedSubscriberIds.length;

  return (
    <div className="flex w-full flex-col gap-6 py-2 sm:gap-6 sm:py-4">
      <AdminPageHeader
        title={t('adminNewsletter.title')}
        description={t('adminNewsletter.subtitle')}
      />

      <div className="flex flex-col items-stretch gap-6 xl:flex-row xl:items-start xl:gap-9.5">
        {/* Subscriber list — natural height on mobile; capped scroll on xl only */}
        <section
          aria-label={t('adminNewsletter.tableAria')}
          className={`w-full self-start overflow-hidden rounded-xl bg-white xl:max-w-188.25 xl:flex-1 ${
            isSelectMode ? 'ring-2 ring-[#4048cd]/40' : ''
          }`}
        >
          <div className="flex items-center justify-between rounded-t-xl bg-[#f6fbff] px-4">
            {isSelectMode ? (
              <div className="min-w-0 flex-1 px-2.5 py-3">
                <p className="text-[14px] font-semibold leading-5 text-[#4048cd]">
                  {t('adminNewsletter.recipients.selectHint')}
                </p>
                <p className="text-[13px] leading-5 text-[#64748b]">
                  {t('adminNewsletter.recipients.selectedCount', { count: selectedCount })}
                </p>
              </div>
            ) : (
              <div className="min-w-0 flex-1 px-2.5 py-3 text-[16px] leading-6 text-black">
                {t('adminNewsletter.columns.email')}
              </div>
            )}
            <div className="w-35 shrink-0 px-2.5 py-3 text-right text-[16px] leading-6 text-black sm:w-45 sm:text-left">
              {t('adminNewsletter.columns.subscribedDate')}
            </div>
          </div>
          <ul className="scrollbar-newsletter flex flex-col overflow-y-auto xl:max-h-[calc(100dvh-11rem)] xl:overflow-y-scroll">
            {subscribers.map((row) => {
              const isSelected = selectedSubscriberIds.includes(row.id);

              return (
                <li
                  key={row.id}
                  className={`flex items-center justify-between border-b border-[#e4e4e4] px-4 last:border-b-0 ${
                    isSelectMode && isSelected ? 'bg-[rgba(239,246,255,0.45)]' : ''
                  }`}
                >
                  {isSelectMode ? (
                    <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 px-2.5 py-4 sm:py-6">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSubscriber(row.id)}
                        className="size-4 shrink-0 cursor-pointer accent-[#4048cd]"
                        aria-label={t('adminNewsletter.recipients.selectSubscriber', { email: row.email })}
                      />
                      <span className="break-all text-[14px] leading-6 text-[#0c0c0c] sm:text-[16px]">
                        {row.email}
                      </span>
                    </label>
                  ) : (
                    <div className="min-w-0 flex-1 px-2.5 py-4 text-[14px] leading-6 text-[#0c0c0c] sm:py-6 sm:text-[16px]">
                      <span className="break-all">{row.email}</span>
                    </div>
                  )}
                  <div className="w-35 shrink-0 px-2.5 py-4 text-right text-[14px] leading-6 text-[#0c0c0c] sm:w-45 sm:py-6 sm:text-left sm:text-[16px]">
                    {row.subscribedDate}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Composer + recipients — never stretch to match list height */}
        <div className="flex w-full shrink-0 flex-col gap-5 self-start xl:max-w-3xl xl:flex-1">
          {composerOpen ? (
            <section className="flex h-auto w-full shrink-0 flex-col gap-8 overflow-hidden rounded-3xl border border-[#e2e8f0] bg-white pb-8 pt-px">
              <div className="flex items-center justify-between border-b border-[#f1f5f9] px-5 pb-6.25 pt-6 sm:px-8">
                <div className="flex items-center gap-3">
                  <div className="flex rounded-lg bg-[#eef2ff] p-2">
                    <img
                      src={ADMIN_NEWSLETTER_ASSETS.composer}
                      alt=""
                      width={COMPOSER_ICON_SIZE}
                      height={COMPOSER_ICON_SIZE}
                      className="size-5"
                    />
                  </div>
                  <h2 className="font-manrope text-[18px] font-bold leading-7 text-[#1e293b] sm:text-[20px]">
                    {t('adminNewsletter.composer.title')}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setComposerOpen(false)}
                  aria-label={t('adminNewsletter.composer.close')}
                  className="cursor-pointer rounded-md p-1 transition hover:bg-[#f1f5f9]"
                >
                  <img
                    src={ADMIN_NEWSLETTER_ASSETS.close}
                    alt=""
                    width={CLOSE_ICON_SIZE}
                    height={CLOSE_ICON_SIZE}
                    className="size-6"
                  />
                </button>
              </div>

              <div className="flex w-full flex-col gap-6 px-5 sm:px-8">
                <label className="flex w-full flex-col gap-2">
                  <span className={fieldLabelClass}>{t('adminNewsletter.composer.subject')}</span>
                  <input
                    type="text"
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                    placeholder={t('adminNewsletter.composer.subjectPlaceholder')}
                    className={inputClass}
                  />
                </label>

                <label className="flex w-full flex-col gap-2">
                  <span className={fieldLabelClass}>{t('adminNewsletter.composer.emailTitle')}</span>
                  <input
                    type="text"
                    value={emailTitle}
                    onChange={(event) => setEmailTitle(event.target.value)}
                    placeholder={t('adminNewsletter.composer.emailTitlePlaceholder')}
                    className={inputClass}
                  />
                </label>

                <div className="flex w-full flex-col gap-2">
                  <span className={fieldLabelClass} id="newsletter-content-label">
                    {t('adminNewsletter.composer.content')}
                  </span>
                  <div className="overflow-hidden rounded-xl border border-[#e2e8f0]">
                    <div
                      className="flex flex-wrap items-center gap-3 border-b border-[#f1f5f9] bg-white px-4 py-3 sm:gap-4"
                      role="toolbar"
                      aria-label={t('adminNewsletter.composer.toolbarAria')}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[16px] leading-6 text-[#475569]" aria-hidden="true">
                          B
                        </span>
                        <span className="text-[16px] italic leading-6 text-[#475569]" aria-hidden="true">
                          I
                        </span>
                        <span className="text-[16px] underline leading-6 text-[#475569]" aria-hidden="true">
                          U
                        </span>
                      </div>
                      <span className="h-4 w-px bg-[#e2e8f0]" aria-hidden="true" />
                      <div className="flex items-center gap-3">
                        <img
                          src={ADMIN_NEWSLETTER_ASSETS.alignLeft}
                          alt=""
                          width={TOOLBAR_ICON_SIZE}
                          height={TOOLBAR_ICON_SIZE}
                          className="size-4"
                        />
                        <img
                          src={ADMIN_NEWSLETTER_ASSETS.alignCenter}
                          alt=""
                          width={TOOLBAR_ICON_SIZE}
                          height={TOOLBAR_ICON_SIZE}
                          className="size-4"
                        />
                        <img
                          src={ADMIN_NEWSLETTER_ASSETS.alignRight}
                          alt=""
                          width={TOOLBAR_ICON_SIZE}
                          height={TOOLBAR_ICON_SIZE}
                          className="size-4"
                        />
                      </div>
                      <span className="h-4 w-px bg-[#e2e8f0]" aria-hidden="true" />
                      <img
                        src={ADMIN_NEWSLETTER_ASSETS.code}
                        alt=""
                        width={TOOLBAR_ICON_SIZE}
                        height={TOOLBAR_ICON_SIZE}
                        className="size-4"
                      />
                      <span className="h-4 w-px bg-[#e2e8f0]" aria-hidden="true" />
                      <img
                        src={ADMIN_NEWSLETTER_ASSETS.link}
                        alt=""
                        width={TOOLBAR_ICON_SIZE}
                        height={TOOLBAR_ICON_SIZE}
                        className="size-4"
                      />
                    </div>
                    <textarea
                      aria-labelledby="newsletter-content-label"
                      value={content}
                      onChange={(event) => setContent(event.target.value)}
                      placeholder={t('adminNewsletter.composer.contentPlaceholder')}
                      rows={6}
                      className="min-h-40 w-full resize-y border-0 bg-white px-4 py-4 text-[16px] leading-6 text-[#0f172a] outline-none placeholder:text-[#94a3b8]"
                    />
                  </div>
                </div>

                <div className="flex w-full flex-col gap-2">
                  <span className={fieldLabelClass}>{t('adminNewsletter.composer.banner')}</span>
                  <label
                    htmlFor={bannerInputId}
                    className="flex cursor-pointer items-center gap-4 rounded-xl border-2 border-dashed border-[#e2e8f0] bg-[rgba(248,250,252,0.3)] px-4.5 py-6.5 transition hover:border-[#4048cd]"
                  >
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#e2e8f0] bg-white shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
                      <img
                        src={ADMIN_NEWSLETTER_ASSETS.upload}
                        alt=""
                        width={UPLOAD_ICON_SIZE}
                        height={UPLOAD_ICON_SIZE}
                        className="size-6"
                      />
                    </span>
                    <span className="flex min-w-0 flex-col">
                      <span className="text-[14px] font-semibold leading-5 text-[#1e293b]">
                        {bannerName || t('adminNewsletter.composer.upload')}
                      </span>
                      <span className="text-[13px] leading-5 text-[#94a3b8] sm:text-[14px]">
                        {t('adminNewsletter.composer.uploadHint')}
                      </span>
                    </span>
                    <input
                      id={bannerInputId}
                      type="file"
                      accept="image/png,image/jpeg,.png,.jpg,.jpeg"
                      className="sr-only"
                      onChange={handleBannerChange}
                    />
                  </label>
                  {bannerError ? (
                    <p className="text-[13px] text-[#ee1c25]">{t(bannerError)}</p>
                  ) : null}
                </div>

                <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
                  <label className="flex w-full flex-col gap-2">
                    <span className={fieldLabelClass}>{t('adminNewsletter.composer.ctaText')}</span>
                    <input
                      type="text"
                      value={ctaText}
                      onChange={(event) => setCtaText(event.target.value)}
                      placeholder={t('adminNewsletter.composer.ctaTextPlaceholder')}
                      className="w-full rounded-xl border border-[#e2e8f0] bg-white px-4.25 py-3.25 text-[16px] leading-6 text-[#334155] outline-none placeholder:text-[#94a3b8] focus:border-[#4048cd]"
                    />
                  </label>
                  <label className="flex w-full flex-col gap-2">
                    <span className={fieldLabelClass}>{t('adminNewsletter.composer.ctaUrl')}</span>
                    <input
                      type="url"
                      value={ctaUrl}
                      onChange={(event) => setCtaUrl(event.target.value)}
                      placeholder={t('adminNewsletter.composer.ctaUrlPlaceholder')}
                      className={inputClass}
                    />
                  </label>
                </div>

                {attempted && !subject.trim() ? (
                  <p className="text-[13px] text-[#ee1c25]">{t('adminNewsletter.send.subjectRequired')}</p>
                ) : null}
                {attempted && !content.trim() ? (
                  <p className="text-[13px] text-[#ee1c25]">{t('adminNewsletter.send.contentRequired')}</p>
                ) : null}
                {attempted && isSelectMode && !isRecipientsValid ? (
                  <p className="text-[13px] text-[#ee1c25]">
                    {t('adminNewsletter.send.recipientsRequired')}
                  </p>
                ) : null}

                <button
                  type="button"
                  onClick={handleSend}
                  disabled={sending}
                  className="w-full cursor-pointer rounded-xl bg-[#4048cd] px-6 py-4 text-[16px] font-bold leading-6 text-white shadow-[0px_4px_12px_rgba(64,72,205,0.3)] transition hover:bg-[#363db8] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {sending
                    ? t('adminNewsletter.send.sending')
                    : t('adminNewsletter.send.button')}
                </button>
              </div>
            </section>
          ) : (
            <button
              type="button"
              onClick={() => setComposerOpen(true)}
              className="w-full cursor-pointer rounded-3xl border border-dashed border-[#e2e8f0] bg-white px-6 py-8 text-left text-[16px] font-semibold text-[#4048cd] transition hover:border-[#4048cd]"
            >
              {t('adminNewsletter.composer.reopen')}
            </button>
          )}

          <section className="flex h-auto w-full shrink-0 flex-col gap-8 rounded-3xl border border-[#f1f5f9] bg-white p-5 shadow-[0px_4px_10px_rgba(0,0,0,0.05)] sm:p-8.25">
            <div className="flex flex-col gap-0.75">
              <h2 className="text-[20px] font-bold leading-6.25 text-[#0f172a]">
                {t('adminNewsletter.recipients.title')}
              </h2>
              <p className="text-[15px] leading-[22.5px] text-[#64748b]">
                {t('adminNewsletter.recipients.subtitle')}
              </p>
            </div>
            <div className="flex flex-col gap-4" role="group" aria-label={t('adminNewsletter.recipients.title')}>
              {RECIPIENT_OPTIONS.map((option) => (
                <RecipientOption
                  key={option.id}
                  option={option}
                  selected={recipientId === option.id}
                  onSelect={() => setRecipientId(option.id)}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
});

AdminNewsletterContent.displayName = 'AdminNewsletterContent';

export default AdminNewsletterContent;
