import React, { memo } from 'react';
import { Outlet } from 'react-router-dom';

/**
 * Public marketing routes — chrome lives in SitePageLayout inside each page view.
 */
const PublicLayout = memo(() => <Outlet />);

PublicLayout.displayName = 'PublicLayout';

export default PublicLayout;
