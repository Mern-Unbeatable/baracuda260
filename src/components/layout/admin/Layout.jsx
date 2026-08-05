import { useState, useEffect, memo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Menu } from 'lucide-react';
import { ROUTES } from '../../../config';
import { selectUser } from '../../../store/slices/authSlice';
import { DASHBOARD_ASSETS } from '../../dashboard/dashboardAssets';
import AdminComingSoonContent from '../../adminOverview/AdminComingSoonContent';
import Sidebar from './adminSidebar/Sidebar';

const normalizePath = (pathname) => pathname.replace(/\/+$/, '') || '/';

const Layout = memo(() => {
  const { t } = useTranslation();
  const location = useLocation();
  const user = useSelector(selectUser);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);

  const isAdmin = user?.role === 'admin';
  const currentPath = normalizePath(location.pathname);
  const isAdminReadyPage =
    currentPath === normalizePath(ROUTES.ADMIN_DASHBOARD) ||
    currentPath === normalizePath(ROUTES.ADMIN_MY_COMPETITIONS) ||
    currentPath.startsWith(`${normalizePath(ROUTES.ADMIN_MY_COMPETITIONS)}/`) ||
    currentPath === normalizePath(ROUTES.ADMIN_SUBMISSIONS) ||
    currentPath === normalizePath(ROUTES.ADMIN_USERS) ||
    currentPath === normalizePath(ROUTES.ADMIN_CATEGORIES) ||
    currentPath === normalizePath(ROUTES.ADMIN_ALBUM_TYPES) ||
    currentPath === normalizePath(ROUTES.ADMIN_WINNERS) ||
    currentPath === normalizePath(ROUTES.ADMIN_PAYOUTS);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === 'Escape') setSidebarOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  return (
    <div className="flex h-dvh overflow-hidden bg-[#f9fafb]">
      <div
        className={`fixed inset-0 z-20 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          sidebarOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <aside
        id="sidebar"
        aria-label={t('dashboard.sidebar.navAria')}
        className={`
          fixed inset-y-0 left-0 z-30 w-72 transform transition-all duration-300 ease-in-out
          lg:relative lg:z-auto lg:shrink-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          ${desktopOpen ? 'lg:w-72 lg:translate-x-0' : 'lg:w-16 lg:translate-x-0'}
        `}
      >
        <Sidebar
          onClose={() => setSidebarOpen(false)}
          onDesktopClose={() => setDesktopOpen(false)}
          onAutoCollapse={() => setDesktopOpen(false)}
          isCollapsed={!desktopOpen}
          onExpand={() => setDesktopOpen(true)}
        />
      </aside>

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-[#e2e2e2] bg-white px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-expanded={sidebarOpen}
            aria-controls="sidebar"
            aria-label={t('dashboard.sidebar.open')}
            className="-ml-1 rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
          >
            <Menu size={20} aria-hidden="true" />
          </button>
          <img
            src={DASHBOARD_ASSETS.logo}
            alt="My12Photos"
            width={120}
            height={28}
            className="h-7 w-auto object-contain"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
        </header>

        <div className="scrollbar-white min-h-0 flex-1 overflow-y-auto" data-lenis-prevent>
          <div className="flex min-h-full w-full flex-col px-4 py-5 sm:px-6 sm:py-6 lg:px-10 lg:py-8">
            {isAdmin && !isAdminReadyPage ? <AdminComingSoonContent /> : <Outlet />}
          </div>
        </div>
      </main>
    </div>
  );
});

Layout.displayName = 'AdminLayout';

export default Layout;
