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
import { ROUTES } from '../config';
import { selectIsAuthenticated } from '../store/slices/authSlice';

// Derive a relative segment from an absolute admin route path
const seg = (route) => route.replace(`${ROUTES.ADMIN}/`, '');

const Home = lazy(() => import('../pages/Home'));
const About = lazy(() => import('../pages/About'));
const Contact = lazy(() => import('../pages/Contact'));
const Services = lazy(() => import('../pages/Services'));
const Competitions = lazy(() => import('../pages/Competitions'));
const Login = lazy(() => import('../pages/Login'));

// Admin pages — each lazy-loaded so they only download when visited
const Dashboard = lazy(() => import('../pages/admin/Dashboard'));
const Emails = lazy(() => import('../pages/admin/Emails'));
const Leads = lazy(() => import('../pages/admin/Leads'));
const Orders = lazy(() => import('../pages/admin/Orders'));
const MarketplaceOrders = lazy(() => import('../pages/admin/MarketplaceOrders'));
const CaseStudies = lazy(() => import('../pages/admin/CaseStudies'));
const Blog = lazy(() => import('../pages/admin/Blog'));
const Jobs = lazy(() => import('../pages/admin/Jobs'));
const Pricing = lazy(() => import('../pages/admin/Pricing'));
const AdminMessages = lazy(() => import('../pages/admin/Messages'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
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
    <>
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
        <Route path={seg(ROUTES.ADMIN_EMAILS)} element={<Emails />} />
        <Route path={seg(ROUTES.ADMIN_LEADS)} element={<Leads />} />
        <Route path={seg(ROUTES.ADMIN_ORDERS)} element={<Orders />} />
        <Route path={seg(ROUTES.ADMIN_MARKETPLACE_ORDERS)} element={<MarketplaceOrders />} />
        <Route path={seg(ROUTES.ADMIN_CASE_STUDIES)} element={<CaseStudies />} />
        <Route path={seg(ROUTES.ADMIN_BLOG)} element={<Blog />} />
        <Route path={seg(ROUTES.ADMIN_JOBS)} element={<Jobs />} />
        <Route path={seg(ROUTES.ADMIN_PRICING)} element={<Pricing />} />
        <Route path={seg(ROUTES.ADMIN_MESSAGES)} element={<AdminMessages />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </>,
  ),
);

export default router;
