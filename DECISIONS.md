# Yaver V1 — Karar Günlüğü

---

## Ürün Kapsamı

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

### 2026-05-24 — DersProgramı onboarding'den çıkarıldı (Oturum 40)
**Karar:** Ders programı girme ekranı onboarding akışından kaldırıldı. WowMoment'taki "Ders programını gir →" CTA → "Planıma git →" (MainTabs'a yönlendiriyor). DersProgramiScreen silinmedi — PlanimScreen'de BuHafta kartının altına sessiz bir strip CTA eklendi ("Ders programını ekle").
**Sebep:** UX ilkesi #5 — aha anına kadar sıfır engel. Ders programı verisi planUret için kritik değil; yalnızca haftalık ders saati görünümünü etkiliyor. Sonradan da girilebilir, onboarding'de blocker olmamalı.

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
