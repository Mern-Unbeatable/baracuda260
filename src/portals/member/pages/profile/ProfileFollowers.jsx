import React, { memo } from 'react';
import { PROFILE_FOLLOWERS } from '@/portals/member/data/profileConnectionsData';
import ProfileConnectionsContent from '@/portals/member/views/ProfileConnectionsContent';
import { useSEO } from '@/shared/hooks/useSEO';

const ProfileFollowers = memo(() => {
  useSEO({
    title: 'Followers',
    description: 'View photographers who follow you on My12Photos.',
    keywords: ['followers', 'profile', 'photographers', 'My12Photos'],
  });

  return (
    <ProfileConnectionsContent
      titleKey="profileConnections.followers.title"
      subtitleKey="profileConnections.followers.subtitle"
      photographers={PROFILE_FOLLOWERS}
    />
  );
});

ProfileFollowers.displayName = 'ProfileFollowers';

export default ProfileFollowers;
