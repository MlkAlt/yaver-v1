import { DilekceFormData } from './dilekceSablon';
import { turkceBuyuk } from '../lib/turkce';

// Serbest metin alanları HTML'e girmeden önce kaçırılır (dilekçe gövdesi
// kullanıcı yazımı; "<", "&" gibi karakterler çıktıyı bozmamalı).
function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Gövde: boş satır = paragraf ayırıcı; paragraf içi tek satır sonu <br/>.
function govdeParagraflari(govde: string): string {
  const paragraflar = govde
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(Boolean);
  return paragraflar
    .map(p => `<p class="govde-p">${esc(p).replace(/\n/g, '<br/>')}</p>`)
    .join('');
}

export function dilekceHtmlOlustur(form: DilekceFormData): string {
  const { adSoyad, gorev, tc, tarih, makam, govde, ekler, imzaYeri } = form;

  const govdeHtml = govdeParagraflari(govde);

  const yer = (imzaYeri ?? '').trim();
  const tarihSatiri = yer ? `${esc(yer)}, ${esc(tarih)}` : esc(tarih);

  const eklerTemiz = ekler.map(e => e.trim()).filter(Boolean);
  const eklerHtml = eklerTemiz.length
    ? `<div class="ekler">
    <div class="ekler-baslik">EKLER:</div>
    ${eklerTemiz.map((e, i) => `<div class="ek-satir">${i + 1}- ${esc(e)}</div>`).join('\n    ')}
  </div>`
    : '';

  const tcSatiri = tc && tc.trim()
    ? `<div class="imza-tc">T.C. Kimlik No: ${esc(tc.trim())}</div>`
    : '';

  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8"/>
<style>
  @page { size: A4 portrait; margin: 16mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Times New Roman', serif; font-size: 12pt; color: #000; line-height: 1.5; }

  .makam { text-align: center; font-weight: bold; font-size: 13.5pt; line-height: 1.35; margin: 8mm 0 14mm; }

  .govde { text-align: justify; }
  .govde-p { text-indent: 1.25cm; margin-bottom: 8px; }

  .imza { margin-top: 16mm; text-align: right; page-break-inside: avoid; break-inside: avoid; page-break-before: avoid; break-before: avoid; }
  .imza .tarih { margin-bottom: 20mm; }   /* ıslak imza için boşluk (tarih ile isim arası) */
  .imza .ad { font-weight: bold; }
  .imza-tc { font-size: 10.5pt; }
  .imza .label { font-size: 10.5pt; color: #333; margin-top: 2px; }

  .ekler { margin-top: 12mm; text-align: left; font-size: 11pt; }
  .ekler-baslik { font-weight: bold; margin-bottom: 3px; }
  .ek-satir { margin-left: 2px; }
</style>
</head>
<body>

<div class="makam">${esc(turkceBuyuk(makam))}</div>

<div class="govde">
  ${govdeHtml}
</div>

<div class="imza">
  <div class="tarih">${tarihSatiri}</div>
  <div class="ad">${esc(adSoyad)}</div>
  <div class="gorev">${esc(gorev)}</div>
  ${tcSatiri}
  <div class="label">İmza</div>
</div>

${eklerHtml}

</body>
</html>`;
}
