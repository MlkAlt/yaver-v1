-- Migration 029: Beden Eğitimi ilkokul (sinif 1-4) ders adı düzeltmesi
--
-- Mig 023 backfill `ders = b.ad` yaptı → tüm BEd kayıtlarına 'Beden Eğitimi ve Spor' ataması.
-- MEB'de ilkokul (1-4. sınıf) dersin resmi adı 'Beden Eğitimi ve Oyun'.
-- EkDerslerScreen DERS_HAVUZU bu adı kullanıyor; planUret seciliDersler sorgusunda eşleşmiyor.

UPDATE kazanimlar
SET ders = 'Beden Eğitimi ve Oyun'
WHERE sinif BETWEEN 1 AND 4
  AND brans_id = (SELECT id FROM branslar WHERE ad = 'Beden Eğitimi ve Spor');
