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
} from '@/components/data-display/Table/Table';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import {
  ADMIN_BUSINESS_LINK_ASSETS,
  EYE_ICON_SIZE,
  formatBusinessLinkDate,
  getBusinessLinkDetailPath,
} from '@/portals/admin/data/adminBusinessLinkData';
import useAdminBusinessLink from '@/portals/admin/hooks/useAdminBusinessLink';
import { ROUTES } from '@/shared/config';

const SKELETON_ROW_COUNT = 5;

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
      className="inline-flex size-6 shrink-0 items-center justify-center rounded-md transition hover:bg-[#f6fbff]"
    >
      <Image
        src={ADMIN_BUSINESS_LINK_ASSETS.eye}
        alt=""
        width={EYE_ICON_SIZE}
        height={EYE_ICON_SIZE}
        className="size-6"
      />
    </Link>
  );
});

BusinessLinkViewLink.displayName = 'BusinessLinkViewLink';

/**
 * @param {{
 *   row: object,
 * }} props
 */
const BusinessLinkTableRow = memo(({ row }) => {
  const { i18n } = useTranslation();

  return (
    <TableRow>
      <TableCell>{row.name || '—'}</TableCell>
      <TableCell className="max-w-45 wrap-break-word">{row.email}</TableCell>
      <TableCell className="whitespace-nowrap">{row.phone || '—'}</TableCell>
      <TableCell>{row.country || '—'}</TableCell>
      <TableCell className="whitespace-nowrap">
        {formatBusinessLinkDate(row.createdAt, i18n.language)}
      </TableCell>
      <TableCell>
        <BusinessLinkViewLink row={row} />
      </TableCell>
    </TableRow>
  );
});

BusinessLinkTableRow.displayName = 'BusinessLinkTableRow';

/**
 * @param {{
 *   rows: object[],
 * }} props
 */
const BusinessLinkTable = memo(({ rows }) => {
  const { t } = useTranslation();

  return (
    <Table className="min-w-245" wrapperClassName="hidden md:block">
      <TableHeader>
        <TableRow isHeader>
          <TableHead className="rounded-tl-xl">
            {t('adminBusinessLink.columns.user')}
          </TableHead>
          <TableHead>{t('adminBusinessLink.columns.email')}</TableHead>
          <TableHead>{t('adminBusinessLink.columns.phone')}</TableHead>
          <TableHead>{t('adminBusinessLink.columns.country')}</TableHead>
          <TableHead>{t('adminBusinessLink.columns.uploadDate')}</TableHead>
          <TableHead className="rounded-tr-xl">
            {t('adminBusinessLink.columns.action')}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <BusinessLinkTableRow key={row.id} row={row} />
        ))}
      </TableBody>
    </Table>
  );
});

BusinessLinkTable.displayName = 'BusinessLinkTable';

/**
 * @param {{
 *   rows: object[],
 * }} props
 */
const BusinessLinkMobileCards = memo(({ rows }) => {
  const { t, i18n } = useTranslation();

  return (
    <ul
      className="flex flex-col md:hidden"
      data-testid="business-link-mobile-cards"
    >
      {rows.map((row) => (
        <li
          key={row.id}
          className="border-b border-[#e4e4e4] px-4 py-5 last:border-b-0"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[16px] font-medium leading-6 text-[#0c0c0c]">
                {row.name || '—'}
              </p>
              <p className="mt-1 wrap-break-word text-[14px] leading-5 text-[#687186]">
                {row.email}
              </p>
            </div>
            <BusinessLinkViewLink row={row} />
          </div>
          <dl className="mt-4 grid grid-cols-1 gap-2 text-[14px] leading-5 sm:grid-cols-2">
            <div>
              <dt className="text-[#8b95a5]">
                {t('adminBusinessLink.columns.phone')}
              </dt>
              <dd className="text-[#0c0c0c]">{row.phone || '—'}</dd>
            </div>
            <div>
              <dt className="text-[#8b95a5]">
                {t('adminBusinessLink.columns.country')}
              </dt>
              <dd className="text-[#0c0c0c]">{row.country || '—'}</dd>
            </div>
            <div>
              <dt className="text-[#8b95a5]">
                {t('adminBusinessLink.columns.uploadDate')}
              </dt>
              <dd className="text-[#0c0c0c]">
                {formatBusinessLinkDate(row.createdAt, i18n.language)}
              </dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  );
});

BusinessLinkMobileCards.displayName = 'BusinessLinkMobileCards';

const BusinessLinkTableSkeleton = () => (
  <div className="flex flex-col gap-3 px-5 py-6" aria-busy="true">
    {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
      <div
        key={index}
        className="h-12 w-full animate-pulse rounded-lg bg-[#f3f4f6]"
      />
    ))}
  </div>
);

/**
 * Admin Business Link Photos — Figma node 345:679.
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
  } = useAdminBusinessLink();

  let body;
  if (isLoading) {
    body = <BusinessLinkTableSkeleton />;
  } else if (isError) {
    body = (
      <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
        <p className="text-[16px] text-[#ee1c25]">{loadErrorMessage}</p>
        <Button
          unstyled
          type="button"
          onClick={() => refetch()}
          className="cursor-pointer rounded-xl border border-[#4048cd] px-4 py-2 text-[16px] font-medium text-[#4048cd] transition hover:bg-[#f6fbff]"
        >
          {t('adminBusinessLink.retry')}
        </Button>
      </div>
    );
  } else if (rows.length === 0) {
    body = (
      <p className="px-6 py-10 text-center text-[16px] text-[#687186]">
        {t('adminBusinessLink.empty')}
      </p>
    );
  } else {
    body = (
      <>
        <BusinessLinkMobileCards rows={rows} />
        <BusinessLinkTable rows={rows} />
      </>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6 py-2 sm:py-4">
      <AdminPageHeader
        title={t('adminBusinessLink.title')}
        description={t('adminBusinessLink.subtitle')}
      />

      <section
        aria-label={t('adminBusinessLink.tableAria')}
        aria-busy={isFetching}
        className="overflow-hidden rounded-xl bg-white"
      >
        <div
          className={`transition-opacity ${
            isFetching && !isLoading ? 'opacity-60' : ''
          }`}
        >
          {body}
        </div>

        {!isLoading && !isError && (
          <AdminPagination
            variant="businessLink"
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
            navAriaLabel={t('adminBusinessLink.pagination.aria')}
          />
        )}
      </section>
    </div>
  );
});

AdminBusinessLinkContent.displayName = 'AdminBusinessLinkContent';

export default AdminBusinessLinkContent;
