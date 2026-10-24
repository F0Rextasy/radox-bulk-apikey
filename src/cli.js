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
 *   --auto           headless-friendly alias (launcher passes it; no prompts ever)   
 *   --verify-only      re-check every key in keys.txt with a live chat call
 *   --screen           only test the proxy list against the host
 *   --model <id>       model used for the live verification (default claude-opus-5)
 *   --proxies <file>   proxy list, one exit per line (env RADOX_PROXIES) [optional]
 *   --help
 *   --preset=turbo|balanced|safe   run shape = workers + inter-account gap
 *                      (turbo = 5 workers / 3 s — recommended; balanced = 4/6;
 *                      safe = 2/8). Explicit --conc/--gap override the preset.
 *
 * Environment: RADOX_PROXIES (proxy list path, default proxies.txt) [optional]
 *
 * Your proxy list is OPTIONAL: pass --proxies (or the RADOX_PROXIES env) and
 * every request goes through an exit from it; without a pool the tool connects
 * directly.
 *
 * Zero dependencies. Node.js >= 18.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');
const { presetArgv, resolvePreset } = require('./preset');
const { uaFor } = require('./ua-pool');

const ROOT = path.resolve(__dirname, '..');
const KEYS_FILE = path.join(ROOT, 'keys.txt');
const ACCOUNTS_FILE = path.join(ROOT, 'accounts.json');
const OUT_DIR = path.join(ROOT, 'outputs');

/** Dead-key report: only definite rejections — 429/5xx/transport never land here. */
const DEAD_FILE = path.join(ROOT, 'keys-dead.txt');
const DEAD_STATUS = new Set([401, 403]);
const DEAD_REASON = /banned|deactivated|disabled|suspended|quota|insufficient|forbidden|unauthorized/i;
function recordDead(key, status, sample) {
  if (!key) return;
  if (!DEAD_STATUS.has(Number(status)) && !DEAD_REASON.test(String(sample || ''))) return;
  const why = `${status}${sample ? ' ' + String(sample).replace(/\s+/g, ' ').slice(0, 60) : ''}`;
  try {
    fs.mkdirSync(path.dirname(DEAD_FILE), { recursive: true });
    fs.appendFileSync(DEAD_FILE, `${key}\t${why}\t${new Date().toISOString()}\n`);
  } catch (e) { /* diagnostics must never break the run */ }
}

const BASE = 'https://radoxai.com';
const EMAILNATOR = 'https://www.emailnator.com';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36';

// Shared/disposable boxes carry other tenants' mail: only a message that names
// this panel may supply the code (measured 2026-10-24: dddai read a stranger's
// code from a shared box). Override: --brand / RADOX_BRAND_RE.
let BRAND = new RegExp(process.env.RADOX_BRAND_RE || 'radoxai\\.com|radox', 'i');

const argv = process.argv.slice(2);
const arg = (n, d) => {
  const i = argv.indexOf(`--${n}`);
  return i !== -1 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : d;
};
const has = (n) => argv.includes(`--${n}`);
if (arg('brand')) BRAND = new RegExp(arg('brand'), 'i'); // --brand overrides the mail fence

if (has('help') || has('h')) {
  console.log('radox-bulk-apikey — mint Radox AI accounts, one key each, verified by a live chat call.\n');
  console.log('  node src/cli.js --count 50     mint (keys kept only after a 200)');
  console.log('  node src/cli.js --verify-only  re-check keys.txt');
  console.log('  node src/cli.js --screen       test the proxy list against Radox');
  console.log('  node src/cli.js --preset=turbo --count 50 run shape (turbo = 5 workers)');
  console.log('  node src/cli.js --proxies proxies.txt   proxy list, one exit per line [optional]');
  console.log('  --brand RE                     sender/subject fence for the code mail (env RADOX_BRAND_RE)');
  console.log('\nEnv: RADOX_PROXIES (proxy list path, default proxies.txt) [optional]');
  console.log('\nRequests go through your proxy list when one is provided (--proxies / RADOX_PROXIES).');
  console.log('Without a pool the tool connects directly.');
  process.exit(0);
}

const COUNT = parseInt(arg('count', '50'), 10);
const MODEL = arg('model', 'claude-opus-5');
const AUTO = has('auto');
const VERIFY_ONLY = has('verify-only');
const SCREEN_ONLY = has('screen');
const PROXY_FILE = process.env.RADOX_PROXIES || arg('proxies', 'proxies.txt');

