# F3a — PlanimScreen sahte hazirSayisi sayaçlarını kaldır + Bu Hafta audit
**Rol:** refactor-engineer · **Gate:** PASS (`npx tsc --noEmit` — proje genelinde 0 hata, PlanimScreen.tsx dahil)

## Ne yapıldı
`hazirSayisi` / `hazir` alanlarını besleyen ve gösteren tüm sahte "N hazır" sayaç/rozet kodu kaldırıldı (7 nokta, ~6'lık tahminle eşleşiyor). Hepsi her zaman aynı sahte değeri üretiyordu: `hazirSayisi` `buildHaftaList()` içinde hep `0` set ediliyordu, `KazanimPeek.hazir` hep `false` idi — yani gösterilen "0 / Y kazanım hazır" ve turuncu durum noktaları gerçek bir hazırlık durumunu hiç yansıtmıyordu.

Kaldırılanlar:
1. `KazanimPeek` tipi — `hazir: boolean` alanı silindi.
2. `HaftaData` tipi — `hazirSayisi: number` alanı silindi.
3. `buildHaftaList()` — `hazirSayisi: 0` init satırı silindi.
4. `buildHaftaList()` — kazanımlar map'inde `hazir: false` init silindi.
5. `BuHaftaCard` — `progress` hesaplaması + "X / Y kazanım hazır" etiketi + ilerleme çubuğu (progressLabel/progressTrack/progressFill) JSX'ten kaldırıldı.
6. `BuHaftaCard` — peek satırındaki durum noktası (`k.hazir ? success : warning` renkli `peekDot`) kaldırıldı.
7. `ProaktifOneri` komponenti + çağrı yeri tamamen kaldırıldı (`aktifHafta.hazirSayisi < aktifHafta.kazanimSayisi` koşulu ve `kalan` hesabı — aktif hafta olduğu sürece pratikte HER ZAMAN true idi, gerçek bir "henüz hazırlanmadı" sinyali değildi).

Yan temizlik: artık kullanılmayan `AlertCircle` import'u ve `progressLabel`/`progressTrack`/`progressFill`/`peekDot`/`oneriStrip`/`oneriText` style tanımları da silindi (ölü kod bırakmamak için — bunlar yalnızca silinen özelliğe aitti, başka hiçbir yerde kullanılmıyordu, grep ile doğrulandı).

Başka hiçbir davranış değiştirilmedi. `GradientHeader`'daki "Dönem progress" çubuğu (`aktifNo`/`toplam` haftaya dayalı, gerçek veri) dokunulmadan kaldı — hazirSayisi ile ilgisi yok.

## Dokunulan dosyalar
- `src/screens/main/PlanimScreen.tsx` (yalnızca bu dosya)

## Bu Hafta bölümü audit bulguları (F3b için)

**Kalması gerekenler (gerçek veriye dayanıyor):**
- Header satırı: "Bu Hafta" etiketi + "Hafta N · tarih aralığı" + "Tümünü gör" → HaftaDetayi.
- Kazanım peek listesi: ilk 3 kazanımın konu + sınıf bilgisi (gerçek `plan.haftalar[].kazanimlar`).
- "ve N kazanım daha" linki (gerçek `kazanimSayisi - peek.length`).

**Bu görevde kaldırılanlar (yukarıda listelendi):** ilerleme çubuğu, "hazır" etiketi, durum noktası, ProaktifOneri şeridi.

**Açık tasarım soruları (F3b — ui-craftsman):**
- `buHaftaCard`'ın "neon glow" çerçevesi (2px accent border + accent shadow) muhtemelen ilerleme metriğini öne çıkarmak için tasarlanmıştı. Metrik gittiğine göre bu görsel ağırlık artık orantısız durabilir — sade bir karta indirilmeli mi?
- Peek listesi artık header'ın hemen altında sadece 8px gap + üst border ile başlıyor (önceden orada ilerleme çubuğu vardı). Boşluk dar/ani hissedebilir — yeniden nefes payı ayarlanmalı.
- Peek satırlarında artık sol tarafta hiçbir görsel işaret yok (nokta silindi). Bilerek "durum göstermeyen" bir liste mi olsun, yoksa nötr bir işaret (ör. kazanım kodu, madde imi) mi eklensin — ürün kararı.
- ProaktifOneri'nin yokluğu "context'in olduğu yerde aksiyon var" ilkesini zayıflatabilir. Gerçek veriye dayanan bir CTA (ör. sadece "Bu hafta N kazanım var → Hazırla" — hazır/hazır-değil iddiası olmadan) düşünülebilir; bu bir ürün kararı, bu görevde eklenmedi.

**Kapsam dışı gözlem (dokunulmadı, bilgi amaçlı):** `SON_HAZIRLANLAR` sabiti + `SonHazirlanlar()` komponenti ("Son Hazırlananlar" bölümü) tamamen uydurma sabit veri (3 hayali kayıt: "Üslü İfadeler/Polinomlar/Trigonometri", sahte "Bugün/Dün/2 gün önce" tarihleri). `hazirSayisi` kapsamına girmediği için bu görevde dokunulmadı, ama aynı "sahte veri güven kırar" ilkesine giriyor — ayrı bir görev olarak değerlendirilebilir.

## Sıradaki role ne gerek
- **ui-craftsman (F3b):** Yukarıdaki "açık tasarım soruları" başlangıç noktası. `BuHaftaCard` sahte sayaç/nokta/şerit gittikten sonra saf defter görünümüne indirgenecek şekilde yeniden tasarlanabilir (`/ui-redesign` + `/ux-critic`).

## Açık sorular / riskler
- Yok — kaldırma mekanik ve izoleydi, cross-file referans bulunamadı (grep ile `hazirSayisi`/`.hazir` için tüm `src/` tarandı, yalnızca PlanimScreen.tsx'te vardı).
