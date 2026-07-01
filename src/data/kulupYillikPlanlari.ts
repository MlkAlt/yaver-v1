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
