-- Migration 051: Dini dersler + Sağlık + KK iho + PH iho eksik kazanımlar
-- Sağlık Bilgisi 9: +2 (SBTK.4.1, SBTK.4.2)
-- Hadis ihl 10: +1 (HDS.10.4.3)
-- KK iho 7: +2 (KK.7.3.3, KK.7.4.1)
-- PH iho 8: +1 (PH.8.2.2)
-- Dini Musiki I (sinif 9): +3 (DMUS.I.1.4, DMUS.I.3.4, DMUS.I.3.5)
-- Dini Musiki II (sinif 10): +4 (DMUS.II.1.4, DMUS.II.2.3, DMUS.II.3.4, DMUS.II.3.5)
-- Dini Musiki III (sinif 11): +4 (DMUS.III.1.4, DMUS.III.3.2, DMUS.III.3.5, DMUS.III.3.6)
-- Toplam: +17 → 5521 kazanım
-- Kaynak: Saglıkbiltrafik.pdf, Aihl_Hadis.pdf, kk58.pdf, ph58.pdf, Dini_Musiki_Program_KAREKODLU.pdf

INSERT INTO kazanimlar (kod, brans_id, sinif, unite_no, unite_ad, ad, ders, okul_tipi) VALUES

-- Sağlık Bilgisi 9, Ünite 4 (4. ünite extraction'da atlanmış)
('SBTK.4.1', (SELECT id FROM branslar WHERE slug = 'beden_egitimi' LIMIT 1), 9, 4, 'Ünite 4', 'İlk yardım bilgilerine dair deneyimleri yansıtabilme', 'Sağlık Bilgisi ve Trafik Kültürü', 'lise'),
('SBTK.4.2', (SELECT id FROM branslar WHERE slug = 'beden_egitimi' LIMIT 1), 9, 4, 'Ünite 4', 'Sağlıklı ve güvenli yaşam için güvenli ortam oluşturabilme', 'Sağlık Bilgisi ve Trafik Kültürü', 'lise'),

-- Hadis ihl 10, Ünite 4
('HDS.10.4.3', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 10, 4, 'HADİS VE SÜNNETİN ANLAŞILMASI', 'İlimle ilgili hadis rivayetlerinde hadis kaynaklarına başvurabilme', 'Hadis', 'ihl'),

-- Kur'an-ı Kerim iho 7
('KK.7.3.3', (SELECT id FROM branslar WHERE slug = 'din_kulturu' LIMIT 1), 7, 3, 'Ünite 3', 'Nahl suresinin 68-69. ayetleriyle ilgili bilgi toplayabilme', 'Kur''an-ı Kerim', 'iho'),
('KK.7.4.1', (SELECT id FROM branslar WHERE slug = 'din_kulturu' LIMIT 1), 7, 4, 'Ünite 4', 'Kalkaleyi telaffuz edebilme', 'Kur''an-ı Kerim', 'iho'),

-- Peygamberimizin Hayatı iho 8
('PH.8.2.2', (SELECT id FROM branslar WHERE slug = 'din_kulturu' LIMIT 1), 8, 2, 'PEYGAMBERİMİZİN MEDİNELİ ARKADAŞLARI', 'Medineli sahabililerin Hz. Peygamber''e olan bağlılığını yorumlayabilme', 'Peygamberimizin Hayatı', 'iho'),

-- Dini Musiki I (sinif 9)
('DMUS.I.1.4', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 9, 1, 'YAZIDAN MAKAMA', 'Türk din musikisinde kullanılan ney ve kudüm çalgılarını karşılaştırabilme', 'Dini Musiki', 'ihl'),
('DMUS.I.3.4', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 9, 3, 'FORMDAN MUSİKİYE', 'Sofyan usulüne uygun hareket edebilme', 'Dini Musiki', 'ihl'),
('DMUS.I.3.5', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 9, 3, 'FORMDAN MUSİKİYE', 'Hicaz makamını dinleyebilme', 'Dini Musiki', 'ihl'),

-- Dini Musiki II (sinif 10)
('DMUS.II.1.4', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 10, 1, 'YAZIDAN MAKAMA', 'Türk din musikisinde kullanılan ut ve tef çalgılarını karşılaştırabilme', 'Dini Musiki', 'ihl'),
('DMUS.II.2.3', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 10, 2, 'TARİHTEN TINIYLA', 'Türk din musikisinde kullanılan santur ve rebap çalgılarını karşılaştırabilme', 'Dini Musiki', 'ihl'),
('DMUS.II.3.4', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 10, 3, 'FORMDAN MUSİKİYE', 'Devrihindi usulüne uygun hareket edebilme', 'Dini Musiki', 'ihl'),
('DMUS.II.3.5', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 10, 3, 'FORMDAN MUSİKİYE', 'Muhayyerkürdi makamını dinleyebilme', 'Dini Musiki', 'ihl'),

-- Dini Musiki III (sinif 11)
('DMUS.III.1.4', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 11, 1, 'YAZIDAN MAKAMA', 'Farklı kültürlere ait musiki çalgılarından erhu ve viyolonseli karşılaştırabilme', 'Dini Musiki', 'ihl'),
('DMUS.III.3.2', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 11, 3, 'FORMDAN MUSİKİYE', 'Türk din musikisine katkıları olan toplulukları sentezleyebilme', 'Dini Musiki', 'ihl'),
('DMUS.III.3.5', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 11, 3, 'FORMDAN MUSİKİYE', 'Curcuna usulüne uygun hareket edebilme', 'Dini Musiki', 'ihl'),
('DMUS.III.3.6', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 11, 3, 'FORMDAN MUSİKİYE', 'Hüzzam makamını dinleyebilme', 'Dini Musiki', 'ihl')

ON CONFLICT (kod) DO UPDATE SET
  ad = EXCLUDED.ad, unite_no = EXCLUDED.unite_no, unite_ad = EXCLUDED.unite_ad,
  ders = EXCLUDED.ders, okul_tipi = EXCLUDED.okul_tipi, brans_id = EXCLUDED.brans_id;
