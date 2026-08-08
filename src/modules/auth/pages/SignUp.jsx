import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import SignUpContent from '@/modules/auth/views/SignUpContent';

const SignUp = memo(() => {
  useSEO({
    title: 'Sign up',
    description: 'Create your My12Photos account to join competitions and showcase your photography.',
    keywords: ['sign up', 'register', 'create account', 'My12Photos'],
  });

  return <SignUpContent />;
});

SignUp.displayName = 'SignUp';

export default SignUp;
