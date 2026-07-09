// Kulüp Yıllık Çalışma Planı — EK-7/b içerik havuzu
// Format: AYLIK (Eylül → Haziran, 10 satır) — gerçek okul planlarıyla hizalı.
// Strateji: Eylül/Ekim/Ocak/Haziran ortak şablondan, diğer 6 ay kulübe özgü.
// İçerik kaynağı: gerçek okul belgelerinden türetildi (Karatay TMTAL, 2025-2026;
// Eylül içeriği KULUP_YILLIK_1_0.docx + KULUP_YILLIK_2_142670.docx örneklerinden —
// iki farklı kulübün Eylül satırları birebir aynı temayı taşıyor: kulübün
// tanıtılması, üye/öğrenci seçimi, iç tüzük ve yönetim/denetleme kurulunun
// belirlenmesi, sosyal kulüp panosunun hazırlanması — bu yüzden tüm kulüplerde
// ortak kullanılabilir).
import { KulupEtkinlikSatiri, ToplumHizmetSatiri } from './kulupSablon';

type AyIkili = [amac: string, etkinlikler: string];

// Kulübe özgü 6 ayın içeriği + Ekim için ek amaç/etkinlik
interface KulupProfil {
  kasim:  AyIkili;
  aralik: AyIkili;
  subat:  AyIkili;
  mart:   AyIkili;
  nisan:  AyIkili;
  mayis:  AyIkili;
  ekimEkstra?: AyIkili; // Ekim ortak şablona eklenen kulübe özgü kısım
}

// ── EK-8 Belirli Gün ve Haftalar (ay başına sabit referans) ─────────────────
const EK8: Record<string, string> = {
  EYLÜL:
    'Uluslararası Temiz Hava Günü (7 Eylül)\n' +
    'İlköğretim Haftası (Eylül ayının 3. haftası)\n' +
    'Mevlid-i Nebî Haftası\n' +
    'Öğrenciler Günü (17 Eylül)\n' +
    'Gaziler Günü (19 Eylül)\n' +
    'Dünya Disleksi Günü (Eylül ayının son haftası)',
  EKİM:
    'Hayvanları Koruma Günü (4 Ekim)\n' +
    'Ahilik Kültürü Haftası (8-12 Ekim)\n' +
    'Cumhuriyet Bayramı (29 Ekim)\n' +
    'Kızılay Haftası (29 Ekim–4 Kasım)',
  KASIM:
    'Kızılay Haftası (29 Ekim–4 Kasım)\n' +
    'Organ Bağışı ve Nakli Haftası (3-9 Kasım)\n' +
    'Lösemili Çocuklar Haftası (2-8 Kasım)\n' +
    'Atatürk Haftası (10-16 Kasım)\n' +
    'Dünya Çocuk Hakları Günü (20 Kasım)\n' +
    'Öğretmenler Günü (24 Kasım)',
  ARALIK:
    'Dünya Engelliler Günü (3 Aralık)\n' +
    'İnsan Hakları ve Demokrasi Haftası (10 Aralık)\n' +
    'Tutum, Yatırım ve Türk Malları Haftası (12-18 Aralık)',
  OCAK:
    'Enerji Tasarrufu Haftası (Ocak ayının 2. haftası)',
  ŞUBAT:
    'Sivil Savunma Günü (28 Şubat)',
  MART:
    'Yeşilay Haftası (1 Mart)\n' +
    'Girişimcilik Haftası (Mart ayının ilk haftası)\n' +
    'Dünya Kadınlar Günü (8 Mart)\n' +
    'Bilim ve Teknoloji Haftası (8-14 Mart)\n' +
    "İstiklâl Marşı'nın Kabulü ve Mehmet Akif Ersoy'u Anma Günü (12 Mart)\n" +
    'Tüketiciyi Koruma Haftası (15-21 Mart)\n' +
    'Şehitler Günü (18 Mart)\n' +
    'Orman Haftası (21-26 Mart)\n' +
    'Dünya Tiyatrolar Günü (27 Mart)\n' +
    'Kütüphaneler Haftası (Mart ayının son pazartesi haftası)',
  NİSAN:
    'Kanser Haftası (1-7 Nisan)\n' +
    'Dünya Otizm Farkındalık Günü (2 Nisan)\n' +
    'Kişisel Verileri Koruma Günü (7 Nisan)\n' +
    'Dünya Sağlık Günü/Haftası (7-13 Nisan)\n' +
    'Turizm Haftası (15-22 Nisan)\n' +
    '23 Nisan Ulusal Egemenlik ve Çocuk Bayramı\n' +
    'Dünya Fikrî Mülkiyet Günü (26 Nisan)',
  MAYIS:
    'Bilişim Haftası (Mayıs ayının ilk haftası)\n' +
    'Trafik ve İlkyardım Haftası (Mayıs ayının ilk haftası)\n' +
    'İş Sağlığı ve Güvenliği Haftası (4-10 Mayıs)\n' +
    'Anneler Günü (Mayıs ayının 2. Pazarı)\n' +
    'Engelliler Haftası (10-16 Mayıs)\n' +
    'Müzeler Haftası (18-24 Mayıs)\n' +
    "19 Mayıs Atatürk'ü Anma, Gençlik ve Spor Bayramı",
  HAZİRAN:
    'Çevre Koruma Haftası (Haziran ayının 2. haftası)',
};

// ── Ortak Eylül/Ekim/Ocak/Haziran şablonları ────────────────────────────────
const ORTAK_EYLUL: AyIkili = [
  'Kulübün amacının açıklanması ve tanıtılması\n' +
  'Kulübe üye/öğrenci seçiminin yapılması\n' +
  'Kulüp iç tüzüğünün hazırlanması\n' +
  'Yönetim kurulu ve denetleme kurulunun seçilmesi',
  'Kulübün amacının açıklanması ve tanıtılması\n' +
  'Kulübe üye/öğrenci seçiminin yapılması\n' +
  'Kulüp iç tüzüğü ve kulüp çalışma programının hazırlanması\n' +
  'Yönetim kurulu ve denetleme kurulunun seçilmesi\n' +
  'Sosyal kulüp panosunun hazırlanması',
];

const ORTAK_EKIM_AMAC =
  'Kulübü tanıtmak ve üyeleri belirlemek\n' +
  'Kulüp genel kurulunun toplanması ve temsilci seçimi\n' +
  'Yıllık çalışma planının hazırlanması';

const ORTAK_EKIM_ETKINLIK =
  'Kulüp genel kurulunun toplanması ve kulüp temsilcisinin seçilmesi\n' +
  "Kulübün yıllık çalışma planının hazırlanarak okul müdürlüğüne sunulması\n" +
  'Cumhuriyet Bayramı (29 Ekim) kapsamında kulübün etkinliğe katkısı';

const ORTAK_OCAK: AyIkili = [
  '1. dönemde gerçekleştirilen etkinlikleri değerlendirmek\n' +
  '2. yarıyıl planlamasını gözden geçirmek\n' +
  'Enerji kaynaklarının doğru kullanımı konusunda farkındalık oluşturmak',
  '1. dönem etkinliklerinin değerlendirme toplantısı\n' +
  'Sosyal kulüple ilgili formların doldurulup değerlendirilmesi\n' +
  'Enerji Tasarrufu Haftası kapsamında kulüp faaliyeti',
];

const ORTAK_HAZIRAN: AyIkili = [
  'Yıl içinde gerçekleştirilen tüm etkinlikleri değerlendirmek\n' +
  'Kulüp dosyasını düzenlemek\n' +
  'Yıl sonu faaliyet raporunun hazırlanması',
  'Yıl içinde gerçekleştirilen etkinliklerin değerlendirme toplantısı\n' +
  "Yapılan çalışmaların bir rapor hâlinde okul müdürlüğüne sunulması\n" +
  'Kulüp dosyasının düzenlenmesi',
];

