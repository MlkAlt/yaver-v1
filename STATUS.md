# Yaver V1 — Proje Durumu

**Son güncelleme:** 24.05.2026 — Oturum 43

## Şu An Ne Yapıyoruz
**Oturum 43 kapanış (ara verildi).** Müfredat büyük düzeltme tamamlandı, commit `9417acd`
`feature/mufredat-buyuk-duzeltme` branch'inde, remote'a push'landı. PR açılmadı (gh auth yok).

### Sonraki oturumda devam edilecek (sıralı)
1. **PR'ı aç** — tarayıcıdan: https://github.com/MlkAlt/yaver-v1/pull/new/feature/mufredat-buyuk-duzeltme
   (commit mesajı + DECISIONS.md "2026-05-24 — Müfredat büyük düzeltme" maddesi body için yeterli)
2. **Expo Go testi** — `npx expo start --go --clear`:
   - Sınıf Öğretmenliği → EkDersler: Hayat Bilgisi, İnsan Hakları, Beden Eğitimi ve Oyun seçenekleri var mı?
   - Sınıf Öğretmenliği → Loading → plan oluşurken Hayat Bilgisi kazanımları geliyor mu?
   - İHL Meslek Dersleri branşı seç → Loading → Fıkıh/Hadis/Siyer kazanımları geliyor mu?
   - Sosyal Bilgiler → 8. sınıf → T.C. İnkılap Tarihi 41 kazanım plana giriyor mu?
3. **Task 2** — Eski karar/referans temizliği (DECISIONS.md'deki "bekleyen düzeltmeler" listesi,
   atıl `brans/ogretmen_brans_ders_veritabani.json` durumu, vs.)
4. **Task 3** — Yol haritası: plan → evrak → üretim → gelir → store → pazarlama
5. **Task 4** — PC kapalıyken GitHub-üzerinden çalışma düzeni (GitHub Actions / remote agent)
6. **V1.5'e ertelendi** (DECISIONS güncel):
   - 8 İHL JSON dosyasında sinif alanı düzeltmesi
   - Trafik Güvenliği 4. sınıf MEB'den seed
   - Almanca/Fransızca lise seed
   - Teknoloji ve Tasarım kademe düzeltme
   - secmeliDersler.ts uyarı düzeltmeleri (DKAB lise+ihl, Almanca ortaokul iho, Hüsnühat yazım)

### Kritik audit aracı
`scripts/audit-mufredat.cjs` — Supabase'den canlı sayım. Sonraki oturumda bir migration sonrası
veya bilgi gerektiğinde çalıştır: `NODE_TLS_REJECT_UNAUTHORIZED=0 node scripts/audit-mufredat.cjs`

## Tamamlananlar

### Ekranlar (17/17 aktif)
- [x] S1 Welcome
- [x] S2 Branş Seçimi
- [x] S2b Okul Tipi — migration sonrası aktif (tek kademe branşlarda atlanır)
- [x] S3b Ek Dersler — Sınıf Öğretmenliği için (zorunlu + paylaşımlı dersler)
- [x] S3c Seçmeli Dersler — diğer tüm branşlar için (17 branş, otomatik atlanır seçmeli yoksa, "yakında" notu, T.C. İnkılap Tarihi pre-selected)
- [x] S3 Sınıf Seçimi
- [x] S4 Loading
- [x] S5 Wow Moment
- [x] S6 Ana Sayfa — dashboard (gradient header, bu hafta card, hızlı hazırla, son hazırlananlar)
- [x] S7 Hafta Detayı
- [x] S8 Üretim Ekranı
- [x] S9 Çıktı Önizleme
- [x] S11 Ders İçin — 2×3 tile grid + kazanım picker bottom sheet
- [x] S12 Evraklarım
- [x] S13 Şablon Doldurma
- [x] S14 Profil
- [x] S15 Yaver Asistanı Ayarları
- [x] S16 Yıllık Plan — Dönem→Ay→Hafta 3 seviye hiyerarşi, pill+çizgi ay başlıkları, 36 aktif hafta (MEB PDF ile hizalandı)

