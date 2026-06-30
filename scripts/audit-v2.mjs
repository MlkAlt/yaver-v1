// DB vs JSON audit — v2 schema
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = 'https://oelllamwceazolwpgavq.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lbGxsYW13Y2Vhem9sd3BnYXZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjMzMDU1MCwiZXhwIjoyMDkxOTA2NTUwfQ.rBRrafW73JIw_YWkIiTKj0kDcCcAA-lBtggx0jIfY_0';

async function queryAll(select) {
  const PAGE = 1000;
  let offset = 0;
  const results = [];
  while (true) {
    const url = `${SUPABASE_URL}/rest/v1/kazanimlar?select=${select}&limit=${PAGE}&offset=${offset}`;
    const res = await fetch(url, {
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Prefer': 'count=none',
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    const page = await res.json();
    results.push(...page);
    if (page.length < PAGE) break;
    offset += PAGE;
  }
  return results;
}

// 1) DB toplam
const all = await queryAll('id,brans,ders,sinif,okul_tipi,sinif_tipi');
console.log(`\n=== DB TOPLAM: ${all.length} kazanım ===\n`);

// 2) brans bazında grupla
const byBrans = {};
for (const r of all) {
  const key = r.brans || 'NULL';
  byBrans[key] = (byBrans[key] || 0) + 1;
}
console.log('--- Branş bazında sayımlar ---');
for (const [b, c] of Object.entries(byBrans).sort()) {
  console.log(`  ${b.padEnd(35)} ${c}`);
}

// 3) ders bazında grupla (ders + sinif)
const byDers = {};
for (const r of all) {
  const key = `${r.ders}|${r.okul_tipi}|${r.sinif}`;
  byDers[key] = (byDers[key] || 0) + 1;
}

// 4) sinif=NULL veya problematik kayıtlar
const nullSinif = all.filter(r => r.sinif === null || r.sinif === undefined);
if (nullSinif.length) {
  console.log(`\n⚠️  sinif=NULL olan kayıtlar: ${nullSinif.length}`);
  const sample = nullSinif.slice(0, 5);
  for (const r of sample) console.log(`  ${r.brans} | ${r.ders} | sinif=${r.sinif}`);
}

// 5) JSON dosyalarından sayım
const yeniDersDir = path.join(process.cwd(), 'yeniders');
const jsonFiles = fs.readdirSync(yeniDersDir).filter(f => f.endsWith('.json'));
let jsonTotal = 0;
const jsonByCounts = {};
for (const file of jsonFiles) {
  const data = JSON.parse(fs.readFileSync(path.join(yeniDersDir, file), 'utf8'));
  const items = Array.isArray(data) ? data : (data.kazanimlar || []);
  jsonTotal += items.length;
  jsonByCounts[file] = items.length;
}
console.log(`\n=== JSON TOPLAM: ${jsonTotal} kazanım (${jsonFiles.length} dosya) ===`);

// 6) Fark
console.log(`\n=== FARK: DB(${all.length}) - JSON(${jsonTotal}) = ${all.length - jsonTotal} ===`);

// 7) Sınıf 0 olmayan seçmeli dersler (kontrol)
const secmeli = all.filter(r => r.sinif_tipi === 'secmeli');
const secmeliSinifler = {};
for (const r of secmeli) {
  const key = `${r.ders}|${r.sinif}`;
  secmeliSinifler[key] = (secmeliSinifler[key] || 0) + 1;
}
console.log(`\n--- Seçmeli ders sayımları (sinif_tipi=secmeli, ${secmeli.length} toplam) ---`);
const secmeliByDers = {};
for (const r of secmeli) {
  secmeliByDers[r.ders] = (secmeliByDers[r.ders] || 0) + 1;
}
for (const [d, c] of Object.entries(secmeliByDers).sort()) {
  console.log(`  ${d.padEnd(45)} ${c}`);
}

// 8) sinif dağılımı
const bySinif = {};
for (const r of all) {
  bySinif[r.sinif] = (bySinif[r.sinif] || 0) + 1;
}
console.log('\n--- Sınıf bazında dağılım ---');
for (const [s, c] of Object.entries(bySinif).sort((a,b) => Number(a[0])-Number(b[0]))) {
  console.log(`  sinif=${String(s).padEnd(5)} ${c}`);
}
