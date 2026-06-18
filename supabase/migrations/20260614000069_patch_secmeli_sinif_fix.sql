-- Migration 069: Seçmeli dersler sinif=0 → gerçek sinif değeri
-- Yalnızca tek sınıfta alınabilen dersler düzeltildi.
-- Çok sınıflı seçmeli (Astronomi, Psikoloji, IHL sanat vb.) sinif=0 kalır,
-- planUret post-fetch remap ile öğretmenin sinifına atanır.

UPDATE kazanimlar
  SET sinif = 10
  WHERE ders = 'Mantık'
    AND sinif = 0
    AND okul_tipi = 'lise';

UPDATE kazanimlar
  SET sinif = 12
  WHERE ders = 'Çağdaş Türk ve Dünya Tarihi'
    AND sinif = 0
    AND okul_tipi = 'lise';

UPDATE kazanimlar
  SET sinif = 10
  WHERE ders = 'İklim, Çevre ve Yenilikçi Çözümler'
    AND sinif = 0
    AND okul_tipi = 'lise';
