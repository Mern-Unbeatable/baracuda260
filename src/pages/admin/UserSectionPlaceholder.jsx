import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Lightweight placeholder for user-dashboard sections not yet designed in Figma.
 */
const UserSectionPlaceholder = memo(({ titleKey }) => {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-[rgba(203,195,213,0.2)] bg-white p-8 shadow-sm sm:p-10">
      <h1 className="text-2xl font-bold text-[#161c27]">{t(titleKey)}</h1>
      <p className="mt-2 text-sm text-[#494453]">{t('dashboard.placeholderBody')}</p>
    </div>
  );
});

UserSectionPlaceholder.displayName = 'UserSectionPlaceholder';

export default UserSectionPlaceholder;
