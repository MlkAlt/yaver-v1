-- Migration 050: Müzik + BES + T.C. İnkılap + Bilişim + Matematik eksik kazanımlar
-- MÜZ 5,6,7: +1 her biri (MÜZ.x.1.6 — uzun regex'te boşluklu kod kaçırılmış)
-- BES 7: +1 (BES.7.4.1)
-- İTA 8: +1 (İTA.8.2.5)
-- BTY 6: +2 (BTY.6.4.2, BTY.6.4.4)
-- MAT 1: +3 (MAT.1.3.3, MAT.1.3.4, MAT.1.3.5)
-- Toplam: +10 → 5504 kazanım
-- Kaynak: muzik18dop.pdf, BES_Spor_Dersi_Ogretim_Programi.pdf, inkilap_8.pdf, bilişim_döp.pdf, ilkokul_matematik.pdf

INSERT INTO kazanimlar (kod, brans_id, sinif, unite_no, unite_ad, ad, ders, okul_tipi) VALUES

-- Müzik 5, Ünite 1 (boşluklu kodda yakalanamamış)
('MÜZ.5.1.6', (SELECT id FROM branslar WHERE slug = 'muzik' LIMIT 1), 5, 1, 'Ünite 1', 'Müzik yazısını çözümleyebilme', 'Müzik', 'ortaokul'),

-- Müzik 6, Ünite 1
('MÜZ.6.1.6', (SELECT id FROM branslar WHERE slug = 'muzik' LIMIT 1), 6, 1, 'Ünite 1', 'Müzik yazısını çözümleyebilme', 'Müzik', 'ortaokul'),

-- Müzik 7, Ünite 1
('MÜZ.7.1.6', (SELECT id FROM branslar WHERE slug = 'muzik' LIMIT 1), 7, 1, 'Ünite 1', 'Müzik yazısını çözümleyebilme', 'Müzik', 'ortaokul'),

-- Beden Eğitimi ve Spor 7, Ünite 4 (boşluklu kodda yakalanamamış)
('BES.7.4.1', (SELECT id FROM branslar WHERE slug = 'beden_egitimi' LIMIT 1), 7, 4, 'Ünite 4', 'Beden eğitimi ve spor alanının öncülerini tanıyabilme', 'Beden Eğitimi ve Spor', 'ortaokul'),

-- T.C. İnkılap Tarihi ve Atatürkçülük 8, Ünite 2
('İTA.8.2.5', (SELECT id FROM branslar WHERE slug = 'sosyal_bilgiler' LIMIT 1), 8, 2, 'BİRİNCİ DÜNYA SAVAŞI', 'Birinci Dünya Savaşı''nın Türk toplumuna etkilerine yönelik bakış açısı geliştirebilme', 'T.C. İnkılap Tarihi ve Atatürkçülük', 'ortaokul'),

-- Bilişim Teknolojileri ve Yazılım 6, Ünite 4
('BTY.6.4.2', (SELECT id FROM branslar WHERE slug = 'bilisim_teknolojileri' LIMIT 1), 6, 4, 'Ünite 4', 'Telif hakkı kavramını sorgulayabilme', 'Bilişim Teknolojileri ve Yazılım', 'ortaokul'),
('BTY.6.4.4', (SELECT id FROM branslar WHERE slug = 'bilisim_teknolojileri' LIMIT 1), 6, 4, 'Ünite 4', 'Kullanım haklarına göre lisans türlerini karşılaştırabilme', 'Bilişim Teknolojileri ve Yazılım', 'ortaokul'),

-- Matematik 1, Ünite 3 (MAT.1.3.3-5 eksikti)
('MAT.1.3.3', (SELECT id FROM branslar WHERE slug = 'matematik' LIMIT 1), 1, 3, 'Ünite 3', 'Günlük yaşamdaki nesneleri biçimsel özelliklerine göre ayırt edebilme', 'Matematik', 'ilkokul'),
('MAT.1.3.4', (SELECT id FROM branslar WHERE slug = 'matematik' LIMIT 1), 1, 3, 'Ünite 3', 'Günlük yaşamda karşılaşılan geometrik yapılardaki geometrik şekilleri çözümleyebilme', 'Matematik', 'ilkokul'),
('MAT.1.3.5', (SELECT id FROM branslar WHERE slug = 'matematik' LIMIT 1), 1, 3, 'Ünite 3', 'Biçimsel özelliklerine göre geometrik şekilleri sınıflandırabilme', 'Matematik', 'ilkokul')

ON CONFLICT (kod) DO UPDATE SET
  ad = EXCLUDED.ad, unite_no = EXCLUDED.unite_no, unite_ad = EXCLUDED.unite_ad,
  ders = EXCLUDED.ders, okul_tipi = EXCLUDED.okul_tipi, brans_id = EXCLUDED.brans_id;
