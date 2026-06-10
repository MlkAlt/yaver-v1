-- Migration 052: Yeni dersler + eksik kazanımlar
-- SOS.11.3.1 (Sosyoloji 11, eksik)
-- DKAB.12.3.5 (DK lise-12, eksik — PDF'de '112.3.5' olarak taranmıştı)
-- 13 İHVD (İnsan Hakları, Yurttaşlık ve Demokrasi — ilkokul 4, yeni ders)
-- 24 AST (Astronomi ve Uzay Bilimleri — lise 9, seçmeli, yeni ders)
-- 18 İÇYÇ (İklim, Çevre ve Yenilikçi Çözümler — lise 10, seçmeli, yeni ders)
-- 28 İBT (İslam Bilim Tarihi — ihl 11, seçmeli, yeni ders)
-- Toplam: +85 → 5607 kazanım
-- Kaynak: Sosyoloji_11.pdf, DK_lise.pdf, insan_haklari_vatandaslik.pdf,
--         astronımiveuzay.pdf, iklimçevre.pdf, islambilimtarh.pdf

INSERT INTO kazanimlar (kod, brans_id, sinif, unite_no, unite_ad, ad, ders, okul_tipi) VALUES

-- SOS.11.3.1 (Sosyoloji 11, ünite 3 — aralarında atlanmış)
('SOS.11.3.1', (SELECT id FROM branslar WHERE slug = 'felsefe' LIMIT 1), 11, 3, 'KÜLTÜR VE TOPLUMSAL YAPI', 'Kültürün işlevlerini yapılandırabilme', 'Sosyoloji', 'lise'),

-- DKAB.12.3.5 (DK lise-12, ünite 3 — PDF OCR ''112.3.5'' olarak taranmıştı)
('DKAB.12.3.5', (SELECT id FROM branslar WHERE slug = 'din_kulturu' LIMIT 1), 12, 3, 'GÜNCEL DİNÎ MESELELER', 'Enam suresinin 151-152. ayetlerinin mesajlarını yorumlayabilme', 'Din Kültürü ve Ahlak Bilgisi', 'lise'),

-- İHVD: İnsan Hakları, Yurttaşlık ve Demokrasi — ilkokul, sinif=4
('İHVD.4.1.1', (SELECT id FROM branslar WHERE slug = 'sinif_ogretmeni' LIMIT 1), 4, 1, 'ÇOCUK OLARAK HAKLARIMLA VARIM', 'Çocuk olmanın özelliklerini belirleyebilme', 'İnsan Hakları, Yurttaşlık ve Demokrasi', 'ilkokul'),
('İHVD.4.1.2', (SELECT id FROM branslar WHERE slug = 'sinif_ogretmeni' LIMIT 1), 4, 1, 'ÇOCUK OLARAK HAKLARIMLA VARIM', 'Çocuk haklarıyla ilgili kanıta dayalı olarak oluşturduğu ürünü paylaşabilme', 'İnsan Hakları, Yurttaşlık ve Demokrasi', 'ilkokul'),
('İHVD.4.1.3', (SELECT id FROM branslar WHERE slug = 'sinif_ogretmeni' LIMIT 1), 4, 1, 'ÇOCUK OLARAK HAKLARIMLA VARIM', 'İnsan olmanın getirdiği temel hak ve özgürlükleri yorumlayabilme', 'İnsan Hakları, Yurttaşlık ve Demokrasi', 'ilkokul'),
('İHVD.4.2.1', (SELECT id FROM branslar WHERE slug = 'sinif_ogretmeni' LIMIT 1), 4, 2, 'HAYATIMDA EŞİTLİK VE ADALET', 'Eşitlik kavramının anlamını sorgulayabilme', 'İnsan Hakları, Yurttaşlık ve Demokrasi', 'ilkokul'),
('İHVD.4.2.2', (SELECT id FROM branslar WHERE slug = 'sinif_ogretmeni' LIMIT 1), 4, 2, 'HAYATIMDA EŞİTLİK VE ADALET', 'Adalet ve eşitlik arasındaki ilişkiyi yorumlayabilme', 'İnsan Hakları, Yurttaşlık ve Demokrasi', 'ilkokul'),
('İHVD.4.2.3', (SELECT id FROM branslar WHERE slug = 'sinif_ogretmeni' LIMIT 1), 4, 2, 'HAYATIMDA EŞİTLİK VE ADALET', 'Fırsat eşitliğinin anlamını yorumlayabilme', 'İnsan Hakları, Yurttaşlık ve Demokrasi', 'ilkokul'),
('İHVD.4.3.1', (SELECT id FROM branslar WHERE slug = 'sinif_ogretmeni' LIMIT 1), 4, 3, 'ETKİN BİR VATANDAŞIM', 'Vatandaş olmanın getirdiği hak ve özgürlükleri yorumlayabilme', 'İnsan Hakları, Yurttaşlık ve Demokrasi', 'ilkokul'),
('İHVD.4.3.2', (SELECT id FROM branslar WHERE slug = 'sinif_ogretmeni' LIMIT 1), 4, 3, 'ETKİN BİR VATANDAŞIM', 'Etkin vatandaş olmanın gerektirdiği sorumlulukları belirleyebilme', 'İnsan Hakları, Yurttaşlık ve Demokrasi', 'ilkokul'),
('İHVD.4.3.3', (SELECT id FROM branslar WHERE slug = 'sinif_ogretmeni' LIMIT 1), 4, 3, 'ETKİN BİR VATANDAŞIM', 'Dijital vatandaşlığın gerektirdiği özellikleri belirleyebilme', 'İnsan Hakları, Yurttaşlık ve Demokrasi', 'ilkokul'),
('İHVD.4.3.4', (SELECT id FROM branslar WHERE slug = 'sinif_ogretmeni' LIMIT 1), 4, 3, 'ETKİN BİR VATANDAŞIM', 'Etkin bir vatandaş olarak toplumsal yardımlaşma faaliyetleri ile ilgili fikir üretebilme', 'İnsan Hakları, Yurttaşlık ve Demokrasi', 'ilkokul'),
('İHVD.4.4.1', (SELECT id FROM branslar WHERE slug = 'sinif_ogretmeni' LIMIT 1), 4, 4, 'HAYATIMDA DEMOKRASİ', 'Grup çalışmalarında karar alma süreçlerine katılarak grup dinamiğini sağlayabilme', 'İnsan Hakları, Yurttaşlık ve Demokrasi', 'ilkokul'),
('İHVD.4.4.2', (SELECT id FROM branslar WHERE slug = 'sinif_ogretmeni' LIMIT 1), 4, 4, 'HAYATIMDA DEMOKRASİ', 'Grup arkadaşları ile farklı fikirler hakkında müzakere edebilme', 'İnsan Hakları, Yurttaşlık ve Demokrasi', 'ilkokul'),
('İHVD.4.4.3', (SELECT id FROM branslar WHERE slug = 'sinif_ogretmeni' LIMIT 1), 4, 4, 'HAYATIMDA DEMOKRASİ', 'Seçme ve seçilme hakkı konusunda fikir üretebilme', 'İnsan Hakları, Yurttaşlık ve Demokrasi', 'ilkokul'),

-- AST: Astronomi ve Uzay Bilimleri — lise, sinif=9 (seçmeli)
('AST.1.1', (SELECT id FROM branslar WHERE slug = 'fizik' LIMIT 1), 9, 1, 'ASTRONOMİYE GİRİŞ', 'Astronominin bilimsel düşüncenin gelişmesindeki rolünü sorgulayabilme', 'Astronomi ve Uzay Bilimleri', 'lise'),
('AST.1.2', (SELECT id FROM branslar WHERE slug = 'fizik' LIMIT 1), 9, 1, 'ASTRONOMİYE GİRİŞ', 'Astronominin doğuşu ve gelişiminin nedenleri ile astronominin önemi hakkında tümevarımsal akıl yürütebilme', 'Astronomi ve Uzay Bilimleri', 'lise'),
('AST.1.3', (SELECT id FROM branslar WHERE slug = 'fizik' LIMIT 1), 9, 1, 'ASTRONOMİYE GİRİŞ', 'Astronomi tarihine damgasını vuran bilim insanlarının katkılarını yorumlayabilme', 'Astronomi ve Uzay Bilimleri', 'lise'),
('AST.1.4', (SELECT id FROM branslar WHERE slug = 'fizik' LIMIT 1), 9, 1, 'ASTRONOMİYE GİRİŞ', 'Astronominin ilişkili olduğu bilim dalları ile ilişkisini çözümleyebilme', 'Astronomi ve Uzay Bilimleri', 'lise'),
('AST.1.5', (SELECT id FROM branslar WHERE slug = 'fizik' LIMIT 1), 9, 1, 'ASTRONOMİYE GİRİŞ', 'Gözlem ve kuramın astronomideki önemini özetleyebilme', 'Astronomi ve Uzay Bilimleri', 'lise'),
('AST.1.6', (SELECT id FROM branslar WHERE slug = 'fizik' LIMIT 1), 9, 1, 'ASTRONOMİYE GİRİŞ', 'Teleskopları sınıflandırabilme', 'Astronomi ve Uzay Bilimleri', 'lise'),
('AST.2.1', (SELECT id FROM branslar WHERE slug = 'fizik' LIMIT 1), 9, 2, 'EVRENİN KEŞFİ', 'Gök cisimlerini karşılaştırabilme', 'Astronomi ve Uzay Bilimleri', 'lise'),
('AST.2.2', (SELECT id FROM branslar WHERE slug = 'fizik' LIMIT 1), 9, 2, 'EVRENİN KEŞFİ', 'Gök adaları sınıflandırabilme', 'Astronomi ve Uzay Bilimleri', 'lise'),
('AST.2.3', (SELECT id FROM branslar WHERE slug = 'fizik' LIMIT 1), 9, 2, 'EVRENİN KEŞFİ', 'Gök cisimleri arasındaki mesafeleri tahmin edebilme', 'Astronomi ve Uzay Bilimleri', 'lise'),
('AST.2.4', (SELECT id FROM branslar WHERE slug = 'fizik' LIMIT 1), 9, 2, 'EVRENİN KEŞFİ', 'Samanyolu gök adasının yapısını bir model oluşturarak yorumlayabilme', 'Astronomi ve Uzay Bilimleri', 'lise'),
('AST.2.5', (SELECT id FROM branslar WHERE slug = 'fizik' LIMIT 1), 9, 2, 'EVRENİN KEŞFİ', 'Güneş sisteminin özelliklerini özetleyebilme', 'Astronomi ve Uzay Bilimleri', 'lise'),
('AST.2.6', (SELECT id FROM branslar WHERE slug = 'fizik' LIMIT 1), 9, 2, 'EVRENİN KEŞFİ', 'Yıldızların yaşam süreci hakkında tümevarımsal akıl yürütebilme', 'Astronomi ve Uzay Bilimleri', 'lise'),
('AST.3.1', (SELECT id FROM branslar WHERE slug = 'fizik' LIMIT 1), 9, 3, 'GÖK CİSİMLERİNİN GÖRÜNÜR HAREKETİ', 'Gök cisimlerinin hareketlerini açıklamakta kullanılan temel kavramları yorumlayabilme', 'Astronomi ve Uzay Bilimleri', 'lise'),
('AST.3.2', (SELECT id FROM branslar WHERE slug = 'fizik' LIMIT 1), 9, 3, 'GÖK CİSİMLERİNİN GÖRÜNÜR HAREKETİ', 'Gök cisimlerinin günlük görünür hareketlerinin nedeni hakkında tümevarımsal akıl yürütebilme', 'Astronomi ve Uzay Bilimleri', 'lise'),
('AST.3.3', (SELECT id FROM branslar WHERE slug = 'fizik' LIMIT 1), 9, 3, 'GÖK CİSİMLERİNİN GÖRÜNÜR HAREKETİ', 'Yer''in eksen eğikliği ve Güneş etrafındaki dolanımı nedeniyle Güneş''in yıllık görünür hareketine bağlı olarak, Güneş''in doğma ve batma noktalarının yıl boyunca değişimini ve izlediği yörüngeyi bilimsel gözlemlere dayalı olarak tahmin edebilme', 'Astronomi ve Uzay Bilimleri', 'lise'),
('AST.4.1', (SELECT id FROM branslar WHERE slug = 'fizik' LIMIT 1), 9, 4, 'KOZMOLOJİ', 'Evrenin oluşumuyla ilgili teoriler hakkında eleştirel düşünebilme', 'Astronomi ve Uzay Bilimleri', 'lise'),
('AST.4.2', (SELECT id FROM branslar WHERE slug = 'fizik' LIMIT 1), 9, 4, 'KOZMOLOJİ', 'Evrenin genişleme hızına ilişkin hesaplamalar yaparak evrenin geleceği ile ilgili bilimsel veriye dayalı tahminde bulunabilme', 'Astronomi ve Uzay Bilimleri', 'lise'),
('AST.4.3', (SELECT id FROM branslar WHERE slug = 'fizik' LIMIT 1), 9, 4, 'KOZMOLOJİ', 'Evrendeki büyük ölçekli yapılar ile ilgili bilgi toplayabilme', 'Astronomi ve Uzay Bilimleri', 'lise'),
('AST.4.4', (SELECT id FROM branslar WHERE slug = 'fizik' LIMIT 1), 9, 4, 'KOZMOLOJİ', 'Evrenin muhtemel sonu ile ilgili bilimsel verileri kullanarak farklı senaryolar hakkında tartışabilme', 'Astronomi ve Uzay Bilimleri', 'lise'),
('AST.5.1', (SELECT id FROM branslar WHERE slug = 'fizik' LIMIT 1), 9, 5, 'UZAY ARAŞTIRMALARI', 'Uzay çalışmalarının amacı ve tarihsel gelişimi ile ilgili bilgi toplayabilme', 'Astronomi ve Uzay Bilimleri', 'lise'),
('AST.5.2', (SELECT id FROM branslar WHERE slug = 'fizik' LIMIT 1), 9, 5, 'UZAY ARAŞTIRMALARI', 'Astronomide kullanılan uzay araçlarını uzaya gönderilme amaçları ve niteliklerine göre yorumlayabilme', 'Astronomi ve Uzay Bilimleri', 'lise'),
('AST.5.3', (SELECT id FROM branslar WHERE slug = 'fizik' LIMIT 1), 9, 5, 'UZAY ARAŞTIRMALARI', 'Uzay çalışmalarında kullanılmak üzere geliştirilen teknolojilerin günlük hayatta kullanımı ile ilgili tümevarımsal akıl yürütebilme', 'Astronomi ve Uzay Bilimleri', 'lise'),
('AST.5.4', (SELECT id FROM branslar WHERE slug = 'fizik' LIMIT 1), 9, 5, 'UZAY ARAŞTIRMALARI', 'Uzayda kolonileşmenin gerekçelerini ve sürece ilişkin ihtiyaçları, sürdürülebilirlik koşullarını, etkilerini yorumlayabilme', 'Astronomi ve Uzay Bilimleri', 'lise'),
('AST.5.5', (SELECT id FROM branslar WHERE slug = 'fizik' LIMIT 1), 9, 5, 'UZAY ARAŞTIRMALARI', 'Dünya dışı yaşamı sorgulayabilme', 'Astronomi ve Uzay Bilimleri', 'lise'),

-- İÇYÇ: İklim, Çevre ve Yenilikçi Çözümler — lise, sinif=10 (seçmeli)
('İÇYÇ.1.1', (SELECT id FROM branslar WHERE slug = 'cografya' LIMIT 1), 10, 1, 'İKLİM DEĞİŞİKLİĞİ', 'Küresel iklim sisteminde meydana gelen değişiklikleri yorumlayabilme', 'İklim, Çevre ve Yenilikçi Çözümler', 'lise'),
('İÇYÇ.2.1', (SELECT id FROM branslar WHERE slug = 'cografya' LIMIT 1), 10, 2, 'ÇEVRE VE İNSAN', 'Çevre bilincinin gelişim sürecini neden ve sonuçlarıyla yorumlayabilme', 'İklim, Çevre ve Yenilikçi Çözümler', 'lise'),
('İÇYÇ.2.2', (SELECT id FROM branslar WHERE slug = 'cografya' LIMIT 1), 10, 2, 'ÇEVRE VE İNSAN', 'Çevresel olay ya da olgu üzerinden çevre etiği yaklaşımlarını karşılaştırabilme', 'İklim, Çevre ve Yenilikçi Çözümler', 'lise'),
('İÇYÇ.2.3', (SELECT id FROM branslar WHERE slug = 'cografya' LIMIT 1), 10, 2, 'ÇEVRE VE İNSAN', 'Doğal kaynakların insan hayatındaki önemini özetleyebilme', 'İklim, Çevre ve Yenilikçi Çözümler', 'lise'),
('İÇYÇ.2.4', (SELECT id FROM branslar WHERE slug = 'cografya' LIMIT 1), 10, 2, 'ÇEVRE VE İNSAN', 'Ekolojik ayak izi ile biyolojik kapasite arasındaki ilişkiyi çözümleyebilme', 'İklim, Çevre ve Yenilikçi Çözümler', 'lise'),
('İÇYÇ.3.1', (SELECT id FROM branslar WHERE slug = 'cografya' LIMIT 1), 10, 3, 'ÇEVRE SORUNLARI', 'Çevre sorunlarına neden olan beşeri faaliyetleri yorumlayabilme', 'İklim, Çevre ve Yenilikçi Çözümler', 'lise'),
('İÇYÇ.3.2', (SELECT id FROM branslar WHERE slug = 'cografya' LIMIT 1), 10, 3, 'ÇEVRE SORUNLARI', 'Hava kirliliğinin çevresel etkilerini çözümleyebilme', 'İklim, Çevre ve Yenilikçi Çözümler', 'lise'),
('İÇYÇ.3.3', (SELECT id FROM branslar WHERE slug = 'cografya' LIMIT 1), 10, 3, 'ÇEVRE SORUNLARI', 'Su kıtlığı ve kirliliğinin çevresel etkilerini çözümleyebilme', 'İklim, Çevre ve Yenilikçi Çözümler', 'lise'),
('İÇYÇ.3.4', (SELECT id FROM branslar WHERE slug = 'cografya' LIMIT 1), 10, 3, 'ÇEVRE SORUNLARI', 'Toprak bozulmasının çevresel etkilerini çözümleyebilme', 'İklim, Çevre ve Yenilikçi Çözümler', 'lise'),
('İÇYÇ.3.5', (SELECT id FROM branslar WHERE slug = 'cografya' LIMIT 1), 10, 3, 'ÇEVRE SORUNLARI', 'Biyoçeşitlilik kaybının çevresel etkilerini yorumlayabilme', 'İklim, Çevre ve Yenilikçi Çözümler', 'lise'),
('İÇYÇ.4.1', (SELECT id FROM branslar WHERE slug = 'cografya' LIMIT 1), 10, 4, 'ÇEVRE SORUNLARINA YENİLİKÇİ ÇÖZÜMLERİN TEMELLERİ', 'Çevre hakkı ve katılımın önemini çözümleyebilme', 'İklim, Çevre ve Yenilikçi Çözümler', 'lise'),
('İÇYÇ.4.2', (SELECT id FROM branslar WHERE slug = 'cografya' LIMIT 1), 10, 4, 'ÇEVRE SORUNLARINA YENİLİKÇİ ÇÖZÜMLERİN TEMELLERİ', 'Mücadele stratejileri bağlamında çevre sorunlarına yönelik akıl yürütebilme', 'İklim, Çevre ve Yenilikçi Çözümler', 'lise'),
('İÇYÇ.4.3', (SELECT id FROM branslar WHERE slug = 'cografya' LIMIT 1), 10, 4, 'ÇEVRE SORUNLARINA YENİLİKÇİ ÇÖZÜMLERİN TEMELLERİ', 'Uluslararası çevre anlaşmalarının getirdiği sorumluluklar kapsamında ekonomik ve sosyal projeleri eleştirel düşünebilme', 'İklim, Çevre ve Yenilikçi Çözümler', 'lise'),
('İÇYÇ.4.4', (SELECT id FROM branslar WHERE slug = 'cografya' LIMIT 1), 10, 4, 'ÇEVRE SORUNLARINA YENİLİKÇİ ÇÖZÜMLERİN TEMELLERİ', 'Çevresel sürdürülebilirlik açısından yenilikçi projeleri neden ve sonuçlarıyla yorumlayabilme', 'İklim, Çevre ve Yenilikçi Çözümler', 'lise'),
('İÇYÇ.5.1', (SELECT id FROM branslar WHERE slug = 'cografya' LIMIT 1), 10, 5, 'ÇEVRE SORUNLARINA YENİLİKÇİ ÇÖZÜMLER GELİŞTİRME', 'Gözlemlediği çevre sorunlarından etkilenen paydaşlarla kurduğu empatiyi yansıtabilme', 'İklim, Çevre ve Yenilikçi Çözümler', 'lise'),
('İÇYÇ.5.2', (SELECT id FROM branslar WHERE slug = 'cografya' LIMIT 1), 10, 5, 'ÇEVRE SORUNLARINA YENİLİKÇİ ÇÖZÜMLER GELİŞTİRME', 'Çevre sorunlarına yenilikçi çözüm geliştirmeye yönelik tanımladığı çalışma problemini eleştirel düşünebilme', 'İklim, Çevre ve Yenilikçi Çözümler', 'lise'),
('İÇYÇ.5.3', (SELECT id FROM branslar WHERE slug = 'cografya' LIMIT 1), 10, 5, 'ÇEVRE SORUNLARINA YENİLİKÇİ ÇÖZÜMLER GELİŞTİRME', 'Çevre sorunlarının çözümü için tanımladığı probleme yönelik yenilikçi fikirler ortaya koyarak problemi çözebilme', 'İklim, Çevre ve Yenilikçi Çözümler', 'lise'),
('İÇYÇ.5.4', (SELECT id FROM branslar WHERE slug = 'cografya' LIMIT 1), 10, 5, 'ÇEVRE SORUNLARINA YENİLİKÇİ ÇÖZÜMLER GELİŞTİRME', 'Çevre sorunlarının çözümünde tanımladığı problem için geliştirdiği yenilikçi fikre yönelik model oluşturabilme', 'İklim, Çevre ve Yenilikçi Çözümler', 'lise'),

-- İBT: İslam Bilim Tarihi — ihl, sinif=11 (seçmeli)
('İBT.1.1', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 11, 1, 'YENİ BİR MEDENİYETİN DOĞUŞU', 'İslam biliminin temel kavramları ve genel özellikleri ile ilgili kaynağı yorumlayabilme', 'İslam Bilim Tarihi', 'ihl'),
('İBT.1.2', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 11, 1, 'YENİ BİR MEDENİYETİN DOĞUŞU', 'İslam''ın doğduğu ortamın kültürel, ekonomik ve dinî özelliklerini sentezleyebilme', 'İslam Bilim Tarihi', 'ihl'),
('İBT.1.3', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 11, 1, 'YENİ BİR MEDENİYETİN DOĞUŞU', 'İslam dünyasında bilimin gelişmesinde etkili olan unsurları yorumlayabilme', 'İslam Bilim Tarihi', 'ihl'),
('İBT.1.4', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 11, 1, 'YENİ BİR MEDENİYETİN DOĞUŞU', 'Şehirlerin bilim, sanat ve irfana etkisi ile ilgili bilgi toplayabilme', 'İslam Bilim Tarihi', 'ihl'),
('İBT.1.5', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 11, 1, 'YENİ BİR MEDENİYETİN DOĞUŞU', 'İslami ilimlerin oluşumunu kaynağından inceleyebilme', 'İslam Bilim Tarihi', 'ihl'),
('İBT.1.6', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 11, 1, 'YENİ BİR MEDENİYETİN DOĞUŞU', 'Teoriden pratiğe İslam dünyasında bilime yönelik ilk çalışma alanları ile ilgili çıkarım yapabilme', 'İslam Bilim Tarihi', 'ihl'),
('İBT.1.7', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 11, 1, 'YENİ BİR MEDENİYETİN DOĞUŞU', 'İslam dünyasında tercüme faaliyetlerinin nedenlerini sorgulayabilme', 'İslam Bilim Tarihi', 'ihl'),
('İBT.1.8', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 11, 1, 'YENİ BİR MEDENİYETİN DOĞUŞU', 'Bilim alanlarını yeniden sınıflandırabilme', 'İslam Bilim Tarihi', 'ihl'),
('İBT.2.1', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 11, 2, 'İSLAM BİLİMİNDE KURUMSALLAŞMA VE İHTİSASLAŞMA', 'Yeni siyasi, iktisadi, kültürel yapılanma ve ilim merkezlerinin oluşumu ile ilgili kaynağı yorumlayabilme', 'İslam Bilim Tarihi', 'ihl'),
('İBT.2.2', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 11, 2, 'İSLAM BİLİMİNDE KURUMSALLAŞMA VE İHTİSASLAŞMA', 'İslam dünyasında ilk medreselerin kuruluş nedenlerini sorgulayabilme', 'İslam Bilim Tarihi', 'ihl'),
('İBT.2.3', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 11, 2, 'İSLAM BİLİMİNDE KURUMSALLAŞMA VE İHTİSASLAŞMA', 'İslam bilim tarihinde gözlem ve deneye yönelimi tarihsel bağlamsallaştırma ile değerlendirebilme', 'İslam Bilim Tarihi', 'ihl'),
('İBT.2.4', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 11, 2, 'İSLAM BİLİMİNDE KURUMSALLAŞMA VE İHTİSASLAŞMA', 'İslam dünyasında gök bilimi, matematik, fen, sağlık bilimleri ve sosyal bilimler alanında yapılan çalışmaları yorumlayabilme', 'İslam Bilim Tarihi', 'ihl'),
('İBT.2.5', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 11, 2, 'İSLAM BİLİMİNDE KURUMSALLAŞMA VE İHTİSASLAŞMA', 'İslam dünyasında yapılan teknik ürünlerle ilgili analojik akıl yürütebilme', 'İslam Bilim Tarihi', 'ihl'),
('İBT.3.1', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 11, 3, 'ENDÜLÜSTE İSLAM BİLİMİNİN GELİŞİMİ', 'Endülüs Bilim Havzası''nda yapılan bilimsel çalışmalar ile ilgili kaynaklardan bilgi toplayabilme', 'İslam Bilim Tarihi', 'ihl'),
('İBT.3.2', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 11, 3, 'ENDÜLÜSTE İSLAM BİLİMİNİN GELİŞİMİ', 'Harita üzerinden İslam biliminin Avrupa''ya geçiş yolları ile ilgili çıkarım yapabilme', 'İslam Bilim Tarihi', 'ihl'),
('İBT.3.3', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 11, 3, 'ENDÜLÜSTE İSLAM BİLİMİNİN GELİŞİMİ', 'İslam biliminin Avrupa''da yeni bir medeniyetin doğuşuna etkisini yorumlayabilme', 'İslam Bilim Tarihi', 'ihl'),
('İBT.4.1', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 11, 4, 'DEĞİŞEN DÜNYADA İSLAM BİLİMİ', 'Türkistan Bilim Havzası''ndaki bilimsel çalışmaları tarihsel bağlamda değerlendirebilme', 'İslam Bilim Tarihi', 'ihl'),
('İBT.4.2', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 11, 4, 'DEĞİŞEN DÜNYADA İSLAM BİLİMİ', 'Haçlı saldırılarının bilimin Batı''ya geçişindeki etkilerini yapılandırabilme', 'İslam Bilim Tarihi', 'ihl'),
('İBT.4.3', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 11, 4, 'DEĞİŞEN DÜNYADA İSLAM BİLİMİ', 'Büyük Selçuklular, Birinci Beylikler ve Türkiye Selçukluları Dönemi bilimsel çalışmaları ile ilgili tümevarımsal akıl yürütebilme', 'İslam Bilim Tarihi', 'ihl'),
('İBT.5.1', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 11, 5, 'OSMANLILARDA BİLİMSEL ÇALIŞMALAR', 'Erken Dönem Osmanlı bilim anlayışının oluşumunu ve Türkçenin bilim dili hâline gelme sürecini tarihsel bağlamsallaştırma ile değerlendirebilme', 'İslam Bilim Tarihi', 'ihl'),
('İBT.5.2', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 11, 5, 'OSMANLILARDA BİLİMSEL ÇALIŞMALAR', 'İstanbul''un bilim merkezi hâline gelme sürecindeki unsurları yapılandırabilme', 'İslam Bilim Tarihi', 'ihl'),
('İBT.5.3', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 11, 5, 'OSMANLILARDA BİLİMSEL ÇALIŞMALAR', 'Takıyyüddin Rasıd ve İstanbul Rasathanesinin açılışı ve yapılan çalışmalar ile ilgili tartışabilme', 'İslam Bilim Tarihi', 'ihl'),
('İBT.5.4', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 11, 5, 'OSMANLILARDA BİLİMSEL ÇALIŞMALAR', 'Osmanlı Devleti''nde coğrafya, haritacılık, kartografya ve tıp alanında yapılan çalışmaları kaynaklardan inceleyebilme', 'İslam Bilim Tarihi', 'ihl'),
('İBT.5.5', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 11, 5, 'OSMANLILARDA BİLİMSEL ÇALIŞMALAR', 'Osmanlı Devleti''nde yeni eğitim kurumlarının açılış nedenlerini ve yeni bilimsel anlayışı sorgulayabilme', 'İslam Bilim Tarihi', 'ihl'),
('İBT.5.6', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 11, 5, 'OSMANLILARDA BİLİMSEL ÇALIŞMALAR', 'XVIII-XIX. yüzyılda eğitim ve bilim alanında faaliyet gösteren bilim insanlarının çalışmaları hakkında kaynaklardan bilgi toplayabilme', 'İslam Bilim Tarihi', 'ihl'),
('İBT.5.7', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 11, 5, 'OSMANLILARDA BİLİMSEL ÇALIŞMALAR', 'Osmanlı Devleti''nde modern yapılanmanın ve Rasathâne-i Âmire''de yapılan çalışmaların günümüze etkilerini değerlendirebilme', 'İslam Bilim Tarihi', 'ihl'),
('İBT.6.1', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 11, 6, 'CUMHURİYET DÖNEMİ BİLİMSEL ÇALIŞMALARI', 'Cumhuriyet Dönemi bilim politikalarını ve yeni kurulan bilim kurumlarının çalışmalarını yorumlayabilme', 'İslam Bilim Tarihi', 'ihl'),
('İBT.6.2', (SELECT id FROM branslar WHERE slug = 'ihl_meslek_dersleri' LIMIT 1), 11, 6, 'CUMHURİYET DÖNEMİ BİLİMSEL ÇALIŞMALARI', 'Cumhuriyet Dönemi bilim insanlarının çalışmaları hakkında kaynaklardan bilgi toplayabilme', 'İslam Bilim Tarihi', 'ihl')

ON CONFLICT (kod) DO UPDATE SET
  ad = EXCLUDED.ad,
  brans_id = EXCLUDED.brans_id,
  sinif = EXCLUDED.sinif,
  unite_no = EXCLUDED.unite_no,
  unite_ad = EXCLUDED.unite_ad,
  ders = EXCLUDED.ders,
  okul_tipi = EXCLUDED.okul_tipi;
