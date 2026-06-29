import { GUNDEM_MADDELERI } from './sokSablon';

export type SokFormData = {
  okulAdi: string;
  sinif: string;        // örn. "10/A"
  okulTipi: string;     // ilkokul | ortaokul | lise | ihl
  egitimYili: string;   // örn. "2025-2026"
  donem: 1 | 2;
  tarih: string;        // örn. "15 Kasım 2025"
  saat: string;         // örn. "14:30"
  rehberOgretmeni: string;  // kullanıcının adı
  ogretmenler: { brans: string; ad: string }[];
  gundemNotlari: Record<number, string>; // madde no → özel not (boşsa standart)
};

export function sokHtmlOlustur(form: SokFormData): string {
  const { okulAdi, sinif, egitimYili, donem, tarih, saat, rehberOgretmeni, ogretmenler, gundemNotlari } = form;
  const donemAdi = donem === 1 ? 'I. Dönem' : 'II. Dönem';
  const toplantıAyi = donem === 1 ? 'Kasım' : 'Nisan';

  // Gündem maddelerini oluştur
  const gundemGorusmesi = GUNDEM_MADDELERI.map(madde => {
    const ozelNot = gundemNotlari[madde.no];
    // İlk öğretmeni alıyoruz standart metin için (madde bazında değişmez bu basit versiyonda)
    const ilkOgretmen = ogretmenler[0] || { brans: '', ad: '' };
    const metin = ozelNot || madde.standartMetin(rehberOgretmeni, ilkOgretmen.brans, sinif);
    return `
      <div class="gundem-madde">
        <p><strong>${madde.no}- ${madde.baslik}</strong></p>
        <p>${metin.replace(/\n/g, '<br/>')}</p>
      </div>`;
  }).join('');

  // Katılımcı tablosu
  const katilimcilar = [
    { brans: 'Sınıf Rehber Öğretmeni', ad: rehberOgretmeni },
    { brans: 'Okul Rehber Öğretmeni', ad: '' },
    ...ogretmenler,
  ];

  const katilimciSatirlar = katilimcilar.map(k => `
    <tr>
      <td>${k.brans}</td>
      <td>${k.ad}</td>
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
  h2 { font-size: 12pt; text-align: center; margin-bottom: 16px; }
  .baslik { text-align: center; margin-bottom: 20px; }
  .baslik p { font-size: 11pt; }
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
  .davetiye { margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #000; page-break-after: always; }
  .imza-alani { margin-top: 20px; display: flex; justify-content: space-between; }
  .imza-kutu { text-align: center; width: 45%; }
  .imza-kutu .cizgi { border-top: 1px solid #000; margin: 40px 0 4px; }
</style>
</head>
<body>

<!-- BÖLÜM 1: DAVETİYE -->
<div class="davetiye">
  <div class="baslik">
    <h2>${okulAdi.toUpperCase()} MÜDÜRLÜĞÜNE</h2>
  </div>
  <p>${egitimYili} Eğitim-Öğretim Yılı ${donemAdi} Şube Öğretmenler Kurulu toplantısı ${toplantıAyi} ayı içinde okulumuz öğretmenler odasında saat ${saat} itibari ile aşağıdaki gündem maddelerini görüşmek üzere ${sinif} Sınıfı Şube Rehber Öğretmeni <strong>${rehberOgretmeni}</strong> başkanlığında toplanacaktır. Bilgilerinize arz ederim.</p>
  <br/>
  <p style="text-align:right"><strong>${sinif} Sınıf Rehber Öğretmeni</strong><br/>${rehberOgretmeni}</p>
  <br/>
  <p><strong>GÜNDEM MADDELERİ</strong></p>
  <ol>
    ${GUNDEM_MADDELERI.map(m => `<li>${m.baslik}</li>`).join('')}
  </ol>
  <br/>
  <div class="imza-alani">
    <div></div>
    <div class="imza-kutu">
      <div class="cizgi"></div>
      <p>Okul Müdürü</p>
      <p><strong>OLUR</strong></p>
      <p>${tarih}</p>
    </div>
  </div>
</div>

<!-- BÖLÜM 2: TUTANAK BAŞLIĞI -->
<div class="baslik">
  <h1>${okulAdi.toUpperCase()}</h1>
  <h2>${egitimYili} EĞİTİM-ÖĞRETİM YILI ${donemAdi.toUpperCase()}</h2>
  <h2>${sinif} SINIFI ŞUBE ÖĞRETMENLERİ KURULU TOPLANTI TUTANAĞI</h2>
</div>

<table class="meta-tablo">
  <tr><td>Toplantı No</td><td>${donem}</td></tr>
  <tr><td>Öğretim Yılı</td><td>${egitimYili}</td></tr>
  <tr><td>Dönemi</td><td>${donemAdi}</td></tr>
  <tr><td>Sınıf</td><td>${sinif}</td></tr>
  <tr><td>Tarih ve Yeri</td><td>${tarih} / Saat: ${saat} / Öğretmenler Odası</td></tr>
  <tr><td>Sınıf Rehber Öğretmeni</td><td>${rehberOgretmeni}</td></tr>
</table>

<!-- KATILIMCILAR -->
<p class="section-title">TOPLANTI KATILIMCILARI</p>
<table>
  <tr>
    <th>Görevi / Branşı</th>
    <th>Adı Soyadı</th>
    <th>İmzası</th>
  </tr>
  ${katilimciSatirlar}
</table>

<!-- GÜNDEM MADDELERİNİN GÖRÜŞÜLMESİ -->
<p class="section-title">GÜNDEM MADDELERİNİN GÖRÜŞÜLMESİ</p>
${gundemGorusmesi}

<!-- ALT İMZA -->
<br/>
<p>Yukarıda yazılı gündem maddelerinin görüşülüp karara bağlanmasıyla toplantı sona erdirilmiş olup iş bu tutanak toplantıya katılan öğretmenler tarafından imzalanmıştır.</p>
<br/>
<p style="text-align:right"><strong>Tarih:</strong> ${tarih}</p>

</body>
</html>`;
}