// Presets (operator standard v3): --preset picks workers + inter-account gap,
// explicit --conc/--gap win over it, and without --preset the rail keeps
// today's shape exactly (one account at a time, 900 ms pad).
const flagVal = (n) => {
  const eq = argv.find((a) => a.startsWith(`--${n}=`));
  if (eq) return eq.split('=').slice(1).join('=');
  return arg(n, null);
};
const numOrNull = (v) => {
  const n = v === null || v === undefined || v === true ? NaN : parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
};
const PRESET_RUN = resolvePreset({
  preset: presetArgv() || arg('preset', null),
  conc: numOrNull(flagVal('conc')),
  gap: numOrNull(flagVal('gap')),
  defaultConc: 1,
  defaultGap: 0.9,
});

function loadProxies() {
  const f = path.resolve(ROOT, PROXY_FILE);
  if (!fs.existsSync(f)) {
    // No pool = DIRECT mode: a proxy is recommended at scale (per-IP limits,
    // bans) but the tool works without one. `null` is the direct sentinel.
    console.log(`no proxy list at ${PROXY_FILE} — running WITHOUT a proxy (direct). Put exits there (or pass --proxies) to route through them.`);
    return [null];
  }
  const proxies = fs
    .readFileSync(f, 'utf8')
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter((s) => s && !s.startsWith('#'));
  if (!proxies.length) {
    console.log(`${PROXY_FILE} has no usable exits — running WITHOUT a proxy (direct).`);
    return [null];
  }
  return proxies;
}

