const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'src/shared/config/index.js');
let configContent = fs.readFileSync(configPath, 'utf8');

const memberRoutesPath = path.join(__dirname, 'src/app/router/routes/memberRoutes.jsx');
const memberRoutesContent = fs.readFileSync(memberRoutesPath, 'utf8');

// Find all ROUTES.ADMIN_... used in memberRoutes.jsx
const routeRegex = /ROUTES\.(ADMIN_[A-Z0-9_]+)/g;
let match;
const userRouteKeys = new Set();
while ((match = routeRegex.exec(memberRoutesContent)) !== null) {
  userRouteKeys.add(match[1]);
}

// Map ADMIN_... to USER_...
const replacements = {};
userRouteKeys.forEach(adminKey => {
  const userKey = adminKey.replace('ADMIN_', 'USER_');
  replacements[adminKey] = userKey;
});

console.log('Keys to replace for User Dashboard:', replacements);

// We need to add USER: '/user' and all USER_ variables to config/index.js
// Wait, some variables might be shared (like ADMIN_DASHBOARD).
// If an admin logs in, they go to ADMIN_DASHBOARD (/admin/dashboard).
// If a user logs in, they go to USER_DASHBOARD (/user/dashboard).

// So in config/index.js, we don't replace, we ADD the new USER_ keys with '/user/...'
let newConfigContent = configContent;
let userRoutesToAdd = `\n  USER: '/user',\n`;

// Extract the string values for the ADMIN keys
for (const adminKey of userRouteKeys) {
  const adminValRegex = new RegExp(`${adminKey}:\\s*'([^']+)'`);
  const valMatch = configContent.match(adminValRegex);
  if (valMatch) {
    const adminPath = valMatch[1];
    const userPath = adminPath.replace('/admin', '/user');
    const userKey = replacements[adminKey];
    userRoutesToAdd += `  ${userKey}: '${userPath}',\n`;
  }
}

// Insert the new routes right before ADMIN: '/admin'
newConfigContent = newConfigContent.replace(`  ADMIN: '/admin',`, `${userRoutesToAdd}  ADMIN: '/admin',`);
fs.writeFileSync(configPath, newConfigContent);

// Now we need to update memberRoutes.jsx to use USER_ instead of ADMIN_
let newMemberRoutesContent = memberRoutesContent;
for (const [adminKey, userKey] of Object.entries(replacements)) {
  newMemberRoutesContent = newMemberRoutesContent.replace(new RegExp(`ROUTES\\.${adminKey}`, 'g'), `ROUTES.${userKey}`);
}
// Also change replace(ROUTES.ADMIN to replace(ROUTES.USER
newMemberRoutesContent = newMemberRoutesContent.replace(/ROUTES\.ADMIN/g, 'ROUTES.USER');
fs.writeFileSync(memberRoutesPath, newMemberRoutesContent);

console.log('Updated config and memberRoutes');
