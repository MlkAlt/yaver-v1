// Aylık Rehberlik Raporu — statik veri
// Kaynak: evraklar/rehberlik/melik-sibil-11-sinif-eylul-rehberlik-raporu-1782571914.docx (gerçek okul belgesi, hücre hücre incelendi)

export type VeliGorusmeSatiri = {
  sira: number;
  adSoyad: string;
  ogrencisi: string;
  konu: string;
  tarih: string;
};

export type OgrenciGorusmeSatiri = {
  sira: number;
  adSoyad: string;
  konu: string;
  tarih: string;
};

export const bosVeliGorusmeSatiri = (sira: number): VeliGorusmeSatiri => ({
  sira, adSoyad: '', ogrencisi: '', konu: '', tarih: '',
});

export const bosOgrenciGorusmeSatiri = (sira: number): OgrenciGorusmeSatiri => ({
  sira, adSoyad: '', konu: '', tarih: '',
});

// Referans belgede rapor no 1 = Eylül. Eğitim-öğretim yılı Eylül'de başlar.
export const REHBERLIK_AYLARI: { ad: string; no: number }[] = [
  { ad: 'Eylül',   no: 1 },
  { ad: 'Ekim',    no: 2 },
  { ad: 'Kasım',   no: 3 },
  { ad: 'Aralık',  no: 4 },
  { ad: 'Ocak',    no: 5 },
  { ad: 'Şubat',   no: 6 },
  { ad: 'Mart',    no: 7 },
  { ad: 'Nisan',   no: 8 },
  { ad: 'Mayıs',   no: 9 },
  { ad: 'Haziran', no: 10 },
];

// Referans belgedeki sabit geçiş cümlesi — her üç bölümde de aynen tekrarlanıyor.
export function rehberlikGirisCumlesi(sinif: string, ay: string): string {
  return `${sinif} Sınıfı ${ay} ayı rehberlik faaliyetleri kapsamında aşağıda sıralanmış olan çalışmalar, Okul Rehberlik Servisi ile koordineli şekilde yapılmıştır.`;
}

export function numaralaKazanim(maddeler: string[]): string[] {
  return maddeler
    .map(s => s.trim())
    .filter(Boolean)
    .map((m, i) => `${m} (${i + 1} numaralı kazanım işlendi.)`);
}

export function numaralaEtkinlik(maddeler: string[]): string[] {
  return maddeler
    .map(s => s.trim())
    .filter(Boolean)
    .map((m, i) => `${m} (${i + 1} numaralı etkinlik yapıldı.)`);
}
