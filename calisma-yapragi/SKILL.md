---
name: calisma-yapragi
description: >-
  MEB Maarif Modeli kazanımlarından müfredata uygun, çift aşamalı QA kontrolünden
  geçmiş çalışma yaprağı üretir. Çıktı mobil uygulamada doğrudan render edilebilir
  yapılandırılmış JSON'dur; istenirse yazdırılabilir HTML de üretilir. Kullanıcı bir
  kazanım kodu verdiğinde (FİZ.9.1.2, COĞ.10.2.1 gibi), "çalışma yaprağı", "yaprak",
  "worksheet", "kazanım için soru/etkinlik üret", "toplu üret" dediğinde ya da MEB
  müfredatı/kazanımlarıyla ilişkili herhangi bir içerik üretimi istediğinde — skill
  adını anmasa bile — bu skill'i mutlaka kullan. Sınav sorusu ve etkinlik üretimi
  istekleri de bu skill'in şeması ve QA akışıyla yapılır.
---

# Çalışma Yaprağı Üretici (MEB Kazanım Tabanlı)

Amaç: Bir MEB kazanımından, müfredata sadık, bilimsel olarak doğrulanmış, mobil
uygulamada render edilebilir bir çalışma yaprağı JSON'u üretmek.

Kalite iki katmanla güvence altına alınır ve ikisi de atlanamaz — çünkü bu çıktılar
öğrencilerin önüne çıkacak; yanlış bir cevap anahtarı veya müfredat dışı bir kavram,
tek tek fark edilemeyecek kadar çok sayıda üretim yapılacağı için sistematik olarak
yakalanmak zorundadır:

1. **Deterministik doğrulama** — `scripts/validate_worksheet.py` (şema, cevap
   anahtarı eksiksizliği, tip kuralları)
2. **Bağımsız crosscheck** — üretimi yapmayan bir denetçi geçişi, soruları cevap
   anahtarına bakmadan çözer ve `references/qa_rubric.md` ile denetler

## Adım 0 — Kazanımı belirle

Kazanım verileri `data/` klasöründe ders bazlı JSON dosyalarındadır
(alanlar: `kod, ad, sinif, unite, aciklama, ders, ...`). `aciklama` alanı kazanımın
süreç bileşenlerini (a, b, c, ç...) içerir — üretimin bel kemiği budur.

Kazanımı bulmak için scripti kullan (elle JSON taramak yerine):

```bash
python3 scripts/find_kazanim.py FİZ.9.1.2                 # kodla
python3 scripts/find_kazanim.py --ders fizik --sinif 10    # listele
python3 scripts/find_kazanim.py "mekanik enerji"           # metinle ara
```

İstenen ders `data/` içinde yoksa: kullanıcının bu oturumda verdiği JSON dosyalarına
bak (uploads / bağlı klasör). O da yoksa kullanıcıdan kazanım JSON'unu veya en
azından kazanım metnini iste — kazanım metni olmadan üretim yapma, uydurma kazanımla
üretilen yaprak değersizdir.

## Adım 1 — Kaynak araştırması (kitapla bağ)

İçerik ders kitabından kopuk olmamalı. Üretimden önce kazanımın ünitesi için MEB
kaynaklarını araştır (WebSearch / web_fetch varsa):

- `site:ogmmateryal.eba.gov.tr <ders> <sınıf>` (OGM Materyal — resmî lise materyalleri)
- `"<ünite adı>" <ders> <sınıf> MEB ders kitabı`
- EBA ve meb.gov.tr kaynakları

Amaç birebir kopya değil; kitaptaki terminolojiyi, kapsam sınırlarını ve örnek
bağlamlarını yakalamak (ör. kitap "sürat" diyorsa yaprak "hız" ile karıştırmamalı).
Web erişimi yoksa veya sonuç bulunamazsa: kazanımın `aciklama` alanına ve kendi
müfredat bilgine daya, ve bunu `meta.qa.notlar` alanına açıkça yaz — bu not, sonraki
insan kontrolünde önceliklendirme sağlar.

## Adım 2 — Üretim

Üretmeden önce oku:

- `references/worksheet_schema.md` — JSON şeması ve soru tipi sözleşmeleri (çıktı
  buna birebir uymalı; mobil uygulama bu şemayı parse edecek)
- `references/pedagoji.md` — bölüm yapısı, zorluk dağılımı, dil kuralları,
  ders-özel notlar

Üretim ilkeleri:

- **Süreç bileşeni kapsaması:** Kazanımın `aciklama`sındaki her bileşen (a, b, c...)
  en az bir soruyla karşılanmalı; her soru `surec_bileseni` alanıyla etiketlenmeli.
  Kazanım "sınıflandırabilme" diyorsa sorular sınıflandırtmalı, "akıl yürütebilme"
  diyorsa ezber bilgi sormamalı — soru tipini kazanımın fiiline göre seç.
- **Kademeli yapı:** 3 bölüm — Tanıyalım (ısınma; kazanım pekiştirmeyse
  "Hatırlayalım" kullanılabilir), Kavrayalım (anlama), Uygulayalım (analiz/problem).
  Toplam 6-9 soru, 20-30 dk hedefle.
