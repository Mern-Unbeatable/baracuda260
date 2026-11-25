/** Admin Ads Management — table + sidebar details drawer. */

export const MORE_ICON_SIZE = 20;
export const ADS_PAGE_SIZE = 10;

export const ADS_STATUS = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED',
};

export const ACTION_MENU_OPTIONS = [
  { id: 'details', labelKey: 'adminAds.actions.seeDetails', kind: 'details' },
  {
    id: ADS_STATUS.ACTIVE,
    labelKey: 'adminAds.actions.approve',
    kind: 'status',
  },
  {
    id: ADS_STATUS.REJECTED,
    labelKey: 'adminAds.actions.reject',
    kind: 'status',
  },
];

/** Hide the status option the ad is already in. */
export const getActionMenuOptions = (status) =>
  ACTION_MENU_OPTIONS.filter(
    (option) => option.kind !== 'status' || option.id !== status,
  );

export const ADS_STATUS_STYLES = {
  [ADS_STATUS.PENDING]: 'bg-[#fff7e6] text-[#b45309]',
  [ADS_STATUS.ACTIVE]: 'bg-[#e8f8ef] text-[#15803d]',
  [ADS_STATUS.REJECTED]: 'bg-[#fdecec] text-[#ee1c25]',
  [ADS_STATUS.EXPIRED]: 'bg-[#f1f2f4] text-[#687186]',
};

const BUSINESS_TYPE_LABEL_KEYS = {
  ONLINE: 'adminAds.businessTypes.online',
  LOCAL: 'adminAds.businessTypes.local',
};

const PAGE_NAME_LABEL_KEYS = {
  home: 'adminAds.pageNames.home',
  gallery: 'adminAds.pageNames.gallery',
  competitions: 'adminAds.pageNames.competitions',
  'buy photos': 'adminAds.pageNames.buyPhotos',
  'premium photos': 'adminAds.pageNames.premiumPhotos',
  leaderboard: 'adminAds.pageNames.leaderboard',
};

/**
 * @param {(key: string, options?: object) => string} t
 * @param {string | null | undefined} businessType
 */
export const getBusinessTypeLabel = (t, businessType) => {
  const key = BUSINESS_TYPE_LABEL_KEYS[String(businessType).toUpperCase()];
  return key ? t(key) : businessType || '—';
};

/**
 * @param {(key: string, options?: object) => string} t
 * @param {string | null | undefined} page
 */
export const getPageNameLabel = (t, page) => {
  const key = PAGE_NAME_LABEL_KEYS[String(page).trim().toLowerCase()];
  return key ? t(key) : page || '—';
};

/**
 * @param {(key: string, options?: object) => string} t
 * @param {string | null | undefined} status
 */
export const getStatusLabel = (t, status) =>
  t(`adminAds.status.${String(status).toLowerCase()}`, {
    defaultValue: status || '—',
  });

/**
 * @param {string | null | undefined} isoDate
 * @param {string} [locale]
 */
export const formatAdDate = (isoDate, locale) => {
  if (!isoDate) return '—';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
};

/** Duration → package price used when creating ads. */
export const AD_DURATION_PRICES = {
  7: 35,
  14: 60,
  30: 100,
};

/**
 * Parse Prisma Decimal / number / string amounts (same shape as payouts).
 * @param {unknown} amount
 * @returns {number | null}
 */
export const parseAdAmount = (amount) => {
  if (amount == null || amount === '') return null;
  if (typeof amount === 'number') {
    return Number.isFinite(amount) ? amount : null;
  }
  if (typeof amount === 'string') {
    const num = Number.parseFloat(amount.replace(/[^0-9.-]/g, ''));
    return Number.isFinite(num) ? num : null;
  }
  if (typeof amount === 'object') {
    if (typeof amount.toNumber === 'function') {
      try {
        const num = amount.toNumber();
        return Number.isFinite(num) ? num : null;
      } catch {
        // ignore
      }
    }
    if (Array.isArray(amount.d) && typeof amount.e === 'number') {
      const sign = amount.s ?? 1;
      const digitsStr = amount.d.join('');
      const num =
        sign *
        Number(digitsStr) *
        10 ** (amount.e - digitsStr.length + 1);
      return Number.isFinite(num) ? num : null;
    }
    if (typeof amount.value === 'number' || typeof amount.value === 'string') {
      return parseAdAmount(amount.value);
    }
  }
  return null;
};

/**
 * Resolve display amount from `amount`, or fall back to duration package price.
 * @param {{ amount?: unknown, durationDays?: number | string | null }} row
 * @returns {number | null}
 */
export const resolveAdAmount = (row) => {
  const fromAmount = parseAdAmount(row?.amount);
  if (fromAmount != null) return fromAmount;
  const days = Number(row?.durationDays);
  if (Number.isFinite(days) && AD_DURATION_PRICES[days] != null) {
    return AD_DURATION_PRICES[days];
  }
  return null;
};

/**
 * @param {unknown} amount
 * @param {string} [locale]
 * @param {{ fixedDecimals?: boolean, durationDays?: number | string | null }} [options]
 */
export const formatAdAmount = (
  amount,
  locale,
  { fixedDecimals = false, durationDays } = {},
) => {
  const value =
    parseAdAmount(amount) ??
    (durationDays != null
      ? AD_DURATION_PRICES[Number(durationDays)] ?? null
      : null);
  if (value == null) return '—';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: fixedDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(value);
};
