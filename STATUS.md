# Yaver V1 — Proje Durumu

**Son güncelleme:** 27.06.2026 — Oturum 71

## Şu An Ne Yapıyoruz

**APK hazır — kullanıcı manuel test yapıyor, sonra Evraklarım (S12)**

### Oturum 71 yapılanlar (26-27.06.2026)

**Almanca lise + Fransızca lise — Migration 071 ✅:**
- Encoding sorunu çözüldü: Claude chat ile PDF'den orijinal UTF-8 dosyalar yeniden üretildi
- Dönüşüm: CEFR (A1=9, A2=10, B1=11, B2=12) → sinif, sinif_tipi=normal, program=null
- DB: 8309 → **9568** (+1259, sıfır conflict)
- Almanca lise: 523 kayıt ✅ | Fransızca lise: 736 kayıt ✅

**EAS Preview APK ✅:**
- Build ID: `49a099c2-f5f8-4eac-9e8a-540b3993e9f7`
- İndirme: `https://expo.dev/accounts/melik06s-organization/projects/yaver/builds/49a099c2-f5f8-4eac-9e8a-540b3993e9f7`
- Düzeltmeler: `newArchEnabled: true` (reanimated 4.x zorunlu), SDK 54 paket versiyonları senkronize edildi, package-lock.json güncellendi
- Android cihaza link/QR ile yüklenebilir, başkasıyla paylaşılabilir

**Sonraki adımlar:**
1. Kullanıcı APK'yı telefona yükler → kazanımları manuel test eder → hata varsa bildirir
2. Hata yoksa veya düzeltmeler tamamlandıktan sonra → **Evraklarım (S12)** ekranına geç

### Oturum 67 yapılanlar (15.06.2026)

**secmeliDersler.ts temizliği:**
- `yeniders/` klasöründe JSON dosyası olmayan tüm seçmeli dersler BRANS_DERSLER'den kaldırıldı
- Kalan seçmeliler: Matematik Uygulamaları, Temel Matematik, Çağdaş Türk ve Dünya Tarihi, İslam Bilim Tarihi, Türk Kültür ve Medeniyet Tarihi, Sosyal Bilim Çalışmaları, İklim-Çevre-Yenilikçi Çözümler, Psikoloji, Sosyoloji, Mantık, Demokrasi ve İnsan Hakları, Astronomi ve Uzay Bilimleri, Kur'an-ı Kerim, Temel Dini Bilgiler, Peygamberimizin Hayatı (ortaokul+lise), Din Eğitimi, İslam Felsefesi, İslam'da Çocuk Eğitimi, Kur'an'ın Ana Konuları, Tasavvuf Kültürü, Takım Sporları
- turkce, turk_dili_edebiyati, fen_bilimleri, sosyal_bilgiler, kimya, ingilizce, gorsel_sanatlar, muzik, bilisim_teknolojileri branşlarının secmeli dizisi boşaltıldı

**Sonraki adımlar:**
- Expo'da test: branşlar + sınıf seçimleri + plan üretimi
- Seçmeli ders akışını uçtan uca test et (EkDerslerScreen → planUret)

---

### Oturum 66 yapılanlar (14.06.2026)

**UX düzeltmeleri:**
- `EkDerslerScreen`: `paylasimli: boolean` → `oncelik: 'zorunlu'|'genellikle'|'nadiren'` — Müzik/Görsel/BEO varsayılan seçili, İngilizce/DKAB altta seçisiz, öncelik sırasına göre listeleniyor (başlık yok)
- `sinifLabel.ts` oluşturuldu — sinif=0 → "Hazırlık", diğerleri → "X. Sınıf" (6 ekranda kullanıldı)
- `SinifScreen`: ingilizce lise için `SINIF_KISITLAMA`'ya `lise: [0, 9, 10, 11, 12]` eklendi (hazırlık seçilebilir)

**Veri düzeltmeleri:**
- İngilizce lise 384 kazanım sorunu: `planUret`'te `program` filtresi eklendi — sinif=0 seçildiyse `hazirlikli`, yoksa `hazirliksiz`
- Migration 069: Mantık (sinif=10), Çağdaş Türk ve Dünya Tarihi (sinif=12), İklim-Çevre (sinif=10) → sinif=0'dan doğru değerlere güncellendi

