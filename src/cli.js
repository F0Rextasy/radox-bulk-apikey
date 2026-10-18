#!/usr/bin/env node
'use strict';

/**
 * radox-bulk-apikey CLI — mint Radox AI accounts, one key per account, verify
 * every key with a live chat call and write the survivors to keys.txt.
 *
 * Flow (Laravel app; the provider's mail step answers 500 *after* the account
 * exists, so the tool continues on the session instead of aborting):
 *   GET  /register                      → page _token + session cookie
 *   POST /register {name,email,phone,password,password_confirmation,_token}
 *   POST /email/verification-notification   → verification mail
 *   GET  /email/verify/... (link from the mailbox)
 *   POST /dashboard/api-keys {name}     → plaintext key
 *   POST /v1/chat/completions           → live check (200 = kept)
 *
 * Mailboxes come from Emailnator (real @gmail.com addresses, standard provider
 * so Radox's "custom domain once" rule never triggers).
 *
 * Options:
 *   --count N          how many accounts/keys to mint (default 50)
 *   --verify-only      re-check every key in keys.txt with a live chat call
 *   --screen           only test the proxy list against the host
 *   --model <id>       model used for the live verification (default claude-opus-5)
 *   --help
 *
 * Environment: RADOX_PROXIES (proxy list path, default proxies.txt)
 * Zero dependencies. Node.js >= 18.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

const ROOT = path.resolve(__dirname, '..');
const KEYS_FILE = path.join(ROOT, 'keys.txt');
const ACCOUNTS_FILE = path.join(ROOT, 'accounts.json');
const OUT_DIR = path.join(ROOT, 'outputs');

const BASE = 'https://radoxai.com';
const EMAILNATOR = 'https://www.emailnator.com';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36';

const argv = process.argv.slice(2);
const arg = (n, d) => {
  const i = argv.indexOf(`--${n}`);
  return i !== -1 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : d;
};
const has = (n) => argv.includes(`--${n}`);

if (has('help') || has('h')) {
  console.log('radox-bulk-apikey — mint Radox AI accounts, one key each, verified by a live chat call.\n');
  console.log('  node src/cli.js --count 50     mint (keys kept only after a 200)');
  console.log('  node src/cli.js --verify-only  re-check keys.txt');
  console.log('  node src/cli.js --screen       test the proxy list against Radox');
  console.log('\nEnv: RADOX_PROXIES (proxy list path, default proxies.txt)');
  process.exit(0);
}

const COUNT = parseInt(arg('count', '50'), 10);
const MODEL = arg('model', 'claude-opus-5');
const VERIFY_ONLY = has('verify-only');
const SCREEN_ONLY = has('screen');
const PROXY_FILE = process.env.RADOX_PROXIES || arg('proxies', 'proxies.txt');

function loadProxies() {
  const f = path.resolve(ROOT, PROXY_FILE);
  if (!fs.existsSync(f)) {
    console.error(`! proxy list not found: ${PROXY_FILE} (one proxy per line: http://host:port)`);
    process.exit(2);
  }
  return fs
    .readFileSync(f, 'utf8')
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter((s) => s && !s.startsWith('#'));
}

// ---------------------------------------------------------------- http core
let jar = {};
const cookieHeader = () => Object.entries(jar).map(([k, v]) => `${k}=${v}`).join('; ');
function absorb(res) {
  for (const c of res.headers['set-cookie'] || []) {
    const [pair] = c.split(';');
    const i = pair.indexOf('=');
    if (i > 0) jar[pair.slice(0, i).trim()] = pair.slice(i + 1);
  }
}
const jparse = (s) => { try { return JSON.parse(s); } catch (e) { return null; } };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Minimal HTTP client — https via a plain CONNECT proxy, or direct when the
 * line is socks/absent. `form` posts application/x-www-form-urlencoded and
 * `withCookies` keeps the session jar for this request.
 */
