-- Migration 000016: İHL Meslek Dersleri ayrı branş olarak eklendi
-- din_kulturu → sadece ilkokul/ortaokul/iho/lise; ihl meslek dersleri ayrı branşa taşındı

-- 1. Yeni branş ekle
INSERT INTO branslar (ad, ikon, renk, sira, slug, kademe)
VALUES ('İHL Meslek Dersleri', '🕌', '#FFF7ED', 25, 'ihl_meslek_dersleri', ARRAY['ihl']);

-- 2. Kazanımları taşı: din_kulturu ihl → ihl_meslek_dersleri
UPDATE kazanimlar
SET brans_id = (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri')
WHERE brans_id = (SELECT id FROM branslar WHERE slug = 'din_kulturu')
  AND okul_tipi = 'ihl';

-- 3. din_kulturu kademesinden ihl kaldır
UPDATE branslar
SET kademe = ARRAY['ilkokul','ortaokul','iho','lise']
WHERE slug = 'din_kulturu';
