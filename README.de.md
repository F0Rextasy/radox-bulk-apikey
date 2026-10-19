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

**Radox-AI-Konten im Bulk anlegen mit automatisch generierten API-Schlüsseln — OpenAI-kompatible Inferenz (Claude, GPT, Gemini, DeepSeek, Kimi, GLM, Grok) + 9Router-Connector.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-33%20served-412991?style=for-the-badge)](https://radoxai.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Schnellstart](#-quick-start) · [🎁 Kostenloser Tarif](#-free-tier--how-much-you-get) · [🤖 Modelle](#-models--all-33-of-them) · [🧪 API verwenden](#-how-to-use-the-api) · [✅ Verifiziert](#-verified-working--every-key-is-tested) · [🧭 So funktioniert es](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Optionen](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Probleme](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## 🎁 Kostenloser Tarif — wie viel du bekommst

**Jedes neue Radox-Konto startet mit 10 Mio. Tokens / Monat auf ALLEN 33 Modellen — keine Karte, kein Telefon.**

| Was | Wert |
| --- | --- |
| Monatliches Kontingent | **10.000.000 Tokens** pro Konto, auf jedem Modell im Katalog |
| Karte erforderlich | **Nein** |
| Rate-Limit | 80 Anfragen / Minute |
| Anmeldung | E-Mail + Passwort (Standard-Anbieter wie Gmail werden akzeptiert) |
| Die skalierende Einheit | **ein Konto = ein Schlüssel** → `--count N` bedeutet wirklich „N kostenlose Konten“ |

> 💡 Der kostenlose Tarif wird von Radox AI festgelegt und kann sich ändern. Prüfe die aktuellen Zahlen auf [radoxai.com](https://radoxai.com) — und lass das Gate des Tools selbst entscheiden:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelle — alle 33

`GET https://radoxai.com/v1/models` liefert 33 IDs; **32 davon antworteten bei der Nachprüfung am 2026-10-19 mit einem Live-Chat-200** (der kostenlose Tarif deckt den gesamten Katalog ab; nichts ist kostenpflichtig gesperrt); `seed-2.1-turbo` nicht.

|Modell|✓|
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

Live-Test eines Schlüssels (genau das macht das Tool, bevor es einen Schlüssel akzeptiert):

```bash
curl https://radoxai.com/v1/chat/completions \
  -H "Authorization: Bearer <one of your keys>" \
  -H "Content-Type: application/json" \
  -d '{"model":"claude-opus-5","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🧪 So verwendest du die API

Die Basis-URL ist **`https://radoxai.com/v1`** — OpenAI-kompatibel, also funktioniert alles, was OpenAI spricht.

**Jedes SDK / curl**

```python
from openai import OpenAI
client = OpenAI(base_url="https://radoxai.com/v1", api_key="<your key>")
print(client.chat.completions.create(model="kimi-k3",
      messages=[{"role": "user", "content": "hi"}]).choices[0].message.content)
```

**Claude Code** (Anthropic-kompatible Oberfläche — kein `/v1`-Suffix an der Basis):

```bash
export ANTHROPIC_BASE_URL="https://radoxai.com"
export ANTHROPIC_AUTH_TOKEN="<your key>"
export ANTHROPIC_MODEL="claude-opus-5"
claude
```

**Jeder Agent / jedes Tool mit eigener Basis-URL** (Cursor, OpenCode, Kilo Code, …): Basis-URL `https://radoxai.com/v1` setzen, einen Schlüssel einfügen, eine beliebige Modell-ID aus der Tabelle oben wählen.

## 🛠 Schnellstart

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

`keys.txt` (gespiegelt nach `%USERPROFILE%\radox-keys.txt`) wird **erst** geschrieben, wenn eine Live-Chat-Completion den Schlüssel bestätigt hat.

### 🖱️ Der Launcher

Der Launcher fragt nach der Proxy-Liste, der Anzahl und dem Verifizierungsmodell, merkt sie sich in `launcher.config.json` und führt die CLI mit den richtigen Flags aus.

## ✅ Verifiziert funktionsfähig — jeder Schlüssel wird getestet

| Prüfung | Ergebnis |
| --- | --- |
| Kontoerstellung | `POST /register` erstellt das Konto; der eigene Mail-Schritt des Anbieters antwortet mit `500 Server Error` **nachdem** das Konto existiert — das Tool fährt mit der Session fort, statt abzubrechen |
| E-Mail-Verifizierung | Das Postfach enthält einen **6-stelligen Code**; nach dem Senden an `POST /verify-email` (erneutes Senden unter `POST /verify-email/resend`) wird `/dashboard` zur echten Seite |
| Schlüsselerstellung | `POST /dashboard/api-keys` — der Klartext-Schlüssel kommt einmal zurück |
| Live-Nachweis | `POST /v1/chat/completions` — wird für **jeden** Schlüssel ausgeführt, bevor er in `keys.txt` geschrieben wird |
| Ein Schlüssel, der die Chat-Prüfung nicht besteht | wird nie geschrieben — das Konto bleibt in `accounts.json` wiederherstellbar |

## 🧭 So funktioniert es

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Radox AI page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://radoxai.com/v1/chat/completions → real content = the key is live
```

| Schritt | Aufruf | Hinweise |
| --- | --- | --- |
| Anmeldung | `POST /register` | Laravel-Formular-Post mit dem `_token` der Seite |
| Verifizierung | `POST /verify-email` | der 6-stellige Code aus dem Postfach |
| Schlüssel | `POST /dashboard/api-keys` | Klartext-Schlüssel wird einmal zurückgegeben |
| Prüfung | `POST /v1/chat/completions` | Live-200 erforderlich, bevor `keys.txt` |

## ⚙️ CLI-Optionen

```bash
node src/cli.js --count N        # mint (default 50)
node src/cli.js --verify-only    # re-check every key in keys.txt with a live chat call
node src/cli.js --help
```

| Umgebungsvariable | Standard | Bedeutung |
| --- | --- | --- |
| `RADOX_PROXIES` | `proxies.txt` | Pool-Datei, ein Proxy pro Zeile |

## 🛰️ Hinter einem Proxy

Jede Anfrage verlässt das Tool über eine Proxy-Zeile aus deinem Pool; ein toter Exit lässt diesen Versuch scheitern und das Tool wechselt zum nächsten — das Konto wird über einen frischen Exit erneut versucht, nie über deine eigene IP.

## 📄 Dateien

| Pfad | Inhalt |
| --- | --- |
| `keys.txt` | ein live-verifizierter Schlüssel pro Zeile — von Git ignoriert |
| `accounts.json` | E-Mail / Passwort / Schlüssel / Chat-Status pro Konto |
| `proxies.txt` | deine Exits, einer pro Zeile — von Git ignoriert |
| `outputs/` | Ausführungsstatus — von Git ignoriert |

## 🔌 Mit 9Router verbinden

[9Router](https://9router.com) ist ein selbst gehosteter, OpenAI-kompatibler Router. Registriere diesen Anbieter einmal und jeder Schlüssel wird zu einer Verbindung unter einem Provider-Node:

```bash
node src/connect-9router.js
# or: npm run 9router
```

Standardwerte: `--base http://localhost:20128`, `--password 123456`, `--name "Radox"`, `--prefix radox`, `--base-url https://radoxai.com/v1`. Modelle werden dann als `radox/<model id>` bereitgestellt und per Load-Balancing über alle Schlüssel verteilt.

## 🔑 Was dir ein Schlüssel bringt

| | |
| --- | --- |
| 🏢 Anbieter | **Radox AI** — [radoxai.com](https://radoxai.com) |
| 🎁 Was der Anbieter bietet | kostenloser Tarif, ein Konto pro Schlüssel — jeder Schlüssel per Chat über 33 Modelle verifiziert |
| 🔑 Was dir ein Schlüssel bringt | ein API-Schlüssel, der auf sein eigenes Konto beschränkt ist: die 33 Modell-IDs am unten stehenden Endpunkt, im Rahmen der Limits deines Tarifs. Das Kontingent liegt beim **Konto**, genau deshalb legt dieses Tool ein Konto pro Schlüssel an |
| 🌐 API-Form | OpenAI-kompatibel: `POST https://radoxai.com/v1/chat/completions` |
| 🔒 Deine Daten | es werden nur radoxai.com und das von dir konfigurierte Inbox-Backend kontaktiert; die Schlüssel bleiben auf deinem Rechner |

## 🐞 Probleme

Wenn Radox die Form der Registrierung oder das Kontingent ändert, stoppt das Tool an diesem Schritt und sagt es. **[Eröffne ein Issue](../../issues)** mit dem Befehl, den du ausgeführt hast, und der exakten Ausgabe; PRs sind willkommen.

## 📄 Lizenz

MIT © 2026 — siehe [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 radox-bulk-apikey-Mitwirkende

</div>

## ⚡ Ausführungsform (Presets)

`--preset=turbo|balanced|safe` legt Worker + die Pause zwischen Konten fest (turbo = 5,
balanced = 4, safe = 2); explizite `--conc`/`--gap` (oder die eigenen Flags des Repos) gewinnen immer,
und ohne `--preset` behält das Tool exakt seine bisherige Form.

Turbo wird empfohlen (5 Worker); mehr bedeutet auf schwachen Rechnern Last-/Ban-Risiko.