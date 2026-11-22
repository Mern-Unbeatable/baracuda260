import { useQuery } from '@tanstack/react-query';
import { ChevronDown, Funnel, RefreshCw } from 'lucide-react';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectUser } from '@/app/store/slices/authSlice';
import PhotoShowcaseCard from '@/components/data-display/PhotoShowcaseCard/PhotoShowcaseCard';
import MarketingButton from '@/components/marketing/MarketingButton/MarketingButton';
import SectionHeader from '@/components/marketing/SectionHeader/SectionHeader';
import Button from '@/components/ui/Button';
import {
  getPublicArtworksApi,
  PUBLIC_ARTWORKS_QUERY_KEY,
} from '@/shared/api/artworks.api';
import { ROUTES } from '@/shared/config';
import {
  ALBUM_TYPE_LABEL_KEYS,
  ALBUM_TYPE_SHORT_LABEL_KEYS,
  ALBUM_TYPES,
} from '@/shared/data/albumTypes';
import { AppLink, homeAsset, Shell } from '@/shared/site-chrome';

const SHOWCASE_BADGE_KEYS = {
  'Single Photo': 'common.badges.singlePhoto',
  '6 PHOTOS STORY': 'common.badges.sixPhotosStory',
  '6 Photos Story': 'common.badges.sixPhotosStory',
  '12 Photos - Full Zodiac Story': 'common.badges.twelveZodiacFull',
  '12 photos - full Zodiac Story': 'common.badges.twelveZodiacFull',
};

const ALL_FILTER = 'ALL';
const SHOWCASE_LIMIT = 8;

const FILTER_OPTIONS = [
  {
    id: 'all',
    value: ALL_FILTER,
    kind: undefined,
    labelKey: 'common.all',
    shortLabelKey: 'common.filtersShort.all',
  },
  ...ALBUM_TYPES.map((type) => {
    let kind = 'SINGLE';
    if (/12|zodiac/i.test(type.value)) kind = 'TWELVE';
    else if (/6/i.test(type.value)) kind = 'SIX';
    return {
      id: type.id,
      value: type.value,
      kind,
      labelKey: ALBUM_TYPE_LABEL_KEYS[type.value] || type.labelKey,
      shortLabelKey:
        ALBUM_TYPE_SHORT_LABEL_KEYS[type.value] || type.shortLabelKey,
    };
  }),
];

const albumTypeToKind = (filterValue) => {
  if (!filterValue || filterValue === ALL_FILTER) return undefined;
  if (/12|zodiac/i.test(filterValue)) return 'TWELVE';
  if (/6/i.test(filterValue)) return 'SIX';
  if (/single/i.test(filterValue)) return 'SINGLE';
  return undefined;
};

