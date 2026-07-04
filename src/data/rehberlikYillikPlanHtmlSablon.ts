import { REHBERLIK_YILLIK_PLAN, RehberlikPlanHaftasi } from './rehberlikYillikPlanlari';
import { turkceBuyuk } from '../lib/turkce';

export type YillikPlanFormData = {
  okulAdi: string;
  egitimYili: string;
  sinif: number;          // 1-12
  sinifRehberOgretmeni: string;
  okulMuduru: string;
};

export function rehberlikYillikPlanVarMi(sinif: number): boolean {
  return Array.isArray(REHBERLIK_YILLIK_PLAN[sinif]) && REHBERLIK_YILLIK_PLAN[sinif].length > 0;
}

function satirMetni(h: RehberlikPlanHaftasi): string {
  return h.etkinlikNo != null ? `${h.metin} (${h.etkinlikNo}. Etkinlik)` : h.metin;
}

export function yillikPlanHtmlOlustur(form: YillikPlanFormData): string {
  const { okulAdi, egitimYili, sinif, sinifRehberOgretmeni, okulMuduru } = form;
  const haftalar = REHBERLIK_YILLIK_PLAN[sinif] ?? [];

  // Ay bazında ardışık gruplama → AY hücresi rowspan ile tek görünür
  let rows = '';
  let i = 0;
  while (i < haftalar.length) {
    const ay = haftalar[i].ay;
    let j = i;
    while (j < haftalar.length && haftalar[j].ay === ay) j++;
    const grup = haftalar.slice(i, j);
    grup.forEach((h, k) => {
      const ayHucre = k === 0 ? `<td class="ay" rowspan="${grup.length}">${turkceBuyuk(ay)}</td>` : '';
      const cls = h.tatil ? ' class="tatil"' : '';
      rows += `<tr${cls}>${ayHucre}<td class="tarih">${h.tarih}</td><td>${satirMetni(h)}</td></tr>`;
    });
    i = j;
  }

  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8"/>
<style>
  @page { size: A4 landscape; margin: 14mm 16mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Times New Roman', serif; font-size: 9.5pt; color: #000; }
  h1 { font-size: 12pt; text-align: center; }
  h2 { font-size: 11pt; text-align: center; margin-bottom: 8px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 14px; }
  thead { display: table-header-group; }
  th, td { border: 1px solid #000; padding: 3px 6px; font-size: 9pt; vertical-align: top; }
  th { background: #f0f0f0; font-weight: bold; text-align: center; }
  tr { page-break-inside: avoid; break-inside: avoid; }
  td.ay { width: 8%; text-align: center; font-weight: bold; vertical-align: middle; background: #f7f7f7; }
  td.tarih { width: 17%; text-align: center; }
  tr.tatil td { background: #eaeaea; font-weight: bold; font-style: italic; text-align: center; }
  .imza-alani { margin-top: 10px; display: flex; justify-content: space-between; }
  .imza-kutu { text-align: center; width: 40%; }
  .imza-kutu .cizgi { border-top: 1px solid #000; margin: 30px 0 4px; }
</style>
</head>
<body>
  <h1>${egitimYili} EĞİTİM-ÖĞRETİM YILI ${turkceBuyuk(okulAdi)}</h1>
  <h2>${sinif}. SINIF REHBERLİK HİZMETLERİ YILLIK ÇALIŞMA PLANI</h2>
  <table>
    <thead><tr><th class="ay">AY</th><th class="tarih">TARİH</th><th>YAPILACAK ÇALIŞMALAR</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="imza-alani">
    <div class="imza-kutu"><div class="cizgi"></div><p>${sinifRehberOgretmeni}</p><p>Sınıf Rehber Öğretmeni</p></div>
    <div class="imza-kutu"><div class="cizgi"></div><p>${okulMuduru}</p><p>Okul Müdürü</p></div>
  </div>
</body>
</html>`;
}
