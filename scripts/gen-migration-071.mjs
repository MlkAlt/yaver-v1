import { readFileSync, writeFileSync } from 'fs';

const alm = JSON.parse(readFileSync('./yeniders/almanca_lise_v2.json', 'utf-8'));
const fra = JSON.parse(readFileSync('./yeniders/fransizca_lise_v2.json', 'utf-8'));

const all = [...alm, ...fra];

function esc(s) {
  if (s === null || s === undefined) return 'NULL';
  return "'" + String(s).replace(/'/g, "''") + "'";
}

const rows = all.map(r =>
  `(${esc(r.kod)},${esc(r.ad)},${r.sinif},${esc(r.sinif_tipi)},${esc(r.unite)},${esc(r.aciklama)},${esc(r.brans)},${esc(r.ders)},${esc(r.okul_tipi)},NULL,NULL,NULL,false,false,false)`
);

const sql = `-- Migration 071: Almanca lise (523) + Fransızca lise (736) seed
-- Encoding: UTF-8, CEFR->sinif A1=9/A2=10/B1=11/B2=12, sinif_tipi=normal

INSERT INTO kazanimlar (kod, ad, sinif, sinif_tipi, unite, aciklama, brans, ders, okul_tipi, program, yas_bandi, branslar, secmeli, iki_saat_kapsaminda, sinif_ogretmeni_gorunur)
VALUES
${rows.join(',\n')}
ON CONFLICT (kod, sinif, unite, okul_tipi, program, yas_bandi) DO NOTHING;
`;

writeFileSync('./supabase/migrations/20260626000071_seed_almanca_fransizca_lise.sql', sql, 'utf-8');
console.log('Migration yazıldı:', all.length, 'kayıt');
