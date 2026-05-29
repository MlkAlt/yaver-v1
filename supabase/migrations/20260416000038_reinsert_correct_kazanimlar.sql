-- Migration 038: Doğru kazanım metinleriyle yeniden ekle
-- Migration 037'de silinen 50 kayıt + DB'de kalan 2 kirli kayıt (TT.7.5.3, TT.7.5.4)
-- Kaynak: MEB 2025 PDF'leri — ÖĞRENME ÇIKTILARI VE SÜREÇ BİLEŞENLERİ bölümü

-- 1. TT.7.5.3 ve TT.7.5.4 güncelle (migration 037'de silinmedi, kirli metin hâlâ var)
UPDATE kazanimlar
SET ad = 'Yaşamak istediği konutun farklı coğrafi alan ve şartlara uygun olarak tasarımını oluşturabilme'
WHERE kod = 'TT.7.5.3';

UPDATE kazanimlar
SET ad = 'Mimari tasarımı için çoklu ortam sunumu yapabilme'
WHERE kod = 'TT.7.5.4';

-- 2. Migration 030 kayıtları — sosyal_bilgiler, din_kulturu, turkce, teknoloji_tasarim (ortaokul)
INSERT INTO kazanimlar (kod, brans_id, sinif, unite_no, unite_ad, ad, ders, okul_tipi, ders_turu)
VALUES
  ('İTA.8.1.1', (SELECT id FROM branslar WHERE slug = 'sosyal_bilgiler'), 8, 1, '',                              'Mustafa Kemal''in doğduğu dönemde Osmanlı Devleti''nin içinde bulunduğu siyasi, sosyal ve ekonomik durumu neden ve sonuçlarıyla yorumlayabilme', 'T.C. İnkılap Tarihi', 'ortaokul', 'zorunlu'),
  ('KK.5.1.3',  (SELECT id FROM branslar WHERE slug = 'din_kulturu'),     5, 1, 'KUR''AN-I KERİM''İ TANIYORUM', 'Harfleri yazabilme',                                                                                                                                                                             'Kur''an-ı Kerim',    'ortaokul', 'zorunlu'),
  ('KK.7.4.1',  (SELECT id FROM branslar WHERE slug = 'din_kulturu'),     7, 4, 'KUR''AN-I KERİM''İ OKUYORUM',  'Kalkaleyi telaffuz edebilme',                                                                                                                                                                   'Kur''an-ı Kerim',    'ortaokul', 'zorunlu'),
  ('T.K.5.2',   (SELECT id FROM branslar WHERE slug = 'turkce'),          5, 1, '',                              'Konuşma yöntem ve tekniklerine yönelik seçimlerini yönetebilme',                                                                                                                                'Türkçe',             'ortaokul', 'zorunlu'),
  ('T.K.6.2',   (SELECT id FROM branslar WHERE slug = 'turkce'),          6, 1, '',                              'Konuşma yöntem ve tekniklerine yönelik seçimlerini yönetebilme',                                                                                                                                'Türkçe',             'ortaokul', 'zorunlu'),
  ('T.K.7.2',   (SELECT id FROM branslar WHERE slug = 'turkce'),          7, 1, '',                              'Konuşma yöntem ve tekniklerine yönelik seçimlerini yönetebilme',                                                                                                                                'Türkçe',             'ortaokul', 'zorunlu'),
  ('T.K.8.2',   (SELECT id FROM branslar WHERE slug = 'turkce'),          8, 1, '',                              'Konuşma yöntem ve tekniklerine yönelik seçimlerini yönetebilme',                                                                                                                                'Türkçe',             'ortaokul', 'zorunlu'),
  ('T.Y.5.2',   (SELECT id FROM branslar WHERE slug = 'turkce'),          5, 1, '',                              'Yazma strateji, yöntem ve tekniklerine yönelik seçimlerini yönetebilme',                                                                                                                        'Türkçe',             'ortaokul', 'zorunlu'),
  ('T.Y.8.4',   (SELECT id FROM branslar WHERE slug = 'turkce'),          8, 1, '',                              'Yazılı üretim ve yazılı etkileşiminde ön bilgilerinden yararlanabilme',                                                                                                                          'Türkçe',             'ortaokul', 'zorunlu'),
  ('TT.7.5.1',  (SELECT id FROM branslar WHERE slug = 'teknoloji_tasarim'), 7, 1, '',                            'Mekânsal analoji yapabilme',                                                                                                                                                                    'Teknoloji ve Tasarım','ortaokul', 'zorunlu'),
  ('TT.8.3.2',  (SELECT id FROM branslar WHERE slug = 'teknoloji_tasarim'), 8, 1, '',                            'Yayın grafiği tasarım ürünlerini çözümleyebilme',                                                                                                                                               'Teknoloji ve Tasarım','ortaokul', 'zorunlu'),
  ('TT.8.3.3',  (SELECT id FROM branslar WHERE slug = 'teknoloji_tasarim'), 8, 1, '',                            'Yayın grafiği tasarım ürünü oluşturabilme',                                                                                                                                                     'Teknoloji ve Tasarım','ortaokul', 'zorunlu')
ON CONFLICT (kod) DO NOTHING;

-- 3. Migration 032 kaydı — tarih (lise)
INSERT INTO kazanimlar (kod, brans_id, sinif, unite_no, unite_ad, ad, ders, okul_tipi, ders_turu)
VALUES
  ('TAR.9.1.2', (SELECT id FROM branslar WHERE slug = 'tarih'), 9, 1, '', 'Tarihin doğasını farklı kaynaklar üzerinden inceleyebilme', 'Tarih', 'lise', 'zorunlu')
ON CONFLICT (kod) DO NOTHING;

-- 4. Migration 035 kayıtları — IHL meslek dersleri
-- ARP sinif 9-10: migration 036 sonrası ders='Arapça' (sinif 11-12 'Mesleki Arapça' kalır)
INSERT INTO kazanimlar (kod, brans_id, sinif, unite_no, unite_ad, ad, aciklama, ders, okul_tipi, ders_turu)
SELECT v.kod, b.id, v.sinif::integer, v.unite_no::integer, v.unite_ad, v.ad,
       v.aciklama, v.ders, v.okul_tipi, v.ders_turu
FROM (VALUES
  -- Akaid
  ('AKD.11.1.1', 'ihl_meslek_dersleri', 11, 1, 'Ünite 1', 'Akaid ilmini anlayabilme',                                                                                   '', 'Akaid',    'ihl', 'zorunlu'),
  ('AKD.11.3.1', 'ihl_meslek_dersleri', 11, 3, 'Ünite 3', 'Peygamberlere imanla ilgili akli ve naklî delilleri kullanabilme',                                             '', 'Akaid',    'ihl', 'zorunlu'),
  -- Dinler Tarihi
  ('DT.12.1.1',  'ihl_meslek_dersleri', 12, 1, 'Ünite 1', 'Dinler tarihiyle ilgili konuları müşahede edebilme',                                                           '', 'Dinler Tarihi', 'ihl', 'zorunlu'),
  ('DT.12.2.1',  'ihl_meslek_dersleri', 12, 2, 'Ünite 2', 'İslam''ın tarihî sürecini sorgulayabilme',                                                                      '', 'Dinler Tarihi', 'ihl', 'zorunlu'),
  ('DT.12.2.3',  'ihl_meslek_dersleri', 12, 2, 'Ünite 2', 'İslam''ın diğer dinlere bakışını müşahede edebilme',                                                             '', 'Dinler Tarihi', 'ihl', 'zorunlu'),
  ('DT.12.3.1',  'ihl_meslek_dersleri', 12, 3, 'Ünite 3', 'Yahudilik ve Hristiyanlığın tarihî sürecini ve temel özelliklerini özetleyebilme',                              '', 'Dinler Tarihi', 'ihl', 'zorunlu'),
  ('DT.12.3.2',  'ihl_meslek_dersleri', 12, 3, 'Ünite 3', 'Hinduizm, Budizm ve Konfüçyanizm dinlerini anlayabilme',                                                       '', 'Dinler Tarihi', 'ihl', 'zorunlu'),
  ('DT.12.4.1',  'ihl_meslek_dersleri', 12, 4, 'Ünite 4', 'Misyonerlik faaliyetlerini anlayabilme',                                                                       '', 'Dinler Tarihi', 'ihl', 'zorunlu'),
  ('DT.12.4.2',  'ihl_meslek_dersleri', 12, 4, 'Ünite 4', 'Bahailik ve Yezidiliğin tarihî süreci ve temel özelliklerini sorgulayabilme',                                  '', 'Dinler Tarihi', 'ihl', 'zorunlu'),
  -- Fıkıh
  ('FKH.10.4.1', 'ihl_meslek_dersleri', 10, 4, 'Ünite 4', 'Aile hayatı ile ilgili konuları müşahede edebilme',                                                            '', 'Fıkıh',    'ihl', 'zorunlu'),
  -- Hadis
  ('HDS.10.2.4', 'ihl_meslek_dersleri', 10, 2, 'Ünite 2', 'İmanla ilgili hadis rivayetlerinde hadis kaynaklarına başvurabilme',                                            '', 'Hadis',    'ihl', 'zorunlu'),
  ('HDS.10.4.3', 'ihl_meslek_dersleri', 10, 4, 'Ünite 4', 'İlimle ilgili hadis rivayetlerinde hadis kaynaklarına başvurabilme',                                            '', 'Hadis',    'ihl', 'zorunlu'),
  -- Hitabet ve Mesleki Uygulama
  ('HMU.11.2.3', 'ihl_meslek_dersleri', 11, 2, 'Ünite 2', '4–6 yaş grubuna yönelik din eğitimini usulüne uygun olarak yerine getirebilme',                                '', 'Hitabet ve Mesleki Uygulama', 'ihl', 'zorunlu'),
  -- Kur'an-ı Kerim (IHL)
  ('KKIHL.9.4.3',  'ihl_meslek_dersleri',  9, 4, 'Ünite 4', 'Fatiha ve Fil ila Nâs surelerini; Bakara suresinin 1-5, 255, 285-286 ve Haşr suresinin 21-24. ayetlerini anlamada Kur''an-ı Kerim meallerine başvurabilme', '', 'Kur''an-ı Kerim', 'ihl', 'zorunlu'),
  ('KKIHL.11.4.1', 'ihl_meslek_dersleri', 11, 4, 'Ünite 4', 'Bakara suresinin 153-157. ayetlerini ve Yasin suresini anlamada Kur''an-ı Kerim meallerine başvurabilme',    '', 'Kur''an-ı Kerim', 'ihl', 'zorunlu'),
  ('KKIHL.12.4.1', 'ihl_meslek_dersleri', 12, 4, 'Ünite 4', 'Al-i İmran suresinin 189-194. ayetleri ile Fetih suresinin 27-29. ayetlerini anlamada Kur''an-ı Kerim meallerine başvurabilme', '', 'Kur''an-ı Kerim', 'ihl', 'zorunlu'),
  -- Temel Dini Bilgiler
  ('TDB.9.3.2',  'ihl_meslek_dersleri',  9, 3, 'Ünite 3', 'İbadet ve temizlik ilişkisi ile ilgili meseleleri anlayabilme',                                                 '', 'Temel Dini Bilgiler', 'ihl', 'zorunlu'),
  -- Tefsir
  ('TFS.11.1.2', 'ihl_meslek_dersleri', 11, 1, 'Ünite 1', 'Kur''an ilimlerinin birbiriyle ilişkisini değerlendirebilme',                                                   '', 'Tefsir',   'ihl', 'zorunlu'),
  ('TFS.11.1.3', 'ihl_meslek_dersleri', 11, 1, 'Ünite 1', 'Tefsir ilminin doğuş ve gelişim süreçlerini anlayabilme',                                                      '', 'Tefsir',   'ihl', 'zorunlu'),
  -- Arapça 9-10 (migration 036: sinif 9-10 → ders='Arapça')
  ('ARP.9.1.2',  'ihl_meslek_dersleri',  9, 1, 'Ünite 1', 'Selamlaşma ve tanışmayla ilgili okumaya hazırlık yapabilme',                                                    '', 'Arapça', 'ihl', 'zorunlu'),
  ('ARP.9.1.4',  'ihl_meslek_dersleri',  9, 1, 'Ünite 1', 'Selamlaşma ve tanışmayla ilgili dinlediği/izlediği içerikteki hedef sözcükleri tanıyabilme',                   '', 'Arapça', 'ihl', 'zorunlu'),
  ('ARP.9.1.7',  'ihl_meslek_dersleri',  9, 1, 'Ünite 1', 'Hedef harfleri ve kelimeleri yazmaya hazırlık yapabilme',                                                       '', 'Arapça', 'ihl', 'zorunlu'),
  ('ARP.9.2.1',  'ihl_meslek_dersleri',  9, 2, 'Ünite 2', 'Okul ve sınıfla ilgili dinlemeye/izlemeye hazırlık yapabilme',                                                  '', 'Arapça', 'ihl', 'zorunlu'),
  ('ARP.9.2.2',  'ihl_meslek_dersleri',  9, 2, 'Ünite 2', 'Okul ve sınıfla ilgili okumaya hazırlık yapabilme',                                                             '', 'Arapça', 'ihl', 'zorunlu'),
  ('ARP.9.2.4',  'ihl_meslek_dersleri',  9, 2, 'Ünite 2', 'Okul ve sınıfla ilgili dinlediği/izlediği içerikteki hedef sözcükleri kullanabilme',                            '', 'Arapça', 'ihl', 'zorunlu'),
  ('ARP.9.3.2',  'ihl_meslek_dersleri',  9, 3, 'Ünite 3', 'Aile ve evle ilgili okumaya hazırlık yapabilme',                                                                '', 'Arapça', 'ihl', 'zorunlu'),
  ('ARP.9.3.4',  'ihl_meslek_dersleri',  9, 3, 'Ünite 3', 'Aile ve evle ilgili dinlediği/izlediği içerikteki hedef sözcükleri kullanabilme',                               '', 'Arapça', 'ihl', 'zorunlu'),
  ('ARP.9.4.2',  'ihl_meslek_dersleri',  9, 4, 'Ünite 4', 'Günlük hayatla ilgili okumaya hazırlık yapabilme',                                                              '', 'Arapça', 'ihl', 'zorunlu'),
  ('ARP.9.4.4',  'ihl_meslek_dersleri',  9, 4, 'Ünite 4', 'Günlük hayatla ilgili dinlediği/izlediği içerikteki hedef sözcükleri kullanabilme',                             '', 'Arapça', 'ihl', 'zorunlu'),
  ('ARP.10.1.2', 'ihl_meslek_dersleri', 10, 1, 'Ünite 1', 'Akrabalar ve güzel davranışlarla ilgili okumaya hazırlık yapabilme',                                             '', 'Arapça', 'ihl', 'zorunlu'),
  ('ARP.10.1.4', 'ihl_meslek_dersleri', 10, 1, 'Ünite 1', 'Akrabalar ve güzel davranışlarla ilgili dinlediği/izlediği içerikteki hedef sözcükleri tanıyabilme',            '', 'Arapça', 'ihl', 'zorunlu'),
  ('ARP.10.2.2', 'ihl_meslek_dersleri', 10, 2, 'Ünite 2', 'Sağlık ve hobilerle ilgili okumaya hazırlık yapabilme',                                                         '', 'Arapça', 'ihl', 'zorunlu'),
  ('ARP.10.2.4', 'ihl_meslek_dersleri', 10, 2, 'Ünite 2', 'Sağlık ve hobilerle ilgili dinlediği/izlediği içerikteki hedef sözcükleri kullanabilme',                        '', 'Arapça', 'ihl', 'zorunlu'),
  ('ARP.10.3.2', 'ihl_meslek_dersleri', 10, 3, 'Ünite 3', 'Seyahat ve ulaşım araçlarıyla ilgili okumaya hazırlık yapabilme',                                               '', 'Arapça', 'ihl', 'zorunlu'),
  ('ARP.10.3.4', 'ihl_meslek_dersleri', 10, 3, 'Ünite 3', 'Seyahat ve ulaşım araçlarıyla ilgili dinlediği/izlediği içerikteki hedef sözcükleri kullanabilme',              '', 'Arapça', 'ihl', 'zorunlu'),
  ('ARP.10.4.2', 'ihl_meslek_dersleri', 10, 4, 'Ünite 4', 'Mevsimler ve alışverişle ilgili okumaya hazırlık yapabilme',                                                    '', 'Arapça', 'ihl', 'zorunlu'),
  ('ARP.10.4.4', 'ihl_meslek_dersleri', 10, 4, 'Ünite 4', 'Mevsimler ve alışverişle ilgili dinlediği/izlediği içerikteki hedef sözcükleri kullanabilme',                   '', 'Arapça', 'ihl', 'zorunlu')
) AS v(kod, brans_slug, sinif, unite_no, unite_ad, ad, aciklama, ders, okul_tipi, ders_turu)
JOIN branslar b ON b.slug = v.brans_slug
ON CONFLICT (kod) DO NOTHING;
