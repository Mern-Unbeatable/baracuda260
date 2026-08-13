import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import ProfileConnectionsContent from '@/portals/member/views/ProfileConnectionsContent';
import { PROFILE_FOLLOWERS } from '@/portals/member/data/profileConnectionsData';

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
