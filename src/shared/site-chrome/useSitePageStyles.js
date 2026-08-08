import { useEffect } from 'react';
import { MANROPE_FONT_HREF, SITE_MARQUEE_DURATION_S } from './siteCopy';

const FONT_ATTR = 'data-manrope-font';
const STYLE_ATTR = 'data-site-page-layout';

/**
 * Injects Manrope + site-page layout CSS once.
 * Style tag is removed when the last site page unmounts; font link stays (shared).
 */
export default function useSitePageStyles() {
  useEffect(() => {
    if (!document.querySelector(`link[${FONT_ATTR}]`)) {
      const font = document.createElement('link');
      font.rel = 'stylesheet';
      font.href = MANROPE_FONT_HREF;
      font.setAttribute(FONT_ATTR, 'true');
      document.head.appendChild(font);
    }

    if (!document.querySelector(`style[${STYLE_ATTR}]`)) {
      const style = document.createElement('style');
      style.setAttribute(STYLE_ATTR, 'true');
      style.textContent = `
        .min-h-screen:has(.site-page-root) > nav { display: none !important; }
        .min-h-screen:has(.site-page-root) > main {
          max-width: none !important;
          width: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        .min-h-screen:has(.site-page-root) { background: #fff !important; }
        .site-page-root { font-family: Manrope, sans-serif; color: var(--primary-text-heading-color, #212133); }
        @keyframes site-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .site-marquee-track { animation: site-marquee ${SITE_MARQUEE_DURATION_S}s linear infinite; }
      `;
      document.head.appendChild(style);
    }

    let rafId = 0;
    return () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!document.querySelector('.site-page-root')) {
          document.querySelector(`style[${STYLE_ATTR}]`)?.remove();
        }
      });
    };
  }, []);
}
