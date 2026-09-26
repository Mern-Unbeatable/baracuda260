import { ROUTES } from '@/shared/config';

export const normalizeRole = (role) =>
  typeof role === 'string' ? role.trim().toUpperCase() : '';

export const isAdminRole = (role) => normalizeRole(role) === 'ADMIN';

export const getPortalByRole = (role) => {
  switch (normalizeRole(role)) {
    case 'ADMIN':
      return ROUTES.ADMIN;
    case 'USER':
    case 'MEMBER':
      return ROUTES.USER;
    default:
      return null;
  }
};

export const getDashboardRouteByRole = (role) => {
  switch (getPortalByRole(role)) {
    case ROUTES.ADMIN:
      return ROUTES.ADMIN_DASHBOARD;
    case ROUTES.USER:
      return ROUTES.USER_DASHBOARD;
    default:
      return ROUTES.LOGIN;
  }
};
