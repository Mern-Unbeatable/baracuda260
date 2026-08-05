import React, { memo } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../config';
import {
  ADMIN_BUSINESS_LINK_ASSETS,
  ARROW_ICON_SIZE,
  COPY_ICON_SIZE,
} from './adminBusinessLinkData';
import useAdminBusinessLinkDetail from './useAdminBusinessLinkDetail';

/**
 * @param {{
 *   slide: object,
 *   active: boolean,
 *   onSelect: () => void,
 * }} props
 */
const ZodiacThumb = memo(({ slide, active, onSelect }) => {
  const { t } = useTranslation();
  const isRed = slide.theme === 'red';
  const numberColor = isRed ? 'text-[#ee1c25]' : 'text-[#4048cd]';
  const borderClass = active
    ? isRed
      ? 'border-[#ee1c25]'
      : 'border-[#4048cd]'
    : 'border-transparent';

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={t('adminBusinessLink.detail.selectPhoto', {
        number: slide.number,
        sign: slide.sign,
      })}
      aria-current={active ? 'true' : undefined}
      className="flex min-w-[72px] cursor-pointer flex-col items-center gap-1.5 sm:min-w-0"
    >
      <span className={`text-[14px] font-semibold leading-none ${numberColor}`}>{slide.number}</span>
      <img src={slide.icon} alt="" width={22} height={22} className="size-[22px] object-contain" />
      <span className={`text-[11px] font-medium leading-none sm:text-[12px] ${numberColor}`}>
        {slide.sign}
      </span>
      <span
        className={`mt-1 block size-[56px] overflow-hidden rounded-[8px] border-2 sm:size-[64px] ${borderClass}`}
      >
        <img src={slide.thumb} alt="" className="size-full object-cover" />
      </span>
    </button>
  );
});

ZodiacThumb.displayName = 'ZodiacThumb';

/**
 * Admin Business Link Details — Figma node 345:1130.
 */
