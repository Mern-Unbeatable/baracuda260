import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';
import { FOCUS_RING } from '@/shared/ui/sectionStyles';
import { scrollToPageTop } from '@/shared/utils/scrollToPageTop';
import { PAGINATION_WINDOW, paginationLabels } from './paginationLabels';

const ICON = 16;

const navBtn = `inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-[#f1f1f1] bg-white text-[#333333] transition hover:border-[#e5e7eb] hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-40 ${FOCUS_RING}`;

function pageBtn(active) {
  return active
    ? `inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-[#ee1c25] bg-[#ee1c25] text-[13px] font-semibold leading-none text-white shadow-sm ${FOCUS_RING}`
    : `inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-[#f1f1f1] bg-white text-[13px] font-semibold leading-none text-[#333333] transition hover:border-[#e5e7eb] hover:bg-[#f9fafb] ${FOCUS_RING}`;
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

  const page = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));

  const items = useMemo(() => {
    if (totalPages <= 1) return [1];
    if (totalPages <= 4) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (page <= 3) {
      return [1, 2, 3, '...', totalPages];
    }
    if (page >= totalPages - 2) {
      return [1, '...', totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', page - 1, page, page + 1, '...', totalPages];
  }, [page, totalPages]);

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
      <Button
        unstyled
        type="button"
        aria-label={i18n.firstPage}
        disabled={page <= 1}
        onClick={() => go(1)}
        className={navBtn}
      >
        <ChevronsLeft size={ICON} strokeWidth={2} aria-hidden="true" />
      </Button>
      <Button
        unstyled
        type="button"
        aria-label={i18n.previousPage}
        disabled={page <= 1}
        onClick={() => go(page - 1)}
        className={navBtn}
      >
        <ChevronLeft size={ICON} strokeWidth={2} aria-hidden="true" />
      </Button>
      {items.map((item, index) => {
        if (item === '...') {
          return (
            <span
              key={`ellipsis-${index}`}
              className="inline-flex size-8 items-center justify-center text-[14px] text-[#6b7280]"
              aria-hidden="true"
            >
              …
            </span>
          );
        }
        return (
          <Button
            unstyled
            key={item}
            type="button"
            aria-label={i18n.page?.(item) ?? `Page ${item}`}
            aria-current={page === item ? 'page' : undefined}
            onClick={() => go(item)}
            className={pageBtn(page === item)}
          >
            {item}
          </Button>
        );
      })}
      <Button
        unstyled
        type="button"
        aria-label={i18n.nextPage}
        disabled={page >= totalPages}
        onClick={() => go(page + 1)}
        className={navBtn}
      >
        <ChevronRight size={ICON} strokeWidth={2} aria-hidden="true" />
      </Button>
      <Button
        unstyled
        type="button"
        aria-label={i18n.lastPage}
        disabled={page >= totalPages}
        onClick={() => go(totalPages)}
        className={navBtn}
      >
        <ChevronsRight size={ICON} strokeWidth={2} aria-hidden="true" />
      </Button>
    </nav>
  );
}
