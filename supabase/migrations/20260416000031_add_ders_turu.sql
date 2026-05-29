-- Migration 031: kazanimlar.ders_turu — zorunlu / secmeli ayrımı
-- Mevcut tüm kayıtlara backfill yapılır.

-- 1. Sütun ekle
ALTER TABLE kazanimlar
  ADD COLUMN IF NOT EXISTS ders_turu TEXT CHECK (ders_turu IN ('zorunlu', 'secmeli'));

-- ============================================================
-- 2. İLKOKUL backfill
-- ============================================================

UPDATE kazanimlar SET ders_turu = 'zorunlu'
WHERE okul_tipi = 'ilkokul'
  AND ders IN (
    'Matematik', 'Türkçe', 'Hayat Bilgisi', 'Fen Bilimleri',
    'Sosyal Bilgiler', 'Müzik', 'Görsel Sanatlar',
    'Beden Eğitimi ve Oyun', 'İngilizce',
    'Din Kültürü ve Ahlak Bilgisi'
  );

UPDATE kazanimlar SET ders_turu = 'secmeli'
WHERE okul_tipi = 'ilkokul'
  AND ders IN (
    'Arapça', 'İnsan Hakları', 'Trafik Güvenliği'
  );

-- ============================================================
-- 3. ORTAOKUL backfill
-- ============================================================

UPDATE kazanimlar SET ders_turu = 'zorunlu'
WHERE okul_tipi = 'ortaokul'
  AND ders IN (
    'Matematik', 'Türkçe', 'Fen Bilimleri', 'Sosyal Bilgiler',
    'T.C. İnkılap Tarihi', 'Din Kültürü ve Ahlak Bilgisi',
    'Müzik', 'Görsel Sanatlar', 'Beden Eğitimi ve Spor',
    'İngilizce', 'Bilişim Teknolojileri ve Yazılım'
  );

UPDATE kazanimlar SET ders_turu = 'secmeli'
WHERE okul_tipi = 'ortaokul'
  AND ders IN (
    'Almanca', 'Arapça',
    'Kur''an-ı Kerim', 'Peygamberimizin Hayatı', 'Temel Dinî Bilgiler',
    'Teknoloji ve Tasarım'
  );

-- ============================================================
-- 4. LİSE backfill (mevcut 1.595 kayıt)
-- ============================================================

UPDATE kazanimlar SET ders_turu = 'zorunlu'
WHERE okul_tipi = 'lise'
  AND ders IN (
    'Matematik', 'Türk Dili ve Edebiyatı',
    'Fizik', 'Kimya', 'Biyoloji',
    'Tarih', 'T.C. İnkılap Tarihi ve Atatürkçülük',
    'Coğrafya', 'Felsefe',
    'Din Kültürü ve Ahlak Bilgisi',
    'İngilizce', 'Beden Eğitimi ve Spor',
    'Müzik', 'Görsel Sanatlar'
  );

-- Lise'de NULL kalan = seçmeli (sonraki migrationlarda yeni dersler eklenecek)
UPDATE kazanimlar SET ders_turu = 'secmeli'
WHERE okul_tipi = 'lise' AND ders_turu IS NULL;

-- ============================================================
-- 5. İHL backfill
-- ============================================================

-- İHL meslek dersleri: IHL'de zorunlu
UPDATE kazanimlar SET ders_turu = 'zorunlu'
WHERE okul_tipi = 'ihl';

-- ============================================================
-- 6. Kalan NULL kontrolü
-- ============================================================
-- NOT: NULL kalan varsa eklenmemiş ders adı demektir. Kontrol için:
-- SELECT DISTINCT ders, okul_tipi FROM kazanimlar WHERE ders_turu IS NULL;
