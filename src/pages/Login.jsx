import React, { memo } from 'react';
import { useSEO } from '../hooks/useSEO';
import LoginContent from '../components/login/LoginContent';

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
