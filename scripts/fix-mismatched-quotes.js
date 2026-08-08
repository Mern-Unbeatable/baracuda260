/**
 * Fix mismatched quotes introduced by a bad bulk replace ('...").
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '../src');

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full, files);
    else if (/\.(jsx|js)$/.test(name)) files.push(full);
  }
  return files;
}

for (const file of walk(SRC)) {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  // JSX/HTML attributes: name='value" -> name="value"
  content = content.replace(/([\w$-]+)='([^'"]*?)"/g, '$1="$2"');

  // querySelector / similar: [type='file" -> [type="file"
  content = content.replace(/\[([\w-]+)='([^'"]*?)"/g, '[$1="$2"');

  // querySelector string: 'input[type='file"]' -> 'input[type="file"]'
  content = content.replace(
    /'input\[type='file"\]'/g,
    "'input[type=\"file\"]'",
  );

  // img[src='..."] patterns in tests
  content = content.replace(/\[src='([^'"]*?)"/g, '[src="$1"');
  content = content.replace(/img\[src='([^'"]*?)"/g, 'img[src="$1"');

  // data-testid='foo" in mocks
  content = content.replace(/data-testid='([^'"]*?)"/g, 'data-testid="$1"');

  // alt='"' broken placeholder
  content = content.replace(/alt='"/g, 'alt=""');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('fixed', path.relative(SRC, file));
  }
}

console.log('Quote fix complete.');
