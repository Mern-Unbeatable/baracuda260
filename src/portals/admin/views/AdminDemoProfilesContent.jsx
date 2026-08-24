import { useTranslation } from 'react-i18next';
import React, { memo, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { MoreVertical, Plus } from 'lucide-react';
import { ROUTES } from '@/shared/config';
import {
  ADMIN_DEMO_PROFILES_ASSETS,
  CHEVRON_ICON_SIZE,
  DEMO_PROFILE_STATUS,
  DEMO_PROFILES_STAT_CARDS,
  getDemoProfileDisplayName,
  getDemoProfileDisplayUsername,
  MORE_ICON_SIZE,
  STATUS_FILTERS,
  STATUS_LABEL_KEYS,
} from '@/portals/admin/data/adminDemoProfilesData';
import useAdminDemoProfiles from '@/portals/admin/hooks/useAdminDemoProfiles';
import DemoProfileDetailModal from '@/portals/admin/components/admin-demo-profiles/DemoProfileDetailModal';
import AdminPageHeader from '@/components/common/AdminPageHeader/AdminPageHeader';
import AdminPagination from '@/components/common/AdminPagination/AdminPagination';

const ACTION_MENU_OFFSET_PX = 6;
const ACTION_MENU_FALLBACK_HEIGHT_PX = 148;
const ACTION_MENU_VIEWPORT_MARGIN_PX = 8;
const ACTION_MENU_WIDTH_PX = 176;
const MD_MEDIA_QUERY = '(min-width: 768px)';

const useIsMdUp = () => {
  const [isMdUp, setIsMdUp] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(MD_MEDIA_QUERY).matches : false,
  );

  useEffect(() => {
    const media = window.matchMedia(MD_MEDIA_QUERY);
    const onChange = () => setIsMdUp(media.matches);
    onChange();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return isMdUp;
};

const DemoProfileStatCards = memo(({ stats }) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {DEMO_PROFILES_STAT_CARDS.map((card) => (
        <article
          key={card.id}
          className="rounded-[14px] border border-[#f3f4f6] bg-white px-5.75 py-5.25 shadow-[0px_1px_2px_rgba(0,0,0,0.06)]"
        >
          <div className="flex items-start justify-between">
            <p className="text-[12px] font-semibold leading-4.5 tracking-[0.24px] text-[#6b7280]">
              {t(card.labelKey)}
            </p>
            <span
              className={`inline-flex size-8.5 items-center justify-center rounded-[9px] text-[16px] font-bold leading-6 ${card.iconBg}`}
              aria-hidden="true"
            >
              {card.icon}
            </span>
          </div>
          <p className="pt-3.5 text-[32px] font-extrabold leading-8 text-[#111827]">
            {stats[card.id]}
          </p>
        </article>
      ))}
    </div>
  );
});
DemoProfileStatCards.displayName = 'DemoProfileStatCards';

const StatusBadge = memo(({ status }) => {
  const { t } = useTranslation();
  const isActive = status === DEMO_PROFILE_STATUS.ACTIVE;

  return (
    <span
      className={`inline-flex h-[30px] items-center gap-[5px] rounded-[8px] px-[9px] py-[5px] ${
        isActive ? 'bg-[#eef7f3]' : 'bg-[#f2f1f8]'
      }`}
    >
      <span
        className={`size-[6px] shrink-0 rounded-[3px] ${
          isActive ? 'bg-[#268262]' : 'bg-[#766f9a]'
        }`}
        aria-hidden="true"
      />
      <span
        className={`text-[13px] font-bold leading-[19px] whitespace-nowrap ${
          isActive ? 'text-[#268262]' : 'text-[#766f9a]'
        }`}
      >
        {t(STATUS_LABEL_KEYS[status])}
      </span>
    </span>
  );
});
StatusBadge.displayName = 'StatusBadge';

