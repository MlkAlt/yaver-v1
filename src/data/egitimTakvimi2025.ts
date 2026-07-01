// 2025-2026 eğitim yılı takvimi — Supabase egitim_takvimi tablosundan sabit kopya.
// Kaynak: planUret.ts'in de kullandığı migration ile seeded Supabase tablosu.
// Kulüp etkinlik planı üretimi için senkron (async-free) kullanım amacıyla burada tutulur.
export interface TakvimHaftasi {
  haftaNo: number;
  baslangic: string;
  bitis: string;
  tatilMi: boolean;
  tatilAdi: string | null;
}

export const EGITIM_TAKVIMI: TakvimHaftasi[] = [
  { haftaNo:  1, baslangic: '2025-09-15', bitis: '2025-09-19', tatilMi: false, tatilAdi: null },
  { haftaNo:  2, baslangic: '2025-09-22', bitis: '2025-09-26', tatilMi: false, tatilAdi: null },
  { haftaNo:  3, baslangic: '2025-09-29', bitis: '2025-10-03', tatilMi: false, tatilAdi: null },
  { haftaNo:  4, baslangic: '2025-10-06', bitis: '2025-10-10', tatilMi: false, tatilAdi: null },
  { haftaNo:  5, baslangic: '2025-10-13', bitis: '2025-10-17', tatilMi: false, tatilAdi: null },
  { haftaNo:  6, baslangic: '2025-10-20', bitis: '2025-10-24', tatilMi: false, tatilAdi: null },
  { haftaNo:  7, baslangic: '2025-10-27', bitis: '2025-10-31', tatilMi: false, tatilAdi: null },
  { haftaNo:  8, baslangic: '2025-11-03', bitis: '2025-11-07', tatilMi: false, tatilAdi: null },
  { haftaNo:  9, baslangic: '2025-11-10', bitis: '2025-11-14', tatilMi: false, tatilAdi: null },
  { haftaNo: 10, baslangic: '2025-11-17', bitis: '2025-11-21', tatilMi: false, tatilAdi: null },
  { haftaNo: 11, baslangic: '2025-11-24', bitis: '2025-11-28', tatilMi: false, tatilAdi: null },
  { haftaNo: 12, baslangic: '2025-12-01', bitis: '2025-12-05', tatilMi: false, tatilAdi: null },
  { haftaNo: 13, baslangic: '2025-12-08', bitis: '2025-12-12', tatilMi: false, tatilAdi: null },
  { haftaNo: 14, baslangic: '2025-12-15', bitis: '2025-12-19', tatilMi: false, tatilAdi: null },
  { haftaNo: 15, baslangic: '2025-12-22', bitis: '2025-12-26', tatilMi: false, tatilAdi: null },
  { haftaNo: 16, baslangic: '2025-12-29', bitis: '2026-01-02', tatilMi: true,  tatilAdi: 'Yılbaşı Arası' },
  { haftaNo: 17, baslangic: '2026-01-05', bitis: '2026-01-09', tatilMi: false, tatilAdi: null },
  { haftaNo: 18, baslangic: '2026-01-12', bitis: '2026-01-16', tatilMi: false, tatilAdi: null },
  { haftaNo: 19, baslangic: '2026-01-19', bitis: '2026-01-23', tatilMi: false, tatilAdi: null },
  { haftaNo: 20, baslangic: '2026-01-26', bitis: '2026-01-30', tatilMi: true,  tatilAdi: 'Yarıyıl Tatili' },
  { haftaNo: 21, baslangic: '2026-02-02', bitis: '2026-02-06', tatilMi: true,  tatilAdi: 'Yarıyıl Tatili' },
  { haftaNo: 22, baslangic: '2026-02-09', bitis: '2026-02-13', tatilMi: false, tatilAdi: null },
  { haftaNo: 23, baslangic: '2026-02-16', bitis: '2026-02-20', tatilMi: false, tatilAdi: null },
  { haftaNo: 24, baslangic: '2026-02-23', bitis: '2026-02-27', tatilMi: false, tatilAdi: null },
  { haftaNo: 25, baslangic: '2026-03-02', bitis: '2026-03-06', tatilMi: false, tatilAdi: null },
  { haftaNo: 26, baslangic: '2026-03-09', bitis: '2026-03-13', tatilMi: false, tatilAdi: null },
  { haftaNo: 27, baslangic: '2026-03-16', bitis: '2026-03-20', tatilMi: false, tatilAdi: null },
  { haftaNo: 28, baslangic: '2026-03-23', bitis: '2026-03-27', tatilMi: false, tatilAdi: null },
  { haftaNo: 29, baslangic: '2026-03-30', bitis: '2026-04-03', tatilMi: true,  tatilAdi: 'Ramazan Bayramı' },
  { haftaNo: 30, baslangic: '2026-04-06', bitis: '2026-04-10', tatilMi: false, tatilAdi: null },
  { haftaNo: 31, baslangic: '2026-04-13', bitis: '2026-04-17', tatilMi: false, tatilAdi: null },
  { haftaNo: 32, baslangic: '2026-04-20', bitis: '2026-04-24', tatilMi: false, tatilAdi: null },
  { haftaNo: 33, baslangic: '2026-04-27', bitis: '2026-05-01', tatilMi: false, tatilAdi: null },
  { haftaNo: 34, baslangic: '2026-05-04', bitis: '2026-05-08', tatilMi: false, tatilAdi: null },
  { haftaNo: 35, baslangic: '2026-05-11', bitis: '2026-05-15', tatilMi: false, tatilAdi: null },
  { haftaNo: 36, baslangic: '2026-05-18', bitis: '2026-05-22', tatilMi: false, tatilAdi: null },
  { haftaNo: 37, baslangic: '2026-05-25', bitis: '2026-05-29', tatilMi: true,  tatilAdi: 'Kurban Bayramı' },
  { haftaNo: 38, baslangic: '2026-06-01', bitis: '2026-06-05', tatilMi: false, tatilAdi: null },
  { haftaNo: 39, baslangic: '2026-06-08', bitis: '2026-06-12', tatilMi: false, tatilAdi: null },
  { haftaNo: 40, baslangic: '2026-06-15', bitis: '2026-06-19', tatilMi: false, tatilAdi: null },
  { haftaNo: 41, baslangic: '2026-06-22', bitis: '2026-06-26', tatilMi: false, tatilAdi: null },
];

