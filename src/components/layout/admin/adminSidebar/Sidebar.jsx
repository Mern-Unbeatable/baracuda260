import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { ROUTES } from '../../../../config';
import { logout, selectUser } from '../../../../store/slices/authSlice';
import { DASHBOARD_ASSETS } from '../../../dashboard/dashboardAssets';
import {
  LayoutDashboard,
  Camera,
  Trophy,
  Link2,
  MessageSquare,
  Wallet,
  UserRound,
  LogOut,
  X,
  ChevronRight,
  ChevronsRight,
  ChevronsLeft,
} from 'lucide-react';

const NAV_ITEMS = [
  { labelKey: 'dashboard.nav.dashboard', path: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard },
  { labelKey: 'dashboard.nav.uploadPhotos', path: ROUTES.ADMIN_UPLOAD_PHOTOS, icon: Camera },
  { labelKey: 'dashboard.nav.myCompetitions', path: ROUTES.ADMIN_MY_COMPETITIONS, icon: Trophy },
  { labelKey: 'dashboard.nav.businessPhotos', path: ROUTES.ADMIN_BUSINESS_PHOTOS, icon: Link2 },
  { labelKey: 'dashboard.nav.chat', path: ROUTES.ADMIN_CHAT, icon: MessageSquare },
  { labelKey: 'dashboard.nav.prizePayments', path: ROUTES.ADMIN_PRIZE_PAYMENTS, icon: Wallet },
  { labelKey: 'dashboard.nav.profile', path: ROUTES.ADMIN_PROFILE, icon: UserRound },
];

// Border lives in NAV_BASE so layout never shifts; only the color changes between states (CLS fix)
const NAV_BASE =
  'group flex items-center gap-3 rounded-lg border text-base font-medium transition-all duration-200 pl-3.25 pr-3 py-2.5 hover:-translate-y-0.5';
const NAV_ACTIVE =
  'bg-[#fde8e9] text-[#ee1c25] border-transparent shadow-[inset_3px_0_0_0_#ee1c25]';
const NAV_INACTIVE =
  'text-[#494453] border-transparent hover:bg-[#fde8e9]/50 hover:text-[#161c27] hover:border-[#fde8e9]';

const getNavClass = ({ isActive }) =>
  `${NAV_BASE} ${isActive ? NAV_ACTIVE : NAV_INACTIVE}`;

const Sidebar = ({
  onClose,
  onDesktopClose,
  onAutoCollapse,
  isCollapsed,
  onExpand,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const displayName =
    user?.fullName || user?.name || user?.username || t('dashboard.defaultName');
  const avatarInitial = displayName.trim().charAt(0).toUpperCase() || 'U';

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success(t('dashboard.logoutSuccess'));
    setTimeout(() => navigate(ROUTES.LOGIN), 600);
  };

  if (isCollapsed) {
    return (
      <div className="flex h-full w-full flex-col items-center gap-1 border-r border-gray-100 bg-white py-3">
        <button
          type="button"
          onClick={onExpand}
          title={t('dashboard.sidebar.expand')}
          aria-label={t('dashboard.sidebar.expand')}
          className="mb-2 flex size-10 shrink-0 items-center justify-center rounded-lg text-gray-500 transition-colors duration-200 hover:bg-[#fde8e9]/60 hover:text-gray-800"
        >
          <ChevronsRight size={20} aria-hidden="true" />
        </button>

        <nav
          className="flex w-full flex-1 flex-col items-center gap-1 overflow-y-auto px-2"
          aria-label={t('dashboard.sidebar.navAria')}
        >
          {NAV_ITEMS.map(({ labelKey, path, icon: Icon, autoCollapse }) => (
            <NavLink
              key={path}
              to={path}
              end={path === ROUTES.ADMIN_DASHBOARD}
              title={t(labelKey)}
              onClick={() => {
                onClose();
                if (autoCollapse && onAutoCollapse) onAutoCollapse();
              }}
              className={({ isActive }) =>
                `flex size-10 items-center justify-center rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-[#fde8e9] text-[#ee1c25]'
                    : 'text-gray-400 hover:bg-[#fde8e9]/60 hover:text-gray-900'
                }`
              }
            >
              <Icon size={20} aria-hidden="true" />
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          title={t('dashboard.nav.logOut')}
          aria-label={t('dashboard.nav.logOut')}
          className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors duration-200 hover:bg-red-50 hover:text-[#d00000]"
        >
          <LogOut size={20} aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col border-r border-gray-100 bg-white">
      <div className="flex shrink-0 items-start justify-between border-b border-gray-100 px-5 pb-4 pt-5">
        <div className="min-w-0">
          <img
            src={DASHBOARD_ASSETS.logo}
            alt="My12Photos"
            width={160}
            height={40}
            className="h-10 w-auto max-w-[160px] object-contain object-left"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
          <p className="mt-1.5 text-sm text-gray-400">{t('dashboard.sidebar.subtitle')}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="-mr-1 mt-0.5 rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 lg:hidden"
          aria-label={t('dashboard.sidebar.close')}
        >
          <X size={20} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onDesktopClose}
          className="-mr-1 mt-0.5 hidden items-center justify-center rounded-md p-1.5 text-gray-500 transition-colors hover:bg-[#fde8e9]/60 hover:text-gray-900 lg:flex"
          aria-label={t('dashboard.sidebar.collapse')}
        >
          <ChevronsLeft size={20} aria-hidden="true" />
        </button>
      </div>

      <nav
        className="flex-1 overflow-y-auto px-3 py-5"
        aria-label={t('dashboard.sidebar.navAria')}
      >
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.08em] text-gray-400">
          {t('dashboard.sidebar.mainMenu')}
        </p>
        <ul className="space-y-1.5" role="list">
          {NAV_ITEMS.map(({ labelKey, path, icon: Icon, autoCollapse }) => (
            <li key={path}>
              <NavLink
                to={path}
                end={path === ROUTES.ADMIN_DASHBOARD}
                onClick={() => {
                  onClose();
                  if (autoCollapse && onAutoCollapse) onAutoCollapse();
                }}
                className={getNavClass}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={20}
                      aria-hidden="true"
                      className={`shrink-0 transition-colors ${
                        isActive
                          ? 'text-[#ee1c25]'
                          : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    <span className="flex-1 truncate">{t(labelKey)}</span>
                    <ChevronRight
                      size={18}
                      aria-hidden="true"
                      className={`mr-0.5 shrink-0 text-[#ee1c25] drop-shadow-[0_0_6px_#ee1c25] ${
                        isActive ? 'animate-nav-arrow' : 'opacity-0'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="shrink-0 space-y-1.5 border-t border-gray-100 px-3 py-3">
        <div className="flex items-center gap-3 rounded-lg bg-[#f6f6f6] px-3 py-2.5">
          <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-[#ee1c25] sm:size-[50px] sm:rounded-lg">
            <span className="absolute inset-0 flex items-center justify-center text-base font-bold text-white">
              {avatarInitial}
            </span>
            <img
              src={DASHBOARD_ASSETS.avatar}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-medium capitalize leading-snug text-black">
              {displayName}
            </p>
            <p className="truncate text-sm leading-[22px] text-gray-500">
              {t('dashboard.roleUser')}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className={`${NAV_BASE} w-full border-transparent text-[#d00000] hover:bg-red-50 hover:shadow-[inset_3px_0_0_0_#d00000]`}
        >
          <LogOut size={20} aria-hidden="true" className="shrink-0 text-[#d00000]" />
          <span>{t('dashboard.nav.logOut')}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
