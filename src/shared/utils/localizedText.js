/**
 * Backend text fields are localized objects, e.g. `{ en: 'Nature' }`.
 * @param {Record<string, string> | string | null | undefined} value
 * @param {string} [language]
 */
export const getLocalizedText = (value, language) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  const baseLanguage = language?.split('-')[0];
  return (
    value[baseLanguage] ?? value.en ?? Object.values(value).find(Boolean) ?? ''
  );
};
