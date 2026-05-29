-- Yaver V1 — kazanimlar tablosuna hafta_no eklendi
-- JSON müfredat dosyalarındaki haftaNo bilgisini saklar
-- uniteler formatındaki (ilkokul) kayıtlar için NULL olabilir

ALTER TABLE kazanimlar ADD COLUMN IF NOT EXISTS hafta_no INTEGER;

CREATE INDEX IF NOT EXISTS idx_kazanimlar_hafta ON kazanimlar(hafta_no);
CREATE INDEX IF NOT EXISTS idx_kazanimlar_brans_sinif_hafta ON kazanimlar(brans_id, sinif, hafta_no);
