import React, { memo } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  ADMIN_BUSINESS_LINK_ASSETS,
  EYE_ICON_SIZE,
} from './adminBusinessLinkData';
import useAdminBusinessLink from './useAdminBusinessLink';

/**
 * @param {{
 *   row: object,
 *   onView: (rowId: string) => void,
 * }} props
 */
const BusinessLinkTableRow = memo(({ row, onView }) => {
  const { t } = useTranslation();

  return (
    <tr className="border-b border-[#e4e4e4]">
      <td className="px-[26px] py-6 text-[16px] leading-6 text-[#0c0c0c]">{t(row.userKey)}</td>
      <td className="max-w-[180px] break-words px-[26px] py-6 text-[16px] leading-6 text-[#0c0c0c]">
        {row.email}
      </td>
      <td className="px-[26px] py-6 text-[16px] leading-6 whitespace-nowrap text-[#0c0c0c]">
        {row.phone}
      </td>
      <td className="px-[26px] py-6 text-[16px] leading-6 text-[#0c0c0c]">{t(row.countryKey)}</td>
      <td className="px-[26px] py-6 text-[16px] leading-6 whitespace-nowrap text-[#0c0c0c]">
        {row.uploadDate}
      </td>
      <td className="px-[26px] py-6">
        <button
          type="button"
          aria-label={t('adminBusinessLink.actions.view', { user: t(row.userKey) })}
          onClick={() => onView(row.id)}
          className="inline-flex size-6 cursor-pointer items-center justify-center rounded-[6px] transition hover:bg-[#f6fbff]"
        >
          <img
            src={ADMIN_BUSINESS_LINK_ASSETS.eye}
            alt=""
            width={EYE_ICON_SIZE}
            height={EYE_ICON_SIZE}
            className="size-6"
          />
        </button>
      </td>
    </tr>
  );
});

BusinessLinkTableRow.displayName = 'BusinessLinkTableRow';

/**
 * @param {{
 *   rows: object[],
 *   onView: (rowId: string) => void,
 * }} props
 */