// ── Kulüp profilleri (6 özgün ay + isteğe bağlı Ekim eki) ──────────────────
const KULUP_PROFILLERI: Record<string, KulupProfil> = {

  // ── Grup 1 (Afet → Bilim) ──────────────────────────────────────────────

  'Afet Hazırlık Kulübü': {
    ekimEkstra: [
      'Afet türleri ve risk farkındalığı oluşturmak',
      'Deprem, yangın, sel gibi afet türlerinin tanıtımı ve risk haritası çalışması',
    ],
    kasim: [
      "Atatürk'ün afet yönetimine verdiği önemi kavratmak\nDoğal afetlerde dayanışma bilinci oluşturmak",
      "Atatürk Haftası kapsamında 'Modernleşme ve Afet Yönetimi' sunumu\nOrgan bağışı haftasıyla bağlantılı 'Hayatta Kalma ve Yardımlaşma' etkinliği",
    ],
    aralik: [
      'Kışa özgü afet risklerini tanıtmak\nAfet çantası hazırlığı bilincini yerleştirmek',
      'Soğuk hava, buz ve yangın riskleri üzerine bilgilendirme sunumu\nAfet çantası içeriği belirleme ve hazırlama çalışması\nOkul afet planının incelenmesi',
    ],
    subat: [
      'Sivil savunma uygulamaları konusunda deneyim kazandırmak\nTahliye prosedürlerini öğretmek',
      'Sivil Savunma Günü (28 Şubat) kapsamında sınıf içi bilgilendirme sunumu\nOkulun tahliye güzergâhları ve toplanma noktalarının pano üzerinde incelenmesi\nAfet anında doğru davranışlar konulu tartışma etkinliği',
    ],
    mart: [
      'Deprem bilinci ve dayanıklı yapı kavramını öğretmek\nOrman yangınlarına karşı farkındalık oluşturmak',
      'Deprem riski ve güvenli davranış kuralları sunumu\nOrman Haftası (21-26 Mart) kapsamında orman yangını önleme bilgilendirmesi\nAfet haritası hazırlama etkinliği',
    ],
    nisan: [
      'Temel ilk yardım becerisi kazandırmak\nAfet sonrası destek mekanizmalarını tanıtmak',
      'Dünya Sağlık Haftası (7-13 Nisan) bağlantılı temel ilk yardım bilgilendirme sunumu\nAfet sonrası psikolojik destek ve toparlanma süreci bilgilendirmesi',
    ],
    mayis: [
      'Yıl içi afet farkındalık çalışmalarını değerlendirmek\nKulüp çalışmalarını paylaşmak',
      'Yıl içi afet farkındalık çalışmalarının panoda sergilenmesi\n19 Mayıs etkinliklerine kulübün katkısı\nAfet bilinci konulu sınıf içi bilgi yarışması',
    ],
  },

  'Ahilik Kulübü': {
    ekimEkstra: [
      'Ahilik teşkilatını ve değerlerini tanıtmak',
      "Ahilik kültürü, fütüvvetnâme ve esnaf ahlâkı tanıtım sunumu\nCumhuriyet Bayramı (29 Ekim) kapsamında 'Millî Ekonomi ve Ahilik' etkinliği",
    ],
    kasim: [
      "Atatürk'ün millî ekonomi ve esnaf politikasını kavratmak\nAhilik'in günümüz mesleki değerlerine katkısını tartışmak",
      "Atatürk Haftası kapsamında 'Milli Ekonomi ve Ahilik' konulu sunum\nYerel esnafla dayanışma ve meslek ahlakı söyleşisi",
    ],
    aralik: [
      'Yerli üretim ve ticaret ahlakı bilincini güçlendirmek',
      'Tutum, Yatırım ve Türk Malları Haftası (12-18 Aralık) kapsamında Ahilik ve yerli üretim sunumu\nÇevremizdeki meslekler ve üretim süreçleri konulu araştırma ödevi ve sınıfta paylaşımı',
    ],
    subat: [
      'Ahilik yazılı geleneğini (fütüvvetnâme) tanıtmak\nMeslek ahlakı ilkelerini günümüze uyarlamak',
      'Fütüvvetnâme metinlerinden seçkiler inceleme etkinliği\n"Günümüzde Ahilik Değerleri" konulu tartışma oturumu',
    ],
    mart: [
      'Girişimcilik ve Ahilik bağını pekiştirmek\nÜretim ve emek değerlerini kavratmak',
      'Girişimcilik Haftası (Mart ayının ilk haftası) kapsamında Ahilik-girişimcilik ilişkisi sunumu\nÖğrencilerin meslek/iş fikri geliştirme çalışması',
    ],
    nisan: [
      'Ahilik geleneğini yaşayan örneklerle buluşturmak',
      'Aile büyüklerinden ve çevreden meslek hikâyeleri derleme ve sınıfta paylaşma\n23 Nisan kapsamında "Gençlik ve Üretim" temalı sunum',
    ],
    mayis: [
      'Yıl içi Ahilik çalışmalarını sergilemek',
      'Öğrenci sunumları ve el işi/zanaat ürünleri sergisi\nMeslek ve zanaat değerlerini anlatan yıl sonu programı',
    ],
  },

  'Astronomi ve Uzay Kulübü': {
    ekimEkstra: [
      'Gözlem ekipmanlarını tanıtmak ve gözlem takvimi oluşturmak',
      'Teleskop ve gözlem araçlarının görseller üzerinden tanıtımı\nYıl içi gökyüzü olayları takviminin hazırlanması',
    ],
    kasim: [
      "Uzay keşiflerinin tarihini ve Türkiye'nin uzay çalışmalarını tanıtmak",
      "Atatürk Haftası kapsamında 'Modernleşme ve Bilim' sunumu\nTürkiye Uzay Ajansı ve yerli uzay çalışmaları tanıtım sunumu\nGök cisimlerinden haberciler: meteor, kuyruklu yıldız sunumu",
    ],
    aralik: [
      'Kış gökyüzünü ve takımyıldızları tanıtmak',
      'Kış takımyıldızlarının yıldız haritası üzerinden tanıtımı\nOrion, Büyükayı ve Kutup Yıldızı konumlarını harita üzerinde bulma etkinliği\nÇıplak gözle gökyüzü gözlem günlüğü tutma uygulaması',
    ],
    subat: [
      'Güneş sistemi modelini uygulamalı olarak kavratmak',
      'Maket güneş sistemi yapım çalışması\nGezegen boyutları ve mesafeleri ölçek çalışması',
    ],
    mart: [
      'Bilim ve uzay teknolojileri arasındaki bağı pekiştirmek\nProje sunumu deneyimi kazandırmak',
      'Bilim ve Teknoloji Haftası (8-14 Mart) kapsamında uzay teknolojileri konulu poster çalışması\nKâğıt/karton malzemelerle maket roket veya uydu tasarımı',
    ],
    nisan: [
      'Astronomi bilgisini pekiştirmek ve paylaşmak',
      'Okul geneline açık astronomi quizi\n23 Nisan kapsamında "Geleceğin Uzay Bilimcileri" sunumu',
    ],
    mayis: [
      'Yıl sonu sanal gözlem etkinliği gerçekleştirmek\nKulüp çalışmalarını değerlendirmek',
      'Ücretsiz gökyüzü uygulamasıyla sınıf içi sanal gözlem etkinliği\n19 Mayıs kapsamında "Gençlik ve Bilim" temalı sunum\nGözlem günlüklerinin paylaşımı ve değerlendirme',
    ],
  },

  'Atatürkçü Düşünce Kulübü': {
    ekimEkstra: [
      "Cumhuriyet'in önemini kavratmak ve Atatürk ilkelerini tanıtmak",
      "Cumhuriyet Bayramı (29 Ekim) programı: konuşma, şiir, sunum hazırlığı ve sunumu\nAtatürk ilkeleri ve inkılapları bilgilendirme etkinliği",
    ],
    kasim: [
      "Atatürk'ü anmak ve onun milletimiz için önemini kavratmak\nÖğretmenler Günü'nde Atatürk'ün eğitime verdiği önemi vurgulamak",
      "Atatürk Haftası (10-16 Kasım) kapsamında kapsamlı anma programı: şiir, kompozisyon, sergi\n10 Kasım Atatürk'ü Anma törenine aktif katılım ve program sunumu\n24 Kasım Öğretmenler Günü kapsamında Atatürk'ün eğitim devrimine dair sunum",
    ],
    aralik: [
      "Cumhuriyet'in ilk yıllarındaki kültür ve harf devrimini kavratmak",
      "Harf inkılabı ve okuma-yazma seferberliği konulu sunum\nCumhuriyet dönemi kültür politikaları araştırma ve tartışma etkinliği",
    ],
    subat: [
      "Atatürk'ün kadın haklarına ve eğitime katkısını kavratmak",
      "Türk kadınının seçme-seçilme hakkı (5 Aralık anısı) ve Atatürk'ün katkısı sunumu\n2. yarıyıl kapsamında Atatürkçü düşünce ve çağdaşlaşma tartışma oturumu",
    ],
    mart: [
      "İstiklâl Marşı'mızın tarihini ve değerini kavratmak\nÇanakkale Zaferinin ulusal bilincimize katkısını anlatmak",
      "İstiklâl Marşı'nın Kabulü ve Mehmet Akif Ersoy'u Anma Günü (12 Mart) kapsamında özel program\nŞehitler Günü (18 Mart) ve Çanakkale Zaferi anma etkinliği",
    ],
    nisan: [
      "23 Nisan'ın Türk milletine ve dünya çocuklarına armağan edilmesinin önemini kavratmak",
      "23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kapsamında kulübün hazırladığı program sunumu\nAtatürk'ün çocuk sevgisi ve gençliğe güveni temalı sunum",
    ],
    mayis: [
      "19 Mayıs'ın milletimiz için önemini kavratmak\nAtatürk'ün gençliğe mesajını yaşatmak",
      "19 Mayıs Atatürk'ü Anma, Gençlik ve Spor Bayramı programı hazırlığı ve sunumu\nGençlik yemini ve Atatürk'ün gençliğe seslenişi etkinliği",
    ],
  },

  'Bilim Fen ve Teknoloji Kulübü': {
    ekimEkstra: [
      'Bilimsel düşünce ve gözlem yöntemlerini tanıtmak',
      'Bilimsel yöntem adımları ve deney tasarımı çalışması\nYıl içi proje konularının ön araştırması',
    ],
    kasim: [
      "Türk ve dünya bilim insanlarını tanıtmak\nBilimin modernleşmedeki rolünü kavratmak",
      "Atatürk Haftası kapsamında 'Modernleşme ve Bilim Devrimi' sunumu\nTürkiye'den ve dünyadan öncü bilim insanları araştırma ve paylaşım etkinliği",
    ],
    aralik: [
      'Fen deneyleri aracılığıyla merak ve gözlem becerisi geliştirmek',
      'Güvenli ve eğlenceli fen deneyleri çalışması (yanardağ, balon roketi vb.)\nDeney günlüğü tutma uygulaması\nProje konusu belirleme ve planlama toplantısı',
    ],
    subat: [
      'Bilim fuarı projesi geliştirmek\nDeney ve araştırma becerisi pekiştirmek',
      'Proje ekiplerinin oluşturulması ve deney planı hazırlama\nBilimsel hipotez kurma ve veri toplama çalışması',
    ],
    mart: [
      'Bilim ve Teknoloji Haftasında kulübü temsil etmek\nProje sergisi düzenlemek',
      'Bilim ve Teknoloji Haftası (8-14 Mart) kapsamında sınıf içi deney sunumları\nÖğrenci proje sunumları ve akran değerlendirmesi\nBilim panosu hazırlama etkinliği',
    ],
    nisan: [
      'Bilim fuarı sonuçlarını değerlendirmek\nİleri düzey araştırma konularını tanıtmak',
      'Bilim fuarı değerlendirme ve ödüllendirme toplantısı\n23 Nisan kapsamında "Geleceğin Bilim İnsanları" sunumu',
    ],
    mayis: [
      'Ulusal bilim etkinliklerini tanımak\nYıl içi çalışmaları paylaşmak',
      'TÜBİTAK 4006 gibi bilim etkinlikleri hakkında bilgilendirme sunumu\n19 Mayıs kapsamında bilim temalı pano hazırlanması\nYıl içi deney günlüklerinin ve proje dosyalarının sınıfta paylaşılması',
    ],
  },

  'Kültür ve Edebiyat Kulübü': {
    // Gerçek belgeden alınan içerik (Karatay TMTAL, 2025-2026)
    ekimEkstra: [
      'Edebi bilinç oluşturmak\nKütüphane demirbaşlarını belirlemek',
      "Kütüphanede yer alan demirbaş eşyaları ve mevcut kitapların tespitinin yapılması\nÖğrencilere Cumhuriyet tarihi konulu bilgilendirici çalışmalar",
    ],
    kasim: [
      "Atatürk'ün edebiyata verdiği önemi kavratmak\nKütüphaneden yararlanma bilincini geliştirmek\nÖğretmenler Günü'nün önemini kavratmak",
      "Atatürk haftası kapsamında bilgilendirici etkinlikler ve Atatürk kitaplarının tanıtılması\nKütüphaneden yararlanma esasları hakkında okul genelinde bilgilendirme\n24 Kasım Öğretmenler Günü programı sunulması ve pano hazırlığı",
    ],
    aralik: [
      "Millî kültür değerlerini yaşatmanın önemini kavratmak\nNasrettin Hoca'nın edebiyatımızdaki yerini tanıtmak\nKitap okuma alışkanlığını teşvik etmek",
      "'Nasrettin Hoca' konulu bilgilendirici çalışmalar\nKulüp panosunda kitap okuma alışkanlığının önemini belirten yazı, şiir, resim sergilenmesi\nKütüphanelerimizin internet adresleri ile Mevlana Haftası için pano düzenlenmesi",
    ],
    subat: [
      "Öğrencilerin planlı çalışmanın önemini kavramasını sağlamak\nKitap okuma alışkanlığını desteklemek",
      "2. yarıyılda yapılacak çalışmaların gözden geçirilmesi\nKulüp öğrencileriyle kitap incelemeleri\n'Korkma Gençliğin Ruhu Burada!' projesi kapsamında Mehmet Akif Ersoy kompozisyon yarışması bilgilendirmesi",
    ],
    mart: [
      "Kütüphaneden yararlanma bilincini güçlendirmek\nİstiklâl Marşı şairi Mehmet Akif Ersoy'u tanıtmak\nOrmanların önemini kavratmak",
      "Kütüphaneler Haftası kapsamında etkinlik düzenlenmesi ve öğrencilere kütüphaneden nasıl faydalanılacağı hakkında bilgi verilmesi\nİstiklâl Marşı'nın kabulü (12 Mart) kapsamında M. Akif Ersoy hayatı ve eserleri sunumu\nOrman Haftası bağlantılı kitap/doğa temalı pano ve afiş çalışması",
    ],
    nisan: [
      "23 Nisan'ın önemini ve ulusal egemenlik bilincini kavratmak\nBoş zamanları kitap okuma ile değerlendirme alışkanlığı kazandırmak",
      "23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kapsamında sunum hazırlanması\nÖğrenciler tarafından hazırlanan bilmece ve bulmacaların kulüp panosunda sergilenmesi\nMimar Sinan'ın hayatı ve eserleri konulu tartışma etkinliği",
    ],
    mayis: [
      "Atatürk'ün gençliğe yönelik mesajını kavratmak\nÇocukları kitaplarla tanıştırmak\nGerekli kulüp evraklarını hazırlamak",
      "19 Mayıs Atatürk'ü Anma, Gençlik ve Spor Bayramı konulu sunum\n'Çocuk ve Kitap' temalı yazı ve resimlerin kulüp panosunda sergilenmesi\nKulübe ait yıllık evrakların düzenlenmesi",
    ],
  },

  'Kızılay Kulübü': {
    kasim: [
      'Kan bağışı ve dayanışma bilincini güçlendirmek\nKızılay Haftası etkinliklerine katkı sağlamak',
      'Kızılay Haftası (29 Ekim–4 Kasım) kapsamında pano hazırlanması\nKan bağışının önemi üzerine bilgilendirme sunumu\nAtatürk Haftası etkinliklerinde kulübün katkısı',
    ],
    aralik: [
      'İhtiyaç sahiplerine yardım bilincini geliştirmek\nInsani yardım faaliyetlerini tanıtmak',
      'Kışlık kıyafet/eşya bağış kampanyası planlanması ve duyurusu\nYardım kampanyasının okul genelinde uygulamaya konulması',
    ],
    subat: [
      'Afet ve insani yardım bilincini pekiştirmek',
      'Afet senaryosu ve Kızılay\'ın afetlerdeki rolü sunumu\nSivil Savunma Günü (28 Şubat) kapsamında kulüp faaliyeti',
    ],
    mart: [
      'Toplumsal dayanışma kültürünü yaymak\nOrman ve çevre konusunda farkındalık oluşturmak',
      'Orman Haftası (21-26 Mart) kapsamında dayanışma ve doğa sevgisi konulu sunum\nOkul bahçesinde çevre temizliği etkinliği',
    ],
    nisan: [
      'Kan bağışı kampanyasını yaygınlaştırmak\n23 Nisan etkinliklerinde kulübü temsil etmek',
      'Kan bağışı konulu farkındalık panosu hazırlanması\n23 Nisan Ulusal Egemenlik ve Çocuk Bayramı etkinliklerine kulüp katkısı',
    ],
    mayis: [
      'Sosyal sorumluluk projesi sonuçlarını paylaşmak\nYıl içi çalışmaları raporlamak',
      'Yıl içi yardım kampanyalarının değerlendirme toplantısı\nEngelliler Haftası (10-16 Mayıs) kapsamında dayanışma etkinliği\n19 Mayıs etkinliklerine kulüp katkısı',
    ],
  },

  'Robotik Kodlama Kulübü': {
    kasim: [
      'Algoritmik düşünme becerisi geliştirmek\nTeknoloji okuryazarlığını artırmak',
      'Bilgisayarsız (unplugged) kodlama oyunları etkinliği\nAtatürk Haftası kapsamında teknoloji ve modernleşme temalı sunum',
    ],
    aralik: [
      'Proje fikri geliştirme becerisi kazandırmak',
      'Proje konularının belirlenmesi ve ekip oluşturma\nRobot bileşenlerinin (sensör, motor) görseller üzerinden tanıtımı',
    ],
    subat: [
      'Prototip geliştirme becerisi kazandırmak',
      'Kâğıt üzerinde robot tasarımı ve akış şeması çizme çalışması\nProje ilerleme değerlendirme toplantısı',
    ],
    mart: [
      'Bilim ve teknoloji farkındalığı oluşturmak\nProjeleri sergilemek',
      'Bilim ve Teknoloji Haftası (8-14 Mart) kapsamında proje poster sunumu\nProje geliştirme çalışmalarına devam',
    ],
    nisan: [
      'Proje tamamlama ve sunum becerisi kazandırmak',
      'Proje tamamlama ve test çalışmaları\n23 Nisan kapsamında teknoloji sergisi',
    ],
    mayis: [
      'Yıl sonu proje sunumu deneyimi kazandırmak',
      'Bilişim Haftası (Mayıs ilk haftası) kapsamında proje sunumu\nRobotik yarışmaları hakkında bilgilendirme sunumu\n19 Mayıs etkinliklerine kulüp katkısı',
    ],
  },

  'Çevre Koruma Kulübü': {
    kasim: [
      'Çevre kirliliği ve korunması konusunda bilinç oluşturmak',
      'Çevre kirliliğinin nedenleri ve çözümleri sunumu\nAtatürk Haftası kapsamında "Atatürk ve Çevre" temalı pano',
    ],
    aralik: [
      'Geri dönüşüm bilincini yerleştirmek\nIsrafi önlemeyi teşvik etmek',
      'Atık ayrıştırma ve geri dönüşüm çalışması\nOkul genelinde çevre bilinci afiş çalışması',
    ],
    subat: [
      'İklim değişikliği konusunda farkındalık oluşturmak',
      'İklim değişikliği ve küresel ısınma sunumu\nEko-ayak izi hesaplama çalışması',
    ],
    mart: [
      'Orman ve doğa bilincini pekiştirmek\nUygulamalı çevre katkısı sağlamak',
      'Orman Haftası (21-26 Mart) kapsamında orman sevgisi konulu pano hazırlama\nOkul bahçesi temizlik ve düzenleme çalışması',
    ],
    nisan: [
      'Çevre koruma sorumluluğunu davranışa dönüştürmek',
      'Dünya Sağlık Haftası bağlantılı "temiz çevre, sağlıklı yaşam" etkinliği\nGeri dönüşüm malzemeleriyle sanat çalışması',
    ],
    mayis: [
      'Yıl içi çevre katkısını değerlendirmek',
      'Çevre proje sunumları\n19 Mayıs kapsamında doğa yürüyüşü etkinliği\nYıl içi çevre katkılarının raporlanması',
    ],
  },

  'Spor Kulübü': {
    ekimEkstra: [
      'Branş belirleme ve fiziksel durum tespiti',
      'Kulüp öğrencilerinin fiziksel değerlendirmesi ve branş seçimi\nAntrenman programının oluşturulması',
    ],
    kasim: [
      'Fiziksel beceri ve takım ruhunu geliştirmek',
      'Düzenli antrenman çalışmaları\nOkul içi mini turnuva düzenlenmesi',
    ],
    aralik: [
      'Sportif disiplin kazandırmak\nYarışma deneyimi sağlamak',
      'Antrenman yoğunlaştırma çalışmaları\nOkul içi turnuva 1. aşamasının tamamlanması',
    ],
    subat: [
      'Müsabakaya hazırlık çalışmalarını sürdürmek',
      '2. dönem antrenman programının düzenlenmesi\nTaktik ve strateji çalışmaları',
    ],
    mart: [
      'Müsabaka deneyimi kazandırmak',
      'Okullar arası müsabakalara katılım hazırlığı\n"Sağlıklı yaşam için spor" temalı etkinlik',
    ],
    nisan: [
      'Müsabaka performansını değerlendirmek',
      'Katılınan müsabakaların değerlendirmesi\n23 Nisan etkinliklerinde spor gösterisi',
    ],
    mayis: [
      'Yıl sonu şampiyonasını tamamlamak',
      'Okul spor şampiyonası final müsabakaları\n19 Mayıs Atatürk\'ü Anma, Gençlik ve Spor Bayramı etkinliklerine katılım',
    ],
  },

  'Tiyatro Kulübü': {
    ekimEkstra: [
      'Oyuncu kadrosunu oluşturmak ve oyun seçimi yapmak',
      'Oyuncu seçmeleri ve ekip oluşturma\nYıl içinde sahnelenecek oyunun belirlenmesi',
    ],
    kasim: [
      'Temel sahne ve doğaçlama becerisi kazandırmak',
      'Doğaçlama egzersizleri ve sahne duruşu çalışması\nAtatürk Haftası için kısa anlamlı skeç çalışması',
    ],
    aralik: [
      'Prova disiplini ve metin ezber becerisi geliştirmek',
      'Oyun metni üzerinde çalışma ve metin analizi\nSahne düzeni ve kostüm planlaması',
    ],
    subat: [
      'Sahne performansını olgunlaştırmak',
      'Yoğunlaştırılmış prova çalışmaları\nKostüm ve sahne düzeni planlaması',
    ],
    mart: [
      'Dünya Tiyatrolar Günü\'nü kutlamak ve gösteri sunmak',
      'Dünya Tiyatrolar Günü (27 Mart) kapsamında okul içi gösteri hazırlığı\nGenerepetisyon ve son prova çalışmaları',
    ],
    nisan: [
      'Sahneyi geniş bir izleyici kitlesiyle paylaşmak',
      '23 Nisan kapsamında bölüm/okul tiyatro gösterisi\nGösteri sonrası izleyici değerlendirme oturumu',
    ],
    mayis: [
      'Yıl sonu gösterisini tamamlamak',
      'Yıl sonu büyük gösteri hazırlığı ve sahneleme\n19 Mayıs etkinliklerine sahne katkısı',
    ],
  },

  'Müzik Kulübü': {
    ekimEkstra: [
      'Ses gruplarını ve enstrüman ekiplerini oluşturmak',
      'Koro ve enstrüman gruplarının oluşturulması\nSes düzeyi ve yetenek tespiti',
    ],
    kasim: [
      'Müzikal beceriyi geliştirmek\nResmi anma günlerine katkı sağlamak',
      'Düzenli prova çalışmaları\n10 Kasım Atatürk\'ü Anma Töreni için müzik hazırlığı\n24 Kasım Öğretmenler Günü için müzik sunumu',
    ],
    aralik: [
      'Sahne deneyimi kazandırmak',
      'Yıl içi ilk konser/dinleti provaları\nAkustik ve sahne teknik çalışması',
    ],
    subat: [
      'Repertuvarı genişletmek ve performansı olgunlaştırmak',
      '2. yarıyıl repertuvar belirleme toplantısı\nYoğunlaştırılmış prova çalışmaları',
    ],
    mart: [
      'Müzik kültürünü paylaşmak',
      'İstiklâl Marşı\'nın Kabulü (12 Mart) kapsamında özel müzik sunumu\nOkul koridorlarında mini dinleti',
    ],
    nisan: [
      'Bahar konseri hazırlığını tamamlamak',
      '23 Nisan etkinliklerinde sahne performansı\nBahar konseri son prova çalışmaları',
    ],
    mayis: [
      'Yıl sonu konserini gerçekleştirmek',
      '19 Mayıs Atatürk\'ü Anma töreni müzik programı\nYıl sonu büyük konser/dinleti sunumu',
    ],
  },

  'Matematik Kulübü': {
    kasim: [
      'Problem çözme becerisi geliştirmek\nMatematik tarihini tanıtmak',
      'Yaratıcı problem çözme çalışması\nAtatürk Haftası kapsamında "Modernleşme ve Bilim" sunumu',
    ],
    aralik: [
      'Matematiği günlük hayatla ilişkilendirmek',
      'Matematik bulmacaları ve zekâ oyunları etkinliği\nSınıf içi problem çözme yarışması',
    ],
    subat: [
      'Yarışma hazırlığı yapmak',
      '2. yarıyıl matematik yarışma takviminin incelenmesi\nAlıştırma soruları çözme oturumu',
    ],
    mart: [
      'Bilim ve matematik bağını pekiştirmek',
      'Bilim ve Teknoloji Haftası kapsamında matematik proje sunumu\nOkul içi matematik yarışması hazırlığı',
    ],
    nisan: [
      'Matematik yarışmasını gerçekleştirmek',
      'Okul içi matematik yarışması\n23 Nisan kapsamında matematik temalı etkinlik',
    ],
    mayis: [
      'Yıl içi matematik çalışmalarını değerlendirmek',
      'Yıl içi çalışmaların değerlendirilmesi ve matematik oyunları etkinliği\n19 Mayıs etkinliklerine kulübün katkısı',
    ],
  },

  'Satranç Kulübü': {
    kasim: [
      'Satranç kurallarını pekiştirmek\nStrateji düşüncesini geliştirmek',
      'Temel açılışlar ve taktikler eğitimi\nKulüp üyeleri arası dostluk maçları',
    ],
    aralik: [
      'Turnuva deneyimi kazandırmak',
      'Okul içi satranç turnuvası 1. tur maçları\nTurnuva kuralları ve etik değerler sunumu',
    ],
    subat: [
      'Orta ve son oyun taktiklerini öğretmek',
      'Orta oyun stratejileri çalışması\n2. dönem turnuva takviminin oluşturulması',
    ],
    mart: [
      'İleri teknik becerileri kazandırmak',
      'Son oyun teknikleri ve mat kombinasyonları çalışması\nOkul satranç turnuvası yarı final maçları',
    ],
    nisan: [
      'Turnuva finalini gerçekleştirmek',
      'Okul satranç şampiyonası final maçları\nŞampiyon öğrencinin ödüllendirilmesi',
    ],
    mayis: [
      'Yıl sonu satranç etkinliği düzenlemek',
      'Yıl sonu sınıf içi satranç gösteri maçları\nYıl içi kulüp çalışmalarının değerlendirilmesi',
    ],
  },

  'Münazara Kulübü': {
    kasim: [
      'Temel münazara kurallarını öğretmek\nNedenleme ve argüman becerisi kazandırmak',
      'Temel münazara kuralları ve yapısı eğitimi\nKısa alıştırma münazaraları',
    ],
    aralik: [
      'Münazara pratiği kazandırmak',
      'Örnek konu ile deneme münazarası\nHakemlik ve değerlendirme kriterlerinin öğretilmesi',
    ],
    subat: [
      'Münazara stratejilerini geliştirmek',
      '2. dönem turnuva konularının belirlenmesi\nÇapraz sorgulama teknikleri çalışması',
    ],
    mart: [
      'Okul içi münazara turnuvasını başlatmak',
      'Okul içi münazara turnuvası 1. tur\nİzleyici ve hakem değerlendirme etkinliği',
    ],
    nisan: [
      'Turnuva finalini gerçekleştirmek',
      'Okul içi münazara turnuvası final\n23 Nisan kapsamında özel münazara gösterisi',
    ],
    mayis: [
      'Yıl sonu gösteri münazarası düzenlemek',
      'Yıl sonu gösteri münazarası (okul içi)\nYıl içi kulüp çalışmalarının değerlendirilmesi',
    ],
  },

  // ── Grup 2 + 3 ─────────────────────────────────────────────────────────────

  'Bilinçli Tüketici Kulübü': {
    ekimEkstra: [
      'Tüketici hakları ve bilinçli alışveriş kavramlarını tanıtmak',
      'Tüketici hakları ve sorumlu alışveriş konulu tanıtım sunumu\nKulüp yıllık çalışma planının hazırlanması',
    ],
    kasim: [
      'Reklam okur-yazarlığı ve manipülasyon farkındalığı oluşturmak',
      'Reklam dili ve tüketiciye yönelik manipülasyon teknikleri sunumu\nAtatürk Haftası kapsamında "Millî Ekonomi ve Yerli Üretim" sunumu',
    ],
    aralik: [
      'Yerli malı bilincini ve tasarruf alışkanlığını güçlendirmek',
      'Tutum, Yatırım ve Türk Malları Haftası (12-18 Aralık) kapsamında yerli ürün tanıtım etkinliği\nİsraf önleme ve ekonomik tüketim alışkanlıkları çalışması',
    ],
    subat: [
      'Tüketici aldatmacaları ve sahte ürün sorununu tanıtmak',
      'Sahte ürün ve internet dolandırıcılığı farkındalık sunumu\nTüketici şikâyet mekanizmaları araştırma etkinliği',
    ],
    mart: [
      'Tüketiciyi Koruma Haftasında aktif etkinlik düzenlemek',
      'Tüketiciyi Koruma Haftası (15-21 Mart) kapsamında bilinçli tüketici panosu hazırlama\nAlışveriş fişleri üzerinden fiyat karşılaştırma etkinliği',
    ],
    nisan: [
      'Sürdürülebilir tüketim bilinci oluşturmak',
      'Çevre dostu alışveriş ve geri dönüşüm ekonomisi sunumu\n23 Nisan kapsamında "Geleceğin Bilinçli Tüketicileri" sunumu',
    ],
    mayis: [
      'Yıl içi tüketici hakları çalışmalarını paylaşmak',
      'Kulüp çalışmalarının değerlendirme toplantısı\n19 Mayıs kapsamında "Bilinçli Gençlik, Güçlü Ekonomi" temalı etkinlik',
    ],
  },

  'Bilişim ve İnternet Kulübü': {
    ekimEkstra: [
      'Dijital okuryazarlık ve internet güvenliği temellerini tanıtmak',
      'İnternet güvenliği ve kişisel bilgi koruma konulu giriş sunumu\nYıl içi proje konularının belirlenmesi',
    ],
    kasim: [
      'Siber güvenlik ve güvenli internet kullanımı bilinci oluşturmak',
      'Güçlü şifre oluşturma, kimlik avı saldırıları konulu çalışma\nAtatürk Haftası kapsamında "Teknoloji ve Modernleşme" sunumu',
    ],
    aralik: [
      'Kişisel veri gizliliği ve dijital iz farkındalığı sağlamak',
      'Kişisel Verileri Koruma Günü (7 Nisan öncesi hazırlık) için araştırma başlatma\nSosyal medyada mahremiyet ve dijital iz konulu sunum',
    ],
    subat: [
      'Zararlı içerik ve siber zorbalıkla mücadele becerisi kazandırmak',
      'Siber zorbalık tanıma ve başa çıkma yöntemleri çalışması\nGüvenli internet kullanımı broşürü hazırlama etkinliği',
    ],
    mart: [
      'Yazılım ve kodlama alanında uygulama deneyimi kazandırmak',
      'Bilim ve Teknoloji Haftası (8-14 Mart) kapsamında öğrenci projelerinin sınıf içi sunumu\nBilgisayarsız kodlama ve algoritma oyunları etkinliği',
    ],
    nisan: [
      'Kişisel Verileri Koruma Günü etkinliği düzenlemek\nDijital okuryazarlığı yaygınlaştırmak',
      'Kişisel Verileri Koruma Günü (7 Nisan) kapsamında farkındalık panosu hazırlama\n23 Nisan kapsamında teknoloji temalı proje sunumu',
    ],
    mayis: [
      'Bilişim Haftasında kulübü temsil etmek\nYıl içi projeleri sergilemek',
      'Bilişim Haftası (Mayıs ayının ilk haftası) kapsamında proje poster sunumu\n19 Mayıs etkinliklerine kulübün katkısı',
    ],
  },

  'Çevre ve İklim Kulübü': {
    ekimEkstra: [
      'İklim değişikliği ve küresel ısınma kavramlarını tanıtmak',
      'İklim değişikliğinin nedenleri ve sonuçları konulu giriş sunumu\nEko-ayak izi hesaplama çalışması',
    ],
    kasim: [
      'Küresel iklim krizinin farkındalığını artırmak\nİklim adaleti kavramını tanıtmak',
      'COP zirvesi ve uluslararası iklim anlaşmaları konulu sunum\nAtatürk Haftası kapsamında "Çağdaşlaşma ve Çevre" temalı etkinlik',
    ],
    aralik: [
      'Enerji verimliliği ve yenilenebilir enerji bilincini yerleştirmek',
      'Güneş, rüzgâr, jeotermal enerji kaynakları tanıtım sunumu\nOkul enerji tasarrufu kampanyası planlama toplantısı',
    ],
    subat: [
      'Sürdürülebilir yaşam alışkanlıkları geliştirmek',
      'Sıfır atık ve sürdürülebilir tüketim çalışması\n2. dönem iklim projesi başlatma toplantısı',
    ],
    mart: [
      'Orman ve biyoçeşitliliği koruma bilincini güçlendirmek',
      'Orman Haftası (21-26 Mart) kapsamında orman ve iklim ilişkisi konulu sunum\nİklim değişikliğinin ekosistemlere etkisi konulu pano hazırlama',
    ],
    nisan: [
      'İklim değişikliğiyle mücadelede bireysel sorumluluk bilinci oluşturmak',
      'Dünya Sağlık Günü/Haftası (7-13 Nisan) bağlantılı "Sağlıklı Gezegen, Sağlıklı İnsan" etkinliği\n23 Nisan kapsamında iklim farkındalık panosu',
    ],
    mayis: [
      'Yıl içi iklim çalışmalarını raporlamak\nGelecek nesillere çevre aktarımı bilincini pekiştirmek',
      'Çevre Koruma Haftası (Haziran öncesi) için rapor hazırlığı başlatma\n19 Mayıs kapsamında "Gençlik ve İklim" temalı sunum',
    ],
  },

  'Çocuk Hakları Kulübü': {
    ekimEkstra: [
      'BM Çocuk Hakları Sözleşmesi ve temel çocuk haklarını tanıtmak',
      'BM Çocuk Hakları Sözleşmesi (1989) konulu giriş sunumu\nÇocuk haklarının 4 temel ilkesi araştırma etkinliği',
    ],
    kasim: [
      'Dünya Çocuk Hakları Günü\'nde farkındalık etkinliği düzenlemek\nÖğretmenler Günü\'nde eğitim hakkını vurgulamak',
      'Dünya Çocuk Hakları Günü (20 Kasım) kapsamında farkındalık etkinliği: sunum, pano, şiir okuma\nAtatürk Haftası ve Öğretmenler Günü (24 Kasım) kapsamında "Eğitim: Temel Bir Hak" etkinliği',
    ],
    aralik: [
      'İnsan hakları bağlamında çocuk haklarını pekiştirmek',
      'İnsan Hakları ve Demokrasi Haftası (10 Aralık) kapsamında çocuk hakları paneli\nÇocuk işçiliği ve yoksulluk farkındalık sunumu',
    ],
    subat: [
      'Dijital ortamda çocuk haklarını ve güvenliğini tanıtmak',
      'İnternette çocuk hakları: mahremiyet, güvenlik ve siber zorbalık sunumu\n2. dönem hak savunuculuğu projesi başlatma toplantısı',
    ],
    mart: [
      'Kız çocuklarının eğitim ve fırsat eşitliği hakkını güncellemek',
      'Dünya Kadınlar Günü (8 Mart) bağlantılı "Kız Çocukları ve Eğitim" sunumu\nÇocuk hakları ihlalleri araştırma ve sunum çalışması',
    ],
    nisan: [
      '23 Nisan\'da çocukların hak ve bayramını kutlamak',
      '23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kapsamında kulübün düzenlediği çocuk hakları programı\nDünya genelinde çocukların yaşam koşulları karşılaştırmalı sunum',
    ],
    mayis: [
      'Çocuk hakları savunuculuğu projesi sonuçlarını paylaşmak',
      'Engelliler Haftası (10-16 Mayıs) kapsamında "Engelsiz Çocukluk Hakkı" etkinliği\nYıl içi hak savunuculuğu çalışmalarının değerlendirme toplantısı',
    ],
  },

  'Değerler Kulübü': {
    ekimEkstra: [
      'Kulübün çalışacağı değerleri ve yıllık temayı belirlemek',
      'Türk ve evrensel değerler üzerine giriş sunumu\nYıl temasının öğrencilerle birlikte belirlenmesi',
    ],
    kasim: [
      'Atatürk\'ün değer anlayışını ve millî değerleri kavratmak\nÖğretmenlik değerlerini vurgulamak',
      'Atatürk Haftası kapsamında "Atatürk ve Değerler: Vatan, Millet, Bilim" sunumu\n24 Kasım Öğretmenler Günü kapsamında "Öğretmen: Değer Aktarıcısı" temalı program',
    ],
    aralik: [
      'Yardımlaşma ve paylaşım değerini davranışa dönüştürmek',
      'İnsan Hakları ve Demokrasi Haftası (10 Aralık) bağlantılı adalet ve eşitlik değerleri tartışması\nOkul içi yardımlaşma kampanyası organizasyonu',
    ],
    subat: [
      'Saygı, hoşgörü ve empati değerlerini pekiştirmek',
      'Empati ve bakış açısı alma oyunları çalışması\n"Farklılıklarımız Zenginliğimiz" temalı etkinlik',
    ],
    mart: [
      'Adalet ve dürüstlük değerlerini günlük yaşamla ilişkilendirmek',
      'Orman Haftası (21-26 Mart) bağlantılı doğaya saygı ve sorumluluk değerleri etkinliği\nÖrnek kişilik çalışması: tarihten değer önderleri sunumu',
    ],
    nisan: [
      'Vatanseverlik ve millî birlik değerlerini yaşatmak',
      '23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kapsamında "Değerlerle Büyüyen Bir Millet" programı\nMilli değerler temalı şiir/kompozisyon okuma etkinliği',
    ],
    mayis: [
      'Yıl içi değerler çalışmalarını sergilemek ve değerlendirmek',
      '19 Mayıs kapsamında "Gençlik ve Değerler" temalı program\nYıl içi değer günlüklerinin ve proje dosyalarının sergilenmesi',
    ],
  },

  'Demokrasi ve İnsan Hakları Kulübü': {
    ekimEkstra: [
      'Demokrasi ve insan hakları kavramlarını tanıtmak',
      'Temel insan hakları ve demokrasinin tarihsel gelişimi sunumu\nOkul meclisi ve öğrenci hakları kavramının tanıtılması',
    ],
    kasim: [
      'Atatürk\'ün demokrasi anlayışını ve insan haklarına katkısını kavratmak',
      'Atatürk Haftası kapsamında "Cumhuriyet ve Demokrasi" sunumu\nKadın oy hakkı (5 Aralık anısı için hazırlık) araştırma etkinliği',
    ],
    aralik: [
      'İnsan Hakları ve Demokrasi Haftası kapsamında farkındalık etkinliği düzenlemek',
      'İnsan Hakları ve Demokrasi Haftası (10 Aralık) kapsamında sınıf içi sunum ve pano hazırlama\nEvrensel İnsan Hakları Beyannamesi inceleme etkinliği',
    ],
    subat: [
      'Seçim sistemi ve sivil katılım mekanizmalarını öğretmek',
      'Model seçim simülasyonu çalışması\n2. dönem okul meclisi etkinliklerini planlama toplantısı',
    ],
    mart: [
      'Kadın hakları ve toplumsal cinsiyet eşitliği konusunda farkındalık oluşturmak',
      'Dünya Kadınlar Günü (8 Mart) kapsamında kadın hakları ve eşitlik paneli\nOrman Haftası bağlantılı çevre hakkı sunumu',
    ],
    nisan: [
      '23 Nisan\'da ulusal egemenlik ve demokrasi bilincini pekiştirmek',
      '23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kapsamında demokrasi ve egemenlik temalı sunum\nSınıf içi örnek meclis oturumu canlandırması',
    ],
    mayis: [
      'Yıl içi demokrasi ve hak savunuculuğu çalışmalarını raporlamak',
      'Engelliler Haftası (10-16 Mayıs) kapsamında "Engelsiz Bir Demokrasi" etkinliği\n19 Mayıs kapsamında "Gençlik ve Demokratik Katılım" temalı program',
    ],
  },

  'e Twinning Kulübü': {
    ekimEkstra: [
      'eTwinning platformunu ve uluslararası proje ortaklıklarını tanıtmak',
      'eTwinning platformu kullanımı ve proje kayıt süreci tanıtım sunumu\nYıl içi uluslararası proje konusunun belirlenmesi',
    ],
    kasim: [
      'Uluslararası ortak okullarla ilk iletişimi başlatmak\nKültürlerarası öğrenme becerisi geliştirmek',
      'Ortak okul profil araştırması ve tanışma e-posta hazırlama\nAtatürk Haftası kapsamında "Türkiye\'yi Dünyaya Tanıtalım" sunumu',
    ],
    aralik: [
      'Proje temasını uluslararası ortakla birlikte geliştirmek',
      'Ortak ülkenin kültürü ve okulunu tanıma etkinliği\nProje aktivite takviminin ortakla birlikte planlanması',
    ],
    subat: [
      'Ortak ülkeyle ürün paylaşımı gerçekleştirmek',
      '2. yarıyıl proje aktivitelerini başlatma\nOrtak okuldan gelen materyallerin sınıfta değerlendirilmesi',
    ],
    mart: [
      'Proje çıktılarını görünür hâle getirmek\nAvrupa boyutunu vurgulamak',
      'Bilim ve Teknoloji Haftası bağlantılı eTwinning proje sonuçları sunumu\neTwinning etiketi (kalite etiketi) başvurusu hazırlığı',
    ],
    nisan: [
      'Uluslararası proje kapanışını tamamlamak\n23 Nisan\'da kültürel paylaşım etkinliği düzenlemek',
      '23 Nisan kapsamında ortak ülkeyle sanal kültürel değişim etkinliği\nProje portfolyosu hazırlama ve yayınlama',
    ],
    mayis: [
      'eTwinning proje değerlendirmesini ve raporlamasını tamamlamak',
      'eTwinning portalında proje sonuçlarının yayınlanması\n19 Mayıs kapsamında uluslararası gençlik işbirliği temalı sunum',
    ],
  },

  'Enerji Verimliliği Kulübü': {
    ekimEkstra: [
      'Enerji türleri ve verimliliğin önemini tanıtmak',
      'Yenilenebilir ve yenilenmez enerji kaynakları karşılaştırmalı sunum\nOkul enerji tüketimini inceleme ve ölçüm çalışması',
    ],
    kasim: [
      'Türkiye\'nin enerji politikaları ve hedeflerini kavratmak',
      'Atatürk Haftası kapsamında "Kalkınma ve Enerji" sunumu\nTürkiye\'nin yenilenebilir enerji kapasitesi araştırma etkinliği',
    ],
    aralik: [
      'Isınma ve aydınlatmada enerji tasarrufu alışkanlıkları kazandırmak',
      'Tutum, Yatırım ve Türk Malları Haftası bağlantılı yerli enerji teknolojileri sunumu\nOkul binasında enerji israfı tespiti ve öneri raporu hazırlama',
    ],
    subat: [
      'Enerji tasarrufu kampanyası uygulamaya koymak',
      'Enerji Tasarrufu Haftası (Ocak anısına Şubat uygulama etkinliği)\n2. dönem okul enerji tasarrufu farkındalık çalışması başlatma',
    ],
    mart: [
      'Güneş enerjisi ve yenilenebilir teknolojilere ilgi oluşturmak',
      'Bilim ve Teknoloji Haftası (8-14 Mart) kapsamında güneş enerjisi maket projesi\nOrman Haftası bağlantılı yeşil enerji ve orman ilişkisi sunumu',
    ],
    nisan: [
      'Enerji verimliliği projesi çıktılarını sergilemek',
      'Dünya Sağlık Haftası bağlantılı "Temiz Enerji, Sağlıklı Yaşam" sunumu\n23 Nisan kapsamında enerji tasarrufu panosu',
    ],
    mayis: [
      'Okul enerji tüketim raporunu sunmak ve değerlendirmek',
      'Yıl içi enerji ölçüm verilerinin değerlendirme toplantısı\n19 Mayıs kapsamında "Gençlik ve Yeşil Enerji" temalı program',
    ],
  },

  'Engellilerle Dayanışma Kulübü': {
    ekimEkstra: [
      'Engel türleri ve sosyal model anlayışını tanıtmak',
      'Engellilik yaklaşımları: tıbbi model vs. sosyal model sunumu\nOkul çevresinde erişilebilirlik denetimi çalışması',
    ],
    kasim: [
      'Engellerle yaşayan bireylere duyarlılık ve empati geliştirmek',
      'Organ Bağışı ve Nakli Haftası (3-9 Kasım) bağlantılı "Engelsiz Bir Hayat" etkinliği\nAtatürk Haftası kapsamında "Atatürk ve Engellilere Yaklaşım" sunumu',
    ],
    aralik: [
      'Dünya Engelliler Günü kapsamında farkındalık etkinliği düzenlemek',
      'Dünya Engelliler Günü (3 Aralık) kapsamında farkındalık etkinliği: pano, şiir, sunum\nGöz bağıyla empati etkinliği ve farkındalık oyunları',
    ],
    subat: [
      'İşaret dili ve alternatif iletişim yöntemlerini tanıtmak',
      'Video destekli temel işaret dili ifadeleri öğrenme etkinliği\nEngellilerin günlük yaşamda karşılaştığı engeller araştırma sunumu',
    ],
    mart: [
      'Engelsiz okul ve toplum anlayışını yaygınlaştırmak',
      '"Engelsiz Okul" projesi: rampalar, asansörler ve erişilebilirlik önerileri raporu\nOrman Haftası bağlantılı "Doğada Engelsiz" etkinliği',
    ],
    nisan: [
      'Dünya Otizm Farkındalık Günü kapsamında etkinlik düzenlemek',
      'Dünya Otizm Farkındalık Günü (2 Nisan) kapsamında mavi temalı pano ve farkındalık sunumu\n23 Nisan kapsamında engelli bireyleri kapsayan çocuk bayramı programı',
    ],
    mayis: [
      'Engelliler Haftasında kapsamlı farkındalık etkinliği düzenlemek',
      'Engelliler Haftası (10-16 Mayıs) kapsamında kulübün hazırladığı farkındalık programı\nYıl içi dayanışma çalışmalarının değerlendirmesi',
    ],
  },

  'Felsefe ve Düşünce Eğitimi Kulübü': {
    ekimEkstra: [
      'Felsefenin ne olduğunu ve günlük yaşamdaki yerini tanıtmak',
      'Felsefe nedir? Temel sorular ve filozoflar tanıtım sunumu\nSokrates\'in diyalog yöntemini deneme çalışması',
    ],
    kasim: [
      'Atatürk\'ün felsefi düşünce anlayışını ve pozitivizme yaklaşımını kavratmak',
      'Atatürk Haftası kapsamında "Atatürk ve Akılcı Düşünce" sunumu\nAtatürkçülüğün felsefi temelleri tartışma oturumu',
    ],
    aralik: [
      'Etik ve değerler felsefesini günlük yaşamla ilişkilendirmek',
      'İnsan Hakları ve Demokrasi Haftası (10 Aralık) bağlantılı adalet felsefesi tartışması\nSosyal etik ikilemler: tartışma ve argüman çalışması',
    ],
    subat: [
      'Mantıksal düşünme ve argüman analizi becerisi geliştirmek',
      'Geçerli/geçersiz argüman analizi çalışması\nSafsata türleri ve eleştirel düşünme egzersizleri',
    ],
    mart: [
      'Bilgi felsefesi ve bilimsel düşünce ilişkisini kavratmak',
      'Bilim ve Teknoloji Haftası (8-14 Mart) bağlantılı "Bilim Nedir? Bilim Felsefesi" sunumu\nKütüphaneler Haftası bağlantılı "Bilgi ve Doğruluk" tartışma oturumu',
    ],
    nisan: [
      'Siyaset felsefesi ve demokrasi düşüncesini kavratmak',
      '23 Nisan kapsamında "Egemenlik ve Toplum Sözleşmesi" felsefe tartışması\nSınıf içi felsefe sohbeti etkinliği (Café Philo)',
    ],
    mayis: [
      'Yıl içi felsefi sorgulamaları ve üretilen argümanları derleyerek sunmak',
      '"Gençliğin Felsefi Manifestosu" hazırlama ve okuma etkinliği\n19 Mayıs kapsamında özgürlük ve bağımsızlık felsefesi sunumu',
    ],
  },

  'Fotoğrafçılık Kulübü': {
    ekimEkstra: [
      'Fotoğraf makinesi ve kompozisyon temellerini tanıtmak',
      'Telefon kamerasıyla temel çekim teknikleri sunumu\nTemel kompozisyon kuralları (üçte bir, çerçeveleme) örnek fotoğraflar üzerinden inceleme',
    ],
    kasim: [
      'Belgesel fotoğrafçılık ve anlatı oluşturma becerisi kazandırmak',
      'Atatürk Haftası kapsamında "Tarihî Anlar" fotoğraf arşivi inceleme\n10 Kasım anma törenini fotoğraflama görevi',
    ],
    aralik: [
      'Işık ve gölge kullanımı ile kış fotoğrafçılığı becerisi geliştirmek',
      'Işık ve gölge kullanımı konulu sunum ve örnek fotoğraf incelemesi\nKış temalı okul içi fotoğraf keşif turu',
    ],
    subat: [
      'Düzenleme ve post-prodüksiyon temellerini öğretmek',
      'Telefonla basit fotoğraf düzenleme uygulamalarının tanıtımı\n2. dönem pano sergisi konusunun belirlenmesi',
    ],
    mart: [
      'Doğa ve çevre fotoğrafçılığı pratiği kazandırmak',
      'Orman Haftası (21-26 Mart) kapsamında okul bahçesi/yakın doğa fotoğraf turu\nKütüphaneler Haftası bağlantılı "Kitap ve Fotoğraf" temalı sergi hazırlığı',
    ],
    nisan: [
      'Okul geneline açık fotoğraf sergisi düzenlemek',
      'Turizm Haftası (15-22 Nisan) bağlantılı okul ve çevresinde fotoğraf çekimi etkinliği\n23 Nisan Ulusal Egemenlik ve Çocuk Bayramı temalı pano fotoğraf sergisi',
    ],
    mayis: [
      'Yıl içi en iyi fotoğrafları sergilemek ve ödüllendirmek',
      'Yıl içi fotoğraf albümü/kataloğu hazırlama\n19 Mayıs kapsamında "Gençlik Gözünden Türkiye" fotoğraf sergisi',
    ],
  },

  'Geleneksel Çocuk Oyunları Kulübü': {
    ekimEkstra: [
      'Geleneksel Türk çocuk oyunlarını tanıtmak ve sınıflandırmak',
      'Yöresel oyunlar kataloğu oluşturma: top, ip, seksek, körebe ve diğerleri\nOyun kurallarının bölgeden bölgeye farklılığını araştırma',
    ],
    kasim: [
      'Geleneksel oyunların kültürel bellek açısından önemini kavratmak',
      'Atatürk Haftası kapsamında "Cumhuriyet Dönemi Çocuk Oyunları" sunumu\nYaşlı akrabalardan oyun derleme ödevi (sözlü tarih projesi)',
    ],
    aralik: [
      'İç mekân geleneksel oyunlarını öğretmek ve oynamak',
      'Dokuz taş, mangala gibi masa/zemin oyunları çalışması\nKış temalı geleneksel oyunlar turnuvası (1. aşama)',
    ],
    subat: [
      'Geleneksel oyunları yazılı olarak derlemek',
      'Oyun kurallarını yazılı derleme ve sınıf oyun kitapçığı hazırlama\n2. dönem okul içi oyun şenliği planlaması',
    ],
    mart: [
      'Geleneksel oyunları geniş katılımla tanıtmak',
      'Orman Haftası bağlantılı açık hava geleneksel oyunlar şenliği\nKütüphaneler Haftası kapsamında geleneksel oyunlar kitap köşesi hazırlama',
    ],
    nisan: [
      '23 Nisan\'da geleneksel çocuk oyunları şenliği düzenlemek',
      '23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kapsamında tüm okula açık geleneksel oyunlar şenliği\nTurizm Haftası bağlantılı "Oyunlarla Anadolu\'yu Keşfet" etkinliği',
    ],
    mayis: [
      'Yıl içi derlenen oyunları kitapçıkta toplamak',
      'Derlenen oyunların sınıf oyun kitapçığında toplanması\n19 Mayıs kapsamında gençlik ve oyun kültürü temalı pano sergisi',
    ],
  },

  'Geleneksel El Sanatları Kulübü': {
    ekimEkstra: [
      'Türk el sanatları dallarını tanıtmak ve yıllık çalışma konusunu belirlemek',
      'Tezhip, ebru, çini, halı-kilim, ahşap boyama tanıtım sunumu\nYıl içi odaklanılacak el sanatı dalının öğrencilerle birlikte seçilmesi',
    ],
    kasim: [
      'Seçilen el sanatı dalında temel teknik beceri kazandırmak',
      'Atatürk Haftası kapsamında "Cumhuriyet ve Geleneksel Sanatlar" sunumu\nKâğıt üzerinde basit motif çizme ve boyama çalışması',
    ],
    aralik: [
      'El sanatı pratiğini derinleştirmek\nGeleneksel desenlerin anlamını öğretmek',
      'Geleneksel motifler ve semboller araştırma etkinliği\nBasit malzemelerle (kâğıt, boya) bireysel çalışma başlangıcı',
    ],
    subat: [
      'Bireysel ürünü tamamlamak ve yeni teknikler denemek',
      'Bireysel ürünlerin tamamlanması ve sınıf içi küçük sergi\n2. dönem yeni teknik veya motif çalışması başlangıcı',
    ],
    mart: [
      'El sanatlarını kültür mirası perspektifiyle pekiştirmek',
      'Kütüphaneler Haftası bağlantılı el sanatları kitap köşesi hazırlama\nOrman Haftası bağlantılı doğal boyalar ve bitkisel motifler konulu sunum',
    ],
    nisan: [
      'Üretilen eserleri sergilemek',
      'Turizm Haftası (15-22 Nisan) kapsamında geleneksel el sanatları tanıtım panosu\n23 Nisan kapsamında yıl içi üretilen çalışmaların sınıf sergisi',
    ],
    mayis: [
      'Yıl içi üretilen eserleri belgelemek ve değerlendirmek',
      'El sanatları ürünleri fotoğraf kataloğunun hazırlanması\n19 Mayıs kapsamında "Gençlik ve El Sanatları Mirası" temalı etkinlik',
    ],
  },

  'Genç Yazarlar ve Şairler Kulübü': {
    ekimEkstra: [
      'Yaratıcı yazarlık ve şiir türlerini tanıtmak',
      'Türk edebiyatından seçme şiir ve öykü örnekleri inceleme\nYıl içi yazarlık temasının ve yayın projesinin belirlenmesi',
    ],
    kasim: [
      'Şiir yazma tekniklerini öğretmek\nAtatürk\'e adanmış edebî eserlerle tanışmak',
      'Atatürk Haftası kapsamında "Atatürk ve Edebiyat" antoloji inceleme\n10 Kasım anma töreninde üyelerden seçilen şiirlerin okunması\n24 Kasım Öğretmenler Günü için öğretmene şiir/mektup yazma çalışması',
    ],
    aralik: [
      'Öykü ve kısa roman tekniklerini uygulamalı öğretmek',
      'Olay örgüsü, karakter ve mekân oluşturma çalışması\nKısa öykü yazma yarışması (birinci tur)',
    ],
    subat: [
      'Yazılan eserleri gözden geçirmek ve düzenlemek',
      'Akran geri bildirimi ve düzeltme çalışması\n2. dönem kulüp yayını için içerik toplama başlangıcı',
    ],
    mart: [
      'Kütüphaneler Haftasında okuma-yazma kültürünü yaymak\nMehmet Akif Ersoy\'u edebî açıdan tanıtmak',
      'İstiklâl Marşı\'nın Kabulü (12 Mart) kapsamında Mehmet Akif Ersoy şiir inceleme ve yazma çalışması\nKütüphaneler Haftası kapsamında "En Sevdiğim Kitap" kısa yazı etkinliği',
    ],
    nisan: [
      'Kulüp yayınını (dergicik/broşür) hazırlamak ve dağıtmak',
      '23 Nisan kapsamında çocuk edebiyatından seçmeler okuma programı\nKulüp yayınının basımı ve okul geneline dağıtımı',
    ],
    mayis: [
      'Yıl içi yazılan eserleri sergilemek\nYazarlık deneyimini değerlendirmek',
      '"Genç Kalemler" yıl sonu sergisi ve okuma etkinliği\n19 Mayıs kapsamında bağımsızlık ve özgürlük temalı şiir okuma',
    ],
  },

  'Gezi Tanıtım ve Turizm Kulübü': {
    ekimEkstra: [
      'Türkiye\'nin turizm coğrafyasını ve değerlerini tanıtmak',
      'Türkiye\'nin UNESCO Dünya Mirası alanları tanıtım sunumu\nYıl içi sanal/gerçek gezi planının hazırlanması',
    ],
    kasim: [
      'Atatürk\'ün tarihsel mekânlarını ve kültürel mirasını keşfetmek',
      'Atatürk Haftası kapsamında Atatürk\'le özdeşleşen mekânlar sanal tur etkinliği\nAnatolia\'nın tarihi coğrafyası sunumu',
    ],
    aralik: [
      'Kış turizmi ve iç turizmin önemini kavratmak',
      'Kış turizminin ekonomik katkısı ve çevre dostu turizm sunumu\nTürkiye\'nin kayak merkezleri ve kış destinasyonları tanıtımı',
    ],
    subat: [
      'Turizm meslek alanlarını ve kariyer fırsatlarını tanıtmak',
      'Turizm ve otelcilik meslekleri kariyer paneli\nGezi rehberi olma simülasyon çalışması',
    ],
    mart: [
      'Şehir tarihi ve kültürel mirası yerinde keşfetmek',
      'Şehitler Günü (18 Mart) bağlantılı şehit anıtları ve tarihî mekânlar konulu görsel sunum\nŞehir tarihi araştırma ödevi ve sınıfta paylaşımı',
    ],
    nisan: [
      'Turizm Haftasında kapsamlı etkinlik düzenlemek',
      'Turizm Haftası (15-22 Nisan) kapsamında Türkiye tanıtım panosu ve fotoğraf sergisi\n23 Nisan kapsamında "Dünya\'dan Gelen Çocuklar — Türkiye\'yi Keşfet" etkinliği',
    ],
    mayis: [
      'Yıl içi gezi ve araştırma çalışmalarını sunmak',
      'Kulüp yıllık gezi raporu ve fotoğraf arşivinin tamamlanması\n19 Mayıs kapsamında "Gençlik Turizmde" temalı etkinlik',
    ],
  },

  'Girişimcilik Kulübü': {
    ekimEkstra: [
      'Girişimcilik kavramı ve Türkiye\'deki ekosistemi tanıtmak',
      'Girişimcilik nedir? Başarılı genç girişimci örnekleri sunumu\nYıl içi fikir geliştirme projesinin tanıtımı',
    ],
    kasim: [
      'Ahilik geleneğinden günümüz girişimciliğine köprü kurmak',
      'Atatürk Haftası kapsamında "Millî Ekonomi ve Girişimcilik" sunumu\nAhilik değerleri ve çağdaş iş ahlakı tartışması',
    ],
    aralik: [
      'İş fikri geliştirme ve pazar araştırması becerisi kazandırmak',
      'Tutum, Yatırım ve Türk Malları Haftası bağlantılı yerli girişimci başarı hikayeleri\nBeyin fırtınası ve iş fikri havuzu oluşturma çalışması',
    ],
    subat: [
      'İş planı hazırlama becerisi geliştirmek',
      'Temel iş planı bileşenleri: pazar, maliyet, gelir modeli çalışması\nProje ekiplerinin oluşturulması ve fikir seçimi',
    ],
    mart: [
      'Prototip ve sunum becerisi kazandırmak\nGirişimcilik Haftasında kulübü temsil etmek',
      'Girişimcilik Haftası (Mart ayının ilk haftası) kapsamında öğrenci iş fikirleri sunumu\nİş fikri poster/afiş hazırlama çalışması',
    ],
    nisan: [
      'Sınıf içi iş fikirleri yarışması düzenlemek',
      'Sınıf içi "Mini Girişim Yarışması": iş fikri sunumları ve değerlendirme\n23 Nisan kapsamında "Geleceğin Girişimcileri" panosu',
    ],
    mayis: [
      'Yıl içi girişimcilik deneyimini raporlamak',
      'İş planı portfolyolarının tamamlanması ve arşivlenmesi\n19 Mayıs kapsamında "Gençlik ve İnovasyon" temalı program',
    ],
  },

  'Görsel Sanatlar Kulübü': {
    ekimEkstra: [
      'Görsel sanatların dallarını tanıtmak ve yıllık proje konusunu belirlemek',
      'Resim, heykel, seramik, grafik tasarım dallarının tanıtım sunumu\nYıl içi odaklanılacak tekniğin ve sergi konusunun belirlenmesi',
    ],
    kasim: [
      'Atatürk portresi ve sanatsal anma geleneğini kavratmak',
      'Atatürk Haftası kapsamında "Sanat ve Cumhuriyet" konulu çalışma\n10 Kasım anma için Atatürk portresi resim çalışması',
    ],
    aralik: [
      'Renk teorisi ve kompozisyon ilkelerini uygulamalı öğretmek',
      'Renk çemberi ve zıt/uyumlu renk uygulamaları çalışması\nKış temalı kart/afiş tasarımı çalışması',
    ],
    subat: [
      'Farklı malzeme ve tekniklerle deneysel sanat pratiği kazandırmak',
      'Kolaj, suluboya, guaj karşılaştırmalı teknik çalışması\n2. dönem sergi hazırlığı planlama toplantısı',
    ],
    mart: [
      'Doğa ve çevre temalı eserler üretmek',
      'Orman Haftası (21-26 Mart) kapsamında doğa temalı resim/illüstrasyon çalışması\nKütüphaneler Haftası için kitap kapağı tasarım çalışması',
    ],
    nisan: [
      'Yıl içi eserleri geniş bir izleyici kitlesine sunmak',
      'Turizm Haftası bağlantılı Anadolu motifleri temalı sergi\n23 Nisan kapsamında yıl içi eserlerin pano sergisi',
    ],
    mayis: [
      'Yıl sonu sanat değerlendirmesi ve portföy hazırlamak',
      '"Genç Sanatçılar" yıl sonu sergisi ve ödüllendirme\n19 Mayıs kapsamında ulusal semboller temalı sanat etkinliği',
    ],
  },

  'Halk Oyunları Kulübü': {
    ekimEkstra: [
      'Türk halk oyunları bölgelerini ve figür temellerini tanıtmak',
      'Anadolu\'nun 7 bölgesinden karakteristik oyunlar tanıtım sunumu\nTemel figürler ve adımlar ilk prova çalışması',
    ],
    kasim: [
      'Düzenli prova ile figür ve ritim becerisi geliştirmek',
      'Haftalık prova programı başlatma ve Atatürk Haftası kapsamında anma törenine katkı\nÖğretmenler Günü (24 Kasım) için kısa halk oyunları gösterisi',
    ],
    aralik: [
      'Bölgesel kostüm ve kıyafet kültürünü öğretmek',
      'Halk oyunları kostümleri tanıtım ve giyinme çalışması\nYıl sonu gösterisi için oyun seçimi ve prova yoğunlaştırma',
    ],
    subat: [
      'Teknik performansı olgunlaştırmak\nBahara hazırlık provalarını yoğunlaştırmak',
      '2. dönem yoğunlaştırılmış prova takviminin uygulanması\nYıl sonu gösterisi için oyun repertuvarının belirlenmesi',
    ],
    mart: [
      'Okul genelinde gösteri sunmak',
      'İstiklâl Marşı\'nın Kabulü (12 Mart) ve Şehitler Günü (18 Mart) kapsamında halk oyunları gösterisi\n23 Nisan gösterisi için prova çalışmaları',
    ],
    nisan: [
      '23 Nisan kapsamında büyük gösteri sunmak',
      '23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kapsamında halk oyunları ana gösterisi\nGösteri sonrası değerlendirme toplantısı',
    ],
    mayis: [
      '19 Mayıs kutlamalarında kulübü temsil etmek\nYıl sonu değerlendirmesi yapmak',
      '19 Mayıs Atatürk\'ü Anma, Gençlik ve Spor Bayramı gösterisi\nYıl içi prova ve gösteri sürecinin değerlendirmesi',
    ],
  },

  'Hareketli Yaşam Kulübü': {
    ekimEkstra: [
      'Fiziksel aktivitenin sağlığa katkısını ve hareketsiz yaşam risklerini tanıtmak',
      'Fiziksel aktivite düzeyi ölçümü ve kişisel hedef belirleme çalışması\nYıl içi hareketlilik takip programının tanıtımı',
    ],
    kasim: [
      'Düzenli egzersiz alışkanlığı kazandırmak',
      'Atatürk Haftası kapsamında "Sağlıklı Beden, Sağlıklı Millet" sunumu\nOkul içi hareket molası kampanyasının başlatılması',
    ],
    aralik: [
      'İç mekân ve kış sporları seçeneklerini tanıtmak',
      'Kış aylarında evde yapılabilecek egzersizler çalışması\nOkul koridorlarında aktif mola noktaları için öneri listesi hazırlama',
    ],
    subat: [
      'Beslenme ve hareket ilişkisini kavratmak',
      'Sağlıklı beslenme ve fiziksel aktivite dengesi sunumu\n2. dönem kulüp hareketlilik yarışması başlatma',
    ],
    mart: [
      'Açık hava aktivitelerini ve doğa sporlarını tanıtmak',
      'Orman Haftası kapsamında okul bahçesinde yön bulma oyunu\nYeşilay Haftası bağlantılı "Sağlıklı Yaşam" panosu',
    ],
    nisan: [
      'Spor ve hareketin zihin sağlığına katkısını vurgulamak',
      'Dünya Sağlık Haftası (7-13 Nisan) kapsamında "Gün Boyu Hareket" farkındalık etkinliği ve adım sayma denemesi\n23 Nisan kapsamında spor gösterisi',
    ],
    mayis: [
      'Yıl içi hareketlilik artışını ölçmek ve değerlendirmek',
      'Trafik ve İlkyardım Haftası bağlantılı sağlıklı yaşam panosu\n19 Mayıs Atatürk\'ü Anma, Gençlik ve Spor Bayramı etkinliklerine aktif katılım',
    ],
  },

  'Havacılık Kulübü': {
    ekimEkstra: [
      'Uçuşun fiziğini ve Türk havacılık tarihini tanıtmak',
      'Bernoulli prensibi ve uçuşun temel ilkeleri deney çalışması\nTürk Hava Kuvvetleri ve sivil havacılık tarihi sunumu',
    ],
    kasim: [
      'Türkiye\'nin havacılık alanındaki gelişmelerini kavratmak',
      'Atatürk Haftası kapsamında "Atatürk ve Havacılık" sunumu\nHÜRJET, BAYRAKTAR ve yerli havacılık projeleri tanıtımı',
    ],
    aralik: [
      'Model uçak tasarım temellerini öğretmek',
      'Kâğıt uçak tasarımı ve uçuş denemeleri etkinliği\nUçuş mekaniği ve aerodinamik temel kavramlar sunumu',
    ],
    subat: [
      'Drone teknolojisi ve insansız hava araçlarını tanıtmak',
      'İHA/drone teknolojisi ve kullanım alanları sunumu\nKâğıt uçak tasarım yarışması (sınıf içi)',
    ],
    mart: [
      'Bilim ve teknoloji ile havacılık bağını güçlendirmek',
      'Bilim ve Teknoloji Haftası (8-14 Mart) kapsamında kâğıt uçak yarışması ve uçuş ilkeleri tartışması\nHavacılık mühendisliği kariyer bilgilendirmesi',
    ],
    nisan: [
      'Havacılık projesi sergisi düzenlemek',
      'Tasarlanan kâğıt/karton modellerin sınıf sergisinde tanıtımı\n23 Nisan kapsamında "Geleceğin Havacıları" panosu',
    ],
    mayis: [
      'Havacılık yarışmalarını tanıtmak ve yıl içi çalışmaları değerlendirmek',
      'TEKNOFEST ve havacılık yarışmaları hakkında bilgilendirme sunumu\n19 Mayıs kapsamında "Gençlik ve Havacılık" temalı sunum',
    ],
  },

  'Hayvanları Sevme ve Koruma Kulübü': {
    ekimEkstra: [
      'Hayvanları Koruma Günü\'nü kutlamak ve hayvan hakları bilincini oluşturmak',
      'Hayvanları Koruma Günü (4 Ekim) kapsamında farkındalık sunumu ve pano hazırlama\nEvcil ve sokak hayvanlarının bakım ihtiyaçları konulu bilgilendirme',
    ],
    kasim: [
      'Nesli tehlike altındaki türleri ve biyoçeşitliliği tanıtmak',
      'Organ Bağışı Haftası bağlantılı "Yaşam Paylaşımdır" temalı etkinlik\nAtatürk Haftası kapsamında "Atatürk ve Doğa Sevgisi" sunumu',
    ],
    aralik: [
      'Kış aylarında sokak hayvanlarına destek bilincini güçlendirmek',
      'Okul bahçesine kuşlar için su/mama kabı yerleştirme etkinliği\nSokak hayvanlarına yardım konulu bilgilendirme sunumu',
    ],
    subat: [
      'Evcil hayvan sorumluluğu ve doğru bakım bilgisi vermek',
      '"Bilinçli Hayvan Sahipliği" konulu sunum\nSahipsiz hayvanlara yardım konulu pano hazırlama',
    ],
    mart: [
      'Ormanları ve yaban hayatını koruma bilincini güçlendirmek',
      'Orman Haftası (21-26 Mart) kapsamında yaban hayatı koruma konulu sunum\nOkul bahçesinde kuş gözlemi etkinliği',
    ],
    nisan: [
      'Hayvan hakları ve hukuki korumayı tanıtmak',
      'Dünya Sağlık Haftası bağlantılı "Hayvan-İnsan-Çevre Sağlığı Üçgeni" sunumu\n23 Nisan kapsamında "Canlı Dünya Ortak Yuvamız" sunumu',
    ],
    mayis: [
      'Yıl içi hayvan koruma çalışmalarını değerlendirmek',
      'Hayvan sevgisi temalı pano hazırlama ve su/mama kaplarının yenilenmesi\n19 Mayıs kapsamında "Gençlik ve Doğa Koruma" temalı sunum',
    ],
  },

  'İngilizce Kulübü': {
    ekimEkstra: [
      'İngilizce kulübü hedeflerini ve yıl içi aktiviteleri tanıtmak',
      'İngilizce kulübünün yıllık planı ve etkinlik takvimi tanıtımı\nDil seviyesi belirleme aktivitesi ve grup oluşturma',
    ],
    kasim: [
      'İngilizce konuşma pratiği ve özgüven geliştirmek',
      'Atatürk Haftası kapsamında "Atatürk in English" konuşma pratiği\nPublic speaking (halka açık konuşma) temel egzersizleri',
    ],
    aralik: [
      'İngilizce drama ve rol yapma becerisi kazandırmak',
      'İngilizce kısa skeç ve diyalog prova çalışması\nYabancı ülke kültürü ve Aralık tatili geleneklerini İngilizce anlatan sunum',
    ],
    subat: [
      'İngilizce okuma ve tartışma pratiği kazandırmak',
      'İngilizce kısa makale veya haber analizi tartışma oturumu\n2. dönem İngilizce mini dergisi hazırlığı başlangıcı',
    ],
    mart: [
      'İngilizce proje sunumu deneyimi kazandırmak',
      'Bilim ve Teknoloji Haftası bağlantılı İngilizce proje sunumu\nKütüphaneler Haftası kapsamında İngilizce kitap tanıtımı etkinliği',
    ],
    nisan: [
      'İngilizce drama veya kısa oyun sahnesi sunmak',
      '23 Nisan kapsamında İngilizce kısa oyun/skeç gösterisi\neTwinning veya uluslararası proje ortaklığı araştırması',
    ],
    mayis: [
      'Yıl içi İngilizce kulüp dergisini yayınlamak\nDil gelişimini değerlendirmek',
      'Kulüp mini dergisinin basımı ve dağıtımı\n19 Mayıs kapsamında İngilizce "Youth Speech" etkinliği',
    ],
  },

  'İş Sağlığı ve Güvenliği Kulübü': {
    ekimEkstra: [
      'İş sağlığı ve güvenliğinin temel kavramlarını tanıtmak',
      'İSG nedir? Türkiye\'de iş kazası istatistikleri ve önemi sunumu\nOkul ortamında tehlike tanımlama ve risk değerlendirme çalışması',
    ],
    kasim: [
      'İşyerinde güvenlik kültürü ve kişisel koruyucu ekipmanları öğretmek',
      'Atatürk Haftası kapsamında "Çalışan Sağlığı ve Modernleşme" sunumu\nKişisel koruyucu donanım (KKD) görseller üzerinden tanıtım sunumu',
    ],
    aralik: [
      'Yangın güvenliği ve tahliye prosedürlerini öğretmek',
      'Yangın güvenliği, yangın söndürücü kullanımı bilgilendirmesi\nOkul tahliye planının incelenmesi ve sınıf içi değerlendirmesi',
    ],
    subat: [
      'Sivil savunma ve acil durum yönetimini pekiştirmek',
      'Sivil Savunma Günü (28 Şubat) kapsamında güvenlik bilgilendirme sunumu\nDeprem ve yangın senaryolarında doğru davranış konulu sınıf içi uygulama',
    ],
    mart: [
      'Ergonomi ve çalışma ortamı sağlığını kavratmak',
      'Bilim ve Teknoloji Haftası bağlantılı "Teknoloji ve İSG" sunumu\nErgonomik çalışma ortamı tasarımı çalışması',
    ],
    nisan: [
      'İş Sağlığı ve Güvenliği Haftasına hazırlık etkinliği düzenlemek',
      'İş Sağlığı ve Güvenliği Haftası (4-10 Mayıs öncesi hazırlık) için materyal üretimi\n23 Nisan kapsamında güvenli çalışma ortamı panosu',
    ],
    mayis: [
      'İSG Haftasında kapsamlı etkinlik düzenlemek\nYıl içi güvenlik çalışmalarını raporlamak',
      'İş Sağlığı ve Güvenliği Haftası (4-10 Mayıs) kapsamında güvenlik panosu ve bilgilendirme sunumu\nYıl içi risk değerlendirme raporunun tamamlanması',
    ],
  },

  'İzcilik Kulübü': {
    ekimEkstra: [
      'İzcilik ilke ve yeminini tanıtmak\nTemel izcilik becerilerini ve malzemelerini göstermek',
      'İzcilik yemini, on parmak kanunu ve dünya izcilik hareketi sunumu\nTemel izcilik düğümleri ve oryantasyon araçları tanıtım çalışması',
    ],
    kasim: [
      'İzcilik değerleri ile Atatürkçü düşüncenin buluşmasını sağlamak',
      'Atatürk Haftası kapsamında "Cumhuriyet ve Gençlik: İzcilik Ruhu" sunumu\nÖğretmenler Günü için kulübün etkinliğe katkısı',
    ],
    aralik: [
      'Kış kamp becerileri ve hayatta kalma tekniklerini öğretmek',
      'Kışa özgü hayatta kalma teknikleri konulu sunum\nHarita okuma ve pusula kullanımı uygulamalı ders',
    ],
    subat: [
      'İlk yardım ve kurtarma becerisi kazandırmak',
      'İzcilik ilk yardım teknikleri: yaralı taşıma, bandaj çalışması\n2. dönem kamp planlama toplantısı',
    ],
    mart: [
      'Doğa ve çevre koruma sorumluluğunu izcilik perspektifinden pekiştirmek',
      'Orman Haftası (21-26 Mart) kapsamında okul bahçesinde doğa yürüyüşü ve temizlik etkinliği\nKamp malzemeleri ve hazırlık bilgisi sunumu',
    ],
    nisan: [
      'İzcilik becerilerini uygulamalı pekiştirmek',
      '23 Nisan kapsamında "Genç İzcilerin Türkiye\'si" temalı etkinlik\nOkul bahçesinde izcilik becerileri uygulaması (düğüm, yön bulma)',
    ],
    mayis: [
      'Yıl sonu izcilik beceri sınavı düzenlemek',
      'İzcilik rozetleri ve beceri sınavı etkinliği\n19 Mayıs etkinliklerine kulübün katkısı',
    ],
  },

  'Kişisel Verileri Koruma Kulübü': {
    ekimEkstra: [
      'Kişisel veri kavramı ve KVKK kapsamını tanıtmak',
      'KVKK (6698 sayılı Kanun) ve GDPR\'ın temel prensipleri sunumu\nSosyal medyada kişisel veri paylaşım riskleri farkındalık çalışması',
    ],
    kasim: [
      'Dijital kimlik ve çevrimiçi mahremiyet bilinci oluşturmak',
      'Atatürk Haftası kapsamında "Çağdaşlaşma ve Dijital Haklar" sunumu\nŞifre güvenliği ve iki faktörlü kimlik doğrulama çalışması',
    ],
    aralik: [
      'Çerezler, izleme ve reklam teknolojilerini tanıtmak',
      'İnsan Hakları ve Demokrasi Haftası bağlantılı "Dijital Haklar ve Mahremiyet" sunumu\nÇerez yönetimi ve gizlilik ayarları uygulama çalışması',
    ],
    subat: [
      'Siber güvenlik tehditlerini ve korunma yöntemlerini öğretmek',
      'Kimlik avı (phishing) ve sosyal mühendislik saldırıları tanıma çalışması\n2. dönem okul farkındalık kampanyası hazırlığı',
    ],
    mart: [
      'Veri güvenliği alanında kariyer fırsatlarını tanıtmak',
      'Bilim ve Teknoloji Haftası bağlantılı "Siber Güvenlik Meslekleri" sunumu\nKütüphaneler Haftası kapsamında dijital okuryazarlık kitap köşesi',
    ],
    nisan: [
      'Kişisel Verileri Koruma Günü etkinliği düzenlemek',
      'Kişisel Verileri Koruma Günü (7 Nisan) kapsamında "Verini Koru" panosu ve sunumu\n23 Nisan kapsamında "Dijital Nesil ve Gizlilik Hakları" sunumu',
    ],
    mayis: [
      'Yıl içi KVKK farkındalık çalışmalarını raporlamak',
      'Bilişim Haftası (Mayıs ilk haftası) kapsamında siber güvenlik bilgilendirme sunumu\nYıl içi kampanya etkisi değerlendirme toplantısı',
    ],
  },

  'Kooperatifçilik Kulübü': {
    ekimEkstra: [
      'Kooperatif kavramı ve Türkiye\'deki kooperatifçilik tarihini tanıtmak',
      'Tarımsal, tüketim ve üretim kooperatifleri tanıtım sunumu\nOkul içi mini kooperatif projesinin planlanması',
    ],
    kasim: [
      'Ahilik ve kooperatifçilik arasındaki bağı kavratmak',
      'Atatürk Haftası kapsamında "Millî Ekonomi ve Kooperatifçilik" sunumu\nAhilik dayanışma anlayışının modern kooperatife yansıması tartışması',
    ],
    aralik: [
      'Kooperatif işletme modelini uygulamalı anlatmak',
      'Tutum, Yatırım ve Türk Malları Haftası bağlantılı yerli kooperatif ürünleri tanıtımı\nMini okul kooperatifi kurulum simülasyonu',
    ],
    subat: [
      'Kooperatif kayıt ve muhasebe temellerini öğretmek',
      'Mini kooperatif yönetimi: görev dağılımı, kayıt, kâr paylaşımı çalışması\n2. dönem kooperatif faaliyetlerini planlama toplantısı',
    ],
    mart: [
      'Girişimcilik ve kooperatifçilik bağını pekiştirmek',
      'Girişimcilik Haftası bağlantılı "Birlikte Girişim, Birlikte Güç" sunumu\nOkul içi ürün satış/takas etkinliği',
    ],
    nisan: [
      'Kooperatif çalışmalarını tanıtmak ve örnekleri incelemek',
      '23 Nisan kapsamında kooperatif çalışmaları panosu hazırlama\nTürkiye\'deki başarılı kooperatif örneklerinin araştırılması ve sınıfta sunumu',
    ],
    mayis: [
      'Yıl içi kooperatif deneyimini raporlamak ve değerlendirmek',
      'Mini kooperatif yıl sonu hesap ve kâr paylaşım toplantısı\n19 Mayıs kapsamında "Gençlik ve Kooperatif Ekonomisi" sunumu',
    ],
  },

  'Kültür ve Tabiat Varlıklarını Koruma Kulübü': {
    ekimEkstra: [
      'Kültürel ve doğal miras kavramlarını tanıtmak',
      'UNESCO Dünya Mirası listesindeki Türk varlıkları tanıtım sunumu\nOkul çevresindeki kültürel/doğal varlıkların tespiti çalışması',
    ],
    kasim: [
      'Atatürk döneminde kültürel miras koruma çalışmalarını kavratmak',
      'Atatürk Haftası kapsamında "Cumhuriyet ve Kültürel Miras Koruma" sunumu\nTürkiye\'nin müzeleri ve arkeolojik sitler araştırma etkinliği',
    ],
    aralik: [
      'Somut olmayan kültürel mirası tanıtmak',
      'UNESCO "Somut Olmayan Kültürel Miras" listesindeki Türk gelenekleri sunumu\nYöresel ritüeller, el sanatları ve müzik araştırma etkinliği',
    ],
    subat: [
      'Araştırma yoluyla yerel mirası tanımak ve tanıtmak',
      'Yaşadığımız çevredeki tarihî yapıları araştırma ödevi ve sınıfta sunma\n2. dönem miras koruma panosu hazırlığı',
    ],
    mart: [
      'Doğal miras ve çevre korumayı birlikte ele almak',
      'Orman Haftası (21-26 Mart) kapsamında doğal sit alanları ve koruma politikaları sunumu\nTürkiye\'nin doğal güzellikleri sanal tur/görsel sunum etkinliği',
    ],
    nisan: [
      'Turizm ve miras koruma ilişkisini kavratmak',
      'Turizm Haftası (15-22 Nisan) kapsamında "Sorumlu Turizm ve Miras Koruma" sunumu\n23 Nisan kapsamında yerel kültürel miras sergisi',
    ],
    mayis: [
      'Yıl içi belgeleme çalışmalarını arşivlemek',
      'Yerel miras fotoğraf ve araştırma arşivinin tamamlanması\n19 Mayıs kapsamında "Gençlik ve Miras Sorumluluğu" sunum',
    ],
  },

  'Kütüphanecilik Kulübü': {
    ekimEkstra: [
      'Kütüphane hizmetleri ve kaynak türlerini tanıtmak',
      'Okul kütüphanesi oryantasyonu: katalog, ödünç alma, dijital kaynaklar\nKütüphane demirbaş sayımı ve düzenleme çalışması',
    ],
    kasim: [
      'Atatürk\'ün kütüphane ve okuma kültürüne verdiği önemi kavratmak\nOkul kütüphanesinden yararlanma bilincini yaymak',
      'Atatürk Haftası kapsamında Atatürk\'ün kütüphane koleksiyonları ve okuma alışkanlığı sunumu\nKütüphaneden yararlanma kuralları okul geneli duyurusu\n24 Kasım Öğretmenler Günü kapsamında "Öğretmen ve Kitap" panosu hazırlama',
    ],
    aralik: [
      'Okuma kampanyası başlatmak\nKitap tavsiye kültürü oluşturmak',
      'Okul kitap değişim/bağış kampanyası organizasyonu\nKütüphane panolarına kitap tavsiye kartları hazırlama',
    ],
    subat: [
      'Kaynak araştırma ve atıf becerisi kazandırmak',
      'Akademik ve güvenilir kaynak seçimi: internet vs. kitap tartışması\n2. dönem okuma kulübü kurulması ve kitap seçimi',
    ],
    mart: [
      'Kütüphaneler Haftasında kapsamlı etkinlik düzenlemek',
      'Kütüphaneler Haftası (Mart ayının son pazartesi haftası) kapsamında etkinlik: pano sergisi, kitap tanıtımı, sınıf içi yarışma\nİstiklâl Marşı\'nın Kabulü (12 Mart) bağlantılı Türk edebiyatı kitap sergisi',
    ],
    nisan: [
      'Okuma sevinciyle 23 Nisan\'ı kutlamak',
      '23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kapsamında çocuk kitapları okuma etkinliği\nTurizm Haftası bağlantılı "Kitaplarla Türkiye\'yi Keşfet" sergisi',
    ],
    mayis: [
      'Yıl içi okuma sayısını değerlendirmek ve ödüllendirmek',
      'En çok kitap okuyan öğrencilerin ödüllendirme töreni\n19 Mayıs kapsamında gençlik ve okuma kültürü temalı etkinlik',
    ],
  },

  'Medeniyet ve Değerler Kulübü': {
    ekimEkstra: [
      'Medeniyet kavramı ve Anadolu uygarlıklarını tanıtmak',
      'Anadolu\'dan geçen medeniyetler zaman çizelgesi çalışması\nMedeniyet ve değer ilişkisi giriş tartışması',
    ],
    kasim: [
      'Türk-İslam medeniyetinin evrensel değerlere katkısını kavratmak',
      'Atatürk Haftası kapsamında "Cumhuriyet: Batı Medeniyetine Katılım" sunumu\nSelçuklu ve Osmanlı medeniyetinde bilim ve sanat araştırma etkinliği',
    ],
    aralik: [
      'Medeniyetler arası diyaloğu ve hoşgörüyü pekiştirmek',
      'İnsan Hakları ve Demokrasi Haftası bağlantılı "Medeniyetler Arası Diyalog" paneli\nFarklı medeniyetlerin mimarisi ve sanatı karşılaştırma çalışması',
    ],
    subat: [
      'Medeniyetin sürdürülmesinde eğitim ve bilimin rolünü kavratmak',
      'İslam altın çağında bilim ve Avrupa Rönesansı karşılaştırmalı sunumu\n2. dönem medeniyet projesi başlangıcı',
    ],
    mart: [
      'Anadolu kültürel mirasını medeniyetler perspektifinden incelemek',
      'Orman Haftası bağlantılı "Doğa ve Medeniyet" tartışması\nKütüphaneler Haftası kapsamında Anadolu uygarlıkları kitap köşesi',
    ],
    nisan: [
      'Medeniyetlerin çocuklara bıraktığı mirası vurgulamak',
      '23 Nisan kapsamında "Medeniyetlerin Çocukları" temalı program\nTurizm Haftası bağlantılı Anadolu miras tanıtım sunumu',
    ],
    mayis: [
      'Yıl içi medeniyet araştırma projelerini sergilemek',
      '"Medeniyetten Gelen Sesler" yıl sonu sergisi ve sunum etkinliği\n19 Mayıs kapsamında "Gençlik ve Medeniyet Sorumluluğu" temalı program',
    ],
  },

  'Medeniyet ve Düşünce Kulübü': {
    ekimEkstra: [
      'Düşünce tarihini ve büyük fikir akımlarını tanıtmak',
      'Antik Yunan\'dan Aydınlanma\'ya düşünce tarihinin mihenk taşları sunumu\nTürkiye\'de fikir tarihi: Tanzimat\'tan Cumhuriyet\'e genel bakış',
    ],
    kasim: [
      'Atatürk\'ün düşünce sistemi ve pozitivizmi kavratmak',
      'Atatürk Haftası kapsamında "Atatürkçülük: Akıl, Bilim, Laiklik" sunumu\nAtatürk\'ün nutuk ve konuşmalarından seçme okuma çalışması',
    ],
    aralik: [
      'Aydınlanma düşüncesi ve insan hakları bağını pekiştirmek',
      'İnsan Hakları ve Demokrasi Haftası bağlantılı "Aydınlanma ve Modern Haklar" sunumu\nRousseau, Locke, Montesquieu kısa biyografi araştırma çalışması',
    ],
    subat: [
      'Türk düşünce tarihi öncülerini tanımak',
      'Ziya Gökalp, Namık Kemal, Tevfik Fikret gibi Türk düşünürler sunumu\nDüşünce akımları karşılaştırma haritası hazırlama çalışması',
    ],
    mart: [
      'Çevre felsefesi ve doğa düşüncesini tartışmak',
      'Orman Haftası bağlantılı "Doğa ve İnsan: Felsefi Bir Bakış" tartışması\nKütüphaneler Haftası kapsamında Türk düşünce tarihi kitap köşesi',
    ],
    nisan: [
      'Özgürlük ve egemenlik düşüncesini 23 Nisan\'la ilişkilendirmek',
      '23 Nisan kapsamında "Ulusal Egemenlik: Bir Düşüncenin Zaferi" tartışma etkinliği\nOkul geneline açık düşünce tarihi quiz yarışması',
    ],
    mayis: [
      'Yıl içi düşünce araştırmalarını sunmak ve değerlendirmek',
      '"Genç Düşünürler" yıl sonu sunum ve tartışma etkinliği\n19 Mayıs kapsamında "Özgür Düşünce, Bağımsız Vatan" temalı program',
    ],
  },

  'Medya Okur Yazarlığı Kulübü': {
    ekimEkstra: [
      'Medya türleri ve medya okuryazarlığının önemini tanıtmak',
      'Geleneksel ve dijital medya karşılaştırması tanıtım sunumu\nBir haber nasıl doğrulanır? Temel faktör kontrol çalışması',
    ],
    kasim: [
      'Dezenformasyon ve sahte haber (fake news) farkındalığı oluşturmak',
      'Atatürk Haftası kapsamında "Basın Özgürlüğü ve Cumhuriyet" sunumu\nSahte haber tespit araçları (fact-checking) uygulamalı çalışma',
    ],
    aralik: [
      'Reklam ve propaganda analizini öğretmek',
      'İnsan Hakları Haftası bağlantılı "Medya, Haklar ve Özgürlük" sunumu\nReklam görsel analizi: hangi duygu/algı hedefleniyor? çalışması',
    ],
    subat: [
      'Sosyal medya algoritmalarını ve filtre balonunu kavratmak',
      'Filtre balonu ve yankı odası kavramları sunumu\n2. dönem okul için medya okuryazarlığı broşürü hazırlama',
    ],
    mart: [
      'Haber üretim sürecini bizzat deneyimlemek',
      'Bilim ve Teknoloji Haftası bağlantılı "Teknoloji Haberciliği" mini gazete çalışması\nKütüphaneler Haftası kapsamında "Okuma: Aktif Medya Tüketimi" etkinliği',
    ],
    nisan: [
      'Sınıf bülteni ve medya içeriği hazırlamak',
      '23 Nisan kapsamında sınıf bülteni hazırlama\nMedya okuryazarlığı afişi hazırlama ve panoda sergileme',
    ],
    mayis: [
      'Yıl içi medya projesini tamamlamak ve değerlendirmek',
      'Bilişim Haftası kapsamında yıl içi çalışmaların sunumu\n19 Mayıs kapsamında "Gençlik ve Sorumlu Medya" temalı sunum',
    ],
  },

  'Meslek Tanıtma Kulübü': {
    ekimEkstra: [
      'Mesleklerin sınıflandırılmasını ve kariyer planlamasını tanıtmak',
      'Meslekler: beyaz yaka, mavi yaka, yaratıcı sektörler karşılaştırması\nKişilik özellikleri ve meslek uyumu kısa keşif çalışması',
    ],
    kasim: [
      'Eğitim alanında kariyer yollarını tanıtmak\nÖğretmen olmayı keşfetmek',
      'Atatürk Haftası kapsamında "Atatürk ve Eğitim Devrimcileri" sunumu\n24 Kasım Öğretmenler Günü kapsamında "Öğretmenlik Mesleği" tanıtım etkinliği',
    ],
    aralik: [
      'Sağlık ve fen alanı meslek seçeneklerini tanıtmak',
      'Hekim, eczacı, mühendis, biyolog tanıtım (davetli veya video)\nMeslek araştırma portfolyosu hazırlama başlangıcı',
    ],
    subat: [
      'Sanat, medya ve iletişim kariyer alanlarını keşfetmek',
      'Gazeteci, tasarımcı, senarist, sosyal medya uzmanı kariyer profilleri sunumu\n2. dönem "Bir Mesleği Tanıyorum" sunum projesinin planlanması',
    ],
    mart: [
      'Teknoloji ve mühendislik alanı kariyer fırsatlarını tanıtmak',
      'Bilim ve Teknoloji Haftası (8-14 Mart) kapsamında mühendislik ve bilişim meslekleri paneli\nGirişimcilik Haftası bağlantılı "Kendi İşini Kurmak" sunumu',
    ],
    nisan: [
      '"Bir Mesleği Tanıyorum" sunum etkinliğini gerçekleştirmek',
      '"Bir Mesleği Tanıyorum": her öğrencinin seçtiği mesleği araştırıp sınıfta sunması\n23 Nisan kapsamında "Geleceğin Meslekleri" konulu pano ve sunum',
    ],
    mayis: [
      'Kariyer planlaması araştırmalarını tamamlamak',
      'Kişisel kariyer portföyünün tamamlanması\n19 Mayıs kapsamında "Gençliğin Mesleği: Geleceği Şekillendirmek" temalı sunum',
    ],
  },

  'Mesleki Tatbikat Kulübü': {
    ekimEkstra: [
      'Mesleki tatbikat alanlarını ve yıl içi uygulama planını tanıtmak',
      'Kulübün odaklandığı meslek dalları ve uygulamalı çalışma takviminin sunumu\nTemel mesleki güvenlik ve İSG kuralları bilgilendirmesi',
    ],
    kasim: [
      'Mesleki beceri gelişiminde pratik uygulamanın önemini kavratmak',
      'Atatürk Haftası kapsamında "Üretken Gençlik: Meslek ve Vatan" sunumu\nTatbikat alanına ilk teknik giriş çalışması',
    ],
    aralik: [
      'Temel mesleki teknikleri uygulamalı öğretmek',
      'Seçilen meslek dalında teknik beceri çalışması (1. aşama)\nMesleki hata ve güvenlik riski analizi tartışması',
    ],
    subat: [
      'Teknik uygulama derinliğini artırmak',
      'Teknik beceri çalışması (2. aşama: ileri uygulamalar)\n2. dönem proje tatbikatı planlama toplantısı',
    ],
    mart: [
      'Mesleki projeyi hayata geçirmek',
      'Bilim ve Teknoloji Haftası bağlantılı mesleki proje uygulaması ve sunumu\nGirişimcilik Haftası bağlantılı mesleki üretimde girişimcilik tartışması',
    ],
    nisan: [
      'Üretilen mesleki ürünleri sergilemek',
      '23 Nisan kapsamında mesleki tatbikat ürünleri ve proje sergisi\nMesleği tanıtma panosu hazırlanması',
    ],
    mayis: [
      'Yıl içi mesleki beceri gelişimini değerlendirmek',
      'Mesleki portfolyo hazırlama ve sunum etkinliği\n19 Mayıs kapsamında "Üretken Gençlik" temalı program',
    ],
  },

  'MUN (Model United Nations) Kulübü': {
    ekimEkstra: [
      'BM sistemi, komiteleri ve MUN kurallarını tanıtmak',
      'BM\'nin yapısı, Güvenlik Konseyi, Genel Kurul ve temel organlar sunumu\nMUN dil prosedürleri (posta kutusu, konuşma hakkı, karar taslaği) çalışması',
    ],
    kasim: [
      'Uluslararası gündem maddelerini araştırma ve analiz becerisi geliştirmek',
      'Atatürk Haftası kapsamında "Türkiye\'nin BM\'ye Katkıları" sunumu\nGündem maddesi araştırması: ülke konumu (position paper) hazırlama',
    ],
    aralik: [
      'Ülke temsili ve diplomatik dil becerisi kazandırmak',
      'İnsan Hakları ve Demokrasi Haftası bağlantılı BM İnsan Hakları Konseyi simülasyonu\nDiplomasik konuşma ve müzakere teknikleri çalışması',
    ],
    subat: [
      'Sınıf içi MUN oturumu hazırlığını tamamlamak',
      'Karar taslağı (resolution) hazırlama çalışması\nSınıf içi mini MUN oturumu planlama ve rol dağılımı',
    ],
    mart: [
      'Sınıf içi MUN oturumunu gerçekleştirmek',
      'Sınıf içi mini MUN oturumu (tek komite, ders saati içinde)\nOturum sonrası değerlendirme ve delege raporu',
    ],
    nisan: [
      'MUN konferans süreçlerini tanıtmak',
      'Ulusal MUN konferansları hakkında bilgilendirme sunumu\n23 Nisan kapsamında "Ulusal Egemenlik ve Uluslararası Diplomasi" sunumu',
    ],
    mayis: [
      'Yıl sonu kapanış simülasyonu düzenlemek\nYıl içi deneyimi değerlendirmek',
      'Yıl sonu kapanış oturumu: sınıf içi münazara/simülasyon etkinliği\n19 Mayıs kapsamında "Gençlik Diplomasisi ve Dünya Barışı" temalı etkinlik',
    ],
  },

  'Örnek ve Öncü Şahsiyetler Tanıtım Kulübü': {
    ekimEkstra: [
      'Kulübün odaklanacağı şahsiyet kategorilerini belirlemek',
      'Bilim, sanat, siyaset, spor, edebiyat öncülerinin sınıflandırılması\nYıl içi tanıtılacak şahsiyetlerin listesini belirleme tartışması',
    ],
    kasim: [
      'Atatürk\'ü çok boyutlu bir şahsiyet olarak tanıtmak',
      'Atatürk Haftası kapsamında "Öncü Şahsiyet Olarak Atatürk: Asker, Devlet Adamı, Devrimci" sunumu\n10 Kasım anma töreni için kulübün katkısı\n24 Kasım kapsamında "Eğitimde Öncü Öğretmenler" etkinliği',
    ],
    aralik: [
      'Türk bilim ve düşünce öncülerini tanıtmak',
      'İbn-i Sina, Biruni, Nasireddin Tusi gibi Türk-İslam bilginleri sunumu\nTutum Haftası bağlantılı "Üretimin Öncüleri" araştırma etkinliği',
    ],
    subat: [
      'Kadın öncüleri ve toplumsal dönüşümdeki rollerini tanıtmak',
      'Türkiye\'nin ilk kadın pilotu Sabiha Gökçen ve diğer öncü Türk kadınlar sunumu\nDünya Kadınlar Günü (8 Mart) hazırlığı: uluslararası kadın öncüler araştırması',
    ],
    mart: [
      'Sanat ve edebiyat öncülerini tanıtmak',
      'İstiklâl Marşı\'nın Kabulü kapsamında Mehmet Akif Ersoy derinlemesine biyografi\nKütüphaneler Haftası bağlantılı Türk ve dünya edebiyatı öncüleri kitap köşesi',
    ],
    nisan: [
      'Genç öncüleri ve çocukların kahramanlarını tanıtmak',
      '23 Nisan kapsamında "Küçük Yaşta Büyük İşler Yapanlar" tanıtım programı\nTurizm Haftası bağlantılı "Türkiye\'yi Dünyaya Tanıtan Öncüler" sunumu',
    ],
    mayis: [
      'Yıl içi tanıtılan şahsiyetleri bir araya getiren kapanış etkinliği düzenlemek',
      '"Öncülerin İzinde" yıl sonu sergi ve sunum etkinliği\n19 Mayıs kapsamında "Gençlik: Yarının Öncüleri" temalı program',
    ],
  },

  'Sağlık Temizlik ve Beslenme Kulübü': {
    ekimEkstra: [
      'Sağlıklı yaşam alışkanlıklarının üç temel direğini tanıtmak',
      'Sağlık, temizlik ve beslenme üçgeni: kısa girdi sunumu\nOkul kantin ürünleri besin değeri analizi çalışması',
    ],
    kasim: [
      'El hijyeni ve kişisel temizliğin hastalık önlemedeki rolünü öğretmek',
      'Atatürk Haftası kapsamında "Sağlıklı Nesil, Güçlü Millet" sunumu\nDoğru el yıkama tekniği ve hijyen alışkanlıkları çalışması',
    ],
    aralik: [
      'Kış mevsiminde bağışıklık sistemini güçlendirmeyi öğretmek',
      'Mevsimsel salgın hastalıklardan korunma yöntemleri sunumu\nC vitamini ve kış besinleri: besin değerleri araştırma çalışması',
    ],
    subat: [
      'Dengeli beslenme piramidi ve sağlıklı öğün planlamasını öğretmek',
      'Besin grupları ve günlük önerilen miktarlar sunumu\n2. dönem "Sağlıklı Öğün" yarışması başlatma',
    ],
    mart: [
      'Yeşilay Haftasında sağlıklı yaşamı yaymak',
      'Yeşilay Haftası (1 Mart) kapsamında "Bağımlılıksız Sağlıklı Yaşam" konulu sunum ve pano\nOrman Haftası bağlantılı "Doğadan Gelen Besinler" çalışması',
    ],
    nisan: [
      'Dünya Sağlık Haftasında kapsamlı etkinlik düzenlemek',
      'Dünya Sağlık Günü/Haftası (7-13 Nisan) kapsamında sağlıklı yaşam panosu ve bilgilendirme sunumu\n23 Nisan kapsamında "Sağlıklı Nesil, Güçlü Türkiye" temalı etkinlik',
    ],
    mayis: [
      'Yıl içi sağlık farkındalık çalışmalarını değerlendirmek',
      'Engelliler Haftası bağlantılı "Engelsiz Sağlık" etkinliği\n19 Mayıs kapsamında sağlıklı beslenme ve hareket panosu',
    ],
  },

  'Sağlık ve Güvenlik Kulübü': {
    ekimEkstra: [
      'Okul ortamında sağlık ve güvenlik risklerini tanıtmak',
      'Okul kazaları ve önlenebilir riskler analizi çalışması\nOkul ilk yardım çantası içeriği ve kullanımı tanıtımı',
    ],
    kasim: [
      'İlk yardım temellerini öğretmek',
      'Atatürk Haftası kapsamında "Sağlıklı ve Güvende Bir Toplum" sunumu\nTemel ilk yardım konularının (kanama, bilinç kaybı) video destekli anlatımı',
    ],
    aralik: [
      'Yangın güvenliği ve ilk müdahaleyi kavratmak',
      'Yangın güvenliği ve tahliye prosedürleri bilgilendirmesi\nYangın söndürücü kullanımı görsel çalışması',
    ],
    subat: [
      'Sivil savunma ve deprem güvenliğini pekiştirmek',
      'Sivil Savunma Günü (28 Şubat) kapsamında deprem ve afet güvenliği bilgilendirme sunumu\n"Çantamızda ne olmalı?" afet çantası listesi hazırlama etkinliği',
    ],
    mart: [
      'Trafik güvenliği farkındalığı oluşturmak',
      'Trafik kazaları istatistikleri ve önlenebilir riskler sunumu\nŞehitler Günü (18 Mart) bağlantılı "Güvenli Bir Gelecek İçin" etkinliği',
    ],
    nisan: [
      'Dünya Sağlık Haftasında okul sağlık taraması düzenlemek',
      'Dünya Sağlık Günü/Haftası (7-13 Nisan) kapsamında sağlık konulu pano ve bilgilendirme sunumu\n23 Nisan kapsamında "Güvenli Çocukluk" temalı program',
    ],
    mayis: [
      'Trafik ve İlkyardım Haftasında kapsamlı etkinlik düzenlemek',
      'Trafik ve İlkyardım Haftası (Mayıs ilk haftası) kapsamında güvenlik panosu ve bilgilendirme etkinliği\nYıl içi ilk yardım eğitiminin değerlendirmesi',
    ],
  },

  'Şehir ve Medeniyet Kulübü': {
    ekimEkstra: [
      'Şehir kavramı ve Türk şehircilik tarihini tanıtmak',
      'Osmanlı ve Cumhuriyet şehirciliği karşılaştırmalı sunumu\nOkul çevresindeki mahalle/şehir dokusunu inceleme çalışması',
    ],
    kasim: [
      'Atatürk\'ün Ankara\'yı başkent yapmasının anlamını ve modern şehircilik vizyonunu kavratmak',
      'Atatürk Haftası kapsamında "Cumhuriyet\'in Şehri: Ankara" sunumu\nTürkiye\'nin kentsel dönüşüm tarihi araştırma etkinliği',
    ],
    aralik: [
      'Tarihi kent dokularını ve koruma sorunlarını tanıtmak',
      'İstanbul, Bursa, Edirne gibi Osmanlı kentlerinin tarihi dokusu sunumu\nŞehirde koruma ve yıkım tartışması: örnek olay incelemesi',
    ],
    subat: [
      'Şehir planlaması ve kentsel yaşam kalitesini kavratmak',
      'Ulaşım, yeşil alan, konut dengesi: ideal şehir nedir? tartışması\n2. dönem "İdeal Şehrim" tasarım projesi başlangıcı',
    ],
    mart: [
      'Şehir ve doğa ilişkisini kentsel yeşil alanlar üzerinden incelemek',
      'Orman Haftası (21-26 Mart) bağlantılı şehirlerde yeşil koridor ve orman alanları sunumu\nKütüphaneler Haftası kapsamında şehir tarihi kitap köşesi',
    ],
    nisan: [
      '"İdeal Şehrim" tasarım projelerini sergilemek',
      'Turizm Haftası (15-22 Nisan) bağlantılı "Şehrimizi Tanıyalım" görsel sunum etkinliği\n23 Nisan kapsamında "Geleceğin Şehircileri" proje sergisi',
    ],
    mayis: [
      'Yıl içi şehircilik araştırmalarını tamamlamak',
      'Şehir tasarım portfolyolarının tamamlanması ve sunum etkinliği\n19 Mayıs kapsamında "Gençlik ve Şehirlerimizin Geleceği" temalı program',
    ],
  },

  'Siberay Kulübü': {
    ekimEkstra: [
      'Siber güvenlik alanını ve Türkiye\'deki önemi tanıtmak',
      'Siber tehdit türleri: hack, fidye yazılımı, DDoS, sosyal mühendislik sunumu\nTürkiye Siber Güvenlik Stratejisi ve BTK tanıtımı',
    ],
    kasim: [
      'Siber saldırı ve savunma temellerini öğretmek',
      'Atatürk Haftası kapsamında "Çağdaş Savaş Alanı: Siber Uzay" sunumu\nParola güvenliği ve ağ güvenliği temel uygulamaları çalışması',
    ],
    aralik: [
      'Ağ güvenliği ve VPN/şifreleme kavramlarını tanıtmak',
      'HTTPS, şifreleme ve güvenli iletişim protokolleri sunumu\nKişisel Verileri Koruma Günü hazırlığı için farkındalık materyali üretimi',
    ],
    subat: [
      'Etik hacking ve sızma testi kavramlarını tanıtmak',
      'Beyaz şapka/siyah şapka hacker ayrımı ve etik hacking mesleği sunumu\nKâğıt üzerinde şifreleme ve kod çözme bulmacaları etkinliği',
    ],
    mart: [
      'Siber güvenlik kariyer fırsatlarını keşfetmek',
      'Bilim ve Teknoloji Haftası bağlantılı siber güvenlik mesleği ve TEKNOFEST Siber kategorisi sunumu\nBilinçli internette gezinme kuralları okul afişi hazırlama',
    ],
    nisan: [
      'Kişisel Verileri Koruma Günü\'nde farkındalık etkinliği düzenlemek',
      'Kişisel Verileri Koruma Günü (7 Nisan) kapsamında siber güvenlik farkındalık panosu\n23 Nisan kapsamında "Dijital Gençlik, Güvenli Gelecek" sunumu',
    ],
    mayis: [
      'Siber güvenlik proje sunumu ve yıl değerlendirmesi yapmak',
      'Bilişim Haftası kapsamında yıl içi çalışmaların sınıf sunumu\n19 Mayıs kapsamında "Gençlik ve Dijital Savunma" temalı etkinlik',
    ],
  },

  'Sıfır Atık Kulübü': {
    ekimEkstra: [
      'Sıfır atık felsefesi ve Türkiye\'deki politikaları tanıtmak',
      'Sıfır Atık Türkiye Projesi ve yasal çerçeve sunumu\nOkul çöp analizi: ne kadar atık üretiyoruz? ölçüm çalışması',
    ],
    kasim: [
      'Atık azaltma hiyerarşisini öğretmek (Redüce-Yeniden Kullan-Geri Dönüştür)',
      'Atatürk Haftası kapsamında "Tasarruf ve Üretim: Sıfır İsraf" sunumu\nSınıfta karton kutularla atık ayrıştırma köşesi oluşturma',
    ],
    aralik: [
      'Plastik kirliliği ve tek kullanımlık ürünlerle mücadele bilinci oluşturmak',
      'Tutum, Yatırım ve Türk Malları Haftası bağlantılı "Dayanıklı, Kaliteli, İsrafsız" etkinliği\nOkul içi plastik tüketim azaltma kampanyası başlatma',
    ],
    subat: [
      'Kompost ve organik atık yönetimini tanıtmak',
      'Kompost nedir? Organik atık yönetimi konulu sunum\nKavanozda mini kompost gözlem denemesi',
    ],
    mart: [
      'Orman ve doğa kirliliğiyle mücadelede sıfır atık yaklaşımını pekiştirmek',
      'Orman Haftası (21-26 Mart) kapsamında okul bahçesinde çöp toplama ve atık gözlemi etkinliği\nGeri dönüşüm malzemeleriyle sanat/tasarım çalışması',
    ],
    nisan: [
      'Dünya Sağlık Haftası bağlantılı "Temiz Çevre, Sağlıklı Yaşam" etkinliği düzenlemek',
      'Dünya Sağlık Haftası bağlantılı "Sıfır Atık = Sağlıklı Gelecek" konulu sunum ve pano\n23 Nisan kapsamında geri dönüşüm malzemeleriyle sanat sergisi',
    ],
    mayis: [
      'Yıl içi sıfır atık dönüşümünü ölçmek ve raporlamak',
      'Çevre Koruma Haftası (Haziran öncesi) için okul atık azaltma raporu hazırlama\n19 Mayıs kapsamında "Gençlik ve Yeşil Gelecek" temalı sunum',
    ],
  },

  'Şiir ve Tefekkür Kulübü': {
    ekimEkstra: [
      'Şiir sanatının dilini ve tefekkürün önemini tanıtmak',
      'Şiir nedir? Ses, imge, anlam üçgeni giriş sunumu\nYunus Emre, Karacaoğlan, Fuzuli gibi Türk şiir ustalarından seçmeler',
    ],
    kasim: [
      'Atatürk\'e adanmış şiirleri sesli okumak ve anlam katmanlarını keşfetmek',
      'Atatürk Haftası kapsamında "Atatürk\'e Şiirler" sesli okuma etkinliği\n10 Kasım anma töreninde kulüp üyelerinin şiir sunumu\n24 Kasım Öğretmenler Günü için üyelerin öğretmen şiirleri hazırlaması',
    ],
    aralik: [
      'Kış ve hüzün temalarını şiirle işlemek',
      'Kış şiirleri okuma ve analiz çalışması\nÖğrenci şiir yazma: kış imgelerini kullanma egzersizi',
    ],
    subat: [
      'Aşk ve doğa temalarını divan ve halk şiirinden örneklerle keşfetmek',
      'Fuzuli ve Bâkî\'den divan şiiri örnekleri sesli okuma\nDoga ve sevgi imgelerini kullanan çağdaş şiir yazma çalışması',
    ],
    mart: [
      'Vatan ve özgürlük şiirlerini İstiklâl Marşı bağlamında keşfetmek',
      'İstiklâl Marşı\'nın Kabulü (12 Mart) kapsamında Mehmet Akif Ersoy şiir derinlemesine inceleme\nKütüphaneler Haftası bağlantılı "Kitaplar ve Şairler" etkinliği',
    ],
    nisan: [
      'Okul geneline açık şiir dinletisi düzenlemek',
      '23 Nisan kapsamında çocukların yazdığı şiirlerin sahne performansı\nMimar Sinan anısına mimarlık ve şiir bağlantısı çalışması',
    ],
    mayis: [
      'Yıl içi üretilen şiirleri kitapçık olarak derlemek',
      '"Genç Şairler Antolojisi" yıl sonu kitapçığının hazırlanması ve dağıtımı\n19 Mayıs kapsamında bağımsızlık ve özgürlük şiir okuma töreni',
    ],
  },

  'Sivil Savunma Kulübü': {
    ekimEkstra: [
      'Sivil savunmanın tarihini ve günümüzdeki rolünü tanıtmak',
      'Türk Sivil Savunma Teşkilatı tarihi ve AFAD\'ın görevleri sunumu\nRisk haritası oluşturma: okulumuzun tehlike noktaları çalışması',
    ],
    kasim: [
      'Doğal ve insan kaynaklı afetlere hazırlık bilincini oluşturmak',
      'Atatürk Haftası kapsamında "Modernleşme ve Afet Yönetimi" sunumu\nDeprem, sel, yangın senaryolarında doğru davranış kuralları sunumu',
    ],
    aralik: [
      'Acil durum iletişimi ve alarm sistemlerini öğretmek',
      'Acil çağrı hatları ve afet bildirim protokolleri bilgilendirmesi\nOkul acil durum planını inceleme ve sınıf içi değerlendirme',
    ],
    subat: [
      'Sivil Savunma Günü\'nde farkındalık etkinliği düzenlemek',
      'Sivil Savunma Günü (28 Şubat) kapsamında sınıf içi afet bilgilendirme sunumu\nTahliye ve toplanma kurallarının sınıf içinde gözden geçirilmesi',
    ],
    mart: [
      'Kimyasal, biyolojik ve radyolojik tehlike farkındalığı sağlamak',
      'KBRN (Kimyasal-Biyolojik-Radyolojik-Nükleer) tehlikeler temel bilgi sunumu\nŞehitler Günü (18 Mart) bağlantılı savunma ve fedakarlık değerleri etkinliği',
    ],
    nisan: [
      'Toplum gönüllülüğü ve sivil savunma katılımını teşvik etmek',
      'AFAD gönüllülük programı tanıtımı\n23 Nisan kapsamında "Güvenli Türkiye" farkındalık panosu',
    ],
    mayis: [
      'Yıl içi sivil savunma hazırlık düzeyini değerlendirmek',
      'Sınıf içi afet bilgisi yarışması\n19 Mayıs kapsamında "Hazır Gençlik" temalı sunum',
    ],
  },

  'Sosyal Medya Kulübü': {
    ekimEkstra: [
      'Sosyal medya platformları ve algoritma mantığını tanıtmak',
      'Instagram, TikTok, YouTube, X gibi platformların algoritması nasıl çalışır? sunumu\nOkul için sosyal medya hesabı yönetim ilkeleri belirleme',
    ],
    kasim: [
      'Sorumlu sosyal medya kullanımı ve dijital vatandaşlık bilinci oluşturmak',
      'Atatürk Haftası kapsamında "Cumhuriyet\'in Dijital Çağdaki Yansıması" sunumu\nSosyal medyada hakaret, telif ihlali ve nefret söylemi bilgilendirmesi',
    ],
    aralik: [
      'İçerik üretimi ve görsel dil becerisi kazandırmak',
      'Kişisel Verileri Koruma ve sosyal medya gizlilik ayarları çalışması\nOkul etkinliklerini sosyal medyaya taşımak: fotoğraf + metin + hashtag çalışması',
    ],
    subat: [
      'Video içerik üretimi ve montaj temellerini öğretmek',
      'Telefonla kısa video hazırlama: senaryo ve çekim denemesi\n2. dönem okul sosyal medya takvimi oluşturma',
    ],
    mart: [
      'Sosyal medyada sivil katılım ve pozitif kampanya oluşturmayı öğretmek',
      'Bilim ve Teknoloji Haftası bağlantılı örnek içerik hazırlama çalışması\n"Ormanı Koru" temalı afiş/kampanya taslağı tasarlama etkinliği',
    ],
    nisan: [
      '23 Nisan için sosyal medya kampanyası tasarlamak ve yürütmek',
      '23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kampanyası: öğrenci yaratıcı içerikleri\nTurizm Haftası bağlantılı "Türkiye\'yi Dünyaya Tanıt" sosyal medya yarışması',
    ],
    mayis: [
      'Yıl içi sosyal medya çalışmalarını analitik verilerle değerlendirmek',
      'Örnek içerikler üzerinden etkileşim inceleme ve değerlendirme etkinliği\n19 Mayıs kapsamında gençlik temalı sosyal medya içeriği kampanyası',
    ],
  },

  'Sosyal Sorumluluk Kulübü': {
    ekimEkstra: [
      'Sosyal sorumluluk kavramı ve proje döngüsünü tanıtmak',
      'Sosyal sorumluluk projesi adımları: tanımlama, planlama, uygulama, değerlendirme\nOkul ve mahallede hangi sosyal ihtiyaçlar var? keşif çalışması',
    ],
    kasim: [
      'Toplumsal dayanışma ve gönüllülük bilincini oluşturmak',
      'Atatürk Haftası kapsamında "Atatürk\'ün Toplum Anlayışı" sunumu\nOkul içi gönüllü proje başlatma: ihtiyaç analizi toplantısı',
    ],
    aralik: [
      'Kışa özgü dayanışma kampanyası yürütmek',
      'İnsan Hakları Haftası bağlantılı "Herkes İçin Onurlu Bir Yaşam" etkinliği\nKışlık giyim/gıda bağış kampanyasının toplanması ve dağıtımı',
    ],
    subat: [
      'Proje yönetimi ve etki ölçümü becerisi kazandırmak',
      'Sosyal etki ölçümü: projemizin etkisi ne oldu? çalışması\n2. dönem büyük proje seçimi ve ekip kurma toplantısı',
    ],
    mart: [
      'Çevre ve toplum iç içe: sosyal-çevre sorumluluğu projesini uygulamak',
      'Orman Haftası kapsamında okul bahçesi temizliği etkinliği\nGirişimcilik Haftası bağlantılı "Sosyal Girişimcilik" kavramı tanıtımı',
    ],
    nisan: [
      'Büyük proje çıktısını geniş kitleyle paylaşmak',
      '23 Nisan kapsamında kulübün sosyal sorumluluk projesi tanıtım panosu\nTurizm Haftası bağlantılı kültürel mirasa saygı konulu sunum',
    ],
    mayis: [
      'Yıl içi sosyal sorumluluk projelerini raporlamak ve sürdürülebilirlik planlamak',
      'Engelliler Haftası kapsamında "Engelsiz Toplum" projesi çıktısı sunumu\nYıl sonu proje raporu ve gelecek yıl öneri toplantısı',
    ],
  },

  'Sosyal Yardımlaşma Kulübü': {
    ekimEkstra: [
      'Yardımlaşma kültürünün tarihini ve önemini tanıtmak',
      'Türk yardımlaşma geleneği: imece, vakıf, dayanışma kavramları sunumu\nOkuldaki ve çevredeki ihtiyaç sahiplerini belirleme çalışması',
    ],
    kasim: [
      'Kızılay ve vakıf geleneğiyle yardımlaşma bilincini güçlendirmek',
      'Kızılay Haftası (29 Ekim–4 Kasım) bağlantılı yardımlaşma panosu\nAtatürk Haftası kapsamında "Atatürk\'ün Dayanışma Anlayışı" sunumu\n24 Kasım Öğretmenler Günü kapsamında öğretmenler için sürpriz dayanışma etkinliği',
    ],
    aralik: [
      'Kış yardımları kampanyasını planlamak ve uygulamak',
      'İnsan Hakları ve Demokrasi Haftası bağlantılı "Eşit Fırsatlar İçin Yardımlaşma" etkinliği\nKışlık giyim/oyuncak/kitap bağış kampanyası: toplama ve dağıtım',
    ],
    subat: [
      'Çocuk yoksulluğu ve dezavantajlı gruplar konusunda farkındalık oluşturmak',
      'Dünya\'da ve Türkiye\'de çocuk yoksulluğu araştırma sunumu\n2. dönem yardım projesi: hedef grup ve yöntem belirleme toplantısı',
    ],
    mart: [
      'Toplum hizmet projesini hayata geçirmek',
      'Orman Haftası bağlantılı okul çevresinde temizlik ve fidan bağışı dayanışma etkinliği\nKadın Günü bağlantılı "Kadına Destek" temalı farkındalık etkinliği',
    ],
    nisan: [
      'Yardım kampanyası sonuçlarını kamuoyuyla paylaşmak',
      '23 Nisan kapsamında kulübün yardım projeleri tanıtım panosu\nDünya Otizm Farkındalık Günü (2 Nisan) bağlantılı dayanışma etkinliği',
    ],
    mayis: [
      'Yıl içi yardımlaşma çalışmalarını değerlendirmek ve sürdürülebilir kılmak',
      'Engelliler Haftası (10-16 Mayıs) kapsamında "Engelsiz Dayanışma" etkinliği\nYıl sonu yardım miktarı ve etki raporunun hazırlanması',
    ],
  },

  'Tarih Kulübü': {
    ekimEkstra: [
      'Tarih yazımı ve tarihsel düşünce becerilerini tanıtmak',
      'Tarih nedir? Birincil/ikincil kaynak ayrımı ve tarihsel empati kavramı\nTürkiye\'nin tarihsel dönemleri genel bakış zaman çizelgesi',
    ],
    kasim: [
      'Atatürk dönemini ve Cumhuriyet tarihini derinlemesine incelemek',
      'Atatürk Haftası kapsamında "Kurtuluş Savaşı\'nın Tarihsel Arka Planı" sunumu\n10 Kasım anma törenine tarih kulübünün katkısı: dönem belgeleri sergisi\n24 Kasım kapsamında "Öğretmenler ve Tarih" sunumu',
    ],
    aralik: [
      'Osmanlı Devleti\'nin son dönemini ve çöküş sürecini incelemek',
      'Tanzimat\'tan Meşrutiyet\'e Osmanlı modernleşmesi kronoloji çalışması\nBalkan Savaşları ve I. Dünya Savaşı Osmanlı cephesi araştırma sunumu',
    ],
    subat: [
      'Türk tarihinin köklü uygarlıklarını incelemek',
      'Hitit, Frigler, Urartular: Anadolu\'nun kadim medeniyetleri sunumu\nTarihsel arkeoloji: nasıl araştırılır? çalışması',
    ],
    mart: [
      'Çanakkale Zaferi\'ni birincil kaynaklarla incelemek',
      'Şehitler Günü (18 Mart) kapsamında Çanakkale: birincil kaynak (mektup/hatıra) okuma çalışması\nKütüphaneler Haftası bağlantılı "Türk Tarihi Kitapları" tanıtım etkinliği',
    ],
    nisan: [
      '23 Nisan\'ın tarihsel bağlamını ve TBMM\'nin kuruluşunu kavratmak',
      '23 Nisan kapsamında "TBMM\'nin Kuruluşu ve Millî İrade" derinlemesine sunumu\nTurizm Haftası bağlantılı tarihsel yerler fotoğraf sergisi',
    ],
    mayis: [
      'Yıl içi tarih araştırmalarını sergilemek',
      '"Tarih Kulübü Araştırma Günlüğü" yıl sonu derleme sergisi\n19 Mayıs kapsamında "Kurtuluş Hareketi\'nin Başlangıcı" kronoloji sunumu',
    ],
  },

  'Teknofest ve Bilim Kulübü': {
    ekimEkstra: [
      'TEKNOFEST kategorilerini ve başvuru sürecini tanıtmak',
      'TEKNOFEST kategorileri (havacılık, roket, yapay zekâ, siberay, tarım) detaylı sunumu\nEkip oluşturma ve kategori seçimi toplantısı',
    ],
    kasim: [
      'Fikir geliştirme ve problem tanımlama becerisi kazandırmak',
      'Atatürk Haftası kapsamında "Bilim ve Teknolojide Türkiye\'nin Yükselişi" sunumu\nTasarım odaklı düşünme (design thinking) giriş çalışması',
    ],
    aralik: [
      'Proje fikrinin somutlaştırılması ve prototip planlaması yapmak',
      'Problem tanımı, çözüm önerisi ve başarı kriterleri çalışması\nProje prototip malzeme listesi ve bütçe planlaması',
    ],
    subat: [
      'İlk prototip yapımını tamamlamak',
      'Basit malzemelerle prototip/maket geliştirme çalışması\nProje ilerleme değerlendirme ve danışman öğretmenle görüşme',
    ],
    mart: [
      'Proje sunumunu tamamlamak ve TEKNOFEST başvuru sürecini tanımak',
      'Bilim ve Teknoloji Haftası (8-14 Mart) kapsamında kulübün proje ön sunumu\nTEKNOFEST başvuru sürecinin incelenmesi ve örnek başvuru dosyası hazırlama',
    ],
    nisan: [
      'TEKNOFEST elemeleri için hazırlığı tamamlamak',
      'Proje posterinin ve sunum dosyasının hazırlanması\n23 Nisan kapsamında "Geleceğin Mucitleri" proje tanıtım panosu',
    ],
    mayis: [
      'Yıl içi proje deneyimini sunmak ve raporlamak',
      'Yıl içi proje çalışmalarının sınıf içi sunumu ve değerlendirilmesi\n19 Mayıs kapsamında "Gençlik ve Millî Teknoloji" temalı sunum',
    ],
  },

  'Teknofest ve Bilim Kulübü (Proje Uygulaması)': {
    ekimEkstra: [
      'Seçilen TEKNOFEST projesinin uygulama takvimini belirlemek',
      'Proje çalışma planı: haftalık milestonelar ve görev dağılımı\nGerekli malzeme ve yazılım araçlarının tespiti',
    ],
    kasim: [
      'Yazılım/donanım entegrasyonunu başlatmak',
      'Atatürk Haftası kapsamında "Teknolojik Bağımsızlık ve Yerli Üretim" sunumu\nProje akış şeması ve tasarım çizimlerinin hazırlanması',
    ],
    aralik: [
      'Prototip entegrasyon testleri yapmak',
      'Kâğıt prototip üzerinde proje adımlarının gözden geçirilmesi\nProje defteri tutma ve dokümantasyon çalışması',
    ],
    subat: [
      'Prototip optimizasyonu ve performans testleri yapmak',
      'Proje başarı ölçütlerinin belirlenmesi çalışması\nTEKNOFEST kategorileri ve başvuru şartlarının incelenmesi',
    ],
    mart: [
      'Ürünü tanıtmak ve geri bildirim almak',
      'Bilim ve Teknoloji Haftası (8-14 Mart) kapsamında proje poster sunumu\nÖğretmenlerden geri bildirim alma etkinliği',
    ],
    nisan: [
      'Sunum becerisi ve poster hazırlığını tamamlamak',
      'Proje sunum becerisi çalışması: beden dili, soru yanıtlama, zaman yönetimi\n23 Nisan kapsamında "Geleceğin Teknoloji Öncüleri" panosu',
    ],
    mayis: [
      'Yıl içi proje çalışmalarını sunmak ve değerlendirmek',
      'Yıl içi proje çalışmalarının sunumu ve değerlendirilmesi\n19 Mayıs kapsamında proje panosu hazırlanması',
    ],
  },

  'Teknoloji ve İnovasyon Kulübü': {
    ekimEkstra: [
      'İnovasyon kavramı ve teknolojinin topluma etkisini tanıtmak',
      'Endüstri 4.0 ve beşinci nesil teknolojiler: yapay zekâ, IoT, blok zinciri tanıtımı\nOkul çevresinde hangi sorunları teknolojiyle çözebiliriz? keşif çalışması',
    ],
    kasim: [
      'Türkiye\'nin teknoloji hamlelerini ve yerli ürünleri tanıtmak',
      'Atatürk Haftası kapsamında "Teknolojik Bağımsızlık Yolunda Türkiye" sunumu\nBAYRAKTAR, TOGG, ASELSAN gibi yerli teknoloji ürünleri tanıtımı',
    ],
    aralik: [
      'Yapay zekâ ve makine öğrenmesini kavramsal olarak tanıtmak',
      'Yapay zekânın temel mantığı ve günlük hayattaki uygulamaları sunumu\nAkıllı şehir ve akıllı tarım kavramları tartışma çalışması',
    ],
    subat: [
      'İnovasyon proje fikri geliştirmek ve prototiplemek',
      'Tasarım odaklı düşünme çalışması: kullanıcı empati haritası ve çözüm tasarımı\n2. dönem inovasyon projesi ekip çalışması başlangıcı',
    ],
    mart: [
      'Proje prototipini tamamlamak ve sergilemeye hazırlamak',
      'Bilim ve Teknoloji Haftası (8-14 Mart) kapsamında inovasyon projesi demosu\nGirişimcilik Haftası bağlantılı "Tekno-Girişimcilik" kavramı tartışması',
    ],
    nisan: [
      'Okul geneline açık inovasyon sergisi düzenlemek',
      '23 Nisan kapsamında "Geleceğin İnovatörleri" proje ve ürün sergisi\nTurizm teknolojileri ve akıllı şehir bağlantılı Turizm Haftası etkinliği',
    ],
    mayis: [
      'Teknoloji yarışmalarını tanıtmak ve yılı değerlendirmek',
      'Teknoloji yarışmaları hakkında bilgilendirme sunumu ve yıl sonu değerlendirmesi\n19 Mayıs kapsamında "Gençlik ve Teknoloji: Türkiye\'nin Geleceği" temalı sunum',
    ],
  },

  'Telif Hakları Kulübü': {
    ekimEkstra: [
      'Fikri mülkiyet hakkı ve telif hukuku kavramlarını tanıtmak',
      'Telif hakkı, patent, marka ve endüstriyel tasarım ayrımı sunumu\nGünlük hayatta telif: müzik, film, fotoğraf, yazılım örnekleri çalışması',
    ],
    kasim: [
      'Atatürk\'ün eserleri ve telif bağlamını kavratmak',
      'Atatürk Haftası kapsamında "Atatürk\'ün Eserleri ve Kültürel Miras" sunumu\nNutuk\'un telif durumu ve erişim hakları tartışması',
    ],
    aralik: [
      'İnternet ortamında telif ihlallerini ve doğru kullanımı öğretmek',
      'Creative Commons lisansları ve özgür yazılım kavramı sunumu\nSosyal medyada fotoğraf, müzik ve video paylaşımında telif kuralları çalışması',
    ],
    subat: [
      'Türk edebiyatı ve sanatında telif sorunlarını incelemek',
      'Türk yazarlar ve bestecilerin eserlerinin korunması araştırma sunumu\nİntihal ve özgünlük: yazarlıkta etik değerler tartışması',
    ],
    mart: [
      'Kütüphaneler Haftasında açık erişim ve bilginin serbest dolaşımını tartışmak',
      'Kütüphaneler Haftası kapsamında "Açık Erişim ve Telif: Denge Nasıl Kurulur?" paneli\nBilim ve Teknoloji Haftası bağlantılı yazılım telifi ve açık kaynak tartışması',
    ],
    nisan: [
      'Dünya Fikrî Mülkiyet Günü etkinliği düzenlemek',
      'Dünya Fikrî Mülkiyet Günü (26 Nisan) kapsamında telif farkındalık panosu hazırlama\n23 Nisan kapsamında "Yaratıcılığı Korumak: Telif Hakkı" sunumu',
    ],
    mayis: [
      'Yıl içi telif farkındalık çalışmalarını raporlamak',
      'Bilişim Haftası kapsamında dijital içerik ve telif hakları bilgilendirme sunumu\nYıl içi farkındalık artışı değerlendirme toplantısı',
    ],
  },

  'Trafik ve İlkyardım Kulübü': {
    ekimEkstra: [
      'Trafik kuralları ve yaya güvenliğini tanıtmak',
      'Trafik işaretleri, zebra geçidi ve yaya önceliği konulu bilgilendirme\nOkul çevresi tehlikeli trafik noktaları haritalama çalışması',
    ],
    kasim: [
      'Trafik güvenliği farkındalığı ile Atatürk Haftası etkinliğini birleştirmek',
      'Atatürk Haftası kapsamında "Atatürk ve Modern Ulaşım" sunumu\nTrafik kaza istatistikleri ve önlenebilir riskler sunumu',
    ],
    aralik: [
      'Kış aylarında araç ve yaya güvenliğini öğretmek',
      'Karlı-buzlu yol güvenliği: sürücü ve yaya davranışları sunumu\nOkul servis güvenliği kontrol listesi hazırlama çalışması',
    ],
    subat: [
      'İlkyardım temellerini uygulamalı öğretmek',
      'Sivil Savunma Günü (28 Şubat) bağlantılı ilk yardım bilgilendirme sunumu\nTemel ilk yardım konularının (kanama kontrolü, kalp masajı) video destekli anlatımı',
    ],
    mart: [
      'Bisiklet ve aktif ulaşım güvenliğini tanıtmak',
      'Orman Haftası bağlantılı "Yeşil Ulaşım ve Trafik Güvenliği" etkinliği\nBisiklet güvenliği kuralları ve kask kullanımı tanıtımı',
    ],
    nisan: [
      'Trafik güvenliği konulu oyun ve yarışma düzenlemek',
      '23 Nisan kapsamında trafik işaretleri konulu sınıf içi oyun ve bilgi yarışması\nDünya Sağlık Haftası bağlantılı "Trafik Kazaları: Önlenebilir Ölümler" sunumu',
    ],
    mayis: [
      'Trafik ve İlkyardım Haftasında kapsamlı etkinlik düzenlemek',
      'Trafik ve İlkyardım Haftası (Mayıs ayının ilk haftası) kapsamında pano hazırlama ve bilgilendirme sunumu\nYıl içi güvenlik çalışmalarının değerlendirmesi',
    ],
  },

  'Türk Silahlı Kuvvetlerini Güçlendirme ve Tanıtma Kulübü': {
    ekimEkstra: [
      'Türk Silahlı Kuvvetleri\'nin tarihini ve görevlerini tanıtmak',
      'TSK\'nın teşkilat yapısı ve NATO içindeki konumu sunumu\nMehmetçiğin tarihsel kahramanlıkları kısa belgesel izleme etkinliği',
    ],
    kasim: [
      'Atatürk\'ün askeri dehası ve kurtuluş savaşındaki rolünü kavratmak',
      'Atatürk Haftası kapsamında "Komutan Atatürk: Askeri Deha" sunumu\n10 Kasım anma töreninde kulübün katkısı: saygı duruşu ve şiir',
    ],
    aralik: [
      'TSK\'nın teknolojik altyapısı ve modern silah sistemlerini tanıtmak',
      'BAYRAKTAR, SİPER, ALTAY gibi yerli savunma sanayii ürünleri tanıtımı\nSavunma sanayi ve mühendislik kariyer alanları sunumu',
    ],
    subat: [
      'Şehitlik ve gaziliğin toplumsal anlamını kavratmak',
      'Şehit aileleri dayanışma dernekleri ve TBMM İnsan Hakları Komisyonu tanıtımı\nŞehitliğe saygı: seçilmiş şehit hikayeleri sesli okuma etkinliği',
    ],
    mart: [
      'Çanakkale Zaferi\'ni ve şehitlikleri anmak',
      'Şehitler Günü (18 Mart) kapsamında Çanakkale Zaferi anma programı: şiir, konuşma, saygı duruşu\n"İstiklâl Marşı\'nın Kabulü" (12 Mart) etkinliğine kulübün katkısı',
    ],
    nisan: [
      'TSK\'nın barış misyonunu ve uluslararası görevlerini tanıtmak',
      '23 Nisan kapsamında "Bağımsız Vatan, Güçlü Ordu" temalı program\nTSK\'nın NATO ve BM barış görevleri sunumu',
    ],
    mayis: [
      '19 Mayıs\'ın askeri ve tarihsel önemini vurgulamak',
      '19 Mayıs Atatürk\'ü Anma, Gençlik ve Spor Bayramı kapsamında kulübün büyük programı: konuşma, şiir, ant\nYıl içi TSK tanıtım çalışmalarının değerlendirmesi',
    ],
  },

  'Uluslararası Teknoloji Yarışmaları ve Projeleri Kulübü': {
    ekimEkstra: [
      'Uluslararası teknoloji yarışmalarını ve başvuru süreçlerini tanıtmak',
      'FIRST Robotics, Google Science Fair, Intel ISEF, EU Science Olympiad gibi yarışmalar sunumu\nEkip oluşturma ve yarışma kategorisi seçimi',
    ],
    kasim: [
      'Proje fikri geliştirme ve uluslararası standartlara uygunluk becerisi kazandırmak',
      'Atatürk Haftası kapsamında "Türkiye\'nin Uluslararası Arenada Yeri" sunumu\nUluslararası proje başarı örnekleri inceleme ve motivasyon etkinliği',
    ],
    aralik: [
      'Proje tasarımını ve metodolojisini belirlemek',
      'Araştırma sorusu + hipotez + yöntem üçgeni çalışması\nİngilizce proje özeti yazma çalışması',
    ],
    subat: [
      'Prototip ve veri toplama aşamasını tamamlamak',
      'Deney/prototip geliştirme çalışması\nVeri analizi ve bulguların görselleştirilmesi çalışması',
    ],
    mart: [
      'Proje posterini ve İngilizce sunumunu hazırlamak',
      'Bilim ve Teknoloji Haftası (8-14 Mart) kapsamında proje ön sunumu\nUluslararası standartlarda bilim posteri hazırlama çalışması',
    ],
    nisan: [
      'Yarışma başvuru süreçlerini tanımak ve sunum pratiği yapmak',
      'Örnek yarışma başvuru dosyalarının incelenmesi\n23 Nisan kapsamında "Dünya Sahnesinde Türk Gençliği" sunumu',
    ],
    mayis: [
      'Yıl içi proje çalışmasını sunmak ve raporlamak',
      'Yıl içi proje çalışmasının sınıf içi final sunumu\n19 Mayıs kapsamında proje sonuçları değerlendirme etkinliği',
    ],
  },

  'UNESCO Kulübü': {
    ekimEkstra: [
      'UNESCO\'nun misyonunu ve Türkiye ile ilişkisini tanıtmak',
      'UNESCO\'nun çalışma alanları: eğitim, bilim, kültür, iletişim sunumu\nTürkiye\'nin UNESCO Dünya Mirası ve İnsanlığın Sözlü ve Somut Olmayan Kültürel Mirası listeleri',
    ],
    kasim: [
      'UNESCO Eğitim programlarını ve Atatürk\'ün eğitim vizyonunu kavratmak',
      'Atatürk Haftası kapsamında "UNESCO ve Atatürk\'ün Eğitim Mirası" sunumu\nÖğretmenler Günü (24 Kasım) bağlantılı UNESCO öğretmen ödülleri tanıtımı',
    ],
    aralik: [
      'UNESCO Dünya Miras alanlarını kültürel turizm perspektifinden incelemek',
      'İnsan Hakları Haftası bağlantılı "UNESCO ve İnsan Hakları" sunumu\nTürkiye\'den Dünya Mirası: Efes, Çatalhöyük, Truva, Göbeklitepe derinlemesine inceleme',
    ],
    subat: [
      'UNESCO\'nun sürdürülebilir kalkınma hedefleriyle (SDG) bağlantısını kavratmak',
      '17 Sürdürülebilir Kalkınma Hedefi ve eğitimle ilişkisi sunumu\n2. dönem UNESCO okul projesi başlatma toplantısı',
    ],
    mart: [
      'Somut olmayan kültürel miras koruma bilinci oluşturmak',
      'Kütüphaneler Haftası bağlantılı UNESCO "Yaratıcı Şehirler Ağı" tanıtımı\nOrman Haftası bağlantılı UNESCO Biyosfer Rezervleri sunumu',
    ],
    nisan: [
      'UNESCO Dünya Kitap Günü\'nü kutlamak',
      'Dünya Kitap Günü (23 Nisan) etkinliği: okuma kampanyası ve kitap takası\nTurizm Haftası bağlantılı "UNESCO Miras Alanlarına Sorumlu Turizm" sunumu',
    ],
    mayis: [
      'Yıl içi UNESCO çalışmalarını raporlamak ve sürdürmek',
      'UNESCO okul etiketi başvurusu araştırması\n19 Mayıs kapsamında "Gençlik, Barış ve UNESCO" temalı etkinlik',
    ],
  },

  'Yabancı Diller Kulübü': {
    ekimEkstra: [
      'Yabancı dil öğreniminin faydaları ve kulübün odaklanacağı dilleri tanıtmak',
      'Neden yabancı dil? Kariyer, kültür, iletişim sunumu\nKulübün çalışacağı dillerin belirlenmesi ve dil tanımlama aktivitesi',
    ],
    kasim: [
      'Çok dilli iletişim ve kültürel çeşitlilik bilinci oluşturmak',
      'Atatürk Haftası kapsamında "Atatürk\'ün Dil Politikaları ve Çağdaşlaşma" sunumu\nFarklı dillerde "Merhaba/Teşekkür" öğrenme mini çalışması',
    ],
    aralik: [
      'Seçilen dillerde temel ifadeler ve günlük dil pratiği kazandırmak',
      'Dil öğrenme uygulamaları (Duolingo, Babbel) tanıtımı ve kullanım çalışması\nYabancı dilde Noel/yılbaşı geleneklerini tanıma kültür etkinliği',
    ],
    subat: [
      'Yabancı film ve müzikle dil öğrenimini pekiştirmek',
      'Yabancı dil altyazılı kısa film/klip izleme ve tartışma çalışması\n2. dönem sınıf içi konuşma partneri eşleştirmesi',
    ],
    mart: [
      'Yabancı dilde sunum yapma becerisi kazandırmak',
      'Bilim ve Teknoloji Haftası bağlantılı yabancı dilde kısa sunum pratiği\nKütüphaneler Haftası kapsamında yabancı dil kitapları tanıtımı',
    ],
    nisan: [
      'Kültürlerarası dil etkinliği düzenlemek',
      'Yabancı dilde okul/şehir tanıtım yazısı hazırlama etkinliği\n23 Nisan kapsamında farklı ülkelerin dillerinde "Barış" sözcüğü çalışması',
    ],
    mayis: [
      'Yıl içi dil gelişimini değerlendirmek ve sergilemek',
      '"Dünya Dilleri Festivali" mini etkinliği: her dil grubundan kısa performans\n19 Mayıs kapsamında yabancı dilde gençlik ve bağımsızlık temalı konuşma',
    ],
  },

  'Yapay Zekâ Kulübü': {
    ekimEkstra: [
      'Yapay zekânın temellerini ve günümüzdeki uygulamalarını tanıtmak',
      'YZ nedir? Makine öğrenmesi, derin öğrenme ve büyük dil modelleri giriş sunumu\nGünlük hayatta YZ: öneri sistemleri, yüz tanıma, ses asistanları örnekleri',
    ],
    kasim: [
      'Türkiye\'nin yapay zekâ stratejisi ve ulusal hedeflerini kavratmak',
      'Atatürk Haftası kapsamında "Teknolojik Bağımsızlık: Yapay Zekâ Çağında Türkiye" sunumu\nUlusal Yapay Zekâ Stratejisi temel hedefleri özeti',
    ],
    aralik: [
      'Makine öğrenmesi temel kavramlarını uygulamalı keşfetmek',
      'Sınıflandırma ve kümeleme kavramlarının günlük hayattan örneklerle anlatımı\n"Yapay zekâ nasıl öğrenir?" sınıf içi örnekleme oyunu',
    ],
    subat: [
      'Doğal dil işleme (NLP) ve görüntü işleme temellerini keşfetmek',
      'ChatGPT ve büyük dil modelleri: nasıl çalışır? sunumu\nYapay zekâ araçlarının sınıf içi gösterimle tanıtılması',
    ],
    mart: [
      'YZ etik sorunlarını ve toplumsal etkisini tartışmak',
      'Bilim ve Teknoloji Haftası (8-14 Mart) kapsamında "Yapay Zekâ: Fırsatlar ve Riskler" paneli\nGörüntü tanıma ve veri gizliliği etik tartışması',
    ],
    nisan: [
      'YZ projesi sergisi düzenlemek',
      'Öğrenci yapay zekâ araştırma sunumları ve pano sergisi\n23 Nisan kapsamında "Geleceğin YZ Mühendisleri" panosu',
    ],
    mayis: [
      'Yapay zekâ yarışmalarını tanıtmak ve yılı değerlendirmek',
      'TEKNOFEST Yapay Zekâ kategorisi hakkında bilgilendirme sunumu\n19 Mayıs kapsamında "Gençlik ve Yapay Zekânın Geleceği" temalı sunum',
    ],
  },

  'Yayın ve İletişim Kulübü': {
    ekimEkstra: [
      'Gazetecilik ve iletişim dallarını tanıtmak\nOkul yayın organının yapısını belirlemek',
      'Gazete, dergi, radyo, TV, podcast, sosyal medya iletişim kanalları sunumu\nOkul bülteni/dergisi yönetim yapısı: editör, muhabir, fotoğrafçı rol dağılımı',
    ],
    kasim: [
      'Haber yazma tekniklerini ve gazetecilik etiğini öğretmek',
      'Atatürk Haftası kapsamında "Cumhuriyet Basını ve Atatürk" sunumu\n5N1K (ne, nerede, ne zaman, nasıl, neden, kim) haber yazma çalışması',
    ],
    aralik: [
      'Fotoğraf haberciliği ve görsel iletişim becerisi kazandırmak',
      'Haber fotoğrafçılığı: çerçeveleme, an ve etik kurallar çalışması\nOkul bülteni Aralık sayısı hazırlama ve yayınlama',
    ],
    subat: [
      'Sesli anlatım ve haber sunma becerisi kazandırmak',
      'Telefonla kısa ses kaydı deneme etkinliği\n2. dönem sınıf bülteni içerik planlaması',
    ],
    mart: [
      'Soruşturma gazeteciliği ve kaynak doğrulamayı öğretmek',
      'Kütüphaneler Haftası bağlantılı "Gerçeğin İzinde: Araştırmacı Gazetecilik" çalışması\nBilim ve Teknoloji Haftası bağlantılı bilim haberciliği nasıl yapılır? sunumu',
    ],
    nisan: [
      '23 Nisan özel sayısı yayınlamak\nSınıf içi mini basın toplantısı canlandırması düzenlemek',
      '23 Nisan Ulusal Egemenlik ve Çocuk Bayramı özel bülteni yayınlama\nSınıf içi "Genç Gazeteciler Basın Toplantısı" canlandırması',
    ],
    mayis: [
      'Yıl içi yayınları arşivlemek ve basın özgürlüğünü tartışmak',
      'Yıl içi bültenlerin arşivlenmesi ve en beğenilen yazıların seçilmesi\n19 Mayıs kapsamında "Gençlik Sesi: Medyada Genç Bakış" temalı program',
    ],
  },

  'Yeşilay Kulübü': {
    ekimEkstra: [
      'Yeşilay\'ın tarihini ve bağımlılıkla mücadeledeki rolünü tanıtmak',
      'Yeşilay\'ın kuruluşu (1920), misyonu ve okul kulüpleri programı sunumu\nBağımlılık türleri: madde, teknoloji, kumar farkındalık çalışması',
    ],
    kasim: [
      'Sigara ve alkol bağımlılığı risklerini kavratmak',
      'Atatürk Haftası kapsamında "Sağlıklı Nesil, Güçlü Türkiye" sunumu\nSigara ve alkol kullanımının beyin ve sağlığa etkileri sunumu',
    ],
    aralik: [
      'Teknoloji bağımlılığı ve sağlıklı ekran süresi yönetimini öğretmek',
      'Oyun ve sosyal medya bağımlılığı: belirtiler ve çözümler sunumu\nDijital detoks denemesi: 24 saatlik sosyal medya molası çalışması',
    ],
    subat: [
      'Akran baskısı ve reddedebilme becerisi kazandırmak',
      '"Hayır diyebiliyorum" rol yapma ve senaryo çalışması\n2. dönem Yeşilay farkındalık kampanyası başlatma',
    ],
    mart: [
      'Yeşilay Haftasında kapsamlı etkinlik düzenlemek',
      'Yeşilay Haftası (1 Mart) kapsamında bağımlılıkla mücadele etkinliği: pano, sunum, sınıf içi anket\n"Yeşilay Elçisi" sertifika programı bilgilendirmesi',
    ],
    nisan: [
      'Ruh sağlığı ve bağımlılık önleme ilişkisini kavratmak',
      'Dünya Sağlık Haftası bağlantılı "Ruh Sağlığı ve Bağımlılık" sunumu\n23 Nisan kapsamında "Bağımlılıksız Büyüyen Nesil" temalı program',
    ],
    mayis: [
      'Yıl içi bağımlılık önleme çalışmalarını değerlendirmek',
      'Engelliler Haftası bağlantılı "Engelsiz ve Bağımlılıksız Bir Yaşam" etkinliği\nYıl içi kampanya etki değerlendirme raporu hazırlama',
    ],
  },

  'Yeşili Koruma Kulübü': {
    ekimEkstra: [
      'Yeşil alanların önemi ve okul çevresindeki bitki örtüsünü tanıtmak',
      'Okul bahçesi bitki türleri kataloglama çalışması\nBitkisel yaşamın ekosistem hizmetleri sunumu',
    ],
    kasim: [
      'Ağaç ve ormanın iklim düzenleme rolünü kavratmak',
      'Atatürk Haftası kapsamında "Atatürk ve Ormancılık Politikaları" sunumu\nKarbon tutma ve oksijen üretiminde ağacın rolü interaktif ders',
    ],
    aralik: [
      'Kış bahçeciliği ve bitkileri koruma becerisi kazandırmak',
      'Saksı bitkilerinin kış bakımı çalışması\nOkul bahçesi kışlık koruma çalışması (don önleme, sulama)',
    ],
    subat: [
      'Tohum bankası ve bitki çoğaltma yöntemlerini öğretmek',
      'Saksıda tohum ekimi ve fide gözlem çalışması\n2. dönem okul bahçesi bahar düzenleme projesi planlama',
    ],
    mart: [
      'Orman Haftasında ekim ve bakım etkinliği düzenlemek',
      'Orman Haftası (21-26 Mart) kapsamında saksıya tohum/fide ekimi etkinliği\nOkul bahçesindeki bitkilerin bakımı ve basit sulama planı hazırlama',
    ],
    nisan: [
      'Biyoçeşitlilik ve endemik türler farkındalığı oluşturmak',
      'Dünya Sağlık Haftası bağlantılı "Sağlıklı Ekosistem, Sağlıklı İnsan" sunumu\n23 Nisan kapsamında okul bahçesi açık havada etkinlik',
    ],
    mayis: [
      'Yıl içi yeşil alanları koruma çalışmalarını raporlamak',
      'Çevre Koruma Haftası (Haziran öncesi) hazırlığı için yıllık bitki büyüme raporu\n19 Mayıs kapsamında "Gençlik ve Yeşil Türkiye" temalı sunum',
    ],
  },

  'Zeka Oyunları Kulübü': {
    ekimEkstra: [
      'Zekâ oyunlarının türlerini ve faydalarını tanıtmak',
      'Sudoku, bulmaca, strateji oyunları, mantık bulmacaları tanıtım çalışması\nZekâ oyunlarının beyin gelişimine katkısı sunumu',
    ],
    kasim: [
      'Mantık bulmacaları ve problem çözme becerisi geliştirmek',
      'Atatürk Haftası kapsamında "Strateji Düşünce ve Liderlik" sunumu\nHaftalık mantık bulmacası yarışması başlatma',
    ],
    aralik: [
      'Strateji oyunları turnuvası düzenlemek',
      'Satranç, Nim, Gomoku gibi strateji oyunları turnuvası (1. aşama)\nOkul geneline açık zekâ oyunları denemesi etkinliği',
    ],
    subat: [
      'Matematiksel düşünme ve sayı bulmacaları becerisi geliştirmek',
      'Sudoku, Kakuro ve sayı bulmacaları yoğunlaştırılmış çalışması\n2. dönem okul zekâ olimpiyatı planlama toplantısı',
    ],
    mart: [
      'Bilim ve mantık arasındaki köprüyü kurmak',
      'Bilim ve Teknoloji Haftası bağlantılı "Zekâ ve Bilimsel Düşünce" etkinliği\nOkul zekâ oyunları turnuvası yarı final maçları',
    ],
    nisan: [
      'Okul zekâ olimpiyatını gerçekleştirmek',
      'Okul Zekâ Olimpiyatı final yarışması ve ödüllendirme\n23 Nisan kapsamında tüm yaş gruplarına açık zekâ oyunları şenliği',
    ],
    mayis: [
      'Yıl sonu zekâ oyunları etkinliği düzenlemek\nYıl içi gelişimi değerlendirmek',
      'Yıl sonu sınıf içi bulmaca ve zekâ oyunları şenliği\n19 Mayıs kapsamında "Zekâ ve Bağımsızlık" temalı bulmaca etkinliği',
    ],
  },

  'Zeytin Ağacı Kulübü': {
    ekimEkstra: [
      'Zeytinin Anadolu kültüründeki yerini ve ekonomik önemini tanıtmak',
      'Zeytin tarihçesi: 6.000 yıllık Anadolu kültürü sunumu\nTürkiye\'nin zeytin üretimi ve ihracatı araştırma çalışması',
    ],
    kasim: [
      'Zeytin hasadı dönemine özgü kültürel etkinlik düzenlemek',
      'Atatürk Haftası kapsamında "Tarım ve Kalkınma: Zeytin Örneği" sunumu\nZeytin hasadı geleneği ve yöresel pratikler araştırma etkinliği',
    ],
    aralik: [
      'Zeytinyağı üretimi ve sağlığa faydalarını kavratmak',
      'Zeytinyağının sağlığa etkileri ve Akdeniz diyeti sunumu\nZeytin çeşitleri ve zeytinyağı üretim süreci konulu görsel sunum',
    ],
    subat: [
      'Zeytin ağacı bakımı ve sürdürülebilir tarım uygulamalarını öğretmek',
      'Zeytin ağacı budama, sulama ve organik yetiştiricilik bilgilendirmesi\n2. dönem okul bahçesi/saksı zeytin fidesi yetiştirme projesi başlatma',
    ],
    mart: [
      'Orman, doğa ve zeytin ağacının biyoçeşitlilik içindeki rolünü kavratmak',
      'Orman Haftası (21-26 Mart) bağlantılı "Zeytin Ağacı: Anadolu\'nun Hafızası" etkinliği\nSaksıda zeytin çekirdeği ekme denemesi (sembolik)',
    ],
    nisan: [
      'Zeytin kültürünü Akdeniz medeniyeti perspektifinden tanıtmak',
      'Turizm Haftası (15-22 Nisan) bağlantılı "Zeytin Rotaları: Gastronomik Turizm" sunumu\n23 Nisan kapsamında zeytin ve barış temalı "Zeytin Dalı" etkinliği',
    ],
    mayis: [
      'Yıl içi zeytin kültürü çalışmalarını raporlamak ve fidanları değerlendirmek',
      'Yetiştirilen zeytin fidelerinin durumu değerlendirme ve bakım rehberi hazırlama\n19 Mayıs kapsamında "Köklü Gençlik: Zeytin Gibi" temalı etkinlik',
    ],
  },

};

