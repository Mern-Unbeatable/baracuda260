import React, { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from 'react-router-dom';
import PublicLayout from '@/layouts/PublicLayout';
import AppShellLayout from '@/layouts/AppShellLayout/Layout';
import ScrollToTop from '@/shared/ui/ScrollToTop';
import { ROUTES } from '@/shared/config';
import ProtectedRoute from './guards/ProtectedRoute';
import PageLoader from './ui/PageLoader';
import NotFound from './ui/NotFound';

const seg = (route) => route.replace(`${ROUTES.ADMIN}/`, '');

const Home = lazy(() => import('@/portals/public/home/Home'));
const PublicAlbumTypes = lazy(() => import('@/portals/public/album-types/AlbumTypes'));
const About = lazy(() => import('@/portals/public/about/About'));
const Contact = lazy(() => import('@/portals/public/contact/Contact'));
const Services = lazy(() => import('@/portals/public/services/Services'));
const Competitions = lazy(() => import('@/portals/public/competitions/Competitions'));
const Gallery = lazy(() => import('@/portals/public/gallery/Gallery'));
const BuyPhotos = lazy(() => import('@/portals/public/buy-photos/BuyPhotos'));
const BuyPhotoDetail = lazy(() => import('@/portals/public/buy-photos/detail/BuyPhotoDetail'));
const BuyPhotosCheckout = lazy(() => import('@/portals/public/buy-photos/checkout/BuyPhotosCheckout'));
const BuyPhotosSuccess = lazy(() => import('@/portals/public/buy-photos/success/BuyPhotosSuccess'));
const GalleryDetail = lazy(() => import('@/portals/public/gallery/detail/GalleryDetail'));
const GallerySixDetail = lazy(() => import('@/portals/public/gallery/detail/GallerySixDetail'));
const GallerySixBlueDetail = lazy(() => import('@/portals/public/gallery/detail/GallerySixBlueDetail'));
const GalleryTwelveDetail = lazy(() => import('@/portals/public/gallery/detail/GalleryTwelveDetail'));
const PhotographerProfile = lazy(() => import('@/portals/public/photographer/PhotographerProfile'));
const Leaderboard = lazy(() => import('@/portals/public/leaderboard/Leaderboard'));
const Winners = lazy(() => import('@/portals/public/winners/Winners'));
const WinnerDetail = lazy(() => import('@/portals/public/winners/WinnerDetail'));
const Privacy = lazy(() => import('@/portals/public/legal/privacy/Privacy'));
const Terms = lazy(() => import('@/portals/public/legal/terms/Terms'));
const Cookies = lazy(() => import('@/portals/public/legal/cookies/Cookies'));
const Login = lazy(() => import('@/portals/auth/pages/Login'));
const SignUp = lazy(() => import('@/portals/auth/pages/SignUp'));

const Dashboard = lazy(() => import('@/portals/member/pages/Dashboard'));
const UploadPhotos = lazy(() => import('@/portals/member/pages/UploadPhotos'));
const SinglePhoto = lazy(() => import('@/portals/member/pages/SinglePhoto'));
const SixPhoto = lazy(() => import('@/portals/member/pages/SixPhoto'));
const Zodiac12 = lazy(() => import('@/portals/member/pages/Zodiac12'));
const MyCompetitions = lazy(() => import('@/portals/member/pages/MyCompetitions'));
const MyCompetitionDetails = lazy(() => import('@/portals/member/pages/MyCompetitionDetails'));
const Submissions = lazy(() => import('@/portals/admin/pages/Submissions'));
const Users = lazy(() => import('@/portals/admin/pages/Users'));
const Categories = lazy(() => import('@/portals/admin/pages/Categories'));
const AlbumTypes = lazy(() => import('@/portals/admin/pages/AlbumTypes'));
const AdminWinners = lazy(() => import('@/portals/admin/pages/Winners'));
const AdminPayouts = lazy(() => import('@/portals/admin/pages/Payouts'));
const AdminSupport = lazy(() => import('@/portals/admin/pages/Support'));
const BusinessPhotos = lazy(() => import('@/portals/admin/pages/BusinessPhotos'));
const BusinessLinkDetails = lazy(() => import('@/portals/admin/pages/BusinessLinkDetails'));
const AdminNewsletter = lazy(() => import('@/portals/admin/pages/Newsletter'));
const AdminComment = lazy(() => import('@/portals/admin/pages/Comment'));
const Chat = lazy(() => import('@/portals/member/pages/Chat'));
const PrizePayments = lazy(() => import('@/portals/member/pages/PrizePayments'));
const Profile = lazy(() => import('@/portals/member/pages/Profile'));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<ScrollToTop />}>
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
        <Route path={ROUTES.CONTACT} element={<Contact />} />
        <Route path={ROUTES.COMPETITIONS} element={<Competitions />} />
        <Route path={ROUTES.GALLERY} element={<Gallery />} />
        <Route path={ROUTES.ALBUM_TYPES} element={<PublicAlbumTypes />} />
        <Route path={ROUTES.BUY_PHOTOS} element={<BuyPhotos />} />
        <Route path={ROUTES.BUY_PHOTOS_CHECKOUT} element={<BuyPhotosCheckout />} />
        <Route path={ROUTES.BUY_PHOTOS_SUCCESS} element={<BuyPhotosSuccess />} />
        <Route path={ROUTES.BUY_PHOTOS_DETAIL} element={<BuyPhotoDetail />} />
        <Route path={ROUTES.GALLERY_SIX_DETAIL} element={<GallerySixDetail />} />
        <Route path={ROUTES.GALLERY_SIX_BLUE_DETAIL} element={<GallerySixBlueDetail />} />
        <Route path={ROUTES.GALLERY_TWELVE_DETAIL} element={<GalleryTwelveDetail />} />
        <Route path={ROUTES.GALLERY_DETAIL} element={<GalleryDetail />} />
        <Route path={ROUTES.PHOTOGRAPHER_PROFILE} element={<PhotographerProfile />} />
        <Route path={ROUTES.LEADERBOARD} element={<Leaderboard />} />
        <Route path={ROUTES.WINNERS} element={<Winners />} />
        <Route path={ROUTES.WINNERS_DETAIL} element={<WinnerDetail />} />
        <Route path={ROUTES.PRIVACY} element={<Privacy />} />
        <Route path={ROUTES.TERMS} element={<Terms />} />
        <Route path={ROUTES.COOKIES} element={<Cookies />} />
      </Route>

      <Route
        path={ROUTES.LOGIN}
        element={
          <Suspense fallback={<PageLoader />}>
            <Login />
          </Suspense>
        }
      />

      <Route
        path={ROUTES.SIGNUP}
        element={
          <Suspense fallback={<PageLoader />}>
            <SignUp />
          </Suspense>
        }
      />

      <Route
        path={ROUTES.ADMIN}
        element={
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute>
              <AppShellLayout />
            </ProtectedRoute>
          </Suspense>
        }
      >
        <Route index element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />} />
        <Route path={seg(ROUTES.ADMIN_DASHBOARD)} element={<Dashboard />} />
        <Route path={seg(ROUTES.ADMIN_UPLOAD_PHOTOS)} element={<UploadPhotos />} />
        <Route path={seg(ROUTES.ADMIN_UPLOAD_SINGLE)} element={<SinglePhoto />} />
        <Route path={seg(ROUTES.ADMIN_UPLOAD_SIX)} element={<SixPhoto />} />
        <Route path={seg(ROUTES.ADMIN_UPLOAD_ZODIAC12)} element={<Zodiac12 />} />
        <Route path={seg(ROUTES.ADMIN_MY_COMPETITIONS)} element={<MyCompetitions />} />
        <Route path={seg(ROUTES.ADMIN_MY_COMPETITION_DETAIL)} element={<MyCompetitionDetails />} />
        <Route path={seg(ROUTES.ADMIN_SUBMISSIONS)} element={<Submissions />} />
        <Route path={seg(ROUTES.ADMIN_USERS)} element={<Users />} />
        <Route path={seg(ROUTES.ADMIN_CATEGORIES)} element={<Categories />} />
        <Route path={seg(ROUTES.ADMIN_ALBUM_TYPES)} element={<AlbumTypes />} />
        <Route path={seg(ROUTES.ADMIN_WINNERS)} element={<AdminWinners />} />
        <Route path={seg(ROUTES.ADMIN_PAYOUTS)} element={<AdminPayouts />} />
        <Route path={seg(ROUTES.ADMIN_SUPPORT)} element={<AdminSupport />} />
        <Route path={seg(ROUTES.ADMIN_BUSINESS_PHOTOS)} element={<BusinessPhotos />} />
        <Route path={seg(ROUTES.ADMIN_BUSINESS_PHOTOS_DETAIL)} element={<BusinessLinkDetails />} />
        <Route path={seg(ROUTES.ADMIN_CHAT)} element={<Chat />} />
        <Route path={seg(ROUTES.ADMIN_PRIZE_PAYMENTS)} element={<PrizePayments />} />
        <Route path={seg(ROUTES.ADMIN_PROFILE)} element={<Profile />} />
        <Route path={seg(ROUTES.ADMIN_NEWSLETTER)} element={<AdminNewsletter />} />
        <Route path={seg(ROUTES.ADMIN_COMMENT)} element={<AdminComment />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
);

export default router;
