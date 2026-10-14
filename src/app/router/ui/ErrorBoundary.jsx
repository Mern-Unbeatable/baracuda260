import React from 'react';
import { isRouteErrorResponse, useRouteError, useNavigate } from 'react-router-dom';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button';
import { ROUTES } from '@/shared/config';

export default function ErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  console.error('[RouteErrorBoundary] Uncaught route error:', error);

  let title = 'Something went wrong';
  let message = 'An unexpected error occurred while loading this page.';
  let statusCode = 500;

  if (isRouteErrorResponse(error)) {
    statusCode = error.status;
    title = error.statusText || title;
    message = error.data?.message || message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-12 text-center">
      <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 shadow-xs mb-6">
        <AlertTriangle size={32} strokeWidth={2} aria-hidden="true" />
      </div>

      <span className="text-sm font-semibold tracking-wide text-red-600 uppercase">
        Error {statusCode}
      </span>

      <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        {title}
      </h1>

      <p className="mt-3 max-w-md text-base text-gray-500">
        {message}
      </p>

      {import.meta.env.DEV && error instanceof Error && error.stack && (
        <details className="mt-6 max-w-2xl text-left bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs text-gray-700 overflow-x-auto w-full">
          <summary className="cursor-pointer font-semibold text-gray-900 hover:text-red-600 select-none">
            View Error Stack Details
          </summary>
          <pre className="mt-2 whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-red-700">
            {error.stack}
          </pre>
        </details>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button
          unstyled
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-blue-700"
        >
          <RefreshCw size={16} aria-hidden="true" />
          Reload Page
        </Button>

        <Button
          unstyled
          type="button"
          onClick={() => navigate(ROUTES.HOME)}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-xs transition hover:bg-gray-50 hover:text-gray-900"
        >
          <Home size={16} aria-hidden="true" />
          Back to Home
        </Button>
      </div>
    </div>
  );
}
