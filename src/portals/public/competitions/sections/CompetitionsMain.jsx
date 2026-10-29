import { useQuery } from '@tanstack/react-query';
import { AlertCircle, Funnel, Loader2, RefreshCw, X } from 'lucide-react';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import Pagination from '@/components/common/Pagination/Pagination';
import PhotoShowcaseCard from '@/components/data-display/PhotoShowcaseCard/PhotoShowcaseCard';
import FilterCheckboxGroup from '@/components/marketing/FilterCheckboxGroup/FilterCheckboxGroup';
import MarketingSearchBar from '@/components/marketing/MarketingSearchBar/MarketingSearchBar';
import SectionHeader from '@/components/marketing/SectionHeader/SectionHeader';
import Button from '@/components/ui/Button';
import {
  getPublicArtworksApi,
  PUBLIC_ARTWORKS_QUERY_KEY,
} from '@/shared/api/artworks.api';
import {
  CATEGORIES_QUERY_KEY,
  getCategoriesApi,
} from '@/shared/api/categories.api';
import { getApiErrorMessage } from '@/shared/api/client';
import { ROUTES } from '@/shared/config';
import {
  ALBUM_TYPE_LABEL_KEYS,
  ALBUM_TYPE_VALUES,
  matchesAlbumType,
} from '@/shared/data/albumTypes';
import { Shell, SitePageLayout } from '@/shared/site-chrome';

const SHOWCASE_BADGE_KEYS = {
  'Single Photo': 'common.badges.singlePhoto',
  '6 Photos Story': 'common.badges.sixPhotosStory',
  '12 photos - full Zodiac Story': 'common.badges.twelveZodiacFull',
};

const PAGE_SIZE = 10;

const DEFAULT_CATEGORIES = [
  'Nature',
  'Portrait',
  'Landscape',
  'Travel',
  'Wedding',
  'Macro',
  'Fine Art',
  'Pets',
  'Sports',
  'Night Photography',
];

const DEFAULT_SUBCATEGORIES = {
  Nature: [
    'Mountain',
    'Forest',
    'Wildlife',
    'Rivers & Lakes',
    'Oceans & Beaches',
    'Flowers & Plants',
    'Sky & Clouds',
    'Weather & Storms',
  ],
  Portrait: ['Professional', 'Lifestyle', 'Fashion', 'Headshots'],
  Landscape: ['Urban', 'Rural', 'Mountains', 'Desert', 'Seascape'],
  Travel: ['Urban', 'Rural', 'Beach', 'Mountains', 'Cultural'],
  Wedding: ['Ceremony', 'Reception', 'Candid', 'Details'],
  Macro: ['Insects', 'Flowers', 'Textures', 'Water Drops'],
  'Fine Art': ['Abstract', 'Experimental', 'Artistic'],
  Pets: ['Dogs', 'Cats', 'Wildlife', 'Birds'],
  Sports: ['Action', 'Team Sports', 'Individual'],
  'Night Photography': ['Cityscape', 'Starry Sky', 'Light Trails'],
};

/** Skeleton placeholder card for loading state */
const CardSkeleton = () => (
  <div className="flex flex-col overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-sm animate-pulse">
    <div className="relative aspect-4/3 w-full bg-[#f3f4f6]" />
    <div className="flex flex-col gap-3 p-5">
      <div className="h-4 w-24 rounded bg-[#e5e7eb]" />
      <div className="h-6 w-3/4 rounded bg-[#e5e7eb]" />
      <div className="h-4 w-full rounded bg-[#f3f4f6]" />
      <div className="mt-2 flex items-center justify-between border-t border-[#f3f4f6] pt-3">
        <div className="h-4 w-20 rounded bg-[#f3f4f6]" />
        <div className="h-4 w-16 rounded bg-[#f3f4f6]" />
      </div>
    </div>
  </div>
);

const ShowcaseFiltersPanel = memo(
  ({
    albumTypes,
    categoryOptions,
    subcategoryMap,
    selectedCategories,
    onToggleAlbum,
    onToggleCategory,
    i18nPrefix,
    t,
  }) => (
    <div className="flex flex-col gap-6">
      <FilterCheckboxGroup
        title={t(`${i18nPrefix}.albumType`)}
        options={ALBUM_TYPE_VALUES}
        selected={albumTypes}
        onToggle={onToggleAlbum}
        getLabel={(value) => t(ALBUM_TYPE_LABEL_KEYS[value])}
      />
      <FilterCheckboxGroup
        title={t(`${i18nPrefix}.category`)}
        options={categoryOptions}
        selected={selectedCategories}
        onToggle={onToggleCategory}
        getLabel={(value) =>
          t(`common.categories.${value}`, { defaultValue: value })
        }
        subcategories={subcategoryMap}
        defaultExpanded={categoryOptions[0]}
      />
    </div>
  ),
);

