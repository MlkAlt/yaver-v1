# Yaver V1 - Proje Durumu

**Son guncelleme:** 16.04.2026 - Oturum 2 ortasi

## Su An Ne Yapiliyor
Onboarding akisi ve ilk veri katmani kurulmus durumda. Siradaki ana is, onboarding'i Supabase verisiyle baglamak ve Hafta 2 kapsamindaki ana uygulama ekranlarina gecmek.

## Tamamlananlar
- [x] Vite + React + TypeScript projesi olusturuldu
- [x] Tailwind CSS 3.4.4 kuruldu, tasarim tokenlari eklendi
- [x] Framer Motion 11.3.8 kuruldu
- [x] Supabase proje ve istemci kurulumu yapildi
- [x] Ilk schema migration yazildi ve calistirildi
- [x] RLS tum tablolarda aktif hale getirildi
- [x] `.claude/skills/` altina 3 skill yazildi
  - [x] `yaver-ui-kit`
  - [x] `ux-critic`
  - [x] `ui-designer`
- [x] Seed migration'lari yazildi
  - [x] `branslar` seed'i eklendi
  - [x] `egitim_takvimi` seed'i eklendi
- [x] Onboarding rotalari tanimlandi
  - [x] Welcome
  - [x] Brans Secimi
  - [x] Sinif Secimi
  - [x] Loading
  - [x] Wow Moment
- [x] `save-exact=true` ile `.npmrc` uzerinden version pinning kalici hale getirildi

## Mevcut Durumun Ozeti
- Uygulama su anda onboarding odakli bir iskelete sahip.
- Router kurulmus ve onboarding sayfalari `src/pages/Onboarding/` altinda mevcut.
- Supabase tarafinda schema + seed katmani baslangic seviyesiyle hazir.
- Skill sistemi "kurulacak" asamasini gecti; aktif proje varligi olarak repoda duruyor.

## Dikkat Gerektiren Noktalar
- `STATUS.md` onceki halinde repo gerceginin gerisinde kalmisti; bu dosya simdi onun duzeltilmis halidir.
- Seed verisi ile notlar arasinda fark var:
  - `branslar` seed'i 15 degil 14 kayit iceriyor.
  - `egitim_takvimi` notlarda 36 hafta diye geciyor, migration ise 40 hafta numarasi uzerinden ilerliyor ve tatil haftalarini da kayit olarak tutuyor.
- Belgelerde tarih disiplini bozulmustu; `DECISIONS.md` icindeki bazi kayitlar bugunden ileri tarih ile girilmisti.
- Repo su anda temiz degil:
  - `package.json` ve `package-lock.json` degismis
  - `refs/` altinda eklenmemis gorseller var
  Bu durum bilerek yapildiysa sorun degil, ama bir sonraki commit oncesi gozden gecirilmeli.

## Siradaki Adimlar
1. Onboarding ekranlarini gercek Supabase verisiyle bagla.
2. Seed verisi ile urun dilini hizala.
3. Brans/sinif secimlerinden sonra kullanici durumunu kalici hale getir.
4. Hafta 2 kapsamindaki ana uygulama ekranlarini ac.
5. Yillik plan uretim mantigini deterministik kurallarla tasarla.

## Acik Sorular
- Brans listesi son hali 14 mu kalacak, yoksa yeni ders/alan eklenecek mi?
- `egitim_takvimi` yapisinda tatil haftalari ayrik mi tutulacak, yoksa "ders haftasi" sayisi ile veri modeli daha net mi ayrilacak?
- Welcome ekraninin gorsel dili final mi, yoksa referans kutuphanesine bakilarak bir tur daha rafine edilecek mi?

## Sonraki Oturum Icin Kisa Not
- `STATUS.md` ve `DECISIONS.md`'yi birlikte guncellemeden oturum kapatma.
- Yeni feature biter bitmez bu dosyada "tamamlandi" satiri ac.
- Planlama notu ile repo gercegi arasinda fark birikmesine izin verme.
