# Öğretmen Yaver — V1.4 Spec (Final)

**Doküman versiyonu:** V1.4
**V1.3 → V1.4 değişiklikleri:**
- Bölüm G3 genişletildi: Referans görsel kaynakları listesi (Mobbin, Dribbble, Figma Community, Page Flows, Refero, The U, UI Garage)
- Bölüm K5 eklendi: Git ve Branch Disiplini (feature branch workflow, release tag'ler)
- Bölüm K6 eklendi: Version Pinning (kararlı son sürüm politikası)
- Bölüm K7 eklendi: Destructive İşlem Koruması (DB snapshot, auto-approve yasağı)
- K4 Açık Konular'a AI UI generator kararı eklendi

**V1.2 → V1.3 değişiklikleri:**
- UI Profesyonelliği bölümü eklendi (Bölüm G genişletildi, 7 seviye)
- Claude Code oturum hafıza sistemi eklendi (Bölüm P)
- Ajan sistemi kararı belgelendi (V1'de kurulacak)
- Referans bankası stratejisi eklendi

---

## BÖLÜM A — STRATEJİK ÇERÇEVE

### A1. Vizyon Tek Cümle

**Öğretmenin zihinsel yükünü almak.** Evrak aramadan, yapılacaklar listesi tutmadan, "ne hazırlayacağım?" diye düşünmeden öğretmenlik yapabilsin.

### A2. Ürün Kişiliği: Asistan, Araç Değil

**Araç:** Kullanıcı gelir, bir şey ister, araç yapar. Pasif.
**Asistan:** Kullanıcı unuttuğu şeyi hatırlatır, gelmeden hazırlar, tarzını öğrenir. Proaktif.

Şu ana kadarki AI eğitim ürünleri "araç" kategorisinde. Yaver'in farkı "asistan" olması.

**Üç Güven Katmanı (Monetization Temeli):**

1. **Katman 1 — Hatırlatma:** "Yaver yaklaşan şeyleri hatırlatıyor" (unutma yükü kalkar)
2. **Katman 2 — Hazırlama:** "Hatırlatmakla kalmıyor, hazır ediyor" (iş yükü kalkar)
3. **Katman 3 — Kalite:** "Hazırladığı gerçekten işime yarıyor" (vakit kazanır)

Üçü birden gerçekleşince öğretmen "buna para veririm" der. V1 bu üçü kurar, V1.5 paywall'ı ekler.

### A3. V1 Felsefesi: Acquisition + Alışkanlık

V1'in tek hedefi: aktif kullanıcı tabanı + günlük açma alışkanlığı. Monetization V1.5'te. Fiyatlandırma reel data ile netleştirilecek.

### A4. Konumlandırma: Hibrit

- **Yıllık plan = "Benim için yap"** (30 saniye, AI tüm yılı kurar)
- **Haftalık/günlük = "Yol göster"** (öğretmen sürücü, Yaver asistan)

### A5. Belkemik: Yıllık Plan

Her şey plandan dallanır (haftalar, kazanımlar, üretimler). **Plan = canlı omurga, dosya değil.** V1.5 lock-in'in temeli.

### A6. Plan-Based Intelligence (Moat)

Rakipler prompt-bazlı, Yaver context-bazlı. Sistem: hafta, kazanım, sınıf, geçmiş üretimler, tarz, tercihler. Kullanıcı: tek tıkla aksiyon.

---

## BÖLÜM B — VERİ MİMARİSİ

### B1. Veri Omurgası

```
Yıllık Plan
   └── Haftalar (36 hafta, MEB takvimine göre)
        └── Sınıflar (öğretmenin seçtikleri)
             └── Kazanımlar (MEB müfredatı)
                  ├── Sorular
                  ├── Etkinlikler
                  ├── Ders Planları
                  └── Çalışma Yaprakları
```

Resmi evraklar ayrı aks. Yapılacaklar/notlar kullanıcıya bağlı ayrı aks (V1.5).

### B2. Müfredat Datası

**V1'de sadece müfredat, ders kitapları V1.5'te (RAG ile, premium feature).**

Hazırlık (1 hafta sonu):
1. MEB resmi müfredat PDF'lerini eMüfredat'tan topla (15 branş)
2. Claude'a tek tek verip JSON'a dönüştürt — **OCR/regex ile deneme, manuel kontrol şart**
3. Master JSON'da birleştir, Supabase'e seed yükle

**JSON şema:**
```json
{
  "brans": "Matematik",
  "sinif": 9,
  "uniteler": [{
    "ad": "Üslü İfadeler",
    "kazanimlar": [{
      "kod": "MAT.9.1.1",
      "ad": "Üslü ifade kavramını açıklar.",
      "aciklama": "..."
    }]
  }]
}
```

### B3. Supabase Şeması

**Statik (seed):**
- `branslar` (id, ad, ikon, renk)
- `kazanimlar` (kod, brans_id, sinif, unite, ad, aciklama)
- `egitim_takvimi` (yil, hafta_no, baslangic, bitis, tatil_mi, tatil_adi)
- `evrak_sablonlari` (id, ad, kategori, yapi, alanlar_jsonb)

**Dinamik (kullanıcı):**
- `kullanicilar` (id, email, brans_id, siniflar_jsonb, aktif_yil, surpriz_aktif bool)
- `yillik_planlar` (id, kullanici_id, yil, brans_id, siniflar, durum)
- `plan_haftalari` (id, plan_id, hafta_no, kazanim_kodlari[])
- `uretimler` (id, kullanici_id, kazanim_kodu, tip, parametreler_jsonb, icerik, hafta_id, olusturulma, origin enum['manuel','surpriz','otomatik'])
- `evrak_uretimleri` (id, kullanici_id, sablon_id, doldurulan_alanlar_jsonb, icerik, tarih)
- `bildirimler` (id, kullanici_id, tip, mesaj, ilgili_entity, okundu, tarih)
- `feedback` (id, kullanici_id, uretim_id, begeni enum['cok_guzel','iyi','begenmedim'], sessiz_veri_jsonb)

**Cache (maliyet kritik):**
- `uretim_cache` (cache_key, kazanim_kodu, tip, parametreler_hash, icerik, kullanim_sayisi, olusturulma, son_kullanim)

### B4. Maliyet Optimizasyonu

Sürpriz hazırlık + otomatik hazırlama = ciddi cache/AI yükü. **Cache stratejisi V1'de zorunlu.**

**Katman 1 — Exact Match Cache (V1 zorunlu):**
- Cache key: `kazanim_kodu + tip + parametre_hash`
- İlk üretim: AI çağrısı + cache'e yaz
- Sonraki: cache'ten oku
- Hedef hit oranı: %70+

**Katman 2 — Template-Based (AI yok):**
- Yıllık plan: %100 deterministik
- Resmi evraklar: %100 template
- Ders planı: %80 template + %20 AI
- Çalışma yaprağı yapısı: template, sorular AI

**Katman 3 — Cache Variation:**
- Cache'ten çekilen içeriğe minor varyasyon (sıralama, 1-2 soru değişimi)
- Tam üretimin %10 maliyeti
- "İki öğretmen aynı içerik aldı" problemini çözer

**Katman 4 — Model Seçimi:**
- Sorular: Claude Haiku (10x ucuz)
- Etkinlik, ders planı, çalışma yaprağı: Claude Sonnet

**Katman 5 — Batch Pre-Generation:**
- En popüler 50 kazanım için gece batch API (%50 indirim)
- Sabaha cache hazır

**V1 zorunlu:** Katman 1+2. Katman 3 sürpriz için erken ekle. Katman 4 default. Katman 5 V1.5.

### B5. Cache Akışı

```
1. "Üret" tetiklendi
2. parametre_hash hesapla
3. Cache sorgusu
4. Hit: kullanım_sayisi++, içerik döndür, AI yok
5. Miss: AI çağrısı, cache'e yaz, kullanıcıya ver
```

**Invalidation:**
- 90 gün zaman aşımı
- Müfredat güncellenirse ilgili cache temizlenir
- Kullanıcı "↻ yenile" derse cache atlanır (variation)

**Privacy:** Cache anonim, hangi kullanıcı ürettiği saklanmaz.

---

## BÖLÜM C — NAVİGASYON

**4 tab:**

| Tab | Amaç |
|---|---|
| **Planım** | Yıllık plan + timeline + "Bugün" |
| **Ders İçin** | AI üretimleri (sorular, etkinlik, ders planı, çalışma yaprağı) — üretim + arşiv |
| **Evraklarım** | Resmi evraklar (zümre, ŞÖK, vb.) — şablon doldurma + arşiv |
| **Profil** | Hesap, ayarlar, Yaver asistan tercihleri |

---

## BÖLÜM D — ONBOARDING

### D1. Kararlar

- 2 aktif adım + 2 pasif (loading + wow). ~30 saniye.
- Auth onboarding'de yok. İlk üretim auth'suz. İkinci üretimde soft modal.
- Şube sorulmaz. Okul türü sorulmaz (branş+sınıftan türetilir).
- **Sürpriz hazırlık default açık** (wow moment sonrası "Yaver sana ara sıra sürpriz hazırlıklar yapacak — istemezsen Profil'den kapatabilirsin" bilgisi).

### D2. Ekranlar

**1. Karşılama:**
- Başlık: "Yılını 30 saniyede kur."
- Alt: "Yıllık planını, evraklarını ve etkinliklerini senin yerine hazırlasın."
- CTA: "Başlayalım →"
- Güven: "Üye olmana gerek yok. Önce planını gör."
- Sağ üst: "Hesabım var" ikonu

**2. Branş (1/2):**
- Kart grid, ikonlu, pastel, düzenli
- Tek seçim, arama üstte
- 15 branş (Coğrafya eklenecek mi, liste finalize edilecek)

**3. Sınıf (2/2):**
- Akıllı filtreleme (branşa uygun seviyeler)
- Multi-select + "Hepsine giriyorum" kısayolu
- CTA: "Yılımı kur ✨"

**4. Loading:**
- 4 adım, ~4 saniye, kasıtlı dramatizasyon
- MEB takvimi → kazanımlar → haftalara dağıtım → tatiller
- Otomatik geçiş

**5. Wow Moment:**
- "Yılın kuruldu."
- Stat kartları: 36 hafta / X kazanım / Y sınıf
- İlk 3-4 hafta önizleme
- Secondary: "⬇ Yazdırmaya hazır indir"
- Primary: "Yaver'i kullanmaya başla →"
- **Alt bilgi:** "Yaver sana ara sıra sürpriz hazırlıklar yapacak. İstemezsen Profil > Asistan'dan kapatabilirsin."

---

## BÖLÜM E — ANA UYGULAMA EKRANLARI

### E1. Planım (Timeline Dashboard)

**Katman 1 — "Bugün" kartı:**
- Tarih başlığı
- "X dersin var"
- Her ders kartı: sınıf + ders sırası, kazanım, durum (✓/⚠)
- Program yoksa: günün kazanımlarını göster
- Kart tap → Hafta Detayı (kazanıma scroll)

**Katman 2 — "Yılın" timeline:**
- Sadece bu hafta + gelecek haftalar
- Şu anki hafta vurgulu, "● ŞU AN"
- Haftanın geçen günleri soluk/tik
- Her hafta: tarih, kazanım sayısı, hazırlık oranı, tatil etiketi
- "Haftayı aç →" sadece bu hafta + bir sonraki

**KISAYOL BUTONU YOK.** Kart yanında kısa yol üretim butonu eklenmedi. Akış: karta tap → bottom sheet ile detay → Detaylı Mod üretim ekranı.

### E2. Hafta Detayı

Sadece kazanım kartları, sınıfa göre gruplu.

**İki state:**
- Hazırlanmadı (turuncu): "⚠ Hazırlanmadı" + [Benim yerime hazırla]
- Hazır (yeşil): "✓ Hazır" + özet ("8 soru, 1 etkinlik"), buton yok

**Surpriz/otomatik üretimler burada da görünür:**
Hazır kazanım kartında küçük bir etiket: "✨ Yaver sürpriz" → bu, kullanıcının Yaver'in inisiyatifiyle hazırlanmış içeriği görmesini sağlar.

V1 plan değişikliği: read-only. Düzenleme V2.

### E3. Üretim Ekranı (Detaylı Mod — V1 default)

Buraya nasıl gelinir:
- Hafta Detayı > "Benim yerime hazırla"
- Ders İçin > FAB [+]
- Bildirim > "Hazırlayalım mı?"

**3 bölüm:**

1. **Context kartı:** Sınıf + kazanım kodu + adı (otomatik dolu)
2. **Tip seçici:** 4 kart (Ders planı, Sorular, Etkinlik, Çalışma yaprağı)
3. **Tip-spesifik ayarlar:** Dinamik (kaç soru, zorluk, süre vb.)

**Opsiyonel not alanı:** Ekstra context.

**Maliyet bilgisi:** "Bu üretim ücretsiz" veya "1 üretim hakkı kullanır. Bu ay 4 hakkın kaldı." (Jeton kelimesi V1'de yok, "üretim hakkı")

**CTA:** "Benim yerime hazırla →"

**Auth tetik:** İlk üretim free. İkincide soft modal.

**Hızlı mod V1.5'e ertelendi.** V1 datasıyla hızlı moda gerçekten ihtiyaç var mı test edilecek.

### E4. Çıktı Önizleme

3 katman:
1. Header: Geri + "Hazır" + özet
2. Önizleme: gerçek format, scroll, tap ile tam ekran
3. Aksiyonlar:
   - ↻ Yeniden (1 hak, uyarı)
   - ✏ Düzenle (Word/dosya indirir, in-app editor yok)
   - ⬇ Yazdırmaya hazır indir (PDF/Word)

**Otomatik kayıt toast:** "✓ Plana kaydedildi — Hafta 28 → MAT.9.1.3" (2-3 sn sliding bottom)

**"Beğendin mi?" feedback (kritik):**
Her çıktı önizleme ekranının altında küçük bir satır:
```
Bu hazırlık nasıl oldu?
[😊 Çok güzel]  [👍 İyiydi]  [👎 Beğenmedim]
```

Bu feedback V1.5 tarz öğrenmenin temel datası. Sessiz veri de toplanır (önizledi mi, indirdi mi, ne kadar süre baktı, yeniden mi üretti).

**Sürpriz/otomatik hazırlıklarda da aynı feedback.**

**Hata durumu:** "Bir şeyler yanlış gitti. Hakkın iade edildi. Tekrar dene?"

### E5. Ders İçin

- Üstte arama + filtre çipleri (Tümü/Sorular/Etkinlik/Ders planı/Çalışma yaprağı)
- Zaman gruplu liste (Bu hafta / Geçen hafta / Nisan / Mart)
- Her kart: tip ikonu + başlık + sınıf + parametre özeti + tarih + [⬇] [⋯]
- **Origin etiketleri:** 🖐 Manuel / ✨ Sürpriz / 🌙 Otomatik — kullanıcı hangi üretimin nereden geldiğini görür
- FAB [+] sağ altta: "Ne hazırlayalım?" → tip + kazanım → Üretim Ekranı
- Boş state: "Henüz hiçbir şey hazırlamadın. Plana git, 'Benim yerime hazırla' de."

### E6. Evraklarım

Üst metin: "Birkaç bilgi al, gerisini Yaver halletsin."

**Bölüm 1 — Hazır Şablonlar:**
Zümre tutanağı, ŞÖK, Kulüp evrakları, Sınıf rehberliği, Veli toplantı tutanağı, Tören evrakları, Gezi izin formu, Dilekçeler (Anadolu liselerinde karşılaşılan tüm rutin).

**Bölüm 2 — Geçmiş Evraklarım:**
Tarih sıralı arşiv, tekrar indirilebilir, kopyalanabilir.

### E7. Şablon Doldurma

- Üst: "Birkaç bilgi al, gerisini Yaver halletsin."
- Form alanları (örnek Zümre): tarih, no, katılımcılar, gündem
- Akıllı varsayılanlar (tarih bugün, no otomatik, katılımcılar son toplantıdan)
- Netlik: "Bu evrak ücretsiz oluşur."
- CTA: "Evrakı oluştur →" → Çıktı Önizleme

### E8. Profil

**4 bölüm:**

1. **Hesap kartı:** İsim, branş, sınıflar + [Düzenle →]
2. **Kullanım kartı:** "Bu ay X üretim yaptın" (basit istatistik)
3. **Ayarlar:**
   - 📅 Ders programım
   - 🔔 Bildirimler (her tip ayrı açılır)
   - ✨ **Yaver Asistanı** (sürpriz hazırlık ayarları — aşağıda detay)
   - 🎓 Branş ve sınıflar
   - 🏫 Şubelerim
4. **Diğer:** Öner, Yardım, Gizlilik, Çıkış

---

## BÖLÜM F — ASİSTAN MEKANİZMALARI (YENİ, V1.2'NİN KALBİ)

### F1. Mekanizma 1 — Proaktif Hatırlatma

**Felsefe:** Bildirim = "sen unut, ben hatırlıyorum." Her bildirim aksiyona davet, bilgi vermek için değil.

**Bildirim tipleri — "Unutulma + Öneri":**

**Tip 1 — Yarın için hazırlık çağrısı:**
> "Yarın 9-A'ya üslü ifadeler anlatacaksın. Soru ve etkinlik hazır değil. 2 dakika ayır mı?"

Tetik: Yarına ait dersin hazırlığı eksik
Tıklama → Üretim Ekranı (kazanım dolu)
Saat: Akşam 19:00-21:00 (kullanıcı tercihi)

**Tip 2 — Yaklaşan resmi evrak:**
> "Önümüzdeki Çarşamba zümre toplantın var. Tutanak şablonunu hazırlayalım mı?"

Tetik: Profil'de tanımlı resmi evrak takvimi
Tıklama → Şablon Doldurma (tarih önceden dolu)
Saat: 1 hafta önce + 1 gün önce

**Tip 3 — Yaklaşan resmi tarihler (dönem sonu, ay sonu, müfettiş riski):**
> "Mayıs sonuna 2 hafta kaldı. ŞÖK toplantı tutanağın var mı? Kontrol edeyim."

Tetik: Resmi takvim
Tıklama → Eksik evrak listesi
Saat: Ayda 1, dönem sonunda 1

**Tip 4 — Tatil/boş zaman önerisi:**
> "23 Nisan tatili. Pazartesi 9-A için fonksiyon konusu var. Tatildeyken hazırlayayım mı?"

Tetik: Resmi tatil + sonrasında eksik hazırlık
Tıklama → Sürpriz hazırlık akışı (AI üretir, beğenmene sunar)
Sıklık: Her tatil 1

**Limit:** Günlük max 2 bildirim (hard cap). Kullanıcı override edemez — biz kendi ürünümüzü koruyoruz.

**Kanal:** Sadece push notification (V1). In-app feed var.

**Dil:**
- Sıcak ama profesyonel
- Soruyla biter ("hazırlayalım mı?", "kontrol edeyim mi?")
- Spesifik (sınıf adı, kazanım adı, tarih)

**Profil > Bildirimler:**
- Her tip ayrı açma/kapama
- Saat tercihi
- Sessiz mod (tatilde, hafta sonu)

### F2. Mekanizma 2 — Sürpriz Hazırlık (Default Açık)

**Felsefe:** Asistan = ara sıra kendiliğinden bir şey yapar. Sürekli değil, özel anlarda.

**Nasıl çalışır:**

**Default:** Açık. Onboarding sonrası wow moment'ta bilgi verildi ("Yaver sana ara sıra sürpriz hazırlıklar yapacak").

**Sıklık:** Haftada 3-4 sürpriz (test edilecek hipotez — sürprizlik kaybolursa sıklığı indirilecek).

**Triggerlar:**
- Yarınki en kritik hazırlık eksiği
- Yeni kazanım türüne geçiş (ilk kez görülen konu)
- Pazartesi sabahı ("haftaya iyi başla")
- Tatil sonrası dönüş günü
- Random — biraz sürpriz olsun diye haftanın rastgele bir gecesi

**Ne üretir:**
- **4 tip hepsi** (soru + etkinlik + ders planı + çalışma yaprağı)
- Default parametrelerle (10 soru, orta, çoktan seçmeli; 20 dk bireysel etkinlik; vb.)
- Cache-first, sıfır ek maliyet

**Push mesajı:**
> "9-A için yarın üslü ifadeler var. Senin için hazırladım, bir bak."

Tıklama → **Sürpriz Hazırlık Ekranı** (yeni ekran, Ekran E9):

```
┌─────────────────────────────────┐
│  ✕  Sürpriz!                    │
│                                 │
│  9-A için üslü ifadeler         │
│  Yarın ders var, hazırladım.    │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ ❓ 10 soru                 │  │
│  │ Çoktan seçmeli, orta zor.  │  │
│  │ "1. 2³'ün değeri kaçtır?  │  │
│  │  A) 6  B) 8  C) 9  D) 12" │  │
│  │                           │  │
│  │ [Önizle] [Beğendim] [↻]   │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 🎯 Etkinlik (20 dk)        │  │
│  │ "Üslü Avı" — bireysel     │  │
│  │ [Önizle] [Beğendim] [↻]   │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 📋 Ders planı (40 dk)     │  │
│  │ [Önizle] [Beğendim] [↻]   │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 📝 Çalışma yaprağı         │  │
│  │ [Önizle] [Beğendim] [↻]   │  │
│  └───────────────────────────┘  │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  Nasıl oldu?                    │
│  [😊 Çok güzel][👍 İyi][👎]     │
│                                 │
│  ┌─────────────────────────┐    │
│  │ Hepsini beğendim ✓✓✓✓   │    │
│  └─────────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

**4 kart, her birinde:**
- Tip + parametre özeti
- Kısa önizleme (1-2 satır)
- 3 buton: Önizle / Beğendim / ↻

**En altta "Nasıl oldu?" feedback** — kritik V1.5 datası.

**Toplu aksiyon:** "Hepsini beğendim" → 4'ü de plana kaydedilir.

**Feedback işleme:**
- "Çok güzel" → bu üretimin parametreleri kullanıcının tarzına uygun kabul edilir (V1.5 için)
- "İyi" → nötr
- "Beğenmedim" → bu parametreler kullanıcının tarzı değil
- Sessiz veri: önizledi mi? indirdi mi? ne kadar süre baktı? yeniden mi üretti? — hepsi feedback tablosuna

**Sürpriz beğenildi ise (Çok güzel), uygulama içinde soru:**
> "Bunu düzenli yapayım mı? Her hafta yarınki dersler için sürpriz hazırlarım.
> [Evet, hep hazırla] [Hayır, ara sıra olsun]"

Evet derse **Mekanizma 2 Plus** devreye girer: gece her gün yarın için üretim yapılır (haftada 5 ders limiti free tier'da).

**Free tier limit:**
- Sürpriz hazırlık: haftada 3-4 (default)
- Düzenli otomatik hazırlama (opt-in): haftada 5 ders
- Daha fazlası V1.5 premium

**Kapatma:** Profil > Yaver Asistanı > Sürpriz hazırlık [açık/kapalı]

### F3. Combo Akış (Mekanizma 1 + 2)

**En güçlü ürün anı.** Hatırlatma + hazırlama birlikte.

**Senaryo A — Önce hatırlat, sonra hazırla:**

Pazartesi 19:00:
> "Çarşamba zümre toplantın var. Tutanak şablonunu önceden hazırlayayım mı? [Hazırla] [Sonra]"

Salı 06:30 (hazırla seçildiyse):
> "Çarşambaki zümre tutanağını hazırladım. Sadece katılımcı isimlerini onayla."

**Senaryo B — Sessiz combo (en güçlü):**

Hiç hatırlatma yok. Salı 06:30:
> "Çarşambaki zümre toplantın için tutanağı hazırladım. Bilgileri sen ekle, hazır."

Öğretmen "unutmuştum, Yaver hatırladı **ve** hazırladı" der. **Retention'ın altın madeni.**

**Ne zaman Senaryo A, ne zaman Senaryo B:**
- Senaryo B sadece **cache-friendly ve düşük riskli** durumlarda (şablon doldurma, standart kazanım üretimi)
- Senaryo A yüksek AI maliyetli veya öğretmen tarafından özelleştirilmesi olası durumlar

### F4. Yaver Asistanı Ayarları (Profil > Yaver Asistanı)

Kullanıcının kontrol merkezi:

```
┌─────────────────────────────────┐
│  ←  Yaver Asistanı              │
│                                 │
│  Yaver sana nasıl yardım etsin? │
│                                 │
│  ─── HATIRLATMA ───             │
│                                 │
│  Yarın için hazırlık     [✓]    │
│  Yaklaşan evraklar       [✓]    │
│  Dönem/ay sonu hatırlat. [✓]    │
│  Tatil önerileri         [✓]    │
│                                 │
│  ─── SÜRPRİZ HAZIRLIK ───       │
│                                 │
│  Ara sıra sürpriz        [✓]    │
│  (Haftada 3-4)                  │
│                                 │
│  Her gün otomatik        [ ]    │
│  (Premium — V1.5'te)            │
│                                 │
│  ─── ZAMAN TERCİHLERİ ───       │
│                                 │
│  Sabah bildirimi: 07:00         │
│  Akşam bildirimi: 19:00         │
│  Sessiz mod: Cumartesi-Pazar    │
│                                 │
└─────────────────────────────────┘
```

---

## BÖLÜM G — UI TASARIM PRENSİPLERİ (7 Seviye)

UI kalitesi spec'in en kritik diferansiyatörü. AI çıktısı gibi görünürse ürün ölür, ne kadar iyi UX olursa olsun. Bu bölüm profesyonel UI kurmanın 7 seviyesini kapsar — temelden ileri seviyeye.

### G1. Seviye 1 — AI Çıktısı Yasakları

❌ Inter, Roboto, Arial, system fonts
❌ Mor-mavi gradient + beyaz arka plan
❌ Düz beyaz/gri zemin (steril)
❌ Her yerde aynı padding/gap (monoton)
❌ Lucide ikonları default kalın stroke (stroke-width: 2 — "AI default")
❌ Yuvarlak köşeler her yerde aynı boyut
❌ Her başlık aynı fontta aynı weight'te (hiyerarşisizlik)

### G2. Seviye 2 — Profesyonel UI'nın 6 Unsuru

✅ **Karakterli tipografi:** Bricolage Grotesque (display) + DM Sans veya Geist (body). Display + body ayrımı net — başlıklar karakterli, metinler okunabilir.

✅ **Sıcak/dokulu zemin:** Cream (#FAF7F2), warm beige, subtle SVG noise overlay (mix-blend-multiply, opacity 0.35). Saf beyaz yasak.

✅ **Sınırlı palet, cesur accent:** 70/20/10 oranı — 70% nötr (cream + ink), 20% accent (sienna), 10% secondary (moss + amber). Her renk bir rol oynar.

✅ **Asimetri ve hiyerarşi:** Bir şey büyük, bir şey küçük. Tek "hero" element ekranı taşır. Grid'leri böl.

✅ **Mikro-imza:** Her başlıkta tek bir kelime italik (Yaver'in tipografik karakteri). Bu tutarlı tekrar **marka** yaratır.

✅ **Boş alanın değeri:** Her boşluğu doldurma. Nefes ver. Generous whitespace = premium algı.

### G3. Seviye 3 — Referans Bankası (/refs klasörü)

**Kritik:** Claude Code'a sadece yazılı yönergeler yetmez. Profesyonel tasarımcıların sırrı **bolca referansa bakmaları.** Sen de öyle yap.

**Proje başlamadan önce oluşturulacak `/refs` klasörü:**

#### Kaynak Listesi

**Ücretsiz veya kısmi ücretsiz:**
- **Mobbin** (mobbin.com) — mobil UI odaklı, ilk 3 sayfa ücretsiz, abonelik değerli
- **Dribbble** (dribbble.com) — tasarımcı portfolyoları, ücretsiz geniş koleksiyon
- **Figma Community** (figma.com/community) — tamamen ücretsiz, karşılaştırılabilir projeler
- **Page Flows** (pageflows.com) — ücretsiz kısım var, kullanıcı akışları
- **Refero** (refero.design) — ücretsiz kısım
- **The U** (theuxdb.com) — mobil UI koleksiyonu
- **UI Garage** (uigarage.net) — kategorize edilmiş, ücretsiz

**Çalışılacak 10 uygulama (ekran görüntüsü al):**

1. **Things 3 (macOS/iOS)** — sıcak minimalizm, bej tonlar, tipografi hiyerarşisi
2. **Linear** — keskin tipografi, veri yoğun
3. **Arc Browser** — unexpected layouts, playful ama profesyonel
4. **Raycast** — command palette estetiği, fonksiyonel güzellik
5. **Fey** — finansal veri ama sıcak, cream palette
6. **Structured (iOS)** — günlük planlama, öğretmene yakın use case
7. **Cron / Notion Calendar** — takvim UX'i mükemmel
8. **Superhuman** — premium his, tipografi odaklı
9. **Cosmos** — kart tabanlı organizasyon
10. **Duolingo** — playful onboarding (fazlasını kopyalama)

**Kullanım:** Her ekran yaparken Claude Code'a **ilgili referansı göster:** "Timeline Dashboard için Things 3 ve Structured'ın ruhunu yakalamaya çalış." Sadece yazı değil, **görsel referans.**

**/refs klasör yapısı:**
```
refs/
├── onboarding/        ← karşılama, welcome screen örnekleri
├── dashboard/         ← timeline, today view örnekleri
├── detail-views/      ← hafta detayı için referanslar
├── forms/             ← üretim ekranı için form örnekleri
├── empty-states/      ← özenli empty state tasarımları
└── animations/        ← referans animasyon videoları (mp4/gif)
```

### G4. Seviye 4 — Design Tokens (baştan kurulu olmalı)

Amatör uygulama: her yerde farklı renk, farklı boşluk, farklı köşe.
Profesyonel uygulama: her şey 5-6 tokendan türetiliyor.

**İlk 30 dakikada kur (tailwind.config.js):**

```javascript
colors: {
  // Base
  paper: '#FAF7F2',        // cream background
  ink: '#1C1B17',          // primary text
  smoke: '#6B6760',        // secondary text
  mist: '#9B968D',         // tertiary text

  // Accents
  sienna: '#B5481E',       // primary accent (burnt sienna)
  moss: '#4A5D3A',         // success / hazır state
  amber: '#D97706',        // warning / hazırlanmadı state

  // Surfaces
  card: '#FFFFFF',
  divider: '#E8E2D5',
},
fontFamily: {
  display: ['Bricolage Grotesque', 'serif'],
  body: ['DM Sans', 'system-ui', 'sans-serif'],
},
borderRadius: {
  sm: '8px',   // küçük elementler
  md: '12px',  // kartlar
  lg: '20px',  // sheet/modal
  full: '9999px',
}
```

**Kural:** Her component bu tokenları kullanır. **Hard-coded değer YASAK.** Bu tek kural UI'yı %30 profesyonelleştirir.

### G5. Seviye 5 — Animasyon ve Mikro Etkileşimler

AI çıktısı UI'ların işareti: **hiç animasyon yok** ya da **jenerik fade-in.** Profesyonel UI'lar **kasıtlı** mikro-hareketler içerir.

**Kütüphane:** react-native-reanimated (Baştan kurulmalı, Layout Animations kullanılmalı).

**Yaver için 5 kritik animasyon momenti:**

1. **Wow moment:** Stat kartları staggered giriş (birer birer belirsin, 80ms aralıkla)
2. **Bugün kartı:** Sabah ilk açılışta hafif pulse (dikkat çeker)
3. **"Plana kaydedildi" toast:** Alttan sliding, 2.5s bekle, yumuşak çıkış
4. **Hafta Detayı durumu değişimi:** Turuncudan yeşile geçiş 600ms (dopamine hit)
5. **Sürpriz hazırlık ekranı açılışı:** Sayfa aşağıdan yukarı kayıyor, kartlar staggered

**Kurallar:**
- Her animasyon 200-400ms arası
- Easing: `ease-out` veya `cubic-bezier(0.2, 0.8, 0.2, 1)`
- Daha uzun = yavaş hisseder
- "Animation for animation's sake" yasak — her animasyonun amacı olmalı

### G6. Seviye 6 — Empty State'leri Hikâye Olarak Yaz

Amatör: "Veri yok."
Profesyonel: Her empty state ürünün **kişiliğini** gösterir.

**Yaver için örnekler:**

- **Ders İçin boş:** "Henüz hiçbir şey hazırlamadın. Plana git, bir kazanıma 'Benim yerime hazırla' de." + küçük illüstrasyon
- **Evraklarım boş:** "İlk resmi evrakın henüz yok. Zümre toplantısı yaklaşıyor mu?" → direkt zümre CTA
- **Timeline ileri haftalar:** "Henüz Mayıs buradasın. Hazır olmak için acele etme, Yaver hatırlatır."
- **Hafta Detayı tamamlanmış:** "Bu hafta tamam 🎉 Bir sonraki haftaya geç."

Bu cümleler ürünün **ruhu.** Zaman harca, jenerik yazma.

### G7. Seviye 7 — Detayları Kutsal Say

Profesyonel ile amatör arasındaki son %10 burada.

**İkon boyutları — hepsi aynı değil:**
- Check: 14px (hafif, olumlu)
- X (kapat): 18px (ağır, kararlı)
- Arrow (→): 12px (zarif)
- Icon in CTA: 16px

**Boşluk hiyerarşisi:**
- Primary CTA margin-top: 24px (nefes)
- Secondary CTA margin-top: 12px (yakın, grup)
- Section gap: 48px (açık ayrım)
- Component gap: 16px (yakın ilişki)

**Metin opacity katmanları:**
- Önemli: opacity 1.0 (ink)
- Destek: opacity 0.7 (smoke)
- Metadata: opacity 0.5 (mist)
- Disabled: opacity 0.3

**Kontrol listesi — her ekran bittikten sonra sor:**
- [ ] Saf beyaz var mı? → VAR: değiştir
- [ ] Tüm tipografi aynı weight mi? → EVET: hiyerarşi kur
- [ ] Animasyon var mı? → YOK: en az 1 ekle
- [ ] Her boyut aynı mı? → EVET: varyans yarat
- [ ] Empty state jenerik mi? → EVET: hikâye yaz
- [ ] Bu ekranı Linear'a koysam yakışır mı? → HAYIR: iter et

### G8. Mikro UX Dili

**Asla kullanılmayan kelimeler:**
- "AI" / "Yapay zeka" (öğretmeni soğutur)
- "Prompt"
- "Generate" / "Üret" (CTA olarak — "Hazırla" daha sıcak)
- "Jeton" (V1'de "üretim hakkı")

**Tercih edilen ifadeler:**

| Yerine | Bunu kullan |
|---|---|
| Hazırla | **Benim yerime hazırla** |
| İndir | **Yazdırmaya hazır indir** |
| Plan oluştur | **Yılını 30 saniyede kur** |
| Kaydet | (Otomatik, sadece toast) |
| Üye ol | **Hesap oluştur** |
| Hazırladım (sürpriz) | **Senin için hazırladım** |

### G9. Claude Code'a Verilecek UI Prompt

Bu promptu her yeni ekran başlangıcında Claude Code'a ver:

> "Design system: Bricolage Grotesque (display) + DM Sans (body). Colors: paper #FAF7F2, ink #1C1B17, sienna #B5481E. NEVER use Inter, Roboto, pure white, or purple gradients. Use design tokens from src/tokens — no hard-coded values. One italic word per heading (micro-signature). Asymmetric layouts. Subtle noise overlay on backgrounds. Reference /refs folder for visual language. Animate key moments with react-native-reanimated (200-400ms, ease-out). Write emotional empty states. Vary icon sizes, spacing, text opacity. Every screen should answer: 'Would this look at home in Linear or Things 3?'"

### G10. Freelance Tasarımcı Stratejisi (Opsiyonel ama Tavsiye Edilir)

En gerçekçi kalite yatırımı: **Hafta 2 sonunda bir freelance tasarımcıya iki günlük iş ver.**

- Onboarding + Wow Moment + Planım + Hafta Detayı ekranlarını Figma'da cilalasın
- Maliyet: Türkiye'den iyi tasarımcı 500-1500 TL günlük, toplam 1000-3000 TL
- Claude Code'a "bu Figma referansına göre yeniden yap" de
- Yatırımın karşılığı **10x** — çünkü tasarımcılar gözlerinin gördüğünü specle yazamıyorsun

Bütçe yoksa: her ekran için **5-10 Dribbble post'una iter**. "Bu post'taki card stilini uygula" de.

---

## BÖLÜM H — AUTH STRATEJİSİ

**Felsefe:** Value first, gate later.

**Auth gerekmeyen:**
- Tüm onboarding
- Wow moment
- Yıllık plan PDF
- İlk AI üretimi
- Resmi evrak şablon doldurma

**Auth tetiklenen:**
- İkinci AI üretimi
- Profil ekranına giriş
- Sürpriz hazırlık bildirimi alma (push için email/user ID gerekli)

**Tip:** Soft modal — Google / E-posta. Kapatılabilir.

**Mesaj:** "Üretimini kaybetmemen için seni tanımam lazım."

---

## BÖLÜM I — V1 GELİR MODELİ (İskelet)

Fiyatlandırma sonra netleştirilecek. Şimdilik:

### Free Tier
- Yıllık plan (sınırsız)
- Tüm resmi evraklar (sınırsız)
- Yıllık plan indirme (sınırsız)
- Ayda 5 AI üretimi (manuel)
- Haftada 3-4 sürpriz hazırlık
- Plan + Bugün + Hafta Detayı

### V1.5'te eklenecek:
- Tier yapısı + fiyatlandırma
- Geçmiş yıllar arşivi (lock-in)
- Otomatik plan yenileme (her sene)
- Sınıf hafızası (tarz öğrenme — V1'de toplanan feedback datasıyla)
- Sınav üretimi + analiz
- Veli iletişim modülü
- Ders kitabı RAG
- Düzenli otomatik hazırlama (her gün)
- Hızlı mod (V1 datasıyla gerçekten lâzım mı test edilecek)

**V1.5 monetization timing stratejisi:** "Vay" anının hemen sonrası paywall. Sürpriz beğenildikten sonra: "Bunu düzenli yapmamı ister misin? Premium ile sınırsız."

---

## BÖLÜM J — KRİTİK UX İLKELERİ

1. Context'in olduğu yerde aksiyon var
2. Plan = canlı omurga
3. Eksik göze çarpar, hazır geri çekilir
4. Yaver yazar, öğretmen onaylar
5. Aha anına kadar sıfır engel
6. Akıllı varsayılanlar her yerde
7. Mikro UX dili tutarlı
8. Kısayol yok (V1)
9. **Asistan, araç değil — proaktif, hafızalı**
10. **Sürpriz sıklığı test edilecek hipotez, kilitli karar değil**

---

## BÖLÜM K — TEKNİK

### K1. Stack
- Frontend: Expo (React Native) + TypeScript
- Styling: StyleSheet (NativeWind değil, custom tokenlar ile) + react-native-reanimated
- Backend: Supabase (Postgres + Auth + Storage + Edge Functions)
- AI: Claude API (Haiku ucuz, Sonnet karmaşık)
- Deploy: EAS Build (Android/iOS)
- Push: Expo Push Notifications + Supabase Edge Functions

### K2. Sıfırdan Başla

Eski Yaver'i terk et. Yeni klasör (`yaver-v1`).

**Taşı:** müfredat datası, MEB takvim mantığı, Supabase credentials (yeni şema), agent sistemi, branş listesi.

**Taşıma:** React component'ları, eski state management, eski mockup kararları, eski isimlendirmeler.

### K3. Implementation Sırası

**Hafta 1: Veri + Onboarding**
1. Supabase şeması kur
2. Müfredat seed yükle
3. Onboarding ekranları (1-5)
4. Yıllık plan üretim (deterministik)

**Hafta 2: Ana akış**
5. Planım (Timeline)
6. Hafta Detayı
7. Üretim Ekranı (Detaylı Mod)
8. Çıktı Önizleme + feedback toplama
9. Cache Katman 1

**Hafta 3: Ders İçin + Evraklarım**
10. Ders İçin (liste + arama + FAB)
11. Evraklarım (şablonlar + arşiv)
12. Şablon Doldurma

**Hafta 4: Asistan katmanı (V1.2'nin kalbi)**
13. Push notification altyapısı
14. Proaktif hatırlatma cron jobs
15. Sürpriz hazırlık sistemi (trigger + üretim + ekran)
16. Feedback + analytics pipeline
17. Profil > Yaver Asistanı

**Hafta 5: Auth + Polish**
18. Auth flow (soft modal)
19. UI iyileştirme + animasyonlar (Reanimated)
20. EAS Build (Android APK/AAB ve iOS) hazırlıkları

### K4. Açık Konular

1. Branş listesi finalizasyonu
2. Karşılama ekranı görseli (maskot/soyut/tipografi)
3. Ücretsiz tier limit (5 manuel + sürpriz — test edilecek)
4. Ders programı UX'i (demo içinde)
5. Bildirim default saatleri
6. Sürpriz sıklığı (3-4 hipotez, ölçülecek)
7. AI UI generator kullanımı (Stitch/v0.dev/Lovable) — Claude Code aşamasında karar verilecek

### K5. Git ve Branch Disiplini

**Kural 1 — Her feature yeni branch:**
- Branch adlandırma: `feature/[ekran-veya-sistem]-[kısa-açıklama]`
- Örnekler: `feature/onboarding-welcome`, `feature/cache-layer-1`, `feature/surpriz-hazirlik`
- Main branch **protected** — direkt push yok

**Kural 2 — Merge öncesi kontrol:**
- UX Critic ajanı checklist'ten geçirmeli
- Kod çalışır durumda olmalı (lokal test)
- Yeni dosyalar spec'teki klasör yapısına uygun mu
- DECISIONS.md'ye etki eden bir karar varsa önce kayıt

**Kural 3 — Haftalık release tag:**
- Her hafta sonu çalışan versiyon için git tag (`v0.1.0-week1`, `v0.2.0-week2` vb.)
- Bir hata olursa son stabil tag'e geri dönüş kolay

**Kural 4 — Commit mesajları net:**
- Konu + kısa açıklama
- Örnek: `feat(onboarding): Karşılama ekranı, Bricolage Grotesque + cream`
- AI generated commit mesajlarından kaçın — insan diliyle yaz

### K6. Version Pinning (Kararlı Son Sürüm Politikası)

**Problem:** "Son sürüm" paket yüklemek her zaman "en iyi"yi getirmez. Yeni çıkmış sürümler test edilmemiş hataları getirebilir. Bir paket düzgün çalışırken ertesi gün çalışmayabilir.

**Çözüm — 3 kural:**

**1. Package.json'da exact version:**
```json
"dependencies": {
  "react": "18.3.1",           // ✓ exact
  "vite": "^5.4.0",            // ✗ caret kullanma
  "@supabase/supabase-js": "2.45.0"  // ✓ exact
}
```

**2. Yeni paket eklerken Claude Code'a talimat:**
> "Bu paketi ekle. Kararlı son sürümü (latest stable) kullan, bleeding edge değil. Package.json'a exact version olarak pin'le (`^` veya `~` kullanma)."

**3. Package-lock.json git'e commit edilmeli:**
- Takım tüm aynı versiyonlarla çalışsın
- Reproducible builds

**Risk:** Bazı paketler için "latest" eski kaldığında manuel güncelle. Örnek: `claude-api` gibi paketler aktif geliştirme altında, haftalık update gerekebilir. **Ana kural:** Her sürüm yükseltmesi DECISIONS.md'ye kayıt, hangi fix için yükseltildi notu.

### K7. Destructive İşlem Koruması

**Problem:** Claude Code'a "yes" / "auto-approve" gibi bypass modları açıldığında, AI yanlışlıkla destructive işlem yapabilir (database silme, dosya üzerine yazma, commit üzerine yazma). Bu gerçek vaka — bizim referans videodaki kullanıcının Supabase DB'si iki kez silindi.

**Çözüm — Hard kurallar:**

**1. Auto-approve mode kullanma:**
- Claude Code'a "her şeye yes" modunu açma
- Her destructive komut manuel onay gerektirsin

**2. Supabase snapshot disiplini:**
- Haftalık otomatik snapshot (Supabase Dashboard'dan schedule)
- Önemli migration öncesi manuel snapshot
- Snapshot isimlendirme: `yaver-v1-YYYY-MM-DD-feature-X`

**3. Production environment izolasyonu:**
- V1 development sırasında tek Supabase project (staging gibi kullan)
- Gerçek kullanıcılar geldiğinde (V1 launch) ikinci bir production Supabase project aç
- Claude Code asla production'a direkt bağlanmamalı

**4. Migration dosyaları version kontrollü:**
- Her şema değişikliği migration dosyası olarak git'e commit
- `supabase/migrations/YYYYMMDD-description.sql`
- Rollback için manuel rollback dosyası da hazırla

**5. Claude Code prompt'unda her zaman hatırlat:**
> "Destructive işlem yapacaksan (DROP, DELETE, TRUNCATE, rm -rf, force push) önce bana sor, otomatik yapma."

---

## BÖLÜM L — TÜM EKRANLAR

| # | Ekran | Tab/Akış |
|---|---|---|
| 1 | Karşılama | Onboarding |
| 2 | Branş Seçimi | Onboarding |
| 3 | Sınıf Seviyeleri | Onboarding |
| 4 | Loading | Onboarding |
| 5 | Wow Moment | Onboarding |
| 6 | Timeline Dashboard | Planım |
| 7 | Hafta Detayı | Planım > detay |
| 8 | Üretim Ekranı (Detaylı Mod) | Hafta Detayı > üret / Ders İçin > FAB |
| 9 | **Sürpriz Hazırlık Ekranı** | Push notification > tıklama |
| 10 | Çıktı Önizleme | Üretim sonrası |
| 11 | Ders İçin | Ders İçin |
| 12 | Evraklarım | Evraklarım |
| 13 | Şablon Doldurma | Evraklarım > evrak |
| 14 | Profil | Profil |
| 15 | **Yaver Asistanı Ayarları** | Profil > asistan |

---

## BÖLÜM M — V1.5/V2 ERTELENEN

**V1.5 Monetization Layer:**
- Tier yapısı + fiyatlandırma (reel data ile)
- Geçmiş yıllar arşivi
- Otomatik plan yenileme (her sene)
- Sınıf hafızası (tarz öğrenme)
- Sınav üretimi + optik analiz
- Veli iletişim modülü
- Ders kitabı RAG
- Düzenli otomatik hazırlama (her gün)
- Hızlı mod (test edilerek karar)
- Cache Katman 5 (batch pre-generation)
- Lifetime/subscription kararı

**V2 Genişleme:**
- Çoklu branş
- Plan yapısı düzenleme
- In-app editor
- Topluluk/paylaşım
- Akıllı tahta entegrasyonu
- Kurumsal lisans

---

## BÖLÜM N — V1 TRACKİNG (ZORUNLU)

V1.5 fiyatlandırma için bu metrikler V1'den itibaren kaydedilir:

**Acquisition:**
- Onboarding completion rate (her adım)
- Wow moment'a ulaşan %
- Plan PDF indirme oranı

**Engagement:**
- DAU, WAU, MAU
- DAU/WAU oranı (alışkanlık)
- Kullanıcı başına ortalama üretim/ay
- Bugün kartı tıklama oranı
- **Sürpriz hazırlık beğeni oranı (çok güzel / iyi / beğenmedim)**
- **Sürpriz hazırlık tıklama oranı (push → açma)**
- **Feedback response rate (feedback veren / üretim toplamı)**

**Retention:**
- D1, D7, D30
- Plan oluşturma → ilk üretim süresi
- Auth conversion
- **Sürpriz beğenme → uygulama açma korelasyonu**

**Maliyet:**
- Cache hit oranı (zorunlu %70+ hedef)
- Üretim başına ortalama AI maliyeti
- Sürpriz hazırlığın AI maliyeti (cache hit olmazsa tehlikeli)
- En çok üretilen kazanım/parametre kombinasyonları

**Tarz öğrenme datası (V1.5 hazırlığı):**
- Her kullanıcı için: beğendiği parametreler, yenilediği parametreler, hangi tipi daha sık seçtiği
- Sessiz davranış: ne kadar bakıyor, hangi bölüme scroll ediyor, hangileri indirdiği

---

## BÖLÜM O — KALP: NE SATIYORUZ?

Bu ürün "AI ile içerik üreten bir uygulama" değil.

Bu ürün **"öğretmenin kafasındaki yapılacaklar listesini alan, hatırlatan, hazırlayan, öğretmenin tarzını öğrenen, ara sıra sürpriz yapan bir dijital asistan."**

Öğretmen Yaver'i kullanmaya başladığında şu üç hissi yaşamalı:

1. **"Yaver benim bilmediğimi biliyor."** (Müfredat, takvim, kazanımlar — hepsi hazır)
2. **"Yaver unuttuğumu hatırlıyor."** (Hatırlatmalar, yaklaşan tarihler)
3. **"Yaver ben istemeden de yardım ediyor."** (Sürpriz hazırlıklar, combo akışlar)

Üçü birden olunca öğretmen fikir değiştirir: **"Bu sadece bir uygulama değil, asistanım."**

Para verme kararı bu fikir değişiminden sonra, doğal olarak gelir.

---

## BÖLÜM P — CLAUDE CODE OTURUM HAFIZA SİSTEMİ

Solopreneur gerçeği: proje günler, haftalar sürer. Sen birden fazla oturum açarsın, Claude Code her seferinde bebek gibi sıfırdan başlar. Bu sistem kaldığın yeri hatırlamanı sağlar.

### P1. Ajan Sistemi Kararı (V1'de Yok)

**Karar:** V1 için multi-agent / ajan sistemi kurulmuyor. CLAUDE.md + tek oturum + disiplin yeterli.

**Gerekçeler:**
- Proje tek domainli (React + Supabase)
- Kod tabanı küçük (~5-8K satır tahmini)
- Paralel çalışma sınırlı (ekranlar birbirine bağlı)
- Ajan orchestration overhead'i V1'i yavaşlatır

**Ne zaman revize:** V1 canlıda 100+ kullanıcı + 10K+ satır + birden fazla paralel feature olunca (V1.5).

### P2. Üç Dosyalı Hafıza Sistemi

Proje kökünde 3 dosya:

| Dosya | Rol | Güncelleme sıklığı |
|---|---|---|
| **CLAUDE.md** | Anayasa, spec'in kendisi | Nadir (stratejik karar değişiklikleri) |
| **STATUS.md** | Nerede kaldık, ne sırada | Her oturum başı + sonu |
| **DECISIONS.md** | Karar günlüğü, neden öyle yaptık | Önemli karar alındığında |

### P3. STATUS.md Şablonu

Proje başlangıcında `STATUS.md` dosyası oluşturulur ve her oturumda güncellenir.

**Şablon:**

```markdown
# Yaver V1 — Proje Durumu

**Son güncelleme:** [tarih + saat]

## Şu An Ne Yapıyoruz
[Bir cümleyle mevcut odak]

## Son Oturumda Tamamlanan
- [x] ...
- [x] ...

## Şu An Üzerinde Çalışılan
- [ ] ...
  - [x] alt-görev
  - [ ] alt-görev

## Sonraki Adımlar (öncelik sırasında)
1. ...
2. ...
3. ...

## Kararlar / Notlar
- ...

## Açık Sorunlar
- [sorun varsa]

## Bir Sonraki Oturuma Not
[kendine hatırlatma, context]
```

### P4. DECISIONS.md Şablonu

Append-only dosya. Silme yok, üzerine yazma yok.

**Şablon:**

```markdown
# Yaver V1 — Karar Günlüğü

Bu dosyaya sadece ekleme yapılır.
Her karar: tarih + ne + neden + revizyon tetikleyicisi.

---

## YYYY-MM-DD — [Karar başlığı]
**Ne:** [Karar nedir, net ve kısa]
**Neden:** [Bu kararı almanın gerekçesi]
**Ne zaman revize:** [Hangi şartlarda bu karar değişir]

---

[Sonraki karar...]
```

### P5. Oturum Akışı (Zorunlu Disiplin)

**Her oturum açılışı — kopyala yapıştır:**

```
STATUS.md'yi oku ve özetini ver. Sonra "Şu An Üzerinde Çalışılan"
maddesinden devam edelim. Kararları almadan bana danış.
Spec değişikliği gerektiren bir şey çıkarsa söyle, ben onaylamadan
CLAUDE.md'yi güncelleme.
```

**Her oturum kapanışı — kopyala yapıştır:**

```
Bu oturumda ne yaptık, neyi bitirdik, nerede kaldık, bir sonraki
oturumda ne yapılacak — STATUS.md'yi güncelle. Önemli bir karar
aldıysak DECISIONS.md'ye ekle.
```

**Oturum içinde yeni kararlar için:**

Claude Code spec dışında bir karar önerirse: "Bu spec'te yok, DECISIONS.md'ye kaydedelim mi?" diye sor. Kararı kaydet, gerekçeyi yaz.

### P6. Context Kirlenmesi Yönetimi

Uzun oturumlarda Claude Code'un context'i dolar, kararları unutur, tutarsız davranır. Belirtiler:
- Önceki bahsedilen bir karara ters öneri
- Dosya yapısını yanlış hatırlama
- Spec'teki bir kurala aykırı kod

**Çözüm:** Yeni oturum aç. STATUS.md güncel olduğu sürece bilgi kaybolmaz.

**Ne zaman yeni oturum:**
- Context'in ~%70'i dolunca
- Bir feature bitince
- Tutarsızlık fark edince
- Arada 1+ saat ara verince

### P7. Proje Başlangıç Checklist

Claude Code'un ilk oturumunda yapılacaklar:

1. [ ] `yaver-v1` klasörü oluştur
2. [ ] CLAUDE.md olarak spec'i yerleştir (bu dokümanın kendisi)
3. [ ] STATUS.md oluştur (şablondan, Hafta 1 Günlük 1 durumuyla)
4. [ ] DECISIONS.md oluştur (şablondan, ilk karar: "Ajan sistemi yok")
5. [ ] Expo + React Native + TS projesini kur
6. [ ] src/tokens içine design tokenları ekle (Bölüm G4)
7. [ ] react-native-reanimated kur ve yapılandır
8. [ ] Supabase client setup + .env
9. [ ] `/refs` klasörü oluştur (10 referans ekran görüntüsü için)
10. [ ] Git init + ilk commit

Bu checklist tamamlandıktan sonra Ekran 1 (Karşılama) ile kodlamaya başla.

---

## BÖLÜM Q — KAPANIŞ

V1.3 spec Claude Code başlangıcı için **tam hazır.** 

Bu dosya **CLAUDE.md** olarak projenin köküne kopyalanmalı. STATUS.md ve DECISIONS.md ilk oturumda oluşturulmalı. Ajan sistemi V1'de yok, sadece disiplin + hafıza dosyaları.

Ürün felsefesi tek cümleyle: **Öğretmen Yaver, öğretmenin zihinsel yükünü alan bir asistan — ara sıra sürpriz hazırlıklar yapar, yaklaşan şeyleri hatırlatır, tarzını öğrenir, zamanla vazgeçilmez olur.**

UI felsefesi tek cümleyle: **Her ekran Linear'a veya Things 3'e koyulduğunda yakışmalı. AI çıktısı gibi görünmek ürünün ölüm sebebi olur.**

V1.5'te monetization + tarz öğrenme + ders kitabı RAG eklenecek. V1'in tek görevi: **acquisition + alışkanlık + zihinsel yük alma vaadinin somutlaşması.**

---

*V1.4 spec — 17 Nisan 2026. Fiyatlandırma + premium özellikler V1.5'te reel datayla netleştirilecek.*

önemli not: her oturum başında kullanıcı "nerde kaldık" ya da "devam edelim" gibi şeyler yazdığında sen kendiliğinden status.md ve decisions.md dosyalarını oku ve kullanıcıya kısaca bilgi ver ki bu işi doğru yaptığın belli olsun. Ayrıca "kaydet" dediğimde status.md ve eğer gerekiyorsa decisions.md yi güncelle

# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
