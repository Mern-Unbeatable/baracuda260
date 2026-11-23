import { Menu } from 'lucide-react';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import { selectUser } from '@/app/store/slices/authSlice';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import Sidebar from '@/layouts/AppShellLayout/adminSidebar/Sidebar';
import AdminComingSoonContent from '@/portals/admin/views/AdminComingSoonContent';
import { DASHBOARD_ASSETS } from '@/portals/member/data/dashboardAssets';
import { ROUTES } from '@/shared/config';
import { isAdminRole } from '@/shared/utils/roles';

const SIDEBAR_DESKTOP_OPEN_KEY = 'my12photos.sidebar.desktopOpen';

const readDesktopOpenPreference = () => {
  try {
    const stored = localStorage.getItem(SIDEBAR_DESKTOP_OPEN_KEY);
    if (stored === null) return true;
    return stored !== 'false';
  } catch {
    return true;
  }
};

const normalizePath = (pathname) => {
  if (!pathname) return null;
  return pathname.replace(/\/+$/, '') || '/';
};

/**
 * Chat UIs need a locked viewport height (inner panes fill the screen).
 * Image grids must use document scroll — nested overflow + full-res photos
 * desyncs the scrollbar from the painted content.
 */
const isViewportLockedPath = (currentPath) => {
  if (!currentPath) return false;
  return (
    currentPath === normalizePath(ROUTES.USER_CHAT) ||
    currentPath === normalizePath(ROUTES.ADMIN_CHAT) ||
    currentPath.startsWith(`${normalizePath(ROUTES.USER_CHAT)}/`) ||
    currentPath.startsWith(`${normalizePath(ROUTES.ADMIN_CHAT)}/`)
  );
};

