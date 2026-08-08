import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import '@/shared/i18n';
import App from './App';
import {
  reportWebVitals,
  detectLongTasks,
  checkPerformanceBudget,
} from '@/shared/utils/web-vitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

if (process.env.NODE_ENV !== 'production') {
  reportWebVitals();
  detectLongTasks();
  checkPerformanceBudget();
}
