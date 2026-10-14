/**
 * SEVERINO SÍNDICOS PROFISSIONAIS - PRODUCTION WEB SERVER (RAILWAY READY)
 * - Zero external dependencies (starts instantaneously)
 * - Binds to 0.0.0.0 on process.env.PORT (required by Railway)
 * - Automatic MIME type resolution, gzip compression & security headers
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  // Normalize and parse URL
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Health check endpoint for Railway
  if (pathname === '/health' || pathname === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'healthy', uptime: process.uptime() }));
    return;
  }

  // Default to index.html
  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  let filePath = path.resolve(PUBLIC_DIR, '.' + pathname);

  // Security: block path traversal outside PUBLIC_DIR and hidden files
  if (!filePath.startsWith(PUBLIC_DIR) || pathname.startsWith('/.git') || pathname.startsWith('/node_modules')) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback: check if requesting a clean URL (e.g. /sobre -> /sobre.html) or fallback to index.html
      const htmlFallback = path.join(PUBLIC_DIR, `${pathname}.html`);
      fs.stat(htmlFallback, (err2, stats2) => {
        if (!err2 && stats2.isFile()) {
          serveFile(htmlFallback, req, res);
        } else {
          // 404 -> Serve index.html or 404 message
          const indexFile = path.join(PUBLIC_DIR, 'index.html');
          serveFile(indexFile, req, res, 200);
        }
      });
      return;
    }

    serveFile(filePath, req, res);
  });
});

function serveFile(filePath, req, res, statusCode = 200) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  // Security & Cache Headers
  const headers = {
    'Content-Type': contentType,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  };

  // Cache static assets (images, css, js) for 1 week
  if (['.css', '.js', '.png', '.jpg', '.jpeg', '.svg', '.woff2'].includes(ext)) {
    headers['Cache-Control'] = 'public, max-age=604800, immutable';
  } else {
    headers['Cache-Control'] = 'public, max-age=0, must-revalidate';
  }

  // Check Gzip compression support for text/json/svg/xml
  const acceptEncoding = req.headers['accept-encoding'] || '';
  const isCompressible = /text|javascript|json|xml|svg/.test(contentType);

  if (isCompressible && acceptEncoding.includes('gzip')) {
    headers['Content-Encoding'] = 'gzip';
    res.writeHead(statusCode, headers);
    const raw = fs.createReadStream(filePath);
    const zip = zlib.createGzip();
    raw.pipe(zip).pipe(res);
  } else {
    res.writeHead(statusCode, headers);
    fs.createReadStream(filePath).pipe(res);
  }
}

server.listen(PORT, HOST, () => {
  console.log(`[Railway Server] Running on http://${HOST}:${PORT}`);
  console.log(`[Railway Server] Node Environment: ${process.env.NODE_ENV || 'production'}`);
});
