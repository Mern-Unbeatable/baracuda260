import { MoreVertical, Plus } from 'lucide-react';
import React, {
  memo,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import AdminPageHeader from '@/components/common/AdminPageHeader/AdminPageHeader';
import AdminPagination from '@/components/common/AdminPagination/AdminPagination';
import AdminBasicStatCard from '@/components/data-display/AdminBasicStatCard/AdminBasicStatCard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/data-display/Table/Table';
import Button from '@/components/ui/Button';
import DemoProfileDetailModal from '@/portals/admin/components/admin-demo-profiles/DemoProfileDetailModal';
import UserAvatar from '@/portals/admin/components/admin-users/UserAvatar';
import {
  DEMO_PROFILE_STATUS,
  DEMO_PROFILES_STAT_CARDS,
  getDemoProfileDisplayName,
  getDemoProfileDisplayUsername,
  MORE_ICON_SIZE,
  STATUS_FILTERS,
  STATUS_LABEL_KEYS,
} from '@/portals/admin/data/adminDemoProfilesData';
import useAdminDemoProfiles from '@/portals/admin/hooks/useAdminDemoProfiles';
import { ROUTES } from '@/shared/config';

const ACTION_MENU_OFFSET_PX = 6;
const ACTION_MENU_FALLBACK_HEIGHT_PX = 148;
const ACTION_MENU_VIEWPORT_MARGIN_PX = 8;
const ACTION_MENU_WIDTH_PX = 176;
const MD_MEDIA_QUERY = '(min-width: 768px)';

const TH_CLASS =
  'px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-[#64748b] lg:px-4';
const TD_CLASS = 'px-3 py-2.5 text-[13px] leading-4 text-[#0f172a] lg:px-4';

const useIsMdUp = () => {
  const [isMdUp, setIsMdUp] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia(MD_MEDIA_QUERY).matches
      : false,
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

const DemoProfileStatCards = memo(({ stats }) => (
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
    {DEMO_PROFILES_STAT_CARDS.map((card) => (
      <AdminBasicStatCard
        key={card.id}
        labelKey={card.labelKey}
        value={stats[card.id] ?? 0}
        icon={card.icon}
        iconBg={card.iconBg}
        borderClass="border-[#f3f4f6]"
        cardClass="px-3 py-3.5 sm:px-5 sm:py-4.5"
        valueClass="pt-2 text-[22px] leading-7 text-[#111827] sm:pt-2.5 sm:text-[28px]"
      />
    ))}
  </div>
));
DemoProfileStatCards.displayName = 'DemoProfileStatCards';

const StatusBadge = memo(({ status }) => {
  const { t } = useTranslation();
  const isActive = status === DEMO_PROFILE_STATUS.ACTIVE;

  return (
    <span
      className={`inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 py-1 ${
        isActive ? 'bg-[#eef7f3]' : 'bg-[#f2f1f8]'
      }`}
    >
      <span
        className={`size-1.5 shrink-0 rounded-full ${
          isActive ? 'bg-[#268262]' : 'bg-[#766f9a]'
        }`}
        aria-hidden="true"
      />
      <span
        className={`text-[12px] font-semibold leading-4 whitespace-nowrap ${
          isActive ? 'text-[#268262]' : 'text-[#766f9a]'
        }`}
      >
        {t(STATUS_LABEL_KEYS[status])}
      </span>
    </span>
  );
});
StatusBadge.displayName = 'StatusBadge';

const StatusFilterTabs = memo(({ statusFilter, onSelect }) => {
  const { t } = useTranslation();

  return (
    <div
      className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
      role="tablist"
      aria-label={t('adminDemoProfiles.filters.aria')}
    >
      <div className="flex w-max flex-nowrap items-center gap-1.5 sm:w-auto sm:flex-wrap">
        {STATUS_FILTERS.map((filter) => {
          const active = filter.id === statusFilter;
          return (
            <Button
              unstyled
              key={filter.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onSelect(filter.id)}
              className={`inline-flex h-7 shrink-0 cursor-pointer items-center justify-center rounded-[7px] border px-3 py-1 text-[12px] font-semibold leading-4.5 transition ${
                active
                  ? 'border-[#4048cd] bg-[#4048cd] text-white'
                  : 'border-[#e5e7eb] bg-white text-[#6b7280] hover:bg-[#f9fafb]'
              }`}
            >
              {t(filter.labelKey)}
            </Button>
          );
        })}
      </div>
    </div>
  );
});
StatusFilterTabs.displayName = 'StatusFilterTabs';

const ProfileActionMenu = memo(
  ({
    profile,
    isOpen,
    onToggle,
    onClose,
    onSeeDetails,
    onSetActive,
    onSetInactive,
  }) => {
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
        const menuHeight =
          menuRef.current?.offsetHeight || ACTION_MENU_FALLBACK_HEIGHT_PX;
        const spaceBelow = window.innerHeight - rect.bottom;
        const openUpward = spaceBelow < menuHeight + ACTION_MENU_OFFSET_PX;

        setPlacement({
          right: Math.max(
            ACTION_MENU_VIEWPORT_MARGIN_PX,
            window.innerWidth - rect.right,
          ),
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
            className="overflow-hidden rounded-lg border border-[#e4e4e4] bg-white shadow-[0px_8px_24px_rgba(15,23,42,0.12)]"
          >
            <span
              className="block h-[3px] w-full bg-[#4048cd]"
              aria-hidden="true"
            />
            <Button
              unstyled
              type="button"
              role="menuitem"
              onClick={onSeeDetails}
              className="w-full cursor-pointer px-4 py-2.5 text-left text-[14px] leading-normal text-[#373737] transition hover:bg-[#f6fbff]"
            >
              {t('adminDemoProfiles.actions.seeDetails')}
            </Button>
            <Button
              unstyled
              type="button"
              role="menuitem"
              disabled={isActive}
              onClick={onSetActive}
              className="w-full cursor-pointer px-4 py-2.5 text-left text-[14px] leading-normal text-[#373737] transition hover:bg-[#f6fbff] disabled:cursor-default disabled:opacity-50"
            >
              {t('adminDemoProfiles.actions.active')}
            </Button>
            <Button
              unstyled
              type="button"
              role="menuitem"
              disabled={!isActive}
              onClick={onSetInactive}
              className="w-full cursor-pointer px-4 py-2.5 text-left text-[14px] leading-normal text-[#373737] transition hover:bg-[#f6fbff] disabled:cursor-default disabled:opacity-50"
            >
              {t('adminDemoProfiles.actions.inactive')}
            </Button>
          </div>,
          document.body,
        )
      : null;

    return (
      <div className="relative inline-flex" ref={buttonWrapRef}>
        <Button
          unstyled
          ref={buttonRef}
          type="button"
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-label={menuLabel}
          onClick={onToggle}
          className={`inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-[#64748b] transition ${
            isOpen ? 'bg-[#f1f5f9] text-[#0f172a]' : 'hover:bg-[#f1f5f9]'
          }`}
        >
          <MoreVertical size={MORE_ICON_SIZE} aria-hidden="true" />
        </Button>
        {menu}
      </div>
    );
  },
);
ProfileActionMenu.displayName = 'ProfileActionMenu';

const ProfileIdentity = memo(({ profile, avatarClassName = 'size-9 text-[11px]' }) => {
  const { t } = useTranslation();
  const name = getDemoProfileDisplayName(profile, t);
  const username = getDemoProfileDisplayUsername(profile, t);

  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <UserAvatar
        src={profile.avatar}
        name={name || profile.email}
        className={avatarClassName}
      />
      <div className="min-w-0">
        <p className="truncate font-semibold text-[#0f172a]">{name || '—'}</p>
        {username ? (
          <p className="truncate text-[11px] text-[#94a3b8]">{username}</p>
        ) : null}
      </div>
    </div>
  );
});
ProfileIdentity.displayName = 'ProfileIdentity';

const ProfileTableRow = memo(
  ({
    profile,
    openActionId,
    onToggleAction,
    onCloseAction,
    onSeeDetails,
    onSetActive,
    onSetInactive,
  }) => (
    <TableRow className="border-b border-[#f1f5f9] last:border-b-0 hover:bg-[#f8fafc]">
      <TableCell className={TD_CLASS}>
        <ProfileIdentity profile={profile} />
      </TableCell>
      <TableCell className={`${TD_CLASS} hidden text-[#475569] lg:table-cell`}>
        <span className="block truncate" title={profile.phone || undefined}>
          {profile.phone || '—'}
        </span>
      </TableCell>
      <TableCell className={`${TD_CLASS} text-[#475569]`}>
        <span className="block truncate" title={profile.email || undefined}>
          {profile.email || '—'}
        </span>
      </TableCell>
      <TableCell className={TD_CLASS}>
        <StatusBadge status={profile.status} />
      </TableCell>
      <TableCell className={TD_CLASS} align="right">
        <ProfileActionMenu
          profile={profile}
          isOpen={openActionId === profile.id}
          onToggle={() => onToggleAction(profile.id)}
          onClose={onCloseAction}
          onSeeDetails={() => onSeeDetails(profile.id)}
          onSetActive={() => onSetActive(profile.id)}
          onSetInactive={() => onSetInactive(profile.id)}
        />
      </TableCell>
    </TableRow>
  ),
);
ProfileTableRow.displayName = 'ProfileTableRow';

const ProfileMobileCard = memo(
  ({
    profile,
    openActionId,
    onToggleAction,
    onCloseAction,
    onSeeDetails,
    onSetActive,
    onSetInactive,
  }) => {
    const { t } = useTranslation();
    const name = getDemoProfileDisplayName(profile, t);
    const username = getDemoProfileDisplayUsername(profile, t);

    return (
      <article className="rounded-xl border border-[#edf0f5] bg-white p-3.5 shadow-[0px_1px_2px_rgba(15,23,42,0.04)]">
        <div className="flex items-start gap-3">
          <UserAvatar
            src={profile.avatar}
            name={name || profile.email}
            className="size-11 text-[12px]"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-[15px] font-semibold leading-5 text-[#0f172a]">
                  {name || '—'}
                </p>
                {username ? (
                  <p className="mt-0.5 truncate text-[12px] leading-4 text-[#94a3b8]">
                    {username}
                  </p>
                ) : null}
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
            <div className="mt-2">
              <StatusBadge status={profile.status} />
            </div>
          </div>
        </div>

        <div className="mt-3 space-y-2 border-t border-[#f1f5f9] pt-3">
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-[#94a3b8]">
              {t('adminDemoProfiles.columns.phone')}
            </p>
            <p className="mt-0.5 truncate text-[13px] font-medium leading-5 text-[#0f172a]">
              {profile.phone || '—'}
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-[#94a3b8]">
              {t('adminDemoProfiles.columns.email')}
            </p>
            <p
              className="mt-0.5 truncate text-[13px] font-medium leading-5 text-[#0f172a]"
              title={profile.email || undefined}
            >
              {profile.email || '—'}
            </p>
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
    openActionId,
    detailProfile,
    stats,
    visibleProfiles,
    isLoading,
    isDetailLoading,
    page,
    totalPages,
    resultsFrom,
    resultsTo,
    resultsTotal,
    handleStatusFilterChange,
    handleToggleAction,
    handleCloseAction,
    handleOpenDetails,
    handleCloseDetails,
    handleSetStatus,
    handleDeactivateProfile,
    handlePageChange,
  } = useAdminDemoProfiles();

  return (
    <div className="flex w-full flex-col gap-5 py-2 sm:gap-6 sm:py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
        <AdminPageHeader
          className="min-w-0 flex-1"
          title={t('adminDemoProfiles.title')}
          description={t('adminDemoProfiles.subtitle')}
          titleClassName="text-[24px] tracking-tight sm:text-[28px] lg:text-[30px] lg:leading-9"
          descriptionClassName="text-[13px] leading-5 sm:text-[14px]"
        />
        <Link
          to={ROUTES.ADMIN_DEMO_PROFILES_CREATE}
          className="inline-flex h-11 w-fit shrink-0 cursor-pointer items-center justify-center gap-2 self-end whitespace-nowrap rounded-full bg-[#ee1c25] px-5 text-[14px] font-bold leading-none text-white transition hover:bg-[#d41921] lg:mt-1"
        >
          <Plus size={18} aria-hidden="true" />
          {t('adminDemoProfiles.addButton')}
        </Link>
      </div>

      <DemoProfileStatCards stats={stats} />

      <section
        aria-label={t('adminDemoProfiles.tableAria')}
        className="overflow-hidden rounded-xl border border-[#f3f4f6] bg-white shadow-[0px_1px_4px_0px_rgba(0,0,0,0.06)] md:bg-white"
      >
        <div className="flex flex-col gap-3 border-b border-[#f3f4f6] px-4 py-3.5 sm:px-5 md:flex-row md:items-center md:justify-between">
          <p className="text-[13px] font-bold leading-5 text-[#111827] sm:text-[14px]">
            {t('adminDemoProfiles.tableTitle', 'All Profiles')}{' '}
            <span className="text-[12px] font-medium text-[#9ca3af] sm:text-[13px]">
              ({resultsTotal})
            </span>
          </p>
          <StatusFilterTabs
            statusFilter={statusFilter}
            onSelect={handleStatusFilterChange}
          />
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-[#687186]">
            <div className="size-8 animate-spin rounded-full border-3 border-[#4048cd] border-t-transparent" />
            <span className="text-[14px] font-medium">
              {t('adminDemoProfiles.loading', 'Loading demo profiles...')}
            </span>
          </div>
        ) : visibleProfiles.length > 0 ? (
          isMdUp ? (
            <Table className="w-full table-fixed" wrapperClassName="overflow-x-auto">
              <TableHeader>
                <TableRow isHeader className="border-b border-[#f1f5f9] bg-[#fafbfc]">
                  <TableHead className={`${TH_CLASS} w-[28%]`}>
                    {t('adminDemoProfiles.columns.profile')}
                  </TableHead>
                  <TableHead className={`${TH_CLASS} hidden w-[20%] lg:table-cell`}>
                    {t('adminDemoProfiles.columns.phone')}
                  </TableHead>
                  <TableHead className={`${TH_CLASS} w-[28%]`}>
                    {t('adminDemoProfiles.columns.email')}
                  </TableHead>
                  <TableHead className={`${TH_CLASS} w-[14%]`}>
                    {t('adminDemoProfiles.columns.status')}
                  </TableHead>
                  <TableHead className={`${TH_CLASS} w-[10%] text-right`}>
                    {t('adminDemoProfiles.columns.action')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleProfiles.map((profile) => (
                  <ProfileTableRow
                    key={profile.id}
                    profile={profile}
                    openActionId={openActionId}
                    onToggleAction={handleToggleAction}
                    onCloseAction={handleCloseAction}
                    onSeeDetails={handleOpenDetails}
                    onSetActive={(id) =>
                      handleSetStatus(id, DEMO_PROFILE_STATUS.ACTIVE)
                    }
                    onSetInactive={(id) =>
                      handleSetStatus(id, DEMO_PROFILE_STATUS.INACTIVE)
                    }
                  />
                ))}
              </TableBody>
            </Table>
          ) : (
            <div
              className="flex flex-col gap-3 bg-[#f8fafc] p-3 sm:p-4"
              data-testid="demo-profiles-mobile-cards"
            >
              {visibleProfiles.map((profile) => (
                <ProfileMobileCard
                  key={profile.id}
                  profile={profile}
                  openActionId={openActionId}
                  onToggleAction={handleToggleAction}
                  onCloseAction={handleCloseAction}
                  onSeeDetails={handleOpenDetails}
                  onSetActive={(id) =>
                    handleSetStatus(id, DEMO_PROFILE_STATUS.ACTIVE)
                  }
                  onSetInactive={(id) =>
                    handleSetStatus(id, DEMO_PROFILE_STATUS.INACTIVE)
                  }
                />
              ))}
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-[#687186]">
            <p className="text-[15px] text-[#687186]">
              {t('adminDemoProfiles.empty')}
            </p>
          </div>
        )}

        <div className="flex flex-col items-center gap-3 border-t border-[#f3f4f6] px-4 py-4 sm:flex-row sm:justify-between sm:px-5">
          <p className="text-center text-[13px] leading-5 text-[#687186] sm:text-left">
            {t('adminDemoProfiles.pagination.showing', {
              from: resultsFrom,
              to: resultsTo,
              total: resultsTotal,
            })}
          </p>
          <AdminPagination
            variant="competitions"
            page={page}
            totalPages={Math.max(1, totalPages)}
            onPageChange={handlePageChange}
            navAriaLabel={t(
              'adminDemoProfiles.pagination.aria',
              'Demo profiles pagination',
            )}
            firstLabel={t('adminDemoProfiles.pagination.first', 'First page')}
            prevLabel={t('adminDemoProfiles.pagination.previous')}
            nextLabel={t('adminDemoProfiles.pagination.next')}
            lastLabel={t('adminDemoProfiles.pagination.last', 'Last page')}
            pageLabel={(pageNumber) =>
              t('adminDemoProfiles.pagination.page', {
                page: pageNumber,
                defaultValue: `Page ${pageNumber}`,
              })
            }
          />
        </div>
      </section>

      <DemoProfileDetailModal
        open={Boolean(detailProfile)}
        profile={detailProfile}
        isLoading={isDetailLoading}
        onClose={handleCloseDetails}
        onDeactivate={handleDeactivateProfile}
      />
    </div>
  );
});

AdminDemoProfilesContent.displayName = 'AdminDemoProfilesContent';

export default AdminDemoProfilesContent;
