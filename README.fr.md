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

**Créez en masse des comptes Radox AI avec des clés API générées automatiquement — inférence compatible OpenAI (Claude, GPT, Gemini, DeepSeek, Kimi, GLM, Grok) + connecteur 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-33%20served-412991?style=for-the-badge)](https://radoxai.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Démarrage rapide](#-quick-start) · [🎁 Offre gratuite](#-free-tier--how-much-you-get) · [🤖 Modèles](#-models--all-33-of-them) · [🧪 Utiliser l'API](#-how-to-use-the-api) · [✅ Vérifié](#-verified-working--every-key-is-tested) · [🧭 Comment ça marche](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Options](#️-cli-options) · [🛰️ Proxys](#️-behind-a-proxy) · [🐞 Problèmes](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## 🎁 Offre gratuite — ce que vous obtenez

**Chaque nouveau compte Radox démarre avec 10 M de tokens / mois sur TOUS les 33 modèles — sans carte, sans téléphone.**

| Quoi | Valeur |
| --- | --- |
| Allocation mensuelle | **10 000 000 de tokens** par compte, sur chaque modèle du catalogue |
| Carte requise | **Non** |
| Limite de débit | 80 requêtes / minute |
| Inscription | e-mail + mot de passe (les fournisseurs standards comme Gmail sont acceptés) |
| L'unité qui évolue | **un compte = une clé** → `--count N` signifie en réalité « N comptes gratuits » |

> 💡 L'offre gratuite est définie par Radox AI et peut changer. Consultez les chiffres en direct sur [radoxai.com](https://radoxai.com) — et laissez le contrôle de l'outil en décider :

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modèles — tous les 33

`GET https://radoxai.com/v1/models` sert 33 identifiants ; **32 d'entre eux ont répondu à un chat en direct 200** lors de la revérification du 2026-10-19 (l'offre gratuite couvre tout le catalogue ; rien n'est réservé au payant) ; `seed-2.1-turbo` n'a pas répondu.

|Modèle|✓|
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

Test en direct d'une clé (c'est exactement ce que fait l'outil avant d'accepter une clé) :

```bash
curl https://radoxai.com/v1/chat/completions \
  -H "Authorization: Bearer <one of your keys>" \
  -H "Content-Type: application/json" \
  -d '{"model":"claude-opus-5","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🧪 Comment utiliser l'API

L'URL de base est **`https://radoxai.com/v1`** — compatible OpenAI, donc tout ce qui parle OpenAI fonctionne.

**N'importe quel SDK / curl**

```python
from openai import OpenAI
client = OpenAI(base_url="https://radoxai.com/v1", api_key="<your key>")
print(client.chat.completions.create(model="kimi-k3",
      messages=[{"role": "user", "content": "hi"}]).choices[0].message.content)
```

**Claude Code** (surface compatible Anthropic — pas de suffixe `/v1` sur la base) :

```bash
export ANTHROPIC_BASE_URL="https://radoxai.com"
export ANTHROPIC_AUTH_TOKEN="<your key>"
export ANTHROPIC_MODEL="claude-opus-5"
claude
```

**N'importe quel agent / outil avec une URL de base personnalisée** (Cursor, OpenCode, Kilo Code, …) : définissez l'URL de base `https://radoxai.com/v1`, collez une clé, choisissez n'importe quel identifiant de modèle dans le tableau ci-dessus.

## 🛠 Démarrage rapide

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

`keys.txt` (dupliqué vers `%USERPROFILE%\radox-keys.txt`) n'est écrit **qu'** après qu'une complétion de chat en direct a prouvé la clé.

### 🖱️ Le lanceur

Le lanceur demande la liste de proxys, le nombre et le modèle de vérification, les mémorise dans `launcher.config.json`, et exécute le CLI avec les bons drapeaux.

## ✅ Vérifié fonctionnel — chaque clé est testée

> **Contrôles qualité.** Chaque clé ici a passé un `chat-200` en direct avant d'être écrite dans `keys.txt`
> (les clés mortes ne sont jamais livrées). Les combinaisons de routeur suivent la même règle au niveau du modèle : une entrée est
> ajoutée **uniquement si le modèle répond `chat-200` et peut appeler des outils** — un modèle sans prise en charge des outils,
> une clé morte ou un fournisseur mort est écarté au lieu d'être ajouté. Fonctionne avec **9Router et OmniRoute**.

| Vérification | Résultat |
| --- | --- |
| création de compte | `POST /register` crée le compte ; l'étape e-mail propre au fournisseur répond `500 Server Error` **après** que le compte existe — l'outil continue sur la session au lieu d'abandonner |
| vérification e-mail | la boîte mail contient un **code à 6 chiffres** ; le poster sur `POST /verify-email` (renvoi sur `POST /verify-email/resend`) transforme `/dashboard` en vraie page |
| création de clé | `POST /dashboard/api-keys` — la clé en clair est renvoyée une seule fois |
| preuve en direct | `POST /v1/chat/completions` — exécuté pour **chaque** clé avant son écriture dans `keys.txt` |
| une clé qui échoue au test de chat | jamais écrite — le compte reste récupérable dans `accounts.json` |

