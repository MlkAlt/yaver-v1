import { KulupEtkinlikSatiri } from './kulupSablon';
import { turkceBuyuk } from '../lib/turkce';

export type KulupFormData = {
  okulAdi: string;
  kulupAdi: string;
  egitimYili: string;
  kurulBaskani: string;
  danismanOgretmen: string;
  ogrenciTemsilcisi: string;
  mudur: string;
  tarih: string;
  etkinlikler: KulupEtkinlikSatiri[];
};

function maddeler(metin: string): string {
  const satirlar = metin.split('\n').map(s => s.trim()).filter(Boolean);
  if (satirlar.length === 0) return '';
  if (satirlar.length === 1) return satirlar[0];
  return '<ul>' + satirlar.map(s => `<li>${s}</li>`).join('') + '</ul>';
}

export function kulupYillikPlanHtmlOlustur(form: KulupFormData): string {
  const { okulAdi, kulupAdi, egitimYili, kurulBaskani, danismanOgretmen, ogrenciTemsilcisi, mudur, tarih, etkinlikler } = form;

  const satirlar = etkinlikler.map(e => `
    <tr>
      <td class="ay-cell">${e.tarih}</td>
      <td>${maddeler(e.amac)}</td>
      <td>${maddeler(e.etkinlikler)}</td>
      <td class="gun-cell">${e.belirliGunler ? maddeler(e.belirliGunler) : ''}</td>
    </tr>`).join('');

  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8"/>
<style>
  @page { size: A4 landscape; margin: 12mm 14mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Times New Roman', serif; font-size: 10.5pt; color: #000; }
  .ek-etiket { text-align: right; font-weight: bold; font-size: 11pt; margin-bottom: 4px; }
  h1 { font-size: 12pt; text-align: center; margin-bottom: 2px; }
  h2 { font-size: 13pt; text-align: center; font-weight: bold; margin: 6px 0 14px; }
  .ust-bilgi { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 10.5pt; }
  table { width: 100%; border-collapse: collapse; margin: 6px 0 20px; }
  thead { display: table-header-group; }
  th, td { border: 1px solid #000; padding: 5px 7px; font-size: 9.5pt; vertical-align: top; }
  th { background: #f0f0f0; font-weight: bold; text-align: center; }
  .ay-cell { width: 9%; text-align: center; font-weight: bold; }
  .gun-cell { width: 22%; font-size: 8.5pt; }
  ul { margin: 3px 0 0 14px; padding: 0; }
  li { margin-bottom: 2px; }
  tr { page-break-inside: avoid; break-inside: avoid; }
  .imza-alani { display: flex; justify-content: space-around; text-align: center; margin-top: 28px; }
  .imza-kutu { width: 30%; font-size: 10.5pt; }
  .imza-kutu .baslik { font-weight: bold; margin-bottom: 36px; }
  .olur { text-align: center; margin-top: 36px; font-size: 10.5pt; }
  .olur .baslik { font-weight: bold; }
  .olur .tarih { margin: 4px 0 32px; }
</style>
</head>
<body>

<div class="ek-etiket">EK-7/b</div>

<h1>${turkceBuyuk(okulAdi)} MÜDÜRLÜĞÜ</h1>
<h2>ÖĞRENCİ KULÜBÜ SOSYAL ETKİNLİKLER YILLIK ÇALIŞMA PLANI</h2>

<div class="ust-bilgi">
  <p><strong>Kulüp/Etkinlik Adı:</strong> ${kulupAdi}</p>
  <p><strong>Öğretim Yılı:</strong> ${egitimYili}</p>
</div>

<table>
  <thead>
    <tr>
      <th class="ay-cell">AY</th>
      <th>AMAÇ</th>
      <th>YAPILACAK AKTİVİTELER</th>
      <th class="gun-cell">BELİRLİ GÜN VE HAFTALAR</th>
    </tr>
  </thead>
  <tbody>
    ${satirlar}
  </tbody>
</table>

<div class="imza-alani">
  <div class="imza-kutu">
    <p class="baslik">Sosyal Etkinlikler<br/>Kurul Başkanı</p>
    <p>${kurulBaskani}</p>
  </div>
  <div class="imza-kutu">
    <p class="baslik">Danışman Öğretmen</p>
    <p>${danismanOgretmen}</p>
  </div>
  <div class="imza-kutu">
    <p class="baslik">Öğrenci Kulübü<br/>Temsilcisi</p>
    <p>${ogrenciTemsilcisi}</p>
  </div>
</div>

<div class="olur">
  <p class="baslik">OLUR</p>
  <p class="tarih">${tarih}</p>
  <p>${mudur}</p>
  <p>Eğitim Kurumu Müdürü</p>
</div>

</body>
</html>`;
}
