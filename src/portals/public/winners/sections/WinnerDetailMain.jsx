import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import GalleryDetailView from '@/components/data-display/GalleryDetailView/GalleryDetailView';
import { toWinnerDetailEntry } from '@/portals/public/winners/data/winnersArchive';
import WinnerDetailBreadcrumb from '@/portals/public/winners/detail/WinnerDetailBreadcrumb';
import { ROUTES } from '@/shared/config';

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
