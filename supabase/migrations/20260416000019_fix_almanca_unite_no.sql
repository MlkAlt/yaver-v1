-- Migration 019: Almanca migration 008 ünite numarası hatası düzeltme
--
-- Sorun: Migration 008'de Almanca grade 5 ve 6 için kazanımlar
-- 'DE.5.5.xxx' ve 'DE.6.6.xxx' kodu ile girilmiş (grade.grade pattern).
-- Doğru Almanca kodları 'DE.5.1.001', 'DE.5.2.001' formatındadır.
-- Bu 19 yanlış satır silinerek grade 5-6 Almanca'nın doğru ünite
-- dağılımı (migration 008'deki 243 iyi satır) korunur.
--
-- Sosyal Bilgiler ve Görsel Sanatlar: unite_no=sinif eşitliği
-- bu branşlarda tesadüfi (gerçek ünite numaraları), dokunulmadı.

DELETE FROM kazanimlar
WHERE kod LIKE 'DE.5.5.%'
   OR kod LIKE 'DE.6.6.%';