const StatusSortSelect = memo(({ statusFilter, sortOpen, onToggle, onClose, onSelect }) => {
  const { t } = useTranslation();
  const rootRef = useRef(null);
  const activeFilter = STATUS_FILTERS.find((filter) => filter.id === statusFilter) || STATUS_FILTERS[0];

  useEffect(() => {
    if (!sortOpen) return undefined;

    const handlePointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) onClose();
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [sortOpen, onClose]);

  return (
    <div className="flex flex-wrap items-center gap-5" ref={rootRef}>
      <p className="text-[14px] leading-normal text-[#373737]">{t('adminDemoProfiles.sortBy')}</p>
      <div className="relative">
        <button
          type="button"
          aria-expanded={sortOpen}
          aria-haspopup="listbox"
          aria-label={t('adminDemoProfiles.filters.aria')}
          onClick={onToggle}
          className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-[8px] border border-[#e4e4e4] bg-white p-3 text-left"
        >
          <span className="text-[16px] leading-normal whitespace-nowrap text-[#373737]">
            {t(activeFilter.labelKey)}
          </span>
          <img
            src={ADMIN_DEMO_PROFILES_ASSETS.chevronDown}
            alt=""
            width={CHEVRON_ICON_SIZE}
            height={CHEVRON_ICON_SIZE}
            className={`size-6 shrink-0 transition ${sortOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {sortOpen ? (
          <ul
            role="listbox"
            aria-label={t('adminDemoProfiles.filters.aria')}
            className="absolute right-0 top-full z-20 mt-1 min-w-full overflow-hidden rounded-[8px] border border-[#e4e4e4] bg-white shadow-lg"
          >
            {STATUS_FILTERS.map((filter) => {
              const selected = filter.id === statusFilter;
              return (
                <li key={filter.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => onSelect(filter.id)}
                    className={`w-full cursor-pointer px-3 py-2.5 text-left text-[16px] transition hover:bg-[#f6fbff] ${
                      selected ? 'bg-[#f6fbff] text-[#4048cd]' : 'text-[#373737]'
                    }`}
                  >
                    {t(filter.labelKey)}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </div>
  );
});
StatusSortSelect.displayName = 'StatusSortSelect';

const ProfileActionMenu = memo(
  ({ profile, isOpen, onToggle, onClose, onSeeDetails, onSetActive, onSetInactive }) => {
    const { t } = useTranslation();
    const buttonWrapRef = useRef(null);
    const buttonRef = useRef(null);
    const menuRef = useRef(null);
    const [placement, setPlacement] = useState(null);
    const isActive = profile.status === DEMO_PROFILE_STATUS.ACTIVE;
    const menuLabel = t('adminDemoProfiles.actions.menu', {
      name: getDemoProfileDisplayName(profile, t),
    });

    useLayoutEffect(() => {
      if (!isOpen || !buttonRef.current) {
        setPlacement(null);
        return undefined;
      }

      const updatePosition = () => {
        const rect = buttonRef.current.getBoundingClientRect();
        const menuHeight = menuRef.current?.offsetHeight || ACTION_MENU_FALLBACK_HEIGHT_PX;
        const spaceBelow = window.innerHeight - rect.bottom;
        const openUpward = spaceBelow < menuHeight + ACTION_MENU_OFFSET_PX;

        setPlacement({
          right: Math.max(ACTION_MENU_VIEWPORT_MARGIN_PX, window.innerWidth - rect.right),
          ...(openUpward
            ? { bottom: window.innerHeight - rect.top + ACTION_MENU_OFFSET_PX }
            : { top: rect.bottom + ACTION_MENU_OFFSET_PX }),
        });
      };

      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);
      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition, true);
      };
    }, [isOpen]);

    useEffect(() => {
      if (!isOpen) return undefined;

      const handlePointerDown = (event) => {
        const inButton = buttonWrapRef.current?.contains(event.target);
        const inMenu = menuRef.current?.contains(event.target);
        if (!inButton && !inMenu) onClose();
      };

      const handleKeyDown = (event) => {
        if (event.key === 'Escape') onClose();
      };

      document.addEventListener('mousedown', handlePointerDown);
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('mousedown', handlePointerDown);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [isOpen, onClose]);

    const menu = isOpen
      ? createPortal(
          <div
            ref={menuRef}
            role="menu"
            aria-label={menuLabel}
            style={{
              position: 'fixed',
              zIndex: 50,
              width: ACTION_MENU_WIDTH_PX,
              visibility: placement ? 'visible' : 'hidden',
              ...placement,
            }}
            className="overflow-hidden rounded-[8px] border border-[#e4e4e4] bg-white shadow-[0px_8px_24px_rgba(15,23,42,0.12)]"
          >
            <span className="block h-[3px] w-full bg-[#4048cd]" aria-hidden="true" />
            <button
              type="button"
              role="menuitem"
              onClick={onSeeDetails}
              className="w-full cursor-pointer px-4 py-2.5 text-left text-[16px] leading-normal text-[#373737] transition hover:bg-[#f6fbff]"
            >
              {t('adminDemoProfiles.actions.seeDetails')}
            </button>
            <button
              type="button"
              role="menuitem"
              disabled={isActive}
              onClick={onSetActive}
              className="w-full cursor-pointer px-4 py-2.5 text-left text-[16px] leading-normal text-[#373737] transition hover:bg-[#f6fbff] disabled:cursor-default disabled:opacity-50"
            >
              {t('adminDemoProfiles.actions.active')}
            </button>
            <button
              type="button"
              role="menuitem"
              disabled={!isActive}
              onClick={onSetInactive}
              className="w-full cursor-pointer px-4 py-2.5 text-left text-[16px] leading-normal text-[#373737] transition hover:bg-[#f6fbff] disabled:cursor-default disabled:opacity-50"
            >
              {t('adminDemoProfiles.actions.inactive')}
            </button>
          </div>,
          document.body,
        )
      : null;

    return (
      <div className="relative inline-flex" ref={buttonWrapRef}>
        <button
          ref={buttonRef}
          type="button"
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-label={menuLabel}
          onClick={onToggle}
          className={`inline-flex size-8 cursor-pointer items-center justify-center rounded-[6px] text-[#373737] transition ${
            isOpen ? 'bg-[#f6fbff]' : 'hover:bg-[#f6fbff]'
          }`}
        >
          <MoreVertical size={MORE_ICON_SIZE} aria-hidden="true" />
        </button>
        {menu}
      </div>
    );
  },
);
ProfileActionMenu.displayName = 'ProfileActionMenu';

const ProfileTableRow = memo(
  ({ profile, openActionId, onToggleAction, onCloseAction, onSeeDetails, onSetActive, onSetInactive }) => {
    const { t } = useTranslation();

    return (
      <tr className="border-b border-[#e4e4e4]">
        <td className="min-w-[160px] px-[26px] py-6 text-[16px] leading-6 text-[#0c0c0c]">
          {getDemoProfileDisplayName(profile, t)}
        </td>
        <td className="min-w-[140px] px-[26px] py-6 text-[16px] leading-6 text-[#0c0c0c]">
          {getDemoProfileDisplayUsername(profile, t)}
        </td>
        <td className="hidden min-w-[180px] px-[26px] py-6 text-[16px] leading-6 whitespace-nowrap text-[#0c0c0c] sm:table-cell">
          {profile.phone}
        </td>
        <td className="min-w-[180px] px-[26px] py-6 text-[16px] leading-6 break-all text-[#0c0c0c]">
          {profile.email}
        </td>
        <td className="min-w-[140px] px-[26px] py-6">
          <StatusBadge status={profile.status} />
        </td>
        <td className="min-w-[100px] px-[26px] py-6">
          <ProfileActionMenu
            profile={profile}
            isOpen={openActionId === profile.id}
            onToggle={() => onToggleAction(profile.id)}
            onClose={onCloseAction}
            onSeeDetails={() => onSeeDetails(profile.id)}
            onSetActive={() => onSetActive(profile.id)}
            onSetInactive={() => onSetInactive(profile.id)}
          />
        </td>
      </tr>
    );
  },
);
ProfileTableRow.displayName = 'ProfileTableRow';

const ProfileMobileCard = memo(
  ({ profile, openActionId, onToggleAction, onCloseAction, onSeeDetails, onSetActive, onSetInactive }) => {
    const { t } = useTranslation();

    return (
      <article className="flex flex-col gap-3 border-b border-[#e4e4e4] px-4 py-4 last:border-b-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[16px] font-semibold leading-6 text-[#0c0c0c]">
              {getDemoProfileDisplayName(profile, t)}
            </p>
            <p className="mt-1 text-[14px] leading-5 text-[#687186]">
              {getDemoProfileDisplayUsername(profile, t)}
            </p>
          </div>
          <ProfileActionMenu
            profile={profile}
            isOpen={openActionId === profile.id}
            onToggle={() => onToggleAction(profile.id)}
            onClose={onCloseAction}
            onSeeDetails={() => onSeeDetails(profile.id)}
            onSetActive={() => onSetActive(profile.id)}
            onSetInactive={() => onSetInactive(profile.id)}
          />
        </div>

        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[13px] leading-5 text-[#7f8ba1]">
              {t('adminDemoProfiles.columns.phone')}
            </span>
            <span className="text-right text-[14px] leading-5 text-[#0c0c0c]">{profile.phone}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[13px] leading-5 text-[#7f8ba1]">
              {t('adminDemoProfiles.columns.email')}
            </span>
            <span className="text-right text-[14px] leading-5 text-[#0c0c0c]">{profile.email}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[13px] leading-5 text-[#7f8ba1]">
              {t('adminDemoProfiles.columns.status')}
            </span>
            <StatusBadge status={profile.status} />
          </div>
        </div>
      </article>
    );
  },
);
ProfileMobileCard.displayName = 'ProfileMobileCard';

const AdminDemoProfilesContent = memo(() => {
  const { t } = useTranslation();
  const isMdUp = useIsMdUp();
  const {
    statusFilter,
    sortOpen,
    openActionId,
    detailProfile,
    stats,
    visibleProfiles,
    resultsFrom,
    resultsTo,
    resultsTotal,
    isFirstPage,
    isLastPage,
    handleStatusFilterChange,
    handleToggleSort,
    handleCloseSort,
    handleToggleAction,
    handleCloseAction,
    handleOpenDetails,
    handleCloseDetails,
    handleSetStatus,
    handleDeactivateProfile,
    handlePreviousPage,
    handleNextPage,
  } = useAdminDemoProfiles();

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <AdminPageHeader
          title={t('adminDemoProfiles.title')}
          description={t('adminDemoProfiles.subtitle')}
        />

        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <StatusSortSelect
            statusFilter={statusFilter}
            sortOpen={sortOpen}
            onToggle={handleToggleSort}
            onClose={handleCloseSort}
            onSelect={handleStatusFilterChange}
          />
          <Link
            to={ROUTES.ADMIN_DEMO_PROFILES_CREATE}
            className="inline-flex w-fit cursor-pointer items-center justify-center gap-2 rounded-[50px] bg-[#ee1c25] px-6 py-3 text-[16px] font-bold leading-normal text-white transition hover:bg-[#d41921]"
          >
            <Plus size={20} aria-hidden="true" />
            {t('adminDemoProfiles.addButton')}
          </Link>
        </div>
      </div>

      <DemoProfileStatCards stats={stats} />

      <section aria-label={t('adminDemoProfiles.tableAria')} className="overflow-hidden rounded-[12px] bg-white">
        {visibleProfiles.length > 0 ? (
          isMdUp ? (
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse text-left">
                <thead>
                  <tr className="bg-[#f6fbff]">
                    <th className="rounded-tl-[12px] px-[26px] py-3 text-[16px] font-normal leading-6 text-black">
                      {t('adminDemoProfiles.columns.profile')}
                    </th>
                    <th className="px-[26px] py-3 text-[16px] font-normal leading-6 text-black">
                      {t('adminDemoProfiles.columns.username')}
                    </th>
                    <th className="hidden px-[26px] py-3 text-[16px] font-normal leading-6 text-black sm:table-cell">
                      {t('adminDemoProfiles.columns.phone')}
                    </th>
                    <th className="px-[26px] py-3 text-[16px] font-normal leading-6 text-black">
                      {t('adminDemoProfiles.columns.email')}
                    </th>
                    <th className="px-[26px] py-3 text-[16px] font-normal leading-6 text-black">
                      {t('adminDemoProfiles.columns.status')}
                    </th>
                    <th className="rounded-tr-[12px] px-[26px] py-3 text-[16px] font-normal leading-6 text-black">
                      {t('adminDemoProfiles.columns.action')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleProfiles.map((profile) => (
                    <ProfileTableRow
                      key={profile.id}
                      profile={profile}
                      openActionId={openActionId}
                      onToggleAction={handleToggleAction}
                      onCloseAction={handleCloseAction}
                      onSeeDetails={handleOpenDetails}
                      onSetActive={(id) => handleSetStatus(id, DEMO_PROFILE_STATUS.ACTIVE)}
                      onSetInactive={(id) => handleSetStatus(id, DEMO_PROFILE_STATUS.INACTIVE)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col" data-testid="demo-profiles-mobile-cards">
              {visibleProfiles.map((profile) => (
                <ProfileMobileCard
                  key={profile.id}
                  profile={profile}
                  openActionId={openActionId}
                  onToggleAction={handleToggleAction}
                  onCloseAction={handleCloseAction}
                  onSeeDetails={handleOpenDetails}
                  onSetActive={(id) => handleSetStatus(id, DEMO_PROFILE_STATUS.ACTIVE)}
                  onSetInactive={(id) => handleSetStatus(id, DEMO_PROFILE_STATUS.INACTIVE)}
                />
              ))}
            </div>
          )
        ) : (
          <p className="px-6 py-10 text-center text-[16px] text-[#687186]">
            {t('adminDemoProfiles.empty')}
          </p>
        )}

        <AdminPagination
          variant="users"
          from={resultsFrom}
          to={resultsTo}
          total={resultsTotal}
          isFirstPage={isFirstPage}
          isLastPage={isLastPage}
          onPrevious={handlePreviousPage}
          onNext={handleNextPage}
          showingText={t('adminDemoProfiles.pagination.showing', {
            from: resultsFrom,
            to: resultsTo,
            total: resultsTotal,
          })}
          previousLabel={t('adminDemoProfiles.pagination.previous')}
          nextLabel={t('adminDemoProfiles.pagination.next')}
        />
      </section>

      <DemoProfileDetailModal
        open={Boolean(detailProfile)}
        profile={detailProfile}
        onClose={handleCloseDetails}
        onDeactivate={handleDeactivateProfile}
      />
    </div>
  );
});

AdminDemoProfilesContent.displayName = 'AdminDemoProfilesContent';

export default AdminDemoProfilesContent;
