-- Migration 024: İlkokul eksik kazanımlar
-- Türkçe 1-2. sınıf (20 kazanım)
-- Müzik 1-4. sınıf ilkokul (16 kazanım)
-- Görsel Sanatlar 1-4. sınıf ilkokul (16 kazanım)
-- Toplam: 52 kazanım

INSERT INTO kazanimlar (kod, brans_id, sinif, unite_no, unite_ad, ad, aciklama, ders, okul_tipi)
SELECT v.kod, b.id, v.sinif::integer, v.unite_no::integer, v.unite_ad, v.ad, v.aciklama, v.ders, v.okul_tipi
FROM (VALUES

  -- ── Türkçe 1. Sınıf ─────────────────────────────────────────────────────────
  ('TK.1.1.1', 'Türkçe', 1, 1, 'Ses ve Harf Bilgisi',
   'Türkçedeki sesleri tanıyabilme ve ayırt edebilme',
   'a) Dinlediği kelimelerdeki sesleri tanır. b) Benzer sesleri birbirinden ayırt eder. c) Sesleri doğru çıkarır.',
   'Türkçe', 'ilkokul'),

  ('TK.1.1.2', 'Türkçe', 1, 1, 'Ses ve Harf Bilgisi',
   'Harfleri tanıyabilme ve doğru sesletebilme',
   'a) Büyük ve küçük harfleri tanır. b) Harflerin seslerini doğru çıkarır. c) Harfleri okuma ve yazmada kullanır.',
   'Türkçe', 'ilkokul'),

  ('TK.1.2.1', 'Türkçe', 1, 2, 'Hece ve Kelime',
   'Heceleri birleştirerek kelime okuyabilme',
   'a) Açık ve kapalı heceleri okur. b) Heceleri birleştirerek kelime oluşturur. c) Okuduğu kelimeleri anlar.',
   'Türkçe', 'ilkokul'),

  ('TK.1.2.2', 'Türkçe', 1, 2, 'Hece ve Kelime',
   'Kelimeleri hece hece yazabilme',
   'a) Kelimelerdeki hece sayısını belirler. b) Kelimeleri hecelere ayırarak yazar. c) Yazdığı kelimeleri okur.',
   'Türkçe', 'ilkokul'),

  ('TK.1.3.1', 'Türkçe', 1, 3, 'Cümle ve Metin',
   'Cümleleri akıcı biçimde okuyabilme',
   'a) Cümledeki kelimeleri boşluk bırakarak okur. b) Cümleyi anlamlı tonlamayla okur. c) Noktalama işaretlerine dikkat eder.',
   'Türkçe', 'ilkokul'),

  ('TK.1.3.2', 'Türkçe', 1, 3, 'Cümle ve Metin',
   'Kısa ve basit metinleri sesli okuyabilme',
   'a) 3-5 cümleden oluşan kısa metinleri okur. b) Okuduğu metnin konusunu belirtir. c) Metindeki resimleri metinle ilişkilendirir.',
   'Türkçe', 'ilkokul'),

  ('TK.1.4.1', 'Türkçe', 1, 4, 'Dinleme-Anlama',
   'Dinlediği metinden temel bilgileri çıkarabilme',
   'a) Dinlediği metindeki kişileri söyler. b) Ne olduğunu kendi cümleleriyle ifade eder. c) Dinleme kurallarına uyar.',
   'Türkçe', 'ilkokul'),

  ('TK.1.4.2', 'Türkçe', 1, 4, 'Dinleme-Anlama',
   'Söylenenleri anlayarak uygun biçimde yanıt verebilme',
   'a) Yönergeleri dinleyerek uygular. b) Soru sorulduğunda konuyla ilgili yanıt verir. c) Anlamadığı kelimeleri sorar.',
   'Türkçe', 'ilkokul'),

  ('TK.1.5.1', 'Türkçe', 1, 5, 'Konuşma-Yazma',
   'Duygu ve düşüncelerini sözlü olarak ifade edebilme',
   'a) Konuyla ilgili konuşur. b) Tam cümleler kurarak ifade eder. c) Sırasını bekleyerek konuşur.',
   'Türkçe', 'ilkokul'),

  ('TK.1.5.2', 'Türkçe', 1, 5, 'Konuşma-Yazma',
   'Temel harf ve kelimeleri kurallı biçimde yazabilme',
   'a) Harfleri doğru yönde ve büyüklükte yazar. b) Kelimeleri boşluk bırakarak yazar. c) Yazdıklarını okuyabilir.',
   'Türkçe', 'ilkokul'),

  -- ── Türkçe 2. Sınıf ─────────────────────────────────────────────────────────
  ('TK.2.1.1', 'Türkçe', 2, 1, 'Akıcı Okuma',
   'Metni akıcı ve doğru biçimde okuyabilme',
   'a) Kelimeleri yanlış okumadan okur. b) Uygun hızda okur. c) Tekrar okumalarla akıcılığını artırır.',
   'Türkçe', 'ilkokul'),

  ('TK.2.1.2', 'Türkçe', 2, 1, 'Akıcı Okuma',
   'Noktalama işaretlerine uyarak anlam gruplarıyla okuyabilme',
   'a) Nokta, virgül ve soru işaretine uygun tonlamayla okur. b) Anlam gruplarına göre vurgu yapar. c) Sessiz okuma yapabilir.',
   'Türkçe', 'ilkokul'),

  ('TK.2.2.1', 'Türkçe', 2, 2, 'Anlama ve Yorumlama',
   'Okuduğu metnin ana fikrini belirleyebilme',
   'a) Metnin neyi anlattığını kendi cümleleriyle ifade eder. b) Metnin başlığıyla içeriğini ilişkilendirir. c) Metni özetler.',
   'Türkçe', 'ilkokul'),

  ('TK.2.2.2', 'Türkçe', 2, 2, 'Anlama ve Yorumlama',
   'Metin içindeki olayları kronolojik olarak sıralayabilme',
   'a) Olayların başını, ortasını ve sonunu belirler. b) Olayları sıralı biçimde anlatır. c) Neden-sonuç ilişkisi kurar.',
   'Türkçe', 'ilkokul'),

  ('TK.2.3.1', 'Türkçe', 2, 3, 'Kelime Bilgisi',
   'Bağlamdan kelime anlamı çıkarabilme',
   'a) Yeni karşılaştığı kelimeleri cümledeki ipuçlarından anlamlandırır. b) Kelimenin hangi anlamda kullanıldığını belirtir.',
   'Türkçe', 'ilkokul'),

  ('TK.2.3.2', 'Türkçe', 2, 3, 'Kelime Bilgisi',
   'Eş ve zıt anlamlı kelimeleri kullanabilme',
   'a) Eş anlamlı kelimeler bulur. b) Zıt anlamlı kelimeler eşleştirir. c) Bu kelimeleri cümle içinde kullanır.',
   'Türkçe', 'ilkokul'),

  ('TK.2.4.1', 'Türkçe', 2, 4, 'Yazma',
   'Kurallı cümle kurabilme ve yazabilme',
   'a) Özne ve yüklem içeren tam cümleler yazar. b) Büyük harf ve noktalama kurallarına uyar. c) Okunaklı yazar.',
   'Türkçe', 'ilkokul'),

  ('TK.2.4.2', 'Türkçe', 2, 4, 'Yazma',
   'Kısa ve anlamlı metinler oluşturabilme',
   'a) 3-5 cümlelik kısa yazılar yazar. b) Yazdıklarını okuyarak kontrol eder. c) Yaratıcı konularda yazma yapar.',
   'Türkçe', 'ilkokul'),

  ('TK.2.5.1', 'Türkçe', 2, 5, 'Sözlü İletişim',
   'Duygu ve düşüncelerini akıcı biçimde sözlü ifade edebilme',
   'a) Konuya uygun cümleler kurar. b) Konuşurken göz teması kurar. c) Konuşma sırasını bekler.',
   'Türkçe', 'ilkokul'),

  ('TK.2.5.2', 'Türkçe', 2, 5, 'Sözlü İletişim',
   'Şiir ve hikâye gibi edebi türleri dinleyerek zevk alabilme',
   'a) Şiiri ritmiyle okur veya dinler. b) Hikâyenin kahramanlarını tanımlar. c) Beğendiği bölümleri paylaşır.',
   'Türkçe', 'ilkokul'),

  -- ── Müzik 1. Sınıf (İlkokul) ────────────────────────────────────────────────
  ('MÜZ.1.1.1', 'Müzik', 1, 1, 'Ses ve Ritim',
   'Çevredeki sesleri müziksel olarak ayırt edebilme',
   'a) Doğal ve insan yapımı sesleri tanır. b) Yüksek-alçak, uzun-kısa sesleri ayırt eder. c) Basit ritim kalıplarını uygular.',
   'Müzik', 'ilkokul'),

  ('MÜZ.1.2.1', 'Müzik', 1, 2, 'Söyleme ve Hareket',
   'Çocuk şarkılarını doğru ve müziksel biçimde söyleyebilme',
   'a) Nefes ve ses tekniklerini kullanır. b) Şarkıları ritmik söyler. c) Şarkı söylerken beden hareketleri ekler.',
   'Müzik', 'ilkokul'),

  ('MÜZ.1.3.1', 'Müzik', 1, 3, 'Müzik Kültürü',
   'Türk halk müziğinden örnekleri tanıyabilme',
   'a) Marş, türkü ve ninni türlerini ayırt eder. b) Türkülerin kim tarafından söylendiğini fark eder. c) Beğendiği türküleri paylaşır.',
   'Müzik', 'ilkokul'),

  ('MÜZ.1.3.2', 'Müzik', 1, 3, 'Müzik Kültürü',
   'Atatürk''ün müziğe verdiği önemi kavrayabilme',
   'a) İstiklal Marşı''nı söyler. b) Atatürk''ün müziği sevdiğini ifade eder. c) Ulusal marşlara saygı gösterir.',
   'Müzik', 'ilkokul'),

  -- ── Müzik 2. Sınıf (İlkokul) ────────────────────────────────────────────────
  ('MÜZ.2.1.1', 'Müzik', 2, 1, 'Ses ve Ritim',
   'Basit ritim kalıplarını vurma ve el çırpmayla uygulayabilme',
   'a) İkili ve dörtlük ritim kalıplarını tanır. b) Vurma aletleriyle ritim çalar. c) Müziğe eşlik eder.',
   'Müzik', 'ilkokul'),

  ('MÜZ.2.2.1', 'Müzik', 2, 2, 'Söyleme ve Hareket',
   'Şarkıları doğru nefes ve tonlamayla söyleyebilme',
   'a) Nefes kontrolü yaparak söyler. b) Güçlü-hafif sesle söyleyebilir. c) Arkadaşlarıyla birlikte söyler.',
   'Müzik', 'ilkokul'),

  ('MÜZ.2.3.1', 'Müzik', 2, 3, 'Müzik Kültürü',
   'Farklı kültürlere ait müzik örneklerini dinleyebilme',
   'a) Farklı ülkelere ait müzik dinler. b) Müziklerin farklı özelliklerini fark eder. c) Beğendiği müziği paylaşır.',
   'Müzik', 'ilkokul'),

  ('MÜZ.2.3.2', 'Müzik', 2, 3, 'Müzik Kültürü',
   'Müzik dinleme etkinliklerine isteyerek katılabilme',
   'a) Konsere veya dinletiye katılma kurallarını bilir. b) Dinlediği müzikle ilgili duygu ve düşüncelerini paylaşır.',
   'Müzik', 'ilkokul'),

  -- ── Müzik 3. Sınıf (İlkokul) ────────────────────────────────────────────────
  ('MÜZ.3.1.1', 'Müzik', 3, 1, 'Müzik Yazısı ve Ritim',
   'Temel nota değerlerini tanıyabilme',
   'a) Dörtlük, sekizlik ve yarım nota değerlerini tanır. b) Nota değerlerini ritim çalışmalarında kullanır.',
   'Müzik', 'ilkokul'),

  ('MÜZ.3.2.1', 'Müzik', 3, 2, 'Söyleme ve Çalma',
   'Şarkıları iki sesli olarak söyleyebilme',
   'a) Farklı bir ses grubunun söylediğini duyarken kendi sesini korur. b) Grup içinde uyumlu söyler.',
   'Müzik', 'ilkokul'),

  ('MÜZ.3.3.1', 'Müzik', 3, 3, 'Müzik Kültürü',
   'Türk sanat ve halk müziği eserlerini tanıyabilme',
   'a) Halk müziği ile sanat müziği arasındaki farkı açıklar. b) Tanıdığı eserlerin türünü belirtir.',
   'Müzik', 'ilkokul'),

  ('MÜZ.3.3.2', 'Müzik', 3, 3, 'Müzik Kültürü',
   'Müzik etkinliklerine yaratıcı biçimde katılabilme',
   'a) Şarkıya uygun hareket tasarlar. b) Basit ritim ezgisi oluşturur. c) Yarattığı eseri arkadaşlarıyla paylaşır.',
   'Müzik', 'ilkokul'),

  -- ── Müzik 4. Sınıf (İlkokul) ────────────────────────────────────────────────
  ('MÜZ.4.1.1', 'Müzik', 4, 1, 'Müzik Yazısı ve Ritim',
   'Temel müzik sembollerini okuyabilme',
   'a) Porte, nota adları (do-re-mi) ve anahtarı tanır. b) Basit melodiyi notadan takip eder.',
   'Müzik', 'ilkokul'),

  ('MÜZ.4.2.1', 'Müzik', 4, 2, 'Söyleme ve Çalma',
   'Okul şarkılarını ve marşları müziksel biçimde söyleyebilme',
   'a) İstiklal Marşı ve öğrendiği marşları doğru söyler. b) Dinamiklere (güçlü-hafif) dikkat eder.',
   'Müzik', 'ilkokul'),

  ('MÜZ.4.3.1', 'Müzik', 4, 3, 'Müzik Kültürü',
   'Müzik türlerini sınıflandırabilme',
   'a) Halk müziği, sanat müziği ve çocuk şarkılarını ayırt eder. b) Dinlediği eserin türünü belirtir.',
   'Müzik', 'ilkokul'),

  ('MÜZ.4.3.2', 'Müzik', 4, 3, 'Müzik Kültürü',
   'Yaşanılan şehrin müzik etkinliklerini gözlemleyebilme',
   'a) Çevresindeki müzik etkinliklerini fark eder. b) Gözlemlerini arkadaşlarıyla paylaşır.',
   'Müzik', 'ilkokul'),

  -- ── Görsel Sanatlar 1. Sınıf (İlkokul) ─────────────────────────────────────
  ('GS.1.1.1', 'Görsel Sanatlar', 1, 1, 'Görsel İletişim',
   'Çevresindeki renk, şekil ve dokuları sanatsal bakış açısıyla gözlemleyebilme',
   'a) Doğada ve çevresinde renk ve şekilleri fark eder. b) Gözlemlerini resim yaparak aktarır. c) Farklı dokuları elle hissederek tanımlar.',
   'Görsel Sanatlar', 'ilkokul'),

  ('GS.1.2.1', 'Görsel Sanatlar', 1, 2, 'Biçimlendirme',
   'Temel çizim tekniklerini kullanarak basit nesneler çizebilme',
   'a) Çizgi, nokta ve leke kullanır. b) Gördüğü nesneleri basit çizgilerle aktarır. c) Farklı boya araçları kullanır.',
   'Görsel Sanatlar', 'ilkokul'),

  ('GS.1.2.2', 'Görsel Sanatlar', 1, 2, 'Biçimlendirme',
   'Ana ve ara renkleri tanıyabilme ve kullanabilme',
   'a) Kırmızı, sarı, mavi ana renkleri tanır. b) İki ana rengi karıştırarak ara renk elde eder. c) Boyamada renk seçimini bilinçli yapar.',
   'Görsel Sanatlar', 'ilkokul'),

  ('GS.1.3.1', 'Görsel Sanatlar', 1, 3, 'Sanat Kültürü',
   'Çevresindeki sanat ürünlerini fark edebilme',
   'a) Müzede, sokakta ve evde gördüğü sanat eserlerini tanır. b) Beğendiği eseri anlatır. c) Sanat eserlerine saygı gösterir.',
   'Görsel Sanatlar', 'ilkokul'),

  -- ── Görsel Sanatlar 2. Sınıf (İlkokul) ─────────────────────────────────────
  ('GS.2.1.1', 'Görsel Sanatlar', 2, 1, 'Görsel İletişim',
   'Gördüklerini sanatsal öğeler kullanarak ifade edebilme',
   'a) Renk, çizgi, şekil ve doku öğelerini bir arada kullanır. b) Yapıtında vermek istediği mesajı tanımlar.',
   'Görsel Sanatlar', 'ilkokul'),

  ('GS.2.2.1', 'Görsel Sanatlar', 2, 2, 'Biçimlendirme',
   'Farklı malzeme ve tekniklerle özgün eserler oluşturabilme',
   'a) Kâğıt katlama, yırtma, yapıştırma tekniklerini kullanır. b) Atık malzemeleri sanat eserine dönüştürür.',
   'Görsel Sanatlar', 'ilkokul'),

  ('GS.2.2.2', 'Görsel Sanatlar', 2, 2, 'Biçimlendirme',
   'Temel geometrik şekilleri çizerek kompozisyon oluşturabilme',
   'a) Kare, daire, üçgen kullanarak düzenleme yapar. b) Şekilleri yinelerek desen oluşturur.',
   'Görsel Sanatlar', 'ilkokul'),

  ('GS.2.3.1', 'Görsel Sanatlar', 2, 3, 'Sanat Kültürü',
   'Türk el sanatlarından örnekleri tanıyabilme',
   'a) Seramik, dokuma, ebru gibi el sanatlarını tanır. b) Bu sanatların nasıl yapıldığını merak eder. c) Türk kültürüne özgü örnekleri ayırt eder.',
   'Görsel Sanatlar', 'ilkokul'),

  -- ── Görsel Sanatlar 3. Sınıf (İlkokul) ─────────────────────────────────────
  ('GS.3.1.1', 'Görsel Sanatlar', 3, 1, 'Görsel İletişim',
   'Sanat eserlerini gözlemleyerek yorumlayabilme',
   'a) Bir sanat eserindeki renk ve şekilleri tanımlar. b) Eserin ne hissettirdiğini anlatır. c) Kendi yorumunu paylaşır.',
   'Görsel Sanatlar', 'ilkokul'),

  ('GS.3.2.1', 'Görsel Sanatlar', 3, 2, 'Biçimlendirme',
   'Perspektif ve derinlik kavramlarını temel düzeyde uygulayabilme',
   'a) Ön ve arka planı olan bir resim çizer. b) Uzaktaki nesneleri daha küçük çizer.',
   'Görsel Sanatlar', 'ilkokul'),

  ('GS.3.2.2', 'Görsel Sanatlar', 3, 2, 'Biçimlendirme',
   'Farklı boya ve malzemeleri amaca uygun kullanabilme',
   'a) Sulu boya, pastel ve kurşun kalem arasından uygun olanı seçer. b) Seçtiği malzemeyle özgün eser oluşturur.',
   'Görsel Sanatlar', 'ilkokul'),

  ('GS.3.3.1', 'Görsel Sanatlar', 3, 3, 'Sanat Kültürü',
   'Yerel ve evrensel sanat eserlerini karşılaştırabilme',
   'a) Türk ve yabancı sanatçıların eserlerini tanır. b) Eserlerin benzer ve farklı özelliklerini söyler.',
   'Görsel Sanatlar', 'ilkokul'),

  -- ── Görsel Sanatlar 4. Sınıf (İlkokul) ─────────────────────────────────────
  ('GS.4.1.1', 'Görsel Sanatlar', 4, 1, 'Görsel İletişim',
   'Görsel mesaj içeren ürünleri analiz edebilme',
   'a) Afiş, illüstrasyon gibi ürünlerdeki mesajı anlar. b) Renk ve şeklin iletişimdeki rolünü fark eder.',
   'Görsel Sanatlar', 'ilkokul'),

  ('GS.4.2.1', 'Görsel Sanatlar', 4, 2, 'Biçimlendirme',
   'Seçtiği konuyu özgün bir sanat eserine dönüştürebilme',
   'a) Konu belirler, eskiz çizer. b) Uygun malzeme seçer. c) Eseri tamamlayarak sergiler.',
   'Görsel Sanatlar', 'ilkokul'),

  ('GS.4.2.2', 'Görsel Sanatlar', 4, 2, 'Biçimlendirme',
   'Heykel ve üç boyutlu çalışma yapabilme',
   'a) Kil veya hamurla üç boyutlu nesne oluşturur. b) Boşluk-kütle ilişkisini fark eder.',
   'Görsel Sanatlar', 'ilkokul'),

  ('GS.4.3.1', 'Görsel Sanatlar', 4, 3, 'Sanat Kültürü',
   'Anadolu medeniyetlerine ait sanat eserlerini tanıyabilme',
   'a) Hitit, Selçuklu ve Osmanlı dönemine ait eserleri tanır. b) Bu eserlerin kültürel önemini açıklar.',
   'Görsel Sanatlar', 'ilkokul')

) AS v(kod, brans, sinif, unite_no, unite_ad, ad, aciklama, ders, okul_tipi)
JOIN branslar b ON b.ad = v.brans
ON CONFLICT (kod) DO NOTHING;
