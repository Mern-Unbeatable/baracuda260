import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { AppLink, ImgIcon, Shell, SitePageLayout } from '@/shared/site-chrome';
import { GALLERY_PHOTOS, galleryDetailPath } from '@/shared/data/galleryPhotos';
import { MarketingPagination } from '@/shared/ui/marketing';
import usePaginatedSlice from '@/shared/hooks/usePaginatedSlice';

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
  photographer: `${A}/avatar-photographer.jpg`,
};

const PROFILE = {
  name: 'Wong Kar-Wai',
  email: 'georgia.young@example.com',
  phone: '(270) 555-0117',
  avatar: ASSETS.photographer,
};

const PAGE_SIZE = 8;

const displayBadge = (badge = '', t) => {
  if (/12/i.test(badge)) return t('common.badges.twelvePhotoZodiac');
  if (/6/i.test(badge)) return t('common.badges.sixPhotosStory');
  if (/single/i.test(badge)) return t('common.badges.singlePhoto');
  return badge;
};

const PhotographerProfileContent = memo(() => {
  const { t } = useTranslation();
  const {
    currentPage,
    setPage,
    totalPages,
    pagedItems: pagedPhotos,
  } = usePaginatedSlice(GALLERY_PHOTOS, PAGE_SIZE, []);
  return (
    <SitePageLayout
      activeHref={''}
      rootclassName="photographer-profile-root"
      announcementTone="blue"
      newsletterVariant="page"
    >
      {/* Profile + photos */}
      <section className="bg-white section-py">
        <Shell>
          <div className="flex items-start gap-3">
            <img
              src={PROFILE.avatar}
              alt={PROFILE.name}
              width={86}
              height={87}
              className="size-18 shrink-0 rounded-full object-cover sm:h-21.75 sm:w-21.5"
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
            <div className="grid gap-4.75 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {pagedPhotos.map((photo) => (
                <AppLink
                  key={photo.id}
                  href={galleryDetailPath(photo.id)}
                  className="block overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white transition hover:border-black/20 hover:shadow-sm"
                >
                  <article>
                    <div className="relative h-55 bg-[#f3f4f6] sm:h-63">
                      <img
                        src={photo.image}
                        alt={photo.title}
                        width={370}
                        height={252}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.5px] text-[#3f51b5]">
                        {displayBadge(photo.badge, t)}
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

            <MarketingPagination
              className="mt-9"
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
              ariaLabel={t('gallery.paginationAria', { defaultValue: 'Gallery pagination' })}
            />
          </div>
        </Shell>
      </section>
    </SitePageLayout>
  );
});

PhotographerProfileContent.displayName = 'PhotographerProfileContent';

export default PhotographerProfileContent;