function request(proxyLine, url, { method = 'GET', headers = {}, body = null, form = null, timeoutMs = 30000, withCookies = false } = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    let payload = null;
    const hs = { 'user-agent': UA, accept: 'text/html,application/json;q=0.9,*/*;q=0.8', ...headers };
    if (form) {
      payload = Buffer.from(new URLSearchParams(form).toString());
      hs['content-type'] = 'application/x-www-form-urlencoded';
    } else if (body !== null) {
      payload = Buffer.from(JSON.stringify(body));
      hs['content-type'] = 'application/json';
    }
    if (payload) hs['content-length'] = payload.length;
    if (withCookies && cookieHeader()) hs.cookie = cookieHeader();
    const done = (res) => {
      let t = '';
      res.setEncoding('utf8');
      res.on('data', (c) => (t += c));
      res.on('end', () => {
        if (withCookies) absorb(res);
        resolve({ status: res.statusCode || 0, text: t, location: res.headers.location || '' });
      });
    };
    const direct = () => {
      const r = https.request({ method, host: u.hostname, port: 443, path: u.pathname + u.search, headers: hs }, done);
      r.setTimeout(timeoutMs, () => r.destroy(new Error('timeout')));
      r.on('error', reject);
      if (payload) r.write(payload);
      r.end();
    };
    if (!proxyLine || /^socks/i.test(proxyLine)) return direct();
    const p = new URL(proxyLine.startsWith('http') ? proxyLine : `http://${proxyLine}`);
    const connect = require('http').request(
      { method: 'CONNECT', host: p.hostname, port: p.port, path: `${u.hostname}:443`, headers: { host: `${u.hostname}:443` }, timeout: 10000 },
      (res) => {
        if (res.statusCode !== 200) return reject(new Error(`proxy CONNECT ${res.statusCode}`));
        res.socket.once('error', reject);
        const r = https.request({ method, socket: res.socket, servername: u.hostname, host: u.hostname, port: 443, path: u.pathname + u.search, headers: hs }, done);
        r.setTimeout(timeoutMs, () => r.destroy(new Error('timeout')));
        r.on('error', reject);
        if (payload) r.write(payload);
        r.end();
      }
    );
    connect.setTimeout(10000, () => connect.destroy(new Error('proxy CONNECT timeout')));
    connect.on('error', reject);
    connect.end();
  });
}

/** request with proxy drops retried on the next line from the pool. */
async function requestR(proxies, proxyLine, url, opts, tries = 3) {
  let last = null;
  for (let i = 0; i < tries; i++) {
    const px = i === 0 ? proxyLine : proxies[(i + 1) % proxies.length];
    try {
      return await request(px, url, opts);
    } catch (e) {
      last = e;
      await sleep(1200 + i * 1500);
    }
  }
  throw last;
}

const htmlToken = (t) => (t.match(/name="_token"[^>]*value="([^"]+)"/) || t.match(/name="csrf-token" content="([^"]+)"/) || [])[1] || null;

// ---------------------------------------------------------------- mailbox
async function newGmail(proxies, proxy) {
  for (let i = 0; i < 5; i++) {
    const r = await requestR(proxies, proxy, `${EMAILNATOR}/api/generate-email`, { method: 'POST', body: { ids: [3] }, headers: { origin: EMAILNATOR, referer: EMAILNATOR + '/' } });
    const j = jparse(r.text);
    if (j && j.email) {
      const [local, domain] = j.email.split('@');
      return { dotted: j.email, plain: `${local.replace(/\./g, '')}@${domain}` };
    }
    await sleep(2500);
  }
  throw new Error('emailnator: no address');
}
async function waitRadoxMail(proxies, proxy, addr, { timeoutMs = 180000, pollMs = 8000 } = {}) {
  const deadline = Date.now() + timeoutMs;
  const seen = new Set();
  let primed = false; // skip what is already in the shared mailbox; wait for a NEW radox mail
  while (Date.now() < deadline) {
    const r = await requestR(proxies, proxy, `${EMAILNATOR}/api/message-list`, { method: 'POST', body: { email: addr.plain, limit: 20 }, headers: { origin: EMAILNATOR, referer: EMAILNATOR + '/' } });
    const j = jparse(r.text);
    for (const m of (j && j.messages) || []) {
      const id = String(m.id);
      if (!primed) { seen.add(id); continue; }
      if (seen.has(id)) continue;
      seen.add(id);
      const from = String(m.from || m.sender || '');
      const subject = String(m.subject || '');
      if (!/radox/i.test(from + ' ' + subject)) continue;
      const full = await requestR(proxies, proxy, `${EMAILNATOR}/api/message/${encodeURIComponent(id)}`, {});
      const content = String((jparse(full.text) || {}).content || '');
      const text = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
      const code = (text.match(/\b(\d{6})\b/) || [])[1] || null;
      const links = [...content.matchAll(/href="([^"]+)"/g)].map((x) => x[1].replace(/&amp;/g, '&'));
      const radoxLink = links.find((h) => /radoxai\.com/i.test(h) && /verif|confirm|email/i.test(h)) || links.find((h) => /radoxai\.com/i.test(h));
      return { id, from, subject, content, text, code, radoxLink };
    }
    primed = true;
    await sleep(pollMs);
  }
  throw new Error('no verification mail');
}

