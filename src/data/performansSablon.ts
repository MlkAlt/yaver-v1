// Performans Notu Değerlendirme Çizelgesi — gerçek okul belgelerinden türetildi
// (Karatay TMTAL 1./2. Performans + DKAB Performans Ödevi cetveli).

export interface PerformansKriter {
  ad: string;
  puan: number; // kriterin azami puanı — bir şablonun tüm kriterleri toplamda 100 eder
}

export interface PerformansOgrenciSatiri {
  no: number;
  okulNo: string;
  adSoyad: string;
  puanlar: number[]; // kriterler dizisiyle index hizalı
}

export function bosPerformansOgrencisi(no: number, kriterSayisi: number): PerformansOgrenciSatiri {
  return { no, okulNo: '', adSoyad: '', puanlar: new Array(kriterSayisi).fill(0) };
}

export interface PerformansSablonu {
  id: 'birinci' | 'ikinci';
  ad: string;
  kriterler: PerformansKriter[];
}

export const PERFORMANS_SABLONLARI: PerformansSablonu[] = [
  {
    id: 'birinci',
    ad: '1. Performans Notu (Ödev)',
    kriterler: [
      { ad: 'Öğretmenle düzenli olarak görüşme ve önerileri dikkate alma', puan: 10 },
      { ad: 'Ödeve uygun plan yapma ve bu planı gerçekleştirme', puan: 10 },
      { ad: 'Farklı kaynaklardan bilgileri toplama', puan: 10 },
      { ad: 'Raporda araştırmayı yansıtan yeterince bilgiye yer verme', puan: 10 },
      { ad: 'Ödevdeki bilgilerin doğruluğu ve özgünlüğü', puan: 10 },
      { ad: 'Raporu yeterince materyalle destekleme', puan: 10 },
      { ad: 'Raporu anlaşılır biçimde yazma, yazım ve dil bilgisi kurallarına uyma', puan: 10 },
      { ad: 'Ödevde eleştirel düşünme becerisi sergileme', puan: 10 },
      { ad: 'Ödevde yaratıcılık yeteneğini kullanma', puan: 10 },
      { ad: 'Raporu zamanında teslim etme', puan: 10 },
    ],
  },
  {
    id: 'ikinci',
    ad: '2. Performans Notu',
    kriterler: [
      { ad: 'Derse karşı ilgi, dersi dinleme', puan: 20 },
      { ad: 'Öğretmenlere karşı saygı', puan: 20 },
      { ad: 'Araç ve gereçleri yanında bulundurma ve derse hazırlık', puan: 10 },
      { ad: 'Not tutma', puan: 10 },
      { ad: 'Arkadaşlarına karşı saygı', puan: 10 },
      { ad: 'Tahtaya kalkma', puan: 10 },
      { ad: 'Ödevleri zamanında yapma', puan: 10 },
      { ad: 'Toplum kurallarına ve okul kurallarına uyma', puan: 10 },
    ],
  },
];

// Öğretmen tek bir "asıl not" girer; bu fonksiyon notu kriterlere ağırlıklarıyla
// orantılı ama doğal görünmesi için hafif rastgelelikle dağıtır. Toplam her zaman
// tam olarak asilNot'a eşit çıkar (kriter üst sınırları aşılmaz).
export function notuKriterlereDagit(asilNot: number, kriterler: PerformansKriter[]): number[] {
  const oran = asilNot / 100;
  const puanlar = kriterler.map(k => {
    const jitter = (Math.random() - 0.5) * Math.max(1, k.puan * 0.3);
    const ham = k.puan * oran + jitter;
    return Math.min(k.puan, Math.max(0, Math.round(ham)));
  });

  let fark = asilNot - puanlar.reduce((a, b) => a + b, 0);
  const indeksler = kriterler.map((_, i) => i);

  while (fark !== 0) {
    for (let i = indeksler.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indeksler[i], indeksler[j]] = [indeksler[j], indeksler[i]];
    }
    let degisti = false;
    for (const i of indeksler) {
      if (fark > 0 && puanlar[i] < kriterler[i].puan) {
        puanlar[i]++; fark--; degisti = true;
      } else if (fark < 0 && puanlar[i] > 0) {
        puanlar[i]--; fark++; degisti = true;
      }
      if (fark === 0) break;
    }
    if (!degisti) break;
  }
  return puanlar;
}
