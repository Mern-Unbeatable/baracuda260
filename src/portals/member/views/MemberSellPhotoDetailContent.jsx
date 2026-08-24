import { useTranslation } from 'react-i18next';
import React, { memo, useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/shared/config';
import GalleryDetailVideo from '@/components/data-display/GalleryDetailVideo/GalleryDetailVideo';
import GalleryDetailImageDetails from '@/components/data-display/GalleryDetailImageDetails/GalleryDetailImageDetails';
import {
  GALLERY_DETAIL_ASSETS,
  GALLERY_DETAIL_SLIDE_MS,
  GALLERY_DETAIL_VARIANTS,
  resolveGalleryDetailMedia,
  resolveGalleryImageDetails,
  isBlueSlide,
} from '@/shared/data/galleryDetail';
import SignBadge from '@/components/data-display/SignBadge/SignBadge';
import SixStoryStrip from '@/components/data-display/SixStoryStrip/SixStoryStrip';
import TwelveStoryStrip from '@/components/data-display/TwelveStoryStrip/TwelveStoryStrip';
import { getSellPhotoDetailById } from '@/portals/member/data/sellPhotosDetailData';

const SHOWCASE_BADGE_KEYS = {
  'Single Photo': 'common.badges.singlePhoto',
  '6 Photos Story': 'common.badges.sixPhotosStory',
  '12 photos - full Zodiac Story': 'common.badges.twelveZodiacFull',
};

const DetailPanel = memo(({ title, children, className = '' }) => (
  <div
    className={`flex h-full flex-col rounded-2xl border border-black/8 bg-[#f5f5f5] p-5 sm:p-6 ${className}`.trim()}
  >
    <h2 className="text-[14px] font-semibold uppercase tracking-[1.2px] text-[#6b7280]">
      {title}
    </h2>
    <div className="mt-4 flex flex-1 flex-col">{children}</div>
  </div>
));

DetailPanel.displayName = 'DetailPanel';

const MemberSellPhotoDetailContent = memo(() => {
  const { t } = useTranslation();
  const { id } = useParams();
  const detail = getSellPhotoDetailById(id);
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
    return <Navigate to={ROUTES.ADMIN_SELL_PHOTOS} replace />;
  }

  const activeSlide = slides[activeIndex] || slides[0];
  const blueBadge = isBlueSlide(activeSlide, config.stripAccent);
  const heroSrc = activeSlide?.hero || detail.image;
  const heroAlt = activeSlide?.sign ? `${detail.title} — ${activeSlide.sign}` : detail.title;
  const { videoPoster, videoSrc } = resolveGalleryDetailMedia(detail, heroSrc);
  const imageDetails = resolveGalleryImageDetails({
    ...detail,
    photographer: detail.photographer ?? detail.author,
    badge: detail.badge,
    date: detail.uploadedDate,
  });

  const badgeLabel =
    detail.variant === 'twelve'
      ? t('sellPhotos.detail.badges.twelveZodiac')
      : t(SHOWCASE_BADGE_KEYS[detail.badge] || detail.badge, {
          defaultValue: detail.badge,
        });
  const categoryLabel = t(`common.categories.${detail.category}`, {
    defaultValue: detail.category?.toUpperCase?.() || detail.category,
  });

  const goPrev = () => setActiveIndex((index) => (index === 0 ? slideCount - 1 : index - 1));
  const goNext = () => setActiveIndex((index) => (index === slideCount - 1 ? 0 : index + 1));

  const specRows = [
    { label: t('buyPhotos.detail.specs.resolution'), value: detail.resolution },
    { label: t('buyPhotos.detail.specs.format'), value: detail.format },
    { label: t('buyPhotos.detail.specs.camera'), value: detail.camera },
  ];

  const statItems = [
    { label: t('buyPhotos.detail.likesReceived'), value: detail.likesMetric },
    { label: t('buyPhotos.detail.viewsCounted'), value: detail.viewsMetric },
    { label: t('sellPhotos.detail.totalSell'), value: detail.totalSellMetric },
  ];

  return (
    <div className="mx-auto flex w-full max-w-[1580px] flex-col gap-6 sm:gap-8">
      <Link
        to={ROUTES.ADMIN_SELL_PHOTOS}
        className="inline-flex w-fit cursor-pointer items-center gap-2 text-[16px] font-medium leading-6 text-[#707070] transition hover:text-[#ee1c25]"
      >
        <ArrowLeft size={24} aria-hidden="true" className="shrink-0" />
        {t('sellPhotos.detail.back')}
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

      <GalleryDetailImageDetails details={imageDetails} />

      <div className="grid gap-4 lg:grid-cols-2">
        <DetailPanel title={t('sellPhotos.detail.listingTitle')}>
          <h1 className="text-[22px] font-bold leading-tight text-[#0d0d14] sm:text-[24px]">
            {detail.title}
          </h1>
          <p className="mt-2 text-[14px] leading-6 text-[#6b7280]">
            {t('buyPhotos.detail.purchase.subtitle')}
          </p>
          <p className="mt-5 border-t border-black/10 pt-5 text-[28px] font-bold leading-none text-[#4048cd] sm:text-[32px]">
            {detail.price}
          </p>
        </DetailPanel>

        <DetailPanel title={t('buyPhotos.detail.specs.title')}>
          <dl className="flex flex-col gap-4">
            {specRows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between gap-4 border-b border-black/8 pb-3 last:border-b-0 last:pb-0"
              >
                <dt className="text-[14px] font-medium text-[#6b7280]">{row.label}</dt>
                <dd className="text-[15px] font-semibold text-[#0d0d14]">{row.value}</dd>
              </div>
            ))}
          </dl>
        </DetailPanel>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
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
    </div>
  );
});

MemberSellPhotoDetailContent.displayName = 'MemberSellPhotoDetailContent';

export default MemberSellPhotoDetailContent;
