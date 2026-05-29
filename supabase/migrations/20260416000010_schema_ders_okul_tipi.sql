-- Aşama 1: branş → ders → okul_tipi hiyerarşisi
-- branslar tablosuna slug + kademe eklendi
-- kazanimlar tablosuna ders + okul_tipi eklendi
-- 3 eksik branş eklendi: Fransızca, Rehber Öğretmen, Teknoloji ve Tasarım

-- 1. Sütun ekle
ALTER TABLE branslar
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS kademe TEXT[];

ALTER TABLE kazanimlar
  ADD COLUMN IF NOT EXISTS ders TEXT,
  ADD COLUMN IF NOT EXISTS okul_tipi TEXT CHECK (okul_tipi IN ('ilkokul','ortaokul','iho','lise','ihl'));

-- 2. Mevcut branslar: slug + kademe
UPDATE branslar SET slug = 'matematik',             kademe = ARRAY['ortaokul','iho','lise','ihl']           WHERE ad = 'Matematik';
UPDATE branslar SET slug = 'turk_dili_edebiyati',   kademe = ARRAY['lise','ihl']                            WHERE ad = 'Türk Dili ve Edebiyatı';
UPDATE branslar SET slug = 'fizik',                 kademe = ARRAY['lise','ihl']                            WHERE ad = 'Fizik';
UPDATE branslar SET slug = 'kimya',                 kademe = ARRAY['lise','ihl']                            WHERE ad = 'Kimya';
UPDATE branslar SET slug = 'biyoloji',              kademe = ARRAY['lise','ihl']                            WHERE ad = 'Biyoloji';
UPDATE branslar SET slug = 'tarih',                 kademe = ARRAY['ortaokul','lise','ihl']                 WHERE ad = 'Tarih';
UPDATE branslar SET slug = 'cografya',              kademe = ARRAY['lise','ihl']                            WHERE ad = 'Coğrafya';
UPDATE branslar SET slug = 'felsefe',               kademe = ARRAY['lise','ihl']                            WHERE ad = 'Felsefe';
UPDATE branslar SET slug = 'ingilizce',             kademe = ARRAY['ilkokul','ortaokul','iho','lise','ihl'] WHERE ad = 'İngilizce';
UPDATE branslar SET slug = 'almanca',               kademe = ARRAY['ortaokul','lise','ihl']                 WHERE ad = 'Almanca';
UPDATE branslar SET slug = 'arapca',                kademe = ARRAY['iho','ihl']                             WHERE ad = 'Arapça';
UPDATE branslar SET slug = 'bilisim_teknolojileri', kademe = ARRAY['ortaokul','iho','lise','ihl']           WHERE ad = 'Bilişim Teknolojileri';
UPDATE branslar SET slug = 'muzik',                 kademe = ARRAY['ilkokul','ortaokul','iho','lise','ihl'] WHERE ad = 'Müzik';
UPDATE branslar SET slug = 'beden_egitimi',         kademe = ARRAY['ilkokul','ortaokul','iho','lise','ihl'] WHERE ad = 'Beden Eğitimi ve Spor';
UPDATE branslar SET slug = 'din_kulturu',           kademe = ARRAY['ilkokul','ortaokul','iho','lise','ihl'] WHERE ad = 'Din Kültürü ve Ahlak Bilgisi';
UPDATE branslar SET slug = 'gorsel_sanatlar',       kademe = ARRAY['ilkokul','ortaokul','iho','lise','ihl'] WHERE ad = 'Görsel Sanatlar';
UPDATE branslar SET slug = 'turkce',                kademe = ARRAY['ortaokul']                              WHERE ad = 'Türkçe';
UPDATE branslar SET slug = 'fen_bilimleri',         kademe = ARRAY['ortaokul','iho']                        WHERE ad = 'Fen Bilimleri';
UPDATE branslar SET slug = 'sosyal_bilgiler',       kademe = ARRAY['ortaokul','iho']                        WHERE ad = 'Sosyal Bilgiler';
UPDATE branslar SET slug = 'hayat_bilgisi',         kademe = ARRAY['ilkokul']                               WHERE ad = 'Hayat Bilgisi';
UPDATE branslar SET slug = 'sinif_ogretmeni',       kademe = ARRAY['ilkokul']                               WHERE ad = 'Sınıf Öğretmenliği';

-- 3. Eksik branşlar ekle (slug dahil)
INSERT INTO branslar (ad, ikon, renk, sira, slug, kademe) VALUES
  ('Fransızca',            '🇫🇷', '#FFF7ED', 22, 'fransizca',        ARRAY['lise','ihl']),
  ('Rehber Öğretmen',      '🧭',  '#F0F9FF', 23, 'rehber_ogretmen',  ARRAY['ortaokul','iho','lise','ihl']),
  ('Teknoloji ve Tasarım', '🔧',  '#F5F3FF', 24, 'teknoloji_tasarim',ARRAY['ortaokul','iho'])
ON CONFLICT (ad) DO NOTHING;

-- 4. UNIQUE constraint ekle (tüm UPDATElar tamamlandıktan sonra)
ALTER TABLE branslar ADD CONSTRAINT branslar_slug_unique UNIQUE (slug);

