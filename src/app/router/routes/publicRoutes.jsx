import React, { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';
import PublicLayout from '@/layouts/PublicLayout';
import { ROUTES } from '@/shared/config';
import PageLoader from '../ui/PageLoader';

const Home = lazy(() => import('@/portals/public/home/Home'));
const PublicAlbumTypes = lazy(
  () => import('@/portals/public/album-types/AlbumTypes'),
);
const AdvertiseWithUs = lazy(
  () => import('@/portals/public/advertise-with-us/AdvertiseWithUs'),
);
const About = lazy(() => import('@/portals/public/about/About'));
const Services = lazy(() => import('@/portals/public/services/Services'));
const Competitions = lazy(
  () => import('@/portals/public/competitions/Competitions'),
);
const Gallery = lazy(() => import('@/portals/public/gallery/Gallery'));
const BuyPhotos = lazy(() => import('@/portals/public/buy-photos/BuyPhotos'));
const Marketplace = lazy(
  () => import('@/portals/public/marketplace/Marketplace'),
);
const BuyPhotoDetail = lazy(
  () => import('@/portals/public/buy-photos/detail/BuyPhotoDetail'),
);
const BuyPhotosCheckout = lazy(
  () => import('@/portals/public/buy-photos/checkout/BuyPhotosCheckout'),
);
const BuyPhotosSuccess = lazy(
  () => import('@/portals/public/buy-photos/success/BuyPhotosSuccess'),
);
const GalleryDetail = lazy(
  () => import('@/portals/public/gallery/detail/GalleryDetail'),
);
const GallerySixDetail = lazy(
  () => import('@/portals/public/gallery/detail/GallerySixDetail'),
);
const GallerySixBlueDetail = lazy(
  () => import('@/portals/public/gallery/detail/GallerySixBlueDetail'),
);
const GalleryTwelveDetail = lazy(
  () => import('@/portals/public/gallery/detail/GalleryTwelveDetail'),
);
const PhotographerProfile = lazy(
  () => import('@/portals/public/photographer/PhotographerProfile'),
);
const StoreCheckout = lazy(
  () => import('@/portals/public/photographer/checkout/StoreCheckout'),
);
const Leaderboard = lazy(
  () => import('@/portals/public/leaderboard/Leaderboard'),
);
const Winners = lazy(() => import('@/portals/public/winners/Winners'));
const WinnerDetail = lazy(
  () => import('@/portals/public/winners/WinnerDetail'),
);
const Privacy = lazy(() => import('@/portals/public/legal/privacy/Privacy'));
const Terms = lazy(() => import('@/portals/public/legal/terms/Terms'));
const Cookies = lazy(() => import('@/portals/public/legal/cookies/Cookies'));
const DeveloperPage = lazy(() => import('@/pages/DeveloperPage'));

export const publicRoutes = (
  <>
    <Route
      element={
        <Suspense fallback={<PageLoader />}>
          <PublicLayout />
        </Suspense>
      }
    >
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.ABOUT} element={<About />} />
      <Route path={ROUTES.SERVICES} element={<Services />} />
      <Route path={ROUTES.COMPETITIONS} element={<Competitions />} />
      <Route path={ROUTES.GALLERY} element={<Gallery />} />
      <Route path={ROUTES.ALBUM_TYPES} element={<PublicAlbumTypes />} />
      <Route path={ROUTES.ADVERTISE_WITH_US} element={<AdvertiseWithUs />} />
      <Route path={ROUTES.BUY_PHOTOS} element={<BuyPhotos />} />
      <Route path={ROUTES.MARKETPLACE} element={<Marketplace />} />
      <Route
        path={ROUTES.BUY_PHOTOS_CHECKOUT}
        element={<BuyPhotosCheckout />}
      />
      <Route
        path={ROUTES.BUY_PHOTOS_SUCCESS}
        element={<BuyPhotosSuccess />}
      />
      <Route path={ROUTES.BUY_PHOTOS_DETAIL} element={<BuyPhotoDetail />} />
      <Route
        path={ROUTES.GALLERY_SIX_DETAIL}
        element={<GallerySixDetail />}
      />
      <Route
        path={ROUTES.GALLERY_SIX_BLUE_DETAIL}
        element={<GallerySixBlueDetail />}
      />
      <Route
        path={ROUTES.GALLERY_TWELVE_DETAIL}
        element={<GalleryTwelveDetail />}
      />
      <Route path={ROUTES.GALLERY_DETAIL} element={<GalleryDetail />} />
      <Route
        path={ROUTES.PHOTOGRAPHER_PROFILE}
        element={<PhotographerProfile />}
      />
      <Route
        path={ROUTES.PHOTOGRAPHER_STORE_CHECKOUT}
        element={<StoreCheckout />}
      />
      <Route path={ROUTES.LEADERBOARD} element={<Leaderboard />} />
      <Route path={ROUTES.WINNERS} element={<Winners />} />
      <Route path={ROUTES.WINNERS_DETAIL} element={<WinnerDetail />} />
      <Route path={ROUTES.PRIVACY} element={<Privacy />} />
      <Route path={ROUTES.TERMS} element={<Terms />} />
      <Route path={ROUTES.COOKIES} element={<Cookies />} />
    </Route>

    <Route
      path={ROUTES.DEVELOPER}
      element={
        <Suspense fallback={<PageLoader />}>
          <DeveloperPage />
        </Suspense>
      }
    />
    <Route
      path={ROUTES.DEVELOPER_COMPONENT}
      element={
        <Suspense fallback={<PageLoader />}>
          <DeveloperPage />
        </Suspense>
      }
    />
  </>
);
