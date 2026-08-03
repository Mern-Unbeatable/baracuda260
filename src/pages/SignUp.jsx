import React, { memo } from 'react';
import { useSEO } from '../hooks/useSEO';
import SignUpContent from '../components/signup/SignUpContent';

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
