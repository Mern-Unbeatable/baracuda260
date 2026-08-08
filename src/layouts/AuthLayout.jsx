import React, { memo } from 'react';
import { Outlet } from 'react-router-dom';

/** Auth routes (login/signup) — page chrome is inside each view. */
const AuthLayout = memo(() => <Outlet />);

AuthLayout.displayName = 'AuthLayout';

export default AuthLayout;
