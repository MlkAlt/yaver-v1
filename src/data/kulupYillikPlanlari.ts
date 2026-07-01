// Kulüp Yıllık Çalışma Planı — EK-7/b içerik havuzu
// Format: AYLIK (Ekim → Haziran, 9 satır) — gerçek okul planlarıyla hizalı.
// Strateji: Ekim/Ocak/Haziran ortak şablondan, diğer 6 ay kulübe özgü.
// İçerik kaynağı: gerçek okul belgelerinden türetildi (Karatay TMTAL, 2025-2026).
import { KulupEtkinlikSatiri } from './kulupSablon';

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

// ── Ortak Ekim/Ocak/Haziran şablonları ──────────────────────────────────────
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
      'Soğuk hava, buz ve yangın riskleri üzerine bilgilendirme semineri\nAfet çantası içeriği belirleme ve hazırlama atölyesi\nOkul afet planının incelenmesi',
    ],
    subat: [
      'Sivil savunma uygulamaları konusunda deneyim kazandırmak\nTahliye prosedürlerini öğretmek',
      'Sivil Savunma Günü (28 Şubat) kapsamında okul içi tahliye tatbikatı\nTahliye güzergâhları ve toplanma noktalarının belirlenmesi\nAfet tatbikat değerlendirme toplantısı',
    ],
    mart: [
      'Deprem bilinci ve dayanıklı yapı kavramını öğretmek\nOrman yangınlarına karşı farkındalık oluşturmak',
      'Deprem riski ve güvenli davranış kuralları semineri\nOrman Haftası (21-26 Mart) kapsamında orman yangını önleme bilgilendirmesi\nAfet haritası hazırlama etkinliği',
    ],
    nisan: [
      'Temel ilk yardım becerisi kazandırmak\nAfet sonrası destek mekanizmalarını tanıtmak',
      'Dünya Sağlık Haftası (7-13 Nisan) bağlantılı temel ilk yardım atölyesi\nAfet sonrası psikolojik destek ve toparlanma süreci bilgilendirmesi',
    ],
    mayis: [
      'Yıl sonu kapsamlı afet tatbikatı gerçekleştirmek\nKulüp çalışmalarını paylaşmak',
      'Okul genelini kapsayan afet tatbikatı organizasyonu\n19 Mayıs etkinliklerine kulübün katkısı\nYıl içi afet farkındalık çalışmalarının sergilenmesi',
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
      'Tutum, Yatırım ve Türk Malları Haftası (12-18 Aralık) kapsamında Ahilik ve yerli üretim sunumu\nEsnaf ziyareti ve üretim süreci gözlemi',
    ],
    subat: [
      'Ahilik yazılı geleneğini (fütüvvetnâme) tanıtmak\nMeslek ahlakı ilkelerini günümüze uyarlamak',
      'Fütüvvetnâme metinlerinden seçkiler inceleme etkinliği\n"Günümüzde Ahilik Değerleri" konulu tartışma oturumu',
    ],
    mart: [
      'Girişimcilik ve Ahilik bağını pekiştirmek\nÜretim ve emek değerlerini kavratmak',
      'Girişimcilik Haftası (Mart ayının ilk haftası) kapsamında Ahilik-girişimcilik ilişkisi sunumu\nÖğrencilerin meslek/iş fikri geliştirme atölyesi',
    ],
    nisan: [
      'Ahilik geleneğini yaşayan örneklerle buluşturmak',
      'Yerel esnaf veya zanaatkârla söyleşi/atölye ziyareti\n23 Nisan kapsamında "Gençlik ve Üretim" temalı etkinlik',
    ],
    mayis: [
      'Yıl içi Ahilik çalışmalarını sergilemek',
      'Öğrenci sunumları ve el işi/zanaat ürünleri sergisi\nMeslek ve zanaat değerlerini anlatan yıl sonu programı',
    ],
  },

  'Astronomi ve Uzay Kulübü': {
    ekimEkstra: [
      'Gözlem ekipmanlarını tanıtmak ve gözlem takvimi oluşturmak',
      'Teleskop ve gözlem araçlarının tanıtımı\nYıl içi gözlem takviminin hazırlanması',
    ],
    kasim: [
      "Uzay keşiflerinin tarihini ve Türkiye'nin uzay çalışmalarını tanıtmak",
      "Atatürk Haftası kapsamında 'Modernleşme ve Bilim' sunumu\nTürkiye Uzay Ajansı ve yerli uzay çalışmaları tanıtım semineri\nGök cisimlerinden haberciler: meteor, kuyruklu yıldız sunumu",
    ],
    aralik: [
      'Kış gökyüzü gözlem deneyimi kazandırmak\nTakımyıldızları öğretmek',
      'Kış takımyıldızları gözlem etkinliği (açık hava/teleskop)\nOrion, Büyükayı ve kuzey yıldızı konumları atölyesi\nGözlem günlüğü tutma uygulaması',
    ],
    subat: [
      'Güneş sistemi modelini uygulamalı olarak kavratmak',
      'Maket güneş sistemi yapım atölyesi\nGezegen boyutları ve mesafeleri ölçek çalışması',
    ],
    mart: [
      'Bilim ve uzay teknolojileri arasındaki bağı pekiştirmek\nProje sunumu deneyimi kazandırmak',
      'Bilim ve Teknoloji Haftası (8-14 Mart) kapsamında uzay teknolojileri projesi sergisi\nMaket roket veya uydu tasarım atölyesi',
    ],
    nisan: [
      'Astronomi bilgisini pekiştirmek ve paylaşmak',
      'Okul geneline açık astronomi quizi\n23 Nisan kapsamında "Geleceğin Uzay Bilimcileri" sunumu',
    ],
    mayis: [
      'Yıl sonu gözlem etkinliği gerçekleştirmek\nKulüp çalışmalarını değerlendirmek',
      'Yıl sonu gözlem gecesi veya simülasyon etkinliği\n19 Mayıs kapsamında "Gençlik ve Bilim" temalı sunum\nGözlem günlüklerinin paylaşımı ve değerlendirme',
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
      'Bilimsel yöntem adımları ve deney tasarımı atölyesi\nYıl içi proje konularının ön araştırması',
    ],
    kasim: [
      "Türk ve dünya bilim insanlarını tanıtmak\nBilimin modernleşmedeki rolünü kavratmak",
      "Atatürk Haftası kapsamında 'Modernleşme ve Bilim Devrimi' sunumu\nTürkiye'den ve dünyadan öncü bilim insanları araştırma ve paylaşım etkinliği",
    ],
    aralik: [
      'Fen deneyleri aracılığıyla merak ve gözlem becerisi geliştirmek',
      'Güvenli ve eğlenceli fen deneyleri atölyesi (yanardağ, balon roketi vb.)\nDeney günlüğü tutma uygulaması\nProje konusu belirleme ve planlama toplantısı',
    ],
    subat: [
      'Bilim fuarı projesi geliştirmek\nDeney ve araştırma becerisi pekiştirmek',
      'Proje ekiplerinin oluşturulması ve deney planı hazırlama\nBilimsel hipotez kurma ve veri toplama atölyesi',
    ],
    mart: [
      'Bilim ve Teknoloji Haftasında kulübü temsil etmek\nProje sergisi düzenlemek',
      'Bilim ve Teknoloji Haftası (8-14 Mart) kapsamında proje/deney sergisi\nÖğrenci proje sunumları ve jüri değerlendirmesi\nOkul geneline açık interaktif deney gösterimi',
    ],
    nisan: [
      'Bilim fuarı sonuçlarını değerlendirmek\nİleri düzey araştırma konularını tanıtmak',
      'Bilim fuarı değerlendirme ve ödüllendirme toplantısı\n23 Nisan kapsamında "Geleceğin Bilim İnsanları" sunumu',
    ],
    mayis: [
      'TÜBİTAK ve ulusal bilim etkinliklerine hazırlanmak\nYıl içi çalışmaları paylaşmak',
      'TÜBİTAK 4006/4007 fuarı veya benzer ulusal etkinlik başvuru hazırlığı\n19 Mayıs kapsamında bilim standı kurulması\nYıl içi deney günlüklerinin ve proje dosyalarının sergilenmesi',
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
      'Kızılay Haftası (29 Ekim–4 Kasım) kapsamında bağış standı kurulması\nKan bağışının önemi üzerine okul genelinde bilgilendirme\nAtatürk Haftası etkinliklerinde kulübün katkısı',
    ],
    aralik: [
      'İhtiyaç sahiplerine yardım bilincini geliştirmek\nInsani yardım faaliyetlerini tanıtmak',
      'Kışlık kıyafet/eşya bağış kampanyası planlanması ve duyurusu\nYardım kampanyasının okul genelinde uygulamaya konulması',
    ],
    subat: [
      'Afet ve insani yardım bilincini pekiştirmek',
      'Afet senaryosu ve Kızılay\'ın afetlerdeki rolü semineri\nSivil Savunma Günü (28 Şubat) kapsamında kulüp faaliyeti',
    ],
    mart: [
      'Toplumsal dayanışma kültürünü yaymak\nOrman ve çevre konusunda farkındalık oluşturmak',
      'Fidan dikimi ve çevre temizliği toplum hizmet etkinliği\nOrman Haftası (21-26 Mart) kapsamında "Her Çocuk Bir Fidan" kampanyasına katılım',
    ],
    nisan: [
      'Kan bağışı kampanyasını yaygınlaştırmak\n23 Nisan etkinliklerinde kulübü temsil etmek',
      'Okul genelinde kan bağışı farkındalık etkinliği\n23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kapsamında kulüp standı',
    ],
    mayis: [
      'Sosyal sorumluluk projesi sonuçlarını paylaşmak\nYıl içi çalışmaları raporlamak',
      'Yıl içi yardım kampanyalarının değerlendirme toplantısı\nEngelliler Haftası (10-16 Mayıs) kapsamında dayanışma etkinliği\n19 Mayıs etkinliklerine kulüp katkısı',
    ],
  },

  'Robotik Kodlama Kulübü': {
    kasim: [
      'Algoritmik düşünme becerisi geliştirmek\nTeknoloji okuryazarlığını artırmak',
      'Blok tabanlı kodlama giriş atölyesi\nAtatürk Haftası kapsamında teknoloji ve modernleşme temalı sunum',
    ],
    aralik: [
      'Proje fikri geliştirme becerisi kazandırmak',
      'Proje konularının belirlenmesi ve ekip oluşturma\nBasit sensör/devre uygulamaları atölyesi',
    ],
    subat: [
      'Prototip geliştirme becerisi kazandırmak',
      'Prototip tasarım ve geliştirme çalışması\nProje ilerleme değerlendirme toplantısı',
    ],
    mart: [
      'Bilim ve teknoloji farkındalığı oluşturmak\nProjeleri sergilemek',
      'Bilim ve Teknoloji Haftası (8-14 Mart) kapsamında proje/robot sergisi\nProje geliştirme atölyesine devam',
    ],
    nisan: [
      'Proje tamamlama ve sunum becerisi kazandırmak',
      'Proje tamamlama ve test çalışmaları\n23 Nisan kapsamında teknoloji sergisi',
    ],
    mayis: [
      'Yıl sonu proje sunumu deneyimi kazandırmak',
      'Bilişim Haftası (Mayıs ilk haftası) kapsamında proje gösterisi\nOkullar arası yarışma için hazırlık\n19 Mayıs etkinliklerine kulüp katkısı',
    ],
  },

  'Çevre Koruma Kulübü': {
    kasim: [
      'Çevre kirliliği ve korunması konusunda bilinç oluşturmak',
      'Çevre kirliliğinin nedenleri ve çözümleri semineri\nAtatürk Haftası kapsamında "Atatürk ve Çevre" temalı pano',
    ],
    aralik: [
      'Geri dönüşüm bilincini yerleştirmek\nIsrafi önlemeyi teşvik etmek',
      'Atık ayrıştırma ve geri dönüşüm atölyesi\nOkul genelinde çevre bilinci afiş çalışması',
    ],
    subat: [
      'İklim değişikliği konusunda farkındalık oluşturmak',
      'İklim değişikliği ve küresel ısınma semineri\nEko-ayak izi hesaplama atölyesi',
    ],
    mart: [
      'Orman ve doğa bilincini pekiştirmek\nUygulamalı çevre katkısı sağlamak',
      'Orman Haftası (21-26 Mart) kapsamında fidan dikimi etkinliği\nOkul bahçesi temizlik ve düzenleme çalışması',
    ],
    nisan: [
      'Çevre koruma sorumluluğunu davranışa dönüştürmek',
      'Dünya Sağlık Haftası bağlantılı "temiz çevre, sağlıklı yaşam" etkinliği\nGeri dönüşüm malzemeleriyle sanat atölyesi',
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
      'Doğaçlama egzersizleri ve sahne duruşu atölyesi\nAtatürk Haftası için kısa anlamlı skeç çalışması',
    ],
    aralik: [
      'Prova disiplini ve metin ezber becerisi geliştirmek',
      'Oyun metni üzerinde çalışma ve metin analizi\nSahne düzeni ve kostüm planlaması',
    ],
    subat: [
      'Sahne performansını olgunlaştırmak',
      'Yoğunlaştırılmış prova çalışmaları\nSahne teknik çalışması (ışık, ses)',
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
      'Yaratıcı problem çözme atölyesi\nAtatürk Haftası kapsamında "Modernleşme ve Bilim" sunumu',
    ],
    aralik: [
      'Matematiği günlük hayatla ilişkilendirmek',
      'Matematik bulmacaları ve zekâ oyunları etkinliği\nMath Olympiad (kısa) tarz problem çözme yarışması',
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
      'Yıl sonu matematik olympiadını tamamlamak',
      'Okullar arası matematik yarışmasına katılım/hazırlık\n19 Mayıs etkinliklerine kulübün katkısı',
    ],
  },

  'Satranç Kulübü': {
    kasim: [
      'Satranç kurallarını pekiştirmek\nStrateji düşüncesini geliştirmek',
      'Temel açılışlar ve taktikler eğitimi\nKulüp üyeleri arası dostluk maçları',
    ],
    aralik: [
      'Turnuva deneyimi kazandırmak',
      'Okul içi satranç turnuvası 1. tur maçları\nTurnuva kuralları ve etik değerler semineri',
    ],
    subat: [
      'Orta ve son oyun taktiklerini öğretmek',
      'Orta oyun stratejileri atölyesi\n2. dönem turnuva takviminin oluşturulması',
    ],
    mart: [
      'İleri teknik becerileri kazandırmak',
      'Son oyun teknikleri ve mat kombinasyonları atölyesi\nOkul satranç turnuvası yarı final maçları',
    ],
    nisan: [
      'Turnuva finalini gerçekleştirmek',
      'Okul satranç şampiyonası final maçları\nŞampiyon öğrencinin ödüllendirilmesi',
    ],
    mayis: [
      'Okullar arası satranç etkinliğine katılmak',
      'Okullar arası satranç turnuvasına katılım\nYıl içi kulüp çalışmalarının değerlendirilmesi',
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
      '2. dönem turnuva konularının belirlenmesi\nÇapraz sorgulama teknikleri atölyesi',
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
      'Okullar arası münazara deneyimi kazandırmak',
      'Okullar arası münazaraya katılım\nYıl içi kulüp çalışmalarının değerlendirilmesi',
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
      'Reklam dili ve tüketiciye yönelik manipülasyon teknikleri semineri\nAtatürk Haftası kapsamında "Millî Ekonomi ve Yerli Üretim" sunumu',
    ],
    aralik: [
      'Yerli malı bilincini ve tasarruf alışkanlığını güçlendirmek',
      'Tutum, Yatırım ve Türk Malları Haftası (12-18 Aralık) kapsamında yerli ürün tanıtım etkinliği\nİsraf önleme ve ekonomik tüketim alışkanlıkları atölyesi',
    ],
    subat: [
      'Tüketici aldatmacaları ve sahte ürün sorununu tanıtmak',
      'Sahte ürün ve internet dolandırıcılığı farkındalık semineri\nTüketici şikâyet mekanizmaları araştırma etkinliği',
    ],
    mart: [
      'Tüketiciyi Koruma Haftasında aktif etkinlik düzenlemek',
      'Tüketiciyi Koruma Haftası (15-21 Mart) kapsamında okul genelinde bilinçli tüketici kampanyası\nAlışveriş sepeti analizi ve fiyat karşılaştırma atölyesi',
    ],
    nisan: [
      'Sürdürülebilir tüketim bilinci oluşturmak',
      'Çevre dostu alışveriş ve geri dönüşüm ekonomisi semineri\n23 Nisan kapsamında "Geleceğin Bilinçli Tüketicileri" standı',
    ],
    mayis: [
      'Yıl içi tüketici hakları çalışmalarını paylaşmak',
      'Kulüp çalışmalarının değerlendirme toplantısı\n19 Mayıs kapsamında "Bilinçli Gençlik, Güçlü Ekonomi" temalı etkinlik',
    ],
  },

  'Bilişim ve İnternet Kulübü': {
    ekimEkstra: [
      'Dijital okuryazarlık ve internet güvenliği temellerini tanıtmak',
      'İnternet güvenliği ve kişisel bilgi koruma konulu giriş semineri\nYıl içi proje konularının belirlenmesi',
    ],
    kasim: [
      'Siber güvenlik ve güvenli internet kullanımı bilinci oluşturmak',
      'Güçlü şifre oluşturma, kimlik avı saldırıları konulu atölye\nAtatürk Haftası kapsamında "Teknoloji ve Modernleşme" sunumu',
    ],
    aralik: [
      'Kişisel veri gizliliği ve dijital iz farkındalığı sağlamak',
      'Kişisel Verileri Koruma Günü (7 Nisan öncesi hazırlık) için araştırma başlatma\nSosyal medyada mahremiyet ve dijital iz konulu seminer',
    ],
    subat: [
      'Zararlı içerik ve siber zorbalıkla mücadele becerisi kazandırmak',
      'Siber zorbalık tanıma ve başa çıkma yöntemleri atölyesi\nGüvenli internet kullanımı broşürü hazırlama etkinliği',
    ],
    mart: [
      'Yazılım ve kodlama alanında uygulama deneyimi kazandırmak',
      'Bilim ve Teknoloji Haftası (8-14 Mart) kapsamında öğrenci yazılım projeleri sergisi\nTemel web tasarımı veya blok kodlama atölyesi',
    ],
    nisan: [
      'Kişisel Verileri Koruma Günü etkinliği düzenlemek\nDijital okuryazarlığı yaygınlaştırmak',
      'Kişisel Verileri Koruma Günü (7 Nisan) kapsamında okul geneli farkındalık kampanyası\n23 Nisan kapsamında teknoloji temalı proje sunumu',
    ],
    mayis: [
      'Bilişim Haftasında kulübü temsil etmek\nYıl içi projeleri sergilemek',
      'Bilişim Haftası (Mayıs ayının ilk haftası) kapsamında proje ve tasarım sergisi\n19 Mayıs etkinliklerine teknoloji standıyla katkı',
    ],
  },

  'Çevre ve İklim Kulübü': {
    ekimEkstra: [
      'İklim değişikliği ve küresel ısınma kavramlarını tanıtmak',
      'İklim değişikliğinin nedenleri ve sonuçları konulu giriş semineri\nEko-ayak izi hesaplama atölyesi',
    ],
    kasim: [
      'Küresel iklim krizinin farkındalığını artırmak\nİklim adaleti kavramını tanıtmak',
      'COP zirvesi ve uluslararası iklim anlaşmaları konulu sunum\nAtatürk Haftası kapsamında "Çağdaşlaşma ve Çevre" temalı etkinlik',
    ],
    aralik: [
      'Enerji verimliliği ve yenilenebilir enerji bilincini yerleştirmek',
      'Güneş, rüzgâr, jeotermal enerji kaynakları tanıtım semineri\nOkul enerji tasarrufu kampanyası planlama toplantısı',
    ],
    subat: [
      'Sürdürülebilir yaşam alışkanlıkları geliştirmek',
      'Sıfır atık ve sürdürülebilir tüketim atölyesi\n2. dönem iklim projesi başlatma toplantısı',
    ],
    mart: [
      'Orman ve biyoçeşitliliği koruma bilincini güçlendirmek',
      'Orman Haftası (21-26 Mart) kapsamında fidan dikimi ve habitat araştırması\nİklim değişikliğinin ekosistemlere etkisi semineri',
    ],
    nisan: [
      'İklim değişikliğiyle mücadelede bireysel sorumluluk bilinci oluşturmak',
      'Dünya Sağlık Günü/Haftası (7-13 Nisan) bağlantılı "Sağlıklı Gezegen, Sağlıklı İnsan" etkinliği\n23 Nisan kapsamında iklim farkındalık standı',
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
      'Dünya Çocuk Hakları Günü (20 Kasım) kapsamında okul geneli farkındalık programı: sunum, sergi, şiir\nAtatürk Haftası ve Öğretmenler Günü (24 Kasım) kapsamında "Eğitim: Temel Bir Hak" etkinliği',
    ],
    aralik: [
      'İnsan hakları bağlamında çocuk haklarını pekiştirmek',
      'İnsan Hakları ve Demokrasi Haftası (10 Aralık) kapsamında çocuk hakları paneli\nÇocuk işçiliği ve yoksulluk farkındalık sunumu',
    ],
    subat: [
      'Dijital ortamda çocuk haklarını ve güvenliğini tanıtmak',
      'İnternette çocuk hakları: mahremiyet, güvenlik ve siber zorbalık semineri\n2. dönem hak savunuculuğu projesi başlatma toplantısı',
    ],
    mart: [
      'Kız çocuklarının eğitim ve fırsat eşitliği hakkını güncellemek',
      'Dünya Kadınlar Günü (8 Mart) bağlantılı "Kız Çocukları ve Eğitim" sunumu\nÇocuk hakları ihlalleri araştırma ve sunum atölyesi',
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
      'Empati ve bakış açısı alma oyunları atölyesi\n"Farklılıklarımız Zenginliğimiz" temalı etkinlik',
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
      'İnsan Hakları ve Demokrasi Haftası (10 Aralık) kapsamında okul paneli ve sergi\nEvrensel İnsan Hakları Beyannamesi 75. yıl etkinliği',
    ],
    subat: [
      'Seçim sistemi ve sivil katılım mekanizmalarını öğretmek',
      'Model seçim simülasyonu atölyesi\n2. dönem okul meclisi etkinliklerini planlama toplantısı',
    ],
    mart: [
      'Kadın hakları ve toplumsal cinsiyet eşitliği konusunda farkındalık oluşturmak',
      'Dünya Kadınlar Günü (8 Mart) kapsamında kadın hakları ve eşitlik paneli\nOrman Haftası bağlantılı çevre hakkı sunumu',
    ],
    nisan: [
      '23 Nisan\'da ulusal egemenlik ve demokrasi bilincini pekiştirmek',
      '23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kapsamında demokrasi ve egemenlik temalı program\nModel BM (MUN) simülasyonu giriş denemesi',
    ],
    mayis: [
      'Yıl içi demokrasi ve hak savunuculuğu çalışmalarını raporlamak',
      'Engelliler Haftası (10-16 Mayıs) kapsamında "Engelsiz Bir Demokrasi" etkinliği\n19 Mayıs kapsamında "Gençlik ve Demokratik Katılım" temalı program',
    ],
  },

  'e Twinning Kulübü': {
    ekimEkstra: [
      'eTwinning platformunu ve uluslararası proje ortaklıklarını tanıtmak',
      'eTwinning platformu kullanımı ve proje kayıt süreci tanıtım semineri\nYıl içi uluslararası proje konusunun belirlenmesi',
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
      'Yenilenebilir ve yenilenmez enerji kaynakları karşılaştırmalı sunum\nOkul enerji tüketimini inceleme ve ölçüm atölyesi',
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
      'Enerji Tasarrufu Haftası (Ocak anısına Şubat uygulama etkinliği)\n2. dönem okul enerji izleme projesi başlatma',
    ],
    mart: [
      'Güneş enerjisi ve yenilenebilir teknolojilere ilgi oluşturmak',
      'Bilim ve Teknoloji Haftası (8-14 Mart) kapsamında güneş enerjisi maket projesi\nOrman Haftası bağlantılı yeşil enerji ve orman ilişkisi sunumu',
    ],
    nisan: [
      'Enerji verimliliği projesi çıktılarını sergilemek',
      'Dünya Sağlık Haftası bağlantılı "Temiz Enerji, Sağlıklı Yaşam" sunumu\n23 Nisan kapsamında enerji tasarrufu standı',
    ],
    mayis: [
      'Okul enerji tüketim raporunu sunmak ve değerlendirmek',
      'Yıl içi enerji ölçüm verilerinin değerlendirme toplantısı\n19 Mayıs kapsamında "Gençlik ve Yeşil Enerji" temalı program',
    ],
  },

  'Engellilerle Dayanışma Kulübü': {
    ekimEkstra: [
      'Engel türleri ve sosyal model anlayışını tanıtmak',
      'Engellilik yaklaşımları: tıbbi model vs. sosyal model semineri\nOkul çevresinde erişilebilirlik denetimi atölyesi',
    ],
    kasim: [
      'Engellerle yaşayan bireylere duyarlılık ve empati geliştirmek',
      'Organ Bağışı ve Nakli Haftası (3-9 Kasım) bağlantılı "Engelsiz Bir Hayat" etkinliği\nAtatürk Haftası kapsamında "Atatürk ve Engellilere Yaklaşım" sunumu',
    ],
    aralik: [
      'Dünya Engelliler Günü kapsamında farkındalık etkinliği düzenlemek',
      'Dünya Engelliler Günü (3 Aralık) kapsamında okul genelinde farkındalık kampanyası: sergi, şiir, sunum\nTekerlekli sandalye yarışı ve görme engeli simülasyon atölyesi',
    ],
    subat: [
      'İşaret dili ve alternatif iletişim yöntemlerini tanıtmak',
      'Temel Türk İşaret Dili (TİD) atölyesi\nEngellilerin günlük yaşamda karşılaştığı engeller araştırma sunumu',
    ],
    mart: [
      'Engelsiz okul ve toplum anlayışını yaygınlaştırmak',
      '"Engelsiz Okul" projesi: rampalar, asansörler ve erişilebilirlik önerileri raporu\nOrman Haftası bağlantılı "Doğada Engelsiz" etkinliği',
    ],
    nisan: [
      'Dünya Otizm Farkındalık Günü kapsamında etkinlik düzenlemek',
      'Dünya Otizm Farkındalık Günü (2 Nisan) kapsamında mavi ışık yakma ve farkındalık etkinliği\n23 Nisan kapsamında engelli bireyleri kapsayan çocuk bayramı programı',
    ],
    mayis: [
      'Engelliler Haftasında kapsamlı farkındalık etkinliği düzenlemek',
      'Engelliler Haftası (10-16 Mayıs) kapsamında kulübün düzenlediği okul geneli program\nYıl içi dayanışma çalışmalarının değerlendirmesi',
    ],
  },

  'Felsefe ve Düşünce Eğitimi Kulübü': {
    ekimEkstra: [
      'Felsefenin ne olduğunu ve günlük yaşamdaki yerini tanıtmak',
      'Felsefe nedir? Temel sorular ve filozoflar tanıtım sunumu\nSokrates\'in diyalog yöntemini deneme atölyesi',
    ],
    kasim: [
      'Atatürk\'ün felsefi düşünce anlayışını ve pozitivizme yaklaşımını kavratmak',
      'Atatürk Haftası kapsamında "Atatürk ve Akılcı Düşünce" sunumu\nAtatürkçülüğün felsefi temelleri tartışma oturumu',
    ],
    aralik: [
      'Etik ve değerler felsefesini günlük yaşamla ilişkilendirmek',
      'İnsan Hakları ve Demokrasi Haftası (10 Aralık) bağlantılı adalet felsefesi tartışması\nSosyal etik ikilemler: tartışma ve argüman atölyesi',
    ],
    subat: [
      'Mantıksal düşünme ve argüman analizi becerisi geliştirmek',
      'Geçerli/geçersiz argüman analizi atölyesi\nSafsata türleri ve eleştirel düşünme egzersizleri',
    ],
    mart: [
      'Bilgi felsefesi ve bilimsel düşünce ilişkisini kavratmak',
      'Bilim ve Teknoloji Haftası (8-14 Mart) bağlantılı "Bilim Nedir? Bilim Felsefesi" semineri\nKütüphaneler Haftası bağlantılı "Bilgi ve Doğruluk" tartışma oturumu',
    ],
    nisan: [
      'Siyaset felsefesi ve demokrasi düşüncesini kavratmak',
      '23 Nisan kapsamında "Egemenlik ve Toplum Sözleşmesi" felsefe tartışması\nOkul geneline açık felsefe konuşma etkinliği (Café Philo)',
    ],
    mayis: [
      'Yıl içi felsefi sorgulamaları ve üretilen argümanları derleyerek sunmak',
      '"Gençliğin Felsefi Manifestosu" hazırlama ve okuma etkinliği\n19 Mayıs kapsamında özgürlük ve bağımsızlık felsefesi sunumu',
    ],
  },

  'Fotoğrafçılık Kulübü': {
    ekimEkstra: [
      'Fotoğraf makinesi ve kompozisyon temellerini tanıtmak',
      'Fotoğraf makinesi/telefon kamera ayarları tanıtım atölyesi\nTemel kompozisyon kuralları (üçte bir, çerçeveleme) uygulamalı ders',
    ],
    kasim: [
      'Belgesel fotoğrafçılık ve anlatı oluşturma becerisi kazandırmak',
      'Atatürk Haftası kapsamında "Tarihî Anlar" fotoğraf arşivi inceleme\n10 Kasım anma törenini fotoğraflama görevi',
    ],
    aralik: [
      'Işık ve gölge kullanımı ile kış fotoğrafçılığı becerisi geliştirmek',
      'Stüdyo ışığı ve doğal ışık karşılaştırması atölyesi\nKış temalı okul içi fotoğraf keşif turu',
    ],
    subat: [
      'Düzenleme ve post-prodüksiyon temellerini öğretmek',
      'Ücretsiz fotoğraf düzenleme araçları uygulama atölyesi\n2. dönem sergi konusunun belirlenmesi',
    ],
    mart: [
      'Doğa ve çevre fotoğrafçılığı pratiği kazandırmak',
      'Orman Haftası (21-26 Mart) kapsamında okul bahçesi/yakın doğa fotoğraf turu\nKütüphaneler Haftası bağlantılı "Kitap ve Fotoğraf" temalı sergi hazırlığı',
    ],
    nisan: [
      'Okul geneline açık fotoğraf sergisi düzenlemek',
      'Turizm Haftası (15-22 Nisan) bağlantılı şehir/doğa fotoğraf gezisi\n23 Nisan Ulusal Egemenlik ve Çocuk Bayramı temalı fotoğraf sergisi açılışı',
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
      'Dokuz taş, mangala gibi masa/zemin oyunları atölyesi\nKış temalı geleneksel oyunlar turnuvası (1. aşama)',
    ],
    subat: [
      'Geleneksel oyunları video ile belgelemek',
      'Oyun kurallarını video ile belgeleme projesi\n2. dönem okullar arası geleneksel oyunlar etkinliği planlama',
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
      'Yıl içi derlenen oyunları dijital arşive aktarmak',
      'Geleneksel oyunlar dijital albümü/video arşivinin tamamlanması\n19 Mayıs kapsamında gençlik ve oyun kültürü temalı sergi',
    ],
  },

  'Geleneksel El Sanatları Kulübü': {
    ekimEkstra: [
      'Türk el sanatları dallarını tanıtmak ve yıllık çalışma konusunu belirlemek',
      'Tezhip, ebru, çini, halı-kilim, ahşap boyama tanıtım sunumu\nYıl içi odaklanılacak el sanatı dalının öğrencilerle birlikte seçilmesi',
    ],
    kasim: [
      'Seçilen el sanatı dalında temel teknik beceri kazandırmak',
      'Atatürk Haftası kapsamında "Cumhuriyet ve Geleneksel Sanatlar" sunumu\nSeçilen dal için temel teknik eğitim atölyesi (1. oturum)',
    ],
    aralik: [
      'El sanatı pratiğini derinleştirmek\nGeleneksel desenlerin anlamını öğretmek',
      'Geleneksel motifler ve semboller araştırma etkinliği\nAtölye çalışması devamı: bireysel ürün üretimi başlangıcı',
    ],
    subat: [
      'Bireysel ürünü tamamlamak ve yeni teknikler denemek',
      'Bireysel ürünlerin tamamlanması ve sınıf içi küçük sergi\n2. dönem yeni teknik veya motif çalışması başlangıcı',
    ],
    mart: [
      'El sanatlarını kültür mirası perspektifiyle pekiştirmek',
      'Kütüphaneler Haftası bağlantılı el sanatları kitap köşesi hazırlama\nOrman Haftası bağlantılı doğal boyalar ve bitkisel motifler atölyesi',
    ],
    nisan: [
      'Üretilen eserleri sergilemek',
      'Turizm Haftası (15-22 Nisan) kapsamında geleneksel el sanatları tanıtım standı\n23 Nisan kapsamında yıl içi üretilen eserlerin büyük sergisi',
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
      'Atatürk Haftası kapsamında "Atatürk ve Edebiyat" antoloji inceleme\n10 Kasım anma töreninde üyelerden seçilen şiirlerin okunması\n24 Kasım Öğretmenler Günü için öğretmene şiir/mektup yazma atölyesi',
    ],
    aralik: [
      'Öykü ve kısa roman tekniklerini uygulamalı öğretmek',
      'Olay örgüsü, karakter ve mekân oluşturma atölyesi\nKısa öykü yazma yarışması (birinci tur)',
    ],
    subat: [
      'Yazılan eserleri gözden geçirmek ve düzenlemek',
      'Akran geri bildirimi ve düzeltme atölyesi\n2. dönem kulüp yayını için içerik toplama başlangıcı',
    ],
    mart: [
      'Kütüphaneler Haftasında okuma-yazma kültürünü yaymak\nMehmet Akif Ersoy\'u edebî açıdan tanıtmak',
      'İstiklâl Marşı\'nın Kabulü (12 Mart) kapsamında Mehmet Akif Ersoy şiir inceleme ve yazma atölyesi\nKütüphaneler Haftası kapsamında "En Sevdiğim Kitap" kısa yazı etkinliği',
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
      'Kış turizminin ekonomik katkısı ve çevre dostu turizm semineri\nTürkiye\'nin kayak merkezleri ve kış destinasyonları tanıtımı',
    ],
    subat: [
      'Turizm meslek alanlarını ve kariyer fırsatlarını tanıtmak',
      'Turizm ve otelcilik meslekleri kariyer paneli\nGezi rehberi olma simülasyon atölyesi',
    ],
    mart: [
      'Şehir tarihi ve kültürel mirası yerinde keşfetmek',
      'Şehit ve anıt mekânları ziyaret etkinliği (Şehitler Günü 18 Mart bağlantısı)\nŞehir tarihi araştırma projesi başlangıcı',
    ],
    nisan: [
      'Turizm Haftasında kapsamlı etkinlik düzenlemek',
      'Turizm Haftası (15-22 Nisan) kapsamında okul geneli Türkiye tanıtım standı ve fotoğraf sergisi\n23 Nisan kapsamında "Dünya\'dan Gelen Çocuklar — Türkiye\'yi Keşfet" etkinliği',
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
      'Tutum, Yatırım ve Türk Malları Haftası bağlantılı yerli girişimci başarı hikayeleri\nBeyin fırtınası ve iş fikri havuzu oluşturma atölyesi',
    ],
    subat: [
      'İş planı hazırlama becerisi geliştirmek',
      'Temel iş planı bileşenleri: pazar, maliyet, gelir modeli atölyesi\nProje ekiplerinin oluşturulması ve fikir seçimi',
    ],
    mart: [
      'Prototip ve sunum becerisi kazandırmak\nGirişimcilik Haftasında kulübü temsil etmek',
      'Girişimcilik Haftası (Mart ayının ilk haftası) kapsamında öğrenci iş fikirleri sunumu\nPrototip/MVP hazırlama atölyesi',
    ],
    nisan: [
      'Okul geneline açık iş fikirleri yarışması düzenlemek',
      'Okul içi "Mini Girişim Yarışması" finali ve jüri değerlendirmesi\n23 Nisan kapsamında "Geleceğin Girişimcileri" standı',
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
      'Atatürk Haftası kapsamında "Sanat ve Cumhuriyet" konulu çalışma\n10 Kasım anma için Atatürk portresi resim atölyesi',
    ],
    aralik: [
      'Renk teorisi ve kompozisyon ilkelerini uygulamalı öğretmek',
      'Renk çemberi ve zıt/uyumlu renk uygulamaları atölyesi\nKış temalı kart/afiş tasarımı çalışması',
    ],
    subat: [
      'Farklı malzeme ve tekniklerle deneysel sanat pratiği kazandırmak',
      'Kolaj, suluboya, guaj karşılaştırmalı teknik atölyesi\n2. dönem sergi hazırlığı planlama toplantısı',
    ],
    mart: [
      'Doğa ve çevre temalı eserler üretmek',
      'Orman Haftası (21-26 Mart) kapsamında doğa temalı resim/illüstrasyon çalışması\nKütüphaneler Haftası için kitap kapağı tasarım atölyesi',
    ],
    nisan: [
      'Yıl içi eserleri geniş bir izleyici kitlesine sunmak',
      'Turizm Haftası bağlantılı Anadolu motifleri temalı sergi\n23 Nisan kapsamında okul geneli yıl içi eserlerin büyük sergisi',
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
      'Halk oyunları kostümleri tanıtım ve giyinme atölyesi\nYıl sonu gösterisi için oyun seçimi ve prova yoğunlaştırma',
    ],
    subat: [
      'Teknik performansı olgunlaştırmak\nBahara hazırlık provalarını yoğunlaştırmak',
      '2. dönem yoğunlaştırılmış prova takviminin uygulanması\nHalk oyunları yarışması takviminin incelenmesi ve başvuru hazırlığı',
    ],
    mart: [
      'Okul genelinde gösteri sunmak',
      'İstiklâl Marşı\'nın Kabulü (12 Mart) ve Şehitler Günü (18 Mart) kapsamında halk oyunları gösterisi\nOkullar arası halk oyunları yarışması hazırlığı',
    ],
    nisan: [
      '23 Nisan kapsamında büyük gösteri sunmak',
      '23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kapsamında halk oyunları ana gösterisi\nOkullar arası yarışmaya katılım',
    ],
    mayis: [
      '19 Mayıs kutlamalarında kulübü temsil etmek\nYıl sonu değerlendirmesi yapmak',
      '19 Mayıs Atatürk\'ü Anma, Gençlik ve Spor Bayramı gösterisi\nYıl içi prova ve gösteri sürecinin değerlendirmesi',
    ],
  },

  'Hareketli Yaşam Kulübü': {
    ekimEkstra: [
      'Fiziksel aktivitenin sağlığa katkısını ve hareketsiz yaşam risklerini tanıtmak',
      'Fiziksel aktivite düzeyi ölçümü ve kişisel hedef belirleme atölyesi\nYıl içi hareketlilik takip programının tanıtımı',
    ],
    kasim: [
      'Düzenli egzersiz alışkanlığı kazandırmak',
      'Atatürk Haftası kapsamında "Sağlıklı Beden, Sağlıklı Millet" sunumu\nOkul içi hareket molası kampanyasının başlatılması',
    ],
    aralik: [
      'İç mekân ve kış sporları seçeneklerini tanıtmak',
      'Kış aylarında evde yapılabilecek egzersizler atölyesi\nOkul koridorlarında aktif mola noktaları oluşturma projesi',
    ],
    subat: [
      'Beslenme ve hareket ilişkisini kavratmak',
      'Sağlıklı beslenme ve fiziksel aktivite dengesi semineri\n2. dönem kulüp hareketlilik yarışması başlatma',
    ],
    mart: [
      'Açık hava aktivitelerini ve doğa sporlarını tanıtmak',
      'Orman Haftası kapsamında doğa yürüyüşü ve orienteering etkinliği\nYeşilay Haftası bağlantılı "Sağlıklı Yaşam" standı',
    ],
    nisan: [
      'Spor ve hareketin zihin sağlığına katkısını vurgulamak',
      'Dünya Sağlık Haftası (7-13 Nisan) kapsamında okul geneli "10.000 adım" kampanyası\n23 Nisan kapsamında spor gösterisi',
    ],
    mayis: [
      'Yıl içi hareketlilik artışını ölçmek ve değerlendirmek',
      'Trafik ve İlkyardım Haftası bağlantılı sağlıklı yaşam standı\n19 Mayıs Atatürk\'ü Anma, Gençlik ve Spor Bayramı etkinliklerine aktif katılım',
    ],
  },

  'Havacılık Kulübü': {
    ekimEkstra: [
      'Uçuşun fiziğini ve Türk havacılık tarihini tanıtmak',
      'Bernoulli prensibi ve uçuşun temel ilkeleri deney atölyesi\nTürk Hava Kuvvetleri ve sivil havacılık tarihi sunumu',
    ],
    kasim: [
      'Türkiye\'nin havacılık alanındaki gelişmelerini kavratmak',
      'Atatürk Haftası kapsamında "Atatürk ve Havacılık" sunumu\nTURKJET, BAYRAKTAR ve yerli havacılık projeleri tanıtımı',
    ],
    aralik: [
      'Model uçak tasarım temellerini öğretmek',
      'Balsa veya EPS köpükten model uçak yapımı atölyesi\nUçuş mekaniği ve aerodinamik terimler dersi',
    ],
    subat: [
      'Drone teknolojisi ve insansız hava araçlarını tanıtmak',
      'İHA/drone teknolojisi ve kullanım alanları semineri\nModel uçak uçuş denemesi (uygun açık alan)',
    ],
    mart: [
      'Bilim ve teknoloji ile havacılık bağını güçlendirmek',
      'Bilim ve Teknoloji Haftası (8-14 Mart) kapsamında model uçak/roket yarışması\nHavacılık mühendisliği kariyer bilgilendirmesi',
    ],
    nisan: [
      'Havacılık projesi sergisi düzenlemek',
      'Tasarlanan modellerin okul sergisinde tanıtımı\n23 Nisan kapsamında "Geleceğin Havacıları" standı',
    ],
    mayis: [
      'TEKNOFEST başvurusu veya benzeri yarışmaya hazırlık yapmak',
      'TEKNOFEST Havacılık kategorisi başvuru araştırması\n19 Mayıs kapsamında "Gençlik ve Havacılık" temalı sunum',
    ],
  },

  'Hayvanları Sevme ve Koruma Kulübü': {
    ekimEkstra: [
      'Hayvanları Koruma Günü\'nü kutlamak ve hayvan hakları bilincini oluşturmak',
      'Hayvanları Koruma Günü (4 Ekim) kapsamında okul geneli farkındalık etkinliği\nEvcil ve sokak hayvanlarının bakım ihtiyaçları konulu bilgilendirme',
    ],
    kasim: [
      'Nesli tehlike altındaki türleri ve biyoçeşitliliği tanıtmak',
      'Organ Bağışı Haftası bağlantılı "Yaşam Paylaşımdır" temalı etkinlik\nAtatürk Haftası kapsamında "Atatürk ve Doğa Sevgisi" sunumu',
    ],
    aralik: [
      'Kış aylarında sokak hayvanlarına destek bilincini güçlendirmek',
      'Sokak hayvanları için mama ve barınak kampanyası organizasyonu\nHayvan barınağı ile iletişim ve gönüllü proje başlangıcı',
    ],
    subat: [
      'Evcil hayvan sorumluluğu ve doğru bakım bilgisi vermek',
      'Veteriner Hekim Günü bağlantılı "Bilinçli Hayvan Sahipliği" semineri\nSahipsiz hayvan profillerini sosyal medyada paylaşma projesi',
    ],
    mart: [
      'Ormanları ve yaban hayatını koruma bilincini güçlendirmek',
      'Orman Haftası (21-26 Mart) kapsamında yaban hayatı koruma etkinliği\nKuş gözlem ve doğa keşif yürüyüşü',
    ],
    nisan: [
      'Hayvan hakları ve hukuki korumayı tanıtmak',
      'Dünya Sağlık Haftası bağlantılı "Hayvan-İnsan-Çevre Sağlığı Üçgeni" semineri\n23 Nisan kapsamında "Canlı Dünya Ortak Yuvamız" standı',
    ],
    mayis: [
      'Yıl içi hayvan koruma çalışmalarını değerlendirmek',
      'Barınak gönüllü ziyareti ve sahiplendirme kampanyası\n19 Mayıs kapsamında "Gençlik ve Doğa Koruma" temalı sunum',
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
      'İSG nedir? Türkiye\'de iş kazası istatistikleri ve önemi sunumu\nOkul ortamında tehlike tanımlama ve risk değerlendirme atölyesi',
    ],
    kasim: [
      'İşyerinde güvenlik kültürü ve kişisel koruyucu ekipmanları öğretmek',
      'Atatürk Haftası kapsamında "Çalışan Sağlığı ve Modernleşme" sunumu\nKişisel koruyucu donanım (KKD) kullanımı uygulamalı etkinlik',
    ],
    aralik: [
      'Yangın güvenliği ve tahliye prosedürlerini öğretmek',
      'Yangın güvenliği, yangın söndürücü kullanımı bilgilendirmesi\nOkul tahliye planının incelenmesi ve tatbikat hazırlığı',
    ],
    subat: [
      'Sivil savunma ve acil durum yönetimini pekiştirmek',
      'Sivil Savunma Günü (28 Şubat) kapsamında okul içi güvenlik tatbikatı\nDeprem, yangın ve kimyasal sızıntı senaryolarında doğru davranış atölyesi',
    ],
    mart: [
      'Ergonomi ve çalışma ortamı sağlığını kavratmak',
      'Bilim ve Teknoloji Haftası bağlantılı "Teknoloji ve İSG" sunumu\nErgonomik çalışma ortamı tasarımı atölyesi',
    ],
    nisan: [
      'İş Sağlığı ve Güvenliği Haftasında okul geneli etkinlik düzenlemek',
      'İş Sağlığı ve Güvenliği Haftası (4-10 Mayıs öncesi hazırlık) için materyal üretimi\n23 Nisan kapsamında güvenli çalışma ortamı standı',
    ],
    mayis: [
      'İSG Haftasında kapsamlı etkinlik düzenlemek\nYıl içi güvenlik çalışmalarını raporlamak',
      'İş Sağlığı ve Güvenliği Haftası (4-10 Mayıs) kapsamında okul geneli güvenlik kampanyası\nYıl içi risk değerlendirme raporunun tamamlanması',
    ],
  },

  'İzcilik Kulübü': {
    ekimEkstra: [
      'İzcilik ilke ve yeminini tanıtmak\nTemel izcilik becerilerini ve malzemelerini göstermek',
      'İzcilik yemini, on parmak kanunu ve dünya izcilik hareketi sunumu\nTemel izcilik düğümleri ve oryantasyon araçları tanıtım atölyesi',
    ],
    kasim: [
      'İzcilik değerleri ile Atatürkçü düşüncenin buluşmasını sağlamak',
      'Atatürk Haftası kapsamında "Cumhuriyet ve Gençlik: İzcilik Ruhu" sunumu\nÖğretmenler Günü için kulübün etkinliğe katkısı',
    ],
    aralik: [
      'Kış kamp becerileri ve hayatta kalma tekniklerini öğretmek',
      'Kışa özgü barınak kurma ve ısınma teknikleri atölyesi\nHarita okuma ve pusula kullanımı uygulamalı ders',
    ],
    subat: [
      'İlk yardım ve kurtarma becerisi kazandırmak',
      'İzcilik ilk yardım teknikleri: yaralı taşıma, bandaj atölyesi\n2. dönem kamp planlama toplantısı',
    ],
    mart: [
      'Doğa ve çevre koruma sorumluluğunu izcilik perspektifinden pekiştirmek',
      'Orman Haftası (21-26 Mart) kapsamında izcilik doğa yürüyüşü ve temizlik etkinliği\nKamp yeri belirleme ve hazırlık atölyesi',
    ],
    nisan: [
      'Bahar kampı deneyimi kazandırmak',
      '23 Nisan kapsamında "Genç İzcilerin Türkiye\'si" temalı etkinlik\nBahar günübirlik kamp/yürüyüş organizasyonu',
    ],
    mayis: [
      'Yıl sonu izcilik beceri sınavı düzenlemek',
      'İzcilik rozetleri ve beceri sınavı etkinliği\n19 Mayıs Atatürk\'ü Anma, Gençlik ve Spor Bayramı kamp etkinliğine katılım',
    ],
  },

  'Kişisel Verileri Koruma Kulübü': {
    ekimEkstra: [
      'Kişisel veri kavramı ve KVKK kapsamını tanıtmak',
      'KVKK (6698 sayılı Kanun) ve GDPR\'ın temel prensipleri sunumu\nSosyal medyada kişisel veri paylaşım riskleri farkındalık atölyesi',
    ],
    kasim: [
      'Dijital kimlik ve çevrimiçi mahremiyet bilinci oluşturmak',
      'Atatürk Haftası kapsamında "Çağdaşlaşma ve Dijital Haklar" sunumu\nŞifre güvenliği ve iki faktörlü kimlik doğrulama atölyesi',
    ],
    aralik: [
      'Çerezler, izleme ve reklam teknolojilerini tanıtmak',
      'İnsan Hakları ve Demokrasi Haftası bağlantılı "Dijital Haklar ve Mahremiyet" sunumu\nÇerez yönetimi ve gizlilik ayarları uygulama atölyesi',
    ],
    subat: [
      'Siber güvenlik tehditlerini ve korunma yöntemlerini öğretmek',
      'Kimlik avı (phishing) ve sosyal mühendislik saldırıları tanıma atölyesi\n2. dönem okul farkındalık kampanyası hazırlığı',
    ],
    mart: [
      'Veri güvenliği alanında kariyer fırsatlarını tanıtmak',
      'Bilim ve Teknoloji Haftası bağlantılı "Siber Güvenlik Meslekleri" sunumu\nKütüphaneler Haftası kapsamında dijital okuryazarlık kitap köşesi',
    ],
    nisan: [
      'Kişisel Verileri Koruma Günü etkinliği düzenlemek',
      'Kişisel Verileri Koruma Günü (7 Nisan) kapsamında okul geneli "Verini Koru" kampanyası\n23 Nisan kapsamında "Dijital Nesil ve Gizlilik Hakları" standı',
    ],
    mayis: [
      'Yıl içi KVKK farkındalık çalışmalarını raporlamak',
      'Bilişim Haftası (Mayıs ilk haftası) kapsamında siber güvenlik standı\nYıl içi kampanya etkisi değerlendirme toplantısı',
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
      'Mini kooperatif yönetimi: görev dağılımı, kayıt, kâr paylaşımı atölyesi\n2. dönem kooperatif faaliyetlerini planlama toplantısı',
    ],
    mart: [
      'Girişimcilik ve kooperatifçilik bağını pekiştirmek',
      'Girişimcilik Haftası bağlantılı "Birlikte Girişim, Birlikte Güç" sunumu\nOkul içi ürün satış/takas etkinliği',
    ],
    nisan: [
      'Kooperatif ürünlerini geniş kitleyle buluşturmak',
      '23 Nisan kapsamında kooperatif ürünleri sergisi ve satış standı\nTurizm Haftası bağlantılı yerel kooperatif ziyareti (saha çalışması)',
    ],
    mayis: [
      'Yıl içi kooperatif deneyimini raporlamak ve değerlendirmek',
      'Mini kooperatif yıl sonu hesap ve kâr paylaşım toplantısı\n19 Mayıs kapsamında "Gençlik ve Kooperatif Ekonomisi" sunumu',
    ],
  },

  'Kültür ve Tabiat Varlıklarını Koruma Kulübü': {
    ekimEkstra: [
      'Kültürel ve doğal miras kavramlarını tanıtmak',
      'UNESCO Dünya Mirası listesindeki Türk varlıkları tanıtım sunumu\nOkul çevresindeki kültürel/doğal varlıkların tespiti atölyesi',
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
      'Fotoğraf ve belgeleme yoluyla yerel mirası korumak',
      'Çevredeki tarihi yapı ve mekânları fotoğraflama ve belgeleme projesi\n2. dönem miras koruma proje başvurusu araştırması',
    ],
    mart: [
      'Doğal miras ve çevre korumayı birlikte ele almak',
      'Orman Haftası (21-26 Mart) kapsamında doğal sit alanları ve koruma politikaları sunumu\nOkul yakınındaki doğal/kültürel alan ziyareti',
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
      'Atatürk Haftası kapsamında Atatürk\'ün kütüphane koleksiyonları ve okuma alışkanlığı sunumu\nKütüphaneden yararlanma kuralları okul geneli duyurusu\n24 Kasım Öğretmenler Günü kapsamında "Öğretmen ve Kitap" pantosu hazırlama',
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
      'Kütüphaneler Haftası (Mart ayının son pazartesi haftası) kapsamında okul geneli etkinlik: sergi, yarışma, atölye\nİstiklâl Marşı\'nın Kabulü (12 Mart) bağlantılı Türk edebiyatı kitap sergisi',
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
      'Anadolu\'dan geçen medeniyetler zaman çizelgesi atölyesi\nMedeniyet ve değer ilişkisi giriş tartışması',
    ],
    kasim: [
      'Türk-İslam medeniyetinin evrensel değerlere katkısını kavratmak',
      'Atatürk Haftası kapsamında "Cumhuriyet: Batı Medeniyetine Katılım" sunumu\nSelçuklu ve Osmanlı medeniyetinde bilim ve sanat araştırma etkinliği',
    ],
    aralik: [
      'Medeniyetler arası diyaloğu ve hoşgörüyü pekiştirmek',
      'İnsan Hakları ve Demokrasi Haftası bağlantılı "Medeniyetler Arası Diyalog" paneli\nFarklı medeniyetlerin mimarisi ve sanatı karşılaştırma atölyesi',
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
      'Atatürk Haftası kapsamında "Atatürkçülük: Akıl, Bilim, Laiklik" sunumu\nAtatürk\'ün nutuk ve konuşmalarından seçme okuma atölyesi',
    ],
    aralik: [
      'Aydınlanma düşüncesi ve insan hakları bağını pekiştirmek',
      'İnsan Hakları ve Demokrasi Haftası bağlantılı "Aydınlanma ve Modern Haklar" sunumu\nRousseau, Locke, Montesquieu kısa biyografi araştırma atölyesi',
    ],
    subat: [
      'Türk düşünce tarihi öncülerini tanımak',
      'Ziya Gökalp, Namık Kemal, Tevfik Fikret gibi Türk düşünürler semineri\nDüşünce akımları karşılaştırma haritası hazırlama atölyesi',
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
      'Geleneksel ve dijital medya karşılaştırması tanıtım sunumu\nBir haber nasıl doğrulanır? Temel faktör kontrol atölyesi',
    ],
    kasim: [
      'Dezenformasyon ve sahte haber (fake news) farkındalığı oluşturmak',
      'Atatürk Haftası kapsamında "Basın Özgürlüğü ve Cumhuriyet" sunumu\nSahte haber tespit araçları (fact-checking) uygulamalı atölye',
    ],
    aralik: [
      'Reklam ve propaganda analizini öğretmek',
      'İnsan Hakları Haftası bağlantılı "Medya, Haklar ve Özgürlük" sunumu\nReklam görsel analizi: hangi duygu/algı hedefleniyor? atölyesi',
    ],
    subat: [
      'Sosyal medya algoritmalarını ve filtre balonunu kavratmak',
      'Filtre balonu ve yankı odası kavramları semineri\n2. dönem okul için medya okuryazarlığı broşürü hazırlama',
    ],
    mart: [
      'Haber üretim sürecini bizzat deneyimlemek',
      'Bilim ve Teknoloji Haftası bağlantılı "Teknoloji Haberciliği" mini gazete çalışması\nKütüphaneler Haftası kapsamında "Okuma: Aktif Medya Tüketimi" etkinliği',
    ],
    nisan: [
      'Okul yayın organı veya dijital içerik üretmek',
      '23 Nisan kapsamında okul dergisi/bülteni veya sosyal medya içeriği üretimi\nOkul geneline yönelik medya okuryazarlığı afişi dağıtımı',
    ],
    mayis: [
      'Yıl içi medya projesini tamamlamak ve değerlendirmek',
      'Bilişim Haftası kapsamında dijital medya proje sergisi\n19 Mayıs kapsamında "Gençlik ve Sorumlu Medya" temalı sunum',
    ],
  },

  'Meslek Tanıtma Kulübü': {
    ekimEkstra: [
      'Mesleklerin sınıflandırılmasını ve kariyer planlamasını tanıtmak',
      'Meslekler: beyaz yaka, mavi yaka, yaratıcı sektörler karşılaştırması\nKişilik özellikleri ve meslek uyumu kısa keşif atölyesi',
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
      'Gazeteci, tasarımcı, senarist, sosyal medya uzmanı kariyer profilleri sunumu\n2. dönem "Meslekte Bir Gün" projesi planlama',
    ],
    mart: [
      'Teknoloji ve mühendislik alanı kariyer fırsatlarını tanıtmak',
      'Bilim ve Teknoloji Haftası (8-14 Mart) kapsamında mühendislik ve bilişim meslekleri paneli\nGirişimcilik Haftası bağlantılı "Kendi İşini Kurmak" semineri',
    ],
    nisan: [
      '"Meslekte Bir Gün" etkinliğini gerçekleştirmek',
      '"Meslekte Bir Gün" etkinliği: öğrenciler bir mesleği bir gün süreyle gözlemler\n23 Nisan kapsamında "Geleceğin Meslekleri" stand ve sunum etkinliği',
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
      'Atatürk Haftası kapsamında "Üretken Gençlik: Meslek ve Vatan" sunumu\nTatbikat alanına ilk teknik giriş atölyesi',
    ],
    aralik: [
      'Temel mesleki teknikleri uygulamalı öğretmek',
      'Seçilen meslek dalında teknik beceri atölyesi (1. aşama)\nMesleki hata ve güvenlik riski analizi tartışması',
    ],
    subat: [
      'Teknik uygulama derinliğini artırmak',
      'Teknik beceri atölyesi (2. aşama: ileri uygulamalar)\n2. dönem proje tatbikatı planlama toplantısı',
    ],
    mart: [
      'Mesleki projeyi hayata geçirmek',
      'Bilim ve Teknoloji Haftası bağlantılı mesleki proje uygulaması ve sunumu\nGirişimcilik Haftası bağlantılı mesleki üretimde girişimcilik tartışması',
    ],
    nisan: [
      'Üretilen mesleki ürünleri sergilemek',
      '23 Nisan kapsamında mesleki tatbikat ürünleri ve proje sergisi\nMesleği tanıtma standı kurulumu',
    ],
    mayis: [
      'Yıl içi mesleki beceri gelişimini değerlendirmek',
      'Mesleki portfolyo hazırlama ve sunum etkinliği\n19 Mayıs kapsamında "Üretken Gençlik" temalı program',
    ],
  },

  'MUN (Model United Nations) Kulübü': {
    ekimEkstra: [
      'BM sistemi, komiteleri ve MUN kurallarını tanıtmak',
      'BM\'nin yapısı, Güvenlik Konseyi, Genel Kurul ve temel organlar sunumu\nMUN dil prosedürleri (posta kutusu, konuşma hakkı, karar taslaği) atölyesi',
    ],
    kasim: [
      'Uluslararası gündem maddelerini araştırma ve analiz becerisi geliştirmek',
      'Atatürk Haftası kapsamında "Türkiye\'nin BM\'ye Katkıları" sunumu\nGündem maddesi araştırması: ülke konumu (position paper) hazırlama',
    ],
    aralik: [
      'Ülke temsili ve diplomatik dil becerisi kazandırmak',
      'İnsan Hakları ve Demokrasi Haftası bağlantılı BM İnsan Hakları Konseyi simülasyonu\nDiplomasik konuşma ve müzakere teknikleri atölyesi',
    ],
    subat: [
      'Okul içi MUN konferansı hazırlığını tamamlamak',
      'Karar taslağı (resolution) hazırlama atölyesi\nOkul içi mini MUN konferansı planlama ve rol dağılımı',
    ],
    mart: [
      'Okul içi MUN konferansını gerçekleştirmek',
      'Okul içi MUN konferansı: 2 komite, 1 gün simülasyon\nKonferans sonrası değerlendirme ve delegasyon raporu',
    ],
    nisan: [
      'Bölgesel/ulusal MUN konferansına hazırlanmak',
      'Ulusal/bölgesel MUN konferansı başvurusu ve hazırlık\n23 Nisan kapsamında "Ulusal Egemenlik ve Uluslararası Diplomasi" sunumu',
    ],
    mayis: [
      'Ulusal MUN konferansına katılmak\nYıl içi deneyimi değerlendirmek',
      'Bölgesel veya ulusal MUN konferansına katılım\n19 Mayıs kapsamında "Gençlik Diplomasisi ve Dünya Barışı" temalı etkinlik',
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
      'Sağlık, temizlik ve beslenme üçgeni: kısa girdi sunumu\nOkul kantin ürünleri besin değeri analizi atölyesi',
    ],
    kasim: [
      'El hijyeni ve kişisel temizliğin hastalık önlemedeki rolünü öğretmek',
      'Atatürk Haftası kapsamında "Sağlıklı Nesil, Güçlü Millet" sunumu\nDoğru el yıkama tekniği ve hijyen alışkanlıkları atölyesi',
    ],
    aralik: [
      'Kış mevsiminde bağışıklık sistemini güçlendirmeyi öğretmek',
      'Mevsimsel salgın hastalıklardan korunma yöntemleri semineri\nC vitamini ve kış besinleri: besin değerleri araştırma atölyesi',
    ],
    subat: [
      'Dengeli beslenme piramidi ve sağlıklı öğün planlamasını öğretmek',
      'Besin grupları ve günlük önerilen miktarlar sunumu\n2. dönem "Sağlıklı Öğün" yarışması başlatma',
    ],
    mart: [
      'Yeşilay Haftasında sağlıklı yaşamı yaymak',
      'Yeşilay Haftası (1 Mart) kapsamında okul geneli "Bağımlılıksız Sağlıklı Yaşam" kampanyası\nOrman Haftası bağlantılı "Doğadan Gelen Besinler" atölyesi',
    ],
    nisan: [
      'Dünya Sağlık Haftasında kapsamlı etkinlik düzenlemek',
      'Dünya Sağlık Günü/Haftası (7-13 Nisan) kapsamında okul geneli sağlık tarama standı\n23 Nisan kapsamında "Sağlıklı Nesil, Güçlü Türkiye" temalı etkinlik',
    ],
    mayis: [
      'Yıl içi sağlık farkındalık çalışmalarını değerlendirmek',
      'Engelliler Haftası bağlantılı "Engelsiz Sağlık" etkinliği\n19 Mayıs kapsamında sağlıklı beslenme ve hareket standı',
    ],
  },

  'Sağlık ve Güvenlik Kulübü': {
    ekimEkstra: [
      'Okul ortamında sağlık ve güvenlik risklerini tanıtmak',
      'Okul kazaları ve önlenebilir riskler analizi atölyesi\nOkul ilk yardım çantası içeriği ve kullanımı tanıtımı',
    ],
    kasim: [
      'İlk yardım temellerini öğretmek',
      'Atatürk Haftası kapsamında "Sağlıklı ve Güvende Bir Toplum" sunumu\nTemel ilk yardım: yabancı cisim, kanama, bilinç kaybı müdahale atölyesi',
    ],
    aralik: [
      'Yangın güvenliği ve ilk müdahaleyi kavratmak',
      'Yangın güvenliği ve tahliye prosedürleri bilgilendirmesi\nYangın söndürücü kullanımı görsel atölyesi',
    ],
    subat: [
      'Sivil savunma ve deprem güvenliğini pekiştirmek',
      'Sivil Savunma Günü (28 Şubat) kapsamında deprem ve afet güvenliği tatbikatı\n"Çantamızda ne olmalı?" afet çantası hazırlama atölyesi',
    ],
    mart: [
      'Trafik güvenliği farkındalığı oluşturmak',
      'Trafik kazaları istatistikleri ve önlenebilir riskler semineri\nŞehitler Günü (18 Mart) bağlantılı "Güvenli Bir Gelecek İçin" etkinliği',
    ],
    nisan: [
      'Dünya Sağlık Haftasında okul sağlık taraması düzenlemek',
      'Dünya Sağlık Günü/Haftası (7-13 Nisan) kapsamında sağlık tarama ve bilgilendirme standı\n23 Nisan kapsamında "Güvenli Çocukluk" temalı program',
    ],
    mayis: [
      'Trafik ve İlkyardım Haftasında kapsamlı etkinlik düzenlemek',
      'Trafik ve İlkyardım Haftası (Mayıs ilk haftası) kapsamında okul geneli güvenlik kampanyası\nYıl içi ilk yardım eğitiminin değerlendirmesi',
    ],
  },

  'Şehir ve Medeniyet Kulübü': {
    ekimEkstra: [
      'Şehir kavramı ve Türk şehircilik tarihini tanıtmak',
      'Osmanlı ve Cumhuriyet şehirciliği karşılaştırmalı sunumu\nOkul çevresindeki mahalle/şehir dokusunu inceleme atölyesi',
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
      'Orman Haftası (21-26 Mart) bağlantılı şehirlerde yeşil koridor ve orman alanları semineri\nKütüphaneler Haftası kapsamında şehir tarihi kitap köşesi',
    ],
    nisan: [
      '"İdeal Şehrim" tasarım projelerini sergilemek',
      'Turizm Haftası (15-22 Nisan) bağlantılı "Şehrimizi Tanıyalım" kültür turu\n23 Nisan kapsamında "Geleceğin Şehircileri" proje sergisi',
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
      'Atatürk Haftası kapsamında "Çağdaş Savaş Alanı: Siber Uzay" sunumu\nParola güvenliği ve ağ güvenliği temel uygulamaları atölyesi',
    ],
    aralik: [
      'Ağ güvenliği ve VPN/şifreleme kavramlarını tanıtmak',
      'HTTPS, şifreleme ve güvenli iletişim protokolleri semineri\nKişisel Verileri Koruma Günü hazırlığı için farkındalık materyali üretimi',
    ],
    subat: [
      'Etik hacking ve sızma testi kavramlarını tanıtmak',
      'Beyaz şapka/siyah şapka hacker ayrımı ve etik hacking mesleği sunumu\nCTF (Capture The Flag) başlangıç seviyesi sorun çözme atölyesi',
    ],
    mart: [
      'Siber güvenlik kariyer fırsatlarını keşfetmek',
      'Bilim ve Teknoloji Haftası bağlantılı siber güvenlik mesleği ve TEKNOFEST Siber kategorisi sunumu\nBilinçli internette gezinme kuralları okul afişi hazırlama',
    ],
    nisan: [
      'Kişisel Verileri Koruma Günü\'nde okul geneli farkındalık etkinliği düzenlemek',
      'Kişisel Verileri Koruma Günü (7 Nisan) kapsamında siber güvenlik farkındalık standı\n23 Nisan kapsamında "Dijital Gençlik, Güvenli Gelecek" sunumu',
    ],
    mayis: [
      'Siber güvenlik proje sunumu ve yıl değerlendirmesi yapmak',
      'Bilişim Haftası kapsamında siber güvenlik proje sergisi\n19 Mayıs kapsamında "Gençlik ve Dijital Savunma" temalı etkinlik',
    ],
  },

  'Sıfır Atık Kulübü': {
    ekimEkstra: [
      'Sıfır atık felsefesi ve Türkiye\'deki politikaları tanıtmak',
      'Sıfır Atık Türkiye Projesi ve yasal çerçeve sunumu\nOkul çöp analizi: ne kadar atık üretiyoruz? ölçüm atölyesi',
    ],
    kasim: [
      'Atık azaltma hiyerarşisini öğretmek (Redüce-Yeniden Kullan-Geri Dönüştür)',
      'Atatürk Haftası kapsamında "Tasarruf ve Üretim: Sıfır İsraf" sunumu\nOkul içi atık ayrıştırma istasyonu kurulum projesi başlangıcı',
    ],
    aralik: [
      'Plastik kirliliği ve tek kullanımlık ürünlerle mücadele bilinci oluşturmak',
      'Tutum, Yatırım ve Türk Malları Haftası bağlantılı "Dayanıklı, Kaliteli, İsrafsız" etkinliği\nOkul içi plastik tüketim azaltma kampanyası başlatma',
    ],
    subat: [
      'Kompost ve organik atık yönetimini tanıtmak',
      'Kompost nedir? Evde/okulda organik atık yönetimi atölyesi\n2. dönem okul bahçesi kompost projesi başlangıcı',
    ],
    mart: [
      'Orman ve doğa kirliliğiyle mücadelede sıfır atık yaklaşımını pekiştirmek',
      'Orman Haftası (21-26 Mart) kapsamında okul çevresinde çöp toplama ve atık analizi etkinliği\nGeri dönüşüm malzemeleriyle sanat/tasarım atölyesi',
    ],
    nisan: [
      'Dünya Sağlık Haftası bağlantılı "Temiz Çevre, Sağlıklı Yaşam" etkinliği düzenlemek',
      'Dünya Sağlık Haftası bağlantılı "Sıfır Atık = Sağlıklı Gelecek" okul geneli kampanyası\n23 Nisan kapsamında geri dönüşüm malzemeleriyle sanat sergisi',
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
      'Kış şiirleri okuma ve analiz atölyesi\nÖğrenci şiir yazma: kış imgelerini kullanma egzersizi',
    ],
    subat: [
      'Aşk ve doğa temalarını divan ve halk şiirinden örneklerle keşfetmek',
      'Fuzuli ve Bâkî\'den divan şiiri örnekleri sesli okuma\nDoga ve sevgi imgelerini kullanan çağdaş şiir yazma atölyesi',
    ],
    mart: [
      'Vatan ve özgürlük şiirlerini İstiklâl Marşı bağlamında keşfetmek',
      'İstiklâl Marşı\'nın Kabulü (12 Mart) kapsamında Mehmet Akif Ersoy şiir derinlemesine inceleme\nKütüphaneler Haftası bağlantılı "Kitaplar ve Şairler" etkinliği',
    ],
    nisan: [
      'Okul geneline açık şiir dinletisi düzenlemek',
      '23 Nisan kapsamında çocukların yazdığı şiirlerin sahne performansı\nMimar Sinan anısına mimarlık ve şiir bağlantısı atölyesi',
    ],
    mayis: [
      'Yıl içi üretilen şiirleri kitapçık olarak derlemek',
      '"Genç Şairler Antolojisi" yıl sonu kitapçığının hazırlanması ve dağıtımı\n19 Mayıs kapsamında bağımsızlık ve özgürlük şiir okuma töreni',
    ],
  },

  'Sivil Savunma Kulübü': {
    ekimEkstra: [
      'Sivil savunmanın tarihini ve günümüzdeki rolünü tanıtmak',
      'Türk Sivil Savunma Teşkilatı tarihi ve AFAD\'ın görevleri sunumu\nRisk haritası oluşturma: okulumuzun tehlike noktaları atölyesi',
    ],
    kasim: [
      'Doğal ve insan kaynaklı afetlere hazırlık bilincini oluşturmak',
      'Atatürk Haftası kapsamında "Modernleşme ve Afet Yönetimi" sunumu\nDeprem, sel, yangın senaryolarında doğru davranış kuralları semineri',
    ],
    aralik: [
      'Acil durum iletişimi ve alarm sistemlerini öğretmek',
      'Acil çağrı hatları ve afet bildirim protokolleri bilgilendirmesi\nOkul acil durum planını inceleme ve tatbikat hazırlığı',
    ],
    subat: [
      'Sivil Savunma Günü\'nde kapsamlı tatbikat düzenlemek',
      'Sivil Savunma Günü (28 Şubat) kapsamında okul geneli afet tatbikatı (tahliye + toplanma)\nTatbikat değerlendirme ve aksaklıkların tespiti toplantısı',
    ],
    mart: [
      'Kimyasal, biyolojik ve radyolojik tehlike farkındalığı sağlamak',
      'KBRN (Kimyasal-Biyolojik-Radyolojik-Nükleer) tehlikeler temel bilgi semineri\nŞehitler Günü (18 Mart) bağlantılı savunma ve fedakarlık değerleri etkinliği',
    ],
    nisan: [
      'Toplum gönüllülüğü ve sivil savunma katılımını teşvik etmek',
      'AFAD gönüllülük programı tanıtımı\n23 Nisan kapsamında "Güvenli Türkiye" farkındalık standı',
    ],
    mayis: [
      'Yıl içi sivil savunma hazırlık düzeyini değerlendirmek',
      'İlk yardım beceri değerlendirme sınavı\n19 Mayıs kapsamında "Hazır Gençlik" temalı sivil savunma gösterisi',
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
      'Kişisel Verileri Koruma ve sosyal medya gizlilik ayarları atölyesi\nOkul etkinliklerini sosyal medyaya taşımak: fotoğraf + metin + hashtag atölyesi',
    ],
    subat: [
      'Video içerik üretimi ve montaj temellerini öğretmek',
      'Kısa video prodüksiyon: senaryo, çekim, montaj atölyesi\n2. dönem okul sosyal medya takvimi oluşturma',
    ],
    mart: [
      'Sosyal medyada sivil katılım ve pozitif kampanya oluşturmayı öğretmek',
      'Bilim ve Teknoloji Haftası bağlantılı okul sosyal medya projesi yayınlama\n"Ormanı Koru" viral kampanyası tasarımı atölyesi',
    ],
    nisan: [
      '23 Nisan için sosyal medya kampanyası tasarlamak ve yürütmek',
      '23 Nisan Ulusal Egemenlik ve Çocuk Bayramı kampanyası: öğrenci yaratıcı içerikleri\nTurizm Haftası bağlantılı "Türkiye\'yi Dünyaya Tanıt" sosyal medya yarışması',
    ],
    mayis: [
      'Yıl içi sosyal medya çalışmalarını analitik verilerle değerlendirmek',
      'Sosyal medya analitikleri inceleme: hangi içerik daha çok etkileşim aldı? atölyesi\n19 Mayıs kapsamında gençlik temalı sosyal medya içeriği kampanyası',
    ],
  },

  'Sosyal Sorumluluk Kulübü': {
    ekimEkstra: [
      'Sosyal sorumluluk kavramı ve proje döngüsünü tanıtmak',
      'Sosyal sorumluluk projesi adımları: tanımlama, planlama, uygulama, değerlendirme\nOkul ve mahallede hangi sosyal ihtiyaçlar var? keşif atölyesi',
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
      'Sosyal etki ölçümü: projemizin etkisi ne oldu? atölyesi\n2. dönem büyük proje seçimi ve ekip kurma toplantısı',
    ],
    mart: [
      'Çevre ve toplum iç içe: sosyal-çevre sorumluluğu projesini uygulamak',
      'Orman Haftası kapsamında toplum hizmet etkinliği: fidan dikimi veya çevre temizliği\nGirişimcilik Haftası bağlantılı "Sosyal Girişimcilik" kavramı tanıtımı',
    ],
    nisan: [
      'Büyük proje çıktısını geniş kitleyle paylaşmak',
      '23 Nisan kapsamında kulübün sosyal sorumluluk projesi tanıtım standı\nTurizm Haftası bağlantılı yerel tarihi mekân temizlik/restorasyon desteği',
    ],
    mayis: [
      'Yıl içi sosyal sorumluluk projelerini raporlamak ve sürdürülebilirlik planlamak',
      'Engelliler Haftası kapsamında "Engelsiz Toplum" projesi çıktısı sunumu\nYıl sonu proje raporu ve gelecek yıl öneri toplantısı',
    ],
  },

  'Sosyal Yardımlaşma Kulübü': {
    ekimEkstra: [
      'Yardımlaşma kültürünün tarihini ve önemini tanıtmak',
      'Türk yardımlaşma geleneği: imece, vakıf, dayanışma kavramları sunumu\nOkuldaki ve çevredeki ihtiyaç sahiplerini belirleme atölyesi',
    ],
    kasim: [
      'Kızılay ve vakıf geleneğiyle yardımlaşma bilincini güçlendirmek',
      'Kızılay Haftası (29 Ekim–4 Kasım) bağlantılı yardımlaşma standı\nAtatürk Haftası kapsamında "Atatürk\'ün Dayanışma Anlayışı" sunumu\n24 Kasım Öğretmenler Günü kapsamında öğretmenler için sürpriz dayanışma etkinliği',
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
      '23 Nisan kapsamında kulübün yardım projeleri tanıtım standı\nDünya Otizm Farkındalık Günü (2 Nisan) bağlantılı dayanışma etkinliği',
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
      'Tanzimat\'tan Meşrutiyet\'e Osmanlı modernleşmesi kronoloji atölyesi\nBalkan Savaşları ve I. Dünya Savaşı Osmanlı cephesi araştırma sunumu',
    ],
    subat: [
      'Türk tarihinin köklü uygarlıklarını incelemek',
      'Hitit, Frigler, Urartular: Anadolu\'nun kadim medeniyetleri sunumu\nTarihsel arkeoloji: nasıl araştırılır? atölyesi',
    ],
    mart: [
      'Çanakkale Zaferi\'ni birincil kaynaklarla incelemek',
      'Şehitler Günü (18 Mart) kapsamında Çanakkale: birincil kaynak (mektup/hatıra) okuma atölyesi\nKütüphaneler Haftası bağlantılı "Türk Tarihi Kitapları" tanıtım etkinliği',
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
      'Atatürk Haftası kapsamında "Bilim ve Teknolojide Türkiye\'nin Yükselişi" sunumu\nTasarım odaklı düşünme (design thinking) giriş atölyesi',
    ],
    aralik: [
      'Proje fikrinin somutlaştırılması ve prototip planlaması yapmak',
      'Problem tanımı, çözüm önerisi ve başarı kriterleri çalışması\nProje prototip malzeme listesi ve bütçe planlaması',
    ],
    subat: [
      'İlk prototip yapımını tamamlamak',
      'Prototip geliştirme atölyesi: tasarım, yapım, test döngüsü\nProje ilerleme değerlendirme ve danışman öğretmenle görüşme',
    ],
    mart: [
      'Proje demosunu tamamlamak ve TEKNOFEST başvurusu yapmak',
      'Bilim ve Teknoloji Haftası (8-14 Mart) kapsamında kulübün proje ön sunumu\nTEKNOFEST başvuru formunun tamamlanması ve gönderilmesi',
    ],
    nisan: [
      'TEKNOFEST elemeleri için hazırlığı tamamlamak',
      'Proje posterinin ve sunum dosyasının hazırlanması\n23 Nisan kapsamında "Geleceğin Mucitleri" proje tanıtım standı',
    ],
    mayis: [
      'TEKNOFEST ön elemelere katılmak\nYıl içi proje deneyimini raporlamak',
      'TEKNOFEST ön eleme yarışması katılımı\n19 Mayıs kapsamında "Bilim Şehidi Gençlik" temalı sunum',
    ],
  },

  'Teknofest ve Bilim Kulübü (Proje Uygulaması)': {
    ekimEkstra: [
      'Seçilen TEKNOFEST projesinin uygulama takvimini belirlemek',
      'Proje çalışma planı: haftalık milestonelar ve görev dağılımı\nGerekli malzeme ve yazılım araçlarının tespiti',
    ],
    kasim: [
      'Yazılım/donanım entegrasyonunu başlatmak',
      'Atatürk Haftası kapsamında "Teknolojik Bağımsızlık ve Yerli Üretim" sunumu\nYazılım geliştirme veya donanım montaj 1. aşama',
    ],
    aralik: [
      'Prototip entegrasyon testleri yapmak',
      'Prototip bileşen testleri ve hata ayıklama (debug) çalışması\nTest sonuçlarının loglanması ve dokümantasyonu',
    ],
    subat: [
      'Prototip optimizasyonu ve performans testleri yapmak',
      'Performans metrikleri belirleme ve ölçüm atölyesi\n2. dönem TEKNOFEST bölge yarışması başvurusu araştırması',
    ],
    mart: [
      'Ürünü tanıtmak ve geri bildirim almak',
      'Bilim ve Teknoloji Haftası (8-14 Mart) kapsamında kulübün proje demosu\nOkul öğretmenlerinden jüri değerlendirmesi alma etkinliği',
    ],
    nisan: [
      'Sunum becerisi ve poster hazırlığını tamamlamak',
      'Proje sunum becerisi atölyesi: beden dili, soru yanıtlama, zaman yönetimi\n23 Nisan kapsamında "Geleceğin Teknoloji Öncüleri" standı',
    ],
    mayis: [
      'TEKNOFEST yarışmasına katılmak ve sonuçları değerlendirmek',
      'TEKNOFEST bölge/ulusal yarışmasına katılım\n19 Mayıs kapsamında proje sergi ve değerlendirme etkinliği',
    ],
  },

  'Teknoloji ve İnovasyon Kulübü': {
    ekimEkstra: [
      'İnovasyon kavramı ve teknolojinin topluma etkisini tanıtmak',
      'Endüstri 4.0 ve beşinci nesil teknolojiler: yapay zekâ, IoT, blok zinciri tanıtımı\nOkul çevresinde hangi sorunları teknolojiyle çözebiliriz? keşif atölyesi',
    ],
    kasim: [
      'Türkiye\'nin teknoloji hamlelerini ve yerli ürünleri tanıtmak',
      'Atatürk Haftası kapsamında "Teknolojik Bağımsızlık Yolunda Türkiye" sunumu\nBAYRAKTAR, TOGG, ASELSAN gibi yerli teknoloji ürünleri tanıtımı',
    ],
    aralik: [
      'Yapay zekâ ve makine öğrenmesini kavramsal olarak tanıtmak',
      'Yapay zekânın temel mantığı ve günlük hayattaki uygulamaları semineri\nAkıllı şehir ve akıllı tarım kavramları tartışma atölyesi',
    ],
    subat: [
      'İnovasyon proje fikri geliştirmek ve prototiplemek',
      'Tasarım odaklı düşünme atölyesi: kullanıcı empati haritası ve çözüm tasarımı\n2. dönem inovasyon projesi ekip çalışması başlangıcı',
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
      'TEKNOFEST başvurusu veya inovasyon yarışmasına katılmak',
      'TEKNOFEST veya okul/bölge inovasyon yarışmasına katılım\n19 Mayıs kapsamında "Gençlik ve Teknoloji: Türkiye\'nin Geleceği" temalı sunum',
    ],
  },

  'Telif Hakları Kulübü': {
    ekimEkstra: [
      'Fikri mülkiyet hakkı ve telif hukuku kavramlarını tanıtmak',
      'Telif hakkı, patent, marka ve endüstriyel tasarım ayrımı sunumu\nGünlük hayatta telif: müzik, film, fotoğraf, yazılım örnekleri atölyesi',
    ],
    kasim: [
      'Atatürk\'ün eserleri ve telif bağlamını kavratmak',
      'Atatürk Haftası kapsamında "Atatürk\'ün Eserleri ve Kültürel Miras" sunumu\nNutuk\'un telif durumu ve erişim hakları tartışması',
    ],
    aralik: [
      'İnternet ortamında telif ihlallerini ve doğru kullanımı öğretmek',
      'Creative Commons lisansları ve özgür yazılım kavramı semineri\nSosyal medyada fotoğraf, müzik ve video paylaşımında telif kuralları atölyesi',
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
      'Dünya Fikrî Mülkiyet Günü (26 Nisan) kapsamında okul geneli telif farkındalık kampanyası\n23 Nisan kapsamında "Yaratıcılığı Korumak: Telif Hakkı" standı',
    ],
    mayis: [
      'Yıl içi telif farkındalık çalışmalarını raporlamak',
      'Bilişim Haftası kapsamında dijital içerik ve telif hakları bilgilendirme standı\nYıl içi farkındalık artışı değerlendirme toplantısı',
    ],
  },

  'Trafik ve İlkyardım Kulübü': {
    ekimEkstra: [
      'Trafik kuralları ve yaya güvenliğini tanıtmak',
      'Trafik işaretleri, zebra geçidi ve yaya önceliği konulu bilgilendirme\nOkul çevresi tehlikeli trafik noktaları haritalama atölyesi',
    ],
    kasim: [
      'Trafik güvenliği farkındalığı ile Atatürk Haftası etkinliğini birleştirmek',
      'Atatürk Haftası kapsamında "Atatürk ve Modern Ulaşım" sunumu\nTrafik kaza istatistikleri ve önlenebilir riskler semineri',
    ],
    aralik: [
      'Kış aylarında araç ve yaya güvenliğini öğretmek',
      'Karlı-buzlu yol güvenliği: sürücü ve yaya davranışları semineri\nOkul servis güvenliği kontrol listesi hazırlama atölyesi',
    ],
    subat: [
      'İlkyardım temellerini uygulamalı öğretmek',
      'Sivil Savunma Günü (28 Şubat) bağlantılı trafik kazası ilkyardım uygulaması\nSPR (kalp masajı), kanama kontrolü temel atölyesi',
    ],
    mart: [
      'Bisiklet ve aktif ulaşım güvenliğini tanıtmak',
      'Orman Haftası bağlantılı "Yeşil Ulaşım ve Trafik Güvenliği" etkinliği\nBisiklet güvenliği kuralları ve kask kullanımı tanıtımı',
    ],
    nisan: [
      'Trafik güvenliği oyunu ve simülasyonu düzenlemek',
      '23 Nisan kapsamında çocuklara yönelik trafik güvenliği oyun alanı kurulumu\nDünya Sağlık Haftası bağlantılı "Trafik Kazaları: Önlenebilir Ölümler" sunumu',
    ],
    mayis: [
      'Trafik ve İlkyardım Haftasında kapsamlı etkinlik düzenlemek',
      'Trafik ve İlkyardım Haftası (Mayıs ayının ilk haftası) kapsamında okul geneli etkinlik: ilkyardım standı, trafik simülasyonu\nYıl içi güvenlik çalışmalarının değerlendirmesi',
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
      'Araştırma sorusu + hipotez + yöntem üçgeni atölyesi\nİngilizce proje özeti yazma çalışması',
    ],
    subat: [
      'Prototip ve veri toplama aşamasını tamamlamak',
      'Deney/prototip geliştirme çalışması\nVeri analizi ve bulguların görselleştirilmesi atölyesi',
    ],
    mart: [
      'Proje posterini ve İngilizce sunumunu hazırlamak',
      'Bilim ve Teknoloji Haftası (8-14 Mart) kapsamında proje ön sunumu\nUluslararası standartlarda bilim posteri hazırlama atölyesi',
    ],
    nisan: [
      'Yarışmaya başvurmak ve sunum pratiği yapmak',
      'Yarışma başvurusu gönderimi ve onay bekleme süreci yönetimi\n23 Nisan kapsamında "Dünya Sahnesinde Türk Gençliği" standı',
    ],
    mayis: [
      'Yarışmaya katılmak ve deneyimi raporlamak',
      'Uluslararası yarışmaya katılım veya online sunum\n19 Mayıs kapsamında proje sonuçları değerlendirme ve kutlama etkinliği',
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
      'İnsan Hakları Haftası bağlantılı "UNESCO ve İnsan Hakları" semineri\nTürkiye\'den Dünya Mirası: Efes, Çatalhöyük, Truva, Göbeklitepe derinlemesine inceleme',
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
      'Atatürk Haftası kapsamında "Atatürk\'ün Dil Politikaları ve Çağdaşlaşma" sunumu\nFarklı dillerde "Merhaba/Teşekkür" öğrenme mini atölyesi',
    ],
    aralik: [
      'Seçilen dillerde temel ifadeler ve günlük dil pratiği kazandırmak',
      'Dil öğrenme uygulamaları (Duolingo, Babbel) tanıtımı ve kullanım atölyesi\nYabancı dilde Noel/yılbaşı geleneklerini tanıma kültür etkinliği',
    ],
    subat: [
      'Yabancı film ve müzikle dil öğrenimini pekiştirmek',
      'Yabancı dil altyazılı kısa film/klip izleme ve tartışma atölyesi\n2. dönem dil tandem partneri (partner) projesi başlatma',
    ],
    mart: [
      'Yabancı dilde sunum yapma becerisi kazandırmak',
      'Bilim ve Teknoloji Haftası bağlantılı yabancı dilde kısa sunum pratiği\nKütüphaneler Haftası kapsamında yabancı dil kitapları tanıtımı',
    ],
    nisan: [
      'Kültürlerarası dil etkinliği düzenlemek',
      'eTwinning bağlantısı: ortak okulla yabancı dilde sanal buluşma\n23 Nisan kapsamında farklı ülkelerin dillerinde "Barış" sözcüğü çalışması',
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
      'Atatürk Haftası kapsamında "Teknolojik Bağımsızlık: Yapay Zekâ Çağında Türkiye" sunumu\nUlusal Yapay Zekâ Stratejisi (2021-2025) temel hedefleri özeti',
    ],
    aralik: [
      'Makine öğrenmesi temel kavramlarını uygulamalı keşfetmek',
      'Sınıflandırma, regresyon ve kümeleme kavramları görsel atölyesi\nTeachable Machine veya benzeri araçla mini model eğitimi',
    ],
    subat: [
      'Doğal dil işleme (NLP) ve görüntü işleme temellerini keşfetmek',
      'ChatGPT ve büyük dil modelleri: nasıl çalışır? semineri\nScratch veya Python ile basit bir YZ projesi başlangıcı',
    ],
    mart: [
      'YZ etik sorunlarını ve toplumsal etkisini tartışmak',
      'Bilim ve Teknoloji Haftası (8-14 Mart) kapsamında "Yapay Zekâ: Fırsatlar ve Riskler" paneli\nGörüntü tanıma ve veri gizliliği etik tartışması',
    ],
    nisan: [
      'YZ projesi sergisi düzenlemek',
      'Öğrenci YZ proje sunumları ve okul geneli tanıtım sergisi\n23 Nisan kapsamında "Geleceğin YZ Mühendisleri" standı',
    ],
    mayis: [
      'TEKNOFEST Yapay Zekâ kategorisi başvurusu veya ulusal YZ yarışmasına katılmak',
      'TEKNOFEST YZ kategorisi başvuru araştırması ve hazırlığı\n19 Mayıs kapsamında "Gençlik ve Yapay Zekânın Geleceği" temalı sunum',
    ],
  },

  'Yayın ve İletişim Kulübü': {
    ekimEkstra: [
      'Gazetecilik ve iletişim dallarını tanıtmak\nOkul yayın organının yapısını belirlemek',
      'Gazete, dergi, radyo, TV, podcast, sosyal medya iletişim kanalları sunumu\nOkul bülteni/dergisi yönetim yapısı: editör, muhabir, fotoğrafçı rol dağılımı',
    ],
    kasim: [
      'Haber yazma tekniklerini ve gazetecilik etiğini öğretmek',
      'Atatürk Haftası kapsamında "Cumhuriyet Basını ve Atatürk" sunumu\n5N1K (ne, nerede, ne zaman, nasıl, neden, kim) haber yazma atölyesi',
    ],
    aralik: [
      'Fotoğraf haberciliği ve görsel iletişim becerisi kazandırmak',
      'Haber fotoğrafçılığı: çerçeveleme, an ve etik kurallar atölyesi\nOkul bülteni Aralık sayısı hazırlama ve yayınlama',
    ],
    subat: [
      'Podcast ve radyo yayıncılığı becerisi kazandırmak',
      'Ses kalitesi, mikrofon kullanımı ve yayın akışı hazırlama atölyesi\n2. dönem okul podcast/radyo bölümü başlatma',
    ],
    mart: [
      'Soruşturma gazeteciliği ve kaynak doğrulamayı öğretmek',
      'Kütüphaneler Haftası bağlantılı "Gerçeğin İzinde: Araştırmacı Gazetecilik" atölyesi\nBilim ve Teknoloji Haftası bağlantılı bilim haberciliği nasıl yapılır? semineri',
    ],
    nisan: [
      '23 Nisan özel sayısı yayınlamak\nOkul geneline açık mini basın toplantısı düzenlemek',
      '23 Nisan Ulusal Egemenlik ve Çocuk Bayramı özel bülteni yayınlama\nOkul geneline açık "Genç Gazeteciler Basın Toplantısı" etkinliği',
    ],
    mayis: [
      'Yıl içi yayınları arşivlemek ve basın özgürlüğünü tartışmak',
      'Yıl içi okul bülteni/podcast bölümlerinin arşivi ve en iyi yayın ödüllendirmesi\n19 Mayıs kapsamında "Gençlik Sesi: Medyada Genç Bakış" temalı program',
    ],
  },

  'Yeşilay Kulübü': {
    ekimEkstra: [
      'Yeşilay\'ın tarihini ve bağımlılıkla mücadeledeki rolünü tanıtmak',
      'Yeşilay\'ın kuruluşu (1920), misyonu ve okul kulüpleri programı sunumu\nBağımlılık türleri: madde, teknoloji, kumar farkındalık atölyesi',
    ],
    kasim: [
      'Sigara ve alkol bağımlılığı risklerini kavratmak',
      'Atatürk Haftası kapsamında "Sağlıklı Nesil, Güçlü Türkiye" sunumu\nSigara ve alkol kullanımının beyin ve sağlığa etkileri semineri',
    ],
    aralik: [
      'Teknoloji bağımlılığı ve sağlıklı ekran süresi yönetimini öğretmek',
      'Oyun ve sosyal medya bağımlılığı: belirtiler ve çözümler semineri\nDijital detoks denemesi: 24 saatlik sosyal medya molası atölyesi',
    ],
    subat: [
      'Akran baskısı ve reddedebilme becerisi kazandırmak',
      '"Hayır diyebiliyorum" rol yapma ve senaryo atölyesi\n2. dönem Yeşilay farkındalık kampanyası başlatma',
    ],
    mart: [
      'Yeşilay Haftasında kapsamlı etkinlik düzenlemek',
      'Yeşilay Haftası (1 Mart) kapsamında okul geneli bağımlılıkla mücadele kampanyası: sergi, sunum, anket\n"Yeşilay Elçisi" sertifika programı bilgilendirmesi',
    ],
    nisan: [
      'Ruh sağlığı ve bağımlılık önleme ilişkisini kavratmak',
      'Dünya Sağlık Haftası bağlantılı "Ruh Sağlığı ve Bağımlılık" semineri\n23 Nisan kapsamında "Bağımlılıksız Büyüyen Nesil" temalı program',
    ],
    mayis: [
      'Yıl içi bağımlılık önleme çalışmalarını değerlendirmek',
      'Engelliler Haftası bağlantılı "Engelsiz ve Bağımlılıksız Bir Yaşam" etkinliği\nYıl içi kampanya etki değerlendirme raporu hazırlama',
    ],
  },

  'Yeşili Koruma Kulübü': {
    ekimEkstra: [
      'Yeşil alanların önemi ve okul çevresindeki bitki örtüsünü tanıtmak',
      'Okul bahçesi bitki türleri kataloglama atölyesi\nBitkisel yaşamın ekosistem hizmetleri sunumu',
    ],
    kasim: [
      'Ağaç ve ormanın iklim düzenleme rolünü kavratmak',
      'Atatürk Haftası kapsamında "Atatürk ve Ormancılık Politikaları" sunumu\nKarbon tutma ve oksijen üretiminde ağacın rolü interaktif ders',
    ],
    aralik: [
      'Kış bahçeciliği ve bitkileri koruma becerisi kazandırmak',
      'Saksı bitkilerinin kış bakımı atölyesi\nOkul bahçesi kışlık koruma çalışması (don önleme, sulama)',
    ],
    subat: [
      'Tohum bankası ve bitki çoğaltma yöntemlerini öğretmek',
      'Tohum ekimi, fide yetiştirme ve çelikle üretme atölyesi\n2. dönem okul bahçesi bahar düzenleme projesi planlama',
    ],
    mart: [
      'Orman Haftasında fidan dikimi etkinliği düzenlemek',
      'Orman Haftası (21-26 Mart) kapsamında okul/çevre alanında fidan dikimi etkinliği\nYeşil Haftalar: okul bahçesi yenileme ve sulama düzeni kurma',
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
      'Sudoku, bulmaca, strateji oyunları, mantık bulmacaları tanıtım atölyesi\nZekâ oyunlarının beyin gelişimine katkısı sunumu',
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
      'Sudoku, Kakuro ve sayı bulmacaları yoğunlaştırılmış atölyesi\n2. dönem okul zekâ olimpiyatı planlama toplantısı',
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
      'Okullar arası zekâ yarışmasına katılmak\nYıl içi gelişimi değerlendirmek',
      'Okullar arası zekâ/bulmaca olimpiyatına katılım\n19 Mayıs kapsamında "Zekâ ve Bağımsızlık" temalı bulmaca etkinliği',
    ],
  },

  'Zeytin Ağacı Kulübü': {
    ekimEkstra: [
      'Zeytinin Anadolu kültüründeki yerini ve ekonomik önemini tanıtmak',
      'Zeytin tarihçesi: 6.000 yıllık Anadolu kültürü sunumu\nTürkiye\'nin zeytin üretimi ve ihracatı araştırma atölyesi',
    ],
    kasim: [
      'Zeytin hasadı dönemine özgü kültürel etkinlik düzenlemek',
      'Atatürk Haftası kapsamında "Tarım ve Kalkınma: Zeytin Örneği" sunumu\nZeytin hasadı geleneği ve yöresel pratikler araştırma etkinliği',
    ],
    aralik: [
      'Zeytinyağı üretimi ve sağlığa faydalarını kavratmak',
      'Zeytinyağı sağlık etkileri ve Akdeniz diyeti sunumu\nKuru sıkım ve ikinci sıkım zeytinyağı kalite farkı tadım etkinliği',
    ],
    subat: [
      'Zeytin ağacı bakımı ve sürdürülebilir tarım uygulamalarını öğretmek',
      'Zeytin ağacı budama, sulama ve organik yetiştiricilik bilgilendirmesi\n2. dönem okul bahçesi/saksı zeytin fidesi yetiştirme projesi başlatma',
    ],
    mart: [
      'Orman, doğa ve zeytin ağacının biyoçeşitlilik içindeki rolünü kavratmak',
      'Orman Haftası (21-26 Mart) bağlantılı "Zeytin Ağacı: Anadolu\'nun Hafızası" etkinliği\nZeytin ağacı çeliği dikme töreni (sembolik)',
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

// Kalan 66 kulüp için temel profil (içerik sonraki turda zenginleştirilecek)
const KULUP_ISIMLER = [
  'Afet Hazırlık Kulübü','Ahilik Kulübü','Astronomi ve Uzay Kulübü','Atatürkçü Düşünce Kulübü',
  'Bilim Fen ve Teknoloji Kulübü','Bilinçli Tüketici Kulübü','Bilişim ve İnternet Kulübü',
  'Çevre ve İklim Kulübü','Çocuk Hakları Kulübü','Değerler Kulübü',
  'Demokrasi ve İnsan Hakları Kulübü','e Twinning Kulübü','Enerji Verimliliği Kulübü',
  'Engellilerle Dayanışma Kulübü','Felsefe ve Düşünce Eğitimi Kulübü','Fotoğrafçılık Kulübü',
  'Geleneksel Çocuk Oyunları Kulübü','Geleneksel El Sanatları Kulübü',
  'Genç Yazarlar ve Şairler Kulübü','Gezi Tanıtım ve Turizm Kulübü','Girişimcilik Kulübü',
  'Görsel Sanatlar Kulübü','Halk Oyunları Kulübü','Hareketli Yaşam Kulübü','Havacılık Kulübü',
  'Hayvanları Sevme ve Koruma Kulübü','İngilizce Kulübü','İş Sağlığı ve Güvenliği Kulübü',
  'İzcilik Kulübü','Kişisel Verileri Koruma Kulübü','Kooperatifçilik Kulübü',
  'Kültür ve Tabiat Varlıklarını Koruma Kulübü','Kütüphanecilik Kulübü',
  'Medeniyet ve Değerler Kulübü','Medeniyet ve Düşünce Kulübü','Medya Okur Yazarlığı Kulübü',
  'Meslek Tanıtma Kulübü','Mesleki Tatbikat Kulübü','MUN (Model United Nations) Kulübü',
  'Örnek ve Öncü Şahsiyetler Tanıtım Kulübü','Sağlık Temizlik ve Beslenme Kulübü',
  'Sağlık ve Güvenlik Kulübü','Şehir ve Medeniyet Kulübü','Siberay Kulübü','Sıfır Atık Kulübü',
  'Şiir ve Tefekkür Kulübü','Sivil Savunma Kulübü','Sosyal Medya Kulübü',
  'Sosyal Sorumluluk Kulübü','Sosyal Yardımlaşma Kulübü','Tarih Kulübü',
  'Teknofest ve Bilim Kulübü','Teknofest ve Bilim Kulübü (Proje Uygulaması)',
  'Teknoloji ve İnovasyon Kulübü','Telif Hakları Kulübü',
  'Trafik ve İlkyardım Kulübü','Türk Silahlı Kuvvetlerini Güçlendirme ve Tanıtma Kulübü',
  'Uluslararası Teknoloji Yarışmaları ve Projeleri Kulübü','UNESCO Kulübü','Yabancı Diller Kulübü',
  'Yapay Zekâ Kulübü','Yayın ve İletişim Kulübü','Yeşilay Kulübü','Yeşili Koruma Kulübü',
  'Zeka Oyunları Kulübü','Zeytin Ağacı Kulübü',
];

// Placeholder profil — 6 ay için genel şablon, içerik sonraki turda eklenir
function placeholderProfil(kulupAdi: string): KulupProfil {
  return {
    kasim:  [`${kulupAdi} kapsamında Atatürk Haftası etkinliğine katkı sağlamak\nÖğretmenler Günü etkinliğine destek olmak`, `Atatürk Haftası (10-16 Kasım) kapsamında kulüp etkinliği\n24 Kasım Öğretmenler Günü programına kulübün katkısı`],
    aralik: [`${kulupAdi} temasıyla ilgili farkındalık oluşturmak`, `Kulüp konusuyla ilgili araştırma ve sunum çalışması\nİnsan Hakları ve Demokrasi Haftası (10 Aralık) kapsamında kulüp etkinliği`],
    subat:  [`2. yarıyıl çalışmalarını planlamak\n${kulupAdi} konusunda uygulamalı beceri geliştirmek`, `2. yarıyıl etkinlik takviminin hazırlanması\nUygulama atölyesi ve grup çalışması`],
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
