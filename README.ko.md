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

**자동 생성된 API 키로 Radox AI 계정을 대량 생성 — OpenAI 호환 추론 (Claude, GPT, Gemini, DeepSeek, Kimi, GLM, Grok) + 9Router 커넥터.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-33%20served-412991?style=for-the-badge)](https://radoxai.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 빠른 시작](#-quick-start) · [🎁 무료 티어](#-free-tier--how-much-you-get) · [🤖 모델](#-models--all-33-of-them) · [🧪 API 사용법](#-how-to-use-the-api) · [✅ 검증됨](#-verified-working--every-key-is-tested) · [🧭 작동 방식](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ 옵션](#️-cli-options) · [🛰️ 프록시](#️-behind-a-proxy) · [🐞 이슈](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## 🎁 무료 티어 — 얼마나 받을 수 있나

**모든 신규 Radox 계정은 33개 모델 전체에 대해 월 10M 토큰으로 시작합니다 — 카드도, 전화번호도 필요 없습니다.**

| 항목 | 값 |
| --- | --- |
| 월 할당량 | 계정당 **10,000,000 토큰**, 카탈로그의 모든 모델에 적용 |
| 카드 필요 여부 | **아니오** |
| 속도 제한 | 분당 80 요청 |
| 가입 | 이메일 + 비밀번호 (Gmail 등 일반적인 제공자 허용) |
| 확장 단위 | **계정 하나 = 키 하나** → `--count N`은 사실상 "무료 계정 N개" |

> 💡 무료 티어는 Radox AI가 설정하며 변경될 수 있습니다. 실시간 수치는 [radoxai.com](https://radoxai.com)에서 확인하세요 — 그리고 도구 자체의 게이트가 판단하게 하세요:

```bash
node src/cli.js --verify-only     # keys.txt의 모든 키를 실제 채팅 호출로 재검증
```

## 🤖 모델 — 33개 전부

`GET https://radoxai.com/v1/models`는 33개의 id를 제공하며, 이 도구가 만들어졌을 당시 **33개 모두 실제 채팅에서 200을 응답했습니다** (무료 티어가 전체 카탈로그를 포함하며, 유료 제한은 없습니다).

|모델|✓|
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

키 하나의 실시간 프로브 (도구가 키를 받아들이기 전에 정확히 하는 작업입니다):

```bash
curl https://radoxai.com/v1/chat/completions \
  -H "Authorization: Bearer <one of your keys>" \
  -H "Content-Type: application/json" \
  -d '{"model":"claude-opus-5","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🧪 API 사용법

베이스 URL은 **`https://radoxai.com/v1`** 입니다 — OpenAI 호환이므로 OpenAI를 지원하는 모든 것이 작동합니다.

**모든 SDK / curl**

```python
from openai import OpenAI
client = OpenAI(base_url="https://radoxai.com/v1", api_key="<your key>")
print(client.chat.completions.create(model="kimi-k3",
      messages=[{"role": "user", "content": "hi"}]).choices[0].message.content)
```

**Claude Code** (Anthropic 호환 표면 — 베이스에 `/v1` 접미사 없음):

```bash
export ANTHROPIC_BASE_URL="https://radoxai.com"
export ANTHROPIC_AUTH_TOKEN="<your key>"
export ANTHROPIC_MODEL="claude-opus-5"
claude
```

**커스텀 베이스 URL을 지원하는 모든 에이전트 / 도구** (Cursor, OpenCode, Kilo Code, …): 베이스 URL을 `https://radoxai.com/v1`로 설정하고, 키를 붙여넣고, 위 표에서 아무 모델 id나 선택하세요.

## 🛠 빠른 시작

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

`keys.txt` (`%USERPROFILE%\radox-keys.txt`로 미러링됨)는 실제 채팅 완료가 키를 증명한 **후에만** 기록됩니다.

### 🖱️ 런처

런처는 프록시 목록, 개수, 검증 모델을 묻고 이를 `launcher.config.json`에 기억한 뒤, 올바른 플래그로 CLI를 실행합니다.

## ✅ 검증됨 — 모든 키가 테스트됩니다

| 검사 | 결과 |
| --- | --- |
| 계정 생성 | `POST /register`가 계정을 생성합니다. 제공자의 자체 메일 단계는 계정이 존재한 **후에** `500 Server Error`를 응답합니다 — 도구는 중단하는 대신 세션으로 계속 진행합니다 |
| 이메일 검증 | 메일함에 **6자리 코드**가 있습니다. 이를 `POST /verify-email`에 전송하면 (`POST /verify-email/resend`로 재전송) `/dashboard`가 실제 페이지가 됩니다 |
| 키 생성 | `POST /dashboard/api-keys` — 평문 키가 한 번 반환됩니다 |
| 실시간 증명 | `POST /v1/chat/completions` — **모든** 키에 대해 `keys.txt`에 기록되기 전에 실행됩니다 |
| 채팅 검사를 통과하지 못한 키 | 기록되지 않습니다 — 계정은 `accounts.json`에서 복구 가능한 상태로 남습니다 |

## 🧭 작동 방식

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Radox AI page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://radoxai.com/v1/chat/completions → real content = the key is live
```

| 단계 | 호출 | 비고 |
| --- | --- | --- |
| 가입 | `POST /register` | 페이지 `_token`을 포함한 Laravel 폼 전송 |
| 검증 | `POST /verify-email` | 메일함에서 받은 6자리 코드 |
| 키 | `POST /dashboard/api-keys` | 평문 키가 한 번 반환됨 |
| 검사 | `POST /v1/chat/completions` | `keys.txt` 이전에 실시간 200 필수 |

## ⚙️ CLI 옵션

```bash
node src/cli.js --count N        # mint (default 50)
node src/cli.js --verify-only    # re-check every key in keys.txt with a live chat call
node src/cli.js --help
```

| 환경 변수 | 기본값 | 의미 |
| --- | --- | --- |
| `RADOX_PROXIES` | `proxies.txt` | 풀 파일, 한 줄에 프록시 하나 |

## 🛰️ 프록시 뒤에서

모든 요청은 풀에서 가져온 프록시 라인을 통해 나갑니다. 죽은 출구는 해당 시도를 실패시키고 도구는 다음으로 넘어갑니다 — 계정은 자신의 IP가 아닌 새로운 출구에서 재시도됩니다.

## 📄 파일

| 경로 | 내용 |
| --- | --- |
| `keys.txt` | 한 줄에 실시간 검증된 키 하나 — git 무시됨 |
| `accounts.json` | 계정별 이메일 / 비밀번호 / 키 / 채팅 상태 |
| `proxies.txt` | 출구 목록, 한 줄에 하나 — git 무시됨 |
| `outputs/` | 실행 상태 — git 무시됨 |

## 🔌 9Router에 연결

[9Router](https://9router.com)는 자체 호스팅되는 OpenAI 호환 라우터입니다. 이 제공자를 한 번 등록하면 모든 키가 하나의 제공자 노드 아래 연결이 됩니다:

```bash
node src/connect-9router.js
# or: npm run 9router
```

기본값: `--base http://localhost:20128`, `--password 123456`, `--name "Radox"`, `--prefix radox`, `--base-url https://radoxai.com/v1`. 그러면 모델은 `radox/<model id>`로 제공되며 모든 키에 걸쳐 로드 밸런싱됩니다.

## 🔑 키 하나로 얻는 것

| | |
| --- | --- |
| 🏢 제공자 | **Radox AI** — [radoxai.com](https://radoxai.com) |
| 🎁 제공자가 주는 것 | 무료 티어, 키당 계정 하나 — 모든 키가 33개 모델에 걸쳐 채팅 검증됨 |
| 🔑 키 하나로 얻는 것 | 자체 계정에 한정된 API 키 하나: 아래 엔드포인트의 33개 모델 id, 요금제 한도 내에서. 할당량은 **계정**에 있으므로, 이 도구가 키당 계정 하나를 생성하는 것입니다 |
| 🌐 API 형태 | OpenAI 호환: `POST https://radoxai.com/v1/chat/completions` |
| 🔒 데이터 | radoxai.com과 설정한 메일함 백엔드만 접속됩니다; 키는 사용자 컴퓨터에 남습니다 |

## 🐞 이슈

Radox가 가입 형태나 할당량을 변경하면, 도구는 해당 단계에서 멈추고 그 사실을 알립니다. 실행한 명령과 정확한 출력을 포함해 **[이슈를 열어주세요](../../issues)**; PR도 환영합니다.

## 📄 라이선스

MIT © 2026 — [LICENSE](LICENSE) 참조.

<div align="center">

**[MIT](LICENSE)** © 2026 radox-bulk-apikey contributors

</div>

## ⚡ 실행 형태 (프리셋)

`--preset=turbo|balanced|safe`는 워커 수와 계정 간 일시정지를 설정합니다 (turbo = 5, balanced = 4, safe = 2); 명시적 `--conc`/`--gap` (또는 저장소 자체 플래그)이 항상 우선하며, `--preset` 없이는 도구가 기존 형태를 그대로 유지합니다.

Turbo를 권장합니다 (워커 5개); 그 이상은 저사양 컴퓨터에서 부하/차단 위험이 있습니다.