# MEB Müfredat JSON Extraction — Proje Bağlamı

Bu dökümanı yeni bir chatte PDF ile birlikte yükle.
Validate scripti de ayrıca yükle (validate_kazanimlar.py).

---

## Görev

MEB öğretim programı PDF'lerini aşağıdaki JSON şemasına dönüştürmek.
Her PDF sonrası validate_kazanimlar.py çalıştırılır — 0 hata / 0 uyarı olmadan dosya kabul edilmez.

---

## JSON Şeması

```json
{
  "brans_id": "string",
  "okul_turu": "string",
  "sinif": integer,
  "unite_no": integer,
  "unite_adi": "string",
  "kazanim_kodu": "string",
  "kazanim_metni": "string"
}
```

`okul_turu`: `ilkokul` | `ortaokul` | `lise` | `ihl` | `iho`

---

## Branş ID Tablosu

| brans_id | Branş | Kademe |
|----------|-------|--------|
| `sinif_ogretmeni` | Sınıf Öğretmeni | ilkokul 1-4 |
| `turkce` | Türkçe | ortaokul |
| `turk_dili_edebiyati` | TDE | lise, ihl |
| `matematik` | Matematik | ilkokul, ortaokul, lise, ihl, iho |
| `fen_bilimleri` | Fen Bilimleri | ortaokul, iho |
| `sosyal_bilgiler` | Sosyal Bilgiler | ortaokul, iho |
| `tarih` | Tarih | lise, ihl |
| `cografya` | Coğrafya | lise, ihl |
| `felsefe` | Felsefe Grubu | lise, ihl |
| `fizik` | Fizik | lise, ihl |
| `kimya` | Kimya | lise, ihl |
| `biyoloji` | Biyoloji | lise, ihl |
| `ingilizce` | İngilizce | tüm kademeler |
| `almanca` | Almanca | ortaokul, lise, ihl |
| `fransizca` | Fransızca | lise, ihl |
| `din_kulturu` | DKAB | tüm kademeler |
| `arapca` | Arapça | iho, ihl |
| `gorsel_sanatlar` | Görsel Sanatlar | tüm kademeler |
| `muzik` | Müzik | tüm kademeler |
| `beden_egitimi` | Beden Eğitimi | tüm kademeler |
| `rehber_ogretmen` | PDR | ortaokul, lise |
| `bilisim_teknolojileri` | BT | ortaokul, lise |
| `teknoloji_tasarim` | Teknoloji ve Tasarım | ortaokul, iho |

---

## Tamamlanan Dosyalar (Yeniden Üretme)

| Dosya | brans_id | Sınıflar | Kazanım |
|-------|----------|----------|---------|
| `fen_bilimleri_kazanimlar.json` | sinif_ogretmeni (3-4) + fen_bilimleri (5-8) | 3-8 | 182 |
| `turkce_tema_kazanimlar.json` | turkce | 5-8 | 616 |
| `matematik_ortaokul_kazanimlar.json` | matematik | 5-8 | 100 |
| `muzik_kazanimlar.json` | muzik | 1-8 | 108 |
| `beden_egitimi_ilkokul_kazanimlar.json` | beden_egitimi | 1-4 | 53 |
| `arapca_iho_kazanimlar.json` | arapca (iho) | 5-8 | 311 |
| `husnuhat_kazanimlar.json` | gorsel_sanatlar (ihl) | 11 | 36 |
| `sosyal_bilgiler_kazanimlar.json` | sosyal_bilgiler | 4-7 | 71 |

---

## Kazanım Kodu Formatları

| Ders | Format | Örnek |
|------|--------|-------|
| Fen Bilimleri | `FB.sınıf.ünite.bölüm.no` | `FB.5.1.1.1` |
| Matematik | `MAT.sınıf.ünite.no` | `MAT.5.1.1` |
| Sosyal Bilgiler | `SB.sınıf.alan.no` | `SB.4.1.1` |
| Müzik | `MÜZ.sınıf.ünite.no` | `MÜZ.5.1.1` |
| Beden Eğitimi | `BEO.sınıf.ünite.no` | `BEO.1.1.1` |
| Türkçe | `T.beceri.sınıf.no` | `T.D.5.1` |
| Hüsnühat | `HH.düzey.ünite.no` | `HH.I.1.1` |
| Arapça İHO | `ARP.sınıf.ünite.alan.no` | `ARP.5.1.1.1` |

