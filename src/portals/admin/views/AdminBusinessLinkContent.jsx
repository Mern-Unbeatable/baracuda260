import { Eye, Trash2 } from 'lucide-react';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import AdminPageHeader from '@/components/common/AdminPageHeader/AdminPageHeader';
import AdminPagination from '@/components/common/AdminPagination/AdminPagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/data-display/Table';
import Button from '@/components/ui/Button';
import UserAvatar from '@/portals/admin/components/admin-users/UserAvatar';
import {
  formatBusinessLinkDate,
  getBusinessLinkDetailPath,
} from '@/portals/admin/data/adminBusinessLinkData';
import useAdminBusinessLink from '@/portals/admin/hooks/useAdminBusinessLink';
import { ROUTES } from '@/shared/config';

const SKELETON_ROW_COUNT = 10;

const TH_CLASS =
  'px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-[#64748b] lg:px-4';
const TD_CLASS = 'px-3 py-2.5 text-[13px] leading-4 text-[#0f172a] lg:px-4';

const ACTION_BTN_CLASS =
  'inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-[#e2e8f0] bg-white text-[#475569] shadow-sm transition hover:border-[#c7cbf2] hover:bg-[#f8fafc] hover:text-[#4048cd] disabled:cursor-not-allowed disabled:opacity-50';

/**
 * @param {{ row: object }} props
 */
const BusinessLinkViewLink = memo(({ row }) => {
  const { t } = useTranslation();

  return (
    <Link
      to={getBusinessLinkDetailPath(
        row.id,
        ROUTES.ADMIN_BUSINESS_PHOTOS_DETAIL,
      )}
      aria-label={t('adminBusinessLink.actions.view', {
        user: row.name || row.email,
      })}
      className={ACTION_BTN_CLASS}
    >
      <Eye size={16} aria-hidden="true" />
    </Link>
  );
});

BusinessLinkViewLink.displayName = 'BusinessLinkViewLink';

/**
 * @param {{
 *   row: object,
 *   isDeleting: boolean,
 *   onDelete: (row: object) => void,
 * }} props
 */
const BusinessLinkDeleteButton = memo(({ row, isDeleting, onDelete }) => {
  const { t } = useTranslation();

  return (
    <Button
      unstyled
      type="button"
      disabled={isDeleting}
      onClick={() => onDelete(row)}
      aria-label={t('adminBusinessLink.actions.delete', {
        user: row.name || row.email,
        defaultValue: `Delete submission for ${row.name || row.email}`,
      })}
      title={t('adminBusinessLink.detail.delete')}
      className={`${ACTION_BTN_CLASS} text-[#ee1c25] hover:border-[#fecaca] hover:bg-[#fef2f2] hover:text-[#ee1c25]`}
    >
      <Trash2 size={16} aria-hidden="true" />
    </Button>
  );
});

BusinessLinkDeleteButton.displayName = 'BusinessLinkDeleteButton';

/**
 * @param {{
 *   row: object,
 *   isDeleting: boolean,
 *   onDelete: (row: object) => void,
 * }} props
 */
const BusinessLinkRowActions = memo(({ row, isDeleting, onDelete }) => (
  <div className="inline-flex items-center justify-end gap-2">
    <BusinessLinkViewLink row={row} />
    <BusinessLinkDeleteButton
      row={row}
      isDeleting={isDeleting}
      onDelete={onDelete}
    />
  </div>
));

BusinessLinkRowActions.displayName = 'BusinessLinkRowActions';

/**
 * @param {{
 *   row: object,
 *   isDeleting: boolean,
 *   onDelete: (row: object) => void,
 * }} props
 */
