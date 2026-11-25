import { useQuery } from '@tanstack/react-query';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import {
  ADMIN_BUSINESS_LINK_ASSETS,
  ARROW_ICON_SIZE,
  BUSINESS_LINK_SLIDE_MS,
  buildBusinessAlbumSlides,
  getInitials,
} from '@/portals/admin/data/adminBusinessLinkData';
import {
  PUBLIC_BUSINESS_LINK_QUERY_KEY,
  getPublicBusinessLinkApi,
} from '@/shared/api/businessLinks.api';
import { getApiErrorMessage } from '@/shared/api/client';
import { getPublicUserCardApi } from '@/shared/api/userProfile.api';
import { ROUTES } from '@/shared/config';
import { useSEO } from '@/shared/hooks/useSEO';
import { getLocalizedText } from '@/shared/utils/localizedText';
import { resolveMediaUrl } from '@/shared/utils/media';

const guessUsernameFromAvatar = (avatar) => {
  if (!avatar || typeof avatar !== 'string') return '';
  try {
    const value = new URL(avatar).searchParams.get('u');
    if (value && /^[a-zA-Z0-9._-]{3,30}$/.test(value)) return value;
  } catch {
    // ignore invalid avatar URLs
  }
  return '';
};

const UserAvatar = memo(({ src, name, className }) =>
  src ? (
    <Image
      src={resolveMediaUrl(src)}
      alt=""
      className={`shrink-0 rounded-full object-cover ${className}`}
    />
  ) : (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-[#eff4ff] font-bold text-[#2563eb] ${className}`}
    >
      {getInitials(name)}
    </div>
  ),
);

UserAvatar.displayName = 'UserAvatar';

const BusinessLinkPublic = memo(() => {
  const { t, i18n } = useTranslation();
  const { albumId } = useParams();
  const [activeIndex, setActiveIndex] = useState(0);

  const detailQuery = useQuery({
    queryKey: [...PUBLIC_BUSINESS_LINK_QUERY_KEY, albumId],
    queryFn: () => getPublicBusinessLinkApi(albumId),
    enabled: Boolean(albumId),
    retry: (failureCount, error) =>
      error?.response?.status !== 404 && failureCount < 1,
  });

  const detail = detailQuery.data ?? null;
  const title = getLocalizedText(detail?.title, i18n.language);
  const story = getLocalizedText(detail?.story, i18n.language);
  const ownerName =
    detail?.user?.name ||
    t('businessLinkPublic.photographerFallback', 'Photographer');
  const ownerUserId = detail?.user?.id || detail?.userId || null;

  const usernameFromAlbum = String(detail?.user?.username || '')
    .trim()
    .replace(/^@/, '');
  const usernameFromAvatar = guessUsernameFromAvatar(detail?.user?.avatar);

  const cardQuery = useQuery({
    queryKey: ['public-user-card', ownerUserId],
    queryFn: () => getPublicUserCardApi(ownerUserId),
    enabled: Boolean(ownerUserId) && !usernameFromAlbum && !usernameFromAvatar,
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });

  const ownerUsername =
    usernameFromAlbum ||
    usernameFromAvatar ||
    String(cardQuery.data?.username || '')
      .trim()
      .replace(/^@/, '');
  const profileHref = ownerUsername
    ? `/photographer/${encodeURIComponent(ownerUsername)}`
    : null;

  useSEO({
    title: title || t('businessLinkPublic.titleFallback', 'Business Portfolio'),
    description:
      story ||
      t(
        'businessLinkPublic.seoDescription',
        'Shared business portfolio on My12Photos.',
      ),
    keywords: ['business link', 'portfolio', 'My12Photos', title].filter(
      Boolean,
    ),
  });

  const slides = useMemo(
    () => buildBusinessAlbumSlides(detail?.images),
    [detail?.images],
  );
  const slideCount = slides.length;
  const activeSlide = slides[activeIndex] || slides[0] || null;

  useEffect(() => {
    setActiveIndex(0);
  }, [albumId]);

  useEffect(() => {
    if (slideCount <= 1) return undefined;
    const timerId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slideCount);
    }, BUSINESS_LINK_SLIDE_MS);
    return () => window.clearInterval(timerId);
  }, [slideCount]);

  if (detailQuery.isLoading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-8 w-48 animate-pulse rounded bg-[#e5e7eb]" />
        <div className="mt-6 aspect-[16/7] w-full animate-pulse rounded-2xl bg-[#e5e7eb]" />
        <div className="mt-6 h-10 w-2/3 animate-pulse rounded bg-[#e5e7eb]" />
      </div>
    );
  }

  if (detailQuery.isError || !detail) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col items-start gap-4 px-4 py-16 sm:px-6">
        <h1 className="font-manrope text-[28px] font-bold text-[#111827]">
          {t('businessLinkPublic.notFoundTitle', 'Portfolio not found')}
        </h1>
        <p className="text-[16px] text-[#6b7280]">
          {getApiErrorMessage(
            detailQuery.error,
            t(
              'businessLinkPublic.notFoundBody',
              'This business link is invalid or no longer available.',
            ),
          )}
        </p>
        <Link
          to={ROUTES.HOME}
          className="text-[15px] font-semibold text-[#4048cd] hover:underline"
        >
          {t('businessLinkPublic.backHome', 'Back to home')}
        </Link>
      </div>
    );
  }

  const isBlueTheme = activeSlide?.theme === 'blue';
  const badgeBg = isBlueTheme ? 'bg-[#4048cd]' : 'bg-[#ee1c25]';

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {activeSlide ? (
        <section className="relative aspect-[16/7] w-full overflow-hidden rounded-2xl bg-[#f3f4f6]">
          <Image
            src={activeSlide.hero}
            alt={title ? `${title} — ${activeSlide.sign}` : activeSlide.sign}
            className="absolute inset-0 size-full object-cover"
          />
          <div
            className={`absolute left-4 top-4 inline-flex items-end gap-2 rounded-[20px] px-4 py-1.5 sm:left-6 sm:top-6 ${badgeBg}`}
          >
            {activeSlide.icon ? (
              <Image
                src={activeSlide.icon}
                alt=""
                width={24}
                height={21}
                className="h-[21px] w-6 object-contain"
              />
            ) : null}
            <span className="text-[16px] text-white sm:text-[20px]">
              {activeSlide.sign}
            </span>
          </div>

          {slideCount > 1 ? (
            <>
              <Button
                unstyled
                type="button"
                aria-label={t('businessLinkPublic.previousPhoto', 'Previous photo')}
                onClick={() =>
                  setActiveIndex((current) =>
                    current === 0 ? slideCount - 1 : current - 1,
                  )
                }
                className="absolute left-3 top-1/2 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/70 transition hover:bg-white sm:left-4 sm:size-[51px]"
              >
                <Image
                  src={ADMIN_BUSINESS_LINK_ASSETS.arrow}
                  alt=""
                  width={ARROW_ICON_SIZE}
                  height={32}
                  className="h-8 w-4 rotate-180"
                />
              </Button>
              <Button
                unstyled
                type="button"
                aria-label={t('businessLinkPublic.nextPhoto', 'Next photo')}
                onClick={() =>
                  setActiveIndex((current) => (current + 1) % slideCount)
                }
                className="absolute right-3 top-1/2 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/70 transition hover:bg-white sm:right-4 sm:size-[51px]"
              >
                <Image
                  src={ADMIN_BUSINESS_LINK_ASSETS.arrow}
                  alt=""
                  width={ARROW_ICON_SIZE}
                  height={32}
                  className="h-8 w-4"
                />
              </Button>
            </>
          ) : null}
        </section>
      ) : (
        <p className="rounded-2xl bg-white px-6 py-12 text-center text-[16px] text-[#687186]">
          {t('businessLinkPublic.noPhotos', 'This portfolio has no photos yet.')}
        </p>
      )}

      {slideCount > 1 ? (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {slides.map((slide, index) => (
            <Button
              key={slide.id}
              unstyled
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-current={index === activeIndex ? 'true' : undefined}
              className={`size-20 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition sm:size-24 ${
                index === activeIndex
                  ? slide.theme === 'blue'
                    ? 'border-[#4048cd]'
                    : 'border-[#ee1c25]'
                  : 'border-transparent'
              }`}
            >
              <Image
                src={slide.thumb}
                alt=""
                className="size-full object-cover"
              />
            </Button>
          ))}
        </div>
      ) : null}

      <section className="flex flex-col gap-4">
        <h1 className="font-manrope text-[28px] font-extrabold tracking-tight text-[#111827] sm:text-[36px]">
          {title || t('businessLinkPublic.untitled', 'Untitled portfolio')}
        </h1>
        {story ? (
          <p className="whitespace-pre-line text-[16px] leading-7 text-[#374151] sm:text-[18px] sm:leading-8">
            {story}
          </p>
        ) : null}
      </section>

      <section className="flex flex-col gap-4 border-t border-[#e5e7eb] pt-6 sm:flex-row sm:items-center sm:justify-between">
        {profileHref ? (
          <Link
            to={profileHref}
            className="group inline-flex items-center gap-3 rounded-xl transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4048cd]"
            aria-label={t('businessLinkPublic.viewProfile', {
              name: ownerName,
              defaultValue: `View ${ownerName}'s profile`,
            })}
          >
            <UserAvatar
              src={detail.user?.avatar}
              name={ownerName}
              className="size-14 text-[16px]"
            />
            <div>
              <p className="text-[13px] font-medium uppercase tracking-wide text-[#9ca3af]">
                {t('businessLinkPublic.photographerLabel', 'Photographer')}
              </p>
              <p className="text-[16px] font-semibold text-[#111827] group-hover:text-[#4048cd]">
                {ownerName}
              </p>
            </div>
          </Link>
        ) : (
          <div className="inline-flex items-center gap-3">
            <UserAvatar
              src={detail.user?.avatar}
              name={ownerName}
              className="size-14 text-[16px]"
            />
            <div>
              <p className="text-[13px] font-medium uppercase tracking-wide text-[#9ca3af]">
                {t('businessLinkPublic.photographerLabel', 'Photographer')}
              </p>
              <p className="text-[16px] font-semibold text-[#111827]">
                {ownerName}
              </p>
            </div>
          </div>
        )}

        {profileHref ? (
          <Link
            to={profileHref}
            className="inline-flex w-fit cursor-pointer items-center justify-center rounded-lg bg-[#4048cd] px-4 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#343aa8]"
          >
            {t('businessLinkPublic.visitProfile', 'Visit profile')}
          </Link>
        ) : null}
      </section>
    </div>
  );
});

BusinessLinkPublic.displayName = 'BusinessLinkPublic';

export default BusinessLinkPublic;
