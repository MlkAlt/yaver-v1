import {
  VeliGorusmeSatiri,
  OgrenciGorusmeSatiri,
  rehberlikGirisCumlesi,
  numaralaKazanim,
  numaralaEtkinlik,
} from './rehberlikSablon';
import { turkceBuyuk } from '../lib/turkce';

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
  yapilanCalismalar: string[];    // madde listesi (numaralanmaz)
  islenenKazanimlar: string[];    // ham metin — numaralaKazanim ile otomatik numaralanır
  yapilanEtkinlikler: string[];   // ham metin — numaralaEtkinlik ile otomatik numaralanır
  veliGorusmeleri: VeliGorusmeSatiri[];
  ogrenciGorusmeleri: OgrenciGorusmeSatiri[];
};

function maddeSatirlari(maddeler: string[]): string {
  return maddeler
    .map(s => s.trim())
    .filter(Boolean)
    .map(m => `<tr><td class="ay-cell"></td><td>${m}</td></tr>`)
    .join('');
}

export function aylikRehberlikHtmlOlustur(form: AylikRehberlikFormData): string {
  const {
    okulAdi, egitimYili, sinif, ay, raporNo, raporTarihi, sinifMevcudu,
    sinifOgretmeni, okulRehberOgretmeni, okulMuduru,
    yapilanCalismalar, islenenKazanimlar, yapilanEtkinlikler,
    veliGorusmeleri, ogrenciGorusmeleri,
  } = form;

  const giris = rehberlikGirisCumlesi(sinif, ay);
  const kazanimlar = numaralaKazanim(islenenKazanimlar);
  const etkinlikler = numaralaEtkinlik(yapilanEtkinlikler);

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
      <td>${o.adSoyad}</td>
      <td>${o.konu}</td>
      <td class="tarih-cell">${o.tarih}</td>
    </tr>`).join('');

  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8"/>
<style>
  @page { size: A4; margin: 18mm 20mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Times New Roman', serif; font-size: 10.5pt; color: #000; }
  table { width: 100%; border-collapse: collapse; }
  th, td { border: 1px solid #000; padding: 5px 7px; font-size: 10pt; vertical-align: top; }
  tr { page-break-inside: avoid; break-inside: avoid; }

  .baslik-tablo { margin-bottom: 14px; }
  .baslik-tablo .okul-satiri { text-align: center; font-weight: bold; font-size: 11pt; padding: 6px; }
  .baslik-tablo .rapor-satiri { text-align: center; font-weight: bold; font-size: 11.5pt; padding: 6px; }
  .baslik-tablo .etiket { font-weight: bold; width: 24%; }
  .baslik-tablo .deger { width: 26%; }

  .icerik-tablo { margin-bottom: 14px; }
  .icerik-tablo .baslik-satir th { background: #f0f0f0; font-weight: bold; text-align: center; }
  .icerik-tablo .bolum-satir td { font-weight: bold; background: #f7f7f7; }
  .ay-cell { width: 10%; text-align: center; font-weight: bold; }

  .gorusme-tablo { margin-bottom: 14px; }
  .gorusme-tablo .baslik-satir th { background: #f0f0f0; font-weight: bold; text-align: center; }
  .gorusme-tablo .kolon-satir th { font-weight: bold; text-align: center; font-size: 9.5pt; }
  .sira-cell { width: 6%; text-align: center; }
  .tarih-cell { width: 16%; text-align: center; }
  .bos-satir td { height: 20px; }

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
    <td class="etiket">SINIF MEVCUDU</td><td class="deger">${sinifMevcudu}</td>
    <td class="etiket">RAPOR TARİHİ</td><td class="deger">${raporTarihi}</td>
  </tr>
</table>

<table class="icerik-tablo">
  <tr class="baslik-satir"><th class="ay-cell">AY</th><th>YAPILAN REHBERLİK ÇALIŞMALARI</th></tr>
  <tr class="bolum-satir"><td class="ay-cell">${turkceBuyuk(ay)}</td><td>${giris}</td></tr>
  ${maddeSatirlari(yapilanCalismalar)}
  <tr class="bolum-satir"><td class="ay-cell">${turkceBuyuk(ay)}</td><td>YILLIK PLANA GÖRE İŞLENEN KAZANIMLAR</td></tr>
  <tr><td class="ay-cell">${turkceBuyuk(ay)}</td><td>${giris}</td></tr>
  ${maddeSatirlari(kazanimlar)}
  <tr class="bolum-satir"><td class="ay-cell">${turkceBuyuk(ay)}</td><td>YAPILAN ETKİNLİKLER (ORGM ORTAÖĞRETİM SINIF REHBERLİK ETKİNLİKLERİ 1. CİLT)</td></tr>
  <tr><td class="ay-cell">${turkceBuyuk(ay)}</td><td>${giris}</td></tr>
  ${maddeSatirlari(etkinlikler)}
</table>

<table class="gorusme-tablo">
  <tr class="baslik-satir"><th colspan="5">VELİLERLE YAPILAN GÖRÜŞMELER</th></tr>
  <tr class="kolon-satir">
    <th class="sira-cell">SIRA</th><th>ADSOYAD</th><th>ÖĞRENCİSİ</th><th>GÖRÜŞME KONUSU</th><th class="tarih-cell">TARİH</th>
  </tr>
  ${veliSatirlari}
</table>

<table class="gorusme-tablo">
  <tr class="baslik-satir"><th colspan="4">ÖĞRENCİLERLE YAPILAN GÖRÜŞMELER</th></tr>
  <tr class="kolon-satir">
    <th class="sira-cell">SIRA</th><th>ADSOYAD</th><th>GÖRÜŞME KONUSU</th><th class="tarih-cell">TARİH</th>
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
