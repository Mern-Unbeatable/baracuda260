import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from '@/components/common/ErrorBoundary/ErrorBoundary';
import router from '@/app/router';
import store from '@/app/store/store';
import { TOAST_CONFIG } from '@/shared/config';

function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <RouterProvider router={router} />
        <Toaster
          position={TOAST_CONFIG.POSITION}
          toastOptions={{ duration: TOAST_CONFIG.DURATION }}
        />
      </ErrorBoundary>
    </Provider>
  );
}

export default App;
