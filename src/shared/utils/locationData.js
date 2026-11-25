import { City, Country, State } from 'country-state-city';

/**
 * Pre-sorted list of all countries in the world with flags and ISO codes.
 */
export const ALL_COUNTRIES = (Country.getAllCountries() || [])
  .map((c) => ({
    name: c.name || '',
    value: c.name || '',
    label: c.name || '',
    flag: c.flag || '',
    isoCode: c.isoCode || '',
  }))
  .sort((a, b) => (a.label || '').localeCompare(b.label || ''));

const cityCache = new Map();
const stateCache = new Map();

/**
 * Get unique, sorted list of states/provinces for a country ISO code.
 *
 * @param {string} isoCode - e.g. "GB", "PL", "US"
 * @returns {Array<{ value: string, label: string, isoCode: string }>}
 */
export function getStatesForCountry(isoCode) {
  if (!isoCode) return [];
  const upper = String(isoCode).trim().toUpperCase();
  if (stateCache.has(upper)) {
    return stateCache.get(upper);
  }

  const raw = State.getStatesOfCountry(upper) || [];
  const formatted = raw
    .map((s) => ({
      value: s.name || '',
      label: s.name || '',
      isoCode: s.isoCode || '',
    }))
    .filter((s) => s.value)
    .sort((a, b) => a.label.localeCompare(b.label));

  stateCache.set(upper, formatted);
  return formatted;
}

/**
 * Get unique, sorted list of cities for a given country ISO code.
 * Cached in memory so subsequent lookups are instantaneous.
 *
 * @param {string} isoCode - e.g. "GB", "PL", "US"
 * @param {string} [stateIsoCode] - optional state filter, e.g. "CA"
 * @returns {Array<{ value: string, label: string }>}
 */
export function getCitiesForCountry(isoCode, stateIsoCode) {
  if (!isoCode) return [];
  const upper = String(isoCode).trim().toUpperCase();
  const stateUpper = stateIsoCode
    ? String(stateIsoCode).trim().toUpperCase()
    : '';
  const cacheKey = stateUpper ? `${upper}:${stateUpper}` : upper;
  if (cityCache.has(cacheKey)) {
    return cityCache.get(cacheKey);
  }

  // Some packages list admin divisions that have no city rows (e.g. BD
  // "Dhaka Division"). Fall back to country-level cities so the dropdown
  // still has searchable options.
  let raw = stateUpper
    ? City.getCitiesOfState(upper, stateUpper) || []
    : City.getCitiesOfCountry(upper) || [];
  if (stateUpper && raw.length === 0) {
    raw = City.getCitiesOfCountry(upper) || [];
  }
  const uniqueNames = Array.from(
    new Set(raw.map((c) => (c.name || '').trim()).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b));

  const formatted = uniqueNames.map((name) => ({
    value: name,
    label: name,
  }));

  cityCache.set(cacheKey, formatted);
  return formatted;
}

/**
 * Find country object by either country name or ISO code.
 * Supports common variations like "UK", "USA".
 *
 * @param {string} countryNameOrCode
 * @returns {{ name: string, value: string, label: string, flag: string, isoCode: string } | null}
 */
export function findCountryByNameOrCode(countryNameOrCode) {
  if (!countryNameOrCode) return null;
  const q = String(countryNameOrCode).trim().toLowerCase();
  if (!q) return null;

  if (q === 'uk') {
    return ALL_COUNTRIES.find((c) => (c.isoCode || '').toUpperCase() === 'GB') || null;
  }
  if (q === 'usa') {
    return ALL_COUNTRIES.find((c) => (c.isoCode || '').toUpperCase() === 'US') || null;
  }

  return (
    ALL_COUNTRIES.find(
      (c) =>
        (c.name && c.name.toLowerCase() === q) ||
        (c.value && c.value.toLowerCase() === q) ||
        (c.label && c.label.toLowerCase() === q) ||
        (c.isoCode && c.isoCode.toLowerCase() === q),
    ) || null
  );
}
