import React, { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { ROUTES } from '../../config';
import { AppLink, Shell, SitePageLayout } from '../site';
import { GALLERY_PHOTOS, galleryDetailPath } from '../../data/galleryPhotos';
import {
  ALBUM_TYPE_LABEL_KEYS,
  ALBUM_TYPE_VALUES,
  matchesAlbumType,
} from '../../data/albumTypes';
import FavoriteHeartButton from './FavoriteHeartButton';

const A = '/assets/home';

const ASSETS = {
  logo: `${A}/logo.png`,
  logoFooter: `${A}/logo-footer.png`,
  chevron: `${A}/chevron-down.svg`,
  mail: `${A}/icon-mail.svg`,
  ig: `${A}/icon-ig.svg`,
  fb: `${A}/icon-fb.svg`,
  x: `${A}/icon-x.svg`,
  newsletterBg: `${A}/newsletter-bg.png`,
  checkbox: `${A}/icon-checkbox.svg`,
};

const PAGE_SIZE = 9;
/** Figma pagination chrome — sliding window + ellipsis + last page. */
const PAGINATION_TOTAL_PAGES = 10;
const PAGINATION_WINDOW = 3;
const PAGINATION_ICON_SIZE = 16;

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

const FilterGroup = memo(({ title, options, selected, onToggle, getLabel }) => (
  <div>
    <h3 className="text-[18px] font-semibold leading-6 text-[#3a3a42] sm:text-[20px]">{title}</h3>
    <ul className="mt-4 flex flex-col gap-4">
      {options.map((option) => {
        const checked = selected.includes(option);
        return (
          <li key={option}>
            <label className="flex cursor-pointer items-center gap-2 text-[14px] leading-5 text-[#111827]">
              <span className="relative inline-flex size-4 shrink-0 items-center justify-center overflow-hidden">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(option)}
                  className="peer absolute inset-0 z-10 cursor-pointer opacity-0"
                />
                <span className="size-4 rounded-[3px] border border-[#d1d5db] bg-white peer-checked:border-[#ee1c25] peer-checked:bg-[#ee1c25]" />
                {checked && (
                  <img
                    src={ASSETS.checkbox}
                    alt=""
                    width={10}
                    height={10}
                    className="pointer-events-none absolute size-2.5 invert"
                  />
                )}
              </span>
              <span>{getLabel ? getLabel(option) : option}</span>
            </label>
          </li>
        );
      })}
    </ul>
  </div>
));
FilterGroup.displayName = 'FilterGroup';

