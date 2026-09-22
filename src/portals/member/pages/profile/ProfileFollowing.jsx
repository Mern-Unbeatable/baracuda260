import React, { memo } from 'react';
import { PROFILE_FOLLOWING } from '@/portals/member/data/profileConnectionsData';
import ProfileConnectionsContent from '@/portals/member/views/ProfileConnectionsContent';
import { useSEO } from '@/shared/hooks/useSEO';

const ProfileFollowing = memo(() => {
  useSEO({
    title: 'Following',
    description: 'View photographers you follow on My12Photos.',
    keywords: ['following', 'profile', 'photographers', 'My12Photos'],
  });

  return (
    <ProfileConnectionsContent
      titleKey="profileConnections.following.title"
      subtitleKey="profileConnections.following.subtitle"
      photographers={PROFILE_FOLLOWING}
    />
  );
});

ProfileFollowing.displayName = 'ProfileFollowing';

export default ProfileFollowing;
