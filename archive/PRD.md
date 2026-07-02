# Öğretmen Yaver — PRD v1.0

**Tarih:** 10.06.2026
**Durum:** Onaylı taslak — Melik + Claude oturumlarında netleşen ürün kurgusu.
**İlişki:** Bu doküman SPEC_FULL.md'nin üzerine yazılan güncel ürün kararlarını içerir. Çakışmada PRD kazanır.

---

## 1. VİZYON

Öğretmenin zihinsel yükünü alan asistan. Öğretmen düşünmez, onaylar.

Ürün "AI içerik üreticisi" değil; **planı takip eden, evrakı gününde hazırlayan, sınavı kazanım dağılımıyla kuran ve bunları öğretmen yerine düşünen** bir asistan. Ödeme kararı tek bir özellikten değil, bu düzenli yapıya ulaşmaktan doğar.

---

## 2. DEĞER MİMARİSİ (acı → rol)

| Acı noktası | Sıklık | Şiddet | Üründeki rolü |
|---|---|---|---|
| Deftere kazanım yazma (PDF'te arama) | Günde 5-6× | Düşük | **Alışkanlık** — günlük açılma motoru, bedava |
| Derse hazırlık / 40 dk doldurma (yaprak, etkinlik) | Günlük | Orta | Alışkanlığı besler, pakete değer katar |
| Yıllık plan hazırlama | Yılda 1-2× | Yüksek | **Kanca** — indirme sebebi, tamamen bedava |
| Yazılı hazırlama (soru + kazanım tablosu) | Dönemde 2-3× | Yüksek | **Para** |
| Sınav analizi | Dönemde 2-3× | Çok yüksek | **Para** + döngü kapatıcı |
| Evrak + takip kaygısı (zümre, ŞÖK, denetim) | Dönemlik + sürekli | Yüksek | **Para + retention** |

**Üç katman kuralı:**
- Sıklık alışkanlık yaratır → bedava (maliyeti zaten sıfır: deterministik)
- Şiddet ödeme yaratır → Pro (sınav süreci, evrak otomasyonu)
- Takvim geri getirir → kampanya anları (Eylül plan, dönem sonu evrak)

---

## 3. ÇEKİRDEK MODÜLLER

### M1 — Plan Takibi (bedava, sınırsız)
- Yıllık plan: branş + sınıf seçimi → 30 saniyede gerçek MEB müfredatıyla kurulum (mevcut planUret).
- **Bu Hafta görünümü (ana sayfa):** haftanın kazanımları sınıf-sınıf, deftere yazılacak haliyle, büyük punto. Bugünün günü vurgulu. Tamamen offline.
- "İşledim ✓" — opsiyonel tek dokunuş. Gerçek ilerleme verisi üretir; sınav dağılım önerisi ve plan kayması uyarısı buradan beslenir.
- Plan tabı: yılın tamamı (dönem → ay → hafta), salt okunur, yazdırılabilir indirme.

### M2 — Evrak
- Şablonlar: zümre tutanağı, ŞÖK, veli toplantısı, kulüp evrakları, dilekçeler.
- Form **akıllı varsayılanlarla dolu** gelir: tarih bugün, okul bilgileri kayıtlı, katılımcılar son tutanaktan.
- **Evrak takvimi:** Yaver tarihleri kendisi takip eder (dönem başı zümre, ŞÖK dönemleri, dönem sonu). Öğretmen hiçbir şey girmez.
- **Denetim dosyası kartı:** branşa göre olması gereken evrak listesi, yeşil/kırmızı durum, eksikler tek tıkla üretilir.

### M3 — Sınav
- **Kazanım dağılım ekranı (ürünün kalbi):** Yaver işlenen haftalara göre kazanımları ve soru sayılarını önerir, öğretmen ayarlar. "İşledim" verisi yoksa plan haftaları kullanılır.
- Paket çıktı (tek seferde): sınav + cevap anahtarı + soru-kazanım dağılım tablosu + **yarı dolu analiz şablonu** (sorular ve kazanımlar işli, öğretmen sadece puan girer).
- **Analiz döngüsü:** arşivdeki sınava "sonuçları gir" → kazanım bazlı sınıf analizi → zayıf kazanımda öneri: "Tekrar yaprağı hazırlayayım mı?"

### M4 — Ders İçeriği
- Çalışma yaprağı, basit etkinlik, soru seti. Slayt/animasyon kapsam dışı (V2'de datayla değerlendirilir).
- Birincil giriş bağlamdan: Bu Hafta kartı → "hazırla" → varsayılanlar dolu → üret. Gelişmiş ayarlar katlanır.
- Her çıktıda kazanım kodu görünür (güven).

### M5 — Asistan Katmanı
- **Hatırlatma (bedava):** akşam bildirimi (yarının dersi hazırlıksızsa), evrak takvimi bildirimi, dönem sonu kontrol. Günlük max 2 bildirim (hard cap).
- **Hazırlama (Pro):** aynı tetikleyiciler ama hazırlamış olarak gelir: "Zümre tutanağın hazır, isimleri onayla."
- **Asistan feed'i (zil):** Yaver'in yaptıkları + yaklaşanlar, tek liste.
- Teknik: V1'de lokal zamanlanmış bildirim (expo-notifications) — backend cron yok. Auth sonrası (V1.5) server push'a evrilir.

---

## 4. BİLGİ MİMARİSİ

**4 tab + sağ üstte profil ve zil:**

| Tab | İçerik |
|---|---|
| **Bu Hafta** | Haftanın kazanımları (defter görünümü) + asistan şeridi |
| **Plan** | Yılın tamamı, dönem→ay→hafta gezinme, indirme |
| **Hazırla** | Sınav + yaprak + etkinlik + soru üretimi, üretim arşivi |
| **Evrak** | Denetim dosyası kartı + şablonlar + evrak takvimi + evrak arşivi |

Stack ekranlar: HaftaDetayı, Üretim, Çıktı Önizleme, Şablon Doldurma, Sınav Dağılımı, Sınav Analizi, Profil, Ders Programı, Okul Bilgileri, Asistan Ayarları, Asistan Feed.

---

## 5. UX AKIŞLARI (dokunuş bütçeli)

**Günlük döngü — 0 dokunuş:**
Aç → Bu Hafta ekranı → deftere yaz → kapat. Ara yok, arama yok, scroll en fazla sınıflar arası.

**İçerik üretimi — 3 dokunuş:**
Bu Hafta kartı → "hazırla" → tip seç (varsayılanlar dolu) → üret → önizleme → indir (otomatik arşiv + toast).

**Evrak (push) — 3 dokunuş:**
Bildirim → form dolu açılır → Oluştur → indir.

**Sınav — 5 dokunuş:**
Hazırla → Sınav → sınıf → dağılım ekranı (öneri gelir, ayarla) → üret → paket indir.
Sonrası: arşiv → "sonuçları gir" → puanlar → analiz → tekrar önerisi.

**Onboarding (değişmedi, çalışıyor):**
Branş → Sınıf → (ek/seçmeli dersler) → Loading → Wow → Bu Hafta. Auth yok, soru minimum.

**Kapı anları:**
- Auth: ikinci üretimde soft modal ("Üretimini kaybetmemen için seni tanımam lazım"). Kapatılabilir.
- Paywall yalnızca 3 anda, hepsi değer görünürken: sınav paketi indirme · aylık hak bitimi sonrası üretim · Pro "hazırladım" bildirimini açma. Soğuk fiyat sayfası yok.

---

## 6. GELİR MODELİ

**Çerçeve:** Okul yılı üyeliği (Eylül–Haziran, kampanya: Eylül + Şubat) + aylık seçenek. Yıllık belirgin avantajlı (≈9-10 aylık fiyat). Rakamlar launch'ta test edilir — şimdiden sabitlenmez.

**Free / Pro matrisi:**

| Özellik | Free | Pro |
|---|---|---|
| Yıllık plan + indirme | Sınırsız | Sınırsız |
| Bu Hafta / defter görünümü | Sınırsız | Sınırsız |
| Hatırlatma bildirimleri | Var | Var |
| Ders içeriği (yaprak/etkinlik/soru) | Ayda 5 | Sınırsız |
| Evrak şablonu | Ayda 2 | Sınırsız |
| Sınav paketi | Dönemde 1 | Sınırsız |
| Sınav analizi | Var (paketle) | Var + tekrar önerileri |
| Asistanın hazırlamış gelmesi ("hazırladım") | — | ✓ |
| Denetim dosyası tek tık tamamlama | Durumu görür | ✓ üretir |
| Arşiv | Bu yıl | Geçmiş yıllar + yeni yıla plan devri |

*Limit rakamları hipotezdir; ilk 100 kullanıcı verisiyle revize edilir.*

**Pro'nun tek cümlelik vaadi:** "Yaver senin yerine düşünür ve hazır eder."

**Büyüme mekanikleri (maliyetsiz):**
- Her PDF altında zarif "Yaver ile hazırlandı" satırı — belge dolaşır, uygulama dolaşır.
- Zümre tutanağı çok kişilik: katılımcılara link ile davet → isimler dolar, herkese kopya gider (V1.5).

---

## 7. TASARIM İLKELERİ

- Tek pattern her yerde: dark hero (#1A1A1A) + krem panel (#F7F5F2) — mevcut karar, ana tablara da uygulanır (mavi gradient header kalkar).
- **Kazanım metni her zaman ekrandaki en büyük tipografik öğe.** Uygulamanın içeriği odur.
- Eksik/hazır durumu yalnızca gerçek veriyle gösterilir. Veri yoksa "hazırlanmadı" dili hiç kullanılmaz.
- Renk rolleri sabit: accent = aksiyon, yeşil = hazır, turuncu = dikkat.
- Boş state'ler yönlendirir: "Programını gir, sabah seni dersinle karşılayayım."
- Mikro dil korunur: "Hazırla" / "Benim yerime hazırla" / "Yazdırmaya hazır indir". "AI/üret/jeton" yasak.
- Offline mutlak kural: plan + Bu Hafta + arşiv ağsız çalışır. Ağ isteyen tek şey üretim.

---

## 8. MEVCUT KODDAN FARKLAR (geçiş listesi)

| Mevcut | Hedef |
|---|---|
| PlanimScreen: gradient header + selamlama + progress + Hızlı Hazırla grid + mock Son Hazırlananlar | **Bu Hafta** ekranı: kazanım kartları hero, asistan şeridi, dark hero pattern |
| `hazirSayisi: 0` hard-coded, hazır/eksik sahte | Üretim kayıtlarına bağlanır; bağlanana kadar "hazırlanmadı" UI'ı kaldırılır |
| DersIcin 2×3 grid (Slayt, Ödev dahil) | **Hazırla**: Sınav öne, yaprak/etkinlik/soru; Slayt çıkar |
| Sınav = soru üretiminin bir tipi | Ayrı akış: dağılım ekranı + paket çıktı + analiz |
| Evraklarım: şablon listesi (mock) | Denetim dosyası kartı + gerçek şablon üretimi + takvim |
| Çıktı .txt | Yazdırmaya hazır PDF (expo-print) — paket çıktılar için zorunlu |
| Bildirim yok, zil işlevsiz | Lokal bildirim + asistan feed'i |
| Plan AsyncStorage'da, feedback local | V1: AsyncStorage kalır; auth gelince (ikinci üretim) Supabase'e senkron |

**Korunanlar:** onboarding akışı, planUret, YillikPlan ekranı (Plan tabı olur), token sistemi, Edge Function generate, müfredat datası.

---

## 9. V1 KESİMİ

**V1'de var:** M1 tamamı · M2 (3-4 çekirdek şablon + takvim bildirimi + denetim kartı) · M3 (dağılım + paket + manuel analiz) · M4 (yaprak/etkinlik/soru) · M5 hatırlatma katmanı (lokal bildirim) · PDF çıktı · soft auth · free limitler + tek paywall ekranı.

**V1.5:** Pro "hazırladım" otomasyonu (server push + cron) · zümre davet mekaniği · geçmiş yıl arşivi · tarz öğrenme (feedback datasıyla) · ödeme altyapısı tam · kamera ile optik okuma araştırması.

**Kapsam dışı (kalıcı/şimdilik):** sürpriz hazırlık (iptal kararı korunur) · slayt/animasyon · in-app editor · ders kitabı RAG · çoklu branş.

---

## 10. BAŞARI METRİKLERİ

- **Alışkanlık:** DAU/WAU, hafta içi günlük açılma oranı, Bu Hafta ekranında geçirilen süre (kısa = iyi; hedef <30 sn)
- **Değer:** üretim/kullanıcı/ay, sınav paketi kullanımı, evrak üretimi, "işledim" işaretleme oranı
- **Dönüşüm:** paywall görüntüleme → Pro, Eylül/Şubat kampanya dönüşümü
- **Güven:** kazanım hata bildirimi sayısı (hedef: 0), feedback dağılımı
- **Maliyet:** cache hit (%70+), üretim başına AI maliyeti
