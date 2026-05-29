-- Fix: egitim_takvimi 2025-2026 yılı düzeltmeleri
-- 1. Kurban Bayramı doğru haftaya taşındı (26-30 Mayıs 2026 → hafta 37)
-- 2. Hafta 39 (Jun 8-12) hatalı tatil işareti temizlendi
-- 3. Eksik son hafta eklendi (Jun 22-26, yıl sonu 26 Haziran 2026)
-- 4. CHECK kısıtı 40 → 52 olarak genişletildi (gelecek yıllar için de yeterli)

ALTER TABLE egitim_takvimi
  DROP CONSTRAINT IF EXISTS egitim_takvimi_hafta_no_check;

ALTER TABLE egitim_takvimi
  ADD CONSTRAINT egitim_takvimi_hafta_no_check CHECK (hafta_no BETWEEN 1 AND 52);

ALTER TABLE plan_haftalari
  DROP CONSTRAINT IF EXISTS plan_haftalari_hafta_no_check;

ALTER TABLE plan_haftalari
  ADD CONSTRAINT plan_haftalari_hafta_no_check CHECK (hafta_no BETWEEN 1 AND 52);

UPDATE egitim_takvimi
SET tatil_mi = true, tatil_adi = 'Kurban Bayramı'
WHERE yil = 2025 AND hafta_no = 37;

UPDATE egitim_takvimi
SET tatil_mi = false, tatil_adi = NULL
WHERE yil = 2025 AND hafta_no = 39;

INSERT INTO egitim_takvimi (yil, hafta_no, baslangic, bitis, tatil_mi, tatil_adi)
VALUES (2025, 41, '2026-06-22', '2026-06-26', false, NULL)
ON CONFLICT (yil, hafta_no) DO NOTHING;