**planUret refactor:**
- Seçmeli ders modunda `sinif_tipi IN ('normal','secmeli')` + `sinif=0 OR sinif IN (siniflar)` + post-fetch sinif=0→primarySinif remap
- Branş modunda siniflar.includes(0) ise `hazirlik` tipi de dahil (TDE/Müzik/Görsel/BEO lise hazırlık)

**Sonraki adımlar:**
- Expo'da test: branşlar + sınıf seçimleri + plan üretimi
- Edge Function `generate` deploy güncelle (kazanim_kodu kaldırıldı — opsiyonel)

### Audit özeti (Oturum 56)
Kullanıcı tüm dersleri PDF'lerden manuel saydı. Tam sayım `memory/project_kazanim_audit_v2.md` dosyasında.

**Migration durumu (tümü push edildi):**
- Migration 047: -11 (garbage temizlik) ✅
- Migration 048: +27 (Kur'an'ın Ana Konuları, sınıf 11-12) ✅
- Migration 049: +10 (TT/TG eksik kazanımlar) ✅
- Migration 050: +10 (MÜZ/BES/İTA/BTY/MAT eksikler) ✅
- Migration 051: +17 (SBTK/HDS/KK.iho/PH.iho/DMUS) ✅
- Migration 052: +2 yeni (SOS.11.3.1, DKAB.12.3.5) + 83 metin düzeltmesi (AST/İHVD/İÇYÇ/İBT) ✅
- Migration 053: KK ihl/lise okul_tipi swap + 11 KK.H hazırlık kodu (sinif=0) ✅
- Migration 054: TDE lise yeniden yapılandırma — 64 hatalı (sinif=9) → 299 grade-specific (HAZ:54, 9:54, 10:63, 11:64, 12:64) ✅
- Migration 055: Hazırlık sınıfı eklendi — MAT.H:11, GS.H:24, MUZ.H:7, BES.H:6 (+48) ✅
- Migration 056: İTA-8 ders adı: 'T.C. İnkılap Tarihi' → 'T.C. İnkılap Tarihi ve Atatürkçülük' ✅
- Migration 057: KAK sinıf düzeltme — sinif=11,12 → sinif=10,11 + kod yenileme ✅
- Migration 058: TDB iho-7,8 (32 kazanım) + TDB lise-9,10 (25 kazanım) eklendi ✅
- Migration 059: BTY.6.6.3, BES.8.2.4, BES.8.3.4, TDE.10.4.4.4, ENG.7.5.W7 eklendi ✅
- Migration 060: Türkçe ilkokul tema yapısı (432 kayıt, 1:99/2:108/3:111/4:114) ✅
- Migration 061: Türkçe ortaokul tema yapısı (616 kayıt, 5:158/6:153/7:151/8:154) ✅
- Migration 062: İngilizce lise yeniden yükleme — garbage kod düzeltme (720 kayıt, 9:192/10:192/11:192/12:144) ✅

**DB toplam:** 6657 kazanım (migration 066 sonrası — ENG.3.1.PC1 + Temel Dinî + ilkokul Arapça temizlik)

**Audit durumu (Oturum 64):** 204/204 ✓

