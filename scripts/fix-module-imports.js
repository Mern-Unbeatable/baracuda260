/**
 * Fix relative imports inside src/modules after migrate-to-modules.js
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '../src');
const EXTS = ['', '.jsx', '.js'];

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full, files);
    else if (/\.(jsx|js)$/.test(name)) files.push(full);
  }
  return files;
}

function moduleOf(filePath) {
  const rel = path.relative(SRC, filePath).replace(/\\/g, '/');
  const m = rel.match(/^modules\/(public|auth|member|admin)\//);
  return m ? m[1] : null;
}

function tryResolve(basePath) {
  for (const ext of EXTS) {
    const p = basePath + ext;
    if (fs.existsSync(p) && fs.statSync(p).isFile()) return p;
  }
  return null;
}

function findInModule(moduleName, baseName) {
  const root = path.join(SRC, 'modules', moduleName);
  let found = null;
  for (const f of walk(root)) {
    const bn = path.basename(f, path.extname(f));
    if (bn === baseName) {
      if (found) return null; // ambiguous
      found = f;
    }
  }
  return found;
}

function toAlias(absPath) {
  return `@/${path.relative(SRC, absPath).replace(/\\/g, '/').replace(/\.(jsx|js)$/, '')}`;
}

function resolveSpec(fromFile, spec) {
  if (!spec.startsWith('.')) return spec;
  const mod = moduleOf(fromFile);
  const fromDir = path.dirname(fromFile);
  const direct = tryResolve(path.normalize(path.join(fromDir, spec)));
  if (direct) return toAlias(direct);

  if (!mod) return spec;
  const baseName = path.basename(spec).replace(/\.(jsx|js)$/, '');
  const found = findInModule(mod, baseName);
  if (found) return toAlias(found);
  return spec;
}

function flattenDoubleComponents() {
  for (const mod of ['public', 'auth', 'member', 'admin']) {
    const comp = path.join(SRC, 'modules', mod, 'components');
    if (!fs.existsSync(comp)) continue;
    for (const feature of fs.readdirSync(comp)) {
      const inner = path.join(comp, feature, 'components');
      if (!fs.existsSync(inner)) continue;
      for (const name of fs.readdirSync(inner)) {
        const from = path.join(inner, name);
        const to = path.join(comp, feature, name);
        if (fs.statSync(from).isDirectory()) {
          for (const sub of walk(from)) {
            const rel = path.relative(from, sub);
            moveSafe(sub, path.join(to, rel));
          }
          fs.rmSync(from, { recursive: true, force: true });
        } else {
          moveSafe(from, to);
        }
      }
      if (fs.existsSync(inner)) fs.rmSync(inner, { recursive: true, force: true });
    }
  }
}

function moveSafe(from, to) {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(path.dirname(to), { recursive: true });
  if (fs.existsSync(to)) fs.rmSync(to, { recursive: true, force: true });
  fs.renameSync(from, to);
}

function moveContentTestsToViews() {
  for (const mod of ['public', 'auth', 'member', 'admin']) {
    const comp = path.join(SRC, 'modules', mod, 'components');
    if (!fs.existsSync(comp)) continue;
    for (const file of walk(comp)) {
      if (!file.includes('__tests__')) continue;
      if (!/Content\.test\.jsx$/.test(file)) continue;
      const base = path.basename(file);
      const dest = path.join(SRC, 'modules', mod, 'views', '__tests__', base);
      moveSafe(file, dest);
    }
  }
}

function rewriteFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  const orig = content;
  content = content.replace(
    /from ['"](\.[^'"]+)['"]/g,
    (match, spec) => {
      const resolved = resolveSpec(file, spec);
      if (resolved === spec) return match;
      return `from '${resolved}'`;
    },
  );
  if (content !== orig) fs.writeFileSync(file, content);
}

function main() {
  flattenDoubleComponents();
  moveContentTestsToViews();
  const files = walk(path.join(SRC, 'modules'));
  for (const f of files) rewriteFile(f);
  // layouts + shared that reference modules
  for (const f of walk(path.join(SRC, 'layouts'))) rewriteFile(f);
  console.log('Module import fix complete.');
}

main();
