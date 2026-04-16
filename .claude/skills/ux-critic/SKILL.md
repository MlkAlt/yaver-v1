---
name: ux-critic
description: Yaver ekranlarının kalite kontrolü. Bir ekran bittiğinde çalıştır — spec uyumu, UI kalitesi ve UX ilkelerini kontrol eder.
disable-model-invocation: false
---

# UX Critic — Ekran Kalite Kontrolü

Bir Yaver ekranı tamamlandığında bu checklist'i çalıştır.
Her maddeyi tek tek kontrol et, PASS/FAIL/WARN olarak işaretle.
FAIL olan madde varsa ekrana geri dön, düzelt, tekrar çalıştır.

---

## BÖLÜM 1 — AI Çıktısı Kontrol (Spec G1) 🚫

| # | Kontrol | Sonuç |
|---|---|---|
| 1 | Saf beyaz (#ffffff) arka plan var mı? | FAIL ise değiştir |
| 2 | Inter, Roboto, Arial font kullanılmış mı? | FAIL ise Bricolage/DM Sans'a geç |
| 3 | Mor veya mavi gradient var mı? | FAIL ise kaldır |
| 4 | Her yerde aynı padding/gap var mı? | FAIL ise varyasyon ekle |
| 5 | Lucide `strokeWidth` 2 (default) mi? | FAIL ise 1.5 yap |
| 6 | Her köşede aynı border-radius var mı? | FAIL ise karıştır |
| 7 | Tüm başlıklar aynı weight mi? | FAIL ise hiyerarşi kur |
| 8 | Hard-coded renk değeri var mı? | FAIL ise token kullan |

---

## BÖLÜM 2 — Design Token Uyumu (Spec G4) 🎨

| # | Kontrol | Sonuç |
|---|---|---|
| 9 | Zemin paper (#FAF7F2) mi? | |
| 10 | Birincil metin ink (#1C1B17) mi? | |
| 11 | CTA / vurgu rengi sienna (#B5481E) mi? | |
| 12 | Başarı / hazır durumu moss (#4A5D3A) mi? | |
| 13 | Uyarı / eksik durumu amber (#D97706) mi? | |
| 14 | Fontlar Bricolage (display) + DM Sans (body) mı? | |
| 15 | 70/20/10 renk oranı korunuyor mu? | |

---

## BÖLÜM 3 — Tipografi (Spec G2 + G7) ✍️

| # | Kontrol | Sonuç |
|---|---|---|
| 16 | Ekranın bir "hero" başlığı var mı? | |
| 17 | Hero başlıkta en az bir kelime italic mi? (mikro-imza) | |
| 18 | Metin hiyerarşisi var mı? (ink / smoke / mist) | |
| 19 | Metadata ve yardımcı metinler mist rengiyle mi? | |

---

## BÖLÜM 4 — Animasyon (Spec G5) 🎬

| # | Kontrol | Sonuç |
|---|---|---|
| 20 | Ekranda en az 1 kasıtlı animasyon var mı? | WARN ise ekle |
| 21 | Animasyon süresi 200–400ms arasında mı? | |
| 22 | Framer Motion kullanılıyor mu? (CSS transition değil) | |
| 23 | Her animasyonun bir amacı var mı? (decoration değil) | |

---

## BÖLÜM 5 — Empty State (Spec G6) 📭

| # | Kontrol | Sonuç |
|---|---|---|
| 24 | Bu ekranın empty state'i var mı? | |
| 25 | Empty state jenerik mi? ("Veri yok" gibi) | FAIL ise hikâye yaz |
| 26 | Empty state Yaver'in sesini yansıtıyor mu? | |
| 27 | Empty state bir aksiyona davet ediyor mu? | |

---

## BÖLÜM 6 — UX İlkeleri (Spec J) 🧭

| # | Kontrol | Sonuç |
|---|---|---|
| 28 | Context'in olduğu yerde aksiyon var mı? | |
| 29 | Eksik durum göze çarpıyor, hazır durum geri çekiliyor mu? | |
| 30 | Akıllı varsayılanlar kullanılmış mı? | |
| 31 | Mikro UX dili spec'e uygun mu? ("Hazırla" değil "Benim yerime hazırla") | |
| 32 | Kısayol butonu yok mu? (V1 kuralı) | |
| 33 | Bilgi vermek için değil, aksiyona davet için mi tasarlandı? | |

---

## BÖLÜM 7 — Boşluk ve Detay (Spec G7) 📐

| # | Kontrol | Sonuç |
|---|---|---|
| 34 | Section gap 48px, component gap 16px mi? | |
| 35 | Primary CTA'nın üstünde 24px margin var mı? | |
| 36 | İkon boyutları farklı mı? (check 14px, X 18px, arrow 12px) | |
| 37 | Generous whitespace var mı? Her boşluk dolu değil mi? | |

---

## BÖLÜM 8 — Referans Kalibrasyon (Spec G7) 🎯

Son soru — dürüstçe yanıtla:

> **"Bu ekranı Things 3 veya Linear'ın ekran görüntüleri arasına koysam yakışır mı?"**

**EVET** → ekran onaylandı, commit edilebilir.

**HAYIR** → neyin eksik olduğunu 1-3 maddeyle yaz, düzelt, tekrar kontrol et.

---

## ÖZET RAPOR FORMATI

Kontrolü bitirince şu formatta raporla:

```
## UX Critic Raporu — [Ekran Adı]

PASS: 35/37
FAIL: 2 (madde 1, madde 24)
WARN: 0

### Düzeltilmesi Gerekenler:
- Madde 1: body background #ffffff → bg-paper ile değiştir
- Madde 24: Ekrana giriş animasyonu yok → fade-in + slide ekle

### Kalibrasyon:
Things 3'e koyulsam: EVET ✓

### Karar:
[ONAYLANDI / DÜZELTİLMESİ LAZIM]
```
