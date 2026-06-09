-- Migration 049: Teknoloji ve Tasarım + Trafik Güvenliği eksik kazanımlar
-- TT sınıf 7: +3 (TT.7.5.1, TT.7.5.3, TT.7.5.4 — ünite 5 Mimari Tasarım)
-- TT sınıf 8: +3 (TT.8.1.3, TT.8.3.2, TT.8.3.3)
-- TG sınıf 4: +4 (TG.4.3.1, TG.4.3.2, TG.4.4.1, TG.4.4.2)
-- Toplam: +10 → 5494 kazanım
-- Kaynak: refs/mufredat-2025/202651415165252-teknotasardöp.pdf, 2025829164512920-trafik_pdf.pdf

INSERT INTO kazanimlar (kod, brans_id, sinif, unite_no, unite_ad, ad, ders, okul_tipi) VALUES

-- TT sınıf 7, Ünite 5: Mimari Tasarım
('TT.7.5.1', (SELECT id FROM branslar WHERE slug = 'teknoloji_tasarim' LIMIT 1), 7, 5, 'MİMARİ TASARIM', 'Mekânsal analoji yapabilme', 'Teknoloji ve Tasarım', 'ortaokul'),
('TT.7.5.3', (SELECT id FROM branslar WHERE slug = 'teknoloji_tasarim' LIMIT 1), 7, 5, 'MİMARİ TASARIM', 'Yaşamak istediği konutun farklı coğrafi alan ve şartlara uygun olarak tasarımını oluşturabilme', 'Teknoloji ve Tasarım', 'ortaokul'),
('TT.7.5.4', (SELECT id FROM branslar WHERE slug = 'teknoloji_tasarim' LIMIT 1), 7, 5, 'MİMARİ TASARIM', 'Mimari tasarımı için çoklu ortam sunumu yapabilme', 'Teknoloji ve Tasarım', 'ortaokul'),

-- TT sınıf 8, Ünite 1: İnovatif Düşünce
('TT.8.1.3', (SELECT id FROM branslar WHERE slug = 'teknoloji_tasarim' LIMIT 1), 8, 1, 'İNOVATİF DÜŞÜNCENİN GELİŞTİRİLMESİ, FİKİRLERİN', 'Fikrî ve Sınaî Mülkiyet Haklarının Korunması hakkında bilgi toplayabilme', 'Teknoloji ve Tasarım', 'ortaokul'),

-- TT sınıf 8, Ünite 3: Görsel İletişim Tasarımı
('TT.8.3.2', (SELECT id FROM branslar WHERE slug = 'teknoloji_tasarim' LIMIT 1), 8, 3, 'GÖRSEL İLETİŞİM TASARIMI', 'Yayın grafiği tasarım ürünlerini çözümleyebilme', 'Teknoloji ve Tasarım', 'ortaokul'),
('TT.8.3.3', (SELECT id FROM branslar WHERE slug = 'teknoloji_tasarim' LIMIT 1), 8, 3, 'GÖRSEL İLETİŞİM TASARIMI', 'Yayın grafiği tasarım ürünü oluşturabilme', 'Teknoloji ve Tasarım', 'ortaokul'),

-- TG sınıf 4, Ünite 3: Trafikteki Hak ve Sorumluluklar
('TG.4.3.1', (SELECT id FROM branslar WHERE slug = 'sinif_ogretmeni' LIMIT 1), 4, 3, 'Ünite 3', 'Trafikteki hak ve sorumluluklarını sorgulayabilme', 'Trafik Güvenliği', 'ilkokul'),
('TG.4.3.2', (SELECT id FROM branslar WHERE slug = 'sinif_ogretmeni' LIMIT 1), 4, 3, 'Ünite 3', 'Davranış biçimlerinin trafikteki iletişime etkisini değerlendirebilme', 'Trafik Güvenliği', 'ilkokul'),

-- TG sınıf 4, Ünite 4: İlk Yardım ve Trafik
('TG.4.4.1', (SELECT id FROM branslar WHERE slug = 'sinif_ogretmeni' LIMIT 1), 4, 4, 'Ünite 4', 'Taşıtlarda bulunması gereken ilk yardım malzemelerine ilişkin bilgi toplayabilme', 'Trafik Güvenliği', 'ilkokul'),
('TG.4.4.2', (SELECT id FROM branslar WHERE slug = 'sinif_ogretmeni' LIMIT 1), 4, 4, 'Ünite 4', 'Trafikte acil durumlarda doğru davranış biçimlerini belirleyebilme', 'Trafik Güvenliği', 'ilkokul')

ON CONFLICT (kod) DO UPDATE SET
  ad = EXCLUDED.ad, unite_no = EXCLUDED.unite_no, unite_ad = EXCLUDED.unite_ad,
  ders = EXCLUDED.ders, okul_tipi = EXCLUDED.okul_tipi, brans_id = EXCLUDED.brans_id;
