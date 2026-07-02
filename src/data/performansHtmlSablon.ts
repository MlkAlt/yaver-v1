import { PerformansKriter, PerformansOgrenciSatiri } from './performansSablon';
import { turkceBuyuk } from '../lib/turkce';

export type PerformansFormData = {
  okulAdi: string;
  sinif: string;
  dersAdi: string;
  egitimYili: string;
  donemBaslik: string;
  tarih: string;
  ogretmen: string;
  mudur: string; // opsiyonel — boşsa Okul Müdürü imza bloğu basılmaz
  kriterler: PerformansKriter[];
  ogrenciler: PerformansOgrenciSatiri[];
};

export function performansHtmlOlustur(form: PerformansFormData): string {
  const { okulAdi, sinif, dersAdi, egitimYili, donemBaslik, tarih, ogretmen, mudur, kriterler, ogrenciler } = form;

  const kriterBaslikHtml = kriterler.map(k => `<th class="kriter-th"><span>${k.ad}</span></th>`).join('');
  const kriterPuanHtml = kriterler.map(k => `<td class="puan-cell">${k.puan}</td>`).join('');

  const ogrenciSatirlari = ogrenciler.map((o, i) => {
    const toplam = o.puanlar.reduce((a, b) => a + b, 0);
    const puanHucreleri = kriterler.map((_, ki) => `<td class="puan-cell">${o.puanlar[ki] ?? 0}</td>`).join('');
    return `
    <tr>
      <td class="dar-cell">${i + 1}</td>
      <td class="dar-cell">${o.okulNo}</td>
      <td class="ad-cell">${o.adSoyad}</td>
      ${puanHucreleri}
      <td class="toplam-cell">${toplam}</td>
    </tr>`;
  }).join('');

  const mudurBlok = mudur.trim()
    ? `<div class="imza-kutu"><p class="baslik">Okul Müdürü</p><p>${mudur}</p></div>`
    : '';

  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8"/>
<style>
  @page { size: A4; margin: 14mm 12mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Times New Roman', serif; font-size: 10.5pt; color: #000; }
  h1 { font-size: 12pt; text-align: center; margin-bottom: 2px; }
  h2 { font-size: 12.5pt; text-align: center; font-weight: bold; margin: 4px 0 10px; }
  .ust-bilgi { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 10.5pt; }
  table { width: 100%; border-collapse: collapse; margin: 16px 0 18px; table-layout: fixed; }
  thead { display: table-header-group; }
  th, td { border: 1px solid #000; padding: 3px 2px; font-size: 8pt; vertical-align: middle; text-align: center; }
  .kriter-th {
    writing-mode: vertical-rl; transform: rotate(180deg);
    white-space: nowrap; font-weight: bold; font-size: 7pt; padding: 4px 6px;
  }
  .dar-cell { width: 6%; }
  .ad-cell { text-align: left; font-size: 8.5pt; padding-left: 4px; }
  .puan-cell { font-weight: normal; }
  .toplam-cell { font-weight: bold; background: #f5f5f5; }
  tr { page-break-inside: avoid; break-inside: avoid; }
  .imza-alani { display: flex; justify-content: space-around; text-align: center; margin-top: 30px; }
  .imza-kutu { width: 45%; font-size: 10.5pt; }
  .imza-kutu .baslik { font-weight: bold; margin-bottom: 32px; }
</style>
</head>
<body>

<h1>${turkceBuyuk(okulAdi)} ${egitimYili} EĞİTİM-ÖĞRETİM YILI</h1>
<h2>${turkceBuyuk(donemBaslik)}</h2>

<div class="ust-bilgi">
  <p><strong>Ders Adı:</strong> ${dersAdi}</p>
  <p><strong>Sınıf:</strong> ${sinif}</p>
  <p><strong>Tarih:</strong> ${tarih}</p>
</div>

<table>
  <thead>
    <tr>
      <th class="dar-cell">Sıra</th>
      <th class="dar-cell">Okul No</th>
      <th class="ad-cell">Adı Soyadı</th>
      ${kriterBaslikHtml}
      <th class="dar-cell">Toplam<br/>Puan</th>
    </tr>
    <tr>
      <td colspan="3"></td>
      ${kriterPuanHtml}
      <td class="toplam-cell">100</td>
    </tr>
  </thead>
  <tbody>
    ${ogrenciSatirlari}
  </tbody>
</table>

<div class="imza-alani">
  <div class="imza-kutu">
    <p class="baslik">Ders Öğretmeni</p>
    <p>${ogretmen}</p>
  </div>
  ${mudurBlok}
</div>

</body>
</html>`;
}
