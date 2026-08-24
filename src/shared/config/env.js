export const IS_DEV = import.meta.env.DEV;
export const IS_PROD = import.meta.env.PROD;

export function envVar(name, fallback = '') {
  const viteKey = `VITE_${name}`;
  const legacyKey = `REACT_APP_${name}`;

  return import.meta.env[viteKey] ?? import.meta.env[legacyKey] ?? fallback;
}

export function envInt(name, fallback) {
  const value = envVar(name, String(fallback));
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}
