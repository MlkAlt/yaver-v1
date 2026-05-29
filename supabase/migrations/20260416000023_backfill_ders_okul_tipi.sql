-- Migration 023: ders ve okul_tipi kolonlarını backfill et
--
-- Sorun: Migration 008 (5118 kazanım) bu iki kolonu INSERT etmedi;
-- kolonlar migration 010'da eklendi ama hiç doldurulmadı.
-- planUret Sınıf Öğretmenliği için `ders IN (seciliDersler)` sorgular:
-- tüm satırlarda ders=NULL → sıfır sonuç.
-- Migration 020'nin restore ettiği Türkçe satırları zaten doğru → NULL olmayanlar atlanır.

-- 1. ders = branş adı (NULL olanlar için)
UPDATE kazanimlar k
SET ders = b.ad
FROM branslar b
WHERE k.brans_id = b.id
  AND k.ders IS NULL;

-- 2. okul_tipi = sınıf bazlı (NULL olanlar için)
UPDATE kazanimlar
SET okul_tipi = CASE
  WHEN sinif BETWEEN 1 AND 4 THEN 'ilkokul'
  WHEN sinif BETWEEN 5 AND 8 THEN 'ortaokul'
  ELSE 'lise'
END
WHERE okul_tipi IS NULL;