const BusinessLinkTable = memo(({ rows, onView }) => {
  const { t } = useTranslation();

  return (
    <div className="hidden w-full overflow-x-auto md:block">
      <table className="w-full min-w-[980px] border-collapse text-left">
        <thead>
          <tr className="bg-[#f6fbff]">
            <th className="rounded-tl-[12px] px-[26px] py-3 text-[16px] font-normal leading-6 text-black">
              {t('adminBusinessLink.columns.user')}
            </th>
            <th className="px-[26px] py-3 text-[16px] font-normal leading-6 text-black">
              {t('adminBusinessLink.columns.email')}
            </th>
            <th className="px-[26px] py-3 text-[16px] font-normal leading-6 text-black">
              {t('adminBusinessLink.columns.phone')}
            </th>
            <th className="px-[26px] py-3 text-[16px] font-normal leading-6 text-black">
              {t('adminBusinessLink.columns.country')}
            </th>
            <th className="px-[26px] py-3 text-[16px] font-normal leading-6 text-black">
              {t('adminBusinessLink.columns.uploadDate')}
            </th>
            <th className="rounded-tr-[12px] px-[26px] py-3 text-[16px] font-normal leading-6 text-black">
              {t('adminBusinessLink.columns.action')}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <BusinessLinkTableRow key={row.id} row={row} onView={onView} />
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
 *   onView: (rowId: string) => void,
 * }} props
 */
const BusinessLinkMobileCards = memo(({ rows, onView }) => {
  const { t } = useTranslation();

  return (
    <ul className="flex flex-col md:hidden" data-testid="business-link-mobile-cards">
      {rows.map((row) => (
        <li key={row.id} className="border-b border-[#e4e4e4] px-4 py-5 last:border-b-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[16px] font-medium leading-6 text-[#0c0c0c]">{t(row.userKey)}</p>
              <p className="mt-1 break-words text-[14px] leading-5 text-[#687186]">{row.email}</p>
            </div>
            <button
              type="button"
              aria-label={t('adminBusinessLink.actions.view', { user: t(row.userKey) })}
              onClick={() => onView(row.id)}
              className="inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-[6px] transition hover:bg-[#f6fbff]"
            >
              <img
                src={ADMIN_BUSINESS_LINK_ASSETS.eye}
                alt=""
                width={EYE_ICON_SIZE}
                height={EYE_ICON_SIZE}
                className="size-6"
              />
            </button>
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
      ))}
    </ul>
  );
});

BusinessLinkMobileCards.displayName = 'BusinessLinkMobileCards';

/**
 * @param {{
 *   from: number,
 *   to: number,
 *   total: number,
 *   isFirstPage: boolean,
 *   isLastPage: boolean,
 *   onPrevious: () => void,
 *   onNext: () => void,
 * }} props
 */
const BusinessLinkPagination = memo(
  ({ from, to, total, isFirstPage, isLastPage, onPrevious, onNext }) => {
    const { t } = useTranslation();
    const btnClass =
      'inline-flex cursor-pointer items-center justify-center rounded-[12px] border border-[#4048cd] px-4 py-2 text-[16px] font-medium capitalize text-[#4048cd] transition hover:bg-[#f6fbff] disabled:cursor-not-allowed disabled:opacity-40';

    return (
      <div className="flex flex-col items-center gap-3 px-4 py-5 sm:flex-row sm:justify-between sm:px-4">
        <p className="text-center text-[16px] leading-normal text-[#4048cd] sm:text-left">
          {t('adminBusinessLink.pagination.showing', { from, to, total })}
        </p>
        <div
          className="flex items-center justify-center gap-2"
          role="navigation"
          aria-label={t('adminBusinessLink.pagination.aria')}
        >
          <button
            type="button"
            disabled={isFirstPage}
            onClick={onPrevious}
            className={btnClass}
          >
            {t('adminBusinessLink.pagination.previous')}
          </button>
          <button type="button" disabled={isLastPage} onClick={onNext} className={btnClass}>
            {t('adminBusinessLink.pagination.next')}
          </button>
        </div>
      </div>
    );
  },
);

BusinessLinkPagination.displayName = 'BusinessLinkPagination';

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
    handleViewRow,
  } = useAdminBusinessLink();

  const onView = (rowId) => {
    handleViewRow(rowId);
    const row = visibleRows.find((item) => item.id === rowId);
    if (row) {
      toast.success(t('adminBusinessLink.actions.viewToast', { user: t(row.userKey) }));
    }
  };

  return (
    <div className="flex w-full flex-col gap-6 py-2 sm:py-4">
      <header className="flex flex-col gap-1">
        <h1 className="font-manrope pt-3 text-[28px] font-medium leading-[36px] text-[#151e31] sm:text-[36px] sm:leading-[42px]">
          {t('adminBusinessLink.title')}
        </h1>
        <p className="max-w-[40rem] pt-3 text-[15px] leading-6 text-[#687186] sm:text-[16px] sm:leading-[25px]">
          {t('adminBusinessLink.subtitle')}
        </p>
      </header>

      <section
        aria-label={t('adminBusinessLink.tableAria')}
        className="overflow-hidden rounded-[12px] bg-white"
      >
        {visibleRows.length > 0 ? (
          <>
            <BusinessLinkMobileCards rows={visibleRows} onView={onView} />
            <BusinessLinkTable rows={visibleRows} onView={onView} />
          </>
        ) : (
          <p className="px-6 py-10 text-center text-[16px] text-[#687186]">
            {t('adminBusinessLink.empty')}
          </p>
        )}

        <BusinessLinkPagination
          from={range.from}
          to={range.to}
          total={range.total}
          isFirstPage={isFirstPage}
          isLastPage={isLastPage}
          onPrevious={handlePreviousPage}
          onNext={handleNextPage}
        />
      </section>
    </div>
  );
});

AdminBusinessLinkContent.displayName = 'AdminBusinessLinkContent';

export default AdminBusinessLinkContent;
