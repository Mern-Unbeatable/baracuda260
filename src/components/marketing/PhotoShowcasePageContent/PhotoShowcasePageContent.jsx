import { useTranslation } from 'react-i18next';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { Funnel, X } from 'lucide-react';
import { Shell, SitePageLayout } from '@/shared/site-chrome';
import {
  ALBUM_TYPE_LABEL_KEYS,
  ALBUM_TYPE_VALUES,
  matchesAlbumType,
} from '@/shared/data/albumTypes';
import FilterCheckboxGroup from '@/components/marketing/FilterCheckboxGroup/FilterCheckboxGroup';
import MarketingSearchBar from '@/components/marketing/MarketingSearchBar/MarketingSearchBar';
import SectionHeader from '@/components/marketing/SectionHeader/SectionHeader';
import PhotoShowcaseCard from '@/components/data-display/PhotoShowcaseCard/PhotoShowcaseCard';
import Pagination from '@/components/common/Pagination/Pagination';
import usePaginatedSlice from '@/shared/hooks/usePaginatedSlice';

const SHOWCASE_BADGE_KEYS = {
  'Single Photo': 'common.badges.singlePhoto',
  '6 Photos Story': 'common.badges.sixPhotosStory',
  '12 photos - full Zodiac Story': 'common.badges.twelveZodiacFull',
};

const PAGE_SIZE = 6;

const MAIN_CATEGORIES = ['Nature', 'Portrait', 'Landscape', 'Travel', 'Wedding', 'Macro', 'Fine Art', 'Pets', 'Sports', 'Night Photography'];

