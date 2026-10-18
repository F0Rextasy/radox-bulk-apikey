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

**批量创建 Radox AI 账号并自动生成 API 密钥 — 支持 OpenAI 兼容推理（Claude、GPT、Gemini、DeepSeek、Kimi、GLM、Grok）+ 9Router 连接器。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-33%20served-412991?style=for-the-badge)](https://radoxai.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 快速开始](#-quick-start) · [🎁 免费额度](#-free-tier--how-much-you-get) · [🤖 模型列表](#-models--all-33-of-them) · [🧪 使用 API](#-how-to-use-the-api) · [✅ 已验证可用](#-verified-working--every-key-is-tested) · [🧭 工作原理](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ 选项](#️-cli-options) · [🛰️ 代理支持](#️-behind-a-proxy) · [🐞 问题反馈](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>


---

## 🎁 免费额度 — 你能获得什么

**每个新 Radox 账号每月在全部 33 个模型上均可获得 1000 万 tokens — 无需信用卡，无需手机号。**

| 项目 | 内容 |
| --- | --- |
| 每月额度 | **10,000,000 tokens** 每个账号，适用于目录中所有模型 |
| 是否需要信用卡 | **否** |
| 速率限制 | 80 请求/分钟 |
| 注册方式 | 邮箱 + 密码（Gmail 等标准邮箱均可使用） |
| 可扩展单位 | **一个账号 = 一个密钥** → `--count N` 实际上就是“创建 N 个免费账号” |

> 💡 免费额度由 Radox AI 设定，可能变动。请在 [radoxai.com](https://radoxai.com) 查看最新信息 — 并让工具自身的验证机制来判断：

```bash
node src/cli.js --verify-only     # keys.txt 中每个密钥都会通过真实对话请求重新测试
```

## 🤖 模型列表 — 全部 33 个

`GET https://radoxai.com/v1/models` 返回 33 个模型 ID；**在本工具开发时，全部 33 个模型均成功响应了实时对话请求（200 状态码）**（免费额度覆盖整个模型目录，无任何付费门槛）。

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
|`seed-2.1-turbo`|✓|
|`muse-spark-1.1`|✓|
|`gemma-2-2b`|✓|

单个密钥的实时探测（这正是工具在接受密钥前执行的操作）：

```bash
curl https://radoxai.com/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"claude-opus-5","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🧪 如何使用 API

基础 URL 为 **`https://radoxai.com/v1`** —— 兼容 OpenAI 接口，因此任何支持 OpenAI 的工具均可使用。

**任意 SDK / curl**

```python
from openai import OpenAI
client = OpenAI(base_url="https://radoxai.com/v1", api_key="<your key>")
print(client.chat.completions.create(model="kimi-k3",
      messages=[{"role": "user", "content": "hi"}]).choices[0].message.content)
```

**Claude Code**（兼容 Anthropic 接口 — base URL 不带 `/v1` 后缀）：

```bash
export ANTHROPIC_BASE_URL="https://radoxai.com"
export ANTHROPIC_AUTH_TOKEN="<your key>"
export ANTHROPIC_MODEL="claude-opus-5"
claude
```

**任意支持自定义 base URL 的代理/工具**（Cursor、OpenCode、Kilo Code 等）：设置 base URL 为 `https://radoxai.com/v1`，粘贴密钥，从上方表格中任选模型 ID。

## 🛠 快速开始

```bash
# 克隆或 Fork 本仓库，然后：
cd radox-bulk-apikey

# 1) 创建代理列表，每行一个（http://… 或 socks5://…）
printf 'http://127.0.0.1:8080\n' > proxies.txt

# 2) 开始
node src/launcher.js        # 交互式启动
# 或直接运行：
node src/cli.js --count 50
```

`keys.txt`（同时同步到 `%USERPROFILE%\radox-keys.txt`）**仅在通过实时对话验证后**才会写入。

### 🖱️ 启动器（launcher）

启动器会询问代理列表、数量和验证模型，将其保存至 `launcher.config.json`，并以正确参数运行 CLI。

## ✅ 已验证可用 — 每个密钥都经过测试

| 检查项 | 结果 |
| --- | --- |
| 账号创建 | `POST /register` 创建账号；邮箱服务在账号创建后返回 `500 Server Error` —— 工具继续使用已有会话而非中止 |
| 邮箱验证 | 邮箱收到 **6 位验证码**；发送至 `POST /verify-email`（可使用 `POST /verify-email/resend` 重发）后，`/dashboard` 变为真实页面 |
| 密钥生成 | `POST /dashboard/api-keys` —— 明文密钥仅返回一次 |
| 实时验证 | `POST /v1/chat/completions` —— **每个密钥**在写入 `keys.txt` 前必须通过此测试 |
| 验证失败的密钥 | 不写入文件 —— 账号仍保留在 `accounts.json` 中可恢复 |

## 🧭 工作原理

```
收件箱（每个账号一个地址）                                  每个账号使用一个新地址
   │
   ├─▶ 注册：访问 Radox AI 页面 → 提供邮箱地址 → 从收件箱获取验证码/链接
   ├─▶ 会话：获取账号的 cookies 或 access token
   ├─▶ 生成密钥：调用账号的密钥接口 → 获取一次明文密钥（立即写入磁盘）
   └─▶ 实时验证：POST https://radoxai.com/v1/chat/completions → 收到真实响应 = 密钥可用
```

| 步骤 | 请求 | 说明 |
| --- | --- | --- |
| 注册 | `POST /register` | 带页面 `_token` 的 Laravel 表单提交 |
| 验证 | `POST /verify-email` | 使用邮箱中的 6 位验证码 |
| 生成密钥 | `POST /dashboard/api-keys` | 明文密钥仅返回一次 |
| 验证 | `POST /v1/chat/completions` | 必须返回 200 状态码才写入 `keys.txt` |

## ⚙️ CLI 选项

```bash
node src/cli.js --count N        # 生成密钥（默认 50 个）
node src/cli.js --verify-only    # 使用实时对话重新检查 keys.txt 中所有密钥
node src/cli.js --help
```

| 环境变量 | 默认值 | 说明 |
| --- | --- | --- |
| `RADOX_PROXIES` | `proxies.txt` | 代理池文件，每行一个代理 |

## 🛰️ 代理支持

所有请求均通过代理池中的代理发出；若某个出口失效，该次尝试失败，工具将切换至下一个代理 —— 账号会在新出口上重试，**绝不会使用你自己的 IP**。

## 📄 文件说明

| 路径 | 内容 |
| --- | --- |
| `keys.txt` | 每行一个已验证可用的密钥 —— 已被 git 忽略 |
| `accounts.json` | 每个账号的邮箱 / 密码 / 密钥 / 对话状态 |
| `proxies.txt` | 你的代理出口，每行一个 —— 已被 git 忽略 |
| `outputs/` | 运行状态记录 —— 已被 git 忽略 |

## 🔌 连接 9Router

[9Router](https://9router.com) 是一个可自托管的、兼容 OpenAI 的路由服务。只需注册一次该提供者，每个密钥即可作为其下的一个连接节点：

```bash
node src/connect-9router.js
# 或：npm run 9router
```

默认值：`--base http://localhost:20128`，`--password 123456`，`--name "Radox"`，`--prefix radox`，`--base-url https://radoxai.com/v1`。模型将以 `radox/<model id>` 形式提供，并在所有密钥间负载均衡。

## 🔑 单个密钥能获得什么

| | |
| --- | --- |
| 🏢 提供商 | **Radox AI** — [radoxai.com](https://radoxai.com) |
| 🎁 提供商提供什么 | 免费额度，每个密钥对应一个账号 —— 每个密钥均在 33 个模型上通过聊天验证 |
| 🔑 单个密钥能获得什么 | 一个绑定独立账号的 API 密钥：可在下方端点使用全部 33 个模型 ID，受制于账号的使用限制。配额存在于 **账号** 上，这正是本工具“一个密钥对应一个账号”的原因 |
| 🌐 接口格式 | 兼容 OpenAI：`POST https://radoxai.com/v1/chat/completions` |
| 🔒 你的数据 | 仅与 radoxai.com 和你配置的邮箱后端通信；密钥始终保存在你的本地机器上 |

## 🐞 问题反馈

若 Radox 更改注册流程或配额规则，工具将在对应步骤停止并提示。**[提交 issue](../../issues)** 并附上你运行的命令和完整输出；欢迎 PR。

## 📄 许可证

MIT © 2026 — 见 [LICENSE](LICENSE)。

<div align="center">

**[MIT](LICENSE)** © 2026 radox-bulk-apikey 贡献者

</div>

## ⚡ 运行模式（预设）

`--preset=turbo|balanced|safe` 设置工作线程数和账号间间隔（turbo = 5，balanced = 4，safe = 2）；显式指定的 `--conc`/`--gap`（或仓库自身的标志）优先级更高；未使用 `--preset` 时，工具保持其历史默认配置。

推荐使用 Turbo 模式（5 个工作线程）；更多线程可能在性能较弱的设备上造成负载过高或被封禁风险。