import { useTranslation } from 'react-i18next';
import React, { memo, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ADMIN_PAYOUTS_ASSETS,
  ACTION_STATUS_OPTIONS,
  MORE_ICON_SIZE,
  STATUS_STYLES,
  STATUS_LABEL_KEYS,
} from '@/portals/admin/data/adminPayoutsData';
import useAdminPayouts from '@/portals/admin/hooks/useAdminPayouts';

const ACTION_MENU_OFFSET_PX = 6;
const ACTION_MENU_FALLBACK_HEIGHT_PX = 80;
const ACTION_MENU_VIEWPORT_MARGIN_PX = 8;

const StatusText = memo(({ status }) => {
  const { t } = useTranslation();
  const style = STATUS_STYLES[status] || STATUS_STYLES.approved;

  return (
    <span className={`text-[14px] font-semibold leading-5 ${style.text}`}>
      {t(STATUS_LABEL_KEYS[status])}
    </span>
  );
});
StatusText.displayName = 'StatusText';

const PayoutActionMenu = memo(({ row, isOpen, onToggle, onClose, onSelectStatus }) => {
  const { t } = useTranslation();
  const buttonWrapRef = useRef(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const [placement, setPlacement] = useState(null);

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
        <ul
          ref={menuRef}
          role="listbox"
          aria-label={t('adminPayouts.actions.menuAria')}
          style={{
            position: 'fixed',
            zIndex: 50,
            visibility: placement ? 'visible' : 'hidden',
            ...placement,
          }}
          className="min-w-36 overflow-hidden rounded-[10px] border border-[#e8ebf1] bg-white py-1 shadow-[0_10px_30px_rgba(27,39,69,0.12)]"
        >
          {ACTION_STATUS_OPTIONS.map((option) => {
            const selected = option.id === row.status;
            return (
              <li key={option.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => onSelectStatus(row.id, option.id)}
                  className={`flex w-full cursor-pointer items-center gap-2 px-3.5 py-2.5 text-left text-[14px] font-medium leading-5 transition hover:bg-[#f6fbff] ${
                    selected ? 'bg-[#f6fbff] text-[#4048cd]' : 'text-[#373737]'
                  }`}
                >
                  <span
                    className={`size-1.5 shrink-0 rounded-full ${STATUS_STYLES[option.id]?.dot || 'bg-[#8b95a5]'}`}
                    aria-hidden="true"
                  />
                  {t(option.labelKey)}
                </button>
              </li>
            );
          })}
        </ul>,
        document.body,
      )
    : null;

  return (
    <div className="relative inline-flex" ref={buttonWrapRef}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={t('adminPayouts.actions.menu')}
        onClick={() => onToggle(row.id)}
        className={`inline-flex size-8 cursor-pointer items-center justify-center rounded-lg transition ${
          isOpen ? 'bg-[#f0f2f5]' : 'hover:bg-[#f6f7f9]'
        }`}
      >
        <img
          src={ADMIN_PAYOUTS_ASSETS.more}
          alt=""
          width={MORE_ICON_SIZE}
          height={MORE_ICON_SIZE}
          className="size-5"
        />
      </button>
      {menu}
    </div>
  );
});
PayoutActionMenu.displayName = 'PayoutActionMenu';

const PayoutTableRow = memo(({ row, isEven, openActionId, onToggleAction, onCloseAction, onSelectStatus }) => {
  const { t } = useTranslation();

  return (
    <tr className={isEven ? 'bg-[#fff5f5]' : 'bg-white'}>
      <td className="px-4 py-4 text-[14px] leading-5 text-[#263147] sm:px-5">{t(row.dateKey)}</td>
      <td className="px-4 py-4 text-[14px] leading-5 text-[#59657a] sm:px-5">{t(row.typeKey)}</td>
      <td className="px-4 py-4 text-[14px] leading-5 text-[#59657a] sm:px-5">{t(row.accountTypeKey)}</td>
      <td className="px-4 py-4 text-[14px] leading-5 whitespace-nowrap text-[#59657a] sm:px-5">
        {row.accountNumber}
      </td>
      <td className="px-4 py-4 text-[14px] leading-5 text-[#263147] sm:px-5">{row.amount}</td>
      <td className="px-4 py-4 sm:px-5">
        <StatusText status={row.status} />
      </td>
      <td className="px-4 py-4 sm:px-5">
        <PayoutActionMenu
          row={row}
          isOpen={openActionId === row.id}
          onToggle={onToggleAction}
          onClose={onCloseAction}
          onSelectStatus={onSelectStatus}
        />
      </td>
    </tr>
  );
});
PayoutTableRow.displayName = 'PayoutTableRow';

