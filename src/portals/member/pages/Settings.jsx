import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import SettingsContent from '@/portals/member/views/SettingsContent';

const Settings = memo(() => {
  useSEO({
    title: 'Settings',
    description: 'Edit your My12Photos profile details, portfolio links, photos, and account security.',
    keywords: ['settings', 'profile', 'security', 'portfolio', 'My12Photos'],
  });

  return <SettingsContent />;
});

Settings.displayName = 'Settings';

export default Settings;
