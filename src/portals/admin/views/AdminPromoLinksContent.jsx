import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Clock,
  Copy,
  Link2,
  MoreVertical,
  Plus,
  UserCheck,
} from 'lucide-react';
import React, {
  memo,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import AdminPageHeader from '@/components/common/AdminPageHeader/AdminPageHeader';
import AdminPagination from '@/components/common/AdminPagination/AdminPagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/data-display/Table/Table';
import Button from '@/components/ui/Button';
import GeneratePromoLinkModal from '@/portals/admin/components/admin-promo-links/GeneratePromoLinkModal';
import PromoLinkCreatedModal from '@/portals/admin/components/admin-promo-links/PromoLinkCreatedModal';
import PromoLinkDetailModal from '@/portals/admin/components/admin-promo-links/PromoLinkDetailModal';
import {
  buildPromoJoinAbsoluteUrl,
  CHECKLIST_STYLES,
  DATE_FILTERS,
  formatIssuedAt,
  getRequirementStage,
  getValidityMeta,
  MORE_ICON_SIZE,
  PROMO_LINKS_STAT_CARDS,
  REQUIREMENT_FILTERS,
  REWARD_ACTIONS,
  REWARD_FILTERS,
  REWARD_LABEL_KEYS,
  REWARD_STYLES,
  STATUS_FILTERS,
  STATUS_LABEL_KEYS,
  STATUS_STYLES,
  truncatePromoUrl,
} from '@/portals/admin/data/adminPromoLinksData';
import useAdminPromoLinks from '@/portals/admin/hooks/useAdminPromoLinks';

const ACTION_MENU_OFFSET_PX = 6;
const ACTION_MENU_FALLBACK_HEIGHT_PX = 220;
const ACTION_MENU_VIEWPORT_MARGIN_PX = 8;
const ACTION_MENU_WIDTH_PX = 188;
const MD_MEDIA_QUERY = '(min-width: 768px)';

const STAT_ICONS = {
  Link2,
  CheckCircle2,
  UserCheck,
  Clock,
  ClipboardList,
};

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

import AdminBasicStatCard from '@/components/data-display/AdminBasicStatCard/AdminBasicStatCard';

const PromoLinkStatCards = memo(({ stats }) => {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {PROMO_LINKS_STAT_CARDS.map((card) => {
        const Icon = STAT_ICONS[card.Icon] || Link2;
        return (
          <AdminBasicStatCard
            key={card.id}
            labelKey={card.labelKey}
            value={stats[card.id]}
            icon={<Icon size={16} />}
            iconBg={card.iconBg}
            borderClass="border-[#f3f4f6]"
            valueClass="text-[#111827] sm:text-[32px]"
            cardClass="px-5 py-4"
          />
        );
      })}
    </div>
  );
});
PromoLinkStatCards.displayName = 'PromoLinkStatCards';

const StatusBadge = memo(({ status }) => {
  const { t } = useTranslation();
  const style = STATUS_STYLES[status] || STATUS_STYLES.active;

  return (
    <span
      className={`inline-flex h-[30px] items-center gap-[6px] rounded-[8px] px-[9px] py-[5px] text-[13px] font-bold leading-[19px] whitespace-nowrap ${style.bg} ${style.text}`}
    >
      <span
        className={`size-[6px] shrink-0 rounded-full ${style.dot}`}
        aria-hidden="true"
      />
      {t(STATUS_LABEL_KEYS[status])}
    </span>
  );
});
StatusBadge.displayName = 'StatusBadge';

