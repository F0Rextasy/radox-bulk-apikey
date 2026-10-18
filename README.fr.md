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

**Création massive de comptes Radox AI avec clés API générées automatiquement — inférence compatible OpenAI (Claude, GPT, Gemini, DeepSeek, Kimi, GLM, Grok) + connecteur 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-33%20served-412991?style=for-the-badge)](https://radoxai.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Démarrage rapide](#-démarrage-rapide) · [🎁 Forfait gratuit](#-forfait-gratuit--ce-que-vous-obtenez) · [🤖 Modèles](#-modèles--les-33-au-complet) · [🧪 Utiliser l'API](#-comment-utiliser-lapi) · [✅ Vérifié](#-fonctionne-avec-vérification--chaque-clé-est-testée) · [🧭 Fonctionnement](#-fonctionnement) · [🔌 9Router](#-connexion-à-9router) · [⚙️ Options](#️-options-cli) · [🛰️ Proxys](#️-derrière-un-proxy) · [🐞 Problèmes](#-problèmes)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>


---

## 🎁 Forfait gratuit — ce que vous obtenez

**Chaque nouveau compte Radox commence avec 10 millions de jetons / mois sur les 33 modèles — sans carte, sans téléphone.**

| Élément | Valeur |
| --- | --- |
| Allocation mensuelle | **10 000 000 de jetons** par compte, sur chaque modèle du catalogue |
| Carte requise | **Non** |
| Limite de débit | 80 requêtes / minute |
| Inscription | e-mail + mot de passe (les fournisseurs standards comme Gmail sont acceptés) |
| Unité de mise à l'échelle | **un compte = une clé** → `--count N` signifie vraiment "N comptes gratuits" |

> 💡 Le forfait gratuit est défini par Radox AI et peut changer. Consultez les chiffres en direct sur [radoxai.com](https://radoxai.com) — et laissez le système interne de l'outil décider :

```bash
node src/cli.js --verify-only     # chaque clé dans keys.txt est re-testée via un appel de chat réel
```

## 🤖 Modèles — les 33 au complet

`GET https://radoxai.com/v1/models` propose 33 identifiants ; **les 33 ont répondu avec un statut 200 lors d'un chat en direct** au moment de la création de cet outil (le forfait gratuit couvre l'intégralité du catalogue ; aucun modèle n'est réservé aux paiements).

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
|`seed-2.1-turbo`|✓|
|`muse-spark-1.1`|✓|
|`gemma-2-2b`|✓|

Exemple de vérification en direct d'une clé (c'est exactement ce que fait l'outil avant d'accepter une clé) :

```bash
curl https://radoxai.com/v1/chat/completions \
  -H "Authorization: Bearer <l'une de vos clés>" \
  -H "Content-Type: application/json" \
  -d '{"model":"claude-opus-5","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🧪 Comment utiliser l'API

L'URL de base est **`https://radoxai.com/v1`** — compatible OpenAI, donc tout outil compatible OpenAI fonctionne.

**N'importe quel SDK / curl**

```python
from openai import OpenAI
client = OpenAI(base_url="https://radoxai.com/v1", api_key="<votre clé>")
print(client.chat.completions.create(model="kimi-k3",
      messages=[{"role": "user", "content": "hi"}]).choices[0].message.content)
```

**Claude Code** (interface compatible Anthropic — sans suffixe `/v1` dans l'URL de base) :

```bash
export ANTHROPIC_BASE_URL="https://radoxai.com"
export ANTHROPIC_AUTH_TOKEN="<votre clé>"
export ANTHROPIC_MODEL="claude-opus-5"
claude
```

**N'importe quel agent / outil avec une URL de base personnalisée** (Cursor, OpenCode, Kilo Code, …) : définissez l'URL de base `https://radoxai.com/v1`, collez une clé, choisissez n'importe quel identifiant de modèle dans le tableau ci-dessus.

## 🛠 Démarrage rapide

```bash
# clonez ou faites un fork de ce dépôt, puis :
cd radox-bulk-apikey

# 1) votre liste de proxys, un par ligne (http://… ou socks5://…)
printf 'http://127.0.0.1:8080\n' > proxies.txt

# 2) c'est parti
node src/launcher.js        # mode interactif
# ou directement :
node src/cli.js --count 50
```

`keys.txt` (copié vers `%USERPROFILE%\radox-keys.txt`) n'est écrit **qu'après** qu'un appel de chat en direct a confirmé la validité de la clé.

### 🖱️ Le lanceur

Le lanceur demande la liste des proxys, le nombre souhaité et le modèle de vérification, les enregistre dans `launcher.config.json`, puis exécute l'interface CLI avec les bons paramètres.

## ✅ Fonctionne avec vérification — chaque clé est testée

| Vérification | Résultat |
| --- | --- |
| Création de compte | `POST /register` crée le compte ; le service mail du fournisseur renvoie une `500 Server Error` **après** que le compte existe — l'outil continue avec la session au lieu d'interrompre |
| Vérification e-mail | la boîte mail contient un **code à 6 chiffres** ; l'envoyer à `POST /verify-email` (renvoi possible via `POST /verify-email/resend`) permet d'accéder à la page `/dashboard` |
| Création de clé | `POST /dashboard/api-keys` — la clé en clair est retournée une seule fois |
| Preuve en direct | `POST /v1/chat/completions` — exécuté pour **chaque** clé avant d'être écrite dans `keys.txt` |
| Clé échouant au test de chat | jamais écrite — le compte reste récupérable dans `accounts.json` |

## 🧭 Fonctionnement

```
boîte mail (une adresse par compte)                                  une adresse fraîche par compte
   │
   ├─▶ inscription : page Radox AI → adresse e-mail → code / lien depuis la boîte
   ├─▶ session : cookies ou jeton d'accès du compte en main
   ├─▶ création clé : point d'accès clés du compte → clé en clair retournée une fois (écrite immédiatement sur disque)
   └─▶ preuve en direct : POST https://radoxai.com/v1/chat/completions → contenu réel = la clé est active
```

| Étape | Appel | Notes |
| --- | --- | --- |
| inscription | `POST /register` | envoi de formulaire Laravel avec le `_token` de la page |
| vérification | `POST /verify-email` | code à 6 chiffres provenant de la boîte mail |
| clé | `POST /dashboard/api-keys` | clé en clair retournée une fois |
| vérification | `POST /v1/chat/completions` | statut 200 en direct requis avant écriture dans `keys.txt` |

## ⚙️ Options CLI

```bash
node src/cli.js --count N        # création de clés (par défaut 50)
node src/cli.js --verify-only    # re-vérifie chaque clé dans keys.txt via un appel de chat en direct
node src/cli.js --help
```

| Variable d'environnement | Par défaut | Signification |
| --- | --- | --- |
| `RADOX_PROXIES` | `proxies.txt` | fichier de pool, un proxy par ligne |

## 🛰️ Derrière un proxy

Chaque requête sort via un proxy de votre liste ; un proxy défaillant fait échouer cette tentative et l'outil passe au suivant — le compte est réessayé via un nouveau proxy, jamais depuis votre propre IP.

## 📄 Fichiers

| Chemin | Contenu |
| --- | --- |
| `keys.txt` | une clé validée en direct par ligne — ignoré par git |
| `accounts.json` | e-mail / mot de passe / clé / statut chat par compte |
| `proxies.txt` | vos sorties, une par ligne — ignoré par git |
| `outputs/` | état des exécutions — ignoré par git |

## 🔌 Connexion à 9Router

[9Router](https://9router.com) est un routeur auto-hébergé, compatible OpenAI. Enregistrez ce fournisseur une fois, et chaque clé devient une connexion sous un nœud fournisseur :

```bash
node src/connect-9router.js
# ou : npm run 9router
```

Valeurs par défaut : `--base http://localhost:20128`, `--password 123456`, `--name "Radox"`, `--prefix radox`, `--base-url https://radoxai.com/v1`. Les modèles sont alors servis sous `radox/<id du modèle>` et répartis sur toutes les clés.

## 🔑 Ce qu'apporte une clé

| | |
| --- | --- |
| 🏢 Fournisseur | **Radox AI** — [radoxai.com](https://radoxai.com) |
| 🎁 Ce que donne le fournisseur | forfait gratuit, un compte par clé — chaque clé vérifiée via chat sur les 33 modèles |
| 🔑 Ce qu'apporte une clé | une clé API liée à son propre compte : les 33 identifiants de modèles sur le point d'accès ci-dessous, aux limites de votre forfait. Le quota est attaché au **compte**, c'est pourquoi cet outil crée un compte par clé |
| 🌐 Format API | Compatible OpenAI : `POST https://radoxai.com/v1/chat/completions` |
| 🔒 Vos données | seuls radoxai.com et le backend de messagerie que vous configurez sont contactés ; les clés restent sur votre machine |

## 🐞 Problèmes

Si Radox modifie son processus d'inscription ou ses quotas, l'outil s'arrête à cette étape et l'indique. **[Ouvrez une issue](../../issues)** avec la commande exécutée et la sortie exacte ; les PR sont bienvenues.

## 📄 Licence

MIT © 2026 — voir [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 contributeurs de radox-bulk-apikey

</div>

## ⚡ Forme d'exécution (préréglages)

`--preset=turbo|balanced|safe` définit le nombre de workers + pause entre les comptes (turbo = 5, équilibré = 4, sûr = 2) ; `--conc`/`--gap` explicites (ou les propres paramètres du dépôt) ont toujours priorité, et sans `--preset` l'outil conserve exactement sa configuration historique.

Turbo est recommandé (5 workers) ; au-delà, risque de surcharge ou de bannissement sur machine faible.