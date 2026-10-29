import { useQueryClient } from '@tanstack/react-query';
import { Bookmark, Heart, Share2 } from 'lucide-react';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { selectUser } from '@/app/store/slices/authSlice';
import AiGeneratedDetailNotice from '@/components/data-display/AiGeneratedDetailNotice/AiGeneratedDetailNotice';
import AiGeneratedPhotoBadge from '@/components/data-display/AiGeneratedPhotoBadge/AiGeneratedPhotoBadge';
import GalleryDetailDonation from '@/components/data-display/GalleryDetailDonation/GalleryDetailDonation';
import GalleryDetailImageDetails from '@/components/data-display/GalleryDetailImageDetails/GalleryDetailImageDetails';
import GalleryDetailVideo from '@/components/data-display/GalleryDetailVideo/GalleryDetailVideo';
import PhotoAiBadgeOverlay from '@/components/data-display/PhotoAiBadgeOverlay/PhotoAiBadgeOverlay';
import PhotographerAwardCounters from '@/components/data-display/PhotographerAwardCounters/PhotographerAwardCounters';
import SignBadge from '@/components/data-display/SignBadge/SignBadge';
import SixStoryStrip from '@/components/data-display/SixStoryStrip/SixStoryStrip';
import TwelveStoryStrip from '@/components/data-display/TwelveStoryStrip/TwelveStoryStrip';
import MarketingButton from '@/components/marketing/MarketingButton/MarketingButton';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import {
  toggleLikeArtworkApi,
  toggleSaveArtworkApi,
  triggerArtworkDownload,
  voteArtworkApi,
} from '@/shared/api/artworks.api';
import { getApiErrorMessage } from '@/shared/api/client';
import { captureDonationPaymentApi } from '@/shared/api/payments.api';
import { ROUTES } from '@/shared/config';
import {
  GALLERY_DETAIL_ASSETS as ASSETS,
  GALLERY_DETAIL_COMMENTS as COMMENTS,
  GALLERY_DETAIL_SLIDE_MS,
  GALLERY_DETAIL_VARIANTS,
  isBlueSlide,
  resolveGalleryDetailMedia,
  resolveGalleryImageDetails,
  toGalleryDetailEntry,
} from '@/shared/data/galleryDetail';
import { AppLink, ImgIcon, Shell, SitePageLayout } from '@/shared/site-chrome';
import { PAGE_STACK } from '@/shared/ui/actionStyles';
import GalleryDetailBreadcrumb from './GalleryDetailBreadcrumb';

