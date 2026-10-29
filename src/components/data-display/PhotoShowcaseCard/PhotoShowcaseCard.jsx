import { useQueryClient } from '@tanstack/react-query';
import {
  Bookmark,
  Calendar,
  Eye,
  Heart,
  Images,
  MoreVertical,
  Play,
} from 'lucide-react';
import React, { memo, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import PhotoAiBadgeOverlay from '@/components/data-display/PhotoAiBadgeOverlay/PhotoAiBadgeOverlay';
import ReportPhotoModal from '@/components/data-display/ReportPhotoModal/ReportPhotoModal';
import MarketingCard from '@/components/marketing/MarketingCard/MarketingCard';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import {
  PUBLIC_ARTWORKS_QUERY_KEY,
  reportArtworkApi,
  toggleLikeArtworkApi,
  toggleSaveArtworkApi,
  voteArtworkApi,
} from '@/shared/api/artworks.api';
import { getApiErrorMessage } from '@/shared/api/client';
import {
  PUBLIC_PREMIUM_PHOTOS_QUERY_KEY,
  reportPremiumPhotoApi,
  toggleLikePremiumPhotoApi,
  toggleSavePremiumPhotoApi,
} from '@/shared/api/premiumPhotos.api';
import { AppLink, ImgIcon } from '@/shared/site-chrome';

const TROPHY_ICON = '/assets/home/icon-trophy-cup.svg';

const parseCount = (value) => {
  const n = Number(String(value ?? '0').replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
};

const formatCount = (value) => parseCount(value).toLocaleString('en-US');

const ImageOverlayBadge = ({ children, className = '' }) => (
  <span
    className={`inline-flex items-center rounded-md bg-white/92 px-2.5 py-1 text-[10px] font-bold uppercase leading-none tracking-[0.35px] text-[#0d0d14] shadow-sm backdrop-blur-[2px] ${className}`.trim()}
  >
    {children}
  </span>
);

const DarkOverlayBadge = ({ children, className = '' }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-lg bg-black/50 px-2 py-1 text-[11px] font-semibold leading-none text-white backdrop-blur-[2px] ${className}`.trim()}
  >
    {children}
  </span>
);

const PhotoShowcaseCard = memo(
  ({
    id,
    href,
    image,
    imageAlt,
    videoUrl,
    title,
    titleAs: TitleTag = 'h3',
    titleClassName = '',
    badge,
    description,
    likes,
    views,
    date,
    price,
    competitionLabel,
    winnerRank,
    extraPhotosLabel,
    isAiGenerated = false,
    className = '',
    onMenuClick,
    topRightType = 'menu',
    initialSaved = false,
    onSaveToggle,
    initialLiked = false,
    onLikeToggle,
    engagementType = 'like',
    itemType,
    kind,
    isVideo,
  }) => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [saved, setSaved] = useState(initialSaved);
    const [liked, setLiked] = useState(initialLiked);
    const [likesCount, setLikesCount] = useState(() => parseCount(likes));
    const [reportOpen, setReportOpen] = useState(false);
    const showPrice = price != null && price !== '';

    const isPremiumPhoto =
      itemType === 'premium-photo' ||
      (typeof href === 'string' && href.includes('/buy-photos/'));

    const isVideoCard =
      isVideo !== undefined
        ? Boolean(isVideo)
        : String(kind || itemType || '').toUpperCase() === 'VIDEO' ||
          (!image && Boolean(videoUrl));

    useEffect(() => {
      setSaved(initialSaved);
    }, [initialSaved]);

    useEffect(() => {
      setLiked(initialLiked);
    }, [initialLiked]);

    useEffect(() => {
      setLikesCount(parseCount(likes));
    }, [likes]);

    const bottomMetaClass = (layer) => {
      if (layer === 0 && winnerRank) return 'bottom-14';
      if (layer === 1 && competitionLabel)
        return winnerRank ? 'bottom-24' : 'bottom-14';
      return 'bottom-3';
    };

    const handleSave = async (event) => {
      event.preventDefault();
      event.stopPropagation();
      const next = !saved;
      setSaved(next);
      if (onSaveToggle) {
        onSaveToggle(next, id);
        return;
      }
      if (id) {
        try {
          const res = isPremiumPhoto
            ? await toggleSavePremiumPhotoApi(id)
            : await toggleSaveArtworkApi(id);

          if (isPremiumPhoto) {
            queryClient.invalidateQueries({
              queryKey: PUBLIC_PREMIUM_PHOTOS_QUERY_KEY,
            });
            queryClient.invalidateQueries({
              queryKey: ['public-premium-photo-detail', id],
            });
          } else {
            queryClient.invalidateQueries({ queryKey: ['saved-artworks'] });
            queryClient.invalidateQueries({ queryKey: ['artwork-detail', id] });
          }

          toast.success(
            res?.message ||
              (next
                ? t('gallery.savedSuccess', 'Saved to favourites')
                : t('gallery.unsavedSuccess', 'Removed from favourites')),
          );
        } catch (err) {
          setSaved(!next);
          toast.error(
            getApiErrorMessage(
              err,
              t('common.errors.general', 'Failed to update saved status.'),
            ),
          );
        }
      }
    };

    const isVoteMode = engagementType === 'vote';

    const handleLike = async (event) => {
      event.preventDefault();
      event.stopPropagation();
      const next = !liked;
      setLiked(next);
      setLikesCount((prev) => (next ? prev + 1 : Math.max(0, prev - 1)));
      if (onLikeToggle) {
        onLikeToggle(next, id);
        return;
      }
      if (id) {
        if (isVoteMode) {
          try {
            const res = await voteArtworkApi(id);
            queryClient.invalidateQueries({
              queryKey: PUBLIC_ARTWORKS_QUERY_KEY,
            });
            queryClient.invalidateQueries({
              queryKey: ['artwork-detail', id],
            });
            toast.success(
              res?.message ||
                t(
                  'competitionsPage.voteSuccess',
                  'Vote recorded successfully!',
                ),
            );
          } catch (err) {
            setLiked(!next);
            setLikesCount((prev) => (next ? Math.max(0, prev - 1) : prev + 1));
            toast.error(
              getApiErrorMessage(
                err,
                t(
                  'competitionsPage.voteError',
                  'Failed to record vote. You may need to log in.',
                ),
              ),
            );
          }
          return;
        }

        try {
          const res = isPremiumPhoto
            ? await toggleLikePremiumPhotoApi(id)
            : await toggleLikeArtworkApi(id);

          const count =
            res?.data?.likesCount ??
            res?.likesCount ??
            res?.data?.likes ??
            res?.likes;
          if (count != null) {
            setLikesCount(parseCount(count));
          }
          const isLikedRes =
            res?.data?.isLiked ??
            res?.isLiked ??
            res?.data?.liked ??
            res?.liked;
          if (isLikedRes != null) {
            setLiked(Boolean(isLikedRes));
          }

          if (isPremiumPhoto) {
            queryClient.invalidateQueries({
              queryKey: PUBLIC_PREMIUM_PHOTOS_QUERY_KEY,
            });
            queryClient.invalidateQueries({
              queryKey: ['public-premium-photo-detail', id],
            });
          }

          if (res?.message) toast.success(res.message);
        } catch (err) {
          setLiked(!next);
          setLikesCount((prev) => (next ? Math.max(0, prev - 1) : prev + 1));
          toast.error(
            getApiErrorMessage(
              err,
              t('common.errors.general', 'Failed to update like status.'),
            ),
          );
        }
      }
    };

    const handleMenu = (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (onMenuClick) {
        onMenuClick(event);
        return;
      }
      setReportOpen(true);
    };

    const handleReport = async ({ reason, details }) => {
      if (!id) return;
      try {
        const res = isPremiumPhoto
          ? await reportPremiumPhotoApi(id, { reason, details })
          : await reportArtworkApi(id, { reason, details });
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

    return (
      <>
        <MarketingCard
          variant="showcase"
          className={`group overflow-hidden ${className}`.trim()}
        >
          <AppLink href={href} className="block focus-visible:outline-none">
            <div className="relative aspect-368/252 overflow-hidden bg-[#f3f4f6]">
              {isVideoCard && videoUrl && !image ? (
                <div className="relative h-full w-full bg-[#0d0d14]">
                  <video
                    src={videoUrl}
                    preload="metadata"
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25">
                    <div className="flex size-11 items-center justify-center rounded-full bg-white/90 text-[#0d0d14] shadow-md backdrop-blur-xs transition group-hover:scale-110">
                      <Play
                        size={18}
                        className="translate-x-0.5 fill-[#0d0d14]"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative h-full w-full">
                  <Image
                    src={image}
                    alt={imageAlt ?? title}
                    width={368}
                    height={252}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                  />
                  {isVideoCard && videoUrl && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/15">
                      <div className="flex size-11 items-center justify-center rounded-full bg-white/90 text-[#0d0d14] shadow-md backdrop-blur-xs transition group-hover:scale-110">
                        <Play
                          size={18}
                          className="translate-x-0.5 fill-[#0d0d14]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {badge ? (
                <ImageOverlayBadge className="absolute left-3 top-3 max-w-[calc(100%-3.5rem)]">
                  {badge}
                </ImageOverlayBadge>
              ) : null}

              <PhotoAiBadgeOverlay
                show={isAiGenerated}
                placement="card-end"
                size="sm"
              />

              {topRightType === 'favorite' ? (
                <Button
                  unstyled
                  type="button"
                  onClick={handleLike}
                  aria-label={t('gallery.favoriteAction', {
                    title,
                    defaultValue: `Favorite ${title}`,
                  })}
                  aria-pressed={liked}
                  className="absolute right-3 top-3 inline-flex size-8 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#161c27] shadow-sm backdrop-blur-[2px] transition hover:bg-white"
                >
                  <Heart
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                    className={
                      liked
                        ? 'fill-[#ee1c25] text-[#ee1c25]'
                        : 'fill-transparent text-[#161c27]'
                    }
                  />
                </Button>
              ) : topRightType === 'menu' ? (
                <Button
                  unstyled
                  type="button"
                  onClick={handleMenu}
                  aria-label={t('gallery.moreActions', {
                    defaultValue: 'More actions',
                  })}
                  className="absolute right-3 top-3 inline-flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-[2px] transition hover:bg-black/60"
                >
                  <MoreVertical
                    size={16}
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                </Button>
              ) : null}

              {winnerRank ? (
                <DarkOverlayBadge
                  className={`absolute left-3 gap-1.5 ${bottomMetaClass(0)}`}
                >
                  <ImgIcon src={TROPHY_ICON} size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.35px] text-[#fdc700]">
                    {winnerRank}
                  </span>
                </DarkOverlayBadge>
              ) : null}

              {competitionLabel ? (
                <ImageOverlayBadge
                  className={`absolute left-3 ${bottomMetaClass(1)}`}
                >
                  {competitionLabel}
                </ImageOverlayBadge>
              ) : null}

              <Button
                unstyled
                type="button"
                onClick={handleSave}
                aria-pressed={saved}
                aria-label={
                  saved
                    ? t('gallery.unsave', {
                        title,
                        defaultValue: `Unsave ${title}`,
                      })
                    : t('gallery.saveAction', {
                        title,
                        defaultValue: `Save ${title}`,
                      })
                }
                className={`absolute bottom-4 left-4 inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-semibold leading-none shadow-sm transition ${
                  saved
                    ? 'bg-[#ee1c25] text-white'
                    : 'bg-[#fff1f2] text-[#ee1c25]'
                }`}
              >
                <Bookmark
                  size={14}
                  strokeWidth={2}
                  aria-hidden="true"
                  className={
                    saved
                      ? 'fill-white text-white'
                      : 'fill-transparent text-[#ee1c25]'
                  }
                />
                {saved
                  ? t('gallery.saved', { defaultValue: 'Saved' })
                  : t('gallery.save', { defaultValue: 'Save' })}
              </Button>

              {extraPhotosLabel ? (
                <DarkOverlayBadge className="absolute bottom-3 right-3">
                  <Images size={13} strokeWidth={2.5} aria-hidden="true" />
                  {extraPhotosLabel}
                </DarkOverlayBadge>
              ) : null}
            </div>

            <div className="p-4">
              <TitleTag
                title={typeof title === 'string' ? title : undefined}
                className={`text-[18px] font-bold leading-[1.3] text-[#0d0d14] transition group-hover:text-[#4048cd] line-clamp-2 lg:line-clamp-1 ${titleClassName}`.trim()}
              >
                {title}
              </TitleTag>

              {description ? (
                <p className="mt-2 line-clamp-2 text-[14px] leading-normal text-[#6b7280]">
                  {description}
                </p>
              ) : null}

              <div className="mt-3 flex w-full items-center justify-between gap-2 text-[12px] font-medium">
                <Button
                  unstyled
                  type="button"
                  onClick={handleLike}
                  aria-pressed={liked}
                  aria-label={
                    liked
                      ? t('gallery.unlike', { defaultValue: 'Unlike photo' })
                      : t('gallery.like', { defaultValue: 'Like photo' })
                  }
                  className="inline-flex cursor-pointer items-center gap-1 text-[#e53935] transition hover:opacity-80"
                >
                  <Heart
                    size={14}
                    strokeWidth={2}
                    aria-hidden="true"
                    className={
                      liked
                        ? 'fill-[#e53935] text-[#e53935]'
                        : 'fill-transparent text-[#e53935]'
                    }
                  />
                  <span>{likesCount.toLocaleString('en-US')}</span>
                </Button>
                {views ? (
                  <span className="inline-flex items-center gap-1 text-[#9ca3af]">
                    <Eye size={14} strokeWidth={2} aria-hidden="true" />
                    {views}
                  </span>
                ) : null}
                {date ? (
                  <span className="inline-flex items-center gap-1 text-[#9ca3af]">
                    <Calendar size={14} strokeWidth={2} aria-hidden="true" />
                    {date}
                  </span>
                ) : null}
              </div>

              {showPrice ? (
                <p className="mt-3 text-[18px] font-bold leading-none text-[#4048cd]">
                  {price}
                </p>
              ) : null}
            </div>
          </AppLink>
        </MarketingCard>

        <ReportPhotoModal
          open={reportOpen}
          onClose={() => setReportOpen(false)}
          photoTitle={title}
          onSubmit={handleReport}
        />
      </>
    );
  },
);

PhotoShowcaseCard.displayName = 'PhotoShowcaseCard';

export default PhotoShowcaseCard;
