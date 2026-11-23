import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import React, { memo } from 'react';
import Button from '@/components/ui/Button';

const PAGINATION_ICON_SIZE = 16;

/**
 * Build a compact page list with ellipses, e.g. [1, 2, 3, '…', 12].
 * Avoids the old hardcoded `1 2 3 … last` which duplicated the last page
 * whenever totalPages ≤ 3.
 *
 * @param {number} current
 * @param {number} total
 * @returns {Array<number | '…'>}
 */
const buildPageItems = (current, total) => {
  const safeTotal = Math.max(1, Number(total) || 1);
  const safeCurrent = Math.min(Math.max(1, Number(current) || 1), safeTotal);

  if (safeTotal <= 7) {
    return Array.from({ length: safeTotal }, (_, i) => i + 1);
  }

  const items = new Set([1, safeTotal, safeCurrent]);
  for (let delta = 1; delta <= 1; delta += 1) {
    if (safeCurrent - delta > 1) items.add(safeCurrent - delta);
    if (safeCurrent + delta < safeTotal) items.add(safeCurrent + delta);
  }

  // Keep a bit more context near the edges
  if (safeCurrent <= 3) {
    items.add(2);
    items.add(3);
    items.add(4);
  }
  if (safeCurrent >= safeTotal - 2) {
    items.add(safeTotal - 1);
    items.add(safeTotal - 2);
    items.add(safeTotal - 3);
  }

  const sorted = [...items].sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < sorted.length; i += 1) {
    const pageNumber = sorted[i];
    if (i > 0 && pageNumber - sorted[i - 1] > 1) {
      result.push('…');
    }
    result.push(pageNumber);
  }
  return result;
};

/**
 * @param {{
 *   label: string,
 *   onClick: () => void,
 *   disabled?: boolean,
 *   active?: boolean,
 *   children: React.ReactNode,
 * }} props
 */
