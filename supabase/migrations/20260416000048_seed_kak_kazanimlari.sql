-- Migration 048: Kur'an'ın Ana Konuları dersi kazanımları (İHL)
-- KAK-I (sınıf 11): 12 kazanım — 4 tema
-- KAK-II (sınıf 12): 15 kazanım — 4 tema
-- Kaynak: refs/mufredat-2025/20262181042147-kak.pdf

INSERT INTO kazanimlar (kod, brans_id, sinif, unite_no, unite_ad, ad, ders, okul_tipi) VALUES

-- KAK-I: Sınıf 11
-- Tema 1: Kur'an-ı Kerim'i Tanımak
('KAK.11.1.1', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 11, 1, 'Kur''an-ı Kerim''i Tanımak', 'Kur''an-ı Kerim''in özellikleri ve isimleri hakkında bilgi toplayabilme', 'Kur''an''ın Ana Konuları', 'ihl'),
('KAK.11.1.2', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 11, 1, 'Kur''an-ı Kerim''i Tanımak', 'Kur''an-ı Kerim''in içeriğini özetleyebilme', 'Kur''an''ın Ana Konuları', 'ihl'),
('KAK.11.1.3', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 11, 1, 'Kur''an-ı Kerim''i Tanımak', 'Bakara suresinin 2. ayetini yorumlayabilme', 'Kur''an''ın Ana Konuları', 'ihl'),

-- Tema 2: Kur'an-ı Kerim'de Allah (cc) İnancı
('KAK.11.2.1', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 11, 2, 'Kur''an-ı Kerim''de Allah (cc) İnancı', 'Allah''ın (cc) varlığı ve birliği ile ilgili akli ve naklî delilleri kullanabilme', 'Kur''an''ın Ana Konuları', 'ihl'),
('KAK.11.2.2', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 11, 2, 'Kur''an-ı Kerim''de Allah (cc) İnancı', 'Allah-âlem ilişkisiyle ilgili konuları sorgulayabilme', 'Kur''an''ın Ana Konuları', 'ihl'),
('KAK.11.2.3', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 11, 2, 'Kur''an-ı Kerim''de Allah (cc) İnancı', 'Allah (cc) inancının hayata yansımalarını yorumlayabilme', 'Kur''an''ın Ana Konuları', 'ihl'),
('KAK.11.2.4', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 11, 2, 'Kur''an-ı Kerim''de Allah (cc) İnancı', 'Allah-âlem ilişkisi konusunu incelerken Kur''an-ı Kerim meallerine başvurabilme', 'Kur''an''ın Ana Konuları', 'ihl'),

-- Tema 3: Kur'an-ı Kerim'de İnsan
('KAK.11.3.1', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 11, 3, 'Kur''an-ı Kerim''de İnsan', 'İnsanın Kur''an-ı Kerim''de bildirilen sorumluluklarını idrak edebilme', 'Kur''an''ın Ana Konuları', 'ihl'),
('KAK.11.3.2', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 11, 3, 'Kur''an-ı Kerim''de İnsan', 'Kur''an-ı Kerim''den insan psikolojisiyle ilgili bilgi toplayabilme', 'Kur''an''ın Ana Konuları', 'ihl'),
('KAK.11.3.3', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 11, 3, 'Kur''an-ı Kerim''de İnsan', 'Müminlerin özellikleri hakkında Kur''an-ı Kerim meallerine başvurabilme', 'Kur''an''ın Ana Konuları', 'ihl'),

-- Tema 4: Kur'an-ı Kerim'den Kavramlar
('KAK.11.4.1', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 11, 4, 'Kur''an-ı Kerim''den Kavramlar', 'Kur''an-ı Kerim''de yer alan emir bilmaruf nehiy anilmünker, takva, zikir ve dua kavramlarını bağlamına uygun kullanabilme', 'Kur''an''ın Ana Konuları', 'ihl'),
('KAK.11.4.2', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 11, 4, 'Kur''an-ı Kerim''den Kavramlar', 'Araf suresinin 200-201. ayetlerini yorumlayabilme', 'Kur''an''ın Ana Konuları', 'ihl'),

