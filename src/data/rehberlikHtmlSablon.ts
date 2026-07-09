import {
  VeliGorusmeSatiri,
  OgrenciGorusmeSatiri,
  RehberlikHaftaSatiri,
  TestAnketSatiri,
} from './rehberlikSablon';
import { turkceBuyuk } from '../lib/turkce';

// Format: gerçek okul belgesi referans alındı (evraklar/rehberlik/haziran aylık rehberlik.doc) —
// haftalık tablo (Sıra | Tarih | Yeterlik Alanı | Kazanım | Etkinliğin Adı), test/anket, veli/öğrenci
// görüşmeleri, diğer çalışmalar. Önceki (Eylül referanslı) 3-liste format tamamen bu yapıyla değişti.
export type AylikRehberlikFormData = {
  okulAdi: string;
  egitimYili: string;      // "2025-2026"
  sinif: string;           // "11/C"
  ay: string;              // "Eylül"
  raporNo: number;
  raporTarihi: string;
  sinifMevcudu: number;
  sinifOgretmeni: string;
  okulRehberOgretmeni: string;
  okulMuduru: string;
  haftalar: RehberlikHaftaSatiri[];
  testAnketler: TestAnketSatiri[];
  digerCalismalar: string[];
  veliGorusmeleri: VeliGorusmeSatiri[];
  ogrenciGorusmeleri: OgrenciGorusmeSatiri[];
};

// Boş bırakılan alanları çıktıdan tamamen kaldırmak yerine daraltılmış bir
// "-" ile göstermek için — bkz. proje kuralı: boş hücrelerde &nbsp;/tamamen
// boş bırakmak yerine "-" kullanılır.
const bos = (v: string | number | undefined | null): string => {
  const s = v === undefined || v === null ? '' : String(v).trim();
  return s === '' ? '-' : s;
};

