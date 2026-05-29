-- T.C. İnkılap Tarihi (8. sınıf) Sosyal Bilgiler branşına taşıma
-- Pratik uygulama: 8. sınıf T.C. İnkılap Tarihi'ne Sosyal Bilgiler öğretmeni girer
-- ders='T.C. İnkılap Tarihi' ve okul_tipi='ortaokul' değerleri 000010'da set edildi, korunur

-- 1. Sinif=8 kazanımlarını Tarih → Sosyal Bilgiler branşına taşı
UPDATE kazanimlar
SET brans_id = (SELECT id FROM branslar WHERE slug = 'sosyal_bilgiler')
WHERE brans_id = (SELECT id FROM branslar WHERE slug = 'tarih')
  AND sinif = 8;

-- 2. Tarih artık yalnızca lise + ihl
UPDATE branslar SET kademe = ARRAY['lise','ihl']
WHERE slug = 'tarih';
