import { useTranslation } from 'react-i18next';
import React, { memo, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Heart, Image, Maximize2, Share2, ShoppingCart } from 'lucide-react';
import { ROUTES } from '@/shared/config';
import { PAGE_STACK } from '@/shared/ui/actionStyles';
import MarketingButton from '@/components/marketing/MarketingButton/MarketingButton';
import MarketingCard from '@/components/marketing/MarketingCard/MarketingCard';
import { AppLink, Shell, SitePageLayout } from '@/shared/site-chrome';
import GalleryDetailVideo from '@/components/data-display/GalleryDetailVideo/GalleryDetailVideo';
import GalleryDetailImageDetails from '@/components/data-display/GalleryDetailImageDetails/GalleryDetailImageDetails';
import {
  GALLERY_DETAIL_ASSETS,
  GALLERY_DETAIL_DEMO_VIDEO,
  resolveGalleryDetailMedia,
  resolveGalleryImageDetails,
} from '@/shared/data/galleryDetail';
import BuyPhotoDetailBreadcrumb from './BuyPhotoDetailBreadcrumb';

const SHOWCASE_BADGE_KEYS = {
  'Single Photo': 'common.badges.singlePhoto',
  '6 Photos Story': 'common.badges.sixPhotosStory',
  '12 photos - full Zodiac Story': 'common.badges.twelveZodiacFull',
};

