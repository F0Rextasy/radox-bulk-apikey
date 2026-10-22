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

**Otomatik oluşturulan API anahtarlarıyla toplu Radox AI hesabı açın — OpenAI uyumlu çıkarım (Claude, GPT, Gemini, DeepSeek, Kimi, GLM, Grok) + 9Router bağlayıcısı.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-33%20served-412991?style=for-the-badge)](https://radoxai.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Hızlı başlangıç](#-quick-start) · [🎁 Ücretsiz katman](#-free-tier--how-much-you-get) · [🤖 Modeller](#-models--all-33-of-them) · [🧪 API'yi kullanma](#-how-to-use-the-api) · [✅ Doğrulandı](#-verified-working--every-key-is-tested) · [🧭 Nasıl çalışır](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Seçenekler](#️-cli-options) · [🛰️ Proxy'ler](#️-behind-a-proxy) · [🐞 Sorunlar](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## 🎁 Ücretsiz katman — ne kadar alıyorsunuz

**Her yeni Radox hesabı, 33 modelin TAMAMINDA ayda 10M token ile başlar — kart yok, telefon yok.**

| Ne | Değer |
| --- | --- |
| Aylık kota | Hesap başına **10.000.000 token**, katalogdaki her modelde |
| Kart gerekli mi | **Hayır** |
| Hız limiti | Dakikada 80 istek |
| Kayıt | e-posta + şifre (Gmail gibi standart sağlayıcılar kabul edilir) |
| Ölçeklenen birim | **bir hesap = bir anahtar** → `--count N` aslında "N ücretsiz hesap" demektir |

> 💡 Ücretsiz katman Radox AI tarafından belirlenir ve değişebilir. Güncel rakamları [radoxai.com](https://radoxai.com) adresinden kontrol edin — ve kararı aracın kendi kontrolüne bırakın:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modeller — 33'ünün tamamı

`GET https://radoxai.com/v1/models` 33 kimlik sunar; 2026-10-19 tarihli yeniden kontrolde **bunlardan 32'si canlı bir sohbet isteğine 200 yanıtı verdi** (ücretsiz katman tüm kataloğu kapsar; hiçbiri ücretli katmana kilitli değil); `seed-2.1-turbo` yanıt vermedi.

|Model|✓|
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

Tek bir anahtarın canlı testi (araç bir anahtarı kabul etmeden önce tam olarak bunu yapar):

```bash
curl https://radoxai.com/v1/chat/completions \
  -H "Authorization: Bearer <one of your keys>" \
  -H "Content-Type: application/json" \
  -d '{"model":"claude-opus-5","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🧪 API nasıl kullanılır

Temel URL **`https://radoxai.com/v1`** — OpenAI uyumlu, yani OpenAI ile konuşan her şey çalışır.

**Herhangi bir SDK / curl**

```python
from openai import OpenAI
client = OpenAI(base_url="https://radoxai.com/v1", api_key="<your key>")
print(client.chat.completions.create(model="kimi-k3",
      messages=[{"role": "user", "content": "hi"}]).choices[0].message.content)
```

**Claude Code** (Anthropic uyumlu yüzey — temel adreste `/v1` soneki yok):

```bash
export ANTHROPIC_BASE_URL="https://radoxai.com"
export ANTHROPIC_AUTH_TOKEN="<your key>"
export ANTHROPIC_MODEL="claude-opus-5"
claude
```

**Özel temel URL destekleyen herhangi bir ajan / araç** (Cursor, OpenCode, Kilo Code, …): temel URL'yi `https://radoxai.com/v1` olarak ayarlayın, bir anahtar yapıştırın, yukarıdaki tablodan herhangi bir model kimliği seçin.

## 🛠 Hızlı başlangıç

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

`keys.txt` (`%USERPROFILE%\radox-keys.txt` dosyasına da yansıtılır) **yalnızca** canlı bir sohbet tamamlama isteği anahtarı kanıtladıktan sonra yazılır.

### 🖱️ Başlatıcı

Başlatıcı proxy listesini, sayıyı ve doğrulama modelini sorar, bunları `launcher.config.json` içinde hatırlar ve CLI'yi doğru bayraklarla çalıştırır.

## ✅ Doğrulandı — her anahtar test edilir

| Kontrol | Sonuç |
| --- | --- |
| hesap oluşturma | `POST /register` hesabı oluşturur; sağlayıcının kendi posta adımı hesap var olduktan **sonra** `500 Server Error` döner — araç iptal etmek yerine oturum üzerinden devam eder |
| e-posta doğrulama | posta kutusunda **6 haneli bir kod** bulunur; bunu `POST /verify-email` adresine göndermek (yeniden gönderme: `POST /verify-email/resend`) `/dashboard` sayfasını gerçek sayfaya dönüştürür |
| anahtar oluşturma | `POST /dashboard/api-keys` — düz metin anahtar bir kez döner |
| canlı kanıt | `POST /v1/chat/completions` — `keys.txt` dosyasına yazılmadan önce **her** anahtar için çalıştırılır |
| sohbet kontrolünden geçemeyen anahtar | hiç yazılmaz — hesap `accounts.json` içinde kurtarılabilir kalır |

## 🧭 Nasıl çalışır

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Radox AI page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://radoxai.com/v1/chat/completions → real content = the key is live
```

| Adım | Çağrı | Notlar |
| --- | --- | --- |
| kayıt | `POST /register` | sayfadaki `_token` ile Laravel form gönderimi |
| doğrulama | `POST /verify-email` | posta kutusundan gelen 6 haneli kod |
| anahtar | `POST /dashboard/api-keys` | düz metin anahtar bir kez döner |
| kontrol | `POST /v1/chat/completions` | `keys.txt` öncesinde canlı 200 yanıtı gerekir |

## ⚙️ CLI seçenekleri

```bash
node src/cli.js --count N        # mint (default 50)
node src/cli.js --verify-only    # re-check every key in keys.txt with a live chat call
node src/cli.js --help
```

| Ortam değişkeni | Varsayılan | Anlamı |
| --- | --- | --- |
| `RADOX_PROXIES` | `proxies.txt` | havuz dosyası, her satırda bir proxy |

## 🛰️ Proxy arkasında

Her istek havuzunuzdaki bir proxy satırı üzerinden çıkar; ölü bir çıkış o denemeyi başarısız kılar ve araç bir sonrakine geçer — hesap yeni bir çıkış üzerinden yeniden denenir, asla kendi IP'nizden değil.

## 📄 Dosyalar

| Yol | İçerik |
| --- | --- |
| `keys.txt` | her satırda canlı olarak doğrulanmış bir anahtar — git tarafından yok sayılır |
| `accounts.json` | hesap başına e-posta / şifre / anahtar / sohbet durumu |
| `proxies.txt` | çıkışlarınız, her satırda bir tane — git tarafından yok sayılır |
| `outputs/` | çalışma durumu — git tarafından yok sayılır |

## 🔌 9Router'a bağlanma

[9Router](https://9router.com) kendi sunucunuzda barındırılan, OpenAI uyumlu bir yönlendiricidir. Bu sağlayıcıyı bir kez kaydedin ve her anahtar tek bir sağlayıcı düğümü altında bir bağlantı haline gelsin:

```bash
node src/connect-9router.js
# or: npm run 9router
```

Varsayılanlar: `--base http://localhost:20128`, `--password 123456`, `--name "Radox"`, `--prefix radox`, `--base-url https://radoxai.com/v1`. Modeller ardından `radox/<model id>` olarak sunulur ve tüm anahtarlar arasında yük dengelenir.

## 🔑 Bir anahtar size ne kazandırır

| | |
| --- | --- |
| 🏢 Sağlayıcı | **Radox AI** — [radoxai.com](https://radoxai.com) |
| 🎁 Sağlayıcının verdikleri | ücretsiz katman, anahtar başına bir hesap — her anahtar 33 modelde sohbetle doğrulanır |
| 🔑 Bir anahtar size ne kazandırır | kendi hesabıyla sınırlı bir API anahtarı: aşağıdaki uç noktada 33 model kimliği, planınızın limitleri dahilinde. Kota **hesapta** yaşar, bu aracın anahtar başına bir hesap oluşturmasının nedeni tam olarak budur |
| 🌐 API şekli | OpenAI uyumlu: `POST https://radoxai.com/v1/chat/completions` |
| 🔒 Verileriniz | yalnızca radoxai.com ve yapılandırdığınız posta kutusu arka ucuyla iletişim kurulur; anahtarlar makinenizde kalır |

## 🐞 Sorunlar

Radox kayıt akışını veya kotasını değiştirirse, araç o adımda durur ve bunu bildirir. Çalıştırdığınız komut ve tam çıktıyla birlikte **[bir sorun açın](../../issues)**; PR'lar memnuniyetle karşılanır.

## 📄 Lisans

MIT © 2026 — bkz. [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 radox-bulk-apikey contributors

</div>

## ⚡ Çalışma şekli (ön ayarlar)

`--preset=turbo|balanced|safe` worker sayısını + hesaplar arasındaki beklemeyi ayarlar (turbo = 5,
balanced = 4, safe = 2); açıkça verilen `--conc`/`--gap` (veya deponun kendi bayrakları) her zaman önceliklidir,
ve `--preset` verilmediğinde araç tarihsel şeklini tam olarak korur.

Turbo önerilir (5 worker); daha fazlası zayıf bilgisayarda yük/ban riski.