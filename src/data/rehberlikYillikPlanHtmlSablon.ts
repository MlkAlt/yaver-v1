import { REHBERLIK_YILLIK_PLAN, RehberlikPlanHaftasi } from './rehberlikYillikPlanlari';
import { turkceBuyuk, sarkanKelimeyiKoru } from '../lib/turkce';

const TAM_AY_KISA: Record<string, string> = {
  Ocak: 'Oca', Şubat: 'Şub', Mart: 'Mar', Nisan: 'Nis', Mayıs: 'May', Haziran: 'Haz',
  Temmuz: 'Tem', Ağustos: 'Ağu', Eylül: 'Eyl', Ekim: 'Eki', Kasım: 'Kas', Aralık: 'Ara',
};

// h.tarih (rehberlikYillikPlanlari.ts'te gerçek takvimden zaten üretilmiş, ör.
// "27-31 Ekim 2025" / "27 Ekim-1 Kasım 2025") tek doğru kaynak — burada sadece dar
// grid sütununa sığması için ay adı kısaltılıp yıl atılır. Ayrı bir takvim hesabı yok,
// bu yüzden Aylık Rapor'un kullandığı tarihle her zaman birebir aynı.
function kisaltTarih(uzunTarih: string): string {
  const mk = uzunTarih.match(/^(\d+)(?:\s+([A-Za-zÇĞİÖŞÜçğıöşü]+))?-(\d+)\s+([A-Za-zÇĞİÖŞÜçğıöşü]+)\s+\d{4}$/);
  if (!mk) return uzunTarih;
  const [, basGun, basAy, bitGun, bitAy] = mk;
  return basAy
    ? `${basGun} ${TAM_AY_KISA[basAy] ?? basAy}-${bitGun} ${TAM_AY_KISA[bitAy] ?? bitAy}`
    : `${basGun}-${bitGun} ${TAM_AY_KISA[bitAy] ?? bitAy}`;
}

export type YillikPlanFormData = {
  okulAdi: string;
  egitimYili: string;
  sinif: number;          // 0 = okul öncesi, 1-12 = sınıf
  sinifRehberOgretmeni: string;
  okulRehberOgretmeni: string;
  okulMuduru: string;
};

export function rehberlikYillikPlanVarMi(sinif: number): boolean {
  return Array.isArray(REHBERLIK_YILLIK_PLAN[sinif]) && REHBERLIK_YILLIK_PLAN[sinif].length > 0;
}

// Kaynak grid ile birebir: 3 ay yan yana banded, son bant tek ay (Haziran).
const BANTLAR: string[][] = [
  ['Eylül', 'Ekim', 'Kasım'],
  ['Aralık', 'Ocak', 'Şubat'],
  ['Mart', 'Nisan', 'Mayıs'],
  ['Haziran'],
];

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Bir kazanım/idari hücresinin metni: kaynaktaki gibi "N- metin"; idari satırlarda sadece metin.
function hucreMetni(h: RehberlikPlanHaftasi): string {
  return h.etkinlikNo != null ? `<span class="kazno">${h.etkinlikNo}-</span> ${esc(h.metin)}` : esc(h.metin);
}

function planBaslik(sinif: number): string {
  return sinif === 0
    ? 'OKUL ÖNCESİ REHBERLİK HİZMETLERİ YILLIK ÇALIŞMA PLANI'
    : `${sinif}. SINIF REHBERLİK HİZMETLERİ YILLIK ÇALIŞMA PLANI`;
}

