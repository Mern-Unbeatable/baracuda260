import React, { memo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { PAGINATION_ICON_SIZE, PAGINATION_LEADING_PAGES } from '@/portals/admin/data/adminSubmissionsData';

/**
 * @param {{
 *   label: string,
 *   onClick: () => void,
 *   disabled?: boolean,
 *   active?: boolean,
 *   children: React.ReactNode,
 * }} props
 */
const PaginationControl = memo(({ label, onClick, disabled, children, active = false }) => (
  <button
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
  </button>
));

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
      from,
      to,
      total,
      isFirstPage,
      isLastPage,
      onPrevious,
      onNext,
      showingText,
      previousLabel,
      nextLabel,
    } = props;

    return (
      <div className="flex flex-col items-center gap-3 px-4 py-4 text-center md:h-16.75 md:flex-row md:items-center md:justify-between md:gap-4 md:text-left">
        <p className="px-2.5 text-[16px] leading-normal text-[#4048cd]">{showingText}</p>
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={isFirstPage}
            onClick={onPrevious}
            className="cursor-pointer rounded-xl border border-[#4048cd] px-4 py-2 text-[16px] font-medium capitalize text-[#4048cd] transition hover:bg-[#f6fbff] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {previousLabel}
          </button>
          <button
            type="button"
            disabled={isLastPage}
            onClick={onNext}
            className="cursor-pointer rounded-xl border border-[#4048cd] px-4 py-2 text-[16px] font-medium capitalize text-[#4048cd] transition hover:bg-[#f6fbff] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {nextLabel}
          </button>
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
          <button type="button" disabled={isFirstPage} onClick={onPrevious} className={btnClass}>
            {previousLabel}
          </button>
          <button type="button" disabled={isLastPage} onClick={onNext} className={btnClass}>
            {nextLabel}
          </button>
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
          <button
            type="button"
            disabled={isFirstPage}
            aria-label={previousAriaLabel}
            onClick={onPrevious}
            className={`${pageBtnBase} text-[#7b8596] hover:bg-[#f6fbff] disabled:cursor-not-allowed disabled:opacity-40`}
          >
            ←
          </button>
          {pageNumbers.map((pageNumber) => {
            const active = pageNumber === page;
            return (
              <button
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
              </button>
            );
          })}
          <button
            type="button"
            disabled={isLastPage}
            aria-label={nextAriaLabel}
            onClick={onNext}
            className={`${pageBtnBase} text-[#7b8596] hover:bg-[#f6fbff] disabled:cursor-not-allowed disabled:opacity-40`}
          >
            →
          </button>
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
          <button
            type="button"
            disabled={isFirstPage}
            aria-label={previousAriaLabel}
            onClick={onPrevious}
            className="inline-flex size-7.5 cursor-pointer items-center justify-center rounded-[7px] border border-[#e5e7eb] text-[12px] text-[#6b7280] disabled:cursor-not-allowed disabled:opacity-40"
          >
            ←
          </button>
          {pageNumbers.map((pageNumber) => {
            const active = pageNumber === page;
            return (
              <button
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
              </button>
            );
          })}
          <button
            type="button"
            disabled={isLastPage}
            aria-label={nextAriaLabel}
            onClick={onNext}
            className="inline-flex size-7.5 cursor-pointer items-center justify-center rounded-[7px] border border-[#e5e7eb] text-[12px] text-[#6b7280] disabled:cursor-not-allowed disabled:opacity-40"
          >
            →
          </button>
        </div>
      </div>
    );
  }

  const {
    variant,
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
  const ellipsisClassName =
    variant === 'competitions'
      ? 'inline-flex size-8 items-center justify-center rounded-[8px] border border-[#f1f1f1] bg-white text-[14px] leading-none text-[#6b7280]'
      : 'inline-flex size-8 items-center justify-center rounded-[8px] border border-[#f1f1f1] bg-white text-[13px] leading-none text-[#333333]';

  return (
    <nav
      aria-label={navAriaLabel}
      className="flex flex-wrap items-center justify-center gap-1.25"
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

      {PAGINATION_LEADING_PAGES.map((pageNumber) => (
        <PaginationControl
          key={pageNumber}
          label={pageLabel(pageNumber)}
          active={page === pageNumber}
          onClick={() => onPageChange(pageNumber)}
        >
          {pageNumber}
        </PaginationControl>
      ))}

      <span className={ellipsisClassName} aria-hidden="true">
        …
      </span>

      <PaginationControl
        label={pageLabel(totalPages)}
        active={page === totalPages}
        onClick={() => onPageChange(totalPages)}
      >
        {totalPages}
      </PaginationControl>

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