const ChecklistBadge = memo(({ link }) => {
  const { t } = useTranslation();
  const stage = getRequirementStage(link);

  if (stage === 'none') {
    return (
      <span className="text-[14px] text-[#9aa3b5]">
        {t('adminPromoLinks.checklist.none')}
      </span>
    );
  }

  const style = CHECKLIST_STYLES[stage];
  const label =
    stage === 'completed'
      ? t('adminPromoLinks.checklist.completed', {
          done: link.checklistDone,
          total: link.checklistTotal,
        })
      : t('adminPromoLinks.checklist.incomplete', {
          done: link.checklistDone,
          total: link.checklistTotal,
        });

  return (
    <span
      className={`inline-flex h-[30px] items-center gap-[5px] rounded-[8px] px-[9px] py-[5px] text-[13px] font-bold leading-[19px] whitespace-nowrap ${style.bg} ${style.text}`}
    >
      {stage === 'completed' ? (
        <Check size={12} strokeWidth={3} aria-hidden="true" />
      ) : (
        <AlertTriangle size={12} strokeWidth={2.5} aria-hidden="true" />
      )}
      {label}
    </span>
  );
});
ChecklistBadge.displayName = 'ChecklistBadge';

const ValidityText = memo(({ link }) => {
  const { t } = useTranslation();
  const validity = getValidityMeta(link);

  if (validity.kind === 'used') {
    return (
      <span className="text-[14px] text-[#687186]">
        {t('adminPromoLinks.validity.used')}
      </span>
    );
  }

  if (validity.kind === 'expired') {
    return (
      <span className="text-[14px] text-[#687186]">
        {t('adminPromoLinks.validity.expired')}
      </span>
    );
  }

  return (
    <span className="text-[14px] text-[#0c0c0c]">
      {t('adminPromoLinks.validity.daysLeft', { count: validity.daysLeft })}
    </span>
  );
});
ValidityText.displayName = 'ValidityText';

