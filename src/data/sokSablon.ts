// ŞÖK (Şube Öğretmenler Kurulu) Tutanağı — statik veri

export type GundemMaddesi = {
  no: number;
  baslik: string;
  standartMetin: (ogretmenAdi: string, brans: string, sinif: string) => string;
  sabit?: boolean; // true = kullanıcı düzenleyemez (yönetmelik metni gibi)
};

export const YONETMELIK_110 = `MADDE 110 – (1) Sınıf/şube öğretmenler kurulunun oluşumu; sınıf öğretmenler kurulu aynı sınıf seviyesinde, şube öğretmenler kurulu ise aynı şubede ders okutan öğretmenler ile rehberlik öğretmenlerinden oluşur. (2) Kurullar; kasım ve nisan ayları içinde yapılır. İhtiyaç hâllerinde ise eğitim kurumu müdürünün, ilgili müdür yardımcısının, rehberlik öğretmeninin ya da sınıf/şube rehber öğretmeninin talebi ve eğitim kurumu müdürünün uygun görmesiyle toplanır. Sınıf/şube öğretmenler kurulu toplantıları ihtiyaca göre ayrı ayrı yapılabileceği gibi birleştirilerek de yapılabilir.`;

export const GUNDEM_MADDELERI: GundemMaddesi[] = [
  {
    no: 1,
    baslik: 'Açılış ve yoklama',
    standartMetin: (_, __, sinif) =>
      `Toplantı, yoklamanın ardından iyi dilek ve temennilerle başladı. ${sinif} sınıfına giren tüm öğretmenler ve okul rehber öğretmeni toplantıya katıldı.`,
  },
  {
    no: 2,
    baslik: 'Ortaöğretim Kurumları Yönetmeliğinin 110. Maddesinin okunması',
    standartMetin: (ogretmenAdi) =>
      `Ortaöğretim Kurumları Yönetmeliğinin 110. maddesi Sınıf Rehber Öğretmeni ${ogretmenAdi} tarafından okundu.\n\n${YONETMELIK_110}`,
    sabit: true,
  },
  {
    no: 3,
    baslik: 'Sınıfın genel durumu ve öğrenci kişilik özellikleri',
    standartMetin: (ogretmenAdi, brans, sinif) =>
      `${brans} Öğretmeni ${ogretmenAdi}, ${sinif} sınıfının genel olarak uyumlu ve derse ilgili olduğunu belirtti. Sınıfın akademik seviyesinin genel olarak yeterli düzeyde olduğu, bazı öğrencilerin daha fazla ilgi ve desteğe ihtiyaç duyduğu ifade edildi.`,
  },
  {
    no: 4,
    baslik: 'Öğrencilerin sağlık durumları',
    standartMetin: (ogretmenAdi, brans) =>
      `${brans} Öğretmeni ${ogretmenAdi}, sınıftaki öğrencilerin genel sağlık durumlarının iyi olduğunu belirtti. Öğrencilerin mevsim hastalıklarından korunmaları için gerekli hijyen kuralları ve sağlıklı beslenme konularında bilgilendirilmesinin önemi vurgulandı.`,
  },
  {
    no: 5,
    baslik: 'Maddi durumu kötü olan öğrencilerin tespiti',
    standartMetin: () =>
      `Sınıftaki öğrencilerin sosyo-ekonomik durumları değerlendirildi. Maddi açıdan destek ihtiyacı olduğu düşünülen öğrencilerin tespiti için sınıf rehber öğretmeni ile koordineli çalışılacağı belirtildi.`,
  },
  {
    no: 6,
    baslik: 'Öğrencilerin derslere karşı ilgisi ve başarı durumları',
    standartMetin: (ogretmenAdi, brans, sinif) =>
      `${brans} Öğretmeni ${ogretmenAdi}, ${sinif} sınıfı öğrencilerinin derse karşı genel ilgisinin olumlu olduğunu, ancak bir kısım öğrencinin akademik başarısının istenilen seviyenin altında kaldığını ifade etti. Bu öğrencilerle bireysel çalışmalar yapılacağı belirtildi.`,
  },
  {
    no: 7,
    baslik: 'Öğrencilerin başarısızlıklarının nedenleri ve alınacak önlemler',
    standartMetin: () =>
      `Başarısızlıkların temel nedenlerinin derse devamsızlık, ders çalışma alışkanlığının eksikliği ve aile faktörleri olduğu değerlendirildi. Bu öğrencilere yönelik ek destek çalışmaları düzenleneceği, veli ile iletişimin artırılacağı kararlaştırıldı.`,
  },
  {
    no: 8,
    baslik: 'Öğretmen, öğrenci, veli ilişkileri',
    standartMetin: () =>
      `Öğretmen-öğrenci-veli iletişiminin sağlıklı biçimde sürdürülmesinin önemi vurgulandı. Velilerin okul etkinliklerine katılımının artırılması gerektiği ifade edildi.`,
  },
  {
    no: 9,
    baslik: 'Öğrencilerin verimli ders çalışma yöntemleri konusunda bilgilendirilmesi',
    standartMetin: () =>
      `Öğrencilere verimli ders çalışma teknikleri, zaman yönetimi ve motivasyon konularında rehberlik yapılmasının önemi üzerinde duruldu. Sınıf rehber öğretmeninin bu konuda öğrencilere yönelik etkinlik düzenleyeceği belirtildi.`,
  },
  {
    no: 10,
    baslik: 'Öğrencilerin ailevi problemleri ve çözüm yolları',
    standartMetin: () =>
      `Öğrencilerin ailevi sorunlarının okuldaki başarı ve davranışlarını olumsuz etkileyebileceği belirtildi. Bu tür durumlarda rehberlik servisi ile iş birliği yapılacağı, gerekirse aile görüşmeleri düzenleneceği kararlaştırıldı.`,
  },
  {
    no: 11,
    baslik: 'Öğrencilerin beslenme durumları',
    standartMetin: () =>
      `Öğrencilerin düzenli ve dengeli beslenme alışkanlığı edinmeleri konusunda bilinçlendirilmesi gerektiği vurgulandı. Atıştırmalık tüketimi yerine sağlıklı alternatiflerin tercih edilmesi teşvik edilecektir.`,
  },
  {
    no: 12,
    baslik: 'Zararlı alışkanlıklar hakkında öğrencilerin bilgilendirilmesi',
    standartMetin: () =>
      `Sigara, alkol ve teknoloji bağımlılığı başta olmak üzere zararlı alışkanlıklar hakkında öğrencilerin farkındalığının artırılması gerektiği belirtildi. Bu konuda okul rehberlik servisiyle iş birliği yapılacağı ifade edildi.`,
  },
  {
    no: 13,
    baslik: 'Temizlik, düzen ve kılık-kıyafet',
    standartMetin: (_, __, sinif) =>
      `${sinif} sınıfı öğrencilerine kişisel temizlik, sınıf düzeni ve kılık-kıyafet yönetmeliğine uyum konularında hatırlatmalar yapıldığı belirtildi. Olumsuz davranışlarda disiplin yönetmeliği çerçevesinde hareket edileceği vurgulandı.`,
  },
  {
    no: 14,
    baslik: 'Sosyal etkinliklerde öğrencilerin yönlendirilmesi',
    standartMetin: () =>
      `Öğrencilerin sosyal, kültürel ve sportif etkinliklere katılımının desteklenmesi gerektiği ifade edildi. Şube öğretmenlerinin öğrencileri bu tür etkinliklere yönlendireceği kararlaştırıldı.`,
  },
  {
    no: 15,
    baslik: 'Performans, proje ve ders ödevleri',
    standartMetin: () =>
      `Performans ve proje görevlerinin zamanında ve eksiksiz teslim edilmesinin önemi öğrencilere hatırlatılacağı belirtildi. Ödevlerin değerlendirme ölçütleri konusunda öğrencilerin bilgilendirilmesi gerektiği vurgulandı.`,
  },
  {
    no: 16,
    baslik: 'Dilek ve temenniler',
    standartMetin: () =>
      `Gündem maddelerinin tamamının görüşülüp karara bağlanmasının ardından, eğitim-öğretim yılının tüm öğrenciler ve öğretmenler için başarılı ve verimli geçmesi dileğiyle toplantı sona erdirildi.`,
  },
];