- **Sayfa bütçesi (kesin kural):** Öğrenci kısmı 1 A4 sayfaya sığmalı (kullanıcı
  kapsamlı isterse en çok 2) + cevap anahtarı ayrı sayfa. Bunun pratiği: alan-yoğun
  tiplerden (tablo_doldurma, eslestirme, dogru_yanlis bloğu) bir yaprakta en çok 2,
  acik_uclu'dan en çok 2 kullan; soru gövdelerini kısa tut. Üretim sonrası
  `render_html.py` sayfa sayısını GERÇEK ölçer (weasyprint; kurulu değilse önce
  `pip install weasyprint --break-system-packages`) ve öğrenci kısmı 1 sayfayı
  aşınca uyarır, 2'yi aşınca hata verir — aşımda İÇERİĞİ kısalt (en zayıf soruyu
  çıkar, puanları 100'e yeniden dengele), şablonla oynama.
- **Konu özeti üretme:** `konu_ozeti: null` bırak. (Sadece kullanıcı açıkça
  isterse ekle; o zaman da en fazla 2 kısa cümle + anahtar kavramlar — ders
  anlatımı değil, yaprağı çözmeye yetecek kadar hatırlatma.)
- **Müfredat sınırı:** Üst sınıfların kavramlarını kullanma (spiral müfredat).
  Emin değilsen o kavramın hangi sınıfta verildiğini kazanım verisinden kontrol et.
- **Görsel gereken sorular:** Gerçek görsel üretilemez. Tabloyla/metinle ifade
  edilebilen soruları tercih et; görsel şartsa `gorsel` alanına ayrıntılı betimleme
  yaz (uygulama tarafı sonradan çizdirebilir), soruyu görsel olmadan çözülemez
  bırakma.
- Sayısal problemlerde büyüklükleri gerçekçi seç ve çözümü kendin hesaplayarak yaz.

## Adım 3 — Deterministik doğrulama

```bash
python3 scripts/validate_worksheet.py <dosya.json>
```

ERROR'ları düzeltmeden ilerleme. WARN'ları değerlendir (çoğu bilinçli bir tercihse
kabul edilebilir, ama nedenini bil).

## Adım 4 — Bağımsız crosscheck

Bu adımın değeri bağımsızlıktan gelir: üretici kendi hatasını göremez.

- **Subagent kullanabiliyorsan (tercih edilen):** Bir denetçi subagent başlat.
  Ona yalnızca şunları ver: yaprak JSON dosya yolu, kazanım JSON'u,
  `references/qa_rubric.md` yolu. Üretim gerekçelerini ANLATMA — taze gözle
  denetlesin. Rubrikteki prosedürü uygulayıp JSON rapor döndürsün.
- **Subagent yoksa:** Üretimden ayrı bir geçişte rubriği uygula: önce soruları
  cevap anahtarına bakmadan kendin çöz (hesaplamaları python ile yap), sonra
  anahtarla kıyasla, sonra kalan rubrik kontrollerini yap.

Rapor sorun içeriyorsa: düzelt → Adım 3'ü tekrar çalıştır → sorunlar kritikse
(cevap anahtarı hatası, müfredat dışı içerik) crosscheck'i de tekrarla.
Sonucu `meta.qa` alanına işle (hangi kontroller geçti, kalan notlar).

Düzeltme yaparken JSON'a küçük parça düzenlemeleri (Edit) yerine dosyayı bütün
olarak yeniden yazmayı tercih et — bazı ortamlarda kısmi düzenleme, dosya senkron
sorunları yüzünden bozuk/kesik JSON bırakabiliyor. Yazdıktan sonra dosyayı parse
ederek bütünlüğünü doğrula.

## Adım 5 — Teslim

- Dosya adı: `<KOD>_calisma_yapragi.json`, Türkçe karakter ve nokta sadeleştirilir
  (ör. `FIZ_9_1_2_calisma_yapragi.json`). Çıktı klasörüne kaydet.
- Her JSON'un yanına insan kontrolü için A4 önizlemesi de üret:
  `python3 scripts/render_html.py <json>` (cevap anahtarı ayrı sayfada). JSON asıl
  üründür (uygulama bunu tüketir); HTML, öğretmenin/insanın yaprağı kâğıt üstünde
  görür gibi hızla değerlendirebilmesi içindir — insan gözü JSON okuyamaz.
- Dosyaları kullanıcıya sun (present_files varsa onunla).

## Toplu üretim

Birden çok kazanım istendiğinde her kazanım tam pipeline'dan geçer (araştırma dahil;
aynı üniteyse araştırma bir kez yapılıp paylaşılabilir).

- 5'e kadar: sırayla üret.
- Daha fazlası: üretimi kazanım başına subagent'lara paralel dağıt (her subagent bu
  SKILL.md'yi okuyup tek kazanım için tam akışı uygular), ana ajan sonunda tüm
  dosyalara validate_worksheet.py çalıştırıp bir `index.json` yazar
  (kod → dosya adı → QA durumu).

## Sınav sorusu / etkinlik üretimi

Aynı şema `meta.tur` alanıyla genişler: `sinav_sorusu` (tek bölüm, çoktan seçmeli
ağırlıklı, ÖSYM/yazılı formatı), `etkinlik` (yönergeli grup/bireysel etkinlik).
QA akışı değişmez. Ayrıntı: `references/worksheet_schema.md` sonu.
