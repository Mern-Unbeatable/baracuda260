import { useTranslation } from 'react-i18next';
import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { scrollToPageTop } from '@/shared/utils/scrollToPageTop';
import { FOCUS_RING } from '@/shared/ui/sectionStyles';
import { paginationLabels, PAGINATION_WINDOW } from './paginationLabels';

const ICON = 16;

const navBtn = `inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#f1f1f1] bg-white text-[#333333] transition hover:border-[#e5e7eb] hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-40 ${FOCUS_RING}`;

function pageBtn(active) {
  return active
    ? `inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#ee1c25] bg-[#ee1c25] text-[13px] font-semibold leading-none text-white shadow-sm ${FOCUS_RING}`
    : `inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#f1f1f1] bg-white text-[13px] font-semibold leading-none text-[#333333] transition hover:border-[#e5e7eb] hover:bg-[#f9fafb] ${FOCUS_RING}`;
}

/** Gallery-style pagination: first/prev/numbers/…/last/next. */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  windowSize = PAGINATION_WINDOW,
  ariaLabel,
  labels,
  className = '',
}) {
  const { t } = useTranslation();
  const i18n = labels ?? paginationLabels(t);

  const page = Math.min(Math.max(1, currentPage), totalPages);

  const windowPages = useMemo(() => {
    const start = Math.min(page, Math.max(1, totalPages - windowSize + 1));
    return Array.from({ length: windowSize }, (_, i) => start + i).filter((n) => n <= totalPages);
  }, [page, totalPages, windowSize]);

  const showEllipsis = windowPages.length > 0 && windowPages[windowPages.length - 1] < totalPages;

  const go = (next) => {
    const target = Math.min(Math.max(1, next), totalPages);
    if (target === page) return;
    onPageChange(target);
    scrollToPageTop();
  };

  return (
    <nav
      aria-label={ariaLabel}
      className={`flex flex-wrap items-center justify-center gap-1.25 ${className}`.trim()}
    >
      <button
        type="button"
        aria-label={i18n.firstPage}
        disabled={page <= 1}
        onClick={() => go(1)}
        className={navBtn}
      >
        <ChevronsLeft size={ICON} strokeWidth={2} aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label={i18n.previousPage}
        disabled={page <= 1}
        onClick={() => go(page - 1)}
        className={navBtn}
      >
        <ChevronLeft size={ICON} strokeWidth={2} aria-hidden="true" />
      </button>
      {windowPages.map((n) => (
        <button
          key={n}
          type="button"
          aria-label={i18n.page?.(n) ?? `Page ${n}`}
          aria-current={page === n ? 'page' : undefined}
          onClick={() => go(n)}
          className={pageBtn(page === n)}
        >
          {n}
        </button>
      ))}
      {showEllipsis ? (
        <>
          <span
            className="inline-flex size-8 items-center justify-center text-[14px] text-[#6b7280]"
            aria-hidden="true"
          >
            …
          </span>
          <button
            type="button"
            aria-label={i18n.page?.(totalPages) ?? `Page ${totalPages}`}
            aria-current={page === totalPages ? 'page' : undefined}
            onClick={() => go(totalPages)}
            className={pageBtn(page === totalPages)}
          >
            {totalPages}
          </button>
        </>
      ) : null}
      <button
        type="button"
        aria-label={i18n.nextPage}
        disabled={page >= totalPages}
        onClick={() => go(page + 1)}
        className={navBtn}
      >
        <ChevronRight size={ICON} strokeWidth={2} aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label={i18n.lastPage}
        disabled={page >= totalPages}
        onClick={() => go(totalPages)}
        className={navBtn}
      >
        <ChevronsRight size={ICON} strokeWidth={2} aria-hidden="true" />
      </button>
    </nav>
  );
}
