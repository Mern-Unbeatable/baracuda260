import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

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
      <p className="text-[12px] font-extrabold uppercase tracking-[1.5px] text-[#7f8ba1] sm:text-[14px]">
        {t('adminOverview.comingSoon.eyebrow')}
      </p>
      <h1
        id="admin-coming-soon-title"
        className="mt-3 text-[28px] leading-tight tracking-[-1.2px] text-[#151e31] sm:text-[36px]"
      >
        {t('adminOverview.comingSoon.title')}
      </h1>
      <p className="mt-3 max-w-xl text-[15px] leading-6 text-[#687186] sm:text-[16px] sm:leading-[25px]">
        {t('adminOverview.comingSoon.body')}
      </p>
    </section>
  );
});

AdminComingSoonContent.displayName = 'AdminComingSoonContent';

export default AdminComingSoonContent;