// ---------------------------------------------------------------- http core
// Per-account cookie isolation (operator standard v3): a --preset run keeps
// several accounts in flight at once, so each account gets its own cookie jar
// in the async context it was started in; absent --preset nothing changes.
const { AsyncLocalStorage } = require('async_hooks');
const SESS = new AsyncLocalStorage();
const activeUa = (dflt) => { const s = SESS.getStore(); return (s && s.ua) || dflt; };
let jar = {}; // fallback jar for requests made outside any account session
const activeJar = () => { const s = SESS.getStore(); return s ? s.jar : jar; };
const resetJar = () => { const s = SESS.getStore(); if (s) s.jar = {}; else jar = {}; };
const cookieHeader = () => Object.entries(activeJar()).map(([k, v]) => `${k}=${v}`).join('; ');
function absorb(res) {
  const j = activeJar();
  for (const c of res.headers['set-cookie'] || []) {
    const [pair] = c.split(';');
    const i = pair.indexOf('=');
    if (i > 0) j[pair.slice(0, i).trim()] = pair.slice(i + 1);
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
    const hs = { 'user-agent': activeUa(UA), accept: 'text/html,application/json;q=0.9,*/*;q=0.8', ...headers };
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
    // A CONNECT request answers on the `connect` event, not the response callback —
    // registering a response handler here makes every tunnelled call hang.
    const connect = require('http').request(
      { method: 'CONNECT', host: p.hostname, port: p.port, path: `${u.hostname}:443`, headers: { host: `${u.hostname}:443` }, timeout: 10000 }
    );
    connect.on('connect', (res, socket) => {
      if (res.statusCode !== 200) return reject(new Error(`proxy CONNECT ${res.statusCode}`));
      socket.once('error', reject);
      const r = https.request({ method, socket, servername: u.hostname, host: u.hostname, port: 443, path: u.pathname + u.search, headers: hs }, done);
      r.setTimeout(timeoutMs, () => r.destroy(new Error('timeout')));
      r.on('error', reject);
      if (payload) r.write(payload);
      r.end();
    });
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
/**
 * Ids already in the shared Emailnator box, taken BEFORE the code request. The
 * gmail pool is recycled, so a pre-send id belongs to another tenant; a snapshot
 * that fails is not an empty box — it retries, then throws.
 */
async function snapshotIds(proxies, proxy, plain) {
  for (let k = 0; k < 4; k++) {
    try {
      const r = await requestR(proxies, proxy, `${EMAILNATOR}/api/message-list`, { method: 'POST', body: { email: plain, limit: 20 } });
      const msgs = (jparse(r.text) || {}).messages;
      if (Array.isArray(msgs)) return new Set(msgs.map((m) => String((m && m.id) || '')).filter(Boolean));
    } catch (e) { /* retry */ }
    await sleep(4000);
  }
  throw new Error('inbox snapshot failed (exits unhealthy)');
}
async function waitRadoxMail(proxies, proxy, addr, { timeoutMs = 180000, pollMs = 8000, seenIds = [] } = {}) {
  const deadline = Date.now() + timeoutMs;
  const seen = new Set(seenIds); // the pre-send snapshot is the fence: older ids are another tenant's mail
  while (Date.now() < deadline) {
    const r = await requestR(proxies, proxy, `${EMAILNATOR}/api/message-list`, { method: 'POST', body: { email: addr.plain, limit: 20 }, headers: { origin: EMAILNATOR, referer: EMAILNATOR + '/' } });
    const j = jparse(r.text);
    for (const m of (j && j.messages) || []) {
      const id = String(m.id);
      if (seen.has(id)) continue;
      seen.add(id);
      const from = String(m.from || m.sender || '');
      const subject = String(m.subject || '');
      const hay = `${m.from || ''} ${m.subject || ''}`;
      if (!BRAND.test(hay)) continue; // the panel's own mail only
      const full = await requestR(proxies, proxy, `${EMAILNATOR}/api/message/${encodeURIComponent(id)}`, {});
      const content = String((jparse(full.text) || {}).content || '');
      const text = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
      const code = (text.match(/\b(\d{6})\b/) || [])[1] || null;
      const links = [...content.matchAll(/href="([^"]+)"/g)].map((x) => x[1].replace(/&amp;/g, '&'));
      const radoxLink = links.find((h) => /radoxai\.com/i.test(h) && /verif|confirm|email/i.test(h)) || links.find((h) => /radoxai\.com/i.test(h));
      return { id, from, subject, content, text, code, radoxLink };
    }
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
      console.log(`${good ? '✔' : '✖'} ${px || 'direct'} -> ${r.status}`);
      // direct mode is not an exit — never write the sentinel into the live pool
      if (good) { ok++; if (px) { fs.mkdirSync(OUT_DIR, { recursive: true }); fs.appendFileSync(path.join(OUT_DIR, 'proxies-live.txt'), `${px}\n`); } }
    } catch (e) {
      console.log(`✖ ${px || 'direct'} -> ${String((e && e.message) || e).slice(0, 60)}`);
    }
  }
  console.log(`live ${ok}/${proxies.length}`);
}

async function mintOne(proxies, proxy, index, accounts) {
  const addr = await newGmail(proxies, proxy);
  const seenIds = await snapshotIds(proxies, proxy, addr.plain);
  const username = 'radox' + Math.random().toString(36).slice(2, 8);
  const password = 'Rx' + Math.random().toString(36).slice(2, 10) + '!9';
  resetJar();
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
    try { mail = await waitRadoxMail(proxies, proxy, addr, { timeoutMs: 45000, pollMs: 6000, seenIds }); } catch (e) { mail = null; }
    if (!mail) {
      const ve = await requestR(proxies, proxy, `${BASE}/verify-email`, { withCookies: true });
      const t2 = htmlToken(ve.text);
      await requestR(proxies, proxy, `${BASE}/verify-email/resend`, { method: 'POST', withCookies: true, form: { _token: t2 || '' }, headers: { origin: BASE, referer: `${BASE}/verify-email` } }).catch(() => {});
      mail = await waitRadoxMail(proxies, proxy, addr, { seenIds });
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
  } else recordDead(key, chat.status, chat.text);
  return { ok, key };
}

async function mint() {
  const proxies = loadProxies();
  const accounts = fs.existsSync(ACCOUNTS_FILE) ? jparse(fs.readFileSync(ACCOUNTS_FILE, 'utf8')) || [] : [];
  const conc = Math.max(1, PRESET_RUN.conc);
  const gapMs = Math.max(0, PRESET_RUN.gap) * 1000;
  console.log(`RADOX-CLI run · count=${COUNT} conc=${conc} gap=${gapMs / 1000}s${PRESET_RUN.name ? ` preset=${PRESET_RUN.name}` : ''}`);
  let made = 0, attempts = 0, next = 1;
  async function worker() {
    while (made < COUNT && attempts < COUNT * 6) {
      const i = next++;
      attempts++;
      const proxy = proxies[attempts % proxies.length];
      console.log(`… #${i} başladı (${proxy ? String(proxy).replace(/:[^:@]+@/, ':***@') : 'direct'})`);
      try {
        // Each account runs in its own async context so its cookie jar cannot
        // mix with a sibling account's (turbo/balanced/safe runs).
        const r = await SESS.run({ jar: {}, ua: uaFor(i).ua }, () => mintOne(proxies, proxy, accounts.length + 1, accounts));
        if (r.ok) {
          made++;
          console.log(`✓ #${i} KEY ALINDI: ${String(r.key).slice(0, 22)}… [${made} ok / ${attempts} deneme]`);
        } else {
          console.log(`✗ #${i} key yok: chat gate failed`);
        }
      } catch (e) {
        console.log(`✗ #${i} key yok: ${String((e && e.message) || e).slice(0, 140)}`);
      }
      if (gapMs) await sleep(gapMs);
    }
  }
  await Promise.all(Array.from({ length: Math.min(conc, Math.max(1, COUNT)) }, () => worker()));
  console.log(`done: ${made} key(s) this run, ${accounts.length} account(s) total`);
  console.log(`RADOX-CLI ${made}/${COUNT} OK`);
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
      else recordDead(key, chat.status, chat.text);
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
