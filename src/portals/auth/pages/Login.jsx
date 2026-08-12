import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import LoginContent from '@/portals/auth/views/LoginContent';

const Login = memo(() => {
  useSEO({
    title: 'Log in',
    description: 'Log in to My12Photos to join competitions and showcase your photography.',
    keywords: ['login', 'sign in', 'My12Photos'],
  });

  return <LoginContent />;
});

Login.displayName = 'Login';

export default Login;
