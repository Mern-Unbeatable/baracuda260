/**
 * One-time: restructure modules/public into route folders (home/, about/, gallery/, …).
 * Run: node scripts/restructure-public-by-route.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'src/modules/public');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyFile(from, to) {
  ensureDir(path.dirname(to));
  fs.copyFileSync(from, to);
}

function copyIfExists(fromRel, toRel) {
  const from = path.join(PUBLIC, fromRel);
  const to = path.join(PUBLIC, toRel);
  if (!fs.existsSync(from)) {
    console.warn('skip missing', fromRel);
    return;
  }
  copyFile(from, to);
}

const copies = [
  ['views/ActiveCompetitions.jsx', 'shared/sections/ActiveCompetitions.jsx'],
  ['views/HowItWorks.jsx', 'shared/sections/HowItWorks.jsx'],
  ['views/CommunityWork.jsx', 'shared/sections/CommunityWork.jsx'],
  ['views/TopPhotographers.jsx', 'shared/sections/TopPhotographers.jsx'],
  ['components/marketing-home/HomeHero.jsx', 'home/components/HomeHero.jsx'],
  ['components/marketing-home/__tests__/HomeHero.test.jsx', 'home/components/__tests__/HomeHero.test.jsx'],
  ['components/marketing-about/AboutHero.jsx', 'about/sections/AboutHero.jsx'],
  ['components/marketing-about/AboutStats.jsx', 'about/sections/AboutStats.jsx'],
  ['components/marketing-about/AboutStory.jsx', 'about/sections/AboutStory.jsx'],
  ['components/marketing-about/AboutMissionVision.jsx', 'about/sections/AboutMissionVision.jsx'],
  ['components/marketing-about/AboutHowItWorks.jsx', 'about/sections/AboutHowItWorks.jsx'],
  ['components/marketing-about/AboutCommunity.jsx', 'about/sections/AboutCommunity.jsx'],
  ['components/marketing-about/AboutCta.jsx', 'about/sections/AboutCta.jsx'],
  ['data/aboutAssets.js', 'about/data/aboutAssets.js'],
  ['data/aboutData.js', 'about/data/aboutData.js'],
  ['data/competitionDetailsAssets.js', 'competition-details/data/competitionDetailsAssets.js'],
  ['data/legalI18n.js', 'legal/data/legalI18n.js'],
  ['views/GalleryContent.jsx', 'gallery/sections/GalleryMain.jsx'],
  ['views/FavoriteHeartButton.jsx', 'gallery/components/FavoriteHeartButton.jsx'],
  ['views/GalleryDetailView.jsx', 'gallery/detail/GalleryDetailView.jsx'],
  ['views/GalleryDetailBreadcrumb.jsx', 'gallery/detail/GalleryDetailBreadcrumb.jsx'],
  ['views/galleryDetailShared.js', 'gallery/detail/galleryDetailShared.js'],
  ['views/CompetitionDetailsContent.jsx', 'competition-details/CompetitionDetailsContent.jsx'],
  ['views/ContactContent.jsx', 'contact/sections/ContactMain.jsx'],
  ['views/ServicesContent.jsx', 'services/sections/ServicesMain.jsx'],
  ['views/LeaderboardContent.jsx', 'leaderboard/sections/LeaderboardMain.jsx'],
  ['views/WinnersContent.jsx', 'winners/sections/WinnersMain.jsx'],
  ['views/PhotographerProfileContent.jsx', 'photographer/sections/PhotographerProfileMain.jsx'],
  ['views/PrivacyContent.jsx', 'legal/privacy/sections/PrivacyMain.jsx'],
  ['views/TermsContent.jsx', 'legal/terms/sections/TermsMain.jsx'],
  ['views/CookiesContent.jsx', 'legal/cookies/sections/CookiesMain.jsx'],
  ['pages/GalleryDetail.jsx', 'gallery/detail/GalleryDetail.jsx'],
  ['pages/GallerySixDetail.jsx', 'gallery/detail/GallerySixDetail.jsx'],
  ['pages/GallerySixBlueDetail.jsx', 'gallery/detail/GallerySixBlueDetail.jsx'],
  ['pages/GalleryTwelveDetail.jsx', 'gallery/detail/GalleryTwelveDetail.jsx'],
  ['views/__tests__/AboutContent.test.jsx', 'about/__tests__/About.test.jsx'],
  ['views/__tests__/PrivacyContent.test.jsx', 'legal/privacy/__tests__/Privacy.test.jsx'],
  ['views/__tests__/TermsContent.test.jsx', 'legal/terms/__tests__/Terms.test.jsx'],
  ['views/__tests__/CookiesContent.test.jsx', 'legal/cookies/__tests__/Cookies.test.jsx'],
  [
    'views/__tests__/CompetitionDetailsContent.test.jsx',
    'competition-details/__tests__/CompetitionDetailsContent.test.jsx',
  ],
  [
    'components/competition-details/components/__tests__/CompetitionDetailsContent.test.jsx',
    'competition-details/__tests__/CompetitionDetailsContent.legacy.test.jsx',
  ],
];

for (const [from, to] of copies) {
  copyIfExists(from, to);
}

const replacements = [
  ['@/modules/public/', '@/modules/public/'],
  ['@/modules/public/shared/sections/ActiveCompetitions', '@/modules/public/shared/sections/ActiveCompetitions'],
  ['@/modules/public/shared/sections/HowItWorks', '@/modules/public/shared/sections/HowItWorks'],
  ['@/modules/public/shared/sections/CommunityWork', '@/modules/public/shared/sections/CommunityWork'],
  ['@/modules/public/shared/sections/TopPhotographers', '@/modules/public/shared/sections/TopPhotographers'],
  ['@/modules/public/gallery/detail/GalleryDetailView', '@/modules/public/gallery/detail/GalleryDetailView'],
  ['@/modules/public/gallery/detail/GalleryDetailBreadcrumb', '@/modules/public/gallery/detail/GalleryDetailBreadcrumb'],
  ['@/modules/public/gallery/detail/galleryDetailShared', '@/modules/public/gallery/detail/galleryDetailShared'],
  ['@/modules/public/gallery/components/FavoriteHeartButton', '@/modules/public/gallery/components/FavoriteHeartButton'],
  ['@/modules/public/gallery/sections/GalleryMain', '@/modules/public/gallery/sections/GalleryMain'],
  ['@/modules/public/competition-details/CompetitionDetailsContent', '@/modules/public/competition-details/CompetitionDetailsContent'],
  ['@/modules/public/home/Home', '@/modules/public/home/Home'],
  ['@/modules/public/about/About', '@/modules/public/about/About'],
  ['@/modules/public/competitions/Competitions', '@/modules/public/competitions/Competitions'],
  ['@/modules/public/contact/sections/ContactMain', '@/modules/public/contact/sections/ContactMain'],
  ['@/modules/public/services/sections/ServicesMain', '@/modules/public/services/sections/ServicesMain'],
  ['@/modules/public/leaderboard/sections/LeaderboardMain', '@/modules/public/leaderboard/sections/LeaderboardMain'],
  ['@/modules/public/winners/sections/WinnersMain', '@/modules/public/winners/sections/WinnersMain'],
  ['@/modules/public/photographer/sections/PhotographerProfileMain', '@/modules/public/photographer/sections/PhotographerProfileMain'],
  ['@/modules/public/legal/privacy/sections/PrivacyMain', '@/modules/public/legal/privacy/sections/PrivacyMain'],
  ['@/modules/public/legal/terms/sections/TermsMain', '@/modules/public/legal/terms/sections/TermsMain'],
  ['@/modules/public/legal/cookies/sections/CookiesMain', '@/modules/public/legal/cookies/sections/CookiesMain'],
  ['@/modules/public/home/components/HomeHero', '@/modules/public/home/components/HomeHero'],
  ['@/modules/public/about/sections/AboutHero', '@/modules/public/about/sections/AboutHero'],
  ['@/modules/public/about/sections/AboutStats', '@/modules/public/about/sections/AboutStats'],
  ['@/modules/public/about/sections/AboutStory', '@/modules/public/about/sections/AboutStory'],
  ['@/modules/public/about/sections/AboutMissionVision', '@/modules/public/about/sections/AboutMissionVision'],
  ['@/modules/public/about/sections/AboutHowItWorks', '@/modules/public/about/sections/AboutHowItWorks'],
  ['@/modules/public/about/sections/AboutCommunity', '@/modules/public/about/sections/AboutCommunity'],
  ['@/modules/public/about/sections/AboutCta', '@/modules/public/about/sections/AboutCta'],
  ['@/modules/public/about/data/aboutAssets', '@/modules/public/about/data/aboutAssets'],
  ['@/modules/public/about/data/aboutData', '@/modules/public/about/data/aboutData'],
  ['@/modules/public/competition-details/data/competitionDetailsAssets', '@/modules/public/competition-details/data/competitionDetailsAssets'],
  ['@/modules/public/legal/data/legalI18n', '@/modules/public/legal/data/legalI18n'],
  ["from '@/modules/public/gallery/components/FavoriteHeartButton'", "from '@/modules/public/gallery/components/FavoriteHeartButton'"],
  ["from '@/modules/public/gallery/detail/GalleryDetailBreadcrumb'", "from '@/modules/public/gallery/detail/GalleryDetailBreadcrumb'"],
  ["from '@/modules/public/gallery/detail/galleryDetailShared'", "from '@/modules/public/gallery/detail/galleryDetailShared'"],
];

const pageRouteMap = {
  Home: 'home/Home',
  About: 'about/About',
  Contact: 'contact/Contact',
  Services: 'services/Services',
  Competitions: 'competitions/Competitions',
  Gallery: 'gallery/Gallery',
  PhotographerProfile: 'photographer/PhotographerProfile',
  Leaderboard: 'leaderboard/Leaderboard',
  Winners: 'winners/Winners',
  Privacy: 'legal/privacy/Privacy',
  Terms: 'legal/terms/Terms',
  Cookies: 'legal/cookies/Cookies',
};

function walk(dir, fn) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, fn);
    else if (/\.(jsx?|tsx?)$/.test(name)) fn(p);
  }
}

function patchFile(filePath) {
  let c = fs.readFileSync(filePath, 'utf8');
  let orig = c;
  for (const [a, b] of replacements) {
    c = c.split(a).join(b);
  }
  for (const [page, route] of Object.entries(pageRouteMap)) {
    c = c.split(`@/modules/public/${page}`).join(`@/modules/public/${route}`);
  }
  c = c.replace(/@\/modules\/public\/ROUTE_PLACEHOLDER\//g, '@/modules/public/');
  if (c !== orig) fs.writeFileSync(filePath, c);
}

walk(path.join(ROOT, 'src'), patchFile);
walk(path.join(ROOT, 'scripts'), patchFile);

console.log('Copied files and patched imports. Add route Home.jsx files and remove legacy folders manually if needed.');
