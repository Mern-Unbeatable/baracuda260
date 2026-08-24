/** Shared aria labels for Pagination (gallery / winners / …). */
export function paginationLabels(t) {
  return {
    firstPage: t('gallery.firstPage'),
    previousPage: t('gallery.previousPage'),
    nextPage: t('gallery.nextPage'),
    lastPage: t('gallery.lastPage'),
    page: (n) => t('gallery.page', { page: n }),
  };
}

export const PAGINATION_WINDOW = 3;
