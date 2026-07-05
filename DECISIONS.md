# Yaver V1 — Karar Günlüğü

---

## Repo Hijyeni

### 2026-07-06 — Büyük referans dosyaları git'e commit edilmeyecek (repo şişirme protokolü)
**Olay:** Rehberlik etkinlik kitabı taraması için eklenen 7 PDF (~400MB toplam, 9-76MB/dosya) yanlışlıkla `git add -A` ile commit'e girdi, push zaman aşımına uğradı. Repodaki diğer referans belgeler (xlsx/docx/doc) hepsi <400KB — bu PDF'ler örüntünün tamamen dışındaydı.
**Karar/Protokol:**
1. Referans/kaynak dosyası eklerken (PDF/xlsx/docx/görsel tarama vb.) commit'ten önce boyut kontrol edilir. **~5MB üstü tek dosya asla düşünmeden commit edilmez.**
2. Bir kaynak dosya yalnızca tek-seferlik veri çıkarımı için kullanılıyorsa (script ile `.ts`'e işleniyorsa, bkz. `scripts/extract-*.cjs`) ham dosyanın kendisi git geçmişinde tutulmaz — çıkarılan veri (`src/data/*.ts`) tek kaynaktır, ham dosya yerelde/`.gitignore`'da kalır.
3. `git add -A` sonrası commit'ten ÖNCE `git status`/`git diff --stat` ile büyük/beklenmedik dosya var mı gözle kontrol edilir — özellikle büyük oturumlarda çok sayıda dosya birikmişse.
**Uygulama:** `.gitignore`'a `evraklar/rehberlik/*.pdf` eklendi (yorum: neden). Zaten önceki bir commit'te push edilmiş 9.6MB'lık tek PDF (`11. sınıf rehberlik etkinlikleri.pdf`) geriye dönük temizlenmedi (history rewrite kapsam dışı, kullanıcı istemedi) — sadece ileriye dönük tekrarı önleniyor.

---

## Ajan Organizasyonu

### 2026-07-05 — ui-craftsman'ın "sadece stil" kısıtı kaldırıldı, zorunlu plan-onay süreci eklendi
**Karar:** Kullanıcı, ui-craftsman'ın UX/UI kalitesini zayıf bulduğunu belirtti — kök neden, agent'ın kendi kuralının ("fonksiyonu ASLA bozma, sadece stil/hiyerarşi") onu kozmetik cilayla sınırlamasıydı; component yapısı, etkileşim modeli, bilgi mimarisi değiştiremiyordu. `ui-craftsman.md` güncellendi: artık veri/iş mantığı dışında (Supabase, PDF üretim, business logic) her şeyde tam yetkili — ama HER GÖREVDE önce plan+gerekçe sunup onay almadan kod yazamaz (Faz 1: plan, Faz 2: sadece onay sonrası uygulama). `/ux-critic` hem plan öncesi denetim hem iş-sonrası kalite kontrolü için kullanılıyor.
**Sebep:** Ayrı bir "UX mimarisi" ajanı kurmak yerine (koordinasyon yükü + token/stil kararlarında çelişki riski) tek ajanın yetkisini genişletip onay kapısıyla dengelemek tercih edildi. Kullanıcı: "tamamen özgür olsun ama kendi kendine değişiklik yapmasın, yapılacaklar listesini her seferinde onayıma sunsun."
**Not:** `ux-critic` bir skill (proje dışı/plugin kaynaklı), içeriği düzenlenemedi — süreç ui-craftsman'ın orkestrasyonu üzerinden kontrol ediliyor.

---

## Evrak Modülleri

### 2026-07-05 — Rehberlik Aylık Rapor: Eylül formatından Haziran (haftalık tablo) formatına geçiş
**Karar:** İki farklı gerçek referans belge bulundu — Eylül raporu (3 serbest liste: Çalışmalar/Kazanımlar/Etkinlikler, ilk build bu formata göre yapılmıştı) ve Haziran raporu (`evraklar/rehberlik/haziran aylık rehberlik.doc`, tamamen farklı: SIRA|TARİH|YETERLİK ALANI|KAZANIM|ETKİNLİĞİN ADI haftalık tablo + Test/Anket + Diğer Çalışmalar). Kullanıcı Haziran formatını seçti, tüm modül buna göre yeniden yazıldı (`rehberlikSablon.ts`, `rehberlikHtmlSablon.ts`, `rehberlikVeriZinciri.ts`, `SablonDoldurmaScreen.tsx`).
**Veri kaynağı sorunu ve çözümü:** "Yeterlik Alanı"/"Etkinlik Adı" hiçbir mevcut kaynakta (xlsx yıllık planlar) yoktu — kullanıcı 7 ORGM etkinlik kitabı PDF'i ekledi. `pdftotext` (poppler) Türkçe karakterleri bozduğu için (ş/ğ/ı/ü/ö/ç kayboluyor) `pdfjs-dist` kullanıldı (doğru çıkarıyor, doğrulandı). Koordinat-bazlı etiket/değer eşleştirmesiyle (sol sütun x≈47 etiket, sağ sütun değer, aynı y) 432/562 plan satırı için gerçek veri çıkarılıp entegre edildi. Script kalıcı: `scripts/extract-rehberlik-etkinlik.cjs`.
**Referans disiplini notu:** Eşleşmeyen ~130 satırın çoğu zaten kazanım değil (idari/tatil/form); yalnızca ~6 gerçek kazanım ifade farkından eşleşmedi, uydurulmadı, boş bırakıldı.
**Cihazda doğrulanmadı** — sıradaki test turunda kontrol edilecek.

### 2026-07-05 — PDF margin mimarisi güncellemesi: @page tek kaynak YETERSİZ, width/height de gerekli
**Karar:** 2026-07-03'teki "@page CSS tek kaynak" kararı geçersiz kılınmadı ama eksikti. Kök neden: `expo-print`'in `printToFileAsync` API'si `orientation` parametresi almıyor — sayfa boyutu native tarafta yalnızca `width`/`height` (px, 72 PPI) ile belirleniyor, varsayılan 612×792 (US Letter dikey). `@page { size: A4 landscape }` CSS'i bu native page-size'ı override etmiyor. Bu yüzden yatay olması gereken 3 belge (Kulüp Yıllık Planı, Toplum Hizmeti Planı, Yıllık Rehberlik Planı) gerçek cihazda dikey çıkıyordu.
**Çözüm:** Yeni ortak `src/lib/pdfOnizleme.ts` → `pdfOnizlemeAc(html, yatay)`. A4 dikey=595×842, A4 yatay=842×595 (px). Tüm `printToFileAsync` çağrıları (SablonDoldurmaScreen 12 + SinavAnaliziScreen 1) bu helper'a geçirildi.
**Güncel kural:** `@page margin` hâlâ kenar boşluğu için tek kaynak; sayfa BOYUTU/YÖNÜ için native `width/height` de zorunlu — ikisi birlikte çalışıyor, biri diğerinin yerini tutmuyor.

### 2026-07-05 — Margin standardı sıkılaştırıldı
**Karar:** Kullanıcı ikinci turda da "kenarlarda çok boşluk var" dedi — önceki "≤20mm" kuralı yetersizdi. Yeni standart: **dikey 14mm/16mm, yatay 12mm/14mm** (13 şablonun tamamına uygulandı). `performansHtmlSablon.ts` zaten daha dardı (14mm/12mm), dokunulmadı.

### 2026-07-05 — Rehberlik veri zinciri: Yıllık Plan → Aylık Rapor → Dönem Sonu
**Karar:** Üç modül artık AsyncStorage üzerinden bağlı. Aylık Rapor'da sınıf+ay girilince: önce o sınıf+ay için daha önce kaydedilmiş manuel veri (varsa) yüklenir; yoksa Yıllık Plan'dan o ayın numaralı kazanımları öneri olarak gelir. "Raporu Oluştur"da güncel veri `@yaver/rehberlik_aylik_<sinif>_<ay>` anahtarıyla kalıcı saklanır. Dönem Sonu Raporu'nda sınıf+dönem seçilince, dönemin ilgili aylarının (I=Eylül-Ocak/ay no 1-5, II=Şubat-Haziran/ay no 6-10, Yıl Sonu=1-10) kayıtları toplanır: her ay için manuel kayıt varsa o kullanılır, yoksa plandan türetilen otomatik "işlenmiş" sayılır. Toplanan kazanımlarla plandaki tüm kazanımlar karşılaştırılıp işlenmeyenler "Kısmen/Hayır" + açıklama olarak otomatik öneriliyor.
**Sebep:** Kullanıcı: "aylık raporlarda rehberlik planından gelen içerik ile otomatik oluşacak, manuel faaliyetler varsa onlar çekilir yoksa plan-aylık rapor-dönem sonu raporu yolu izlenir." Zaten doldurulmuş alanların üzerine yazılmıyor (pristine-check).
**Uygulama:** `src/data/rehberlikVeriZinciri.ts`.

### 2026-07-05 — Kulüp Karar Defteri: ilk toplantı için gerçek örnekten varsayılan içerik
**Karar:** Yerel referans belge (`1847518-yoklama-ve-karar-defteri.doc`) tamamen boş bir MEB şablonuydu, gerçek gündem/karar metni içermiyordu. Kullanıcı izniyle web araştırması yapıldı, gerçek dolu bir kulüp karar defteri örneği bulundu (Bilim Fen ve Teknoloji Kulübü, gerçek okul, 5 toplantı kaydı). İlk toplantının evrensel deseni (Yoklama → temsilci/sekreter seçimi → yıllık çalışma programı → görev/usul açıklaması → dilek ve temenniler) `kulupSablon.ts`'e `ilkToplantiVarsayilanGundem()`/`ilkToplantiVarsayilanKarar()` olarak eklendi; `bosKararSatiri(1)` artık bunları döndürüyor.
**Sebep — genel felsefe netleşti:** "Çoğu evrak hazır-varsayılanlı gelmeli, öğretmen mümkün olduğunca sadece onaylasın." Referans yoksa artık sırasıyla: (1) kullanıcıdan iste, (2) kullanıcı izin verirse web araştırması yap — tamamen referanssız/boş bırakmak yerine.
**Kapsam sınırı:** Yalnızca ilk toplantı (no=1) şablonlu; sonraki toplantılar gerçekten o toplantıya özel olduğundan (kim geldi, hangi karar alındı) hâlâ boş — bu, önceki "gerçek toplantı verisi türetilemez" kararıyla çelişmiyor, sadece İLK toplantının MEB'de standart/tekrarlayan olduğunu kabul ediyor.

### 2026-07-05 — Form input tasarımı: pill radius bug
**Karar:** `SablonDoldurmaScreen.tsx`'teki paylaşılan `s.input` stili `borderRadius: radius.btn` (=100, tam pill) kullanıyordu — bu değer buton için doğruydu ama text input'a (özellikle çok satırlı `textArea`) uygulanınca yazı yuvarlak köşelere taşıyordu. `radius.sm` (10) ile değiştirildi. Ayrıca input'u saran kartlar (`soruCard`, `ogretmenRow`) input ile AYNI krem arka plana (`colors.bg`) sahipti — sınır görünmüyordu ("düz yazı gibi" hissi). Kartlar artık beyaz+border (`colors.surface` + `colors.border`), input krem sabit kaldı — hem beyaz ekranda hem kart içinde kontrastlı görünüyor.
**Kapsam:** Tek `s` StyleSheet objesi 12 sihirbazın hepsinde paylaşıldığı için düzeltme hepsine yansıdı. Açık: focus state (onFocus/onBlur ring) eklenmedi.

### 2026-07-05 — EvraklarimScreen: Kulüp/Rehberlik evrakları ana ızgaraya taşındı
**Karar:** Kulüp (4) + Rehberlik (3) evrak kartları, ayrı bir yatay liste-satırı stilinden (`kulupCard`) çıkarılıp ana `SABLONLAR` ile aynı kare chip grid stiline (`sablonCard`) geçirildi. Alt başlıklar (KULÜP/REHBERLİK EVRAKLARI) korundu ama artık grid render ediyor.
**Sebep:** Kullanıcı: "diğerleri gibi kendi chip'lerinin içinde olsa yukarıda gözükse iyi olur." KulupSheet açma davranışı ve navigation param'ları aynen korundu.

### 2026-07-04 — Q2 cihaz testi geri bildirimi: 7 iş kalemi (oturum 76'da işlenecek)
**Kullanıcı testi:** `feature/evrak-pdf-margin-mimarisi` gerçek cihazda Expo Go ile test edildi. Push/merge YAPILMADI — önce geri bildirim işlenecek.
**Bulgular ve kararlar (detay STATUS.md "oturum 76"):**
1. Form input'lar "düz yazı" gibi, taşan gri kutu var → gerçek form-input UI/UX gerekiyor (tüm sihirbazları etkileyen merkezi düzeltme).
2. Sınav Analizi'nde önizleme yok, direkt paylaşıma açıyor — diğer 10 evrak `Print.printAsync` önizlemesine geçmişken bu ekran unutulmuş.
3. **Yatay (@page landscape) render'da dikey çıkıyor** — expo-print native tarafı CSS orientation'ı görmezden geliyor olabilir; muhtemel çözüm `printToFileAsync`'e explicit width/height. **Kural netleşti: "plan" olan her evrak yatay, rapor/defter/tutanak/dilekçe dikey.**
4. **Rehberlik veri zinciri kurulacak:** Yıllık Plan → Aylık Rapor (AsyncStorage'da sınıf+ay bazlı kalıcı, öğretmen düzenleyebilir) → Dönem Sonu Raporu (dönemin ilgili aylarını otomatik toplar, manuel varsa manuel'i kullanır yoksa plandakini).
5. **Kulüp Karar Defteri'ne hazır varsayılan içerik eklenecek** — önceki "gerçek toplantı verisi türetilemez, boş kalsın" kararı kısmen revize edildi: en azından tipik/örnek gündem-karar şablonu ile öğretmen hiç dokunmadan da kullanabilmeli. **Genel felsefe (kullanıcı vurguladı):** çoğu evrak zaten hazır-varsayılanlı gelmeli, öğretmen sadece onaylasın.
6. Margin'ler hâlâ fazla geniş hissediyor — önceki "≤20mm" kuralı yetersiz, daha dar standart gerekiyor.
7. EvraklarimScreen'de Kulüp/Rehberlik bölümleri ayrı/altta/farklı stilde — ana ızgaradaki chip/kart formatına taşınacak.
**Sıra:** P1(input)+P7(IA) → P3(landscape)+P6(margin) → P2(sınav analizi) → P4(veri zinciri) → P5(karar defteri içerik).

### 2026-07-04 — Ajan organizasyonu + şef-conductor modeli
**Karar:** Kalan işler için dünya-çapı mobil stüdyo gibi 5 rollü ajan ekibi kuruldu (`.claude/agents/`: delivery-lead, evrak-engineer, ui-craftsman, qa-verifier, refactor-engineer) + dosya-tabanlı koordinasyon (`.claude/orchestration/board.json` + handoff/ + `OPERATING_MODEL.md`) + `scripts/board.cjs` (status/next/gate).
**Orkestrasyon gerçeği:** Claude Code'da alt-ajanı yalnızca ana oturum (şef) başlatır; "biri bitince sıradakini tetikle" = ajan biter → harness şefe haber verir → şef sıradakini başlatır. Script daemon DEĞİL, durum panosu + tsc geçidi. Paralellik yalnız **ayrık dosya setlerinde** (ör. PlanimScreen ↔ SablonDoldurma). Paylaşılan hot dosyaların (SablonDoldurma/Evraklarim) wiring'i hep şef tarafından serileştirildi — sıfır çakışma.

### 2026-07-04 — Rehberlik + Dilekçe evrak ailesi (E1–E4), hepsi referanstan
**Karar:** Dört yeni evrak modülü, her biri `evraklar/` altındaki gerçek okul belgesinden hücre/paragraf düzeyinde çıkarılarak yazıldı; tahminle şablon yok.
- **E1 Aylık Rehberlik Raporu:** önceki oturumda tahminle yazılmış `rehberlik*Sablon.ts` çöpe atıldı, gerçek Eylül raporu docx'inden YENİDEN yazıldı (3 bölümlü AY tablosu + veli/öğrenci görüşme + 3 imza).
- **E2 Yıllık Rehberlik Planı:** 12 xlsx ekstraksiyon → `rehberlikYillikPlanlari.ts`; yatay HTML (plan=yatay). 9-12'de 36 etkinlik, 1-8'de numaralandırma kaynakta yok → `etkinlikNo=null` (uydurulmadı).
- **E3 Dönem Sonu Raporu:** 7 bölümlü doldurulabilir form; faaliyet tablolarında otomatik toplam.
- **E4 Dilekçe:** curated 4 tür (mazeret/ücretsiz/nakil/genel) — performans modülü mantığı (az+net). Mevcut "Dilekçe" grid kartına bağlandı.
**BEP silindi:** `bep*.ts` referanssızdı (gerçek dolu örnek yoktu), tahminle yazılmıştı → silindi. Kural: gerçek örnek yoksa modül yazılmaz.

### 2026-07-04 — E2 yıllık plan: kaynak verisi AYNEN korunur
**Karar:** MEB xlsx'lerindeki hatalar (lise bahar dönemi yıl typo'su 2025→2026, yanıltıcı sheet adları, "ÖRNEK PLAN" bayat sheet'leri) düzeltilmedi/atlandı; metin ve tarih birebir alındı. Tek normalizasyon: hücre-içi word-wrap newline'ları tek boşluğa indirildi.
**Sebep:** Referans disiplini — kaynağı "düzeltmek" güven/izlenebilirlik riski. Yıl typo'su bilinçli açık bırakıldı; istenirse ayrı bir pass ile yalnız lise düzeltilebilir.

### 2026-07-04 — Toplum Hizmeti Çalışma Planı yatay (oturum 74 açık sorusu kapandı)
**Karar:** Toplum Hizmeti Çalışma Planı `@page` → `A4 landscape`. Yoklama/Karar Defteri dikey kaldı.
**Sebep:** Kullanıcı netleştirdi: "bütün planlar yatay; rapor-defter-tutanak-dilekçe dikey." Toplum Hizmeti bir plan → yatay; defter → dikey.

### 2026-07-03 — PDF margin mimarisi: `@page` CSS tek kaynak
**Karar:** `SablonDoldurmaScreen.tsx`'teki 7 `Print.printToFileAsync` çağrısından sabit native `margins:{top:98,right:118,bottom:98,left:118}` kaldırıldı. Her şablonun kendi `@page margin` değeri (HTML dosyasında tanımlı) artık tek kaynak.
**Sebep:** İki farklı margin mekanizması (native param + CSS `@page`) aynı anda vardı, hangisinin kazandığı/çakıştığı platforma göre belirsizdi. `@page` zaten her belgeye özel düşünülerek ayarlanmıştı (dar tablolu Performans 12mm, resmi tutanaklar 25-30mm) — tek kaynak olması daha esnek.
**Ek düzeltme (aynı oturum):** SOK/Veli/Zümre/Aylık Rapor'da sağ-sol kenar boşluğu 30mm/24mm idi, kullanıcı "maksimum 2cm" dedi → hepsi 20mm'ye çekildi.

### 2026-07-03 — Kulüp Yıllık Planı yatay (landscape)
**Karar:** Sadece Kulüp Yıllık Planı `@page` → `A4 landscape`. Toplum Hizmeti Planı ve Yoklama/Karar Defteri'ne dokunulmadı.
**Sebep:** Kullanıcı "yıllık planlar yatay olacak, raporlar dikey olacak" dedi. Kulüp Yıllık Planı'nın başlığı zaten "YILLIK ÇALIŞMA PLANI" — net eşleşme. Diğer ikisi geniş tablolu olsa da "yıllık plan" değil (biri çalışma planı, biri defter) — netleştirme sorusu yanıtsız kaldı, dokunulmadı. **Açık:** kullanıcı onayı gelirse bu ikisi de yatay yapılabilir.

### 2026-07-03 — Performans Notu: öğrenci listesi kalıcı + sınıf geneli puanlama modu
**Karar:** Öğrenci isimleri artık tek bir çok satırlı metin alanına (bir satır = bir öğrenci, `123 Ahmet Yılmaz` veya sade `Ahmet Yılmaz`) toplu giriliyor ve sınıf adına göre (`@yaver/performans_liste_<SINIF>`) AsyncStorage'da saklanıp aynı sınıfa tekrar girildiğinde otomatik geri yükleniyor. Otomatik/Manuel puanlama modu öğrenci başına değil, tüm sınıf için tek seferde seçiliyor; Otomatik modda "Tümünü Dağıt" tek tuşla tüm öğrencilerin notlarını aynı anda dağıtıyor.
**Sebep:** Kullanıcı sürtünme şikayeti: her öğrenci için ayrı kart açıp isim girme + tek tek "Dağıt" tuşuna basma gereksiz tekrar. İsim girişi ile not girişi ayrı adımlara bölündü (`P_ADIMLAR`: Temel Bilgiler → Şablon Seç → Öğrenci Listesi → Puanlama).
**Uygulama:** `POgrenciUI.mod` alanı kaldırıldı (global `pMod` state'e taşındı), `bosPerformansOgrencisi` (kullanılmayan) import'u temizlendi.

### 2026-07-03 — PDF paylaşımı yerine önce native önizleme
**Karar:** 8 evrak türünün tamamında `Sharing.shareAsync(uri, {...})` → `Print.printAsync({ uri })`. `expo-sharing` importu `SablonDoldurmaScreen.tsx`'ten kaldırıldı (paket kendisi kaldırılmadı — `SinavAnaliziScreen.tsx` hâlâ kullanıyor).
**Sebep:** Kullanıcı: "PDF oluşturur oluşturmaz direkt paylaşıma açıyor, önce görebilmemiz lazım." `Print.printAsync` yeni paket gerektirmeden OS'un native PDF önizleme/print ekranını açıyor (sayfalı, yakınlaştırılabilir); paylaşım artık otomatik değil, kullanıcı önizlemeden sonra kendi seçiyor.

---

### 2026-07-02 — Performans Notu: sadece 2 sabit şablon + otomatik dağıtım
**Karar:** Performans Notu modülünde kriter özelleştirme yok — sadece "1. Performans Notu (Ödev)" (10 kriter × 10 puan) ve "2. Performans Notu" (8 kriter, 20/20/10×6) şablonları, gerçek MEB belge metniyle birebir. Öğretmen kriter ekleyip/çıkaramaz.
**Sebep:** Kullanıcı net talep etti — kapsamı daraltmak istedi, özel kriter oluşturma karmaşıklık katardı.
**Otomatik dağıtım:** Öğretmen tek bir "asıl not" girer, `notuKriterlereDagit()` kriterlere ağırlıklı+rastgele dağıtır (toplam her zaman tam nota eşit, kriter üst sınırı aşılmaz). Manuel giriş de destekleniyor (öğretmen isterse her kriteri elle girer).
**Çıktı:** Dikey (portrait) A4 — kullanıcı yatayı reddetti. Öğretmen imzası zorunlu, okul müdürü imzası opsiyonel (boşsa PDF'te o satır hiç basılmaz).
**Uygulama:** `src/data/performansSablon.ts` + `performansHtmlSablon.ts`, `SablonDoldurmaScreen.tsx` `isPerformans` akışı (3 adım). Ana Evraklarım gridinde ayrı kart — kulüp evrakı değil.

### 2026-07-02 — Kulüp evrak modülleri: plan verisinden otomatik doldurma, sadece "gerçekten türetilebilirse"
**Karar:** Toplum Hizmeti Çalışma Planı, `kulupYillikPlanlari.ts`'teki mevcut aylık plan verisinden otomatik ön doldurma alıyor (metin türetilebilir içerik). Yoklama ve Karar Defteri'nde ise otomatik doldurma YOK — çünkü içerik (kim geldi, hangi karar alındı) gerçek toplantı verisi, plandan türetilemez.
**Sebep:** "Yaver hazırlar, öğretmen onaylar" ilkesi sadece gerçekten türetilebilir içerik için geçerli; uydurma/placeholder veri üretmek güven kırar.
**Referans disiplini:** Her yeni kulüp evrak modülü öncesi `evraklar/` klasöründe gerçek okul belgesi arandı, hücre hücre/paragraf paragraf incelendi (antiword/openpyxl/python-docx ile), tahminle şablon yazılmadı.

---

## Veri

### 2026-06-20 — Almanca/Fransızca lise CEFR → sinif mapping
CEFR seviyesi → sinif: A1=9, A2=10, B1=11, B2=12. Maarif modeli değil, yabancı dil müfredatı. Tüm sinif_tipi=normal, program=null.

### 2026-06-20 — Encoding fix hatası (almanca/fransızca lise)
Dosyalar UTF-8 + doğru karakterlerle geldi. Fix script yanlışlıkla doğru UTF-8 metni bozdu (ä/ü → U+FFFD). Kural: yeni JSON dosyalarda metne dokunma, sadece yapısal alanları (sinif, sinif_tipi, program, secmeli) düzelt.

---

## UX & Veri

### 2026-06-14 — Seçmeli ders / sinif=0 stratejisi
- Tek sınıflı seçmeli (Mantık=10, Çağdaş Türk=12, İklim-Çevre=10): sinif DB'de düzeltildi (Migration 069)
- Çok sınıflı seçmeli (Astronomi, Psikoloji, Dini Musiki, Ebru vb.): sinif=0 kaldı, planUret post-fetch remap ile öğretmenin `siniflar[0]`'ına atanıyor
- planUret: seçmeli ders seçildiğinde `sinif_tipi IN ('normal','secmeli')` + sinif=0 OR filtresi

### 2026-06-14 — EkDerslerScreen öncelik sistemi
Müzik/Görsel/BEO: `oncelik:'genellikle'` → varsayılan seçili. İngilizce/DKAB: `oncelik:'nadiren'` → seçisiz, altta. Başlık yok, sıralama yeterli.

### 2026-06-14 — sinifLabel util + İngilizce lise hazırlık
`sinifLabel(0)` → "Hazırlık". İngilizce lise `SINIF_KISITLAMA`'ya `lise:[0,9,10,11,12]` eklendi. planUret: siniflar.includes(0) → `hazirlikli` program filtresi.

---

## Veri

### 2026-06-14 — v2 JSON dosyaları DB'nin tek kaynağı kabul edildi
Claude Opus vision ile PDF'den üretilen 81 `*_v2.json` dosyası (9077 kazanım) mevcut migration pipeline'ın yerini aldı.
- Kazanım `ad` metinleri birebir doğrulandı (Türkçe ilkokul: 77/77 eşleşme)
- Yeni schema: brans slug, okul_tipi, sinif_tipi, branslar[], 6'lı unique key
- Migration 043-066 silindi; yerini 067 (schema) + 068 (seed) aldı
- `uretimler.kazanim_id BIGINT`, `plan_haftalari.kazanim_ids BIGINT[]` yeni FK yapısı

### 2026-06-13 — Coğrafya 2-saat/4-saat: DB değil, config ile çözülecek
11. ve 12. sınıf Coğrafya için 2 saatlik müfredat, 4 saatliğin tam alt kümesidir (PDF sayfa 12'de kodlar açıkça listelenmiş).
- DB'de tüm kazanımlar 4-saat versiyonu olarak tutulur (11:19, 12:20)
- 2-saat kodu listesi: `src/data/cografya_2saat.json`
- V1.5 uygulama: onboarding'de "Coğrafya — haftalık kaç saat: 2 / 4" sorusu → `planUret` bu listeye göre filtreler

---

## Ürün Kapsamı

### 2026-06-20 — V2 pivot tartışıldı, geri çekildi (Oturum 69)
**Ne:** Oturum 69'da V2 pivot stratejisi (4 sekme, freemium Model D, hibrit cache, 9 evrak, otonom GitHub Actions modu) tartışıldı. PLAN_V2.md ve `.github/workflows/yaver-cron.yml` yazıldı, sonra tamamen geri çekildi (`git reset --hard HEAD~1`).
**Neden:** Karar fatigası + V1.4'ün %80 hazır olması. 15 ekran çalışıyor, 9077 kazanım seed edildi, plan üretim canlı, Edge Function deploy. Ship etmek pivot riskinden daha mantıklı geldi.
**Korunan:** `STRATEJI_V2.md` taslağı diskte duruyor (Oturum 68'den). Sınav Analizi, "Yaver hazırlar" sloganı, 3 üretim tipi (Ders Planı atılır), 9 evrak listesi V1.5 referansı olarak değerlendirilebilir.
**Ne zaman revize:** V1.4 lansman sonrası 100+ kullanıcı + retention datasıyla V1.5 roadmap yapılırken.

### 2026-04-17 — V1'de ders kitabı RAG kullanılmayacak
Sadece kazanım datası. PDF telif riski + aşırı mühendislik. V1.5'te premium feature.

### 2026-04-17 — Fiyatlandırma V1'de netleştirilmeyecek
V1 cömert free tier. 100+ kullanıcı + 4 haftalık usage datası sonrası V1.5'te netleşir.

### 2026-04-17 — Hızlı mod V1.5'e ertelendi
Üretim ekranında sadece form tabanlı akış. Sürpriz Hazırlık form doldurmadan aynı değeri veriyordu.

### 2026-04-17 — Çıktı .txt indirme; PDF V1.5
"İndir" butonu .txt. PDF/Word üretimi V1.5'e ertelendi.

### 2026-05-02 — Sürpriz hazırlık özelliği iptal edildi
S10 ekranı, bildirimleri, origin badge'leri kaldırıldı. Kalıcı karar.

---

## Mimari

### 2026-04-23 — Platform Expo (React Native)
React + Vite terk edildi. Play Store için Expo managed workflow + TypeScript. EAS Cloud ile Mac gerekmez. Geri dönülemez.

### 2026-05-22 — Yıllık Plan hiyerarşisi: Dönem → Ay → Hafta
3 seviyeli navigasyon. Ay başlıkları pill+çizgi paterni (accent renkli pill + sağa uzanan accentMd çizgi).
Haftada: tarih aralığı birincil (15px semiBold), hafta no sol kutucukta. "Hafta X" etiketi kaldırıldı — tekrar oluşturuyordu.

### 2026-05-22 — egitim_takvimi 41 hafta (MEB PDF'den)
Kurban Bayramı hafta 37'ye (May 25-29) taşındı. Hafta 41 (Jun 22-26) eklendi. CHECK constraint 40→52.

### 2026-04-17 — Claude API Edge Function üzerinden
API key frontend'e girmeyecek. `supabase/functions/generate` üzerinden (Supabase secret). Kalıcı mimari karar.

### 2026-04-16 — Ajan sistemi → Skill olarak uygulandı
Claude Code'da custom agent type yok. `.claude/skills/<isim>/SKILL.md` formatında skill. Aktif: yaver-ui-kit, ux-critic, ui-designer.

### 2026-04-17 — Git disiplini (K5)
Feature branch zorunlu. Main'e direkt push yasak. `feature/[ekran]-[açıklama]`.

### 2026-04-17 — Version pinning (K6)
package.json'da exact version. `^` yasak. `.npmrc`'de `save-exact=true` aktif.

### 2026-04-17 — Destructive koruma (K7)
Auto-approve kapalı. DROP/DELETE/TRUNCATE/rm -rf → önce sor. Haftalık Supabase snapshot. Claude Code production'a direkt bağlanmaz.

---

## Design System

### 2026-05-02 — Design handoff > CLAUDE.md spec
Çakışmada `design_handoff_yaver_v1/` klasörü kazanır. Font: Plus Jakarta Sans. Surface: #FFFFFF kart + #F7F5F2 krem bg.

### 2026-05-07 — Teachy-style dark hero + warm panel pattern
Tüm ekranlar (onboarding + stack) bu patternda:
- Dark `#1A1A1A` hero: bağlam bilgisi (hafta no, kazanım adı, onboarding adımı)
- Warm `#F7F5F2` panel: `borderTopLeftRadius/RightRadius: 22`
- Geri butonu: `rgba(255,255,255,0.10)` daire
- Sienna blob dekorasyon: `position: absolute, opacity: 0.07`

### 2026-04-24 — BottomNav spring animasyonu
`withSpring(damping: 14, stiffness: 220)`. Aktif tab: scale 1.18 + strokeWidth 2.5 + accentLt pill.

### 2026-04-24 — Welcome kinetic typography
Üst yarı boş. Alt: "Merhaba," + "öğretmenim." spring ile (60ms → 240ms stagger). `withSpring(damping:18, stiffness:180)`.

### 2026-04-25 — Hazır/Eksik görsel hiyerarşi (UX Critic J3)
"Eksik göze çarpar, hazır geri çekilir." Eksik: `colors.warning` + bold + text1. Hazır: `colors.success` + medium + text2.

### 2026-04-24 — Uygulama adı + tagline isim-bağımsız
"Yaver" marka adı UI'dan kaldırıldı. İsim kesinleşene kadar nötr copy.

---

## Müfredat / Veri

### 2026-05-25 — MEB Türkiye Yüzyılı Maarif Modeli 2025 tam re-seed (Migration 030)
**Karar:** Tüm ilkokul + ortaokul kazanımları silinip 26 PDF'den yeniden çekildi.
**Sebep:** Eski veri 2018 MEB müfredatına dayanıyordu; 2025 reform yeni kodu, yapı ve kazanım adları getirdi (MAT.1.1.1 formatı, Öğrenme Çıktıları).
**Uygulama:** `scripts/extract_pdf_kazanimlar.py` ile 26 PDF → 24 JSON (okul öncesi hariç) → `scripts/generate-migration-030.py` → 741KB SQL → `supabase db push`.
**Sonuç:** 3.518 yeni kazanım (15 branş, 1-8. sınıf), toplam DB 5.281 kazanım. Lise + ihl korundu.
**Notlar:** Arapça branşı artık okul_tipi='ortaokul' (eski: 'iho'). İnkılap 8. sınıf → sosyal_bilgiler branşı (tutarlı).

### 2026-05-21 — Kazanımlar sentetikten gerçek MEB verisine geçirildi
**Karar:** Yapay (AI-üretimi) kazanımlar yerine resmi MEB müfredatı kullanılacak.
**Sebep:** Sentetik veri öğretmenler tarafından güvenilir bulunmazdı; yıllık plan gerçek müfredata dayanmalı.
**Uygulama:** 55 MEB JSON dosyası → `scripts/generate-meb-kazanimlar.cjs` → 5.118 kazanım → Supabase.
**Sonuç:** 21 branş, 1-12. sınıf arası, gerçek MEB kodlarıyla.

### 2026-05-21 — planUret: tek kazanım → range dağıtımı
**Karar:** Haftada 1 kazanım yerine `N/aktifHafta` oranında kazanım gösterilecek.
**Sebep:** Dil dersleri (Türkçe, İngilizce, TDE) 90-200 kazanım içeriyor; eski algoritma bunların %85'ini atlıyordu.
**Sonuç:** Tüm kazanımlar yıl boyunca görünür. Fizik: haftada ~1, TDE: 2-3, İngilizce: 5-6.

---

## Ekran Kararları

### 2026-05-20 — PlanimScreen → Ana Sayfa dashboard (Oturum 26)
Tab adı "Ana Sayfa", Home ikonu (Phosphor). `expo-linear-gradient` ile mavi header (#2563EB→#1D4ED8). Bileşenler: GradientHeader (SunHorizon ikon, öğretmen adı, progress bar), BuHaftaCard (2px accent border + neon glow, peek 3 kazanım → HaftaDetayı), HızlıHazırla 2×2 grid, SonHazırlanlar yatay scroll.

### 2026-05-20 — PlanimScreen bottom sheet pattern (Oturum 25)
İçerik tipi seçimi: `Modal + animationType="slide"`. Backdrop'a dokunarak kapatılır. Harici kütüphane yok.

### 2026-05-22 — Profil tab → sağ üst köşe (Oturum 30)
Tab bar 5 → 4 sekme. Profil Stack'e taşındı. Ana Sayfa header'ı sağ üstüne UserCircle ikonu eklendi. Sebep: Profil düşük frekanslı, tab bar'da yer kaplaması gereksiz.

### 2026-05-22 — DersIcin: Sunu → Ödev, tab etiketi "Ders Hazırla" (Oturum 30)
Sunu ve Slayt özünde aynı şey — Sunu silindi, Slayt kaldı. Yerine Ödev eklendi (yüksek frekans). Tab etiketi "Ders İçin" → "Ders\nHazırla" (iki satır), header "Ne hazırlayalım?".

### 2026-05-22 — EvraklarimScreen: Kulüp Evrakları bölümü eklendi (Oturum 30)
76 MEB kulübü JSON → bottom sheet (arama + liste). Ayrı "KULÜP EVRAKları" bölümü olarak eklendi (şablonlardan bağımsız kategori). Seçim → SablonDoldurma.

### 2026-05-21 — YillikPlanScreen: 5. tab + inline kazanım listesi (Oturum 29)
**Karar:** "Planım" adında 5. tab eklendi (CalendarDays ikonu, lucide-react-native). BottomNav → 5 tab.
**İçerik yapısı:** Haftalara tıklayınca HaftaDetayı'na gitme yerine kazanımlar inline, ay+hafta başlıklı dikey liste.
**Görsel:** mavi LinearGradient header ("Yıllık Planlarım"), sınıf filtre chip'leri header içinde, her kazanım kartında sınıfa göre renkli 4px sol bar (9→mavi, 10→mor, 11→turuncu, 12→kırmızı), tatil satırları %60 opacity.
**Sebep:** Kullanıcı tüm yılı tek ekranda, kaydırarak görmek istedi. HaftaDetayı ekranı zaten haftalık detay için mevcut.

### 2026-05-20 — DersIçin tile grid + kazanım picker (Oturum 27)
Arama + FAB kaldırıldı. 2×3 tile grid: Ders Planı, Sınav, Etkinlik, Çalışma Yaprağı, Slayt, Sunu — Phosphor `duotone`. Tile → kazanım bottom sheet: Bu Hafta üstte (accentLt), tüm yıl ay/hafta gruplu, geçmiş haftalar dimmed (opacity 0.55). Kazanım → UretimScreen: `{ kazanimKodu, kazanimAdi, sinif, icerikTuru }`.

---

## Veri

### 2026-04-16 — Supabase project
Dev project ref: `oelllamwceazolwpgavq`. Region: EU. 13 tablo + RLS. 1.682 kazanım, 21 branş.

### 2026-05-22 — branş → ders → okul_tipi hiyerarşisi eklendi (Oturum 32)
**Karar:** kazanimlar tablosuna `ders` + `okul_tipi`, branslar tablosuna `slug` + `kademe` sütunları eklendi.
**Sebep:** Tarih öğretmeni sinif 8'de "T.C. İnkılap Tarihi", 9-11'de "Tarih", 12'de "Atatürkçülük" dersine giriyor. Bu ayrım yokken plan tek tip görünüyordu.
**Uygulama:** Migration 000010. okul_tipi: ilkokul/ortaokul/iho/lise/ihl. Arapça → iho/ihl override.
**Yeni branşlar:** Fransızca, Rehber Öğretmen, Teknoloji ve Tasarım eklendi.

### 2026-05-23 — OkulTipi ekranı kaldırıldı (Oturum 36)
**Karar:** OkulTipi ekranı tamamen kaldırıldı. Branş → direkt Sınıf.
**Sebep:** Hiçbir branşta okul türü müfredatı değiştirmiyor. Tarih gibi branşlarda imam hatip seçeneği gereksizdi.
**Yeni akış:** Sınıf sonrası `hasEkDers()` kontrolü → ek/seçmeli varsa DerslerScreen, yoksa direkt Loading.
**DerslerScreen:** Zorunlu dersler toggle + seçmeli bottom sheet. `deriveOkulTipi(siniflar)` ile okulTipi türetilir.

### 2026-05-22 — Onboarding'e OkulTipi ekranı eklendi (Oturum 32)
Branş seçimi sonrası OkulTipi ekranı. Tek kademe branşlarda (TDE, Fizik vb.) atlanır, otomatik set edilir. Çok kademe branşlarda (Matematik, Tarih, İngilizce vb.) kullanıcı seçer.
SinifScreen artık okul_tipi filtreli kazanımları gösteriyor.

### 2026-05-02 — 3 branşta lise kazanımı yok
Almanca, Arapça, Bilişim Teknolojileri — MEB JSON'larında lise seviyesi yok. Onboarding'de seçilebilir, kazanım listesi boş gelir (V1 kabul edilebilir).

### 2026-05-23 — Okul türü tile seçimi SinifScreen içine taşındı (Oturum 38)
**Karar:** OkulTipi için ayrı ekran açılmıyor. Çok kademeli branşlarda (Matematik, Din Kültürü, Tarih vb.) tiles SinifScreen'in üstünde inline gösteriliyor; tile seçilince sınıf grid'i o kademeye göre filtreleniyor.
**Sebep:** Ekstra ekran geçişi gereksiz, UX Critic B seçeneğini tercih etti. Din Kültürü için İlkokul/Ortaokul/Lise/İHO/İHL olmak üzere 5 tile gerekiyordu — ayrı ekran yerine inline daha temiz.
**Uygulama:** `getKademeTiles(slug)` → `KademeTile[]` fonksiyonu. `getGradeRangeForOkulTipi(slug, okulTipi)` ile sınıf grid'i tile'a göre güncelleniyor. Tile seçilmeden sınıf grid'i gösterilmiyor. `setOkulTipi()` her zaman SinifScreen'den çağrılıyor.

### 2026-05-23 — Hayat Bilgisi ve Rehber Öğretmen V1 kapsamı dışında (Oturum 38)
**Karar:** Bu iki branş BransScreen'den ve DB'den kaldırıldı.
**Sebep:** V1 hedef kitlesi ortaokul/lise öğretmenleri. Hayat Bilgisi ilkokul 1-3, Rehber Öğretmen ders planı yapmıyor.
**Uygulama:** Migration 000015 ile `kazanimlar` + `branslar` tablolarından silindi.

### 2026-05-23 — Din Kültürü İHL/İHO ders ayrımı (Oturum 38)
**Karar:** Din Kültürü branşı için DKAB, İHO zorunlu dersler ve İHL mesleki dersler ayrı `okul_tipleri` ile tanımlandı.
**Kural:**
- DKAB: ilkokul (4. sınıf), ortaokul+iho (5-8), lise (9-12). İHL'de DKAB yok.
- İHO zorunlu: Kur'an-ı Kerim, Peygamberimizin Hayatı, Temel Dini Bilgiler (5-8, `okul_tipleri: ['iho']`)
- İHL mesleki: Kur'an-ı Kerim [9-12], Peygamberimizin Hayatı [9], Temel Dini Bilgiler [9], Fıkıh [10], Hadis [10], Siyer [10], Akaid [11], Tefsir [11], Hitabet ve Mesleki Uygulama [11], Mesleki Uygulama [11-12], İslam Tarihi [11-12], Kelam [12], Dinler Tarihi [12]
- Normal ortaokul seçmeli: Kur'an-ı Kerim, Peygamberimizin Hayatı (`okul_tipleri: ['ortaokul']`)
**Kaynak:** `brans/ogretmen_brans_ders_veritabani.json` — bu dosya ders/sınıf atamaları için yetkili kaynak.

### 2026-05-23 — DerslerScreen okulTipi context'ten alır (Oturum 38)
**Karar:** DerslerScreen kendi `deriveOkulTipi()` çağrısını kaldırdı. `okulTipi` SinifScreen'de set edilir, DerslerScreen sadece context'ten okur.
**Sebep:** İHO/İHL gibi özel tipler derive edilemez (5-8 sınıf ortaokul ile aynı range). Tile seçimi tek gerçek kaynak.

### 2026-05-23 — Zorunlu dersler: sadece birincil ders başta seçili (Oturum 38)
**Karar:** DerslerScreen açıldığında sadece ilk zorunlu ders (`zorunlu[0]`) seçili geliyor. Diğer zorunlu dersler öğretmen tarafından aktif edilmeli.
**Sebep:** İHL'de 13 mesleki ders var; tümü seçili gelince öğretmen gerçekten girdiği dersleri bulmakta güçlük çekiyor.

### 2026-05-23 — İHL Meslek Dersleri ayrı branş yapıldı (Oturum 39)
**Karar:** `ihl_meslek_dersleri` slug'ıyla yeni branş eklendi. Supabase'de kazanımlar din_kulturu (okul_tipi=ihl) → ihl_meslek_dersleri'ne taşındı. din_kulturu kademe'den 'ihl' kaldırıldı.
**Sebep:** bransyenidb.json referansı + UX: İHL öğretmeni kendini "Din Kültürü" öğretmeni olarak değil meslek dersleri öğretmeni olarak tanımlıyor.
**SinifScreen:** tile koşulu `> 1` → `>= 1` (tek tile desteği: ihl_meslek_dersleri için tek İHL tile).

### 2026-05-23 — secmeliDersler.ts tamamlandı — bransyenidb.json kaynak alındı (Oturum 39)
**Karar:** `brans/bransyenidb.json` (MEB Müfredat + TTKB 9 sayılı karar, Aralık 2025) yeni yetkili referans.
Yapılan düzeltmeler: `almanca` eklendi (ortaokul [5] + lise/ihl [9-12]); `arapca` ayrıştırıldı (İHO [5-8] + İHL Arapça [9,10] + Mesleki Arapça [11,12]); `bilisim_teknolojileri` seçmeli dersler eklendi (Robotik, YZ I/II, Dijital Sanatlar).
`din_kulturu` ve `tarih` değişmedi — zaten doğruydu.
`ogretmen_brans_ders_veritabani.json` artık kullanılmıyor.

### 2026-05-23 — secmeliDersler.ts JSON karşılaştırması — bekleyen düzeltmeler (Oturum 38)
JSON (`brans/ogretmen_brans_ders_veritabani.json`) ile karşılaştırma yapıldı. Aşağıdakiler **bir sonraki oturumda** düzeltilecek:

1. **almanca** — BRANS_DERSLER'de hiç entry yok. Eklenecek: Almanca ortaokul [5] (seçmeli) + lise/ihl [9-12] (zorunlu).
2. **arapca** — İHL Arapça yalnızca [10,11,12] (bizde [9] fazladan var). Eksik zorunlu dersler: Mesleki Arapça [11,12] + Arapça Metin Mükaleme [11,12] (ihl).
3. **din_kulturu** — İki açık soru: (a) JSON DKAB'ı lise+ihl zorunlu gösteriyor ama kullanıcı "ihl'de DKAB yok" dedi — netleştirilecek. (b) Normal lisede 9. sınıf Kur'an-ı Kerim ve Temel Dini Bilgiler JSON'da zorunlu ama bizde sadece seçmeli — kontrol edilecek.
4. **tarih** — Branşta ortaokul 8. sınıf T.C. İnkılap Tarihi zorunlu eksik (şu an sadece sosyal_bilgiler pre-selected olarak var).
5. **bilisim_teknolojileri** — Seçmeli dersler boş. JSON'da: BT ve Yazılım [7-12] seçmeli, Robotik Kodlama, Yapay Zeka I/II, Dijital Sanatlar — eklenecek.

Oturum 38'de düzeltilen maddeler: teknoloji_tasarim [7,8], beden_egitimi (Sağlık Bilgisi), gorsel_sanatlar (Hüsn-i Hat+Ebru İHL), muzik (Dini Musiki İHL).

### 2026-05-24 — Sınıf Öğretmenliği kazanım boşluğu düzeltildi (Oturum 42)
**Kök neden:** Migration 008 (5.118 kazanım) `ders` ve `okul_tipi` kolonlarını INSERT etmedi; kolonlar migration 010'da eklendi ama hiç backfill edilmedi. `planUret`, Sınıf Öğretmenliği için `ders IN (seciliDersler)` sorgusu yapıyor — tüm satırlarda `ders=NULL` → sıfır sonuç.
**Çözüm (3 migration):**
- Mig 022: İHL Meslek Dersleri sırası Din Kültürü'nün hemen ardına alındı (BransScreen görsel düzeni).
- Mig 023: Tüm kazanımlarda `ders = branslar.ad`, `okul_tipi = sinif bazlı` backfill yapıldı.
- Mig 024: Eksik ilkokul verileri eklendi — Türkçe 1-2 (20 kazanım), Müzik 1-4 (16), Görsel Sanatlar 1-4 (16).
**Not:** SQL içinde Türkçe apostrof (`'`) → `''` ile kaçırılmalı (mig 024'te Atatürk'ün → Atatürk''ün).

### 2026-05-24 — EkDerslerScreen DERS_HAVUZU daraltıldı (Oturum 42)
**Karar:** Hayat Bilgisi, İnsan Hakları, Beden Eğitimi ve Oyun listeden çıkarıldı.
**Sebep:** Hayat Bilgisi (mig 015 ile silindi), İnsan Hakları (hiç kazanım eklenmedi), Beden Eğitimi ilkokul (sadece lise verisi mevcut). DB'de karşılığı olmayan dersler seçenekler arasında olmamalı.

### 2026-05-24 — Branş adı PlanimScreen ve YillikPlanScreen'de öne çıkarıldı (Oturum 42)
**Karar:** Her iki ekranda branş adı belirgin/hiyerarşik konuma alındı.
- **YillikPlanScreen:** Hero başlık artık branş adı; "Yıllık Plan · N aktif hafta · N kazanım" alt başlık oldu.
- **PlanimScreen:** Greeting ile tarih arasına `bransLabel` eklendi (fontSize 18, semiBold, rgba(255,255,255,0.92)).
**Sebep:** UX Critic raporu — öğretmen kendi branşını net görmeli; küçük/ikincil konumda kalması yeterli değil.

### 2026-05-24 — DersProgramı onboarding'den çıkarıldı (Oturum 40)
**Karar:** Ders programı girme ekranı onboarding akışından kaldırıldı. WowMoment'taki "Ders programını gir →" CTA → "Planıma git →" (MainTabs'a yönlendiriyor). DersProgramiScreen silinmedi — PlanimScreen'de BuHafta kartının altına sessiz bir strip CTA eklendi ("Ders programını ekle").
**Sebep:** UX ilkesi #5 — aha anına kadar sıfır engel. Ders programı verisi planUret için kritik değil; yalnızca haftalık ders saati görünümünü etkiliyor. Sonradan da girilebilir, onboarding'de blocker olmamalı.

### 2026-05-24 — Müfredat büyük düzeltme (Oturum 43)
**Karar:** Audit script ile tespit edilen kritik boşluklar tek PR'da düzeltildi.

**Düzeltilenler:**
- **Mig 025**: İHL Meslek Dersleri 113 kazanım — Mig 016'nın 0 satır taşımasının nedeni mig 010'da
  Din Kültürü kazanımlarına okul_tipi='ihl' set edilmemiş olmasıydı; mig 016 hiç eşleşmedi.
  İHL JSON'larından yalnızca sinif alanı DOĞRU olanlar seed edildi (7 dosya):
  Akaid, Mesleki Arapça, Fıkıh, Hadis, Siyer, Temel Dini Bilgiler, Peygamberimizin Hayatı.
  Yanlış sinifli (1-6 ama gerçek 9-12) 8 JSON dosyası V1.5'e ertelendi.
- **Mig 026**: Hayat Bilgisi branşı + 51 kazanım (1-3) geri eklendi. Oturum 42 kararı
  ("V1 kapsamı dışı") MEB müfredatına aykırıydı — 1-3. sınıf öğretmeni Hayat Bilgisi'siz plan
  üretemiyordu. **Oturum 42 kararı iptal.**
- **Mig 027**: Sınıf Öğretmenliği branşında sinif=4 İHVD.* kayıtları için ders='İnsan Hakları'
  UPDATE'i. Mig 023 backfill'in `ders = branslar.ad` yapması nedeniyle 9 kayıt 'Sınıf Öğretmenliği'
  ders adıyla kalmıştı; planUret seciliDersler filtresine eşleşmiyordu.
- **Mig 028**: 8. sınıf T.C. İnkılap Tarihi 41 kazanım, Sosyal Bilgiler branşına bağlı.
  T.C. İNKILAP TARİHİ VE ATATÜRKÇÜLÜK DERSİ.json sadece sinif=12 içeriyordu; 8. sınıf için
  MEB güncel müfredattan (sosyalbilgiler.org) çekilen 41 kazanım manuel mig olarak eklendi.

**EkDerslerScreen DERS_HAVUZU:** + Hayat Bilgisi (1-3), + İnsan Hakları (4),
  + Beden Eğitimi ve Oyun (1-4 paylaşımlı), + DKAB (4 paylaşımlı).

**Audit altyapısı:** `scripts/audit-mufredat.cjs` eklendi — branş × sınıf matris sayımı,
ders dağılımı, eksik tespit, okul_tipi dağılımı çıkarır. CI'a entegre edilebilir.

**Sayım düzeltmesi:** STATUS.md "5.171 kazanım" yanlıştı (mig 018'in sildiği 1.496 sayılmamış).
Gerçek sayım 3.977.

### 2026-05-24 — Trafik Güvenliği V1.5'e ertelendi (Oturum 43)
**Karar:** 4. sınıf Trafik Güvenliği dersi (MEB zorunlu) için JSON kaynağı yok; V1.5'te MEB'den
çekilip eklenecek. Şimdilik DERS_HAVUZU'na konmadı — kullanıcı kararı.
**Sebep:** Kazanım kaynağı yok, "yakında" UI placeholder yapmak ek iş, V1 için kabul edilebilir kayıp.

### 2026-05-24 — Yanlış sinifli İHL JSON dosyaları V1.5'e ertelendi (Oturum 43)
**Tespit:** 8 JSON dosyasında sinif alanı 1-6 olarak girilmiş ama gerçek MEB sınıfları 9-12:
Dini Musiki, Ebru, Hüsnühat, Tezhip, İslam Felsefesi, İslam'da Çocuk Eğitimi, Tasavvuf Kültürü,
Din Eğitimi. JSON kaynak dosyaları yeniden işlenmeli (1→10, 2→11, 3→12 gibi mapping veya yeni
MEB PDF kaynaklarından üretim).
**V1 etkisi:** İHL öğretmenleri bu seçmeli dersleri planda göremiyor (8 ders × 11-12 sınıf).
Ana zorunlu meslek dersleri (Fıkıh, Hadis, Siyer, Akaid, Tefsir, Kelam, Kur'an, Mesleki Arapça)
zaten 113 kazanımla seed edilmiş durumda.

### 2026-05-23 — Seçmeli ders kazanımları henüz yok (Oturum 34)
**Durum:** `src/data/secmeliDersler.ts`'teki tüm seçmeli dersler DB'de kazanım içermiyor. Mevcut 5.118 kazanım yalnızca zorunlu dersler için. Seçmeli seçim ekranı "yakında" notunu gösteriyor.
**Seçmeli kazanımlar eklenecek branşlar (öncelik sırasıyla):**
1. Türkçe: Yazarlık ve Yazma Becerileri, Okuma Becerileri (5-8)
2. Matematik: Matematik Uygulamaları I/II (6-8), Düşünme Eğitimi
3. Fen Bilimleri: Bilim Uygulamaları, Proje Tasarımı
4. Sosyal Bilgiler: Şehrimiz, Kültür ve Medeniyetimize Yön Verenler (5-8)
5. TDE: Metin Tahlilleri I/II, Osmanlı Türkçesi (9-12)
6. Din Kültürü: Kur'an-ı Kerim, Peygamberimizin Hayatı (ortaokul/lise seçmeli)
7. Diğer branşlar: fizik/kimya/biyoloji/tarih/coğrafya/felsefe seçmeli ders kazanımları
**Yöntem:** Her seçmeli ders için ayrı seed migration (örn. 20260416000013_seed_secmeli_turkce.sql).

### 2026-05-27 — İHL tam kazanım seed tamamlandı (Oturum 46, Migration 035)
21 İHL PDF'inden 469 kazanım çıkarıldı ve DB'ye eklendi.
**Kararlar:**
- Mesleki Arapça sinif=11-12 (MARP11/MARP12 prefix formatı, MEB PDF onaylı)
- Dini Musiki, Ebru, Hüsnühat, Tezhip: seçmeli, 9-12 sınıf (Düzey I→9, II→10, III→11)
- KAK (Kur'an'ın Ana Konuları): seçmeli, 11-12 sınıf (KAK-I→11, KAK-II→12)
- Group B (İÇE/DE/İF/TK/İBT): sinif=11 (user: "11 veya 12 sınıf seçmeli")
- KKIHL prefix: IHL Kur'an-ı Kerim'in kodları lise KK kodlarıyla çakışmasın diye
- ders_turu constraint: 'seçmeli' değil 'secmeli' (migration 031 check constraint)
- ON CONFLICT DO UPDATE: migration 025'teki 113 kısmi seed üzerine güvenli yazma
**Sonuç:** DB'de 6.063 toplam kazanım (önceki: 5.685, net artış: +378)

### 2026-05-27 — Metodoloji metni kirliliği temizlendi (Oturum 47, Migration 037)
PDF extraction hatası: kazanım metni yerine öğretim yöntemi açıklaması veya truncated metin girilmişti.
**Kararlar:**
- 50 kirli kayıt DELETE ile silindi (UPDATE/placeholder değil — yanlış metin hiç göstermemekten daha kötü)
- Etkilenen branşlar: Sosyal Bilgiler (İTA.8.1.1), Türkçe (6 kayıt), DKAB (2), TvT (3), Tarih (1), İHL Arapça (18), İHL diğer (19)
- ARP even-numbered records (.2, .4): büyük ihtimalle etkinlik önerisi, gerçek kazanım değil — silinmesi doğru
- DT (Dinler Tarihi): 7/10 silindi — V1.5'te PDF'ten yeniden çekilecek
- Kaynak JSON dosyaları güncellenmedi (sadece DB temizlendi); JSON fix Migration 038 ile yapılacak
**Sonuç:** DB'de 6.013 toplam kazanım (önceki: 6.063, -50 kirli kayıt)