// Placeholder profil — KULUP_PROFILLERI'de karşılığı bulunamayan kulüp adları için güvenlik ağı
function placeholderProfil(kulupAdi: string): KulupProfil {
  return {
    kasim:  [`${kulupAdi} kapsamında Atatürk Haftası etkinliğine katkı sağlamak\nÖğretmenler Günü etkinliğine destek olmak`, `Atatürk Haftası (10-16 Kasım) kapsamında kulüp etkinliği\n24 Kasım Öğretmenler Günü programına kulübün katkısı`],
    aralik: [`${kulupAdi} temasıyla ilgili farkındalık oluşturmak`, `Kulüp konusuyla ilgili araştırma ve sunum çalışması\nİnsan Hakları ve Demokrasi Haftası (10 Aralık) kapsamında kulüp etkinliği`],
    subat:  [`2. yarıyıl çalışmalarını planlamak\n${kulupAdi} konusunda uygulamalı beceri geliştirmek`, `2. yarıyıl etkinlik takviminin hazırlanması\nUygulama çalışması ve grup çalışması`],
    mart:   [`${kulupAdi} teması kapsamında Mart ayı etkinliklerini gerçekleştirmek`, `Bilim ve Teknoloji Haftası ve Orman Haftası bağlantılı etkinlik\nKulüp konusuyla ilgili sunum ve tartışma`],
    nisan:  [`23 Nisan etkinliklerine kulübün katkısını sağlamak\n${kulupAdi} kapsamında proje/sunum hazırlamak`, `23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kapsamında kulüp etkinliği\nProje/sunum hazırlama ve sergileme`],
    mayis:  [`19 Mayıs etkinliklerine katılım sağlamak\nYıl içi çalışmaları tamamlamak`, `19 Mayıs Atatürk\'ü Anma, Gençlik ve Spor Bayramı etkinliklerine kulübün katkısı\nEngelliler Haftası (10-16 Mayıs) kapsamında kulüp faaliyeti`],
  };
}

