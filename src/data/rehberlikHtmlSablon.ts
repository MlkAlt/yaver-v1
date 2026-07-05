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
      <td class="tarih-cell">${h.tarih}</td>
      <td>${h.yeterlikAlani}</td>
      <td>${h.kazanim}</td>
      <td>${h.etkinlikAdi}</td>
    </tr>`).join('');

  const testSatirlari = testAnketler.map((t, i) => `
    <tr>
      <td class="sira-cell">${i + 1}</td>
      <td>${t.adi}</td>
      <td class="tarih-cell">${t.tarih}</td>
      <td class="sayi-cell">${t.kiz}</td>
      <td class="sayi-cell">${t.erkek}</td>
      <td class="sayi-cell">${t.toplam}</td>
    </tr>`).join('');

  const digerSatirlari = digerCalismalar
    .map(s => s.trim())
    .filter(Boolean)
    .map((m, i) => `<tr><td class="sira-cell">${i + 1}</td><td>${m}</td></tr>`)
    .join('');

  const veliSatirlari = veliGorusmeleri.map(v => `
    <tr>
      <td class="sira-cell">${v.sira}</td>
      <td>${v.adSoyad}</td>
      <td>${v.ogrencisi}</td>
      <td>${v.konu}</td>
      <td class="tarih-cell">${v.tarih}</td>
    </tr>`).join('');

  const ogrenciSatirlari = ogrenciGorusmeleri.map(o => `
    <tr>
      <td class="sira-cell">${o.sira}</td>
      <td class="sira-cell">${o.ogrenciNo}</td>
      <td>${o.adSoyad}</td>
      <td>${o.konu}</td>
      <td class="tarih-cell">${o.tarih}</td>
    </tr>`).join('');

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
  .imza-satir { margin-top: 8px; }
  .imza-satir td { border: none; text-align: center; padding-top: 36px; }
  .imza-isim { font-weight: bold; }
</style>
</head>
<body>

<table class="baslik-tablo">
  <tr><td colspan="4" class="okul-satiri">${egitimYili} EĞİTİM-ÖĞRETİM YILI ${turkceBuyuk(okulAdi)}</td></tr>
  <tr><td colspan="4" class="rapor-satiri">REHBERLİK HİZMETLERİ ${turkceBuyuk(sinif)} SINIFI ${turkceBuyuk(ay)} AYI ÇALIŞMA RAPORU</td></tr>
  <tr>
    <td class="etiket">SINIF ÖĞRETMENİ</td><td class="deger">${sinifOgretmeni}</td>
    <td class="etiket">RAPOR NO</td><td class="deger">${raporNo}</td>
  </tr>
  <tr>
    <td class="etiket">SINIF</td><td class="deger">${sinif}</td>
    <td class="etiket">RAPOR TARİHİ</td><td class="deger">${raporTarihi}</td>
  </tr>
  <tr>
    <td class="etiket">SINIF MEVCUDU</td><td class="deger" colspan="3">${sinifMevcudu}</td>
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

${digerSatirlari ? `
<table class="bolum-tablo">
  <tr class="baslik-satir"><th colspan="2">DİĞER ÇALIŞMALAR</th></tr>
  ${digerSatirlari}
</table>` : ''}

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
    <td><div class="imza-isim">${sinifOgretmeni}</div><div>Sınıf Öğretmeni</div></td>
    <td><div class="imza-isim">${okulRehberOgretmeni}</div><div>Okul Rehber Öğretmeni</div></td>
    <td><div class="imza-isim">${okulMuduru}</div><div>Okul Müdürü</div></td>
  </tr>
</table>

</body>
</html>`;
}
