import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronDown, Download, Loader2, Search } from 'lucide-react';
import React, { memo, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/data-display/Table/Table';
import FilterPillGroup from '@/components/marketing/FilterPillGroup/FilterPillGroup';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import Input from '@/components/ui/Input';
import RequestPayoutModal from '@/portals/member/components/RequestPayoutModal';
import {
  DONATION_TRANSACTION_ROWS,
  DONATIONS_SUMMARY,
  PAYMENT_HISTORY_ROWS,
  PHOTO_SALES_ROWS,
  PHOTO_SALES_STATUS_FILTERS,
  PHOTO_SALES_SUMMARY,
  PRIZE_MONEY_SUMMARY,
  PRIZE_PAYMENTS_TABS,
  PRIZING_ROWS,
  STORE_SALES_SUMMARY,
} from '@/portals/member/data/prizePaymentsData';
import {
  exportUserPhotoSalesCsvApi,
  exportUserStoreSalesCsvApi,
  formatPrizeAmount,
  getUserDonationsApi,
  getUserPaymentHistoryApi,
  getUserPhotoSalesApi,
  getUserPrizeMoneyApi,
  getUserStoreSalesApi,
  USER_DONATIONS_QUERY_KEY,
  USER_PAYMENT_HISTORY_QUERY_KEY,
  USER_PHOTO_SALES_QUERY_KEY,
  USER_PRIZE_MONEY_QUERY_KEY,
  USER_STORE_SALES_QUERY_KEY,
} from '@/shared/api/payments.api';

const CARD_SHADOW = 'shadow-[0px_4px_20px_-2px_rgba(83,42,168,0.04)]';

const PAGINATION_TONES = {
  red: {
    text: 'text-[#ee1c25]',
    border: 'border-[#ee1c25]',
  },
  orange: {
    text: 'text-[#d97706]',
    border: 'border-[#d97706]',
  },
};

const POSITION_LABELS = {
  FIRST: '1st',
  SECOND: '2nd',
  THIRD: '3rd',
  FOURTH: '4th',
  FIFTH: '5th',
  1: '1st',
  2: '2nd',
  3: '3rd',
  4: '4th',
  5: '5th',
};

const formatPosition = (pos, fallbackKey, t) => {
  if (!pos) return fallbackKey ? t(fallbackKey) : '-';
  const norm = String(pos).trim().toUpperCase();
  if (POSITION_LABELS[norm]) return POSITION_LABELS[norm];
  if (fallbackKey) return t(fallbackKey);
  return pos;
};

const formatTransactionDate = (rawDate, fallbackKey, t) => {
  if (rawDate) {
    try {
      const d = new Date(rawDate);
      if (!Number.isNaN(d.getTime())) {
        return d.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      }
    } catch {
      // fallback
    }
  }
  return fallbackKey ? t(fallbackKey) : String(rawDate || '-');
};

const TablePagination = memo(
  ({
    showingKey,
    tone = 'red',
    currentPage = 1,
    totalPages = 1,
    totalRecords,
    pageSize = 10,
    onPageChange,
    loading = false,
  }) => {
    const { t } = useTranslation();
    const colors = PAGINATION_TONES[tone] ?? PAGINATION_TONES.red;

    let showingText;
    if (typeof totalRecords === 'number') {
      if (totalRecords === 0) {
        showingText = t(
          'prizePayments.pagination.showingEmpty',
          'Showing 0 results',
        );
      } else {
        const start = (currentPage - 1) * pageSize + 1;
        const end = Math.min(currentPage * pageSize, totalRecords);
        showingText = t('prizePayments.pagination.showingRange', {
          start,
          end,
          total: totalRecords,
          defaultValue: `Showing ${start} to ${end} of ${totalRecords} results`,
        });
      }
    } else {
      showingText = t(showingKey);
    }

    const canPrev = currentPage > 1 && !loading;
    const canNext = currentPage < totalPages && !loading;

    return (
      <div className="flex min-h-16.75 w-full flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-0">
        <p className={`px-2.5 text-[16px] leading-normal ${colors.text}`}>
          {showingText}
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            type="button"
            unstyled={true}
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={!canPrev}
            className={`rounded-xl border px-4 py-2 text-[16px] font-medium capitalize leading-normal transition ${
              !canPrev
                ? 'cursor-not-allowed border-gray-200 text-gray-400 opacity-50'
                : `${colors.border} ${colors.text} hover:bg-black/5`
            }`}
          >
            {t('prizePayments.pagination.previous')}
          </Button>
          <Button
            type="button"
            unstyled={true}
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={!canNext}
            className={`rounded-xl border px-4 py-2 text-[16px] font-medium capitalize leading-normal transition ${
              !canNext
                ? 'cursor-not-allowed border-gray-200 text-gray-400 opacity-50'
                : `${colors.border} ${colors.text} hover:bg-black/5`
            }`}
          >
            {t('prizePayments.pagination.next')}
          </Button>
        </div>
      </div>
    );
  },
);

TablePagination.displayName = 'TablePagination';

const SummaryCard = memo(({ card, dynamicValue }) => {
  const { t } = useTranslation();
  const displayValue = dynamicValue != null ? dynamicValue : t(card.valueKey);

  return (
    <article
      className={`flex h-full w-full min-w-0 flex-col gap-2 rounded-2xl border border-[#e2e8f0] bg-white p-6 ${CARD_SHADOW}`}
    >
      <p className="text-[12px] font-bold uppercase leading-4 tracking-[0.6px] text-[#7a7484]">
        {t(card.labelKey)}
      </p>
      <p
        className={`text-[32px] font-semibold leading-10 tracking-[-0.75px] sm:text-[36px] sm:leading-11 ${card.valueClass}`}
      >
        {displayValue}
      </p>
      <p className="text-[14px] leading-5 text-[#7a7484]">{t(card.hintKey)}</p>
    </article>
  );
});

SummaryCard.displayName = 'SummaryCard';

const StatusText = memo(({ status }) => {
  const { t } = useTranslation();
  const norm = String(status || '').toLowerCase();
  const isApproved = norm === 'approved' || norm === 'paid';
  const isAvailable = norm === 'available';
  const isPending = norm === 'pending';

  if (isAvailable) {
    return (
      <span className="inline-flex items-center gap-2 text-[14px] font-medium text-[#15803d]">
        <span
          className="size-2 shrink-0 rounded-full bg-[#15803d]"
          aria-hidden="true"
        />
        {t('prizePayments.status.available', 'Available')}
      </span>
    );
  }

  if (isPending) {
    return (
      <span className="inline-flex items-center gap-2 text-[14px] font-medium text-[#ea580c]">
        <span
          className="size-2 shrink-0 rounded-full bg-[#ea580c]"
          aria-hidden="true"
        />
        {status || t('prizePayments.status.pending', 'Pending')}
      </span>
    );
  }

  return (
    <span
      className={`text-[14px] font-medium ${isApproved ? 'text-[#15803d]' : 'text-[#7a7484]'}`}
    >
      {status || t(`prizePayments.status.${norm}`, norm)}
    </span>
  );
});

StatusText.displayName = 'StatusText';

const PrizingTable = memo(({ data, isLoading, page = 1, onPageChange }) => {
  const { t } = useTranslation();
  const apiList = data?.list?.data;
  const meta = data?.list?.meta;
  const isLoadedFromApi = Array.isArray(apiList);
  const rows = isLoadedFromApi ? apiList : PRIZING_ROWS;

  return (
    <section
      aria-labelledby="prize-payments-prizing-heading"
      className="mb-8 overflow-hidden rounded-xl border border-[#e2e8f0] bg-white"
    >
      <div className="flex items-center justify-between border-b border-[#ececf0] px-6 py-5">
        <h2
          id="prize-payments-prizing-heading"
          className="text-[22px] font-bold leading-8 text-[#161c27]"
        >
          {t('prizePayments.prizing.title')}
        </h2>
        {isLoading && (
          <span className="flex items-center gap-2 text-[14px] text-[#7a7484]">
            <Loader2 size={16} className="animate-spin text-[#ee1c25]" />
            <span>{t('common.loading', 'Loading...')}</span>
          </span>
        )}
      </div>

      <Table className="min-w-240">
        <TableHeader>
          <TableRow isHeader>
            <TableHead className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#7a7484]">
              {t('prizePayments.prizing.columns.month')}
            </TableHead>
            <TableHead className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#7a7484]">
              {t('prizePayments.prizing.columns.name')}
            </TableHead>
            <TableHead className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#7a7484]">
              {t('prizePayments.prizing.columns.category')}
            </TableHead>
            <TableHead className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#7a7484]">
              {t('prizePayments.prizing.columns.albumType')}
            </TableHead>
            <TableHead className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#7a7484]">
              {t('prizePayments.prizing.columns.position')}
            </TableHead>
            <TableHead className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#7a7484]">
              {t('prizePayments.prizing.columns.votes')}
            </TableHead>
            <TableHead className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#7a7484]">
              {t('prizePayments.prizing.columns.prize')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="py-12 text-center text-[15px] text-[#7a7484]"
              >
                {t('prizePayments.prizing.empty', 'No prize records found.')}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => {
              const month =
                row.monthName ||
                row.month ||
                (row.monthKey ? t(row.monthKey) : '-');
              const compName =
                row.competitionName ||
                (row.competitionKey ? t(row.competitionKey) : '-');
              const category =
                row.category || (row.categoryKey ? t(row.categoryKey) : '-');
              const albumType =
                row.albumType || (row.albumTypeKey ? t(row.albumTypeKey) : '-');
              const position = formatPosition(row.position, row.positionKey, t);
              const votes =
                typeof row.totalVote === 'number'
                  ? row.totalVote.toLocaleString('en-US')
                  : row.votes || '0';
              const prize =
                typeof row.prizeMoney === 'number'
                  ? formatPrizeAmount(row.prizeMoney)
                  : row.prize || '$0.00';

              return (
                <TableRow key={row.id}>
                  <TableCell className="py-5 text-[14px] leading-5 text-[#0c0c0c] sm:text-[15px]">
                    {month}
                  </TableCell>
                  <TableCell className="py-5 text-[14px] leading-5 text-[#0c0c0c] sm:text-[15px]">
                    {compName}
                  </TableCell>
                  <TableCell className="py-5 text-[14px] leading-5 text-[#0c0c0c] sm:text-[15px]">
                    {category}
                  </TableCell>
                  <TableCell className="py-5 text-[14px] leading-5 text-[#0c0c0c] sm:text-[15px]">
                    {albumType}
                  </TableCell>
                  <TableCell className="py-5 text-[14px] leading-5 text-[#0c0c0c] sm:text-[15px]">
                    {position}
                  </TableCell>
                  <TableCell className="py-5 text-[14px] leading-5 text-[#0c0c0c] sm:text-[15px]">
                    {votes}
                  </TableCell>
                  <TableCell className="py-5 text-[14px] leading-5 text-[#0c0c0c] sm:text-[15px]">
                    {prize}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <TablePagination
        showingKey="prizePayments.prizing.showing"
        tone="red"
        currentPage={meta?.currentPage ?? page}
        totalPages={meta?.totalPages ?? 1}
        totalRecords={meta?.totalRecords}
        pageSize={10}
        onPageChange={onPageChange}
        loading={isLoading}
      />
    </section>
  );
});

PrizingTable.displayName = 'PrizingTable';

const DonationsTable = memo(({ data, isLoading, page = 1, onPageChange }) => {
  const { t } = useTranslation();
  const apiList = data?.list?.data;
  const meta = data?.list?.meta;
  const isLoadedFromApi = Array.isArray(apiList);
  const rows = isLoadedFromApi ? apiList : DONATION_TRANSACTION_ROWS;

  return (
    <section
      aria-labelledby="prize-payments-donations-heading"
      className="mb-8 overflow-hidden rounded-xl border border-[#e2e8f0] bg-white"
    >
      <div className="flex items-center justify-between border-b border-[#ececf0] px-6 py-5">
        <div>
          <h2
            id="prize-payments-donations-heading"
            className="text-[22px] font-bold leading-8 text-[#161c27]"
          >
            {t('prizePayments.donations.title')}
          </h2>
          <p className="mt-1 text-[14px] leading-5 text-[#7a7484]">
            {t('prizePayments.donations.subtitle')}
          </p>
        </div>
        {isLoading && (
          <span className="flex items-center gap-2 text-[14px] text-[#7a7484]">
            <Loader2 size={16} className="animate-spin text-[#ee1c25]" />
            <span>{t('common.loading', 'Loading...')}</span>
          </span>
        )}
      </div>

      <Table className="min-w-240">
        <TableHeader>
          <TableRow isHeader>
            <TableHead className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#7a7484]">
              {t('prizePayments.donations.columns.date')}
            </TableHead>
            <TableHead className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#7a7484]">
              {t('prizePayments.donations.columns.donor')}
            </TableHead>
            <TableHead className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#7a7484]">
              {t('prizePayments.donations.columns.email')}
            </TableHead>
            <TableHead className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#7a7484]">
              {t('prizePayments.donations.columns.donation')}
            </TableHead>
            <TableHead className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#7a7484]">
              {t('prizePayments.donations.columns.platformFee')}
            </TableHead>
            <TableHead className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#7a7484]">
              {t('prizePayments.donations.columns.yourEarnings')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="py-12 text-center text-[15px] text-[#7a7484]"
              >
                {t(
                  'prizePayments.donations.empty',
                  'No donation records found.',
                )}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => {
              const date = formatTransactionDate(row.date, row.dateKey, t);
              const donor =
                row.donorName || (row.donorKey ? t(row.donorKey) : 'Anonymous');
              const email = row.email || '-';
              const donation =
                typeof row.donation === 'number'
                  ? formatPrizeAmount(row.donation)
                  : row.donation;
              const platformFee =
                typeof row.platformFee === 'number'
                  ? formatPrizeAmount(row.platformFee)
                  : row.platformFee;
              const yourEarnings =
                typeof row.yourEarnings === 'number'
                  ? formatPrizeAmount(row.yourEarnings)
                  : row.yourEarnings;

              return (
                <TableRow key={row.id}>
                  <TableCell className="py-5 text-[14px] leading-5 text-[#0c0c0c] sm:text-[15px]">
                    {date}
                  </TableCell>
                  <TableCell className="py-5 text-[14px] leading-5 text-[#0c0c0c] sm:text-[15px]">
                    {donor}
                  </TableCell>
                  <TableCell className="py-5 text-[14px] leading-5 text-[#0c0c0c] sm:text-[15px]">
                    {email}
                  </TableCell>
                  <TableCell className="py-5 text-[14px] leading-5 text-[#0c0c0c] sm:text-[15px]">
                    {donation}
                  </TableCell>
                  <TableCell className="py-5 text-[14px] leading-5 text-[#0c0c0c] sm:text-[15px]">
                    {platformFee}
                  </TableCell>
                  <TableCell className="py-5 text-[14px] leading-5 text-[#0c0c0c] sm:text-[15px]">
                    {yourEarnings}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <TablePagination
        showingKey="prizePayments.donations.showing"
        tone="red"
        currentPage={meta?.currentPage ?? page}
        totalPages={meta?.totalPages ?? 1}
        totalRecords={meta?.totalRecords}
        pageSize={10}
        onPageChange={onPageChange}
        loading={isLoading}
      />
    </section>
  );
});

DonationsTable.displayName = 'DonationsTable';

const PhotoSalesTable = memo(
  ({
    data,
    isLoading,
    page = 1,
    onPageChange,
    search = '',
    onSearchChange,
    statusFilter = 'all',
    onStatusFilterChange,
    onRequestPayout,
    onExport,
    isExporting = false,
  }) => {
    const { t } = useTranslation();
    const apiList = data?.list?.data;
    const meta = data?.list?.meta;
    const isLoadedFromApi = Array.isArray(apiList);
    const rows = isLoadedFromApi ? apiList : PHOTO_SALES_ROWS;

    const filteredRows = useMemo(() => {
      if (statusFilter === 'all') return rows;
      return rows.filter((row) => {
        const s = String(row.status || '').toLowerCase();
        return s === statusFilter.toLowerCase();
      });
    }, [rows, statusFilter]);

    return (
      <section
        aria-labelledby="prize-payments-photo-sales-heading"
        className="mb-8 overflow-hidden rounded-xl border border-[#e2e8f0] bg-white"
      >
        <div className="flex flex-col gap-4 border-b border-[#ececf0] px-6 py-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-center gap-3">
            <h2
              id="prize-payments-photo-sales-heading"
              className="text-[22px] font-bold leading-8 text-[#161c27]"
            >
              {t('prizePayments.photoSales.title')}
            </h2>
            {isLoading && (
              <span className="flex items-center gap-2 text-[14px] text-[#7a7484]">
                <Loader2 size={16} className="animate-spin text-[#ee1c25]" />
                <span>{t('common.loading', 'Loading...')}</span>
              </span>
            )}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <label className="relative min-w-55 flex-1">
              <span className="sr-only">
                {t('prizePayments.photoSales.searchPlaceholder')}
              </span>
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af] z-10"
                aria-hidden="true"
              />
              <Input
                type="search"
                value={search}
                onInput={(event) => onSearchChange?.(event.target.value)}
                placeholder={t('prizePayments.photoSales.searchPlaceholder')}
                inputClassName="w-full rounded-[10px] border border-[#e2e8f0] py-2.5 pl-9 pr-3 text-[14px] text-[#161c27] outline-none focus:border-[#4048cd]"
                labelClassName="hidden"
              />
            </label>
            <Button
              type="button"
              unstyled={true}
              onClick={onRequestPayout}
              className="inline-flex shrink-0 items-center justify-center rounded-[10px] bg-[#161c27] px-4 py-2.5 text-[14px] font-semibold text-white transition hover:bg-black/90"
            >
              {t('prizePayments.requestPayout')}
            </Button>
            <Button
              type="button"
              unstyled={true}
              onClick={onExport}
              disabled={isExporting}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-[10px] border border-[#e2e8f0] px-4 py-2.5 text-[14px] font-medium text-[#161c27] transition hover:bg-black/5 disabled:opacity-50"
            >
              {isExporting ? (
                <Loader2 size={16} className="animate-spin text-[#161c27]" />
              ) : (
                <>
                  {t('prizePayments.photoSales.export')}
                  <Download size={16} aria-hidden="true" />
                </>
              )}
            </Button>
            <label className="relative min-w-35">
              <span className="sr-only">
                {t('prizePayments.photoSales.filters.allStatuses')}
              </span>
              <select
                value={statusFilter}
                onChange={(event) => onStatusFilterChange?.(event.target.value)}
                className="w-full appearance-none rounded-[10px] border border-[#e2e8f0] py-2.5 pl-3 pr-9 text-[14px] text-[#161c27] outline-none focus:border-[#4048cd]"
              >
                {PHOTO_SALES_STATUS_FILTERS.map((filter) => (
                  <option key={filter.value} value={filter.value}>
                    {t(filter.labelKey)}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7a7484]"
                aria-hidden="true"
              />
            </label>
          </div>
        </div>

        <Table className="min-w-275">
          <TableHeader>
            <TableRow isHeader>
              <TableHead className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#7a7484]">
                {t('prizePayments.photoSales.columns.date')}
              </TableHead>
              <TableHead className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#7a7484]">
                {t('prizePayments.photoSales.columns.buyer')}
              </TableHead>
              <TableHead className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#7a7484]">
                {t('prizePayments.photoSales.columns.email')}
              </TableHead>
              <TableHead className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#7a7484]">
                {t('prizePayments.photoSales.columns.photo')}
              </TableHead>
              <TableHead className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#7a7484]">
                {t('prizePayments.photoSales.columns.salePrice')}
              </TableHead>
              <TableHead className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#7a7484]">
                {t('prizePayments.photoSales.columns.yourEarnings')}
              </TableHead>
              <TableHead className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#7a7484]">
                {t('prizePayments.photoSales.columns.action')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-12 text-center text-[15px] text-[#7a7484]"
                >
                  {t(
                    'prizePayments.photoSales.empty',
                    'No photo sales records found.',
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filteredRows.map((row) => {
                const date = formatTransactionDate(row.date, row.dateKey, t);
                const buyer =
                  row.buyer || (row.buyerKey ? t(row.buyerKey) : '-');
                const email = row.email || '-';
                const photoTitle =
                  row.photo || (row.photoKey ? t(row.photoKey) : '-');
                const photoThumbnail = row.photoUrl || row.image;
                const salePrice =
                  typeof row.salePrice === 'number'
                    ? formatPrizeAmount(row.salePrice)
                    : row.salePrice;
                const yourEarnings =
                  typeof row.yourEarnings === 'number'
                    ? formatPrizeAmount(row.yourEarnings)
                    : row.yourEarnings;

                return (
                  <TableRow key={row.id}>
                    <TableCell className="py-5 text-[14px] leading-5 text-[#0c0c0c] sm:text-[15px]">
                      {date}
                    </TableCell>
                    <TableCell className="py-5 text-[14px] leading-5 text-[#0c0c0c] sm:text-[15px]">
                      {buyer}
                    </TableCell>
                    <TableCell className="py-5 text-[14px] leading-5 text-[#0c0c0c] sm:text-[15px]">
                      {email}
                    </TableCell>
                    <TableCell className="py-5 text-[14px] leading-5 text-[#0c0c0c] sm:text-[15px]">
                      <span className="inline-flex items-center gap-3">
                        {photoThumbnail && (
                          <Image
                            src={photoThumbnail}
                            alt=""
                            width={40}
                            height={40}
                            className="size-10 shrink-0 rounded-md object-cover"
                          />
                        )}
                        <span>{photoTitle}</span>
                      </span>
                    </TableCell>
                    <TableCell className="py-5 text-[14px] leading-5 text-[#0c0c0c] sm:text-[15px]">
                      {salePrice}
                    </TableCell>
                    <TableCell className="py-5 text-[14px] leading-5 text-[#0c0c0c] sm:text-[15px]">
                      {yourEarnings}
                    </TableCell>
                    <TableCell className="py-5 text-[14px] leading-5 text-[#0c0c0c] sm:text-[15px]">
                      {row.premiumPhotoId ? (
                        <Link
                          to={`/buy-photos/${row.premiumPhotoId}`}
                          className="text-[14px] font-medium text-[#4048cd] hover:underline"
                        >
                          {t('prizePayments.photoSales.details')}
                        </Link>
                      ) : (
                        <Button
                          unstyled
                          type="button"
                          className="text-[14px] font-medium text-[#4048cd] hover:underline"
                        >
                          {t('prizePayments.photoSales.details')}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        <TablePagination
          showingKey="prizePayments.photoSales.showing"
          tone="red"
          currentPage={meta?.currentPage ?? page}
          totalPages={meta?.totalPages ?? 1}
          totalRecords={meta?.totalRecords}
          pageSize={10}
          onPageChange={onPageChange}
          loading={isLoading}
        />
      </section>
    );
  },
);

PhotoSalesTable.displayName = 'PhotoSalesTable';

const StoreSalesTable = memo(
  ({
    data,
    isLoading,
    page = 1,
    onPageChange,
    onRequestPayout,
    onExport,
    isExporting = false,
  }) => {
    const { t } = useTranslation();
    const apiList = data?.list?.data;
    const meta = data?.list?.meta;
    const isLoadedFromApi = Array.isArray(apiList);
    const rows = isLoadedFromApi ? apiList : [];

    return (
      <section
        aria-labelledby="prize-payments-store-sales-heading"
        className="mb-8 overflow-hidden rounded-xl border border-[#e2e8f0] bg-white"
      >
        <div className="flex flex-col gap-4 border-b border-[#ececf0] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <h2
              id="prize-payments-store-sales-heading"
              className="text-[22px] font-bold leading-8 text-[#161c27]"
            >
              {t('prizePayments.storeSales.title', 'Store Sales')}
            </h2>
            {isLoading && (
              <span className="flex items-center gap-2 text-[14px] text-[#7a7484]">
                <Loader2 size={16} className="animate-spin text-[#ee1c25]" />
                <span>{t('common.loading', 'Loading...')}</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              unstyled={true}
              onClick={onRequestPayout}
              className="inline-flex shrink-0 items-center justify-center rounded-[10px] bg-[#161c27] px-4 py-2.5 text-[14px] font-semibold text-white transition hover:bg-black/90"
            >
              {t('prizePayments.requestPayout')}
            </Button>
            <Button
              type="button"
              unstyled={true}
              onClick={onExport}
              disabled={isExporting}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-[10px] border border-[#e2e8f0] px-4 py-2.5 text-[14px] font-medium text-[#161c27] transition hover:bg-black/5 disabled:opacity-50"
            >
              {isExporting ? (
                <Loader2 size={16} className="animate-spin text-[#161c27]" />
              ) : (
                <>
                  {t('prizePayments.storeSales.export', 'Export')}
                  <Download size={16} aria-hidden="true" />
                </>
              )}
            </Button>
          </div>
        </div>

        <Table className="min-w-225">
          <TableHeader>
            <TableRow isHeader>
              <TableHead className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#7a7484]">
                {t('prizePayments.storeSales.columns.date', 'Date')}
              </TableHead>
              <TableHead className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#7a7484]">
                {t('prizePayments.storeSales.columns.buyer', 'Buyer')}
              </TableHead>
              <TableHead className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#7a7484]">
                {t('prizePayments.storeSales.columns.email', 'Email')}
              </TableHead>
              <TableHead className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#7a7484]">
                {t('prizePayments.storeSales.columns.product', 'Product')}
              </TableHead>
              <TableHead className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#7a7484]">
                {t('prizePayments.storeSales.columns.quantity', 'Quantity')}
              </TableHead>
              <TableHead className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#7a7484]">
                {t('prizePayments.storeSales.columns.salePrice', 'Sale Price')}
              </TableHead>
              <TableHead className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#7a7484]">
                {t(
                  'prizePayments.storeSales.columns.yourEarnings',
                  'Your Earnings',
                )}
              </TableHead>
              <TableHead className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#7a7484]">
                {t('prizePayments.storeSales.columns.action', 'Action')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-12 text-center text-[15px] text-[#7a7484]"
                >
                  {t('prizePayments.storeSales.empty', 'No store sales found.')}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => {
                const date = formatTransactionDate(row.date, row.dateKey, t);
                const salePrice =
                  typeof row.salePrice === 'number'
                    ? formatPrizeAmount(row.salePrice)
                    : row.salePrice || '$0.00';
                const yourEarnings =
                  typeof row.yourEarnings === 'number'
                    ? formatPrizeAmount(row.yourEarnings)
                    : row.yourEarnings || '$0.00';

                return (
                  <TableRow
                    key={row.id || index}
                    className={index % 2 === 0 ? 'bg-[#fff5f5]' : 'bg-white'}
                  >
                    <TableCell className="py-5 text-[14px] leading-5 text-[#0c0c0c] sm:text-[15px]">
                      {date}
                    </TableCell>
                    <TableCell className="py-5 text-[14px] leading-5 text-[#0c0c0c] sm:text-[15px]">
                      {row.buyer || '-'}
                    </TableCell>
                    <TableCell className="py-5 text-[14px] leading-5 text-[#0c0c0c] sm:text-[15px]">
                      {row.email || '-'}
                    </TableCell>
                    <TableCell className="py-5 text-[14px] leading-5 text-[#0c0c0c] sm:text-[15px]">
                      <div className="flex items-center gap-3">
                        {row.photoUrl ? (
                          <Image
                            src={row.photoUrl}
                            alt={row.photo || 'Product'}
                            className="size-10 rounded-lg object-cover shrink-0"
                          />
                        ) : null}
                        <span className="font-medium line-clamp-1 max-w-[200px]">
                          {row.photo || '-'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-5 text-[14px] leading-5 text-[#0c0c0c] sm:text-[15px]">
                      {row.quantity ?? 1}
                    </TableCell>
                    <TableCell className="py-5 text-[14px] leading-5 text-[#0c0c0c] sm:text-[15px]">
                      {salePrice}
                    </TableCell>
                    <TableCell className="py-5 text-[14px] leading-5 text-[#0c0c0c] sm:text-[15px]">
                      {yourEarnings}
                    </TableCell>
                    <TableCell className="py-5 text-[14px] leading-5 text-[#0c0c0c] sm:text-[15px]">
                      {row.productId ? (
                        <Link
                          to={`/my-store`}
                          className="text-[14px] font-medium text-[#4048cd] hover:underline"
                        >
                          {t('prizePayments.storeSales.details', 'Details')}
                        </Link>
                      ) : (
                        <span className="text-[#9ca3af]">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        <TablePagination
          showingKey="prizePayments.storeSales.showing"
          tone="red"
          currentPage={meta?.currentPage ?? page}
          totalPages={meta?.totalPages ?? 1}
          totalRecords={meta?.totalRecords}
          pageSize={10}
          onPageChange={onPageChange}
          loading={isLoading}
        />
      </section>
    );
  },
);

StoreSalesTable.displayName = 'StoreSalesTable';

const PaymentHistoryTable = memo(
  ({ data, isLoading, page = 1, onPageChange }) => {
    const { t } = useTranslation();
    const apiList = data?.data;
    const meta = data?.meta;
    const isLoadedFromApi = Array.isArray(apiList);
    const rows = isLoadedFromApi ? apiList : PAYMENT_HISTORY_ROWS;

    return (
      <section
        aria-labelledby="prize-payments-history-heading"
        className={`overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white ${CARD_SHADOW}`}
      >
        <div className="flex items-center justify-between border-b border-[#ececf0] px-6 py-5">
          <h2
            id="prize-payments-history-heading"
            className="text-[22px] font-bold leading-8 text-[#161c27]"
          >
            {t('prizePayments.paymentHistory.title')}
          </h2>
          {isLoading && (
            <span className="flex items-center gap-2 text-[14px] text-[#7a7484]">
              <Loader2 size={16} className="animate-spin text-[#d97706]" />
              <span>{t('common.loading', 'Loading...')}</span>
            </span>
          )}
        </div>

        <Table className="min-w-225">
          <TableHeader>
            <TableRow isHeader>
              <TableHead className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#7a7484]">
                {t('prizePayments.paymentHistory.columns.date')}
              </TableHead>
              <TableHead className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#7a7484]">
                {t('prizePayments.paymentHistory.columns.type')}
              </TableHead>
              <TableHead className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#7a7484]">
                {t('prizePayments.paymentHistory.columns.accountType')}
              </TableHead>
              <TableHead className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#7a7484]">
                {t('prizePayments.paymentHistory.columns.accountNumber')}
              </TableHead>
              <TableHead className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#7a7484]">
                {t('prizePayments.paymentHistory.columns.amount')}
              </TableHead>
              <TableHead className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#7a7484]">
                {t('prizePayments.paymentHistory.columns.status')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-12 text-center text-[15px] text-[#7a7484]"
                >
                  {t(
                    'prizePayments.paymentHistory.empty',
                    'No payment history records found.',
                  )}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => {
                const date = formatTransactionDate(row.date, row.dateKey, t);
                const type = row.type || (row.typeKey ? t(row.typeKey) : '-');
                const accountType =
                  row.accountType ||
                  (row.accountTypeKey ? t(row.accountTypeKey) : '-');
                const accountNumber = row.accountNumber || '-';
                const amount =
                  typeof row.amount === 'number'
                    ? formatPrizeAmount(row.amount)
                    : row.amount || '$0.00';

                return (
                  <TableRow
                    key={row.id}
                    className={index % 2 === 0 ? 'bg-[#fff5f5]' : 'bg-white'}
                  >
                    <TableCell className="py-5 text-[14px] leading-5 text-[#0c0c0c] sm:text-[15px]">
                      {date}
                    </TableCell>
                    <TableCell className="py-5 text-[14px] leading-5 text-[#0c0c0c] sm:text-[15px]">
                      {type}
                    </TableCell>
                    <TableCell className="py-5 text-[14px] leading-5 text-[#0c0c0c] sm:text-[15px]">
                      {accountType}
                    </TableCell>
                    <TableCell className="py-5 text-[14px] leading-5 text-[#0c0c0c] sm:text-[15px]">
                      {accountNumber}
                    </TableCell>
                    <TableCell className="py-5 text-[14px] leading-5 text-[#0c0c0c] sm:text-[15px]">
                      {amount}
                    </TableCell>
                    <TableCell className="py-5 text-[14px] leading-5 text-[#0c0c0c] sm:text-[15px]">
                      <StatusText status={row.status} />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        <TablePagination
          showingKey="prizePayments.paymentHistory.showing"
          tone="orange"
          currentPage={meta?.currentPage ?? page}
          totalPages={meta?.totalPages ?? 1}
          totalRecords={meta?.totalRecords}
          pageSize={10}
          onPageChange={onPageChange}
          loading={isLoading}
        />
      </section>
    );
  },
);

PaymentHistoryTable.displayName = 'PaymentHistoryTable';

const PrizePaymentsContent = memo(() => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState('prizeMoney');
  const [prizingPage, setPrizingPage] = useState(1);
  const [donationsPage, setDonationsPage] = useState(1);
  const [photoSalesPage, setPhotoSalesPage] = useState(1);
  const [storeSalesPage, setStoreSalesPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);
  const [photoSalesSearch, setPhotoSalesSearch] = useState('');
  const [debouncedPhotoSalesSearch, setDebouncedPhotoSalesSearch] =
    useState('');
  const [photoSalesStatusFilter, setPhotoSalesStatusFilter] = useState('all');
  const [isExporting, setIsExporting] = useState(false);
  const [isStoreExporting, setIsStoreExporting] = useState(false);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPhotoSalesSearch(photoSalesSearch.trim());
      setPhotoSalesPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [photoSalesSearch]);

  const { data: rawPrizeMoneyData, isLoading: isPrizeLoading } = useQuery({
    queryKey: [...USER_PRIZE_MONEY_QUERY_KEY, prizingPage],
    queryFn: () => getUserPrizeMoneyApi({ page: prizingPage, limit: 10 }),
    placeholderData: (prev) => prev,
  });

  const { data: rawDonationsData, isLoading: isDonationsLoading } = useQuery({
    queryKey: [...USER_DONATIONS_QUERY_KEY, donationsPage],
    queryFn: () => getUserDonationsApi({ page: donationsPage, limit: 10 }),
    placeholderData: (prev) => prev,
  });

  const { data: rawPhotoSalesData, isLoading: isPhotoSalesLoading } = useQuery({
    queryKey: [
      ...USER_PHOTO_SALES_QUERY_KEY,
      photoSalesPage,
      debouncedPhotoSalesSearch,
    ],
    queryFn: () =>
      getUserPhotoSalesApi({
        page: photoSalesPage,
        limit: 10,
        search: debouncedPhotoSalesSearch || undefined,
      }),
    placeholderData: (prev) => prev,
  });

  const { data: rawStoreSalesData, isLoading: isStoreSalesLoading } = useQuery({
    queryKey: [...USER_STORE_SALES_QUERY_KEY, storeSalesPage],
    queryFn: () => getUserStoreSalesApi({ page: storeSalesPage, limit: 10 }),
    placeholderData: (prev) => prev,
  });

  const { data: rawHistoryData, isLoading: isHistoryLoading } = useQuery({
    queryKey: [...USER_PAYMENT_HISTORY_QUERY_KEY, historyPage],
    queryFn: () => getUserPaymentHistoryApi({ page: historyPage, limit: 10 }),
    placeholderData: (prev) => prev,
  });

  const prizeMoneyData = rawPrizeMoneyData?.data?.stats
    ? rawPrizeMoneyData.data
    : rawPrizeMoneyData;

  const donationsData = rawDonationsData?.data?.stats
    ? rawDonationsData.data
    : rawDonationsData;

  const photoSalesData = rawPhotoSalesData?.data?.stats
    ? rawPhotoSalesData.data
    : rawPhotoSalesData;

  const storeSalesData = rawStoreSalesData?.data?.stats
    ? rawStoreSalesData.data
    : rawStoreSalesData;

  const historyData = rawHistoryData?.data?.data
    ? rawHistoryData.data
    : rawHistoryData;

  const prizeStats = prizeMoneyData?.stats;
  const donationsStats = donationsData?.stats;
  const photoSalesStats = photoSalesData?.stats;
  const storeSalesStats = storeSalesData?.stats;

  const prizeDynamicMap = useMemo(() => {
    if (!prizeStats) return {};
    return {
      total:
        prizeStats.totalPrizeMoney != null
          ? formatPrizeAmount(prizeStats.totalPrizeMoney)
          : undefined,
      available:
        prizeStats.available != null
          ? formatPrizeAmount(prizeStats.available)
          : undefined,
      pending:
        prizeStats.pending != null
          ? formatPrizeAmount(prizeStats.pending)
          : undefined,
      paidOut:
        prizeStats.paidOut != null
          ? formatPrizeAmount(prizeStats.paidOut)
          : undefined,
    };
  }, [prizeStats]);

  const donationsDynamicMap = useMemo(() => {
    if (!donationsStats) return {};
    return {
      total:
        donationsStats.totalDonations != null
          ? formatPrizeAmount(donationsStats.totalDonations)
          : undefined,
      platformFee:
        donationsStats.platformFee != null
          ? formatPrizeAmount(donationsStats.platformFee)
          : undefined,
      yourEarnings:
        donationsStats.yourEarnings != null
          ? formatPrizeAmount(donationsStats.yourEarnings)
          : undefined,
      available:
        donationsStats.available != null
          ? formatPrizeAmount(donationsStats.available)
          : undefined,
      pending:
        donationsStats.pending != null
          ? formatPrizeAmount(donationsStats.pending)
          : undefined,
      paidOut:
        donationsStats.paidOut != null
          ? formatPrizeAmount(donationsStats.paidOut)
          : undefined,
    };
  }, [donationsStats]);

  const photoSalesDynamicMap = useMemo(() => {
    if (!photoSalesStats) return {};
    return {
      totalSales:
        photoSalesStats.totalSales != null
          ? formatPrizeAmount(photoSalesStats.totalSales)
          : undefined,
      photosSold:
        photoSalesStats.photosSold != null
          ? String(photoSalesStats.photosSold)
          : undefined,
      availableEarnings:
        photoSalesStats.available != null
          ? formatPrizeAmount(photoSalesStats.available)
          : undefined,
      pending:
        photoSalesStats.pending != null
          ? formatPrizeAmount(photoSalesStats.pending)
          : undefined,
      paidOut:
        photoSalesStats.paidOut != null
          ? formatPrizeAmount(photoSalesStats.paidOut)
          : undefined,
    };
  }, [photoSalesStats]);

  const storeSalesDynamicMap = useMemo(() => {
    if (!storeSalesStats) return {};
    return {
      totalSales:
        storeSalesStats.totalSales != null
          ? formatPrizeAmount(storeSalesStats.totalSales)
          : undefined,
      itemsSold:
        storeSalesStats.itemsSold != null
          ? String(storeSalesStats.itemsSold)
          : undefined,
      yourEarnings:
        storeSalesStats.yourEarnings != null
          ? formatPrizeAmount(storeSalesStats.yourEarnings)
          : undefined,
      available:
        storeSalesStats.available != null
          ? formatPrizeAmount(storeSalesStats.available)
          : undefined,
      pending:
        storeSalesStats.pending != null
          ? formatPrizeAmount(storeSalesStats.pending)
          : undefined,
      paidOut:
        storeSalesStats.paidOut != null
          ? formatPrizeAmount(storeSalesStats.paidOut)
          : undefined,
    };
  }, [storeSalesStats]);

  const availableBalances = useMemo(
    () => ({
      prizeMoney: prizeStats?.available ?? 0,
      donations: donationsStats?.available ?? 0,
      photoSales: photoSalesStats?.available ?? 0,
      storeSales: storeSalesStats?.available ?? 0,
    }),
    [prizeStats, donationsStats, photoSalesStats, storeSalesStats],
  );

  const tabItems = PRIZE_PAYMENTS_TABS.map((tab) => ({
    value: tab.value,
    label: t(tab.labelKey),
  }));

  const summaryCards =
    activeTab === 'donations'
      ? DONATIONS_SUMMARY
      : activeTab === 'photoSales'
        ? PHOTO_SALES_SUMMARY
        : activeTab === 'storeSales'
          ? STORE_SALES_SUMMARY
          : PRIZE_MONEY_SUMMARY;

  const handleOpenPayoutModal = () => {
    setIsPayoutModalOpen(true);
  };

  const handlePayoutSuccess = () => {
    queryClient.invalidateQueries({ queryKey: USER_PRIZE_MONEY_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: USER_DONATIONS_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: USER_PHOTO_SALES_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: USER_STORE_SALES_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: USER_PAYMENT_HISTORY_QUERY_KEY });
  };

  const handleExportPhotoSales = async () => {
    try {
      setIsExporting(true);
      await exportUserPhotoSalesCsvApi({
        search: debouncedPhotoSalesSearch || undefined,
      });
      toast.success(
        t(
          'prizePayments.photoSales.exportSuccess',
          'Photo sales exported successfully',
        ),
      );
    } catch (error) {
      toast.error(error?.message || t('common.error', 'Failed to export CSV'));
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportStoreSales = async () => {
    try {
      setIsStoreExporting(true);
      await exportUserStoreSalesCsvApi();
      toast.success(
        t(
          'prizePayments.storeSales.exportSuccess',
          'Store sales exported successfully',
        ),
      );
    } catch (error) {
      toast.error(error?.message || t('common.error', 'Failed to export CSV'));
    } finally {
      setIsStoreExporting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-395 flex-col">
      <header className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex max-w-208.75 flex-col gap-3">
          <h1 className="text-[28px] font-semibold leading-8.5 tracking-[-0.75px] text-[#161c27] sm:text-[36px] sm:leading-9.5 lg:text-[40px]">
            {t('prizePayments.title')}
          </h1>
          <p className="text-[16px] font-normal leading-6 text-[#494453]">
            {t('prizePayments.subtitle')}
          </p>
        </div>
        <Button
          type="button"
          unstyled={true}
          onClick={handleOpenPayoutModal}
          className="inline-flex shrink-0 items-center justify-center self-start rounded-xl bg-[#ee1c25] px-6 py-3 text-[14px] font-semibold leading-5 tracking-[0.28px] text-white transition hover:bg-[#d01720] sm:self-center"
        >
          {t('prizePayments.requestPayout')}
        </Button>
      </header>

      <FilterPillGroup
        items={tabItems}
        value={activeTab}
        onChange={setActiveTab}
        density="compact"
        layout="scroll"
        ariaLabel={t('prizePayments.tabs.aria')}
        className="mb-8"
      />

      <section
        aria-label={t('prizePayments.summary.aria')}
        className={`mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 ${summaryCards.length >= 4 ? 'xl:grid-cols-4' : 'xl:grid-cols-3'} ${summaryCards.length >= 5 ? '2xl:grid-cols-5' : ''}`}
      >
        {summaryCards.map((card) => {
          const dynamicVal =
            activeTab === 'prizeMoney'
              ? prizeDynamicMap[card.id]
              : activeTab === 'donations'
                ? donationsDynamicMap[card.id]
                : activeTab === 'photoSales'
                  ? photoSalesDynamicMap[card.id]
                  : activeTab === 'storeSales'
                    ? storeSalesDynamicMap[card.id]
                    : undefined;

          return (
            <SummaryCard key={card.id} card={card} dynamicValue={dynamicVal} />
          );
        })}
      </section>

      {activeTab === 'donations' ? (
        <p className="mb-8 rounded-xl border border-[#dbeafe] bg-[#eff6ff] px-4 py-3 text-[14px] leading-6 text-[#1e40af]">
          {t('prizePayments.donations.commissionBanner')}
        </p>
      ) : null}

      {activeTab === 'prizeMoney' ? (
        <PrizingTable
          data={prizeMoneyData}
          isLoading={isPrizeLoading}
          page={prizingPage}
          onPageChange={setPrizingPage}
        />
      ) : null}

      {activeTab === 'donations' ? (
        <DonationsTable
          data={donationsData}
          isLoading={isDonationsLoading}
          page={donationsPage}
          onPageChange={setDonationsPage}
        />
      ) : null}

      {activeTab === 'photoSales' ? (
        <PhotoSalesTable
          data={photoSalesData}
          isLoading={isPhotoSalesLoading}
          page={photoSalesPage}
          onPageChange={setPhotoSalesPage}
          search={photoSalesSearch}
          onSearchChange={setPhotoSalesSearch}
          statusFilter={photoSalesStatusFilter}
          onStatusFilterChange={setPhotoSalesStatusFilter}
          onRequestPayout={handleOpenPayoutModal}
          onExport={handleExportPhotoSales}
          isExporting={isExporting}
        />
      ) : null}

      {activeTab === 'storeSales' ? (
        <StoreSalesTable
          data={storeSalesData}
          isLoading={isStoreSalesLoading}
          page={storeSalesPage}
          onPageChange={setStoreSalesPage}
          onRequestPayout={handleOpenPayoutModal}
          onExport={handleExportStoreSales}
          isExporting={isStoreExporting}
        />
      ) : null}

      <PaymentHistoryTable
        data={historyData}
        isLoading={isHistoryLoading}
        page={historyPage}
        onPageChange={setHistoryPage}
      />

      <RequestPayoutModal
        open={isPayoutModalOpen}
        onClose={() => setIsPayoutModalOpen(false)}
        defaultType={activeTab}
        availableBalances={availableBalances}
        onSuccess={handlePayoutSuccess}
      />
    </div>
  );
});

PrizePaymentsContent.displayName = 'PrizePaymentsContent';

export default PrizePaymentsContent;
