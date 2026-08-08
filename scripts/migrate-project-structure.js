/**
 * One-time migration: flat components/ → features/ + shared/ + app/ + layouts/ + pages/{public,auth,app}
 * Run: node scripts/migrate-project-structure.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');

const FEATURE_MAP = {
  home: 'marketing-home',
  about: 'marketing-about',
  contact: 'marketing-contact',
  services: 'marketing-services',
  gallery: 'marketing-gallery',
  competitions: 'competitions',
  competitionDetails: 'competition-details',
  leaderboard: 'leaderboard',
  winners: 'winners',
  privacy: 'legal',
  terms: 'legal',
  cookies: 'legal',
  legal: 'legal',
  login: 'auth',
  signup: 'auth',
  auth: 'auth',
  dashboard: 'member-dashboard',
  profile: 'member-dashboard',
  myCompetitions: 'member-dashboard',
  prizePayments: 'member-dashboard',
  singlePhoto: 'member-upload',
  sixPhoto: 'member-upload',
  zodiac12: 'member-upload',
  uploadPhotos: 'member-upload',
  contactSupport: 'member-support',
  chat: 'member-support',
  photographer: 'photographer',
  businessLink: 'business-link',
  adminAlbumTypes: 'admin-album-types',
  adminBusinessLink: 'admin-business-link',
  adminCategories: 'admin-categories',
  adminComment: 'admin-comment',
  adminCompetitionDetail: 'admin-competition-detail',
  adminCompetitions: 'admin-competitions',
  adminNewsletter: 'admin-newsletter',
  adminOverview: 'admin-overview',
  adminPayouts: 'admin-payouts',
  adminSubmissions: 'admin-submissions',
  adminSupport: 'admin-support',
  adminUsers: 'admin-users',
  adminWinners: 'admin-winners',
};

const MERGED_KEEP_SUBFOLDER = new Set([
  'dashboard',
  'profile',
  'myCompetitions',
  'prizePayments',
  'singlePhoto',
  'sixPhoto',
  'zodiac12',
  'uploadPhotos',
  'login',
  'signup',
  'auth',
  'privacy',
  'terms',
  'cookies',
  'contactSupport',
  'chat',
]);

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function moveFile(from, to) {
  if (!fs.existsSync(from)) return;
  ensureDir(path.dirname(to));
  fs.renameSync(from, to);
}

function moveDirContents(fromDir, toDir) {
  if (!fs.existsSync(fromDir)) return;
  ensureDir(toDir);
  for (const name of fs.readdirSync(fromDir)) {
    moveFile(path.join(fromDir, name), path.join(toDir, name));
  }
  fs.rmdirSync(fromDir, { recursive: true });
}

function componentTarget(compFolder, fileName) {
  const feature = FEATURE_MAP[compFolder];
  if (!feature) {
    throw new Error(`No feature map for component folder: ${compFolder}`);
  }
  if (compFolder === 'legal') {
    return path.join(SRC, 'features', feature, fileName);
  }
  if (MERGED_KEEP_SUBFOLDER.has(compFolder)) {
    return path.join(SRC, 'features', feature, 'components', compFolder, fileName);
  }
  return path.join(SRC, 'features', feature, 'components', fileName);
}

function migrateComponents() {
  const compRoot = path.join(SRC, 'components');
  if (!fs.existsSync(compRoot)) return;

  const skip = new Set(['site', 'layout', '__tests__']);
  for (const entry of fs.readdirSync(compRoot)) {
    const full = path.join(compRoot, entry);
    const stat = fs.statSync(full);
    if (entry === 'Layout.jsx') {
      moveFile(full, path.join(SRC, 'layouts', 'PublicLayout.legacy.jsx'));
      continue;
    }
    if (entry === 'ErrorBoundary.jsx') {
      moveFile(full, path.join(SRC, 'shared', 'ui', 'ErrorBoundary.jsx'));
      continue;
    }
    if (entry === 'ScrollToTop.jsx') {
      moveFile(full, path.join(SRC, 'shared', 'ui', 'ScrollToTop.jsx'));
      continue;
    }
    if (!stat.isDirectory() || skip.has(entry)) continue;

    const feature = FEATURE_MAP[entry];
    if (!feature) {
      console.warn('Skipping unmapped component folder:', entry);
      continue;
    }

    for (const walk of walkFiles(full)) {
      const rel = path.relative(full, walk);
      const target = componentTarget(entry, rel.split(path.sep).join('/'));
      moveFile(walk, target);
    }
    fs.rmdirSync(full, { recursive: true });
  }

  // site → shared/site-chrome
  moveDirContents(path.join(compRoot, 'site'), path.join(SRC, 'shared', 'site-chrome'));

  // admin layout → layouts/AppShellLayout
  const adminLayout = path.join(compRoot, 'layout', 'admin');
  if (fs.existsSync(adminLayout)) {
    moveDirContents(adminLayout, path.join(SRC, 'layouts', 'AppShellLayout'));
  }

  const testsDir = path.join(compRoot, '__tests__');
  if (fs.existsSync(testsDir)) {
    moveDirContents(testsDir, path.join(SRC, 'shared', 'ui', '__tests__'));
  }

  fs.rmSync(compRoot, { recursive: true, force: true });
}

function* walkFiles(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) {
      yield* walkFiles(full);
    } else {
      yield full;
    }
  }
}

function migrateSharedAndApp() {
  const moves = [
    ['config', 'shared/config'],
    ['utils', 'shared/utils'],
    ['hooks', 'shared/hooks'],
    ['i18n', 'shared/i18n'],
    ['data', 'shared/data'],
    ['store', 'app/store'],
  ];
  for (const [from, to] of moves) {
    moveDirContents(path.join(SRC, from), path.join(SRC, to));
  }
  moveDirContents(path.join(SRC, 'services'), path.join(SRC, 'shared', 'lib'));
}

const PUBLIC_PAGES = new Set([
  'Home',
  'About',
  'Contact',
  'Services',
  'Competitions',
  'Gallery',
  'GalleryDetail',
  'GallerySixDetail',
  'GallerySixBlueDetail',
  'GalleryTwelveDetail',
  'PhotographerProfile',
  'Leaderboard',
  'Winners',
  'Privacy',
  'Terms',
  'Cookies',
]);

const AUTH_PAGES = new Set(['Login', 'SignUp']);

function migratePages() {
  const pagesRoot = path.join(SRC, 'pages');
  ensureDir(path.join(pagesRoot, 'public'));
  ensureDir(path.join(pagesRoot, 'auth'));
  ensureDir(path.join(pagesRoot, 'app'));

  for (const name of fs.readdirSync(pagesRoot)) {
    const full = path.join(pagesRoot, name);
    if (!fs.statSync(full).isFile() || !name.endsWith('.jsx')) continue;
    const base = name.replace(/\.jsx$/, '');
    if (PUBLIC_PAGES.has(base)) {
      moveFile(full, path.join(pagesRoot, 'public', name));
    } else if (AUTH_PAGES.has(base)) {
      moveFile(full, path.join(pagesRoot, 'auth', name));
    }
  }

  const adminPages = path.join(pagesRoot, 'admin');
  if (fs.existsSync(adminPages)) {
    for (const name of fs.readdirSync(adminPages)) {
      moveFile(path.join(adminPages, name), path.join(pagesRoot, 'app', name));
    }
    fs.rmdirSync(adminPages, { recursive: true });
  }
}

function removeIfEmpty(dir) {
  if (fs.existsSync(dir) && fs.readdirSync(dir).length === 0) {
    fs.rmdirSync(dir);
  }
}

const SHARED_ALIASES = [
  [/from ['"](\.\.\/)+config['"]/g, "from '@/shared/config'"],
  [/from ['"](\.\.\/)+config\//g, "from '@/shared/config/"],
  [/from ['"](\.\.\/)+hooks\//g, "from '@/shared/hooks/"],
  [/from ['"](\.\.\/)+utils\//g, "from '@/shared/utils/"],
  [/from ['"](\.\.\/)+services\//g, "from '@/shared/lib/"],
  [/from ['"](\.\.\/)+store\//g, "from '@/app/store/"],
  [/from ['"](\.\.\/)+data\//g, "from '@/shared/data/"],
  [/from ['"](\.\.\/)+i18n['"]/g, "from '@/shared/i18n'"],
  [/from ['"](\.\.\/)+i18n\//g, "from '@/shared/i18n/"],
  [/import ['"](\.\.\/)+i18n['"]/g, "import '@/shared/i18n'"],
];

function rewriteComponentImports(content) {
  return content.replace(
    /from ['"]((?:\.\.\/)+)components\/([^/'"]+)\/([^'"]+)['"]/g,
    (_, _dots, folder, rest) => {
      const feature = FEATURE_MAP[folder];
      if (!feature) return `from '@/components/${folder}/${rest}'`;
      if (folder === 'legal') {
        return `from '@/features/legal/${rest}'`;
      }
      if (MERGED_KEEP_SUBFOLDER.has(folder)) {
        return `from '@/features/${feature}/components/${folder}/${rest}'`;
      }
      return `from '@/features/${feature}/components/${rest}'`;
    },
  );
}

function rewriteSiteImports(content) {
  return content
    .replace(/from ['"](\.\.\/)+site(?:\/index)?['"]/g, "from '@/shared/site-chrome'")
    .replace(/from ['"]\.\/site(?:\/index)?['"]/g, "from '@/shared/site-chrome'")
    .replace(/from ['"](\.\.\/)+components\/site(?:\/index)?['"]/g, "from '@/shared/site-chrome'");
}

function rewriteLayoutImports(content) {
  return content
    .replace(
      /from ['"](\.\.\/)+components\/layout\/admin\/Layout['"]/g,
      "from '@/layouts/AppShellLayout/Layout'",
    )
    .replace(/from ['"](\.\.\/)+components\/Layout['"]/g, "from '@/layouts/PublicLayout'")
    .replace(
      /from ['"](\.\.\/)+components\/ErrorBoundary['"]/g,
      "from '@/shared/ui/ErrorBoundary'",
    )
    .replace(
      /from ['"](\.\.\/)+components\/ScrollToTop['"]/g,
      "from '@/shared/ui/ScrollToTop'",
    );
}

function rewriteAdminLayoutRelativeImports(content) {
  let next = content;
  next = next.replace(
    /from ['"]\.\.\/\.\.\/dashboard\//g,
    "from '@/features/member-dashboard/components/dashboard/",
  );
  next = next.replace(
    /from ['"]\.\.\/\.\.\/adminOverview\//g,
    "from '@/features/admin-overview/components/",
  );
  return next;
}

function rewriteImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [re, rep] of SHARED_ALIASES) {
    content = content.replace(re, rep);
  }
  content = rewriteComponentImports(content);
  content = rewriteSiteImports(content);
  content = rewriteLayoutImports(content);
  content = rewriteAdminLayoutRelativeImports(content);
  content = content.replace(/from ['"]\.\/router\/router['"]/g, "from '@/app/router'");
  content = content.replace(/from ['"]\.\/store\/store['"]/g, "from '@/app/store/store'");
  fs.writeFileSync(filePath, content);
}

function rewriteAllImports() {
  for (const file of walkFiles(SRC)) {
    if (!/\.(jsx|js)$/.test(file)) continue;
    if (file.includes('migrate-project-structure')) continue;
    rewriteImportsInFile(file);
  }
}

function main() {
  console.log('Migrating project structure...');
  migrateSharedAndApp();
  migrateComponents();
  migratePages();
  removeIfEmpty(path.join(SRC, 'router'));
  rewriteAllImports();
  console.log('Done. Add app/router, PublicLayout, webpack aliases, then run tests.');
}

main();
