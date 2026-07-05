import { OgrenciSatiri, KararSatiri } from './kulupSablon';
import { turkceBuyuk } from '../lib/turkce';

export type YoklamaKararFormData = {
  okulAdi: string;
  kulupAdi: string;
  egitimYili: string;
  danismanOgretmen: string;
  ogrenciler: OgrenciSatiri[];
  kararlar: KararSatiri[];
};

function maddeler(metin: string): string {
  const satirlar = metin.split('\n').map(s => s.trim()).filter(Boolean);
  if (satirlar.length === 0) return '—';
  if (satirlar.length === 1) return satirlar[0];
  return '<ol>' + satirlar.map(s => `<li>${s}</li>`).join('') + '</ol>';
}

function satirListesi(metin: string): string {
  const satirlar = metin.split('\n').map(s => s.trim()).filter(Boolean);
  if (satirlar.length === 0) return '<li>—</li>';
  return satirlar.map(s => `<li>${s}</li>`).join('');
}

export function yoklamaKararHtmlOlustur(form: YoklamaKararFormData): string {
  const { okulAdi, kulupAdi, egitimYili, danismanOgretmen, ogrenciler, kararlar } = form;

  const ogrenciSatirlari = ogrenciler.map((o, i) => `
    <tr>
      <td class="dar-cell">${i + 1}</td>
      <td>${o.adSoyad}</td>
      <td class="dar-cell">${o.okulNo}</td>
      <td class="dar-cell">${o.sinifSube}</td>
      <td>${o.gorev}</td>
    </tr>`).join('');

  const kararSayfalari = kararlar.map(k => `
<div class="sayfa-sonu"></div>

<h2>ÖĞRENCİ KULÜBÜ KARAR DEFTERİ</h2>

<table class="meta">
  <tr>
    <td class="etiket">Karar Numarası:</td><td>${k.kararNo}</td>
    <td style="width:24px"></td>
    <td class="etiket">Karar Tarihi:</td><td>${k.kararTarihi}</td>
  </tr>
</table>

<div class="bolum">GÜNDEM MADDELERİ</div>
${maddeler(k.gundemMaddeleri)}

<div class="bolum">KARAR METNİ</div>
${maddeler(k.kararMetni)}

<div class="calisma-alani">
  <div class="calisma-sol">
    <p class="bolum-kucuk">KULÜP ÇALIŞMASININ;</p>
    <p><strong>Tarihi:</strong> ${k.calismaTarihi}</p>
    <p><strong>Saati:</strong> ${k.calismaSaati}</p>
    <p><strong>Kulüp Mevcudu:</strong> ${k.kulupMevcudu}</p>
    <p><strong>İşlenen Konu, Yapılan Etkinlik:</strong></p>
    <p>${k.islenenKonu || '—'}</p>
  </div>
  <div class="calisma-sag">
    <p class="bolum-kucuk">ÇALIŞMAYA KATILAMAYAN KULÜP ÜYELERİ</p>
    <ul>${satirListesi(k.katilmayanlar)}</ul>
  </div>
</div>

<div class="imza-alani">
  <div class="imza-kutu"><p class="baslik">Kulüp Öğrenci<br/>Temsilcisi</p></div>
  <div class="imza-kutu"><p class="baslik">Üye Öğrenci</p></div>
  <div class="imza-kutu"><p class="baslik">Üye Öğrenci</p></div>
</div>
<div class="imza-alani" style="justify-content: flex-end; margin-top: 24px;">
  <div class="imza-kutu"><p class="baslik">Kulüp Rehber<br/>Öğretmen</p><p>${danismanOgretmen}</p></div>
</div>`).join('');

  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8"/>
<style>
  @page { size: A4; margin: 14mm 16mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Times New Roman', serif; font-size: 10.5pt; color: #000; line-height: 1.5; }
  h1 { font-size: 12pt; text-align: center; margin-bottom: 2px; }
  h2 { font-size: 12.5pt; text-align: center; font-weight: bold; margin: 4px 0 14px; }
  .kapak { text-align: center; margin-top: 120px; }
  .kapak h1 { font-size: 13pt; margin-bottom: 6px; }
  .kapak h2 { font-size: 14pt; margin: 24px 0; }
  .kapak p { font-size: 11.5pt; margin: 10px 0; }
  .ust-bilgi { margin-bottom: 8px; font-size: 10.5pt; }
  table { width: 100%; border-collapse: collapse; margin: 10px 0 16px; }
  thead { display: table-header-group; }
  th, td { border: 1px solid #000; padding: 5px 6px; font-size: 9.5pt; vertical-align: top; }
  th { background: #f0f0f0; font-weight: bold; text-align: center; }
  .dar-cell { width: 10%; text-align: center; }
  tr { page-break-inside: avoid; break-inside: avoid; }
  .sayfa-sonu { page-break-after: always; }
  .meta { border: none; margin: 12px 0; }
  .meta td { border: none; padding: 3px 8px 3px 0; }
  .meta .etiket { font-weight: bold; white-space: nowrap; }
  .bolum { font-weight: bold; font-size: 11pt; margin: 14px 0 6px; text-decoration: underline; }
  .bolum-kucuk { font-weight: bold; font-size: 10pt; margin-bottom: 6px; }
  ol, ul { margin: 0 0 0 18px; padding: 0; }
  ol li, ul li { margin-bottom: 3px; }
  .calisma-alani { display: flex; gap: 20px; margin-top: 16px; }
  .calisma-sol { width: 55%; }
  .calisma-sol p { margin-bottom: 6px; }
  .calisma-sag { width: 45%; border-left: 1px solid #000; padding-left: 14px; }
  .imza-alani { display: flex; justify-content: space-around; text-align: center; margin-top: 32px; }
  .imza-kutu { width: 30%; font-size: 10.5pt; }
  .imza-kutu .baslik { font-weight: bold; margin-bottom: 32px; }
</style>
</head>
<body>

<div class="kapak">
  <h1>${egitimYili} EĞİTİM-ÖĞRETİM YILI</h1>
  <p>${turkceBuyuk(okulAdi)} MÜDÜRLÜĞÜ</p>
  <h2>SOSYAL KULÜPLER<br/>YOKLAMA VE KARAR DEFTERİ</h2>
  <p><strong>Kulübün Adı:</strong> ${kulupAdi}</p>
  <p><strong>Çalışma Yeri:</strong> Okul</p>
  <p><strong>Danışman Öğretmen:</strong> ${danismanOgretmen}</p>
</div>

<div class="sayfa-sonu"></div>

<h2>${turkceBuyuk(kulupAdi)} ÖĞRENCİ LİSTESİ</h2>

<table>
  <thead>
    <tr>
      <th class="dar-cell">Sıra No</th>
      <th>Öğrencinin Adı-Soyadı</th>
      <th class="dar-cell">Okul No</th>
      <th class="dar-cell">Sınıf ve Şubesi</th>
      <th>Kulüpteki Görevi</th>
    </tr>
  </thead>
  <tbody>
    ${ogrenciSatirlari}
  </tbody>
</table>

<p><strong>DANIŞMAN ÖĞRETMEN:</strong> ${danismanOgretmen}</p>
${kararSayfalari}

</body>
</html>`;
}
