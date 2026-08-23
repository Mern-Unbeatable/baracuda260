import { useTranslation } from 'react-i18next';
import React, { memo, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { ChevronDown, Search } from 'lucide-react';
import FilterPillGroup from '@/shared/ui/marketing/FilterPillGroup';
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
} from '@/portals/member/data/prizePaymentsData';

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

const TablePagination = memo(({ showingKey, tone = 'red' }) => {
  const { t } = useTranslation();
  const colors = PAGINATION_TONES[tone] ?? PAGINATION_TONES.red;

  return (
    <div className="flex min-h-[67px] w-full flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-0">
      <p className={`px-2.5 text-[16px] leading-normal ${colors.text}`}>{t(showingKey)}</p>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          className={`rounded-[12px] border px-4 py-2 text-[16px] font-medium capitalize leading-normal ${colors.border} ${colors.text}`}
        >
          {t('prizePayments.pagination.previous')}
        </button>
        <button
          type="button"
          className={`rounded-[12px] border px-4 py-2 text-[16px] font-medium capitalize leading-normal ${colors.border} ${colors.text}`}
        >
          {t('prizePayments.pagination.next')}
        </button>
      </div>
    </div>
  );
});

TablePagination.displayName = 'TablePagination';

const SummaryCard = memo(({ card }) => {
  const { t } = useTranslation();

  return (
    <article
      className={`flex h-full w-full min-w-0 flex-col gap-2 rounded-[16px] border border-[#e2e8f0] bg-white p-6 ${CARD_SHADOW}`}
    >
      <p className="text-[12px] font-bold uppercase leading-4 tracking-[0.6px] text-[#7a7484]">
        {t(card.labelKey)}
      </p>
      <p
        className={`text-[32px] font-semibold leading-[40px] tracking-[-0.75px] sm:text-[36px] sm:leading-[44px] ${card.valueClass}`}
      >
        {t(card.valueKey)}
      </p>
      <p className="text-[14px] leading-5 text-[#7a7484]">{t(card.hintKey)}</p>
    </article>
  );
});

SummaryCard.displayName = 'SummaryCard';

const StatusText = memo(({ status }) => {
  const { t } = useTranslation();
  const isApproved = status === 'approved';
  const isAvailable = status === 'available';

  if (isAvailable) {
    return (
      <span className="inline-flex items-center gap-2 text-[14px] font-medium text-[#15803d]">
        <span className="size-2 shrink-0 rounded-full bg-[#15803d]" aria-hidden="true" />
        {t('prizePayments.status.available')}
      </span>
    );
  }

  return (
    <span
      className={`text-[14px] font-medium ${isApproved ? 'text-[#15803d]' : 'text-[#7a7484]'}`}
    >
      {t(`prizePayments.status.${status}`)}
    </span>
  );
});

StatusText.displayName = 'StatusText';

