-- Migration 072: Okul Öncesi kazanımlarına yaş bandına göre sayısal sinif ata.
-- Önceden tüm okul_oncesi (sinif_tipi='okul_oncesi') satırlarında sinif=0 sabitti,
-- gerçek ayrım yalnızca yas_bandi metin sütunundaydı (36-48 ay / 48-60 ay / 60-72 ay).
-- Onboarding'de "Okul Öncesi" branşı seçilince SinifScreen bu yüzden tek bir
-- "Hazırlık" çipi gösteriyordu — 3 yaş grubu ayrışmıyordu.
-- Bu değişiklik SADECE sinif_tipi='okul_oncesi' satırlarını etkiler, başka hiçbir
-- branşın sinif/sinif_tipi mantığına dokunmaz.

UPDATE kazanimlar SET sinif = 1 WHERE sinif_tipi = 'okul_oncesi' AND yas_bandi = '36-48 ay';
UPDATE kazanimlar SET sinif = 2 WHERE sinif_tipi = 'okul_oncesi' AND yas_bandi = '48-60 ay';
UPDATE kazanimlar SET sinif = 3 WHERE sinif_tipi = 'okul_oncesi' AND yas_bandi = '60-72 ay';
