import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import AdminPageHeader from '@/portals/admin/components/ui/AdminPageHeader';

/**
 * Placeholder for admin sections that are not built yet.
 * Overview is the only completed admin page.
 */
const AdminComingSoonContent = memo(() => {
  const { t } = useTranslation();

  return (
    <section
      aria-labelledby="admin-coming-soon-title"
      className="flex min-h-[50vh] w-full flex-col items-start justify-center rounded-[18px] border border-[#e8ebf1] bg-white px-6 py-12 shadow-[0px_4px_8px_rgba(27,39,69,0.02)] sm:px-10 sm:py-16"
    >
      <AdminPageHeader
        eyebrow={t('adminOverview.comingSoon.eyebrow')}
        title={t('adminOverview.comingSoon.title')}
        description={t('adminOverview.comingSoon.body')}
        titleId="admin-coming-soon-title"
      />
    </section>
  );
});

AdminComingSoonContent.displayName = 'AdminComingSoonContent';

export default AdminComingSoonContent;
