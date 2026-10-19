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

**Massenweises Erstellen von Radox AI-Konten mit automatisch generierten API-Schlüsseln — OpenAI-kompatible Inferenz (Claude, GPT, Gemini, DeepSeek, Kimi, GLM, Grok) + 9Router-Connector.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-33%20served-412991?style=for-the-badge)](https://radoxai.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Kurzanleitung](#-quick-start) · [🎁 Kostenloses Kontingent](#-free-tier--how-much-you-get) · [🤖 Modelle](#-models--all-33-of-them) · [🧪 API nutzen](#-how-to-use-the-api) · [✅ Verifiziert](#-verified-working--every-key-is-tested) · [🧭 Funktionsweise](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Optionen](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Probleme](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## 🎁 Kostenloses Kontingent — was Sie erhalten

**Jedes neue Radox-Konto startet mit 10 Mio. Tokens/Monat auf ALLEN 33 Modellen — ohne Karte, ohne Telefon.**

| Was | Wert |
| --- | --- |
| Monatliches Kontingent | **10.000.000 Tokens** pro Konto, auf jedem Modell im Katalog |
| Karte erforderlich | **Nein** |
| Rate Limit | 80 Anfragen / Minute |
| Registrierung | E-Mail + Passwort (übliche Anbieter wie Gmail werden akzeptiert) |
| Skalierungseinheit | **ein Konto = ein Schlüssel** → `--count N` bedeutet tatsächlich „N kostenlose Konten“ |

> 💡 Das kostenlose Kontingent wird von Radox AI festgelegt und kann sich ändern. Prüfen Sie aktuelle Werte unter [radoxai.com](https://radoxai.com) — und lassen Sie die interne Prüfung des Tools entscheiden:

```bash
node src/cli.js --verify-only     # jeder Schlüssel in keys.txt wird mit einem echten Chat-Test überprüft
```

## 🤖 Modelle — alle 33

`GET https://radoxai.com/v1/models` liefert 33 IDs; **alle 33 haben beim Erstellen dieses Tools eine Live-Chat-Antwort mit Status 200 gegeben** (das kostenlose Kontingent umfasst den gesamten Katalog; nichts ist kostenpflichtig).

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
|`seed-2.1-turbo`|✓|
|`muse-spark-1.1`|✓|
|`gemma-2-2b`|✓|

Live-Test eines Schlüssels (genau das führt das Tool vor der Annahme eines Schlüssels durch):

```bash
curl https://radoxai.com/v1/chat/completions \
  -H "Authorization: Bearer <einer Ihrer Schlüssel>" \
  -H "Content-Type: application/json" \
  -d '{"model":"claude-opus-5","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🧪 So nutzen Sie die API

Die Basis-URL ist **`https://radoxai.com/v1`** — OpenAI-kompatibel, daher funktioniert alles, was OpenAI spricht.

**Jedes SDK / curl**

```python
from openai import OpenAI
client = OpenAI(base_url="https://radoxai.com/v1", api_key="<Ihr Schlüssel>")
print(client.chat.completions.create(model="kimi-k3",
      messages=[{"role": "user", "content": "hi"}]).choices[0].message.content)
```

**Claude Code** (Anthropic-kompatibles Interface — kein `/v1`-Suffix in der Basis-URL):

```bash
export ANTHROPIC_BASE_URL="https://radoxai.com"
export ANTHROPIC_AUTH_TOKEN="<Ihr Schlüssel>"
export ANTHROPIC_MODEL="claude-opus-5"
claude
```

**Jeder Agent / jedes Tool mit benutzerdefinierter Basis-URL** (Cursor, OpenCode, Kilo Code, …): Basis-URL `https://radoxai.com/v1` setzen, Schlüssel einfügen, beliebiges Modell aus der obigen Tabelle wählen.

## 🛠 Kurzanleitung

```bash
# Klonen oder forken Sie dieses Repository, dann:
cd radox-bulk-apikey

# 1) Ihre Proxy-Liste, eine pro Zeile (http://… oder socks5://…)
printf 'http://127.0.0.1:8080\n' > proxies.txt

# 2) Start
node src/launcher.js        # interaktiv
# oder direkt:
node src/cli.js --count 50
```

`keys.txt` (auch gespiegelt nach `%USERPROFILE%\radox-keys.txt`) wird **nur** geschrieben, nachdem ein Live-Chat die Gültigkeit des Schlüssels bestätigt hat.

### 🖱️ Der Launcher

Der Launcher fragt nach der Proxy-Liste, Anzahl und Verifizierungsmodell, speichert diese in `launcher.config.json` und führt die CLI mit den richtigen Flags aus.

## ✅ Verifiziert und funktionsfähig — jeder Schlüssel wird geprüft

| Prüfung | Ergebnis |
| --- | --- |
| Kontenerstellung | `POST /register` erstellt das Konto; der eigene Mail-Schritt des Anbieters antwortet mit `500 Server Error` **nachdem** das Konto existiert — das Tool setzt stattdessen mit der Sitzung fort, anstatt abzubrechen |
| E-Mail-Bestätigung | Das Postfach enthält einen **6-stelligen Code**; das Senden an `POST /verify-email` (erneut senden via `POST /verify-email/resend`) macht `/dashboard` zur echten Seite |
| Schlüsselerstellung | `POST /dashboard/api-keys` — der Klartext-Schlüssel wird einmalig zurückgegeben |
| Live-Bestätigung | `POST /v1/chat/completions` — wird für **jeden** Schlüssel vor dem Schreiben in `keys.txt` ausgeführt |
| Ein Schlüssel, der den Chat-Test nicht besteht | wird niemals geschrieben — das Konto bleibt in `accounts.json` wiederherstellbar |

## 🧭 Funktionsweise

```
Postfach (eine Adresse pro Konto)                                  eine neue Adresse pro Konto
   │
   ├─▶ Registrierung: Radox AI-Seite → E-Mail-Adresse → Code/Link aus dem Postfach
   ├─▶ Sitzung: Cookies oder Zugriffstoken des Kontos liegen vor
   ├─▶ Schlüsselerstellung: Endpunkt für Schlüssel des Kontos → Klartext-Schlüssel einmalig zurückgegeben (sofort auf Datenträger geschrieben)
   └─▶ Live-Bestätigung: POST https://radoxai.com/v1/chat/completions → echte Antwort = Schlüssel ist aktiv
```

| Schritt | Aufruf | Hinweise |
| --- | --- | --- |
| Registrierung | `POST /register` | Laravel-Formular-Post mit `_token` der Seite |
| Bestätigung | `POST /verify-email` | 6-stelliger Code aus dem Postfach |
| Schlüssel | `POST /dashboard/api-keys` | Klartext-Schlüssel wird einmalig zurückgegeben |
| Prüfung | `POST /v1/chat/completions` | Live-200-Antwort erforderlich vor `keys.txt` |

## ⚙️ CLI-Optionen

```bash
node src/cli.js --count N        # erstellt Schlüssel (Standard: 50)
node src/cli.js --verify-only    # überprüft jeden Schlüssel in keys.txt erneut mit einem Live-Chat
node src/cli.js --help
```

| Umgebungsvariable | Standard | Bedeutung |
| --- | --- | --- |
| `RADOX_PROXIES` | `proxies.txt` | Proxy-Pool-Datei, eine Proxy pro Zeile |

## 🛰️ Hinter einem Proxy

Jede Anfrage verlässt über einen Proxy aus Ihrem Pool; ein toter Exit bricht diesen Versuch ab, das Tool wechselt zum nächsten — das Konto wird mit neuem Exit erneut versucht, niemals über Ihre eigene IP.

## 📄 Dateien

| Pfad | Inhalt |
| --- | --- |
| `keys.txt` | je Zeile ein verifizierter, aktiver Schlüssel — von Git ignoriert |
| `accounts.json` | E-Mail / Passwort / Schlüssel / Chat-Status pro Konto |
| `proxies.txt` | Ihre Exit-Proxies, je Zeile einer — von Git ignoriert |
| `outputs/` | Laufzustand — von Git ignoriert |

## 🔌 Mit 9Router verbinden

[9Router](https://9router.com) ist ein selbstgehosteter, OpenAI-kompatibler Router. Registrieren Sie diesen Anbieter einmalig, und jeder Schlüssel wird zu einer Verbindung unter einem Provider-Node:

```bash
node src/connect-9router.js
# oder: npm run 9router
```

Standardwerte: `--base http://localhost:20128`, `--password 123456`, `--name "Radox"`, `--prefix radox`, `--base-url https://radoxai.com/v1`. Die Modelle werden dann als `radox/<Modell-ID>` bereitgestellt und über alle Schlüssel hinweg ausgelastet.

## 🔑 Was ein einzelner Schlüssel bietet

| | |
| --- | --- |
| 🏢 Anbieter | **Radox AI** — [radoxai.com](https://radoxai.com) |
| 🎁 Was der Anbieter bietet | kostenloses Kontingent, ein Konto pro Schlüssel — jeder Schlüssel ist über 33 Modelle hinweg chat-verifiziert |
| 🔑 Was ein Schlüssel Ihnen bringt | ein API-Schlüssel, der auf sein eigenes Konto beschränkt ist: die 33 Modell-IDs am Endpunkt unten, innerhalb der Grenzen Ihres Tarifs. Das Kontingent liegt beim **Konto**, weshalb dieses Tool genau ein Konto pro Schlüssel erstellt |
| 🌐 API-Struktur | OpenAI-kompatibel: `POST https://radoxai.com/v1/chat/completions` |
| 🔒 Ihre Daten | nur radoxai.com und das von Ihnen konfigurierte Postfach-Backend werden kontaktiert; Schlüssel verbleiben auf Ihrem Gerät |

## 🐞 Probleme

Wenn Radox seine Registrierung oder das Kontingent ändert, stoppt das Tool an dieser Stelle und meldet es. **[Eröffnen Sie ein Issue](../../issues)** mit dem ausgeführten Befehl und der genauen Ausgabe; Pull Requests sind willkommen.

## 📄 Lizenz

MIT © 2026 — siehe [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 radox-bulk-apikey-Mitwirkende

</div>

## ⚡ Ausführungsmodus (Voreinstellungen)

`--preset=turbo|balanced|safe` setzt Workeranzahl + Pause zwischen Konten (turbo = 5, balanced = 4, safe = 2); explizite `--conc`/`--gap` (oder die eigenen Flags des Repos) haben Vorrang, und ohne `--preset` behält das Tool seine historische Konfiguration.

Turbo wird empfohlen (5 Worker); mehr kann bei schwachen Rechnern zu Last- oder Sperrrisiken führen.