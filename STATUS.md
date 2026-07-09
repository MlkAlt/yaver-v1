# Yaver — Proje Durumu

**Son güncelleme:** 09.07.2026 — Oturum 83 (Auth altyapısı + uygulama-içi PDF önizleme + çok sayıda cihaz testi düzeltmesi — `feature/auth-profiles-tablosu` branch'inde, main'e merge edilmedi)

## ŞU AN NEREDEYİZ (Oturum 83 — Auth + PDF önizleme + cihaz testi düzeltmeleri, 09.07.2026)

Uzun bir oturum — `feature/auth-profiles-tablosu` branch'inde 16 commit birikti, kullanıcı çoğunu cihazda test edip onayladı. **main'e henüz merge edilmedi.**

**Büyük işler:**
1. **Apple/Google Sign-In altyapısı:** Supabase `profiles` tablosu (eski, hiç kullanılmayan 7 tablo temizlenip yerine kuruldu). `AuthContext` — Apple girişi tam çalışıyor (cihaz/geliştirici hesabı olmadığı için test edilemedi ama kod hazır, buton `isAvailableAsync` ile güvenli şekilde gizleniyor). **Google girişi uçtan uca doğrulandı** — Google Cloud Console (Web OAuth client) + Supabase Dashboard provider aktif, nonce hash'leme + androidClientId sorunları çözüldü. Kalıcı hafızada not: Play Store build'i alınırken ek "Android" tipi OAuth client gerekecek.
2. **Uygulama-içi PDF önizleme ekranı:** İki ara-çözüm (native print dialog, sonra doğrudan paylaşım sheet'i) kullanıcı testinde yetersiz kalınca WebView+PDF.js (jsDelivr CDN, pdfjs-dist@3.11.174) ile gerçek bir önizleme ekranına geçildi — zoom, İndir (Android SAF), büyük Paylaş butonu, yatay dönüş desteği. Kullanıcı "harika olmuş" dedi.

**Cihaz testinde bulunup düzeltilen ~10 küçük/orta bug:**
- Performans Notu: 2 haneli not girişinde otomatik ilerleme + akordiyon açılma karışıklığı
- SinifSecici şube kutusu genişliği
- PDF circular-import hatası + expo-file-system deprecated API hatası (iki ayrı runtime crash, ikisi de düzeltildi)
- Sınav Analizi: DKAB+İHO kazanım bugı (Oturum 78'in planUret.ts düzeltmesi buraya hiç taşınmamıştı) + **seçmeli derslerin (sinif_tipi='secmeli') hiç görünmemesi** + sinif=0 serbest-seçim kazanımlarının eşleşmemesi — üçü birden düzeltildi
- Sınav Analizi ders adı artık serbest metin değil, `DersSecici` (paylaşılan component, SablonDoldurmaScreen'den çıkarıldı) ile chip seçimi; **asıl kök bug**: kazanım sorgusu dersAdi değil dersFiltesi (tüm dersler) ile filtreleniyordu, bu yüzden örn. Fen Bilimleri+Çevre Eğitimi ikisi seçiliyken "Çevre Eğitimi" seçilse bile ikisi karışık geliyordu — düzeltildi
- Profil → Okul Bilgileri ekranı hiç kaydetmiyordu (TODO stub) — artık evrak sihirbazlarıyla aynı paylaşılan AsyncStorage anahtarlarına bağlı, iki yönlü çalışıyor
- Aylık Rehberlik Raporu: boş alanlar (özellikle "Diğer Çalışmalar" bölümü) PDF'ten tamamen kayboluyordu — artık hepsi "-" ile gösteriliyor
- Okul adı başlıklarında sarkan son kelime sorunu ("...ANADOLU\nLİSESİ" gibi) — `sarkanKelimeyiKoru()` ile tüm 12 evrak şablonunda otomatik çözüldü (&nbsp; ile son iki kelime hep birlikte)

**Ayrıca (kod dışı bulgular, hafızaya kaydedildi):**
- 23 branştan sadece 10'unda seçmeli ders var — kalan 13'ü için derin araştırma kullanıcı isteğiyle lansman sonrasına ertelendi
- Word/Excel export + premium fikri `PLAN.md`'ye not düşüldü (Faz 6)

**tsc 0 hata (her commit'te doğrulandı).** **BEKLİYOR:** Bu son turdaki düzeltmelerin (okul bilgileri, aylık rapor boş alan, sarkan kelime) cihaz testi — sonra main'e merge.

---

## ŞU AN NEREDEYİZ (Oturum 82 — Fen Bilimleri seçmeli + Kulüp Eylül branch'leri main'e merge, 09.07.2026)

Oturum 81'de hazırlanan iki iş de kullanıcı onayıyla cihaz testini beklemeden **main'e merge edildi**:
1. **Fen Bilimleri seçmeli kazanımları** (Çevre Eğitimi ve İklim Değişikliği + Matematik ve Bilim Uygulamaları, 136 kazanım) — migration Supabase'e push edilmiş, `secmeliDersler.ts` bağlanmış, tsc 0 hata, REST API ile DB doğrulanmıştı. `feature/fen-bilimleri-secmeli-kazanim-json` main'e fast-forward merge edilip push edildi (`12d0016..2860ec5`).
2. **Kulüp Yıllık Planı Eylül düzeltmesi** — `feature/kulup-plan-eylul-baslangici` main'in gerisinde kaldığı için (fen bilimleri merge'i araya girdi) düz fast-forward olmadı, gerçek merge commit'i ile birleştirildi (bu dosyadaki çakışma dahil, elle çözüldü).

**main artık en güncel, açık/merge bekleyen dal kalmadı.** İkisi de cihazda henüz test edilmedi — sorun çıkarsa küçük düzeltme yapılacak.

---

**Son güncelleme (Oturum 81 arşivi):** 08.07.2026 — Oturum 81 (main merge + Kulüp Yıllık Planı Eylül'den başlıyor — KODLANDI, tsc 0 hata, COMMIT/PUSH EDİLDİ)

## ŞU AN NEREDEYİZ (Oturum 81 — main merge + açık işlerin taranması + Kulüp Yıllık Planı Eylül düzeltmesi, 08.07.2026)

Kullanıcı "nerede kaldık" + "yapmayı unuttuğumuz bir şey var mı" diye sorunca STATUS.md/DECISIONS.md/hafıza tam taranıp 7 açık kalem listelendi, kullanıcı hepsine karar verdi:

1. **Main merge — TAMAMLANDI:** `feature/evrak-pdf-margin-mimarisi` (main'in 10 commit ilerisindeydi, main'de fazladan hiçbir şey yoktu) `main`'e fast-forward merge edilip `origin/main`'e push edildi (commit `12d0016`). Artık `main` = güncel garanti-çalışan sürüm. `project_main_merge_bekliyor` hafıza notu kapandı.
2. **Toplum Hizmeti/Yoklama-Karar yatay mı sorusu — KAPANDI:** Kullanıcı onayladı, mevcut durum zaten doğru (planlar yatay, Karar Defteri dikey kalıyor) — ekstra iş yok.
3. **Fen Bilimleri seçmeli dersler — web taramasıyla kısmen düzeltme gerektiği bulundu, henüz kodlanmadı:** Eski hafıza notu (`project_fen_bilimleri_secmeli_eksik`) hatalıymış — "Proje Tasarımı ve Uygulamaları" aslında ortaokul değil **lise (9-12)** dersi, Fen Bilimleri ortaokul seçmeli listesine girmiyor. "Matematik ve Bilim Uygulamaları" sınıf aralığı 5-8 değil sadece **6-7**. "Afet Bilinci" branş ataması kaynaklar arası çelişkili (Sosyal Bilgiler mi Fen Bilimleri mi net değil). Sadece "Çevre Eğitimi ve İklim Değişikliği" (6-7-8, Fen Bilimleri) net doğrulandı. **Sıradaki adım:** gerçek MEB Öğretim Programı PDF'lerinden (linkler bulundu, mufredat.meb.gov.tr) kazanım metni çıkarımı yapılıp JSON hazırlanacak — kullanıcı onayı bekleniyor.
4. **Müfredat'ta ertelenen 4 PDF — 3'ü zaten çözülmüş çıktı:** `yeniders/` klasöründe okul_oncesi_v2.json, turk_kultur_medeniyet_tarihi_lise_v2.json, demokrasi_insan_haklari_lise_v2.json hepsi mevcut VE migration 068'de seed edilmiş VE `secmeliDersler.ts`'te branşa bağlanmış — ekstra iş yok, eski hafıza notu güncel değilmiş. **Sadece "Çoklu Yaşantılı Program" hâlâ hiç JSON'u yok** (`yeniders/` taramasında bulunamadı) — kaynak PDF/veri bekleniyor.
5. **Lise rehberlik yıllık planı tarih typo'su — zaten çözülmüş çıktı:** Oturum 78'deki takvim mimarisi yeniden yazımı (egitimTakvimi2025.ts kaynaklı) sırasında tüm bahar dönemi tarihleri zaten doğru 2026'ya güncellenmiş. Kalan tek "2025" eşleşmeleri (13 tane) hepsi "29 Aralık-2 Ocak 2025" sınır haftası — doğru (Aralık'ın içinde başlıyor). Ekstra iş yok.
6. **CSV/e-Okul import — açıklandı, iş durumu değişmedi:** Sınav notu girişindeki sürtünmeyi azaltmak için planlanmıştı (e-Okul Excel/CSV export'unu Yaver'e toplu yükleme). Hâlâ ertelenmiş, manuel giriş çalışıyor.
7. **PDF önizleme özelleştirme — hâlâ ertelenmiş**, çözüm aranmadı.

**Ekstra bulunan unutulmuş madde:** Kulüp Yıllık Planı'nın Eylül'den mi Ekim'den mi başlaması gerektiği sorusu (Oturum 74'ten beri açık) önceki listede atlanmıştı, kullanıcı bunu fark edip düzeltti.

**Kulüp Yıllık Planı Eylül düzeltmesi — TAMAMLANDI, commit+push edildi (`feature/kulup-plan-eylul-baslangici`, main'e merge edilmedi):** Kullanıcı `evraklar/kulup_planlari/` altına iki gerçek örnek belge ekledi (`KULUP_YILLIK_1_0.docx` — Atatürkçü Düşünceyi Geliştirme Kulübü, `KULUP_YILLIK_2_142670.docx` — Afete Hazırlık Kulübü). İkisi de gerçek MEB formatının HAFTALIK (Ay\|Hafta\|Amaç\|Yapılacak Etkinlikler\|Belirli Gün ve Haftalar, Eylül 08-12'den başlayarak) olduğunu gösterdi — mevcut uygulama AYLIK (9 satır, Ekim→Haziran). Kullanıcıya kapsam soruldu (haftalık mimariye tam geçiş mi, sadece Eylül eklensin mi); kullanıcı **mimariyi aylık bırak, sadece Eylül ekle** dedi — çünkü iki örnekte de Eylül içeriği neredeyse birebir aynıydı (kulüp tanıtımı/üye seçimi/iç tüzük/pano), yani kulübe özgü olmayan tek ay. Uygulandı:
- `src/data/kulupYillikPlanlari.ts`: yeni `ORTAK_EYLUL` bloğu (76 kulübün hepsinde ortak, placeholder dahil) + `EK8.EYLÜL` (Belirli Gün ve Haftalar) + `aylar` dizisine ilk satır olarak eklendi (artık 10 satır, no:1-10).
- `src/data/aylikRaporHtmlSablon.ts`: `RAPOR_AYLARI` — Eylül no:1, diğerleri 2-10'a kaydı.
- tsc 0 hata, `npx tsx` ile örnek kulüp render edilip Eylül satırının doğru geldiği + placeholder kulüplerin de aldığı doğrulandı.

**BEKLİYOR (Oturum 82'de main'e merge edildi, cihaz testi hâlâ ayrı bekliyor):** kullanıcı cihazda (Aylık Faaliyet Raporu ay seçici + Yıllık Plan PDF'i) Eylül satırının doğru göründüğünü test edecek.

---

## ŞU AN NEREDEYİZ (Oturum 80 — Oturum 79 cihaz testi geri bildirimi, 6 iş kalemi, 08.07.2026)

Kullanıcı Oturum 79'un cihaz testinde 6 ayrı UX/kalite sorunu bildirdi. 5'i bu oturumda kodlandı, 1'i (PDF önizleme ekranı özelleştirme) bilinçli olarak ertelendi:

1. **Sınıf/Şube birleşik seçici:** `SinifSecici` artık ortak component (`src/components/SinifSecici.tsx`, önceden `SablonDoldurmaScreen.tsx`'e özeldi) — sınıf artık dokununca açılan bir modal/seçici, yanında `/` ile şube kutusu aynı satırda. `SablonDoldurmaScreen.tsx`'teki 5 ekrana ek olarak **Sınav Analizi ekranına da uygulandı** (kullanıcı ilk turda unutulduğunu fark etti — kapsam genişletildi, "tüm ekranlarda olmalıydı" geri bildirimi).
2. **Not girişlerinde otomatik sonraki-alana geçiş:** Performans Notu (oto+manuel) ve Sınav Analizi puan tablosunda `useRef` dizisi + `onSubmitEditing` ile not girilip Enter/Next'e basınca imleç otomatik bir sonraki öğrenci/kritere geçiyor.
3. **Kriter+not tablosu görünürlüğü** (ui-craftsman planı + ux-critic onayı): Performans Notu oto modda not cetvelinin üstüne katlanabilir "Kriterler (N madde)" referansı eklendi; bir öğrencinin notu girilip alandan çıkılınca (blur) o öğrencinin kriter kırılımı otomatik açılıyor (diğerleri kapalı kalıyor, jitter yok). Sınav Analizi'nde soru başlıklarına max puan (`S1 /10`) + dokununca kazanım banner'ı eklendi — **ayrıca keşfedilebilirlik için** ("kullanıcı bunu kendi kendine keşfedemez" geri bildirimi) başlıklara noktalı alt çizgi + üstte açık ipucu metni eklendi.
4. **Sayı input etiketleri:** Anne/Baba/Diğer + Kız/Erkek inputlarındaki "(sayı)" placeholder'ı kaldırıldı, üstlerine belirgin (semiBold, text2) "Katılan kişi/öğrenci sayısı" etiketi eklendi.
5. **İmza bloğu sayfa-sonu koruması (13 şablon) + Dönem Sonu Rehberlik sıkılaştırma:** Tüm `*HtmlSablon.ts` dosyalarında imza alanına `page-break-inside/before: avoid` eklendi. Kullanıcı yine de Dönem Sonu Rehberlik Raporu'nda "kısa dipnot + imza + koca boş sayfa 2" gördü — kök neden: sayfa 1 tam dolunca imza tek başına kalıyordu, CSS "avoid" tek başına yetmiyordu. Düzeltme iki katmanlı: (a) son bölüm (7. PDR İşbirliği) + dipnot + imza tek `.son-blok` wrapper'ında birlikte tutuluyor (sığmazsa hepsi birlikte sayfa 2'ye kayıyor, sayfa 2 artık boş kalmıyor), (b) **şablon genel olarak sıkılaştırıldı**: boş satır sayısı azaltıldı (5→3, 3→2, 4→2), boş hücrelere `&nbsp;` yerine `-`, font/padding/margin/min-height değerleri küçültüldü. Kullanıcı geri bildirimi: "keşke bunları sen akıl edebilsen" — kalıcı hafızaya not düşüldü (`feedback_evrak_sablon_sikilastirma`), gelecekte benzer sayfa-taşması sorunlarında bu 5 teknik sorulmadan uygulanacak.
6. **PDF önizleme ekranı — ERTELENDİ:** Native `Print.printAsync` dialog'u yerine custom (kaydet/paylaş butonlu, pinch-zoom'lu) bir ekran istendi. Bunun `react-native-pdf` gibi bir native kütüphane gerektirdiği ve muhtemelen Expo Go uyumsuz olacağı (custom dev build gerektirebilir) tespit edildi, kullanıcı onayıyla en sona bırakıldı — henüz araştırılmadı/denenmedi.

**tsc 0 hata (her adımda doğrulandı).** Değişen dosyalar: `src/components/SinifSecici.tsx` (yeni), `src/screens/main/SablonDoldurmaScreen.tsx`, `src/screens/main/SinavAnaliziScreen.tsx`, 13 `*HtmlSablon.ts` (imza page-break), `src/data/donemSonuHtmlSablon.ts` (ek sıkılaştırma). **COMMIT + PUSH edildi bu oturumda** (`feature/evrak-pdf-margin-mimarisi` branch'ine, main'e merge hâlâ ayrı onay bekliyor — bkz. `project_main_merge_bekliyor`). **BEKLİYOR:** kullanıcı bu 5 düzeltmeyi cihazda tekrar test edecek.

---

## ŞU AN NEREDEYİZ (Oturum 79 — küçük düzeltmeler + Sınıf/Ders picker + Performans Notu redesign, 08.07.2026)

Kullanıcı Oturum 78'in cihaz testine geçmeden önce 4 yeni tespit/istek getirdi, hepsi kodlandı ama **henüz cihazda test edilmedi, commit atılmadı:**

1. **Kulüp Aylık Rapor başlığı** (`aylikRaporHtmlSablon.ts`) — `MÜDÜRLÜĞÜNE` başlığı üstten boşluklu hale getirildi, Rapor No/Faaliyet Ayı/Rapor Tarihi meta bilgisi başlığın hemen altına (giriş paragrafından önce) taşındı.
2. **Veli Çalışma Tutanağı** — anne/baba/diğer kutularının üstüne "Katılan kişi sayısı" ipucu eklendi, placeholder'lar "Anne (sayı)" vb. oldu.
3. **Sınıf/Ders manuel giriş → seçilebilir chip:** `SablonDoldurmaScreen.tsx`'e iki yeni yerel component eklendi — `SinifSecici` (onboarding'deki `siniflar: number[]`'dan chip + şube serbest metin kutusu, birleşik `"5/A"` formatında) ve `DersSecici` (onboarding'deki `dersFiltesi: string[]`'ten chip). Context boşsa (uygulama yeniden açılmışsa, `OnboardingContext` persist edilmiyor) ikisi de eski serbest metin `TextInput`'a otomatik düşüyor — regresyon yok. 5 ekranda (ŞÖK, Veli Toplantısı, Dönem Sonu Raporu, Rehberlik Aylık Rapor, Performans Notu) Sınıf alanı + Performans Notu'nda Ders Adı alanı değiştirildi. Dönem Sonu/Rehberlik Aylık'taki otomatik-doldurma tetikleyicileri (`dsVeriyiUygula`/`rbVeriyiUygula`) `onEndEditing`'den chip `onChange`'ine taşındı. Yıllık Plan (zaten chip'liydi) ve Yoklama/Karar Defteri öğrenci listesi (farklı UX ihtiyacı, per-öğrenci) kasıtlı dokunulmadı.
4. **Performans Notu ekran redesign** (ui-craftsman, plan-onay akışıyla): öğrenci başı ayrı "Dağıt" butonu kaldırıldı (`pDagit` fonksiyonu silindi) — artık tek yol üstteki "Tümünü Dağıt" (tam genişlik, ikonlu, birincil buton). YÖNTEM seçici → segmented control. Otomatik moddaki N adet ağır kart → tek "not cetveli" tablosu (öğrenci başına kompakt satır), dağıtım sonrası toplam pill'i — 10 kriterlik kırılım varsayılan gizli, pill'e dokununca açılıyor (yeni salt-UI state, iş mantığı/PDF etkilenmiyor). Şablon Seç ekranındaki düz kriter metni → ağırlık pill'li yapılandırılmış liste. Temel Bilgiler ekranına "BELGE BİLGİLERİ"/"ÖĞRETMEN & İMZA" grup başlıkları eklendi. `/ux-critic` ile onaylandı (PASS, 3 kapsam-dışı WARN — tüm evrak sihirbazlarında ortak konvansiyon).

**tsc 0 hata.** Değişen dosyalar: `src/data/aylikRaporHtmlSablon.ts`, `src/screens/main/SablonDoldurmaScreen.tsx`. **BEKLİYOR:** kullanıcı cihazda (Expo Go) test edecek — özellikle Performans Notu akışının tamamı (segmented control, not cetveli, kırılım aç/kapa, uzun listede scroll), Sınıf/Ders chip'lerinin 5 ekranda doğru göründüğü, Dönem Sonu/Rehberlik Aylık otomatik-doldurma zincirinin chip seçimiyle hâlâ çalıştığı. Sorunsuzsa "kaydet" → commit (henüz push edilmemiş, Oturum 78'in commit'i de main'e merge edilmemiş — bkz. altındaki bölüm ve kalıcı hafıza notu `project_main_merge_bekliyor`).

---

## ŞU AN NEREDEYİZ (Oturum 78 — DKAB+İHO fix + Rehberlik Yıllık Planı takvim mimarisi, 07.07.2026)

Kullanıcı cihazda Din Kültürü branşı + İmam Hatip Ortaokulu seçince "0 kazanım" bugı bildirdi; ardından Yıllık Rehberlik Planı'nda üç ayrı sorun daha bulundu. Hepsi bu oturumda çözüldü:

1. **DKAB+İHO kök neden:** `planUret.ts`'teki `okul_tipi` filtresi `'iho'`yu `.eq` ile kesin eşleştiriyordu, ama Supabase'de DKAB'ın ana dersi + Kur'an-ı Kerim/Peygamberimizin Hayatı hep `okul_tipi='ortaokul'` etiketliydi (MEB'de bu içerik normal ortaokulda seçmeli, İHO'da zorunlu — aynı kazanım, iki bağlam). Web araştırmasıyla doğrulandı. Düzeltme: `bransSlug==='dkab' && okulTipi==='iho'` durumunda filtre `.in(['iho','ortaokul'])`'a genişletildi. **Temel Dini Bilgiler dersi Supabase'de hiç seed edilmemişti** (32 kazanım, `/yeniders/temel_dini_bilgiler_islam_1_2_ortaokul_v2.json`'da vardı) — yeni migration (`20260707000073`) ile sınıf 5-6-7-8'in hepsine (İslam 1+2 üniteleri birleşik, MEB'de sınıfa değil alınış sırasına göre ayrışıyor) eklendi. Cihazda "tüm sınıflar+tüm dersler" testinde 238 kazanımla doğrulandı.
2. **Yıllık Rehberlik Planı PDF — 3 imza + tek sayfa + ortalama:** İmza bloğuna "Okul Rehber Öğretmeni" eklendi (yatay tek satır, ekstra yükseklik yok), tablo padding/font hafifçe sıkılaştırıldı (3 imzaya rağmen tek sayfaya sığması için), kazanım hücreleri `vertical-align: top` → `middle`.
3. **Etkinlik eşleştirme kök hatası:** Önceki oturumda (05.07.2026) `yeterlikAlani`/`etkinlikAdi` kazanım METNİNE göre eşlenmişti — aynı kazanım metni yılda birden fazla haftada tekrarlanabildiği için (örn. 7. sınıf "İlgi ve hobilerini ayırt eder." 7. VE 8. haftada) iki farklı gerçek etkinlik aynı (bazen yanlış) isimle görünüyordu. Tüm kademe etkinlik kitapları (ilkokul/ortaokul/lise 1.+2. cilt + 11. sınıf tek kitap) yeniden çıkarılıp **(sınıf, hafta=etkinlikNo)** anahtarına geçildi — 432 kazanımın **176'sı** düzeltildi, 468/468 artık dolu. Okul öncesi zaten pozisyon-bazlı doğruydu, dokunulmadı.
4. **Takvim mimarisi — idari satır kaldırma + kesintisiz kayma:** Veli Toplantısı/Bilgi Fişleri/Rehberlik Yürütme Komisyonu gibi 129 idari (takdire bağlı zamanlı) satır tüm kademelerden kaldırıldı. Kalan kazanım+tatil satırları artık **tüm yılı tek kesintisiz zaman çizgisi** sayan bir algoritmayla gerçek 2025-2026 takvimine (36 aktif hafta, 5 tatil hafta) birebir yerleştiriliyor — bir ayın taşan son kazanımı otomatik bir sonraki ayın ilk gerçek haftasına kayıyor (1 hafta = 1 kazanım kuralı hep korunuyor, kullanıcı kararı). `rehberlikYillikPlanHtmlSablon.ts`'teki ayrı/kırılgan takvim hesaplaması kaldırıldı, artık PDF de veriye gömülü `tarih`i kullanıyor — Yıllık Plan PDF ile Aylık Rapor artık birebir aynı kaynaktan besleniyor. Kalıcı, idempotent script: `scripts/rehberlik-yillik-plan-takvim-uyarla.ts` — gelecek yıl `egitimTakvimi2025.ts` güncellenince tekrar çalıştırılacak (kullanıcı: "her yıl yeniden güncellenen takvimle uyumlu plan çıkması önemli").

**tsc 0 hata (her adımda doğrulandı).** Kullanıcı cihazda DKAB+İHO düzeltmesini test etti, ÇALIŞTI onayı verdi. Rehberlik Yıllık Planı'nın PDF çıktısı (3 imza/tek sayfa/takvim kayması) cihazda henüz test edilmedi — **sıradaki adım.**

**Değişen/yeni dosyalar (bu oturum):** `src/lib/planUret.ts`, `src/data/rehberlikYillikPlanlari.ts`, `src/data/rehberlikYillikPlanHtmlSablon.ts`, `src/screens/main/SablonDoldurmaScreen.tsx` (Yıllık Plan formuna "Okul Rehber Öğretmeni" alanı), yeni `supabase/migrations/20260707000073_seed_temel_dini_bilgiler_iho.sql`, yeni `scripts/rehberlik-yillik-plan-takvim-uyarla.ts`. (`secmeliDersler.ts`/`rehberlikVeriZinciri.ts`/`SinifScreen.tsx` değişiklikleri önceki oturum 77'ye ait, aşağıdaki bölümde.)

---

## ŞU AN NEREDEYİZ (Onboarding — DKAB/TDE slug fix + Okul Öncesi yaş bandı entegrasyonu, 06.07.2026)

Kullanıcı onboarding'de test ederken 3 bug bildirdi: (1) Din Kültürü seçilince okul türü chip'leri çıkmıyor, (2) Din Kültürü VE Okul Öncesi (ayrı branşlar) seçilince yıllık plan hiç kurulmuyor, (3) Okul Öncesi'nde sınıf seçim ekranında sadece "Hazırlık Sınıfı" çıkıyor. Keşif ajanıyla (Explore) kök nedenler bulundu, ardından şef (ana oturum) tarafından doğrudan düzeltildi:

**1. DKAB + Türk Dili Edebiyatı slug uyumsuzluğu (kök neden, iki bug'ı birden açıklıyor):**
`src/data/secmeliDersler.ts`'teki yerel branş-eşleme verisi (`BRANS_DERSLER`, `SINIF_KISITLAMA`, `getKademeTiles`) `din_kulturu` ve `turk_dili_edebiyati` anahtarlarını kullanıyordu, ama Supabase'in v2 şema migration'ı (`20260614000067`) branş slug'larını `dkab` ve `turk_dili_ve_edebiyati` olarak değiştirmişti (kod hiç güncellenmemiş, stale kalmış). Sonuç: `getKademeTiles('dkab')` eşleşme bulamıyor → okul türü chip'leri hiç render edilmiyor; `getZorunluDersler('dkab',...)` de boş dönüyor → `DerslerScreen.tsx`'teki `disabled={seciliZorunlu.size === 0}` yüzünden **"Yılımı kur" butonu kalıcı kilitli kalıyordu** (asıl "yıllık plan kurulmuyor" şikayetinin kök nedeni). **Düzeltme:** üç anahtar da doğru slug'a yeniden adlandırıldı (veri kaybı yok, sadece rename). Aynı sınıf hata Türk Dili Edebiyatı'nda da vardı (kullanıcı bildirmemişti, aynı taramada bulundu, aynı şekilde düzeltildi).

**2. Okul Öncesi — izole yaş bandı çözümü (3 katmanlı kök neden):**
- Supabase'de 213 okul öncesi kazanımının hepsinde `sinif=0` sabitti, gerçek ayrım `yas_bandi` metin sütununda (`"36-48 ay"/"48-60 ay"/"60-72 ay"`) duruyordu — `SinifScreen` sadece `sinif`'i okuduğu için tek "Hazırlık" chip'i çıkıyordu.
- `planUret.ts`'in branş-modu sorgusu `sinif_tipi IN ('normal','hazirlik')` filtreliyordu — şemada zaten izole bir `sinif_tipi='okul_oncesi'` kategorisi vardı ama hiç sorgulanmıyordu, yani chip bug'ı düzelse bile **plan sorgusu boş dönerdi.**
- `DerslerScreen`'in "ders" kavramı okul öncesine hiç uymuyor (branşın tek dersi yok, gelişim alanları var).
- **Çözüm (kullanıcı onayıyla, izole — başka branşı etkilemiyor):** Yeni migration `20260706000072_patch_okul_oncesi_yas_bandi_sinif.sql` — `sinif_tipi='okul_oncesi'` satırlarına `yas_bandi`'ya göre `sinif=1/2/3` atandı (**Supabase'e uygulandı, `supabase db push` ile doğrulandı**). `planUret.ts`'e `bransSlug==='okul_oncesi'` özel dalı eklendi (`sinif_tipi` filtresine `'okul_oncesi'` katıldı). `SinifScreen.tsx`'te chip'ler artık "3 Yaş/4 Yaş/5 Yaş" gösteriyor, ders seçimi ekranı atlanıp direkt `Loading`'e geçiliyor (Sınıf Öğretmenliği'ne benzer özel rota).

**tsc 0 hata.** Migration Supabase'e push edildi ve `supabase migration list` ile remote'a işlendiği doğrulandı. **BEKLİYOR:** kullanıcının cihazda Din Kültürü + Okul Öncesi branşlarını seçip onboarding'i uçtan uca test etmesi.

**Değişen dosyalar (commit'lenmedi):** `src/data/secmeliDersler.ts`, `src/lib/planUret.ts`, `src/screens/onboarding/SinifScreen.tsx`, yeni `supabase/migrations/20260706000072_patch_okul_oncesi_yas_bandi_sinif.sql`.

---

## ŞU AN NEREDEYİZ (Rehberlik Yıllık Planı — yeni 13 xlsx kaynağı + gerçek MEB grid + okul öncesi, 06.07.2026)

Kullanıcı `evraklar/rehberlik/` altına 13 yeni ve daha temiz yıllık plan xlsx'i ekledi (okul_oncesi_rehberlik + ilkokul1-4 + ortaokul5-8 + lise9-12), eski 12 xlsx'i `arşiv/`'e taşıdı. İki arka plan ajan turuyla (evrak-engineer) tamamlandı:

**Tur 1 — veri taşıma + grid yeniden yazımı:**
1. `src/data/rehberlikYillikPlanlari.ts` yeni 13 xlsx'ten yeniden üretildi. Yeni dosyalarda gerçek kazanım satırları `"N- "` (numara-tire) ile başlıyor, idari/tatil satırlarında hiç numara yok — bu, TÜM 13 dosyada (okul öncesi + lise 9-12 dahil) tutarlı doğrulandı. Böylece **idari satır/gerçek kazanım ayrımı artık `/^\d+-\s*/` regex'iyle güvenilir şekilde yapılabiliyor** (önceki oturumların açık sorusu — "yıllık plandaki idari satırlar haftalık tabloda gerçek aktiviteymiş gibi görünüyor" — bu veri geçişiyle çözüldü).
2. `yeterlikAlani`/`etkinlikAdi` (PDF etkinlik kitaplarından önceki oturumda çıkarılmış) metin eşleştirmesiyle korunarak yeni veriye taşındı (sınıf başına 30-36/36 eşleşti).
3. **Yıllık Plan PDF şablonu** (`rehberlikYillikPlanHtmlSablon.ts`) tamamen yeniden yazıldı: eski tek-sütunlu uzun liste yerine artık **gerçek MEB grid'i** (3 ay yan yana bant: Eylül\|Ekim\|Kasım → Aralık\|Ocak\|Şubat → Mart\|Nisan\|Mayıs → Haziran), A4 yatay, tek sayfa. Referans disiplinine uygun: yeterlikAlani/etkinlikAdi bu belgeye eklenmedi (kasıtlı — sadece Aylık Rapor'da kalıyor, MEB'in gerçek Yıllık Plan formunda böyle sütun yok).
4. Okul öncesi yeni kademe olarak `REHBERLIK_YILLIK_PLAN[0]` ile eklendi, sınıf çipine "Okul Öncesi" seçeneği kondu.

**Tur 2 — takvim tarihi + okul öncesi entegrasyonu (kullanıcı kararlarına göre):**
1. Grid'deki "N.HAFTA" etiketinin altına, **gerçek takvim tarih aralığı** (`egitimTakvimi2025.ts`'teki 41 haftalık gerçek 2025-2026 takvimden hesaplanarak, `"22-26 Eyl"` formatında) eklendi — "N. Hafta" yazısıyla aynı hizada/paralel. Gerçek takvimde karşılığı olmayan birkaç "5.HAFTA" satırı (çoğu ayın sadece 4 takvim haftası var) kasıtlı boş bırakıldı, uydurulmadı.
2. `sinifNumarasiCikar()` (`rehberlikVeriZinciri.ts`) artık "Okul Öncesi"/"Anasınıfı"/"Ana Sınıfı A" gibi rakamsız girişleri tanıyıp `0` döndürüyor → Aylık Rapor ve Dönem Sonu Raporu akışları artık okul öncesi için de plan önerisi üretebiliyor.
3. Okul öncesi etkinlik kitabı PDF'i (`okul oncesi sinif rehberlik 2. cilt.pdf`) parse edildi — committed extract script'in `/\d+\. Sınıf/` filtresi okul öncesini eliyordu (rakamsız "Sınıf Düzeyi"), scratchpad'te düzeltilmiş kopyayla **36/36 etkinlik** gerçek yeterlikAlani/etkinlikAdi ile çıkarılıp dolduruldu. Boşta kalan yok.

**tsc 0 hata (tüm proje, iki turda da doğrulandı).** Her iki turda da Chrome headless render ile görsel doğrulama yapıldı (grid yapısı, hafta/tarih hizası, taşma kontrolü).

**BEKLİYOR — sıradaki adım:** Kullanıcı gerçek cihazda (Expo Go) test edecek: Yıllık Plan PDF'inin gerçek MEB grid görünümü (birkaç sınıf + okul öncesi), Aylık Rapor'un artık idari satırları doğru ayırması, okul öncesi için Aylık Rapor/Dönem Sonu akışının çalışması. Sorunsuzsa commit + push (henüz atılmadı, `feature/evrak-pdf-margin-mimarisi` branch'inde).

**Değişen dosyalar (bu oturum, commit'lenmedi):** `src/data/rehberlikYillikPlanlari.ts`, `src/data/rehberlikYillikPlanHtmlSablon.ts`, `src/data/rehberlikVeriZinciri.ts`, `src/screens/main/SablonDoldurmaScreen.tsx`.

---

## ŞU AN NEREDEYİZ (Rehberlik Aylık Rapor — crash fix, cihazda doğrulandı, 05.07.2026)

Kullanıcı Haziran-format geçişinden sonra hâlâ "elle giriş istiyor" diye bildirdi. Kök neden bulundu ve düzeltildi:

1. **Kök neden:** `SablonDoldurmaScreen.tsx` içindeki `rbVeriyiUygula` fonksiyonu `kayit?.haftalar.length` gibi güvensiz zincirleme kullanıyordu. Kullanıcının önceki test turlarından kalan, ESKİ formatlı (Haziran-geçişi öncesi `calismalar/kazanimlar/etkinlikler` şekilli) bir AsyncStorage kaydı aynı sınıf+ay anahtarıyla varsa, `kayit` dolu ama `kayit.haftalar` undefined oluyordu → `undefined.length` **TypeError fırlatıyordu**. Bu, "sessizce yok sayılan eski kayıt" değil, gerçek bir crash'ti — haftalık tablo hiç doldurulmadan `rbVeriyiUygula` çöküyordu. Aynı güvensiz erişim `testAnketler` ve `digerCalismalar` için de vardı. Üçü de `?.` zinciri tamamlanarak (`kayit?.haftalar?.length` vb.) düzeltildi.
2. **Ek sağlamlaştırma:** Önceden doldurma sadece "Sınıf" alanından `onEndEditing` ile tetikleniyordu (sıralamaya bağımlı — kullanıcı ayı sınıftan önce seçerse veya blur olmadan "İleri"ye basarsa tetiklenmeyebilirdi). Artık Adım 1→2 geçişinde (`rbIleri`) de garanti olarak çağrılıyor.
3. **tsc 0 hata. Kullanıcı cihazda test etti, ÇALIŞTI onayı verdi** ("bu sefer oldu eline sağlık").
4. **Açık/ertelenen soru:** Yıllık plandaki idari satırlar (örn. "1./2. Dönem Sınıf Rehberlik Faaliyet Raporu Hazırlama İşlemi", "RPD Hizmetleri Yürütme Komisyonu Toplantı", "Öğrenci Tanıma Formu" — hepsi `yeterlikAlani`/`etkinlikAdi` boş, gerçek kazanım değil) şu an haftalık kazanım tablosunda gerçek bir aktiviteymiş gibi görünüyor çünkü filtre sadece `tatil` bayrağına bakıyor. Kullanıcı: "yıllık planda öyle belirtiliyorsa öyle kalsın, sonra tekrar kontrol ederim" dedi — **kod değiştirilmedi, kullanıcı kararı bekleniyor.**

**Değişen dosya:** `SablonDoldurmaScreen.tsx` (rbVeriyiUygula + rbIleri).

## ŞU AN NEREDEYİZ (Rehberlik Aylık Rapor — Haziran formatına tam geçiş, 05.07.2026)

Kullanıcı, Aylık Rehberlik Raporu'nun eski (Eylül referanslı, 3 serbest liste) formatını Haziran referans belgesindeki gerçek MEB formatına ("haftalık tablo") çevirmemizi istedi. Yapılanlar:

1. **PDF veri çıkarımı (evrak-engineer, arka plan ajanı):** 7 ORGM etkinlik kitabı PDF'i (`evraklar/rehberlik/*.pdf`) `pdfjs-dist` ile (pdftotext Türkçe karakterleri bozuyordu, pdfjs-dist doğru çıkarıyor) tarandı, 432/562 yıllık plan satırı için gerçek "Yeterlik Alanı" + "Etkinlik Adı" bulunup `rehberlikYillikPlanlari.ts`'e eklendi (`RehberlikPlanHaftasi.yeterlikAlani?`/`etkinlikAdi?`). Script kalıcı: `scripts/extract-rehberlik-etkinlik.cjs`.
2. **Veri modeli:** `rehberlikSablon.ts`'e `RehberlikHaftaSatiri` (sıra/tarih/yeterlikAlani/kazanim/etkinlikAdi) ve `TestAnketSatiri` eklendi, `OgrenciGorusmeSatiri`'ye `ogrenciNo` eklendi. Eski `numaralaKazanim`/`numaralaEtkinlik`/`rehberlikGirisCumlesi` kaldırıldı (yeni formatta kullanılmıyor).
3. **HTML şablonu (`rehberlikHtmlSablon.ts`):** Tamamen yeniden yazıldı — SIRA|TARİH|YETERLİK ALANI|KAZANIM|ETKİNLİĞİN ADI haftalık tablosu, UYGULANAN TEST VE ANKETLER tablosu, DİĞER ÇALIŞMALAR, veli/öğrenci görüşmeleri (öğrenciye NO sütunu eklendi), 3 imza (Sınıf Öğretmeni/Okul Rehber Öğretmeni/Okul Müdürü — Haziran referansı tek imza gösteriyordu ama muhtemelen antiword kesintisi, Eylül referansındaki 3 imza korundu).
4. **Veri zinciri (`rehberlikVeriZinciri.ts`):** `RehberlikAylikKayit` yeni yapıya taşındı (`haftalar`/`testAnketler`/`digerCalismalar`). Yeni `yillikPlandanHaftaOnerisi()` — tam satır (tarih+yeterlikAlani+kazanim+etkinlikAdi) üretiyor. `donemVeriOzetiOlustur` yeni alan adlarına güncellendi (Dönem Sonu Raporu otomatik uyumlu).
5. **Wizard (`SablonDoldurmaScreen.tsx`, `isRehberlikAylik`):** "Çalışmalar" adımı artık 3 ayrı serbest liste yerine: haftalık satır kartları (plandan otomatik dolu, düzenlenebilir) + test/anket kartları (manuel) + diğer çalışmalar (manuel). Görüşmeler adımına öğrenci okul no alanı eklendi.

**tsc 0 hata (tüm proje).** Cihazda hiç doğrulanmadı — bir sonraki testte özellikle bakılacak: haftalık tablo gerçekten plandan dolu geliyor mu (özellikle daha önce hiç test edilmemiş yeni bir sınıf+ay ile), PDF çıktısında tablo okunur mü, eski AsyncStorage kayıtları (eski `calismalar/kazanimlar/etkinlikler` şeklinde) artık okunmuyor olacak (veri şekli değişti) — bu normal, eski kayıtlar sessizce yok sayılır.

---

## ŞU AN NEREDEYİZ (Q3 cihaz testi geri bildirimi — devam ediyor)

Kullanıcı P1-P7'yi Expo Go ile (tunnel modu, farklı WiFi) gerçek cihazda test etti. Bulunanlar ve durumları:

1. **Sınav analizi kazanım listesi boş geliyor** — `SinavAnaliziScreen.tsx`: `kazanimlariGetir()` hatayı sessizce yutuyordu (`catch {} → []`). Artık `console.warn` ile gerçek Supabase hatası + kullanılan filtreler (bransSlug/okulTipi/siniflar/dersFiltesi/sinif) Metro terminaline loglanıyor. Sorgu mantığı `planUret.ts` ile birebir aynı olduğu için kök neden statik incelemeyle bulunamadı — **bir sonraki testte terminal logu gerekiyor.**
2. **Yatay şablonlar (Kulüp Yıllık Planı, Yıllık Rehberlik Planı) önizlemede dikey açılıyordu** — kök neden bulundu: `src/lib/pdfOnizleme.ts`'teki `Print.printAsync({ uri })` çağrısı `orientation` parametresi almıyordu; Android'in native print dialog'u sayfa boyutundan bağımsız kendi yön seçicisine sahip ve varsayılan dikey açılıyordu. `orientation: Print.Orientation.landscape/portrait` eklendi, dosyanın gerçek width/height'ıyla artık eşleşiyor. **Düzeltildi, cihazda doğrulanmadı.**
3. **Rehberlik Aylık Raporu hâlâ elle doldurulmak zorundaydı** — iki kök neden: (a) `yillikPlandanKazanimOnerisi` (`rehberlikVeriZinciri.ts`) yalnızca `etkinlikNo` dolu satırları kullanıyordu, bu alan sadece lise 9-12'de dolu — 1-8. sınıflarda öneri hep boş dönüyordu; artık `etkinlikNo` yoksa plan içindeki doğal sıra kullanılıyor. (b) "Yapılan Çalışmalar" alanı hiç plandan beslenmiyordu, sadece "Kazanımlar" besleniyordu — ikisi de artık aynı öneriden doluyor. Dönem Sonu Raporu bu fonksiyonu dolaylı kullandığı için o da otomatik düzeldi. Kulüp Aylık Faaliyet Raporu, Kulüp Yıllık Plan (EK-7/b) ve Toplum Hizmeti Planı taraması yapıldı — onlarda zaten prefill vardı, ek iş çıkmadı. **Düzeltildi, cihazda doğrulanmadı.**
4. **Kulüp/Rehberlik chip yapısı** — kullanıcı P7'nin ayrı-ayrı 7 kart yaklaşımını istemiyor, tek "Kulüp Evrakları"/"Rehberlik Evrakları" chip'i + üstüne basınca alt liste açan sheet istiyor. ui-craftsman'a plan-onay-kod akışıyla verildi, kullanıcı planı onayladı, **şu an kodlanıyor (arka plan ajanı).**
5. **Performans Notu UX** — öğrenci listesi textarea'sı ilkel, puanlama ekranında kriter/puan düz metin gibi diziliyor, butonlar sıkışık, "Kriter Kriter Manuel" metni amatörce. Aynı ui-craftsman görevinin parçası, **şu an kodlanıyor.**

**Ajan mimarisi notu:** `ui-craftsman.md`'nin "sadece stil/hiyerarşi, fonksiyon bozma" kısıtı bu iki iş (IA değişikliği + form etkileşim redesign'ı) için görev bazlı genişletildi (component yapısı/etkileşim değiştirebilir, veri/iş mantığına dokunmaz). Kalıcı bir "UX mimarisi" ajanı ayrımı şimdilik gerekli görülmedi — sık tekrarlanırsa değerlendirilecek.

**İş 4+5 tamamlandı (ui-craftsman, arka plan ajanı):** Kulüp/Rehberlik tek-chip + `KategoriSheet` alt-liste; Performans Notu satır-kartı öğrenci listesi + tablo puanlama görünümü + spacing + "Elle Puanla" metni. `EvraklarimScreen.tsx` + `SablonDoldurmaScreen.tsx`. tsc 0 hata.

## Q3 testinin 2. turu — yeni bulgular + kök neden düzeltmeleri (05.07.2026, aynı oturum)

Kullanıcı Q3'ün ilk turundaki düzeltmeleri (chip IA hariç, o zaman henüz kodlanmamıştı) test etti, yeni sorunlar bildirdi. Hepsi kök nedeniyle düzeltildi:

1. **Sınav Analizi "Alınacak Tedbirler" kutusu amatörce/metin taşıyor** — `SinavAnaliziScreen.tsx` kendi ayrı `s` StyleSheet'ine sahip ve P1 düzeltmesi (radius.btn→radius.sm) ona hiç yansımamıştı. Aynı düzeltme burada da uygulandı.
2. **Sınav Analizi PDF'i yatay geliyor, dikey olmalıydı** — hem `sinavAnaliziHtmlSablon.ts`'teki `@page` (landscape idi) hem `disaAktar()`'daki `pdfOnizlemeAc(html, true)` çağrısı dikeye çevrildi. Bu, bugünkü oturumda yapılan bir regresyon değildi — muhtemelen önceden hiç gerçek PDF önizlemesi görülmemiş (P2 bu ekrana yeni eklendi), ilk kez ortaya çıktı.
3. **Kulüp Aylık Faaliyet Raporu hâlâ elle dolduruluyor** — gerçek kök neden bulundu: `kulupVarsayilanEtkinlikleri()` ay isimlerini büyük harfle (`"EKİM"`) döndürüyor, `RAPOR_AYLARI` ise başlık formatında (`"Ekim"`) — karşılaştırma `e.tarih === ay` hiçbir zaman eşleşmiyordu, otomatik doldurma hiç çalışmamıştı (P4/oturum notlarındaki "zaten çalışıyor" değerlendirmesi yanlıştı). Türkçe locale-aware karşılaştırmaya (`toLocaleUpperCase('tr-TR')`) çevrildi.
4. **Rehberlik Aylık Raporu hâlâ elle dolduruluyor (önceki fix'ten sonra da)** — muhtemel neden: kullanıcının daha önceki (buglu) bir denemeden kalma boş bir AsyncStorage kaydı, yeni plan-tabanlı öneriyi kalıcı olarak engelliyordu ("manuel varsa manuel" kuralı, boş "manuel" kaydı da manuel sayıyordu). Artık tamamen boş kayıtlar yok sayılıp plana düşülüyor. **Doğrulanmadı — kullanıcı aynı sınıf+ay ile tekrar denemeli, mümkünse daha önce hiç denenmemiş bir kombinasyonla da test edilmeli.**

tsc 0 hata (tüm proje). Cihazda doğrulanmadı — sıradaki adım kullanıcının bu 4 düzeltmeyi + İş 4/5'i tekrar test etmesi.

## Q3 testinin 3. turu — 3 yeni kalem (05.07.2026, aynı oturum)

1. **Kulüp Yıllık Planı Ekim'den başlıyor, Eylül'den başlamalı** — `kulupYillikPlanlari.ts` dosyasının başlığı bunun BİLİNÇLİ bir tasarım kararı olduğunu gösteriyor ("Format: AYLIK Ekim→Haziran, gerçek okul planıyla hizalı", Karatay TMTAL referansı). Referans disiplini gereği Eylül içeriği eklemek için kaynak/karar gerekiyor — **kullanıcı kontrol edecek, henüz dokunulmadı.**
2. **Rehberlik Yıllık Planı PDF'inde TARİH sütunu yerine HAFTA sütunu** — `rehberlikYillikPlanHtmlSablon.ts`: sütun artık "N. Hafta" (dikey/rotate metin) + altında parantez içinde tarih aralığı. Ay içi sıraya göre hesaplanıyor. **Düzeltildi, cihazda doğrulanmadı.**
3. **Rehberlik Aylık Rapor'da 7. sınıf etkinlikleri gelmiyor, 6. sınıf geliyordu** — izole test (`npx tsx`) ile `yillikPlandanKazanimOnerisi`'nin kendisinin HER sınıf/ay için doğru çalıştığı doğrulandı; asıl hata `rbVeriyiUygula`'daydı: kayıt kısmen doluysa (örn. sadece çalışmalar girilmiş eski bir denemeden) tüm kayıt "manuel" sayılıp diğer boş alanlar (kazanımlar) plana düşmüyordu. Artık çalışma/kazanım/etkinlik alanları birbirinden bağımsız: her biri kendi kayıtlı verisi yoksa plana düşüyor. **Düzeltildi, cihazda doğrulanmadı.**

tsc 0 hata (tüm proje).

## Q3 testinin 4. turu (05.07.2026, aynı oturum)

1. **Rehberlik Aylık Rapor hâlâ dolu gelmiyor (kullanıcı ısrarcı)** — kod mantığı yeniden izole test edildi, doğru çalışıyor; component kodu da mantık olarak doğru görünüyor. Kesin kanıt olmadan daha fazla spekülatif değişiklik yapılmadı. Bunun yerine ekrana **görünür geri bildirim** eklendi: "Sınıf & Bilgiler" adımında artık "Yıllık plandan N kazanım aktarıldı" ya da "öneri bulunamadı" mesajı var — bir sonraki testte bu mesaj neyi gösteriyor, ona göre kesin teşhis konacak. **Şüphe:** Fast Refresh sırasında ekran state'i sıfırlanmadan kod değişmiş olabilir — test etmeden önce ekrandan çıkıp tam yeniden girmek veya uygulamayı tam kapatıp açmak gerekebilir.
2. **Rehberlik Yıllık Planı PDF çıktısı "tamamen bozulmuş"** — önceki turda eklenen `writing-mode: vertical-rl` CSS'i muhtemelen PDF render motorunda tabloyu bozdu. Daha güvenli bir yönteme (`transform: rotate(-90deg)` tek blok, writing-mode yok) geçildi. **Önemli:** gerçek referans xlsx'leri (`evraklar/rehberlik/*.xlsx`) incelendi — asıl MEB formatı bizim uzun-liste tablomuzdan çok farklı (aylar yan yana 3'erli gruplar, mini tablo). Şimdilik sadece kullanıcının açıkça istediği (hafta no + tarih, ikisi de dikey) uygulandı, büyük grid redesign'ı YAPILMADI (kapsam kararı kullanıcıya soruldu, henüz yanıt yok). **Cihazda doğrulanamadı, PDF render'ı burada önizlenemiyor — kullanıcının ekran görüntüsü/tarifiyle iterasyon gerekiyor.**

tsc 0 hata.

---

## ŞU AN NEREDEYİZ (P1-P7 uygulandı, Q3 cihaz testi bekleniyor — önceki tur, tarihsel)

**Durum:** Aynı oturumun devamında (bkz. aşağıdaki "oturum 76 — Q2 test sonucu" bölümü) P1-P7'nin **hepsi kodlandı, `npx tsc --noEmit` 0 hata (tüm proje).** Henüz commit/push YAPILMADI — kullanıcı "ara verelim, kaldığımız yerden devam ederiz" dedi. Sıradaki adım: kullanıcı **Q3 cihaz testi** yapacak, sonra "kaydet" denilince commit+push edilecek.

**Tamamlanan 7 iş kalemi:**
1. **P1 — Form input tasarımı:** Kök neden bulundu: `s.input`'un `borderRadius: radius.btn` (=100, tam pill) olması — çok satırlı `textArea`'da yazı köşelerden taşıyordu (kullanıcının "gri rounded kutu taşmış" şikayetinin birebir kaynağı). `radius.sm`(10)'a çekildi + input/kart renk ilişkisi düzeltildi (`soruCard`/`ogretmenRow` artık beyaz+border, input krem sabit — kart içinde de dışında da görünür). Tek `s` StyleSheet objesi 12 sihirbaza da yansıdı. Dosya: `SablonDoldurmaScreen.tsx` (`s` bloğu). **Açık:** focus state (onFocus/onBlur ring) eklenmedi, istenirse ayrı görev.
2. **P2 — Sınav Analizi önizleme yoktu:** `SinavAnaliziScreen.tsx` hâlâ eski `Sharing.shareAsync` + çakışan native `margins` parametresinde kalmıştı (önceki oturumun "@page tek kaynak" mimari kararı bu ekrana hiç yansımamış). Yeni ortak `src/lib/pdfOnizleme.ts` (`pdfOnizlemeAc(html, yatay)`) hem bu ekranda hem SablonDoldurmaScreen'de kullanılıyor artık — kod tekrarı da önlendi. `expo-sharing` artık hiçbir yerde import edilmiyor (paket silinmedi).
3. **P3 — Yatay (landscape) print bug (kritik kök neden):** `expo-print`'in `printToFileAsync` API'si **`orientation` parametresi almıyor** — sayfa boyutu yalnızca `width`/`height` (px, 72 PPI, varsayılan 612×792 = US Letter dikey). HTML'deki `@page { size: A4 landscape }` CSS'i native tarafta yön belirlemiyor. Çözüm: `pdfOnizlemeAc` helper'ı artık her çağrıda açık `width/height` geçiyor — A4 dikey (595×842) / A4 yatay (842×595). **Bu, önceki oturumun "tek kaynak @page" mimari kararını GEÇERSİZ KILMADI ama YETERSİZ olduğunu gösterdi** — @page hâlâ margin için tek kaynak, ama sayfa boyutu/yönü için native width/height de gerekli. 12+1 (Sınav Analizi) çağrı düzeltildi.
4. **P4 — Rehberlik veri zinciri:** Yeni `src/data/rehberlikVeriZinciri.ts`: `rehberlikAylikKaydiOku/Yaz` (AsyncStorage `@yaver/rehberlik_aylik_<sinif>_<ay>`), `yillikPlandanKazanimOnerisi` (plan→kazanım türetme, testte doğrulandı), `donemVeriOzetiOlustur` (dönem1=Eylül-Ocak/ay no 1-5, dönem2=Şubat-Haziran/ay no 6-10, yılsonu=tümü). Aylık Rapor'da sınıf+ay girilince önce kayıtlı manuel veri yoksa plan önerisi geliyor; kayıt "Raporu Oluştur"da kalıcı saklanıyor. Dönem Sonu'nda sınıf+dönem seçilince ilgili ayların faaliyetleri+kazanım durumu otomatik doluyor (manuel>plan önceliği, pristine-check ile üzerine yazmıyor). **AsyncStorage native modül olduğu için tam zincir gerçek cihazda (Q3) doğrulanmalı** — saf mantık (kazanım türetme, sınıf parse) node'da test edildi ve doğru.
5. **P5 — Kulüp Karar Defteri hazır içerik:** Yerel referans (`1847518-yoklama-ve-karar-defteri.doc`) tamamen boş şablondu, gerçek gündem/karar örneği yoktu. Web araştırması yapıldı (kullanıcı izin verdi), gerçek dolu bir MEB kulüp karar defteri bulundu (Bilim Fen ve Teknoloji Kulübü, 5 toplantı kaydı). `kulupSablon.ts`'e `ilkToplantiVarsayilanGundem()`/`ilkToplantiVarsayilanKarar()` eklendi — `bosKararSatiri(1)` (ilk toplantı) artık bu gerçek desenle dolu geliyor, öğretmen isterse hiç dokunmadan kullanabilir. Sonraki toplantılar (no>1) hâlâ boş (gerçekten toplantıya özel, uydurulamaz).
6. **P6 — Margin standardizasyonu:** 13 `@page` kuralı dağınıktı (12mm-25mm) → dikey **14mm/16mm**, yatay **12mm/14mm** standardına çekildi (`performansHtmlSablon.ts` zaten dar, dokunulmadı).
7. **P7 — EvraklarimScreen IA:** Kulüp (4) + Rehberlik (3) evrakları eski yatay liste kartından (`kulupCard`) çıkarılıp ana `SABLONLAR` ile aynı `sablonCard` kare chip grid'ine taşındı. Alt başlıklar (KULÜP/REHBERLİK EVRAKLARI) korundu, artık grid render ediyor. `KulupSheet` açma davranışı + navigation param'ları aynen.

**Yeni dosyalar:** `src/lib/pdfOnizleme.ts`, `src/data/rehberlikVeriZinciri.ts`.
**Değişen dosyalar:** `SablonDoldurmaScreen.tsx`, `EvraklarimScreen.tsx`, `SinavAnaliziScreen.tsx`, `kulupSablon.ts`, 12 `*HtmlSablon.ts` (margin).

**BEKLİYOR — sıradaki adım (Q3):** Kullanıcı gerçek cihazda test edecek — özellikle: form inputların görünümü, 3 yatay belgenin (Kulüp Yıllık Planı, Toplum Hizmeti Planı, Yıllık Rehberlik Planı) GERÇEKTEN yatay çıkıp çıkmadığı, Sınav Analizi'nin artık önizleme açması, rehberlik veri zincirinin AsyncStorage kısmı (Aylık Rapor'da sınıf+ay girince plan önerisi geliyor mu, Dönem Sonu'nda toplama çalışıyor mu), Karar Defteri ilk toplantının otomatik dolu gelmesi, ve EvraklarimScreen'in yeni grid görünümü.

**Onay bekleyen:** Sorun çıkmazsa kullanıcı "kaydet" diyecek → commit + `origin`'e push (main'e merge ayrı onay gerektirir, R1 görevi hâlâ blocked).

**Ajan organizasyonu notu:** Bu turda P1(ui-craftsman)+P7(ui-craftsman) arka planda paralel ajanlarla yapıldı; P2/P3/P4/P5/P6 şef (ana oturum) tarafından doğrudan yapıldı (mimari/veri işleri, tek dosya zinciri). Pano: `node scripts/board.cjs`.

---

## ŞU AN NEREDEYİZ (oturum 76 — Q2 test sonucu + sıradaki plan)

**Durum:** Kullanıcı `feature/evrak-pdf-margin-mimarisi` branch'ini Expo Go ile gerçek cihazda test etti (Q2). **Push edilmedi, main'e merge edilmedi** — önce aşağıdaki geri bildirim işlenecek, sonra "her şeyi push et" denilecek.

**Test sonucu — 7 iş kalemi (öncelik sırasıyla, henüz hiçbiri kodlanmadı):**

1. **P1 — Form input tasarımı (en kritik):** `SablonDoldurmaScreen.tsx`'teki `s.input`/`s.textArea` "düz yazı" gibi görünüyor, bazı yerde taşan gri rounded kutu var. Gerçek form-input görünümüne çevrilecek (ui-craftsman: `/yaver-ui-kit`+`/ui-redesign`+`/ux-critic`). Merkezi stil olduğu için tek düzeltme tüm sihirbazlara yansır.
2. **P2 — Sınav Analizi'nde PDF önizleme yok:** direkt paylaşıma açıyor (diğer 10 evrak `Print.printAsync` önizlemesine geçmişti, bu ekran unutulmuş/eski `Sharing.shareAsync` deseninde kalmış). İzole hızlı fix.
3. **P3 — Yatay (landscape) print bug (kritik, mimari):** `@page A4 landscape` render'da DİKEY çıkıyor. Kök neden: muhtemelen expo-print native tarafı `@page` orientation'ı yok sayıyor; çözüm muhtemelen `Print.printToFileAsync`'e açık `width/height` (points, landscape=width>height) geçmek. **Etkilenen:** Kulüp Yıllık Planı, Toplum Hizmeti Planı, Yıllık Rehberlik Planı. Kural netleşti: **"plan" olan her evrak yatay, diğerleri (rapor/defter/tutanak/dilekçe) dikey.**
4. **P4 — Rehberlik veri zinciri (en büyük iş):** Yıllık Plan → Aylık Rapor → Dönem Sonu Raporu şu an birbirinden kopuk. Olması gereken: Aylık Rapor açılınca o ayın Yıllık Plan verisi öneri olarak gelir (kulüp aylık rapor deseni gibi) → öğretmen düzenlerse **AsyncStorage'da sınıf+ay bazlı kalıcı saklanır** → Dönem Sonu Raporu, dönemin (I=Eylül-Ocak/ay 1-5, II=Şubat-Haziran/ay 6-10, Yılsonu=tümü — `REHBERLIK_AYLARI` sırasına göre) ilgili aylarını otomatik toplar: öğretmen o ay için manuel kayıt girmişse onu, girmemişse plandan geleni kullanır.
5. **P5 — Kulüp Karar Defteri'ne hazır varsayılan içerik:** Şu an bilinçli boş (önceki karar: "gerçek toplantı verisi türetilemez"). Yeni istek: öğretmen hiç dokunmadan da kullanabilmeli → tipik/örnek gündem-karar metni (gerçek veri değil, şablon). Referans yoksa kullanıcıdan istenecek ya da web araştırması yapılacak. **Genel felsefe hatırlatması (kullanıcı vurguladı):** çoğu evrak zaten hazır-varsayılanlı gelmeli, bu gözle diğer modüller de gözden geçirilecek.
6. **P6 — Margin standardizasyonu:** Önceki oturumun "≤20mm" kuralı yetersiz, hâlâ fazla boşluklu. Tüm şablonlar tek seferde daha dar/tutarlı bir standarda çekilecek (P3 ile aynı @page dosyalarına dokunulacağı için birlikte yapılabilir).
7. **P7 — EvraklarimScreen bilgi mimarisi:** Kulüp + Rehberlik evrakları şu an ayrı/altta/farklı stilde (liste kartı) duruyor. Ana ızgaradaki chip/kart formatına çevrilip yukarı taşınacak.

**Planlanan sıra:** P1+P7 (tek UI redesign geçişi) → P3+P6 (print mimarisi) → P2 (hızlı) → P4 (veri zinciri) → P5 (içerik).

**Test edilip SORUN BULUNMAYAN kısımlar (dokunma):** Diğer evrakların (Aylık Rehberlik Raporu, Dönem Sonu form akışı, Dilekçe, Zümre/ŞÖK/Veli/Performans/Kulüp Yıllık Plan içeriği) önizlemesi kullanıcıya göre "güzel" — sadece kenar boşluğu (P6) ve input stili (P1) genel sorun.

---

## ŞU AN NEREDEYİZ (oturum 75 özeti)

**Branch:** `feature/evrak-pdf-margin-mimarisi` (main'e merge edilmedi) — bu oturumda büyük ilerleme, tek commit.

**Bu oturumda yapıldı:**
1. **Ajan organizasyonu kuruldu** — `.claude/agents/` 5 rol (delivery-lead, evrak-engineer, ui-craftsman, qa-verifier, refactor-engineer) + `.claude/orchestration/board.json` + operating model + handoff/ + `scripts/board.cjs` (status/next/gate). Şef-conductor modeli: alt-ajanları ana oturum başlatır, handoff dosya-tabanlı, paralellik yalnız ayrık dosya setlerinde. Bu oturumda 4 ajan koştu (F3a refactor, F3b/c ui, E2 ekstraksiyon, E4 dilekçe).
2. **Rehberlik + Dilekçe evrak ailesi tamamlandı (E1–E4)** — hepsi gerçek referans belgeden (referans disiplini):
   - **E1 Aylık Rehberlik Raporu** — `rehberlikSablon.ts`+`rehberlikHtmlSablon.ts` (referanstan YENİDEN yazıldı; önceki tahmin-şablon atıldı). `isRehberlikAylik` 3 adım + Evraklarim "REHBERLİK EVRAKLARI" bölümü. 3 imza, otomatik kazanım/etkinlik numaralandırma.
   - **E2 Yıllık Rehberlik Planı** — `rehberlikYillikPlanlari.ts` (ajan, 12 sınıf xlsx ekstraksiyon) + `rehberlikYillikPlanHtmlSablon.ts` (yatay, AY rowspan). 9-12: 36 etkinlik; 1-8: numarasız (kaynakta yok). `isYillikPlan` + sınıf seçici + kart.
   - **E3 Dönem Sonu Raporu** — `donemSonuSablon.ts`+`donemSonuHtmlSablon.ts` (7 bölüm: kazanım durumu X-kutu, teknikler, faaliyet+otomatik toplam, yönlendirme, veli anne/baba/diğer, güçlükler, PDR). `isDonemSonu` 4 adım + kart.
   - **E4 Dilekçe Bankası** — `dilekceSablon.ts`+`dilekceHtmlSablon.ts` (ajan, 4 tür: mazeret/ücretsiz/nakil/genel). Mevcut "Dilekçe" gridi kartı `isDilekce` 2 adım + tür seçimine bağlandı.
   - **BEP dosyaları silindi** (referanssızdı, tahminle yazılmıştı).
3. **Toplum Hizmeti Çalışma Planı → yatay** (plan=yatay / rapor-defter-tutanak-dilekçe=dikey kuralı netleşti; Yoklama/Karar Defteri dikey kaldı). Oturum 74'ün açık sorusu böyle kapandı.
4. **Faz 3 (PlanimScreen):** F3a — 7 sahte `hazirSayisi` sayacı + ölü stil/import kaldırıldı. F3b — Bu Hafta saf defter görünümüne indi (neon glow→nötr kart, iki-satır editoryal peek, gerçek kazanım kodu). F3c — uydurma "Son Hazırlananlar" bölümü kaldırıldı.

**Doğrulama:** `tsc` 0 (tam proje). Her HTML üreticisi tsx ile örnek veriyle render edilip yapı gözle doğrulandı. Görsel PRINT doğrulaması (sayfa kırılımı/margin) yerel renderer olmadığı için **Q2 cihaz testine** bırakıldı.

**BEKLİYOR — sıradaki adım (Q2):** Kullanıcı Expo Go'da test edecek (tüm evraklar + rehberlik ailesi + dilekçe + sadeleşen Bu Hafta). Sorunsuzsa R1 → main merge/PR. Canlı durum: `node scripts/board.cjs`.

**Bilinen kaynak sorunu:** Lise (9-12) yıllık planlarında bahar dönemi (Ocak-Haziran) tarihleri kaynak xlsx'te "2025" (2026 olmalı) — MEB dosyasının kendi typo'su, referans disiplini gereği aynen korundu. İstenirse tek pass düzeltilebilir (yalnız lise).

**Referans belgeler** kullanıcı tarafından eklendi: `evraklar/rehberlik/` (12 xlsx yıllık plan + dönem sonu/aylık docx), `evraklar/dilekce/`, `evraklar/sube ogretmenler kurulu/`.

---

## ŞU AN NEREDEYİZ (oturum 74 özeti)

**Branch:** `feature/evrak-pdf-margin-mimarisi` (main'e merge edilmedi, henüz PR açılmadı) — son commit `635a99b`.

**Bu oturumda yapıldı (hepsi push edildi):**
1. PDF margin mimarisi: `@page` CSS tek kaynak oldu, 7 `printToFileAsync` çağrısındaki çakışan sabit native `margins` parametresi kaldırıldı.
2. Kulüp Yıllık Planı → yatay (A4 landscape), diğer plan/rapor şablonları dikey kaldı.
3. Performans Notu modülü sadeleştirildi: öğrenci isimleri artık tek seferde (satır satır, sınıfa göre AsyncStorage'da) giriliyor, tekrar tekrar kart açıp isim girme yok. Otomatik/Manuel puanlama modu öğrenci başına değil sınıf geneli seçiliyor, "Tümünü Dağıt" tek tuşla tüm sınıfı dağıtıyor.
4. PDF üretilir üretilmez direkt paylaşım açma sorunu çözüldü: `Sharing.shareAsync` → `Print.printAsync({ uri })`, artık önce native PDF önizlemesi açılıyor.
5. Sağ/sol kenar boşluğu 20mm'yi aşan 4 şablon (SOK, Veli, Zümre, Aylık Rapor) 20mm'ye çekildi.

**BEKLİYOR — sıradaki adım:** Kullanıcı gerçek cihazda (Expo Go, tunnel modu ile farklı WiFi) test edecek. Sorun çıkmazsa `feature/evrak-pdf-margin-mimarisi` → `main`'e merge/PR.

**Test sırasında özellikle bakılacaklar:**
- 8 evrak türünde kenar boşlukları görsel olarak dengeli mi (özellikle SOK/veli/zümre/aylık rapor artık 20mm)
- Kulüp Yıllık Planı gerçekten yatay ve tablo okunur şekilde sığıyor mu
- Performans Notu: öğrenci listesi girip aynı sınıfa tekrar girince liste otomatik geliyor mu, "Tümünü Dağıt" doğru çalışıyor mu
- PDF önizleme ekranı (Print.printAsync) her 8 evrak türünde de açılıyor mu, sonra paylaşım/yazdırma seçenekleri erişilebilir mi

**Onay bekleyen açık soru:** Toplum Hizmeti Çalışma Planı ve Yoklama/Karar Defteri de yatay yapılsın mı? (Geniş tablolu ama "yıllık plan" değiller — kullanıcıya soruldu, yanıt gelmedi, dokunulmadı.)

**Ayrıca bu oturumda görüldü, dokunulmadı (kullanıcıya ait, muhtemelen Rehberlik evrak ailesi çalışması):** `src/data/bepHtmlSablon.ts`, `bepSablon.ts`, `rehberlikHtmlSablon.ts`, `rehberlikSablon.ts` — untracked, commit'lenmedi.

---

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
