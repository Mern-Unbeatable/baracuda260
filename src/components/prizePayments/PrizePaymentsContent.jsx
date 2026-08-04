import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import {
  PRIZE_PAYMENTS_ASSETS,
  PRIZING_ROWS,
  SUMMARY_CARDS,
  TRANSACTION_ROWS,
} from './prizePaymentsData';

const CARD_SHADOW = 'shadow-[0px_4px_20px_-2px_rgba(83,42,168,0.04)]';

const amountClassName = {
  neutral: 'text-[#161c27]',
  debit: 'text-[#ba1a1a]',
  muted: 'text-[#7a7484] italic',
};

const StatusBadge = memo(({ status }) => {
  const { t } = useTranslation();
  const isPending = status === 'pending';

  return (
    <span
      className={`inline-flex items-start rounded-full px-3 text-[12px] font-bold leading-6 ${
        isPending
          ? 'bg-[#e3e8f9] italic text-[#7a7484]'
          : 'bg-[#dcfce7] text-[#15803d]'
      }`}
    >
      {t(`prizePayments.status.${status}`)}
    </span>
  );
});

StatusBadge.displayName = 'StatusBadge';

const TablePagination = memo(({ showingKey }) => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[67px] w-full flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-0">
      <p className="px-2.5 text-[16px] leading-normal text-[#ee1c25]">{t(showingKey)}</p>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          className="rounded-[12px] border border-[#ee1c25] px-4 py-2 text-[16px] font-medium capitalize leading-normal text-[#ee1c25]"
        >
          {t('prizePayments.pagination.previous')}
        </button>
        <button
          type="button"
          className="rounded-[12px] border border-[#ee1c25] px-4 py-2 text-[16px] font-medium capitalize leading-normal text-[#ee1c25]"
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
      className={`relative flex h-full w-full min-w-0 flex-col gap-[7.5px] overflow-hidden rounded-[16px] border border-[#e2e8f0] bg-white/70 p-[25px] backdrop-blur-[6px] ${CARD_SHADOW}`}
    >
      <div className="relative z-[1] flex items-center gap-3">
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${card.iconBg}`}
        >
          <img
            src={card.icon}
            alt=""
            width={card.iconWidth}
            height={card.iconHeight}
            style={{ width: card.iconWidth, height: card.iconHeight }}
          />
        </span>
        <p className="text-[14px] font-bold leading-5 tracking-[0.28px] text-[#7a7484]">
          {t(card.labelKey)}
        </p>
      </div>
      <p
        className={`relative z-[1] pt-[8.5px] text-[36px] font-semibold leading-[44px] tracking-[-0.96px] sm:text-[42px] sm:leading-[50px] lg:text-[48px] lg:leading-[56px] ${card.valueClass}`}
      >
        {t(card.valueKey)}
      </p>
      <span
        className={`pointer-events-none absolute right-[-64px] top-[-64px] size-[128px] rounded-full ${card.orbClass}`}
        aria-hidden="true"
      />
    </article>
  );
});

SummaryCard.displayName = 'SummaryCard';

/**
 * Shared table row layout — same even column gaps as My Prizing (justify-between).
 */
const TABLE_ROW =
  'flex w-full min-w-[720px] items-center justify-between px-4';

const PrizingRow = memo(({ row, isHeader = false }) => {
  const { t } = useTranslation();
  const nameCell = 'w-[160px] shrink-0 px-2.5 text-left text-[16px] leading-6 lg:w-[200px]';
  const colCell = 'w-[180px] shrink-0 px-2.5 text-left text-[16px] leading-6';

  if (isHeader) {
    return (
      <div className={`${TABLE_ROW} bg-[#f6fbff]`}>
        <div className={`${nameCell} py-3 font-normal text-black`}>
          {t('prizePayments.prizing.columns.name')}
        </div>
        <div className={`${colCell} py-3 font-normal text-black`}>
          {t('prizePayments.prizing.columns.position')}
        </div>
        <div className={`${colCell} py-3 font-normal text-black`}>
          {t('prizePayments.prizing.columns.votes')}
        </div>
        <div className={`${colCell} py-3 font-normal text-black`}>
          {t('prizePayments.prizing.columns.prize')}
        </div>
      </div>
    );
  }

  return (
    <div className={`${TABLE_ROW} border-b border-[#e4e4e4]`}>
      <div className={`${nameCell} py-6 text-[#0c0c0c]`}>
        <span className="block">{t('prizePayments.prizing.items.celestialLine1')}</span>
        <span className="block">{t('prizePayments.prizing.items.celestialLine2')}</span>
      </div>
      <div className={`${colCell} py-6 text-[#0c0c0c]`}>{t(row.positionKey)}</div>
      <div className={`${colCell} py-6 text-[#0c0c0c]`}>{row.votes}</div>
      <div className={`${colCell} py-6 text-[#0c0c0c]`}>{row.prize}</div>
    </div>
  );
});

PrizingRow.displayName = 'PrizingRow';

const txnNameCell =
  'w-[200px] shrink-0 px-2.5 text-left sm:w-[220px] lg:w-[260px]';
const txnColCell = 'w-[180px] shrink-0 px-2.5 text-left';

const TransactionHeader = memo(() => {
  const { t } = useTranslation();
  const headClass =
    'py-4 text-[12px] font-bold uppercase leading-4 tracking-[0.6px] text-[#7a7484]';

  return (
    <div className={`${TABLE_ROW} bg-[#f1f3ff]`}>
      <div className={`${txnNameCell} ${headClass}`}>
        {t('prizePayments.transactions.columns.competition')}
      </div>
      <div className={`${txnColCell} ${headClass}`}>
        {t('prizePayments.transactions.columns.date')}
      </div>
      <div className={`${txnColCell} ${headClass}`}>
        {t('prizePayments.transactions.columns.amount')}
      </div>
      <div className={`${txnColCell} ${headClass}`}>
        {t('prizePayments.transactions.columns.status')}
      </div>
    </div>
  );
});

