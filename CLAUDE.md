# Öğretmen Yaver — V1.5 (Konsolide)

> **Tek kaynak: `PLAN.md`** — ürün, mimari, yol haritası; fazlar/şema/timeline dahil. Çakışmada PLAN.md kazanır.
> Tarihsel referans (bağlayıcı değil): `archive/SPEC_FULL.md`, `archive/PRD.md`, `archive/STRATEJI_V2.md`.

**Ürün:** Öğretmenin zihinsel yükünü alan asistan. "Yaver hazırlar, sen öğretirsin." Dört sütun: defter görünümü · çalışma yaprağı/etkinlik · sınav analizi · resmi evrak.

**Mimari ilke:** Marjinal maliyet ≈ 0 → her özellik ya deterministik/offline ya da önceden üretilmiş havuzdan. Kullanıcı-başına canlı AI yok (lifetime için zorunlu).

---

## DAVRANIŞSAL KURALLAR

- Kodlamadan önce varsayımları açıkla, belirsizse sor.
- İstenenin ötesine geçme — ekstra özellik, abstraction, hata yönetimi ekleme.
- Sadece değiştirmen gereken şeye dokun. Komşu kodu "iyileştirme".
- Her değişiklik kullanıcı isteğine doğrudan bağlanabilmeli.

---

## STACk

- **Frontend:** Expo (React Native) + TypeScript
- **Stil:** StyleSheet — NativeWind yok, custom tokenlar (`src/tokens/`)
- **Animasyon:** react-native-reanimated
- **Backend:** Supabase (Postgres + Auth + Edge Functions)
- **AI:** Claude API (Haiku = sorular, Sonnet = diğer tipler)
- **Build:** EAS Build (Android/iOS)

---

## DESIGN SYSTEM

**Kaynak:** `design_handoff_yaver_v1/` klasörü — PNG mockup'lar. Kod bu mockup'lara göre yazılır.

**Tokenlar** (`src/tokens/`):
```
colors.bg       #F7F5F2   ekran zemini (krem)
colors.surface  #FFFFFF   kart yüzeyi
colors.accent   #2563EB   mavi — butonlar, seçili state, vurgu
colors.text1    #1A1A1A   birincil metin
colors.text2    #6B6B6B   ikincil metin
colors.text3    #B8B8B8   metadata/muted
colors.border   #EBEBEB   kart borderleri
colors.success  #2D7A50   hazır state
fonts.*         Plus Jakarta Sans (regular/medium/semiBold/bold/extraBold/italic)
```

**UI kuralları:**
- Saf beyaz (`#FFFFFF`) ekran zemini asla — sadece kart yüzeyi
- Accent rengi: CTA butonları + seçili state + vurgu metin
- Primary CTA: `colors.text1` (siyah pill) — onboarding geçişleri için
- Secondary CTA: `colors.accent` (mavi) — "Benim yerime hazırla" gibi aksiyonlar
- Card: beyaz, `borderWidth: 1`, `borderColor: colors.border`, shadow opsiyonel
- Seçili kart: accent border (`1.5px`) + `accentLt` fill
- Emoji UI'da yok (ikon emojiler hariç — branş ikonları Supabase'den geliyor)

**Mikro dil:**
| Kullanma | Kullan |
|---|---|
| "Üret" | "Hazırla" |
| "Generate" | "Benim yerime hazırla" |
| "İndir" | "Yazdırmaya hazır indir" |
| "Kaydet" | (otomatik, sadece toast) |

---

## NAVİGASYON (4 tab)

| Tab | Ekran |
|---|---|
| Bu Hafta | Defter görünümü (kazanım kartları) + bugün vurgusu |
| Plan | Yıllık plan (dönem→ay→hafta) + Hafta Detayı |
| Hazırla | Çalışma yaprağı/etkinlik (havuzdan) + Sınav akışı |
| Evrak | Resmi evraklar + sınav analizi çıktısı + arşiv |

**Stack ekranlar:** Uretim, Cikti, HaftaDetayi, SablonDoldurma, OkulBilgileri, DersProgrami, SinavDagilim, SinavAnaliz

> Ekran→tab geçiş haritası: `PLAN.md` §6.

---

## TEKNİK KURALLAR

**K5 — Git disiplini:**
- Feature branch: `feature/[ekran]-[açıklama]`
- Main'e direkt push yok

**K6 — Version pinning:**
- `package.json`'da exact version (caret `^` kullanma)
- `package-lock.json` commit edilmeli

**K7 — Destructive koruma:**
- DROP/DELETE/TRUNCATE/rm -rf → önce sor
- Supabase: migration öncesi snapshot al
- Claude Code asla production'a direkt bağlanmamalı

**Expo/RN notlar:**
- `newArchEnabled: false` — Expo Go SDK 54 uyumluluğu için
- `babel.config.js`'de `react-native-reanimated/plugin` var
- Metro: `npx expo start --go --clear`
- URL polyfill: `index.ts`'de `import 'react-native-url-polyfill/auto'` var

---

## EKRAN LİSTESİ

| # | Ekran | Dosya |
|---|---|---|
| S1 | Welcome | `screens/onboarding/WelcomeScreen.tsx` |
| S2 | Branş Seçimi | `screens/onboarding/BransScreen.tsx` |
| S3 | Sınıf Seçimi | `screens/onboarding/SinifScreen.tsx` |
| S4 | Loading | `screens/onboarding/LoadingScreen.tsx` |
| S5 | Wow Moment | `screens/onboarding/WowMomentScreen.tsx` |
| S6 | Planım | `screens/main/PlanimScreen.tsx` |
| S7 | Hafta Detayı | `screens/main/HaftaDetayiScreen.tsx` |
| S8 | Üretim Ekranı | `screens/main/UretimScreen.tsx` |
| S9 | Çıktı Önizleme | `screens/main/CiktiScreen.tsx` |
| S11 | Ders İçin | `screens/main/DersIcinScreen.tsx` |
| S12 | Evraklarım | `screens/main/EvraklarimScreen.tsx` |
| S13 | Şablon Doldurma | `screens/main/SablonDoldurmaScreen.tsx` |
| S14 | Profil | `screens/main/ProfilScreen.tsx` |

---

## HAFIZA SİSTEMİ

**Dosyalar:**
- `PLAN.md` — ürün + mimari + yol haritası + uygulama (faz/şema/timeline) (TEK KAYNAK, çakışmada kazanır)
- `CLAUDE.md` — bu dosya (davranış + teknik kurallar)
- `STATUS.md` — nerede kaldık, sıradaki adımlar
- `DECISIONS.md` — karar günlüğü (append-only)
- `archive/` → `SPEC_FULL.md`, `PRD.md`, `STRATEJI_V2.md` — tarihsel arşiv (bağlayıcı değil)

**Oturum başı:** Kullanıcı "nerede kaldık" / "devam edelim" yazarsa → `STATUS.md` + `DECISIONS.md` oku, özet ver.

**Oturum sonu:** "kaydet" denildiğinde → `STATUS.md` güncelle, önemli karar varsa `DECISIONS.md`'ye ekle.

---

## KRİTİK UX İLKELERİ

1. Context'in olduğu yerde aksiyon var
2. Plan = canlı omurga
3. Eksik göze çarpar, hazır geri çekilir
4. Yaver yazar, öğretmen onaylar
5. Aha anına kadar sıfır engel
6. Akıllı varsayılanlar her yerde
7. Asistan, araç değil — proaktif, hafızalı
