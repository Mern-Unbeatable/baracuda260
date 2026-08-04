import React, { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
  Link,
  useLocation,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from '../components/Layout';
import AdminLayout from '../components/layout/admin/Layout';
import ScrollToTop from '../components/ScrollToTop';
import { ROUTES } from '../config';
import { selectIsAuthenticated } from '../store/slices/authSlice';

// Derive a relative segment from an absolute admin route path
const seg = (route) => route.replace(`${ROUTES.ADMIN}/`, '');

const Home = lazy(() => import('../pages/Home'));
const About = lazy(() => import('../pages/About'));
const Contact = lazy(() => import('../pages/Contact'));
const Services = lazy(() => import('../pages/Services'));
const Competitions = lazy(() => import('../pages/Competitions'));
const Gallery = lazy(() => import('../pages/Gallery'));
const GalleryDetail = lazy(() => import('../pages/GalleryDetail'));
const GallerySixDetail = lazy(() => import('../pages/GallerySixDetail'));
const GallerySixBlueDetail = lazy(() => import('../pages/GallerySixBlueDetail'));
const GalleryTwelveDetail = lazy(() => import('../pages/GalleryTwelveDetail'));
const PhotographerProfile = lazy(() => import('../pages/PhotographerProfile'));
const Leaderboard = lazy(() => import('../pages/Leaderboard'));
const Winners = lazy(() => import('../pages/Winners'));
const Privacy = lazy(() => import('../pages/Privacy'));
const Terms = lazy(() => import('../pages/Terms'));
const Cookies = lazy(() => import('../pages/Cookies'));
const Login = lazy(() => import('../pages/Login'));
const SignUp = lazy(() => import('../pages/SignUp'));

// User dashboard pages — each lazy-loaded so they only download when visited
const Dashboard = lazy(() => import('../pages/admin/Dashboard'));
const UploadPhotos = lazy(() => import('../pages/admin/UploadPhotos'));
const SinglePhoto = lazy(() => import('../pages/admin/SinglePhoto'));
const SixPhoto = lazy(() => import('../pages/admin/SixPhoto'));
const Zodiac12 = lazy(() => import('../pages/admin/Zodiac12'));
const MyCompetitions = lazy(() => import('../pages/admin/MyCompetitions'));
const MyCompetitionDetails = lazy(() => import('../pages/admin/MyCompetitionDetails'));
const BusinessPhotos = lazy(() => import('../pages/admin/BusinessPhotos'));
const Chat = lazy(() => import('../pages/admin/Chat'));
const PrizePayments = lazy(() => import('../pages/admin/PrizePayments'));
const Profile = lazy(() => import('../pages/admin/Profile'));
const AdminComingSoon = lazy(() => import('../pages/admin/AdminComingSoon'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-8 h-8 border-4 border-[#ee1c25] border-t-transparent rounded-full animate-spin" />
  </div>
);

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center px-4">
    <h1 className="text-6xl font-bold text-gray-800">404</h1>
    <p className="text-xl text-gray-500">Page not found</p>
    <Link to={ROUTES.HOME} className="mt-2 text-blue-600 hover:underline text-sm font-medium">
      Back to Home
    </Link>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }
  return children;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<ScrollToTop />}>
      <Route
        element={
          <Suspense fallback={<PageLoader />}>
            <Layout />
          </Suspense>
        }
      >
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.ABOUT} element={<About />} />
        <Route path={ROUTES.SERVICES} element={<Services />} />
        <Route path={ROUTES.CONTACT} element={<Contact />} />
        <Route path={ROUTES.COMPETITIONS} element={<Competitions />} />
        <Route path={ROUTES.GALLERY} element={<Gallery />} />
        <Route path={ROUTES.GALLERY_SIX_DETAIL} element={<GallerySixDetail />} />
        <Route path={ROUTES.GALLERY_SIX_BLUE_DETAIL} element={<GallerySixBlueDetail />} />
        <Route path={ROUTES.GALLERY_TWELVE_DETAIL} element={<GalleryTwelveDetail />} />
        <Route path={ROUTES.GALLERY_DETAIL} element={<GalleryDetail />} />
        <Route path={ROUTES.PHOTOGRAPHER_PROFILE} element={<PhotographerProfile />} />
        <Route path={ROUTES.LEADERBOARD} element={<Leaderboard />} />
        <Route path={ROUTES.WINNERS} element={<Winners />} />
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
              <AdminLayout />
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
        <Route path={seg(ROUTES.ADMIN_BUSINESS_PHOTOS)} element={<BusinessPhotos />} />
        <Route path={seg(ROUTES.ADMIN_CHAT)} element={<Chat />} />
        <Route path={seg(ROUTES.ADMIN_PRIZE_PAYMENTS)} element={<PrizePayments />} />
        <Route path={seg(ROUTES.ADMIN_PROFILE)} element={<Profile />} />
        <Route path={seg(ROUTES.ADMIN_USERS)} element={<AdminComingSoon />} />
        <Route path={seg(ROUTES.ADMIN_CATEGORIES)} element={<AdminComingSoon />} />
        <Route path={seg(ROUTES.ADMIN_ALBUM_TYPES)} element={<AdminComingSoon />} />
        <Route path={seg(ROUTES.ADMIN_WINNERS)} element={<AdminComingSoon />} />
        <Route path={seg(ROUTES.ADMIN_NEWSLETTER)} element={<AdminComingSoon />} />
        <Route path={seg(ROUTES.ADMIN_COMMENT)} element={<AdminComingSoon />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
);

export default router;
