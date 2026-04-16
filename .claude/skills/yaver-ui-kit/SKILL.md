---
name: yaver-ui-kit
description: Yaver V1 design system kuralları. Ekran yazarken, component oluştururken veya UI kararı alırken bu skill'i kullan.
---

# Yaver UI Kit — Design System Referansı

Sen Yaver V1'in design system'ini bilen bir referans kaynağısın.
Her ekran, her component bu kurallara uymalı. İstisna yok.

---

## 1. YASAK LİSTE — Bunları asla yapma (Spec G1)

- `Inter`, `Roboto`, `Arial`, `system-ui` font olarak YASAK
- Mor veya mavi gradient + beyaz arka plan YASAK
- Saf beyaz (`#ffffff`) arka plan YASAK — sadece kart yüzeyi olabilir
- Her yerde aynı padding/gap YASAK (monotonluk)
- Lucide ikonları `stroke-width: 2` (default) YASAK — 1.5 kullan
- Her köşe aynı border-radius YASAK — sm/md/lg değiştir
- Her başlık aynı font-weight YASAK — hiyerarşi kur
- "AI", "yapay zeka", "prompt", "generate", "jeton" kelimeleri YASAK
- Hard-coded renk değerleri YASAK — sadece Tailwind tokenları

---

## 2. RENK PALETİ — tailwind.config.js tokenları

```
paper    #FAF7F2   → zemin (cream) — tüm sayfa arka planı
ink      #1C1B17   → birincil metin
smoke    #6B6760   → ikincil metin (opacity 0.7 eşdeğeri)
mist     #9B968D   → üçüncül metin / metadata (opacity 0.5)
sienna   #B5481E   → birincil accent (burnt sienna) — CTA, vurgu
moss     #4A5D3A   → başarı / hazır state (yeşil)
amber    #D97706   → uyarı / hazırlanmadı state (turuncu)
card     #FFFFFF   → kart yüzeyi (paper zemin üstünde beyaz kart OK)
divider  #E8E2D5   → bölücü çizgiler
```

**70/20/10 kuralı:**
- %70 nötr (paper + ink + smoke)
- %20 accent (sienna)
- %10 secondary (moss + amber)

**Refs'ten öğrenilen:** ref 7'nin (Good morning asistan) gradient mesh arka planı değil, Yaver'in arka planı paper (#FAF7F2) + noise overlay. ref 6'nın (MedNote) pastel kartlarından ilham al ama Yaver tokenlarına çevir.

---

## 3. TİPOGRAFİ

```
font-display  → Bricolage Grotesque  → başlıklar, hero text
font-body     → DM Sans              → her şey
```

**Hiyerarşi kuralları:**
- Ekranın bir tane "hero" başlığı olur — büyük, display font, bold
- Alt başlıklar body font, medium weight
- Metadata ve secondary text: mist rengi, smaller size
- **Mikro-imza:** Her başlıkta bir kelime italic — bu Yaver'in tipografik karakteri
  - Örn: "Yılın *kuruldu*." / "*Senin* için hazırladım." / "Bu *hafta*"

**Metin opacity katmanları:**
- Önemli: `text-ink` (opacity 1.0)
- Destek: `text-smoke` (opacity ~0.7)
- Metadata: `text-mist` (opacity ~0.5)
- Disabled: opacity 0.3

---

## 4. BORDER RADIUS

```
rounded-sm   8px   → küçük elementler: buton, chip, input
rounded-md   12px  → kartlar
rounded-lg   20px  → bottom sheet, modal, büyük kart
rounded-full 9999px → pill badge, avatar
```

Aynı ekranda farklı radius değerleri kullan — monotonluk kırılır.

---

## 5. BOŞLUK HİYERARŞİSİ (Spec G7)

```
Section gap:    48px  → bölümler arası (büyük nefes)
Component gap:  16px  → component'ler arası
Primary CTA margin-top:   24px  → nefes
Secondary CTA margin-top: 12px  → yakın grup
```

**Boş alanın değeri:** Her boşluğu doldurma. Generous whitespace = premium.

---

