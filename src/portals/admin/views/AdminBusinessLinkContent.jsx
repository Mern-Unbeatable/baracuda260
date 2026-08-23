import { useTranslation } from 'react-i18next';
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/shared/config';
import {
  ADMIN_BUSINESS_LINK_ASSETS,
  EYE_ICON_SIZE,
  getBusinessLinkDetailPath,
} from '@/portals/admin/data/adminBusinessLinkData';
import useAdminBusinessLink from '@/portals/admin/hooks/useAdminBusinessLink';
import AdminPageHeader from '@/portals/admin/components/ui/AdminPageHeader';
import AdminPagination from '@/portals/admin/components/ui/AdminPagination';

/**
 * @param {{
 *   row: object,
 * }} props
 */
const BusinessLinkTableRow = memo(({ row }) => {
  const { t } = useTranslation();
  const detailPath = getBusinessLinkDetailPath(row.id, ROUTES.ADMIN_BUSINESS_PHOTOS_DETAIL);

  return (
    <tr className="border-b border-[#e4e4e4]">
      <td className="px-6.5 py-6 text-[16px] leading-6 text-[#0c0c0c]">{t(row.userKey)}</td>
      <td className="max-w-45 wrap-break-word px-6.5 py-6 text-[16px] leading-6 text-[#0c0c0c]">
        {row.email}
      </td>
      <td className="px-6.5 py-6 text-[16px] leading-6 whitespace-nowrap text-[#0c0c0c]">
        {row.phone}
      </td>
      <td className="px-6.5 py-6 text-[16px] leading-6 text-[#0c0c0c]">{t(row.countryKey)}</td>
      <td className="px-6.5 py-6 text-[16px] leading-6 whitespace-nowrap text-[#0c0c0c]">
        {row.uploadDate}
      </td>
      <td className="px-6.5 py-6">
        <Link
          to={detailPath}
          aria-label={t('adminBusinessLink.actions.view', { user: t(row.userKey) })}
          className="inline-flex size-6 items-center justify-center rounded-md transition hover:bg-[#f6fbff]"
        >
          <img
            src={ADMIN_BUSINESS_LINK_ASSETS.eye}
            alt=""
            width={EYE_ICON_SIZE}
            height={EYE_ICON_SIZE}
            className="size-6"
          />
        </Link>
      </td>
    </tr>
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
    <div className="hidden w-full overflow-x-auto md:block">
      <table className="w-full min-w-245 border-collapse text-left">
        <thead>
          <tr className="bg-[#f6fbff]">
            <th className="rounded-tl-xl px-6.5 py-3 text-[16px] font-normal leading-6 text-black">
              {t('adminBusinessLink.columns.user')}
            </th>
            <th className="px-6.5 py-3 text-[16px] font-normal leading-6 text-black">
              {t('adminBusinessLink.columns.email')}
            </th>
            <th className="px-6.5 py-3 text-[16px] font-normal leading-6 text-black">
              {t('adminBusinessLink.columns.phone')}
            </th>
            <th className="px-6.5 py-3 text-[16px] font-normal leading-6 text-black">
              {t('adminBusinessLink.columns.country')}
            </th>
            <th className="px-6.5 py-3 text-[16px] font-normal leading-6 text-black">
              {t('adminBusinessLink.columns.uploadDate')}
            </th>
            <th className="rounded-tr-xl px-6.5 py-3 text-[16px] font-normal leading-6 text-black">
              {t('adminBusinessLink.columns.action')}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <BusinessLinkTableRow key={row.id} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
});

BusinessLinkTable.displayName = 'BusinessLinkTable';

/**
 * @param {{
 *   rows: object[],
 * }} props
 */
const BusinessLinkMobileCards = memo(({ rows }) => {
  const { t } = useTranslation();

  return (
    <ul className="flex flex-col md:hidden" data-testid="business-link-mobile-cards">
      {rows.map((row) => {
        const detailPath = getBusinessLinkDetailPath(row.id, ROUTES.ADMIN_BUSINESS_PHOTOS_DETAIL);
        return (
          <li key={row.id} className="border-b border-[#e4e4e4] px-4 py-5 last:border-b-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[16px] font-medium leading-6 text-[#0c0c0c]">{t(row.userKey)}</p>
                <p className="mt-1 wrap-break-word text-[14px] leading-5 text-[#687186]">{row.email}</p>
              </div>
              <Link
                to={detailPath}
                aria-label={t('adminBusinessLink.actions.view', { user: t(row.userKey) })}
                className="inline-flex size-6 shrink-0 items-center justify-center rounded-md transition hover:bg-[#f6fbff]"
              >
                <img
                  src={ADMIN_BUSINESS_LINK_ASSETS.eye}
                  alt=""
                  width={EYE_ICON_SIZE}
                  height={EYE_ICON_SIZE}
                  className="size-6"
                />
              </Link>
            </div>
            <dl className="mt-4 grid grid-cols-1 gap-2 text-[14px] leading-5 sm:grid-cols-2">
              <div>
                <dt className="text-[#8b95a5]">{t('adminBusinessLink.columns.phone')}</dt>
                <dd className="text-[#0c0c0c]">{row.phone}</dd>
              </div>
              <div>
                <dt className="text-[#8b95a5]">{t('adminBusinessLink.columns.country')}</dt>
                <dd className="text-[#0c0c0c]">{t(row.countryKey)}</dd>
              </div>
              <div>
                <dt className="text-[#8b95a5]">{t('adminBusinessLink.columns.uploadDate')}</dt>
                <dd className="text-[#0c0c0c]">{row.uploadDate}</dd>
              </div>
            </dl>
          </li>
        );
      })}
    </ul>
  );
});

BusinessLinkMobileCards.displayName = 'BusinessLinkMobileCards';

/**
 * Admin Business Link Photos — Figma node 345:679.
 */
const AdminBusinessLinkContent = memo(() => {
  const { t } = useTranslation();
  const {
    visibleRows,
    range,
    isFirstPage,
    isLastPage,
    handlePreviousPage,
    handleNextPage,
  } = useAdminBusinessLink();

  return (
    <div className="flex w-full flex-col gap-6 py-2 sm:py-4">
      <AdminPageHeader
        title={t('adminBusinessLink.title')}
        description={t('adminBusinessLink.subtitle')}
      />

      <section
        aria-label={t('adminBusinessLink.tableAria')}
        className="overflow-hidden rounded-xl bg-white"
      >
        {visibleRows.length > 0 ? (
          <>
            <BusinessLinkMobileCards rows={visibleRows} />
            <BusinessLinkTable rows={visibleRows} />
          </>
        ) : (
          <p className="px-6 py-10 text-center text-[16px] text-[#687186]">
            {t('adminBusinessLink.empty')}
          </p>
        )}

        <AdminPagination
          variant="businessLink"
          from={range.from}
          to={range.to}
          total={range.total}
          isFirstPage={isFirstPage}
          isLastPage={isLastPage}
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
      </section>
    </div>
  );
});

AdminBusinessLinkContent.displayName = 'AdminBusinessLinkContent';

export default AdminBusinessLinkContent;
