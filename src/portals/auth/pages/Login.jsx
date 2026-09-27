import React, { memo } from 'react';
import LoginContent from '@/portals/auth/views/LoginContent';

const Login = memo(() => {
  return <LoginContent />;
});

Login.displayName = 'Login';

export default Login;
