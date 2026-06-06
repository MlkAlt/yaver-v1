-- Migration 045: Sosyal Bilgiler eksik 2 kazanım eklendi
-- SB.5.6.1 ve SB.7.1.1 extraction'da atlanmıştı

INSERT INTO kazanimlar (kod, brans_id, sinif, unite_no, unite_ad, ad, ders, okul_tipi) VALUES
  ('SB.5.6.1', (SELECT id FROM branslar WHERE slug = 'sosyal_bilgiler' LIMIT 1), 5, 6, 'Ünite 6', 'Teknolojik gelişmelerin toplum hayatına etkilerini tartışabilme', 'Sosyal Bilgiler', 'ortaokul'),
  ('SB.7.1.1', (SELECT id FROM branslar WHERE slug = 'sosyal_bilgiler' LIMIT 1), 7, 1, 'Ünite 1', 'Dâhil olduğu gruplarda ve sosyal hayatta etkili iletişimin önemini sorgulayabilme', 'Sosyal Bilgiler', 'ortaokul')
ON CONFLICT (kod) DO UPDATE SET
  ad = EXCLUDED.ad, unite_no = EXCLUDED.unite_no, unite_ad = EXCLUDED.unite_ad,
  ders = EXCLUDED.ders, okul_tipi = EXCLUDED.okul_tipi, brans_id = EXCLUDED.brans_id;
