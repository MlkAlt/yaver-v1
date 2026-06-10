-- Migration 053: KK ihl/lise okul_tipi swap + ihl hazırlık kodları
--
-- Sorun: Seed sırasında KK kodu yapıları karışmış:
--   - KK.x.x kodları (kk912.pdf = lise programı) → hatalı olarak okul_tipi='ihl' işaretlenmiş
--   - KKLISE.x.x kodları (kuranıkerimdöp.pdf = ihl programı) → hatalı olarak okul_tipi='lise' işaretlenmiş
--
-- Fix: okul_tipi değerlerini çapraz swap et
-- Kaynak doğrulama: kk912.pdf = Ortaöğretim KK (lise), kuranıkerimdöp.pdf = Anadolu İHL KK
--
-- Sonuç:
--   KK lise:  9:11, 10:10, 11:12, 12:10  (hedef: 11/10/12/10 ✓)
--   KK ihl:   9:14, 10:14, 11:6, 12:6    (hedef: 14/14/6/6  ✓ — sinif 9 PDF'de 14 onaylandı)
--   KK ihl hazırlık: +11 yeni kayıt      (hedef: 11 ✓)

-- 0) sinif CHECK kısıtını genişlet: hazırlık sınıfı için sinif=0'a izin ver
ALTER TABLE kazanimlar DROP CONSTRAINT IF EXISTS kazanimlar_sinif_check;
ALTER TABLE kazanimlar ADD CONSTRAINT kazanimlar_sinif_check CHECK (sinif BETWEEN 0 AND 12);

-- 1) KK.x kodları (lise programından) → okul_tipi='lise' yap
UPDATE kazanimlar
  SET okul_tipi = 'lise'
  WHERE kod LIKE 'KK.%'
    AND sinif IN (9, 10, 11, 12)
    AND okul_tipi = 'ihl';

-- 2) KKLISE.x kodları (ihl programından) → okul_tipi='ihl' yap
UPDATE kazanimlar
  SET okul_tipi = 'ihl'
  WHERE kod LIKE 'KKLISE.%'
    AND okul_tipi = 'lise';

-- 3) KK ihl hazırlık (sinif=0) — 11 yeni kayıt
INSERT INTO kazanimlar (kod, brans_id, sinif, unite_no, unite_ad, ad, ders, okul_tipi) VALUES
('KK.H.1.1', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 0, 1, 'OKUMA İLE TANIŞIYORUM', 'Kur''an-ı Kerim''i okumayı öğrenme ve güzel okumanın önemini müşahede edebilme', 'Kur''an-ı Kerim', 'ihl'),
('KK.H.1.2', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 0, 1, 'OKUMA İLE TANIŞIYORUM', 'Kur''an-ı Kerim''in iç düzeni ile ilgili kavramları ayırt edebilme', 'Kur''an-ı Kerim', 'ihl'),
('KK.H.2.1', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 0, 2, 'TECVİT', 'Harfleri telaffuz edebilme', 'Kur''an-ı Kerim', 'ihl'),
('KK.H.2.2', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 0, 2, 'TECVİT', 'Harfleri okunuşları ile telaffuz edebilme', 'Kur''an-ı Kerim', 'ihl'),
('KK.H.2.3', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 0, 2, 'TECVİT', 'Okunuşu özel olan harf ve işaretleri telaffuz edebilme', 'Kur''an-ı Kerim', 'ihl'),
('KK.H.2.4', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 0, 2, 'TECVİT', 'Med (uzatma) çeşitlerini telaffuz edebilme', 'Kur''an-ı Kerim', 'ihl'),
('KK.H.3.1', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 0, 3, 'YÜZÜNDEN OKUMA', 'Fatiha suresini ve Bakara suresinin 1-169. ayetlerini yüzünden okuyabilme', 'Kur''an-ı Kerim', 'ihl'),
('KK.H.4.1', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 0, 4, 'EZBERİMDEKİLER', 'Namaz dualarının anlamlarını yorumlayabilme', 'Kur''an-ı Kerim', 'ihl'),
('KK.H.4.2', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 0, 4, 'EZBERİMDEKİLER', 'Namaz dualarını ezbere okuyabilme', 'Kur''an-ı Kerim', 'ihl'),
('KK.H.4.3', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 0, 4, 'EZBERİMDEKİLER', 'Fatiha ve Fil ila Nâs surelerini anlamada Kur''an-ı Kerim meallerine başvurabilme', 'Kur''an-ı Kerim', 'ihl'),
('KK.H.4.4', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 0, 4, 'EZBERİMDEKİLER', 'Fatiha ve Fil ila Nâs surelerini tilavet edebilme', 'Kur''an-ı Kerim', 'ihl')

ON CONFLICT (kod) DO UPDATE SET
  ad = EXCLUDED.ad,
  sinif = EXCLUDED.sinif,
  okul_tipi = EXCLUDED.okul_tipi;
