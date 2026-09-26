import React, { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';
import { ROUTES } from '@/shared/config';
import PageLoader from '../ui/PageLoader';

const Login = lazy(() => import('@/portals/auth/pages/Login'));
const SignUp = lazy(() => import('@/portals/auth/pages/SignUp'));
const PasswordRecovery = lazy(
  () => import('@/portals/auth/pages/PasswordRecovery'),
);
const PromoJoin = lazy(() => import('@/portals/public/promo-join/PromoJoin'));

export const authRoutes = (
  <>
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
      path={ROUTES.FORGOT_PASSWORD}
      element={
        <Suspense fallback={<PageLoader />}>
          <PasswordRecovery />
        </Suspense>
      }
    />
    <Route
      path={ROUTES.JOIN_PROMO}
      element={
        <Suspense fallback={<PageLoader />}>
          <PromoJoin />
        </Suspense>
      }
    />
  </>
);