export function aylikRehberlikHtmlOlustur(form: AylikRehberlikFormData): string {
  const {
    okulAdi, egitimYili, sinif, ay, raporNo, raporTarihi, sinifMevcudu,
    sinifOgretmeni, okulRehberOgretmeni, okulMuduru,
    haftalar, testAnketler, digerCalismalar,
    veliGorusmeleri, ogrenciGorusmeleri,
  } = form;

  const haftaSatirlari = haftalar.map((h, i) => `
    <tr>
      <td class="sira-cell">${i + 1}</td>
      <td class="tarih-cell">${bos(h.tarih)}</td>
      <td>${bos(h.yeterlikAlani)}</td>
      <td>${bos(h.kazanim)}</td>
      <td>${bos(h.etkinlikAdi)}</td>
    </tr>`).join('');

  const testSatirlari = testAnketler.map((t, i) => `
    <tr>
      <td class="sira-cell">${i + 1}</td>
      <td>${bos(t.adi)}</td>
      <td class="tarih-cell">${bos(t.tarih)}</td>
      <td class="sayi-cell">${bos(t.kiz)}</td>
      <td class="sayi-cell">${bos(t.erkek)}</td>
      <td class="sayi-cell">${bos(t.toplam)}</td>
    </tr>`).join('');

  const digerListe = digerCalismalar.map(s => s.trim()).filter(Boolean);
  const digerSatirlari = (digerListe.length > 0 ? digerListe : ['-'])
    .map((m, i) => `<tr><td class="sira-cell">${i + 1}</td><td>${m}</td></tr>`)
    .join('');

  const veliBosSatir = `<tr><td class="sira-cell">-</td><td>-</td><td>-</td><td>-</td><td class="tarih-cell">-</td></tr>`;
  const veliSatirlari = veliGorusmeleri.length > 0 ? veliGorusmeleri.map(v => `
    <tr>
      <td class="sira-cell">${v.sira}</td>
      <td>${bos(v.adSoyad)}</td>
      <td>${bos(v.ogrencisi)}</td>
      <td>${bos(v.konu)}</td>
      <td class="tarih-cell">${bos(v.tarih)}</td>
    </tr>`).join('') : veliBosSatir;

  const ogrenciBosSatir = `<tr><td class="sira-cell">-</td><td class="sira-cell">-</td><td>-</td><td>-</td><td class="tarih-cell">-</td></tr>`;
  const ogrenciSatirlari = ogrenciGorusmeleri.length > 0 ? ogrenciGorusmeleri.map(o => `
    <tr>
      <td class="sira-cell">${o.sira}</td>
      <td class="sira-cell">${bos(o.ogrenciNo)}</td>
      <td>${bos(o.adSoyad)}</td>
      <td>${bos(o.konu)}</td>
      <td class="tarih-cell">${bos(o.tarih)}</td>
    </tr>`).join('') : ogrenciBosSatir;

  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8"/>
<style>
  @page { size: A4; margin: 14mm 16mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Times New Roman', serif; font-size: 10.5pt; color: #000; }
  table { width: 100%; border-collapse: collapse; }
  th, td { border: 1px solid #000; padding: 5px 7px; font-size: 9.5pt; vertical-align: top; }
  tr { page-break-inside: avoid; break-inside: avoid; }

  .baslik-tablo { margin-bottom: 14px; }
  .baslik-tablo .okul-satiri { text-align: center; font-weight: bold; font-size: 11pt; padding: 6px; }
  .baslik-tablo .rapor-satiri { text-align: center; font-weight: bold; font-size: 11.5pt; padding: 6px; }
  .baslik-tablo .etiket { font-weight: bold; width: 24%; }
  .baslik-tablo .deger { width: 26%; }

  .bolum-tablo { margin-bottom: 14px; }
  .bolum-tablo .baslik-satir th { background: #f0f0f0; font-weight: bold; text-align: center; }
  .bolum-tablo .kolon-satir th { font-weight: bold; text-align: center; font-size: 9.5pt; }
  .sira-cell { width: 6%; text-align: center; }
  .tarih-cell { width: 15%; text-align: center; }
  .sayi-cell { width: 8%; text-align: center; }

  .onay-tablo td { border: none; padding: 4px; }
  .onay-tablo .uygundur-blok { text-align: center; }
  .onay-tablo .uygundur { font-weight: bold; }
  .imza-satir { margin-top: 8px; page-break-inside: avoid; break-inside: avoid; page-break-before: avoid; break-before: avoid; }
  .imza-satir td { border: none; text-align: center; padding-top: 36px; }
  .imza-isim { font-weight: bold; }
</style>
</head>
<body>

<table class="baslik-tablo">
  <tr><td colspan="4" class="okul-satiri">${egitimYili} EĞİTİM-ÖĞRETİM YILI ${turkceBuyuk(okulAdi)}</td></tr>
  <tr><td colspan="4" class="rapor-satiri">REHBERLİK HİZMETLERİ ${turkceBuyuk(sinif)} SINIFI ${turkceBuyuk(ay)} AYI ÇALIŞMA RAPORU</td></tr>
  <tr>
    <td class="etiket">SINIF ÖĞRETMENİ</td><td class="deger">${bos(sinifOgretmeni)}</td>
    <td class="etiket">RAPOR NO</td><td class="deger">${bos(raporNo)}</td>
  </tr>
  <tr>
    <td class="etiket">SINIF</td><td class="deger">${bos(sinif)}</td>
    <td class="etiket">RAPOR TARİHİ</td><td class="deger">${bos(raporTarihi)}</td>
  </tr>
  <tr>
    <td class="etiket">SINIF MEVCUDU</td><td class="deger" colspan="3">${bos(sinifMevcudu)}</td>
  </tr>
</table>

<table class="bolum-tablo">
  <tr class="kolon-satir">
    <th class="sira-cell">SIRA</th><th class="tarih-cell">TARİH</th><th>YETERLİK ALANI</th><th>KAZANIM</th><th>ETKİNLİĞİN ADI</th>
  </tr>
  ${haftaSatirlari}
</table>

<table class="bolum-tablo">
  <tr class="baslik-satir"><th colspan="6">UYGULANAN TEST VE ANKETLER</th></tr>
  <tr class="kolon-satir">
    <th class="sira-cell">SIRA</th><th>ADI</th><th class="tarih-cell">UYGULAMA TARİHİ</th><th class="sayi-cell">KIZ</th><th class="sayi-cell">ERKEK</th><th class="sayi-cell">TOPLAM</th>
  </tr>
  ${testSatirlari}
</table>

<table class="bolum-tablo">
  <tr class="baslik-satir"><th colspan="2">DİĞER ÇALIŞMALAR</th></tr>
  ${digerSatirlari}
</table>

<table class="bolum-tablo">
  <tr class="baslik-satir"><th colspan="5">VELİLERLE YAPILAN GÖRÜŞMELER</th></tr>
  <tr class="kolon-satir">
    <th class="sira-cell">SIRA</th><th>ADSOYAD</th><th>ÖĞRENCİSİ</th><th>GÖRÜŞME KONUSU</th><th class="tarih-cell">TARİH</th>
  </tr>
  ${veliSatirlari}
</table>

<table class="bolum-tablo">
  <tr class="baslik-satir"><th colspan="5">ÖĞRENCİLERLE YAPILAN GÖRÜŞMELER</th></tr>
  <tr class="kolon-satir">
    <th class="sira-cell">SIRA</th><th class="sira-cell">NO</th><th>ADI VE SOYADI</th><th>GÖRÜŞME KONUSU</th><th class="tarih-cell">TARİH</th>
  </tr>
  ${ogrenciSatirlari}
</table>

<table class="onay-tablo">
  <tr>
    <td style="width:34%"></td>
    <td style="width:33%"></td>
    <td class="uygundur-blok" style="width:33%">
      <div class="uygundur">UYGUNDUR</div>
      <div>${raporTarihi}</div>
    </td>
  </tr>
  <tr class="imza-satir">
    <td><div class="imza-isim">${bos(sinifOgretmeni)}</div><div>Sınıf Öğretmeni</div></td>
    <td><div class="imza-isim">${bos(okulRehberOgretmeni)}</div><div>Okul Rehber Öğretmeni</div></td>
    <td><div class="imza-isim">${bos(okulMuduru)}</div><div>Okul Müdürü</div></td>
  </tr>
</table>

</body>
</html>`;
}
