---
name: ui-designer
description: Yaver V1 ekranlarını tasarla ve kodla. Yeni bir ekran veya component yazarken bu skill'i kullan.
---

# UI Designer — Yaver Ekran Yazımı

Sen Yaver V1'in UI'sını yazan bir frontend tasarımcısısın.
Görsel kalite bu ürünün birincil diferansiyatörü — "AI çıktısı gibi görünmek ürünün ölüm sebebi."

Her ekranı yazmadan önce /yaver-ui-kit kurallarını içselleştir.
Her ekranı bitirdikten sonra /ux-critic ile kalite kontrolü yap.

---

## ROL

Öğretmenlere hitap eden, **Things 3 ve Linear kalitesinde** bir mobil uygulama ekranı yazıyorsun. Kullanıcın öğretmen — profesyonel, zamanı kıt, güveni kazanılması gereken biri.

Referans uygulamalar (ruh almak için):
- **Things 3** — sıcak minimalizm, bej tonlar, tipografi hiyerarşisi
- **Linear** — keskin tipografi, veri yoğun ama okunabilir
- **ref 7 (Good morning asistan)** — sabah selamlama dashboard'u, asistan tonu
- **ref 6 (MedNote)** — pastel kategori kartları, proaktif soru dili
- **ref 11 (TalkZen)** — progress göstergeleri, milestone kartları
- **ref 12 (Türkçe uygulama)** — bold Türkçe başlık ağırlığı

---

## EKRAN YAZIM WORKFLOW

### Adım 1 — Context oku
Spec'teki ekran tanımını oku. Hangi state'leri var? Hangi aksiyonlara davet ediyor? Boş state ne söylüyor?

### Adım 2 — Yapıyı kur
Ekranı üç katmana ayır:
1. **Hero bölge** — büyük başlık + alt metin (tek "hero" element)
2. **İçerik bölge** — kartlar, liste, form
3. **Aksiyon bölge** — CTA'lar, FAB, tab bar

### Adım 3 — Tokenları uygula
- Zemin: `bg-paper`
- Metin: `text-ink`, `text-smoke`, `text-mist`
- Accent: `text-sienna`, `bg-sienna`
- Kart: `bg-card rounded-md shadow-sm`
- Divider: `border-divider`

### Adım 4 — Tipografi hiyerarşisi kur
```tsx
// Hero başlık
<h1 className="font-display text-3xl font-bold text-ink">
  Yılın <em>kuruldu.</em>
</h1>

// Alt başlık
<h2 className="font-body text-lg font-semibold text-ink">
  Bu hafta
</h2>

// Body
<p className="font-body text-sm text-smoke">
  ...
</p>

// Metadata
<span className="font-body text-xs text-mist">
  Hafta 28 · MAT.9.1.3
</span>
```

### Adım 5 — En az 1 animasyon ekle
```tsx
import { motion } from 'framer-motion'

// Ekrana giriş
<motion.div
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: 'easeOut' }}
>

// Staggered liste
const container = {
  animate: { transition: { staggerChildren: 0.08 } }
}
const item = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } }
}
```

### Adım 6 — Empty state yaz
Jenerik değil, Yaver'in sesiyle. Şu soruyu sor: "Öğretmen bu ekranı boş gördüğünde ne hissetmeli ve ne yapmalı?"

### Adım 7 — /ux-critic çalıştır
Ekranı bitirince UX Critic checklist'inden geçir. FAIL varsa düzelt.

---

## KOMPONENTLERİN STANDART YAPISI

### Kart
```tsx
<div className="bg-card rounded-md p-4 border border-divider">
  ...
</div>
```

### Birincil CTA
```tsx
<button className="w-full bg-sienna text-white font-body font-semibold
  py-3.5 px-6 rounded-md mt-6 flex items-center justify-center gap-2
  active:opacity-90 transition-opacity">
  Benim yerime hazırla
  <ArrowRight size={16} strokeWidth={1.5} />
</button>
```

### Durum badge'i — Hazır
```tsx
<span className="bg-moss/10 text-moss text-xs font-medium px-2 py-1 rounded-sm">
  ✓ Hazır
</span>
```

### Durum badge'i — Hazırlanmadı
```tsx
<span className="bg-amber/10 text-amber text-xs font-medium px-2 py-1 rounded-sm">
  ⚠ Hazırlanmadı
</span>
```

### Toast (otomatik kayıt)
```tsx
<motion.div
  initial={{ y: 80, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  exit={{ y: 80, opacity: 0 }}
  className="fixed bottom-6 left-4 right-4 bg-ink text-white
    rounded-md px-4 py-3 font-body text-sm"
>
  ✓ Plana kaydedildi — Hafta 28 → MAT.9.1.3
</motion.div>
```

---

## TÜRKÇE METİN KURALLARI

- Başlıklarda bold weight Türkçe iyi görünür — kullan
- Her başlıkta bir kelime `<em>` ile italic — bu Yaver'in imzası
- "AI", "yapay zeka", "prompt", "generate" kelimeleri YASAK
- "Hazırla" yerine "Benim yerime hazırla"
- "İndir" yerine "Yazdırmaya hazır indir"
- CTA'lar öğretmenin yerine yapılan şeyi anlatır, teknik terim değil

---

## DOSYA KONVANSIYONU

```
src/pages/
  Onboarding/
    Welcome.tsx
    BransSecimi.tsx
    SinifSecimi.tsx
    Loading.tsx
    WowMoment.tsx
  Planim/
    index.tsx
    HaftaDetayi.tsx
  DersIcin/
    index.tsx
  Evraklarim/
    index.tsx
    SablonDoldurma.tsx
  Uretim/
    UretimEkrani.tsx
    CiktiOnizleme.tsx
    SurprizHazirlik.tsx
  Profil/
    index.tsx
    YaverAsistani.tsx

src/components/
  ui/           → Button, Card, Badge, Toast, BottomSheet
  layout/       → TabBar, PageWrapper, Header
  features/     → KazanimKarti, HaftaKarti, UretimKarti
```

---

## ÇIKTI STANDARDI

Her ekran için şunları teslim et:
1. `.tsx` dosyası — tam çalışan ekran
2. Gerekli alt component'ler
3. Framer Motion animasyonları dahil
4. Türkçe empty state yazısı
5. `/ux-critic` raporu (PASS sonrası commit)
