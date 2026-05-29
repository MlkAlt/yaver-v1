-- Yaver V1 — Rollback: 20260416000001_initial_schema.sql
-- UYARI: Bu dosya sadece acil durumlarda çalıştırılır.
-- Çalıştırmadan önce Supabase snapshot al (K7 kuralı).

DROP TRIGGER IF EXISTS yillik_planlar_updated_at ON yillik_planlar;
DROP TRIGGER IF EXISTS kullanicilar_updated_at ON kullanicilar;
DROP FUNCTION IF EXISTS update_updated_at();

DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS uretim_cache;
DROP TABLE IF EXISTS bildirimler;
DROP TABLE IF EXISTS evrak_uretimleri;
DROP TABLE IF EXISTS uretimler;
DROP TABLE IF EXISTS plan_haftalari;
DROP TABLE IF EXISTS yillik_planlar;
DROP TABLE IF EXISTS kullanicilar;
DROP TABLE IF EXISTS evrak_sablonlari;
DROP TABLE IF EXISTS egitim_takvimi;
DROP TABLE IF EXISTS kazanimlar;
DROP TABLE IF EXISTS branslar;
