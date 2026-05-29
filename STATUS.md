# Yaver V1 — Proje Durumu

**Son güncelleme:** 24.05.2026 — Oturum 52

## Şu An Ne Yapıyoruz
**Oturum 52 başladı:** 79 MEB PDF'i sıfırdan re-extract + DB diff + yıllık plan dağıtım doğruluk testi.

### Oturum 52 — Phase 0 baseline (✅ tamamlandı)
**DB snapshot** (`audit-baseline/db-audit-2026-05-24.txt`):
- 24 branş, 6.138 kazanım
- okul_tipi dağılımı: ortaokul=2437, lise=2021, ilkokul=1156, ihl=524
- ders kolonu NULL = 0 (✓)

**Eksik branş × sınıf tespiti** (kademe vs DB sayım):
- Fransızca lise 9-12 → 0 kazanım (kritik — Phase 4.5'te seedlenecek)
- Almanca lise 9-12 → 0 kazanım
- Bilişim Teknolojileri 7-8 → 0 (5-6 var)
- Teknoloji ve Tasarım 5-6 → 0 (7-8 var)
- Felsefe 9 → 0 (10-12 var)
- Hayat Bilgisi 4 → 0 (1-3 var)
- (Doğal eksikler: DKAB 1-3, Sınıf Öğr 1-3, İngilizce 1)

### Oturum 51 (referans — önceki)
Kazanım başlık doğruluğu (metin) audit tamamlandı + 12 DB hatası düzeltildi.

### Metin Audit Sonuçları — TÜM BRANŞLAR ✅
pdftotext extraction ile DB karşılaştırması (1233 ortak kod):
- **1189 tam eşleşme** (96.4%)
- **44 fark** — tamamı PDF extraction hatası (column bleed / satır kırığı), DB DOĞRU
- **0 hayalet kod** (sadece PDF'de olan)
- **162 sadece DB'de** (seçmeli/ek program — beklenen)

| Sonuç | Branşlar |
|---|---|
| Exact match | Türkçe, İngilizce, Hayat Bilgisi, Görsel Sanatlar, Bilişim, Teknoloji Tasarım, Kimya, Biyoloji (±1), Müzik (±1) |
| DB doğru (PDF parent kodları saydı) | Matematik 1-8, Beden 1-8 |
| DB doğru (çoklu program) | Fizik gr9 (FİZ+AST=48), Coğrafya gr10 (COĞ+İÇYÇ=36), Din Kültürü, Arapça, Tarih, Felsefe (İHL+regular) |
| DB doğru (tasarım kararı) | SB grade 8 = İnkılap Tarihi (migration 012, SB öğretmeni girer) |
| DB doğru (audit false alarm) | Almanca (\.?\d* double-count), TDE (skill-based kodlar, grade embedded değil) |
| **Migration 039 ile düzeltildi** | **Fen Bilimleri 5-8 — 5-parçalı kodlar, 143 kazanım** |
| **Migration 040 + script ile düzeltildi** | **12 kazanım başlığı: SB.7.1.1, GS.11.1.1, KİM.9.1.5, FİZ.9.2.1, MAT.1.3.3-5, TT.8.1.3, BEO.3.6.3, BES.7.4.1, MAT.1.1.4, MAT.4.4.1** |

**KAZANIMLAR VERİFİYE EDİLDİ. İLERLEYEBİLİRİZ.**

### Sonraki oturumda yapılacaklar (sıralı)
1. **PR aç + EAS build** (production APK) → Google Play test track upload
2. **V1.5'e ertelendi** (DECISIONS güncel):
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
- [x] **Kazanımlar: 6.138 toplam** — Migration 030-039, Oturum 44-49
- [x] **Migration 000039**: Fen Bilimleri sinif 5-8 tam yeniden seed — 143 kazanım (28+36+36+43), 5-parçalı kod formatı ✅ — Oturum 49
- [x] **Migration 000038**: 50 kirli kayıt doğru metinlerle yeniden eklendi + TT.7.5.3/TT.7.5.4 güncellendi ✅ — Oturum 48
- [x] **Migration 000037**: 50 kirli kazanım silindi (metodoloji metni / truncated PDF extraction artifact) ✅ — Oturum 47
- [x] **Migration 000035**: İHL tam kazanım seed — 21 PDF, 469 kazanım (12 zorunlu + 9 seçmeli ders), ON CONFLICT DO UPDATE ✅ — Oturum 46
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
