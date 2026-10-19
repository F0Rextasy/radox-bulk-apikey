<div align="center">

```
██████╗  █████╗ ██████╗  ██████╗ ██╗  ██╗
██╔══██╗██╔══██╗██╔══██╗██╔═══██╗╚██╗██╔╝
██████╔╝███████║██║  ██║██║   ██║ ╚███╔╝
██╔══██╗██╔══██║██║  ██║██║   ██║ ██╔██╗
██║  ██║██║  ██║██████╔╝╚██████╔╝██╔╝ ██╗
╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝  ╚═════╝ ╚═╝  ╚═╝
```

# radox-bulk-apikey

**Bulk-create Radox AI accounts with auto-generated API keys — OpenAI-compatible inference (Claude, GPT, Gemini, DeepSeek, Kimi, GLM, Grok) + 9Router connector.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-33%20served-412991?style=for-the-badge)](https://radoxai.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Quick start](#-quick-start) · [🎁 Free tier](#-free-tier--how-much-you-get) · [🤖 Models](#-models--all-33-of-them) · [🧪 Use the API](#-how-to-use-the-api) · [✅ Verified](#-verified-working--every-key-is-tested) · [🧭 How it works](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Options](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Issues](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## 🎁 Free tier — how much you get

**Every new Radox account starts with 10M tokens / month on ALL 33 models — no card, no phone.**

| What | Value |
| --- | --- |
| Monthly allowance | **10,000,000 tokens** per account, on every model in the catalogue |
| Card required | **No** |
| Rate limit | 80 requests / minute |
| Sign-up | e-mail + password (standard providers such as Gmail are accepted) |
| The unit that scales | **one account = one key** → `--count N` is really "N free accounts" |

> 💡 The free tier is set by Radox AI and can change. Check the live numbers at [radoxai.com](https://radoxai.com) — and let the tool's own gate decide:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Models — all 33 of them

`GET https://radoxai.com/v1/models` serves 33 ids; **32 of them answered a live chat 200** on the 2026-10-19 re-check (free tier covers the whole catalogue; nothing is paid-gated); `seed-2.1-turbo` did not.

|Model|✓|
|---|---|
|`claude-opus-5`|✓|
|`claude-opus-5.5`|✓|
|`claude-opus-4.6`|✓|
|`claude-opus-4.7`|✓|
|`claude-opus-4.8`|✓|
|`claude-sonnet-5`|✓|
|`claude-fable-5`|✓|
|`claude-fable-5.1`|✓|
|`claude-mythos-preview`|✓|
|`gpt-5.5`|✓|
|`gpt-5.5-pro`|✓|
|`gpt-5.6-sol`|✓|
|`gpt-5.6-terra`|✓|
|`gpt-5.6-luna`|✓|
|`deepseek-v4-pro-max`|✓|
|`deepseek-v4-pro-0813`|✓|
|`deepseek-v4-flash-0731`|✓|
|`kimi-k3`|✓|
|`kimi-k2.6`|✓|
|`glm-5.3`|✓|
|`glm-5.2`|✓|
|`grok-4.6`|✓|
|`grok-4.5`|✓|
|`gemini-3.1-pro`|✓|
|`gemini-3.6-flash`|✓|
|`gemini-3.7-flash`|✓|
|`qwen3.8-max`|✓|
|`qwen3.8-27b`|✓|
|`qwen3.7-max`|✓|
|`seed-2.1-pro`|✓|
|`muse-spark-1.1`|✓|
|`gemma-2-2b`|✓|

Live probe of one key (this is exactly what the tool does before it accepts a key):

```bash
curl https://radoxai.com/v1/chat/completions \
  -H "Authorization: Bearer <one of your keys>" \
  -H "Content-Type: application/json" \
  -d '{"model":"claude-opus-5","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🧪 How to use the API

The base URL is **`https://radoxai.com/v1`** — OpenAI-compatible, so anything that speaks OpenAI works.

**Any SDK / curl**

```python
from openai import OpenAI
client = OpenAI(base_url="https://radoxai.com/v1", api_key="<your key>")
print(client.chat.completions.create(model="kimi-k3",
      messages=[{"role": "user", "content": "hi"}]).choices[0].message.content)
```

**Claude Code** (Anthropic-compatible surface — no `/v1` suffix on the base):

```bash
export ANTHROPIC_BASE_URL="https://radoxai.com"
export ANTHROPIC_AUTH_TOKEN="<your key>"
export ANTHROPIC_MODEL="claude-opus-5"
claude
```

**Any agent / tool with a custom base URL** (Cursor, OpenCode, Kilo Code, …): set base URL `https://radoxai.com/v1`, paste a key, pick any model id from the table above.

## 🛠 Quick start

```bash
# clone or fork this repository, then:
cd radox-bulk-apikey

# 1) your proxy list, one per line (http://… or socks5://…)
printf 'http://127.0.0.1:8080\n' > proxies.txt

# 2) go
node src/launcher.js        # interactive
# or directly:
node src/cli.js --count 50
```

`keys.txt` (mirrored to `%USERPROFILE%\radox-keys.txt`) is written **only** after a live chat completion proves the key.

### 🖱️ The launcher

The launcher asks for the proxy list, count and verification model, remembers them in `launcher.config.json`, and runs the CLI with the right flags.

## ✅ Verified working — every key is tested

| Check | Result |
| --- | --- |
| account creation | `POST /register` creates the account; the provider's own mail step answers `500 Server Error` **after** the account exists — the tool continues on the session instead of aborting |
| e-mail verification | the mailbox carries a **6-digit code**; posting it to `POST /verify-email` (resend at `POST /verify-email/resend`) turns `/dashboard` into the real page |
| key creation | `POST /dashboard/api-keys` — the plaintext key comes back once |
| live proof | `POST /v1/chat/completions` — run for **every** key before it is written to `keys.txt` |
| a key that fails the chat check | never written — the account stays recoverable in `accounts.json` |

## 🧭 How it works

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Radox AI page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://radoxai.com/v1/chat/completions → real content = the key is live
```

| Step | Call | Notes |
| --- | --- | --- |
| sign-up | `POST /register` | Laravel form post with the page `_token` |
| verify | `POST /verify-email` | the 6-digit code from the mailbox |
| key | `POST /dashboard/api-keys` | plaintext key returned once |
| check | `POST /v1/chat/completions` | live 200 required before `keys.txt` |

## ⚙️ CLI options

```bash
node src/cli.js --count N        # mint (default 50)
node src/cli.js --verify-only    # re-check every key in keys.txt with a live chat call
node src/cli.js --help
```

| Environment variable | Default | Meaning |
| --- | --- | --- |
| `RADOX_PROXIES` | `proxies.txt` | pool file, one proxy per line |

## 🛰️ Behind a proxy

Every request leaves through a proxy line from your pool; a dead exit fails that attempt and the tool moves to the next — the account is retried on a fresh exit, never from your own IP.

## 📄 Files

| Path | Contents |
| --- | --- |
| `keys.txt` | one live-verified key per line — git-ignored |
| `accounts.json` | e-mail / password / key / chat status per account |
| `proxies.txt` | your exits, one per line — git-ignored |
| `outputs/` | run state — git-ignored |

## 🔌 Connect to 9Router

[9Router](https://9router.com) is a self-hosted, OpenAI-compatible router. Register this provider once and every key becomes a connection under one provider-node:

```bash
node src/connect-9router.js
# or: npm run 9router
```

Defaults: `--base http://localhost:20128`, `--password 123456`, `--name "Radox"`, `--prefix radox`, `--base-url https://radoxai.com/v1`. Models are then served as `radox/<model id>` and load-balanced across every key.

## 🔑 What one key gets you

| | |
| --- | --- |
| 🏢 Provider | **Radox AI** — [radoxai.com](https://radoxai.com) |
| 🎁 What the provider gives | free tier, one account per key — every key chat-verified across 33 models |
| 🔑 What one key gets you | one API key scoped to its own account: the 33 model ids on the endpoint below, at your plan's limits. The quota lives on the **account**, which is exactly why this tool creates one account per key |
| 🌐 API shape | OpenAI-compatible: `POST https://radoxai.com/v1/chat/completions` |
| 🔒 Your data | only radoxai.com and the inbox backend you configure are contacted; keys stay on your machine |

## 🐞 Issues

If Radox changes its sign-up shape or quota, the tool stops at that step and says so. **[Open an issue](../../issues)** with the command you ran and the exact output; PRs are welcome.

## 📄 License

MIT © 2026 — see [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 radox-bulk-apikey contributors

</div>

## ⚡ Run shape (presets)

`--preset=turbo|balanced|safe` sets workers + the pause between accounts (turbo = 5,
balanced = 4, safe = 2); explicit `--conc`/`--gap` (or the repo's own flags) always win,
and without `--preset` the tool keeps its historical shape exactly.

Turbo önerilir (5 worker); daha fazlası zayıf bilgisayarda yük/ban riski.