const PrizingTable = memo(() => {
  const { t } = useTranslation();
  const headCell =
    'px-3 py-3 text-left text-[12px] font-bold uppercase leading-4 tracking-[0.6px] text-[#7a7484]';
  const bodyCell = 'px-3 py-5 text-[14px] leading-5 text-[#0c0c0c] sm:text-[15px]';

  return (
    <section
      aria-labelledby="prize-payments-prizing-heading"
      className="mb-8 overflow-hidden rounded-[12px] border border-[#e2e8f0] bg-white"
    >
      <div className="border-b border-[#ececf0] px-6 py-5">
        <h2 id="prize-payments-prizing-heading" className="text-[22px] font-bold leading-8 text-[#161c27]">
          {t('prizePayments.prizing.title')}
        </h2>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="min-w-[960px] w-full border-collapse">
          <thead>
            <tr className="bg-[#f6fbff]">
              <th className={headCell}>{t('prizePayments.prizing.columns.month')}</th>
              <th className={headCell}>{t('prizePayments.prizing.columns.name')}</th>
              <th className={headCell}>{t('prizePayments.prizing.columns.category')}</th>
              <th className={headCell}>{t('prizePayments.prizing.columns.albumType')}</th>
              <th className={headCell}>{t('prizePayments.prizing.columns.position')}</th>
              <th className={headCell}>{t('prizePayments.prizing.columns.votes')}</th>
              <th className={headCell}>{t('prizePayments.prizing.columns.prize')}</th>
            </tr>
          </thead>
          <tbody>
            {PRIZING_ROWS.map((row) => (
              <tr key={row.id} className="border-t border-[#ececf0]">
                <td className={bodyCell}>{t(row.monthKey)}</td>
                <td className={bodyCell}>{t(row.competitionKey)}</td>
                <td className={bodyCell}>{t(row.categoryKey)}</td>
                <td className={bodyCell}>{t(row.albumTypeKey)}</td>
                <td className={bodyCell}>{t(row.positionKey)}</td>
                <td className={bodyCell}>{row.votes}</td>
                <td className={bodyCell}>{row.prize}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TablePagination showingKey="prizePayments.prizing.showing" tone="red" />
    </section>
  );
});

PrizingTable.displayName = 'PrizingTable';

const DonationsTable = memo(() => {
  const { t } = useTranslation();
  const headCell =
    'px-3 py-3 text-left text-[12px] font-bold uppercase leading-4 tracking-[0.6px] text-[#7a7484]';
  const bodyCell = 'px-3 py-5 text-[14px] leading-5 text-[#0c0c0c] sm:text-[15px]';

  return (
    <section
      aria-labelledby="prize-payments-donations-heading"
      className="mb-8 overflow-hidden rounded-[12px] border border-[#e2e8f0] bg-white"
    >
      <div className="border-b border-[#ececf0] px-6 py-5">
        <h2 id="prize-payments-donations-heading" className="text-[22px] font-bold leading-8 text-[#161c27]">
          {t('prizePayments.donations.title')}
        </h2>
        <p className="mt-1 text-[14px] leading-5 text-[#7a7484]">{t('prizePayments.donations.subtitle')}</p>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="min-w-[960px] w-full border-collapse">
          <thead>
            <tr className="bg-[#f6fbff]">
              <th className={headCell}>{t('prizePayments.donations.columns.date')}</th>
              <th className={headCell}>{t('prizePayments.donations.columns.donor')}</th>
              <th className={headCell}>{t('prizePayments.donations.columns.email')}</th>
              <th className={headCell}>{t('prizePayments.donations.columns.donation')}</th>
              <th className={headCell}>{t('prizePayments.donations.columns.platformFee')}</th>
              <th className={headCell}>{t('prizePayments.donations.columns.yourEarnings')}</th>
              <th className={headCell}>{t('prizePayments.donations.columns.status')}</th>
            </tr>
          </thead>
          <tbody>
            {DONATION_TRANSACTION_ROWS.map((row) => (
              <tr key={row.id} className="border-t border-[#ececf0]">
                <td className={bodyCell}>{t(row.dateKey)}</td>
                <td className={bodyCell}>{t(row.donorKey)}</td>
                <td className={bodyCell}>{row.email}</td>
                <td className={bodyCell}>{row.donation}</td>
                <td className={bodyCell}>{row.platformFee}</td>
                <td className={bodyCell}>{row.yourEarnings}</td>
                <td className={bodyCell}>
                  <StatusText status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TablePagination showingKey="prizePayments.donations.showing" tone="red" />
    </section>
  );
});

DonationsTable.displayName = 'DonationsTable';

const PhotoSalesTable = memo(({ onRequestPayout }) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return PHOTO_SALES_ROWS.filter((row) => {
      const matchesStatus = statusFilter === 'all' || row.status === statusFilter;
      if (!matchesStatus) return false;
      if (!query) return true;
      const buyer = t(row.buyerKey).toLowerCase();
      const photo = t(row.photoKey).toLowerCase();
      return buyer.includes(query) || row.email.toLowerCase().includes(query) || photo.includes(query);
    });
  }, [search, statusFilter, t]);

  const headCell =
    'px-3 py-3 text-left text-[12px] font-bold uppercase leading-4 tracking-[0.6px] text-[#7a7484]';
  const bodyCell = 'px-3 py-5 text-[14px] leading-5 text-[#0c0c0c] sm:text-[15px]';

  return (
    <section
      aria-labelledby="prize-payments-photo-sales-heading"
      className="mb-8 overflow-hidden rounded-[12px] border border-[#e2e8f0] bg-white"
    >
      <div className="flex flex-col gap-4 border-b border-[#ececf0] px-6 py-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 id="prize-payments-photo-sales-heading" className="text-[22px] font-bold leading-8 text-[#161c27]">
            {t('prizePayments.photoSales.title')}
          </h2>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <label className="relative min-w-[220px] flex-1">
            <span className="sr-only">{t('prizePayments.photoSales.searchPlaceholder')}</span>
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('prizePayments.photoSales.searchPlaceholder')}
              className="w-full rounded-[10px] border border-[#e2e8f0] py-2.5 pl-9 pr-3 text-[14px] text-[#161c27] outline-none focus:border-[#4048cd]"
            />
          </label>
          <button
            type="button"
            onClick={onRequestPayout}
            className="inline-flex shrink-0 items-center justify-center rounded-[10px] bg-[#161c27] px-4 py-2.5 text-[14px] font-semibold text-white"
          >
            {t('prizePayments.requestPayout')}
          </button>
          <button
            type="button"
            className="inline-flex shrink-0 items-center gap-1 rounded-[10px] border border-[#e2e8f0] px-4 py-2.5 text-[14px] font-medium text-[#161c27]"
          >
            {t('prizePayments.photoSales.export')}
            <ChevronDown size={16} aria-hidden="true" />
          </button>
          <label className="relative min-w-[140px]">
            <span className="sr-only">{t('prizePayments.photoSales.filters.allStatuses')}</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
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

      <div className="w-full overflow-x-auto">
        <table className="min-w-[1100px] w-full border-collapse">
          <thead>
            <tr className="bg-[#f6fbff]">
              <th className={headCell}>{t('prizePayments.photoSales.columns.date')}</th>
              <th className={headCell}>{t('prizePayments.photoSales.columns.buyer')}</th>
              <th className={headCell}>{t('prizePayments.photoSales.columns.email')}</th>
              <th className={headCell}>{t('prizePayments.photoSales.columns.photo')}</th>
              <th className={headCell}>{t('prizePayments.photoSales.columns.salePrice')}</th>
              <th className={headCell}>{t('prizePayments.photoSales.columns.yourEarnings')}</th>
              <th className={headCell}>{t('prizePayments.photoSales.columns.status')}</th>
              <th className={headCell}>{t('prizePayments.photoSales.columns.action')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr key={row.id} className="border-t border-[#ececf0]">
                <td className={bodyCell}>{t(row.dateKey)}</td>
                <td className={bodyCell}>{t(row.buyerKey)}</td>
                <td className={bodyCell}>{row.email}</td>
                <td className={bodyCell}>
                  <span className="inline-flex items-center gap-3">
                    <img
                      src={row.image}
                      alt=""
                      width={40}
                      height={40}
                      className="size-10 shrink-0 rounded-md object-cover"
                    />
                    <span>{t(row.photoKey)}</span>
                  </span>
                </td>
                <td className={bodyCell}>{row.salePrice}</td>
                <td className={bodyCell}>{row.yourEarnings}</td>
                <td className={bodyCell}>
                  <StatusText status={row.status} />
                </td>
                <td className={bodyCell}>
                  <button type="button" className="text-[14px] font-medium text-[#4048cd] hover:underline">
                    {t('prizePayments.photoSales.details')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TablePagination showingKey="prizePayments.photoSales.showing" tone="red" />
    </section>
  );
});

PhotoSalesTable.displayName = 'PhotoSalesTable';

const PaymentHistoryTable = memo(() => {
  const { t } = useTranslation();
  const headCell =
    'px-3 py-3 text-left text-[12px] font-bold uppercase leading-4 tracking-[0.6px] text-[#7a7484]';
  const bodyCell = 'px-3 py-5 text-[14px] leading-5 text-[#0c0c0c] sm:text-[15px]';

  return (
    <section
      aria-labelledby="prize-payments-history-heading"
      className={`overflow-hidden rounded-[16px] border border-[#e2e8f0] bg-white ${CARD_SHADOW}`}
    >
      <div className="border-b border-[#ececf0] px-6 py-5">
        <h2 id="prize-payments-history-heading" className="text-[22px] font-bold leading-8 text-[#161c27]">
          {t('prizePayments.paymentHistory.title')}
        </h2>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="min-w-[900px] w-full border-collapse">
          <thead>
            <tr className="bg-[#f6fbff]">
              <th className={headCell}>{t('prizePayments.paymentHistory.columns.date')}</th>
              <th className={headCell}>{t('prizePayments.paymentHistory.columns.type')}</th>
              <th className={headCell}>{t('prizePayments.paymentHistory.columns.accountType')}</th>
              <th className={headCell}>{t('prizePayments.paymentHistory.columns.accountNumber')}</th>
              <th className={headCell}>{t('prizePayments.paymentHistory.columns.amount')}</th>
              <th className={headCell}>{t('prizePayments.paymentHistory.columns.status')}</th>
            </tr>
          </thead>
          <tbody>
            {PAYMENT_HISTORY_ROWS.map((row, index) => (
              <tr
                key={row.id}
                className={`border-t border-[#ececf0] ${index % 2 === 0 ? 'bg-[#fff5f5]' : 'bg-white'}`}
              >
                <td className={bodyCell}>{t(row.dateKey)}</td>
                <td className={bodyCell}>{t(row.typeKey)}</td>
                <td className={bodyCell}>{t(row.accountTypeKey)}</td>
                <td className={bodyCell}>{row.accountNumber}</td>
                <td className={bodyCell}>{row.amount}</td>
                <td className={bodyCell}>
                  <StatusText status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TablePagination showingKey="prizePayments.paymentHistory.showing" tone="orange" />
    </section>
  );
});

PaymentHistoryTable.displayName = 'PaymentHistoryTable';

const PrizePaymentsContent = memo(() => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('prizeMoney');

  const tabItems = PRIZE_PAYMENTS_TABS.map((tab) => ({
    value: tab.value,
    label: t(tab.labelKey),
  }));

  const summaryCards =
    activeTab === 'donations'
      ? DONATIONS_SUMMARY
      : activeTab === 'photoSales'
        ? PHOTO_SALES_SUMMARY
        : PRIZE_MONEY_SUMMARY;

  const handleRequestPayout = () => {
    toast.success(t('prizePayments.payoutRequested'));
  };

  return (
    <div className="mx-auto flex w-full max-w-[1580px] flex-col">
      <header className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex max-w-[835px] flex-col gap-3">
          <h1 className="text-[28px] font-semibold leading-[34px] tracking-[-0.75px] text-[#161c27] sm:text-[36px] sm:leading-[38px] lg:text-[40px]">
            {t('prizePayments.title')}
          </h1>
          <p className="text-[16px] font-normal leading-6 text-[#494453]">
            {t('prizePayments.subtitle')}
          </p>
        </div>
        <button
          type="button"
          onClick={handleRequestPayout}
          className="inline-flex shrink-0 items-center justify-center self-start rounded-[12px] bg-[#ee1c25] px-6 py-3 text-[14px] font-semibold leading-5 tracking-[0.28px] text-white sm:self-center"
        >
          {t('prizePayments.requestPayout')}
        </button>
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
        className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-6"
      >
        {summaryCards.map((card) => (
          <SummaryCard key={card.id} card={card} />
        ))}
      </section>

      {activeTab === 'donations' ? (
        <p className="mb-8 rounded-[12px] border border-[#dbeafe] bg-[#eff6ff] px-4 py-3 text-[14px] leading-6 text-[#1e40af]">
          {t('prizePayments.donations.commissionBanner')}
        </p>
      ) : null}

      {activeTab === 'prizeMoney' ? <PrizingTable /> : null}
      {activeTab === 'donations' ? <DonationsTable /> : null}
      {activeTab === 'photoSales' ? <PhotoSalesTable onRequestPayout={handleRequestPayout} /> : null}

      <PaymentHistoryTable />
    </div>
  );
});

PrizePaymentsContent.displayName = 'PrizePaymentsContent';

export default PrizePaymentsContent;
