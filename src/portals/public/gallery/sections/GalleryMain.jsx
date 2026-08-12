import React, { memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Funnel, X } from 'lucide-react';
import { ROUTES } from '@/shared/config';
import { Shell, SitePageLayout } from '@/shared/site-chrome';
import { GALLERY_PHOTOS, galleryDetailPath } from '@/shared/data/galleryPhotos';
import {
  ALBUM_TYPE_LABEL_KEYS,
  ALBUM_TYPE_VALUES,
  matchesAlbumType,
} from '@/shared/data/albumTypes';
import {
  FilterCheckboxGroup,
  MarketingPagination,
  MarketingSearchBar,
  PhotoShowcaseCard,
  SectionHeader,
} from '@/shared/ui/marketing';
import usePaginatedSlice from '@/shared/hooks/usePaginatedSlice';

const SHOWCASE_BADGE_KEYS = {
  'Single Photo': 'common.badges.singlePhoto',
  '6 Photos Story': 'common.badges.sixPhotosStory',
  '12 photos - full Zodiac Story': 'common.badges.twelveZodiacFull',
};

const PAGE_SIZE = 6;

const CATEGORIES = [
  'Nature',
  'Portrait',
  'Wildlife',
  'Landscape',
  'Street Photography',
  'Architecture',
  'Black & White',
  'Travel',
  'Wedding',
  'Macro',
  'Fine Art',
  'Pets',
  'Sports',
  'Night Photography',
];

const PHOTOS = GALLERY_PHOTOS;

const GalleryFiltersPanel = memo(
  ({ albumTypes, categories, onToggleAlbum, onToggleCategory, t }) => (
    <div className="flex flex-col gap-10">
      <FilterCheckboxGroup
        title={t('gallery.albumType')}
        options={ALBUM_TYPE_VALUES}
        selected={albumTypes}
        onToggle={onToggleAlbum}
        getLabel={(value) => t(ALBUM_TYPE_LABEL_KEYS[value])}
      />
      <FilterCheckboxGroup
        title={t('gallery.category')}
        options={CATEGORIES}
        selected={categories}
        onToggle={onToggleCategory}
        getLabel={(value) => t(`common.categories.${value}`, { defaultValue: value })}
      />
    </div>
  ),
);

GalleryFiltersPanel.displayName = 'GalleryFiltersPanel';

const GalleryContent = memo(() => {
  const { t } = useTranslation();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [albumTypes, setAlbumTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState('');

  const searchPlaceholder = t('gallery.searchPlaceholder');

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

    return PHOTOS.filter((photo) => {
      const albumOk =
        albumTypes.length === 0 || albumTypes.some((type) => matchesAlbumType(photo.badge, type));
      const categoryOk = categories.length === 0 || categories.includes(photo.category);
      const searchOk =
        !normalizedQuery ||
        [photo.title, photo.description, photo.author, photo.category, photo.badge].some((field) =>
          String(field ?? '')
            .toLowerCase()
            .includes(normalizedQuery),
        );
      return albumOk && categoryOk && searchOk;
    });
  }, [albumTypes, categories, query]);

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
    t,
  };

  return (
    <SitePageLayout
      activeHref={ROUTES.GALLERY}
      rootClassName="gallery-page-root"
      announcementTone="navy"
      newsletterVariant="page"
    >
      {/* Gallery main */}
      <section className="bg-white section-py">
        <Shell>
          <div className="mb-8 lg:hidden">
            <SectionHeader
              className="min-w-0"
              align="left"
              badge={t('gallery.eyebrow')}
              badgeTone="indigo"
              title={t('gallery.title')}
            />
            <div className="mt-4 flex flex-col gap-3">
              {searchBar}
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                aria-expanded={filtersOpen}
                aria-controls="gallery-filters-drawer"
                aria-label={t('gallery.filters')}
                className="inline-flex w-fit cursor-pointer items-center justify-center gap-1.5 self-end rounded-lg border-0 bg-[#F6F7F8] px-3 py-2.5 text-[#0d0d14] transition hover:bg-[#eceef0]"
              >
                <Funnel size={20} strokeWidth={2} aria-hidden="true" />
                {t('gallery.filters')}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-25.75">
            {/* Desktop sidebar */}
            <aside className="hidden w-full shrink-0 lg:sticky lg:top-[calc(var(--site-chrome-height,118px)+1.5rem)] lg:block lg:w-71.25 lg:self-start">
              <GalleryFiltersPanel {...filterPanelProps} />
            </aside>

            {/* Grid */}
            <div className="min-w-0 flex-1">
              <SectionHeader
                className="mb-10 hidden lg:block"
                align="left"
                badge={t('gallery.eyebrow')}
                badgeTone="indigo"
                title={t('gallery.title')}
                end={searchBar}
              />

              {pagedPhotos.length === 0 ? (
                <div className="rounded-xl border border-dashed border-black/15 px-6 py-16 text-center">
                  <p className="text-[18px] font-bold text-[#0d0d14]">{t('gallery.emptyTitle')}</p>
                  <p className="mt-2 text-[14px] text-[#6b7280]">{t('gallery.emptyBody')}</p>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {pagedPhotos.map((photo) => (
                    <PhotoShowcaseCard
                      key={photo.id}
                      href={galleryDetailPath(photo.id)}
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

              <MarketingPagination
                className="mt-10"
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
                ariaLabel={t('gallery.paginationAria', { defaultValue: 'Gallery pagination' })}
              />
            </div>
          </div>
        </Shell>
      </section>

      {/* Mobile / tablet filters drawer ΓÇö slides in from left */}
      <div
        className={`fixed inset-0 z-120 lg:hidden ${filtersOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden={!filtersOpen}
      >
        <button
          type="button"
          aria-label={t('gallery.closeFilters')}
          onClick={closeFilters}
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            filtersOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <aside
          id="gallery-filters-drawer"
          role="dialog"
          aria-modal="true"
          aria-label={t('gallery.filtersTitle')}
          className={`absolute inset-y-0 left-0 flex w-[min(100%,320px)] flex-col bg-white shadow-[4px_0_24px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out sm:w-90 ${
            filtersOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
            <h2 className="text-[18px] font-bold text-[#3a3a42]">{t('gallery.filtersTitle')}</h2>
            <button
              type="button"
              onClick={closeFilters}
              aria-label={t('gallery.closeFilters')}
              className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full border border-black/10 text-[#0d0d14] transition hover:bg-[#f3f4f6]"
            >
              <X size={18} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-6">
            <GalleryFiltersPanel {...filterPanelProps} />
          </div>
        </aside>
      </div>
    </SitePageLayout>
  );
});

GalleryContent.displayName = 'GalleryContent';

export default GalleryContent;