const parseCount = (value) => {
  const n = Number(String(value ?? '0').replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
};

const formatCount = (value) => parseCount(value).toLocaleString('en-US');

const DetailInfoCard = memo(({ title, children, className = '' }) => (
  <MarketingCard variant="filled" className={`flex h-full flex-col p-5 sm:p-6 ${className}`.trim()}>
    <h2 className="text-[14px] font-semibold uppercase tracking-[1.2px] text-[#6b7280]">
      {title}
    </h2>
    <div className="mt-4 flex flex-1 flex-col">{children}</div>
  </MarketingCard>
));

DetailInfoCard.displayName = 'DetailInfoCard';

const BuyPhotoDetailView = memo(({ photo }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const baseLikes = parseCount(photo.votes);
  const [favorited, setFavorited] = useState(false);
  const displayLikes = formatCount(favorited ? baseLikes + 1 : baseLikes);

  const badgeLabel = t(SHOWCASE_BADGE_KEYS[photo.badge] || photo.badge, {
    defaultValue: photo.badge,
  });
  const categoryLabel = t(`common.categories.${photo.category}`, { defaultValue: photo.category });

  const { videoPoster, videoSrc } = resolveGalleryDetailMedia(
    { ...photo, videoSrc: photo.videoSrc ?? GALLERY_DETAIL_DEMO_VIDEO },
    photo.image,
  );
  const imageDetails = resolveGalleryImageDetails(photo);

  const handleBuy = useCallback(() => {
    navigate(ROUTES.BUY_PHOTOS_CHECKOUT, { state: { photo } });
  }, [navigate, photo]);

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: photo.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
    } catch {
      // User cancelled share or clipboard unavailable.
    }
  }, [photo.title]);

  const detailRows = [
    {
      key: 'resolution',
      icon: Maximize2,
      label: t('buyPhotos.detail.specs.resolution'),
      value: photo.resolution,
    },
    {
      key: 'format',
      icon: Image,
      label: t('buyPhotos.detail.specs.format'),
      value: photo.format,
    },
    {
      key: 'camera',
      icon: Camera,
      label: t('buyPhotos.detail.specs.camera'),
      value: photo.camera,
    },
  ];

  return (
    <SitePageLayout
      activeHref={ROUTES.BUY_PHOTOS}
      rootClassName="buy-photo-detail-page-root"
      announcementTone="blue"
      newsletterVariant="detail"
    >
      <section className="bg-white section-py-top pb-6 sm:pb-8">
        <Shell>
          <BuyPhotoDetailBreadcrumb title={photo.title} />

          <div className="relative aspect-1536/653 w-full overflow-hidden rounded-2xl sm:rounded-[20px]">
            <img
              src={photo.image}
              alt={photo.title}
              width={1536}
              height={653}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </Shell>
      </section>

      <section className="bg-white section-py-bottom pt-0">
        <Shell>
          <div className={PAGE_STACK}>
            <GalleryDetailVideo poster={videoPoster} src={videoSrc} title={photo.title} />

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

            <div className="grid gap-4 lg:grid-cols-3">
              <DetailInfoCard title={t('buyPhotos.detail.purchase.title')}>
                <h1 className="text-[22px] font-bold leading-tight text-[#0d0d14] sm:text-[24px]">
                  {photo.title}
                </h1>
                <p className="mt-2 text-[14px] leading-6 text-[#6b7280]">
                  {t('buyPhotos.detail.purchase.subtitle')}
                </p>
                <p className="mt-5 border-t border-black/10 pt-5 text-[28px] font-bold leading-none text-[#4048cd] sm:text-[32px]">
                  {photo.price}
                </p>
                <MarketingButton
                  type="button"
                  className="mt-5 w-full rounded-lg"
                  onClick={handleBuy}
                >
                  <ShoppingCart size={18} strokeWidth={2} aria-hidden="true" />
                  {t('buyPhotos.detail.purchase.buyPhoto')}
                </MarketingButton>
              </DetailInfoCard>

              <DetailInfoCard title={t('buyPhotos.detail.creator.title')}>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-center gap-3">
                    <img
                      src={GALLERY_DETAIL_ASSETS.photographer}
                      alt={photo.photographer}
                      width={57}
                      height={57}
                      className="size-14 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-[16px] font-bold text-[#0d0d14] sm:text-[18px]">
                        {photo.photographer}
                      </p>
                      <p className="mt-1 text-[14px] leading-5 text-[#6b7280]">
                        {t('buyPhotos.detail.creator.role')}
                      </p>
                    </div>
                  </div>
                  <MarketingButton
                    as={AppLink}
                    href={ROUTES.PHOTOGRAPHER_PROFILE}
                    variant="outline"
                    className="mt-auto w-full rounded-lg"
                  >
                    {t('buyPhotos.detail.creator.viewProfile')}
                  </MarketingButton>
                </div>
              </DetailInfoCard>

              <DetailInfoCard title={t('buyPhotos.detail.specs.title')}>
                <ul className="flex flex-col gap-4">
                  {detailRows.map(({ key, icon: Icon, label, value }) => (
                    <li key={key} className="flex items-start gap-3">
                      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#f3f4f6] text-[#6b7280]">
                        <Icon size={18} strokeWidth={2} aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-[12px] font-semibold uppercase tracking-[1px] text-[#9ca3af]">
                          {label}
                        </p>
                        <p className="mt-0.5 text-[15px] font-medium text-[#0d0d14]">{value}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </DetailInfoCard>
            </div>

            <GalleryDetailImageDetails details={imageDetails} />

            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              {[
                {
                  label: t('buyPhotos.detail.likesReceived'),
                  value: displayLikes,
                },
                {
                  label: t('buyPhotos.detail.viewsCounted'),
                  value: formatCount(photo.views),
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-black/8 bg-[#f5f5f5] px-4 py-4 text-center"
                >
                  <p className="w-full text-[11px] font-semibold uppercase tracking-wider text-[#6b7280] sm:text-[12px]">
                    {stat.label}
                  </p>
                  <p className="w-full text-[28px] font-semibold leading-none text-[#0d0d14] sm:text-[32px]">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <MarketingButton
                type="button"
                aria-pressed={favorited}
                onClick={() => setFavorited((current) => !current)}
              >
                <Heart
                  size={18}
                  strokeWidth={2}
                  aria-hidden="true"
                  className={favorited ? 'fill-white' : 'fill-transparent'}
                />
                {t('buyPhotos.detail.like')}
              </MarketingButton>
              <MarketingButton type="button" variant="secondary" onClick={handleShare}>
                <Share2 size={18} strokeWidth={2} aria-hidden="true" />
                {t('buyPhotos.detail.share')}
              </MarketingButton>
            </div>
          </div>
        </Shell>
      </section>
    </SitePageLayout>
  );
});

BuyPhotoDetailView.displayName = 'BuyPhotoDetailView';

export default BuyPhotoDetailView;
