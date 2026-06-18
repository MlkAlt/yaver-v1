# Yaver V2 — Pivot Stratejisi (Taslak)

**Oturum:** 68 (16-17 Haziran 2026)
**Durum:** Pivot kararları alındı. `SPEC_FULL.md` V2 yazımı bekleniyor.
**Önceki spec:** V1.4 — yıllık plan + AI içerik vurgulu, "asistan" vaadi soyuttu, sürpriz hazırlık iptal edilmişti
**Yeni felsefe kaynağı:** Tony Fadell prensipleri (anchor moment, görünmez asistan, background work, detail obsession, story before features)

---

## 1. Tek Cümle Vaat

> **"Yaver hazırlar, sen öğretirsin."**

**Alt cümleler (Play Store / reklam):**
- "Yıllık plan, evraklar, kazanımlar — tek uygulamada."
- "Sınıfa gir, kazanımı gör. Defterini yaz."
- "Sınav analizini Yaver hazırlar."
- "Müfettiş geldiğinde Yaver hazır."

---

## 2. 4 Lens — Yorgunluk Çözüm Tablosu (Marketing copy filtresi)

Mimari sütun değil, **bakış açısı**. Yeni özellik teklif gelirse "Bu 4 yorgunluktan birini hafifletiyor mu?" sorusuyla filtrelenir.

| # | Öğretmen Yorgunluğu | Yaver'in Çözümü | Lens |
|---|---|---|---|
| 1 | Evrak yükü altında yorulurum | Tek tıkla evrak hazır | **EVRAK** |
| 2 | Her ders ne katacağımı düşünmekten yorulurum | Ana ekran + Yaver Hazırla | **DERS** |
| 3 | Tarihleri hatırlamaktan yorulurum | Akşam recap + akıllı takvim | **HATIRLAT** |
| 4 | Dönemsel evrak aramaktan yorulurum | Öğretmen Dosyası | **DOSYA** |

---

## 3. Çekirdek Özellik Seti

