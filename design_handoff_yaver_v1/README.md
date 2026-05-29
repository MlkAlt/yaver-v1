# Yaver V1 — Developer Handoff
> Bu doküman, Claude Code / VS Code ortamında Yaver uygulamasını geliştiren developer için hazırlanmıştır.
> Bundled HTML dosyaları **tasarım referansıdır** — production'a doğrudan kopyalanmaz; hedef framework'te (React Native, Flutter, vb.) yeniden implement edilir.

---

## Fidelity
**High-Fidelity.** Renkler, tipografi, spacing, etkileşimler ve animasyonlar finaldir. Piksel-perfect uygulama beklenmektedir.

---

## Tech Stack Önerisi
- **React Native** (Expo) — Android-first, PWA hedefi sonrası
- **Navigation:** React Navigation v6 (Stack + Bottom Tabs)
- **State:** Zustand veya Context API
- **Animasyon:** React Native Reanimated v3
- **İkonlar:** Lucide React Native
- **Font:** `@expo-google-fonts/plus-jakarta-sans`

---

## Design Tokens

### Renkler
```ts
// colors.ts
export const colors = {
  // Backgrounds
  bg:         'oklch(97.5% 0.012 75)',  // ≈ #F7F5F2 — sıcak krem, asla saf beyaz
  surface:    '#FFFFFF',

  // Accent (İndigo — kullanıcı seçimi)
  accent:     'oklch(62% 0.22 255)',    // ≈ #4F6DE8
  accentLt:   'oklch(96.5% 0.055 277)',// ≈ #EEF0FD — accent tint
  accentMd:   'oklch(92% 0.09 267)',   // ≈ #D8DDFB — accent mid

  // Semantic
  success:    'oklch(52% 0.17 152)',   // ≈ #2D7A50 — yeşil
  successLt:  'oklch(96% 0.05 152)',   // ≈ #E8F5EE
  warning:    'oklch(62% 0.22 255)',   // accent ile aynı (⚠ state'leri)
  warningLt:  'oklch(96.5% 0.055 277)',

  // Metin
  text1:      '#1A1A1A',  // başlıklar, birincil içerik
  text2:      '#6B6B6B',  // ikincil metin
  text3:      '#B8B8B8',  // placeholder, etiket, devre dışı

  // Sınır & ayırıcı
  border:     '#EBEBEB',

  // Özel badge renkler
  surprise:   { bg: 'oklch(96% 0.05 300)', text: 'oklch(55% 0.18 300)' }, // mor
  auto:       { bg: 'oklch(96% 0.04 240)', text: 'oklch(55% 0.14 240)' }, // mavi
};
```

### Tipografi
```ts
// typography.ts
// Font: Plus Jakarta Sans (Google Fonts)
export const typography = {
  display:  { fontSize: 30, fontWeight: '800', letterSpacing: -0.5, lineHeight: 36 },
  h1:       { fontSize: 24, fontWeight: '800', letterSpacing: -0.3, lineHeight: 30 },
  h2:       { fontSize: 20, fontWeight: '700', letterSpacing: -0.2, lineHeight: 26 },
  h3:       { fontSize: 16, fontWeight: '700', letterSpacing: -0.1, lineHeight: 22 },
  body:     { fontSize: 15, fontWeight: '500', lineHeight: 22 },
  bodySmall:{ fontSize: 13, fontWeight: '500', lineHeight: 18 },
  label:    { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' },
  caption:  { fontSize: 12, fontWeight: '500', lineHeight: 16 },
};
```

### Spacing & Radius
```ts
// spacing.ts
export const spacing = {
  xs: 4, sm: 8, md: 12, base: 16, lg: 20, xl: 24, xxl: 32,
};

export const radius = {
  sm:   10,
  md:   14,
  card: 18,  // tüm kartlar
  btn:  100, // pill butonlar
  icon: 12,  // ikon kutuları
};
```

### Gölgeler
```ts
export const shadows = {
  card: {
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 16, elevation: 3,
  },
  cardMd: {
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10, shadowRadius: 28, elevation: 8,
  },
};
```

---

## Ekranlar

### S1 · Welcome
**Amaç:** İlk izlenim, tek CTA.
- Full-screen krem bg (`colors.bg`)
- Üst sol: logo mark — siyah 38×38px, 12px radius kare, beyaz "Y" harfi
- Merkez: illüstrasyon alanı 280×260px, 32px radius, accent-lt → yeşil-lt gradient. **Real asset bekleniyor.**
- Alt: display başlık `"Merhaba,\nöğretmenim."` — ikinci satır accent renk
- Tagline: body tipografi, text2
- CTA: siyah pill buton `"Başlayalım →"` (full width)
- Ghost link: `"Giriş yap"` (text2, centered)
- **Nav bar yok.**

