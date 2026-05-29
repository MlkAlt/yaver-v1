-- Hayat Bilgisi ve Rehber Öğretmen branşlarını kaldır (V1 kapsamı dışı)
DELETE FROM kazanimlar
WHERE brans_id IN (
  SELECT id FROM branslar WHERE slug IN ('hayat_bilgisi', 'rehber_ogretmen')
);

DELETE FROM branslar WHERE slug IN ('hayat_bilgisi', 'rehber_ogretmen');
