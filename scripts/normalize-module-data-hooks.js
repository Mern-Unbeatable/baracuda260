/**
 * Normalize data/ and hooks/ filenames: strip feature prefix when unambiguous.
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '../src');

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

function normalizeDir(dir) {
  if (!fs.existsSync(dir)) return;
  for (const file of walk(dir)) {
    const base = path.basename(file);
    const m = base.match(/^[a-z0-9-]+-(.+\.(js|jsx))$/i) || base.match(/^[a-z0-9-]+-(.+)$/);
    if (!m) continue;
    const shortName = m[1].includes('.') ? m[1] : `${m[1]}.js`;
    const dest = path.join(path.dirname(file), shortName);
    if (dest === file) continue;
    if (fs.existsSync(dest)) continue;
    fs.renameSync(file, dest);
    console.log('rename', path.relative(SRC, file), '->', path.relative(SRC, dest));
  }
}

for (const mod of ['public', 'auth', 'member', 'admin']) {
  normalizeDir(path.join(SRC, 'modules', mod, 'data'));
  normalizeDir(path.join(SRC, 'modules', mod, 'hooks'));
}

console.log('Done normalizing names.');
