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

**Radox AI-Konten im Bulk erstellen mit automatisch generierten API-Schlüsseln — OpenAI-kompatible Inferenz (Claude, GPT, Gemini, DeepSeek, Kimi, GLM, Grok) + 9Router-Connector.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-33%20served-412991?style=for-the-badge)](https://radoxai.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Schnellstart](#-quick-start) · [🎁 Kostenlose Stufe](#-free-tier--how-much-you-get) · [🤖 Modelle](#-models--all-33-of-them) · [🧪 Die API verwenden](#-how-to-use-the-api) · [✅ Verifiziert](#-verified-working--every-key-is-tested) · [🧭 So funktioniert es](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Optionen](#️-cli-options) · [🛰️ Proxys](#️-behind-a-proxy) · [🐞 Probleme](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## 🎁 Kostenlose Stufe — wie viel du bekommst

**Jedes neue Radox-Konto startet mit 10 Mio. Tokens / Monat auf ALLEN 33 Modellen — keine Karte, kein Telefon.**

| Was | Wert |
| --- | --- |
| Monatliches Kontingent | **10.000.000 Tokens** pro Konto, auf jedem Modell im Katalog |
| Karte erforderlich | **Nein** |
| Rate Limit | 80 Anfragen / Minute |
| Registrierung | E-Mail + Passwort (Standardanbieter wie Gmail werden akzeptiert) |
| Die Einheit, die skaliert | **ein Konto = ein Schlüssel** → `--count N` bedeutet wirklich „N kostenlose Konten" |

> 💡 Die kostenlose Stufe wird von Radox AI festgelegt und kann sich ändern. Prüfe die aktuellen Zahlen auf [radoxai.com](https://radoxai.com) — und lass das eigene Gate des Tools entscheiden:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelle — alle 33 davon

`GET https://radoxai.com/v1/models` liefert 33 IDs; **32 davon antworteten bei der erneuten Prüfung am 2026-10-19 mit einem Live-Chat-200** (die kostenlose Stufe deckt den gesamten Katalog ab; nichts ist kostenpflichtig gesperrt); `seed-2.1-turbo` nicht.

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

## 🧪 Die API verwenden

Die Basis-URL ist **`https://radoxai.com/v1`** — OpenAI-kompatibel, also funktioniert alles, was OpenAI spricht.

**Beliebiges SDK / curl**

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

**Beliebiger Agent / beliebiges Tool mit eigener Basis-URL** (Cursor, OpenCode, Kilo Code, …): Basis-URL `https://radoxai.com/v1` setzen, einen Schlüssel einfügen, eine beliebige Modell-ID aus der obigen Tabelle wählen.

## 🛠 Schnellstart

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

`keys.txt` (gespiegelt nach `%USERPROFILE%\radox-keys.txt`) wird **erst** geschrieben, nachdem eine Live-Chat-Vervollständigung den Schlüssel bestätigt hat.

### 🖱️ Der Launcher

Der Launcher fragt nach Proxy-Liste, Anzahl und Verifizierungsmodell, merkt sie sich in `launcher.config.json` und führt die CLI mit den richtigen Flags aus.

## ✅ Verifiziert funktionierend — jeder Schlüssel wird getestet

> **Qualitätsgates.** Jeder Schlüssel hier hat ein Live-`chat-200` bestanden, bevor er in `keys.txt`
> geschrieben wurde (tote Schlüssel werden nie ausgeliefert). Router-Kombinationen folgen derselben Regel
> auf Modellebene: Ein Eintrag wird **nur hinzugefügt, wenn das Modell `chat-200` antwortet und Tools
> aufrufen kann** — ein Modell ohne Tool-Unterstützung, ein toter Schlüssel oder ein toter Anbieter wird
> verworfen statt hinzugefügt. Funktioniert mit **9Router und OmniRoute**.

| Prüfung | Ergebnis |
| --- | --- |
| Kontoerstellung | `POST /register` erstellt das Konto; der eigene Mail-Schritt des Anbieters antwortet mit `500 Server Error` **nachdem** das Konto existiert — das Tool fährt mit der Session fort, statt abzubrechen |
| E-Mail-Verifizierung | das Postfach enthält einen **6-stelligen Code**; das Posten an `POST /verify-email` (erneutes Senden unter `POST /verify-email/resend`) macht `/dashboard` zur echten Seite |
| Schlüsselerstellung | `POST /dashboard/api-keys` — der Klartext-Schlüssel kommt einmal zurück |
| Live-Nachweis | `POST /v1/chat/completions` — für **jeden** Schlüssel ausgeführt, bevor er in `keys.txt` geschrieben wird |
| ein Schlüssel, der die Chat-Prüfung nicht besteht | wird nie geschrieben — das Konto bleibt in `accounts.json` wiederherstellbar |

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
| Registrierung | `POST /register` | Laravel-Formular-Post mit dem Seiten-`_token` |
| Verifizierung | `POST /verify-email` | der 6-stellige Code aus dem Postfach |
| Schlüssel | `POST /dashboard/api-keys` | Klartext-Schlüssel kommt einmal zurück |
| Prüfung | `POST /v1/chat/completions` | Live-200 erforderlich, bevor `keys.txt` geschrieben wird |

## ⚙️ CLI-Optionen

```bash
node src/cli.js --count N        # mint (default 50)
node src/cli.js --verify-only    # re-check every key in keys.txt with a live chat call
node src/cli.js --help
```

| Umgebungsvariable | Standard | Bedeutung |
| --- | --- | --- |
| `RADOX_PROXIES` | `proxies.txt` | Pool-Datei, ein Proxy pro Zeile — optional |

## 🛰️ Hinter einem Proxy

**Optional — bei Skalierung empfohlen (Limits pro IP, Bans).** Das Tool funktioniert auch ohne Proxy.

- **Mit einem Pool:** übergib `--proxies <file>` (oder setze `RADOX_PROXIES`) und jede Anfrage verlässt das System über eine Proxy-Zeile aus deinem Pool; ein toter Exit lässt diesen Versuch fehlschlagen und das Tool geht zum nächsten über — das Konto wird über einen frischen Exit erneut versucht. Fail-closed, solange ein Pool bereitgestellt wird: Ein bereitgestellter Pool fällt niemals auf deine eigene IP zurück.
- **Ohne einen Pool:** die CLI gibt `running WITHOUT a proxy (direct)` aus und verbindet direkt — keine `proxies.txt` nötig. Registrierung, Verifizierung und Schlüsselerstellung bleiben unverändert; nur der Weg, über den die Pakete das System verlassen, ändert sich.
- Führe `--screen` in beiden Modi aus: Es testet die Exits, die du hast (oder die direkte Route), gegen Radox vor einem echten Lauf.

## 📄 Dateien

| Pfad | Inhalt |
| --- | --- |
| `keys.txt` | ein live-verifizierter Schlüssel pro Zeile — von Git ignoriert |
| `accounts.json` | E-Mail / Passwort / Schlüssel / Chat-Status pro Konto |
| `proxies.txt` | deine Exits, einer pro Zeile — optional, von Git ignoriert |
| `outputs/` | Laufzustand — von Git ignoriert |

## 🔌 Mit 9Router verbinden

[9Router](https://9router.com) ist ein selbst gehosteter, OpenAI-kompatibler Router. Registriere diesen Anbieter einmal und jeder Schlüssel wird zu einer Verbindung unter einem Anbieter-Knoten:

```bash
node src/connect-9router.js

```

## 🔌 Mit OmniRoute verbinden

[OmniRoute](https://omniroute.online) ist ein selbst gehosteter, OpenAI-kompatibler Router. Registriere diesen Anbieter einmal und jeder Schlüssel wird zu einer Verbindung unter einem Anbieter-Knoten:

```bash
node src/connect-omniroute.js
# or: npm run 9router
```

Standardwerte: `--base http://localhost:20128`, `--password 123456`, `--name "Radox"`, `--prefix radox`, `--base-url https://radoxai.com/v1`. Modelle werden dann als `radox/<model id>` bereitgestellt und über jeden Schlüssel lastverteilt.

## 🔑 Was ein Schlüssel dir bringt

| | |
| --- | --- |
| 🏢 Anbieter | **Radox AI** — [radoxai.com](https://radoxai.com) |
| 🎁 Was der Anbieter gibt | kostenlose Stufe, ein Konto pro Schlüssel — jeder Schlüssel chat-verifiziert über 33 Modelle |
| 🔑 Was ein Schlüssel dir bringt | ein API-Schlüssel, der auf sein eigenes Konto beschränkt ist: die 33 Modell-IDs am unten stehenden Endpunkt, im Rahmen der Limits deines Tarifs. Das Kontingent liegt beim **Konto**, genau deshalb erstellt dieses Tool ein Konto pro Schlüssel |
| 🌐 API-Form | OpenAI-kompatibel: `POST https://radoxai.com/v1/chat/completions` |
| 🔒 Deine Daten | nur radoxai.com und das von dir konfigurierte Postfach-Backend werden kontaktiert; Schlüssel bleiben auf deinem Rechner |

## 🐞 Probleme

Wenn Radox seine Registrierungsform oder sein Kontingent ändert, stoppt das Tool an diesem Schritt und sagt es dir. **[Öffne ein Issue](../../issues)** mit dem ausgeführten Befehl und der exakten Ausgabe; PRs sind willkommen.

## 📄 Lizenz

MIT © 2026 — siehe [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 radox-bulk-apikey contributors

</div>

## ⚡ Laufkonfiguration (Presets)

`--preset=turbo|balanced|safe` legt Worker + die Pause zwischen Konten fest (turbo = 5,
balanced = 4, safe = 2); explizite `--conc`/`--gap` (oder die eigenen Flags des Repos) gewinnen
immer, und ohne `--preset` behält das Tool exakt seine bisherige Konfiguration bei.

Turbo wird empfohlen (5 Worker); mehr bedeutet Last-/Ban-Risiko auf schwachen Rechnern.