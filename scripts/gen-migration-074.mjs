import { readFileSync, writeFileSync } from 'fs';

const cevre = JSON.parse(readFileSync('./yeniders/cevre_egitimi_iklim_degisikligi_ortaokul_v2.json', 'utf-8'));
const mbu = JSON.parse(readFileSync('./yeniders/matematik_bilim_uygulamalari_ortaokul_v2.json', 'utf-8'));

const all = [...cevre, ...mbu];

function esc(s) {
  if (s === null || s === undefined || s === '') return 'NULL';
  return "'" + String(s).replace(/'/g, "''") + "'";
}
function branslarArr(arr) {
  return "'{" + arr.map(b => `"${b}"`).join(',') + "}'";
}

const rows = all.map(r =>
  `  (${esc(r.kod)},${esc(r.ad)},${r.sinif},${esc(r.sinif_tipi)},${esc(r.unite)},${esc(r.aciklama)},${esc(r.brans)},${esc(r.ders)},${esc(r.okul_tipi)},NULL,NULL,${branslarArr(r.branslar)},FALSE,FALSE,FALSE)`
);

const sql = `-- Migration 074: Fen Bilimleri ortaokul seçmeli dersleri seed
-- Kaynak: yeniders/cevre_egitimi_iklim_degisikligi_ortaokul_v2.json (34 kazanim)
--         yeniders/matematik_bilim_uygulamalari_ortaokul_v2.json (102 kazanim)
-- Kazanimlar resmi MEB Ogretim Programi PDF'lerinden (mufredat.meb.gov.tr) pdfjs-dist ile cikarildi.
-- Cevre Egitimi ve Iklim Degisikligi: 6/7/8. sinif serbest secim, sinif=0.
-- Matematik ve Bilim Uygulamalari: I.duzey=6.sinif, II.duzey=7.sinif (Matematik+Bilim Uygulamalari modulleri).
-- Toplam: 136 kazanim.

INSERT INTO kazanimlar
  (kod, ad, sinif, sinif_tipi, unite, aciklama, brans, ders, okul_tipi,
   program, yas_bandi, branslar, secmeli, iki_saat_kapsaminda, sinif_ogretmeni_gorunur)
VALUES
${rows.join(',\n')}
ON CONFLICT (kod, sinif, unite, okul_tipi, program, yas_bandi) DO NOTHING;
`;

writeFileSync('./supabase/migrations/20260708000074_seed_fen_bilimleri_secmeli.sql', sql, 'utf-8');
console.log('Migration yazıldı:', all.length, 'kayıt');
