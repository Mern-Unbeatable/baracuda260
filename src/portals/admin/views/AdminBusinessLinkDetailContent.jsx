import { useTranslation } from 'react-i18next';
import React, { memo } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ROUTES } from '@/shared/config';
import {
  ADMIN_BUSINESS_LINK_ASSETS,
  ARROW_ICON_SIZE,
} from '@/portals/admin/data/adminBusinessLinkData';
import useAdminBusinessLinkDetail from '@/portals/admin/hooks/useAdminBusinessLinkDetail';

/**
 * @param {{
 *   slide: object,
 *   active: boolean,
 *   onSelect: () => void,
 * }} props
 */
const ZodiacThumb = memo(({ slide, active, onSelect }) => {
  const { t } = useTranslation();
  const isBlue = slide.theme === 'blue';
  const numberColor = isBlue ? 'text-[#4048cd]' : 'text-[#ee1c25]';
  const borderClass = active
    ? isBlue
      ? 'border-[#4048cd]'
      : 'border-[#ee1c25]'
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
      className="flex w-[72px] min-w-[72px] cursor-pointer flex-col items-center gap-[8px] sm:w-auto sm:min-w-0 sm:flex-1"
    >
      <span
        className={`inline-flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-[#fde8e9] text-[16px] leading-none sm:text-[18px] ${numberColor}`}
      >
        {slide.number}
      </span>

      {/* Figma: red/blue badge with white glyph — white SVGs need the colored box */}
      <span
        className={`relative inline-flex size-[35px] shrink-0 items-center justify-center overflow-hidden ${
          isBlue
            ? slide.iconBoxed
              ? 'rounded-[4px] bg-[#4048cd]'
              : ''
            : 'rounded-[4px] bg-[#ee1c25] px-2.5 py-1'
        }`}
      >
        <img
          src={slide.icon}
          alt=""
          width={35}
          height={35}
          className={`object-contain ${
            slide.iconBoxed || !isBlue ? 'h-5 w-5' : 'h-full w-full'
          }`}
        />
      </span>

      <span className="max-w-full truncate text-center text-[12px] leading-none text-[#2b2b2b] capitalize sm:text-[14px] lg:text-[16px] xl:text-[20px]">
        {slide.sign}
      </span>

      <span
        className={`mt-1 block size-[64px] overflow-hidden rounded-[8px] border-[3px] sm:size-[80px] lg:h-[100px] lg:w-full lg:max-w-[112px] ${borderClass}`}
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

      {/* Story + link — same text scale as /admin/my-competitions/zodiac */}
      <div className="flex w-full flex-col gap-[36px]">
        <div className="flex w-full flex-col gap-8">
          <section
            className="inline-flex w-full flex-col items-start justify-start gap-4"
            aria-labelledby="business-link-photo-title"
          >
            <div className="inline-flex flex-wrap items-start justify-start gap-4 sm:gap-8">
              <div className="flex items-center justify-center gap-2.5 rounded-[50px] bg-violet-100 px-4 py-[5px]">
                <div className="font-['Manrope'] text-base font-bold uppercase leading-6 tracking-wider text-indigo-700">
                  {t(detail.typeBadgeKey)}
                </div>
              </div>
              <div className="flex items-center justify-center gap-2.5 rounded-[50px] bg-violet-100 px-4 py-[5px]">
                <div className="font-['Manrope'] text-base font-bold uppercase leading-6 tracking-wider text-indigo-700">
                  {t(detail.categoryBadgeKey)}
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col items-start justify-start gap-4 self-stretch">
              <h2
                id="business-link-photo-title"
                className="w-full self-stretch font-['Manrope'] text-4xl font-extrabold text-gray-900"
              >
                {t(detail.titleKey)}
              </h2>
              <p className="w-full self-stretch font-['Manrope'] text-xl font-medium leading-8 text-neutral-700">
                {t(detail.descriptionKey)}
              </p>
            </div>
          </section>

          {/* Link generator card — Figma 345:1627 */}
          <section className="flex w-full flex-col gap-6 rounded-[24px] border border-solid border-[#f3f4f6] bg-white p-[41px] shadow-[0px_8px_15px_rgba(0,0,0,0.04)] max-sm:p-5">
            <div className="flex w-full items-center justify-between gap-3">
              <h3 className="font-manrope text-[18px] font-bold leading-7 tracking-[-0.45px] text-[#111827]">
                {t('adminBusinessLink.detail.linkLabel')}
              </h3>
              <span className="shrink-0 text-[14px] font-medium leading-5 text-[#6b7280]">
                {t('adminBusinessLink.detail.autoGenerated')}
              </span>
            </div>

            <div className="w-full rounded-[12px] border border-dashed border-[#d1d5db] bg-[#f9fafb] px-[25px] pb-[17px] pt-[19px] max-sm:px-4">
              <p className="break-all font-mono text-[16px] leading-6 tracking-[-0.4px] text-[#1f2937] sm:truncate sm:whitespace-nowrap">
                {detail.businessLink}
              </p>
            </div>

            <div className="flex w-full items-center pt-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex cursor-pointer items-center gap-2 rounded-[12px] bg-[#4048cd] px-5 py-2.5 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition hover:bg-[#343aa8]"
              >
                <img
                  src={ADMIN_BUSINESS_LINK_ASSETS.copy}
                  alt=""
                  width={18}
                  height={18}
                  className="size-[18px] shrink-0"
                />
                <span className="text-[16px] font-semibold leading-6 text-white">
                  {t('adminBusinessLink.detail.copyLink')}
                </span>
              </button>
            </div>
          </section>

          <div className="h-0 w-full" aria-hidden="true">
            <img
              src={ADMIN_BUSINESS_LINK_ASSETS.divider}
              alt=""
              className="block h-px w-full max-w-none"
            />
          </div>
        </div>

        {/* Photographer — same meta text sizes as zodiac competition detail */}
        <section className="flex items-start gap-3">
          <img
            src={detail.photographerAvatar}
            alt=""
            width={57}
            height={57}
            className="size-[57px] shrink-0 rounded-full object-cover"
          />
          <div className="flex w-[139px] flex-col gap-1">
            <p className="admin-detail-meta__photographer-label w-full">
              {t('adminBusinessLink.detail.photographerLabel')}
            </p>
            <p className="admin-detail-meta__photographer-name w-full">
              {t(detail.photographerKey)}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
});

AdminBusinessLinkDetailContent.displayName = 'AdminBusinessLinkDetailContent';

export default AdminBusinessLinkDetailContent;
