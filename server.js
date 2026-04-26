const http = require('http');
const fs = require('fs/promises');
const path = require('path');
const { URL } = require('url');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const DATA_DIR = path.join(ROOT_DIR, 'data');
const STATE_FILE = path.join(DATA_DIR, 'state.json');
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp'
};

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store'
  });
  res.end(body);
}

function sendText(res, statusCode, payload, contentType = 'text/plain; charset=utf-8') {
  res.writeHead(statusCode, {
    'Content-Type': contentType,
    'Content-Length': Buffer.byteLength(payload),
    'Cache-Control': 'no-store'
  });
  res.end(payload);
}

async function ensureStateFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(STATE_FILE);
  } catch {
    await fs.writeFile(STATE_FILE, '{}', 'utf8');
  }
}

async function readState() {
  await ensureStateFile();
  const raw = await fs.readFile(STATE_FILE, 'utf8');
  if (!raw.trim()) {
    return {};
  }

  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function writeState(state) {
  await ensureStateFile();
  await fs.writeFile(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
}

async function serveStatic(req, res, pathname) {
  const safePath = pathname === '/' ? '/index.html' : pathname;
  const filePath = path.normalize(path.join(ROOT_DIR, safePath.replace(/^\//, '')));

  if (!filePath.startsWith(ROOT_DIR)) {
    sendText(res, 403, 'Forbidden');
    return;
  }

  try {
    const file = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600'
    });
    res.end(file);
  } catch {
    sendText(res, 404, 'Not found');
  }
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'no-referrer');

    if (url.pathname === '/api/health' && req.method === 'GET') {
      sendJson(res, 200, { ok: true });
      return;
    }

    if (url.pathname === '/api/state') {
      if (req.method === 'GET') {
        const state = await readState();
        sendJson(res, 200, state);
        return;
      }

      if (req.method === 'POST') {
        const chunks = [];
        for await (const chunk of req) {
          chunks.push(chunk);
        }

        const body = Buffer.concat(chunks).toString('utf8').trim();
        if (!body) {
          sendJson(res, 400, { error: 'Request body is required.' });
          return;
        }

        let parsed;
        try {
          parsed = JSON.parse(body);
        } catch {
          sendJson(res, 400, { error: 'Invalid JSON.' });
          return;
        }

        await writeState(parsed);
        sendJson(res, 200, { ok: true });
        return;
      }

      sendText(res, 405, 'Method not allowed');
      return;
    }

    if (req.method === 'GET' || req.method === 'HEAD') {
      await serveStatic(req, res, url.pathname);
      return;
    }

    sendText(res, 405, 'Method not allowed');
  } catch (error) {
    sendJson(res, 500, { error: 'Internal server error', detail: error.message });
  }
});

server.listen(PORT, () => {
  console.log(`PulseRank server running at http://localhost:${PORT}`);
});
