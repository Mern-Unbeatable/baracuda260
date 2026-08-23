import { useTranslation } from 'react-i18next';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { Share2 } from 'lucide-react';
import { ROUTES } from '@/shared/config';
import { PAGE_STACK } from '@/shared/ui/actionStyles';
import { MarketingButton } from '@/shared/ui/marketing';
import { AppLink, ImgIcon, Shell, SitePageLayout } from '@/shared/site-chrome';
import GalleryDetailBreadcrumb from '@/portals/public/gallery/detail/GalleryDetailBreadcrumb';
import GalleryDetailDonation from '@/portals/public/gallery/detail/components/GalleryDetailDonation';
import GalleryDetailVideo from '@/portals/public/gallery/detail/components/GalleryDetailVideo';
import {
  SignBadge,
  SixStoryStrip,
  TwelveStoryStrip,
} from '@/portals/public/gallery/detail/galleryDetailStrips';
import {
  GALLERY_DETAIL_ASSETS as ASSETS,
  GALLERY_DETAIL_COMMENTS as COMMENTS,
  GALLERY_DETAIL_SLIDE_MS,
  GALLERY_DETAIL_VARIANTS,
  isBlueSlide,
  resolveGalleryDetailMedia,
  toGalleryDetailEntry,
} from '@/portals/public/gallery/detail/galleryDetailShared';

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
    const [donationOpen, setDonationOpen] = useState(true);

    const activeSlide = slides[activeIndex] || slides[0];
    const blueBadge = isBlueSlide(activeSlide, config.stripAccent);

    const heroSrc = activeSlide?.hero || story.image;
    const heroAlt = activeSlide?.sign ? `${story.title} — ${activeSlide.sign}` : story.title;
    const { videoPoster, videoSrc, donationAvatar, donationBio } = resolveGalleryDetailMedia(
      story,
      heroSrc,
    );

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

    const handleShare = useCallback(async () => {
      const url = window.location.href;
      try {
        if (navigator.share) {
          await navigator.share({ title: story.title, url });
          return;
        }
        await navigator.clipboard.writeText(url);
      } catch {
        // User cancelled share or clipboard unavailable — no-op.
      }
    }, [story.title]);

    return (
      <SitePageLayout
        activeHref={activeHref}
        rootClassName={rootClassName}
        announcementTone="blue"
        newsletterVariant="detail"
      >
        <section className="bg-white section-py-top pb-6 sm:pb-8">
          <Shell>
            <Breadcrumb title={story.title} />

            <div className="relative mt-4 aspect-1536/653 w-full overflow-hidden rounded-2xl sm:mt-5 sm:rounded-[20px]">
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
          </Shell>
        </section>

        <section className="bg-white section-py-bottom pt-0">
          <Shell>
            <div className={PAGE_STACK}>
              <GalleryDetailVideo poster={videoPoster} src={videoSrc} title={story.title} />

              <div>
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

                <h1 className="mt-3 text-[26px] font-semibold leading-tight text-(--primary-text-heading-color) sm:mt-4 sm:text-[30px] xl:text-[32px]">
                  {story.title}
                </h1>
                <p className="mt-3 max-w-3xl text-[16px] font-normal leading-6 text-(--primary-text-color) sm:mt-4 sm:text-[17px] sm:leading-6.75">
                  {story.description}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
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
                    className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-black/8 bg-[#f5f5f5] px-4 py-4 text-center"
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

              <div className="flex flex-wrap gap-3">
                <MarketingButton type="button">
                  <ImgIcon src={ASSETS.voteHeart} size={20} />
                  {t('galleryDetail.castVote')}
                </MarketingButton>
                <MarketingButton type="button" variant="secondary" onClick={handleShare}>
                  <Share2 size={18} strokeWidth={2} aria-hidden="true" />
                  {t('galleryDetail.share')}
                </MarketingButton>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={ASSETS.photographer}
                    alt={story.photographer}
                    width={57}
                    height={57}
                    className="size-12 rounded-full object-cover sm:size-14.25"
                  />
                  <div>
                    <p className="text-[14px] leading-5 text-[#6b7280]">
                      {t('galleryDetail.photographerLabel')}
                    </p>
                    <p className="text-[16px] font-semibold leading-6 text-(--primary-text-heading-color) sm:text-[18px]">
                      {story.photographer}
                    </p>
                  </div>
                </div>
                <MarketingButton as={AppLink} href={ROUTES.PHOTOGRAPHER_PROFILE} className="shrink-0">
                  {t('galleryDetail.photographerProfile')}
                </MarketingButton>
              </div>

              {donationOpen ? (
                <GalleryDetailDonation
                  photographer={story.photographer}
                  avatar={donationAvatar}
                  bio={donationBio}
                  onClose={() => setDonationOpen(false)}
                />
              ) : (
                <MarketingButton type="button" variant="muted" onClick={() => setDonationOpen(true)}>
                  {t('galleryDetail.donation.reopen', { name: story.photographer })}
                </MarketingButton>
              )}

              <div className="overflow-hidden rounded-lg bg-[#f8fafc] p-4 sm:p-6">
                <h2 className="text-[20px] font-semibold text-(--primary-text-heading-color) sm:text-[22px]">
                  {t('galleryDetail.comments')}
                </h2>

                <ul className="mt-5 flex flex-col sm:mt-6">
                  {COMMENTS.map((item, index) => (
                    <li
                      key={`${item.name}-${index}`}
                      className="border-b border-[#c8c8c8] pb-4 pt-0 first:pt-0 not-first:pt-4"
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
                      <p className="mt-2.5 text-[14px] leading-5 text-[#475156]">{item.text}</p>
                    </li>
                  ))}
                </ul>

                <form
                  className="mt-5 flex flex-col gap-3 rounded-lg bg-[#e6f0f8] p-4 sm:mt-6"
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
                      rows={5}
                      className="w-full resize-y rounded-lg bg-white p-2.5 text-[13px] leading-5 text-[#373737] outline-none placeholder:text-[#373737]"
                    />
                  </div>
                  <MarketingButton type="submit" className="w-full rounded-lg">
                    {t(config.submitLabelKey)}
                  </MarketingButton>
                </form>
              </div>
            </div>
          </Shell>
        </section>
      </SitePageLayout>
    );
  },
);

GalleryDetailView.displayName = 'GalleryDetailView';

export default GalleryDetailView;
