import { ZUMRE_GUNDEM_MADDELERI, ZumleToplantTipi, TOPLANTI_TIPLERI } from './zumreSablon';
import { turkceBuyuk } from '../lib/turkce';

export type ZumreFormData = {
  okulAdi: string;
  brans: string;
  topTipi: ZumleToplantTipi;
  egitimYili: string;
  tarih: string;
  saat: string;
  zumreBaskani: string;
  mudur: string;
  mudurYardimcisi: string;
  ogretmenler: { ad: string }[];
  gundemNotlari: Record<number, string>;
};

export function zumreHtmlOlustur(form: ZumreFormData): string {
  const { okulAdi, brans, topTipi, egitimYili, tarih, saat, zumreBaskani, mudur, mudurYardimcisi, ogretmenler, gundemNotlari } = form;

  const tipBilgi  = TOPLANTI_TIPLERI.find(t => t.key === topTipi)!;
  const topNo     = tipBilgi.no;
  const donem     = tipBilgi.donem;
  const topLabel  = tipBilgi.label;

  const gundemGorusmesi = ZUMRE_GUNDEM_MADDELERI.map(madde => {
    const ozelNot = gundemNotlari[madde.no];
    const metin   = ozelNot || madde.standartMetin(zumreBaskani, brans, topTipi);
    return `
      <div class="gundem-madde">
        <p><strong>${madde.no}- ${madde.baslik}</strong></p>
        <p>${metin.replace(/\n/g, '<br/>')}</p>
      </div>`;
  }).join('');

  const katilimcilar = [
    { unvan: 'Okul Müdürü',           ad: mudur },
    { unvan: 'Okul Müdür Yardımcısı', ad: mudurYardimcisi },
    { unvan: 'Zümre Başkanı',         ad: zumreBaskani },
    ...ogretmenler.map(o => ({ unvan: `${brans} Öğretmeni`, ad: o.ad })),
  ];

  const katilimciSatirlar = katilimcilar.map(k => `
    <tr>
      <td>${k.unvan}</td>
      <td>${k.ad}</td>
      <td class="imza-cell"></td>
    </tr>`).join('');

  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8"/>
<style>
  @page { size: A4; margin: 14mm 16mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Times New Roman', serif; font-size: 12pt; color: #000; }
  h1 { font-size: 13pt; text-align: center; margin-bottom: 4px; }
  h2 { font-size: 12pt; text-align: center; margin-bottom: 16px; }
  .baslik { text-align: center; margin-bottom: 20px; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; }
  thead { display: table-header-group; }
  th, td { border: 1px solid #000; padding: 5px 8px; font-size: 11pt; }
  th { background: #f0f0f0; font-weight: bold; text-align: center; }
  tr { page-break-inside: avoid; break-inside: avoid; }
  .imza-cell { min-height: 36px; width: 120px; }
  .meta-tablo td:first-child { font-weight: bold; width: 160px; }
  .gundem-madde { margin: 10px 0; page-break-inside: avoid; break-inside: avoid; }
  .gundem-madde p { margin-bottom: 4px; line-height: 1.5; }
  .section-title { font-size: 12pt; font-weight: bold; text-align: center; margin: 16px 0 8px; border-bottom: 1px solid #000; padding-bottom: 4px; }
  .imza-alani { margin-top: 20px; display: flex; justify-content: space-between; }
  .imza-kutu { text-align: center; width: 45%; }
  .imza-kutu .cizgi { border-top: 1px solid #000; margin: 40px 0 4px; }
</style>
</head>
<body>

<div class="baslik">
  <h1>${turkceBuyuk(okulAdi)}</h1>
  <h2>${egitimYili} EĞİTİM-ÖĞRETİM YILI</h2>
  <h2>${turkceBuyuk(brans)} ZÜMRESİ ÖĞRETMENLER KURULU</h2>
  <h2>${turkceBuyuk(topLabel)} TOPLANTI TUTANAĞI</h2>
</div>

<table class="meta-tablo">
  <tr><td>Toplantı No</td><td>${topNo}</td></tr>
  <tr><td>Öğretim Yılı</td><td>${egitimYili}</td></tr>
  <tr><td>Dönemi</td><td>${donem}</td></tr>
  <tr><td>Toplantı Türü</td><td>${topLabel}</td></tr>
  <tr><td>Tarih ve Yeri</td><td>${tarih} / Saat: ${saat} / Öğretmenler Odası</td></tr>
  <tr><td>Zümre Başkanı</td><td>${zumreBaskani}</td></tr>
</table>

<p class="section-title">TOPLANTI KATILIMCILARI</p>
<table>
  <thead>
    <tr>
      <th>Görevi / Unvanı</th>
      <th>Adı Soyadı</th>
      <th>İmzası</th>
    </tr>
  </thead>
  <tbody>
    ${katilimciSatirlar}
  </tbody>
</table>

<p class="section-title">GÜNDEM MADDELERİNİN GÖRÜŞÜLMESİ</p>
${gundemGorusmesi}

<br/>
<p>Yukarıda yazılı gündem maddelerinin görüşülüp karara bağlanmasıyla toplantı sona erdirilmiş olup iş bu tutanak toplantıya katılan öğretmenler tarafından imzalanmıştır.</p>
<br/>
<p style="text-align:right"><strong>Tarih:</strong> ${tarih}</p>

<div class="imza-alani">
  <div class="imza-kutu">
    <div class="cizgi"></div>
    <p>${zumreBaskani}</p>
    <p>Zümre Başkanı</p>
  </div>
  <div class="imza-kutu">
    <div class="cizgi"></div>
    <p>${mudur}</p>
    <p>Okul Müdürü</p>
  </div>
</div>

</body>
</html>`;
}
