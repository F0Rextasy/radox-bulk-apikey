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

[🛠 Quick start](#-quick-start) · [✅ Verified](#-verified-working--every-key-is-tested) · [🧭 How it works](#-how-it-works) · [🤖 Models & free tier](#-models--free-tier) · [🔌 9Router](#-connect-to-9router) · [🔑 What one key gets you](#-what-one-key-gets-you) · [⚙️ Options](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Issues](#-issues)

</div>

---

## ✨ Why this exists

Radox AI runs a **free tier of 10M tokens every month, no card required**, on one OpenAI-compatible endpoint that fronts 33 models — Claude Opus 5/5.5/4.6–4.8, GPT-5.5/5.6, Gemini 3.x, DeepSeek V4, Kimi K2.6/K3, GLM 5.2/5.3, Grok 4.5/4.6 and more. Sign-up is plain e-mail + password (any provider e-mail works; custom domains are limited to one account), and the account's first key is minted from the dashboard. This tool turns that into a `keys.txt` where **every line survived a live chat call**.

## 🤖 Models & free tier

`GET /v1/models` serves 33 ids; **33/33 answered a live chat 200** during verification:

| Model ID | note |
| --- | --- |
| `claude-opus-5`, `claude-opus-5.5`, `claude-opus-4.6`, `claude-opus-4.7`, `claude-opus-4.8` | the Claude family |
| `claude-sonnet-5`, `claude-fable-5`, `claude-fable-5.1`, `claude-mythos-preview` | Claude variants |
| `gpt-5.5`, `gpt-5.5-pro`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna` | OpenAI family |
| `deepseek-v4-pro-max`, `deepseek-v4-pro-0813`, `deepseek-v4-flash-0731` | DeepSeek V4 |
| `kimi-k2.6`, `kimi-k3` | Kimi |
| `glm-5.2`, `glm-5.3` | GLM |
| `grok-4.5`, `grok-4.6` | Grok |
| `qwen3.7-max`, `qwen3.8-max`, `qwen3.8-27b`, `gemini-3.1-pro`, `gemini-3.6-flash`, `gemini-3.7-flash`, `seed-2.1-pro`, `seed-2.1-turbo`, `muse-spark-1.1`, `gemma-2-2b` | the rest of the catalogue |

**How much is free:** the published free tier is **10M tokens/month per account, 80 req/min, no card**, on every model. The grant is per account, so `--count N` multiplies it.

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
| `POST /register` | creates the account; the provider's own mail step answers `500 Server Error` **after** the account and session exist (see "how") |
| e-mail verification | resend from `/verify-email`, link read from the mailbox, `GET /email/verify/...` flips the session to verified |
| key creation | `POST /dashboard/api-keys` with the session — the plaintext key comes back once |
| `POST /v1/chat/completions` — run for **every** key before it is written | **200** with real content |
| a key that fails its chat check | never written to `keys.txt` — the account stays recoverable in `accounts.json` |

Re-check at any time:

```bash
node src/cli.js --verify-only
```

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
| status | `GET /v1/models` | 33 ids, Bearer key |
| signup | `POST /register {name,email,phone,password,password_confirmation,_token}` | Laravel form post with the page's `_token`; **the provider answers 500 while still creating the account** — the session that comes back is valid, so the tool continues instead of aborting |
| verify | `POST /email/verification-notification` → mailbox link | the verification mail carries a signed link; following it with the session flips `/dashboard` from a redirect into the real page |
| key | `POST /dashboard/api-keys` | returns the plaintext key once |
| check | `POST /v1/chat/completions` | live 200 required before `keys.txt` |

## ⚙️ CLI options

```bash
node src/cli.js --count N        # mint (default 50)
node src/cli.js --verify-only    # re-check every key in keys.txt
node src/cli.js --help
```

| Environment variable | Default | Meaning |
| --- | --- | --- |
| `RADOX_PROXIES` | `proxies.txt` | pool file, one proxy per line |

## 🛰️ Behind a proxy

Every request leaves through a proxy line from your pool; a dead line fails that attempt and the tool moves on.

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

If Radox changes its signup shape or quota, the tool stops at that step and says so. **[Open an issue](../../issues)** with the command you ran and the exact output; PRs are welcome.

## 📄 License

MIT © 2026 — see [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 radox-bulk-apikey contributors

</div>