const GalleryDetailView = memo(
  ({
    entry,
    variant = 'single',
    activeHref = ROUTES.GALLERY,
    Breadcrumb = GalleryDetailBreadcrumb,
    rootClassName: rootClassNameProp,
    isCompetition: isCompetitionProp,
  }) => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const user = useSelector(selectUser);

    const config =
      GALLERY_DETAIL_VARIANTS[variant] || GALLERY_DETAIL_VARIANTS.single;
    const rootClassName = rootClassNameProp ?? config.rootClassName;
    const story = toGalleryDetailEntry(entry);
    const slides = story.slides || [];
    const slideCount = slides.length;
    const showStoryChrome = Boolean(config.stripLayout) && slideCount > 1;

    // A simple heuristic for mock data matching: check if user's name matches the author's or photographer's name
    const isOwnSubmission = Boolean(
      user &&
        (user.id === story.userId ||
          (user.firstName &&
            story.photographer
              ?.toLowerCase()
              .includes(user.firstName.toLowerCase())) ||
          (user.username &&
            story.photographer
              ?.toLowerCase()
              .includes(user.username.toLowerCase()))),
    );

    const [activeIndex, setActiveIndex] = useState(0);
    const [comment, setComment] = useState('');
    const [donationOpen, setDonationOpen] = useState(true);

    const [voting, setVoting] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);
    const [isSaved, setIsSaved] = useState(
      Boolean(story.isSaved || story.saved),
    );
    const [saving, setSaving] = useState(false);
    const [isLiked, setIsLiked] = useState(
      Boolean(story.isLiked || story.liked),
    );
    const [liking, setLiking] = useState(false);
    const [likesCount, setLikesCount] = useState(
      () => Number(String(story.likes ?? '0').replace(/,/g, '')) || 0,
    );

    useEffect(() => {
      setIsLiked(Boolean(story.isLiked || story.liked));
      setLikesCount(Number(String(story.likes ?? '0').replace(/,/g, '')) || 0);
      setIsSaved(Boolean(story.isSaved || story.saved));
    }, [
      story.id,
      story.isLiked,
      story.liked,
      story.likes,
      story.isSaved,
      story.saved,
    ]);

    const artworkId = story?.id || entry?.id;
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    const capturedDonationRef = useRef(null);

    useEffect(() => {
      const paymentId =
        searchParams.get('paymentId') ||
        searchParams.get('token') ||
        sessionStorage.getItem('pendingDonationPaymentId');

      if (searchParams.get('cancel') || searchParams.get('cancelled')) {
        sessionStorage.removeItem('pendingDonationPaymentId');
        navigate(location.pathname, { replace: true });
        toast.info(
          t('galleryDetail.donation.cancelled', 'Donation was cancelled.'),
        );
        return;
      }

      if (
        paymentId &&
        (searchParams.get('token') ||
          searchParams.get('PayerID') ||
          searchParams.get('paymentId')) &&
        capturedDonationRef.current !== paymentId
      ) {
        capturedDonationRef.current = paymentId;
        sessionStorage.removeItem('pendingDonationPaymentId');

        captureDonationPaymentApi({ paymentId })
          .then((res) => {
            navigate(location.pathname, { replace: true });
            toast.success(
              res?.message ||
                t(
                  'galleryDetail.donation.success',
                  'Thank you for your generous donation!',
                ),
            );
          })
          .catch((err) => {
            navigate(location.pathname, { replace: true });
            toast.error(
              getApiErrorMessage(
                err,
                t(
                  'galleryDetail.donation.captureFailed',
                  'Failed to complete donation payment.',
                ),
              ),
            );
          });
      }
    }, [searchParams, location.pathname, navigate, t]);

    const isInCompetition =
      isCompetitionProp !== undefined
        ? Boolean(isCompetitionProp)
        : story?.competitionState === 'IN_COMPETITION' ||
          entry?.competitionState === 'IN_COMPETITION' ||
          Boolean(story?.competitionId) ||
          Boolean(entry?.competitionId) ||
          Boolean(story?.isCompetition) ||
          Boolean(entry?.isCompetition);

    const handleVote = async () => {
      if (!artworkId || isOwnSubmission || voting || hasVoted) return;
      try {
        setVoting(true);
        const res = await voteArtworkApi(artworkId);
        setHasVoted(true);
        toast.success(
          res?.message ||
            t('galleryDetail.voteSuccess', 'Your vote has been cast!'),
        );
      } catch (err) {
        toast.error(
          getApiErrorMessage(
            err,
            t('galleryDetail.voteFailed', 'Failed to cast vote.'),
          ),
        );
      } finally {
        setVoting(false);
      }
    };

    const handleSaveToggle = async () => {
      if (!artworkId || saving) return;
      const next = !isSaved;
      setIsSaved(next);
      try {
        setSaving(true);
        const res = await toggleSaveArtworkApi(artworkId);
        queryClient.invalidateQueries({
          queryKey: ['artwork-detail', artworkId],
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
      } finally {
        setSaving(false);
      }
    };

    const handleLikeToggle = async () => {
      if (!artworkId || liking) return;
      const next = !isLiked;
      setIsLiked(next);
      setLikesCount((prev) => (next ? prev + 1 : Math.max(0, prev - 1)));
      try {
        setLiking(true);
        const res = await toggleLikeArtworkApi(artworkId);
        const count =
          res?.data?.likesCount ??
          res?.likesCount ??
          res?.data?.likes ??
          res?.likes;
        if (count != null) {
          setLikesCount(Number(count));
        }
        const isLikedRes =
          res?.data?.isLiked ?? res?.isLiked ?? res?.data?.liked ?? res?.liked;
        if (isLikedRes != null) {
          setIsLiked(Boolean(isLikedRes));
        }
        queryClient.invalidateQueries({
          queryKey: ['artwork-detail', artworkId],
        });
        queryClient.invalidateQueries({ queryKey: ['saved-artworks'] });
        queryClient.invalidateQueries({ queryKey: ['user-artworks'] });
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
      } finally {
        setLiking(false);
      }
    };

    const activeSlide = slides[activeIndex] || slides[0];
    const blueBadge = isBlueSlide(activeSlide, config.stripAccent);

    const heroSrc = activeSlide?.hero || story.image;
    const heroAlt = activeSlide?.sign
      ? `${story.title} — ${activeSlide.sign}`
      : story.title;
    const { videoPoster, videoSrc, donationAvatar, donationBio } =
      resolveGalleryDetailMedia(story, heroSrc);
    const imageDetails = resolveGalleryImageDetails(story);

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

    const goPrev = () =>
      setActiveIndex((i) => (i === 0 ? slideCount - 1 : i - 1));
    const goNext = () =>
      setActiveIndex((i) => (i === slideCount - 1 ? 0 : i + 1));

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
              <Image
                src={heroSrc}
                alt={heroAlt}
                width={1536}
                height={653}
                className="absolute inset-0 h-full w-full object-cover"
              />
              {activeSlide ? (
                <SignBadge slide={activeSlide} blue={blueBadge} />
              ) : null}
              <PhotoAiBadgeOverlay
                show={story.isAiGenerated}
                placement="hero-end"
                size="lg"
              />

              {showStoryChrome ? (
                <>
                  <Button
                    unstyled
                    type="button"
                    onClick={goPrev}
                    aria-label={t('galleryDetail.previousPhoto')}
                    className="absolute left-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 backdrop-blur-sm sm:left-12.75 sm:size-12.75"
                  >
                    <Image
                      src={ASSETS.arrow}
                      alt=""
                      width={16}
                      height={32}
                      className="h-7 w-3.5 rotate-180 object-contain sm:h-8 sm:w-4"
                    />
                  </Button>
                  <Button
                    unstyled
                    type="button"
                    onClick={goNext}
                    aria-label={t('galleryDetail.nextPhoto')}
                    className="absolute right-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 backdrop-blur-sm sm:right-12.75 sm:size-12.75"
                  >
                    <Image
                      src={ASSETS.arrow}
                      alt=""
                      width={16}
                      height={32}
                      className="h-7 w-3.5 object-contain sm:h-8 sm:w-4"
                    />
                  </Button>
                </>
              ) : null}
            </div>

            {config.curveSrc ? (
              <div
                className={`relative mt-2 w-full overflow-hidden sm:mt-3 ${config.curveHeightClass}`}
              >
                <Image
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
              <GalleryDetailVideo
                poster={videoPoster}
                src={videoSrc}
                title={story.title}
              />

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
                  {story.isAiGenerated ? (
                    <AiGeneratedPhotoBadge variant="inline" size="md" />
                  ) : null}
                </div>

                <h1 className="mt-3 text-[26px] font-semibold leading-tight text-(--primary-text-heading-color) sm:mt-4 sm:text-[30px] xl:text-[32px]">
                  {story.title}
                </h1>
                {story.isAiGenerated ? (
                  <AiGeneratedDetailNotice className="mt-4" />
                ) : null}
                <p className="mt-3 max-w-3xl text-[16px] font-normal leading-6 text-(--primary-text-color) sm:mt-4 sm:text-[17px] sm:leading-6.75">
                  {story.description}
                </p>
              </div>

              <GalleryDetailImageDetails details={imageDetails} />

              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                {[
                  {
                    label: isInCompetition
                      ? t('galleryDetail.votesReceived')
                      : t('galleryDetail.likesCounted', 'Likes Counted'),
                    value: String(
                      isInCompetition
                        ? (story.votes ?? '0')
                        : likesCount > 0
                          ? likesCount
                          : (story.likes ?? '0'),
                    ).replace(/,/g, ''),
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
                {isInCompetition ? (
                  <MarketingButton
                    type="button"
                    disabled={isOwnSubmission || voting || hasVoted}
                    onClick={handleVote}
                    title={
                      isOwnSubmission
                        ? t('galleryDetail.cannotVoteOwn')
                        : hasVoted
                          ? t('galleryDetail.alreadyVoted', 'Already voted')
                          : undefined
                    }
                    className={
                      hasVoted ? 'bg-[#16a34a] hover:bg-[#15803d]' : ''
                    }
                  >
                    <ImgIcon src={ASSETS.voteHeart} size={20} />
                    {voting
                      ? t('common.voting', 'Voting...')
                      : hasVoted
                        ? t('galleryDetail.voted', 'Voted!')
                        : t('galleryDetail.castVote')}
                  </MarketingButton>
                ) : (
                  <MarketingButton
                    type="button"
                    variant="outline"
                    disabled={liking}
                    onClick={handleLikeToggle}
                    className={isLiked ? 'text-[#e53935] border-[#e53935]' : ''}
                  >
                    <Heart
                      size={18}
                      strokeWidth={2}
                      aria-hidden="true"
                      className={
                        isLiked
                          ? 'fill-[#e53935] text-[#e53935]'
                          : 'text-[#494453]'
                      }
                    />
                    <span>
                      {likesCount > 0 ? likesCount.toLocaleString('en-US') : ''}{' '}
                      {isLiked
                        ? t('common.liked', 'Liked')
                        : t('common.like', 'Like')}
                    </span>
                  </MarketingButton>
                )}

                <MarketingButton
                  type="button"
                  variant="outline"
                  disabled={saving}
                  onClick={handleSaveToggle}
                  className={isSaved ? 'text-[#ee1c25] border-[#ee1c25]' : ''}
                >
                  <Bookmark
                    size={18}
                    strokeWidth={2}
                    aria-hidden="true"
                    className={
                      isSaved
                        ? 'fill-[#ee1c25] text-[#ee1c25]'
                        : 'text-[#494453]'
                    }
                  />
                  {isSaved
                    ? t('gallery.saved', 'Saved')
                    : t('gallery.save', 'Save')}
                </MarketingButton>

                <MarketingButton
                  type="button"
                  onClick={async () => {
                    if (!artworkId) return;
                    try {
                      await triggerArtworkDownload(
                        artworkId,
                        story.title || 'photo',
                      );
                      toast.success(
                        t('galleryDetail.downloadStarted', 'Download started!'),
                      );
                    } catch (err) {
                      toast.error(
                        getApiErrorMessage(
                          err,
                          t('common.errors.general', 'Download failed.'),
                        ),
                      );
                    }
                  }}
                  className="bg-[#4048CD]! !hover:bg-[#333BB0] active:scale-[0.98]"
                >
                  {t('galleryDetail.downloadPhoto')}
                </MarketingButton>
                <MarketingButton
                  type="button"
                  variant="outline"
                  onClick={handleShare}
                >
                  <Share2
                    size={18}
                    strokeWidth={2}
                    aria-hidden="true"
                    className="text-[#e53935]"
                  />
                  {t('galleryDetail.share')}
                </MarketingButton>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src={ASSETS.photographer}
                    alt={story.photographer}
                    width={57}
                    height={57}
                    className="size-12 rounded-full object-cover sm:size-14.25"
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[14px] leading-5 text-[#6b7280]">
                        {t('galleryDetail.photographerLabel')}
                      </p>
                      <PhotographerAwardCounters awards={story.awards} />
                    </div>
                    <p className="text-[16px] font-semibold leading-6 text-(--primary-text-heading-color) sm:text-[18px]">
                      {story.photographer}
                    </p>
                  </div>
                </div>
                <MarketingButton
                  as={AppLink}
                  href={ROUTES.PHOTOGRAPHER_PROFILE}
                  className="shrink-0 bg-[#4048CD]! hover:bg-[#333BB0]!"
                >
                  {t('galleryDetail.photographerProfile')}
                </MarketingButton>
              </div>

              {donationOpen ? (
                <GalleryDetailDonation
                  submissionId={artworkId}
                  photographer={story.photographer}
                  avatar={donationAvatar}
                  bio={donationBio}
                  onClose={() => setDonationOpen(false)}
                />
              ) : (
                <MarketingButton
                  type="button"
                  variant="muted"
                  onClick={() => setDonationOpen(true)}
                >
                  {t('galleryDetail.donation.reopen', {
                    name: story.photographer,
                  })}
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
                          <Image
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
                      <p className="mt-2.5 text-[14px] leading-5 text-[#475156]">
                        {item.text}
                      </p>
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