### 🟢 KAL (V1.4'ten)
- Yıllık plan üretimi (hijyen özellik — pazarlama vurgusu değil)
- 9077 kazanım veri tabanı
- 23 branş + okul tipi + sınıf yapısı
- Onboarding (basitleştirilecek)
- AI içerik üretimi (UI'da "Yaver Hazırla" — "AI" kelimesi yok)

### 🟡 EKLE (Yeni)
- **Sınav Analizi** ⭐ (kalp özelliği — birden fazla problemi çözüyor)
- **Öğretmen Dosyası** ⭐ (yılbaşı setup + otomatik birikim)
- **Akşam Recap push** (20:00 — yarın programı + eksikler)
- **Akıllı Takvim** (zümre/ŞÖK/sınav/tören tek görünüm)
- **Ders Programı yükleme** (onboarding — manuel/foto)
- **Anlık Yardım Kutusu** (Pro feature — pedagoji sorularına Claude cevabı)
- **Karne Dönemi otomatik notları** (HATIRLAT)
- **Geçen Yıl Hafızası** ("geçen yıl 9-A'ya şu yaprağı vermiştin")
- **Pazar Gecesi cache hazırlığı** (sessiz batch üretim)
- **Sınıf Akıllı Hafıza** (Sınav Analizi'nden besleniyor)
- **A4 Sığma + TR Karakter mükemmelliği** (detail obsession)

### 🔴 ÇIKAR
- ~~Sürpriz Hazırlık~~ (zaten iptal — kalsın)
- ~~"Sınıfa Girdim" modu~~ (overengineering)
- ~~Streak rozeti~~ (yapay habit hack)
- ~~Veli mesajlaşma in-app~~ (veli indirmez)
- ~~Branş özel UI elementleri~~ (CEFR, 4-tema, formül kartı) — sade kişiselleştirme yeterli
- ~~"AI" kelimesi UI'dan~~ → "Yaver hazırla"
- ~~Yıllık plan'ın pazarlama vurgu~~ — hijyen özelliği

### ⏸ İLERİDE
- Veli QR kod paylaşımı
- e-Okul/MEBBİS senkronu
- Cevap kağıdı OCR taraması
- Sınav Yaklaşırken Çalışma Programı (sadece hatırlatma + soru önerisi versiyonu kaldı)

---

## 4. Sınav Analizi — Detay (Yeni Kalp Özellik)

### Akış
1. Öğretmen sınav tarihini Akıllı Takvim'e girer
2. Sınav günü push: "Bugün 9-A matematik sınavı. Notları sonra girersin mi?"
3. Sınav sonrası push: "9-A sınavını analiz edelim mi?"
4. Öğretmen notları girer (3 yöntem):
   - Manuel tek tek (yedek)
   - Excel/CSV upload (e-Okul export)
   - V2.5: Cevap kağıdı foto → AI OCR
5. Yaver hesaplar:
   - Sınıf ortalaması
   - Her kazanım için başarı %
   - En zayıf 3 kazanım + En güçlü 3 kazanım
6. Çıktı 1: **Resmi Sınav Analizi PDF/Word** → Öğretmen Dosyasına otomatik
7. Çıktı 2: **Sınıf Hafızası verisi** (gizli kazanç) — Geçen Yıl Hafızası beslemesi

### Niye Çok Güçlü
- MEB zorunlu evrakı → motivasyon hazır (öğretmen zaten girmek zorunda)
- "Veri girmeye direnme" sorunu otomatik aşılıyor
- Birden fazla problemi tek özellik çözüyor (Fadell "compound feature")
- 3 sınav sonra sınıf hafızası kuruluyor → Pro lock-in

---

## 5. Cache Stratejisi — Sıfır Maliyete Doğru

### Mantık (Community-sourced cache)
```
1. Hedef: kazanım × tip başına 10 varyasyon havuzu
   9.077 kazanım × 4 tip × 10 varyasyon = 363.080 slot

2. Öğretmen "Yaver Hazırla" tıklar:
   - Cache havuzu DOLU mu? → Random pick, SIFIR AI
   - Cache havuzu AZ mı? → AI üretir + cache'e koy

3. "Beğendim" → kalıcı cache. "Beğenmedim" → sil.
4. Rotasyon: görmediği varyasyonu öncelikle
```

### Kalite Filtreleme
| Aşama | Eşik | Etki |
|---|---|---|
| Soft | 1 beğeni | Cache'e girer, başkasına gösterilebilir |
| Hard | 3 farklı öğretmen beğenisi | "Doğrulanmış" rozeti, öncelikli sıra |

### Bootstrap Hesabı
- Toplam slot: 363K
- Üretim başına maliyet (Haiku+Sonnet karışım, batch %50): ~$0.025
- Tam dolma: ~$9.000 (300K TL)
- 12 ayda %50 hedef: 150K TL maliyet
- Hızlandırıcı: lansman öncesi pre-generation (en popüler 500 kazanım × 4 tip × 5 var = 10K slot, $250)

### Ay 12 Senaryosu
- 1000 Pro × 30 üretim/ay × %60 cache hit = 18.000 üretim/ay
- AI çağrısı: 12.000/ay × $0.05 = ~$600/ay (~20K TL/ay)
- Pro gelir: ~89.000 TL/ay
- **Net: ~69.000 TL/ay** ✅

### Telif/Privacy
- Beğeniilen içerik anonim olarak başka öğretmene
- Şartlar açıkça yazılır
- "Paylaşmak istemiyorum" toggle (Pro)

---

## 6. Paywall — 2 Aşamalı

### Aşama 1 (Lansman → Ay 12)
| Tier | Fiyat |
|---|---|
| Free | 0 TL |
| Aylık | 199 TL/ay |
| Yıllık | 899 TL/yıl |

**Mantık:** Cache bootstrap'te kullanıcı kararsız. Aylık tier "deneme yapma" sağlar. 199 × 12 = 2.388 TL → yıllık 899 TL'ye doğal psikolojik iter.

### Aşama 2 (Ay 12 sonrası, cache hit %60+)
| Tier | Fiyat |
|---|---|
| Free | 0 TL |
| Yıllık | 899 TL/yıl |
| **Lifetime** | **4.999 TL** (erken kuş 2.999 TL ilk 500 öğretmen) |

**Mantık:** Cache olgunlaştı, AI maliyeti sıfıra yakın. Lifetime mantıklı. Aylık kaldırılır (retention zayıf, karmaşa).

### Geçiş Karar Eşiği
| Cache hit oranı (Ay 12) | Karar |
|---|---|
| %60+ | Lifetime açılır |
| %30-60 | 6 ay erteleme |
| <%30 | Lifetime hiç açılmaz |

### Free Tier Limit (Cömert ama Pro hookları net)
- 3 evrak/ay (4. → Pro)
- 5 Yaver Hazırla/ay (6. → Pro)
- Öğretmen Dosyası 3 ay görünür (sonrası → Pro)
- Akıllı Takvim temel; smart hatırlatma → Pro

### Pro'nun Tek Cümlelik Savunması
> **"Öğretmen Dosyanı kaybetmemen ve hiç hazırlıksız yakalanmaman için Pro."**

---

## 7. 9 Çekirdek Evrak Şablonu

| # | Evrak | Sıklık | Kimler için |
|---|---|---|---|
| 1 | Zümre Tutanağı | 4-5/yıl | Tüm öğretmen |
| 2 | ŞÖK Tutanağı | 4/yıl | Tüm öğretmen |
| 3 | Veli Toplantı Tutanağı | 2-3/yıl | Tüm öğretmen |
| 4 | Kulüp Evrak Paketi (yıllık plan + tutanaklar + sonuç) | 1 paket/yıl | Kulüp danışmanı |
| 5 | Gezi İzin Formu + Sonuç Raporu | Olduğunda | Düzenleyen |
| 6 | BEP / ZEP | Olduğunda | Kaynaştırma öğrencisi olan |
| 7 | Dilekçe Bankası (izin/mazeret/atama/nakil) | Olduğunda | Tüm öğretmen |
| 8 | Tören Evrakları (Cumhuriyet, Atatürk, 23 Nisan, 19 Mayıs) | 5-6/yıl | Görevlendirilen |
| 9 | **Sınav Analizi** ⭐ | Her sınav sonrası | Tüm öğretmen |

### Şablon Üretim Mekaniği
1. JSON statik yapı tanımı (alanlar, hangi alan AI/öğretmen)
2. Akıllı varsayılanlar (tarih, sıra no, katılımcılar, profil)
3. Öğretmen 5-6 alan doldurur
4. AI metin doldurur (gündem, karar metni — MEB resmi dili)
5. Çıktı PDF + Word + Öğretmen Dosyasına otomatik

### Şablon Kaynak Stratejisi
1. MEB resmi PDF'leri (eMüfredat, OGM)
2. Sendika sayfalarındaki örnekler (Eğitim-Bir-Sen, Türk Eğitim-Sen)
3. Defterdoldur, Ogretmenimecesi gibi siteler
4. Özel okul standartları (varsa)
5. 5-6 örnek karşılaştır → "ideal" yapı → Yaver standardı

---

## 8. Ekran Listesi (17 → 9)

### Onboarding (4)
1. Karşılama
2. Branş seçimi
3. Sınıf + okul tipi + ek dersler (mevcutta birleşik)
4. Ders Programı yükleme + Wow Moment

### Ana Tab (4)
5. **Ana Sayfa** — haftanın kazanımları + bugünün dersleri + akıllı takvim mini görünüm
6. **Evraklarım** — 9 şablon + arşiv
7. **Öğretmen Dosyası** — yılbaşı setup + yıl boyunca birikim
8. **Profil** — hesap + ayarlar + Yaver Asistanı tercihler

### Stack (1)
9. **Yaver Hazırla** — kazanım × tip × ayar → cache veya AI → çıktı

**Çıkarılanlar (17 - 8 = ekran azalması):** Sürpriz Hazırlık ekranı, Loading uzun versiyon, Yıllık Plan ayrı ekran (Ana Sayfa'ya kaynaştı), Hafta Detayı (Ana Sayfa'ya kaynaştı), Ders İçin tile grid (Yaver Hazırla'ya kaynaştı), Şablon Doldurma (Evraklarım'a kaynaştı), Yaver Asistanı Ayarları (Profil'e kaynaştı).

---

## 9. Distribution Stratejisi (İlk 6 ay)

1. **5-10 büyük branş Telegram grubu** — organik tanıtım turu
2. **2-3 influencer öğretmen** — revenue-share (5-10% komisyon) veya hediye Lifetime
3. **WhatsApp paylaş düğmesi** — çıktıdan veliye link → organik viralite

### Ay 6+ Sonra
4. Sendika partnership (Eğitim-Bir-Sen 380K üye — üye indirimi karşılığında WhatsApp duyuru)
5. Özel okul B2B Pro lisans (50-200 öğretmenli okul grupları)

---

## 10. Karşılaştırma Tablosu — V1.4 vs V2

| Boyut | V1.4 (eski) | V2 (yeni) |
|---|---|---|
| **Vaat** | "Zihinsel yükü alır" (soyut) | "Yaver hazırlar, sen öğretirsin" (somut) |
| **Pazarlama yıldızı** | AI ile içerik üretimi | Evrak Fabrikası + Sınav Analizi + Öğretmen Dosyası |
| **Asistan kanıtı** | Sürpriz hazırlık (iptal edildi → vaat boşa düştü) | Akşam recap + Pazar gecesi cache + Anlık Yardım Kutusu |
| **Ekran sayısı** | 17 | 9 |
| **Para modeli** | "V1.5'te" (ertelendi) | 2 aşamalı: aylık+yıllık → yıllık+lifetime |
| **Moat** | Yok | Öğretmen Dosyası + Sınav Analizi sınıf hafızası + Geçen Yıl Hafızası |
| **Cache stratejisi** | Bireysel exact match | Community-sourced (363K slot havuzu) |
| **Branş kişiselleştirme** | Detay UI (CEFR, 4-tema vs) | Sade — sadece branş slug → kazanım/plan/kulüp evrakları |
| **"AI" kelimesi** | UI'da görünür | UI'dan kaldırıldı, "Yaver hazırla" |
| **En güçlü hook** | Sürpriz beğeni → V1.5 paywall | Öğretmen Dosyası 3 ay sonra paywall |

---

## 11. Açık Sorular (Karara Bağlanacak)

1. **Cache hit oranı 12. ayda %60+ olur mu?** — Datayla doğrulanacak. Olmazsa Lifetime ertelenir.
2. **Anlık Yardım Kutusu kalite kontrol** — Genel pedagoji sorularına Claude cevabı liability riski. Yasal disclaimer + kullanım sınırı yeterli mi?
3. **Lifetime ilk 500 erken kuş kampanyası kanal** — Hangi kanaldan duyurulur? Influencer'lar mı? Sendika mı? E-mail mı?
4. **Sınav Analizi Excel/CSV format standardı** — e-Okul export'unun column yapısı + Yaver template
5. **e-Okul/MEBBİS senkron** — V2'de var mı V2.5'te mi? (API yok, web scrape liability'si)
6. **Şablon kalite filtresi** — 1 beğeni eşiği güvenli mi, yoksa hep 3 mü baz?
7. **Öğretmen Dosyası KVKK** — 5 yıllık öğrenci verisi tutmak yasal mı?

---

## 12. Sonraki Adımlar

1. ⏳ Kullanıcı bu dosyayı gözden geçirir, ek tavsiyeler ekler
2. `SPEC_FULL.md` V2 yazımı (mevcut V1.4'ün üstüne)
3. `STATUS.md` ve `DECISIONS.md` pivot kararıyla güncellenir
4. Yeni 9 ekran tasarımı (eski 17'den geçiş haritası)
5. Cache backend mimarisi (Supabase tabloları + RLS + slot sayım)
6. Pre-generation kampanyası (lansman öncesi 10K slot)
7. 9 evrak şablonu kaynak toplama + standartlaştırma

---

*Bu dosya, Oturum 68 boyunca alınan pivot kararlarının özetidir. `SPEC_FULL.md` V2 yazıldıktan sonra arşivlenebilir veya silinebilir.*
