-- Migration 021: Branş sıralaması alfabetik → popülerlik bazlı
-- Sınıf Öğretmenliği ve temel branşlar öne alındı,
-- alan/uzmanlık branşları arkaya bırakıldı.

UPDATE branslar SET sira = 1  WHERE ad = 'Sınıf Öğretmenliği';
UPDATE branslar SET sira = 2  WHERE ad = 'Matematik';
UPDATE branslar SET sira = 3  WHERE ad = 'Türkçe';
UPDATE branslar SET sira = 4  WHERE ad = 'İngilizce';
UPDATE branslar SET sira = 5  WHERE ad = 'Fen Bilimleri';
UPDATE branslar SET sira = 6  WHERE ad = 'Sosyal Bilgiler';
UPDATE branslar SET sira = 7  WHERE ad = 'Türk Dili ve Edebiyatı';
UPDATE branslar SET sira = 8  WHERE ad = 'Din Kültürü ve Ahlak Bilgisi';
UPDATE branslar SET sira = 9  WHERE ad = 'Tarih';
UPDATE branslar SET sira = 10 WHERE ad = 'Beden Eğitimi ve Spor';
UPDATE branslar SET sira = 11 WHERE ad = 'Coğrafya';
UPDATE branslar SET sira = 12 WHERE ad = 'Biyoloji';
UPDATE branslar SET sira = 13 WHERE ad = 'Fizik';
UPDATE branslar SET sira = 14 WHERE ad = 'Kimya';
UPDATE branslar SET sira = 15 WHERE ad = 'Görsel Sanatlar';
UPDATE branslar SET sira = 16 WHERE ad = 'Müzik';
UPDATE branslar SET sira = 17 WHERE ad = 'Felsefe';
UPDATE branslar SET sira = 18 WHERE ad = 'Bilişim Teknolojileri';
UPDATE branslar SET sira = 19 WHERE ad = 'Teknoloji ve Tasarım';
UPDATE branslar SET sira = 20 WHERE ad = 'Almanca';
UPDATE branslar SET sira = 21 WHERE ad = 'Arapça';
UPDATE branslar SET sira = 22 WHERE ad = 'Fransızca';
UPDATE branslar SET sira = 23 WHERE ad = 'İHL Meslek Dersleri';