export function yillikPlanHtmlOlustur(form: YillikPlanFormData): string {
  const { okulAdi, egitimYili, sinif, sinifRehberOgretmeni, okulRehberOgretmeni, okulMuduru } = form;
  const haftalar = REHBERLIK_YILLIK_PLAN[sinif] ?? [];

  // Aylara göre grupla (plan içindeki doğal sırayı koruyarak).
  const ayHaftalari: Record<string, RehberlikPlanHaftasi[]> = {};
  for (const h of haftalar) (ayHaftalari[h.ay] ??= []).push(h);

  // Toplam satır sayısı (sol "YAPILACAK ÇALIŞMALAR" bandının rowspan'i için):
  // her bant = 1 ay-başlık satırı + o bandın en uzun ayının satır sayısı.
  let toplamSatir = 0;
  const bantBilgi = BANTLAR.map(aylar => {
    const kolonlar = aylar.map(ay => ayHaftalari[ay] ?? []);
    const maxLen = Math.max(0, ...kolonlar.map(k => k.length));
    toplamSatir += 1 + maxLen;
    return { aylar, kolonlar, maxLen };
  });

  let rows = '';
  let bannerYazildi = false;
  for (const { aylar, kolonlar, maxLen } of bantBilgi) {
    // Ay başlık satırı
    let ayBaslik = '';
    for (let s = 0; s < 3; s++) {
      if (s < aylar.length) {
        ayBaslik += `<th class="ayad">${turkceBuyuk(aylar[s])}</th><th class="tarad">TARİH</th>`;
      } else {
        ayBaslik += `<th class="bos" colspan="2"></th>`;
      }
    }
    const banner = !bannerYazildi
      ? `<th class="banner" rowspan="${toplamSatir}"><span>YAPILACAK ÇALIŞMALAR</span></th>`
      : '';
    bannerYazildi = true;
    rows += `<tr class="ayrow">${banner}${ayBaslik}</tr>`;

    // İçerik satırları
    for (let i = 0; i < maxLen; i++) {
      let tr = '';
      for (let s = 0; s < 3; s++) {
        const h = kolonlar[s] ? kolonlar[s][i] : undefined;
        if (!h) { tr += `<td class="bos"></td><td class="bos"></td>`; continue; }
        const kazCls = h.tatil ? 'kaz tatil' : 'kaz';
        const gTarih = h.tarih ? kisaltTarih(h.tarih) : '';
        const tarIc = `<span class="hafta-no">${esc(h.hafta || '')}</span>`
          + (gTarih ? `<span class="hafta-tarih-gercek">${esc(gTarih)}</span>` : '');
        tr += `<td class="${kazCls}">${hucreMetni(h)}</td><td class="tar">${tarIc}</td>`;
      }
      rows += `<tr>${tr}</tr>`;
    }
  }

  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8"/>
<style>
  @page { size: A4 landscape; margin: 10mm 12mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Times New Roman', serif; color: #000; }
  .ust { text-align: center; margin-bottom: 6px; }
  .ust .okul { font-size: 11pt; font-weight: bold; }
  .ust .yil { font-size: 10pt; }
  .ust .baslik { font-size: 10.5pt; font-weight: bold; margin-top: 2px; }
  table { width: 100%; border-collapse: collapse; table-layout: fixed; }
  th, td { border: 1px solid #000; padding: 1.5px 4px; vertical-align: middle; font-size: 7.3pt; }
  tr { page-break-inside: avoid; break-inside: avoid; }
  th.ayad { background: #dadada; text-align: center; font-weight: bold; font-size: 8.2pt; }
  th.tarad { background: #dadada; text-align: center; font-weight: bold; font-size: 7.2pt; width: 5.2%; }
  th.bos, td.bos { background: #fafafa; border-color: #bbb; }
  td.kaz { text-align: left; line-height: 1.1; }
  .kazno { font-weight: bold; }
  td.tar { text-align: center; vertical-align: middle; font-size: 7.1pt; width: 5.2%; white-space: nowrap; line-height: 1.05; }
  td.tar .hafta-no { display: block; font-weight: bold; }
  td.tar .hafta-tarih-gercek { display: block; white-space: normal; font-size: 6.2pt; font-weight: normal; color: #333; margin-top: 1px; }
  td.tatil { background: #eeeeee; font-weight: bold; font-style: italic; text-align: center; }
  th.banner {
    width: 3.2%; background: #cfcfcf; padding: 0; position: relative; overflow: hidden;
  }
  th.banner span {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%) rotate(-90deg); transform-origin: center;
    white-space: nowrap; font-weight: bold; font-size: 8pt; letter-spacing: 0.5px;
  }
  /* ay-content kolon genişlikleri: 3 × (kaz + tar) + banner = 100 */
  colgroup .cbanner { width: 3.2%; }
  colgroup .ckaz { width: 27.1%; }
  colgroup .ctar { width: 5.2%; }
  .imza { margin-top: 5px; display: flex; justify-content: space-around; page-break-inside: avoid; break-inside: avoid; page-break-before: avoid; break-before: avoid; }
  .imza .kutu { text-align: center; width: 30%; }
  .imza .kutu .ad { margin-top: 14px; font-weight: bold; font-size: 8pt; }
  .imza .kutu .rol { font-size: 7.5pt; }
</style>
</head>
<body>
  <div class="ust">
    <div class="okul">${egitimYili} EĞİTİM-ÖĞRETİM YILI ${sarkanKelimeyiKoru(turkceBuyuk(okulAdi))}</div>
    <div class="baslik">${planBaslik(sinif)}</div>
  </div>
  <table>
    <colgroup>
      <col class="cbanner"/>
      <col class="ckaz"/><col class="ctar"/>
      <col class="ckaz"/><col class="ctar"/>
      <col class="ckaz"/><col class="ctar"/>
    </colgroup>
    <tbody>${rows}</tbody>
  </table>
  <div class="imza">
    <div class="kutu"><div class="ad">${esc(sinifRehberOgretmeni)}</div><div class="rol">Sınıf Rehber Öğretmeni</div></div>
    <div class="kutu"><div class="ad">${esc(okulRehberOgretmeni)}</div><div class="rol">Okul Rehber Öğretmeni</div></div>
    <div class="kutu"><div class="ad">${esc(okulMuduru)}</div><div class="rol">Okul Müdürü</div></div>
  </div>
</body>
</html>`;
}