TransactionHeader.displayName = 'TransactionHeader';

const TransactionRow = memo(({ row }) => {
  const { t } = useTranslation();
  const pending = row.pendingStyle;

  return (
    <div
      className={`${TABLE_ROW} border-t border-[rgba(203,195,213,0.3)] ${
        pending ? 'bg-[rgba(241,243,255,0.5)]' : 'bg-transparent'
      }`}
    >
      <div className={`${txnNameCell} flex items-center gap-3 py-6`}>
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded ${row.iconBg}`}
        >
          <img
            src={row.icon}
            alt=""
            width={row.iconWidth}
            height={row.iconHeight}
            style={{ width: row.iconWidth, height: row.iconHeight }}
          />
        </span>
        <div className="min-w-0">
          <p
            className={`text-[16px] font-bold leading-6 ${
              pending ? 'italic text-[#7a7484]' : 'text-[#161c27]'
            }`}
          >
            {t(row.titleKey)}
          </p>
          <p
            className={`text-[12px] font-medium leading-4 tracking-[0.6px] text-[#7a7484] ${
              pending ? 'italic' : ''
            }`}
          >
            {t(row.idKey)}
          </p>
        </div>
      </div>
      <div
        className={`${txnColCell} py-6 text-[16px] leading-6 ${
          pending ? 'italic text-[#7a7484]' : 'text-[#494453]'
        }`}
      >
        {t(row.dateKey)}
      </div>
      <div
        className={`${txnColCell} py-6 text-[16px] font-bold leading-6 ${amountClassName[row.amountTone]}`}
      >
        {t(row.amountKey)}
      </div>
      <div className={`${txnColCell} py-6`}>
        <StatusBadge status={row.status} />
      </div>
    </div>
  );
});

TransactionRow.displayName = 'TransactionRow';

/**
 * Prize & Payments — Figma node 111:1793 (admin main area; sidebar from Layout).
 */
const PrizePaymentsContent = memo(() => {
  const { t } = useTranslation();

  const handleRequestPayout = () => {
    toast.success(t('prizePayments.payoutRequested'));
  };

  return (
    <div className="mx-auto flex w-full max-w-[1580px] flex-col">
      <header className="mb-[30px] flex flex-col gap-4 sm:mb-[30px] sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex max-w-[835px] flex-col gap-4">
          <h1 className="text-[28px] font-semibold leading-[34px] tracking-[-0.75px] text-[#161c27] sm:text-[36px] sm:leading-[38px] lg:text-[40px] lg:leading-[38px]">
            {t('prizePayments.title')}
          </h1>
          <p className="text-[16px] font-normal leading-6 text-[#494453]">
            {t('prizePayments.subtitle')}
          </p>
        </div>
        <button
          type="button"
          onClick={handleRequestPayout}
          className="inline-flex shrink-0 items-center gap-2 self-start rounded-[12px] bg-[#ee1c25] px-6 py-3 text-[14px] font-semibold leading-5 tracking-[0.28px] text-white sm:self-center"
        >
          <img
            src={PRIZE_PAYMENTS_ASSETS.requestPayout}
            alt=""
            width={16}
            height={15}
            className="h-[15px] w-4 shrink-0"
          />
          {t('prizePayments.requestPayout')}
        </button>
      </header>

      <section
        aria-label={t('prizePayments.summary.aria')}
        className="mb-[50px] grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 xl:grid-cols-3 xl:gap-[43px]"
      >
        {SUMMARY_CARDS.map((card) => (
          <SummaryCard key={card.id} card={card} />
        ))}
      </section>

      <section
        aria-labelledby="prize-payments-prizing-heading"
        className="mb-[30px] overflow-hidden rounded-[12px] bg-white"
      >
        <div className="border-b border-[#cbc3d5] px-6 pb-[25px] pt-6">
          <h2
            id="prize-payments-prizing-heading"
            className="text-[24px] font-bold leading-8 text-[#161c27]"
          >
            {t('prizePayments.prizing.title')}
          </h2>
        </div>

        <div className="w-full overflow-x-auto">
          <PrizingRow isHeader />
          {PRIZING_ROWS.map((row) => (
            <PrizingRow key={row.id} row={row} />
          ))}
        </div>

        <TablePagination showingKey="prizePayments.prizing.showing" />
      </section>

      <section
        aria-labelledby="prize-payments-transactions-heading"
        className={`overflow-hidden rounded-[16px] border border-[#e2e8f0] bg-white/70 backdrop-blur-[6px] ${CARD_SHADOW}`}
      >
        <div className="border-b border-[#cbc3d5] px-6 pb-[25px] pt-6">
          <h2
            id="prize-payments-transactions-heading"
            className="text-[24px] font-bold leading-8 text-[#161c27]"
          >
            {t('prizePayments.transactions.title')}
          </h2>
          <p className="text-[12px] font-medium leading-4 tracking-[0.6px] text-[#7a7484]">
            {t('prizePayments.transactions.subtitle')}
          </p>
        </div>

        <div className="w-full overflow-x-auto">
          <TransactionHeader />
          {TRANSACTION_ROWS.map((row) => (
            <TransactionRow key={row.id} row={row} />
          ))}
        </div>

        <TablePagination showingKey="prizePayments.transactions.showing" />
      </section>
    </div>
  );
});

PrizePaymentsContent.displayName = 'PrizePaymentsContent';

export default PrizePaymentsContent;
