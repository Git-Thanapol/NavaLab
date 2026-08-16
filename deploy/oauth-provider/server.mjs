// Minimal GitHub OAuth provider compatible with Decap/Sveltia CMS's
// "external OAuth" protocol: /auth starts the GitHub login, /callback
// exchanges the code for a token and hands it back to the CMS tab via
// window.postMessage. Self-hosted replacement for Sveltia's Cloudflare
// Worker proxy, since this stack runs entirely in Docker.
import http from 'node:http';
import https from 'node:https';
import crypto from 'node:crypto';
import { URL } from 'node:url';

const PORT = 8083;
const CLIENT_ID = process.env.GITHUB_OAUTH_CLIENT_ID ?? '';
const CLIENT_SECRET = process.env.GITHUB_OAUTH_CLIENT_SECRET ?? '';
const CALLBACK_URL = process.env.OAUTH_CALLBACK_URL ?? '';

function postJson(hostname, path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = https.request(
      {
        hostname,
        path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Content-Length': Buffer.byteLength(data),
          'User-Agent': 'navalab-oauth-provider',
        },
      },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          try {
            resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
          } catch (err) {
            reject(err);
          }
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function parseCookies(header = '') {
  return Object.fromEntries(
    header
      .split(';')
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => {
        const idx = p.indexOf('=');
        return [p.slice(0, idx), decodeURIComponent(p.slice(idx + 1))];
      })
  );
}

function renderPostMessage(status, payload) {
  // Two-step handshake matches the reference Decap/Sveltia OAuth provider:
  // this popup announces itself, and only sends the real payload once the
  // opener (which is listening for exactly this) replies — avoiding a race
  // where the popup's message arrives before the opener's listener attaches.
  const message = `authorization:github:${status}:${JSON.stringify(payload)}`;
  return `<!doctype html><html><body><script>
    (function () {
      function receiveMessage(e) {
        window.opener.postMessage(${JSON.stringify(message)}, e.origin);
        window.removeEventListener('message', receiveMessage, false);
      }
      window.addEventListener('message', receiveMessage, false);
      window.opener.postMessage('authorizing:github', '*');
    })();
  </script></body></html>`;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/auth') {
    const state = crypto.randomBytes(16).toString('hex');
    const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
    authorizeUrl.searchParams.set('client_id', CLIENT_ID);
    authorizeUrl.searchParams.set('redirect_uri', CALLBACK_URL);
    authorizeUrl.searchParams.set('scope', 'repo,user');
    authorizeUrl.searchParams.set('state', state);

    res.writeHead(302, {
      Location: authorizeUrl.toString(),
      'Set-Cookie': `oauth_state=${state}; HttpOnly; Path=/; Max-Age=600; SameSite=Lax`,
    });
    res.end();
    return;
  }

  if (url.pathname === '/callback') {
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const cookies = parseCookies(req.headers.cookie);

    if (!code || !state || state !== cookies.oauth_state) {
      res.writeHead(400).end('Invalid OAuth state.');
      return;
    }

    try {
      const token = await postJson('github.com', '/login/oauth/access_token', {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: CALLBACK_URL,
      });

      if (token.error || !token.access_token) {
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.end(renderPostMessage('error', { message: token.error_description ?? 'OAuth failed' }));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(renderPostMessage('success', { token: token.access_token, provider: 'github' }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.end(renderPostMessage('error', { message: 'OAuth exchange failed' }));
    }
    return;
  }

  res.writeHead(404).end('not found');
});

server.listen(PORT, () => {
  console.log(`oauth-provider listening on :${PORT}`);
});
