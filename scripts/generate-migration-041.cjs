// generate-migration-041.cjs
// Seçmeli ders kazanımları: extracted/ JSON → SQL migration
// Dersler: Sosyoloji, Takım Sporları, Tasavvuf Kültürü, İslam Felsefesi,
//          İslam'da Çocuk Eğitimi, Din Eğitimi, İslam Bilim Tarihi, Temel Matematik
const fs = require('fs');
const path = require('path');

const EXTRACTED = path.join(__dirname, '..', 'extracted');

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(EXTRACTED, file), 'utf8'));
}

function cleanAd(ad) {
  if (!ad) return '';
  // Strip leading ". "
  let s = ad.replace(/^\.\s*/, '').trim();
  // Strip trailing " Öğrenme çıktısı..." artifacts
  s = s.replace(/\s*Öğrenme çıktısı.*$/i, '').trim();
  // Strip trailing " Öğrenme çıktısıyla.*"
  s = s.replace(/\s*Öğrenme çıktısıyla.*$/i, '').trim();
  // Strip trailing "-" from line-broken PDF text (keep the word before dash)
  // Actually keep as-is — truncated text is still useful
  return s;
}

function esc(s) {
  // Escape single quotes for SQL (ASCII ' and Unicode RIGHT SINGLE QUOTATION MARK ')
  return s.replace(/['’]/g, "''");
}

// Return null to skip entry
function isContaminated(entry) {
  const ad = entry.ad || '';
  const cleaned = cleanAd(ad);
  // Skip if too short after cleaning
  if (cleaned.length < 5) return true;
  // Skip if starts with methodoloji markers
  const metMarkers = ['Öğrencilere,', 'Öğrencilerden', 'profili ve temel', 'beceriler ile', 'yaşantılarının hayata'];
  for (const m of metMarkers) {
    if (cleaned.startsWith(m)) return true;
  }
  return false;
}

// Derive sinif from kod for Temel Matematik
function getSinifFromKod(kod) {
  // MAT.T.11.* or MAT.T.12.* → extract sinif
  const m = kod.match(/MAT\.T\.(\d+)/);
  if (m) return parseInt(m[1]);
  // MAT.11.* → 11
  const m2 = kod.match(/MAT\.(\d+)/);
  if (m2) return parseInt(m2[1]);
  return null;
}

// Extract unite_no from kod
function getUniteNo(kod) {
  // SOS.11.X.Y → X (index 2 in dot-split after removing prefix)
  // TKS.9.X.Y → X (index 1)
  // TK.X.Y → X (index 0)
  // İF.X.Y → X (index 0)
  // DE.X.Y → X (index 0)
  // İBT.X.Y → X (index 0)
  // KK.5.X.Y → X (index 1)
  // MAT.T.11.X.Y → X (index 2 in MAT.T...)
  const parts = kod.split('.');
  if (kod.startsWith('SOS.')) return parseInt(parts[2]) || 1;
  if (kod.startsWith('TKS.')) return parseInt(parts[2]) || 1;
  if (kod.startsWith('MAT.T.')) return parseInt(parts[3]) || 1;
  if (kod.startsWith('MAT.')) return parseInt(parts[2]) || 1;
  if (kod.startsWith('KK.') || kod.startsWith('PH.')) return parseInt(parts[2]) || 1;
  // Default: second segment (after prefix)
  return parseInt(parts[1]) || 1;
}

const sources = [
  {
    file: 'sosyoloji.json',
    bransSlug: 'felsefe',
    okulTipi: 'lise',
    dersTuru: 'secmeli',
    dersAdOverride: null, // use JSON's ders field
  },
  {
    file: 'takımsporları.json',
    bransSlug: 'beden_egitimi',
    okulTipi: 'lise',
    dersTuru: 'secmeli',
    dersAdOverride: null,
  },
  {
    file: 'tsvkltr.json',
    bransSlug: 'ihl_meslek_dersleri',
    okulTipi: 'ihl',
    dersTuru: 'secmeli',
    dersAdOverride: null,
  },
  {
    file: 'islamfelsefesi.json',
    bransSlug: 'ihl_meslek_dersleri',
    okulTipi: 'ihl',
    dersTuru: 'secmeli',
    dersAdOverride: null,
  },
  {
    file: 'içe.json',
    bransSlug: 'ihl_meslek_dersleri',
    okulTipi: 'ihl',
    dersTuru: 'secmeli',
    dersAdOverride: null,
  },
  {
    file: 'dinegitimi.json',
    bransSlug: 'ihl_meslek_dersleri',
    okulTipi: 'ihl',
    dersTuru: 'secmeli',
    dersAdOverride: null,
  },
  {
    file: 'islambilimtarh.json',
    bransSlug: 'ihl_meslek_dersleri',
    okulTipi: 'ihl',
    dersTuru: 'secmeli',
    dersAdOverride: null,
  },
  {
    // Also insert İslam Bilim Tarihi for tarih branşı (lise teachers can select it)
    file: 'islambilimtarh.json',
    bransSlug: 'tarih',
    okulTipi: 'lise',
    dersTuru: 'secmeli',
    dersAdOverride: null,
    kodSuffix: '_TRH', // append to kod to avoid UNIQUE conflict
  },
  {
    file: 'temelmatematik.json',
    bransSlug: 'matematik',
    okulTipi: 'lise',
    dersTuru: 'secmeli',
    dersAdOverride: 'Temel Matematik', // override "Temel Düzey Matematik"
    sinifOverrideFn: getSinifFromKod,
    skipUnitHeaders: true,
    // MAT.11.2.1 etc. might conflict with existing zorunlu matematik kazanımları
    kodSuffix: '_TM',
  },
];

let rows = [];
let stats = [];

for (const src of sources) {
  const entries = readJson(src.file);
  let count = 0;
  let skipped = 0;

  for (const entry of entries) {
    // Skip unit headers in Temel Matematik
    if (src.skipUnitHeaders) {
      // Unit headers: kod like MAT.T.11.1 (3 segments after removing MAT.T.) and ad contains numbers like "3 26 36"
      const parts = entry.kod.split('.');
      // MAT.T.11.1 has 4 parts — it's a unit header (no sub-number)
      // MAT.T.11.1.1 has 5 parts — it's a real kazanım
      if (parts.length <= 4 && entry.kod.startsWith('MAT.T.')) {
        skipped++;
        continue;
      }
    }

    if (isContaminated(entry)) {
      skipped++;
      continue;
    }

    const adClean = cleanAd(entry.ad);
    if (!adClean) { skipped++; continue; }

    let sinif = entry.sinif;
    if (src.sinifOverrideFn) {
      sinif = src.sinifOverrideFn(entry.kod);
    }
    if (!sinif) { skipped++; continue; }

    const dersAd = src.dersAdOverride || entry.ders;
    const kod = entry.kod + (src.kodSuffix || '');
    const uniteNo = getUniteNo(entry.kod);

    rows.push(
      `  ('${esc(kod)}', (SELECT id FROM branslar WHERE slug = '${src.bransSlug}'), ${sinif}, ${uniteNo}, '', '${esc(adClean)}', '${esc(dersAd)}', '${src.okulTipi}', '${src.dersTuru}')`
    );
    count++;
  }

  stats.push({ file: src.file, brans: src.bransSlug, count, skipped });
}

const header = `-- Migration 041: Seçmeli ders kazanımları — extracted/ JSON kaynaklı
-- ${new Date().toISOString().slice(0, 10)}
-- Kaynak dosyalar: sosyoloji, takımsporları, tsvkltr, islamfelsefesi, içe,
--                  dinegitimi, islambilimtarh, temelmatematik
-- Toplam: ${rows.length} kazanım
--
-- Stats:
${stats.map(s => `--   ${s.file} → ${s.brans}: ${s.count} eklendi, ${s.skipped} atlandı`).join('\n')}

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

const outPath = path.join(__dirname, '..', 'supabase', 'migrations', '20260416000041_seed_secmeli_dersler_lise.sql');
fs.writeFileSync(outPath, sql, 'utf8');
console.log(`✅ Migration yazıldı: ${outPath}`);
console.log(`   Toplam: ${rows.length} satır`);
stats.forEach(s => console.log(`   ${s.file} (${s.brans}): +${s.count}, skip ${s.skipped}`));
