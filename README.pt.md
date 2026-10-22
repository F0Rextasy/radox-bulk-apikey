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

**Crie contas Radox AI em massa com chaves de API geradas automaticamente — inferência compatível com OpenAI (Claude, GPT, Gemini, DeepSeek, Kimi, GLM, Grok) + conector 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-33%20served-412991?style=for-the-badge)](https://radoxai.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Início rápido](#-quick-start) · [🎁 Nível gratuito](#-free-tier--how-much-you-get) · [🤖 Modelos](#-models--all-33-of-them) · [🧪 Use a API](#-how-to-use-the-api) · [✅ Verificado](#-verified-working--every-key-is-tested) · [🧭 Como funciona](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Opções](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Problemas](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## 🎁 Nível gratuito — quanto você recebe

**Toda nova conta Radox começa com 10M de tokens / mês em TODOS os 33 modelos — sem cartão, sem telefone.**

| O quê | Valor |
| --- | --- |
| Franquia mensal | **10.000.000 de tokens** por conta, em todos os modelos do catálogo |
| Cartão exigido | **Não** |
| Limite de requisições | 80 requisições / minuto |
| Cadastro | e-mail + senha (provedores padrão como Gmail são aceitos) |
| A unidade que escala | **uma conta = uma chave** → `--count N` significa, na prática, "N contas gratuitas" |

> 💡 O nível gratuito é definido pela Radox AI e pode mudar. Confira os números atuais em [radoxai.com](https://radoxai.com) — e deixe o próprio gate da ferramenta decidir:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelos — todos os 33

`GET https://radoxai.com/v1/models` serve 33 ids; **32 deles responderam a um chat ao vivo com 200** na reverificação de 2026-10-19 (o nível gratuito cobre todo o catálogo; nada é restrito a pagamento); `seed-2.1-turbo` não respondeu.

|Modelo|✓|
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

Teste ao vivo de uma chave (é exatamente o que a ferramenta faz antes de aceitar uma chave):

```bash
curl https://radoxai.com/v1/chat/completions \
  -H "Authorization: Bearer <one of your keys>" \
  -H "Content-Type: application/json" \
  -d '{"model":"claude-opus-5","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🧪 Como usar a API

A URL base é **`https://radoxai.com/v1`** — compatível com OpenAI, então qualquer coisa que fale OpenAI funciona.

**Qualquer SDK / curl**

```python
from openai import OpenAI
client = OpenAI(base_url="https://radoxai.com/v1", api_key="<your key>")
print(client.chat.completions.create(model="kimi-k3",
      messages=[{"role": "user", "content": "hi"}]).choices[0].message.content)
```

**Claude Code** (superfície compatível com Anthropic — sem sufixo `/v1` na base):

```bash
export ANTHROPIC_BASE_URL="https://radoxai.com"
export ANTHROPIC_AUTH_TOKEN="<your key>"
export ANTHROPIC_MODEL="claude-opus-5"
claude
```

**Qualquer agente / ferramenta com URL base personalizada** (Cursor, OpenCode, Kilo Code, …): defina a URL base `https://radoxai.com/v1`, cole uma chave, escolha qualquer id de modelo da tabela acima.

## 🛠 Início rápido

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

`keys.txt` (espelhado em `%USERPROFILE%\radox-keys.txt`) é escrito **somente** depois que uma conclusão de chat ao vivo comprova a chave.

### 🖱️ O launcher

O launcher pergunta pela lista de proxies, quantidade e modelo de verificação, memoriza tudo em `launcher.config.json` e executa a CLI com as flags corretas.

## ✅ Verificado e funcionando — toda chave é testada

> **Gates de qualidade.** Toda chave aqui passou por um `chat-200` ao vivo antes de ser escrita em `keys.txt`
> (chaves mortas nunca são entregues). As combinações de roteadores seguem a mesma regra no nível do modelo: uma entrada é
> adicionada **somente se o modelo responder `chat-200` e conseguir chamar ferramentas** — um modelo sem suporte a ferramentas,
> uma chave morta ou um provedor morto é descartado em vez de adicionado. Funciona com **9Router e OmniRoute**.

| Verificação | Resultado |
| --- | --- |
| criação de conta | `POST /register` cria a conta; a própria etapa de e-mail do provedor responde `500 Server Error` **depois** que a conta existe — a ferramenta continua na sessão em vez de abortar |
| verificação de e-mail | a caixa de entrada traz um **código de 6 dígitos**; enviá-lo para `POST /verify-email` (reenvio em `POST /verify-email/resend`) transforma `/dashboard` na página real |
| criação de chave | `POST /dashboard/api-keys` — a chave em texto puro é retornada uma única vez |
| prova ao vivo | `POST /v1/chat/completions` — executado para **toda** chave antes de ser escrita em `keys.txt` |
| uma chave que falha na verificação de chat | nunca é escrita — a conta permanece recuperável em `accounts.json` |

## 🧭 Como funciona

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Radox AI page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://radoxai.com/v1/chat/completions → real content = the key is live
```

| Etapa | Chamada | Observações |
| --- | --- |
| cadastro | `POST /register` | post de formulário Laravel com o `_token` da página |
| verificação | `POST /verify-email` | o código de 6 dígitos da caixa de entrada |
| chave | `POST /dashboard/api-keys` | chave em texto puro retornada uma única vez |
| verificação | `POST /v1/chat/completions` | 200 ao vivo exigido antes de `keys.txt` |

## ⚙️ Opções da CLI

```bash
node src/cli.js --count N        # mint (default 50)
node src/cli.js --verify-only    # re-check every key in keys.txt with a live chat call
node src/cli.js --help
```

| Variável de ambiente | Padrão | Significado |
| --- | --- | --- |
| `RADOX_PROXIES` | `proxies.txt` | arquivo de pool, um proxy por linha — opcional |

## 🛰️ Atrás de um proxy

**Opcional — recomendado em escala (limites por IP, banimentos).** A ferramenta também funciona sem proxy.

- **Com um pool:** passe `--proxies <file>` (ou defina `RADOX_PROXIES`) e toda requisição sai por uma linha de proxy do seu pool; uma saída morta faz aquela tentativa falhar e a ferramenta passa para a próxima — a conta é tentada novamente em uma saída nova. Fail-closed enquanto um pool é fornecido: um pool fornecido nunca recorre ao seu próprio IP.
- **Sem um pool:** a CLI imprime `running WITHOUT a proxy (direct)` e conecta diretamente — nenhum `proxies.txt` é necessário. Cadastro, verificação e criação de chave permanecem inalterados; só muda de onde os pacotes saem.
- Execute `--screen` em qualquer um dos modos: ele testa as saídas que você tem (ou a rota direta) contra a Radox antes de uma execução real.

## 📄 Arquivos

| Caminho | Conteúdo |
| --- | --- |
| `keys.txt` | uma chave verificada ao vivo por linha — ignorado pelo git |
| `accounts.json` | e-mail / senha / chave / status de chat por conta |
| `proxies.txt` | suas saídas, uma por linha — opcional, ignorado pelo git |
| `outputs/` | estado da execução — ignorado pelo git |

## 🔌 Conectar ao 9Router

[9Router](https://9router.com) é um roteador auto-hospedado e compatível com OpenAI. Registre este provedor uma vez e toda chave se torna uma conexão sob um nó de provedor:

```bash
node src/connect-9router.js

```

## 🔌 Conectar ao OmniRoute

[OmniRoute](https://omniroute.online) é um roteador auto-hospedado e compatível com OpenAI. Registre este provedor uma vez e toda chave se torna uma conexão sob um nó de provedor:

```bash
node src/connect-omniroute.js
# or: npm run 9router
```

Padrões: `--base http://localhost:20128`, `--password 123456`, `--name "Radox"`, `--prefix radox`, `--base-url https://radoxai.com/v1`. Os modelos são então servidos como `radox/<model id>` e balanceados entre todas as chaves.

## 🔑 O que uma chave oferece

| | |
| --- | --- |
| 🏢 Provedor | **Radox AI** — [radoxai.com](https://radoxai.com) |
| 🎁 O que o provedor oferece | nível gratuito, uma conta por chave — toda chave verificada por chat em 33 modelos |
| 🔑 O que uma chave oferece | uma chave de API vinculada à sua própria conta: os 33 ids de modelo no endpoint abaixo, nos limites do seu plano. A cota fica na **conta**, e é exatamente por isso que esta ferramenta cria uma conta por chave |
| 🌐 Formato da API | compatível com OpenAI: `POST https://radoxai.com/v1/chat/completions` |
| 🔒 Seus dados | apenas radoxai.com e o backend de caixa de entrada que você configurar são contatados; as chaves ficam na sua máquina |

## 🐞 Problemas

Se a Radox mudar o formato do cadastro ou a cota, a ferramenta para nessa etapa e avisa. **[Abra uma issue](../../issues)** com o comando que você executou e a saída exata; PRs são bem-vindos.

## 📄 Licença

MIT © 2026 — veja [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 radox-bulk-apikey contributors

</div>

## ⚡ Formato de execução (presets)

`--preset=turbo|balanced|safe` define workers + a pausa entre contas (turbo = 5,
balanced = 4, safe = 2); `--conc`/`--gap` explícitos (ou as próprias flags do repositório) sempre vencem,
e sem `--preset` a ferramenta mantém exatamente seu formato histórico.

Turbo önerilir (5 worker); daha fazlası zayıf bilgisayarda yük/ban riski.