// Tiny internal HTTP server: the webhook service calls POST /rebuild after
// verifying a GitHub webhook signature, and this agent runs rebuild.sh in
// the background. Never exposed outside the Docker network.
import http from 'node:http';
import { execFile } from 'node:child_process';
import { timingSafeEqual } from 'node:crypto';

const PORT = 9000;
const SECRET = process.env.BUILD_AGENT_SECRET ?? '';

let building = false;

function safeEqual(a, b) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

function runRebuild() {
  if (building) {
    console.log('Rebuild already in progress, ignoring trigger.');
    return;
  }
  building = true;
  execFile('/bin/sh', ['/rebuild.sh'], (error, stdout, stderr) => {
    building = false;
    if (stdout) process.stdout.write(stdout);
    if (stderr) process.stderr.write(stderr);
    if (error) console.error('Rebuild failed:', error.message);
  });
}

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/rebuild') {
    const provided = req.headers['x-build-secret'] ?? '';
    if (!SECRET || !safeEqual(String(provided), SECRET)) {
      res.writeHead(401).end('unauthorized');
      return;
    }
    runRebuild();
    res.writeHead(202).end('rebuild triggered');
    return;
  }

  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200).end('ok');
    return;
  }

  res.writeHead(404).end('not found');
});

server.listen(PORT, () => {
  console.log(`build-agent listening on :${PORT}`);
});
