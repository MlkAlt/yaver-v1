-- Migration 026: Hayat Bilgisi branşını ve 1-3. sınıf kazanımlarını geri ekle
-- Mig 015 ile silinmişti. MEB 2025-2026 müfredatına göre 1-3. sınıf zorunlu ders.
--
-- Bu migration `scripts/restore-hayat-bilgisi.cjs` ile uygulandı (supabase-js direkt insert).
-- Aşağıdaki SQL idempotent (ON CONFLICT) — manuel re-apply edilebilir.
-- Kazanım INSERT'leri (51 satır) için script kullanılır; bu dosya sadece branş geri eklemesi.

INSERT INTO branslar (ad, ikon, renk, sira, slug, kademe)
VALUES ('Hayat Bilgisi', '🌱', '#DCFCE7', 24, 'hayat_bilgisi', ARRAY['ilkokul'])
ON CONFLICT (ad) DO UPDATE SET
  slug    = EXCLUDED.slug,
  kademe  = EXCLUDED.kademe;

-- Kazanımları geri yüklemek için:
--   NODE_TLS_REJECT_UNAUTHORIZED=0 node scripts/restore-hayat-bilgisi.cjs
-- 51 kazanım: sinif 1 (18), sinif 2 (19), sinif 3 (14)
-- Kaynak: supabase/seed-data/kazanimlar/HAYAT BİLGİSİ DERSİ.json
