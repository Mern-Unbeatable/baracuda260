/**
 * Serve the production webpack build for Coolify / PaaS.
 * Listens on 0.0.0.0 and PORT (required for reverse proxies).
 */
const http = require('http');
const path = require('path');
const fs = require('fs');
const handler = require('serve-handler');

const DEFAULT_PORT = 3000;
const HOST = '0.0.0.0';
const publicDir = path.join(__dirname, '..', 'dist');

if (!fs.existsSync(path.join(publicDir, 'index.html'))) {
  console.error(
    `[serve-dist] Missing ${path.join(publicDir, 'index.html')}. Run "npm run build" first.`,
  );
  process.exit(1);
}

const port = Number(process.env.PORT) || DEFAULT_PORT;

const server = http.createServer((request, response) =>
  handler(request, response, {
    public: publicDir,
    cleanUrls: false,
    rewrites: [{ source: '**', destination: '/index.html' }],
  }),
);

server.listen(port, HOST, () => {
  console.log(`[serve-dist] Serving ${publicDir} at http://${HOST}:${port}`);
});
