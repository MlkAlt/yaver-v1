// Almanca lise + Fransızca lise JSON düzeltme
// Sorunlar: encoding bozuk, sinif=0, sinif_tipi=secmeli, program=''
import fs from 'fs';
import path from 'path';

const LEVEL_TO_SINIF = { A1: 9, A2: 10, B1: 11, B2: 12 };

function fixEncoding(str) {
  if (!str) return str;
  try {
    return Buffer.from(str, 'latin1').toString('utf8');
  } catch {
    return str;
  }
}

function fixRecord(r, bransSlug, dersAd) {
  // sinif → CEFR seviyesinden belirle
  let sinif = r.sinif;
  const levelMatch = r.kod?.match(/\.(A1|A2|B1|B2)\./);
  if (levelMatch && LEVEL_TO_SINIF[levelMatch[1]]) {
    sinif = LEVEL_TO_SINIF[levelMatch[1]];
  }

  return {
    kod: r.kod,
    ad: fixEncoding(r.ad),
    sinif,
    sinif_tipi: 'normal',
    unite: fixEncoding(r.unite),
    aciklama: r.aciklama ? fixEncoding(r.aciklama) : null,
    brans: bransSlug,
    ders: dersAd,
    okul_tipi: 'lise',
    program: null,
    yas_bandi: r.yas_bandi || null,
    branslar: r.branslar || null,
    secmeli: false,
    iki_saat_kapsaminda: r.iki_saat_kapsaminda || false,
    sinif_ogretmeni_gorunur: false,
  };
}

const dir = path.join(process.cwd(), 'yeniders');

// --- Almanca lise ---
const alRaw = JSON.parse(fs.readFileSync(path.join(dir, 'almanca_lise_v2.json'), 'utf8'));
const alFixed = alRaw.map(r => fixRecord(r, 'almanca', 'Almanca'));

// Doğrulama
const alBySinif = {};
for (const r of alFixed) alBySinif[r.sinif] = (alBySinif[r.sinif] || 0) + 1;
console.log('Almanca lise (fixed):');
for (const [s, c] of Object.entries(alBySinif).sort()) console.log(`  sinif=${s}: ${c}`);
console.log(`  Örnek ad: "${alFixed[0].ad}"`);
console.log(`  Örnek unite: "${alFixed[0].unite}"`);

fs.writeFileSync(path.join(dir, 'almanca_lise_v2.json'), JSON.stringify(alFixed, null, 2), 'utf8');
console.log(`  ✅ Kaydedildi (${alFixed.length} kayıt)\n`);

// --- Fransızca lise ---
const frRaw = JSON.parse(fs.readFileSync(path.join(dir, 'fransizca_lise_v2.json'), 'utf8'));

// Fransızca kod formatını kontrol et
const frLevelMatch = frRaw[0]?.kod?.match(/\.(A1|A2|B1|B2)\./);
console.log(`Fransızca örnek kod: ${frRaw[0]?.kod} → level match: ${frLevelMatch?.[1]}`);

const frFixed = frRaw.map(r => fixRecord(r, 'fransizca', 'Fransızca'));

const frBySinif = {};
for (const r of frFixed) frBySinif[r.sinif] = (frBySinif[r.sinif] || 0) + 1;
console.log('Fransızca lise (fixed):');
for (const [s, c] of Object.entries(frBySinif).sort()) console.log(`  sinif=${s}: ${c}`);
console.log(`  Örnek ders: "${frFixed[0].ders}"`);
console.log(`  Örnek ad: "${frFixed[0].ad}"`);

fs.writeFileSync(path.join(dir, 'fransizca_lise_v2.json'), JSON.stringify(frFixed, null, 2), 'utf8');
console.log(`  ✅ Kaydedildi (${frFixed.length} kayıt)`);