const PaginationControl = memo(
  ({ label, onClick, disabled, children, active = false }) => (
    <Button
      unstyled
      type="button"
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border p-2.5 text-[13px] font-semibold leading-none transition ${
        active
          ? 'border-[#ee1c25] bg-[#ee1c25] text-white'
          : 'border-[#f1f1f1] bg-white text-[#333333] hover:border-[#e5e7eb] hover:bg-[#f9fafb]'
      } disabled:cursor-not-allowed disabled:opacity-40`}
    >
      {children}
    </Button>
  ),
);

PaginationControl.displayName = 'PaginationControl';

/**
 * @param {{
 *   variant: 'users',
 *   from: number,
 *   to: number,
 *   total: number,
 *   isFirstPage: boolean,
 *   isLastPage: boolean,
 *   onPrevious: () => void,
 *   onNext: () => void,
 *   showingText: string,
 *   previousLabel: string,
 *   nextLabel: string,
 * } | {
 *   variant: 'businessLink',
 *   from: number,
 *   to: number,
 *   total: number,
 *   isFirstPage: boolean,
 *   isLastPage: boolean,
 *   onPrevious: () => void,
 *   onNext: () => void,
 *   showingText: string,
 *   previousLabel: string,
 *   nextLabel: string,
 *   navAriaLabel: string,
 * } | {
 *   variant: 'payouts',
 *   count: number,
 *   total: number,
 *   page: number,
 *   pageNumbers: number[],
 *   isFirstPage: boolean,
 *   isLastPage: boolean,
 *   onPrevious: () => void,
 *   onNext: () => void,
 *   onSelectPage: (page: number) => void,
 *   showingText: string,
 *   navAriaLabel: string,
 *   previousAriaLabel: string,
 *   nextAriaLabel: string,
 *   pageAriaLabel: (page: number) => string,
 * } | {
 *   variant: 'comment',
 *   count: number,
 *   total: number,
 *   page: number,
 *   pageNumbers: number[],
 *   isFirstPage: boolean,
 *   isLastPage: boolean,
 *   onPrevious: () => void,
 *   onNext: () => void,
 *   onSelectPage: (page: number) => void,
 *   showingText: string,
 *   navAriaLabel: string,
 *   previousAriaLabel: string,
 *   nextAriaLabel: string,
 *   pageAriaLabel: (page: number) => string,
 * } | {
 *   variant: 'ads',
 *   from: number,
 *   to: number,
 *   total: number,
 *   isFirstPage: boolean,
 *   isLastPage: boolean,
 *   onPrevious: () => void,
 *   onNext: () => void,
 *   showingText: string,
 *   previousLabel: string,
 *   nextLabel: string,
 *   navAriaLabel: string,
 * } | {
 *   variant: 'submissions',
 *   page: number,
 *   totalPages: number,
 *   onPageChange: (page: number) => void,
 *   navAriaLabel: string,
 *   firstLabel: string,
 *   prevLabel: string,
 *   nextLabel: string,
 *   lastLabel: string,
 *   pageLabel: (page: number) => string,
 * } | {
 *   variant: 'competitions',
 *   page: number,
 *   totalPages: number,
 *   onPageChange: (page: number) => void,
 *   navAriaLabel: string,
 *   firstLabel: string,
 *   prevLabel: string,
 *   nextLabel: string,
 *   lastLabel: string,
 *   pageLabel: (page: number) => string,
 * }} props
 */
const AdminPagination = memo((props) => {
  if (props.variant === 'users') {
    const {
      isFirstPage,
      isLastPage,
      onPrevious,
      onNext,
      showingText,
      previousLabel,
      nextLabel,
    } = props;

    return (
      <div className="flex flex-col items-center gap-2.5 px-3 py-3 text-center md:flex-row md:items-center md:justify-between md:gap-3 md:px-4 md:text-left">
        <p className="text-[13px] leading-5 text-[#64748b]">
          {showingText}
        </p>
        <div className="flex items-center justify-center gap-2">
          <Button
            unstyled
            type="button"
            disabled={isFirstPage}
            onClick={onPrevious}
            className="cursor-pointer rounded-lg border border-[#cbd5e1] bg-white px-3 py-1.5 text-[13px] font-semibold capitalize text-[#475569] transition hover:border-[#4048cd] hover:bg-[#eff1fe] hover:text-[#4048cd] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {previousLabel}
          </Button>
          <Button
            unstyled
            type="button"
            disabled={isLastPage}
            onClick={onNext}
            className="cursor-pointer rounded-lg border border-[#4048cd] bg-white px-3 py-1.5 text-[13px] font-semibold capitalize text-[#4048cd] transition hover:bg-[#eff1fe] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {nextLabel}
          </Button>
        </div>
      </div>
    );
  }

  if (props.variant === 'businessLink') {
    const {
      isFirstPage,
      isLastPage,
      onPrevious,
      onNext,
      showingText,
      previousLabel,
      nextLabel,
      navAriaLabel,
    } = props;
    const btnClass =
      'inline-flex cursor-pointer items-center justify-center rounded-[12px] border border-[#4048cd] px-4 py-2 text-[16px] font-medium capitalize text-[#4048cd] transition hover:bg-[#f6fbff] disabled:cursor-not-allowed disabled:opacity-40';

    return (
      <div className="flex flex-col items-center gap-3 px-4 py-5 sm:flex-row sm:justify-between sm:px-4">
        <p className="text-center text-[16px] leading-normal text-[#4048cd] sm:text-left">
          {showingText}
        </p>
        <div
          className="flex items-center justify-center gap-2"
          role="navigation"
          aria-label={navAriaLabel}
        >
          <Button
            unstyled
            type="button"
            disabled={isFirstPage}
            onClick={onPrevious}
            className={btnClass}
          >
            {previousLabel}
          </Button>
          <Button
            unstyled
            type="button"
            disabled={isLastPage}
            onClick={onNext}
            className={btnClass}
          >
            {nextLabel}
          </Button>
        </div>
      </div>
    );
  }

  if (props.variant === 'payouts') {
    const {
      page,
      pageNumbers,
      isFirstPage,
      isLastPage,
      onPrevious,
      onNext,
      onSelectPage,
      showingText,
      navAriaLabel,
      previousAriaLabel,
      nextAriaLabel,
      pageAriaLabel,
    } = props;
    const pageBtnBase =
      'inline-flex cursor-pointer items-center justify-center rounded-[6px] px-[9px] py-[5px] text-[13px] leading-[19px] transition';

    return (
      <div className="flex flex-col items-center gap-3 border-t border-[#e8ebf1] px-4.5 pb-[15.5px] pt-4.25 sm:flex-row sm:justify-between">
        <p className="text-center text-[13px] font-normal leading-4.75 text-[#8b95a5] sm:text-left">
          {showingText}
        </p>
        <div
          className="flex items-center justify-center gap-1"
          role="navigation"
          aria-label={navAriaLabel}
        >
          <Button
            unstyled
            type="button"
            disabled={isFirstPage}
            aria-label={previousAriaLabel}
            onClick={onPrevious}
            className={`${pageBtnBase} text-[#7b8596] hover:bg-[#f6fbff] disabled:cursor-not-allowed disabled:opacity-40`}
          >
            ←
          </Button>
          {pageNumbers.map((pageNumber) => {
            const active = pageNumber === page;
            return (
              <Button
                unstyled
                key={pageNumber}
                type="button"
                aria-label={pageAriaLabel(pageNumber)}
                aria-current={active ? 'page' : undefined}
                onClick={() => onSelectPage(pageNumber)}
                className={`${pageBtnBase} ${
                  active
                    ? 'bg-[#edf3ff] font-extrabold text-[#2b65d1]'
                    : 'font-normal text-[#7b8596] hover:bg-[#f6fbff]'
                }`}
              >
                {pageNumber}
              </Button>
            );
          })}
          <Button
            unstyled
            type="button"
            disabled={isLastPage}
            aria-label={nextAriaLabel}
            onClick={onNext}
            className={`${pageBtnBase} text-[#7b8596] hover:bg-[#f6fbff] disabled:cursor-not-allowed disabled:opacity-40`}
          >
            →
          </Button>
        </div>
      </div>
    );
  }

  if (props.variant === 'ads') {
    const {
      isFirstPage,
      isLastPage,
      onPrevious,
      onNext,
      showingText,
      previousLabel,
      nextLabel,
      navAriaLabel,
    } = props;
    const btnClass =
      'inline-flex cursor-pointer items-center justify-center rounded-[12px] border border-[#c8960c] px-4 py-2 text-[16px] font-medium capitalize text-[#c8960c] transition hover:bg-[#fffbeb] disabled:cursor-not-allowed disabled:opacity-40';

    return (
      <div className="flex flex-col items-center gap-3 px-5 py-4 sm:flex-row sm:justify-between">
        <p className="text-center text-[16px] leading-normal text-[#c8960c] sm:text-left">
          {showingText}
        </p>
        <div
          className="flex items-center justify-center gap-2"
          role="navigation"
          aria-label={navAriaLabel}
        >
          <Button
            unstyled
            type="button"
            disabled={isFirstPage}
            onClick={onPrevious}
            className={btnClass}
          >
            {previousLabel}
          </Button>
          <Button
            unstyled
            type="button"
            disabled={isLastPage}
            onClick={onNext}
            className={btnClass}
          >
            {nextLabel}
          </Button>
        </div>
      </div>
    );
  }

  if (props.variant === 'comment') {
    const {
      page,
      pageNumbers,
      isFirstPage,
      isLastPage,
      onPrevious,
      onNext,
      onSelectPage,
      showingText,
      navAriaLabel,
      previousAriaLabel,
      nextAriaLabel,
      pageAriaLabel,
    } = props;

    return (
      <div className="flex flex-col items-center gap-3 border-t border-[#f3f4f6] px-5 py-3.5 sm:flex-row sm:justify-between">
        <p className="text-center text-[12px] leading-4.5 text-[#9ca3af] sm:text-left">
          {showingText}
        </p>
        <div
          className="flex items-center gap-1"
          role="navigation"
          aria-label={navAriaLabel}
        >
          <Button
            unstyled
            type="button"
            disabled={isFirstPage}
            aria-label={previousAriaLabel}
            onClick={onPrevious}
            className="inline-flex size-7.5 cursor-pointer items-center justify-center rounded-[7px] border border-[#e5e7eb] text-[12px] text-[#6b7280] disabled:cursor-not-allowed disabled:opacity-40"
          >
            ←
          </Button>
          {pageNumbers.map((pageNumber) => {
            const active = pageNumber === page;
            return (
              <Button
                unstyled
                key={pageNumber}
                type="button"
                aria-label={pageAriaLabel(pageNumber)}
                aria-current={active ? 'page' : undefined}
                onClick={() => onSelectPage(pageNumber)}
                className={`inline-flex size-7.5 cursor-pointer items-center justify-center rounded-[7px] border text-[12px] font-semibold leading-4.5 ${
                  active
                    ? 'border-[#111827] bg-[#111827] text-white'
                    : 'border-[#e5e7eb] bg-white text-[#6b7280] hover:bg-[#f9fafb]'
                }`}
              >
                {pageNumber}
              </Button>
            );
          })}
          <Button
            unstyled
            type="button"
            disabled={isLastPage}
            aria-label={nextAriaLabel}
            onClick={onNext}
            className="inline-flex size-7.5 cursor-pointer items-center justify-center rounded-[7px] border border-[#e5e7eb] text-[12px] text-[#6b7280] disabled:cursor-not-allowed disabled:opacity-40"
          >
            →
          </Button>
        </div>
      </div>
    );
  }

  const {
    page,
    totalPages,
    onPageChange,
    navAriaLabel,
    firstLabel,
    prevLabel,
    nextLabel,
    lastLabel,
    pageLabel,
  } = props;
  const isFirstPage = page <= 1;
  const isLastPage = page >= totalPages;
  const pageItems = buildPageItems(page, totalPages);
  const ellipsisClassName =
    'inline-flex size-8 items-center justify-center rounded-lg border border-[#f1f1f1] bg-white text-[13px] leading-none text-[#6b7280]';

  return (
    <nav
      aria-label={navAriaLabel}
      className="flex flex-wrap items-center justify-center gap-1.5"
    >
      <PaginationControl
        label={firstLabel}
        disabled={isFirstPage}
        onClick={() => onPageChange(1)}
      >
        <ChevronsLeft
          size={PAGINATION_ICON_SIZE}
          strokeWidth={2}
          aria-hidden="true"
          className="text-[#333333]"
        />
      </PaginationControl>
      <PaginationControl
        label={prevLabel}
        disabled={isFirstPage}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft
          size={PAGINATION_ICON_SIZE}
          strokeWidth={2}
          aria-hidden="true"
          className="text-[#333333]"
        />
      </PaginationControl>

      {pageItems.map((item, index) =>
        item === '…' ? (
          <span
            key={`ellipsis-${index}`}
            className={ellipsisClassName}
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <PaginationControl
            key={item}
            label={pageLabel(item)}
            active={page === item}
            onClick={() => onPageChange(item)}
          >
            {item}
          </PaginationControl>
        ),
      )}

      <PaginationControl
        label={nextLabel}
        disabled={isLastPage}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight
          size={PAGINATION_ICON_SIZE}
          strokeWidth={2}
          aria-hidden="true"
          className="text-[#333333]"
        />
      </PaginationControl>
      <PaginationControl
        label={lastLabel}
        disabled={isLastPage}
        onClick={() => onPageChange(totalPages)}
      >
        <ChevronsRight
          size={PAGINATION_ICON_SIZE}
          strokeWidth={2}
          aria-hidden="true"
          className="text-[#333333]"
        />
      </PaginationControl>
    </nav>
  );
});

AdminPagination.displayName = 'AdminPagination';

export default AdminPagination;
