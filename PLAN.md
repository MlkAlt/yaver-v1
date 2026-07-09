# Öğretmen Yaver — PLAN (Tek Kaynak)

**Versiyon:** V1.5 Konsolide · **Tarih:** 30.06.2026
**Durum:** Aktif **tek kaynak** — ürün + mimari + yol haritası + uygulama detayı hepsi burada. Çakışmada bu dosya kazanır.
**Yerini aldığı:** `SPEC_FULL.md`, `PRD.md`, `STRATEJI_V2.md`, `ROADMAP.md` (içerikleri buraya katıldı; ilk üçü `archive/`'da tarihsel referans).
**Birlikte:** `CLAUDE.md` (davranış+teknik kurallar) · `STATUS.md` (nerede kaldık) · `DECISIONS.md` (karar günlüğü).
**Tek hedef:** Ağustos sonu store review, Eylül zirvesinde canlı.

---

## 0. Bu dosya neden var

Dört ayrı doküman (SPEC_FULL / PRD / STRATEJI_V2 / ROADMAP) ve geri çekilmiş bir pivot, aynı ürünün farklı tariflerini bırakmıştı. Bu dosya hepsini **tek, uygulanabilir** plana indirger — strateji *ve* uygulama. Bundan sonra yeni pivot değil, bu planın fazları işlenir. Tek kural: *çakışırsa PLAN.md kazanır.*

---

## 1. Vizyon & vaat

Öğretmenin zihinsel yükünü alan asistan. **Öğretmen düşünmez, onaylar.**

> **Tek cümle:** "Yaver hazırlar, sen öğretirsin."

Hedef kitle: Türkiye K-12 öğretmeni (~1.1M). Temel varlık: doğrulanmış **MEB 2025 Maarif Modeli** müfredatı — 9.568 kazanım, 23 branş. Asıl moat budur: doğru ve eksiksiz müfredat veren tek uygulama. Öğretmen yanlış kazanımı affetmez; güven = hayatta kalma.

---

## 2. Kurucu ilke — Marjinal maliyet ≈ 0 (mimarinin ruhu)

Lifetime/uzun-ömür satış mümkün olsun diye **kullanıcı başına çalışma maliyeti sıfıra yakın olmak zorunda.** Fiyat tercihi değil, mimari zorunluluk.

Her özellik iki sınıftan birinde:
- **(A) Deterministik / offline:** veri gösterimi, hesap, şablon doldurma. AI yok.
- **(B) Önceden üretilmiş havuz:** içerik bir kez merkezi üretilir, QC'den geçer, statik servis edilir. Kullanıcı başına AI = 0.

**Yasak:** kullanıcı-başına, her-istekte canlı AI. (Lifetime'ın finansal düşmanı.)

### Maliyet tablosu
| Özellik | Nasıl çalışır | Kullanıcı başı maliyet |
|---|---|---|
| Haftalık kazanım + defter (Bu Hafta) | Supabase'den okuma | ~0 |
| Yıllık plan | `planUret` deterministik | ~0 |
| Çalışma yaprağı / etkinlik | Önceden batch üretilmiş havuz | ~0 (batch tek seferlik, bende) |
| Evrak şablonu doldurma | Client-side `{{placeholder}}` | 0 (AI yok) |
| Sınav analizi | Hesap (ortalama, kazanım %) | 0 (matematik) |
| Canlı AI ("özel hazırla") | Runtime Claude API | **>0 — v1'de YOK** |

Sonuç: AI maliyeti tekrarlayan gider değil — **tek seferlik içerik üretim bütçesi** (kitap yazmak gibi) + yıllık MEB güncelleme bakımı. "Hızlı + kaliteli + maliyetsiz": havuzda hazır (hızlı), bir kez merkezi QC (kaliteli), cihazda PDF render (maliyetsiz).

---

## 3. Dört sütun (ürün)

| Sütun | Maliyet sınıfı | Repo durumu |
|---|---|---|
| 1 — Plan & Defter Görünümü | A (deterministik) | Büyük kısmı hazır |
| 2 — Çalışma Yaprağı & Etkinlik | B (havuz) | UI var, havuz altyapısı eksik |
| 3 — Sınav Analizi | A (hesap + şablon) | Yeni akış |
| 4 — Resmi Evraklar | A (şablon + varsayılan) | Çekirdek şablonlar hazır |

### Sütun 1 — Plan & Defter Görünümü  ·  [A]
- Yıllık plan: branş + sınıf → 30 sn'de MEB müfredatıyla kurulum (`planUret` hazır).
- **Bu Hafta (defter görünümü):** haftanın kazanımları sınıf-sınıf, büyük punto, bugün vurgulu. Öğretmen sınıf defterini buna bakarak kalemle doldurur. Offline. Kazanım metni ekranın en büyük öğesi.
- Plan tabı: yılın tamamı (dönem→ay→hafta), salt okunur, yazdırılabilir PDF.

### Sütun 2 — Çalışma Yaprağı & Etkinlik  ·  [B]
- Kazanıma bağlı çalışma yaprağı + faaliyet/etkinlik tavsiyesi. Anında (havuzda hazır), A4'e sığar, TR karakter temiz, `expo-print` PDF.
- Havuz: kazanım × tip × 3-5 varyasyon, merkezi pre-generation. Öğretmen varyant seçer; kullanıcıya özel canlı üretim yok.

### Sütun 3 — Sınav Analizi  ·  [A]
- Sınav → notları gir (manuel + Excel/CSV e-Okul export) → Yaver hesaplar: sınıf ortalaması, kazanım başına başarı %, en zayıf/güçlü 3 kazanım.
- Çıktı: resmi **Sınav Analizi PDF** (zorunlu MEB evrakı) → arşive. Zayıf kazanımda öneri: "tekrar yaprağı?" (havuzdan).
- **Neden güçlü:** MEB zorunlu evrakı → öğretmen veriyi zaten girmek zorunda → "veri girme direnci" doğal aşılır (compound feature). OCR/foto → kapsam dışı (v2).

### Sütun 4 — Resmi Evraklar  ·  [A]
- Şablon + akıllı varsayılan + öğretmen 5-6 alan doldurur. MEB resmi dili kalıplı → pre-yazılmış şablon metni, AI yok. `expo-print` PDF.
- **9 çekirdek evrak (öncelik + durum):**

| # | Evrak | Sıklık | Durum |
|---|---|---|---|
| 1 | Zümre tutanağı | 4-5/yıl | ✅ hazır |
| 2 | ŞÖK tutanağı | 4/yıl | ✅ hazır |
| 3 | Veli toplantı tutanağı | 2-3/yıl | ✅ hazır |
| 4 | Kulüp evrak paketi | 1/yıl | yapılacak |
| 5 | Gezi izin formu + sonuç raporu | olduğunda | yapılacak |
| 6 | Dilekçe bankası (izin/mazeret/nakil) | olduğunda | yapılacak |
| 7 | Tören evrakları (Cumhuriyet/23 Nisan/19 Mayıs) | 5-6/yıl | yapılacak |
| 8 | BEP / ZEP | olduğunda | yapılacak |
| 9 | Sınav analizi | her sınav | → Sütun 3 |

Şablon kaynak: MEB resmi PDF'leri + sendika örnekleri → 5-6 örnek karşılaştır → "ideal" yapı → Yaver standardı. Açık web kazıma yok.

---

## 4. Veri modeli — mevcut şema (gerçek) + eklenecekler

> Şema zaten kurulu (migration 001 + 067). **Sıfırdan kurulum yok.**

### Mevcut tablolar (kurulu ✅)
```
branslar          id(uuid) ad slug ikon renk sira aktif                    -- ~23 branş
kazanimlar        id(BIGSERIAL) kod ad sinif sinif_tipi unite aciklama      -- 9.568 kazanım
                  brans(slug) ders okul_tipi program yas_bandi branslar[]
                  secmeli iki_saat_kapsaminda sinif_ogretmeni_gorunur
                  UNIQUE(kod,sinif,unite,okul_tipi,program,yas_bandi)
egitim_takvimi    id yil hafta_no baslangic bitis tatil_mi tatil_adi        -- 41 hafta (MEB)
evrak_sablonlari  id ad kategori yapi(md) alanlar(jsonb) aktif              -- şablon yapısı
kullanicilar      id(→auth.users) email ad brans_id siniflar(jsonb)         -- profil
                  aktif_yil onboarding_done [surpriz_aktif=LEGACY]
yillik_planlar    id kullanici_id yil brans_id siniflar durum
plan_haftalari    id plan_id hafta_no kazanim_ids(BIGINT[])
uretimler         id kullanici_id kazanim_id tip parametreler icerik        -- üretim kaydı
                  hafta_id begeni sessiz_veri [origin='surpriz'=LEGACY]
uretim_cache      id cache_key kazanim_id tip parametreler_hash icerik      -- cache
                  kullanim_sayisi son_kullanim
evrak_uretimleri  id kullanici_id sablon_id doldurulan(jsonb) icerik
bildirimler       id kullanici_id tip mesaj ilgili_entity okundu
feedback          id kullanici_id uretim_id begeni sessiz_veri
```

### Eklenecek / değişecek (build sırasında)
- **İçerik havuzu** → `uretim_cache`'i küratörlü havuza genişlet (veya yeni `etkinlik_havuzu`): `+ varyasyon_no, + qa_onay(bool), + zorluk, + kaynak(ai_batch|manual)`. Runtime exact-match değil; QC'li çok-varyasyonlu havuz.
- **`entitlements`** (YENİ) → `profile_id, urun(lifetime|annual), baslangic, bitis(lifetime=null), aktif, store_receipt`. RevenueCat webhook → edge function yazar.
- **`sinav_analizleri`** (YENİ, Sütun 3) → `kullanici_id, brans, sinif, sube, tarih, kazanim_ids[], notlar(jsonb), ortalama, kazanim_basari(jsonb), pdf_url`.
- **`ai_kredileri`** (v2) → `profile_id, kalan_kredi`.

### Temizlenecek legacy (iptal edilen sürpriz hazırlık)
`kullanicilar.surpriz_aktif`, `uretimler.origin='surpriz'`, `bildirimler.tip='surpriz'` → kullanılmıyor (DECISIONS 2026-05-02).

**RLS:** kullanıcı yalnızca kendi satırını görür (`kullanicilar/yillik_planlar/uretimler/entitlements/sinav_analizleri`). `kazanimlar/egitim_takvimi/evrak_sablonlari/havuz` herkese okuma; premium içerik client'ta gate + entitlement edge-function ile doğrulanır.

---

## 5. Maliyet mimarisi — pre-generation havuzu (içerik fabrikası)

> Lifetime kullanıcının tükettiği etkinlikler buradan gelir. Tek seferlik senin maliyetin, sonra sıfır.

**Akış (script, Claude Code yazar/çalıştırır):**
1. `kazanimlar` çek (9.568).
2. Her kazanım için batch: "1 sınıf-içi etkinlik + 2 soru + 1 ödev, MEB müfredatına uygun, X. sınıf, JSON." (Haiku = ucuz sorular; Sonnet = etkinlik/ödev kalite.)
3. `output/etkinlikler/*.json` (tip, baslik, icerik, zorluk).
4. **QA kapısı (sen):** branş başına örneklem; bariz hataları işaretle; toplu onay. Kazanım/çıktı hata hedefi: **0**.
5. `seed_supabase.js` → onaylıları havuza (`qa_onay=true`).

**Ölçek & maliyet:** ≈ 9.568 × 2-3 tip × 3 varyasyon. Tahmini tek-seferlik **~$1.000–1.500 / ~3.000 TL**. Önce 1 branş (Matematik) tam üret, kaliteyi/maliyeti ölç, sonra ölçekle.
**Servis:** statik okuma; PDF cihazda render (`expo-print`) → sunucu render maliyeti 0.
**Yıllık bakım:** MEB güncellediğinde yalnızca değişen kazanımlar için pipeline tekrar çalışır. **Bu tekrarlayan maliyeti yıllık abonelik finanse eder** (§7).

> Not: Bu, eski STRATEJI_V2'deki "community-sourced cache" (363K slot) fikrinin sadeleştirilmiş halidir — topluluk-beğeni yerine merkezi pre-gen + QC.

---

## 6. Evrak fabrikası — iki versiyon

> Şablonlar bir kez üretilir (senin maliyetin). Doldurma client-side, sıfır maliyet. Kaynak yetkili (MEB/EBA + senin meslek lisesi bilgin). `evrak_sablonlari` tablosu kurulu; zümre/ŞÖK/veli şablonları üretildi (kod içi).

### 6a. Script (n8n'siz) — LANSMAN İÇİN
Kalan ~12-15 evrak tipini bir kez toplu üret. Infra yok, tam kontrol.
1. `seeds/`: her tip için yetkili referans yapı + alan tanımı.
2. Claude API (tek seferlik) → `{{placeholder}}`'lı şablon + `alanlar` JSON.
3. `output/evrak_sablonlari/*.json`.
4. **QA (sen):** local HTML preview ile render et, düzelt, onayla (domain uzmanı sensin).
5. `seed_supabase.js` → `evrak_sablonlari`.

### 6b. n8n (lansman sonrası) — yaşayan pipeline
"Bana bildirim ver, ben onaylayım/düzelteyim" döngüsü:
```
[Trigger] → [Yetkili kaynak fetch (whitelist)] → [Claude API; body'de $json direkt, JSON.stringify YOK]
→ [Format/Validate {tip,ad,alanlar,govde}] → [Telegram önizleme: Onayla/Düzelt/Reddet]
→ [Wait = GATE] → [onay → Supabase REST → evrak_sablonlari] → [Log]
```
**Karar:** Lansman bulk'u = 6a script. Lansman sonrası sürekli içerik = 6b n8n.

---

## 7. Gelir modeli

- **Yıllık abonelik (ANA model):** okul yılına denk (Eylül–Haziran). Tekrarlayan gelir → yıllık MEB güncelleme bakımını finanse eder. Kampanya: Eylül + Şubat (agresif giriş).
- **Lifetime (çapa / erken-kuş):** premium tek-seferlik; "öde-unut" mesajı + lansman ivmesi. İlk N öğretmene indirimli.
- Rakamlar lansmanda test edilir (ilk ~100 kullanıcı verisiyle revize).

### Ürün katmanları
| Katman | İçerik | Ödeme |
|---|---|---|
| **Free (sonsuz)** | Yıllık plan + Bu Hafta defter görünümü + kazanım başı 1 örnek etkinlik + sınırlı evrak | — |
| **Yıllık premium (ana)** | Tüm havuz + tüm evrak + sınav analizi + yazdırmaya hazır export | Auto-renewable (~450-600 TL/yıl) |
| **Lifetime (çapa)** | Yıllık ile aynı içerik, tek seferlik | Non-consumable IAP (~900-1.400 TL) |
| **AI kredi paketi (v2)** | Canlı kişiselleştirme | Consumable IAP |

### Free / Pro matrisi (limit rakamları hipotez)
| Özellik | Free | Pro |
|---|---|---|
| Yıllık plan + Bu Hafta defter görünümü | Sınırsız | Sınırsız |
| Hatırlatma (lokal bildirim) | Var | Var |
| Çalışma yaprağı / etkinlik (havuzdan) | Ayda 5 | Sınırsız |
| Resmi evrak şablonu | Ayda 2-3 | Sınırsız |
| Sınav analizi | Var (temel) | Var + tekrar yaprağı önerisi |
| Arşiv | Bu yıl | Geçmiş yıllar + yeni yıla devir |

**Objektif gerilim & çözümü:** lifetime gelir tavanı + sonsuz bakım yaratır. Yıllık abonelik backbone bunu dengeler; lifetime saf çapa/pazarlama rolünde. Rakibin kota modeli ("yılda X dosya") öfke yaratır — biz **premium içinde sınırsız** deriz; temiz vaat = üstünlük.

---

## 8. Bilgi mimarisi (ekranlar)

**4 tab + sağ üstte profil & zil (bildirim):**

| Tab | İçerik | Sütun |
|---|---|---|
| **Bu Hafta** | defter görünümü + bugün vurgusu | 1 |
| **Plan** | yıllık plan (dönem→ay→hafta) + PDF | 1 |
| **Hazırla** | yaprak/etkinlik (havuz) + sınav akışı | 2, 3 |
| **Evrak** | resmi evraklar + sınav analizi çıktısı + arşiv | 4, 3 |

**Tasarım:** tek pattern — dark hero (`#1A1A1A`) + krem panel (`#F7F5F2`). Mikro dil: "Hazırla / Benim yerime hazırla / Yazdırmaya hazır indir". UI'da "AI / üret / jeton" yok.

**Ekran geçiş haritası (mevcut → hedef):**

| Hedef | Mevcut dosya(lar) | Aksiyon |
|---|---|---|
| Bu Hafta | `PlanimScreen` | sahte sayaçları kaldır, defter görünümüne sadeleştir |
| Plan | `YillikPlanScreen` + `HaftaDetayiScreen` | koru |
| Hazırla | `DersIcinScreen` + `UretimScreen` + `CiktiScreen` | canlı AI → havuz-fetch; + yeni Sınav akışı |
| Evrak | `EvraklarimScreen` + `SablonDoldurmaScreen` | koru + kalan şablonlar |
| Profil | `ProfilScreen` + `OkulBilgileriScreen` + `DersProgramiScreen` | birleştir |

> `YaverAsistaniScreen` (eski S15) yok — bildirim/zil v1'de lokal `expo-notifications`.

**Dokunuş-bütçeli akışlar:**
- **Günlük (0 dokunuş):** Aç → Bu Hafta → deftere yaz → kapat.
- **İçerik (3 dokunuş):** Bu Hafta kartı → "hazırla" → tip seç (varsayılan dolu) → havuzdan gelir → indir.
- **Evrak (3 dokunuş):** şablon → form (varsayılan dolu) → oluştur → indir.
- **Sınav (5 dokunuş):** Hazırla → Sınav → sınıf → dağılım → üret → paket. Sonra: arşiv → "sonuçları gir" → analiz.
- **Onboarding:** Branş → Sınıf → (ek/seçmeli ders) → Loading → Wow → Bu Hafta. Auth yok.

**Kapı anları:** auth ikinci üretimde soft modal (kapatılabilir); paywall yalnızca değer anlarında (§9). Soğuk fiyat sayfası yok.

> Detaylı UI prensipleri (AI-çıktısı yasakları, animasyon, empty-state, detay) `CLAUDE.md → DESIGN SYSTEM` + `design_handoff_yaver_v1/` + `refs/`.

---

## 9. Paywall — tetik noktaları

İlke: onboarding ve günlük kancada paywall **YOK**. Değer yaşandıktan sonra, yüksek niyet anında çıkar.

| # | Ekran | Tetik | Not |
|---|---|---|---|
| ① | Hazırla | "tüm etkinlikleri gör" | Yumuşak, en sık |
| ② | Hazırla | "benim yerime hazırla" (v2 canlı AI) | Kredi-gate (v2) |
| ③ | Çıktı | "yazdırmaya hazır indir" | Export anı |
| ④ | Evrak | BEP/zümre/günlük plan seç | **EN GÜÇLÜ dönüşüm** |
| ⑤ | Şablon Doldurma | doldurduktan sonra indir | Kayıp kaçınması |
| ⑥ | PDF Önizleme | Word/Excel formatında indir *(fikir, 2026-07-09)* | PDF ücretsiz kalır, düzenlenebilir format premium |

Paywall'ın **yüzü evrak olsun**, etkinlik değil.

**⑥ notu:** Kullanıcı fikri — PDF önizleme ekranına ileride Word/Excel export seçenekleri eklenip bunlar paywall arkasına konabilir (PDF her zaman ücretsiz/temel kalır, düzenlenebilir format premium değeri olur). Henüz teknik tasarım/uygulama yapılmadı — Faz 6 (paywall) zamanı detaylandırılacak.

---

## 10. Fazlar (build sırası — %80-hazır baseline)

> İşaret: ✅ biten · 🟡 kısmen · ⬜ yapılacak. Her faz: Amaç → Görev → DONE. **Karar: dört sütun tam → tek lansman.**

### FAZ 0 — Temel ✅
Expo+TS repo, tokenlar (Plus Jakarta Sans), 17 ekran iskeleti, navigasyon, şema (001+067). **Kalan 🟡:** Supabase Auth wire (şu an veri AsyncStorage/mock) — soft-auth olarak Faz 6 öncesi.

**Auth planı (2026-07-09 karar, Faz 6'dan önce yapılmalı):**
1. **Yöntem:** Apple/Google Sign-In (kullanıcı tercihi — email+şifre'den daha az sürtünme, store review'da avantajlı; iOS'ta sosyal login sunuluyorsa "Sign in with Apple" zorunlu kuralına da bu şekilde baştan uyulmuş olur).
2. **`profiles` tablosu** (Supabase, `auth.users` FK) — okul adı, branş, sınıf, plan verisi buraya taşınır.
3. **Kalıcılık düzeltmesi (yan etki, ayrı ama ilişkili bug):** `OnboardingContext` şu an hiç persist edilmiyor (salt React state, uygulama kapanınca sıfırlanıyor) — bu işle birlikte AsyncStorage (yerel-öncelik) + hesaplıysa Supabase senkronuna geçirilir.
4. **"Soft" tanımı:** hesapsız da temel özellikler kullanılabilir; satın alma öncesi hesap istenir (yoksa RevenueCat entitlement cihaza kilitli kalır, telefon değişince kaybolur).
5. **Yeni ekranlar:** Giriş (Apple/Google buton) + Profil'de "Çıkış yap" + hesap bilgisi.
6. **RLS politikaları:** `auth.uid()` bazlı, herkes yalnız kendi verisini görür.
7. **Hesap silme akışı** (bkz. Faz 9 KVKK) bu auth'a bağımlı, birlikte kodlanmalı.

### FAZ 1 — Veri + içerik havuzu 🟡
✅ 9.568 kazanım seed, ✅ `egitim_takvimi` 41 hafta. ⬜ **Etkinlik havuzunu üret** (§5 batch) + QC `qa_onay=true`.
**DONE:** "9. sınıf Matematik, 3. hafta" → doğru kazanım + onaylı etkinlik.

### FAZ 2 — Onboarding + Aha (S1-S5) ✅
Welcome→Branş→Sınıf→(Ek/Seçmeli)→Loading→Wow; planUret bağlı, Wow'da gerçek kazanımlar. **Auth ve paywall YOK.**

### FAZ 3 — Bu Hafta + Hafta Detayı 🟡  ← SIRADAKİ
Free, sonsuz. 🟡 PlanimScreen'deki **sahte `hazirSayisi` (6 yer)** + mock "Son Hazırlananlar" temizlenecek → saf defter görünümü. HaftaDetayi: kazanım + "deftere yazıldı" işareti / kopyala. Haftalar arası geçiş + son hafıza.
**DONE:** Aç → bu haftanın kazanımları sınıf bazında → kopyala/işaretle. Sahte hazır/eksik UI yok.

### FAZ 4 — Hazırla: yaprak/etkinlik (S11/S8/S9) 🟡
DersIcin/Uretim/Cikti var ama **canlı AI/mock → havuz-fetch** ile değiştir. Kazanım başı 1 free; "tümü"/"daha hazırla" → paywall ①. Çıktı: A4/TR temiz `expo-print` PDF → paywall ③.
**DONE:** Free 1 etkinlik; "tümü" paywall; premium tüm havuz; PDF yazdırılabilir.

### FAZ 5 — Evrak (S12/S13) 🟡
✅ Zümre/ŞÖK/Veli wizard + PDF. ⬜ Kalan şablonlar (kulüp, gezi, dilekçe, tören, BEP/ZEP). Doldurma: `alanlar` JSON → form → `{{placeholder}}` client-side. **AI yok.** Premium → paywall ④/⑤.
**DONE:** Şablon seç → doldur → belge; BEP/zümre paywall arkasında; 0 AI maliyeti.

### FAZ 6 — Paywall + ödeme ⬜
**RevenueCat** (receipt + entitlement + restore). Ürün: yıllık (auto-renew), lifetime (non-consumable). Entitlement → `entitlements` (webhook → edge fn). 5 tetik (§9). **Restore zorunlu.** Soft-auth (ikinci üretim).
**DONE:** Satın alma + entitlement gate + restore çalışıyor; sandbox test.

### FAZ 7 — Sınav Analizi (MVP) 🟡 — Sütun 3 *(Claude Code'da büyük kısmı yapıldı)*
✅ 5 adımlı sihirbaz (Temel bilgi → Sorular+kazanım eşleştirme → Öğrenciler → Puan girişi → Sonuç). ✅ Manuel not girişi (öğrenci×soru tablosu, "girmedi" toggle). ✅ Soru→kazanım eşleştirme (Supabase'den branş/sınıf/ders filtreli canlı okuma — 0 AI). ✅ Hesap: kazanım/genel başarı % (MEB usulü yarı-puan eşiği), giren/girmeyen, öğrenci toplamları. ✅ Otomatik tedbir önerisi. ✅ PDF çıktı (`expo-print`+`Sharing`, "Yazdırmaya hazır indir"). ✅ Akıllı varsayılan (okul/öğretmen/müdür) + **sınıf bazlı öğrenci listesi hafızası** (sonraki sınavda otomatik). ✅ Navigasyon + Evrak tile bağlı. ✅ TR büyük-harf helper (`turkce.ts`).
✅ **Uygulama-içi arşiv (yerel / AsyncStorage)** — analiz otomatik kaydedilir, step 0'daki "Geçmiş Analizler"den yeniden açılır / tekrar PDF alınır / silinir; login yok, offline, app boyutunu artırmaz. (`src/data/sinavArsiv.ts` + SinavAnaliziScreen). Kayıt şekli ileride Supabase `sinav_analizleri`'ne senkronlanabilir biçimde.
⬜ Kalan: Supabase `sinav_analizleri` senkronu (auth gelince — kayıt şekli hazır) · CSV/e-Okul import (kullanıcı şimdilik ertledi) · "çalışma yaprağı" önerisi (havuza bağlı — Faz 1/4) · paywall gating (Faz 6).
**DONE (revize):** Çekirdek MVP + yerel arşiv çalışıyor (manuel → kazanım eşleştirme → hesap → PDF → arşiv). Supabase senkron / CSV / paywall sonraki turlarda.
> Not: Eylül riski düşük — Sınav Analizi pratikte kullanılabilir durumda.

### FAZ 8 — Profil + Bildirim ⬜
Profil + okul bilgileri + ders programı + **upgrade** + entitlement durumu. **Local notifications** (haftalık kazanım, pazartesi, eksik defter).

### FAZ 9 — Lansman ⬜
Store assets · gizlilik + KVKK (rakip zayıflığı, temiz) · EAS Build (Android+iOS) · internal/TestFlight · hesap/sözleşme/banka · submit.
**DONE:** İki store'da review'da (Eylül öncesi).

**KVKK/Gizlilik planı (2026-07-09 karar, Faz 0 auth ile paralel yürüyebilir):**
1. **Veri envanteri:** hangi veri toplanıyor — email/Apple-Google ID, okul adı, branş/sınıf, kullanım istatistiği, RevenueCat işlem kaydı — somut liste çıkarılacak.
2. **Metin:** KVKK (Türkiye) uyumlu + Apple/Google gereksinimleri, özellikle **hesap silme hakkı** (Apple 2024+ zorunlu tutuyor).
3. **Barındırma:** statik bir sayfa (GitHub Pages vb.) — store başvurusu bir gizlilik politikası URL'si istiyor.
4. **Uygulama içi:** Onboarding'de "Şartları kabul ediyorum" + Profil'de linkler.
5. **Hesap silme akışı:** Faz 0 auth'a bağımlı — Profil ekranından tetiklenir, `auth.users` + `profiles` + ilişkili veri silinir.

---

## 11. Zaman çizelgesi → Eylül canlı

> ~%80 hazır → erken fazlar kısa; ağırlık havuz + paywall + sınav MVP.

| Hafta | Tarih (yaklaşık) | İş |
|---|---|---|
| 1 | Temmuz başı | Faz 1 havuz pilot (Matematik) + kalite/maliyet ölç · Faz 3 Bu Hafta temizliği |
| 2 | Temmuz ortası | Faz 1 havuz ölçekle + QC · Faz 4 Hazırla → havuz-fetch |
| 3 | Temmuz sonu | Faz 5 kalan evrak şablonları (6a bulk) |
| 4 | Ağustos başı | Faz 6 RevenueCat + paywall + soft-auth |
| 5 | Ağustos ortası | Faz 7 Sınav Analizi MVP |
| 6 | Ağustos ortası-sonu | Faz 8 profil + bildirim · uçtan uca QA (A4/TR/PDF/kazanım doğruluk) |
| 7 | Ağustos sonu | Faz 9 lansman: assets, build, submit → review'da |

Eylül = zirve. **En büyük hamle: Eylül'de agresif satılan yıllık abonelik.**

---

## 12. Çalışma yöntemi — sapmadan ilerleme

**Bir görev = bir ekran/özellik + yazılı KABUL kriteri.** Fazlası tek seferde yaptırılmaz.

**Döngü:** (1) Oturum başı CLAUDE.md + STATUS.md + ilgili faz oku, özet. (2) Tek görev; belirsizse önce sor. (3) Sadece o göreve dokun. (4) UI sınırında insan kontrolü (mockup ile). (5) Commit (feature branch) → STATUS.md güncelle.

**Doğrulama:** veri/mantık (query, planUret, paywall, sınav hesabı) → test yazılır, otonom koşar. UI → mockup ile insan kontrolü.

**Sabit kurallar (CLAUDE.md):** K5 feature branch · K6 exact version + lock · K7 DROP/DELETE → önce sor, migration öncesi snapshot.

**Görev prompt şablonu:**
```
Bağlam: CLAUDE.md + STATUS.md oku. Faz [X], görev [Y].
Görev: [tek ekran/özellik, net].
KABUL: [çalıştığını nasıl anlayacağım — somut].
Kısıt: Sadece bu göreve dokun. Belirsizse önce sor. K5/K6/K7.
Bitince: özetle, STATUS.md'ye yaz, commit mesajı öner.
```

---

## 13. Kapsam dışı (kalıcı — pivot dürtüsünü kapatmak için)

- Kullanıcı-başına **canlı** AI üretimi v1'de yok. **İstisna:** v2'de tüketilebilir kredi paketi (consumable IAP) — maliyet yalnızca ödeyene dokunur, lifetime bozulmaz.
- Slayt / sunu / animasyon
- Ders kitabı RAG
- Community-sourced cache karmaşası (merkezi pre-gen yeterli)
- Tek hesapta çoklu branş
- OCR / optik okuma (v2)
- Sürpriz hazırlık (iptal — korunur)
- Veli ile in-app mesajlaşma

---

## 14. Riskler & yönetimi (objektif)

| Risk | Yönetim |
|---|---|
| Dört sütun tek lansman ↔ Eylül deadline gerilimi | Sınav Analizi MVP + en sona + Ekim kaçış kapısı |
| Havuz içeriği "yeterince iyi" olmazsa | 3-5 varyasyon + QC + sınıf düzeyine göre varyant |
| Yıllık MEB güncelleme bakım maliyeti | Yıllık abonelik finanse eder |
| Kazanım hatası = güven kaybı = ölüm | Mevcut `scripts/audit-*` altyapısını sürdür; hedef 0 |
| Sınav skor girişi sürtünmesi | e-Okul CSV şablonu kritik; manuel yedek |
| Store reddi | Restore purchases + gizlilik + KVKK baştan hazır |
| Mevsimsellik (Eylül penceresi) | Faz 1/3/4 kritik yol; gecikme = pencere kaçar |
| Şema sapması | §4 gerçek migration'larla hizalı; yeni tablo migration + K7 snapshot |

---

## 15. Başarı metrikleri

- **Alışkanlık:** Bu Hafta günlük açılma, ekranda süre (kısa = iyi, hedef <30 sn)
- **Değer:** yaprak/etkinlik/analiz/evrak üretimi, "işledim" oranı
- **Dönüşüm:** paywall → Pro, Eylül/Şubat kampanya
- **Güven:** kazanım hata bildirimi (hedef: 0)
- **Maliyet:** havuz hit (~%100), kullanıcı başına AI = 0

---

## 16. Dağıtım (ilk 6 ay)

- **Branş Telegram/WhatsApp grupları** — organik tanıtım (5-10 büyük grup).
- **2-3 influencer öğretmen** — revenue-share veya hediye lifetime.
- **Çıktıda "Yaver ile hazırlandı" + WhatsApp paylaş** — maliyetsiz viralite.
- **Ay 6+:** sendika partnership (ör. Eğitim-Bir-Sen ~380K üye) · özel okul B2B Pro lisans.

---

## 17. Doküman hiyerarşisi

- **`PLAN.md`** (bu dosya) — ürün + mimari + yol haritası + uygulama detayı (faz, şema, timeline). **Tek kaynak, çakışmada kazanır.**
- `CLAUDE.md` — davranış + teknik kurallar (PLAN.md'ye işaret eder).
- `STATUS.md` — nerede kaldık, sıradaki adım.
- `DECISIONS.md` — karar günlüğü (append-only).
- **Arşiv (tarihsel, bağlayıcı değil):** `archive/SPEC_FULL.md`, `archive/PRD.md`, `archive/STRATEJI_V2.md`.
