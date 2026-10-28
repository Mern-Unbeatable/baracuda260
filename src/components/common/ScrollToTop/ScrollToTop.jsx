import { useEffect, useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { scrollToPageTop } from '@/shared/utils/scrollToPageTop';

/** Scrolls the window (and nested page scroll areas) to top on every route change. */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useLayoutEffect(() => {
    scrollToPageTop('auto');
  }, [pathname]);

  return <Outlet />;
};

export default ScrollToTop;
