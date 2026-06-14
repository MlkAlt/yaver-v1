-- Migration 067: v2 kazanimlar schema reset
-- Eski kazanimlar tablosunu tamamen yeniden yaz.
-- v2 JSON schema'sına (81 dosya, 9077 kazanım) uygun yeni tablo.

-- =============================================
-- 1. BAĞIMLI TABLOLARI GÜNCELLE
-- =============================================

-- uretimler: kazanim_kodu TEXT -> kazanim_id BIGINT (FK sonra eklenecek)
ALTER TABLE uretimler DROP CONSTRAINT IF EXISTS uretimler_kazanim_kodu_fkey;
ALTER TABLE uretimler ADD COLUMN IF NOT EXISTS kazanim_id BIGINT;
ALTER TABLE uretimler DROP COLUMN IF EXISTS kazanim_kodu;

-- uretim_cache: kazanim_kodu TEXT -> kazanim_id BIGINT
ALTER TABLE uretim_cache DROP CONSTRAINT IF EXISTS uretim_cache_kazanim_kodu_fkey;
ALTER TABLE uretim_cache ADD COLUMN IF NOT EXISTS kazanim_id BIGINT;
ALTER TABLE uretim_cache DROP COLUMN IF EXISTS kazanim_kodu;

-- plan_haftalari: kazanim_kodlari TEXT[] -> kazanim_ids BIGINT[]
ALTER TABLE plan_haftalari DROP COLUMN IF EXISTS kazanim_kodlari;
ALTER TABLE plan_haftalari ADD COLUMN IF NOT EXISTS kazanim_ids BIGINT[] NOT NULL DEFAULT '{}';

-- =============================================
-- 2. KAZANIMLAR TABLOSUNU YENIDEN YAZ
-- =============================================

DROP TABLE IF EXISTS kazanimlar CASCADE;

CREATE TABLE kazanimlar (
  id                      BIGSERIAL PRIMARY KEY,
  kod                     TEXT NOT NULL,
  ad                      TEXT NOT NULL,
  sinif                   INTEGER NOT NULL CHECK (sinif >= 0),
  sinif_tipi              TEXT NOT NULL CHECK (sinif_tipi IN ('normal','hazirlik','secmeli','okul_oncesi')),
  unite                   TEXT NOT NULL,
  aciklama                TEXT,
  brans                   TEXT NOT NULL,
  ders                    TEXT NOT NULL,
  okul_tipi               TEXT NOT NULL CHECK (okul_tipi IN ('ilkokul','ortaokul','lise','iho','ihl','okul_oncesi')),
  program                 TEXT,
  yas_bandi               TEXT,
  branslar                TEXT[],
  secmeli                 BOOLEAN NOT NULL DEFAULT FALSE,
  iki_saat_kapsaminda     BOOLEAN NOT NULL DEFAULT FALSE,
  sinif_ogretmeni_gorunur BOOLEAN NOT NULL DEFAULT FALSE,
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT kazanimlar_6key UNIQUE NULLS NOT DISTINCT (kod, sinif, unite, okul_tipi, program, yas_bandi)
);

-- Uygulama sorgularına göre indeksler
CREATE INDEX idx_kaz_brans           ON kazanimlar(brans);
CREATE INDEX idx_kaz_okul_tipi       ON kazanimlar(okul_tipi);
CREATE INDEX idx_kaz_sinif           ON kazanimlar(sinif);
CREATE INDEX idx_kaz_brans_okul      ON kazanimlar(brans, okul_tipi);
CREATE INDEX idx_kaz_brans_sinif     ON kazanimlar(brans, sinif);
CREATE INDEX idx_kaz_ders            ON kazanimlar(ders);
CREATE INDEX idx_kaz_sinif_tipi      ON kazanimlar(sinif_tipi);
CREATE INDEX idx_kaz_branslar        ON kazanimlar USING gin(branslar);
CREATE INDEX idx_kaz_kod             ON kazanimlar(kod);

-- RLS
ALTER TABLE kazanimlar ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "kazanimlar_read" ON kazanimlar;
CREATE POLICY "kazanimlar_read" ON kazanimlar FOR SELECT USING (true);

-- =============================================
-- 3. BRANSLAR — SLUG EKLE
-- =============================================

ALTER TABLE branslar ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

UPDATE branslar SET slug = 'matematik'              WHERE ad = 'Matematik';
UPDATE branslar SET slug = 'turk_dili_ve_edebiyati' WHERE ad = 'Türk Dili ve Edebiyatı';
UPDATE branslar SET slug = 'fizik'                  WHERE ad = 'Fizik';
UPDATE branslar SET slug = 'kimya'                  WHERE ad = 'Kimya';
UPDATE branslar SET slug = 'biyoloji'               WHERE ad = 'Biyoloji';
UPDATE branslar SET slug = 'tarih'                  WHERE ad = 'Tarih';
UPDATE branslar SET slug = 'cografya'               WHERE ad = 'Coğrafya';
UPDATE branslar SET slug = 'felsefe'                WHERE ad = 'Felsefe';
UPDATE branslar SET slug = 'ingilizce'              WHERE ad = 'İngilizce';
UPDATE branslar SET slug = 'almanca'                WHERE ad = 'Almanca';
UPDATE branslar SET slug = 'arapca'                 WHERE ad = 'Arapça';
UPDATE branslar SET slug = 'bilisim_teknolojileri'  WHERE ad = 'Bilişim Teknolojileri';
UPDATE branslar SET slug = 'muzik'                  WHERE ad = 'Müzik';
UPDATE branslar SET slug = 'beden_egitimi'          WHERE ad = 'Beden Eğitimi ve Spor';
UPDATE branslar SET slug = 'dkab'                   WHERE ad = 'Din Kültürü ve Ahlak Bilgisi';
UPDATE branslar SET slug = 'gorsel_sanatlar'        WHERE ad = 'Görsel Sanatlar';
UPDATE branslar SET slug = 'turkce'                 WHERE ad = 'Türkçe';
UPDATE branslar SET slug = 'fen_bilimleri'          WHERE ad = 'Fen Bilimleri';
UPDATE branslar SET slug = 'sosyal_bilgiler'        WHERE ad = 'Sosyal Bilgiler';
UPDATE branslar SET slug = 'sinif_ogretmeni'        WHERE ad = 'Sınıf Öğretmenliği';

-- v2'de olan ama branslar'da eksik olanlar
INSERT INTO branslar (ad, slug, sira) VALUES
  ('Teknoloji ve Tasarım',  'teknoloji_tasarim',   22),
  ('İHL Meslek Dersleri',   'ihl_meslek_dersleri', 23),
  ('Okul Öncesi',           'okul_oncesi',         24)
ON CONFLICT (ad) DO NOTHING;

-- =============================================
-- 4. FK'LARI YENİDEN BAĞ
-- =============================================

ALTER TABLE uretimler    ADD CONSTRAINT uretimler_kazanim_id_fkey    FOREIGN KEY (kazanim_id) REFERENCES kazanimlar(id) ON DELETE SET NULL;
ALTER TABLE uretim_cache ADD CONSTRAINT uretim_cache_kazanim_id_fkey FOREIGN KEY (kazanim_id) REFERENCES kazanimlar(id) ON DELETE CASCADE;
