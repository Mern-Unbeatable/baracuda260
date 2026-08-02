import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

/** Scrolls the window (and nested page scroll areas) to top on every route change. */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    document.querySelectorAll('[data-lenis-prevent], main .overflow-y-auto').forEach((el) => {
      el.scrollTop = 0;
    });
  }, [pathname]);

  return <Outlet />;
};

export default ScrollToTop;
