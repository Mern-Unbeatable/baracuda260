/** Scroll window and common nested scroll containers to the top. */
export function scrollToPageTop(behavior = 'smooth') {
  window.scrollTo({ top: 0, left: 0, behavior });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  document.querySelectorAll('[data-lenis-prevent], main .overflow-y-auto').forEach((el) => {
    el.scrollTop = 0;
  });
}
