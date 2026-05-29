-- branslar.kademe düzeltmeleri
-- Kaynak: ogretmen_brans_ders_veritabani.json
-- NOT: tarih'in ortaokul kademesi migration 000012'de kaldırılır
--      (sinif=8 T.C. İnkılap Tarihi verisi Sosyal Bilgiler'e taşınır)

-- Yalnızca lise (ihl ve lise aynı akademik müfredat, ayrım gerekmez)
UPDATE branslar SET kademe = ARRAY['lise']
WHERE slug IN (
  'fizik', 'kimya', 'biyoloji', 'cografya', 'felsefe',
  'turk_dili_edebiyati', 'fransizca'
);

-- ortaokul + lise
UPDATE branslar SET kademe = ARRAY['ortaokul','lise']
WHERE slug IN ('almanca');

-- ortaokul + iho + lise + ihl
UPDATE branslar SET kademe = ARRAY['ortaokul','iho','lise','ihl']
WHERE slug IN ('matematik', 'rehber_ogretmen', 'bilisim_teknolojileri');

-- ortaokul + lise + ihl (000012 sonrası ortaokul kalkacak)
UPDATE branslar SET kademe = ARRAY['ortaokul','lise','ihl']
WHERE slug = 'tarih';

-- Yalnızca ortaokul
UPDATE branslar SET kademe = ARRAY['ortaokul']
WHERE slug IN ('turkce', 'fen_bilimleri');

-- ortaokul + iho
UPDATE branslar SET kademe = ARRAY['ortaokul','iho']
WHERE slug IN ('sosyal_bilgiler', 'teknoloji_tasarim');

-- ilkokul + ortaokul + iho + lise + ihl
UPDATE branslar SET kademe = ARRAY['ilkokul','ortaokul','iho','lise','ihl']
WHERE slug IN ('ingilizce', 'muzik', 'beden_egitimi', 'gorsel_sanatlar', 'din_kulturu');

-- iho + ihl (yalnızca imam hatip)
UPDATE branslar SET kademe = ARRAY['iho','ihl']
WHERE slug = 'arapca';