### S2 · Branş Seçimi
**Amaç:** Tek seçimli branş grid'i.
- Beyaz bg, 3 sütun grid (gap 10px)
- Üst: progress bar (accent, 3px yükseklik, 25% dolu)
- Arama inputu: krem bg, border, 🔍 ikon solda
- Kart boyutu: 40×40px icon kutu (12px radius) + branş adı
- **Seçili state:** accent border (2px), accent-lt bg, icon kutu accent bg + beyaz ikon
- **Seçilmemiş:** border rengi, krem bg
- "Devam →" pill CTA altta

### S3 · Sınıf Seçimi
**Amaç:** Multi-select sınıf + şube bilgisi.
- `"Hepsine giriyorum"` shortcut: dashed accent border, accent-lt bg, sol tarafta accent check dairesi
- 2×2 grid sınıf kartları (9/10/11/12): seçili = accent renk + sağ üstte beyaz ✓ dairesi
- Seçili sınıflar için şube inputları: krem bg, leading sınıf numarası (accent-lt kutu)
- `"Yılımı kur ✨"` pill CTA

### S4 · Loading
**Amaç:** 4 adımlı dramatik bekleme (~4 sn).
- Krem bg, merkez hizalı layout
- 200×200px animasyon alanı: conic-gradient + merkez ikon (geliştirici Lottie ekleyebilir)
- 4 step listesi: tamamlanan = accent daire + ✓, aktif = accent-lt daire + accent kenarlık, bekleyen = gri
- Progress bar (accent fill, animasyonlu genişleme)
- **Geçiş otomatik** — kullanıcı action'ı yok

### S5 · Wow Moment
**Amaç:** Dopamine anı — stat kartları sırayla girer.
- Beyaz bg
- Yeşil-lt `"✓ Tamamlandı"` pill badge (centered)
- `"Yılın kuruldu."` display başlık
- **3 stat kartı (staggered, 200ms ara):**
  - Krem bg, 20px radius, yumuşak shadow
  - Büyük sayı (36px, 800 weight): hafta=accent, kazanım=indigo, sınıf=yeşil
  - Sayılar count-up animasyonu ile girer (useCountUp hook)
- Yıl progress bar (3% dolu = başlangıç)
- 4 hafta preview: her biri krem kart, sol tarafta hafta numarası (accent-lt kutu)
- `"✨ Yaver..."` teaser kart: accent-lt → yeşil-lt gradient
- Siyah pill CTA

### S6 · Planım (Ray Varyasyonu)
**Amaç:** Yıl takvimine genel bakış, bugün + gelecek haftalar.
- Krem bg, nav aktif: Planım
- **Greeting:** `"Merhaba, [İsim] 👋"` (h1), altında tarih (caption, text2)
- **Bugün özet kartı:** beyaz kart, "BUGÜN" label + ders sayısı + StatusBadge, her ders satırında StatusBadge
- **Ray timeline:**
  - Dikey çizgi: 2px wide, geçmiş=border rengi, şimdiki=accent→border gradient, gelecek=border
  - Nokta boyutları: geçmiş=14px gri, gelecek=14px outline, şimdiki=20px accent + 4px accent-lt ring
  - **Şimdiki hafta expanded kart:** accent border (2px), accent header bg + beyaz metin, her kazanım için sub-kart
  - Sub-kart: hazırlanmadı=bg rengi + accent left border, hazır=success-lt bg + success border
  - "Benim yerime hazırla →" accent pill CTA kazanım kartının içinde
  - Geçmiş/gelecek: sadece tek satır metin, opacity farklı
- FAB: siyah, 56×56px, 16px radius, sağ alt (+)

### S7 · Hafta Detayı
**Amaç:** Hafta kazanımlarını sınıfa göre gruplu göster.
- Beyaz bg, back navigation
- Üstte tarih chip + StatusBadge satırı
- **Gruplar:** her sınıf için SLabel başlığı
- **Kazanım kartı:**
  - Hazırlanmadı: 2px accent border, normal bg; içinde kod + başlık + StatusBadge
  - Hazır: 1.5px success border, success-lt bg; altında detay satırı (12px, text2)
  - Hazırlanmadı kartında: "Benim yerime hazırla →" accent pill CTA (full width, kart içi)
- Altta "Bu haftayı toplu hazırla" tinted kart

