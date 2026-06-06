-- Migration 046: Beden Eğitimi ve Oyun 3. sınıf eksik kazanım
-- BEO.3.6.3 extraction'da atlanmıştı

INSERT INTO kazanimlar (kod, brans_id, sinif, unite_no, unite_ad, ad, ders, okul_tipi) VALUES
  ('BEO.3.6.3', (SELECT id FROM branslar WHERE slug = 'beden_egitimi' LIMIT 1), 3, 6, 'Kültürel', 'Mustafa Kemal Atatürk''ün ilgilendiği sporları açıklayabilme', 'Beden Eğitimi ve Oyun', 'ilkokul')
ON CONFLICT (kod) DO UPDATE SET
  ad = EXCLUDED.ad, unite_no = EXCLUDED.unite_no, unite_ad = EXCLUDED.unite_ad,
  ders = EXCLUDED.ders, okul_tipi = EXCLUDED.okul_tipi, brans_id = EXCLUDED.brans_id;
