import { SinavFormData, SinavSonuclari } from './sinavAnaliziSablon';
import { turkceBuyuk } from '../lib/turkce';

const DONEM_METNI: Record<1 | 2, string> = { 1: '1. Dönem', 2: '2. Dönem' };

export function sinavAnaliziHtmlOlustur(form: SinavFormData, sonuclar: SinavSonuclari): string {
  const { okulAdi, sinif, dersAdi, egitimYili, donem, sinavNo, tarih, ogretmenAdi, okulMuduru, sorular, ogrenciler, puanlar, tedbirler } = form;

  const kazanimBasliklari = sorular.map(s => `<th>${s.kazanimAd || `Soru ${s.no}`}</th>`).join('');
  const soruNoSatiri      = sorular.map(s => `<td>${s.no}</td>`).join('');
  const puanSatiri        = sorular.map(s => `<td>${s.puan || 0}</td>`).join('');

  const ogrenciSatirlari = ogrenciler.map((o, i) => {
    if (o.girmedi) {
      return `
      <tr>
        <td class="sira-cell">${i + 1}</td>
        <td>${o.ogrNo}</td>
        <td class="ad-cell">${o.adSoyad}</td>
        ${sorular.map(() => '<td>—</td>').join('')}
        <td class="toplam-cell">Girmedi</td>
      </tr>`;
    }
    const puanHucreleri = sorular.map(s => `<td>${puanlar[o.no]?.[s.no] ?? ''}</td>`).join('');
    return `
      <tr>
        <td class="sira-cell">${i + 1}</td>
        <td>${o.ogrNo}</td>
        <td class="ad-cell">${o.adSoyad}</td>
        ${puanHucreleri}
        <td class="toplam-cell">${sonuclar.ogrenciToplamlari[o.no] ?? 0}</td>
      </tr>`;
  }).join('');

  const basariliSatiri  = sonuclar.soruSonuclari.map(s => `<td>${s.basariliSayisi}</td>`).join('');
  const basarisizSatiri = sonuclar.soruSonuclari.map(s => `<td>${s.basarisizSayisi}</td>`).join('');
  const yuzdeSatiri      = sonuclar.soruSonuclari.map(s => `<td>%${s.basariYuzdesi}</td>`).join('');

  const tedbirSatirlari = tedbirler.map((t, i) => `<li>${t}</li>`).join('');

  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8"/>
<style>
  @page { size: A4 landscape; margin: 14mm 16mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Times New Roman', serif; font-size: 10pt; color: #000; }
  h1 { font-size: 13pt; text-align: center; margin-bottom: 2px; }
  h2 { font-size: 11pt; text-align: center; font-weight: normal; margin-bottom: 10px; }
  .baslik { text-align: center; margin-bottom: 12px; }
  table { width: 100%; border-collapse: collapse; margin: 8px 0; }
  thead { display: table-header-group; }
  th, td { border: 1px solid #000; padding: 3px 5px; font-size: 8.5pt; text-align: center; }
  th { background: #f0f0f0; font-weight: bold; }
  tr { page-break-inside: avoid; break-inside: avoid; }
  .meta-tablo td { text-align: left; font-size: 9.5pt; }
  .meta-tablo td:nth-child(odd) { font-weight: bold; width: 110px; background: #f7f7f7; }
  .sira-cell { width: 26px; }
  .ad-cell { text-align: left; min-width: 130px; }
  .toplam-cell { font-weight: bold; }
  .section-title { font-size: 11pt; font-weight: bold; margin: 14px 0 6px; border-bottom: 1px solid #000; padding-bottom: 3px; }
  .tedbirler { font-size: 10pt; line-height: 1.6; padding-left: 18px; margin-top: 4px; }
  .imza-alani { margin-top: 28px; display: flex; justify-content: space-between; }
  .imza-kutu { text-align: center; width: 40%; }
  .imza-kutu .cizgi { border-top: 1px solid #000; margin: 36px 0 4px; }
</style>
</head>
<body>

<div class="baslik">
  <h1>${turkceBuyuk(okulAdi)}</h1>
  <h2>SINAV ANALİZ VE DEĞERLENDİRME ÇİZELGESİ</h2>
</div>

<table class="meta-tablo">
  <tr>
    <td>Sınıf</td><td>${sinif}</td>
    <td>Ders Adı</td><td>${dersAdi}</td>
    <td>Eğitim Yılı</td><td>${egitimYili}</td>
  </tr>
  <tr>
    <td>Dönem</td><td>${DONEM_METNI[donem]}</td>
    <td>Sınav No</td><td>${sinavNo}</td>
    <td>Tarih</td><td>${tarih}</td>
  </tr>
</table>

<table>
  <thead>
    <tr>
      <th rowspan="3" class="sira-cell">S.No</th>
      <th rowspan="3">Öğr. No</th>
      <th rowspan="3" class="ad-cell">Adı Soyadı</th>
      ${kazanimBasliklari}
      <th rowspan="3">Toplam<br/>Puan</th>
    </tr>
    <tr>${soruNoSatiri}</tr>
    <tr>${puanSatiri}</tr>
  </thead>
  <tbody>
    ${ogrenciSatirlari}
  </tbody>
</table>

<table>
  <tbody>
    <tr><td class="ad-cell" style="font-weight:bold; text-align:left;">Sınava Giren / Girmeyen</td><td colspan="${sorular.length + 1}" style="text-align:left;">${sonuclar.girenOgrenciSayisi} / ${sonuclar.girmeyenOgrenciSayisi}</td></tr>
    <tr><td class="ad-cell" style="font-weight:bold; text-align:left;">Başarılı Öğrenci Sayısı</td>${basariliSatiri}<td></td></tr>
    <tr><td class="ad-cell" style="font-weight:bold; text-align:left;">Başarısız Öğrenci Sayısı</td>${basarisizSatiri}<td></td></tr>
    <tr><td class="ad-cell" style="font-weight:bold; text-align:left;">Başarı Yüzdesi</td>${yuzdeSatiri}<td style="font-weight:bold;">%${sonuclar.genelBasariYuzdesi}</td></tr>
  </tbody>
</table>

<p class="section-title">BAŞARI DÜZEYİNİN ARTIRILMASI İÇİN ALINMASI PLANLANAN TEDBİRLER</p>
<ol class="tedbirler">${tedbirSatirlari}</ol>

<div class="imza-alani">
  <div class="imza-kutu">
    <div class="cizgi"></div>
    <p>${ogretmenAdi}</p>
    <p>${dersAdi} Öğretmeni</p>
  </div>
  <div class="imza-kutu">
    <div class="cizgi"></div>
    <p>${okulMuduru}</p>
    <p>Okul Müdürü</p>
  </div>
</div>

</body>
</html>`;
}
