import React, { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../config';
import { AppLink, ImgIcon, Shell, SitePageLayout } from '../site';
import { GALLERY_PHOTOS, galleryDetailPath } from '../../data/galleryPhotos';

const A = '/assets/home';

const normalize = (value = '') =>
  value.toLowerCase().replace(/[-–—]/g, ' ').replace(/\s+/g, ' ').trim();

const matchesAlbumType = (badge, albumType) => {
  const b = normalize(badge);
  const t = normalize(albumType);
  if (t.includes('12')) return b.includes('12') && b.includes('zodiac');
  if (t.includes('6')) return b.includes('6') && b.includes('story');
  if (t.includes('single')) return b.includes('single');
  return b === t;
};

const ASSETS = {
  logo: `${A}/logo.png`,
  logoFooter: `${A}/logo-footer.png`,
  chevron: `${A}/chevron-down.svg`,
  mail: `${A}/icon-mail.svg`,
  ig: `${A}/icon-ig.svg`,
  fb: `${A}/icon-fb.svg`,
  x: `${A}/icon-x.svg`,
  newsletterBg: `${A}/newsletter-bg.png`,
  heart: `${A}/icon-heart.svg`,
  checkbox: `${A}/icon-checkbox.svg`,
  pageFirst: `${A}/icon-page-first.svg`,
  pagePrev: `${A}/icon-page-prev.svg`,
  pageNext: `${A}/icon-page-next.svg`,
};

const ALBUM_TYPES = ['Single Photo', '6 Photo Story', '12 photos - Full Zodiac Story'];

const ALBUM_TYPE_LABEL_KEYS = {
  'Single Photo': 'common.singlePhoto',
  '6 Photo Story': 'common.sixPhotosStory',
  '12 photos - Full Zodiac Story': 'common.twelveZodiac',
};

const PAGE_SIZE = 9;

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
    <h3 className="text-[18px] font-bold leading-6 text-[#0d0d14] sm:text-[20px]">{title}</h3>
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

  const totalPages = Math.max(1, Math.ceil(filteredPhotos.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedPhotos = filteredPhotos.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const pageNumbers = Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1);

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
              <h1 className="mt-1 text-[32px] font-extrabold text-[#0d0d14]">{t('gallery.title')}</h1>
            </div>
            <button
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
              className="rounded-full border border-black/15 px-4 py-2 text-sm font-semibold text-[#0d0d14]"
            >
              {filtersOpen ? t('gallery.hideFilters') : t('gallery.filters')}
            </button>
          </div>

          <div className="flex flex-col gap-8 lg:flex-row lg:gap-[103px]">
            {/* Sidebar */}
            <aside
              className={`w-full shrink-0 lg:w-[285px] ${filtersOpen ? 'block' : 'hidden lg:block'}`}
            >
              <div className="flex flex-col gap-10">
                <FilterGroup
                  title={t('gallery.albumType')}
                  options={ALBUM_TYPES}
                  selected={albumTypes}
                  onToggle={(value) => toggle(setAlbumTypes, value)}
                  getLabel={(value) => t(ALBUM_TYPE_LABEL_KEYS[value])}
                />
                <FilterGroup
                  title={t('gallery.category')}
                  options={CATEGORIES}
                  selected={categories}
                  onToggle={(value) => toggle(setCategories, value)}
                />
              </div>
            </aside>

            {/* Grid */}
            <div className="min-w-0 flex-1">
              <div className="mb-8 hidden lg:block">
                <p className="text-[14px] font-bold uppercase tracking-[1.2px] text-[#666dd7]">
                  {t('gallery.eyebrow')}
                </p>
                <h1 className="mt-2 text-[48px] font-extrabold leading-[66px] text-[#0d0d14]">
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
                    <AppLink
                      key={photo.id}
                      href={galleryDetailPath(photo.id)}
                      className="block overflow-hidden rounded-[12px] border border-black/10 bg-white transition hover:border-black/20 hover:shadow-sm"
                    >
                      <article>
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
                        <div className="p-4">
                          <h2 className="text-[16px] font-bold text-[#0d0d14]">{photo.title}</h2>
                          <div className="mt-2 flex items-center justify-between text-[14px] text-[#6b7280]">
                            <span>{photo.author}</span>
                            <span className="inline-flex items-center gap-1.5">
                              <ImgIcon src={ASSETS.heart} size={24} />
                              {photo.votes}
                            </span>
                          </div>
                        </div>
                      </article>
                    </AppLink>
                  ))}
                </div>
              )}

              {/* Pagination */}
              <div className="mt-9 flex flex-wrap items-center justify-center gap-[5px]">
                <button
                  type="button"
                  aria-label={t('gallery.firstPage')}
                  onClick={() => setPage(1)}
                  className="flex size-8 items-center justify-center rounded-full border border-[#e5e7eb]"
                >
                  <ImgIcon src={ASSETS.pageFirst} size={14} />
                </button>
                <button
                  type="button"
                  aria-label={t('gallery.previousPage')}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="flex size-8 items-center justify-center rounded-full border border-[#e5e7eb]"
                >
                  <ImgIcon src={ASSETS.pagePrev} size={14} />
                </button>
                {pageNumbers.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    className={`flex size-8 items-center justify-center rounded-full text-[14px] font-semibold ${
                      currentPage === n
                        ? 'bg-[#ee1c25] text-white'
                        : 'border border-[#e5e7eb] text-[#0d0d14]'
                    }`}
                  >
                    {n}
                  </button>
                ))}
                {totalPages > 3 && (
                  <>
                    <span className="px-1 text-[14px] text-[#6b7280]">…</span>
                    <button
                      type="button"
                      onClick={() => setPage(totalPages)}
                      className={`flex size-8 items-center justify-center rounded-full text-[14px] font-semibold ${
                        currentPage === totalPages
                          ? 'bg-[#ee1c25] text-white'
                          : 'border border-[#e5e7eb] text-[#0d0d14]'
                      }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
                <button
                  type="button"
                  aria-label={t('gallery.nextPage')}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="flex size-8 items-center justify-center rounded-full border border-[#e5e7eb]"
                >
                  <ImgIcon src={ASSETS.pageNext} size={14} />
                </button>
                <button
                  type="button"
                  aria-label={t('gallery.lastPage')}
                  onClick={() => setPage(totalPages)}
                  className="flex size-8 items-center justify-center rounded-full border border-[#e5e7eb]"
                >
                  <span className="inline-flex scale-x-[-1]">
                    <ImgIcon src={ASSETS.pageFirst} size={14} />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </Shell>
      </section>
    </SitePageLayout>
  );
});

GalleryContent.displayName = 'GalleryContent';

export default GalleryContent;