**Kesinleşenler (Oturum 64):**
- Coğrafya-12 = 20 (4-saat versiyonu, DB doğru)
- İslam Felsefesi-11 = 11 (PDF'de gerçekten 11, kapalı)
- BTY 7-8 / TT 5-6 / Felsefe-9 / Hayat Bilgisi-4 → PDF'de de yok, kapsam dışı (kapalı)

**Bekleyen (kullanıcı araştırıyor):**
- Fransızca lise 9-12: PDF var mı?
- Almanca lise 9-12: PDF var mı?
- İslam Bilim Tarihi ihl-11: DB'de 28 var, doğru mu?

**_all_kazanimlar.json:** 5732 giriş (Migration 050+051 eklendi ✅, 052-059 JSON'a yansıtılmadı)

**Önemli düzeltme:** TT sınıf 7 = PDF'de 27 (kullanıcı 31 saymıştı, PDF doğru kabul edildi)

---

## DB Durumu (14.06.2026) — v2 Schema

**Migration sırası:** 001 (schema) → 002 (branslar) → 067 (v2 reset) → 068 (seed)

| Parametre | Değer |
|---|---|
| Toplam kazanım | 9077 |
| Dosya sayısı | 81 |
| Unique branş (slug) | 23 |
| Boş aciklama | 88 (known) |
| Duplicate | 0 |

**Kazanımlar tablosu yeni alanlar:** `id BIGSERIAL`, `sinif_tipi`, `okul_tipi`, `brans` (slug), `ders`, `program`, `yas_bandi`, `branslar[]`, `secmeli`, `iki_saat_kapsaminda`, `sinif_ogretmeni_gorunur`

**uretimler/uretim_cache:** `kazanim_kodu` → `kazanim_id BIGINT FK`

**plan_haftalari:** `kazanim_kodlari TEXT[]` → `kazanim_ids BIGINT[]`

**Supabase reset için:** `supabase db reset` (local) veya migration 067+068 apply (prod)

---

### SONRAKI ADIMLAR (öncelik sırasıyla)

1. **Test**: `npx expo start --go --clear` → onboarding akışını baştan çalıştır (brans seç → sınıf → plan üret)
2. **Supabase dashboard**: kazanimlar tablosunda 9077 satır + yeni kolonları doğrula
3. **Edge Function**: `generate` deploy güncelle (kazanim_kodu kaldırıldı)
4. Uygulama geliştirmeye devam

---

### ESKİ YAPILACAKLAR LİSTESİ (artık geçersiz)

#### A) Tamamlandı ✅ (Oturum 56-60)
- İTA-8 ders adı düzeltme → Migration 056 ✅
- KAK sinıf düzeltme (10,11 → 10,11 yeni kodlar) → Migration 057 ✅
- TDB iho-7,8 + TDB lise-9,10 (57 kazanım) → Migration 058 ✅
- BTY.6.6.3, BES.8.2.4/3.4, TDE.10.4.4.4, ENG.7.5.W7 → Migration 059 ✅
- İslam Felsefesi audit target düzeltme: 12→11 ✅

#### B) Audit hedef düzeltmeleri (tamamlandı)
- TT-7: 31→27, İng ort 6/7/8: 160/168/168→184/192/192 (bunlar DB doğruydu)
- İslamFel-11: 12→11 (İF.3.3 PDF'de yok)

#### C) Büyük re-extraction (yeni script + migration) — V1.5 kapsamı
- ~~Türkçe ilkokul~~ ✅ (Migration 060)
- ~~Türkçe ortaokul~~ ✅ (Migration 061)
- ~~İngilizce lise~~ ✅ (Migration 062)
- ~~Arapça iho 5-8~~ ✅ (Migration 063, 310 kayıt)
- ~~Arapça ihl 9-10~~ ✅ (Migration 064, 158 kayıt)
- Migration 065: KK ihl-9 (14→12), İng ort-5 (160→138), TT-7 ünite 9 ekleme (27→31) ✅
- Migration 066: ENG.3.1.PC1 sil, Temel Dinî Bilgiler (î) 50 garbage sil, ilkokul Arapça 72 sil ✅

---

### Araştırma bulguları (Oturum 55)
- Sağlık Bilgisi: lise, sınıf 9, beden_egitimi branşı (katalogda seçmeli notu yok)
- İslam Bilim Tarihi 11: 28 — doğru (kullanıcı atladı ama PDF gerçek)
- Dini Musiki / Hüsnühat / Ebru / Tezhip: ihl sınıf [9,10,11] — sınıflar doğru
- Kur'an-ı Kerim: iki ayrı PDF → `kuranıkerimdöp.pdf` (lise seçmeli) + `kk912.pdf` (ihl) — ayrı tutulacak

**Why:** Müfredat extraction pipeline tamamlandı ama script bazı alt-kazanımları (tema sonu, tablo format) atladı. Manuel audit en güvenilir yol.

**Müfredat extraction pipeline TAMAMLANDI ✅**

### Tüm fazlar tamamlandı

- [x] **Phase 0** — extracted/ + outputs/ arşivlendi
- [x] **Phase 1** — 75 PDF interaktif katalog (pdf-katalog.json)
- [x] **Phase 2** — Modüler extractor mimarisi (scripts/extract/)
- [x] **Phase 3** — Tip A+B regex extraction
- [x] **Phase 4** — Tip C tablo extraction
- [x] **Phase 5** — Tip D regex_tipD extraction
- [x] **Phase 6** — Konsolidasyon (_all_kazanimlar.json)
- [x] **Phase 7** — Örnekleme + audit + DB seed → **CP-3 ✅**

### Extraction özeti

- 75 PDF işlendi (79 - 4 SKIP)
- **5465 kazanım** → DB'ye yüklendi (Migration 043 TRUNCATE + Migration 044 seed)
- Duplicate düzeltmeleri: KK→KKLISE (lise), TDB→TDBLISE (lise), hazırlıkingilizce çıkarıldı
- Spot-check: Tip A/B/C/D → 4/4 passed ✅

### DB durumu (06.06.2026)
- **5465 kazanım** (önceki: 6138 — eski migration'lardan IHL seçmeli + artık olmayan gruplar)
- 23 branş, 5 okul türü (ilkokul/ortaokul/lise/ihl/iho)
- Migration 043 (TRUNCATE) + Migration 044 (seed) uygulandı ✅

### Ertelenenler (V1.5)
- Coğrafya 2-saat/4-saat: onboarding'de saat seçimi → planUret filtresi (`src/data/cografya_2saat.json` hazır)
- Fransızca lise 9-12 → 0 kayıt (PDF var mı kontrol edilecek)
- Almanca lise 9-12 → 0 kayıt (PDF var mı kontrol edilecek)
- İslam Bilim Tarihi ihl-11 → DB'de 28 var ama audit'e eklenmedi (kullanıcı kontrol edecek)
- secmeliDersler.ts uyarı düzeltmeleri
- NOT: BTY 7-8 / TT 5-6 / Felsefe-9 / Hayat Bilgisi-4 → PDF'de de yok, kapsam dışı ✓

### Kritik audit aracı
`scripts/audit-mufredat.cjs` — Supabase'den canlı sayım:
`NODE_TLS_REJECT_UNAUTHORIZED=0 node scripts/audit-mufredat.cjs`

## Sonraki Adımlar (öncelik sırasıyla)

1. **EAS build** (production APK) → Google Play test track upload
2. **PR aç** — bu oturumun extraction + migration değişiklikleri
3. **V1.5** — Fransızca/Almanca seed, hazırlık İngilizce incelemesi, uyarı düzeltmeleri

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
- [x] Seed: 23 branş, 41 hafta takvim (36 aktif + 5 tatil, MEB PDF 2025-2026 ile hizalı)
- [x] **Kazanımlar: 5.465 toplam** — Migration 043+044, Oturum 54
- [x] **Migration 000043**: TRUNCATE kazanimlar (clean slate) ✅
- [x] **Migration 000044**: 5465 kazanım — 75 PDF, Tip A/B/C/D extraction ✅
- [x] Edge Function: generate (Deno, cache-first) — deploy + test edildi ✅
- [x] Soru üretimi telefonda çalıştı ✅

### planUret algoritması
- [x] **Range dağıtım:** Haftada 1 kazanım → haftada N/aktifHafta kazanım (tüm kazanımlar yıla dağılır) ✅
- [x] **byGroup dağıtım:** (sinif, ders) çifti bazında gruplama — her haftada tüm derslerden kazanım çıkar ✅
- [x] **İngilizce cap (multi-ders mod):** Sınıf Öğretmenliği gibi çok-ders modunda sınıf başına 20 İngilizce kazanım ile sınırlı ✅

## Onboarding Akış Özeti (Oturum 36)
```
Branş seç → Sınıf seç → [EkDersler | DerslerScreen | skip] → Loading → WowMoment
```

## Teknik Notlar
- Tüm ekranlar mock data ile çalışıyor, Supabase bağlantısı yok (planUret bağlı, diğerleri mock)
- Design referansı: `design_handoff_yaver_v1/` klasörü (handoff > CLAUDE.md spec)
- 3 branşta lise verisi yok: Almanca, Arapça, Bilişim Teknolojileri
- android.package: com.yaver.app | EAS Owner: melik06s-organization, slug: yaver
- Metro: `npx expo start --go --clear`
- `newArchEnabled: false` kalmalı — Expo Go SDK 54 ile uyumsuz
- `babel.config.js`'de `react-native-reanimated/plugin` var
- Windows Firewall port 8081-8082 açık
- Edge Function `generate` deploy edilmiş, Anthropic API kredisi mevcut ✅
- Supabase CLI: v2.90.0 — `supabase db push` ile migration apply edildi ✅