// ------------------------------------------------------------------ flows
function appendKey(key) {
  fs.mkdirSync(ROOT, { recursive: true });
  fs.appendFileSync(KEYS_FILE, `${key}\n`);
  try {
    fs.appendFileSync(path.join(process.env.USERPROFILE || process.env.HOME || ROOT, 'radox-keys.txt'), `${key}\n`);
  } catch (e) { /* home mirror is best-effort */ }
}

async function screen(proxies) {
  let ok = 0;
  for (const px of proxies) {
    try {
      const r = await request(px, `${BASE}/register`, { timeoutMs: 15000 });
      const good = r.status === 200 && /_token/.test(r.text);
      console.log(`${good ? '✔' : '✖'} ${px} -> ${r.status}`);
      if (good) { ok++; fs.mkdirSync(OUT_DIR, { recursive: true }); fs.appendFileSync(path.join(OUT_DIR, 'proxies-live.txt'), `${px}\n`); }
    } catch (e) {
      console.log(`✖ ${px} -> ${String((e && e.message) || e).slice(0, 60)}`);
    }
  }
  console.log(`live ${ok}/${proxies.length}`);
}

async function mintOne(proxies, proxy, index, accounts) {
  const addr = await newGmail(proxies, proxy);
  const username = 'radox' + Math.random().toString(36).slice(2, 8);
  const password = 'Rx' + Math.random().toString(36).slice(2, 10) + '!9';
  jar = {};
  const pg = await requestR(proxies, proxy, `${BASE}/register`, { withCookies: true });
  const token = htmlToken(pg.text);
  if (!token) throw new Error('no csrf on register page');
  const reg = await requestR(proxies, proxy, `${BASE}/register`, {
    method: 'POST', withCookies: true,
    form: { _token: token, name: username, email: addr.plain, phone: '', password, password_confirmation: password },
    headers: { origin: BASE, referer: `${BASE}/register` },
  });
  if (reg.status === 422 && /already been taken/i.test(reg.text)) throw new Error('address was taken (retry with a fresh mailbox)');
  if (reg.status !== 500 && !(reg.status >= 300 && reg.status < 400)) throw new Error(`register ${reg.status}: ${reg.text.slice(0, 120)}`);
  await sleep(2500);
  const dash1 = await requestR(proxies, proxy, `${BASE}/dashboard`, { withCookies: true });
  let verified = dash1.status === 200;
  if (!verified) {
    let mail = null;
    try { mail = await waitRadoxMail(proxies, proxy, addr, { timeoutMs: 45000, pollMs: 6000 }); } catch (e) { mail = null; }
    if (!mail) {
      const ve = await requestR(proxies, proxy, `${BASE}/verify-email`, { withCookies: true });
      const t2 = htmlToken(ve.text);
      await requestR(proxies, proxy, `${BASE}/verify-email/resend`, { method: 'POST', withCookies: true, form: { _token: t2 || '' }, headers: { origin: BASE, referer: `${BASE}/verify-email` } }).catch(() => {});
      mail = await waitRadoxMail(proxies, proxy, addr);
    }
    if (mail.code) {
      const ve2 = await requestR(proxies, proxy, `${BASE}/verify-email`, { withCookies: true });
      const t4 = htmlToken(ve2.text);
      await requestR(proxies, proxy, `${BASE}/verify-email`, { method: 'POST', withCookies: true, form: { _token: t4 || '', code: mail.code }, headers: { origin: BASE, referer: `${BASE}/verify-email` } });
      verified = true;
    }
  }
  const dash = await requestR(proxies, proxy, `${BASE}/dashboard`, { withCookies: true });
  const t3 = htmlToken(dash.text);
  const kr = await requestR(proxies, proxy, `${BASE}/dashboard/api-keys`, {
    method: 'POST', withCookies: true,
    form: { _token: t3 || '', name: `radox-${index}` },
    headers: { origin: BASE, referer: `${BASE}/dashboard` },
  });
  const kj = jparse(kr.text);
  let key = kj && (kj.key || kj.token || (kj.data && (kj.data.key || kj.data.token)));
  if (!key) {
    // some renders answer the key inside a redirect/plain body
    const m = kr.text.match(/(cc_[A-Za-z0-9]{20,})/);
    if (m) key = m[1];
  }
  if (!key) throw new Error(`key ${kr.status}: ${kr.text.replace(/\s+/g, ' ').slice(0, 140)}`);
  const chat = await requestR(proxies, proxy, `${BASE}/v1/chat/completions`, {
    method: 'POST',
    headers: { authorization: `Bearer ${key}` },
    body: { model: MODEL, messages: [{ role: 'user', content: 'Reply OK' }], max_tokens: 8 },
    timeoutMs: 60000,
  });
  const ok = chat.status === 200 && /"content"\s*:/.test(chat.text);
  const rec = { index, email: addr.plain, username, password, key, model: MODEL, verified, chat: { status: chat.status, ok }, at: new Date().toISOString() };
  accounts.push(rec);
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(accounts, null, 2));
  console.log(`${ok ? '✔' : '✖'} #${index} ${addr.plain} key ${key.slice(0, 12)}… chat ${chat.status}`);
  if (ok) {
    appendKey(key);
    console.log('   written to keys.txt');
  }
  return ok;
}

