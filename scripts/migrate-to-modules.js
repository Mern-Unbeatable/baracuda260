/**
 * Migrate pages/ + features/ → modules/{public,auth,member,admin}
 * Run: node scripts/migrate-to-modules.js
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '../src');

const MEMBER_PAGE_NAMES = new Set([
  'Dashboard',
  'UploadPhotos',
  'SinglePhoto',
  'SixPhoto',
  'Zodiac12',
  'MyCompetitions',
  'MyCompetitionDetails',
  'PrizePayments',
  'Profile',
  'Chat',
]);

const FEATURE_MODULE = {
  'marketing-home': 'public',
  'marketing-about': 'public',
  'marketing-contact': 'public',
  'marketing-services': 'public',
  'marketing-gallery': 'public',
  competitions: 'public',
  'competition-details': 'public',
  leaderboard: 'public',
  winners: 'public',
  photographer: 'public',
  legal: 'public',
  auth: 'auth',
  'member-dashboard': 'member',
  'member-upload': 'member',
  'member-support': 'member',
  'business-link': 'member',
  'admin-album-types': 'admin',
  'admin-business-link': 'admin',
  'admin-categories': 'admin',
  'admin-comment': 'admin',
  'admin-competition-detail': 'admin',
  'admin-competitions': 'admin',
  'admin-newsletter': 'admin',
  'admin-overview': 'admin',
  'admin-payouts': 'admin',
  'admin-submissions': 'admin',
  'admin-support': 'admin',
  'admin-users': 'admin',
  'admin-winners': 'admin',
};

function ensureDir(d) {
  fs.mkdirSync(d, { recursive: true });
}

function moveFile(from, to) {
  if (!fs.existsSync(from)) return;
  ensureDir(path.dirname(to));
  fs.renameSync(from, to);
}

function* walkFiles(dir) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) yield* walkFiles(full);
    else yield full;
  }
}

function movePages() {
  const map = [
    ['pages/public', 'modules/public/pages'],
    ['pages/auth', 'modules/auth/pages'],
  ];
  for (const [fromRel, toRel] of map) {
    const from = path.join(SRC, fromRel);
    const to = path.join(SRC, toRel);
    if (!fs.existsSync(from)) continue;
    for (const name of fs.readdirSync(from)) {
      moveFile(path.join(from, name), path.join(to, name));
    }
    fs.rmSync(from, { recursive: true, force: true });
  }

  const appPages = path.join(SRC, 'pages/app');
  if (fs.existsSync(appPages)) {
    for (const name of fs.readdirSync(appPages)) {
      const base = name.replace(/\.jsx$/, '');
      const mod = MEMBER_PAGE_NAMES.has(base) ? 'member' : 'admin';
      moveFile(path.join(appPages, name), path.join(SRC, 'modules', mod, 'pages', name));
    }
    fs.rmSync(appPages, { recursive: true, force: true });
  }

  // stale flat pages at src/pages root
  const pagesRoot = path.join(SRC, 'pages');
  if (fs.existsSync(pagesRoot)) {
    for (const name of fs.readdirSync(pagesRoot)) {
      const full = path.join(pagesRoot, name);
      if (fs.statSync(full).isFile()) fs.unlinkSync(full);
    }
    fs.rmSync(pagesRoot, { recursive: true, force: true });
  }
}

function isContentView(fileName) {
  return /Content\.jsx$/.test(fileName) || fileName === 'ChatPanel.jsx';
}

function relocateFeature(featureName, moduleName) {
  const featureRoot = path.join(SRC, 'features', featureName);
  if (!fs.existsSync(featureRoot)) return;

  const modRoot = path.join(SRC, 'modules', moduleName);
  ensureDir(path.join(modRoot, 'views'));
  ensureDir(path.join(modRoot, 'components'));
  ensureDir(path.join(modRoot, 'hooks'));
  ensureDir(path.join(modRoot, 'data'));

  for (const file of walkFiles(featureRoot)) {
    const rel = path.relative(featureRoot, file).replace(/\\/g, '/');
    const base = path.basename(file);

    if (rel.includes('__tests__')) {
      const testTarget = isContentView(base)
        ? path.join(modRoot, 'views', '__tests__', base)
        : path.join(modRoot, 'components', featureName, rel);
      moveFile(file, testTarget);
      continue;
    }

    if (base.startsWith('use') && base.endsWith('.js')) {
      moveFile(file, path.join(modRoot, 'hooks', `${featureName}-${base}`));
      continue;
    }

    if (base.endsWith('Data.js') || base.endsWith('Assets.js') || base === 'legalI18n.js') {
      moveFile(file, path.join(modRoot, 'data', `${featureName}-${base}`));
      continue;
    }

    if (base.endsWith('.jsx')) {
      if (isContentView(base)) {
        moveFile(file, path.join(modRoot, 'views', base));
      } else {
        moveFile(file, path.join(modRoot, 'components', featureName, rel));
      }
      continue;
    }

    if (base.endsWith('.js')) {
      moveFile(file, path.join(modRoot, 'data', `${featureName}-${base}`));
    }
  }

  fs.rmSync(featureRoot, { recursive: true, force: true });
}

function migrateFeatures() {
  for (const [feature, mod] of Object.entries(FEATURE_MODULE)) {
    relocateFeature(feature, mod);
  }
  const featuresRoot = path.join(SRC, 'features');
  if (fs.existsSync(featuresRoot)) {
    fs.rmSync(featuresRoot, { recursive: true, force: true });
  }
}

/** @param {string} content */
function rewriteImports(content) {
  let c = content;

  c = c.replace(/@\/pages\/public\//g, '@/modules/public/');
  c = c.replace(/@\/pages\/auth\//g, '@/modules/auth/pages/');

  const memberPages = [...MEMBER_PAGE_NAMES];
  for (const name of memberPages) {
    c = c.replace(
      new RegExp(`@/pages/app/${name}(['"])`, 'g'),
      `@/modules/member/pages/${name}$1`,
    );
  }

  c = c.replace(/@\/pages\/app\//g, '@/modules/admin/pages/');

  // features → modules (longest keys first)
  const features = Object.keys(FEATURE_MODULE).sort((a, b) => b.length - a.length);
  for (const feat of features) {
    const mod = FEATURE_MODULE[feat];
    const esc = feat.replace(/-/g, '\\-');

    // @/features/feat/components/...Content
    c = c.replace(
      new RegExp(`@/features/${esc}/components/([\\w-/]+/)?([\\w]+Content)`, 'g'),
      (_, sub, file) => {
        if (file.endsWith('Content')) {
          return `@/modules/${mod}/views/${file}`;
        }
        return `@/modules/${mod}/components/${feat}/${sub || ''}${file}`;
      },
    );

    c = c.replace(
      new RegExp(`@/features/${esc}/components/([\\w-/]+)`, 'g'),
      `@/modules/${mod}/components/${feat}/$1`,
    );

    c = c.replace(new RegExp(`@/features/${esc}/legalI18n`, 'g'), `@/modules/${mod}/data/${feat}-legalI18n`);
    c = c.replace(new RegExp(`@/features/${esc}/`, 'g'), `@/modules/${mod}/`);
  }

  // cross-module paths used in codebase
  c = c.replace(
    /@\/features\/member-dashboard\/components\/dashboard\/dashboardAssets/g,
    '@/modules/member/data/member-dashboard-dashboardAssets',
  );
  c = c.replace(
    /@\/features\/admin-overview\/components\/AdminComingSoonContent/g,
    '@/modules/admin/views/AdminComingSoonContent',
  );
  c = c.replace(
    /@\/features\/admin-overview\/components\/adminOverviewData/g,
    '@/modules/admin/data/admin-overview-adminOverviewData',
  );
  c = c.replace(
    /@\/features\/member-upload\/components\/singlePhoto\/PhotoSubmitSuccessModal/g,
    '@/modules/member/components/member-upload/singlePhoto/PhotoSubmitSuccessModal',
  );

  return c;
}

function rewriteAllFiles() {
  for (const file of walkFiles(SRC)) {
    if (!/\.(jsx|js)$/.test(file)) continue;
    if (file.includes('migrate-to-modules')) continue;
    const orig = fs.readFileSync(file, 'utf8');
    const next = rewriteImports(orig);
    if (next !== orig) fs.writeFileSync(file, next);
  }
}

function main() {
  console.log('Moving pages → modules/*/pages ...');
  movePages();
  console.log('Moving features → modules/*/views|components ...');
  migrateFeatures();
  console.log('Rewriting imports ...');
  rewriteAllFiles();
  console.log('Module migration complete.');
}

main();
