# Yaver V1 — Proje Durumu

**Son güncelleme:** 09.06.2026 — Oturum 57

## Şu An Ne Yapıyoruz

**Manuel Kazanım Audit — Devam Ediyor**

### Audit özeti (Oturum 56)
Kullanıcı tüm dersleri PDF'lerden manuel saydı. Tam sayım `memory/project_kazanim_audit_v2.md` dosyasında.

**Migration durumu (henüz push edilmedi):**
- Migration 047: -11 (garbage temizlik) → 5457
- Migration 048: +27 (Kur'an'ın Ana Konuları, sınıf 11-12) → 5484
- Migration 049: +10 (TT.7.5.1/3/4, TT.8.1.3, TT.8.3.2/3, TG.4.3.1/2, TG.4.4.1/2) → 5494
- Migration 050: +10 (MÜZ.5/6/7.1.6, BES.7.4.1, İTA.8.2.5, BTY.6.4.2/4, MAT.1.3.3/4/5) → 5504
- Migration 051: +17 (SBTK.4.1/2, HDS.10.4.3, KK.7.3.3/4.1, PH.8.2.2, DMUS I/II/III) → 5521

**_all_kazanimlar.json:** 5732 giriş (Migration 050+051 eklendi ✅)

**Önemli düzeltme:** TT sınıf 7 = PDF'de 27 (kullanıcı 31 saymıştı, PDF doğru kabul edildi)

---

### BEKLEYEN KARAR — Kullanıcıdan yanıt bekleniyor
**Arapça ilkokul (sınıf 2,3,4):** Gerçek PDF var (`arapca24.pdf`, 72 kayıt). Tutulsun mu silinsin mi?

---

### YAPILACAKLAR LİSTESİ (öncelik sırasıyla)

#### A) Araştırılacak / doğrulanacak (Claude yapacak)
1. Kur'an'ın Ana Konuları PDF'inden sınıf doğrulama — katalog 11,12 diyor, kullanıcı 10,11 dedi → extraction yapılacak
2. İngilizce ortaokul neden fazla (6:+24, 7:+23, 8:+24) → duplicate kaynak aranacak
3. Kur'an-ı Kerim ihl vs lise seçmeli ayrımı → kk912.pdf extraction kalitesi kontrol edilecek
4. Sağlık Bilgisi seçmeli/zorunlu → web araştırması

#### B) Hızlı düzeltmeler — TAMAMLANDI ✅
- Coğrafya 11: 19→9 (10 fazla silinecek) — Migration 047 ✅
- Temel Dini Bilgiler lise 9: 16→12, 10: 16→13 — Migration 047 ✅
- Temel Düzey Matematik 11, Tezhip 9, Din Kültürü 4 — Migration 047 ✅
- ~~Teknoloji Tasarım 7: +3 (TT.7.5.1/3/4), 8: +3 (TT.8.1.3, TT.8.3.2/3) — Migration 049 ✅~~
- ~~Trafik Güvenliği 4: +4 (TG.4.3.1/2, TG.4.4.1/2) — Migration 049 ✅~~
- ~~Müzik 5/6/7: +1, BES.7.4.1, İTA.8.2.5, BTY.6.4.2/4, MAT.1.3.3/4/5 — Migration 050 ✅~~
- ~~SBTK.4.1/2, HDS.10.4.3, KK.7.3.3/4.1, PH.8.2.2, DMUS I/II/III — Migration 051 ✅~~
- BES 8: +2 → kullanıcı sayım hatası (PDF=10, DB=10) — atlandı
- TDB iho 7,8 — kullanıcı sayım hatası — atlandı
- İslam Felsefesi ihl 11 — kullanıcı sayım hatası — atlandı
- DKAB lise 12: +1 → kullanıcı sayım hatası (PDF=19=DB) — atlandı

#### C) Büyük re-extraction (yeni script + migration)
- Türkçe ilkokul: ~+355 kazanım (tema alt-kazanımları)
- Türkçe ortaokul: ~+210 kazanım (tema alt-kazanımları)
- Arapça iho 5-8: ~+301 kazanım
- Arapça ihl 9-10: ~+150 kazanım
- İngilizce lise 9-12: +36 kazanım

#### D) Yeni eklenmesi gerekenler (text + extraction gerekli)
- Hazırlık sınıfı (sinif=0): Matematik:11, Görsel Sanatlar:24, Müzik:7, BES:6, KK-ihl:11
- Kur'an'ın Ana Konuları: sınıf doğrulandıktan sonra extraction
- İngilizce lise fazlaları temizlenip eksikler eklenecek

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
- hazırlık İngilizcesi: 165 unique kod — artifact riski, ayrıca incelenmeli
- Fransızca lise 9-12 → 0 kazanım (kritik)
- Almanca lise 9-12 → 0 kazanım
- Bilişim Teknolojileri 7-8 → 0 (5-6 var)
- Teknoloji ve Tasarım 5-6 → 0 (7-8 var)
- Felsefe 9 → 0 (10-12 var)
- Hayat Bilgisi 4 → 0 (1-3 var)
- secmeliDersler.ts uyarı düzeltmeleri

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
