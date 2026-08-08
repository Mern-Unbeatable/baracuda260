/** Shared aria labels for MarketingPagination (gallery / winners / …). */
export function marketingPaginationLabels(t) {
  return {
    firstPage: t('gallery.firstPage'),
    previousPage: t('gallery.previousPage'),
    nextPage: t('gallery.nextPage'),
    lastPage: t('gallery.lastPage'),
    page: (n) => t('gallery.page', { page: n }),
  };
}

export const MARKETING_PAGINATION_WINDOW = 3;