// Sınıf seviyesine göre tipik öğretmen branşları
export type OgretmenBransi = { brans: string; zorunlu?: boolean };

export const SINIF_BRANS_LISTESI: Record<string, OgretmenBransi[]> = {
  ilkokul: [
    { brans: 'Sınıf Öğretmeni', zorunlu: true },
    { brans: 'İngilizce Öğretmeni' },
    { brans: 'Beden Eğitimi Öğretmeni' },
    { brans: 'Görsel Sanatlar Öğretmeni' },
    { brans: 'Müzik Öğretmeni' },
    { brans: 'Din Kültürü ve Ahlak Bilgisi Öğretmeni' },
  ],
  ortaokul: [
    { brans: 'Türkçe Öğretmeni', zorunlu: true },
    { brans: 'Matematik Öğretmeni', zorunlu: true },
    { brans: 'Fen Bilimleri Öğretmeni', zorunlu: true },
    { brans: 'Sosyal Bilgiler Öğretmeni', zorunlu: true },
    { brans: 'İngilizce Öğretmeni', zorunlu: true },
    { brans: 'Din Kültürü ve Ahlak Bilgisi Öğretmeni' },
    { brans: 'Beden Eğitimi Öğretmeni' },
    { brans: 'Görsel Sanatlar Öğretmeni' },
    { brans: 'Müzik Öğretmeni' },
    { brans: 'Teknoloji ve Tasarım Öğretmeni' },
  ],
  lise: [
    { brans: 'Türk Dili ve Edebiyatı Öğretmeni', zorunlu: true },
    { brans: 'Matematik Öğretmeni', zorunlu: true },
    { brans: 'Fizik Öğretmeni', zorunlu: true },
    { brans: 'Kimya Öğretmeni', zorunlu: true },
    { brans: 'Biyoloji Öğretmeni', zorunlu: true },
    { brans: 'Tarih Öğretmeni', zorunlu: true },
    { brans: 'Coğrafya Öğretmeni', zorunlu: true },
    { brans: 'İngilizce Öğretmeni', zorunlu: true },
    { brans: 'Din Kültürü ve Ahlak Bilgisi Öğretmeni' },
    { brans: 'Beden Eğitimi Öğretmeni' },
    { brans: 'Felsefe Öğretmeni' },
    { brans: 'Görsel Sanatlar / Müzik Öğretmeni' },
    { brans: 'Müdür Yardımcısı' },
  ],
  ihl: [
    { brans: 'Türk Dili ve Edebiyatı Öğretmeni', zorunlu: true },
    { brans: 'Matematik Öğretmeni', zorunlu: true },
    { brans: 'Kur\'an-ı Kerim Öğretmeni', zorunlu: true },
    { brans: 'Hadis Öğretmeni', zorunlu: true },
    { brans: 'Fıkıh Öğretmeni', zorunlu: true },
    { brans: 'Siyer Öğretmeni' },
    { brans: 'Arapça Öğretmeni', zorunlu: true },
    { brans: 'İngilizce Öğretmeni' },
    { brans: 'Beden Eğitimi Öğretmeni' },
    { brans: 'Müdür Yardımcısı' },
  ],
};

export function getBransListesi(okulTipi: string): OgretmenBransi[] {
  if (okulTipi === 'ilkokul') return SINIF_BRANS_LISTESI.ilkokul;
  if (okulTipi === 'ortaokul') return SINIF_BRANS_LISTESI.ortaokul;
  if (okulTipi === 'ihl') return SINIF_BRANS_LISTESI.ihl;
  return SINIF_BRANS_LISTESI.lise;
}
