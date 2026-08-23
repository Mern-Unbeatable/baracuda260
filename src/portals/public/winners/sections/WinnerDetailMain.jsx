import { useTranslation } from 'react-i18next';
import React, { memo } from 'react';
import { ROUTES } from '@/shared/config';
import GalleryDetailView from '@/portals/public/gallery/detail/GalleryDetailView';
import WinnerDetailBreadcrumb from '@/portals/public/winners/detail/WinnerDetailBreadcrumb';
import { toWinnerDetailEntry } from '@/portals/public/winners/data/winnersArchive';

const WinnerDetailMain = memo(({ winner }) => {
  const { t } = useTranslation();
  const entry = toWinnerDetailEntry(winner, t);

  return (
    <GalleryDetailView
      entry={entry}
      variant="single"
      activeHref={ROUTES.WINNERS}
      Breadcrumb={WinnerDetailBreadcrumb}
      rootClassName="winners-detail-page-root"
    />
  );
});

WinnerDetailMain.displayName = 'WinnerDetailMain';

export default WinnerDetailMain;
