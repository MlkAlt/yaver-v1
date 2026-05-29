-- Bilişim Teknolojileri: lise kademe kaldır (MEB'de 5-6. sınıf zorunlu ders, 9-12 yok)
UPDATE branslar
SET kademe = ARRAY['ortaokul']
WHERE slug = 'bilisim_teknolojileri';
