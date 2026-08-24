import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { scrollToPageTop } from '@/shared/utils/scrollToPageTop';

/** Scrolls the window (and nested page scroll areas) to top on every route change. */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollToPageTop('auto');
  }, [pathname]);

  return <Outlet />;
};

export default ScrollToTop;