const CommunityWorkFilterDropdown = memo(
  ({ value, onChange, options, ariaLabel }) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const rootRef = useRef(null);

    const selected =
      options.find((option) => option.value === value) || options[0];

    useEffect(() => {
      if (!open) return undefined;
      const onPointerDown = (event) => {
        if (!rootRef.current?.contains(event.target)) setOpen(false);
      };
      const onKeyDown = (event) => {
        if (event.key === 'Escape') setOpen(false);
      };
      document.addEventListener('mousedown', onPointerDown);
      document.addEventListener('keydown', onKeyDown);
      return () => {
        document.removeEventListener('mousedown', onPointerDown);
        document.removeEventListener('keydown', onKeyDown);
      };
    }, [open]);

    return (
      <div
        ref={rootRef}
        className="relative z-20 w-[13.5rem] shrink-0 self-start"
      >
        <Button
          unstyled
          type="button"
          aria-label={ariaLabel}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
          className={`inline-flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg bg-[#f0f0f0] px-3 py-2 text-[14px] font-semibold text-[#222] transition hover:bg-[#e6e6e6] ${
            open ? 'ring-2 ring-[#4048cd]/25' : ''
          }`}
        >
          <span className="truncate">
            {t(selected.shortLabelKey || selected.labelKey)}
          </span>
          <ChevronDown
            size={16}
            strokeWidth={2.25}
            className={`shrink-0 text-[#6b7280] transition-transform duration-200 ${
              open ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </Button>

        {open ? (
          <ul
            role="listbox"
            aria-label={ariaLabel}
            onMouseDown={(event) => event.stopPropagation()}
            className="absolute inset-x-0 top-[calc(100%+0.375rem)] z-50 w-full overflow-hidden rounded-lg border border-black/10 bg-white py-1.5 shadow-[0_12px_30px_rgba(13,13,20,0.12)]"
          >
            {options.map((option) => {
              const active = option.value === value;
              return (
                <li key={option.id} role="option" aria-selected={active}>
                  <button
                    type="button"
                    onMouseDown={(event) => event.stopPropagation()}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className={`flex w-full cursor-pointer items-center gap-2 px-3 py-2.5 text-left text-[13px] leading-snug transition ${
                      active
                        ? 'bg-[#4048cd]/10 font-semibold text-[#4048cd]'
                        : 'font-medium text-[#222] hover:bg-[#f7f8fa]'
                    }`}
                  >
                    <span className="min-w-0 flex-1 truncate">
                      {t(option.shortLabelKey || option.labelKey)}
                    </span>
                    {active ? (
                      <span
                        className="shrink-0 text-[12px] font-bold text-[#4048cd]"
                        aria-hidden="true"
                      >
                        ✓
                      </span>
                    ) : (
                      <span className="w-3 shrink-0" aria-hidden="true" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    );
  },
);

CommunityWorkFilterDropdown.displayName = 'CommunityWorkFilterDropdown';

const CommunityWork = memo(() => {
  const { t } = useTranslation();
  const currentUser = useSelector(selectUser);
  const [filter, setFilter] = useState(ALL_FILTER);

  const kind = useMemo(() => albumTypeToKind(filter), [filter]);

  const {
    data: artworksResult,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      ...PUBLIC_ARTWORKS_QUERY_KEY,
      'home-trending',
      { status: 'PROFILE_ONLY', kind: kind || 'ALL', sort: 'popular', limit: SHOWCASE_LIMIT },
    ],
    queryFn: () =>
      getPublicArtworksApi({
        status: 'PROFILE_ONLY',
        page: 1,
        limit: SHOWCASE_LIMIT,
        kind,
        sort: 'popular',
      }),
  });

  const photos = artworksResult?.data || [];

  return (
    <section className="bg-white section-py">
      <Shell>
        <SectionHeader
          className="mb-8 lg:mb-13"
          align="left"
          badge={t('home.showcase.eyebrow')}
          badgeTone="indigo"
          title={t('home.showcase.title')}
          endClassName="sm:w-auto sm:flex-none"
          end={
            <CommunityWorkFilterDropdown
              value={filter}
              onChange={setFilter}
              options={FILTER_OPTIONS}
              ariaLabel={t('home.showcase.filterByType', 'Filter by album type')}
            />
          }
        />

        {isLoading ? (
          <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-[#e5e7eb] bg-[#f9fafb]">
            <RefreshCw
              size={22}
              className="animate-spin text-[#4048cd]"
              aria-hidden="true"
            />
            <span className="sr-only">{t('common.loading', 'Loading...')}</span>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] p-8 text-center">
            <p className="text-[15px] font-medium text-[#111827]">
              {error?.response?.data?.error ||
                error?.message ||
                t(
                  'home.showcase.error',
                  'Could not load trending artworks. Please try again.',
                )}
            </p>
            <Button
              unstyled
              type="button"
              onClick={() => refetch()}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#0d0d14] px-4 py-2 text-[14px] font-medium text-white transition hover:bg-[#23232c]"
            >
              <RefreshCw size={14} aria-hidden="true" />
              {t('common.retry', 'Try again')}
            </Button>
          </div>
        ) : photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] p-8 text-center sm:p-12">
            <div className="flex size-14 items-center justify-center rounded-full bg-[#f3f4f6] text-[#6b7280]">
              <Funnel size={24} />
            </div>
            <h3 className="mt-4 text-[16px] font-semibold text-[#111827]">
              {t('home.showcase.emptyTitle', 'No artworks found')}
            </h3>
            <p className="mt-2 text-[14px] text-[#6b7280]">
              {t(
                'home.showcase.emptyBody',
                'Try another album type or check back soon for new community work.',
              )}
            </p>
          </div>
        ) : (
          <div
            className={`grid gap-5 sm:grid-cols-2 xl:grid-cols-4 ${
              isFetching ? 'opacity-70 transition-opacity' : ''
            }`}
          >
            {photos.map((photo) => {
              const ownerId = photo.user?.id || photo.userId;
              const isOwnArtwork =
                Boolean(currentUser?.id) &&
                Boolean(ownerId) &&
                currentUser.id === ownerId;

              return (
                <PhotoShowcaseCard
                  key={photo.id}
                  id={photo.id}
                  href={photo.detailPath || `/gallery/${photo.id}`}
                  image={photo.image}
                  imageAlt={photo.title}
                  kind={photo.kind}
                  title={photo.title}
                  badge={t(SHOWCASE_BADGE_KEYS[photo.badge] || photo.badge, {
                    defaultValue: photo.badge,
                  })}
                  description={photo.description}
                  engagementType="like"
                  likes={photo.likes}
                  views={photo.views}
                  date={photo.date}
                  isAiGenerated={photo.isAiGenerated}
                  initialLiked={photo.isLiked}
                  initialSaved={photo.isSaved}
                  saveDisabled={isOwnArtwork}
                  photographer={photo.photographer || photo.author}
                  userId={ownerId}
                />
              );
            })}
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <MarketingButton
            as={AppLink}
            href={ROUTES.GALLERY}
            variant="primaryLg"
            icon={homeAsset('icon-arrow-gallery.svg')}
          >
            {t('home.showcase.viewFullGallery')}
          </MarketingButton>
        </div>
      </Shell>
    </section>
  );
});

CommunityWork.displayName = 'CommunityWork';

export default CommunityWork;
