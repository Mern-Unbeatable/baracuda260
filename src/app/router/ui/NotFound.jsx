import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/shared/config';

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center px-4">
    <h1 className="text-6xl font-bold text-gray-800">404</h1>
    <p className="text-xl text-gray-500">Page not found</p>
    <Link to={ROUTES.HOME} className="mt-2 text-blue-600 hover:underline text-sm font-medium">
      Back to Home
    </Link>
  </div>
);

export default NotFound;
