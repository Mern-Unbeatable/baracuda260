import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppLink, ImgIcon, Shell, SitePageLayout } from '../site';
import { GALLERY_PHOTOS, galleryDetailPath } from '../../data/galleryPhotos';

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
  heart: `${A}/icon-heart.svg`,
  pageFirst: `${A}/icon-page-first.svg`,
  pagePrev: `${A}/icon-page-prev.svg`,
  pageNext: `${A}/icon-page-next.svg`,
  photographer: `${A}/avatar-photographer.jpg`,
};

const PROFILE = {
  name: 'Wong Kar-Wai',
  email: 'georgia.young@example.com',
  phone: '(270) 555-0117',
  avatar: ASSETS.photographer,
};

const PAGE_SIZE = 8;

const displayBadge = (badge = '') => {
  if (/12/i.test(badge)) return '12 Photo Zodiac';
  return badge;
};

const PhotographerProfileContent = memo(() => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(GALLERY_PHOTOS.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedPhotos = GALLERY_PHOTOS.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const pageNumbers = Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1);
  return (
    <SitePageLayout
      activeHref={''}
      rootClassName="photographer-profile-root"
      announcementTone="blue"
      newsletterVariant="page"
    >
      {/* Profile + photos */}
      <section className="bg-white py-10 sm:py-12 xl:py-14">
        <Shell>
          <div className="flex items-start gap-3">
            <img
              src={PROFILE.avatar}
              alt={PROFILE.name}
              width={86}
              height={87}
              className="size-[72px] shrink-0 rounded-full object-cover sm:h-[87px] sm:w-[86px]"
            />
            <div className="min-w-0 flex flex-col gap-2">
              <h1 className="text-[18px] font-bold leading-normal text-[#111827] sm:text-[20px]">
                {PROFILE.name}
              </h1>
              <p className="text-[14px] leading-normal text-[#6b7280] sm:text-[16px]">
                {PROFILE.email}
              </p>
              <p className="text-[14px] leading-normal text-[#6b7280] sm:text-[16px]">
                {PROFILE.phone}
              </p>
            </div>
          </div>

          <div className="mt-8 sm:mt-10">
            <div className="grid gap-[19px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {pagedPhotos.map((photo) => (
                <AppLink
                  key={photo.id}
                  href={galleryDetailPath(photo.id)}
                  className="block overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white transition hover:border-black/20 hover:shadow-sm"
                >
                  <article>
                    <div className="relative h-[220px] bg-[#f3f4f6] sm:h-[252px]">
                      <img
                        src={photo.image}
                        alt={photo.title}
                        width={370}
                        height={252}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.5px] text-[#3f51b5]">
                        {displayBadge(photo.badge)}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2 p-4">
                      <h2 className="truncate text-[18px] font-bold leading-5 text-[#111827] sm:text-[20px]">
                        {photo.title}
                      </h2>
                      <div className="flex items-center justify-between gap-2 pt-1 text-[14px] leading-4 text-[#6b7280] sm:text-[16px]">
                        <span className="truncate">{photo.author}</span>
                        <span className="inline-flex shrink-0 items-center gap-1">
                          <ImgIcon src={ASSETS.heart} size={24} />
                          {photo.votes}
                        </span>
                      </div>
                    </div>
                  </article>
                </AppLink>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-9 flex flex-wrap items-center justify-center gap-[5px]">
              <button
                type="button"
                  aria-label={t('gallery.firstPage')}
                  onClick={() => setPage(1)}
                  className="flex size-8 items-center justify-center rounded-lg border border-[#f1f1f1] bg-white"
                >
                  <ImgIcon src={ASSETS.pageFirst} size={14} />
                </button>
                <button
                  type="button"
                  aria-label={t('gallery.previousPage')}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="flex size-8 items-center justify-center rounded-lg border border-[#f1f1f1] bg-white"
                >
                  <ImgIcon src={ASSETS.pagePrev} size={14} />
                </button>
              {pageNumbers.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  className={`flex size-8 items-center justify-center rounded-lg text-[13px] font-semibold ${
                    currentPage === n
                      ? 'bg-[#ee1c25] text-white'
                      : 'border border-[#f1f1f1] bg-white text-[#333]'
                  }`}
                >
                  {n}
                </button>
              ))}
              {totalPages > 3 && (
                <>
                  <span className="flex size-8 items-center justify-center text-[13px] font-semibold text-[#333]">
                    …
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage(totalPages)}
                    className={`flex size-8 items-center justify-center rounded-lg text-[13px] font-semibold ${
                      currentPage === totalPages
                        ? 'bg-[#ee1c25] text-white'
                        : 'border border-[#f1f1f1] bg-white text-[#333]'
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
                  className="flex size-8 items-center justify-center rounded-lg border border-[#f1f1f1] bg-white"
                >
                  <ImgIcon src={ASSETS.pageNext} size={14} />
                </button>
                <button
                  type="button"
                  aria-label={t('gallery.lastPage')}
                  onClick={() => setPage(totalPages)}
                  className="flex size-8 items-center justify-center rounded-lg border border-[#f1f1f1] bg-white"
                >
                <span className="inline-flex scale-x-[-1]">
                  <ImgIcon src={ASSETS.pageFirst} size={14} />
                </span>
              </button>
            </div>
          </div>
        </Shell>
      </section>
    </SitePageLayout>
  );
});

PhotographerProfileContent.displayName = 'PhotographerProfileContent';

export default PhotographerProfileContent;
