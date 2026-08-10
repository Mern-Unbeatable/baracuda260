import React, { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/shared/config';
import { AppLink, ImgIcon, Shell, SitePageLayout } from '@/shared/site-chrome';
import GalleryDetailBreadcrumb from '@/modules/public/gallery/detail/GalleryDetailBreadcrumb';
import {
  GALLERY_DETAIL_ASSETS as ASSETS,
  GALLERY_DETAIL_COMMENTS as COMMENTS,
  GALLERY_DETAIL_SLIDE_MS,
  GALLERY_DETAIL_VARIANTS,
  isBlueSlide,
  toGalleryDetailEntry,
} from '@/modules/public/gallery/detail/galleryDetailShared';

const SignBadge = memo(({ slide, blue }) => (
  <div
    className={`absolute left-3 top-3 flex gap-2 rounded-[20px] px-4 py-1 sm:left-6 sm:top-6 sm:px-5 sm:py-1.25 ${
      blue ? 'items-center bg-[#4048cd]' : 'items-end bg-[#ee1c25]'
    }`}
  >
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden ${
        blue ? 'size-7 sm:size-8.75' : 'h-4.5 w-5 sm:h-5.25 sm:w-6'
      } ${slide.iconBoxed ? 'rounded-sm bg-[#4048cd]' : ''}`}
    >
      <img
        src={slide.icon}
        alt=""
        width={35}
        height={35}
        className={`object-contain ${slide.iconBoxed ? 'h-4 w-4 sm:h-5 sm:w-5' : 'h-full w-full'}`}
      />
    </span>
    <span className="text-[16px] leading-none text-white sm:text-[20px]">{slide.sign}</span>
  </div>
));

SignBadge.displayName = 'SignBadge';

const SixStoryStrip = memo(({ slides, activeIndex, onSelect, stripAccent }) => {
  const blueAccent = stripAccent === 'blue';

  return (
    <div className="mt-2 w-full overflow-x-auto pb-2">
      <div className="flex min-w-245 flex-col gap-2.5 lg:min-w-0">
        <div className="grid grid-cols-6 gap-3 xl:gap-5">
          {slides.map((slide) => (
            <div key={slide.id} className="flex items-center justify-between gap-1">
              <div className="flex min-w-0 items-center gap-1.5 sm:gap-2.5">
                <span
                  className={
                    blueAccent
                      ? `relative inline-flex size-7 shrink-0 items-center justify-center overflow-hidden sm:size-8.75 ${
                          slide.iconBoxed ? 'rounded-sm bg-[#4048cd]' : ''
                        }`
                      : 'inline-flex shrink-0 items-end rounded bg-[#ee1c25] px-1.5 py-1 sm:px-2.5 sm:py-1.25'
                  }
                >
                  <img
                    src={slide.icon}
                    alt=""
                    width={35}
                    height={35}
                    className={
                      blueAccent
                        ? `object-contain ${
                            slide.iconBoxed ? 'h-4 w-4 sm:h-5 sm:w-5' : 'h-full w-full'
                          }`
                        : 'h-4 w-4.5 object-contain sm:h-5.25 sm:w-6'
                    }
                  />
                </span>
                <span className="truncate text-[13px] text-[#2b2b2b] sm:text-[18px] xl:text-[24px]">
                  {slide.sign}
                </span>
              </div>
              <span
                className={`inline-flex size-6.5 shrink-0 items-center justify-center rounded-full bg-[#fde8e9] text-[14px] sm:size-7.5 sm:text-[20px] ${
                  blueAccent ? 'text-[#4048cd]' : 'text-[#ee1c25]'
                }`}
              >
                {slide.number}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-6 gap-3 xl:gap-5">
          {slides.map((slide, index) => (
            <button
              key={`${slide.id}-thumb`}
              type="button"
              onClick={() => onSelect(index)}
              aria-label={`Show ${slide.sign}`}
              aria-pressed={index === activeIndex}
              className={`relative h-18 overflow-hidden rounded-lg sm:h-25 xl:h-30 ${
                index === activeIndex
                  ? 'border-[3px] border-[#ee1c25]'
                  : 'border border-transparent'
              }`}
            >
              <img
                src={slide.thumb}
                alt={slide.sign}
                width={240}
                height={120}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

SixStoryStrip.displayName = 'SixStoryStrip';

const TwelveStoryStrip = memo(({ slides, activeIndex, onSelect }) => (
  <div className="mt-2 w-full overflow-x-auto pb-2">
    <div className="grid min-w-275 grid-cols-12 gap-2 lg:min-w-0 xl:gap-3">
      {slides.map((slide, index) => {
        const blue = slide.theme === 'blue';
        return (
          <div key={slide.id} className="flex flex-col items-center gap-2">
            <div className="flex w-full flex-col items-center gap-2">
              <span
                className={`inline-flex size-6.5 items-center justify-center rounded-full bg-[#fde8e9] text-[14px] sm:size-7.5 sm:text-[18px] ${
                  blue ? 'text-[#4048cd]' : 'text-[#ee1c25]'
                }`}
              >
                {slide.number}
              </span>
              <span
                className={`relative inline-flex size-7 items-center justify-center overflow-hidden sm:size-8.75 ${
                  blue
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
                    blue
                      ? slide.iconBoxed
                        ? 'h-4 w-4 sm:h-5 sm:w-5'
                        : 'h-full w-full'
                      : 'h-4 w-4.5 sm:h-5.25 sm:w-6'
                  }`}
                />
              </span>
              <span className="truncate text-center text-[12px] text-[#2b2b2b] sm:text-[14px] xl:text-[16px]">
                {slide.sign}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onSelect(index)}
              aria-label={`Show ${slide.sign}`}
              aria-pressed={index === activeIndex}
              className={`relative h-18 w-full overflow-hidden rounded-lg sm:h-25 xl:h-30 ${
                index === activeIndex ? 'border-[3px] border-[#ee1c25]' : 'border border-black/10'
              }`}
            >
              <img
                src={slide.thumb}
                alt={slide.sign}
                width={112}
                height={120}
                className="h-full w-full object-cover"
              />
            </button>
          </div>
        );
      })}
    </div>
  </div>
));

TwelveStoryStrip.displayName = 'TwelveStoryStrip';

/**
 * Shared gallery card detail UI (single / 6-story / 6-blue / 12-zodiac).
 *
 * @param {{
 *   entry: object,
 *   variant?: keyof typeof GALLERY_DETAIL_VARIANTS,
 * }} props
 */
const GalleryDetailView = memo(
  ({
    entry,
    variant = 'single',
    activeHref = ROUTES.GALLERY,
    Breadcrumb = GalleryDetailBreadcrumb,
    rootClassName: rootClassNameProp,
  }) => {
    const { t } = useTranslation();
    const config = GALLERY_DETAIL_VARIANTS[variant] || GALLERY_DETAIL_VARIANTS.single;
    const rootClassName = rootClassNameProp ?? config.rootClassName;
    const story = toGalleryDetailEntry(entry);
    const slides = story.slides || [];
    const slideCount = slides.length;
    const showStoryChrome = Boolean(config.stripLayout) && slideCount > 1;

    const [activeIndex, setActiveIndex] = useState(0);
    const [comment, setComment] = useState('');

    const activeSlide = slides[activeIndex] || slides[0];
    const blueBadge = isBlueSlide(activeSlide, config.stripAccent);

    useEffect(() => {
      setActiveIndex(0);
    }, [story.id]);

    useEffect(() => {
      if (!showStoryChrome || slideCount <= 1) return undefined;
      const timerId = window.setInterval(() => {
        setActiveIndex((current) => (current + 1) % slideCount);
      }, GALLERY_DETAIL_SLIDE_MS);
      return () => window.clearInterval(timerId);
    }, [showStoryChrome, slideCount, story.id]);

    const goPrev = () => setActiveIndex((i) => (i === 0 ? slideCount - 1 : i - 1));
    const goNext = () => setActiveIndex((i) => (i === slideCount - 1 ? 0 : i + 1));

    const heroSrc = activeSlide?.hero || story.image;
    const heroAlt = activeSlide?.sign ? `${story.title} — ${activeSlide.sign}` : story.title;

    return (
      <SitePageLayout
        activeHref={activeHref}
        rootClassName={rootClassName}
        announcementTone="blue"
        newsletterVariant="detail"
      >
        <section className="bg-white section-py">
          <Shell>
            <Breadcrumb title={story.title} />

            <div className="relative aspect-1536/653 w-full overflow-hidden rounded-2xl sm:rounded-[20px]">
              <img
                src={heroSrc}
                alt={heroAlt}
                width={1536}
                height={653}
                className="absolute inset-0 h-full w-full object-cover"
              />
              {activeSlide ? <SignBadge slide={activeSlide} blue={blueBadge} /> : null}

              {showStoryChrome ? (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label={t('galleryDetail.previousPhoto')}
                    className="absolute left-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 backdrop-blur-sm sm:left-12.75 sm:size-12.75"
                  >
                    <img
                      src={ASSETS.arrow}
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
                      src={ASSETS.arrow}
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
              <div
                className={`relative mt-2 w-full overflow-hidden sm:mt-3 ${config.curveHeightClass}`}
              >
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
              <TwelveStoryStrip
                slides={slides}
                activeIndex={activeIndex}
                onSelect={setActiveIndex}
              />
            ) : null}

            <div className="mt-5 sm:mt-6">
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-full bg-[#ee1c25] px-6 py-3 text-[16px] font-medium text-white"
              >
                {t('galleryDetail.download')}
              </a>
            </div>
          </Shell>
        </section>

        <section className="bg-white section-py">
          <Shell>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {[story.badge, story.category].filter(Boolean).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[#ecedfa] px-3 py-1 text-[12px] font-semibold uppercase tracking-[1.2px] text-[#4048cd] sm:px-4 sm:text-[13px]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="mt-4 text-[26px] font-semibold leading-tight text-(--primary-text-heading-color) sm:mt-5 sm:text-[30px] xl:text-[32px]">
              {story.title}
            </h1>
            <p className="mt-4 max-w-3xl text-[16px] font-normal leading-6.5 text-(--primary-text-color) sm:text-[17px] sm:leading-6.75">
              {story.description}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-5">
              {[
                {
                  label: t('galleryDetail.votesReceived'),
                  value: String(story.votes ?? '').replace(/,/g, ''),
                },
                {
                  label: t('galleryDetail.viewsCounted'),
                  value: String(story.views ?? '').replace(/,/g, ''),
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-black/8 bg-[#f5f5f5] px-4 py-5 text-center"
                >
                  <p className="w-full text-[11px] font-semibold uppercase tracking-wider text-[#6b7280] sm:text-[12px]">
                    {stat.label}
                  </p>
                  <p className="w-full text-[28px] font-semibold leading-none text-(--primary-text-heading-color) sm:text-[32px]">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-black/10 pt-8">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#ee1c25] px-6 py-3 text-[16px] font-medium text-white"
              >
                <ImgIcon src={ASSETS.voteHeart} size={20} />
                {t('galleryDetail.castVote')}
              </button>
            </div>

            <div className="mt-8 flex flex-col gap-4 border-b border-black/10 pb-6 sm:mt-9 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={ASSETS.photographer}
                  alt={story.photographer}
                  width={57}
                  height={57}
                  className="size-12 rounded-full object-cover sm:size-14.25"
                />
                <div>
                  <p className="text-[14px] leading-5.5 text-[#6b7280]">
                    {t('galleryDetail.photographerLabel')}
                  </p>
                  <p className="text-[16px] font-semibold leading-6 text-(--primary-text-heading-color) sm:text-[18px]">
                    {story.photographer}
                  </p>
                </div>
              </div>
              <AppLink
                href={ROUTES.PHOTOGRAPHER_PROFILE}
                className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#ee1c25] px-6 py-3 text-[16px] font-medium text-white"
              >
                {t('galleryDetail.photographerProfile')}
              </AppLink>
            </div>
          </Shell>
        </section>

        <section className="bg-white section-py">
          <Shell>
            <div className="overflow-hidden rounded-lg bg-[#f8fafc] p-4 sm:p-6">
              <h2 className="text-[20px] font-semibold text-(--primary-text-heading-color) sm:text-[22px]">
                {t('galleryDetail.comments')}
              </h2>

              <ul className="mt-6 flex flex-col">
                {COMMENTS.map((item, index) => (
                  <li
                    key={`${item.name}-${index}`}
                    className="border-b border-[#c8c8c8] pb-4 pt-0 first:pt-0 not-first:pt-5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={ASSETS.commentAvatar}
                          alt=""
                          width={48}
                          height={48}
                          className="size-12 rounded-full object-cover"
                        />
                        <p className="text-[14px] font-medium leading-5 text-[#191c1f]">
                          {item.name}
                        </p>
                      </div>
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#4048cd] px-1.5 py-0.5 text-[14px] text-white">
                        <ImgIcon src={ASSETS.verified} size={16} />
                        {t('galleryDetail.verified')}
                      </span>
                    </div>
                    <p className="mt-3 text-[14px] leading-5 text-[#475156]">{item.text}</p>
                  </li>
                ))}
              </ul>

              <form
                className="mt-6 flex flex-col gap-4 rounded-lg bg-[#e6f0f8] p-4"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor={config.commentFieldId}
                    className="text-[16px] font-medium text-(--primary-text-heading-color)"
                  >
                    {t('galleryDetail.commentLabel')}
                  </label>
                  <textarea
                    id={config.commentFieldId}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={t('galleryDetail.commentPlaceholder')}
                    rows={6}
                    className="w-full resize-y rounded-lg bg-white p-2.5 text-[12px] text-[#373737] outline-none placeholder:text-[#373737]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded bg-[#ee1c25] px-2.5 py-3 text-[16px] font-medium text-white"
                >
                  {t(config.submitLabelKey)}
                </button>
              </form>
            </div>
          </Shell>
        </section>
      </SitePageLayout>
    );
  },
);

GalleryDetailView.displayName = 'GalleryDetailView';

export default GalleryDetailView;
