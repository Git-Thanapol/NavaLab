// Receives GitHub's push webhook, verifies its HMAC signature, and forwards
// a trusted rebuild request to the builder service's internal build-agent.
import http from 'node:http';
import { createHmac, timingSafeEqual } from 'node:crypto';

const PORT = 9000;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET ?? '';
const BUILD_AGENT_SECRET = process.env.BUILD_AGENT_SECRET ?? '';
const BUILDER_HOST = process.env.BUILDER_HOST ?? 'builder';
const BUILDER_PORT = process.env.BUILDER_PORT ?? '9000';

function verifySignature(rawBody, signatureHeader) {
  if (!signatureHeader?.startsWith('sha256=')) return false;
  const expected = 'sha256=' + createHmac('sha256', WEBHOOK_SECRET).update(rawBody).digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(signatureHeader);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function triggerRebuild() {
  const req = http.request(
    {
      hostname: BUILDER_HOST,
      port: BUILDER_PORT,
      path: '/rebuild',
      method: 'POST',
      headers: { 'X-Build-Secret': BUILD_AGENT_SECRET },
    },
    (res) => res.resume()
  );
  req.on('error', (err) => console.error('Failed to reach builder:', err.message));
  req.end();
}

const server = http.createServer((req, res) => {
  if (req.method !== 'POST') {
    res.writeHead(405).end('method not allowed');
    return;
  }

  const chunks = [];
  req.on('data', (chunk) => chunks.push(chunk));
  req.on('end', () => {
    const rawBody = Buffer.concat(chunks);

    if (!WEBHOOK_SECRET || !verifySignature(rawBody, req.headers['x-hub-signature-256'])) {
      res.writeHead(401).end('invalid signature');
      return;
    }

    const event = req.headers['x-github-event'];
    if (event !== 'push') {
      res.writeHead(200).end(`ignored event: ${event}`);
      return;
    }

    console.log('Verified push webhook received, triggering rebuild.');
    triggerRebuild();
    res.writeHead(202).end('rebuild triggered');
  });
});

server.listen(PORT, () => {
  console.log(`webhook listening on :${PORT}`);
});
