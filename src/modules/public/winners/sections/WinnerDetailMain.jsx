import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/shared/config';
import GalleryDetailView from '@/modules/public/gallery/detail/GalleryDetailView';
import WinnerDetailBreadcrumb from '@/modules/public/winners/detail/WinnerDetailBreadcrumb';
import { toWinnerDetailEntry } from '@/modules/public/winners/data/winnersArchive';

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
