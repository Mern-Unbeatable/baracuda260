const fs = require('fs');
const path = require('path');

const layoutPath = path.join(__dirname, 'src/layouts/AppShellLayout/Layout.jsx');
let content = fs.readFileSync(layoutPath, 'utf8');

// Find all ROUTES.ADMIN_ uses in Layout.jsx
const routeRegex = /ROUTES\.ADMIN_[A-Z0-9_]+/g;
const matches = [...new Set(content.match(routeRegex))];

let replacements = '';
for (const match of matches) {
  const userKey = match.replace('ROUTES.ADMIN_', 'ROUTES.USER_');
  // Check if USER_ key exists in config
  // (We'll just lazily add it to the list, if it's undefined it won't match anyway)
  // But wait, the easiest way is to just duplicate every line containing ROUTES.ADMIN_ and change it to ROUTES.USER_
}

const lines = content.split('\n');
const newLines = [];
for (let i = 0; i < lines.length; i++) {
  newLines.push(lines[i]);
  if (lines[i].includes('ROUTES.ADMIN_')) {
    let newLine = lines[i].replace(/ROUTES\.ADMIN_/g, 'ROUTES.USER_');
    newLines.push(newLine);
  }
}

fs.writeFileSync(layoutPath, newLines.join('\n'));
console.log('Fixed Layout.jsx');
