import { useQuery } from '@tanstack/react-query';
import { AlertCircle, Funnel, Loader2, RefreshCw, X } from 'lucide-react';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
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
  Video: 'common.badges.video',
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
        title={t(`${i18nPrefix}.albumType`, 'Album Type')}
        options={ALBUM_TYPE_VALUES}
        selected={albumTypes}
        onToggle={onToggleAlbum}
        getLabel={(value) =>
          t(ALBUM_TYPE_LABEL_KEYS[value] || value, { defaultValue: value })
        }
      />
      <FilterCheckboxGroup
        title={t(`${i18nPrefix}.category`, 'Category')}
        options={categoryOptions}
        selected={selectedCategories}
        onToggle={onToggleCategory}
        getLabel={(value) =>
          t(`common.categories.${value}`, { defaultValue: value })
        }
        subcategories={subcategoryMap}
      />
    </div>
  ),
);

ShowcaseFiltersPanel.displayName = 'ShowcaseFiltersPanel';

const GalleryMain = memo(({ activeHref = ROUTES.GALLERY }) => {
  const { t } = useTranslation();
  const i18nPrefix = 'gallery';

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

  // Fetch live PROFILE_ONLY gallery artworks from API
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
      'gallery',
      {
        status: 'PROFILE_ONLY',
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
        status: 'PROFILE_ONLY',
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

  const filtersDrawerId = 'gallery-filters-drawer';
  const searchPlaceholder = t(`${i18nPrefix}.searchPlaceholder`, 'Search');

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
      rootClassName="gallery-page-root"
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
              badge={t(`${i18nPrefix}.eyebrow`, 'Community Work')}
              badgeTone="indigo"
              title={t(`${i18nPrefix}.title`, 'Photo Showcase')}
              description={t(
                `${i18nPrefix}.subtitle`,
                'Discover community photos and stories across all styles and categories.',
              )}
            />
            <div className="mt-4 flex flex-col gap-3">
              {searchBar}
              <Button
                unstyled
                type="button"
                onClick={() => setFiltersOpen(true)}
                aria-expanded={filtersOpen}
                aria-controls={filtersDrawerId}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 text-[14px] font-semibold text-[#111827] shadow-sm transition hover:bg-[#f9fafb]"
              >
                <Funnel size={16} strokeWidth={2} aria-hidden="true" />
                <span>{t(`${i18nPrefix}.filters`, 'Filters')}</span>
                {hasActiveFilters && (
                  <span className="flex size-5 items-center justify-center rounded-full bg-[#ee1c25] text-[11px] font-bold text-white">
                    {albumTypes.length + selectedCategories.length}
                  </span>
                )}
              </Button>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[260px_1fr] xl:gap-10">
            {/* Desktop Filters Sidebar */}
            <aside aria-label={t(`${i18nPrefix}.filtersTitle`, 'Filters')}>
              <div className="sticky top-24 hidden lg:block">
                <div className="mb-6 flex items-center justify-between border-b border-[#e5e7eb] pb-4">
                  <h2 className="text-[18px] font-semibold text-[#111827]">
                    {t(`${i18nPrefix}.filtersTitle`, 'Filters')}
                  </h2>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={handleClearFilters}
                      className="cursor-pointer text-[12px] font-medium text-[#ee1c25] hover:underline"
                    >
                      {t('common.clear', 'Clear')}
                    </button>
                  )}
                </div>
                <ShowcaseFiltersPanel {...filterPanelProps} />
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="min-w-0">
              {/* Desktop Header + Search */}
              <div className="hidden lg:mb-8 lg:flex lg:items-center lg:justify-between lg:gap-6">
                <SectionHeader
                  className="min-w-0 flex-1"
                  align="left"
                  badge={t(`${i18nPrefix}.eyebrow`, 'Community Work')}
                  badgeTone="indigo"
                  title={t(`${i18nPrefix}.title`, 'Photo Showcase')}
                  description={t(
                    `${i18nPrefix}.subtitle`,
                    'Discover community photos and stories across all styles and categories.',
                  )}
                />
                <div className="w-full max-w-xs shrink-0">{searchBar}</div>
              </div>

              {/* Status Indicator */}
              {isFetching && !isLoading && (
                <div className="mb-4 flex items-center gap-2 text-[12px] text-[#6b7280]">
                  <Loader2 size={14} className="animate-spin text-[#4048cd]" />
                  <span>{t('common.updating', 'Updating results...')}</span>
                </div>
              )}

              {/* Loading Skeleton */}
              {isLoading ? (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={`skeleton-${i}`}
                      className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white p-3 shadow-xs"
                    >
                      <div className="aspect-368/252 animate-pulse rounded-lg bg-[#f3f4f6]" />
                      <div className="mt-3 space-y-2">
                        <div className="h-4 w-3/4 animate-pulse rounded-sm bg-[#f3f4f6]" />
                        <div className="h-3 w-1/2 animate-pulse rounded-sm bg-[#f3f4f6]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : isError ? (
                /* Error State */
                <div className="flex flex-col items-center justify-center rounded-2xl border border-[#fee2e2] bg-[#fef2f2] p-8 text-center sm:p-12">
                  <AlertCircle size={40} className="text-[#ee1c25]" />
                  <h3 className="mt-4 text-[16px] font-semibold text-[#111827]">
                    {t(
                      `${i18nPrefix}.errorTitle`,
                      'Could not load gallery photos',
                    )}
                  </h3>
                  <p className="mt-1 text-[14px] text-[#6b7280]">
                    {getApiErrorMessage(
                      error,
                      t(
                        'common.errors.general',
                        'An unexpected error occurred. Please try again.',
                      ),
                    )}
                  </p>
                  <Button
                    unstyled
                    type="button"
                    onClick={() => refetch()}
                    className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#ee1c25] px-4 py-2 text-[14px] font-medium text-white transition hover:bg-[#d91921]"
                  >
                    <RefreshCw size={15} />
                    <span>{t('common.retry', 'Try again')}</span>
                  </Button>
                </div>
              ) : photos.length === 0 ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] p-8 text-center sm:p-12">
                  <div className="flex size-14 items-center justify-center rounded-full bg-[#f3f4f6] text-[#6b7280]">
                    <Funnel size={24} />
                  </div>
                  <h3 className="mt-4 text-[16px] font-semibold text-[#111827]">
                    {t(`${i18nPrefix}.emptyTitle`, 'No photos match')}
                  </h3>
                  <p className="mt-2 text-[14px] text-[#6b7280]">
                    {t(
                      `${i18nPrefix}.emptyBody`,
                      'Clear or change Album Type / Category filters to see more results.',
                    )}
                  </p>
                  {hasActiveFilters && (
                    <Button
                      unstyled
                      type="button"
                      onClick={handleClearFilters}
                      className="mt-5 inline-flex cursor-pointer items-center rounded-lg bg-[#0d0d14] px-4 py-2 text-[14px] font-medium text-white transition hover:bg-[#23232c]"
                    >
                      {t('common.clearFilters', 'Clear Filters')}
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
                      href={photo.detailPath || `/gallery/${photo.id}`}
                      image={photo.image}
                      imageAlt={photo.title}
                      videoUrl={photo.video?.url}
                      title={photo.title}
                      titleAs="h2"
                      badge={t(
                        SHOWCASE_BADGE_KEYS[photo.badge] || photo.badge,
                        {
                          defaultValue: photo.badge,
                        },
                      )}
                      description={photo.description}
                      engagementType="like"
                      likes={photo.likes}
                      initialLiked={photo.isLiked}
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
                  ariaLabel={t(`${i18nPrefix}.paginationAria`, 'Gallery pages')}
                />
              )}
            </div>
          </div>
        </Shell>
      </section>

      {/* Mobile Filters Drawer */}
      {filtersOpen && (
        <div
          role="dialog"
          aria-modal="true"
          id={filtersDrawerId}
          aria-label={t(`${i18nPrefix}.filtersTitle`, 'Filters')}
          className="fixed inset-0 z-50 flex lg:hidden"
        >
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={closeFilters}
            aria-hidden="true"
          />
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-4">
              <h2 className="text-[18px] font-semibold text-[#111827]">
                {t(`${i18nPrefix}.filtersTitle`, 'Filters')}
              </h2>
              <Button
                unstyled
                type="button"
                onClick={closeFilters}
                aria-label={t(`${i18nPrefix}.closeFilters`, 'Close filters')}
                className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-[#6b7280] hover:bg-[#f3f4f6]"
              >
                <X size={20} />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto py-6">
              <ShowcaseFiltersPanel {...filterPanelProps} />
            </div>
            <div className="border-t border-[#e5e7eb] pt-4">
              <Button
                unstyled
                type="button"
                onClick={closeFilters}
                className="w-full cursor-pointer rounded-lg bg-[#ee1c25] py-2.5 text-center text-[14px] font-semibold text-white transition hover:bg-[#d91921]"
              >
                {t('common.done', 'Done')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </SitePageLayout>
  );
});

GalleryMain.displayName = 'GalleryMain';

export default GalleryMain;