const CATEGORY_SUBCATEGORIES = {
  Nature: ['Mountain', 'Forest', 'Wildlife', 'Rivers & Lakes', 'Oceans & Beaches', 'Flowers & Plants', 'Sky & Clouds', 'Weather & Storms'],
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

const CATEGORIES = MAIN_CATEGORIES;

const ShowcaseFiltersPanel = memo(
  ({ albumTypes, categories, onToggleAlbum, onToggleCategory, i18nPrefix, t }) => (
    <div className="flex flex-col gap-5">
      <FilterCheckboxGroup
        title={t(`${i18nPrefix}.albumType`)}
        options={ALBUM_TYPE_VALUES}
        selected={albumTypes}
        onToggle={onToggleAlbum}
        getLabel={(value) => t(ALBUM_TYPE_LABEL_KEYS[value])}
      />
      <FilterCheckboxGroup
        title={t(`${i18nPrefix}.category`)}
        options={CATEGORIES}
        selected={categories}
        onToggle={onToggleCategory}
        getLabel={(value) => t(`common.categories.${value}`, { defaultValue: value })}
        subcategories={CATEGORY_SUBCATEGORIES}
      />
    </div>
  ),
);

ShowcaseFiltersPanel.displayName = 'ShowcaseFiltersPanel';

const PhotoShowcasePageContent = memo(
  ({
    photos,
    i18nPrefix,
    activeHref,
    rootClassName,
    getDetailPath,
    announcementTone = 'navy',
    newsletterVariant = 'page',
  }) => {
    const { t } = useTranslation();
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [albumTypes, setAlbumTypes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [query, setQuery] = useState('');

    const filtersDrawerId = `${i18nPrefix}-filters-drawer`;
    const searchPlaceholder = t(`${i18nPrefix}.searchPlaceholder`);

    const searchBar = (
      <MarketingSearchBar
        className="w-full"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={searchPlaceholder}
        ariaLabel={searchPlaceholder}
      />
    );

    const toggle = (setList, value) => {
      setList((prev) =>
        prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
      );
    };

    const closeFilters = () => setFiltersOpen(false);

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
    }, [filtersOpen]);

    const filteredPhotos = useMemo(() => {
      const normalizedQuery = query.trim().toLowerCase();

      return photos.filter((photo) => {
        const albumOk =
          albumTypes.length === 0 || albumTypes.some((type) => matchesAlbumType(photo.badge, type));
        const categoryOk = categories.length === 0 || categories.includes(photo.category);
        const searchOk =
          !normalizedQuery ||
          [photo.title, photo.description, photo.author, photo.category, photo.badge, photo.price].some(
            (field) =>
              String(field ?? '')
                .toLowerCase()
                .includes(normalizedQuery),
          );
        return albumOk && categoryOk && searchOk;
      });
    }, [albumTypes, categories, photos, query]);

    const {
      currentPage,
      setPage,
      totalPages,
      pagedItems: pagedPhotos,
    } = usePaginatedSlice(filteredPhotos, PAGE_SIZE, [albumTypes, categories, query]);

    const filterPanelProps = {
      albumTypes,
      categories,
      onToggleAlbum: (value) => toggle(setAlbumTypes, value),
      onToggleCategory: (value) => toggle(setCategories, value),
      i18nPrefix,
      t,
    };

    return (
      <SitePageLayout
        activeHref={activeHref}
        rootClassName={rootClassName}
        announcementTone={announcementTone}
        newsletterVariant={newsletterVariant}
      >
        <section className="bg-white section-py">
          <Shell>
            <div className="mb-8 lg:hidden">
              <SectionHeader
                className="min-w-0"
                align="left"
                badge={t(`${i18nPrefix}.eyebrow`)}
                badgeTone="indigo"
                title={t(`${i18nPrefix}.title`)}
              />
              <div className="mt-4 flex flex-col gap-3">
                {searchBar}
                <button
                  type="button"
                  onClick={() => setFiltersOpen(true)}
                  aria-expanded={filtersOpen}
                  aria-controls={filtersDrawerId}
                  aria-label={t(`${i18nPrefix}.filters`)}
                  className="inline-flex w-fit cursor-pointer items-center justify-center gap-1.5 self-end rounded-lg border-0 bg-[#F6F7F8] px-3 py-2.5 text-[#0d0d14] transition hover:bg-[#eceef0]"
                >
                  <Funnel size={20} strokeWidth={2} aria-hidden="true" />
                  {t(`${i18nPrefix}.filters`)}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-25.75">
              <aside className="hidden w-full shrink-0 lg:sticky lg:top-[calc(var(--site-chrome-height,118px)+1.5rem)] lg:block lg:w-71.25 lg:self-start">
                <ShowcaseFiltersPanel {...filterPanelProps} />
              </aside>

              <div className="min-w-0 flex-1">
                <SectionHeader
                  className="mb-10 hidden lg:block"
                  align="left"
                  badge={t(`${i18nPrefix}.eyebrow`)}
                  badgeTone="indigo"
                  title={t(`${i18nPrefix}.title`)}
                  end={searchBar}
                />

                {pagedPhotos.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-black/15 px-6 py-16 text-center">
                    <p className="text-[18px] font-bold text-[#0d0d14]">
                      {t(`${i18nPrefix}.emptyTitle`)}
                    </p>
                    <p className="mt-2 text-[14px] text-[#6b7280]">{t(`${i18nPrefix}.emptyBody`)}</p>
                  </div>
                ) : (
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {pagedPhotos.map((photo) => (
                      <PhotoShowcaseCard
                        key={photo.id}
                        href={getDetailPath(photo)}
                        image={photo.image}
                        imageAlt={photo.title}
                        title={photo.title}
                        titleAs="h2"
                        badge={t(SHOWCASE_BADGE_KEYS[photo.badge] || photo.badge, {
                          defaultValue: photo.badge,
                        })}
                        description={photo.description}
                        likes={photo.votes}
                        views={photo.views}
                        date={photo.date}
                        price={photo.price}
                      />
                    ))}
                  </div>
                )}

                <Pagination
                  className="mt-10"
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  ariaLabel={t(`${i18nPrefix}.paginationAria`)}
                />
              </div>
            </div>
          </Shell>
        </section>

        <div
          className={`fixed inset-0 z-120 lg:hidden ${filtersOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
          aria-hidden={!filtersOpen}
        >
          <button
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
              <button
                type="button"
                onClick={closeFilters}
                aria-label={t(`${i18nPrefix}.closeFilters`)}
                className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full border border-black/10 text-[#0d0d14] transition hover:bg-[#f3f4f6]"
              >
                <X size={18} strokeWidth={2} aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-6">
              <ShowcaseFiltersPanel {...filterPanelProps} />
            </div>
          </aside>
        </div>
      </SitePageLayout>
    );
  },
);

PhotoShowcasePageContent.displayName = 'PhotoShowcasePageContent';

export default PhotoShowcasePageContent;
