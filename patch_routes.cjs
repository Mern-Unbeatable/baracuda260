const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'src/shared/config/index.js');
let configContent = fs.readFileSync(configPath, 'utf8');

const additionalUserRoutes = `
  USER_BUSINESS_PHOTOS: '/user/business-link-photos',
  USER_BUSINESS_PHOTOS_DETAIL: '/user/business-link-photos/:id',
  USER_SETTINGS: '/user/settings',
`;

configContent = configContent.replace("USER_PROFILE: '/user/profile',", "USER_PROFILE: '/user/profile'," + additionalUserRoutes);
fs.writeFileSync(configPath, configContent);

const memberRoutesPath = path.join(__dirname, 'src/app/router/routes/memberRoutes.jsx');
let memberRoutesContent = fs.readFileSync(memberRoutesPath, 'utf8');

// We need to import the components
const imports = `
const BusinessPhotos = lazy(() => import('@/portals/admin/pages/BusinessPhotos'));
const BusinessLinkDetails = lazy(() => import('@/portals/admin/pages/BusinessLinkDetails'));
const SettingsRoute = lazy(() => import('@/portals/admin/pages/SettingsRoute'));
`;

// And add them to the JSX
const routesToAdd = `
    <Route path={seg(ROUTES.USER_BUSINESS_PHOTOS)} element={<BusinessPhotos />} />
    <Route path={seg(ROUTES.USER_BUSINESS_PHOTOS_DETAIL)} element={<BusinessLinkDetails />} />
    <Route path={seg(ROUTES.USER_SETTINGS)} element={<SettingsRoute />} />
`;

memberRoutesContent = memberRoutesContent.replace('export const memberRoutes = (', imports + '\nexport const memberRoutes = (');
memberRoutesContent = memberRoutesContent.replace('</>', routesToAdd + '  </>');

fs.writeFileSync(memberRoutesPath, memberRoutesContent);
console.log('Added missing routes to config and memberRoutes.');