-- KAK-II: Sınıf 12
-- Tema 1: Kur'an-ı Kerim'i Anlamak
('KAK.12.1.1', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 12, 1, 'Kur''an-ı Kerim''i Anlamak', 'Kur''an-ı Kerim''in indirildiği ortam ile ilgili bilgi toplayabilme', 'Kur''an''ın Ana Konuları', 'ihl'),
('KAK.12.1.2', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 12, 1, 'Kur''an-ı Kerim''i Anlamak', 'Kur''an-ı Kerim''in gönderiliş amacıyla ilgili görüşleri yapılandırabilme', 'Kur''an''ın Ana Konuları', 'ihl'),
('KAK.12.1.3', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 12, 1, 'Kur''an-ı Kerim''i Anlamak', 'Kur''an-ı Kerim''i anlamanın ve ona uygun yaşamanın önemini yorumlayabilme', 'Kur''an''ın Ana Konuları', 'ihl'),
('KAK.12.1.4', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 12, 1, 'Kur''an-ı Kerim''i Anlamak', 'Yunus suresinin 57. ayetini yorumlayabilme', 'Kur''an''ın Ana Konuları', 'ihl'),

-- Tema 2: Kur'an-ı Kerim'de Peygamber İnancı
('KAK.12.2.1', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 12, 2, 'Kur''an-ı Kerim''de Peygamber İnancı', 'Nübüvvet inancını özetleyebilme', 'Kur''an''ın Ana Konuları', 'ihl'),
('KAK.12.2.2', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 12, 2, 'Kur''an-ı Kerim''de Peygamber İnancı', 'Peygamberlerin toplumsal dönüşümdeki rolünü yorumlayabilme', 'Kur''an''ın Ana Konuları', 'ihl'),
('KAK.12.2.3', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 12, 2, 'Kur''an-ı Kerim''de Peygamber İnancı', 'Hz. Muhammed (sav) ile ilgili Kur''an-ı Kerim meallerine başvurabilme', 'Kur''an''ın Ana Konuları', 'ihl'),
('KAK.12.2.4', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 12, 2, 'Kur''an-ı Kerim''de Peygamber İnancı', 'Ahzab suresinin 45-46. ayetlerini tahlil edebilme', 'Kur''an''ın Ana Konuları', 'ihl'),

-- Tema 3: Kur'an-ı Kerim'de Toplum
('KAK.12.3.1', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 12, 3, 'Kur''an-ı Kerim''de Toplum', 'Toplumu oluşturan unsurları sentezleyebilme', 'Kur''an''ın Ana Konuları', 'ihl'),
('KAK.12.3.2', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 12, 3, 'Kur''an-ı Kerim''de Toplum', 'Toplumu ayakta tutan ilkeleri çözümleyebilme', 'Kur''an''ın Ana Konuları', 'ihl'),
('KAK.12.3.3', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 12, 3, 'Kur''an-ı Kerim''de Toplum', 'İdeal toplumun (vasat ümmet) nasıl olması gerektiğini sorgulayabilme', 'Kur''an''ın Ana Konuları', 'ihl'),
('KAK.12.3.4', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 12, 3, 'Kur''an-ı Kerim''de Toplum', 'İsra suresinin 23. ayetini tahlil edebilme', 'Kur''an''ın Ana Konuları', 'ihl'),

-- Tema 4: Kur'an-ı Kerim'de Ahiret
('KAK.12.4.1', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 12, 4, 'Kur''an-ı Kerim''de Ahiret', 'Ahiret ile ilgili konularda Kur''an-ı Kerim meallerine başvurabilme', 'Kur''an''ın Ana Konuları', 'ihl'),
('KAK.12.4.2', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 12, 4, 'Kur''an-ı Kerim''de Ahiret', 'Dünya ve ahiret hayatı hakkında mukayese yapabilme', 'Kur''an''ın Ana Konuları', 'ihl'),
('KAK.12.4.3', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 12, 4, 'Kur''an-ı Kerim''de Ahiret', 'Enam suresinin 32. ayetini yorumlayabilme', 'Kur''an''ın Ana Konuları', 'ihl')

ON CONFLICT (kod) DO UPDATE SET
  ad = EXCLUDED.ad, unite_no = EXCLUDED.unite_no, unite_ad = EXCLUDED.unite_ad,
  ders = EXCLUDED.ders, okul_tipi = EXCLUDED.okul_tipi, brans_id = EXCLUDED.brans_id;
