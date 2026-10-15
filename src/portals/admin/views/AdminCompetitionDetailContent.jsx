import { ArrowLeft } from 'lucide-react';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import GalleryDetailVideo from '@/components/data-display/GalleryDetailVideo/GalleryDetailVideo';
import MemberArtworkGlobalRankings from '@/components/data-display/MemberArtworkGlobalRankings/MemberArtworkGlobalRankings';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import {
  ADMIN_DETAIL_ASSETS,
  ADMIN_COMPETITION_VIDEO,
  ADMIN_COMPETITION_DETAILS,
  getAdminCompetitionDetailById,
} from '@/portals/admin/data/adminCompetitionDetailData';
import { ARTWORKS_QUERY_KEY, getArtworkDetailsApi } from '@/shared/api/artworks.api';
import { ROUTES } from '@/shared/config';

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
      {slide.icon ? (
        <span
          className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden ${
            isBlue ? 'size-7 sm:size-8.75' : 'h-4.5 w-5 sm:h-5.25 sm:w-6'
          } ${slide.iconBoxed ? 'rounded-sm bg-[#4048cd]' : ''}`}
        >
          <Image
            src={slide.icon}
            alt=""
            width={isBlue ? 35 : 24}
            height={isBlue ? 35 : 21}
            className={`object-contain ${
              slide.iconBoxed ? 'h-4 w-4 sm:h-5 sm:w-5' : 'h-full w-full'
            }`}
          />
        </span>
      ) : null}
      <span className="text-[16px] leading-none text-white sm:text-[20px]">
        {name}
      </span>
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
        {slide.icon ? (
          <span
            className={`relative inline-flex size-8.75 items-center justify-center overflow-hidden ${
              isBlue
                ? slide.iconBoxed
                  ? 'rounded-sm bg-[#4048cd]'
                  : ''
                : 'rounded bg-[#ee1c25] px-1.5 py-1'
            }`}
          >
            <Image
              src={slide.icon}
              alt=""
              width={35}
              height={35}
              className={`object-contain ${slide.iconBoxed || !isBlue ? 'h-5 w-5' : 'h-full w-full'}`}
            />
          </span>
        ) : null}
        <span className="max-w-full truncate text-center text-[12px] leading-none text-[#2b2b2b] sm:text-[14px] lg:text-[16px] xl:text-[18px]">
          {name}
        </span>
        <Button
          unstyled
          type="button"
          onClick={onSelect}
          aria-label={name}
          aria-pressed={active}
          className={`relative h-22.5 w-full overflow-hidden rounded-lg ${
            active
              ? 'border-[3px] border-[#ee1c25]'
              : 'border border-transparent'
          }`}
        >
          <Image
            src={slide.thumb}
            alt=""
            width={120}
            height={90}
            className="h-full w-full object-cover"
          />
        </Button>
      </div>
    );
  }

  return (
    <Button
      unstyled
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      aria-label={name}
      className="flex w-full flex-col gap-2.5 text-left"
    >
      <span className="flex w-full items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-2.5">
          {slide.icon ? (
            <span
              className={`inline-flex shrink-0 items-end rounded px-2.5 py-1 ${
                isBlue ? 'bg-[#4048cd]' : 'bg-[#ee1c25]'
              } ${slide.iconBoxed ? 'items-center px-1.5' : ''}`}
            >
              <Image
                src={slide.icon}
                alt=""
                width={24}
                height={21}
                className="h-5.25 w-6 object-contain"
              />
            </span>
          ) : null}
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
        <Image
          src={slide.thumb}
          alt=""
          width={240}
          height={120}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </span>
    </Button>
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
                <Image
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
                <Image
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
  const location = useLocation();
  const { id } = useParams();
  const mockDetail = getAdminCompetitionDetailById(id);

  const isMockId = Boolean(id && ADMIN_COMPETITION_DETAILS[id]);
  const { data: artwork, isLoading } = useQuery({
    queryKey: [...ARTWORKS_QUERY_KEY, id],
    queryFn: () => getArtworkDetailsApi(id),
    enabled: Boolean(id && !isMockId),
    staleTime: 60 * 1000,
  });

  const detail = useMemo(() => {
    if (!artwork) return mockDetail;

    const kind = artwork.kind || 'SINGLE';
    const isTwelve = kind === 'TWELVE';
    const isSix = kind === 'SIX';

    let slides = [];
    if (artwork.images && typeof artwork.images === 'object') {
      slides = Object.entries(artwork.images).map(([key, img], idx) => ({
        id: img.id || `${key}-${idx}`,
        number: idx + 1,
        nameKey: null,
        name: img.zodiacSign || key || `Photo ${idx + 1}`,
        thumb: img.thumbnailUrl || img.url,
        hero: img.url,
        theme: idx % 2 === 0 ? 'red' : 'blue',
        icon: null,
      }));
    } else if (Array.isArray(artwork.media) && artwork.media.length > 0) {
      slides = artwork.media.map((med, idx) => ({
        id: med.id || `media-${idx}`,
        number: idx + 1,
        nameKey: null,
        name: med.zodiacSign || `Photo ${idx + 1}`,
        thumb: med.thumbnailUrl || med.url,
        hero: med.url,
        theme: idx % 2 === 0 ? 'red' : 'blue',
        icon: null,
      }));
    }

    const heroImage =
      artwork.featuredImage ||
      slides[0]?.hero ||
      mockDetail.hero;

    return {
      id: artwork.id,
      variant: isTwelve ? 'twelve' : isSix ? 'six-red' : 'single',
      type:
        kind === 'TWELVE'
          ? 'Zodiac 12'
          : kind === 'SIX'
            ? '6-Photo Story'
            : 'Single Photo',
      typeKey: null,
      category: artwork.categoryName || artwork.category || 'Deep Sky',
      categoryKey: null,
      title: artwork.title || 'Competition Submission',
      titleKey: null,
      description: artwork.story || artwork.description || '',
      descriptionKey: null,
      votes: String(artwork.votesCount ?? artwork.votes ?? 0),
      views: String(artwork.viewsCount ?? artwork.views ?? 0),
      points: artwork.points != null ? String(artwork.points) : null,
      rank: artwork.rank ?? artwork.place ?? null,
      prizeMoney: artwork.prizeMoney ?? artwork.prize ?? null,
      camera: artwork.camera || null,
      resolution: artwork.resolution || null,
      format: artwork.format || null,
      quality: artwork.quality || null,
      zodiacSign: artwork.zodiacSign || null,
      hero: heroImage,
      videoSrc: artwork.video?.url || null,
      videoPoster: artwork.video?.thumbnailUrl || heroImage,
      photographerName: artwork.user?.name || 'Photographer',
      photographerCountry: artwork.user?.country || null,
      photographerKey: null,
      photographerAvatar: artwork.user?.avatar || mockDetail.photographerAvatar,
      slides,
      curve: isTwelve
        ? ADMIN_DETAIL_ASSETS.curves.twelve
        : isSix
          ? ADMIN_DETAIL_ASSETS.curves.red
          : null,
      rankings: mockDetail.rankings,
      showingCount: mockDetail.showingCount,
      showingTotal: mockDetail.showingTotal,
      comments: mockDetail.comments,
      sign: slides[0] || null,
    };
  }, [artwork, mockDetail]);

  const [activeIndex, setActiveIndex] = useState(0);
  const slideCount = detail.slides?.length || 0;

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

  const goPrev = () =>
    setActiveIndex((index) => (index === 0 ? slideCount - 1 : index - 1));
  const goNext = () =>
    setActiveIndex((index) => (index === slideCount - 1 ? 0 : index + 1));

  const backLink = location.pathname.includes('/my-competitions')
    ? ROUTES.ADMIN_MY_COMPETITIONS
    : ROUTES.ADMIN_WINNERS;

  return (
    <div className="mx-auto flex w-full max-w-[1580px] flex-col gap-8 sm:gap-10">
      <Link
        to={backLink}
        className="inline-flex w-fit items-center gap-2 text-[15px] font-medium leading-6 text-[#707070] transition hover:text-[#ee1c25] sm:text-[16px]"
      >
        <ArrowLeft size={22} aria-hidden="true" className="shrink-0" />
        {t('adminCompetitionDetail.back')}
      </Link>

      {isLoading && !artwork ? (
        <div className="flex flex-col items-center justify-center gap-2 py-24 text-center text-[#6b7280]">
          <div className="size-8 animate-spin rounded-full border-3 border-[#4048cd] border-t-transparent" />
          <span className="text-sm font-medium">Loading competition details...</span>
        </div>
      ) : (
        <>
          <section
            aria-label={t('adminCompetitionDetail.heroAria')}
            className="relative aspect-1536/653 w-full overflow-hidden rounded-2xl sm:rounded-[20px]"
          >
            <Image
              src={heroSrc}
              alt=""
              width={1536}
              height={653}
              className="absolute inset-0 h-full w-full object-cover"
            />
            {activeSlide ? (
              <SignBadge
                slide={activeSlide}
                name={activeSlide.name || (activeSlide.nameKey ? t(activeSlide.nameKey) : '')}
              />
            ) : null}

            {hasSlides ? (
              <>
                <Button
                  unstyled
                  type="button"
                  onClick={goPrev}
                  aria-label={t('adminCompetitionDetail.previousPhoto')}
                  className="absolute left-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 backdrop-blur-sm sm:left-6 sm:size-12"
                >
                  <Image
                    src={ADMIN_DETAIL_ASSETS.arrow}
                    alt=""
                    width={16}
                    height={32}
                    className="h-7 w-3.5 rotate-180 object-contain"
                  />
                </Button>
                <Button
                  unstyled
                  type="button"
                  onClick={goNext}
                  aria-label={t('adminCompetitionDetail.nextPhoto')}
                  className="absolute right-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 backdrop-blur-sm sm:right-6 sm:size-12"
                >
                  <Image
                    src={ADMIN_DETAIL_ASSETS.arrow}
                    alt=""
                    width={16}
                    height={32}
                    className="h-7 w-3.5 object-contain"
                  />
                </Button>
              </>
            ) : null}
          </section>

          {hasSlides ? (
            <>
              {detail.curve ? (
                <div
                  className={`relative w-full overflow-hidden ${curveHeight}`}
                  aria-hidden="true"
                >
                  <Image
                    src={detail.curve}
                    alt=""
                    className={`h-full w-full object-top ${
                      isTwelve ? 'object-contain' : 'object-fill'
                    }`}
                  />
                </div>
              ) : null}

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
                        name={slide.name || (slide.nameKey ? t(slide.nameKey) : '')}
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
                        name={slide.name || (slide.nameKey ? t(slide.nameKey) : '')}
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

          {detail.videoSrc ? (
            <GalleryDetailVideo
              poster={detail.videoPoster || heroSrc}
              src={detail.videoSrc}
              title={detail.title || (detail.titleKey ? t(detail.titleKey) : '')}
            />
          ) : null}

          <section className="flex w-full flex-col gap-8 sm:gap-9">
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <span className="rounded-full bg-violet-100 px-4 py-1.5 text-[13px] font-bold uppercase tracking-wider text-indigo-700 sm:text-[14px]">
                  {detail.type || (detail.typeKey ? t(detail.typeKey) : 'Single Photo')}
                </span>
                <span className="rounded-full bg-violet-100 px-4 py-1.5 text-[13px] font-bold uppercase tracking-wider text-indigo-700 sm:text-[14px]">
                  {detail.category || (detail.categoryKey ? t(detail.categoryKey) : 'Deep Sky')}
                </span>
              </div>

              <div className="flex flex-col gap-4">
                <h1 className="font-manrope text-[32px] font-semibold leading-tight text-[#111827] sm:text-[36px]">
                  {detail.title || (detail.titleKey ? t(detail.titleKey) : '')}
                </h1>
                <p className="font-manrope text-[18px] font-medium leading-8 text-neutral-700 sm:text-[20px]">
                  {detail.description || (detail.descriptionKey ? t(detail.descriptionKey) : '')}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
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
                {detail.points != null ? (
                  <article className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-black/8 bg-[#f5f5f5] p-4 text-center sm:p-5">
                    <p className="text-[12px] font-semibold uppercase tracking-[1.2px] text-[#6b7280] sm:text-[13px]">
                      POINTS EARNED
                    </p>
                    <p className="text-[28px] font-bold leading-none text-[#4048cd] sm:text-[32px]">
                      {detail.points}
                    </p>
                  </article>
                ) : null}
                {detail.rank != null || detail.prizeMoney != null ? (
                  <article className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-black/8 bg-[#f5f5f5] p-4 text-center sm:p-5">
                    <p className="text-[12px] font-semibold uppercase tracking-[1.2px] text-[#6b7280] sm:text-[13px]">
                      {detail.prizeMoney ? 'PRIZE AWARD' : 'FINAL RANK'}
                    </p>
                    <p className="text-[28px] font-bold leading-none text-[#ee1c25] sm:text-[32px]">
                      {detail.prizeMoney ? `$${detail.prizeMoney}` : `#${detail.rank}`}
                    </p>
                  </article>
                ) : null}
              </div>

              {(detail.camera || detail.resolution || detail.format || detail.quality || detail.zodiacSign) ? (
                <div className="flex flex-wrap items-center gap-2.5 rounded-2xl border border-[#ececf0] bg-[#fafafa] p-4 sm:p-5">
                  <span className="text-[12px] font-bold uppercase tracking-wider text-[#6b7280]">
                    Equipment & Specs:
                  </span>
                  {detail.camera ? (
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-black/5 bg-white px-3 py-1 text-[13px] font-medium text-[#111827]">
                      📷 {detail.camera}
                    </span>
                  ) : null}
                  {detail.resolution ? (
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-black/5 bg-white px-3 py-1 text-[13px] font-medium text-[#111827]">
                      📐 {detail.resolution}
                    </span>
                  ) : null}
                  {detail.format ? (
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-black/5 bg-white px-3 py-1 text-[13px] font-medium text-[#111827]">
                      🎞️ {detail.format}
                    </span>
                  ) : null}
                  {detail.quality ? (
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-black/5 bg-white px-3 py-1 text-[13px] font-medium text-[#111827]">
                      ✨ {detail.quality}
                    </span>
                  ) : null}
                  {detail.zodiacSign ? (
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-black/5 bg-white px-3 py-1 text-[13px] font-medium text-[#111827]">
                      ♈ {detail.zodiacSign}
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-[#ececf0] bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div className="flex items-center gap-3">
                <Image
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
                  <div className="flex items-center gap-2">
                    <p className="text-[18px] font-semibold leading-6 text-[#111827] sm:text-[20px]">
                      {detail.photographerName || (detail.photographerKey ? t(detail.photographerKey) : 'Photographer')}
                    </p>
                    {detail.photographerCountry ? (
                      <span className="rounded-md bg-[#f3f4f6] px-2 py-0.5 text-[12px] font-medium text-[#4b5563]">
                        {detail.photographerCountry}
                      </span>
                    ) : null}
                  </div>
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
        </>
      )}
    </div>
  );
});

AdminCompetitionDetailContent.displayName = 'AdminCompetitionDetailContent';

export default AdminCompetitionDetailContent;
