import React, { memo } from 'react';
import SignUpContent from '@/portals/auth/views/SignUpContent';

const SignUp = memo(() => {
  return <SignUpContent />;
});

SignUp.displayName = 'SignUp';

export default SignUp;
