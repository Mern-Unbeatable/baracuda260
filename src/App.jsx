import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import router from '@/app/router';
import store from '@/app/store/store';
import ErrorBoundary from '@/components/common/ErrorBoundary/ErrorBoundary';
import { TOAST_CONFIG } from '@/shared/config';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1, // Will retry failed requests 1 time before displaying an error
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ErrorBoundary>
          <RouterProvider router={router} />
          <Toaster
            position={TOAST_CONFIG.POSITION}
            toastOptions={{ duration: TOAST_CONFIG.DURATION }}
          />
        </ErrorBoundary>
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
