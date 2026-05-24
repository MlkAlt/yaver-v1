# Yaver V1 — Proje Durumu

**Son güncelleme:** 24.05.2026 — Oturum 40

## Şu An Ne Yapıyoruz
Ders programı onboarding'den çıkarıldı. WowMoment → MainTabs direkt. PlanimScreen'de contextual CTA strip eklendi. Expo Go testi bekliyor.

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
- [x] **Kazanımlar: 5.171 gerçek MEB kazanımı** (22 branş, 1-12. sınıf) ✅ — Oturum 37
- [x] **Migration 000010**: `kazanimlar.ders` + `kazanimlar.okul_tipi` + `branslar.slug` + `branslar.kademe` ✅
- [x] **Migration 000011**: `kademe` sadeleştirme ✅
- [x] **Migration 000012**: sinif=8 T.C. İnkılap Tarihi → Sosyal Bilgiler branşına taşıma ✅
- [x] **Migration 000013**: Teknoloji ve Tasarım kazanımları (53 kazanım, 7-8. sınıf) ✅ — Oturum 37
- [x] **Migration 000015**: Hayat Bilgisi + Rehber Öğretmen DB'den kaldırıldı ✅ — Oturum 38
- [x] **Migration 000016**: İHL Meslek Dersleri ayrı branş (kazanımlar din_kulturu→ihl_meslek_dersleri taşındı) ✅ — Oturum 39
- [x] **secmeliDersler.ts JSON karşılaştırması**: teknoloji_tasarim [7,8], beden_egitimi (Sağlık Bilgisi), gorsel_sanatlar (Hüsn-i Hat+Ebru İHL), muzik (Dini Musiki İHL) ✅ — Oturum 38
- [x] Edge Function: generate (Deno, cache-first) — deploy + test edildi ✅
- [x] Soru üretimi telefonda çalıştı ✅

### planUret algoritması
- [x] **Range dağıtım:** Haftada 1 kazanım → haftada N/aktifHafta kazanım (tüm kazanımlar yıla dağılır) ✅
  - Fizik/Kimya/Biyoloji: haftada ~1 | TDE: haftada 2-3 | İngilizce/Türkçe: haftada 5-7

## Sonraki Adımlar (öncelik sırasıyla)
1. **Expo Go testi** (--clear ile):
   - Matematik → Ortaokul tile → 5-8 sınıf → Loading akışı
   - Din Kültürü → İHL tile → 9-12 sınıf → DerslerScreen (mesleki dersler görünüyor mu?)
   - Din Kültürü → İHO tile → DKAB + Kur'an + Peygamberimizin Hayatı görünüyor mu?
   - Din Kültürü → Ortaokul → seçmeli bottom sheet
   - Görsel Sanatlar → İHL → Hüsn-i Hat + Ebru görünüyor mu?
   - Müzik → İHL → Dini Musiki görünüyor mu?
   - Teknoloji ve Tasarım → 7-8 sınıf (5-6 yok)
   - WowMoment → "Planıma git →" → MainTabs (DersProgramı artık yok)
   - PlanimScreen → "Ders programını ekle" strip → DersProgrami
2. **EAS build** (production APK) → Google Play test track upload

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
