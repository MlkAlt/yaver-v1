import { turkceBuyuk } from '../lib/turkce';

export type AylikRaporFormData = {
  okulAdi: string;
  kulupAdi: string;
  egitimYili: string;
  raporNo: number;
  faaliyetAyi: string;
  raporTarihi: string;
  calismalar: string[];
  toplumHizmeti: string;
  danismanOgretmen: string;
};

export const RAPOR_AYLARI: { ad: string; no: number }[] = [
  { ad: 'Eylül',   no: 1 },
  { ad: 'Ekim',    no: 2 },
  { ad: 'Kasım',   no: 3 },
  { ad: 'Aralık',  no: 4 },
  { ad: 'Ocak',    no: 5 },
  { ad: 'Şubat',   no: 6 },
  { ad: 'Mart',    no: 7 },
  { ad: 'Nisan',   no: 8 },
  { ad: 'Mayıs',   no: 9 },
  { ad: 'Haziran', no: 10 },
];

export function planEtkinlikleriniRaporaCevir(etkinliklerMetni: string): string[] {
  return etkinliklerMetni
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => {
      const temiz = s.endsWith('.') ? s.slice(0, -1) : s;
      return temiz + ' gerçekleştirildi.';
    });
}

export function aylikRaporHtmlOlustur(form: AylikRaporFormData): string {
  const {
    okulAdi, kulupAdi, egitimYili, raporNo,
    faaliyetAyi, raporTarihi, calismalar, toplumHizmeti, danismanOgretmen,
  } = form;

  const maddeler = calismalar
    .filter(s => s.trim())
    .map(s => `<li>${s}</li>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8"/>
<style>
  @page { size: A4; margin: 14mm 16mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Times New Roman', serif; font-size: 11pt; color: #000; line-height: 1.6; }
  .mudurbaslik { text-align: center; font-weight: bold; font-size: 12pt; margin-top: 24px; margin-bottom: 22px; }
  .giris { text-align: justify; margin-bottom: 18px; }
  .meta { width: 100%; border-collapse: collapse; margin-bottom: 18px; font-size: 10.5pt; }
  .meta td { padding: 3px 10px 3px 0; }
  .meta .etiket { font-weight: bold; white-space: nowrap; }
  .bolum { font-weight: bold; font-size: 11pt; margin: 14px 0 6px; text-decoration: underline; letter-spacing: 0.3px; }
  ul { margin: 0 0 0 18px; padding: 0; }
  li { margin-bottom: 3px; }
  .toplum { margin: 16px 0; }
  .toplum strong { font-weight: bold; }
  .imza { margin-top: 36px; page-break-inside: avoid; break-inside: avoid; page-break-before: avoid; break-before: avoid; }
  .imza-baslik { font-weight: bold; margin-bottom: 32px; }
</style>
</head>
<body>

<div class="mudurbaslik">${turkceBuyuk(okulAdi)} MÜDÜRLÜĞÜNE</div>

<table class="meta">
  <tr>
    <td class="etiket">Rapor No:</td><td>${raporNo}</td>
    <td style="width:20px"></td>
    <td class="etiket">Faaliyet Ayı:</td><td>${turkceBuyuk(faaliyetAyi)}</td>
    <td style="width:20px"></td>
    <td class="etiket">Rapor Tarihi:</td><td>${raporTarihi}</td>
  </tr>
</table>

<p class="giris">
  Rehberlik görevini yürütmekte olduğum <strong>${kulupAdi}</strong> Kulübünün
  ${egitimYili} Eğitim ve Öğretim Yılı ${faaliyetAyi} ayına ait olan çalışma raporu
  aşağıya çıkartılmıştır. Bilgilerinize arz ederim.
</p>

<div class="bolum">YAPILAN ÇALIŞMALAR</div>
<ul>${maddeler || '<li>—</li>'}</ul>

<div class="toplum">
  <strong>Toplum Hizmeti Çalışması:</strong> ${toplumHizmeti.trim() || '—'}
</div>

<div class="imza">
  <p class="imza-baslik">Danışman Öğretmen</p>
  <p>${danismanOgretmen}</p>
</div>

</body>
</html>`;
}