// ── Ana üretici fonksiyon ───────────────────────────────────────────────────
export function kulupVarsayilanEtkinlikleri(kulupAdi: string): KulupEtkinlikSatiri[] {
  const profil: KulupProfil =
    KULUP_PROFILLERI[kulupAdi] ?? placeholderProfil(kulupAdi);

  const ekimAmac = profil.ekimEkstra
    ? ORTAK_EKIM_AMAC + '\n' + profil.ekimEkstra[0]
    : ORTAK_EKIM_AMAC;
  const ekimEtkinlik = profil.ekimEkstra
    ? ORTAK_EKIM_ETKINLIK + '\n' + profil.ekimEkstra[1]
    : ORTAK_EKIM_ETKINLIK;

  const aylar: Array<[string, string, string, string]> = [
    ['EYLÜL',   ORTAK_EYLUL[0],      ORTAK_EYLUL[1],        EK8.EYLÜL],
    ['EKİM',    ekimAmac,            ekimEtkinlik,          EK8.EKİM],
    ['KASIM',   profil.kasim[0],     profil.kasim[1],       EK8.KASIM],
    ['ARALIK',  profil.aralik[0],    profil.aralik[1],      EK8.ARALIK],
    ['OCAK',    ORTAK_OCAK[0],       ORTAK_OCAK[1],         EK8.OCAK],
    ['ŞUBAT',   profil.subat[0],     profil.subat[1],       EK8.ŞUBAT],
    ['MART',    profil.mart[0],      profil.mart[1],        EK8.MART],
    ['NİSAN',   profil.nisan[0],     profil.nisan[1],       EK8.NİSAN],
    ['MAYIS',   profil.mayis[0],     profil.mayis[1],       EK8.MAYIS],
    ['HAZİRAN', ORTAK_HAZIRAN[0],    ORTAK_HAZIRAN[1],      EK8.HAZİRAN],
  ];

  return aylar.map(([tarih, amac, etkinlikler, belirliGunler], i) => ({
    no: i + 1, tarih, amac, etkinlikler, belirliGunler,
  }));
}

// ── Toplum Hizmeti Çalışma Planı — yıllık plandan türetilir ─────────────────
export function kulupVarsayilanToplumHizmetSatirlari(kulupAdi: string): ToplumHizmetSatiri[] {
  return kulupVarsayilanEtkinlikleri(kulupAdi).map((e, i) => ({
    no: i + 1,
    ay: e.tarih,
    hafta: e.tarih === 'HAZİRAN' ? '2. Hafta' : '3. Hafta',
    sure: '1 Ders Saati',
    konular: e.etkinlikler.split('\n')[0]?.trim() ?? '',
    katilanlar: 'Kulüp öğrencileri ve Danışman öğretmen',
    degerlendirme: '',
  }));
}