## 6. ZEMIN DOKUSU

Body'de noise overlay aktif (index.css'te tanımlı):
```css
body::before {
  background-image: SVG noise;
  mix-blend-mode: multiply;
  opacity: 0.035;
}
```
Bu sayede paper zemin canlı ve dokulu hissettiriyor — refs'teki düz beyaz zemine düşme.

---

## 7. İKON BOYUTLARI (Spec G7)

```
Check ikonu:   14px  (hafif, olumlu)
X (kapat):     18px  (ağır, kararlı)
Arrow (→):     12px  (zarif)
Tab ikonları:  22px
CTA içi ikon:  16px
```

Lucide kullan, ama `strokeWidth={1.5}` — default 2 "AI çıktısı" görünümü.

---

## 8. ANİMASYON KURALLARI (Spec G5 — Framer Motion)

**5 kritik animasyon momenti:**
1. Wow moment stat kartları → staggered giriş (her 80ms)
2. Bugün kartı sabah açılışı → hafif pulse
3. "Plana kaydedildi" toast → alttan slide, 2.5s, yumuşak çıkış
4. Hafta detayı turuncu→yeşil geçişi → 600ms
5. Sürpriz hazırlık ekranı → aşağıdan yukarı + staggered kartlar

**Kurallar:**
```
Süre:   200–400ms arası (daha uzun = yavaş hisseder)
Easing: ease-out veya cubic-bezier(0.2, 0.8, 0.2, 1)
```

Her ekranda en az 1 kasıtlı animasyon olmalı. "Animation for animation's sake" yasak — her animasyonun amacı var.

---

## 9. EMPTY STATE DİLİ (Spec G6)

Her empty state ürünün kişiliğini gösterir. Jenerik yazma.

**Örnekler:**
- Ders İçin boş: *"Henüz hiçbir şey hazırlamadın. Plana git, bir kazanıma 'Benim yerime hazırla' de."*
- Evraklarım boş: *"İlk resmi evrakın henüz yok. Zümre toplantısı yaklaşıyor mu?"* + direkt CTA
- Hafta tamamlandı: *"Bu hafta tamam. Bir sonraki haftaya geç."*

---

## 10. MİKRO UX DİLİ — Kelime Kuralları (Spec G8)

| Kullanma | Bunu kullan |
|---|---|
| "Hazırla" | "Benim yerime hazırla" |
| "İndir" | "Yazdırmaya hazır indir" |
| "Plan oluştur" | "Yılını 30 saniyede kur" |
| "Kaydet" | (otomatik — sadece toast göster) |
| "Üye ol" | "Hesap oluştur" |
| "Hazırladım" | "Senin için hazırladım" |
| "AI/Yapay zeka" | (hiç kullanma) |
| "Üret" | "Hazırla" |

---

## 11. REFS'TEN ÇIKARILAN KALIPLAR

**Kullan:**
- **ref 7 (Good morning asistan):** Günün başındaki büyük selamlama kartı, "Your Assistant" yaklaşımı — Yaver'in Planım dashboard'u için model
- **ref 6 (MedNote):** Pastel renk kodlu program kartları, yatay scroll — Ders İçin filtreleme için model
- **ref 11 (TalkZen):** Progress ring, streak göstergesi, milestone kartları — Hafta Detayı hazırlık oranı için model
- **ref 12 (Türkçe uygulama):** Bold Türkçe başlık hiyerarşisi, dark kart kontrast — Türkçe ekranlarda tip ağırlığı referansı
- **ref 4 (task dashboard):** "X görevin var bu hafta" pattern, renkli durum kartları — Planım için model

**Kullanma:**
- refs 3, 8, 10: mor/mavi AI gradient estetiği
- refs 2, 9: maskot/3D karakter (öğretmene hitap etmiyor)
- refs 2, 3, 5: saf beyaz zemin

---

## 12. KONTROL SORUSU

Her ekranı bitirince sor:
> "Bu ekranı Things 3 veya Linear'ın ana sayfasına koysam yakışır mı?"

HAYIR ise — iter et. EVET ise — /ux-critic çalıştır.
