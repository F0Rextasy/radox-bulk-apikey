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

**批量创建 Radox AI 账户并自动生成 API 密钥 — 兼容 OpenAI 的推理服务（Claude、GPT、Gemini、DeepSeek、Kimi、GLM、Grok）+ 9Router 连接器。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-33%20served-412991?style=for-the-badge)](https://radoxai.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 快速开始](#-quick-start) · [🎁 免费额度](#-free-tier--how-much-you-get) · [🤖 模型](#-models--all-33-of-them) · [🧪 使用 API](#-how-to-use-the-api) · [✅ 已验证](#-verified-working--every-key-is-tested) · [🧭 工作原理](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ 选项](#️-cli-options) · [🛰️ 代理](#️-behind-a-proxy) · [🐞 问题反馈](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## 🎁 免费额度 — 你能获得多少

**每个新的 Radox 账户每月在全部 33 个模型上都有 1000 万 token — 无需银行卡，无需手机号。**

| 项目 | 数值 |
| --- | --- |
| 每月额度 | 每个账户 **10,000,000 token**，适用于目录中的每个模型 |
| 是否需要银行卡 | **否** |
| 速率限制 | 80 请求 / 分钟 |
| 注册方式 | 邮箱 + 密码（接受 Gmail 等标准邮箱服务商） |
| 可扩展的单位 | **一个账户 = 一个密钥** → `--count N` 实际上就是“N 个免费账户” |

> 💡 免费额度由 Radox AI 设定，可能会变化。请在 [radoxai.com](https://radoxai.com) 查看实时数值 — 并让工具自身的校验来决定：

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 模型 — 全部 33 个

`GET https://radoxai.com/v1/models` 提供 33 个 id；在 2026-10-19 的复查中，**其中 32 个通过实时聊天返回 200**（免费额度覆盖整个目录；没有任何模型被付费限制）；`seed-2.1-turbo` 未通过。

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

基础 URL 是 **`https://radoxai.com/v1`** — 兼容 OpenAI，因此任何支持 OpenAI 的工具都能使用。

**任意 SDK / curl**

```python
from openai import OpenAI
client = OpenAI(base_url="https://radoxai.com/v1", api_key="<your key>")
print(client.chat.completions.create(model="kimi-k3",
      messages=[{"role": "user", "content": "hi"}]).choices[0].message.content)
```

**Claude Code**（兼容 Anthropic 的接口 — 基础 URL 不带 `/v1` 后缀）：

```bash
export ANTHROPIC_BASE_URL="https://radoxai.com"
export ANTHROPIC_AUTH_TOKEN="<your key>"
export ANTHROPIC_MODEL="claude-opus-5"
claude
```

**任何支持自定义基础 URL 的 agent / 工具**（Cursor、OpenCode、Kilo Code 等）：将基础 URL 设为 `https://radoxai.com/v1`，粘贴一个密钥，从上面的表格中选择任意模型 id。

## 🛠 快速开始

```bash

# clone or fork this repository, then:
cd radox-bulk-apikey

# 1) your proxy list, one per line (http://… or socks5://…) — OPTIONAL
printf 'http://127.0.0.1:8080\n' > proxies.txt   # skip this to run direct

# 2) go
node src/launcher.js        # interactive
# or directly:
node src/cli.js --count 50
```

`keys.txt`（镜像到 `%USERPROFILE%\radox-keys.txt`）**只有**在实时聊天补全证明密钥有效后才会写入。

### 🖱️ 启动器

启动器会询问代理列表、数量和验证模型，将它们记住在 `launcher.config.json` 中，并使用正确的标志运行 CLI。

## ✅ 已验证可用 — 每个密钥都经过测试

> **质量门禁。** 这里的每个密钥在写入 `keys.txt` 之前都通过了实时 `chat-200`
> （绝不会交付失效密钥）。路由器组合在模型层面遵循同样的规则：只有
> 当模型返回 `chat-200` 且能调用工具时，才会添加条目 — 不支持工具的模型、
> 失效的密钥或失效的提供商会直接被丢弃而不是添加。适用于 **9Router 和 OmniRoute**。

| 检查 | 结果 |
| --- | --- |
| 账户创建 | `POST /register` 创建账户；提供商自身的邮件步骤在账户已存在**之后**返回 `500 Server Error` — 工具会继续使用该会话，而不是中止 |
| 邮箱验证 | 邮箱中带有 **6 位验证码**；将其提交到 `POST /verify-email`（重发地址为 `POST /verify-email/resend`）后，`/dashboard` 会变成真实页面 |
| 密钥创建 | `POST /dashboard/api-keys` — 明文密钥只返回一次 |
| 实时证明 | `POST /v1/chat/completions` — 在写入 `keys.txt` 之前对**每个**密钥运行 |
| 未通过聊天检查的密钥 | 绝不写入 — 账户仍可在 `accounts.json` 中恢复 |

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
| 验证 | `POST /verify-email` | 来自邮箱的 6 位验证码 |
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
| `RADOX_PROXIES` | `proxies.txt` | 代理池文件，每行一个代理 — 可选 |

## 🛰️ 在代理之后

**可选 — 大规模使用时推荐（按 IP 限制、封禁）。** 该工具在没有代理的情况下也能工作。

- **有代理池时：** 传入 `--proxies <file>`（或设置 `RADOX_PROXIES`），每个请求都会通过代理池中的一行代理发出；失效的出口会使该次尝试失败，工具会转到下一个 — 账户会在新的出口上重试。提供代理池时采用故障关闭策略：提供的代理池绝不会回退到你自己的 IP。
- **没有代理池时：** CLI 会打印 `running WITHOUT a proxy (direct)` 并直接连接 — 不需要 `proxies.txt`。注册、验证和密钥铸造保持不变；只是数据包发出的位置不同。
- 对任一模式运行 `--screen`：它会在真实运行之前，针对 Radox 测试你拥有的出口（或直连路由）。

## 📄 文件

| 路径 | 内容 |
| --- | --- |
| `keys.txt` | 每行一个经过实时验证的密钥 — 已被 git 忽略 |
| `accounts.json` | 每个账户的邮箱 / 密码 / 密钥 / 聊天状态 |
| `proxies.txt` | 你的出口，每行一个 — 可选，已被 git 忽略 |
| `outputs/` | 运行状态 — 已被 git 忽略 |

## 🔌 连接到 9Router

[9Router](https://9router.com) 是一个自托管、兼容 OpenAI 的路由器。注册一次此提供商，每个密钥都会成为一个提供商节点下的连接：

```bash
node src/connect-9router.js

```

## 🔌 连接到 OmniRoute

[OmniRoute](https://omniroute.online) 是一个自托管、兼容 OpenAI 的路由器。注册一次此提供商，每个密钥都会成为一个提供商节点下的连接：

```bash
node src/connect-omniroute.js
# or: npm run 9router
```

默认值：`--base http://localhost:20128`、`--password 123456`、`--name "Radox"`、`--prefix radox`、`--base-url https://radoxai.com/v1`。随后模型会以 `radox/<model id>` 的形式提供，并在所有密钥之间进行负载均衡。

## 🔑 一个密钥能给你什么

| | |
| --- | --- |
| 🏢 提供商 | **Radox AI** — [radoxai.com](https://radoxai.com) |
| 🎁 提供商提供什么 | 免费额度，每个密钥一个账户 — 每个密钥都在 33 个模型上经过聊天验证 |
| 🔑 一个密钥能给你什么 | 一个作用域为其自身账户的 API 密钥：下方端点上的 33 个模型 id，受你套餐的限制。配额存在于**账户**上，这正是该工具为每个密钥创建一个账户的原因 |
| 🌐 API 形态 | 兼容 OpenAI：`POST https://radoxai.com/v1/chat/completions` |
| 🔒 你的数据 | 只会联系 radoxai.com 和你配置的邮箱后端；密钥保留在你的机器上 |

## 🐞 问题反馈

如果 Radox 更改了其注册形态或配额，工具会在该步骤停止并说明原因。**[提交 issue](../../issues)**，附上你运行的命令和确切的输出；欢迎 PR。

## 📄 许可证

MIT © 2026 — 见 [LICENSE](LICENSE)。

<div align="center">

**[MIT](LICENSE)** © 2026 radox-bulk-apikey contributors

</div>

## ⚡ 运行形态（预设）

`--preset=turbo|balanced|safe` 设置 worker 数量 + 账户之间的暂停时间（turbo = 5，
balanced = 4，safe = 2）；显式的 `--conc`/`--gap`（或仓库自身的标志）始终优先，
并且在没有 `--preset` 的情况下，工具会完全保持其历史形态。

推荐使用 Turbo（5 个 worker）；更多会在性能较弱的电脑上带来负载/封禁风险。