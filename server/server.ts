import http from 'http';
import fs from 'fs';
import path from 'path';
import { handleApiRequest } from './apiRouter.ts';

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';
const DIST_DIR = path.resolve(process.cwd(), 'dist');

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.mp4': 'video/mp4',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json'
};

function serveStaticFile(req: http.IncomingMessage, res: http.ServerResponse, filePath: string, isSpaFallback = false): boolean {
  try {
    if (!fs.existsSync(filePath)) return false;
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) return false;

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Caching strategies
    if (isSpaFallback || ext === '.html') {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    } else if (filePath.includes(path.join('dist', 'assets'))) {
      // Hashed assets
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }

    // Production Security Headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', stat.size);

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
    return true;
  } catch {
    return false;
  }
}

export const server = http.createServer(async (req, res) => {
  const urlString = req.url || '/';

  // 1. API Route Handling
  if (urlString.startsWith('/api')) {
    try {
      const handled = await handleApiRequest(req, res);
      if (handled) return;
    } catch (err: any) {
      console.error('[API Server Error]', err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, error: err?.message || 'Internal Server Error' }));
      return;
    }

    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, error: 'API endpoint not found' }));
    return;
  }

  // 2. Static File Serving
  let pathname = urlString.split('?')[0];
  try {
    pathname = decodeURIComponent(pathname);
  } catch {
    // ignore decode error
  }

  // Sanitize path against directory traversal
  const safeRelativePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  const candidateFilePath = path.join(DIST_DIR, safeRelativePath);

  // If requesting a specific file that exists in dist
  if (
    pathname !== '/' &&
    candidateFilePath.startsWith(DIST_DIR) &&
    fs.existsSync(candidateFilePath) &&
    fs.statSync(candidateFilePath).isFile()
  ) {
    if (serveStaticFile(req, res, candidateFilePath)) return;
  }

  // 3. SPA Fallback: Serve dist/index.html
  const indexHtmlPath = path.join(DIST_DIR, 'index.html');
  if (serveStaticFile(req, res, indexHtmlPath, true)) {
    return;
  }

  // If dist/index.html is missing
  res.statusCode = 503;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end('<h1>503 Service Unavailable</h1><p>Frontend production bundle not found. Please run <code>npm run build</code> first.</p>');
});

// Auto-start when executed directly
server.listen(PORT, HOST, () => {
  console.log(`[Xing Fitness] Production server listening on http://${HOST}:${PORT}`);
  console.log(`[Xing Fitness] Verified Gym Location: Brookefield, AECS Layout, Bengaluru 560037`);
  console.log(`[Xing Fitness] Serving SPA from: ${DIST_DIR}`);
});
