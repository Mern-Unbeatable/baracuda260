/**
 * Legal page section renderer helpers.
 * Copy lives in i18n locales (`privacy` / `terms` / `cookies`).
 */

/** Normalize i18next returnObjects value to an array of strings. */
export const asStringList = (value) => {
  if (Array.isArray(value)) return value.filter((item) => typeof item === 'string');
  if (typeof value === 'string' && value.length > 0) return [value];
  return [];
};

/** Read a legal page tree from i18n (`privacy` | `terms` | `cookies`). */
export const readLegalPage = (t, namespace) => {
  const sectionsRaw = t(`${namespace}.sections`, { returnObjects: true });
  const sections = Array.isArray(sectionsRaw) ? sectionsRaw : [];

  return {
    title: t(`${namespace}.title`),
    lastUpdated: t(`${namespace}.lastUpdated`),
    intro: t(`${namespace}.intro`, { defaultValue: '' }),
    sections: sections.map((section) => ({
      id: section.id,
      title: section.title,
      leads: asStringList(section.leads),
      paragraphs: asStringList(section.paragraphs),
      listIntro: typeof section.listIntro === 'string' ? section.listIntro : '',
      bullets: asStringList(section.bullets),
      footnotes: asStringList(section.footnotes),
      lead: typeof section.lead === 'string' ? section.lead : '',
    })),
  };
};