const AdminBusinessLinkDetailContent = memo(() => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { detail, slides, activeIndex, activeSlide, goPrev, goNext, selectSlide } =
    useAdminBusinessLinkDetail(id);

  if (!detail || !activeSlide) {
    return (
      <div className="flex w-full flex-col gap-4 py-6">
        <p className="text-[16px] text-[#687186]">{t('adminBusinessLink.detail.notFound')}</p>
        <Link
          to={ROUTES.ADMIN_BUSINESS_PHOTOS}
          className="text-[16px] font-medium text-[#4048cd] hover:underline"
        >
          {t('adminBusinessLink.detail.back')}
        </Link>
      </div>
    );
  }

  const isBlueTheme = activeSlide.theme === 'blue';
  const badgeBg = isBlueTheme ? 'bg-[#4048cd]' : 'bg-[#ee1c25]';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(detail.businessLink);
      toast.success(t('adminBusinessLink.detail.copySuccess'));
    } catch {
      toast.error(t('adminBusinessLink.detail.copyFailed'));
    }
  };

  return (
    <div className="flex w-full flex-col gap-6 py-2 sm:gap-8 sm:py-4">
      <div className="flex items-center gap-2 text-[14px] text-[#687186]">
        <Link to={ROUTES.ADMIN_BUSINESS_PHOTOS} className="hover:text-[#4048cd] hover:underline">
          {t('adminBusinessLink.title')}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-[#111827]">{t(detail.nameKey)}</span>
      </div>

      {/* Profile card */}
      <section className="rounded-[24px] border border-[#f3f4f6] bg-white p-5 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#eff4ff] text-[18px] font-bold text-[#2563eb] sm:size-16 sm:text-[20px]">
              {detail.initials}
            </div>
            <div>
              <h1 className="font-manrope text-[18px] font-bold tracking-[-0.5px] text-[#111827] sm:text-[20px] sm:leading-7">
                {t(detail.nameKey)}
              </h1>
              <p className="text-[15px] leading-7 text-[#6b7280] sm:text-[18px]">{detail.email}</p>
            </div>
          </div>
          <span className="inline-flex w-fit rounded-full bg-[#eff4ff] px-4 py-1.5 text-[14px] font-semibold leading-5 text-[#2563eb]">
            {t(detail.statusKey)}
          </span>
        </div>

        <div className="my-6 h-px w-full bg-[#f3f4f6]" />

        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <div>
            <dt className="text-[14px] font-medium leading-5 text-[#9ca3af]">
              {t('adminBusinessLink.detail.phone')}
            </dt>
            <dd className="text-[16px] font-medium leading-6 text-[#374151]">{detail.phone}</dd>
          </div>
          <div>
            <dt className="text-[14px] font-medium leading-5 text-[#9ca3af]">
              {t('adminBusinessLink.detail.countryLabel')}
            </dt>
            <dd className="text-[16px] font-medium leading-6 text-[#374151]">
              {t(detail.countryKey)}
            </dd>
          </div>
          <div>
            <dt className="text-[14px] font-medium leading-5 text-[#9ca3af]">
              {t('adminBusinessLink.detail.uploadedLabel')}
            </dt>
            <dd className="text-[16px] font-medium leading-6 text-[#374151]">
              {t(detail.uploadedKey)}
            </dd>
          </div>
          <div>
            <dt className="text-[14px] font-medium leading-5 text-[#9ca3af]">
              {t('adminBusinessLink.detail.albumIdLabel')}
            </dt>
            <dd className="text-[16px] font-bold leading-6 text-[#111827]">{detail.albumId}</dd>
          </div>
        </dl>
      </section>

      {/* Hero viewer */}
      <section aria-label={t('adminBusinessLink.detail.galleryAria')} className="flex flex-col gap-4">
        <div className="relative aspect-[1536/653] w-full overflow-hidden rounded-[16px] sm:rounded-[20px]">
          <img
            src={activeSlide.hero}
            alt={`${t(detail.titleKey)} — ${activeSlide.sign}`}
            className="absolute inset-0 size-full object-cover"
          />
          <div
            className={`absolute left-4 top-4 inline-flex items-end gap-2 rounded-[20px] px-4 py-1.5 sm:left-6 sm:top-6 ${badgeBg}`}
          >
            <img
              src={ADMIN_BUSINESS_LINK_ASSETS.ariesWhite}
              alt=""
              width={24}
              height={21}
              className="h-[21px] w-6 object-contain"
            />
            <span className="text-[16px] text-white sm:text-[20px]">{activeSlide.sign}</span>
          </div>

          <button
            type="button"
            aria-label={t('adminBusinessLink.detail.previousPhoto')}
            onClick={goPrev}
            className="absolute left-3 top-1/2 flex size-[44px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/70 transition hover:bg-white sm:left-4 sm:size-[51px]"
          >
            <img
              src={ADMIN_BUSINESS_LINK_ASSETS.arrow}
              alt=""
              width={ARROW_ICON_SIZE}
              height={32}
              className="h-8 w-4 rotate-180"
            />
          </button>
          <button
            type="button"
            aria-label={t('adminBusinessLink.detail.nextPhoto')}
            onClick={goNext}
            className="absolute right-3 top-1/2 flex size-[44px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/70 transition hover:bg-white sm:right-4 sm:size-[51px]"
          >
            <img
              src={ADMIN_BUSINESS_LINK_ASSETS.arrow}
              alt=""
              width={ARROW_ICON_SIZE}
              height={32}
              className="h-8 w-4"
            />
          </button>
        </div>

        <div className="w-full px-1 sm:px-4" aria-hidden="true">
          <img
            src={ADMIN_BUSINESS_LINK_ASSETS.curve}
            alt=""
            className="h-auto w-full object-contain"
          />
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-max items-start justify-between gap-3 px-1 sm:min-w-0 sm:gap-2 md:gap-3">
            {slides.map((slide, index) => (
              <ZodiacThumb
                key={slide.id}
                slide={slide}
                active={index === activeIndex}
                onSelect={() => selectSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Story + link — Figma 345:1555 */}
      <div className="flex w-full flex-col gap-8 sm:gap-9">
        <section className="flex w-full flex-col gap-4" aria-labelledby="business-link-photo-title">
          <div className="flex flex-wrap items-start gap-4 sm:gap-8">
            <span className="inline-flex items-center justify-center rounded-[50px] bg-[#ecedfa] px-4 py-[5px] font-manrope text-[14px] font-bold uppercase leading-6 tracking-[1.2px] text-[#4048cd] sm:text-[16px]">
              {t(detail.typeBadgeKey)}
            </span>
            <span className="inline-flex items-center justify-center rounded-[50px] bg-[#ecedfa] px-4 py-[5px] font-manrope text-[14px] font-bold uppercase leading-6 tracking-[1.2px] text-[#4048cd] sm:text-[16px]">
              {t(detail.categoryBadgeKey)}
            </span>
          </div>
          <div className="flex w-full flex-col gap-4">
            <h2
              id="business-link-photo-title"
              className="w-full font-manrope text-[28px] font-extrabold leading-tight text-[#111827] sm:text-[36px]"
            >
              {t(detail.titleKey)}
            </h2>
            <p className="w-full font-manrope text-[16px] font-medium leading-7 text-[#3e3f40] sm:text-[20px] sm:leading-[30px]">
              {t(detail.descriptionKey)}
            </p>
          </div>
        </section>

        {/* Business link — Figma 345:1627 */}
        <section className="w-full rounded-[24px] border border-[#f3f4f6] bg-white p-5 shadow-[0px_8px_15px_rgba(0,0,0,0.04)] sm:p-[41px]">
          <div className="mb-4 flex items-center justify-between gap-3 sm:mb-6">
            <h3 className="font-manrope text-[16px] font-bold tracking-[-0.45px] text-[#111827] sm:text-[18px] sm:leading-7">
              {t('adminBusinessLink.detail.linkLabel')}
            </h3>
            <span className="text-[14px] font-medium leading-5 text-[#6b7280]">
              {t('adminBusinessLink.detail.autoGenerated')}
            </span>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div className="min-w-0 flex-1 truncate rounded-[12px] border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 text-[14px] text-[#374151] sm:text-[16px]">
              {detail.businessLink}
            </div>
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-[12px] bg-[#4048cd] px-5 py-2.5 text-[16px] font-medium text-white shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition hover:bg-[#343aa8]"
            >
              <img
                src={ADMIN_BUSINESS_LINK_ASSETS.copy}
                alt=""
                width={COPY_ICON_SIZE}
                height={COPY_ICON_SIZE}
                className="size-5"
              />
              {t('adminBusinessLink.detail.copyLink')}
            </button>
          </div>
        </section>
      </div>

      {/* Photographer */}
      <section className="flex items-center gap-3">
        <img
          src={detail.photographerAvatar}
          alt=""
          width={48}
          height={48}
          className="size-12 rounded-full object-cover"
        />
        <div>
          <p className="text-[13px] text-[#9ca3af]">{t('adminBusinessLink.detail.photographerLabel')}</p>
          <p className="text-[16px] font-semibold text-[#111827]">{t(detail.photographerKey)}</p>
        </div>
      </section>
    </div>
  );
});

AdminBusinessLinkDetailContent.displayName = 'AdminBusinessLinkDetailContent';

export default AdminBusinessLinkDetailContent;
