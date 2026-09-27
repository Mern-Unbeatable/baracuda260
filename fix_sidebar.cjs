const fs = require('fs');
const path = require('path');

const sidebarPath = path.join(__dirname, 'src/layouts/AppShellLayout/adminSidebar/Sidebar.jsx');
let content = fs.readFileSync(sidebarPath, 'utf8');

// Replace ROUTES.ADMIN_ with ROUTES.USER_ only inside USER_NAV_ITEMS
const userNavStart = content.indexOf('const USER_NAV_ITEMS');
const adminNavStart = content.indexOf('const ADMIN_NAV_GROUPS');

if (userNavStart !== -1 && adminNavStart !== -1) {
  let userNavStr = content.slice(userNavStart, adminNavStart);
  userNavStr = userNavStr.replace(/ROUTES\.ADMIN_/g, 'ROUTES.USER_');
  content = content.slice(0, userNavStart) + userNavStr + content.slice(adminNavStart);
  fs.writeFileSync(sidebarPath, content);
  console.log('Fixed sidebar.');
} else {
  console.log('Could not find markers.');
}
