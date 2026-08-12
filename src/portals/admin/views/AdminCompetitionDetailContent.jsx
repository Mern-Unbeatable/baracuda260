import React, { memo, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/shared/config';
import {
  ADMIN_DETAIL_ASSETS,
  getAdminCompetitionDetailById,
} from '@/portals/admin/data/adminCompetitionDetailData';
import AdminPageHeader from '@/portals/admin/components/ui/AdminPageHeader';

/** Auto-advance interval for multi-photo story strip (ms). */
const ADMIN_DETAIL_SLIDE_MS = 6000;
const SignBadge = memo(({ slide, name }) => {
  const isBlue = slide.theme === 'blue';

  return (
    <div
      className={`absolute left-3 top-3 flex items-center gap-2 rounded-[20px] px-4 py-1 sm:left-6 sm:top-6 sm:px-5 sm:py-1.25 ${
        isBlue ? 'bg-[#4048cd]' : 'bg-[#ee1c25]'
      }`}
    >
      <span
        className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden ${
          isBlue ? 'size-7 sm:size-8.75' : 'h-4.5 w-5 sm:h-5.25 sm:w-6'
        } ${slide.iconBoxed ? 'rounded-sm bg-[#4048cd]' : ''}`}
      >
        <img
          src={slide.icon}
          alt=""
          width={isBlue ? 35 : 24}
          height={isBlue ? 35 : 21}
          className={`object-contain ${
            slide.iconBoxed ? 'h-4 w-4 sm:h-5 sm:w-5' : 'h-full w-full'
          }`}
        />
      </span>
      <span className="text-[20px] leading-none text-white">{name}</span>
    </div>
  );
});

SignBadge.displayName = 'SignBadge';

const StoryThumb = memo(({ slide, active, onSelect, name, variant }) => {
  const isBlue = slide.theme === 'blue';
  const isTwelve = variant === 'twelve';

  if (isTwelve) {
    return (
      <div className="flex flex-col items-center gap-2">
        <span
          className={`inline-flex size-7.5 items-center justify-center rounded-full bg-[#fde8e9] text-[18px] ${
            isBlue ? 'text-[#4048cd]' : 'text-[#ee1c25]'
          }`}
        >
          {slide.number}
        </span>
        <span
          className={`relative inline-flex size-8.75 items-center justify-center overflow-hidden ${
            isBlue
              ? slide.iconBoxed
                ? 'rounded-sm bg-[#4048cd]'
                : ''
              : 'rounded bg-[#ee1c25] px-1.5 py-1'
          }`}
        >
          <img
            src={slide.icon}
            alt=""
            width={35}
            height={35}
            className={`object-contain ${
              slide.iconBoxed || !isBlue
                ? 'h-5 w-5'
                : 'h-full w-full'
            }`}
          />
        </span>
        <button
          type="button"
          onClick={onSelect}
          aria-label={name}
          aria-pressed={active}
          className={`relative h-22.5 w-full overflow-hidden rounded-lg ${
            active ? 'border-[3px] border-[#ee1c25]' : 'border border-transparent'
          }`}
        >
          <img
            src={slide.thumb}
            alt=""
            width={120}
            height={90}
            className="h-full w-full object-cover"
          />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      aria-label={name}
      className="flex w-full flex-col gap-2.5 text-left"
    >
      <span className="flex w-full items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-2.5">
          <span
            className={`inline-flex shrink-0 items-end rounded px-2.5 py-1 ${
              isBlue ? 'bg-[#4048cd]' : 'bg-[#ee1c25]'
            } ${slide.iconBoxed ? 'items-center px-1.5' : ''}`}
          >
            <img
              src={slide.icon}
              alt=""
              width={24}
              height={21}
              className="h-5.25 w-6 object-contain"
            />
          </span>
          <span className="truncate text-[24px] text-[#2b2b2b]">{name}</span>
        </span>
        <span
          className={`inline-flex size-7.5 shrink-0 items-center justify-center rounded-full bg-[#fde8e9] text-[20px] ${
            isBlue ? 'text-[#4048cd]' : 'text-[#ee1c25]'
          }`}
        >
          {slide.number}
        </span>
      </span>
      <span
        className={`relative block h-30 w-full overflow-hidden rounded-lg ${
          active ? 'border-[3px] border-[#ee1c25]' : 'border border-transparent'
        }`}
      >
        <img
          src={slide.thumb}
          alt=""
          width={240}
          height={120}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </span>
    </button>
  );
});

StoryThumb.displayName = 'StoryThumb';

/**
 * Admin competition photo details — Figma nodes 339:1796 / 339:1936 / 339:2155 / 339:2375.
 */
const AdminCompetitionDetailContent = memo(() => {
  const { t } = useTranslation();
  const { id } = useParams();
  const detail = getAdminCompetitionDetailById(id);
  const [activeIndex, setActiveIndex] = useState(0);
  const slideCount = detail.slides.length;

  useEffect(() => {
    setActiveIndex(0);
  }, [detail.id]);

  useEffect(() => {
    if (slideCount <= 1) return undefined;

    const timerId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slideCount);
    }, ADMIN_DETAIL_SLIDE_MS);

    return () => window.clearInterval(timerId);
  }, [slideCount, detail.id]);

  const hasSlides = slideCount > 0;
  const activeSlide = hasSlides
    ? detail.slides[activeIndex] || detail.slides[0]
    : detail.sign;
  const heroSrc = hasSlides ? activeSlide.hero : detail.hero;
  const isTwelve = detail.variant === 'twelve';
  const curveHeight = isTwelve
    ? 'h-10 sm:h-[72px] xl:h-[103px]'
    : 'h-8 sm:h-[52px]';

  return (
    <div className="mx-auto flex w-full max-w-384 flex-col">
      <AdminPageHeader
        eyebrow={
          <>
            <Link
              to={ROUTES.ADMIN_MY_COMPETITIONS}
              className="transition hover:text-[#ee1c25]"
            >
              {t('adminCompetitionDetail.breadcrumb.competitions')}
            </Link>
            <span aria-hidden="true">{' > '}</span>
            <span className="font-bold text-[#2d3392]">
              {t('adminCompetitionDetail.breadcrumb.details')}
            </span>
          </>
        }
        title={t('adminCompetitionDetail.title')}
        description={t('adminCompetitionDetail.subtitle')}
      />

      <div className="flex flex-col gap-8 py-10 sm:gap-9 sm:py-12 lg:gap-8.75 lg:py-13">
        <section
          aria-label={t('adminCompetitionDetail.heroAria')}
          className="relative aspect-1536/653 w-full overflow-hidden rounded-2xl sm:rounded-[20px]"
        >
          <img
            src={heroSrc}
            alt=""
            width={1536}
            height={653}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {activeSlide ? (
            <SignBadge slide={activeSlide} name={t(activeSlide.nameKey)} />
          ) : null}
        </section>

        {hasSlides ? (
          <>
            <div className={`relative w-full overflow-hidden ${curveHeight}`} aria-hidden="true">
              <img
                src={detail.curve}
                alt=""
                className={`h-full w-full object-top ${
                  isTwelve ? 'object-contain' : 'object-fill'
                }`}
              />
            </div>

            <section
              aria-label={t('adminCompetitionDetail.slidesAria')}
              className={
                isTwelve
                  ? 'w-full overflow-x-auto pb-2'
                  : 'w-full overflow-x-auto pb-2'
              }
            >
              {isTwelve ? (
                <div className="grid min-w-275 grid-cols-12 gap-2 xl:min-w-0 xl:gap-3">
                  {detail.slides.map((slide, index) => (
                    <StoryThumb
                      key={slide.id}
                      slide={slide}
                      name={t(slide.nameKey)}
                      active={index === activeIndex}
                      onSelect={() => setActiveIndex(index)}
                      variant={detail.variant}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid min-w-245 grid-cols-6 gap-3 xl:min-w-0 xl:gap-5">
                  {detail.slides.map((slide, index) => (
                    <StoryThumb
                      key={slide.id}
                      slide={slide}
                      name={t(slide.nameKey)}
                      active={index === activeIndex}
                      onSelect={() => setActiveIndex(index)}
                      variant={detail.variant}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        ) : null}

        {/* Figma export — tags + title + description (exact text sizes) */}
        <section className="flex w-full flex-col gap-9">
          <div className="flex w-full flex-col gap-8">
            <div className="inline-flex w-full flex-col items-start justify-start gap-4">
              <div className="inline-flex items-start justify-start gap-8">
                <div className="flex items-center justify-center gap-2.5 rounded-[50px] bg-violet-100 px-4 py-1.25">
                  <div className="font-['Manrope'] text-base font-bold uppercase leading-6 tracking-wider text-indigo-700">
                    {t(detail.typeKey)}
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2.5 rounded-[50px] bg-violet-100 px-4 py-1.25">
                  <div className="font-['Manrope'] text-base font-bold uppercase leading-6 tracking-wider text-indigo-700">
                    {t(detail.categoryKey)}
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-col items-start justify-start gap-4 self-stretch">
                <h2 className="w-full self-stretch font-['Manrope'] text-4xl font-extrabold text-gray-900">
                  {t(detail.titleKey)}
                </h2>
                <p className="w-full self-stretch font-['Manrope'] text-xl font-medium leading-8 text-neutral-700">
                  {t(detail.descriptionKey)}
                </p>
              </div>
            </div>

            <div className="flex w-full flex-col items-start justify-center">
              <div className="flex w-full items-center gap-5.25">
                <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-3.75 rounded-2xl border border-[rgba(0,0,0,0.08)] bg-[#f5f5f5] p-3 text-center">
                  <p className="admin-detail-meta__stat-label w-full">
                    {t('adminCompetitionDetail.votesReceived')}
                  </p>
                  <p className="admin-detail-meta__stat-value w-full">{detail.votes}</p>
                </div>
                <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-3.75 rounded-2xl border border-[rgba(0,0,0,0.08)] bg-[#f5f5f5] p-3 text-center">
                  <p className="admin-detail-meta__stat-label w-full">
                    {t('adminCompetitionDetail.viewsCounted')}
                  </p>
                  <p className="admin-detail-meta__stat-value w-full">{detail.views}</p>
                </div>
              </div>
            </div>

            <div className="h-0 w-full" aria-hidden="true">
              <img
                src={ADMIN_DETAIL_ASSETS.divider}
                alt=""
                className="block h-px w-full max-w-none"
              />
            </div>
          </div>

          <div className="flex items-start gap-3">
            <img
              src={detail.photographerAvatar}
              alt=""
              width={57}
              height={57}
              className="size-14.25 shrink-0 rounded-full object-cover"
            />
            <div className="flex w-34.75 flex-col gap-1">
              <p className="admin-detail-meta__photographer-label w-full">
                {t('adminCompetitionDetail.photographerLabel')}
              </p>
              <p className="admin-detail-meta__photographer-name w-full">
                {t(detail.photographerKey)}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
});

AdminCompetitionDetailContent.displayName = 'AdminCompetitionDetailContent';

export default AdminCompetitionDetailContent;