## 🧭 Comment ça marche

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Radox AI page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://radoxai.com/v1/chat/completions → real content = the key is live
```

| Étape | Appel | Notes |
| --- | --- | --- |
| inscription | `POST /register` | envoi de formulaire Laravel avec le `_token` de la page |
| vérification | `POST /verify-email` | le code à 6 chiffres de la boîte mail |
| clé | `POST /dashboard/api-keys` | clé en clair renvoyée une seule fois |
| contrôle | `POST /v1/chat/completions` | un 200 en direct requis avant `keys.txt` |

## ⚙️ Options du CLI

```bash
node src/cli.js --count N        # mint (default 50)
node src/cli.js --verify-only    # re-check every key in keys.txt with a live chat call
node src/cli.js --help
```

| Variable d'environnement | Défaut | Signification |
| --- | --- | --- |
| `RADOX_PROXIES` | `proxies.txt` | fichier de pool, un proxy par ligne — facultatif |

## 🛰️ Derrière un proxy

**Facultatif — recommandé à grande échelle (limites par IP, bannissements).** L'outil fonctionne aussi sans proxy.

- **Avec un pool :** passez `--proxies <file>` (ou définissez `RADOX_PROXIES`) et chaque requête sort via une ligne de proxy de votre pool ; une sortie morte fait échouer cette tentative et l'outil passe à la suivante — le compte est réessayé sur une nouvelle sortie. Échec fermé tant qu'un pool est fourni : un pool fourni ne retombe jamais sur votre propre IP.
- **Sans pool :** le CLI affiche `running WITHOUT a proxy (direct)` et se connecte directement — aucun `proxies.txt` nécessaire. L'inscription, la vérification et la création de clé sont inchangées ; seul le point de sortie des paquets change.
- Lancez `--screen` dans l'un ou l'autre mode : il teste les sorties dont vous disposez (ou la route directe) contre Radox avant une exécution réelle.

## 📄 Fichiers

| Chemin | Contenu |
| --- | --- |
| `keys.txt` | une clé vérifiée en direct par ligne — ignoré par git |
| `accounts.json` | e-mail / mot de passe / clé / statut de chat par compte |
| `proxies.txt` | vos sorties, une par ligne — facultatif, ignoré par git |
| `outputs/` | état d'exécution — ignoré par git |

## 🔌 Connexion à 9Router

[9Router](https://9router.com) est un routeur auto-hébergé, compatible OpenAI. Enregistrez ce fournisseur une fois et chaque clé devient une connexion sous un seul nœud fournisseur :

```bash
node src/connect-9router.js

```

## 🔌 Connexion à OmniRoute

[OmniRoute](https://omniroute.online) est un routeur auto-hébergé, compatible OpenAI. Enregistrez ce fournisseur une fois et chaque clé devient une connexion sous un seul nœud fournisseur :

```bash
node src/connect-omniroute.js
# or: npm run 9router
```

Valeurs par défaut : `--base http://localhost:20128`, `--password 123456`, `--name "Radox"`, `--prefix radox`, `--base-url https://radoxai.com/v1`. Les modèles sont alors servis sous `radox/<model id>` et répartis en charge sur chaque clé.

## 🔑 Ce qu'une clé vous donne

| | |
| --- | --- |
| 🏢 Fournisseur | **Radox AI** — [radoxai.com](https://radoxai.com) |
| 🎁 Ce que le fournisseur donne | offre gratuite, un compte par clé — chaque clé vérifiée par chat sur 33 modèles |
| 🔑 Ce qu'une clé vous donne | une clé API limitée à son propre compte : les 33 identifiants de modèles sur le point de terminaison ci-dessous, aux limites de votre offre. Le quota vit sur le **compte**, c'est exactement pourquoi cet outil crée un compte par clé |
| 🌐 Forme de l'API | compatible OpenAI : `POST https://radoxai.com/v1/chat/completions` |
| 🔒 Vos données | seuls radoxai.com et le backend de boîte mail que vous configurez sont contactés ; les clés restent sur votre machine |

## 🐞 Problèmes

Si Radox modifie la forme de son inscription ou son quota, l'outil s'arrête à cette étape et le signale. **[Ouvrez un ticket](../../issues)** avec la commande que vous avez exécutée et la sortie exacte ; les PR sont bienvenues.

## 📄 Licence

MIT © 2026 — voir [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 radox-bulk-apikey contributors

</div>

## ⚡ Forme d'exécution (préréglages)

`--preset=turbo|balanced|safe` définit les workers + la pause entre les comptes (turbo = 5,
balanced = 4, safe = 2) ; les `--conc`/`--gap` explicites (ou les drapeaux propres au dépôt) l'emportent toujours,
et sans `--preset` l'outil conserve exactement sa forme historique.

Turbo önerilir (5 worker); daha fazlası zayıf bilgisayarda yük/ban riski.