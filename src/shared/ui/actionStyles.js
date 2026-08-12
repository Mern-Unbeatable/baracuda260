/** Shared action button scale — one place to tune padding/size app-wide. */
export const ACTION_BTN_BASE =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full text-[15px] font-semibold leading-tight transition';

export const ACTION_BTN_PRIMARY = [
  ACTION_BTN_BASE,
  'bg-[#ee1c25] px-5 py-2 text-white hover:bg-[#d91921] active:scale-[0.98]',
].join(' ');

export const ACTION_BTN_SECONDARY = [
  ACTION_BTN_BASE,
  'bg-[#f5f5f5] px-5 py-2 text-[#0d0d14] hover:bg-[#ececec]',
].join(' ');

export const ACTION_BTN_MUTED = [
  ACTION_BTN_BASE,
  'border border-[#4048cd]/20 bg-[#ecedfa] px-5 py-2 text-[#4048cd] hover:bg-[#e0e2f5]',
].join(' ');

export const ACTION_BTN_GHOST = [
  ACTION_BTN_BASE,
  'border border-black/10 bg-white px-5 py-2 text-[#0d0d14] hover:bg-[#f3f4f6]',
].join(' ');

/** Vertical rhythm for stacked page blocks (detail pages, forms). */
export const PAGE_STACK = 'flex flex-col gap-6 sm:gap-8';
