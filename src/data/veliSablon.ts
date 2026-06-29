export type VeliDonem = 'donem1' | 'donem2';

export const VELI_DONEM_TIPLERI: { key: VeliDonem; label: string; donem: string }[] = [
  { key: 'donem1', label: '1. Dönem', donem: 'I. Dönem'  },
  { key: 'donem2', label: '2. Dönem', donem: 'II. Dönem' },
];

export type VeliGundemMaddesi = {
  no: number;
  baslik: string;
  standartMetin: (rehber: string, sinif: string, donem: VeliDonem) => string;
  sabit?: boolean;
};

export const VELI_GUNDEM_MADDELERI: VeliGundemMaddesi[] = [
  {
    no: 1,
    baslik: 'Açılış ve yoklama',
    standartMetin: (rehber, sinif) =>
      `Toplantı, ${sinif} sınıfı rehber öğretmeni ${rehber} tarafından açıldı. Katılımcıların yoklaması yapıldı.`,
    sabit: true,
  },
  {
    no: 2,
    baslik: 'Öğrencilerin genel durum değerlendirmesi',
    standartMetin: (_, sinif, donem) =>
      `${sinif} sınıfı öğrencilerinin ${donem === 'donem1' ? 'I. Dönem' : 'II. Dönem'} akademik ve sosyal gelişim durumu velilerle paylaşıldı. Öğrencilerin sınıftaki genel tutumu, ders katılımı ve davranış durumu değerlendirildi.`,
  },
  {
    no: 3,
    baslik: 'Devam-devamsızlık durumları',
    standartMetin: (_, sinif) =>
      `${sinif} sınıfı öğrencilerinin devam-devamsızlık durumu velilere bildirildi. Devamsızlık sınırına yaklaşan öğrencilerin aileleri uyarıldı ve yasal süre konusunda bilgi verildi.`,
  },
  {
    no: 4,
    baslik: 'Sınav sonuçları ve değerlendirme',
    standartMetin: (_, sinif, donem) =>
      `${sinif} sınıfında ${donem === 'donem1' ? 'I. Dönem' : 'II. Dönem'} boyunca yapılan yazılı sınav sonuçları genel hatlarıyla velilerle paylaşıldı. Öğrencilerin güçlü ve eksik oldukları konular ele alındı, telafi çalışmaları hakkında bilgi verildi.`,
  },
  {
    no: 5,
    baslik: 'Ders çalışma alışkanlıkları ve ev ödevi takibi',
    standartMetin: () =>
      `Öğrencilerin evde düzenli ders çalışma alışkanlığı kazanmaları gerektiği vurgulandı. Velilerin ev ödevlerini ve ders çalışma sürelerini takip etmeleri, e-okul sistemi üzerinden devam-not durumunu düzenli kontrol etmeleri önerildi.`,
  },
  {
    no: 6,
    baslik: 'Rehberlik ve yönlendirme',
    standartMetin: (_, sinif) =>
      `${sinif} sınıfı öğrencilerinin mesleki ve eğitimsel yönlendirilmesi konusunda bilgi verildi. Öğrencilerin ilgi ve yetenekleri doğrultusunda destek olunması, rehberlik servisinden gerektiğinde yardım alınması önerildi.`,
  },
  {
    no: 7,
    baslik: 'Okul-aile iş birliği ve beklentiler',
    standartMetin: () =>
      `Okul-aile iş birliğinin önemi vurgulandı. Velilerin okula düzenli geri bildirim vermesi ve öğretmenlerle iletişimde kalması istendi. Okul etkinliklerine katılım teşvik edildi. Velilerin görüş ve beklentileri dinlendi.`,
  },
  {
    no: 8,
    baslik: 'Dilek ve temenniler',
    standartMetin: (rehber, sinif) =>
      `Gündem maddelerinin tamamının görüşülmesinin ardından, ${sinif} sınıfı öğrencilerinin başarılı ve mutlu bir dönem geçirmesi dileğiyle toplantı ${rehber} tarafından sona erdirildi.`,
    sabit: true,
  },
];
