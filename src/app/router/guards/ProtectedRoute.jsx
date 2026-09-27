import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import {
  selectIsAuthenticated,
  selectUser,
} from '@/app/store/slices/authSlice';
import { ROUTES } from '@/shared/config';
import { getDashboardRouteByRole, getPortalByRole } from '@/shared/utils/roles';

const ProtectedRoute = ({ children, portal }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (portal && getPortalByRole(user?.role) !== portal) {
    return <Navigate to={getDashboardRouteByRole(user?.role)} replace />;
  }

  return children;
};

export default ProtectedRoute;
