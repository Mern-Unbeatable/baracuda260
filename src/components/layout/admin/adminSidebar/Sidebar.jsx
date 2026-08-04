import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { ROUTES } from '../../../../config';
import { logout, selectUser } from '../../../../store/slices/authSlice';
import { DASHBOARD_ASSETS } from '../../../dashboard/dashboardAssets';
import { ADMIN_OVERVIEW_ASSETS } from '../../../adminOverview/adminOverviewData';
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
  Images,
  Users,
  ChartColumnStacked,
  BookImage,
  Crown,
  CreditCard,
  MessageCircleQuestion,
  Newspaper,
  MessageSquareText,
} from 'lucide-react';

const USER_NAV_ITEMS = [
  { labelKey: 'dashboard.nav.dashboard', path: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard },
  { labelKey: 'dashboard.nav.uploadPhotos', path: ROUTES.ADMIN_UPLOAD_PHOTOS, icon: Camera },
  { labelKey: 'dashboard.nav.myCompetitions', path: ROUTES.ADMIN_MY_COMPETITIONS, icon: Trophy },
  { labelKey: 'dashboard.nav.businessPhotos', path: ROUTES.ADMIN_BUSINESS_PHOTOS, icon: Link2 },
  { labelKey: 'dashboard.nav.chat', path: ROUTES.ADMIN_CHAT, icon: MessageSquare },
  { labelKey: 'dashboard.nav.prizePayments', path: ROUTES.ADMIN_PRIZE_PAYMENTS, icon: Wallet },
  { labelKey: 'dashboard.nav.profile', path: ROUTES.ADMIN_PROFILE, icon: UserRound },
];

const ADMIN_NAV_GROUPS = [
  {
    id: 'workspace',
    labelKey: 'adminOverview.nav.groups.workspace',
    items: [
      { labelKey: 'adminOverview.nav.overview', path: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard },
      { labelKey: 'adminOverview.nav.competitions', path: ROUTES.ADMIN_MY_COMPETITIONS, icon: Trophy },
      { labelKey: 'adminOverview.nav.submissions', path: ROUTES.ADMIN_SUBMISSIONS, icon: Images },
      { labelKey: 'adminOverview.nav.users', path: ROUTES.ADMIN_USERS, icon: Users },
    ],
  },
  {
    id: 'manage',
    labelKey: 'adminOverview.nav.groups.manage',
    items: [
      { labelKey: 'adminOverview.nav.categories', path: ROUTES.ADMIN_CATEGORIES, icon: ChartColumnStacked },
      { labelKey: 'adminOverview.nav.albumTypes', path: ROUTES.ADMIN_ALBUM_TYPES, icon: BookImage },
      { labelKey: 'adminOverview.nav.winners', path: ROUTES.ADMIN_WINNERS, icon: Crown },
      { labelKey: 'adminOverview.nav.payouts', path: ROUTES.ADMIN_PRIZE_PAYMENTS, icon: CreditCard },
      { labelKey: 'adminOverview.nav.support', path: ROUTES.ADMIN_CHAT, icon: MessageCircleQuestion },
      { labelKey: 'adminOverview.nav.businessPhotos', path: ROUTES.ADMIN_BUSINESS_PHOTOS, icon: Link2 },
      { labelKey: 'adminOverview.nav.newsletter', path: ROUTES.ADMIN_NEWSLETTER, icon: Newspaper },
      { labelKey: 'adminOverview.nav.comment', path: ROUTES.ADMIN_COMMENT, icon: MessageSquareText },
    ],
  },
  {
    id: 'system',
    labelKey: 'adminOverview.nav.groups.system',
    items: [
      { labelKey: 'adminOverview.nav.profile', path: ROUTES.ADMIN_PROFILE, icon: UserRound },
    ],
  },
];

// Border lives in NAV_BASE so layout never shifts; only the color changes between states (CLS fix)
const NAV_BASE =
  'group flex items-center gap-3 rounded-lg border text-base font-medium transition-all duration-200 pl-3.25 pr-3 py-2.5 hover:-translate-y-0.5';
const NAV_ACTIVE =
  'bg-[#fde8e9] text-[#ee1c25] border-transparent shadow-[inset_3px_0_0_0_#ee1c25]';
const NAV_INACTIVE =
  'text-[#5d687b] border-transparent hover:bg-[#fde8e9]/50 hover:text-[#161c27] hover:border-[#fde8e9]';

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
  const isAdmin = user?.role === 'admin';

  const displayName =
    user?.fullName || user?.name || user?.username || t('dashboard.defaultName');
  const roleLabel =
    isAdmin ? t('dashboard.roleAdmin') : t('dashboard.roleUser');
  const avatarInitial = displayName.trim().charAt(0).toUpperCase() || 'U';
  const avatarSrc = isAdmin ? ADMIN_OVERVIEW_ASSETS.avatar : DASHBOARD_ASSETS.avatar;

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success(t('dashboard.logoutSuccess'));
    setTimeout(() => navigate(ROUTES.LOGIN), 600);
  };

  const flatAdminItems = ADMIN_NAV_GROUPS.flatMap((group) => group.items);
  const collapsedItems = isAdmin ? flatAdminItems : USER_NAV_ITEMS;

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
          className="scrollbar-white flex w-full flex-1 flex-col items-center gap-1 overflow-y-auto px-2"
          aria-label={t('dashboard.sidebar.navAria')}
        >
          {collapsedItems.map(({ labelKey, path, icon: Icon, autoCollapse }) => (
            <NavLink
              key={`${path}-${labelKey}`}
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
    <div className="flex h-full w-full flex-col border-r border-[#e8ebf1] bg-white">
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
        className="scrollbar-white flex-1 overflow-y-auto px-3 py-5"
        aria-label={t('dashboard.sidebar.navAria')}
      >
        {isAdmin ? (
          <div className="space-y-5">
            {ADMIN_NAV_GROUPS.map((group) => (
              <div key={group.id}>
                <p className="mb-2 px-2.5 text-[16px] leading-6 text-[#707070]">
                  {t(group.labelKey)}
                </p>
                <ul className="space-y-1" role="list">
                  {group.items.map(({ labelKey, path, icon: Icon }) => (
                    <li key={`${group.id}-${labelKey}`}>
                      <NavLink
                        to={path}
                        end={path === ROUTES.ADMIN_DASHBOARD}
                        onClick={onClose}
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
              </div>
            ))}
          </div>
        ) : (
          <>
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.08em] text-gray-400">
              {t('dashboard.sidebar.mainMenu')}
            </p>
            <ul className="space-y-1.5" role="list">
              {USER_NAV_ITEMS.map(({ labelKey, path, icon: Icon, autoCollapse }) => (
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
          </>
        )}
      </nav>

      <div className="shrink-0 space-y-1.5 border-t border-gray-100 px-3 py-3">
        <div className="flex items-center gap-3 rounded-lg bg-[#f6f6f6] px-3 py-2.5">
          <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-[#ee1c25] sm:size-[50px] sm:rounded-lg">
            <span className="absolute inset-0 flex items-center justify-center text-base font-bold text-white">
              {avatarInitial}
            </span>
            <img
              src={avatarSrc}
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
            {user?.email ? (
              <p className="truncate text-xs leading-5 text-gray-400">{user.email}</p>
            ) : null}
            <p className="truncate text-sm leading-[22px] text-gray-500">{roleLabel}</p>
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
