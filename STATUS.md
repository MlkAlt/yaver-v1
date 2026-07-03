# Yaver — Proje Durumu

**Son güncelleme:** 02.07.2026 — Oturum 73 (devam)

## Şu An Ne Yapıyoruz

### Oturum 73 yapılanlar (01-02.07.2026) — Kulüp Evrakları Tamamlama

**1. Kelime sadeleştirme (commit fa15887) ✅**
- `src/data/kulupYillikPlanlari.ts` — 76 kulüp × 9 ay
- "atölyesi" → "çalışması" (~120 geçiş, PowerShell toplu değiştirme)
- "semineri" → "sunumu" (~39 geçiş)
- Kalan 2 "atölye" formu ("konulu atölye", "uygulamalı atölye") → "çalışma"
- Faaliyet ilkesi korunuyor: sınıf içi, ek bütçe/izin yok, raporda birkaç cümle ispat

**2. Aylık Faaliyet Raporu modülü (commit c74c2d6) ✅**
- **Yeni dosya:** `src/data/aylikRaporHtmlSablon.ts`
  - `AylikRaporFormData` tipi
  - `RAPOR_AYLARI` — Ekim(1)...Haziran(9) sıralama
  - `planEtkinlikleriniRaporaCevir()` — her satıra "gerçekleştirildi" ekler
  - `aylikRaporHtmlOlustur()` — MEB formatı HTML (okul→müdürlüğüne mektubu, madde listesi, toplum hizmeti, danışman imzası)
- **SablonDoldurmaScreen.tsx** — `isAylikRapor` akışı eklendi (2 adım wizard):
  - Adım 1: Ay seçici (9 chip) + okul adı + danışman + rapor tarihi → ay seçilince o ayın etkinlikleri otomatik yüklenir
  - Adım 2: Yapılan çalışmalar listesi (düzenlenebilir) + toplum hizmeti textarea
- **EvraklarimScreen.tsx** — Kulüp Evrakları bölümüne "Aylık Faaliyet Raporu" kartı eklendi

**Referans:** Gerçek Kültür Edebiyat Kulübü raporları (Kasım + Şubat 2025-2026) incelenerek format doğrulandı.
**Tüm TypeScript hataları:** 0 ✅

---

### Sıradaki Adımlar (Kulüp Evrakları)

1. ~~**Toplum Hizmet Planı**~~ ✅ — Ayrı belge (AY | HAFTA | SÜRE | KONULAR VE ETKİNLİKLER | KATILANLAR | DÜŞÜNCE-DEĞERLENDİRME)
   - Referans: `evraklar/kulup_planlari/gezi-tanitim-ve-turizm-kulubu-toplum-hizmet-plani.docx` (Karatay TMTAL)
   - Yeni: `src/data/toplumHizmetHtmlSablon.ts` (`ToplumHizmetFormData`, `toplumHizmetHtmlOlustur`)
   - `kulupSablon.ts`'e `ToplumHizmetSatiri` tipi + `bosToplumHizmetSatiri()` eklendi
   - `kulupYillikPlanlari.ts`'e `kulupVarsayilanToplumHizmetSatirlari()` eklendi — mevcut yıllık plan verisinden (etkinlikler ilk satırı) otomatik türetir, HAFTA/SÜRE/KATILANLAR varsayılanlı
   - `SablonDoldurmaScreen.tsx`'te `isToplumHizmet` akışı (2 adım: Temel Bilgiler → Çalışma Planı, `kulup` akışının deseni tekrarlandı)
   - `EvraklarimScreen.tsx`'te üçüncü Kulüp Evrakları kartı eklendi
   - TypeScript: 0 hata ✅
2. ~~**Yoklama ve Karar Defteri**~~ ✅ — Öğrenci listesi + toplantı başına devam/karar
   - Referans: `evraklar/kulup_planlari/1847518-yoklama-ve-karar-defteri.doc`
   - Yeni: `src/data/yoklamaKararHtmlSablon.ts` (`YoklamaKararFormData`, `yoklamaKararHtmlOlustur`) — kapak sayfası + 28 satırlık öğrenci listesi tablosu + her toplantı için ayrı karar sayfası (gündem/karar metni/çalışma bilgisi/katılmayanlar/imza)
   - `kulupSablon.ts`'e `OgrenciSatiri` + `KararSatiri` tipleri eklendi
   - `SablonDoldurmaScreen.tsx`'te `isYoklamaKarar` akışı (3 adım: Temel Bilgiler → Öğrenci Listesi → Karar Kayıtları) — bu modülde plan verisinden ön doldurma yok (gerçek toplantı verisi, öğretmen elle girer)
   - `EvraklarimScreen.tsx`'te dördüncü Kulüp Evrakları kartı eklendi
   - TypeScript: 0 hata ✅
