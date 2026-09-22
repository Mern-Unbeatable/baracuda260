import React, { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { ROUTES } from '@/shared/config';

const seg = (route) => route.replace(`${ROUTES.ADMIN}/`, '');

const AdminGallery = lazy(() => import('@/portals/admin/pages/Gallery'));
const AdminGalleryDetail = lazy(
  () => import('@/portals/admin/pages/GalleryDetail'),
);
const PremiumPhotos = lazy(() => import('@/portals/admin/pages/PremiumPhotos'));
const PremiumPhotosDetail = lazy(
  () => import('@/portals/admin/pages/PremiumPhotosDetail'),
);
const PromotedProducts = lazy(
  () => import('@/portals/admin/pages/PromotedProducts'),
);
const Users = lazy(() => import('@/portals/admin/pages/Users'));
const Categories = lazy(() => import('@/portals/admin/pages/Categories'));
const AlbumTypes = lazy(() => import('@/portals/admin/pages/AlbumTypes'));
const AdminWinners = lazy(() => import('@/portals/admin/pages/Winners'));
const AdminPayouts = lazy(() => import('@/portals/admin/pages/Payouts'));
const AdminSupport = lazy(() => import('@/portals/admin/pages/Support'));
const BusinessPhotos = lazy(
  () => import('@/portals/admin/pages/BusinessPhotos'),
);
const BusinessLinkDetails = lazy(
  () => import('@/portals/admin/pages/BusinessLinkDetails'),
);
const AdminNewsletter = lazy(() => import('@/portals/admin/pages/Newsletter'));
const AdminComment = lazy(() => import('@/portals/admin/pages/Comment'));
const AdsManagement = lazy(() => import('@/portals/admin/pages/AdsManagement'));
const Reports = lazy(() => import('@/portals/admin/pages/Reports'));
const ReportDetail = lazy(() => import('@/portals/admin/pages/ReportDetail'));
const DemoProfiles = lazy(() => import('@/portals/admin/pages/DemoProfiles'));
const DemoProfilesCreate = lazy(
  () => import('@/portals/admin/pages/DemoProfilesCreate'),
);
const PromoLinks = lazy(() => import('@/portals/admin/pages/PromoLinks'));
const SettingsRoute = lazy(() => import('@/portals/admin/pages/SettingsRoute'));
const MarketingStatistics = lazy(
  () => import('@/portals/admin/pages/MarketingStatistics'),
);

export const adminRoutes = (
  <>
    <Route
      path={seg(ROUTES.ADMIN_UPLOAD_PHOTOS)}
      element={<Navigate to={ROUTES.ADMIN_MY_ARTWORK_UPLOAD} replace />}
    />
    <Route
      path={seg(ROUTES.ADMIN_UPLOAD_SINGLE)}
      element={
        <Navigate to={ROUTES.ADMIN_MY_ARTWORK_UPLOAD_SINGLE} replace />
      }
    />
    <Route
      path={seg(ROUTES.ADMIN_UPLOAD_SIX)}
      element={<Navigate to={ROUTES.ADMIN_MY_ARTWORK_UPLOAD_SIX} replace />}
    />
    <Route
      path={seg(ROUTES.ADMIN_UPLOAD_ZODIAC12)}
      element={
        <Navigate to={ROUTES.ADMIN_MY_ARTWORK_UPLOAD_ZODIAC12} replace />
      }
    />
    <Route path={seg(ROUTES.ADMIN_GALLERY)} element={<AdminGallery />} />
    <Route
      path={seg(ROUTES.ADMIN_GALLERY_DETAIL)}
      element={<AdminGalleryDetail />}
    />
    <Route
      path={seg(ROUTES.ADMIN_PREMIUM_PHOTOS)}
      element={<PremiumPhotos />}
    />
    <Route
      path={seg(ROUTES.ADMIN_PREMIUM_PHOTOS_DETAIL)}
      element={<PremiumPhotosDetail />}
    />
    <Route
      path={seg(ROUTES.ADMIN_PROMOTED_PRODUCTS)}
      element={<PromotedProducts />}
    />
    <Route
      path={seg(ROUTES.ADMIN_PROMOTED_PRODUCTS_DETAIL)}
      element={<PromotedProducts />}
    />
    <Route path={seg(ROUTES.ADMIN_USERS)} element={<Users />} />
    <Route path={seg(ROUTES.ADMIN_CATEGORIES)} element={<Categories />} />
    <Route path={seg(ROUTES.ADMIN_ALBUM_TYPES)} element={<AlbumTypes />} />
    <Route path={seg(ROUTES.ADMIN_WINNERS)} element={<AdminWinners />} />
    <Route path={seg(ROUTES.ADMIN_PAYOUTS)} element={<AdminPayouts />} />
    <Route path={seg(ROUTES.ADMIN_SUPPORT)} element={<AdminSupport />} />
    <Route
      path={seg(ROUTES.ADMIN_BUSINESS_PHOTOS)}
      element={<BusinessPhotos />}
    />
    <Route
      path={seg(ROUTES.ADMIN_BUSINESS_PHOTOS_DETAIL)}
      element={<BusinessLinkDetails />}
    />
    <Route path={seg(ROUTES.ADMIN_SETTINGS)} element={<SettingsRoute />} />
    <Route
      path={seg(ROUTES.ADMIN_NEWSLETTER)}
      element={<AdminNewsletter />}
    />
    <Route path={seg(ROUTES.ADMIN_COMMENT)} element={<AdminComment />} />
    <Route path={seg(ROUTES.ADMIN_ADS)} element={<AdsManagement />} />
    <Route
      path={seg(ROUTES.ADMIN_DEMO_PROFILES)}
      element={<DemoProfiles />}
    />
    <Route
      path={seg(ROUTES.ADMIN_DEMO_PROFILES_CREATE)}
      element={<DemoProfilesCreate />}
    />
    <Route path={seg(ROUTES.ADMIN_PROMO_LINKS)} element={<PromoLinks />} />
    <Route path={seg(ROUTES.ADMIN_REPORTS)} element={<Reports />} />
    <Route
      path={seg(ROUTES.ADMIN_REPORTS_DETAIL)}
      element={<ReportDetail />}
    />
    <Route
      path={seg(ROUTES.ADMIN_MARKETING_STATISTICS)}
      element={<MarketingStatistics />}
    />
  </>
);
