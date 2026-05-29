-- Kazanım başlık düzeltmeleri: seeding sırasında yanlış bölüm (Öğrenme-Öğretme)
-- metni alınan veya kesilen 12 kazanım için doğru başlıklar güncelleniyor.
-- Doğru başlıklar MEB PDF'lerinden (ÖĞRENME ÇIKTILARI VE SÜREÇ BİLEŞENLERİ bölümü) alındı.

UPDATE kazanimlar SET ad = 'Dâhil olduğu gruplarda ve sosyal hayatta etkili iletişimin önemini sorgulayabilme'
WHERE kod = 'SB.7.1.1';

UPDATE kazanimlar SET ad = 'Sanat ve özgünlük ilişkisini tartışabilme'
WHERE kod = 'GS.11.1.1';

UPDATE kazanimlar SET ad = 'Elektronların atom orbitallerine yerleşimine ilişkin tümevarımsal akıl yürütebilme'
WHERE kod = 'KİM.9.1.5';

UPDATE kazanimlar SET ad = 'Birimleri SI birim sisteminde verilen temel ve türetilmiş nicelikleri sınıflandırabilme'
WHERE kod = 'FİZ.9.2.1';

UPDATE kazanimlar SET ad = 'Günlük yaşamdaki nesneleri biçimsel özelliklerine göre ayırt edebilme'
WHERE kod = 'MAT.1.3.3';

UPDATE kazanimlar SET ad = 'Günlük yaşamda karşılaşılan geometrik yapılardaki geometrik şekilleri çözümleyebilme'
WHERE kod = 'MAT.1.3.4';

UPDATE kazanimlar SET ad = 'Biçimsel özelliklerine göre geometrik şekilleri sınıflandırabilme'
WHERE kod = 'MAT.1.3.5';

UPDATE kazanimlar SET ad = 'Fikrî ve Sınai Mülkiyet Haklarının Korunması hakkında bilgi toplayabilme'
WHERE kod = 'TT.8.1.3';

UPDATE kazanimlar SET ad = 'Mustafa Kemal Atatürk''ün ilgilendiği sporları açıklayabilme'
WHERE kod = 'BEO.3.6.3';

UPDATE kazanimlar SET ad = 'Beden eğitimi ve spor alanının öncülerini tanıyabilme'
WHERE kod = 'BES.7.4.1';

-- Seeding sırasında tırnak işareti nedeniyle kesilen başlıklar
UPDATE kazanimlar SET ad = 'İki niceliğin büyüklüğünü "çok", "daha çok", "az", "daha az" veya "eşit" terimleriyle karşılaştırabilme'
WHERE kod = 'MAT.1.1.4';

UPDATE kazanimlar SET ad = 'Günlük yaşamdan herhangi bir olayın olasılığını "imkânsız, olabilir, kesin" olarak belirleyebilme'
WHERE kod = 'MAT.4.4.1';
