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

**Radox AI hesaplarını otomatik oluşturulan API anahtarlarıyla toplu olarak oluşturun — OpenAI ile uyumlu çıkarım (Claude, GPT, Gemini, DeepSeek, Kimi, GLM, Grok) + 9Router bağlayıcısı.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-33%20served-412991?style=for-the-badge)](https://radoxai.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Hızlı başlangıç](#-hızlı-başlangıç) · [🎁 Ücretsiz katman](#-ücretsiz-katman--ne-kadar-alırsınız) · [🤖 Modeller](#-modeller--tüm-33-ü) · [🧪 API'yi kullanma](#-apiyi-nasıl-kullanılır) · [✅ Doğrulanmış](#-çalıştığı-doğrulanmış--her-anahtar-test edilmiştir) · [🧭 Nasıl çalışır](#-nasıl-çalışır) · [🔌 9Router](#-9router-e-bağlanma) · [⚙️ Seçenekler](#️-cli-seçenekleri) · [🛰️ Vekil sunucular](#️-bir-vekil-sunucunun-arkasında) · [🐞 Sorunlar](#-sorunlar)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## 🎁 Ücretsiz katman — ne kadar alırsınız

**Her yeni Radox hesabı, 33 modelin tamamında aylık 10 milyon token ile başlar — kart gerekmez, telefon gerekmez.**

| Nedir | Değer |
| --- | --- |
| Aylık kota | **10.000.000 token** her hesap için, katalogdaki her modelde |
| Kart gerekli mi | **Hayır** |
| Hız sınırı | 80 istek / dakika |
| Kayıt | e-posta + şifre (Gmail gibi standart sağlayıcılar kabul edilir) |
| Ölçeklenebilir birim | **bir hesap = bir anahtar** → `--count N` aslında "N ücretsiz hesap" anlamına gelir |

> 💡 Ücretsiz katman Radox AI tarafından belirlenir ve değişebilir. Güncel değerleri [radoxai.com](https://radoxai.com) adresinden kontrol edin — ve aracın kendi doğrulama sisteminin karar vermesine izin verin:

```bash
node src/cli.js --verify-only     # keys.txt içindeki her anahtar gerçek bir sohbet çağrısıyla yeniden test edilir
```

## 🤖 Modeller — tüm 33'ü

`GET https://radoxai.com/v1/models` 33 adet model kimliği sunar; **bu araç oluşturulduğunda tüm 33 model canlı bir sohbet yanıtı olarak 200 döndü** (ücretsiz katman tüm kataloğu kapsar; hiçbir şey ücretli değil).

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
|`seed-2.1-turbo`|✓|
|`muse-spark-1.1`|✓|
|`gemma-2-2b`|✓|

Bir anahtar için canlı test (araç, bir anahtarı kabul etmeden önce tam olarak bunu yapar):

```bash
curl https://radoxai.com/v1/chat/completions \
  -H "Authorization: Bearer <anahtarlarınızdan biri>" \
  -H "Content-Type: application/json" \
  -d '{"model":"claude-opus-5","messages":[{"role":"user","content":"merhaba"}],"max_tokens":8}'
```

## 🧪 API'yi nasıl kullanılır

Temel URL **`https://radoxai.com/v1`** şeklindedir — OpenAI ile uyumludur, bu yüzden OpenAI destekleyen her şey çalışır.

**Herhangi bir SDK / curl**

```python
from openai import OpenAI
client = OpenAI(base_url="https://radoxai.com/v1", api_key="<anahtarınız>")
print(client.chat.completions.create(model="kimi-k3",
      messages=[{"role": "user", "content": "merhaba"}]).choices[0].message.content)
```

**Claude Code** (Anthropic ile uyumlu arayüz — temel URL'de `/v1` son eki yoktur):

```bash
export ANTHROPIC_BASE_URL="https://radoxai.com"
export ANTHROPIC_AUTH_TOKEN="<anahtarınız>"
export ANTHROPIC_MODEL="claude-opus-5"
claude
```

**Özel temel URL destekleyen herhangi bir ajan / araç** (Cursor, OpenCode, Kilo Code, …): temel URL'yi `https://radoxai.com/v1` olarak ayarlayın, bir anahtar yapıştırın, yukarıdaki tablodan herhangi bir model kimliği seçin.

## 🛠 Hızlı başlangıç

```bash
# bu depoyu kopyalayın veya forklayın, ardından:
cd radox-bulk-apikey

# 1) vekil sunucu listeniz, satır başı birer tane (http://… veya socks5://…)
printf 'http://127.0.0.1:8080\n' > proxies.txt

# 2) başla
node src/launcher.js        # etkileşimli
# veya doğrudan:
node src/cli.js --count 50
```

`keys.txt` (şu yere kopyalanır: `%USERPROFILE%\radox-keys.txt`) yalnızca canlı bir sohbet tamamlaması anahtarı doğruladıktan sonra yazılır.

### 🖱️ Başlatıcı

Başlatıcı, vekil listesini, sayıyı ve doğrulama modelini sorar, bunları `launcher.config.json` dosyasında saklar ve doğru bayraklarla CLI'yi çalıştırır.

## ✅ Çalıştığı doğrulanmış — her anahtar test edilmiştir

| Kontrol | Sonuç |
| --- | --- |
| hesap oluşturma | `POST /register` hesabını oluşturur; sağlayıcının kendi e-posta adımı, hesap var olduktan sonra `500 Sunucu Hatası` döndürür — araç bunun yerine oturumda devam eder, iptal etmez |
| e-posta doğrulama | posta kutusu **6 haneli bir kod** taşır; bu kod `POST /verify-email` adresine gönderilir (yeniden gönderim `POST /verify-email/resend` üzerinden yapılır), `/dashboard` gerçek sayfaya dönüşür |
| anahtar oluşturma | `POST /dashboard/api-keys` — düz metin anahtar bir kez döner |
| canlı kanıt | `POST /v1/chat/completions` — `keys.txt` dosyasına yazmadan önce **her** anahtar için çalıştırılır |
| sohbet kontrolünü geçemeyen bir anahtar | asla yazılmaz — hesap `accounts.json` içinde kurtarılabilir durumda kalır |

## 🧭 Nasıl çalışır

```
gelen kutusu (her hesap için bir adres)                                  her hesap için yeni bir adres
   │
   ├─▶ kayıt: Radox AI sayfası → e-posta adresi → gelen kutusundan gelen kod / bağlantı
   ├─▶ oturum: hesabın çerezleri veya erişim jetonu elde edilir
   ├─▶ anahtar basımı: hesabın anahtar uç noktası → düz metin anahtar bir kez döner (derhal diske yazılır)
   └─▶ canlı kanıt: POST https://radoxai.com/v1/chat/completions → gerçek içerik = anahtar aktiftir
```

| Adım | Çağrı | Notlar |
| --- | --- | --- |
| kayıt | `POST /register` | Laravel form gönderisi, sayfanın `_token` değeri ile birlikte |
| doğrulama | `POST /verify-email` | posta kutusundan gelen 6 haneli kod |
| anahtar | `POST /dashboard/api-keys` | düz metin anahtar bir kez döner |
| kontrol | `POST /v1/chat/completions` | `keys.txt` yazmadan önce canlı 200 yanıtı gerekir |

## ⚙️ CLI seçenekleri

```bash
node src/cli.js --count N        # bas (varsayılan 50)
node src/cli.js --verify-only    # keys.txt içindeki her anahtarı canlı bir sohbet çağrısıyla yeniden kontrol et
node src/cli.js --help
```

| Ortam değişkeni | Varsayılan | Anlamı |
| --- | --- | --- |
| `RADOX_PROXIES` | `proxies.txt` | havuz dosyası, satır başı bir vekil sunucu |

## 🛰️ Bir vekil sunucunun arkasında

Her istek, havuzunuzdaki bir vekil sunucu satırı üzerinden çıkar; başarısız bir çıkış o denemeyi sonlandırır ve araç bir sonrakine geçer — hesap kendi IP'nizden değil, yeni bir çıkış üzerinden yeniden denenir.

## 📄 Dosyalar

| Yol | İçerik |
| --- | --- |
| `keys.txt` | satır başı bir canlı doğrulanmış anahtar — git tarafından yok sayılır |
| `accounts.json` | her hesap için e-posta / şifre / anahtar / sohbet durumu |
| `proxies.txt` | çıkışlarınız, satır başı bir tane — git tarafından yok sayılır |
| `outputs/` | çalışma durumu — git tarafından yok sayılır |

## 🔌 9Router'e bağlanma

[9Router](https://9router.com), kendi sunucunuza kurulabilir, OpenAI ile uyumlu bir yönlendiricidir. Bu sağlayıcıyı bir kez kaydettikten sonra her anahtar, bir sağlayıcı düğümü altında bir bağlantı haline gelir:

```bash
node src/connect-9router.js
# veya: npm run 9router
```

Varsayılanlar: `--base http://localhost:20128`, `--password 123456`, `--name "Radox"`, `--prefix radox`, `--base-url https://radoxai.com/v1`. Modeller daha sonra `radox/<model kimliği>` olarak sunulur ve tüm anahtarlar arasında yük dengeli dağıtılır.

## 🔑 Bir anahtarın size kazandırdığı

| | |
| --- | --- |
| 🏢 Sağlayıcı | **Radox AI** — [radoxai.com](https://radoxai.com) |
| 🎁 Sağlayıcının verdiği | ücretsiz katman, anahtar başına bir hesap — her anahtar 33 modelde canlı sohbet doğrulamasından geçirilir |
| 🔑 Bir anahtarın size kazandırdığı | kendi hesabına özgü bir API anahtarı: aşağıdaki uç noktadaki 33 model kimliği, planınızın sınırları dahilinde. Kotanın sahibi **hesaptır**, bu yüzden bu araç her anahtar için ayrı bir hesap oluşturur |
| 🌐 API şekli | OpenAI ile uyumlu: `POST https://radoxai.com/v1/chat/completions` |
| 🔒 Verileriniz | yalnızca radoxai.com ve yapılandırdığınız gelen kutusu arka ucuyla iletişim kurulur; anahtarlar makinenizde kalır |

## 🐞 Sorunlar

Radox kaydolma şeklini veya kotasını değiştirirse, araç o adımda durur ve bunu söyler. Çalıştırdığınız komutu ve tam çıktıyı içeren bir **[sorun açın](../../issues)**; PR'ler memnuniyetle karşılanır.

## 📄 Lisans

MIT © 2026 — [Lisans](LICENSE) dosyasına bakın.

<div align="center">

**[MIT](LICENSE)** © 2026 radox-bulk-apikey katkıda bulunanlar

</div>

## ⚡ Çalışma şekli (ön ayarlar)

`--preset=turbo|balanced|safe` çalışan sayısı + hesaplar arası duraklamayı ayarlar (turbo = 5,
dengeli = 4, güvenli = 2); açık `--conc`/`--gap` (veya depo içindeki kendi bayraklarınız) her zaman önceliklidir,
ve `--preset` olmadan araç tarihsel şeklini tam olarak korur.

Turbo önerilir (5 işçi); daha fazlası zayıf bilgisayarda yük/ban riski.