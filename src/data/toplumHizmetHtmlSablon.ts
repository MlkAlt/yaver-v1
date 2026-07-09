import { ToplumHizmetSatiri } from './kulupSablon';
import { turkceBuyuk, sarkanKelimeyiKoru } from '../lib/turkce';

export type ToplumHizmetFormData = {
  okulAdi: string;
  kulupAdi: string;
  egitimYili: string;
  danismanOgretmenler: string; // Newline ile ayrılmış isim listesi
  mudur: string;
  tarih: string;
  satirlar: ToplumHizmetSatiri[];
};

function maddeler(metin: string): string {
  const satirlar = metin.split('\n').map(s => s.trim()).filter(Boolean);
  if (satirlar.length === 0) return '';
  if (satirlar.length === 1) return satirlar[0];
  return '<ul>' + satirlar.map(s => `<li>${s}</li>`).join('') + '</ul>';
}

export function toplumHizmetHtmlOlustur(form: ToplumHizmetFormData): string {
  const { okulAdi, kulupAdi, egitimYili, danismanOgretmenler, mudur, tarih, satirlar } = form;

  const danismanlar = danismanOgretmenler
    .split('\n').map(s => s.trim()).filter(Boolean);

  const satirHtml = satirlar.map(s => `
    <tr>
      <td class="dar-cell">${s.ay}</td>
      <td class="dar-cell">${s.hafta}</td>
      <td class="dar-cell">${s.sure}</td>
      <td>${maddeler(s.konular)}</td>
      <td>${maddeler(s.katilanlar)}</td>
      <td>${maddeler(s.degerlendirme)}</td>
    </tr>`).join('');

  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8"/>
<style>
  @page { size: A4 landscape; margin: 12mm 14mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Times New Roman', serif; font-size: 10.5pt; color: #000; }
  h1 { font-size: 12pt; text-align: center; margin-bottom: 2px; }
  h2 { font-size: 12.5pt; text-align: center; font-weight: bold; margin: 4px 0; }
  table { width: 100%; border-collapse: collapse; margin: 14px 0 20px; }
  thead { display: table-header-group; }
  th, td { border: 1px solid #000; padding: 5px 6px; font-size: 9pt; vertical-align: middle; }
  th { background: #f0f0f0; font-weight: bold; text-align: center; }
  .dar-cell { width: 8%; text-align: center; font-weight: bold; }
  ul { margin: 3px 0 0 14px; padding: 0; }
  li { margin-bottom: 2px; }
  tr { page-break-inside: avoid; break-inside: avoid; }
  .imza-alani { margin-top: 24px; page-break-inside: avoid; break-inside: avoid; page-break-before: avoid; break-before: avoid; }
  .imza-baslik { font-weight: bold; margin-bottom: 6px; }
  .imza-isim { margin: 4px 0 4px 8px; }
  .olur { text-align: center; margin-top: 36px; font-size: 10.5pt; }
  .olur .baslik { font-weight: bold; }
  .olur .tarih { margin: 4px 0 32px; }
</style>
</head>
<body>

<h1>${sarkanKelimeyiKoru(turkceBuyuk(okulAdi))}</h1>
<h2>${egitimYili} EĞİTİM-ÖĞRETİM YILI</h2>
<h2>${turkceBuyuk(kulupAdi)} TOPLUM HİZMETİ ÇALIŞMA PLANI</h2>

<table>
  <thead>
    <tr>
      <th class="dar-cell">AY</th>
      <th class="dar-cell">HAFTA</th>
      <th class="dar-cell">SÜRE</th>
      <th>KONULAR VE ETKİNLİKLER</th>
      <th>KATILANLAR</th>
      <th>DÜŞÜNCE-DEĞERLENDİRME</th>
    </tr>
  </thead>
  <tbody>
    ${satirHtml}
  </tbody>
</table>

<div class="imza-alani">
  <p class="imza-baslik">Danışman Öğretmenler</p>
  ${danismanlar.map(d => `<p class="imza-isim">${d}</p>`).join('') || '<p class="imza-isim">—</p>'}
</div>

<div class="olur">
  <p class="baslik">UYGUNDUR</p>
  <p class="tarih">${tarih}</p>
  <p>${mudur}</p>
  <p>Okul Müdürü</p>
</div>

</body>
</html>`;
}
