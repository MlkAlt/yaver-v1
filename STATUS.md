# Yaver V1 — Proje Durumu

**Son güncelleme:** 26.05.2026 — Oturum 45

## Şu An Ne Yapıyoruz
**Oturum 45.** MEB Türkiye Yüzyılı Maarif Modeli 2025 büyük müfredat re-seed TAMAMLANDI.
- Tüm migration'lar (030-034) uygulandı. DB'de **5.685 kazanım**.
- `feature/mufredat-buyuk-duzeltme` branch'i push'lu, PR henüz açılmadı.

### Sonraki oturumda devam edilecek (sıralı)
1. **PR'ı aç** — tarayıcıdan: https://github.com/MlkAlt/yaver-v1/pull/new/feature/mufredat-buyuk-duzeltme
2. **EAS build** (production APK) → Google Play test track upload
3. **V1.5'e ertelendi** (DECISIONS güncel):
   - 8 İHL JSON dosyasında sinif alanı düzeltmesi
   - Almanca/Fransızca lise seed
   - Teknoloji ve Tasarım kademe düzeltme
   - secmeliDersler.ts uyarı düzeltmeleri (DKAB lise+ihl, Almanca ortaokul iho, Hüsnühat yazım)

### Kritik audit aracı
`scripts/audit-mufredat.cjs` — Supabase'den canlı sayım:
`NODE_TLS_REJECT_UNAUTHORIZED=0 node scripts/audit-mufredat.cjs`

## Tamamlananlar

### Expo Go testleri (Oturum 44 — tümü geçti ✓)
- Sınıf Öğretmenliği → 4 sınıf + tüm dersler → 267 kazanım, haftada tüm dersler dağılıyor ✓
- İHL Meslek Dersleri → Lise 9-12 → Fıkıh/Hadis/Siyer plana giriyor ✓
- Sosyal Bilgiler 8. sınıf → T.C. İnkılap Tarihi 41 kazanım plana giriyor ✓

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
- [x] **Kazanımlar: 5.685 toplam** — Migration 030-034, Oturum 44-45
- [x] **Migration 000031**: ders_turu sütunu (zorunlu/secmeli) eklendi, backfill tamamlandı ✅ — Oturum 45
- [x] **Migration 000032**: Lise Grup 1 kazanımları — 17 ders, 1.614 kazanım (9-12. sınıf zorunlu + seçmeli) ✅ — Oturum 45
- [x] **Migration 000033**: Lise Grup 2 seçmeli dersler — 8 ders, 162 kazanım (Psikoloji/Mantık/Çağdaş Türk/Astronomi/İklim/Sağlık/Mat Uyg/Sosyal Bil Çalışmaları) ✅ — Oturum 45
- [x] **Migration 000034**: TDE (Türk Dili ve Edebiyatı) lise 9-12 — 245 kazanım, 4 tema × 12-16 çıktı, synthetic TDE.{sinif}.T{tema}.{grup}.{no} kodlar ✅ — Oturum 45
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
- [x] **Migration 000029**: Beden Eğitimi ilkokul ders adı `'Beden Eğitimi ve Spor'` → `'Beden Eğitimi ve Oyun'` (mig 023 backfill hatası) ✅ — Oturum 44
- [x] **Migration 000030**: Tam re-seed — MEB Türkiye Yüzyılı Maarif Modeli 2025, 24 JSON dosyası, 3.518 kazanım (15 branş). İlkokul + ortaokul + iho eski veri temizlendi. ✅ — Oturum 44
- [x] **secmeliDersler.ts JSON karşılaştırması**: teknoloji_tasarim [7,8], beden_egitimi (Sağlık Bilgisi), gorsel_sanatlar (Hüsn-i Hat+Ebru İHL), muzik (Dini Musiki İHL) ✅ — Oturum 38
- [x] Edge Function: generate (Deno, cache-first) — deploy + test edildi ✅
- [x] Soru üretimi telefonda çalıştı ✅

### planUret algoritması
- [x] **Range dağıtım:** Haftada 1 kazanım → haftada N/aktifHafta kazanım (tüm kazanımlar yıla dağılır) ✅
  - Fizik/Kimya/Biyoloji: haftada ~1 | TDE: haftada 2-3 | İngilizce/Türkçe: haftada 5-7
- [x] **byGroup dağıtım:** (sinif, ders) çifti bazında gruplama — her haftada tüm derslerden kazanım çıkar ✅ — Oturum 44
- [x] **İngilizce cap (multi-ders mod):** Sınıf Öğretmenliği gibi çok-ders modunda sınıf başına 20 İngilizce kazanım ile sınırlı ✅ — Oturum 44

## Sonraki Adımlar (öncelik sırasıyla)
1. **PR'ı aç** — tarayıcıdan: https://github.com/MlkAlt/yaver-v1/pull/new/feature/mufredat-buyuk-duzeltme
2. **V1.5 uyarı/bilgi düzeltmeleri** (ertelendi):
   - Almanca ortaokul için iho kademe ekleme
   - DKAB lise satırı için ihl ekleme (secmeliDersler.ts)
   - Hüsn-i Hat → Hüsnühat yazım standardı
   - Teknoloji ve Tasarım kademe düzeltme (5-6 çıkar, sadece 7-8)
   - Yanlış sinifli İHL JSON'ları (Dini Musiki, Ebru, Hüsnühat, Tezhip, İslam Felsefesi, İslam'da Çocuk Eğitimi, Tasavvuf Kültürü, Din Eğitimi)
   - Trafik Güvenliği (4. sınıf) MEB kazanımları
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
