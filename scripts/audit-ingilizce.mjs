// İngilizce lise detay analizi
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = 'https://oelllamwceazolwpgavq.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lbGxsYW13Y2Vhem9sd3BnYXZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjMzMDU1MCwiZXhwIjoyMDkxOTA2NTUwfQ.rBRrafW73JIw_YWkIiTKj0kDcCcAA-lBtggx0jIfY_0';

async function queryAll(select, filter = '') {
  const PAGE = 1000;
  let offset = 0;
  const results = [];
  while (true) {
    const url = `${SUPABASE_URL}/rest/v1/kazanimlar?select=${select}${filter}&limit=${PAGE}&offset=${offset}`;
    const res = await fetch(url, {
      headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    const page = await res.json();
    results.push(...page);
    if (page.length < PAGE) break;
    offset += PAGE;
  }
  return results;
}

// DB'deki İngilizce lise kayıtları
const db = await queryAll('id,ders,sinif,okul_tipi,program,sinif_tipi', '&ders=eq.%C4%B0ngilizce&okul_tipi=eq.lise');
console.log(`\nDB İngilizce (lise): ${db.length} kayıt`);

// sinif bazında
const bySinif = {};
for (const r of db) {
  bySinif[r.sinif] = (bySinif[r.sinif] || 0) + 1;
}
console.log('Sınıf dağılımı:');
for (const [s, c] of Object.entries(bySinif).sort((a,b) => Number(a[0])-Number(b[0]))) {
  console.log(`  sinif=${s}: ${c}`);
}

// program bazında
const byProgram = {};
for (const r of db) {
  byProgram[r.program || 'NULL'] = (byProgram[r.program || 'NULL'] || 0) + 1;
}
console.log('\nProgram dağılımı:');
for (const [p, c] of Object.entries(byProgram).sort()) {
  console.log(`  ${p}: ${c}`);
}

// JSON dosyaları
const yeniDersDir = path.join(process.cwd(), 'yeniders');
const ingFiles = fs.readdirSync(yeniDersDir).filter(f => f.includes('ingilizce') && f.endsWith('.json'));
console.log(`\nİngilizce JSON dosyaları (${ingFiles.length}):`);

for (const file of ingFiles) {
  const raw = JSON.parse(fs.readFileSync(path.join(yeniDersDir, file), 'utf8'));
  const items = Array.isArray(raw) ? raw : (raw.kazanimlar || []);
  const sinifler = {};
  const programlar = {};
  for (const item of items) {
    sinifler[item.sinif] = (sinifler[item.sinif] || 0) + 1;
    programlar[item.program || 'NULL'] = (programlar[item.program || 'NULL'] || 0) + 1;
  }
  console.log(`\n  ${file}: ${items.length} kayıt`);
  console.log(`    Sınıflar: ${Object.entries(sinifler).sort((a,b)=>Number(a[0])-Number(b[0])).map(([s,c])=>`${s}:${c}`).join(', ')}`);
  console.log(`    Programlar: ${Object.entries(programlar).map(([p,c])=>`${p}:${c}`).join(', ')}`);
}
