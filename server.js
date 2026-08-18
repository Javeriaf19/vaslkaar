/* ============================================
   VASLKAAR — Local Dev Server
   Serves static files + API proxy
   Run: node server.js
   ============================================ */

const http = require('http');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const PORT = 3000;

// MIME types
const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
};

// Import the API handler
const generateHandler = require('./api/generate');

const server = http.createServer(async (req, res) => {
  // ---- API Routes ---- //
  if (req.url === '/api/generate' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        req.body = JSON.parse(body);
      } catch (e) {
        req.body = {};
      }

      // Create a mock Vercel-style res object
      const mockRes = {
        statusCode: 200,
        headers: {},
        setHeader(key, value) { this.headers[key] = value; },
        status(code) { this.statusCode = code; return this; },
        json(data) {
          res.writeHead(this.statusCode, {
            'Content-Type': 'application/json',
            ...this.headers,
          });
          res.end(JSON.stringify(data));
        },
        end() {
          res.writeHead(this.statusCode, this.headers);
          res.end();
        },
      };

      await generateHandler(req, mockRes);
    });
    return;
  }

  // ---- Static Files ---- //
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, filePath);

  const ext = path.extname(filePath);
  const contentType = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log('');
  console.log('  ╔══════════════════════════════════════╗');
  console.log('  ║  🚀 VASLKAAR Dev Server Running     ║');
  console.log(`  ║  → http://localhost:${PORT}             ║`);
  console.log('  ║  Press Ctrl+C to stop                ║');
  console.log('  ╚══════════════════════════════════════╝');
  console.log('');
});
