import { useQueryClient } from '@tanstack/react-query';
import {
  Bookmark,
  Calendar,
  Camera,
  Eye,
  Flag,
  Heart,
  Images,
  MoreVertical,
  Play,
} from 'lucide-react';
import React, { memo, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AwardArtworkModal from '@/components/data-display/AwardArtworkModal/AwardArtworkModal';
import PhotoAiBadgeOverlay from '@/components/data-display/PhotoAiBadgeOverlay/PhotoAiBadgeOverlay';
import PhotographerAwardCounters from '@/components/data-display/PhotographerAwardCounters/PhotographerAwardCounters';
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
import { ImgIcon } from '@/shared/site-chrome';
import {
  hasLikedArtworkInSession,
  writeLikedArtworkId,
} from '@/shared/utils/likedArtworksSession';
import { optimizeImageUrl } from '@/shared/utils/media';

const TROPHY_ICON = '/assets/home/icon-trophy-cup.svg';

const parseCount = (value) => {
  const n = Number(String(value ?? '0').replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
};

const formatCount = (value) => parseCount(value).toLocaleString('en-US');

const ImageOverlayBadge = ({ children, className = '' }) => (
  <span
    className={`inline-flex items-center rounded-md bg-white px-2.5 py-1 text-[10px] font-bold uppercase leading-none tracking-[0.35px] text-[#0d0d14] shadow-sm ${className}`.trim()}
  >
    {children}
  </span>
);

const DarkOverlayBadge = ({ children, className = '' }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-lg bg-black/55 px-2 py-1 text-[11px] font-semibold leading-none text-white ${className}`.trim()}
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
    promoted = false,
    className = '',
    onMenuClick,
    topRightType = 'menu',
    initialSaved = false,
    onSaveToggle,
    initialLiked = false,
    onLikeToggle,
    engagementType = 'like',
    engagementDisabled = false,
    saveDisabled = false,
    itemType,
    kind,
    isVideo,
    awards,
    photographer,
    photographerName,
    userId,
  }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [saved, setSaved] = useState(initialSaved);
    const [liked, setLiked] = useState(() => {
      if (initialLiked) return true;
      return hasLikedArtworkInSession(id);
    });
    const [likesCount, setLikesCount] = useState(() => parseCount(likes));
    const [reportOpen, setReportOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [awardOpen, setAwardOpen] = useState(false);
    const menuWrapRef = useRef(null);
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
      if (!menuOpen) return undefined;

      const handlePointerDown = (event) => {
        if (menuWrapRef.current?.contains(event.target)) return;
        setMenuOpen(false);
      };

      const handleKeyDown = (event) => {
        if (event.key === 'Escape') setMenuOpen(false);
      };

      document.addEventListener('mousedown', handlePointerDown);
      document.addEventListener('touchstart', handlePointerDown);
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('mousedown', handlePointerDown);
        document.removeEventListener('touchstart', handlePointerDown);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [menuOpen]);

    useEffect(() => {
      setSaved(initialSaved);
    }, [initialSaved]);

    useEffect(() => {
      if (initialLiked) {
        setLiked(true);
        return;
      }
      if (hasLikedArtworkInSession(id)) {
        setLiked(true);
        return;
      }
      setLiked(false);
    }, [initialLiked, id]);

    useEffect(() => {
      setLikesCount(parseCount(likes));
    }, [likes]);

    const bottomMetaClass = (layer) => {
      if (layer === 0 && winnerRank) return 'bottom-14';
      if (layer === 1 && competitionLabel)
        return winnerRank ? 'bottom-24' : 'bottom-14';
      return 'bottom-3';
    };

    const patchPublicArtworkCaches = (patch) => {
      queryClient.setQueriesData(
        { queryKey: PUBLIC_ARTWORKS_QUERY_KEY },
        (old) => {
          if (!old || !Array.isArray(old.data)) return old;
          return {
            ...old,
            data: old.data.map((item) =>
              item?.id === id ? { ...item, ...patch } : item,
            ),
          };
        },
      );
    };

    const handleSave = async (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (saveDisabled) {
        toast.error(
          t(
            'gallery.cannotSaveOwn',
            'You cannot save your own artwork.',
          ),
        );
        return;
      }
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

          const savedRes =
            res?.data?.saved ?? res?.saved ?? res?.data?.isSaved ?? res?.isSaved;
          const confirmedSaved =
            savedRes != null ? Boolean(savedRes) : next;
          setSaved(confirmedSaved);

          if (isPremiumPhoto) {
            queryClient.invalidateQueries({
              queryKey: PUBLIC_PREMIUM_PHOTOS_QUERY_KEY,
            });
            queryClient.invalidateQueries({
              queryKey: ['public-premium-photo-detail', id],
            });
          } else {
            patchPublicArtworkCaches({ isSaved: confirmedSaved });
            queryClient.invalidateQueries({ queryKey: ['saved-artworks'] });
            queryClient.invalidateQueries({ queryKey: ['artwork-detail', id] });
          }

          toast.success(
            res?.message ||
              (confirmedSaved
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
    const isEngagementDisabled = Boolean(engagementDisabled);

    const revertEngagement = (wasNext) => {
      setLiked(!wasNext);
      setLikesCount((prev) =>
        wasNext ? Math.max(0, prev - 1) : prev + 1,
      );
    };

    const applyEngagementResponse = (res) => {
      const count =
        res?.data?.votesCount ??
        res?.votesCount ??
        res?.data?.likesCount ??
        res?.likesCount ??
        res?.data?.likes ??
        res?.likes;
      if (count != null) {
        setLikesCount(parseCount(count));
      }
      const engagedRes =
        res?.data?.voted ??
        res?.voted ??
        res?.data?.isVoted ??
        res?.isVoted ??
        res?.data?.isLiked ??
        res?.isLiked ??
        res?.data?.liked ??
        res?.liked;
      if (engagedRes != null) {
        setLiked(Boolean(engagedRes));
      }
    };

    const handleLike = async (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (isEngagementDisabled) return;
      const next = !liked;
      setLiked(next);
      setLikesCount((prev) => (next ? prev + 1 : Math.max(0, prev - 1)));
      if (onLikeToggle) {
        try {
          const result = onLikeToggle(next, id);
          if (result != null && typeof result.then === 'function') {
            const res = await result;
            applyEngagementResponse(res);
          }
        } catch {
          // Parent mutation shows the error toast; only revert optimistic UI here
          revertEngagement(next);
        }
        return;
      }
      if (id) {
        if (isVoteMode) {
          try {
            const res = await voteArtworkApi(id);
            applyEngagementResponse(res);
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
            revertEngagement(next);
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

          applyEngagementResponse(res);

          const likedRes =
            res?.data?.liked ??
            res?.liked ??
            res?.data?.isLiked ??
            res?.isLiked;
          const confirmedLiked =
            likedRes != null ? Boolean(likedRes) : next;
          const count =
            res?.data?.likesCount ??
            res?.likesCount ??
            res?.data?.likes ??
            res?.likes;

          setLiked(confirmedLiked);
          writeLikedArtworkId(id, confirmedLiked);

          if (isPremiumPhoto) {
            queryClient.invalidateQueries({
              queryKey: PUBLIC_PREMIUM_PHOTOS_QUERY_KEY,
            });
            queryClient.invalidateQueries({
              queryKey: ['public-premium-photo-detail', id],
            });
          } else {
            const patch = { isLiked: confirmedLiked };
            if (count != null) {
              const confirmedCount = parseCount(count);
              patch.likesCount = confirmedCount;
              patch.likes = confirmedCount.toLocaleString('en-US');
            }
            patchPublicArtworkCaches(patch);
            queryClient.invalidateQueries({
              queryKey: ['artwork-detail', id],
            });
          }

          toast.success(
            res?.message ||
              (confirmedLiked
                ? t('gallery.likedSuccess', 'Added to likes')
                : t('gallery.unlikedSuccess', 'Removed from likes')),
          );
        } catch (err) {
          revertEngagement(next);
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
      setMenuOpen((prev) => !prev);
    };

    const openDetail = () => {
      if (!href || href === '#') return;
      if (/^https?:\/\//.test(href)) {
        window.location.assign(href);
        return;
      }
      navigate(href);
    };

    const handleCardActivate = (event) => {
      if (
        event.target.closest('button') ||
        event.target.closest('a') ||
        event.target.closest('[role="menu"]') ||
        event.target.closest('[data-card-interactive]')
      ) {
        return;
      }
      openDetail();
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
          role="link"
          tabIndex={0}
          onClick={handleCardActivate}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              handleCardActivate(event);
            }
          }}
          className={`group flex h-full cursor-pointer flex-col overflow-hidden [content-visibility:auto] [contain-intrinsic-size:auto_420px] ${className}`.trim()}
        >
            <div className="relative aspect-368/252 overflow-hidden bg-[#f3f4f6]">
              {isVideoCard && videoUrl && !image ? (
                <div className="relative h-full w-full bg-[#0d0d14]">
                  <video
                    src={videoUrl}
                    preload="none"
                    muted
                    playsInline
                    className="pointer-events-none h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25">
                    <div className="flex size-11 items-center justify-center rounded-full bg-white text-[#0d0d14] shadow-md">
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
                    src={optimizeImageUrl(image, 480)}
                    alt={imageAlt ?? title}
                    width={368}
                    height={252}
                    sizes="(max-width:640px) 100vw, (max-width:1280px) 50vw, 25vw"
                    className="pointer-events-none h-full w-full object-cover"
                  />
                  {isVideoCard && videoUrl && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/15">
                      <div className="flex size-11 items-center justify-center rounded-full bg-white text-[#0d0d14] shadow-md">
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

              {promoted ? (
                <span className="absolute bottom-3 left-3 z-10 rounded-md bg-[#ee1c25] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.35px] text-white shadow-sm">
                  {t('common.promoted', 'Promoted')}
                </span>
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
                  className="absolute right-3 top-3 inline-flex size-8 cursor-pointer items-center justify-center rounded-full bg-white text-[#161c27] shadow-sm transition hover:bg-[#f8fafc]"
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
                <div className="absolute right-3 top-3 z-20" ref={menuWrapRef}>
                  <Button
                    unstyled
                    type="button"
                    onClick={handleMenu}
                    aria-label={t('gallery.moreActions', {
                      defaultValue: 'More actions',
                    })}
                    className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/55 text-white transition hover:bg-black/70"
                  >
                    <MoreVertical
                      size={16}
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                  </Button>
                  {menuOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 top-10 z-30 min-w-40 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-xl transition animate-in fade-in"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <button
                        type="button"
                        role="menuitem"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setMenuOpen(false);
                          setAwardOpen(true);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] font-semibold text-gray-700 transition hover:bg-gray-50"
                      >
                        <Camera size={14} className="text-amber-500" />
                        <span>
                          {t(
                            'photographerProfile.appreciation.giveAward',
                            'Give Award',
                          )}
                        </span>
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setMenuOpen(false);
                          setReportOpen(true);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        <Flag size={14} className="text-red-500" />
                        <span>
                          {t('gallery.reportModal.title', 'Report Photo')}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
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
                disabled={saveDisabled}
                aria-pressed={saved}
                aria-disabled={saveDisabled}
                title={
                  saveDisabled
                    ? t(
                        'gallery.cannotSaveOwn',
                        'You cannot save your own artwork.',
                      )
                    : undefined
                }
                aria-label={
                  saveDisabled
                    ? t(
                        'gallery.cannotSaveOwn',
                        'You cannot save your own artwork.',
                      )
                    : saved
                      ? t('gallery.unsave', {
                          title,
                          defaultValue: `Unsave ${title}`,
                        })
                      : t('gallery.saveAction', {
                          title,
                          defaultValue: `Save ${title}`,
                        })
                }
                className={`absolute bottom-4 left-4 z-20 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-semibold leading-none shadow-sm transition ${
                  saved
                    ? 'bg-[#ee1c25] text-white'
                    : 'bg-[#fff1f2] text-[#ee1c25]'
                } ${
                  saveDisabled
                    ? 'cursor-not-allowed opacity-60'
                    : 'cursor-pointer'
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

            <div className="flex flex-1 flex-col p-4">
              <TitleTag
                title={typeof title === 'string' ? title : undefined}
                className={`text-[18px] font-bold leading-[1.3] text-[#0d0d14] group-hover:text-[#4048cd] line-clamp-2 lg:line-clamp-1 ${titleClassName}`.trim()}
              >
                {title}
              </TitleTag>

              <p className="mt-2 min-h-[2.625rem] line-clamp-2 text-[14px] leading-normal text-[#6b7280]">
                {description || '\u00A0'}
              </p>

              <div className="mt-auto flex w-full items-center justify-between gap-2 pt-3 text-[13px] font-medium">
                <Button
                  unstyled
                  type="button"
                  onClick={handleLike}
                  disabled={isEngagementDisabled}
                  aria-pressed={liked}
                  aria-disabled={isEngagementDisabled}
                  title={
                    isEngagementDisabled
                      ? t(
                          'competitionsPage.votingClosed',
                          'Voting is closed. This competition has already ended.',
                        )
                      : undefined
                  }
                  aria-label={
                    isEngagementDisabled
                      ? t(
                          'competitionsPage.votingClosed',
                          'Voting is closed. This competition has already ended.',
                        )
                      : liked
                        ? isVoteMode
                          ? t('gallery.unvote', { defaultValue: 'Remove vote' })
                          : t('gallery.unlike', { defaultValue: 'Unlike photo' })
                        : isVoteMode
                          ? t('gallery.vote', { defaultValue: 'Vote for photo' })
                          : t('gallery.like', { defaultValue: 'Like photo' })
                  }
                  className={`relative z-10 inline-flex items-center gap-1.5 transition ${
                    isEngagementDisabled
                      ? 'cursor-not-allowed text-[#c4c9d4] opacity-70'
                      : liked
                        ? 'cursor-pointer text-[#ee1c25] hover:opacity-80'
                        : 'cursor-pointer text-[#6b7280] hover:text-[#ee1c25]'
                  }`}
                >
                  <Heart
                    size={18}
                    strokeWidth={2.25}
                    aria-hidden="true"
                    className={
                      isEngagementDisabled
                        ? 'fill-transparent text-[#c4c9d4]'
                        : liked
                          ? 'fill-[#ee1c25] text-[#ee1c25]'
                          : 'fill-transparent text-[#6b7280]'
                    }
                  />
                  <span
                    className={
                      liked ? 'font-semibold text-[#ee1c25]' : 'text-[#6b7280]'
                    }
                  >
                    {likesCount.toLocaleString('en-US')}
                  </span>
                </Button>
                {views ? (
                  <span className="inline-flex items-center gap-1.5 text-[#6b7280]">
                    <Eye size={18} strokeWidth={2.25} aria-hidden="true" />
                    {views}
                  </span>
                ) : null}
                {date ? (
                  <span className="inline-flex items-center gap-1.5 text-[#6b7280]">
                    <Calendar size={18} strokeWidth={2.25} aria-hidden="true" />
                    {date}
                  </span>
                ) : null}
                {awards ? (
                  <PhotographerAwardCounters
                    awards={awards}
                    submissionId={id}
                    artworkTitle={title}
                    photographerName={photographerName || photographer}
                    artworkImage={image}
                    userId={userId}
                    size="sm"
                    interactive
                  />
                ) : null}
              </div>

              {showPrice ? (
                <p className="mt-3 text-[18px] font-bold leading-none text-[#4048cd]">
                  {price}
                </p>
              ) : null}
            </div>
        </MarketingCard>

        {reportOpen ? (
          <ReportPhotoModal
            open={reportOpen}
            onClose={() => setReportOpen(false)}
            photoTitle={title}
            onSubmit={handleReport}
          />
        ) : null}

        {awardOpen ? (
          <AwardArtworkModal
            open={awardOpen}
            onClose={() => setAwardOpen(false)}
            submissionId={id}
            artworkTitle={title}
            photographerName={photographerName || photographer}
            artworkImage={image}
            userId={userId}
            appreciation={awards}
          />
        ) : null}
      </>
    );
  },
);

PhotoShowcaseCard.displayName = 'PhotoShowcaseCard';

export default PhotoShowcaseCard;
