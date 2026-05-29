-- Yaver V1 — Seed: Branşlar
-- 20 branş, ikonlu, renkli, sıralı
-- NOT: Psikoloji çıkarıldı (branş değil, ders). Kazanım detayları sonradan eklenecek.
-- Migration: 20260416000002_seed_branslar.sql

INSERT INTO branslar (ad, ikon, renk, sira) VALUES
  ('Matematik',                    '📐', '#DBEAFE', 1),  -- blue-100
  ('Türk Dili ve Edebiyatı',       '📖', '#FEE2E2', 2),  -- red-100
  ('Fizik',                        '⚡', '#EDE9FE', 3),  -- violet-100
  ('Kimya',                        '🧪', '#D1FAE5', 4),  -- emerald-100
  ('Biyoloji',                     '🌿', '#DCFCE7', 5),  -- green-100
  ('Tarih',                        '🏛️', '#FEF3C7', 6),  -- amber-100
  ('Coğrafya',                     '🗺️', '#CCFBF1', 7),  -- teal-100
  ('Felsefe',                      '💭', '#F3E8FF', 8),  -- purple-100
  ('İngilizce',                    '🌍', '#E0F2FE', 9),  -- sky-100
  ('Almanca',                      '🇩🇪', '#FFF7ED', 10), -- orange-50
  ('Arapça',                       '🌙', '#F0FDF4', 11), -- green-50
  ('Bilişim Teknolojileri',        '💻', '#F1F5F9', 12), -- slate-100
  ('Müzik',                        '🎵', '#FCE7F3', 13), -- pink-100
  ('Beden Eğitimi ve Spor',        '⚽', '#FFEDD5', 14), -- orange-100
  ('Din Kültürü ve Ahlak Bilgisi', '📿', '#F5F5F4', 15), -- stone-100
  ('Görsel Sanatlar',              '🎨', '#FFE4E6', 16), -- rose-100
  ('Türkçe',                       '✏️', '#FEF9C3', 17), -- yellow-100
  ('Fen Bilimleri',                '🔬', '#CCFBF1', 18), -- teal-100
  ('Sosyal Bilgiler',              '🌐', '#E0E7FF', 19), -- indigo-100
  ('Hayat Bilgisi',                '🌱', '#DCFCE7', 20), -- green-100
  ('Sınıf Öğretmenliği',          '🏫', '#E0F2FE', 21)  -- sky-100
ON CONFLICT (ad) DO NOTHING;
