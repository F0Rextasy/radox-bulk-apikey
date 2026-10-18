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

**Crea cuentas de Radox AI en masa con claves API generadas automáticamente — inferencia compatible con OpenAI (Claude, GPT, Gemini, DeepSeek, Kimi, GLM, Grok) + conector 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-33%20served-412991?style=for-the-badge)](https://radoxai.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Inicio rápido](#-quick-start) · [🎁 Nivel gratuito](#-free-tier--how-much-you-get) · [🤖 Modelos](#-models--all-33-of-them) · [🧪 Usar la API](#-how-to-use-the-api) · [✅ Verificado](#-verified-working--every-key-is-tested) · [🧭 Cómo funciona](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Opciones](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Problemas](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>


---

## 🎁 Nivel gratuito — cuánto obtienes

**Cada cuenta nueva de Radox comienza con 10M de tokens / mes en TODOS los 33 modelos — sin tarjeta, sin teléfono.**

| Qué | Valor |
| --- | --- |
| Asignación mensual | **10,000,000 tokens** por cuenta, en cada modelo del catálogo |
| Tarjeta requerida | **No** |
| Límite de velocidad | 80 solicitudes / minuto |
| Registro | correo electrónico + contraseña (se aceptan proveedores estándar como Gmail) |
| La unidad que escala | **una cuenta = una clave** → `--count N` en realidad significa "N cuentas gratuitas" |

> 💡 El nivel gratuito lo define Radox AI y puede cambiar. Consulta los números en vivo en [radoxai.com](https://radoxai.com) — y deja que la propia verificación de la herramienta decida:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelos — los 33

`GET https://radoxai.com/v1/models` sirve 33 ids; **los 33 respondieron un chat en vivo con 200** cuando se construyó esta herramienta (el nivel gratuito cubre todo el catálogo; nada está restringido por pago).

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
|`seed-2.1-turbo`|✓|
|`muse-spark-1.1`|✓|
|`gemma-2-2b`|✓|

Prueba en vivo de una clave (esto es exactamente lo que hace la herramienta antes de aceptar una clave):

```bash
curl https://radoxai.com/v1/chat/completions \
  -H "Authorization: Bearer <one of your keys>" \
  -H "Content-Type: application/json" \
  -d '{"model":"claude-opus-5","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🧪 Cómo usar la API

La URL base es **`https://radoxai.com/v1`** — compatible con OpenAI, así que cualquier cosa que hable OpenAI funciona.

**Cualquier SDK / curl**

```python
from openai import OpenAI
client = OpenAI(base_url="https://radoxai.com/v1", api_key="<your key>")
print(client.chat.completions.create(model="kimi-k3",
      messages=[{"role": "user", "content": "hi"}]).choices[0].message.content)
```

**Claude Code** (superficie compatible con Anthropic — sin sufijo `/v1` en la base):

```bash
export ANTHROPIC_BASE_URL="https://radoxai.com"
export ANTHROPIC_AUTH_TOKEN="<your key>"
export ANTHROPIC_MODEL="claude-opus-5"
claude
```

**Cualquier agente / herramienta con una URL base personalizada** (Cursor, OpenCode, Kilo Code, …): establece la URL base `https://radoxai.com/v1`, pega una clave, elige cualquier id de modelo de la tabla anterior.

## 🛠 Inicio rápido

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

`keys.txt` (replicado en `%USERPROFILE%\radox-keys.txt`) se escribe **solo** después de que una finalización de chat en vivo demuestre que la clave es válida.

### 🖱️ El lanzador

El lanzador solicita la lista de proxies, la cantidad y el modelo de verificación, los recuerda en `launcher.config.json` y ejecuta la CLI con las opciones correctas.

## ✅ Verificado y funcionando — cada clave se prueba

| Comprobación | Resultado |
| --- | --- |
| creación de cuenta | `POST /register` crea la cuenta; el propio paso de correo del proveedor responde `500 Server Error` **después** de que la cuenta existe — la herramienta continúa con la sesión en lugar de abortar |
| verificación de correo | el buzón lleva un **código de 6 dígitos**; enviarlo a `POST /verify-email` (reenvío en `POST /verify-email/resend`) convierte `/dashboard` en la página real |
| creación de clave | `POST /dashboard/api-keys` — la clave en texto plano se devuelve una vez |
| prueba en vivo | `POST /v1/chat/completions` — se ejecuta para **cada** clave antes de escribirla en `keys.txt` |
| una clave que falla la comprobación de chat | nunca se escribe — la cuenta permanece recuperable en `accounts.json` |

## 🧭 Cómo funciona

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Radox AI page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://radoxai.com/v1/chat/completions → real content = the key is live
```

| Paso | Llamada | Notas |
| --- | --- | --- |
| registro | `POST /register` | envío de formulario Laravel con el `_token` de la página |
| verificación | `POST /verify-email` | el código de 6 dígitos del buzón |
| clave | `POST /dashboard/api-keys` | clave en texto plano devuelta una vez |
| comprobación | `POST /v1/chat/completions` | se requiere un 200 en vivo antes de `keys.txt` |

## ⚙️ Opciones de la CLI

```bash
node src/cli.js --count N        # mint (default 50)
node src/cli.js --verify-only    # re-check every key in keys.txt with a live chat call
node src/cli.js --help
```

| Variable de entorno | Predeterminado | Significado |
| --- | --- | --- |
| `RADOX_PROXIES` | `proxies.txt` | archivo del grupo, un proxy por línea |

## 🛰️ Detrás de un proxy

Cada solicitud sale a través de una línea de proxy de tu grupo; una salida muerta hace fallar ese intento y la herramienta pasa a la siguiente — la cuenta se reintenta en una salida nueva, nunca desde tu propia IP.

## 📄 Archivos

| Ruta | Contenido |
| --- | --- |
| `keys.txt` | una clave verificada en vivo por línea — ignorada por git |
| `accounts.json` | correo electrónico / contraseña / clave / estado del chat por cuenta |
| `proxies.txt` | tus salidas, una por línea — ignorado por git |
| `outputs/` | estado de ejecución — ignorado por git |

## 🔌 Conectar con 9Router

[9Router](https://9router.com) es un enrutador autoalojado compatible con OpenAI. Registra este proveedor una vez y cada clave se convierte en una conexión bajo un nodo de proveedor:

```bash
node src/connect-9router.js
# or: npm run 9router
```

Valores predeterminados: `--base http://localhost:20128`, `--password 123456`, `--name "Radox"`, `--prefix radox`, `--base-url https://radoxai.com/v1`. Los modelos se sirven entonces como `radox/<model id>` y se equilibran la carga entre todas las claves.

## 🔑 Qué te da una clave

| | |
| --- | --- |
| 🏢 Proveedor | **Radox AI** — [radoxai.com](https://radoxai.com) |
| 🎁 Qué da el proveedor | nivel gratuito, una cuenta por clave — cada clave verificada por chat en 33 modelos |
| 🔑 Qué te da una clave | una clave API limitada a su propia cuenta: los 33 ids de modelo en el endpoint de abajo, con los límites de tu plan. La cuota vive en la **cuenta**, que es exactamente por lo que esta herramienta crea una cuenta por clave |
| 🌐 Forma de la API | compatible con OpenAI: `POST https://radoxai.com/v1/chat/completions` |
| 🔒 Tus datos | solo se contacta con radoxai.com y el backend de buzón que configures; las claves permanecen en tu máquina |

## 🐞 Problemas

Si Radox cambia la forma de su registro o su cuota, la herramienta se detiene en ese paso y lo indica. **[Abre un issue](../../issues)** con el comando que ejecutaste y la salida exacta; los PR son bienvenidos.

## 📄 Licencia

MIT © 2026 — consulta [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 radox-bulk-apikey contributors

</div>

## ⚡ Forma de ejecución (presets)

`--preset=turbo|balanced|safe` establece los workers + la pausa entre cuentas (turbo = 5,
balanced = 4, safe = 2); `--conc`/`--gap` explícitos (o las propias opciones del repositorio) siempre tienen prioridad,
y sin `--preset` la herramienta mantiene exactamente su forma histórica.

Turbo önerilir (5 worker); daha fazlası zayıf bilgisayarda yük/ban riski.