export const AKTIF_HAFTALAR = EGITIM_TAKVIMI.filter(h => !h.tatilMi);

const TR_AYLAR: Record<number, string> = {
  1: 'Ocak', 2: 'Şubat', 3: 'Mart', 4: 'Nisan', 5: 'Mayıs', 6: 'Haziran',
  7: 'Temmuz', 8: 'Ağustos', 9: 'Eylül', 10: 'Ekim', 11: 'Kasım', 12: 'Aralık',
};

export function haftaTarihMetni(h: TakvimHaftasi): string {
  const bas = h.baslangic.split('-');
  const bit = h.bitis.split('-');
  const basgAy = parseInt(bas[1]);
  const bitgAy  = parseInt(bit[1]);
  const basgGun = parseInt(bas[2]);
  const bitgGun  = parseInt(bit[2]);
  const yil     = bas[0];
  if (basgAy === bitgAy) {
    return `${basgGun}-${bitgGun} ${TR_AYLAR[basgAy]} ${yil}`;
  }
  return `${basgGun} ${TR_AYLAR[basgAy]}-${bitgGun} ${TR_AYLAR[bitgAy]} ${yil}`;
}

export function haftanınAyAdi(h: TakvimHaftasi): string {
  return TR_AYLAR[parseInt(h.baslangic.split('-')[1])];
}