async function mint() {
  const proxies = loadProxies();
  const accounts = fs.existsSync(ACCOUNTS_FILE) ? jparse(fs.readFileSync(ACCOUNTS_FILE, 'utf8')) || [] : [];
  let made = 0, attempts = 0;
  while (made < COUNT && attempts < COUNT * 6) {
    attempts++;
    const proxy = proxies[attempts % proxies.length];
    try {
      const ok = await mintOne(proxies, proxy, accounts.length + 1, accounts);
      if (ok) made++;
    } catch (e) {
      console.log(`#${accounts.length + 1} failed on ${proxy}: ${String((e && e.message) || e).slice(0, 140)}`);
    }
    await sleep(900);
  }
  console.log(`done: ${made} key(s) this run, ${accounts.length} account(s) total`);
}

async function verifyOnly() {
  const proxies = loadProxies();
  const keys = fs.existsSync(KEYS_FILE) ? fs.readFileSync(KEYS_FILE, 'utf8').split(/\r?\n/).map((s) => s.trim()).filter(Boolean) : [];
  let ok = 0;
  for (const [i, key] of keys.entries()) {
    const proxy = proxies[i % proxies.length];
    try {
      const chat = await requestR(proxies, proxy, `${BASE}/v1/chat/completions`, {
        method: 'POST',
        headers: { authorization: `Bearer ${key}` },
        body: { model: MODEL, messages: [{ role: 'user', content: 'Reply OK' }], max_tokens: 8 },
        timeoutMs: 60000,
      });
      const good = chat.status === 200 && /"content"\s*:/.test(chat.text);
      console.log(`${good ? '✔' : '✖'} ${key.slice(0, 12)}… (${MODEL}) -> ${chat.status}`);
      if (good) ok++;
    } catch (e) {
      console.log(`✖ ${key.slice(0, 12)}… -> ${String((e && e.message) || e).slice(0, 80)}`);
    }
    await sleep(600);
  }
  console.log(`verified ${ok}/${keys.length}`);
}

(async () => {
  if (SCREEN_ONLY) return screen(loadProxies());
  if (VERIFY_ONLY) return verifyOnly();
  return mint();
})().catch((e) => {
  console.error('[fatal]', String((e && e.message) || e).slice(0, 300));
  process.exit(1);
});
