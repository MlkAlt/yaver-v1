# Çalışma Yaprağı JSON Şeması (v1.0)

Mobil uygulama bu şemayı doğrudan parse edip render eder. Alan adları ve tipler
birebir korunmalı. Tüm `*_md` alanları Markdown'dır (kalın, italik, satır sonu,
pipe-tablo desteklenir; HTML kullanma).

## Üst düzey yapı

```json
{
  "meta": {
    "sema_surumu": "1.0",
    "tur": "calisma_yapragi",
    "baslik": "Fizik Biliminin Alt Dalları",
    "kazanim": {
      "kod": "FİZ.9.1.2",
      "ad": "Fizik biliminin alt dallarını sınıflandırabilme",
      "ders": "Fizik",
      "sinif": 9,
      "unite": "1. ÜNİTE: FİZİK BİLİMİ VE KARİYER KEŞFİ",
      "surec_bilesenleri": {
        "a": "Alt dalların niteliklerini belirler.",
        "b": "Alt dalları niteliklerine göre ayrıştırır."
      }
    },
    "tahmini_sure_dk": 30,
    "toplam_puan": 100,
    "olusturulma": "2026-07-10",
    "qa": {
      "yapisal_dogrulama": true,
      "crosscheck": true,
      "kaynak_arastirmasi": "ogmmateryal.eba.gov.tr 9. sınıf fizik materyali incelendi",
      "notlar": []
    }
  },
  "konu_ozeti": null,
  "bolumler": [
    {
      "ad": "Tanıyalım",
      "yonerge": "Aşağıdaki boşlukları uygun kavramlarla doldurunuz.",
      "sorular": []
    }
  ]
}
```

`meta.kazanim.surec_bilesenleri`: kazanımın `aciklama` alanındaki maddelerin
harf → metin sözlüğü. Sorulardaki `surec_bileseni` değerleri bu anahtarlardan
biri olmalı (doğrulama scripti bunu kontrol eder).

`konu_ozeti`: varsayılan `null` (üretilmez). Kullanıcı açıkça isterse
`{"icerik_md": "en fazla 2 kısa cümle", "anahtar_kavramlar": [...]}` biçiminde.

Sayfa bütçesi: öğrenci kısmı 1 A4 sayfa (en çok 2) + cevap anahtarı ayrı sayfa;
6-9 soru. `render_html.py` tahmini sayfa sayısını raporlar, 2'yi aşarsa hata
koduyla döner.

## Soru nesnesi — ortak alanlar

```json
{
  "id": "s1",
  "tip": "coktan_secmeli",
  "zorluk": "orta",
  "surec_bileseni": "a",
  "puan": 10,
  "govde_md": "Soru metni...",
  "gorsel": null,
  "cevap": {},
  "cozum_md": "Adım adım çözüm / gerekçe. Boş bırakılamaz."
}
```

- `id`: yaprak içinde benzersiz (`s1`, `s2`, ...)
- `zorluk`: `kolay | orta | zor`
- `gorsel`: görsel gerekliyse `{"betimleme": "Yatay zeminde F kuvvetiyle çekilen
  sandık; F=20N, sürtünmesiz...", "zorunlu": false}`. `zorunlu: true` ise soru
  görselsiz çözülemez demektir — bundan kaçın.
- `cevap` yapısı tipe göre değişir (aşağıda).

## Soru tipleri ve `cevap` sözleşmeleri

### coktan_secmeli
```json
{
  "secenekler": [
    {"harf": "A", "metin_md": "..."},
    {"harf": "B", "metin_md": "..."}
  ],
  "cevap": {"dogru": "B"}
}
```
4 veya 5 seçenek. Tek doğru. Çeldiriciler tipik öğrenci hatalarından türetilmeli.

### dogru_yanlis
```json
{
  "ifadeler": [
    {"no": 1, "metin_md": "...", "cevap": true, "gerekce_md": "..."}
  ],
  "cevap": {"ozet": {"1": true, "2": false}}
}
```
Bir soru bloğu 3-6 ifade içerir. Yanlış ifadelerin `gerekce_md`si doğrusunu söyler.

### bosluk_doldurma
```json
{
  "govde_md": "Fiziğin ısı ve sıcaklık olaylarını inceleyen alt dalı ____(1)____ dır.",
  "kelime_havuzu": ["termodinamik", "optik", "mekanik"],
  "cevap": {"1": "termodinamik"}
}
```
Boşluk işareti: `____(n)____`. `kelime_havuzu` isteğe bağlı; havuzda çeldirici
fazladan kelimeler bulunabilir.

### eslestirme
```json
{
  "sol": [{"no": 1, "metin_md": "Işığın kırılması"}],
  "sag": [{"harf": "A", "metin_md": "Optik"}],
  "cevap": {"1": "A"}
}
```
`sag` tarafta 1-2 fazladan çeldirici olabilir.

### acik_uclu
```json
{
  "cevap": {
    "ornek_cevap_md": "Tam puanlık örnek cevap...",
    "kabul_kriterleri": ["X kavramını kullanması", "Y ilişkisini kurması"]
  }
}
```

### problem_cozme  (sayısal hesaplama)
```json
{
  "cevap": {"deger": 25, "birim": "m/s", "tolerans_yuzde": 2}
}
```
`cozum_md` adım adım hesap içermeli. Değer, çözümdeki hesapla birebir tutarlı olmalı
(crosscheck bunu python ile yeniden hesaplar).

### siralama
```json
{
  "ogeler": ["Gözlem", "Hipotez", "Deney", "Sonuç"],
  "cevap": {"dogru_sira": [0, 1, 2, 3]}
}
```
`ogeler` karışık sırada verilir; `dogru_sira` öğelerin indeksleriyle doğru dizilimi.

### tablo_doldurma
```json
{
  "tablo": {
    "basliklar": ["Alt Dal", "İnceleme Alanı"],
    "satirlar": [["Mekanik", "__?__"], ["__?__", "Işık olayları"]]
  },
  "cevap": {"r0c1": "Hareket ve kuvvet", "r1c0": "Optik"}
}
```
Boş hücre işareti `__?__`; cevap anahtarı `r<satır>c<sütun>` (0 tabanlı).

## Bölüm yapısı önerisi

| Bölüm | İçerik | Tipik tipler |
|---|---|---|
| Tanıyalım (pekiştirmeyse: Hatırlayalım) | ısınma, temel kavram | bosluk_doldurma, dogru_yanlis, eslestirme |
| Kavrayalım | anlama, ilişkilendirme | coktan_secmeli, siralama, tablo_doldurma |
| Uygulayalım | analiz, problem, transfer | problem_cozme, acik_uclu, coktan_secmeli (zor) |

## Diğer türler (`meta.tur`)

- `sinav_sorusu`: tek bölüm (`ad: "Sorular"`), ağırlıkla coktan_secmeli ve
  problem_cozme; yazılı formatında acik_uclu. Konu özeti yer almaz
  (`konu_ozeti: null`).
- `etkinlik`: bölüm yerine `asamalar` benzeri kullanım gerekirse yine `bolumler`
  yapısı kullanılır; sorular yerine yönergeli görevler `acik_uclu` tipiyle yazılır,
  `kabul_kriterleri` gözlem ölçütü olur.

Şema değişikliği gerekirse `sema_surumu`nu artır ve değişikliği bu dosyaya işle.
