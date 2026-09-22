import React, { Suspense } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
} from 'react-router-dom';
import ScrollToTop from '@/components/common/ScrollToTop/ScrollToTop';
import AppShellLayout from '@/layouts/AppShellLayout/Layout';
import { ROUTES } from '@/shared/config';
import ProtectedRoute from './guards/ProtectedRoute';
import NotFound from './ui/NotFound';
import PageLoader from './ui/PageLoader';

import { publicRoutes } from './routes/publicRoutes';
import { authRoutes } from './routes/authRoutes';
import { memberRoutes } from './routes/memberRoutes';
import { adminRoutes } from './routes/adminRoutes';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<ScrollToTop />}>
      {publicRoutes}
      {authRoutes}

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
        <Route
          index
          element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />}
        />
        {memberRoutes}
        {adminRoutes}
      </Route>

      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

export default router;
