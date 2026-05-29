-- Migration 036: IHL Arapça 9-10 ders adı düzeltme
-- arapca910.json extraction hatası: siniflar 9,10 için ders='Mesleki Arapça' girilmişti
-- Doğrusu: siniflar 9,10 → 'Arapça', siniflar 11,12 → 'Mesleki Arapça'
UPDATE kazanimlar
SET ders = 'Arapça'
WHERE brans_id = (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri')
  AND ders = 'Mesleki Arapça'
  AND sinif IN (9, 10);