const PayoutTable = memo(({ rows, openActionId, onToggleAction, onCloseAction, onSelectStatus }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-175 border-collapse text-left">
        <thead>
          <tr className="border-b border-[#e8ebf1] bg-[#f7f8fa]">
            <th className="px-4 py-3.5 text-[13px] font-bold leading-4 text-[#263147] sm:px-5">
              {t('adminPayouts.columns.date')}
            </th>
            <th className="px-4 py-3.5 text-[13px] font-bold leading-4 text-[#263147] sm:px-5">
              {t('adminPayouts.columns.type')}
            </th>
            <th className="px-4 py-3.5 text-[13px] font-bold leading-4 text-[#263147] sm:px-5">
              {t('adminPayouts.columns.accountType')}
            </th>
            <th className="px-4 py-3.5 text-[13px] font-bold leading-4 text-[#263147] sm:px-5">
              {t('adminPayouts.columns.accountNumber')}
            </th>
            <th className="px-4 py-3.5 text-[13px] font-bold leading-4 text-[#263147] sm:px-5">
              {t('adminPayouts.columns.amount')}
            </th>
            <th className="px-4 py-3.5 text-[13px] font-bold leading-4 text-[#263147] sm:px-5">
              {t('adminPayouts.columns.status')}
            </th>
            <th className="px-4 py-3.5 text-[13px] font-bold leading-4 text-[#263147] sm:px-5">
              {t('adminPayouts.columns.action')}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <PayoutTableRow
              key={row.id}
              row={row}
              isEven={index % 2 === 0}
              openActionId={openActionId}
              onToggleAction={onToggleAction}
              onCloseAction={onCloseAction}
              onSelectStatus={onSelectStatus}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
});
PayoutTable.displayName = 'PayoutTable';

const PayoutMobileCards = memo(({ rows, openActionId, onToggleAction, onCloseAction, onSelectStatus }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col md:hidden">
      {rows.map((row) => (
        <article
          key={row.id}
          className="flex flex-col gap-2 border-b border-[#f0f2f5] px-4 py-4 last:border-b-0"
        >
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-semibold text-[#263147]">{t(row.dateKey)}</span>
            <PayoutActionMenu
              row={row}
              isOpen={openActionId === row.id}
              onToggle={onToggleAction}
              onClose={onCloseAction}
              onSelectStatus={onSelectStatus}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 text-[13px]">
            <div>
              <p className="text-[#8b95a5]">{t('adminPayouts.columns.type')}</p>
              <p className="text-[#59657a]">{t(row.typeKey)}</p>
            </div>
            <div>
              <p className="text-[#8b95a5]">{t('adminPayouts.columns.accountType')}</p>
              <p className="text-[#59657a]">{t(row.accountTypeKey)}</p>
            </div>
            <div>
              <p className="text-[#8b95a5]">{t('adminPayouts.columns.accountNumber')}</p>
              <p className="text-[#59657a]">{row.accountNumber}</p>
            </div>
            <div>
              <p className="text-[#8b95a5]">{t('adminPayouts.columns.amount')}</p>
              <p className="text-[#59657a]">{row.amount}</p>
            </div>
          </div>
          <StatusText status={row.status} />
        </article>
      ))}
    </div>
  );
});
PayoutMobileCards.displayName = 'PayoutMobileCards';

const SectionFooter = memo(({ rowCount }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#f0f2f5] px-4 py-4 sm:px-5">
      <p className="text-[13px] font-medium text-[#ee1c25]">
        {t('adminPayouts.pagination.showing', {
          from: 1,
          to: rowCount,
          total: rowCount,
        })}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded-md border border-[#e8ebf1] px-3.5 py-1.5 text-[13px] font-medium text-[#59657a] transition hover:bg-[#f7f8fa]"
        >
          {t('adminPayouts.pagination.previous')}
        </button>
        <button
          type="button"
          className="rounded-md border border-[#e8ebf1] px-3.5 py-1.5 text-[13px] font-medium text-[#59657a] transition hover:bg-[#f7f8fa]"
        >
          {t('adminPayouts.pagination.next')}
        </button>
      </div>
    </div>
  );
});
SectionFooter.displayName = 'SectionFooter';

const PayoutSection = memo(({ section, openActionId, onToggleAction, onCloseAction, onSelectStatus }) => {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col gap-3">
      <div>
        <p className="text-[12px] font-bold uppercase tracking-[1.2px] text-[#ee1c25]">
          {t('adminPayouts.eyebrow')}
        </p>
        <h2 className="font-manrope pt-1 text-[24px] font-bold leading-8 tracking-[-0.5px] text-[#111827] sm:text-[28px]">
          {t(section.titleKey)}
        </h2>
        <p className="pt-1 text-[14px] leading-5 text-[#6b7280]">
          {t(section.subtitleKey)}
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e8ebf1] bg-white shadow-[0px_4px_15px_0px_rgba(27,39,69,0.02)]">
        <div className="hidden md:block">
          <PayoutTable
            rows={section.rows}
            openActionId={openActionId}
            onToggleAction={onToggleAction}
            onCloseAction={onCloseAction}
            onSelectStatus={onSelectStatus}
          />
        </div>
        <PayoutMobileCards
          rows={section.rows}
          openActionId={openActionId}
          onToggleAction={onToggleAction}
          onCloseAction={onCloseAction}
          onSelectStatus={onSelectStatus}
        />
        <SectionFooter rowCount={section.rows.length} />
      </div>
    </section>
  );
});
PayoutSection.displayName = 'PayoutSection';

const AdminPayoutsContent = memo(() => {
  const {
    sections,
    openActionId,
    handleToggleAction,
    handleCloseAction,
    handleRowStatusChange,
  } = useAdminPayouts();

  return (
    <div className="flex w-full flex-col gap-10 py-2 sm:gap-14 sm:py-4">
      {sections.map((section) => (
        <PayoutSection
          key={section.id}
          section={section}
          openActionId={openActionId}
          onToggleAction={handleToggleAction}
          onCloseAction={handleCloseAction}
          onSelectStatus={handleRowStatusChange}
        />
      ))}
    </div>
  );
});

AdminPayoutsContent.displayName = 'AdminPayoutsContent';

export default AdminPayoutsContent;
