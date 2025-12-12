/**
 * Simple log server that receives logs from browser and prints to terminal
 * Run this alongside your dev server: node scripts/log-server.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3002;
const LOG_FILE = path.join(__dirname, '../logs/browser-console.log');

// Ensure logs directory exists
const logsDir = path.dirname(LOG_FILE);
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create log file if it doesn't exist
if (!fs.existsSync(LOG_FILE)) {
  fs.writeFileSync(LOG_FILE, '');
}

const server = http.createServer((req, res) => {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/api/logs') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const { logs } = JSON.parse(body);
        
        logs.forEach((log) => {
          const timestamp = new Date(log.timestamp).toLocaleTimeString();
          const level = log.level.padEnd(10);
          const message = log.message;
          const data = log.data ? JSON.stringify(log.data, null, 2) : '';
          
          const logLine = `[${timestamp}] ${level} ${message}${data ? '\n' + data : ''}\n`;
          
          // Print to terminal
          process.stdout.write(logLine);
          
          // Also write to file
          fs.appendFileSync(LOG_FILE, logLine);
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (error) {
        console.error('Error processing logs:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`\n📋 Log Server running on http://localhost:${PORT}`);
  console.log(`📝 Logs will appear here and in: ${LOG_FILE}`);
  console.log(`🔗 Make sure your Vite proxy is configured to forward /api/logs\n`);
});