Türkçe beceri harfleri: D=Dinleme/İzleme, O=Okuma, K=Konuşma, Y=Yazma

---

## Türkçe — Özel Yapı

Türkçe'de ünite değil **tema** var (6 tema/sınıf). `unite_no/adi` = tema.
Sarmal yapı: aynı `kazanim_kodu` farklı temalarda tekrar edebilir — normaldir.

**Tema kazanım sayıları (PDF resmi tablosu):**
5.sınıf: 24+26+27+27+28+26 = 158
6.sınıf: 28+33+27+22+22+21 = 153
7.sınıf: 24+30+25+27+26+19 = 151
8.sınıf: 24+31+28+27+25+19 = 154
TOPLAM: **616**

Extraction kuralı: sadece `ÖĞRENME ÇIKTILARI` → `İÇERİK ÇERÇEVESİ` bloğu arası.

---

## Çalışma Akışı (Her PDF için)

```
1. pdftotext dosya.pdf /tmp/full.txt
2. pdftotext -layout dosya.pdf /tmp/layout.txt
3. PDF'deki "Öğrenme Çıktıları Sayısı ve Süre Tablosu"ndan beklenen sayıları not et
4. Kazanım kodu formatını belirle
5. Sadece ÖĞRENME ÇIKTILARI → İÇERİK ÇERÇEVESİ bloğu arasını çıkar
6. python3 validate_kazanimlar.py çalıştır
7. Kod boşluğu hatalarını bul → görsel kontrol (pdftoppm ile rasterize)
8. PDF tablosundaki resmi sayılarla karşılaştır
9. 0 hata, 0 uyarı, sayılar eşleşene kadar tekrarla
```

---

## Bilinen PDF Tuzakları

| Tuzak | Örnek | Çözüm |
|-------|-------|-------|
| Kod-numara arası boşluk | `MÜZ. 5.1.6.` | `MÜZ\.\s*\d` regex |
| Nokta eksik (yazım hatası) | `T.O.5.24 Metin` | `[. ]` ile bitir |
| Satır ortasında kod | `VE SÜREÇ BİLEŞENLERİ FB.5.3.1.` | `re.search()` kullan |
| Tire ile bölünmüş metin | `"yönelik basit çı-"` | layout mode + devam satırı birleştir |
| Uygulama referansı | `Uygulamaları SB.4.1.1` | prefix kontrolü ile atla |
| Beceri referansı | `KB2.14. (SB.4.1.1)` | parantez içi kodları atla |
| Nokta yerine boşluk | `SB 7.1.1.` | `SB[. ]\d` regex |
| Sütunlu tablo | `T.D.5.1.   T.D.6.1.   Metin` | layout mode: metin solda, kodlar sağda |
| Uzun birleşik metin | metin + açıklama paragrafı | ilk skill verb'de kes |

---

## Geçerli Kazanım Metni Nasıl Biter?

`bilme`, `etme`, `yapabilme`, `edebilme`, `yönetebilme`, `söyleyebilme`,
`çözümleyebilme`, `karşılaştırabilme`, `yorumlayabilme`, `sorgulayabilme`,
`oluşturabilme`, `tanımlayabilme`, `sergileyebilme`, `uygulayabilme` vb.

**Kötü işaretler (validator yakalar):**
- 15 karakterden kısa → yanlış yakalanmış
- 300 karakterden uzun → birleşmiş, kes
- `SDB2.1`, `OB4`, `KB2.14`, `E1.1` içeriyor → uygulama metni karışmış
- Skill verb ile bitmiyor → devam satırı alınmamış

---

## Validation Kullanımı

```bash
python3 validate_kazanimlar.py
```

Sarmal dosyalar için (Türkçe) scriptin SARMAL_FILES listesine ekle:
```python
SARMAL_FILES = ['turkce_tema_kazanimlar.json']
```

**Validation katmanları:**
1. Alan bütünlüğü — 7 zorunlu alan dolu mu
2. Duplicate kodlar — sarmal dosyalar hariç
3. Kod boşlukları — `1,2,4` → "3 eksik" tespiti
4. Metin uzunluğu — çok kısa / çok uzun
5. Skill verb kontrolü — uygun fiille bitiyor mu
6. Artefakt tespiti — öğretim kodu karışmış mı

**Altın kural:** Extraction bitmeden önce PDF'deki resmi sayı tablosuyla karşılaştır.
Sayılar eşleşmiyorsa kaçırılan kodları bul — genellikle boşluklu/nokatasız yazım hatası.
