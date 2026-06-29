import { VELI_GUNDEM_MADDELERI, VELI_DONEM_TIPLERI, VeliDonem } from './veliSablon';

export type VeliFormData = {
  okulAdi: string;
  sinif: string;
  donem: VeliDonem;
  egitimYili: string;
  tarih: string;
  saat: string;
  rehber: string;
  mudur: string;
  mudurYardimcisi: string;
  ogretmenler: { brans: string; ad: string }[];
  gundemNotlari: Record<number, string>;
};

export function veliHtmlOlustur(form: VeliFormData): string {
  const { okulAdi, sinif, donem, egitimYili, tarih, saat, rehber, mudur, mudurYardimcisi, ogretmenler, gundemNotlari } = form;

  const donemBilgi = VELI_DONEM_TIPLERI.find(d => d.key === donem)!;

  const gundemGorusmesi = VELI_GUNDEM_MADDELERI.map(madde => {
    const ozelNot = gundemNotlari[madde.no];
    const metin   = ozelNot || madde.standartMetin(rehber, sinif, donem);
    return `
      <div class="gundem-madde">
        <p><strong>${madde.no}- ${madde.baslik}</strong></p>
        <p>${metin.replace(/\n/g, '<br/>')}</p>
      </div>`;
  }).join('');

  const katilimcilar = [
    { unvan: 'Okul Müdürü',           ad: mudur },
    { unvan: 'Okul Müdür Yardımcısı', ad: mudurYardimcisi },
    { unvan: 'Rehber Öğretmen',        ad: rehber },
    ...ogretmenler.map(o => ({ unvan: `${o.brans} Öğretmeni`, ad: o.ad })),
  ];

  const katilimciSatirlar = katilimcilar.map(k => `
    <tr>
      <td>${k.unvan}</td>
      <td>${k.ad}</td>
      <td class="imza-cell"></td>
    </tr>`).join('');

  const veliSatirlari = Array.from({ length: 30 }, (_, i) => `
    <tr>
      <td class="sira-cell">${i + 1}</td>
      <td></td>
      <td></td>
      <td class="imza-cell"></td>
    </tr>`).join('');

  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8"/>
<style>
  @page { size: A4; margin: 25mm 30mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Times New Roman', serif; font-size: 12pt; color: #000; }
  h1 { font-size: 13pt; text-align: center; margin-bottom: 4px; }
  h2 { font-size: 12pt; text-align: center; margin-bottom: 8px; }
  .baslik { text-align: center; margin-bottom: 20px; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; }
  thead { display: table-header-group; }
  th, td { border: 1px solid #000; padding: 5px 8px; font-size: 11pt; }
  th { background: #f0f0f0; font-weight: bold; text-align: center; }
  tr { page-break-inside: avoid; break-inside: avoid; }
  .imza-cell { min-height: 36px; width: 110px; }
  .sira-cell { width: 32px; text-align: center; }
  .meta-tablo td:first-child { font-weight: bold; width: 160px; }
  .gundem-madde { margin: 10px 0; page-break-inside: avoid; break-inside: avoid; }
  .gundem-madde p { margin-bottom: 4px; line-height: 1.5; }
  .section-title { font-size: 12pt; font-weight: bold; text-align: center; margin: 16px 0 8px; border-bottom: 1px solid #000; padding-bottom: 4px; }
  .imza-alani { margin-top: 24px; display: flex; justify-content: space-between; }
  .imza-kutu { text-align: center; width: 45%; }
  .imza-kutu .cizgi { border-top: 1px solid #000; margin: 40px 0 4px; }
  .sayfa-sonu { page-break-after: always; }
</style>
</head>
<body>

<div class="baslik">
  <h1>${okulAdi.toUpperCase()}</h1>
  <h2>${egitimYili} EĞİTİM-ÖĞRETİM YILI</h2>
  <h2>${sinif} SINIFI ${donemBilgi.donem.toUpperCase()} VELİ TOPLANTISI TUTANAĞI</h2>
</div>

<table class="meta-tablo">
  <tr><td>Öğretim Yılı</td><td>${egitimYili}</td></tr>
  <tr><td>Dönemi</td><td>${donemBilgi.donem}</td></tr>
  <tr><td>Sınıf</td><td>${sinif}</td></tr>
  <tr><td>Tarih ve Yeri</td><td>${tarih} / Saat: ${saat} / Okul Toplantı Salonu</td></tr>
  <tr><td>Rehber Öğretmen</td><td>${rehber}</td></tr>
</table>

<p class="section-title">TOPLANTIYA KATILAN ÖĞRETMENLER</p>
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
    <p>${rehber}</p>
    <p>Rehber Öğretmen</p>
  </div>
  <div class="imza-kutu">
    <div class="cizgi"></div>
    <p>${mudurYardimcisi || mudur}</p>
    <p>${mudurYardimcisi ? 'Okul Müdür Yardımcısı' : 'Okul Müdürü'}</p>
  </div>
</div>

<div class="sayfa-sonu"></div>

<div class="baslik" style="margin-top: 0;">
  <h1>${okulAdi.toUpperCase()}</h1>
  <h2>${egitimYili} EĞİTİM-ÖĞRETİM YILI — ${sinif} SINIFI</h2>
  <h2>${donemBilgi.donem.toUpperCase()} VELİ TOPLANTISI KATILIM LİSTESİ</h2>
</div>

<p style="font-size: 11pt; margin-bottom: 8px;"><strong>Tarih:</strong> ${tarih} &nbsp;&nbsp; <strong>Saat:</strong> ${saat} &nbsp;&nbsp; <strong>Rehber Öğretmen:</strong> ${rehber}</p>

<table>
  <thead>
    <tr>
      <th>No</th>
      <th>Öğrenci Adı Soyadı</th>
      <th>Veli Adı Soyadı</th>
      <th>İmzası</th>
    </tr>
  </thead>
  <tbody>
    ${veliSatirlari}
  </tbody>
</table>

</body>
</html>`;
}