const Layout = memo(() => {
  const { t } = useTranslation();
  const location = useLocation();
  const user = useSelector(selectUser);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(readDesktopOpenPreference);

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_DESKTOP_OPEN_KEY, String(desktopOpen));
    } catch {
      // Ignore storage write failures (private mode, quota, etc.)
    }
  }, [desktopOpen]);

  const isAdmin = isAdminRole(user?.role);
  const currentPath = normalizePath(location.pathname);
  const lockViewport = isViewportLockedPath(currentPath);
  const isAdminReadyPage =
    currentPath === normalizePath(ROUTES.ADMIN_DASHBOARD) ||
    currentPath === normalizePath(ROUTES.USER_DASHBOARD) ||
    currentPath === normalizePath(ROUTES.ADMIN_MY_COMPETITIONS) ||
    currentPath === normalizePath(ROUTES.USER_MY_COMPETITIONS) ||
    currentPath.startsWith(`${normalizePath(ROUTES.ADMIN_MY_COMPETITIONS)}/`) ||
    currentPath.startsWith(`${normalizePath(ROUTES.USER_MY_COMPETITIONS)}/`) ||
    currentPath === normalizePath(ROUTES.ADMIN_GALLERY) ||
    currentPath === normalizePath(ROUTES.USER_GALLERY) ||
    currentPath.startsWith(`${normalizePath(ROUTES.ADMIN_GALLERY)}/`) ||
    currentPath.startsWith(`${normalizePath(ROUTES.USER_GALLERY)}/`) ||
    currentPath === normalizePath(ROUTES.ADMIN_PREMIUM_PHOTOS) ||
    currentPath === normalizePath(ROUTES.USER_PREMIUM_PHOTOS) ||
    currentPath.startsWith(`${normalizePath(ROUTES.ADMIN_PREMIUM_PHOTOS)}/`) ||
    currentPath.startsWith(`${normalizePath(ROUTES.USER_PREMIUM_PHOTOS)}/`) ||
    currentPath === normalizePath(ROUTES.ADMIN_PROMOTED_PRODUCTS) ||
    currentPath === normalizePath(ROUTES.USER_PROMOTED_PRODUCTS) ||
    currentPath.startsWith(`${normalizePath(ROUTES.ADMIN_PROMOTED_PRODUCTS)}/`) ||
    currentPath.startsWith(`${normalizePath(ROUTES.USER_PROMOTED_PRODUCTS)}/`) ||
    currentPath === normalizePath(ROUTES.ADMIN_USERS) ||
    currentPath === normalizePath(ROUTES.USER_USERS) ||
    currentPath === normalizePath(ROUTES.ADMIN_CATEGORIES) ||
    currentPath === normalizePath(ROUTES.USER_CATEGORIES) ||
    currentPath === normalizePath(ROUTES.ADMIN_ALBUM_TYPES) ||
    currentPath === normalizePath(ROUTES.USER_ALBUM_TYPES) ||
    currentPath === normalizePath(ROUTES.ADMIN_WINNERS) ||
    currentPath === normalizePath(ROUTES.USER_WINNERS) ||
    currentPath.startsWith(`${normalizePath(ROUTES.ADMIN_WINNERS)}/`) ||
    currentPath.startsWith(`${normalizePath(ROUTES.USER_WINNERS)}/`) ||
    currentPath === normalizePath(ROUTES.ADMIN_PAYOUTS) ||
    currentPath === normalizePath(ROUTES.USER_PAYOUTS) ||
    currentPath === normalizePath(ROUTES.ADMIN_SUPPORT) ||
    currentPath === normalizePath(ROUTES.USER_SUPPORT) ||
    currentPath === normalizePath(ROUTES.ADMIN_NEWSLETTER) ||
    currentPath === normalizePath(ROUTES.USER_NEWSLETTER) ||
    currentPath === normalizePath(ROUTES.ADMIN_COMMENT) ||
    currentPath === normalizePath(ROUTES.USER_COMMENT) ||
    currentPath === normalizePath(ROUTES.ADMIN_ADS) ||
    currentPath === normalizePath(ROUTES.USER_ADS) ||
    currentPath === normalizePath(ROUTES.ADMIN_DEMO_PROFILES) ||
    currentPath === normalizePath(ROUTES.USER_DEMO_PROFILES) ||
    currentPath === normalizePath(ROUTES.ADMIN_DEMO_PROFILES_CREATE) ||
    currentPath === normalizePath(ROUTES.USER_DEMO_PROFILES_CREATE) ||
    currentPath === normalizePath(ROUTES.ADMIN_PROMO_LINKS) ||
    currentPath === normalizePath(ROUTES.USER_PROMO_LINKS) ||
    currentPath === normalizePath(ROUTES.ADMIN_REPORTS) ||
    currentPath === normalizePath(ROUTES.USER_REPORTS) ||
    currentPath.startsWith(`${normalizePath(ROUTES.ADMIN_REPORTS)}/`) ||
    currentPath.startsWith(`${normalizePath(ROUTES.USER_REPORTS)}/`) ||
    currentPath === normalizePath(ROUTES.ADMIN_MARKETING_STATISTICS) ||
    currentPath === normalizePath(ROUTES.USER_MARKETING_STATISTICS) ||
    currentPath === normalizePath(ROUTES.ADMIN_SETTINGS) ||
    currentPath === normalizePath(ROUTES.USER_SETTINGS) ||
    currentPath === normalizePath(ROUTES.ADMIN_PROFILE) ||
    currentPath === normalizePath(ROUTES.USER_PROFILE) ||
    currentPath.startsWith(`${normalizePath(ROUTES.ADMIN_PROFILE)}/`) ||
    currentPath.startsWith(`${normalizePath(ROUTES.USER_PROFILE)}/`) ||
    currentPath === normalizePath(ROUTES.ADMIN_BUSINESS_PHOTOS) ||
    currentPath === normalizePath(ROUTES.USER_BUSINESS_PHOTOS) ||
    currentPath.startsWith(`${normalizePath(ROUTES.ADMIN_BUSINESS_PHOTOS)}/`) ||
    currentPath.startsWith(`${normalizePath(ROUTES.USER_BUSINESS_PHOTOS)}/`) ||
    currentPath === normalizePath(ROUTES.USER_CHAT) ||
    currentPath === normalizePath(ROUTES.ADMIN_CHAT);

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

  // Reset window scroll when leaving locked chat pages / changing routes
  useEffect(() => {
    if (!lockViewport) {
      window.scrollTo(0, 0);
    }
  }, [currentPath, lockViewport]);

  const pageContent =
    isAdmin && !isAdminReadyPage ? <AdminComingSoonContent /> : <Outlet />;

  // Avoid `transform` on lg — it disables position:sticky and recreates nested-scroll jank.
  const asideClassName = `
    fixed inset-y-0 left-0 z-30 w-72 transition-[width,transform] duration-300 ease-in-out
    max-lg:transform
    lg:z-30 lg:shrink-0 lg:transform-none
    ${sidebarOpen ? 'translate-x-0' : 'max-lg:-translate-x-full'}
    ${desktopOpen ? 'lg:w-72' : 'lg:w-16'}
    ${
      lockViewport
        ? 'lg:relative lg:inset-auto'
        : 'lg:sticky lg:top-0 lg:h-screen lg:self-start lg:inset-auto'
    }
  `;

  const mobileHeader = (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-[#e2e2e2] bg-white px-4 lg:hidden">
      <Button
        unstyled
        type="button"
        onClick={() => setSidebarOpen(true)}
        aria-expanded={sidebarOpen}
        aria-controls="sidebar"
        aria-label={t('dashboard.sidebar.open')}
        className="-ml-1 rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
      >
        <Menu size={20} aria-hidden="true" />
      </Button>
      <Image
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
  );

  const sidebarOverlay = sidebarOpen ? (
    <div
      className="fixed inset-0 z-20 bg-black/40 lg:hidden"
      onClick={() => setSidebarOpen(false)}
      aria-hidden="true"
    />
  ) : null;

  const sidebar = (
    <aside
      id="sidebar"
      aria-label={t('dashboard.sidebar.navAria')}
      className={asideClassName}
    >
      <Sidebar
        onClose={() => setSidebarOpen(false)}
        onDesktopClose={() => setDesktopOpen(false)}
        onAutoCollapse={() => setDesktopOpen(false)}
        isCollapsed={!desktopOpen}
        onExpand={() => setDesktopOpen(true)}
      />
    </aside>
  );

  if (lockViewport) {
    return (
      <div className="fixed inset-0 flex overflow-hidden bg-[#f9fafb]">
        {sidebarOverlay}
        {sidebar}
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {mobileHeader}
          <div className="flex min-h-0 flex-1 flex-col bg-[#f9fafb]">
            <div className="scrollbar-white min-h-0 w-full flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain px-4 py-5 sm:px-6 sm:py-6 lg:px-10 lg:py-8">
              {pageContent}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f9fafb]">
      {sidebarOverlay}
      {sidebar}
      <main className="flex min-w-0 flex-1 flex-col">
        {mobileHeader}
        <div className="w-full flex-1 bg-[#f9fafb] px-4 py-5 sm:px-6 sm:py-6 lg:px-10 lg:py-8">
          {pageContent}
        </div>
      </main>
    </div>
  );
});

Layout.displayName = 'AdminLayout';

export default Layout;
