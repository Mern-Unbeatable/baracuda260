import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { ROUTES } from "../../../../config";
import { selectUser } from "../../../../store/slices/authSlice";
import {
  LayoutDashboard,
  Mail,
  Users,
  ShoppingCart,
  Store,
  Briefcase,
  FileText,
  ClipboardList,
  DollarSign,
  MessageSquare,
  LogOut,
  X,
  ChevronRight,
  ChevronsRight,
  ChevronsLeft,
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Dashboard", path: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard },
  { name: "Emails", path: ROUTES.ADMIN_EMAILS, icon: Mail },
  { name: "Leads", path: ROUTES.ADMIN_LEADS, icon: Users },
  { name: "Orders", path: ROUTES.ADMIN_ORDERS, icon: ShoppingCart },
  {
    name: "Marketplace Orders",
    path: ROUTES.ADMIN_MARKETPLACE_ORDERS,
    icon: Store,
  },
  { name: "Case Studies", path: ROUTES.ADMIN_CASE_STUDIES, icon: Briefcase },
  { name: "Blog", path: ROUTES.ADMIN_BLOG, icon: FileText },
  { name: "Jobs", path: ROUTES.ADMIN_JOBS, icon: ClipboardList },
  { name: "Pricing", path: ROUTES.ADMIN_PRICING, icon: DollarSign },
  { name: "Messages", path: ROUTES.ADMIN_MESSAGES, icon: MessageSquare },
];

// Border lives in NAV_BASE so layout never shifts; only the color changes between states (CLS fix)
const NAV_BASE =
  "group flex items-center gap-3 rounded-lg border text-base font-medium transition-all duration-200 pl-3.25 pr-3 py-2.5 hover:-translate-y-0.5";
const NAV_ACTIVE =
  "bg-orange-100 text-orange-700 border-transparent shadow-[inset_3px_0_0_0_#ea580c]";
const NAV_INACTIVE =
  "text-gray-700 border-gray-100 hover:bg-orange-50/40 hover:text-gray-900 hover:border-orange-100";

const getNavClass = ({ isActive }) =>
  `${NAV_BASE} ${isActive ? NAV_ACTIVE : NAV_INACTIVE}`;

const Sidebar = ({
  onClose,
  onDesktopClose,
  onAutoCollapse,
  isCollapsed,
  onExpand,
}) => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const handleLogout = () => {
    toast.success("Signed out successfully");
    setTimeout(() => navigate(ROUTES.LOGIN), 900);
  };

  if (isCollapsed) {
    return (
      <div className="h-full w-full bg-white flex flex-col items-center border-r border-gray-100 py-3 gap-1">
        <button
          type="button"
          onClick={onExpand}
          title="Expand sidebar"
          aria-label="Expand sidebar"
          className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-800 hover:bg-orange-50/40 transition-colors duration-200 mb-2 shrink-0"
        >
          <ChevronsRight size={20} aria-hidden="true" />
        </button>

        <nav
          className="flex-1 flex flex-col items-center gap-1 w-full px-2 overflow-y-auto"
          aria-label="Main navigation"
        >
          {NAV_ITEMS.map(({ name, path, icon: Icon, autoCollapse }) => (
            <NavLink
              key={path}
              to={path}
              end={path === ROUTES.ADMIN_DASHBOARD}
              title={name}
              onClick={() => {
                onClose();
                if (autoCollapse && onAutoCollapse) onAutoCollapse();
              }}
              className={({ isActive }) =>
                `w-10 h-10 flex items-center justify-center rounded-lg transition-colors duration-200 ${
                  isActive
                    ? "bg-orange-100 text-orange-600"
                    : "text-gray-400 hover:text-gray-900 hover:bg-orange-50/40"
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
          title="Sign Out"
          aria-label="Sign Out"
          className="mt-1 w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-200 shrink-0"
        >
          <LogOut size={20} aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-white flex flex-col border-r border-gray-100">
      <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-gray-100 shrink-0">
        <div>
          <img
            src="/maktech_logo.png"
            alt="Maktech"
            width={120}
            height={32}
            fetchPriority="high"
            className="h-8 w-auto object-contain"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <p className="text-sm text-gray-400 mt-1.5">Admin Dashboard</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="lg:hidden mt-0.5 p-1.5 -mr-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Close navigation"
        >
          <X size={20} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onDesktopClose}
          className="hidden lg:flex items-center justify-center mt-0.5 p-1.5 -mr-1 rounded-md text-gray-500 hover:text-gray-900 hover:bg-orange-50/40 transition-colors"
          aria-label="Collapse sidebar"
        >
          <ChevronsLeft size={20} aria-hidden="true" />
        </button>
      </div>

      <nav
        className="flex-1 overflow-y-auto px-3 py-5"
        aria-label="Main navigation"
      >
        <p className="px-3 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-[0.08em]">
          Main Menu
        </p>
        <ul className="space-y-1.5" role="list">
          {NAV_ITEMS.map(({ name, path, icon: Icon, autoCollapse }) => (
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
                          ? "text-orange-600"
                          : "text-gray-400 group-hover:text-gray-500"
                      }`}
                    />
                    <span className="truncate flex-1">{name}</span>
                    <ChevronRight
                      size={18}
                      aria-hidden="true"
                      className={`shrink-0 mr-0.5 text-orange-500 drop-shadow-[0_0_6px_#f97316] ${
                        isActive ? "animate-nav-arrow" : "opacity-0"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="shrink-0 border-t border-gray-100 px-3 py-3 space-y-1.5">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-50">
          <div className="shrink-0 w-9 h-9 rounded-full bg-linear-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-base font-bold select-none">
            M
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-semibold text-gray-900 leading-snug truncate">
              {user?.name || "Admin"}
            </p>
            <p className="text-sm text-gray-400 leading-snug truncate">
              {user?.email || ""}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className={`${NAV_BASE} w-full text-gray-600 border-transparent hover:bg-red-50 hover:text-red-600 hover:shadow-[inset_3px_0_0_0_#ef4444]`}
        >
          <LogOut
            size={20}
            aria-hidden="true"
            className="shrink-0 text-gray-400 group-hover:text-red-500 transition-colors"
          />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
