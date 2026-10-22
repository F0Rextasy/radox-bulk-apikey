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

**Radox AI アカウントを自動生成された API キーとともに一括作成 — OpenAI 互換の推論（Claude、GPT、Gemini、DeepSeek、Kimi、GLM、Grok）+ 9Router コネクタ。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-33%20served-412991?style=for-the-badge)](https://radoxai.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 クイックスタート](#-quick-start) · [🎁 無料枠](#-free-tier--how-much-you-get) · [🤖 モデル](#-models--all-33-of-them) · [🧪 API の使い方](#-how-to-use-the-api) · [✅ 検証済み](#-verified-working--every-key-is-tested) · [🧭 仕組み](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ オプション](#️-cli-options) · [🛰️ プロキシ](#️-behind-a-proxy) · [🐞 問題報告](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## 🎁 無料枠 — どれだけ使えるか

**新しい Radox アカウントはすべて、全 33 モデルで月 10M トークンから始まります — カード不要、電話番号不要。**

| 項目 | 値 |
| --- | --- |
| 月間割り当て | アカウントあたり **10,000,000 トークン**、カタログ内のすべてのモデルで |
| カード登録 | **不要** |
| レート制限 | 80 リクエスト / 分 |
| サインアップ | メールアドレス + パスワード（Gmail などの標準的なプロバイダーが利用可能） |
| スケールする単位 | **1 アカウント = 1 キー** → `--count N` は実質「N 個の無料アカウント」 |

> 💡 無料枠は Radox AI によって設定されており、変更される可能性があります。最新の数値は [radoxai.com](https://radoxai.com) で確認してください — そしてツール自身のゲートに判断させましょう：

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 モデル — 全 33 個

`GET https://radoxai.com/v1/models` は 33 個の id を返します；**そのうち 32 個が 2026-10-19 の再チェックで実際のチャットに 200 で応答しました**（無料枠はカタログ全体をカバーしており、有料制限はありません）；`seed-2.1-turbo` は応答しませんでした。

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

1 つのキーのライブプローブ（これはツールがキーを受け入れる前に行うこととまったく同じです）：

```bash
curl https://radoxai.com/v1/chat/completions \
  -H "Authorization: Bearer <one of your keys>" \
  -H "Content-Type: application/json" \
  -d '{"model":"claude-opus-5","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🧪 API の使い方

ベース URL は **`https://radoxai.com/v1`** です — OpenAI 互換なので、OpenAI を扱えるものなら何でも動作します。

**任意の SDK / curl**

```python
from openai import OpenAI
client = OpenAI(base_url="https://radoxai.com/v1", api_key="<your key>")
print(client.chat.completions.create(model="kimi-k3",
      messages=[{"role": "user", "content": "hi"}]).choices[0].message.content)
```

**Claude Code**（Anthropic 互換のサーフェス — ベースに `/v1` サフィックスは不要）：

```bash
export ANTHROPIC_BASE_URL="https://radoxai.com"
export ANTHROPIC_AUTH_TOKEN="<your key>"
export ANTHROPIC_MODEL="claude-opus-5"
claude
```

**カスタムベース URL を持つ任意のエージェント / ツール**（Cursor、OpenCode、Kilo Code など）：ベース URL を `https://radoxai.com/v1` に設定し、キーを貼り付け、上の表から任意のモデル id を選択してください。

## 🛠 クイックスタート

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

`keys.txt`（`%USERPROFILE%\radox-keys.txt` にミラーリングされます）は、ライブのチャット補完がキーを証明した**後にのみ**書き込まれます。

### 🖱️ ランチャー

ランチャーはプロキシリスト、カウント、検証モデルを尋ね、それらを `launcher.config.json` に記憶し、適切なフラグを付けて CLI を実行します。

## ✅ 動作検証済み — すべてのキーがテストされています

> **品質ゲート。** ここにあるすべてのキーは、`keys.txt` に書き込まれる前にライブの `chat-200` を通過しています
> （死んだキーは決して出荷されません）。ルーターの組み合わせもモデルレベルで同じルールに従います：エントリは
> **モデルが `chat-200` に応答し、ツールを呼び出せる場合にのみ**追加されます — ツールサポートのないモデル、
> 死んだキー、死んだプロバイダーは追加されずに除外されます。**9Router と OmniRoute** で動作します。

| チェック | 結果 |
| --- | --- |
| アカウント作成 | `POST /register` がアカウントを作成します；プロバイダー自身のメールステップはアカウントが存在した**後に** `500 Server Error` を返します — ツールは中断せずにセッションで続行します |
| メール検証 | メールボックスに**6 桁のコード**が届きます；それを `POST /verify-email` に送信すると（再送は `POST /verify-email/resend`）、`/dashboard` が実際のページになります |
| キー作成 | `POST /dashboard/api-keys` — 平文のキーが一度だけ返されます |
| ライブ証明 | `POST /v1/chat/completions` — `keys.txt` に書き込まれる前に**すべての**キーに対して実行されます |
| チャットチェックに失敗したキー | 書き込まれません — アカウントは `accounts.json` で復元可能なままです |

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
| サインアップ | `POST /register` | ページの `_token` を使った Laravel フォームポスト |
| 検証 | `POST /verify-email` | メールボックスからの 6 桁のコード |
| キー | `POST /dashboard/api-keys` | 平文のキーが一度だけ返される |
| チェック | `POST /v1/chat/completions` | `keys.txt` の前にライブ 200 が必須 |

## ⚙️ CLI オプション

```bash
node src/cli.js --count N        # mint (default 50)
node src/cli.js --verify-only    # re-check every key in keys.txt with a live chat call
node src/cli.js --help
```

| 環境変数 | デフォルト | 意味 |
| --- | --- | --- |
| `RADOX_PROXIES` | `proxies.txt` | プールファイル、1 行に 1 プロキシ — オプション |

## 🛰️ プロキシの背後で

**オプション — 規模が大きい場合に推奨（IP ごとの制限、BAN）。** ツールはプロキシなしでも動作します。

- **プールあり：** `--proxies <file>` を渡す（または `RADOX_PROXIES` を設定する）と、すべてのリクエストがプールのプロキシ行を通って出ていきます；死んだ出口はその試行を失敗させ、ツールは次に進みます — アカウントは新しい出口で再試行されます。プールが提供されている間はフェイルクローズドです：提供されたプールが自分の IP にフォールバックすることは決してありません。
- **プールなし：** CLI は `running WITHOUT a proxy (direct)` と表示し、直接接続します — `proxies.txt` は不要です。サインアップ、検証、キー発行は変わりません；変わるのはパケットが出ていく場所だけです。
- どちらのモードでも `--screen` を実行してください：実際の実行の前に、持っている出口（または直接ルート）を Radox に対してテストします。

## 📄 ファイル

| パス | 内容 |
| --- | --- |
| `keys.txt` | 1 行に 1 つのライブ検証済みキー — git 無視 |
| `accounts.json` | アカウントごとのメール / パスワード / キー / チャットステータス |
| `proxies.txt` | あなたの出口、1 行に 1 つ — オプション、git 無視 |
| `outputs/` | 実行状態 — git 無視 |

## 🔌 9Router に接続する

[9Router](https://9router.com) はセルフホスト型の OpenAI 互換ルーターです。このプロバイダーを一度登録すれば、すべてのキーが 1 つのプロバイダーノードの下の接続になります：

```bash
node src/connect-9router.js

```

## 🔌 OmniRoute に接続する

[OmniRoute](https://omniroute.online) はセルフホスト型の OpenAI 互換ルーターです。このプロバイダーを一度登録すれば、すべてのキーが 1 つのプロバイダーノードの下の接続になります：

```bash
node src/connect-omniroute.js
# or: npm run 9router
```

デフォルト：`--base http://localhost:20128`、`--password 123456`、`--name "Radox"`、`--prefix radox`、`--base-url https://radoxai.com/v1`。モデルは `radox/<model id>` として提供され、すべてのキー間で負荷分散されます。

## 🔑 1 つのキーで得られるもの

| | |
| --- | --- |
| 🏢 プロバイダー | **Radox AI** — [radoxai.com](https://radoxai.com) |
| 🎁 プロバイダーが提供するもの | 無料枠、キーごとに 1 アカウント — すべてのキーが 33 モデルにわたってチャット検証済み |
| 🔑 1 つのキーで得られるもの | 自身のアカウントにスコープされた 1 つの API キー：以下のエンドポイントにある 33 のモデル id を、あなたのプランの制限で利用できます。クォータは**アカウント**に存在するため、このツールがキーごとに 1 アカウントを作成するのです |
| 🌐 API の形 | OpenAI 互換：`POST https://radoxai.com/v1/chat/completions` |
| 🔒 あなたのデータ | 接触するのは radoxai.com と、あなたが設定した受信トレイバックエンドのみです；キーはあなたのマシン上に留まります |

## 🐞 問題報告

Radox がサインアップの形やクォータを変更した場合、ツールはそのステップで停止し、その旨を伝えます。実行したコマンドと正確な出力を添えて **[issue を作成してください](../../issues)**；PR も歓迎します。

## 📄 ライセンス

MIT © 2026 — [LICENSE](LICENSE) を参照してください。

<div align="center">

**[MIT](LICENSE)** © 2026 radox-bulk-apikey contributors

</div>

## ⚡ 実行形態（プリセット）

`--preset=turbo|balanced|safe` はワーカー数 + アカウント間の一時停止を設定します（turbo = 5、
balanced = 4、safe = 2）；明示的な `--conc`/`--gap`（またはリポジトリ自身のフラグ）が常に優先され、
`--preset` なしの場合、ツールは従来の形態を正確に保ちます。

Turbo が推奨されます（5 ワーカー）；それ以上は非力なコンピューターでは負荷/ BAN のリスクがあります。