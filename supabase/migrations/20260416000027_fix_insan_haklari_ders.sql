-- Migration 027: Sınıf Öğretmenliği 4. sınıf İnsan Hakları ders adı düzeltmesi
-- Mig 023 backfill `ders = b.ad` yapmıştı; sinif=4 İHVD.* kayıtları ders='Sınıf Öğretmenliği' kaldı.
-- planUret seciliDersler=['İnsan Hakları'] filtresine takılması için ders adı düzeltiliyor.

UPDATE kazanimlar
SET ders = 'İnsan Hakları'
WHERE brans_id = (SELECT id FROM branslar WHERE slug = 'sinif_ogretmeni')
  AND sinif = 4
  AND kod LIKE 'İHVD.%';
