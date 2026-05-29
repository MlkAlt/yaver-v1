-- Migration 022: İHL Meslek Dersleri → Din Kültürü'nün hemen ardına taşı (sira 9)
-- Tarih (9) – Fransızca (22) arası her satır bir aşağı kayar.

UPDATE branslar SET sira = sira + 1 WHERE sira BETWEEN 9 AND 22;
UPDATE branslar SET sira = 9 WHERE ad = 'İHL Meslek Dersleri';
