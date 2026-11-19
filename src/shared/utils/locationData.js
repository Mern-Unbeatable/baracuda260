import { City, Country } from 'country-state-city';

/**
 * Pre-sorted list of all countries in the world with flags and ISO codes.
 */
export const ALL_COUNTRIES = Country.getAllCountries()
  .map((c) => ({
    value: c.name,
    label: c.name,
    flag: c.flag,
    isoCode: c.isoCode,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

const cityCache = new Map();

/**
 * Get unique, sorted list of cities for a given country ISO code.
 * Cached in memory so subsequent lookups are instantaneous.
 *
 * @param {string} isoCode - e.g. "GB", "PL", "US"
 * @returns {Array<{ value: string, label: string }>}
 */
export function getCitiesForCountry(isoCode) {
  if (!isoCode) return [];
  const upper = String(isoCode).trim().toUpperCase();
  if (cityCache.has(upper)) {
    return cityCache.get(upper);
  }

  const raw = City.getCitiesOfCountry(upper) || [];
  const uniqueNames = Array.from(new Set(raw.map((c) => c.name))).sort((a, b) =>
    a.localeCompare(b),
  );

  const formatted = uniqueNames.map((name) => ({
    value: name,
    label: name,
  }));

  cityCache.set(upper, formatted);
  return formatted;
}

/**
 * Find country object by either country name or ISO code.
 * Supports common variations like "UK", "USA".
 *
 * @param {string} countryNameOrCode
 * @returns {{ value: string, label: string, flag: string, isoCode: string } | null}
 */
export function findCountryByNameOrCode(countryNameOrCode) {
  if (!countryNameOrCode) return null;
  const q = String(countryNameOrCode).trim().toLowerCase();
  if (!q) return null;

  if (q === 'uk') {
    return ALL_COUNTRIES.find((c) => c.isoCode === 'GB') || null;
  }
  if (q === 'usa') {
    return ALL_COUNTRIES.find((c) => c.isoCode === 'US') || null;
  }

  return (
    ALL_COUNTRIES.find(
      (c) =>
        c.name.toLowerCase() === q ||
        c.isoCode.toLowerCase() === q,
    ) || null
  );
}
