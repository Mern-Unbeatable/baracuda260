import React, { memo, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../config';
import {
  ADMIN_DETAIL_ASSETS,
  getAdminCompetitionDetailById,
} from './adminCompetitionDetailData';

const SignBadge = memo(({ slide, name }) => {
  const isBlue = slide.theme === 'blue';

  return (
    <div
      className={`absolute left-3 top-3 flex items-center gap-2 rounded-[20px] px-4 py-1 sm:left-6 sm:top-6 sm:px-5 sm:py-[5px] ${
        isBlue ? 'bg-[#4048cd]' : 'bg-[#ee1c25]'
      }`}
    >
      <span
        className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden ${
          isBlue ? 'size-[28px] sm:size-[35px]' : 'h-[18px] w-[20px] sm:h-[21px] sm:w-6'
        } ${slide.iconBoxed ? 'rounded-[4px] bg-[#4048cd]' : ''}`}
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
          className={`inline-flex size-[30px] items-center justify-center rounded-full bg-[#fde8e9] text-[18px] ${
            isBlue ? 'text-[#4048cd]' : 'text-[#ee1c25]'
          }`}
        >
          {slide.number}
        </span>
        <span
          className={`relative inline-flex size-[35px] items-center justify-center overflow-hidden ${
            isBlue
              ? slide.iconBoxed
                ? 'rounded-[4px] bg-[#4048cd]'
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
          className={`relative h-[90px] w-full overflow-hidden rounded-lg ${
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
              className="h-[21px] w-6 object-contain"
            />
          </span>
          <span className="truncate text-[24px] text-[#2b2b2b]">{name}</span>
        </span>
        <span
          className={`inline-flex size-[30px] shrink-0 items-center justify-center rounded-full bg-[#fde8e9] text-[20px] ${
            isBlue ? 'text-[#4048cd]' : 'text-[#ee1c25]'
          }`}
        >
          {slide.number}
        </span>
      </span>
      <span
        className={`relative block h-[120px] w-full overflow-hidden rounded-lg ${
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

  useEffect(() => {
    setActiveIndex(0);
  }, [detail.id]);

  const hasSlides = detail.slides.length > 0;
  const activeSlide = hasSlides
    ? detail.slides[activeIndex] || detail.slides[0]
    : detail.sign;
  const heroSrc = hasSlides ? activeSlide.hero : detail.hero;
  const isTwelve = detail.variant === 'twelve';
  const curveHeight = isTwelve
    ? 'h-10 sm:h-[72px] xl:h-[103px]'
    : 'h-8 sm:h-[52px]';

  return (
    <div className="mx-auto flex w-full max-w-[1536px] flex-col">
      <header className="flex flex-col gap-1">
        <p className="text-[13px] font-extrabold uppercase leading-[19px] tracking-[1.55px] text-[#7f8ba1]">
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
        </p>
        <h1 className="font-manrope pt-[13px] text-[36px] font-normal leading-[42px] tracking-[-1.68px] text-[#151e31]">
          {t('adminCompetitionDetail.title')}
        </h1>
        <p className="pt-[13px] text-[17px] leading-[25px] text-[#687186]">
          {t('adminCompetitionDetail.subtitle')}
        </p>
      </header>

      <div className="flex flex-col gap-8 py-10 sm:gap-9 sm:py-12 lg:gap-[35px] lg:py-[52px]">
        <section
          aria-label={t('adminCompetitionDetail.heroAria')}
          className="relative aspect-[1536/653] w-full overflow-hidden rounded-[16px] sm:rounded-[20px]"
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
                <div className="grid min-w-[1100px] grid-cols-12 gap-2 xl:min-w-0 xl:gap-3">
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
                <div className="grid min-w-[980px] grid-cols-6 gap-3 xl:min-w-0 xl:gap-5">
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

        <section className="flex flex-col gap-9">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-8">
              <span className="font-manrope inline-flex items-center justify-center rounded-full bg-[#ecedfa] px-4 py-[5px] text-[16px] font-bold leading-6 uppercase tracking-[1.2px] text-[#4048cd]">
                {t(detail.typeKey)}
              </span>
              <span className="font-manrope inline-flex items-center justify-center rounded-full bg-[#ecedfa] px-4 py-[5px] text-[16px] font-bold leading-6 uppercase tracking-[1.2px] text-[#4048cd]">
                {t(detail.categoryKey)}
              </span>
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="font-manrope text-[36px] font-extrabold leading-normal text-[#111827]">
                {t(detail.titleKey)}
              </h2>
              <p className="font-manrope text-[20px] font-medium leading-[30px] text-[#3e3f40]">
                {t(detail.descriptionKey)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-[21px]">
            <div className="flex flex-col items-center justify-center gap-[15px] rounded-2xl border border-black/[0.08] bg-[#f5f5f5] p-3 text-center">
              <p className="font-manrope w-full text-[14px] font-bold uppercase tracking-[1.2px] text-[#6b7280]">
                {t('adminCompetitionDetail.votesReceived')}
              </p>
              <p className="font-manrope w-full text-[20px] font-bold text-[#111827]">{detail.votes}</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-[15px] rounded-2xl border border-black/[0.08] bg-[#f5f5f5] p-3 text-center">
              <p className="font-manrope w-full text-[14px] font-bold uppercase tracking-[1.2px] text-[#6b7280]">
                {t('adminCompetitionDetail.viewsCounted')}
              </p>
              <p className="font-manrope w-full text-[20px] font-bold text-[#111827]">{detail.views}</p>
            </div>
          </div>

          <div className="w-full" aria-hidden="true">
            <img
              src={ADMIN_DETAIL_ASSETS.divider}
              alt=""
              className="h-px w-full object-cover"
            />
          </div>

          <div className="flex items-start gap-3">
            <img
              src={detail.photographerAvatar}
              alt=""
              width={57}
              height={57}
              className="size-[57px] shrink-0 rounded-full object-cover"
            />
            <div className="flex flex-col gap-1">
              <p className="font-manrope text-[16px] text-[#6b7280]">
                {t('adminCompetitionDetail.photographerLabel')}
              </p>
              <p className="font-manrope text-[20px] font-bold text-[#111827]">
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
