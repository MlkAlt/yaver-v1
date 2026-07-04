# F3b + F3c — Bu Hafta defter görünümü sadeleştirme + Son Hazırlananlar kaldırma
**Rol:** ui-craftsman · **Gate:** PASS (`npx tsc --noEmit` — proje genelinde 0 hata)

## Ne yapıldı

### F3c — "Son Hazırlananlar" uydurma bölümü KALDIRILDI
Tamamen sahte sabit veriydi (3 hayali kayıt: Üslü İfadeler / Polinomlar / Trigonometri; sahte "Bugün/Dün/2 gün önce" tarihleri). Kaldırılanlar:
- `SON_HAZIRLANLAR` sabiti
- `SonHazirlanlar()` komponenti
- render çağrısı (`<SonHazirlanlar />`)
- yalnız buna ait 9 ölü stil (`sonSection`, `sonScroll`, `sonCard`, `sonIcon`, `sonTip`, `sonBaslik`, `sonMeta`, `sonSinif`, `sonTarih`)
- ölü kalan `ScrollView` importu (react-native) — yalnızca bu komponentte kullanılıyordu; ana scroll `Animated.ScrollView` (reanimated) ile ayrı, ona dokunulmadı.
- `shadows` importu KORUNDU (`onumCard` hâlâ kullanıyor). İkon importları (`Pencil/BookOpen/Zap`) KORUNDU (`HIZLI_TIPLER` de kullanıyor).
- Grep ile doğrulandı: `SON_HAZIRLANLAR`/`SonHazirlanlar`/`son*` stilleri tüm `src/`'de yalnız bu dosyadaydı, başka referans yok.

### F3b — "Bu Hafta" saf defter görünümüne indirildi
`BuHaftaCard` sakin, gerçek-veri bir "defter sayfası" gibi yeniden tasarlandı:
- **Neon glow kaldırıldı:** 2px accent border + accent-renkli glow shadow (`shadowColor accent`, opacity 0.28, radius 14, elevation 6) → sakin anchor kart: sınırsız, yumuşak nötr `shadows.card` lift. Accent artık sadece küçük "BU HAFTA" mikro-etiketi + "Tümünü gör" linkinde (accent kullanımı azaldı). Handoff mockup'ındaki (`s6 planım.png`) "BUGÜN" kartıyla aynı tonda — mavi derin modüllere saklı.
- **Nefes payı:** kaldırılan ilerleme çubuğunun bıraktığı dar/ani gap düzeltildi. Kart `gap:8` yerine açık spacing: padding 14→18, peek listesi üst bölücüsü `marginTop 2→16` (çubuğun bıraktığı yerde gerçek nefes), peek satırı `paddingVertical 9→11`.
- **Peek satırları — nötr, gerçek-veri, iki satır:** sahte durum noktası yok. Ürün kararı olarak nötr işaret = **gerçek kazanım kodu**. Satır artık: konu (text1, semiBold 14) üstte + `{sınıf} · {kazanım kodu}` (text3, muted 11) altta. `kod` şu ana kadar tipte olup UI'da hiç gösterilmiyordu; HaftaDetayi'de zaten kullanıcıya görünen gerçek/güvenilir veri (orada kimlik anahtarı). Renk/status iddiası yok — sadece bağlam.
- **Korundu:** header (Bu Hafta + Hafta N · tarih + "Tümünü gör" → HaftaDetayi), peek listesi (gerçek `plan.haftalar[].kazanimlar`), "ve N kazanım daha" linki, GradientHeader dönem-progress çubuğu, "Ders programını ekle" strip CTA'sı. HaftaDetayi navigasyonu ve gerçek veri binding bozulmadı.

## Dokunulan dosyalar
- `src/screens/main/PlanimScreen.tsx` (yalnızca bu dosya)

## ux-critic sonucu
- **In-scope FAIL: 0.** Tüm dokunduğum maddeler PASS: hard-coded renk yok (yalnız `src/tokens/`), zemin krem/kart beyaz, tipografi hiyerarşisi net, varyasyonlu spacing, accent 70/20/10'a uygun (azaldı), giriş animasyonu (fadeSlide 380ms) korunuyor, mikro dil temiz.
- **2 WARN — ikisi de kapsam dışı / önceden var:**
  1. Lucide `strokeWidth`: karttaki chevron'lar 2.5 (kit kuralı 1.5). Bilerek DEĞİŞTİRMEDİM: tüm ekran küçük chevron'larda tutarlı 2.5 kullanıyor (tatil/dersProgrami/detay/peekMore) ve hemen altındaki "Ders programını ekle" strip (DOKUNMA denildi) 2.5'te. Yalnız kartı 1.5 yapmak bitişik strip ile görünür tutarsızlık yaratırdı. → Ayrı, ekran-geneli koordineli ikon geçişi olarak ele alınmalı.
  2. Hero başlıkta italic mikro-imza yok — bu GradientHeader'da ("Merhaba, {ad}!"), header kapsam dışı (dokunma). Kartın hero'su yok.
- **Kalibrasyon (Things 3 / Linear yakışır mı?): EVET** — sakin beyaz kart, editoryal iki-satır kayıtlar, ölçülü accent.

## Sıradaki role ne gerek
- Yok — F3b + F3c tamamlandı, gate PASS. Şef `board.json`'da F3b/F3c → done işaretleyebilir.

## Açık sorular / riskler
- **Gerçek-veri CTA (ürün kararı, bu görevde eklenmedi):** F3a'da kaldırılan ProaktifOneri'nin yerine kartta hâlâ birincil aksiyon yok; kullanıcı peek → "Tümünü gör" → HaftaDetayi üzerinden aksiyona ulaşıyor ("Benim yerime hazırla" orada). İstenirse kartın altına hazır/hazır-değil iddiası olmayan nötr bir CTA düşünülebilir — ayrı görev.
- **strokeWidth 1.5 geçişi:** Ekran genelinde chevron/ikon strokeWidth'i 1.5'e çekmek isteniyorsa tek dosyada tüm ikonları (ve kapsam dışı strip'i) kapsayan koordineli bir pass gerekir; parçalı yapılırsa tutarsızlık doğar.
- **Risk yok:** değişiklik izole (tek dosya, tek komponent + ölü-kod kaldırma), cross-file referans grep ile tarandı, tsc 0.
