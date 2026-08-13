import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { useSEO } from '@/shared/hooks/useSEO';
import { selectUser } from '@/app/store/slices/authSlice';
import AdminBusinessLinkContent from '@/portals/admin/views/AdminBusinessLinkContent';
import BusinessLinkContent from '@/portals/member/views/BusinessLinkContent';

const BusinessPhotos = memo(() => {
  const user = useSelector(selectUser);
  const isAdmin = user?.role === 'admin';

  useSEO({
    title: 'Business Link Photos',
    description: isAdmin
      ? 'Admin business link photos — review uploaded 12-photo albums and manage submissions on My12Photos.'
      : 'Submit your 12-photo business link zodiac portfolio for custom brand licensing on My12Photos.',
    keywords: ['business link', 'photos', 'zodiac', 'My12Photos'],
  });

  return isAdmin ? <AdminBusinessLinkContent /> : <BusinessLinkContent />;
});

BusinessPhotos.displayName = 'BusinessPhotos';

export default BusinessPhotos;