-- 5. kazanimlar.okul_tipi: sinif bazlı varsayılan
UPDATE kazanimlar SET okul_tipi =
  CASE
    WHEN sinif BETWEEN 1 AND 4 THEN 'ilkokul'
    WHEN sinif BETWEEN 5 AND 8 THEN 'ortaokul'
    WHEN sinif BETWEEN 9 AND 12 THEN 'lise'
  END;

-- Arapça override: yalnızca İmam Hatip'te görev yapar
UPDATE kazanimlar k SET okul_tipi =
  CASE WHEN k.sinif BETWEEN 5 AND 8 THEN 'iho' ELSE 'ihl' END
FROM branslar b
WHERE k.brans_id = b.id AND b.slug = 'arapca';

-- 6. kazanimlar.ders: her branşın birincil zorunlu dersi

UPDATE kazanimlar k SET ders = 'Matematik'
FROM branslar b WHERE k.brans_id = b.id AND b.slug = 'matematik';

UPDATE kazanimlar k SET ders = 'Türk Dili ve Edebiyatı'
FROM branslar b WHERE k.brans_id = b.id AND b.slug = 'turk_dili_edebiyati';

UPDATE kazanimlar k SET ders = 'Türkçe'
FROM branslar b WHERE k.brans_id = b.id AND b.slug = 'turkce';

UPDATE kazanimlar k SET ders = 'Fizik'
FROM branslar b WHERE k.brans_id = b.id AND b.slug = 'fizik';

UPDATE kazanimlar k SET ders = 'Kimya'
FROM branslar b WHERE k.brans_id = b.id AND b.slug = 'kimya';

UPDATE kazanimlar k SET ders = 'Biyoloji'
FROM branslar b WHERE k.brans_id = b.id AND b.slug = 'biyoloji';

-- Tarih: sınıfa göre farklı ders adı
UPDATE kazanimlar k SET ders =
  CASE
    WHEN k.sinif = 8                  THEN 'T.C. İnkılap Tarihi'
    WHEN k.sinif BETWEEN 9 AND 11     THEN 'Tarih'
    WHEN k.sinif = 12                 THEN 'T.C. İnkılap Tarihi ve Atatürkçülük'
  END
FROM branslar b WHERE k.brans_id = b.id AND b.slug = 'tarih';

UPDATE kazanimlar k SET ders = 'Coğrafya'
FROM branslar b WHERE k.brans_id = b.id AND b.slug = 'cografya';

UPDATE kazanimlar k SET ders = 'Felsefe'
FROM branslar b WHERE k.brans_id = b.id AND b.slug = 'felsefe';

UPDATE kazanimlar k SET ders = 'İngilizce'
FROM branslar b WHERE k.brans_id = b.id AND b.slug = 'ingilizce';

UPDATE kazanimlar k SET ders = 'Almanca'
FROM branslar b WHERE k.brans_id = b.id AND b.slug = 'almanca';

UPDATE kazanimlar k SET ders = 'Arapça'
FROM branslar b WHERE k.brans_id = b.id AND b.slug = 'arapca';

UPDATE kazanimlar k SET ders = 'Din Kültürü ve Ahlak Bilgisi'
FROM branslar b WHERE k.brans_id = b.id AND b.slug = 'din_kulturu';

UPDATE kazanimlar k SET ders = 'Görsel Sanatlar'
FROM branslar b WHERE k.brans_id = b.id AND b.slug = 'gorsel_sanatlar';

UPDATE kazanimlar k SET ders = 'Müzik'
FROM branslar b WHERE k.brans_id = b.id AND b.slug = 'muzik';

-- Beden Eğitimi: ilkokulda "Beden Eğitimi ve Oyun", üstte "Beden Eğitimi ve Spor"
UPDATE kazanimlar k SET ders =
  CASE WHEN k.sinif BETWEEN 1 AND 4 THEN 'Beden Eğitimi ve Oyun' ELSE 'Beden Eğitimi ve Spor' END
FROM branslar b WHERE k.brans_id = b.id AND b.slug = 'beden_egitimi';

UPDATE kazanimlar k SET ders = 'Fen Bilimleri'
FROM branslar b WHERE k.brans_id = b.id AND b.slug = 'fen_bilimleri';

UPDATE kazanimlar k SET ders = 'Sosyal Bilgiler'
FROM branslar b WHERE k.brans_id = b.id AND b.slug = 'sosyal_bilgiler';

UPDATE kazanimlar k SET ders = 'Hayat Bilgisi'
FROM branslar b WHERE k.brans_id = b.id AND b.slug = 'hayat_bilgisi';

UPDATE kazanimlar k SET ders = 'Bilişim Teknolojileri ve Yazılım'
FROM branslar b WHERE k.brans_id = b.id AND b.slug = 'bilisim_teknolojileri';

-- Sınıf Öğretmenliği: birden fazla ders var (Türkçe, Matematik, Hayat Bilgisi...)
-- Aşama 3'te ders seçim ekranı geldiğinde planUret filtresi bunu yönetecek
-- NULL bırakılıyor
