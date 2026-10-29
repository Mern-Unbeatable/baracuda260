import { useQueryClient } from '@tanstack/react-query';
import {
  Bookmark,
  Camera,
  Flag,
  Heart,
  Image as ImageIcon,
  Maximize2,
  Share2,
  ShoppingCart,
} from 'lucide-react';
import React, { memo, useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import GalleryDetailImageDetails from '@/components/data-display/GalleryDetailImageDetails/GalleryDetailImageDetails';
import GalleryDetailVideo from '@/components/data-display/GalleryDetailVideo/GalleryDetailVideo';
import ReportPhotoModal from '@/components/data-display/ReportPhotoModal/ReportPhotoModal';
import MarketingButton from '@/components/marketing/MarketingButton/MarketingButton';
import MarketingCard from '@/components/marketing/MarketingCard/MarketingCard';
import Image from '@/components/ui/Image';
import { getApiErrorMessage } from '@/shared/api/client';
import {
  PUBLIC_PREMIUM_PHOTO_DETAIL_QUERY_KEY,
  PUBLIC_PREMIUM_PHOTOS_QUERY_KEY,
  reportPremiumPhotoApi,
  toggleLikePremiumPhotoApi,
  toggleSavePremiumPhotoApi,
} from '@/shared/api/premiumPhotos.api';
import { ROUTES } from '@/shared/config';
import {
  GALLERY_DETAIL_ASSETS,
  GALLERY_DETAIL_DEMO_VIDEO,
  resolveGalleryDetailMedia,
  resolveGalleryImageDetails,
} from '@/shared/data/galleryDetail';
import { AppLink, Shell, SitePageLayout } from '@/shared/site-chrome';
import { PAGE_STACK } from '@/shared/ui/actionStyles';
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
  <MarketingCard
    variant="filled"
    className={`flex h-full flex-col p-5 sm:p-6 ${className}`.trim()}
  >
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
  const queryClient = useQueryClient();

  const [isLiked, setIsLiked] = useState(() => Boolean(photo.isLiked));
  const [likesCount, setLikesCount] = useState(() =>
    parseCount(photo.likesCount ?? photo.votes ?? photo.likes),
  );
  const [isSaved, setIsSaved] = useState(() => Boolean(photo.isSaved));
  const [reportOpen, setReportOpen] = useState(false);

  useEffect(() => {
    setIsLiked(Boolean(photo.isLiked));
    setLikesCount(parseCount(photo.likesCount ?? photo.votes ?? photo.likes));
    setIsSaved(Boolean(photo.isSaved));
  }, [
    photo.id,
    photo.isLiked,
    photo.likesCount,
    photo.votes,
    photo.likes,
    photo.isSaved,
  ]);

  const badgeLabel = t(SHOWCASE_BADGE_KEYS[photo.badge] || photo.badge, {
    defaultValue: photo.badge,
  });
  const categoryLabel = t(`common.categories.${photo.category}`, {
    defaultValue: photo.category,
  });

  const { videoPoster, videoSrc } = resolveGalleryDetailMedia(
    { ...photo, videoSrc: photo.videoSrc ?? GALLERY_DETAIL_DEMO_VIDEO },
    photo.image,
  );
  const imageDetails = resolveGalleryImageDetails(photo);

  const handleBuy = useCallback(() => {
    navigate(ROUTES.BUY_PHOTOS_CHECKOUT, { state: { photo } });
  }, [navigate, photo]);

  const handleLikeToggle = async () => {
    if (!photo.id) return;
    const next = !isLiked;
    setIsLiked(next);
    setLikesCount((prev) => (next ? prev + 1 : Math.max(0, prev - 1)));
    try {
      const res = await toggleLikePremiumPhotoApi(photo.id);
      const count =
        res?.data?.likesCount ??
        res?.likesCount ??
        res?.data?.likes ??
        res?.likes;
      if (count != null) {
        setLikesCount(parseCount(count));
      }
      const isLikedRes =
        res?.data?.isLiked ?? res?.isLiked ?? res?.data?.liked ?? res?.liked;
      if (isLikedRes != null) {
        setIsLiked(Boolean(isLikedRes));
      }
      queryClient.invalidateQueries({
        queryKey: PUBLIC_PREMIUM_PHOTOS_QUERY_KEY,
      });
      queryClient.invalidateQueries({
        queryKey: PUBLIC_PREMIUM_PHOTO_DETAIL_QUERY_KEY(photo.id),
      });
      if (res?.message) toast.success(res.message);
    } catch (err) {
      setIsLiked(!next);
      setLikesCount((prev) => (next ? Math.max(0, prev - 1) : prev + 1));
      toast.error(
        getApiErrorMessage(
          err,
          t('common.errors.general', 'Failed to update like status.'),
        ),
      );
    }
  };

  const handleSaveToggle = async () => {
    if (!photo.id) return;
    const next = !isSaved;
    setIsSaved(next);
    try {
      const res = await toggleSavePremiumPhotoApi(photo.id);
      queryClient.invalidateQueries({
        queryKey: PUBLIC_PREMIUM_PHOTOS_QUERY_KEY,
      });
      queryClient.invalidateQueries({
        queryKey: PUBLIC_PREMIUM_PHOTO_DETAIL_QUERY_KEY(photo.id),
      });
      queryClient.invalidateQueries({ queryKey: ['saved-artworks'] });
      toast.success(
        res?.message ||
          (next
            ? t('gallery.savedSuccess', 'Saved to favourites')
            : t('gallery.unsavedSuccess', 'Removed from favourites')),
      );
    } catch (err) {
      setIsSaved(!next);
      toast.error(
        getApiErrorMessage(
          err,
          t('common.errors.general', 'Failed to update saved status.'),
        ),
      );
    }
  };

  const handleReportSubmit = async ({ reason, details }) => {
    if (!photo.id) return;
    try {
      const res = await reportPremiumPhotoApi(photo.id, { reason, details });
      toast.success(
        res?.message ||
          t('gallery.reportModal.success', 'Report submitted successfully.'),
      );
    } catch (err) {
      toast.error(
        getApiErrorMessage(
          err,
          t('common.errors.general', 'Failed to submit report.'),
        ),
      );
    }
  };

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: photo.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success(t('common.linkCopied', 'Link copied to clipboard!'));
    } catch {
      // User cancelled share or clipboard unavailable.
    }
  }, [photo.title, t]);

  const detailRows = [
    {
      key: 'resolution',
      icon: Maximize2,
      label: t('buyPhotos.detail.specs.resolution'),
      value: photo.resolution,
    },
    {
      key: 'format',
      icon: ImageIcon,
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
            <Image
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
            {videoSrc ? (
              <GalleryDetailVideo
                poster={videoPoster}
                src={videoSrc}
                title={photo.title}
              />
            ) : null}

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
                    <Image
                      src={
                        photo.author?.avatar ||
                        photo.avatar ||
                        GALLERY_DETAIL_ASSETS.photographer
                      }
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
                    href={
                      photo.author?.id || photo.userId || photo.user?.id
                        ? `/photographer/${photo.author?.id || photo.userId || photo.user?.id}`
                        : ROUTES.PHOTOGRAPHER_PROFILE
                    }
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
                        <p className="mt-0.5 text-[15px] font-medium text-[#0d0d14]">
                          {value}
                        </p>
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
                  value: formatCount(likesCount),
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

            <div className="flex flex-wrap items-center gap-3">
              <MarketingButton
                type="button"
                variant={isLiked ? 'primary' : 'outline'}
                aria-pressed={isLiked}
                onClick={handleLikeToggle}
                className={isLiked ? '!bg-[#ee1c25] !text-white' : ''}
              >
                <Heart
                  size={18}
                  strokeWidth={2}
                  aria-hidden="true"
                  className={
                    isLiked ? 'fill-white text-white' : 'text-[#494453]'
                  }
                />
                <span>
                  {likesCount > 0 ? likesCount.toLocaleString('en-US') : ''}{' '}
                  {isLiked
                    ? t('common.liked', 'Liked')
                    : t('buyPhotos.detail.like', 'Like')}
                </span>
              </MarketingButton>

              <MarketingButton
                type="button"
                variant="outline"
                aria-pressed={isSaved}
                onClick={handleSaveToggle}
                className={isSaved ? 'text-[#ee1c25] border-[#ee1c25]' : ''}
              >
                <Bookmark
                  size={18}
                  strokeWidth={2}
                  aria-hidden="true"
                  className={
                    isSaved ? 'fill-[#ee1c25] text-[#ee1c25]' : 'text-[#494453]'
                  }
                />
                <span>
                  {isSaved
                    ? t('gallery.saved', 'Saved')
                    : t('gallery.save', 'Save')}
                </span>
              </MarketingButton>

              <MarketingButton
                type="button"
                variant="secondary"
                onClick={handleShare}
              >
                <Share2 size={18} strokeWidth={2} aria-hidden="true" />
                <span>{t('buyPhotos.detail.share', 'Share')}</span>
              </MarketingButton>

              <button
                type="button"
                onClick={() => setReportOpen(true)}
                className="inline-flex cursor-pointer items-center gap-1.5 px-3 py-2 text-[14px] font-medium text-[#6b7280] transition hover:text-[#ee1c25]"
                aria-label={t('gallery.report', 'Report')}
              >
                <Flag size={16} />
                <span>{t('gallery.report', 'Report')}</span>
              </button>
            </div>
          </div>
        </Shell>
      </section>

      <ReportPhotoModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        photoTitle={photo.title}
        onSubmit={handleReportSubmit}
      />
    </SitePageLayout>
  );
});

BuyPhotoDetailView.displayName = 'BuyPhotoDetailView';

export default BuyPhotoDetailView;