const BusinessLinkTableRow = memo(({ row, isDeleting, onDelete }) => {
  const { i18n } = useTranslation();

  return (
    <TableRow className="border-b border-[#f1f5f9] last:border-b-0 hover:bg-[#f8fafc]">
      <TableCell className={TD_CLASS}>
        <div className="flex min-w-0 items-center gap-2.5">
          <UserAvatar
            src={row.avatar}
            name={row.name || row.email}
            className="size-8 text-[11px]"
          />
          <p className="truncate font-semibold text-[#0f172a]">
            {row.name || '—'}
          </p>
        </div>
      </TableCell>
      <TableCell className={`${TD_CLASS} text-[#475569]`}>
        <span className="block truncate" title={row.email || undefined}>
          {row.email || '—'}
        </span>
      </TableCell>
      <TableCell
        className={`${TD_CLASS} hidden whitespace-nowrap text-[#475569] xl:table-cell`}
      >
        <span className="block truncate" title={row.phone || undefined}>
          {row.phone || '—'}
        </span>
      </TableCell>
      <TableCell
        className={`${TD_CLASS} hidden text-[#475569] lg:table-cell`}
      >
        <span className="block truncate" title={row.country || undefined}>
          {row.country || '—'}
        </span>
      </TableCell>
      <TableCell className={`${TD_CLASS} whitespace-nowrap text-[#475569]`}>
        {formatBusinessLinkDate(row.createdAt, i18n.language)}
      </TableCell>
      <TableCell className={TD_CLASS} align="right">
        <BusinessLinkRowActions
          row={row}
          isDeleting={isDeleting}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
});

BusinessLinkTableRow.displayName = 'BusinessLinkTableRow';

/**
 * @param {{
 *   rows: object[],
 *   deletingId: string | null,
 *   onDelete: (row: object) => void,
 * }} props
 */
const BusinessLinkTable = memo(({ rows, deletingId, onDelete }) => {
  const { t } = useTranslation();

  return (
    <Table
      className="w-full table-fixed"
      wrapperClassName="hidden overflow-hidden md:block"
    >
      <TableHeader>
        <TableRow
          isHeader
          className="border-b border-[#e2e8f0] bg-[#f8fafc]"
        >
          <TableHead className={`${TH_CLASS} rounded-tl-2xl`}>
            {t('adminBusinessLink.columns.user')}
          </TableHead>
          <TableHead className={TH_CLASS}>
            {t('adminBusinessLink.columns.email')}
          </TableHead>
          <TableHead className={`${TH_CLASS} hidden xl:table-cell`}>
            {t('adminBusinessLink.columns.phone')}
          </TableHead>
          <TableHead className={`${TH_CLASS} hidden lg:table-cell`}>
            {t('adminBusinessLink.columns.country')}
          </TableHead>
          <TableHead className={TH_CLASS}>
            {t('adminBusinessLink.columns.uploadDate')}
          </TableHead>
          <TableHead className={`${TH_CLASS} rounded-tr-2xl text-right`}>
            {t('adminBusinessLink.columns.action')}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <BusinessLinkTableRow
            key={row.id}
            row={row}
            isDeleting={deletingId === row.id}
            onDelete={onDelete}
          />
        ))}
      </TableBody>
    </Table>
  );
});

BusinessLinkTable.displayName = 'BusinessLinkTable';

/**
 * @param {{
 *   rows: object[],
 *   deletingId: string | null,
 *   onDelete: (row: object) => void,
 * }} props
 */