3. **Dilekçe bankası** — bekliyor, referans belge yok, kullanıcı kararı: sonraya bırakıldı

### Performans Notu modülü (bu oturumda eklendi) ✅

Kulüp evrakı değil, ana Evraklarım gridinde ayrı kart (`sablonId: 'performans'`).

- Referans: `evraklar/performans/` — 2 gerçek okul belgesi (1./2. performans + DKAB performans ödevi cetveli), hücre hücre incelendi
- Sadece 2 hazır şablon (kullanıcı kararı): **1. Performans Notu (Ödev)** — 10 kriter × 10 puan, **2. Performans Notu** — 8 kriter (20/20/10×6), gerçek MEB metniyle birebir
- Yeni: `src/data/performansSablon.ts` (`PerformansKriter`, `PerformansOgrenciSatiri`, `PERFORMANS_SABLONLARI`, `notuKriterlereDagit`)
  - **Otomatik dağıtım:** öğretmen tek bir "asıl not" girer, fonksiyon kriterlere ağırlıklı+rastgele dağıtır (toplam her zaman tam asilNot'a eşit, kriter üst sınırı aşılmaz) — test edildi (5 farklı not × 2 şablon, hepsi geçerli)
  - Manuel giriş de mümkün (öğretmen her kriteri elle girer)
- Yeni: `src/data/performansHtmlSablon.ts` — dikey (portrait) A4, dikey yazılı dar kriter sütunları (gerçek belgedeki gibi), müdür imzası opsiyonel (boşsa satır basılmaz), öğretmen imzası zorunlu
- `SablonDoldurmaScreen.tsx`'te `isPerformans` akışı (3 adım: Temel Bilgiler → Şablon Seç → Öğrenciler ve Puanlama, öğrenci başına oto/manuel toggle)
- `EvraklarimScreen.tsx` ana SABLONLAR gridine "Performans Notu" kartı eklendi (Award ikonu, catAmber)
- TypeScript: 0 hata ✅ — tsx ile örnek veri üretilip HTML çıktısı manuel doğrulandı
- **Görsel doğrulama (playwright ile ekran görüntüsü):** çıktıyı gerçekten render edip PNG'ye çevirerek kontrol edildi. Bulunan hata: `.kriter-th`'deki sabit `height:130px` uzun kriter metinlerinde taşıp h1/h2 başlığın üstüne biniyordu → sabit yükseklik kaldırıldı, satır içeriğe göre kendini büyütüyor artık. Düzeltme sonrası tekrar render edilip doğrulandı.

**Ölü kod temizliği:** `kulupYillikPlanlari.ts`'teki kullanılmayan `KULUP_ISIMLER` dizisi (66 isim, eski geliştirme aşamasından kalma, hiçbir yerde referans edilmiyordu) kaldırıldı. `placeholderProfil()` fonksiyonu korundu — `KULUP_PROFILLERI`'de karşılığı bulunamayan kulüp adları için güvenlik ağı olarak hâlâ gerekli (76/76 resmi kulübün tamamı `kulupler.json` ile birebir eşleşiyor, doğrulandı).

**Bu oturumda push edildi:** Toplum Hizmeti + Yoklama/Karar + ölü kod temizliği + Performans Notu — 5 commit, `origin/main`'e gönderildi.

**Build notu:** [[feedback_build_strateji]] — tüm evraklar bitmeden APK build yok, Expo Go test.

### ACİL — PDF kenar boşluğu / sayfa yönü mimarisi (2026-07-02, kullanıcı tespit etti)

**Sorun:** Performans Notu önizlemesinde (playwright screenshot) kenar boşluğu yok ve tablo yatay görünüyordu. Kök neden analizi:
- Ham HTML'i tarayıcıda screenshot aldım — `@page` CSS kuralı (size/margin) SADECE gerçek print/PDF anında uygulanır, ekran render'ında hiç etkisi yok. Bu yüzden önizleme yanıltıcıydı.
- **Ama asıl mimari soru hâlâ açık:** `SablonDoldurmaScreen.tsx`'teki her 7 `Print.printToFileAsync` çağrısı sabit `margins:{top:98,right:118,bottom:98,left:118}` (native, points) geçiyor — AYNI ZAMANDA her HTML şablonunun kendi `@page{margin:...}` kuralı da var (şablona göre 14mm-24mm arası değişken). Bu ikisi expo-print'te çakışıyor mu (çift boşluk), biri diğerini mi eziyor — gerçek cihazda test edilmeden bilinmiyor.

**Plan (sıradaki oturumda yapılacak):**
1. Playwright `page.pdf()` ile (raw HTML screenshot değil) gerçek `@page`'i uygulayan PDF önizleme üret — böylece gerçeğe yakın kontrol mümkün olur.
2. Margin mimarisini TEK kaynağa indir: ya tüm şablonlardan `@page margin` kaldırılıp sadece JS `margins` param kullanılacak, ya da JS margin sıfırlanıp her şablonun kendi `@page` değeri tek kaynak olacak. Mümkünse gerçek cihaz/emülatörde expo-print davranışı doğrulanmalı.
3. Bu düzeltme **8 evrak şablonunun tamamına** uygulanmalı (SOK, Zümre, Veli, Kulüp Yıllık Plan, Aylık Rapor, Toplum Hizmeti, Yoklama/Karar, Performans) — tek modüle özel yama değil, tutarlı kural.
4. Sayfa yönü (dikey/yatay) muhtemelen sorun değil — hiçbir `@page` kuralında `landscape` yok — ama gerçek PDF render ile doğrulanacak.

**Örnek çıktılar:** `evraklar/onizleme/performans_birinci.png`, `performans_ikinci.png` (+ .html) — henüz commit'lenmedi, kullanıcı inceledi.

**Karar (2026-07-03):** Mimari A seçildi — `@page` CSS tek kaynak. `SablonDoldurmaScreen.tsx`'teki 7 `Print.printToFileAsync` çağrısından sabit native `margins:{98,118}` kaldırıldı; her şablonun kendi `@page margin` değeri (12-30mm) artık tek kaynak. Commit `3b218d2`, branch `feature/evrak-pdf-margin-mimarisi`, push edildi. TypeScript 0 hata. **Bekliyor:** kullanıcı gerçek cihazda test edecek (Expo Go). Sorun çıkmazsa main'e merge.

**Sayfa yönü (2026-07-03):** Kulüp Yıllık Planı `@page` → `A4 landscape` (16mm 18mm) — başlığı zaten "YILLIK ÇALIŞMA PLANI", 4 sütunlu geniş tablo yatayda daha rahat okunuyor. Toplum Hizmeti Planı ve Yoklama/Karar Defteri'ne dokunulmadı (yıllık plan değiller, kullanıcı onayı bekleniyor — istenirse ayrıca yatay yapılabilir). Aylık Faaliyet Raporu zaten dikeydi.

**Performans Notu UX sadeleştirmesi (2026-07-03):** Sürtünme şikayeti üzerine akış 3 adımdan 4 adıma çıkarıldı ama tıklama sayısı azaldı: `['Temel Bilgiler','Şablon Seç','Öğrenci Listesi','Puanlama']`.
- **Öğrenci Listesi** adımı: tek bir çok satırlı textarea, her satır bir öğrenci (`123 Ahmet Yılmaz` veya sadece `Ahmet Yılmaz`). Liste sınıf adına göre (`@yaver/performans_liste_<SINIF>`) AsyncStorage'a otomatik kaydediliyor, aynı sınıfa tekrar girildiğinde otomatik geri yükleniyor.
- **Puanlama** adımı: öğrenci başına ayrı "Otomatik/Manuel" seçimi kaldırıldı — tüm sınıf için tek, baştan seçilen global mod var. Otomatik modda tek "Tümünü Dağıt" butonu tüm öğrencilerin asıl notlarını aynı anda kriterlere dağıtıyor (öğrenci başına ayrı "Dağıt" tuşuna basma gerekmiyor, istenirse yine tek tek de düzeltilebilir).
- İsim/okul no artık listeden geldiği için Puanlama adımında ekleme/silme yok — düzenleme Öğrenci Listesi adımına geri dönülerek yapılır.
- `POgrenciUI.mod` alanı kaldırıldı, kullanılmayan `bosPerformansOgrencisi` import'u temizlendi. TypeScript 0 hata.
- Aynı branch'e (`feature/evrak-pdf-margin-mimarisi`) commit'lenecek — henüz push edilmedi.

**PDF önizleme + kenar boşluğu ince ayarı (2026-07-03):** Kullanıcı geri bildirdi — PDF oluşturulur oluşturulmaz direkt paylaşım açılıyordu, önce görebilmek istedi; SOK/veli/zümre/aylık rapor sağ-sol kenar boşlukları da fazla açıktı.
- 8 evrak türünün tamamında `Sharing.shareAsync(...)` → `Print.printAsync({ uri })`: artık native PDF önizleme ekranı açılıyor (sayfalı, yakınlaştırılabilir), paylaşım otomatik değil — kullanıcı önizlemeden kendi seçiyor. Yeni paket eklenmedi. `expo-sharing` import'u `SablonDoldurmaScreen.tsx`'ten kaldırıldı (başka ekranda — `SinavAnaliziScreen.tsx` — hâlâ kullanılıyor, paket kaldırılmadı).
- Sağ/sol kenar boşluğu 20mm'yi aşan 4 şablon düzeltildi: SOK, Veli Tutanağı, Zümre Tutanağı (30mm→20mm), Aylık Faaliyet Raporu (24mm→20mm). Kulüp/Toplum Hizmeti/Yoklama-Karar/Performans zaten ≤20mm'ydi.
- TypeScript 0 hata.

---

### Sıradaki Adımlar (genel — öncelik sırasıyla)

0. **PDF kenar boşluğu/sayfa yönü mimarisi** — yukarıya bak, kullanıcı tarafından tespit edildi, sonraki oturumda ele alınacak
1. **Rehberlik evrak ailesi** — kullanıcı 3 alt modül planlıyor, örnekleri sağlayacak (henüz gelmedi):
   - **Yıllık Rehberlik Planı**
   - **Aylık Rehberlik Raporu** — referans zaten var: `evraklar/rehberlik/melik-sibil-11-sinif-eylul-rehberlik-raporu-1782571914.docx` (sınıf/ay/rapor no/tarih, yıllık plana göre işlenen kazanımlar, yapılan etkinlikler, veli/öğrenci görüşme tablosu, imza)
   - **Dönem Sonu / Yıl Sonu Raporu**
   - Kural: her biri için kullanıcıdan gerçek örnek belge alınacak, hücre/paragraf düzeyinde incelenip ona göre uygulanacak (tahminle şablon yazılmayacak — bkz. [[DECISIONS.md]] "referans disiplini" kararı)
2. **Dilekçe bankası** — bekliyor, referans belge yok. Kullanıcı ya örnek dilekçe sağlayacak ya da kapsamı (izin/mazeret/nakil/başka) netleştirecek.

---

**Strateji konsolide edildi → tek kaynak: `PLAN.md`.** Dört çakışan doküman (SPEC_FULL / PRD / STRATEJI_V2 / ROADMAP) tek uygulanabilir plana indirgendi; uygulama detayı (faz/şema/timeline) PLAN.md'ye katıldı, ROADMAP.md kaldırıldı; ilk üçü `archive/`'da.

**Kilitlenen kararlar:**
1. **Gelir:** yıllık abonelik (ana) + lifetime (çapa/erken-kuş).
2. **İçerik:** önceden üretilmiş havuz, kullanıcı-başına canlı AI yok (marjinal maliyet ≈ 0).
3. **Lansman:** dört sütun (defter görünümü · çalışma yaprağı/etkinlik · sınav analizi · resmi evrak) tam olunca tek seferde.
4. **Canlı AI:** v1'de yok; v2'de tüketilebilir kredi paketi (lifetime'ı bozmaz).
5. **Hedef:** Ağustos sonu store review, Eylül zirvesinde canlı (PLAN.md §11).

**Kod durumu:** V1.x ~%80 hazır. APK test edilebilir (Build `49a099c2`). Evrak: zümre/ŞÖK/veli tutanak wizard'ları çalışıyor (doğru mimari — şablon + slot, AI yok).

**Sınav Analizi (Faz 7) 🟡:** 5 adımlı sihirbaz + soru→kazanım eşleştirme + başarı hesabı + tedbir + PDF + sınıf bazlı öğrenci hafızası çalışıyor (Claude Code). **+ Bu oturumda uygulama-içi arşiv eklendi (yerel/AsyncStorage):** yeni `src/data/sinavArsiv.ts` + SinavAnaliziScreen'de otomatik kaydet, "Geçmiş Analizler" listesi (yeniden aç/sil), toast. Arşiv yeri kararı: **yerel** (login/sürtünme yok, offline; Supabase senkronu auth gelince). Kalan: Supabase `sinav_analizleri` senkronu, CSV (ertelendi), çalışma yaprağı önerisi (havuz), paywall (Faz 6).

> ⚠️ Bu oturumun `src/` değişiklikleri (sinavArsiv.ts + SinavAnaliziScreen.tsx) commit'lenmeli. Tip kontrolünü kendi ortamında/Claude Code'da yap — buradaki sandbox tsc dosyaları kırpık okuduğu için güvenilmez sonuç veriyor.

**Sıradaki (PLAN.md §10):** Faz 3 — sahte `hazirSayisi` sayaçlarını (PlanimScreen, 6 yer) kaldır + Bu Hafta'yı saf defter görünümüne sadeleştir. Paralel Faz 1 — içerik havuzu pilot (Matematik) → `uretim_cache` genişletme / `etkinlik_havuzu` + QC. Detaylı fazlar + Eylül timeline: `PLAN.md` §10-11.

---

### (Aşağısı: oturum 71 ve öncesi tarihsel kayıt)

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
