-- Migration 075: Auth altyapısı — eski (hiç kullanılmayan) dinamik tablolar temizlendi,
-- yerine güncel şemayla (brans slug bazlı) `profiles` tablosu eklendi.
--
-- Kontrol edildi (2026-07-09): kullanicilar/yillik_planlar/plan_haftalari/uretimler/
-- evrak_uretimleri/bildirimler/feedback tablolarının hepsi 0 satır ve hiçbir uygulama
-- kodu (src/, supabase/functions/) bunlara referans vermiyor — ilk migration'dan (V1
-- initial_schema) kalma, hiç devreye girmemiş "dinamik tablolar" bloğu. `brans_id UUID`
-- kolonu da artık kullanılmayan eski branş şemasına (v2 reset öncesi) ait.
-- `uretim_cache` bu temizliğin DIŞINDA — hâlâ (kullanılmayan ama silinmemiş)
-- `supabase/functions/generate` edge function'ı tarafından referans ediliyor.

-- ── Eski tabloları FK sırasına göre (çocuktan ebeveyne) temizle ────────────
DROP TABLE IF EXISTS bildirimler;
DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS evrak_uretimleri;
DROP TABLE IF EXISTS uretimler;
DROP TABLE IF EXISTS plan_haftalari;
DROP TABLE IF EXISTS yillik_planlar;
DROP TABLE IF EXISTS kullanicilar;

-- ── Yeni: profiles ───────────────────────────────────────────────────────
-- Yıllık planın kendisi burada SAKLANMAZ — mevcut mimariye uygun olarak plan
-- her zaman planUret() ile (brans/okul_tipi/siniflar'dan) türetilir. profiles
-- yalnızca onboarding'de toplanan "kimlik + kurulum" verisini taşır.
CREATE TABLE profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           TEXT,
  ad              TEXT,
  okul_adi        TEXT,
  brans_slug      TEXT,
  okul_tipi       TEXT,
  secili_dersler  TEXT[] DEFAULT '{}',
  ders_filtesi    TEXT[],
  siniflar        INTEGER[] DEFAULT '{}',
  onboarding_done BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_self" ON profiles
  FOR ALL USING (auth.uid() = id);

-- update_updated_at() fonksiyonu migration 001'de zaten tanımlı, burada tekrar kullanılıyor.
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
