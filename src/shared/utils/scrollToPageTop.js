/** Scroll window and common nested scroll containers to the top. */
export function scrollToPageTop(behavior = 'auto') {
  if (typeof window === 'undefined') return;

  try {
    window.scrollTo({ top: 0, left: 0, behavior });
  } catch {
    window.scrollTo(0, 0);
  }

  if (document.documentElement) document.documentElement.scrollTop = 0;
  if (document.body) document.body.scrollTop = 0;

  document
    .querySelectorAll('[data-lenis-prevent], main .overflow-y-auto')
    .forEach((el) => {
      try {
        el.scrollTo({ top: 0, left: 0, behavior });
      } catch {
        el.scrollTop = 0;
      }
      el.scrollTop = 0;
    });
}
