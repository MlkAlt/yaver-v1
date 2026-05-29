-- Migration 018: Migration 008'deki ünite numarası hatası düzeltme
--
-- Sorun: Migration 008 seed'inde birçok branş için sinif numarası hatalı olarak
-- unite_no olarak kullanılmış. Örneğin 5. sınıf Türkçe'nin tüm kazanımları
-- unite_no=5 "Ünite 5" ile girilmiş. Bu durum yıllık planda ünitelerin yanlış
-- dağılmasına neden oluyordu (örn. Türkçe ünite 5'ten başlıyor görünümü).
--
-- Türkçe (T.D., T.K., T.O., T.Y., DYS. önekli satırlar): Tamamı yanlış —
--   migration 004'te grades 3-8 için doğru veriler (TK.x, T.5.x... formatı) mevcut.
--
-- İngilizce, Matematik ve diğerleri: unite_no=sinif koşuluyla hedefleme
--   (ENG.9.x gibi lise satırlarına dokunulmaz).

-- ── Türkçe: Tüm migration 008 satırları yanlış, güvenle silinebilir ─────────
DELETE FROM kazanimlar
WHERE kod LIKE 'T.D.%'
   OR kod LIKE 'T.K.%'
   OR kod LIKE 'T.O.%'
   OR kod LIKE 'T.Y.%'
   OR kod LIKE 'DYS.%';

-- ── Diğer branşlar: Sadece unite_no = sinif olan yanlış satırlar ─────────────
DELETE FROM kazanimlar
WHERE unite_no = sinif
  AND sinif BETWEEN 1 AND 8
  AND (
       kod LIKE 'ENG.%'   -- İngilizce (lise ENG.9+ bu koşula girmez)
    OR kod LIKE 'MAT.%'   -- Matematik
    OR kod LIKE 'ARP.%'   -- Arapça
    OR kod LIKE 'BTY.%'   -- Bilişim Teknolojileri
    OR kod LIKE 'MÜZ.%'   -- Müzik
    OR kod LIKE 'BEO.%'   -- Beden Eğitimi
    OR kod LIKE 'BES.%'   -- Beden Eğitimi Sağlık
    OR kod LIKE 'DKAB%'   -- Din Kültürü ve Ahlak Bilgisi
  );