### S8 · Üretim Ekranı
**Amaç:** İçerik tipi + parametreler seçimi.
- Beyaz bg
- **Bağlam kartı:** accent-lt bg, border yok, shadow yok; "Kazanım / Sınıf / Süre" satırları; "✏ Düzenle" accent link sağ üst
- **Tip seçici 2×2 grid:**
  - Seçili: siyah bg, beyaz metin
  - Seçilmemiş: krem bg, border
- **Sorular ayarları** (sadece "Sorular" seçiliyken görünür): soru sayısı chips, zorluk chips, tip chips
  - Aktif chip: siyah bg + beyaz metin
- Siyah pill CTA: "Benim yerime hazırla →"

### S9 · Çıktı Önizleme
**Amaç:** Üretilen içeriği gözden geçir + aksiyon al.
- Beyaz bg
- Üst: kazanım kodu + sınıf (label), başlık (h2), hafta badge (success-lt)
- **İçerik preview alanı:** beyaz kart, her soru için: bold başlık + gri placeholder bar + 4 seçenek (A/B/C/D daire + gri bar)
- **Snackbar:** siyah bg, beyaz metin, accent "GÖR" link sağda, 14px radius
- **Aksiyon satırı:** 3 eşit buton — outline "↻ Yeniden", outline "✏ Düzenle", siyah "⬇ İndir"
- **Feedback:** 3 kart (😊/👍/👎) — seçili = accent-lt bg + accent border

### S10 · Sürpriz Hazırlık
**Amaç:** Yaver'in proaktif hazırladığı içerikleri göster.
- Krem bg
- **Bildirim kartı:** beyaz kart, sol tarafta siyah "Y" logo kutu, bildirim metni italik
- Alt bağlam: sınıf + tarih + kazanım kodu (bold)
- **4 içerik kartı:**
  - Normal: beyaz kart, sol ikon kutu (krem bg)
  - Beğenilmiş: success-lt bg + success border, ikon kutu yeşil, sağ üste ✓ badge
  - Her kartta: "Önizle" outline + "Beğendim ✓" dark/outline (beğenilince disabled) + "↻" outline
- **"Hepsini beğendim"** siyah pill CTA (toplu aksiyon)
- 3 emoji feedback butonu: beyaz kart, 48×48px, 14px radius

### S11 · Evraklarım
**Amaç:** Şablon grid + geçmiş evrak listesi.
- Beyaz bg, nav aktif: Evraklarım
- **Şablon grid 2×2:**
  - "Sık kullanılan" şablonlar accent-lt bg + accent-md border + "YENİ" badge (accent bg)
  - Normal: krem bg + border
  - Merkez ikon (28px emoji) + başlık (13px, 700)
- **Geçmiş liste:** her evrak = noBorder kart, başlık + tarih sol, tag badge sağ, "Görüntüle" + "⬇ İndir" action row
- **Empty state kart:** tinted bg, yönlendirici kopya

### S12 · Şablon Doldurma
**Amaç:** Akıllı form — otomatik dolu alanlar + manuel giriş.
- Beyaz bg
- **Otomatik alanlar kartı:** accent-lt bg, "● Otomatik dolu" badge sağ üstte
  - Her alan: 11px label + değer kutusu; oto alanlar yarı saydam beyaz bg + "oto" etiketi
  - Manuel alanlar: beyaz bg, normal border
- **İçerik alanları:** noBorder kart, her alan için krem bg textarea placeholder
- **İmza satırı:** 2 sütun, alt çizgi + rol etiketi
- Siyah pill CTA: "Evrakı oluştur →"

### S13 · Ders İçin
**Amaç:** Üretilen tüm materyallerin zaman gruplu arşivi.
- Krem bg, nav aktif: Ders İçin
- **Filtre chips:** yatay scroll, aktif = siyah bg + beyaz metin
- **Zaman grupları:** "Bu hafta / Geçen hafta / [Ay adı]"
  - Her grup: SLabel + kart listesi
- **Materyal kartı:** başlık (700) + kazanım kodu + tarih (sağ); alt satır = origin badge + "Görüntüle" + "⬇" butonları
- **Origin badge'leri:**
  - 🖐 Manuel: border + text2
  - ✨ Sürpriz: mor-lt bg + mor metin
  - 🌙 Otomatik: mavi-lt bg + mavi metin
- **Empty state:** emoji + açıklayıcı kopya + yönlendirme
- FAB: siyah, sağ alt, + işareti

---

## Bileşen Kütüphanesi