const BusinessLinkMobileCards = memo(({ rows, deletingId, onDelete }) => {
  const { t, i18n } = useTranslation();

  return (
    <div
      className="flex flex-col md:hidden"
      data-testid="business-link-mobile-cards"
    >
      {rows.map((row) => (
        <article
          key={row.id}
          className="border-b border-[#f1f5f9] px-4 py-4 last:border-b-0"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <UserAvatar
                src={row.avatar}
                name={row.name || row.email}
                className="size-10 text-[12px]"
              />
              <div className="min-w-0">
                <p className="truncate text-[15px] font-semibold leading-5 text-[#0f172a]">
                  {row.name || '—'}
                </p>
                <p className="mt-0.5 break-all text-[13px] leading-5 text-[#64748b]">
                  {row.email}
                </p>
              </div>
            </div>
            <BusinessLinkRowActions
              row={row}
              isDeleting={deletingId === row.id}
              onDelete={onDelete}
            />
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2 rounded-xl bg-[#f8fafc] p-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[12px] font-medium uppercase tracking-wide text-[#94a3b8]">
                {t('adminBusinessLink.columns.phone')}
              </span>
              <span className="text-right text-[13px] font-medium text-[#0f172a]">
                {row.phone || '—'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-[12px] font-medium uppercase tracking-wide text-[#94a3b8]">
                {t('adminBusinessLink.columns.country')}
              </span>
              <span className="text-right text-[13px] font-medium text-[#0f172a]">
                {row.country || '—'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-[12px] font-medium uppercase tracking-wide text-[#94a3b8]">
                {t('adminBusinessLink.columns.uploadDate')}
              </span>
              <span className="text-right text-[13px] font-medium text-[#0f172a]">
                {formatBusinessLinkDate(row.createdAt, i18n.language)}
              </span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
});

BusinessLinkMobileCards.displayName = 'BusinessLinkMobileCards';

const BusinessLinkTableSkeleton = () => (
  <div className="flex flex-col gap-0" aria-busy="true">
    <div className="hidden h-11 animate-pulse bg-[#f1f5f9] md:block" />
    {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
      <div
        key={index}
        className="flex items-center gap-3 border-b border-[#f1f5f9] px-4 py-4 last:border-b-0 sm:px-5"
      >
        <div className="size-9 shrink-0 animate-pulse rounded-full bg-[#e2e8f0]" />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="h-3.5 w-1/3 animate-pulse rounded bg-[#e2e8f0]" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-[#f1f5f9]" />
        </div>
      </div>
    ))}
  </div>
);

/**
 * Admin Business Link Photos — table aligned with Admin Users.
 */
const AdminBusinessLinkContent = memo(() => {
  const { t } = useTranslation();
  const {
    rows,
    isLoading,
    isError,
    isFetching,
    loadErrorMessage,
    refetch,
    range,
    isFirstPage,
    isLastPage,
    handlePreviousPage,
    handleNextPage,
    handleDelete,
    deletingId,
  } = useAdminBusinessLink();

  let body;
  if (isLoading) {
    body = <BusinessLinkTableSkeleton />;
  } else if (isError) {
    body = (
      <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
        <p className="text-[15px] font-medium text-[#ee1c25]">
          {loadErrorMessage}
        </p>
        <Button
          unstyled
          type="button"
          onClick={() => refetch()}
          className="cursor-pointer rounded-xl border border-[#4048cd] px-4 py-2 text-[14px] font-semibold text-[#4048cd] transition hover:bg-[#eff1fe]"
        >
          {t('adminBusinessLink.retry')}
        </Button>
      </div>
    );
  } else if (rows.length === 0) {
    body = (
      <p className="px-6 py-12 text-center text-[15px] text-[#64748b]">
        {t('adminBusinessLink.empty')}
      </p>
    );
  } else {
    body = (
      <>
        <BusinessLinkMobileCards
          rows={rows}
          deletingId={deletingId}
          onDelete={handleDelete}
        />
        <BusinessLinkTable
          rows={rows}
          deletingId={deletingId}
          onDelete={handleDelete}
        />
      </>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <AdminPageHeader
        title={t('adminBusinessLink.title')}
        description={t('adminBusinessLink.subtitle')}
      />

      <section
        aria-label={t('adminBusinessLink.tableAria')}
        aria-busy={isFetching}
        className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]"
      >
        <div
          className={`transition-opacity ${
            isFetching && !isLoading ? 'opacity-60' : ''
          }`}
        >
          {body}
        </div>

        {!isLoading && !isError ? (
          <div className="border-t border-[#e2e8f0] bg-[#f8fafc]/60">
            <AdminPagination
              variant="users"
              from={range.from}
              to={range.to}
              total={range.total}
              isFirstPage={isFirstPage || isFetching}
              isLastPage={isLastPage || isFetching}
              onPrevious={handlePreviousPage}
              onNext={handleNextPage}
              showingText={t('adminBusinessLink.pagination.showing', {
                from: range.from,
                to: range.to,
                total: range.total,
              })}
              previousLabel={t('adminBusinessLink.pagination.previous')}
              nextLabel={t('adminBusinessLink.pagination.next')}
            />
          </div>
        ) : null}
      </section>
    </div>
  );
});

AdminBusinessLinkContent.displayName = 'AdminBusinessLinkContent';

export default AdminBusinessLinkContent;
