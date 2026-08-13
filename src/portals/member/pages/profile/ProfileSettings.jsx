import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft } from 'lucide-react';
import { useSEO } from '@/shared/hooks/useSEO';
import { ROUTES } from '@/shared/config';
import ProfileContent from '@/portals/member/views/ProfileContent';

const ProfileSettings = memo(() => {
  const { t } = useTranslation();

  useSEO({
    title: 'My Profile',
    description: 'Manage your My12Photos account information and password.',
    keywords: ['profile', 'account', 'password', 'My12Photos'],
  });

  return (
    <div className="flex w-full flex-col gap-6">
      <Link
        to={ROUTES.ADMIN_PROFILE}
        className="inline-flex w-fit items-center gap-1.5 text-[14px] font-medium text-[#4048cd] transition hover:text-[#363eb8]"
      >
        <ChevronLeft size={18} strokeWidth={2} aria-hidden="true" />
        {t('profileConnections.backToSelection')}
      </Link>
      <ProfileContent />
    </div>
  );
});

ProfileSettings.displayName = 'ProfileSettings';

export default ProfileSettings;