### Altyapı
- [x] Expo SDK 54, React Native 0.81.5, TypeScript (0 hata)
- [x] Navigation: Stack + Bottom Tabs (React Navigation v7)
- [x] Design tokens: colors, typography, spacing
- [x] Atom + layout bileşenler, OnboardingContext
- [x] EAS build config (app.json: com.yaver.app, eas.json: preview APK)
- [x] .npmrc: legacy-peer-deps + save-exact
- [x] expo-linear-gradient, phosphor-react-native, @expo/vector-icons
- [x] react-native-worklets 0.5.1, react-native-svg
- [x] **Uygulama telefonda açılıyor** (Expo Go ile) ✅

### Supabase
- [x] Schema + 13 tablo + RLS
- [x] Seed: 21 branş, 41 hafta takvim (36 aktif + 5 tatil, MEB PDF 2025-2026 ile hizalı, Kurban tarihi düzeltildi)
- [x] **Kazanımlar: 3.977 gerçek MEB kazanımı** (24 branş, 1-12. sınıf) — Oturum 43 audit (önceki 5.171 sayımı yanlıştı: mig 018 silmesi sayılmamıştı)
- [x] **Migration 000010**: `kazanimlar.ders` + `kazanimlar.okul_tipi` + `branslar.slug` + `branslar.kademe` ✅
- [x] **Migration 000011**: `kademe` sadeleştirme ✅
- [x] **Migration 000012**: sinif=8 T.C. İnkılap Tarihi → Sosyal Bilgiler branşına taşıma ✅
- [x] **Migration 000013**: Teknoloji ve Tasarım kazanımları (53 kazanım, 7-8. sınıf) ✅ — Oturum 37
- [x] **Migration 000015**: Hayat Bilgisi + Rehber Öğretmen DB'den kaldırıldı ✅ — Oturum 38
- [x] **Migration 000016**: İHL Meslek Dersleri ayrı branş (kazanımlar din_kulturu→ihl_meslek_dersleri taşındı) ✅ — Oturum 39
- [x] **Migration 000018**: Kazanım ünite numarası hatası düzeltme — migration 008'de grade no = unite_no olarak girilmiş ~1.496 yanlış satır silindi (Türkçe 1272, İngilizce 152, Matematik/Arapça/Müzik/BEd/DKAB/Bilişim) ✅ — Oturum 41
- [x] **Migration 000019**: Almanca DE.5.5.%/DE.6.6.% pattern hatası (19 satır) düzeltildi ✅ — Oturum 41
- [x] **Migration 000022**: İHL Meslek Dersleri → Din Kültürü'nün hemen ardına taşındı (sıra 9) ✅ — Oturum 42
- [x] **Migration 000023**: `kazanimlar.ders` + `kazanimlar.okul_tipi` backfill — Migration 008'de NULL kalan ~5.000 satır dolduruldu ✅ — Oturum 42
- [x] **Migration 000024**: Eksik ilkokul kazanımları eklendi — Türkçe 1-2 (20), Müzik 1-4 (16), Görsel Sanatlar 1-4 (16) — toplam 52 yeni kazanım ✅ — Oturum 42
- [x] **Migration 000025**: İHL Meslek Dersleri ilk gerçek seed — 113 kazanım (Akaid, Mesleki Arapça, Fıkıh, Hadis, Siyer, Temel Dini Bilgiler, Peygamberimizin Hayatı) ✅ — Oturum 43
- [x] **Migration 000026**: Hayat Bilgisi branşı + 51 kazanım (1-3. sınıf) geri eklendi (mig 015 silmesi MEB'e aykırıydı) ✅ — Oturum 43
- [x] **Migration 000027**: Sınıf Öğretmenliği sinif=4 İHVD kayıtlarında ders='İnsan Hakları' düzeltmesi ✅ — Oturum 43
- [x] **Migration 000028**: 8. sınıf T.C. İnkılap Tarihi 41 kazanım (Sosyal Bilgiler branşına) ✅ — Oturum 43
- [x] **secmeliDersler.ts JSON karşılaştırması**: teknoloji_tasarim [7,8], beden_egitimi (Sağlık Bilgisi), gorsel_sanatlar (Hüsn-i Hat+Ebru İHL), muzik (Dini Musiki İHL) ✅ — Oturum 38
- [x] Edge Function: generate (Deno, cache-first) — deploy + test edildi ✅
- [x] Soru üretimi telefonda çalıştı ✅

### planUret algoritması
- [x] **Range dağıtım:** Haftada 1 kazanım → haftada N/aktifHafta kazanım (tüm kazanımlar yıla dağılır) ✅
  - Fizik/Kimya/Biyoloji: haftada ~1 | TDE: haftada 2-3 | İngilizce/Türkçe: haftada 5-7

## Sonraki Adımlar (öncelik sırasıyla)
1. **Expo Go testi** (mig 025-028 + DERS_HAVUZU değişikliği sonrası):
   - **Sınıf Öğretmenliği akışı** → EkDersler → seçenekler: Türkçe/Matematik/Hayat Bilgisi/Fen/Sosyal/İnsan Hakları + paylaşımlılar → plana kazanım geliyor mu?
   - **İHL meslek dersleri** branşı → Lise tile → 9-12 sınıf → Fıkıh/Hadis/Siyer kazanımları geliyor mu?
   - **Sosyal Bilgiler 8** → T.C. İnkılap Tarihi 41 kazanım plana giriyor mu?
   - Tarih branşı 9-12 + 12. sınıf "T.C. İnkılap Tarihi ve Atatürkçülük" ayrı görünüyor mu?
2. **Task 1 uyarı/bilgi düzeltmeleri** (Oturum 43 audit ek bulguları):
   - Almanca ortaokul için iho kademe ekleme
   - DKAB lise satırı için ihl ekleme (secmeliDersler.ts)
   - Hüsn-i Hat → Hüsnühat yazım standardı
   - Teknoloji ve Tasarım kademe düzeltme (5-6 çıkar, sadece 7-8)
   - V1.5: yanlış sinifli İHL JSON'larını (Dini Musiki, Ebru, Hüsnühat, Tezhip, İslam Felsefesi, İslam'da Çocuk Eğitimi, Tasavvuf Kültürü, Din Eğitimi) düzelt ve seed et
   - V1.5: Trafik Güvenliği (4. sınıf) için MEB müfredattan kazanımlar oluştur
