// Runs synchronously before React mounts to prevent a dark-mode flash.
// Kept as a separate file so the CSP can use script-src 'self' without
// requiring 'unsafe-inline'.
(function () {
  try {
    var t = localStorage.getItem('theme');
    if (t === 'dark') document.documentElement.classList.add('dark');
  } catch {
    /* ignore */
  }
})();