ShowcaseFiltersPanel.displayName = 'ShowcaseFiltersPanel';

const CompetitionsMain = memo(({ activeHref = ROUTES.COMPETITIONS }) => {
  const { t } = useTranslation();
  const i18nPrefix = 'competitionsPage';

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [albumTypes, setAlbumTypes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [page, setPage] = useState(1);

  // Debounce search query by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch categories from API
  const { data: rawCategories } = useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: getCategoriesApi,
    staleTime: 5 * 60 * 1000,
  });

  const { categoryOptions, subcategoryMap, categoryMap, subcategoryLookup } =
    useMemo(() => {
      const list = Array.isArray(rawCategories?.data)
        ? rawCategories.data
        : Array.isArray(rawCategories)
          ? rawCategories
          : [];

      if (list.length === 0) {
        return {
          categoryOptions: DEFAULT_CATEGORIES,
          subcategoryMap: DEFAULT_SUBCATEGORIES,
          categoryMap: new Map(),
          subcategoryLookup: new Map(),
        };
      }

      const options = [];
      const subMap = {};
      const catMap = new Map();
      const subLookup = new Map();

      list.forEach((cat) => {
        const name = cat.name || cat.title || '';
        if (!name) return;
        options.push(name);
        catMap.set(name.toLowerCase(), cat.id);

        const subNames = [];
        const subs = Array.isArray(cat.subcategories) ? cat.subcategories : [];
        subs.forEach((sub) => {
          const sName = sub.name || sub.title || '';
          if (sName) {
            subNames.push(sName);
            subLookup.set(sName.toLowerCase(), {
              id: sub.id,
              parentId: cat.id,
            });
          }
        });
        subMap[name] = subNames;
      });

      return {
        categoryOptions: options,
        subcategoryMap: subMap,
        categoryMap: catMap,
        subcategoryLookup: subLookup,
      };
    }, [rawCategories]);

  // Determine active categoryId and subcategoryId from selectedCategories
  const { categoryId, subcategoryId } = useMemo(() => {
    if (selectedCategories.length === 0) {
      return { categoryId: undefined, subcategoryId: undefined };
    }
    const lastSelected = selectedCategories[selectedCategories.length - 1];
    const normalized = String(lastSelected).toLowerCase();

    // Check if it's a subcategory
    const subMatch = subcategoryLookup.get(normalized);
    if (subMatch) {
      return {
        categoryId: subMatch.parentId,
        subcategoryId: subMatch.id,
      };
    }

    // Check if it's a category
    const catId = categoryMap.get(normalized);
    if (catId) {
      return {
        categoryId: catId,
        subcategoryId: undefined,
      };
    }

    return { categoryId: undefined, subcategoryId: undefined };
  }, [selectedCategories, categoryMap, subcategoryLookup]);

  // Determine kind from albumTypes (SINGLE, SIX, TWELVE)
  const kind = useMemo(() => {
    if (albumTypes.length !== 1) return undefined;
    const type = albumTypes[0];
    if (/12|zodiac/i.test(type)) return 'TWELVE';
    if (/6/i.test(type)) return 'SIX';
    if (/single/i.test(type)) return 'SINGLE';
    return undefined;
  }, [albumTypes]);

  // Fetch live competition artworks from API
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
      {
        page,
        limit: PAGE_SIZE,
        categoryId,
        subcategoryId,
        kind,
        search: debouncedQuery,
      },
    ],
    queryFn: () =>
      getPublicArtworksApi({
        status: 'IN_COMPETITION',
        page,
        limit: PAGE_SIZE,
        categoryId,
        subcategoryId,
        kind,
        search: debouncedQuery,
      }),
    placeholderData: (previousData) => previousData,
  });

  const photos = useMemo(() => {
    let list = artworksResult?.data || [];
    // If multiple album types selected, apply client-side safety filter
    if (albumTypes.length > 1) {
      list = list.filter((photo) =>
        albumTypes.some((type) => matchesAlbumType(photo.badge, type)),
      );
    }
    return list;
  }, [artworksResult?.data, albumTypes]);

  const meta = artworksResult?.meta || {
    currentPage: page,
    totalPages: 1,
    totalRecords: photos.length,
    hasNext: false,
    hasPrevious: false,
  };

  const toggle = (setList, value) => {
    setList((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
    setPage(1);
  };

  const handleClearFilters = () => {
    setAlbumTypes([]);
    setSelectedCategories([]);
    setQuery('');
    setDebouncedQuery('');
    setPage(1);
  };

  const closeFilters = useCallback(() => setFiltersOpen(false), []);

  useEffect(() => {
    if (!filtersOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeFilters();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [filtersOpen, closeFilters]);

  const filtersDrawerId = 'competitions-filters-drawer';
  const searchPlaceholder = t(`${i18nPrefix}.searchPlaceholder`);

  const searchBar = (
    <MarketingSearchBar
      className="w-full"
      value={query}
      onChange={(event) => {
        setQuery(event.target.value);
        setPage(1);
      }}
      placeholder={searchPlaceholder}
      ariaLabel={searchPlaceholder}
    />
  );

  const filterPanelProps = {
    albumTypes,
    categoryOptions,
    subcategoryMap,
    selectedCategories,
    onToggleAlbum: (value) => toggle(setAlbumTypes, value),
    onToggleCategory: (value) => toggle(setSelectedCategories, value),
    i18nPrefix,
    t,
  };

  const hasActiveFilters =
    albumTypes.length > 0 ||
    selectedCategories.length > 0 ||
    query.trim() !== '';

  return (
    <SitePageLayout
      activeHref={activeHref}
      rootClassName="competitions-page-root"
      announcementTone="navy"
      newsletterVariant="page"
    >
      <section className="bg-white section-py">
        <Shell>
          {/* Mobile Header + Search */}
          <div className="mb-8 lg:hidden">
            <SectionHeader
              className="min-w-0"
              align="left"
              badge={t(`${i18nPrefix}.eyebrow`)}
              badgeTone="indigo"
              title={t(`${i18nPrefix}.title`)}
              description={t(`${i18nPrefix}.subtitle`)}
            />
            <div className="mt-4 flex flex-col gap-3">
              {searchBar}
              <div className="flex items-center justify-between">
                <Button
                  unstyled
                  type="button"
                  onClick={() => setFiltersOpen(true)}
                  aria-expanded={filtersOpen}
                  aria-controls={filtersDrawerId}
                  aria-label={t(`${i18nPrefix}.filters`)}
                  className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border-0 bg-[#F6F7F8] px-3.5 py-2.5 text-[14px] font-medium text-[#0d0d14] transition hover:bg-[#eceef0]"
                >
                  <Funnel size={18} strokeWidth={2} aria-hidden="true" />
                  {t(`${i18nPrefix}.filters`)}
                  {hasActiveFilters && (
                    <span className="size-2 rounded-full bg-[#ee1c25]" />
                  )}
                </Button>

                {hasActiveFilters && (
                  <Button
                    unstyled
                    type="button"
                    onClick={handleClearFilters}
                    className="text-[13px] font-medium text-[#ee1c25] hover:underline"
                  >
                    {t(`${i18nPrefix}.clearFilters`)}
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-14 xl:gap-20">
            {/* Desktop Sidebar Filters */}
            <aside className="hidden w-full shrink-0 lg:sticky lg:top-[calc(var(--site-chrome-height,118px)+1.5rem)] lg:block lg:w-68 xl:w-72 lg:self-start">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-[20px] font-bold text-[#0d0d14]">
                  {t(`${i18nPrefix}.filtersTitle`)}
                </h2>
                {hasActiveFilters && (
                  <Button
                    unstyled
                    type="button"
                    onClick={handleClearFilters}
                    className="text-[13px] font-medium text-[#ee1c25] hover:underline cursor-pointer"
                  >
                    {t(`${i18nPrefix}.clearFilters`)}
                  </Button>
                )}
              </div>
              <ShowcaseFiltersPanel {...filterPanelProps} />
            </aside>

            {/* Main Content Area */}
            <div className="min-w-0 flex-1">
              <SectionHeader
                className="mb-8 hidden lg:block"
                align="left"
                badge={t(`${i18nPrefix}.eyebrow`)}
                badgeTone="indigo"
                title={t(`${i18nPrefix}.title`)}
                description={t(`${i18nPrefix}.subtitle`)}
                end={<div className="w-full max-w-xs">{searchBar}</div>}
              />

              {/* Status Indicator during background refresh */}
              {isFetching && !isLoading && (
                <div className="mb-4 flex items-center gap-2 text-[13px] text-[#6b7280]">
                  <Loader2 size={14} className="animate-spin text-[#ee1c25]" />
                  <span>{t(`${i18nPrefix}.loading`)}</span>
                </div>
              )}

              {/* Loading Skeleton */}
              {isLoading ? (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <CardSkeleton key={`skeleton-${idx}`} />
                  ))}
                </div>
              ) : isError ? (
                /* Error State */
                <div className="rounded-2xl border border-red-200 bg-red-50/60 p-8 text-center">
                  <AlertCircle
                    size={40}
                    className="mx-auto text-red-500 mb-3"
                  />
                  <p className="text-[18px] font-bold text-[#0d0d14]">
                    {t(`${i18nPrefix}.errorTitle`)}
                  </p>
                  <p className="mt-1 text-[14px] text-[#6b7280]">
                    {error?.message ||
                      t('common.errors.general', 'Something went wrong.')}
                  </p>
                  <Button
                    unstyled
                    type="button"
                    onClick={() => refetch()}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#ee1c25] px-4 py-2 text-[14px] font-medium text-white transition hover:bg-[#d61820]"
                  >
                    <RefreshCw size={16} />
                    {t(`${i18nPrefix}.retry`)}
                  </Button>
                </div>
              ) : photos.length === 0 ? (
                /* Empty State */
                <div className="rounded-2xl border border-dashed border-black/15 px-6 py-16 text-center">
                  <p className="text-[18px] font-bold text-[#0d0d14]">
                    {t(`${i18nPrefix}.emptyTitle`)}
                  </p>
                  <p className="mt-2 text-[14px] text-[#6b7280]">
                    {t(`${i18nPrefix}.emptyBody`)}
                  </p>
                  {hasActiveFilters && (
                    <Button
                      unstyled
                      type="button"
                      onClick={handleClearFilters}
                      className="mt-5 inline-flex items-center rounded-lg bg-[#0d0d14] px-4 py-2 text-[14px] font-medium text-white transition hover:bg-[#23232c]"
                    >
                      {t(`${i18nPrefix}.clearFilters`)}
                    </Button>
                  )}
                </div>
              ) : (
                /* Artworks Grid */
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {photos.map((photo) => (
                    <PhotoShowcaseCard
                      key={photo.id}
                      id={photo.id}
                      href={photo.detailPath || `/competitions/${photo.id}`}
                      image={photo.image}
                      imageAlt={photo.title}
                      title={photo.title}
                      titleAs="h2"
                      badge={t(
                        SHOWCASE_BADGE_KEYS[photo.badge] || photo.badge,
                        {
                          defaultValue: photo.badge,
                        },
                      )}
                      description={photo.description}
                      engagementType="vote"
                      likes={photo.votes}
                      initialLiked={photo.isVoted || photo.isLiked}
                      initialSaved={photo.isSaved}
                      views={photo.views}
                      date={photo.date}
                      isAiGenerated={Boolean(photo.isAiGenerated)}
                    />
                  ))}
                </div>
              )}

              {/* Server-Side Pagination */}
              {meta.totalPages > 1 && (
                <Pagination
                  className="mt-12"
                  currentPage={meta.currentPage}
                  totalPages={meta.totalPages}
                  onPageChange={(nextPage) => setPage(nextPage)}
                  ariaLabel={t(`${i18nPrefix}.paginationAria`)}
                />
              )}
            </div>
          </div>
        </Shell>
      </section>

      {/* Mobile Drawer Filter */}
      <div
        className={`fixed inset-0 z-120 lg:hidden ${
          filtersOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        aria-hidden={!filtersOpen}
      >
        <Button
          unstyled
          type="button"
          aria-label={t(`${i18nPrefix}.closeFilters`)}
          onClick={closeFilters}
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            filtersOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <aside
          id={filtersDrawerId}
          role="dialog"
          aria-modal="true"
          aria-label={t(`${i18nPrefix}.filtersTitle`)}
          className={`absolute inset-y-0 left-0 flex w-[min(100%,320px)] flex-col bg-white shadow-[4px_0_24px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out sm:w-90 ${
            filtersOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
            <h2 className="text-[18px] font-bold text-[#3a3a42]">
              {t(`${i18nPrefix}.filtersTitle`)}
            </h2>
            <Button
              unstyled
              type="button"
              onClick={closeFilters}
              aria-label={t(`${i18nPrefix}.closeFilters`)}
              className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full border border-black/10 text-[#0d0d14] transition hover:bg-[#f3f4f6]"
            >
              <X size={18} strokeWidth={2} aria-hidden="true" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-6">
            <ShowcaseFiltersPanel {...filterPanelProps} />
          </div>
          {hasActiveFilters && (
            <div className="border-t border-black/10 p-4">
              <Button
                unstyled
                type="button"
                onClick={handleClearFilters}
                className="w-full rounded-lg bg-[#f3f4f6] py-2.5 text-center text-[14px] font-semibold text-[#0d0d14] transition hover:bg-[#e5e7eb]"
              >
                {t(`${i18nPrefix}.clearFilters`)}
              </Button>
            </div>
          )}
        </aside>
      </div>
    </SitePageLayout>
  );
});

CompetitionsMain.displayName = 'CompetitionsMain';

export default CompetitionsMain;
