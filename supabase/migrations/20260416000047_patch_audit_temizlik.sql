-- Migration 047: Manuel audit temizlik — garbage ve tekrar eden extraction kayıtları
-- Toplam 11 silme:
--   TDB lise 9: 4 (TDBLISE.1.x.4 — her ünitede tekrar eden "güzel isimler" kazanımı)
--   TDB lise 10: 3 (TDBLISE.2.1-3.4 — aynı sebep)
--   Temel Düzey Matematik 11: 1 (MAT.T.11.2 — bölüm başlığı, kazanım değil)
--   Tezhip 9: 1 (TZHP.I.39.1 — şablon metni, kazanım değil)
--   Din Kültürü 4: 1 (DKAB.4.1.1 — PDF metodoloji paragrafı fragment)
--   Toplam sonrası: 5468 - 11 = 5457 kazanım

DELETE FROM kazanimlar
WHERE kod IN (
  -- Temel Dini Bilgiler lise 9: her ünitede tekrarlanan "Allah'ın güzel isimleri" kazanımı
  'TDBLISE.1.1.4',
  'TDBLISE.1.2.4',
  'TDBLISE.1.3.4',
  'TDBLISE.1.4.4',
  -- Temel Dini Bilgiler lise 10: ilk 3 ünitedeki tekrar (4. ünite korunuyor → 13 kalacak)
  'TDBLISE.2.1.4',
  'TDBLISE.2.2.4',
  'TDBLISE.2.3.4',
  -- Temel Düzey Matematik 11: "GEOMETRİK ŞEKİLLER 2 26" — bölüm başlığı sızdı
  'MAT.T.11.2',
  -- Tezhip 9: "Öğrenme çıktı öğrenciye kazandırılması" — PDF şablon metni
  'TZHP.I.39.1',
  -- Din Kültürü ve Ahlak Bilgisi 4: PDF metodoloji paragrafı fragment
  'DKAB.4.1.1'
);