const GalleryContent = memo(() => {
  const { t } = useTranslation();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [albumTypes, setAlbumTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);

  const toggle = (setList, value) => {
    setList((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );
    setPage(1);
  };

  const filteredPhotos = useMemo(() => {
    return PHOTOS.filter((photo) => {
      const albumOk =
        albumTypes.length === 0 || albumTypes.some((type) => matchesAlbumType(photo.badge, type));
      const categoryOk = categories.length === 0 || categories.includes(photo.category);
      return albumOk && categoryOk;
    });
  }, [albumTypes, categories]);

  const totalPages = PAGINATION_TOTAL_PAGES;
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const pagedPhotos = filteredPhotos.slice(0, PAGE_SIZE);

  // Sliding window: 1,2,3…10 → 2,3,4…10 → … and reverse on prev
  const windowStart = Math.min(
    currentPage,
    Math.max(1, totalPages - PAGINATION_WINDOW + 1),
  );
  const windowPages = Array.from(
    { length: PAGINATION_WINDOW },
    (_, i) => windowStart + i,
  ).filter((n) => n <= totalPages);
  const showEllipsis = windowPages[windowPages.length - 1] < totalPages;

  const pageBtnClass = (active) =>
    `inline-flex size-8 shrink-0 items-center justify-center rounded-[8px] border text-[13px] font-semibold leading-none transition ${
      active
        ? 'border-[#ee1c25] bg-[#ee1c25] text-white'
        : 'border-[#f1f1f1] bg-white text-[#333333] hover:border-[#e5e7eb] hover:bg-[#f9fafb]'
    }`;

  const navBtnClass =
    'inline-flex size-8 shrink-0 items-center justify-center rounded-[8px] border border-[#f1f1f1] bg-white transition hover:border-[#e5e7eb] hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-40';

  const goToPage = (next) => setPage(Math.min(Math.max(1, next), totalPages));

  return (
    <SitePageLayout
      activeHref={ROUTES.GALLERY}
      rootClassName="gallery-page-root"
      announcementTone="navy"
      newsletterVariant="page"
    >
      {/* Gallery main */}
      <section className="bg-white py-10 sm:py-14 xl:py-16">
        <Shell>
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <div>
              <p className="text-[14px] font-bold uppercase tracking-[1.2px] text-[#666dd7]">
                {t('gallery.eyebrow')}
              </p>
              <h1 className="mt-1 text-[32px] font-bold text-[#3a3a42]">{t('gallery.title')}</h1>
            </div>
            <button
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
              className="rounded-full border border-black/15 px-4 py-2 text-sm font-semibold text-[#0d0d14]"
            >
              {filtersOpen ? t('gallery.hideFilters') : t('gallery.filters')}
            </button>
          </div>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-[103px]">
            {/* Sidebar */}
            <aside
              className={`w-full shrink-0 lg:sticky lg:top-[calc(var(--site-chrome-height,118px)+1.5rem)] lg:w-[285px] lg:self-start ${
                filtersOpen ? 'block' : 'hidden lg:block'
              }`}
            >
              <div className="flex flex-col gap-10">
                <FilterGroup
                  title={t('gallery.albumType')}
                  options={ALBUM_TYPE_VALUES}
                  selected={albumTypes}
                  onToggle={(value) => toggle(setAlbumTypes, value)}
                  getLabel={(value) => t(ALBUM_TYPE_LABEL_KEYS[value])}
                />
                <FilterGroup
                  title={t('gallery.category')}
                  options={CATEGORIES}
                  selected={categories}
                  onToggle={(value) => toggle(setCategories, value)}
                  getLabel={(value) => t(`common.categories.${value}`, { defaultValue: value })}
                />
              </div>
            </aside>

            {/* Grid */}
            <div className="min-w-0 flex-1">
              <div className="mb-8 hidden lg:block">
                <p className="text-[14px] font-bold uppercase tracking-[1.2px] text-[#666dd7]">
                  {t('gallery.eyebrow')}
                </p>
                <h1 className="mt-2 text-[48px] font-bold leading-[66px] text-[#3a3a42]">
                  {t('gallery.title')}
                </h1>
              </div>

              {pagedPhotos.length === 0 ? (
                <div className="rounded-xl border border-dashed border-black/15 px-6 py-16 text-center">
                  <p className="text-[18px] font-bold text-[#0d0d14]">{t('gallery.emptyTitle')}</p>
                  <p className="mt-2 text-[14px] text-[#6b7280]">{t('gallery.emptyBody')}</p>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {pagedPhotos.map((photo) => (
                    <article
                      key={photo.id}
                      className="overflow-hidden rounded-[12px] border border-black/10 bg-white transition hover:border-black/20 hover:shadow-sm"
                    >
                      <AppLink href={galleryDetailPath(photo.id)} className="block">
                        <div className="relative h-[220px] sm:h-[252px]">
                          <img
                            src={photo.image}
                            alt={photo.title}
                            width={368}
                            height={252}
                            className="h-full w-full object-cover"
                          />
                          <span className="absolute left-3 top-3 rounded bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#0d0d14]">
                            {photo.badge}
                          </span>
                        </div>
                        <div className="px-4 pt-4">
                          <h2 className="text-[16px] font-bold text-[#0d0d14]">{photo.title}</h2>
                        </div>
                      </AppLink>
                      <div className="flex items-center justify-between px-4 pb-4 pt-2 text-[14px] text-[#6b7280]">
                        <span>{photo.author}</span>
                        <FavoriteHeartButton
                          initialVotes={photo.votes}
                          title={photo.title}
                        />
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* Figma pagination — sliding window: 1,2,3…10 → 2,3,4…10 */}
              <nav
                aria-label={t('gallery.paginationAria', { defaultValue: 'Gallery pagination' })}
                className="mt-9 flex flex-wrap items-center justify-center gap-[5px]"
              >
                <button
                  type="button"
                  aria-label={t('gallery.firstPage')}
                  disabled={currentPage <= 1}
                  onClick={() => goToPage(1)}
                  className={navBtnClass}
                >
                  <ChevronsLeft
                    size={PAGINATION_ICON_SIZE}
                    strokeWidth={2}
                    aria-hidden="true"
                    className="text-[#333333]"
                  />
                </button>
                <button
                  type="button"
                  aria-label={t('gallery.previousPage')}
                  disabled={currentPage <= 1}
                  onClick={() => goToPage(currentPage - 1)}
                  className={navBtnClass}
                >
                  <ChevronLeft
                    size={PAGINATION_ICON_SIZE}
                    strokeWidth={2}
                    aria-hidden="true"
                    className="text-[#333333]"
                  />
                </button>
                {windowPages.map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-label={t('gallery.page', { page: n, defaultValue: `Page ${n}` })}
                    aria-current={currentPage === n ? 'page' : undefined}
                    onClick={() => goToPage(n)}
                    className={pageBtnClass(currentPage === n)}
                  >
                    {n}
                  </button>
                ))}
                {showEllipsis ? (
                  <>
                    <span
                      className="inline-flex size-8 items-center justify-center text-[14px] leading-none text-[#6b7280]"
                      aria-hidden="true"
                    >
                      …
                    </span>
                    <button
                      type="button"
                      aria-label={t('gallery.page', {
                        page: totalPages,
                        defaultValue: `Page ${totalPages}`,
                      })}
                      aria-current={currentPage === totalPages ? 'page' : undefined}
                      onClick={() => goToPage(totalPages)}
                      className={pageBtnClass(currentPage === totalPages)}
                    >
                      {totalPages}
                    </button>
                  </>
                ) : null}
                <button
                  type="button"
                  aria-label={t('gallery.nextPage')}
                  disabled={currentPage >= totalPages}
                  onClick={() => goToPage(currentPage + 1)}
                  className={navBtnClass}
                >
                  <ChevronRight
                    size={PAGINATION_ICON_SIZE}
                    strokeWidth={2}
                    aria-hidden="true"
                    className="text-[#333333]"
                  />
                </button>
                <button
                  type="button"
                  aria-label={t('gallery.lastPage')}
                  disabled={currentPage >= totalPages}
                  onClick={() => goToPage(totalPages)}
                  className={navBtnClass}
                >
                  <ChevronsRight
                    size={PAGINATION_ICON_SIZE}
                    strokeWidth={2}
                    aria-hidden="true"
                    className="text-[#333333]"
                  />
                </button>
              </nav>
            </div>
          </div>
        </Shell>
      </section>
    </SitePageLayout>
  );
});

GalleryContent.displayName = 'GalleryContent';

export default GalleryContent;
