import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CARD_BORDER,
  CARD_SHADOW,
} from '@/portals/admin/data/adminOverviewData';

/**
 * Compact display for tight mobile cards: 93158 → 93.2k, 27000 → 27k, 1500000 → 1.5m
 * Currency values keep a leading `$`.
 */
export const formatCompactStatValue = (value, { currency = false } = {}) => {
  if (value === undefined || value === null || value === '') return '0';

  let numeric = value;
  let isCurrency = currency;

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.startsWith('$')) isCurrency = true;
    numeric = Number(trimmed.replace(/[^0-9.-]/g, ''));
  }

  if (!Number.isFinite(numeric)) return String(value);

  const abs = Math.abs(numeric);
  let body;

  if (abs >= 1_000_000) {
    const scaled = numeric / 1_000_000;
    body = `${scaled.toFixed(scaled >= 10 ? 0 : 1).replace(/\.0$/, '')}m`;
  } else if (abs >= 1_000) {
    const scaled = numeric / 1_000;
    body = `${scaled.toFixed(scaled >= 100 ? 0 : 1).replace(/\.0$/, '')}k`;
  } else if (isCurrency) {
    body =
      Math.abs(numeric % 1) < 0.005
        ? String(Math.round(numeric))
        : numeric.toFixed(2).replace(/\.00$/, '');
  } else {
    body = String(Math.round(numeric));
  }

  return isCurrency ? `$${body}` : body;
};

const AdminOverviewStatCard = memo(
  ({ labelKey, valueKey, value, isCurrency = false, isLoading }) => {
    const { t } = useTranslation();

    let formattedValue;
    if (isLoading) {
      formattedValue = '—';
    } else if (value !== undefined && value !== null) {
      formattedValue = formatCompactStatValue(value, { currency: isCurrency });
    } else if (valueKey) {
      formattedValue = formatCompactStatValue(t(valueKey), {
        currency: isCurrency,
      });
    } else {
      formattedValue = '0';
    }

    return (
      <article
        className={`flex h-full min-w-0 flex-col rounded-2xl bg-white p-4 shadow-sm sm:p-5 ${CARD_BORDER} ${CARD_SHADOW}`}
      >
        <p className="min-h-8 text-[12px] font-medium uppercase leading-4 tracking-[0.6px] text-[#494453] sm:min-h-0 sm:text-[13px] lg:text-[14px]">
          {t(labelKey)}
        </p>
        <p className="mt-auto pt-2 text-[22px] font-bold tracking-[-0.64px] text-[#161c27] sm:text-[26px] sm:leading-9 lg:text-[28px]">
          {formattedValue}
        </p>
      </article>
    );
  },
);

AdminOverviewStatCard.displayName = 'AdminOverviewStatCard';

export default AdminOverviewStatCard;
