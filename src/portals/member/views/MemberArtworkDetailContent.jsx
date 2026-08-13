import React, { memo, useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/shared/config';
import GalleryDetailVideo from '@/portals/public/gallery/detail/components/GalleryDetailVideo';
import {
  GALLERY_DETAIL_ASSETS,
  GALLERY_DETAIL_COMMENTS,
  GALLERY_DETAIL_SLIDE_MS,
  GALLERY_DETAIL_VARIANTS,
  resolveGalleryDetailMedia,
  isBlueSlide,
} from '@/portals/public/gallery/detail/galleryDetailShared';
import {
  SignBadge,
  SixStoryStrip,
  TwelveStoryStrip,
} from '@/portals/public/gallery/detail/galleryDetailStrips';
import { ImgIcon } from '@/shared/site-chrome';
import MemberArtworkGlobalRankings from '@/portals/member/components/member-artwork/MemberArtworkGlobalRankings';
import { getMyArtworkDetailById } from '@/portals/member/data/myArtworkDetailData';

const DETAIL_COMMENTS = [
  ...GALLERY_DETAIL_COMMENTS,
  ...GALLERY_DETAIL_COMMENTS,
];

const SHOWCASE_BADGE_KEYS = {
  'Single Photo': 'common.badges.singlePhoto',
  '6 Photos Story': 'common.badges.sixPhotosStory',
  '12 photos - full Zodiac Story': 'common.badges.twelveZodiacFull',
};

const MemberArtworkDetailContent = memo(() => {
  const { t } = useTranslation();
  const { id } = useParams();
  const detail = getMyArtworkDetailById(id);
  const [activeIndex, setActiveIndex] = useState(0);

  const config = detail
    ? GALLERY_DETAIL_VARIANTS[detail.variant] || GALLERY_DETAIL_VARIANTS.single
    : null;
  const slides = detail?.slides || [];
  const slideCount = slides.length;
  const showStoryChrome = Boolean(config?.stripLayout) && slideCount > 1;

  useEffect(() => {
    setActiveIndex(0);
  }, [detail?.id]);

  useEffect(() => {
    if (!detail || !showStoryChrome || slideCount <= 1) return undefined;
    const timerId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slideCount);
    }, GALLERY_DETAIL_SLIDE_MS);
    return () => window.clearInterval(timerId);
  }, [detail, showStoryChrome, slideCount]);

  if (!detail) {
    return <Navigate to={ROUTES.ADMIN_MY_ARTWORK} replace />;
  }

  const activeSlide = slides[activeIndex] || slides[0];
  const blueBadge = isBlueSlide(activeSlide, config.stripAccent);
  const heroSrc = activeSlide?.hero || detail.image;
  const heroAlt = activeSlide?.sign ? `${detail.title} — ${activeSlide.sign}` : detail.title;
  const { videoPoster, videoSrc } = resolveGalleryDetailMedia(detail, heroSrc);

  const badgeLabel =
    detail.variant === 'twelve'
      ? t('myArtwork.detail.badges.twelveZodiac')
      : t(SHOWCASE_BADGE_KEYS[detail.badge] || detail.badge, {
          defaultValue: detail.badge,
        });
  const categoryLabel = detail.category?.toUpperCase?.() || detail.category;

  const goPrev = () => setActiveIndex((index) => (index === 0 ? slideCount - 1 : index - 1));
  const goNext = () => setActiveIndex((index) => (index === slideCount - 1 ? 0 : index + 1));

  const statItems =
    detail.footerState === 'active'
      ? [
          { label: t('galleryDetail.votesReceived'), value: detail.votesMetric },
          { label: t('galleryDetail.viewsCounted'), value: detail.viewsMetric },
        ]
      : [
          { label: t('myArtwork.detail.totalReact'), value: detail.reactMetric },
          { label: t('galleryDetail.viewsCounted'), value: detail.viewsMetric },
        ];

  return (
    <div className="mx-auto flex w-full max-w-[1580px] flex-col gap-6 sm:gap-8">
      <Link
        to={ROUTES.ADMIN_MY_ARTWORK}
        className="inline-flex w-fit cursor-pointer items-center gap-2 text-[16px] font-medium leading-6 text-[#707070] transition hover:text-[#ee1c25]"
      >
        <ArrowLeft size={24} aria-hidden="true" className="shrink-0" />
        {t('myArtwork.detail.back')}
      </Link>

      <div className="relative aspect-1536/653 w-full overflow-hidden rounded-2xl sm:rounded-[20px]">
        <img
          src={heroSrc}
          alt={heroAlt}
          width={1536}
          height={653}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {activeSlide ? <SignBadge slide={activeSlide} blue={blueBadge} /> : null}

        {showStoryChrome || slideCount > 1 ? (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label={t('galleryDetail.previousPhoto')}
              className="absolute left-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 backdrop-blur-sm sm:left-12.75 sm:size-12.75"
            >
              <img
                src={GALLERY_DETAIL_ASSETS.arrow}
                alt=""
                width={16}
                height={32}
                className="h-7 w-3.5 rotate-180 object-contain sm:h-8 sm:w-4"
              />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label={t('galleryDetail.nextPhoto')}
              className="absolute right-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 backdrop-blur-sm sm:right-12.75 sm:size-12.75"
            >
              <img
                src={GALLERY_DETAIL_ASSETS.arrow}
                alt=""
                width={16}
                height={32}
                className="h-7 w-3.5 object-contain sm:h-8 sm:w-4"
              />
            </button>
          </>
        ) : null}
      </div>

      {config.curveSrc ? (
        <div className={`relative w-full overflow-hidden ${config.curveHeightClass}`}>
          <img
            src={config.curveSrc}
            alt=""
            className={`h-full w-full object-top ${config.curveObjectClass}`}
          />
        </div>
      ) : null}

      {config.stripLayout === 'six' ? (
        <SixStoryStrip
          slides={slides}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
          stripAccent={config.stripAccent}
        />
      ) : null}

      {config.stripLayout === 'twelve' ? (
        <TwelveStoryStrip slides={slides} activeIndex={activeIndex} onSelect={setActiveIndex} />
      ) : null}

      <GalleryDetailVideo poster={videoPoster} src={videoSrc} title={detail.title} />

      <div className="flex flex-wrap gap-2 sm:gap-3">
        {[badgeLabel, categoryLabel].filter(Boolean).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-[#ecedfa] px-3 py-1 text-[12px] font-semibold uppercase tracking-[1.2px] text-[#4048cd] sm:px-4 sm:text-[13px]"
          >
            {tag}
          </span>
        ))}
      </div>

      <div>
        <h1 className="text-[28px] font-semibold leading-tight text-[#161c27] sm:text-[32px]">
          {detail.title}
        </h1>
        <p className="mt-3 max-w-4xl text-[16px] leading-6 text-[#494453] sm:mt-4 sm:text-[17px] sm:leading-7">
          {t(detail.descriptionKey)}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        {statItems.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-black/8 bg-[#f5f5f5] px-4 py-4 text-center"
          >
            <p className="w-full text-[11px] font-semibold uppercase tracking-wider text-[#6b7280] sm:text-[12px]">
              {stat.label}
            </p>
            <p className="w-full text-[28px] font-semibold leading-none text-[#161c27] sm:text-[32px]">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {detail.footerState === 'active' ? (
        <MemberArtworkGlobalRankings
          rankings={detail.rankings}
          showingCount={detail.showingCount}
          showingTotal={detail.showingTotal}
        />
      ) : null}

      <section className="overflow-hidden rounded-lg bg-[#f8fafc] p-4 sm:p-6">
        <h2 className="font-serif text-[20px] font-semibold text-[#161c27] sm:text-[22px]">
          {t('galleryDetail.comments')}
        </h2>

        <ul className="mt-5 flex flex-col sm:mt-6">
          {DETAIL_COMMENTS.map((item, index) => (
            <li
              key={`${item.name}-${index}`}
              className="border-b border-[#c8c8c8] pb-4 pt-0 first:pt-0 not-first:pt-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={GALLERY_DETAIL_ASSETS.commentAvatar}
                    alt=""
                    width={48}
                    height={48}
                    className="size-12 rounded-full object-cover"
                  />
                  <p className="text-[14px] font-medium leading-5 text-[#191c1f]">{item.name}</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#4048cd] px-1.5 py-0.5 text-[14px] text-white">
                  <ImgIcon src={GALLERY_DETAIL_ASSETS.verified} size={16} />
                  {t('galleryDetail.verified')}
                </span>
              </div>
              <p className="mt-2.5 text-[14px] leading-5 text-[#475156]">{item.text}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
});

MemberArtworkDetailContent.displayName = 'MemberArtworkDetailContent';

export default MemberArtworkDetailContent;
