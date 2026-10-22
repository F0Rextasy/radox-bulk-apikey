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

**Массовое создание аккаунтов Radox AI с автоматически сгенерированными API-ключами — инференс, совместимый с OpenAI (Claude, GPT, Gemini, DeepSeek, Kimi, GLM, Grok) + коннектор 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-33%20served-412991?style=for-the-badge)](https://radoxai.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Быстрый старт](#-quick-start) · [🎁 Бесплатный тариф](#-free-tier--how-much-you-get) · [🤖 Модели](#-models--all-33-of-them) · [🧪 Использование API](#-how-to-use-the-api) · [✅ Проверено](#-verified-working--every-key-is-tested) · [🧭 Как это работает](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Опции](#️-cli-options) · [🛰️ Прокси](#️-behind-a-proxy) · [🐞 Проблемы](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## 🎁 Бесплатный тариф — сколько вы получаете

**Каждый новый аккаунт Radox начинается с 10 млн токенов в месяц на ВСЕХ 33 моделях — без карты, без телефона.**

| Что | Значение |
| --- | --- |
| Месячная квота | **10 000 000 токенов** на аккаунт, на каждую модель в каталоге |
| Требуется карта | **Нет** |
| Ограничение скорости | 80 запросов / минуту |
| Регистрация | e-mail + пароль (принимаются стандартные провайдеры, такие как Gmail) |
| Единица масштабирования | **один аккаунт = один ключ** → `--count N` — это на самом деле «N бесплатных аккаунтов» |

> 💡 Бесплатный тариф устанавливается Radox AI и может измениться. Проверяйте актуальные цифры на [radoxai.com](https://radoxai.com) — и пусть собственный контроль инструмента решит:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Модели — все 33

`GET https://radoxai.com/v1/models` отдаёт 33 идентификатора; **32 из них ответили живым чатом 200** при повторной проверке 2026-10-19 (бесплатный тариф покрывает весь каталог; ничего не ограничено платно); `seed-2.1-turbo` не ответил.

|Модель|✓|
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

Живая проверка одного ключа (именно это делает инструмент, прежде чем принять ключ):

```bash
curl https://radoxai.com/v1/chat/completions \
  -H "Authorization: Bearer <one of your keys>" \
  -H "Content-Type: application/json" \
  -d '{"model":"claude-opus-5","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🧪 Как использовать API

Базовый URL — **`https://radoxai.com/v1`** — совместим с OpenAI, поэтому работает всё, что говорит на языке OpenAI.

**Любой SDK / curl**

```python
from openai import OpenAI
client = OpenAI(base_url="https://radoxai.com/v1", api_key="<your key>")
print(client.chat.completions.create(model="kimi-k3",
      messages=[{"role": "user", "content": "hi"}]).choices[0].message.content)
```

**Claude Code** (поверхность, совместимая с Anthropic — без суффикса `/v1` в базовом URL):

```bash
export ANTHROPIC_BASE_URL="https://radoxai.com"
export ANTHROPIC_AUTH_TOKEN="<your key>"
export ANTHROPIC_MODEL="claude-opus-5"
claude
```

**Любой агент / инструмент с пользовательским базовым URL** (Cursor, OpenCode, Kilo Code, …): задайте базовый URL `https://radoxai.com/v1`, вставьте ключ, выберите любой идентификатор модели из таблицы выше.

## 🛠 Быстрый старт

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

`keys.txt` (зеркалируется в `%USERPROFILE%\radox-keys.txt`) записывается **только** после того, как живое завершение чата подтвердит ключ.

### 🖱️ Лаунчер

Лаунчер запрашивает список прокси, количество и модель для проверки, запоминает их в `launcher.config.json` и запускает CLI с нужными флагами.

## ✅ Проверено в работе — каждый ключ протестирован

> **Контроль качества.** Каждый ключ здесь прошёл живой `chat-200`, прежде чем был записан в `keys.txt`
> (мёртвые ключи никогда не попадают в поставку). Комбинации роутера следуют тому же правилу на уровне модели: запись
> добавляется **только если модель отвечает `chat-200` и умеет вызывать инструменты** — модель без поддержки инструментов,
> мёртвый ключ или мёртвый провайдер отбрасывается, а не добавляется. Работает с **9Router и OmniRoute**.

| Проверка | Результат |
| --- | --- |
| создание аккаунта | `POST /register` создаёт аккаунт; собственный шаг почты провайдера отвечает `500 Server Error` **после** того, как аккаунт существует — инструмент продолжает на сессии вместо прерывания |
| подтверждение e-mail | в почтовом ящике приходит **6-значный код**; его отправка на `POST /verify-email` (повторная отправка на `POST /verify-email/resend`) превращает `/dashboard` в настоящую страницу |
| создание ключа | `POST /dashboard/api-keys` — открытый ключ возвращается один раз |
| живое подтверждение | `POST /v1/chat/completions` — выполняется для **каждого** ключа, прежде чем он записан в `keys.txt` |
| ключ, не прошедший проверку чата | никогда не записывается — аккаунт остаётся восстановимым в `accounts.json` |

## 🧭 Как это работает

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Radox AI page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://radoxai.com/v1/chat/completions → real content = the key is live
```

| Шаг | Вызов | Примечания |
| --- | --- | --- |
| регистрация | `POST /register` | отправка формы Laravel с `_token` страницы |
| подтверждение | `POST /verify-email` | 6-значный код из почтового ящика |
| ключ | `POST /dashboard/api-keys` | открытый ключ возвращается один раз |
| проверка | `POST /v1/chat/completions` | требуется живой 200 перед `keys.txt` |

## ⚙️ Опции CLI

```bash
node src/cli.js --count N        # mint (default 50)
node src/cli.js --verify-only    # re-check every key in keys.txt with a live chat call
node src/cli.js --help
```

| Переменная окружения | По умолчанию | Значение |
| --- | --- | --- |
| `RADOX_PROXIES` | `proxies.txt` | файл пула, один прокси на строку — необязательно |

## 🛰️ За прокси

**Необязательно — рекомендуется при масштабе (лимиты на IP, баны).** Инструмент работает и без прокси.

- **С пулом:** передайте `--proxies <file>` (или задайте `RADOX_PROXIES`), и каждый запрос уходит через строку прокси из вашего пула; мёртвый выход проваливает эту попытку, и инструмент переходит к следующему — аккаунт повторяется на свежем выходе. Отказобезопасность при наличии пула: предоставленный пул никогда не откатывается к вашему собственному IP.
- **Без пула:** CLI выводит `running WITHOUT a proxy (direct)` и подключается напрямую — `proxies.txt` не нужен. Регистрация, подтверждение и создание ключей не меняются; меняется только то, откуда уходят пакеты.
- Запустите `--screen` в любом из режимов: он тестирует имеющиеся у вас выходы (или прямой маршрут) против Radox перед реальным запуском.

## 📄 Файлы

| Путь | Содержимое |
| --- | --- |
| `keys.txt` | один живой проверенный ключ на строку — игнорируется git |
| `accounts.json` | e-mail / пароль / ключ / статус чата для каждого аккаунта |
| `proxies.txt` | ваши выходы, один на строку — необязательно, игнорируется git |
| `outputs/` | состояние запуска — игнорируется git |

## 🔌 Подключение к 9Router

[9Router](https://9router.com) — это самостоятельно размещаемый роутер, совместимый с OpenAI. Зарегистрируйте этого провайдера один раз, и каждый ключ станет соединением под одним узлом провайдера:

```bash
node src/connect-9router.js

```

## 🔌 Подключение к OmniRoute

[OmniRoute](https://omniroute.online) — это самостоятельно размещаемый роутер, совместимый с OpenAI. Зарегистрируйте этого провайдера один раз, и каждый ключ станет соединением под одним узлом провайдера:

```bash
node src/connect-omniroute.js
# or: npm run 9router
```

Значения по умолчанию: `--base http://localhost:20128`, `--password 123456`, `--name "Radox"`, `--prefix radox`, `--base-url https://radoxai.com/v1`. Затем модели подаются как `radox/<model id>` и балансируются между всеми ключами.

## 🔑 Что даёт один ключ

| | |
| --- | --- |
| 🏢 Провайдер | **Radox AI** — [radoxai.com](https://radoxai.com) |
| 🎁 Что даёт провайдер | бесплатный тариф, один аккаунт на ключ — каждый ключ проверен чатом на 33 моделях |
| 🔑 Что даёт один ключ | один API-ключ, привязанный к своему аккаунту: 33 идентификатора моделей на эндпоинте ниже, в пределах лимитов вашего тарифа. Квота живёт на **аккаунте**, и именно поэтому этот инструмент создаёт один аккаунт на ключ |
| 🌐 Форма API | совместим с OpenAI: `POST https://radoxai.com/v1/chat/completions` |
| 🔒 Ваши данные | связь только с radoxai.com и настроенным вами бэкендом почтового ящика; ключи остаются на вашей машине |

## 🐞 Проблемы

Если Radox изменит форму регистрации или квоту, инструмент остановится на этом шаге и сообщит об этом. **[Откройте issue](../../issues)** с командой, которую вы запустили, и точным выводом; PR приветствуются.

## 📄 Лицензия

MIT © 2026 — см. [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 radox-bulk-apikey contributors

</div>

## ⚡ Форма запуска (пресеты)

`--preset=turbo|balanced|safe` задаёт воркеры + паузу между аккаунтами (turbo = 5,
balanced = 4, safe = 2); явные `--conc`/`--gap` (или собственные флаги репозитория) всегда побеждают,
а без `--preset` инструмент сохраняет свою историческую форму в точности.

Рекомендуется turbo (5 воркеров); больше — риск нагрузки/бана на слабом компьютере.