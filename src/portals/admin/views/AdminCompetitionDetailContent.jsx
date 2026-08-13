import React, { memo, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/shared/config';
import {
  ADMIN_DETAIL_ASSETS,
  getAdminCompetitionDetailById,
} from '@/portals/admin/data/adminCompetitionDetailData';
import GalleryDetailVideo from '@/portals/public/gallery/detail/components/GalleryDetailVideo';
import MemberArtworkGlobalRankings from '@/portals/member/components/member-artwork/MemberArtworkGlobalRankings';

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
      <span className="text-[16px] leading-none text-white sm:text-[20px]">{name}</span>
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
          className={`inline-flex size-7.5 items-center justify-center rounded-full bg-[#fde8e9] text-[16px] sm:text-[18px] ${
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
            className={`object-contain ${slide.iconBoxed || !isBlue ? 'h-5 w-5' : 'h-full w-full'}`}
          />
        </span>
        <span className="max-w-full truncate text-center text-[12px] leading-none text-[#2b2b2b] sm:text-[14px] lg:text-[16px] xl:text-[18px]">
          {name}
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
          <span className="truncate text-[18px] text-[#2b2b2b] sm:text-[22px] lg:text-[24px]">
            {name}
          </span>
        </span>
        <span
          className={`inline-flex size-7.5 shrink-0 items-center justify-center rounded-full bg-[#fde8e9] text-[18px] sm:text-[20px] ${
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

const DetailComments = memo(({ comments }) => {
  const { t } = useTranslation();

  return (
    <section className="overflow-hidden rounded-[20px] bg-[#f8fafc] p-4 sm:rounded-3xl sm:p-6">
      <h2 className="text-[20px] font-semibold leading-8 text-[#161c27] sm:text-[24px]">
        {t('adminCompetitionDetail.commentsTitle')}
      </h2>

      <ul className="mt-5 flex flex-col sm:mt-6">
        {comments.map((item) => (
          <li
            key={item.id}
            className="border-b border-[#c8c8c8] pb-4 pt-0 not-first:pt-4 last:border-b-0"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={ADMIN_DETAIL_ASSETS.commentAvatar}
                  alt=""
                  width={48}
                  height={48}
                  className="size-12 rounded-full object-cover"
                />
                <p className="text-[14px] font-medium leading-5 text-[#191c1f]">
                  {t(item.nameKey)}
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#4048cd] px-2 py-0.5 text-[13px] text-white sm:text-[14px]">
                <img
                  src={ADMIN_DETAIL_ASSETS.verified}
                  alt=""
                  width={16}
                  height={16}
                  className="size-4 object-contain"
                />
                {t('adminCompetitionDetail.verified')}
              </span>
            </div>
            <p className="mt-2.5 text-[14px] leading-5 text-[#475156] sm:text-[15px]">
              {t(item.textKey)}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
});

DetailComments.displayName = 'DetailComments';

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
  const curveHeight = isTwelve ? 'h-10 sm:h-[72px] xl:h-[103px]' : 'h-8 sm:h-[52px]';

  const goPrev = () => setActiveIndex((index) => (index === 0 ? slideCount - 1 : index - 1));
  const goNext = () => setActiveIndex((index) => (index === slideCount - 1 ? 0 : index + 1));

  return (
    <div className="mx-auto flex w-full max-w-[1580px] flex-col gap-8 sm:gap-10">
      <Link
        to={ROUTES.ADMIN_MY_COMPETITIONS}
        className="inline-flex w-fit items-center gap-2 text-[15px] font-medium leading-6 text-[#707070] transition hover:text-[#ee1c25] sm:text-[16px]"
      >
        <ArrowLeft size={22} aria-hidden="true" className="shrink-0" />
        {t('adminCompetitionDetail.back')}
      </Link>

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

        {hasSlides ? (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label={t('adminCompetitionDetail.previousPhoto')}
              className="absolute left-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 backdrop-blur-sm sm:left-6 sm:size-12"
            >
              <img
                src={ADMIN_DETAIL_ASSETS.arrow}
                alt=""
                width={16}
                height={32}
                className="h-7 w-3.5 rotate-180 object-contain"
              />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label={t('adminCompetitionDetail.nextPhoto')}
              className="absolute right-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 backdrop-blur-sm sm:right-6 sm:size-12"
            >
              <img
                src={ADMIN_DETAIL_ASSETS.arrow}
                alt=""
                width={16}
                height={32}
                className="h-7 w-3.5 object-contain"
              />
            </button>
          </>
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
            className="w-full overflow-x-auto pb-2"
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

      <GalleryDetailVideo
        poster={detail.videoPoster || heroSrc}
        src={detail.videoSrc}
        title={t(detail.titleKey)}
      />

      <section className="flex w-full flex-col gap-8 sm:gap-9">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <span className="rounded-full bg-violet-100 px-4 py-1.5 text-[13px] font-bold uppercase tracking-wider text-indigo-700 sm:text-[14px]">
              {t(detail.typeKey)}
            </span>
            <span className="rounded-full bg-violet-100 px-4 py-1.5 text-[13px] font-bold uppercase tracking-wider text-indigo-700 sm:text-[14px]">
              {t(detail.categoryKey)}
            </span>
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="font-manrope text-[32px] font-semibold leading-tight text-[#111827] sm:text-[36px]">
              {t(detail.titleKey)}
            </h1>
            <p className="font-manrope text-[18px] font-medium leading-8 text-neutral-700 sm:text-[20px]">
              {t(detail.descriptionKey)}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            <article className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-black/8 bg-[#f5f5f5] p-4 text-center sm:p-5">
              <p className="text-[12px] font-semibold uppercase tracking-[1.2px] text-[#6b7280] sm:text-[13px]">
                {t('adminCompetitionDetail.votesReceived')}
              </p>
              <p className="text-[28px] font-bold leading-none text-[#111827] sm:text-[32px]">
                {detail.votes}
              </p>
            </article>
            <article className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-black/8 bg-[#f5f5f5] p-4 text-center sm:p-5">
              <p className="text-[12px] font-semibold uppercase tracking-[1.2px] text-[#6b7280] sm:text-[13px]">
                {t('adminCompetitionDetail.viewsCounted')}
              </p>
              <p className="text-[28px] font-bold leading-none text-[#111827] sm:text-[32px]">
                {detail.views}
              </p>
            </article>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-[#ececf0] bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-center gap-3">
            <img
              src={detail.photographerAvatar}
              alt=""
              width={57}
              height={57}
              className="size-14 shrink-0 rounded-full object-cover"
            />
            <div>
              <p className="text-[14px] leading-5 text-[#6b7280] sm:text-[15px]">
                {t('adminCompetitionDetail.photographerLabel')}
              </p>
              <p className="text-[18px] font-semibold leading-6 text-[#111827] sm:text-[20px]">
                {t(detail.photographerKey)}
              </p>
            </div>
          </div>
          <Link
            to={ROUTES.PHOTOGRAPHER_PROFILE}
            className="inline-flex items-center justify-center rounded-xl bg-[#4048cd] px-5 py-3 text-[14px] font-semibold text-white transition hover:bg-[#333bb0] sm:text-[15px]"
          >
            {t('adminCompetitionDetail.viewProfile')}
          </Link>
        </div>
      </section>

      <MemberArtworkGlobalRankings
        rankings={detail.rankings}
        showingCount={detail.showingCount}
        showingTotal={detail.showingTotal}
      />

      <DetailComments comments={detail.comments} />
    </div>
  );
});

AdminCompetitionDetailContent.displayName = 'AdminCompetitionDetailContent';

export default AdminCompetitionDetailContent;
