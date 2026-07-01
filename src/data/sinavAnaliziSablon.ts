// Sınav Analizi — tipler, AsyncStorage anahtarları, hesaplama yardımcıları

export interface SinavSoru {
  no: number;
  kazanimId: number | null;
  kazanimAd: string;
  puan: string; // TextInput değeri — sayıya boş bırakılabilir olsun diye string tutulur
}

export interface SinavOgrenci {
  no: number;
  ogrNo: string;
  adSoyad: string;
  girmedi: boolean;
}

export interface SinavTemelBilgi {
  okulAdi: string;
  sinif: string;
  dersAdi: string;
  egitimYili: string;
  donem: 1 | 2;
  sinavNo: string;
  tarih: string;
  ogretmenAdi: string;
  okulMuduru: string;
}

// puanlar[ogrenciNo][soruNo] = alınan puan (string, boş = girilmedi)
export type SinavPuanlari = Record<number, Record<number, string>>;

export interface SinavFormData extends SinavTemelBilgi {
  sorular: SinavSoru[];
  ogrenciler: SinavOgrenci[];
  puanlar: SinavPuanlari;
  tedbirler: string[];
}

export interface SoruSonuc {
  soru: SinavSoru;
  girenSayisi: number;
  basariliSayisi: number;
  basarisizSayisi: number;
  basariYuzdesi: number; // 0-100
}

export interface SinavSonuclari {
  girenOgrenciSayisi: number;
  girmeyenOgrenciSayisi: number;
  soruSonuclari: SoruSonuc[];
  genelBasariYuzdesi: number; // tüm soruların ortalama başarı yüzdesi
  ogrenciToplamlari: Record<number, number>; // ogrenciNo -> toplam puan
}

export const STORAGE_SINAV_OKUL = '@yaver/okul_adi';
export const STORAGE_SINAV_OGRETMEN = '@yaver/kullanici_adi';
export const STORAGE_SINAV_OKUL_MUDURU = '@yaver/zumre_mudur';

export function sinavOgrenciStorageKey(sinif: string): string {
  const guvenli = sinif.trim().toUpperCase().replace(/\s+/g, '');
  return `@yaver/sinav_ogrenciler_${guvenli}`;
}

function sayi(v: string): number {
  const n = parseFloat(v.replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

// Bir öğrencinin bir sorudan aldığı puan, soru puanının yarısından azsa o soru/kazanımda başarısız sayılır
// (Örnek MEB çizelgelerindeki kabul edilen kural: "soru/kazanım puanının yarısından düşük alan öğrenciler başarısız")
export function sinavSonuclariniHesapla(form: SinavFormData): SinavSonuclari {
  const katilanlar = form.ogrenciler.filter(o => !o.girmedi);
  const girmeyenler = form.ogrenciler.filter(o => o.girmedi);

  const ogrenciToplamlari: Record<number, number> = {};
  for (const o of form.ogrenciler) {
    let toplam = 0;
    for (const soru of form.sorular) {
      toplam += sayi(form.puanlar[o.no]?.[soru.no] ?? '');
    }
    ogrenciToplamlari[o.no] = toplam;
  }

  const soruSonuclari: SoruSonuc[] = form.sorular.map(soru => {
    const soruPuani = sayi(soru.puan);
    const esik = soruPuani / 2;
    let basarili = 0;
    for (const o of katilanlar) {
      const alinan = sayi(form.puanlar[o.no]?.[soru.no] ?? '');
      if (alinan >= esik && soruPuani > 0) basarili++;
    }
    const girenSayisi = katilanlar.length;
    const basarisiz = girenSayisi - basarili;
    const basariYuzdesi = girenSayisi > 0 ? Math.round((basarili / girenSayisi) * 100) : 0;
    return { soru, girenSayisi, basariliSayisi: basarili, basarisizSayisi: basarisiz, basariYuzdesi };
  });

  const genelBasariYuzdesi = soruSonuclari.length > 0
    ? Math.round(soruSonuclari.reduce((t, s) => t + s.basariYuzdesi, 0) / soruSonuclari.length)
    : 0;

  return {
    girenOgrenciSayisi: katilanlar.length,
    girmeyenOgrenciSayisi: girmeyenler.length,
    soruSonuclari,
    genelBasariYuzdesi,
    ogrenciToplamlari,
  };
}

// Başarı yüzdesi düşük kazanımlar için otomatik tedbir metni önerisi üretir
export function otomatikTedbirOner(sonuclar: SinavSonuclari): string[] {
  const tedbirler: string[] = [];
  tedbirler.push(`Sınava giren öğrencilerin genel başarı yüzdesi %${sonuclar.genelBasariYuzdesi} olmuştur.`);

  const dusukler = sonuclar.soruSonuclari.filter(s => s.basariYuzdesi < 50 && s.soru.kazanimAd);
  if (dusukler.length > 0) {
    const isimler = dusukler.map(s => s.soru.kazanimAd).join(', ');
    tedbirler.push(`Başarı yüzdesi %50'nin altında kalan kazanımlar (${isimler}) sınıfa tekrar edilecektir.`);
  }

  tedbirler.push('Kazanım bazında başarısız olan öğrencilere bireysel/grup tekrar çalışması yapılacaktır.');
  tedbirler.push('Sınıfın tamamına ders çalışma teknikleri hakkında bilgilendirme yapılacaktır.');

  return tedbirler;
}