const CopyUrlButton = memo(({ code }) => {
  const { t } = useTranslation();
  const absoluteUrl = buildPromoJoinAbsoluteUrl(code);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(absoluteUrl);
      toast.success(t('adminPromoLinks.copySuccess'));
    } catch {
      toast.error(t('adminPromoLinks.copyFailed'));
    }
  };

  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="min-w-0 truncate text-[14px] leading-5 text-[#4048cd] sm:text-[15px]">
        {truncatePromoUrl(absoluteUrl.replace(/^https?:\/\//, ''), 36)}
      </span>
      <Button
        unstyled
        type="button"
        onClick={handleCopy}
        aria-label={t('adminPromoLinks.copyAria')}
        className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-[6px] text-[#ee1c25] transition hover:bg-[#fde8e9]"
      >
        <Copy size={14} aria-hidden="true" />
      </Button>
    </div>
  );
});
CopyUrlButton.displayName = 'CopyUrlButton';

const RewardLabel = memo(({ reward }) => {
  const { t } = useTranslation();
  return (
    <span
      className={`text-[14px] font-medium ${REWARD_STYLES[reward] || 'text-[#0c0c0c]'}`}
    >
      {t(REWARD_LABEL_KEYS[reward])}
    </span>
  );
});
RewardLabel.displayName = 'RewardLabel';

const FilterSelect = memo(
  ({
    filterKey,
    value,
    options,
    open,
    onToggle,
    onClose,
    onSelect,
    ariaLabel,
  }) => {
    const { t } = useTranslation();
    const rootRef = useRef(null);
    const active = options.find((option) => option.id === value) || options[0];

    useEffect(() => {
      if (!open) return undefined;

      const handlePointerDown = (event) => {
        if (rootRef.current && !rootRef.current.contains(event.target))
          onClose();
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
    }, [open, onClose]);

    return (
      <div className="relative min-w-0 flex-1" ref={rootRef}>
        <Button
          unstyled
          type="button"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={ariaLabel}
          onClick={() => onToggle(filterKey)}
          className="inline-flex h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-[8px] border border-[#e4e4e4] bg-white px-3 text-left sm:h-12"
        >
          <span className="truncate text-[14px] leading-normal text-[#373737] sm:text-[15px]">
            {t(active.labelKey)}
          </span>
          <ChevronDown
            size={18}
            className={`shrink-0 text-[#687186] transition ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </Button>

        {open ? (
          <ul
            role="listbox"
            aria-label={ariaLabel}
            className="absolute left-0 top-full z-20 mt-1 max-h-60 w-full min-w-[180px] overflow-auto rounded-[8px] border border-[#e4e4e4] bg-white shadow-lg"
          >
            {options.map((option) => {
              const selected = option.id === value;
              return (
                <li key={option.id}>
                  <Button
                    unstyled
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => onSelect(filterKey, option.id)}
                    className={`w-full cursor-pointer px-3 py-2.5 text-left text-[15px] transition hover:bg-[#f6fbff] ${
                      selected
                        ? 'bg-[#f6fbff] text-[#4048cd]'
                        : 'text-[#373737]'
                    }`}
                  >
                    {t(option.labelKey)}
                  </Button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    );
  },
);
FilterSelect.displayName = 'FilterSelect';

const PromoLinkActionMenu = memo(
  ({ link, isOpen, onToggle, onClose, onSeeDetails, onSetReward }) => {
    const { t } = useTranslation();
    const buttonWrapRef = useRef(null);
    const buttonRef = useRef(null);
    const menuRef = useRef(null);
    const [placement, setPlacement] = useState(null);
    const menuLabel = t('adminPromoLinks.actions.menu', { id: link.linkId });

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
            className="overflow-hidden rounded-[8px] border border-[#e4e4e4] bg-white shadow-[0px_8px_24px_rgba(15,23,42,0.12)]"
          >
            <Button
              unstyled
              type="button"
              role="menuitem"
              onClick={onSeeDetails}
              className="w-full cursor-pointer bg-[#4048cd] px-4 py-2.5 text-left text-[15px] font-semibold leading-normal text-white transition hover:bg-[#353cb0]"
            >
              {t('adminPromoLinks.actions.seeDetails')}
            </Button>
            <p className="px-4 pt-3 pb-1 text-[13px] font-bold text-[#151e31]">
              {t('adminPromoLinks.actions.reward')}
            </p>
            {REWARD_ACTIONS.map((reward) => (
              <Button
                unstyled
                key={reward}
                type="button"
                role="menuitem"
                disabled={link.reward === reward}
                onClick={() => onSetReward(reward)}
                className="w-full cursor-pointer px-4 py-2 text-left text-[15px] leading-normal text-[#373737] transition hover:bg-[#f6fbff] disabled:cursor-default disabled:opacity-50"
              >
                {t(REWARD_LABEL_KEYS[reward])}
              </Button>
            ))}
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
          className={`inline-flex size-8 cursor-pointer items-center justify-center rounded-[6px] text-[#373737] transition ${
            isOpen ? 'bg-[#f6fbff]' : 'hover:bg-[#f6fbff]'
          }`}
        >
          <MoreVertical size={MORE_ICON_SIZE} aria-hidden="true" />
        </Button>
        {menu}
      </div>
    );
  },
);
PromoLinkActionMenu.displayName = 'PromoLinkActionMenu';

const PromoLinkTableRow = memo(
  ({
    link,
    openActionId,
    onToggleAction,
    onCloseAction,
    onSeeDetails,
    onSetReward,
  }) => (
    <TableRow className="border-b border-[#e4e4e4]">
      <TableCell className="min-w-[110px] text-[15px] font-semibold leading-6 text-[#4048cd]">
        {link.linkId}
      </TableCell>
      <TableCell className="min-w-[220px]">
        <CopyUrlButton code={link.code} />
      </TableCell>
      <TableCell className="min-w-[140px] text-[14px] leading-6 whitespace-nowrap text-[#0c0c0c]">
        {formatIssuedAt(link.issuedAt)}
      </TableCell>
      <TableCell className="min-w-[110px]">
        <ValidityText link={link} />
      </TableCell>
      <TableCell className="min-w-[110px]">
        <StatusBadge status={link.status} />
      </TableCell>
      <TableCell className="min-w-[150px]">
        <ChecklistBadge link={link} />
      </TableCell>
      <TableCell className="min-w-[120px] text-[14px] leading-6 text-[#0c0c0c]">
        <RewardLabel reward={link.reward} />
      </TableCell>
      <TableCell className="min-w-[72px]">
        <PromoLinkActionMenu
          link={link}
          isOpen={openActionId === link.id}
          onToggle={() => onToggleAction(link.id)}
          onClose={onCloseAction}
          onSeeDetails={() => onSeeDetails(link.id)}
          onSetReward={(reward) => onSetReward(link.id, reward)}
        />
      </TableCell>
    </TableRow>
  ),
);
PromoLinkTableRow.displayName = 'PromoLinkTableRow';

const PromoLinkMobileCard = memo(
  ({
    link,
    openActionId,
    onToggleAction,
    onCloseAction,
    onSeeDetails,
    onSetReward,
  }) => {
    const { t } = useTranslation();

    return (
      <article className="flex flex-col gap-3 border-b border-[#e4e4e4] px-4 py-4 last:border-b-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[16px] font-semibold leading-6 text-[#4048cd]">
              {link.linkId}
            </p>
            <div className="mt-2">
              <CopyUrlButton code={link.code} />
            </div>
          </div>
          <PromoLinkActionMenu
            link={link}
            isOpen={openActionId === link.id}
            onToggle={() => onToggleAction(link.id)}
            onClose={onCloseAction}
            onSeeDetails={() => onSeeDetails(link.id)}
            onSetReward={(reward) => onSetReward(link.id, reward)}
          />
        </div>

        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[13px] text-[#7f8ba1]">
              {t('adminPromoLinks.columns.dateIssued')}
            </span>
            <span className="text-right text-[14px] text-[#0c0c0c]">
              {formatIssuedAt(link.issuedAt)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[13px] text-[#7f8ba1]">
              {t('adminPromoLinks.columns.validity')}
            </span>
            <ValidityText link={link} />
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[13px] text-[#7f8ba1]">
              {t('adminPromoLinks.columns.status')}
            </span>
            <StatusBadge status={link.status} />
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[13px] text-[#7f8ba1]">
              {t('adminPromoLinks.columns.checklist')}
            </span>
            <ChecklistBadge link={link} />
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[13px] text-[#7f8ba1]">
              {t('adminPromoLinks.columns.reward')}
            </span>
            <span className="text-right text-[14px] text-[#0c0c0c]">
              <RewardLabel reward={link.reward} />
            </span>
          </div>
        </div>
      </article>
    );
  },
);
PromoLinkMobileCard.displayName = 'PromoLinkMobileCard';

const AdminPromoLinksContent = memo(() => {
  const { t } = useTranslation();
  const isMdUp = useIsMdUp();
  const {
    stats,
    filters,
    openFilter,
    openActionId,
    detailLink,
    generateOpen,
    createdLink,
    visibleLinks,
    resultsFrom,
    resultsTo,
    resultsTotal,
    isFirstPage,
    isLastPage,
    patchFilter,
    handleToggleFilter,
    handleCloseFilter,
    handleToggleAction,
    handleCloseAction,
    handleOpenDetails,
    handleCloseDetails,
    handleSetReward,
    handleOpenGenerate,
    handleCloseGenerate,
    handleConfirmGenerate,
    handleCloseCreated,
    handlePreviousPage,
    handleNextPage,
  } = useAdminPromoLinks();

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <AdminPageHeader
          title={t('adminPromoLinks.title')}
          description={t('adminPromoLinks.subtitle')}
        />
        <Button
          unstyled
          type="button"
          onClick={handleOpenGenerate}
          className="inline-flex w-fit cursor-pointer items-center justify-center gap-2 rounded-[50px] bg-[#ee1c25] px-5 py-3 text-[15px] font-bold leading-normal text-white transition hover:bg-[#d41921] sm:px-6 sm:text-[16px]"
        >
          <Plus size={18} aria-hidden="true" />
          {t('adminPromoLinks.generateButton')}
        </Button>
      </div>

      <PromoLinkStatCards stats={stats} />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <FilterSelect
          filterKey="status"
          value={filters.status}
          options={STATUS_FILTERS}
          open={openFilter === 'status'}
          onToggle={handleToggleFilter}
          onClose={handleCloseFilter}
          onSelect={patchFilter}
          ariaLabel={t('adminPromoLinks.filters.status.aria')}
        />
        <FilterSelect
          filterKey="dateRange"
          value={filters.dateRange}
          options={DATE_FILTERS}
          open={openFilter === 'dateRange'}
          onToggle={handleToggleFilter}
          onClose={handleCloseFilter}
          onSelect={patchFilter}
          ariaLabel={t('adminPromoLinks.filters.date.aria')}
        />
        <FilterSelect
          filterKey="requirements"
          value={filters.requirements}
          options={REQUIREMENT_FILTERS}
          open={openFilter === 'requirements'}
          onToggle={handleToggleFilter}
          onClose={handleCloseFilter}
          onSelect={patchFilter}
          ariaLabel={t('adminPromoLinks.filters.requirements.aria')}
        />
        <FilterSelect
          filterKey="reward"
          value={filters.reward}
          options={REWARD_FILTERS}
          open={openFilter === 'reward'}
          onToggle={handleToggleFilter}
          onClose={handleCloseFilter}
          onSelect={patchFilter}
          ariaLabel={t('adminPromoLinks.filters.reward.aria')}
        />
      </div>

      <section
        aria-label={t('adminPromoLinks.tableAria')}
        className="overflow-hidden rounded-[12px] bg-white"
      >
        {visibleLinks.length > 0 ? (
          isMdUp ? (
            <Table className="min-w-[1100px]">
              <TableHeader>
                <TableRow isHeader>
                  <TableHead className="rounded-tl-[12px]">
                    {t('adminPromoLinks.columns.linkId')}
                  </TableHead>
                  <TableHead>{t('adminPromoLinks.columns.url')}</TableHead>
                  <TableHead>
                    {t('adminPromoLinks.columns.dateIssued')}
                  </TableHead>
                  <TableHead>{t('adminPromoLinks.columns.validity')}</TableHead>
                  <TableHead>{t('adminPromoLinks.columns.status')}</TableHead>
                  <TableHead>
                    {t('adminPromoLinks.columns.checklist')}
                  </TableHead>
                  <TableHead>{t('adminPromoLinks.columns.reward')}</TableHead>
                  <TableHead className="rounded-tr-[12px]">
                    {t('adminPromoLinks.columns.action')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleLinks.map((link) => (
                  <PromoLinkTableRow
                    key={link.id}
                    link={link}
                    openActionId={openActionId}
                    onToggleAction={handleToggleAction}
                    onCloseAction={handleCloseAction}
                    onSeeDetails={handleOpenDetails}
                    onSetReward={handleSetReward}
                  />
                ))}
              </TableBody>
            </Table>
          ) : (
            <div
              className="flex flex-col"
              data-testid="promo-links-mobile-cards"
            >
              {visibleLinks.map((link) => (
                <PromoLinkMobileCard
                  key={link.id}
                  link={link}
                  openActionId={openActionId}
                  onToggleAction={handleToggleAction}
                  onCloseAction={handleCloseAction}
                  onSeeDetails={handleOpenDetails}
                  onSetReward={handleSetReward}
                />
              ))}
            </div>
          )
        ) : (
          <p className="px-6 py-10 text-center text-[16px] text-[#687186]">
            {t('adminPromoLinks.empty')}
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
          showingText={t('adminPromoLinks.pagination.showing', {
            from: resultsFrom,
            to: resultsTo,
            total: resultsTotal,
          })}
          previousLabel={t('adminPromoLinks.pagination.previous')}
          nextLabel={t('adminPromoLinks.pagination.next')}
        />
      </section>

      <GeneratePromoLinkModal
        open={generateOpen}
        onClose={handleCloseGenerate}
        onConfirm={handleConfirmGenerate}
      />
      <PromoLinkCreatedModal
        open={Boolean(createdLink)}
        link={createdLink}
        onClose={handleCloseCreated}
      />
      <PromoLinkDetailModal
        open={Boolean(detailLink)}
        link={detailLink}
        onClose={handleCloseDetails}
      />
    </div>
  );
});

AdminPromoLinksContent.displayName = 'AdminPromoLinksContent';

export default AdminPromoLinksContent;
