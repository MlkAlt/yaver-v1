-- Migration 043: kazanimlar tablosunu sıfırla (clean slate)
-- Şema ve branslar korunur, sadece kazanım verisi silinir.
TRUNCATE TABLE kazanimlar RESTART IDENTITY CASCADE;
