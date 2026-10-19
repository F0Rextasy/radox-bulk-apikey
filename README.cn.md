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

**批量创建 Radox AI 账户并自动生成 API 密钥 —— 兼容 OpenAI 的推理服务（Claude、GPT、Gemini、DeepSeek、Kimi、GLM、Grok）+ 9Router 连接器。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-33%20served-412991?style=for-the-badge)](https://radoxai.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 快速开始](#-quick-start) · [🎁 免费额度](#-free-tier--how-much-you-get) · [🤖 模型](#-models--all-33-of-them) · [🧪 使用 API](#-how-to-use-the-api) · [✅ 已验证](#-verified-working--every-key-is-tested) · [🧭 工作原理](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ 选项](#️-cli-options) · [🛰️ 代理](#️-behind-a-proxy) · [🐞 问题](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## 🎁 免费额度 —— 你能获得多少

**每个新的 Radox 账户起步就拥有每月 1000 万 token，覆盖全部 33 个模型 —— 无需银行卡，无需手机号。**

| 项目 | 数值 |
| --- | --- |
| 每月额度 | 每个账户 **10,000,000 tokens**，适用于目录中的每一个模型 |
| 是否需要银行卡 | **否** |
| 速率限制 | 每分钟 80 次请求 |
| 注册方式 | 邮箱 + 密码（接受 Gmail 等标准服务商） |
| 可扩展的单位 | **一个账户 = 一个密钥** → `--count N` 实际上就是“N 个免费账户” |

> 💡 免费额度由 Radox AI 设定，可能会变化。请在 [radoxai.com](https://radoxai.com) 查看实时数字 —— 并让工具自身的校验来决定：

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 模型 —— 全部 33 个

`GET https://radoxai.com/v1/models` 提供 33 个 id；在 2026-10-19 的复查中，**其中 32 个在实时对话中返回了 200**（免费额度覆盖整个目录；没有任何模型需要付费解锁）；`seed-2.1-turbo` 未能通过。

|模型|✓|
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

对一个密钥的实时探测（这正是工具在接受密钥之前所做的）：

```bash
curl https://radoxai.com/v1/chat/completions \
  -H "Authorization: Bearer <one of your keys>" \
  -H "Content-Type: application/json" \
  -d '{"model":"claude-opus-5","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🧪 如何使用 API

基础 URL 是 **`https://radoxai.com/v1`** —— 兼容 OpenAI，因此任何支持 OpenAI 的工具都能用。

**任意 SDK / curl**

```python
from openai import OpenAI
client = OpenAI(base_url="https://radoxai.com/v1", api_key="<your key>")
print(client.chat.completions.create(model="kimi-k3",
      messages=[{"role": "user", "content": "hi"}]).choices[0].message.content)
```

**Claude Code**（Anthropic 兼容接口 —— base 末尾不加 `/v1`）：

```bash
export ANTHROPIC_BASE_URL="https://radoxai.com"
export ANTHROPIC_AUTH_TOKEN="<your key>"
export ANTHROPIC_MODEL="claude-opus-5"
claude
```

**任何支持自定义 base URL 的 agent / 工具**（Cursor、OpenCode、Kilo Code 等）：将 base URL 设为 `https://radoxai.com/v1`，粘贴一个密钥，从上面的表格中任选一个模型 id。

## 🛠 快速开始

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

`keys.txt`（同时镜像到 `%USERPROFILE%\radox-keys.txt`）**只有**在一次实时对话补全证明了该密钥有效之后才会被写入。

### 🖱️ 启动器

启动器会询问代理列表、数量和验证模型，将它们记录在 `launcher.config.json` 中，并用正确的参数运行 CLI。

## ✅ 已验证可用 —— 每个密钥都经过测试

| 检查项 | 结果 |
| --- | --- |
| 账户创建 | `POST /register` 创建账户；服务商自己的邮件步骤在账户已存在**之后**返回 `500 Server Error` —— 工具会继续沿用当前会话，而不是中止 |
| 邮箱验证 | 邮箱中会收到**6 位验证码**；将其提交到 `POST /verify-email`（重发用 `POST /verify-email/resend`）即可让 `/dashboard` 变成真实页面 |
| 密钥创建 | `POST /dashboard/api-keys` —— 明文密钥只返回一次 |
| 实时证明 | `POST /v1/chat/completions` —— 对**每个**密钥都执行，然后才写入 `keys.txt` |
| 未通过对话检查的密钥 | 永不写入 —— 该账户仍可在 `accounts.json` 中恢复 |

## 🧭 工作原理

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Radox AI page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://radoxai.com/v1/chat/completions → real content = the key is live
```

| 步骤 | 调用 | 说明 |
| --- | --- | --- |
| 注册 | `POST /register` | 带页面 `_token` 的 Laravel 表单提交 |
| 验证 | `POST /verify-email` | 邮箱中的 6 位验证码 |
| 密钥 | `POST /dashboard/api-keys` | 明文密钥只返回一次 |
| 检查 | `POST /v1/chat/completions` | 写入 `keys.txt` 前必须实时返回 200 |

## ⚙️ CLI 选项

```bash
node src/cli.js --count N        # mint (default 50)
node src/cli.js --verify-only    # re-check every key in keys.txt with a live chat call
node src/cli.js --help
```

| 环境变量 | 默认值 | 含义 |
| --- | --- | --- |
| `RADOX_PROXIES` | `proxies.txt` | 代理池文件，每行一个代理 |

## 🛰️ 通过代理

每个请求都经由你代理池中的一行代理发出；出口失效会让该次尝试失败，工具随即换下一个 —— 账户会在新的出口上重试，绝不会走你自己的 IP。

## 📄 文件

| 路径 | 内容 |
| --- | --- |
| `keys.txt` | 每行一个经过实时验证的密钥 —— 已被 git 忽略 |
| `accounts.json` | 每个账户的邮箱 / 密码 / 密钥 / 对话状态 |
| `proxies.txt` | 你的出口，每行一个 —— 已被 git 忽略 |
| `outputs/` | 运行状态 —— 已被 git 忽略 |

## 🔌 连接 9Router

[9Router](https://9router.com) 是一个自托管、兼容 OpenAI 的路由器。只需注册一次该服务商，每个密钥都会成为同一个 provider-node 下的一个连接：

```bash
node src/connect-9router.js
# or: npm run 9router
```

默认值：`--base http://localhost:20128`、`--password 123456`、`--name "Radox"`、`--prefix radox`、`--base-url https://radoxai.com/v1`。此后模型以 `radox/<model id>` 的形式提供，并在所有密钥之间做负载均衡。

## 🔑 一个密钥能给你带来什么

| | |
| --- | --- |
| 🏢 服务商 | **Radox AI** — [radoxai.com](https://radoxai.com) |
| 🎁 服务商提供什么 | 免费额度，一个账户对应一个密钥 —— 每个密钥都经过 33 个模型的对话验证 |
| 🔑 一个密钥能给你什么 | 一个绑定其自身账户的 API 密钥：下方端点上的 33 个模型 id，受你套餐的限制。配额存在于**账户**上，这正是本工具为每个密钥创建一个账户的原因 |
| 🌐 API 形态 | 兼容 OpenAI：`POST https://radoxai.com/v1/chat/completions` |
| 🔒 你的数据 | 只会联系 radoxai.com 和你配置的邮箱后端；密钥始终留在你的机器上 |

## 🐞 问题

如果 Radox 改变注册流程或配额，工具会在那一步停下并给出说明。请**[提交 issue](../../issues)**，附上你运行的命令和完整输出；欢迎 PR。

## 📄 许可证

MIT © 2026 —— 见 [LICENSE](LICENSE)。

<div align="center">

**[MIT](LICENSE)** © 2026 radox-bulk-apikey 贡献者

</div>

## ⚡ 运行形态（预设）

`--preset=turbo|balanced|safe` 设置 worker 数量 + 账户之间的暂停时间（turbo = 5，balanced = 4，safe = 2）；显式指定的 `--conc`/`--gap`（或仓库自带的参数）始终优先，且在不加 `--preset` 时，工具完全保持其历史形态。

推荐使用 Turbo（5 个 worker）；在性能较弱的电脑上，更多 worker 会有负载/封禁风险。