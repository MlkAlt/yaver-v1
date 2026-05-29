-- Yaver V1 — Teknoloji ve Tasarım kazanımları (7-8. sınıf)
-- Kaynak: MEB Öğretim Programı PDF (2026)
-- 53 kazanım

DO $$
DECLARE brans_uuid UUID;
BEGIN
  SELECT id INTO brans_uuid FROM branslar WHERE slug = 'teknoloji_tasarim';
  IF brans_uuid IS NULL THEN
    RAISE EXCEPTION 'teknoloji_tasarim branşı bulunamadı';
  END IF;

  INSERT INTO kazanimlar (kod, brans_id, sinif, unite_no, unite_ad, ad, okul_tipi, ders)
  VALUES
  ('TT.7.1.1', brans_uuid, 7, 1, 'Teknoloji ve Tasarım Öğreniyorum', 'Teknoloji ve tasarım ile ilişkili kavramları sorgulayabilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.7.1.2', brans_uuid, 7, 1, 'Teknoloji ve Tasarım Öğreniyorum', 'Teknoloji ve tasarım arasındaki ilişkiyi çözümleyebilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.7.1.3', brans_uuid, 7, 1, 'Teknoloji ve Tasarım Öğreniyorum', 'Teknoloji ve tasarım ürünlerini karşılaştırabilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.7.1.4', brans_uuid, 7, 1, 'Teknoloji ve Tasarım Öğreniyorum', 'Çevresindeki teknoloji ve tasarım gelişmelerini değerlendirebilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.7.2.1', brans_uuid, 7, 2, 'Temel Tasarım', 'Bir ürün veya eser üzerinde sanat-tasarım eleman ve ilkelerini algılayabilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.7.2.2', brans_uuid, 7, 2, 'Temel Tasarım', 'Çevresindeki bir ürünü veya eseri yeniden yorumlayabilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.7.2.3', brans_uuid, 7, 2, 'Temel Tasarım', 'Sanat-tasarım eleman ve ilkelerini kullanarak analoji yapabilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.7.2.4', brans_uuid, 7, 2, 'Temel Tasarım', 'Sanat-tasarım eleman ve ilkelerini kullanarak özgün bir tasarım oluşturabilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.7.3.1', brans_uuid, 7, 3, 'Tasarım Odaklı Süreç', 'Tasarım problemlerini çözümleyebilme ve geliştirebilme kriterlerini sınıflandırabilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.7.4.1', brans_uuid, 7, 4, 'Bilgisayar Destekli Tasarım', 'Tasarım problemini çözmek için ürün oluşturabilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.7.4.2', brans_uuid, 7, 4, 'Bilgisayar Destekli Tasarım', 'Yapılan tasarımı paylaşmak için çoklu ortam sunusu hazırlayabilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.7.5.1', brans_uuid, 7, 5, 'Mimari Tasarım', 'Mekânsal analoji yapabilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.7.5.2', brans_uuid, 7, 5, 'Mimari Tasarım', 'İşlevsel özelliklerin mimari tasarımda yapısal farklılıklara yol açtığını algılayabilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.7.5.3', brans_uuid, 7, 5, 'Mimari Tasarım', 'Yaşamak istediği konutun farklı coğrafi alan ve şartlara uygun olarak tasarımını', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.7.5.4', brans_uuid, 7, 5, 'Mimari Tasarım', 'Mimari tasarımı için çoklu ortam sunumu yapabilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.7.6.1', brans_uuid, 7, 6, 'Doğadan Tasarıma', 'Canlılar ve doğal yapıların yapısal, biçimsel ve görsel özelliklerini sanatsal gözlemleyebilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.7.6.2', brans_uuid, 7, 6, 'Doğadan Tasarıma', 'Gündelik hayatında var olan bir problemi çözebilmek için doğa ve canlıları tasarımla ilişkilendirebilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.7.6.3', brans_uuid, 7, 6, 'Doğadan Tasarıma', 'Gündelik hayatında var olan bir problemin çözümünde biyotaklit yaklaşımını kullanarak ürün oluşturabilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.7.7.1', brans_uuid, 7, 7, 'Enerjinin Dönüşümü ve Tasarım', 'Enerji kavramı, enerji kaynakları, türleri ve dönüşümleri hakkında bilgi toplayabilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.7.7.2', brans_uuid, 7, 7, 'Enerjinin Dönüşümü ve Tasarım', 'Enerjinin dönüşümünün ve korunumunun doğa ve insan hayatına etkisi üzerine', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.7.7.3', brans_uuid, 7, 7, 'Enerjinin Dönüşümü ve Tasarım', 'Yenilenebilir ve yenilenemez enerji kaynaklarını sınıflandırabilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.7.7.4', brans_uuid, 7, 7, 'Enerjinin Dönüşümü ve Tasarım', 'Yenilenemez enerji kaynakları kullanımının dünyaya etkisini gözleme dayalı tahmin edebilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.7.7.5', brans_uuid, 7, 7, 'Enerjinin Dönüşümü ve Tasarım', 'Yenilenebilir enerji kaynakları kullanılarak enerji elde edilebilen bir ürün taslağı', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.7.8.1', brans_uuid, 7, 8, 'Bütünleşik Öğrenme: STEAM', 'STEAM’i oluşturan disiplinler ile alt bileşenlerinin ne olduğunu sorgulayabilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.7.8.2', brans_uuid, 7, 8, 'Bütünleşik Öğrenme: STEAM', 'STEAM disiplinlerinin arasındaki ilişkiyi gözlemleyebilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.7.8.3', brans_uuid, 7, 8, 'Bütünleşik Öğrenme: STEAM', 'Proje türlerini karşılaştırabilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.7.8.4', brans_uuid, 7, 8, 'Bütünleşik Öğrenme: STEAM', 'STEAM yaklaşımına göre problem çözebilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.7.9.1', brans_uuid, 7, 9, 'Yapay Zekâ ve Akıllı Ürünler', 'Yapay zekâ kavramını, algoritmalarını, avantaj ve dezavantajlarını sorgulayabilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.7.9.2', brans_uuid, 7, 9, 'Yapay Zekâ ve Akıllı Ürünler', 'Yapay zekâ modeli eğitmek için bilgi toplayabilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.7.9.3', brans_uuid, 7, 9, 'Yapay Zekâ ve Akıllı Ürünler', 'Yapay zekâ modelleri ile bilgi toplayabilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.7.9.4', brans_uuid, 7, 9, 'Yapay Zekâ ve Akıllı Ürünler', 'Yapay zekâ araçlarını sentezleyebilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.8.1.1', brans_uuid, 8, 1, 'İnovatif Düşüncenin Geliştirilmesi ve Fikir Tescili', 'İnovasyon ve AR-GE kavramlarını sorgulayabilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.8.1.2', brans_uuid, 8, 1, 'İnovatif Düşüncenin Geliştirilmesi ve Fikir Tescili', 'İnovatif bir ürünün taslağını oluşturabilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.8.1.3', brans_uuid, 8, 1, 'İnovatif Düşüncenin Geliştirilmesi ve Fikir Tescili', 'Fikrî ve Sınai Mülkiyet Haklarının Korunması hakkında bilgi toplayabilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.8.2.1', brans_uuid, 8, 2, 'Tanıtım ve Pazarlama', 'Tanıtım ve pazarlama teknik ve stratejileri hakkında bilgi toplayabilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.8.2.2', brans_uuid, 8, 2, 'Tanıtım ve Pazarlama', 'Kurumlar veya şirketlere ait kurumsal kimlik çalışmalarını ve pazarlama tekniklerini genelleyebilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.8.2.3', brans_uuid, 8, 2, 'Tanıtım ve Pazarlama', 'İnovatif ürünün tanıtım ve pazarlaması için çoklu ortam sunumu yapabilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.8.3.1', brans_uuid, 8, 3, 'Görsel İletişim Tasarımı', 'Görsel iletişim tasarımı kavramı, içeriği, türleri ve önemini sorgulayabilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.8.3.2', brans_uuid, 8, 3, 'Görsel İletişim Tasarımı', 'Yayın grafiği tasarım ürünlerini çözümleyebilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.8.3.3', brans_uuid, 8, 3, 'Görsel İletişim Tasarımı', 'Yayın grafiği tasarım ürünü oluşturabilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.8.4.1', brans_uuid, 8, 4, 'Ürün Geliştirme', 'Ergonomi ve tasarım ilişkisini sorgulayabilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.8.4.2', brans_uuid, 8, 4, 'Ürün Geliştirme', 'Ürünleri ergonomik açıdan gözlemleyebilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.8.4.3', brans_uuid, 8, 4, 'Ürün Geliştirme', 'Ergonomik bir ürün oluşturabilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.8.5.1', brans_uuid, 8, 5, 'Mühendislik ve Tasarım', 'Mühendislik ve tasarım arasındaki ilişkiyi sorgulayabilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.8.5.2', brans_uuid, 8, 5, 'Mühendislik ve Tasarım', 'Çevresindeki ürünleri mühendislik açısından inceleyerek tasarım süreçlerini gözlemleyebilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.8.5.3', brans_uuid, 8, 5, 'Mühendislik ve Tasarım', 'Mühendislik tasarım sürecindeki sınırlılıkları değerlendirebilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.8.5.4', brans_uuid, 8, 5, 'Mühendislik ve Tasarım', 'Tasarım ürünü oluşturabilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.8.6.1', brans_uuid, 8, 6, 'Ulaşım Teknolojileri', 'Ulaşım araçlarının tasarımında dikkate alınan temel prensipleri genelleyebilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.8.6.2', brans_uuid, 8, 6, 'Ulaşım Teknolojileri', 'Farklı ortamlarda kullanılan ulaşım araçlarını temel prensiplerine göre kendi içinde sınıflandırabilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.8.6.3', brans_uuid, 8, 6, 'Ulaşım Teknolojileri', 'Farklı ortamlarda çalışabilecek bir ulaşım aracı tasarımını ürüne dönüştürebilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.8.7.1', brans_uuid, 8, 7, 'Özgün Ürünümü Tasarlıyorum', 'Günlük hayatta karşılaştığı tasarım problemlerini çözebilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.8.7.2', brans_uuid, 8, 7, 'Özgün Ürünümü Tasarlıyorum', 'Tasarımı ürüne dönüştürebilme', 'ortaokul', 'Teknoloji ve Tasarım'),
  ('TT.8.8.1', brans_uuid, 8, 8, 'Bunu Ben Yaptım', 'Ürünlerine yönelik çoklu ortam sunumu yapabilme', 'ortaokul', 'Teknoloji ve Tasarım')
  ON CONFLICT (kod) DO NOTHING;
END $$;