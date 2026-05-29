// generate-migration-042.cjs
// Din Kültürü seçmeli: KK 5-8, PH 5-8 (ortaokul), KK 9-12, PH 9-12 (lise)
const fs = require('fs');
const path = require('path');

const EXTRACTED = path.join(__dirname, '..', 'extracted');

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(EXTRACTED, file), 'utf8'));
}

function cleanAd(ad) {
  if (!ad) return '';
  let s = ad.replace(/^\.\s*/, '').trim();
  s = s.replace(/\s*Öğrenme\s+çıktısı.*$/i, '').trim();
  s = s.replace(/\s*Öğrenme\s+çıktısıyla.*$/i, '').trim();
  return s;
}

function esc(s) {
  return s.replace(/['‘’]/g, "''");
}

function isContaminated(entry) {
  const ad = entry.ad || '';
  const cleaned = cleanAd(ad);
  if (cleaned.length < 8) return true;

  // Methodoloji/devam metni markers
  const metMarkers = [
    'beceriler ile günlük',
    'toplanacak araçlar araştırılır',
    'Kalkelenin ne olduğu',
    'Öğrencilere,', 'Öğrencilerden',
    'yaşantılarının hayata',
  ];
  for (const m of metMarkers) {
    if (cleaned.includes(m)) return true;
  }

  // Invalid/short kod (e.g., "KK.7" with no sub-numbers)
  const parts = entry.kod.split('.');
  if (parts.length < 3) return true;

  return false;
}

function getUniteNo(kod) {
  const parts = kod.split('.');
  // KK.5.1.1 → 1 (index 2)
  // PH.5.1.1 → 1 (index 2)
  if (kod.startsWith('KK.') || kod.startsWith('PH.')) return parseInt(parts[2]) || 1;
  return 1;
}

const sources = [
  {
    file: 'kk58.json',
    bransSlug: 'din_kulturu',
    okulTipi: 'ortaokul',
    dersTuru: 'secmeli',
    dersAd: 'Kur\'an-ı Kerim',
  },
  {
    file: 'ph58.json',
    bransSlug: 'din_kulturu',
    okulTipi: 'ortaokul',
    dersTuru: 'secmeli',
    dersAd: 'Peygamberimizin Hayatı',
  },
];

let rows = [];
let stats = [];

for (const src of sources) {
  const entries = readJson(src.file);
  let count = 0;
  let skipped = 0;

  for (const entry of entries) {
    if (isContaminated(entry)) {
      skipped++;
      continue;
    }

    const adClean = cleanAd(entry.ad);
    if (!adClean) { skipped++; continue; }

    const sinif = entry.sinif;
    if (!sinif) { skipped++; continue; }

    const uniteNo = getUniteNo(entry.kod);

    rows.push(
      `  ('${esc(entry.kod)}', (SELECT id FROM branslar WHERE slug = '${src.bransSlug}'), ${sinif}, ${uniteNo}, '', '${esc(adClean)}', '${esc(src.dersAd)}', '${src.okulTipi}', '${src.dersTuru}')`
    );
    count++;
  }

  stats.push({ file: src.file, brans: src.bransSlug, okulTipi: src.okulTipi, count, skipped });
}

const header = `-- Migration 042: Din Kültürü seçmeli ders kazanımları (ortaokul)
-- ${new Date().toISOString().slice(0, 10)}
-- Kur'an-ı Kerim 5-8, Peygamberimizin Hayatı 5-8
-- Toplam: ${rows.length} kazanım
--
-- Stats:
${stats.map(s => `--   ${s.file} (${s.okulTipi}): ${s.count} eklendi, ${s.skipped} atlandı`).join('\n')}

INSERT INTO kazanimlar (kod, brans_id, sinif, unite_no, unite_ad, ad, ders, okul_tipi, ders_turu)
VALUES
`;

const footer = `
ON CONFLICT (kod) DO UPDATE SET
  ad        = EXCLUDED.ad,
  ders      = EXCLUDED.ders,
  okul_tipi = EXCLUDED.okul_tipi,
  ders_turu = EXCLUDED.ders_turu;
`;

const sql = header + rows.join(',\n') + footer;

const outPath = path.join(__dirname, '..', 'supabase', 'migrations', '20260416000042_seed_din_secmeli_ortaokul.sql');
fs.writeFileSync(outPath, sql, 'utf8');
console.log(`✅ Migration yazıldı: ${outPath}`);
console.log(`   Toplam: ${rows.length} satır`);
stats.forEach(s => console.log(`   ${s.file} (${s.okulTipi}): +${s.count}, skip ${s.skipped}`));
