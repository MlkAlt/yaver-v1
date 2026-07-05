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
  ogrenciNo: string;
  adSoyad: string;
  konu: string;
  tarih: string;
};

// Aylık raporun haftalık tablosu — yıllık plandan otomatik türetilir (bkz. rehberlikVeriZinciri.ts),
// öğretmen isterse düzenler. Referans: evraklar/rehberlik/haziran aylık rehberlik.doc
export type RehberlikHaftaSatiri = {
  sira: number;
  tarih: string;
  yeterlikAlani: string;
  kazanim: string;
  etkinlikAdi: string;
};

export type TestAnketSatiri = {
  sira: number;
  adi: string;
  tarih: string;
  kiz: string;
  erkek: string;
  toplam: string;
};

export const bosVeliGorusmeSatiri = (sira: number): VeliGorusmeSatiri => ({
  sira, adSoyad: '', ogrencisi: '', konu: '', tarih: '',
});

export const bosOgrenciGorusmeSatiri = (sira: number): OgrenciGorusmeSatiri => ({
  sira, ogrenciNo: '', adSoyad: '', konu: '', tarih: '',
});

export const bosHaftaSatiri = (sira: number): RehberlikHaftaSatiri => ({
  sira, tarih: '', yeterlikAlani: '', kazanim: '', etkinlikAdi: '',
});

export const bosTestAnketSatiri = (sira: number): TestAnketSatiri => ({
  sira, adi: '', tarih: '', kiz: '', erkek: '', toplam: '',
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

