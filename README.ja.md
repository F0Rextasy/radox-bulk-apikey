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

**APIキーを自動生成してRadox AIアカウントを一括作成 — OpenAI互換の推論（Claude、GPT、Gemini、DeepSeek、Kimi、GLM、Grok）+ 9Routerコネクタ。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-33%20served-412991?style=for-the-badge)](https://radoxai.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 クイックスタート](#-quick-start) · [🎁 無料枠](#-free-tier--how-much-you-get) · [🤖 モデル](#-models--all-33-of-them) · [🧪 APIの使い方](#-how-to-use-the-api) · [✅ 検証済み](#-verified-working--every-key-is-tested) · [🧭 仕組み](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ オプション](#️-cli-options) · [🛰️ プロキシ](#️-behind-a-proxy) · [🐞 イシュー](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## 🎁 無料枠 — どれだけ使えるか

**新しいRadoxアカウントはすべて、全33モデルで月間1,000万トークンからスタートします — カード不要、電話番号不要。**

| 項目 | 内容 |
| --- | --- |
| 月間割当 | アカウントあたり**10,000,000トークン**、カタログ内のすべてのモデルで |
| カードの要否 | **不要** |
| レート制限 | 80リクエスト / 分 |
| 登録 | メールアドレス + パスワード（Gmailなどの一般的なプロバイダーに対応） |
| スケールする単位 | **1アカウント = 1キー** → `--count N` は実質「N個の無料アカウント」 |

> 💡 無料枠はRadox AIが設定しており、変更される可能性があります。最新の数値は[radoxai.com](https://radoxai.com)で確認してください — そしてツール自身のゲートに判断させましょう：

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 モデル — 全33モデル

`GET https://radoxai.com/v1/models` は33個のIDを返します；2026-10-19の再チェックでは**そのうち32個が実際のチャットで200を返しました**（無料枠がカタログ全体をカバーしており、有料制限はありません）；`seed-2.1-turbo` は返しませんでした。

|モデル|✓|
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

1つのキーの実地プローブ（ツールがキーを採用する前に実際に行うことそのものです）：

```bash
curl https://radoxai.com/v1/chat/completions \
  -H "Authorization: Bearer <one of your keys>" \
  -H "Content-Type: application/json" \
  -d '{"model":"claude-opus-5","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🧪 APIの使い方

ベースURLは**`https://radoxai.com/v1`**です — OpenAI互換なので、OpenAIに対応するものなら何でも動作します。

**任意のSDK / curl**

```python
from openai import OpenAI
client = OpenAI(base_url="https://radoxai.com/v1", api_key="<your key>")
print(client.chat.completions.create(model="kimi-k3",
      messages=[{"role": "user", "content": "hi"}]).choices[0].message.content)
```

**Claude Code**（Anthropic互換のサーフェス — ベースに`/v1`サフィックスは不要）：

```bash
export ANTHROPIC_BASE_URL="https://radoxai.com"
export ANTHROPIC_AUTH_TOKEN="<your key>"
export ANTHROPIC_MODEL="claude-opus-5"
claude
```

**カスタムベースURLを設定できる任意のエージェント / ツール**（Cursor、OpenCode、Kilo Codeなど）：ベースURLを`https://radoxai.com/v1`に設定し、キーを貼り付け、上の表から任意のモデルIDを選択してください。

## 🛠 クイックスタート

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

`keys.txt`（`%USERPROFILE%\radox-keys.txt`にもミラーされます）は、実際のチャット補完がキーを証明した**後にのみ**書き込まれます。

### 🖱️ ランチャー

ランチャーはプロキシリスト、件数、検証モデルを尋ね、それらを`launcher.config.json`に記憶し、適切なフラグでCLIを実行します。

## ✅ 動作検証済み — すべてのキーがテストされます

| チェック | 結果 |
| --- | --- |
| アカウント作成 | `POST /register`がアカウントを作成します；プロバイダー自身のメール処理はアカウントが存在した**後**に`500 Server Error`を返します — ツールは中断せずセッションを継続します |
| メール認証 | メールボックスに**6桁のコード**が届きます；それを`POST /verify-email`に送信すると（再送は`POST /verify-email/resend`）、`/dashboard`が実際のページになります |
| キー作成 | `POST /dashboard/api-keys` — 平文のキーが一度だけ返されます |
| 実地証明 | `POST /v1/chat/completions` — `keys.txt`に書き込まれる前に**すべての**キーで実行されます |
| チャットチェックに失敗したキー | 書き込まれません — アカウントは`accounts.json`で復元可能なまま残ります |

## 🧭 仕組み

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Radox AI page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://radoxai.com/v1/chat/completions → real content = the key is live
```

| ステップ | 呼び出し | 備考 |
| --- | --- | --- |
| 登録 | `POST /register` | ページの`_token`を使ったLaravelのフォームPOST |
| 検証 | `POST /verify-email` | メールボックスからの6桁コード |
| キー | `POST /dashboard/api-keys` | 平文キーが一度だけ返される |
| チェック | `POST /v1/chat/completions` | `keys.txt`の前に実際の200が必要 |

## ⚙️ CLIオプション

```bash
node src/cli.js --count N        # mint (default 50)
node src/cli.js --verify-only    # re-check every key in keys.txt with a live chat call
node src/cli.js --help
```

| 環境変数 | デフォルト | 意味 |
| --- | --- | --- |
| `RADOX_PROXIES` | `proxies.txt` | プールファイル、1行に1プロキシ |

## 🛰️ プロキシ経由で

すべてのリクエストはプールのプロキシ行を経由して送信されます；死んだ出口はその試行を失敗させ、ツールは次へ進みます — アカウントは新しい出口で再試行され、自分のIPから送信されることはありません。

## 📄 ファイル

| パス | 内容 |
| --- | --- |
| `keys.txt` | 実際に検証済みのキーが1行に1つ — git管理外 |
| `accounts.json` | アカウントごとのメールアドレス / パスワード / キー / チャットステータス |
| `proxies.txt` | 出口プロキシ、1行に1つ — git管理外 |
| `outputs/` | 実行状態 — git管理外 |

## 🔌 9Routerに接続

[9Router](https://9router.com)はセルフホスト型のOpenAI互換ルーターです。このプロバイダーを一度登録すれば、すべてのキーが1つのプロバイダーノード配下の接続になります：

```bash
node src/connect-9router.js
# or: npm run 9router
```

デフォルト：`--base http://localhost:20128`、`--password 123456`、`--name "Radox"`、`--prefix radox`、`--base-url https://radoxai.com/v1`。モデルは`radox/<model id>`として提供され、すべてのキーに負荷分散されます。

## 🔑 1つのキーで得られるもの

| | |
| --- | --- |
| 🏢 プロバイダー | **Radox AI** — [radoxai.com](https://radoxai.com) |
| 🎁 プロバイダーが提供するもの | 無料枠、キーごとに1アカウント — すべてのキーが33モデルでチャット検証済み |
| 🔑 1つのキーで得られるもの | それぞれのアカウントに紐づく1つのAPIキー：下記エンドポイントの33個のモデルIDを、プランの上限まで利用できます。クォータは**アカウント**に存在するため、このツールがキーごとに1アカウントを作成するのです |
| 🌐 API形式 | OpenAI互換：`POST https://radoxai.com/v1/chat/completions` |
| 🔒 あなたのデータ | 接続先はradoxai.comと、あなたが設定したインボックスバックエンドのみです；キーはあなたのマシンに留まります |

## 🐞 イシュー

Radoxが登録フローやクォータを変更した場合、ツールはそのステップで停止し、その旨を通知します。実行したコマンドと正確な出力を添えて**[イシューを作成](../../issues)**してください；PRも歓迎します。

## 📄 ライセンス

MIT © 2026 — [LICENSE](LICENSE)を参照してください。

<div align="center">

**[MIT](LICENSE)** © 2026 radox-bulk-apikey コントリビューター

</div>

## ⚡ 実行形態（プリセット）

`--preset=turbo|balanced|safe`はワーカー数とアカウント間のポーズを設定します（turbo = 5、balanced = 4、safe = 2）；明示的な`--conc`/`--gap`（またはリポジトリ独自のフラグ）が常に優先され、`--preset`を指定しない場合、ツールは従来の形態をそのまま維持します。

Turboを推奨します（5ワーカー）；それ以上は非力なPCでは負荷/banのリスクがあります。