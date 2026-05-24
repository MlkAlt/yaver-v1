-- Migration 000017: Tarih kademe düzeltme
-- Migration 000012 ile 8. sınıf İnkılap Tarihi kazanımları Sosyal Bilgiler'e taşındı.
-- Tarih branşı artık yalnızca lise ve ihl kademesinde yer alır.

UPDATE branslar
SET kademe = ARRAY['lise','ihl']
WHERE slug = 'tarih';