```
components/
├── atoms/
│   ├── HBtn.tsx          — primary / outline / ghost / orange / danger varyantları
│   ├── HCard.tsx         — surface / tinted / warn / ok / noBorder
│   ├── HChip.tsx         — aktif/pasif filter chip
│   ├── StatusBadge.tsx   — todo / ready / surprise / auto
│   ├── SLabel.tsx        — uppercase section header
│   └── HProgress.tsx     — tek renkli progress bar
├── layout/
│   ├── Screen.tsx        — SafeAreaView wrapper + bg color prop
│   ├── StatusBar.tsx     — Android/iOS status bar
│   ├── AppBar.tsx        — back arrow + title + action
│   └── BottomNav.tsx     — 4 tab, aktif = accent pill bg + accent ikon
└── features/
    ├── RayTimeline.tsx   — Planım dikey ray bileşeni
    ├── StatCard.tsx      — Wow Moment count-up kart
    ├── KazanımCard.tsx   — Hafta detayı kazanım kartı
    └── ContentCard.tsx   — Sürpriz materyal kartı
```

---

## Etkileşimler & Animasyonlar

| Bileşen | Animasyon | Süre | Easing |
|---------|-----------|------|--------|
| Wow Moment stat kartları | fadeUp + opacity | 500ms | ease-out, 200ms ara |
| Count-up sayaç | linear increment | 800–1000ms | linear |
| Loading progress bar | width genişleme | 800ms | ease |
| Loading adım state | color + scale | 300ms | ease |
| Chip seçimi | background/color | 150ms | ease |
| Kart seçimi (Branş, Sınıf) | border + bg | 150ms | ease |
| Sürpriz kart beğeni | bg + border | 200ms | ease |
| FAB | shadow pulse | — | idle state |

---

## Navigasyon Akışı

```
Welcome
  └─► BransSecimi
        └─► SinifSecimi
              └─► Loading (otomatik geçiş)
                    └─► WowMoment
                          └─► Planum (Ana ekran)

Planum
  └─► HaftaDetayi
        └─► UretimEkrani
              └─► CiktiOnizleme (modal veya push)

Push Notification
  └─► SurprizHazirlik

BottomNav Tab 3 (Evraklarım)
  └─► SablonDoldurma
        └─► CiktiOnizleme (aynı ekran, farklı içerik)

BottomNav Tab 2 (Ders İçin)
  ├─► CiktiOnizleme (mevcut materyal)
  └─► FAB → UretimEkrani
```

---

## Mikro Kopya Kuralları

| KULLANMA | KULLAN |
|----------|--------|
| "AI / Yapay Zeka" | "Yaver" veya "asistanın" |
| "Hazırla" | "Benim yerime hazırla" |
| "İndir" | "Yazdırmaya hazır indir" |
| "Üye ol" | "Hesap oluştur" |
| "Üret / Generate" | "Hazırla" |
| "Yapay zeka üretti" | "Yaver hazırladı" |

---

## İllüstrasyon Notları
- Welcome, Loading ve Wow Moment ekranlarında **illüstrasyon alanları** placeholder olarak bırakılmıştır
- Önerilen stil: **flat 2D vektör**, warm palette, karakter bazlı (TalkZen / EduBuddy referansı)
- Boyutlar: Welcome hero ≈ 280×260px, Loading ≈ 200×200px, Wow Moment opsiyonel
- Lottie animasyonu Loading ekranında tercih edilir

---

## Referans Dosyalar
```
hifi.html               — Design canvas (13 ekran, interaktif)
hifi-components.jsx     — Shared atoms (HBtn, HCard, StatusBadge vb.)
hifi-screens-a.jsx      — S1–S5: Onboarding + Wow Moment
hifi-screens-b.jsx      — S6–S9: Planım + Hafta + Üretim + Çıktı
hifi-screens-c.jsx      — S10–S13: Sürpriz + Evrak + Ders İçin
wireframes-v2.html      — Wireframe referansı (akış mantığı için)
design-canvas.jsx       — Canvas bileşeni (referans değil)
```

---

## Claude Code için Başlangıç Prompt Önerisi

```
Yaver V1 mobil uygulamasını geliştiriyorum. 
Design handoff klasöründeki README.md'yi oku. 
hifi.html tasarım referansını incele.
React Native (Expo) + TypeScript ile başla.

İlk adım: design tokens dosyalarını oluştur
(colors.ts, typography.ts, spacing.ts)
ve BottomNav + AppBar + HCard + HBtn atom bileşenlerini implement et.
Tasarımı birebir uygula — README'deki token değerlerini kullan.
```
