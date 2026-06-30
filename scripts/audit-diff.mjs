// Detaylı fark analizi: JSON dosyaları vs DB
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

const all = await queryAll('brans,ders,sinif,okul_tipi');

// DB: ders|okul_tipi|sinif → count
const dbMap = {};
for (const r of all) {
  const key = `${r.ders}||${r.okul_tipi}||${r.sinif}`;
  dbMap[key] = (dbMap[key] || 0) + 1;
}

// DB: ders|okul_tipi → total
const dbByDers = {};
for (const r of all) {
  const key = `${r.ders}||${r.okul_tipi}`;
  dbByDers[key] = (dbByDers[key] || 0) + 1;
}

// JSON dosyalarını parse et
const yeniDersDir = path.join(process.cwd(), 'yeniders');
const jsonFiles = fs.readdirSync(yeniDersDir).filter(f => f.endsWith('.json'));

const jsonByDers = {};  // ders|okul_tipi → count
const jsonItems = [];

for (const file of jsonFiles) {
  const raw = JSON.parse(fs.readFileSync(path.join(yeniDersDir, file), 'utf8'));
  const items = Array.isArray(raw) ? raw : (raw.kazanimlar || []);
  jsonItems.push(...items.map(i => ({ ...i, _file: file })));
  for (const item of items) {
    const key = `${item.ders}||${item.okul_tipi}`;
    jsonByDers[key] = (jsonByDers[key] || 0) + 1;
  }
}

// Tüm ders|okul_tipi anahtarlarını birleştir
const allKeys = new Set([...Object.keys(dbByDers), ...Object.keys(jsonByDers)]);

console.log('\n=== DERS BAZLI KARŞILAŞTIRMA ===');
console.log('Durum   JSON  DB    Fark  Ders || okul_tipi');
console.log('------  ----  ----  ----  -------------------');

const problems = [];
for (const key of [...allKeys].sort()) {
  const j = jsonByDers[key] || 0;
  const d = dbByDers[key] || 0;
  const diff = d - j;
  const status = diff === 0 ? '✅' : diff > 0 ? '⬆️ FAZLA' : '❌ EKSİK';
  const [ders, okul] = key.split('||');
  const line = `${status.padEnd(8)} ${String(j).padEnd(5)} ${String(d).padEnd(5)} ${String(diff).padEnd(5)} ${ders} (${okul})`;
  console.log(line);
  if (diff !== 0) problems.push({ key, j, d, diff });
}

console.log('\n=== ÖZET ===');
console.log(`JSON toplam: ${jsonItems.length}`);
console.log(`DB toplam:   ${all.length}`);
console.log(`Fark:        ${all.length - jsonItems.length}`);
console.log(`\nSorunlu ders sayısı: ${problems.length}`);

if (problems.length > 0) {
  const eksik = problems.filter(p => p.diff < 0);
  const fazla = problems.filter(p => p.diff > 0);
  if (eksik.length) {
    console.log(`\nEKSİK (DB < JSON): ${eksik.length} ders`);
    console.log(`Toplam eksik kayıt: ${eksik.reduce((s, p) => s + Math.abs(p.diff), 0)}`);
  }
  if (fazla.length) {
    console.log(`\nFAZLA (DB > JSON): ${fazla.length} ders`);
    console.log(`Toplam fazla kayıt: ${fazla.reduce((s, p) => s + p.diff, 0)}`);
  }
}
