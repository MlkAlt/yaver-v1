// Rehberlik veri zinciri: Yıllık Plan → Aylık Rapor → Dönem Sonu Raporu.
// Aylık Rapor açıldığında o ayın verisi önce daha önce kaydedilmiş manuel kayıttan (varsa),
// yoksa Yıllık Plan'dan öneri olarak gelir. Dönem Sonu Raporu, dönemin ilgili aylarının
// kayıtlarını (manuel varsa manuel, yoksa plandan) otomatik toplar.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REHBERLIK_YILLIK_PLAN } from './rehberlikYillikPlanlari';
import { REHBERLIK_AYLARI, RehberlikHaftaSatiri, TestAnketSatiri } from './rehberlikSablon';

export type RehberlikAylikKayit = {
  haftalar: RehberlikHaftaSatiri[];
  testAnketler: TestAnketSatiri[];
  digerCalismalar: string[];
};

function storageKey(sinif: string, ay: string): string {
  return `@yaver/rehberlik_aylik_${sinif.trim()}_${ay}`;
}

export async function rehberlikAylikKaydiOku(sinif: string, ay: string): Promise<RehberlikAylikKayit | null> {
  if (!sinif.trim() || !ay) return null;
  const raw = await AsyncStorage.getItem(storageKey(sinif, ay));
  return raw ? JSON.parse(raw) : null;
}

export async function rehberlikAylikKaydiYaz(sinif: string, ay: string, kayit: RehberlikAylikKayit): Promise<void> {
  if (!sinif.trim() || !ay) return;
  await AsyncStorage.setItem(storageKey(sinif, ay), JSON.stringify(kayit));
}

// "11/C", "11-A", "11" gibi serbest metinlerden sınıf numarasını çıkarır.
// Rakam yoksa ve metin okul öncesi ifadesi içeriyorsa ("Okul Öncesi", "Anasınıfı",
// "Ana Sınıfı A") 0 döner — REHBERLIK_YILLIK_PLAN'da okul öncesi anahtarı 0'dır.
export function sinifNumarasiCikar(sinif: string): number | null {
  const m = sinif.match(/\d+/);
  if (m) return parseInt(m[0], 10);
  const norm = sinif
    .toLocaleLowerCase('tr')
    .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g')
    .replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c');
  if (/okul oncesi|anasinif|ana sinif/.test(norm)) return 0;
  return null;
}

// Yıllık plandan o ayın tatil olmayan satırlarını sırayla türetir. etkinlikNo yalnızca
// lise 9-12'de dolu (kaynakta numaralandırma var); 1-8. sınıflarda hep null olduğu için
// sıralama etkinlikNo varsa ona, yoksa satırın plan içindeki doğal sırasına göre yapılır.
export function yillikPlandanKazanimOnerisi(sinif: string, ay: string): string[] {
  return yillikPlandanHaftaOnerisi(sinif, ay).map(h => h.kazanim);
}

// Aylık Rapor'un haftalık tablosu için tam satır (tarih + yeterlik alanı + kazanım +
// etkinlik adı) üretir. Yeterlik alanı/etkinlik adı yalnızca ORGM etkinlik kitaplarından
// eşleştirilebilen kazanımlarda dolu (bkz. rehberlikYillikPlanlari.ts) — eşleşmeyenlerde
// boş string kalır, uydurulmaz.
export function yillikPlandanHaftaOnerisi(sinif: string, ay: string): RehberlikHaftaSatiri[] {
  const no = sinifNumarasiCikar(sinif);
  if (no == null) return [];
  const haftalar = REHBERLIK_YILLIK_PLAN[no] ?? [];
  return haftalar
    .map((h, i) => ({ ...h, sira: i }))
    .filter(h => h.ay === ay && !h.tatil)
    .sort((a, b) => (a.etkinlikNo ?? a.sira) - (b.etkinlikNo ?? b.sira))
    .map((h, i) => ({
      sira: i + 1,
      tarih: h.tarih,
      yeterlikAlani: h.yeterlikAlani ?? '',
      kazanim: h.metin,
      etkinlikAdi: h.etkinlikAdi ?? '',
    }));
}

// I. Dönem = Eylül-Ocak (ay no 1-5), II. Dönem = Şubat-Haziran (ay no 6-10), Yıl Sonu = tümü.
const DONEM_AY_ARALIGI: Record<string, [number, number]> = {
  donem1: [1, 5],
  donem2: [6, 10],
  yilsonu: [1, 10],
};

function donemAylari(donem: string): string[] {
  const aralik = DONEM_AY_ARALIGI[donem] ?? [1, 10];
  return REHBERLIK_AYLARI.filter(a => a.no >= aralik[0] && a.no <= aralik[1]).map(a => a.ad);
}

export type DonemOzet = {
  faaliyetler: string[];          // ay bazlı işlenen kazanım + diğer çalışmalar, tekrar temizlenmiş
  islenmeyenKazanimlar: string[]; // planlanıp hiçbir ayda "işlendi" olarak kaydedilmemiş kazanımlar
  islenenKazanimSayisi: number;
};

// Dönemin ilgili aylarını gezip her ay için: manuel kayıt varsa onu, yoksa yıllık plandan
// türetilen öneriyi kullanır (kullanıcı kararı: "manuel varsa manuel, yoksa plan->aylık->dönem sonu").
export async function donemVeriOzetiOlustur(sinif: string, donem: string): Promise<DonemOzet> {
  const aylar = donemAylari(donem);
  const faaliyetler: string[] = [];
  const planliKazanimlar: string[] = [];
  const islenenKazanimlar: string[] = [];

  for (const ay of aylar) {
    const kayit = await rehberlikAylikKaydiOku(sinif, ay);
    const ayPlanKazanim = yillikPlandanKazanimOnerisi(sinif, ay);
    planliKazanimlar.push(...ayPlanKazanim);

    if (kayit) {
      faaliyetler.push(...kayit.haftalar.map(h => h.kazanim), ...kayit.digerCalismalar);
      islenenKazanimlar.push(...kayit.haftalar.map(h => h.kazanim));
    } else {
      // O ay için hiç Aylık Rapor girilmemişse, plandaki kazanımlar işlenmiş varsayılır.
      islenenKazanimlar.push(...ayPlanKazanim);
    }
  }

  const islenenSet = new Set(islenenKazanimlar);
  const islenmeyenKazanimlar = planliKazanimlar.filter(k => !islenenSet.has(k));

  return {
    faaliyetler: Array.from(new Set(faaliyetler.map(f => f.trim()).filter(Boolean))),
    islenmeyenKazanimlar: Array.from(new Set(islenmeyenKazanimlar)),
    islenenKazanimSayisi: islenenSet.size,
  };
}
