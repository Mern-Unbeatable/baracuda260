import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import router from '@/app/router';
import store from '@/app/store/store';
import ErrorBoundary from '@/components/common/ErrorBoundary/ErrorBoundary';
import { TOAST_CONFIG } from '@/shared/config';
import i18n from '@/shared/i18n/i18n';

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
  // Cached responses were translated server-side via Accept-Language, so
  // they are stale as soon as the user picks another language.
  useEffect(() => {
    const handleLanguageChanged = () => {
      queryClient.invalidateQueries();
    };
    i18n.on('languageChanged', handleLanguageChanged);
    return () => i18n.off('languageChanged', handleLanguageChanged);
  }, []);

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
