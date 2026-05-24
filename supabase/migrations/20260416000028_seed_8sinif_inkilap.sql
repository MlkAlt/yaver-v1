-- Migration 028: 8. sınıf T.C. İnkılap Tarihi ve Atatürkçülük kazanımları
-- Sosyal Bilgiler branşına bağlı (8. sınıf İnkılap Tarihi'ni Sosyal Bilgiler öğretmeni verir)
-- Kaynak: MEB güncel müfredat (sosyalbilgiler.org / mufredat.meb.gov.tr)
-- 41 kazanım, 7 ünite

INSERT INTO kazanimlar (kod, brans_id, sinif, unite_no, unite_ad, ad, aciklama, ders, okul_tipi)
SELECT v.kod, b.id, 8, v.unite_no, v.unite_ad, v.ad, '', 'T.C. İnkılap Tarihi', 'ortaokul'
FROM (VALUES
  -- Ünite 1: Bir Kahraman Doğuyor
  ('İTA.8.1.1', 1, 'Bir Kahraman Doğuyor', 'Avrupa''daki gelişmelerin yansımaları bağlamında Osmanlı Devleti''nin yirminci yüzyılın başlarındaki siyasi ve sosyal durumunu kavrar.'),
  ('İTA.8.1.2', 1, 'Bir Kahraman Doğuyor', 'Mustafa Kemal''in çocukluk döneminde içinde yaşadığı toplumun sosyal ve kültürel yapısını analiz eder.'),
  ('İTA.8.1.3', 1, 'Bir Kahraman Doğuyor', 'Mustafa Kemal''in öğrenim hayatından hareketle onun kişilik özelliklerinin oluşumu hakkında çıkarımlarda bulunur.'),
  ('İTA.8.1.4', 1, 'Bir Kahraman Doğuyor', 'Gençlik döneminde Mustafa Kemal''in fikir hayatını etkileyen önemli kişileri ve olayları kavrar.'),
  ('İTA.8.1.5', 1, 'Bir Kahraman Doğuyor', 'Mustafa Kemal''in askerlik hayatı ile ilgili olayları ve olguları onun kişilik özellikleri ile ilişkilendirir.'),
  -- Ünite 2: Millî Uyanış
  ('İTA.8.2.1', 2, 'Millî Uyanış: Bağımsızlık Yolunda Atılan Adımlar', 'Birinci Dünya Savaşı''nın sebeplerini ve savaşın başlamasına yol açan gelişmeleri kavrar.'),
  ('İTA.8.2.2', 2, 'Millî Uyanış: Bağımsızlık Yolunda Atılan Adımlar', 'Birinci Dünya Savaşı''nda Osmanlı Devleti''nin durumu hakkında çıkarımlarda bulunur.'),
  ('İTA.8.2.3', 2, 'Millî Uyanış: Bağımsızlık Yolunda Atılan Adımlar', 'Mondros Ateşkes Antlaşması''nın imzalanması ve uygulanması karşısında Osmanlı yönetiminin, Mustafa Kemal''in ve halkın tutumunu analiz eder.'),
  ('İTA.8.2.4', 2, 'Millî Uyanış: Bağımsızlık Yolunda Atılan Adımlar', 'Kuvâ-yı Millîye''nin oluşum sürecini ve sonrasında meydana gelen gelişmeleri kavrar.'),
  ('İTA.8.2.5', 2, 'Millî Uyanış: Bağımsızlık Yolunda Atılan Adımlar', 'Millî Mücadele''nin hazırlık döneminde Mustafa Kemal''in yaptığı çalışmaları analiz eder.'),
  ('İTA.8.2.6', 2, 'Millî Uyanış: Bağımsızlık Yolunda Atılan Adımlar', 'Misakımilli''nin kabulünü ve Büyük Millet Meclisinin açılışını vatanın bütünlüğü esası ile "ulusal egemenlik" ve "tam bağımsızlık" ilkeleri ile ilişkilendirir.'),
  ('İTA.8.2.7', 2, 'Millî Uyanış: Bağımsızlık Yolunda Atılan Adımlar', 'Büyük Millet Meclisine karşı ayaklanmalar ile ayaklanmaların bastırılması için alınan tedbirleri analiz eder.'),
  ('İTA.8.2.8', 2, 'Millî Uyanış: Bağımsızlık Yolunda Atılan Adımlar', 'Mustafa Kemal''in ve Türk milletinin Sevr Antlaşması''na karşı tepkilerini değerlendirir.'),
  -- Ünite 3: Millî Bir Destan
  ('İTA.8.3.1', 3, 'Millî Bir Destan: Ya İstiklâl Ya Ölüm!', 'Millî Mücadele Dönemi''nde Doğu Cephesi ve Güney Cephesi''nde meydana gelen gelişmeleri kavrar.'),
  ('İTA.8.3.2', 3, 'Millî Bir Destan: Ya İstiklâl Ya Ölüm!', 'Millî Mücadele Dönemi''nde Batı Cephesi''nde meydana gelen gelişmeleri kavrar.'),
  ('İTA.8.3.3', 3, 'Millî Bir Destan: Ya İstiklâl Ya Ölüm!', 'Millî Mücadele''nin zor bir döneminde Maarif Kongresi yapan Atatürk''ün, millî ve çağdaş eğitime verdiği önemi kavrar.'),
  ('İTA.8.3.4', 3, 'Millî Bir Destan: Ya İstiklâl Ya Ölüm!', 'Türk milletinin millî birlik, beraberlik ve dayanışmasının bir örneği olarak Tekalif-i Millîye Emirleri doğrultusunda yapılan uygulamaları analiz eder.'),
  ('İTA.8.3.5', 3, 'Millî Bir Destan: Ya İstiklâl Ya Ölüm!', 'Sakarya Meydan Savaşı''nın kazanılmasında ve Büyük Taarruz''un başarılı olmasında Mustafa Kemal''in rolüne ilişkin çıkarımlarda bulunur.'),
  ('İTA.8.3.6', 3, 'Millî Bir Destan: Ya İstiklâl Ya Ölüm!', 'Lozan Antlaşması''nın sağladığı kazanımları analiz eder.'),
  ('İTA.8.3.7', 3, 'Millî Bir Destan: Ya İstiklâl Ya Ölüm!', 'Millî Mücadele Dönemi''nin siyasi, sosyal ve kültürel olaylarının sanat ve edebiyat ürünlerine yansımalarına kanıtlar gösterir.'),
  -- Ünite 4: Atatürkçülük ve Çağdaşlaşan Türkiye
  ('İTA.8.4.1', 4, 'Atatürkçülük ve Çağdaşlaşan Türkiye', 'Çağdaşlaşan Türkiye''nin temeli olan Atatürk ilkelerini açıklar.'),
  ('İTA.8.4.2', 4, 'Atatürkçülük ve Çağdaşlaşan Türkiye', 'Siyasi alanda meydana gelen gelişmeleri kavrar.'),
  ('İTA.8.4.3', 4, 'Atatürkçülük ve Çağdaşlaşan Türkiye', 'Hukuk alanında meydana gelen gelişmelerin toplumsal hayata yansımalarını kavrar.'),
  ('İTA.8.4.4', 4, 'Atatürkçülük ve Çağdaşlaşan Türkiye', 'Eğitim ve kültür alanında yapılan inkılapları ve gelişmeleri kavrar.'),
  ('İTA.8.4.5', 4, 'Atatürkçülük ve Çağdaşlaşan Türkiye', 'Toplumsal alanda yapılan inkılapları ve meydana gelen gelişmeleri kavrar.'),
  ('İTA.8.4.6', 4, 'Atatürkçülük ve Çağdaşlaşan Türkiye', 'Ekonomi alanında meydana gelen gelişmeleri kavrar.'),
  ('İTA.8.4.7', 4, 'Atatürkçülük ve Çağdaşlaşan Türkiye', 'Atatürk Dönemi''nde sağlık alanında yapılan çalışmaları devletin temel görevleri ile ilişkilendirir.'),
  ('İTA.8.4.8', 4, 'Atatürkçülük ve Çağdaşlaşan Türkiye', 'Cumhuriyet''in sağladığı kazanımları ve Atatürk''ün Türk milleti için gösterdiği hedefleri analiz eder.'),
  ('İTA.8.4.9', 4, 'Atatürkçülük ve Çağdaşlaşan Türkiye', 'Atatürk ilke ve inkılaplarını oluşturan temel esasları kavrar.'),
  -- Ünite 5: Demokratikleşme Çabaları
  ('İTA.8.5.1', 5, 'Demokratikleşme Çabaları', 'Atatürk Dönemi''ndeki demokratikleşme yolunda atılan adımları açıklar.'),
  ('İTA.8.5.2', 5, 'Demokratikleşme Çabaları', 'Mustafa Kemal''e suikast girişimini analiz eder.'),
  ('İTA.8.5.3', 5, 'Demokratikleşme Çabaları', 'Cumhuriyetin ilk yıllarında Türkiye Cumhuriyeti''ne yönelik tehditleri analiz eder.'),
  -- Ünite 6: Atatürk Dönemi Türk Dış Politikası
  ('İTA.8.6.1', 6, 'Atatürk Dönemi Türk Dış Politikası', 'Atatürk Dönemi Türk dış politikasının temel ilkelerini ve amaçlarını açıklar.'),
  ('İTA.8.6.2', 6, 'Atatürk Dönemi Türk Dış Politikası', 'Lozan Barış Antlaşması''nın, Türk dış politikasının gelişimine yaptığı etkiler hakkında çıkarımlarda bulunur.'),
  ('İTA.8.6.3', 6, 'Atatürk Dönemi Türk Dış Politikası', 'Atatürk Dönemi Türk dış politikasında yaşanan gelişmeleri analiz eder.'),
  ('İTA.8.6.4', 6, 'Atatürk Dönemi Türk Dış Politikası', 'Atatürk''ün Hatay''ı ülkemize katmak konusunda yaptıklarına ve bu uğurda gösterdiği özveriye kanıtlar gösterir.'),
  -- Ünite 7: Atatürk'ün Ölümü ve Sonrası
  ('İTA.8.7.1', 7, 'Atatürk''ün Ölümü ve Sonrası', 'Atatürk''ün ölümüne ilişkin yansıma ve değerlendirmelerden hareketle onun fikir ve eserlerinin evrensel değerine ilişkin çıkarımlarda bulunur.'),
  ('İTA.8.7.2', 7, 'Atatürk''ün Ölümü ve Sonrası', 'Atatürk''ün Türk Milleti''ne bıraktığı eserlerinden örnekler verir.'),
  ('İTA.8.7.3', 7, 'Atatürk''ün Ölümü ve Sonrası', 'Atatürk''ün İkinci Dünya Savaşı öncesi tespitleri ve girişimleri Türkiye''nin savaşta izlediği denge siyaseti ile ilişkilendirilir.'),
  ('İTA.8.7.4', 7, 'Atatürk''ün Ölümü ve Sonrası', 'İkinci Dünya Savaşı''ndaki gelişmelerin ve bu savaşın sonuçlarının Türkiye''ye etkilerini analiz eder.'),
  ('İTA.8.7.5', 7, 'Atatürk''ün Ölümü ve Sonrası', 'Türkiye''de çok partili siyasi hayata geçişi hızlandıran gelişmeleri, demokrasinin gerekleri açısından analiz eder.')
) AS v(kod, unite_no, unite_ad, ad)
JOIN branslar b ON b.slug = 'sosyal_bilgiler'
ON CONFLICT (kod) DO NOTHING;
