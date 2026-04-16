-- Yaver V1 — Initial Schema
-- Spec B3'e göre: statik (seed) + dinamik (kullanıcı) + cache tabloları
-- Migration: 20260416000001_initial_schema.sql
-- Rollback: 20260416000001_rollback.sql

-- =============================================
-- EXTENSIONS
-- =============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- STATİK TABLOLAR (seed datası)
-- =============================================

-- Branşlar (15 branş, V1)
CREATE TABLE branslar (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ad          TEXT NOT NULL UNIQUE,
  ikon        TEXT,                    -- emoji veya icon key
  renk        TEXT,                    -- tailwind renk kodu (pastel)
  sira        INTEGER DEFAULT 0,       -- listede sıralama
  aktif       BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Kazanımlar (MEB müfredatı — seed)
CREATE TABLE kazanimlar (
  kod         TEXT PRIMARY KEY,        -- örn: MAT.9.1.1
  brans_id    UUID NOT NULL REFERENCES branslar(id) ON DELETE RESTRICT,
  sinif       INTEGER NOT NULL CHECK (sinif BETWEEN 1 AND 12),
  unite_no    INTEGER NOT NULL,
  unite_ad    TEXT NOT NULL,
  ad          TEXT NOT NULL,
  aciklama    TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_kazanimlar_brans ON kazanimlar(brans_id);
CREATE INDEX idx_kazanimlar_sinif ON kazanimlar(sinif);
CREATE INDEX idx_kazanimlar_brans_sinif ON kazanimlar(brans_id, sinif);

-- Eğitim takvimi (MEB — 36 hafta, tatiller)
CREATE TABLE egitim_takvimi (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  yil         INTEGER NOT NULL,        -- örn: 2025 (2025-2026 eğitim yılı)
  hafta_no    INTEGER NOT NULL CHECK (hafta_no BETWEEN 1 AND 40),
  baslangic   DATE NOT NULL,
  bitis       DATE NOT NULL,
  tatil_mi    BOOLEAN DEFAULT false,
  tatil_adi   TEXT,                    -- "23 Nisan Ulusal Egemenlik"
  UNIQUE(yil, hafta_no)
);

-- Resmi evrak şablonları
CREATE TABLE evrak_sablonlari (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ad          TEXT NOT NULL,           -- "Zümre Toplantı Tutanağı"
  kategori    TEXT NOT NULL,           -- "toplanti", "sozlesme", "form"
  yapi        TEXT NOT NULL,           -- markdown şablon
  alanlar     JSONB NOT NULL DEFAULT '[]', -- form alanları tanımı
  aktif       BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- DİNAMİK TABLOLAR (kullanıcı verisi)
-- =============================================

-- Kullanıcılar (Supabase Auth ile entegre)
CREATE TABLE kullanicilar (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           TEXT NOT NULL,
  ad              TEXT,
  brans_id        UUID REFERENCES branslar(id),
  siniflar        JSONB DEFAULT '[]',  -- ["9-A", "10-B", "11-A"]
  aktif_yil       INTEGER,             -- 2025 (2025-2026 eğitim yılı)
  surpriz_aktif   BOOLEAN DEFAULT true, -- Mekanizma 2 — default açık (Spec F2)
  onboarding_done BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Yıllık planlar
CREATE TABLE yillik_planlar (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kullanici_id UUID NOT NULL REFERENCES kullanicilar(id) ON DELETE CASCADE,
  yil         INTEGER NOT NULL,
  brans_id    UUID NOT NULL REFERENCES branslar(id),
  siniflar    JSONB NOT NULL DEFAULT '[]',
  durum       TEXT NOT NULL DEFAULT 'aktif' CHECK (durum IN ('aktif', 'arsiv', 'taslak')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(kullanici_id, yil, brans_id)
);

-- Plan haftaları (kazanım-hafta eşleşmesi)
CREATE TABLE plan_haftalari (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id         UUID NOT NULL REFERENCES yillik_planlar(id) ON DELETE CASCADE,
  hafta_no        INTEGER NOT NULL CHECK (hafta_no BETWEEN 1 AND 40),
  kazanim_kodlari TEXT[] NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(plan_id, hafta_no)
);

CREATE INDEX idx_plan_haftalari_plan ON plan_haftalari(plan_id);

-- Üretimler (AI çıktıları — ders içerikleri)
CREATE TABLE uretimler (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kullanici_id    UUID NOT NULL REFERENCES kullanicilar(id) ON DELETE CASCADE,
  kazanim_kodu    TEXT NOT NULL REFERENCES kazanimlar(kod),
  tip             TEXT NOT NULL CHECK (tip IN ('soru', 'etkinlik', 'ders_plani', 'calisma_yapragi')),
  parametreler    JSONB NOT NULL DEFAULT '{}',  -- {soru_sayisi: 10, zorluk: "orta", ...}
  icerik          TEXT NOT NULL,
  hafta_id        UUID REFERENCES plan_haftalari(id),
  origin          TEXT NOT NULL DEFAULT 'manuel' CHECK (origin IN ('manuel', 'surpriz', 'otomatik')),
  begeni          TEXT CHECK (begeni IN ('cok_guzel', 'iyi', 'begenmedim')),
  sessiz_veri     JSONB DEFAULT '{}',  -- {onizlendi: true, indirildi: false, sure_sn: 45}
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_uretimler_kullanici ON uretimler(kullanici_id);
CREATE INDEX idx_uretimler_kazanim ON uretimler(kazanim_kodu);
CREATE INDEX idx_uretimler_created ON uretimler(created_at DESC);

-- Evrak üretimleri (resmi evraklar)
CREATE TABLE evrak_uretimleri (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kullanici_id    UUID NOT NULL REFERENCES kullanicilar(id) ON DELETE CASCADE,
  sablon_id       UUID NOT NULL REFERENCES evrak_sablonlari(id),
  doldurulan      JSONB NOT NULL DEFAULT '{}',  -- doldurulmuş form alanları
  icerik          TEXT NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_evrak_uretimleri_kullanici ON evrak_uretimleri(kullanici_id);

-- Bildirimler
CREATE TABLE bildirimler (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kullanici_id    UUID NOT NULL REFERENCES kullanicilar(id) ON DELETE CASCADE,
  tip             TEXT NOT NULL CHECK (tip IN ('hazirlık_cagrisi', 'resmi_evrak', 'resmi_tarih', 'tatil_onerisi', 'surpriz')),
  mesaj           TEXT NOT NULL,
  ilgili_entity   JSONB,               -- {tip: "kazanim", kod: "MAT.9.1.1"} veya {tip: "evrak", sablon_id: "..."}
  okundu          BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bildirimler_kullanici ON bildirimler(kullanici_id, okundu);

-- =============================================
-- CACHE TABLOSU (Spec B4 — Katman 1 zorunlu)
-- =============================================

CREATE TABLE uretim_cache (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cache_key       TEXT NOT NULL UNIQUE, -- kazanim_kodu + tip + parametre_hash
  kazanim_kodu    TEXT NOT NULL REFERENCES kazanimlar(kod),
  tip             TEXT NOT NULL,
  parametreler_hash TEXT NOT NULL,
  icerik          TEXT NOT NULL,
  kullanim_sayisi INTEGER DEFAULT 1,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  son_kullanim    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cache_key ON uretim_cache(cache_key);
CREATE INDEX idx_cache_kazanim ON uretim_cache(kazanim_kodu);

-- =============================================
-- FEEDBACK TABLOSU (Spec E4 + F2 — V1.5 tarz öğrenme datası)
-- =============================================

CREATE TABLE feedback (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kullanici_id    UUID NOT NULL REFERENCES kullanicilar(id) ON DELETE CASCADE,
  uretim_id       UUID NOT NULL REFERENCES uretimler(id) ON DELETE CASCADE,
  begeni          TEXT CHECK (begeni IN ('cok_guzel', 'iyi', 'begenmedim')),
  sessiz_veri     JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Tüm tablolarda RLS aç
ALTER TABLE kullanicilar ENABLE ROW LEVEL SECURITY;
ALTER TABLE yillik_planlar ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_haftalari ENABLE ROW LEVEL SECURITY;
ALTER TABLE uretimler ENABLE ROW LEVEL SECURITY;
ALTER TABLE evrak_uretimleri ENABLE ROW LEVEL SECURITY;
ALTER TABLE bildirimler ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Statik tablolar herkese okunabilir (seed data)
ALTER TABLE branslar ENABLE ROW LEVEL SECURITY;
ALTER TABLE kazanimlar ENABLE ROW LEVEL SECURITY;
ALTER TABLE egitim_takvimi ENABLE ROW LEVEL SECURITY;
ALTER TABLE evrak_sablonlari ENABLE ROW LEVEL SECURITY;
ALTER TABLE uretim_cache ENABLE ROW LEVEL SECURITY;

-- Statik tablolar için SELECT politikaları
CREATE POLICY "branslar_read" ON branslar FOR SELECT USING (true);
CREATE POLICY "kazanimlar_read" ON kazanimlar FOR SELECT USING (true);
CREATE POLICY "egitim_takvimi_read" ON egitim_takvimi FOR SELECT USING (true);
CREATE POLICY "evrak_sablonlari_read" ON evrak_sablonlari FOR SELECT USING (true);
CREATE POLICY "cache_read" ON uretim_cache FOR SELECT USING (true);
CREATE POLICY "cache_insert" ON uretim_cache FOR INSERT WITH CHECK (true);
CREATE POLICY "cache_update" ON uretim_cache FOR UPDATE USING (true);

-- Kullanıcı tabloları için politikalar (sadece kendi verisine erişim)
CREATE POLICY "kullanicilar_self" ON kullanicilar
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "yillik_planlar_self" ON yillik_planlar
  FOR ALL USING (auth.uid() = kullanici_id);

CREATE POLICY "plan_haftalari_self" ON plan_haftalari
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM yillik_planlar yp
      WHERE yp.id = plan_haftalari.plan_id
      AND yp.kullanici_id = auth.uid()
    )
  );

CREATE POLICY "uretimler_self" ON uretimler
  FOR ALL USING (auth.uid() = kullanici_id);

CREATE POLICY "evrak_uretimleri_self" ON evrak_uretimleri
  FOR ALL USING (auth.uid() = kullanici_id);

CREATE POLICY "bildirimler_self" ON bildirimler
  FOR ALL USING (auth.uid() = kullanici_id);

CREATE POLICY "feedback_self" ON feedback
  FOR ALL USING (auth.uid() = kullanici_id);

-- =============================================
-- UPDATED_AT TRİGGERI
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER kullanicilar_updated_at
  BEFORE UPDATE ON kullanicilar
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER yillik_planlar_updated_at
  BEFORE UPDATE ON yillik_planlar
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