3. **EAS build** (production APK) → Google Play test track upload

## Onboarding Akış Özeti (Oturum 36)
```
Branş seç → Sınıf seç → [EkDersler | DerslerScreen | skip] → Loading → WowMoment
```
- **Sınıf Öğretmenliği** → EkDersler (zorunlu otomatik, paylaşımlı opsiyonel) — değişmedi
- **Ek ders veya seçmeli olan branşlar** → DerslerScreen (zorunlu toggle + "Seçmeli ders ekle +" bottom sheet)
  - Tarih/12.sınıf: Tarih + T.C. İnkılap Tarihi toggle cards
  - Türkçe: Türkçe (tek zorunlu) + seçmeli bottom sheet
- **Diğerleri** → Loading direkt
- **OkulTipiScreen kaldırıldı** — artık hiçbir branş için gösterilmiyor
- **okulTipi:** tek kademeli branşlarda BransScreen'de set edilir; çok kademeli branşlarda DerslerScreen'de `deriveOkulTipi(siniflar)` ile türetilir
- **dersFiltesi:** DerslerScreen'de set edilir — seçilen zorunlu + seçmeli dersler

## Teknik Notlar
- Tüm ekranlar mock data ile çalışıyor, Supabase bağlantısı yok (planUret bağlı, diğerleri mock)
- Design referansı: `design_handoff_yaver_v1/` klasörü (handoff > CLAUDE.md spec)
  - Font: Plus Jakarta Sans
  - Accent: #2563EB mavi (Ana Sayfa) / #B5481E sienna (onboarding)
  - Surface: #FFFFFF kart, #F7F5F2 krem bg
- 3 branşta lise verisi yok: Almanca, Arapça, Bilişim Teknolojileri
- android.package: com.yaver.app | EAS Owner: melik06s-organization, slug: yaver
- Metro: `npx expo start --go --clear`
- `newArchEnabled: false` kalmalı — Expo Go SDK 54 ile uyumsuz
- `babel.config.js`'de `react-native-reanimated/plugin` var
- Windows Firewall port 8081-8082 açık
- Edge Function `generate` deploy edilmiş, Anthropic API kredisi mevcut ✅
- Kağıt çıktısı formatı (V1.5): AY · HAFTA · DERS SAATİ · ÜNİTE · KONU · KAZANIM tablosu — veri modeli destekliyor
