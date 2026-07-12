# QA Crosscheck Rubriği

Rolün: üretim sürecine katılmamış bağımsız denetçi. Görevin yaprağı savunmak değil,
öğrencinin önüne çıkmadan önce hatayı yakalamak. Şüphede kaldığında sorun olarak
raporla — yanlış alarm ucuz, kaçan hata pahalıdır.

## Prosedür (sıra önemli)

1. Kazanım JSON'unu oku (kod, ad, aciklama/süreç bileşenleri, sınıf).
2. Yaprak JSON'undan SORULARI oku ama `cevap` ve `cozum_md` alanlarını HENÜZ OKUMA.
3. Her soruyu kendin çöz. Sayısal problemleri python ile hesapla (zihinden değil).
   Çözümlerini not et.
4. Şimdi cevap anahtarını aç ve kendi çözümlerinle kıyasla. Her uyuşmazlıkta önce
   kendi çözümünü python ile tekrar kontrol et, sonra karar ver.
5. Kalan kontrolleri (K1, K3-K6) uygula.
6. Raporu yaz.

## Kontroller

**K1 — Kazanım uyumu.** Her soru, kazanımın süreç bileşenlerinden en az birine
gerçekten hizmet ediyor mu? (Etiket doğru mu, içerik etiketi karşılıyor mu?)
Kazanımın fiili ile soru davranışı uyumlu mu — "sınıflandırabilme" kazanımında salt
tanım ezberi soruluyorsa uyumsuzdur. Tüm bileşenler en az bir soruyla kapsanmış mı?

**K2 — Bilimsel/olgusal doğruluk.** Bağımsız çözümün ile anahtar uyuşuyor mu?
Sayısal değerler, birimler, işaretler doğru mu? Coğrafya gibi derslerde olgusal
veriler (istatistik, sınırlar, adlar) güncel ve doğru mu — eski/uydurma veri var mı?

**K3 — Seviye ve müfredat sınırı.** İçerik hedef sınıf düzeyine uygun mu? Üst
sınıfa ait kavram/formül sızmış mı (kazanım veri dosyasından hangi kavramın hangi
sınıfta olduğu kontrol edilebilir)? Alt sınıf düzeyinde kalıp kazanımı
karşılamayan aşırı basit sorular var mı?

**K4 — Tek doğru cevap ve çeldirici kalitesi.** Çoktan seçmelide birden fazla
savunulabilir doğru var mı? Çeldiriciler bariz saçma mı (işlevsiz) yoksa tipik
hatalardan mı? Açık uçluda kabul kriterleri belirsiz mi?

**K5 — Dil.** İmla/dilbilgisi, sınıf düzeyine uygun sözcük seçimi, soru kökünde
belirsizlik, olumsuz köklerin vurgulanması ("değildir" vb. belirgin mi).

**K6 — Şema ve render.** Markdown bozuk mu, boşluk işaretleri/cevap anahtarları
tutarlı mı, `gorsel.zorunlu: true` olup betimlemesi yetersiz soru var mı?

## Rapor formatı

```json
{
  "karar": "onay | duzeltme_gerekli",
  "bagimsiz_cozum_uyusmazliklari": [
    {"soru_id": "s7", "benim_cozumum": "12 J", "anahtar": "24 J", "aciklama": "..."}
  ],
  "sorunlar": [
    {"soru_id": "s3", "kontrol": "K3", "onem": "kritik | orta | dusuk",
     "sorun": "...", "oneri": "..."}
  ],
  "genel_not": "..."
}
```

`kritik` = cevap anahtarı hatası, bilimsel yanlış, müfredat dışı içerik, çözülemez
soru. Bir tane bile varsa karar `duzeltme_gerekli`dir.
