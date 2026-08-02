/** Shared chrome assets for Figma marketing pages */
const A = '/assets/home';

export const SITE_ASSET_BASE = A;

export const SITE_ASSETS = {
  logo: `${A}/logo.png`,
  logoFooter: `${A}/logo-footer.png`,
  chevron: `${A}/chevron-down.svg`,
  mail: `${A}/icon-mail.svg`,
  ig: `${A}/icon-ig.svg`,
  fb: `${A}/icon-fb.svg`,
  x: `${A}/icon-x.svg`,
  newsletterBg: `${A}/newsletter-bg.png`,
};

/** Build a path under /assets/home */
export const homeAsset = (file) => `${A}/${file}`;
