import { useTranslation } from 'react-i18next';
import React, { memo } from 'react';
import { ROUTES } from '@/shared/config';
import { AppLink } from '@/shared/site-chrome';

/**
 * Breadcrumb for gallery card detail pages: Home › Gallery › {title}
 */
const GalleryDetailBreadcrumb = memo(({ title }) => {
  const { t } = useTranslation();

  return (
    <nav
      aria-label={t('galleryDetail.breadcrumb.aria', { defaultValue: 'Breadcrumb' })}
      className="mb-5 sm:mb-6"
    >
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] font-semibold uppercase leading-4.75 tracking-[1.2px] text-[#7f8ba1] sm:text-[14px]">
        <li>
          <AppLink href={ROUTES.HOME} className="transition hover:text-[#ee1c25]">
            {t('galleryDetail.breadcrumb.home')}
          </AppLink>
        </li>
        <li aria-hidden="true" className="text-[#c4c9d4]">
          ›
        </li>
        <li>
          <AppLink href={ROUTES.GALLERY} className="transition hover:text-[#ee1c25]">
            {t('galleryDetail.breadcrumb.gallery')}
          </AppLink>
        </li>
        <li aria-hidden="true" className="text-[#c4c9d4]">
          ›
        </li>
        <li
          className="font-semibold normal-case tracking-normal text-[#2d3392]"
          aria-current="page"
        >
          {title}
        </li>
      </ol>
    </nav>
  );
});

GalleryDetailBreadcrumb.displayName = 'GalleryDetailBreadcrumb';

export default GalleryDetailBreadcrumb;
