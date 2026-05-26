// Yaver V1 — Eksik kazanımları Supabase'e ekle (insert-only, destructive değil)
// SQL dosyasından satırları parse eder ve batch insert eder.
// 9 alanlı format: (kod, brans_ad, sinif, unite_no, unite_ad, ad, aciklama, ders, okul_tipi)
// Kullanım: NODE_TLS_REJECT_UNAUTHORIZED=0 node scripts/apply-eksik-seed.cjs <sql_dosyasi>

'use strict';
const fs   = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  const env = {};
  for (const line of lines) {
    const eq = line.indexOf('=');
    if (eq < 0) continue;
    env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
  }
  return env;
}

const env = loadEnv();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const SQL_FILE = process.argv[2];
if (!SQL_FILE) {
  console.error('Kullanım: node scripts/apply-eksik-seed.cjs <sql_dosyasi>');
  process.exit(1);
}

function parseSqlRows(sqlContent) {
  const rows = [];
  const valuesStart = sqlContent.indexOf('FROM (VALUES');
  const valuesEnd   = sqlContent.indexOf(') AS v(');
  if (valuesStart < 0 || valuesEnd < 0) throw new Error('VALUES bloğu bulunamadı');

  const block = sqlContent.slice(valuesStart + 12, valuesEnd);

  // 9 alanlı tuple: ('str', 'str', num, num, 'str', 'str', 'str', 'str', 'str')
  const re = /\(\s*'((?:[^']|'')*)',\s*'((?:[^']|'')*)',\s*(\d+),\s*(\d+),\s*'((?:[^']|'')*)',\s*'((?:[^']|'')*)',\s*'((?:[^']|'')*)',\s*'((?:[^']|'')*)',\s*'((?:[^']|'')*)'\s*\)/g;

  let m;
  while ((m = re.exec(block)) !== null) {
    rows.push({
      kod:       m[1].replace(/''/g, "'"),
      brans_ad:  m[2].replace(/''/g, "'"),
      sinif:     parseInt(m[3], 10),
      unite_no:  parseInt(m[4], 10),
      unite_ad:  m[5].replace(/''/g, "'"),
      ad:        m[6].replace(/''/g, "'"),
      aciklama:  m[7].replace(/''/g, "'"),
      ders:      m[8].replace(/''/g, "'"),
      okul_tipi: m[9].replace(/''/g, "'"),
    });
  }
  return rows;
}

async function run() {
  console.log(`📖 ${path.basename(SQL_FILE)} okunuyor...`);
  const sql = fs.readFileSync(SQL_FILE, 'utf8');
  const parsed = parseSqlRows(sql);
  console.log(`   ${parsed.length} satır parse edildi`);

  if (parsed.length === 0) {
    console.error('❌ Hiç satır ayrıştırılamadı');
    process.exit(1);
  }

  const { data: branslar, error: bErr } = await supabase.from('branslar').select('id, ad');
  if (bErr) throw new Error('Branşlar alınamadı: ' + bErr.message);
  const bransMap = Object.fromEntries(branslar.map(b => [b.ad, b.id]));

  const insertRows = [];
  const bilinmeyen = new Set();
  for (const r of parsed) {
    const bid = bransMap[r.brans_ad];
    if (!bid) { bilinmeyen.add(r.brans_ad); continue; }
    insertRows.push({
      kod: r.kod, brans_id: bid, sinif: r.sinif, unite_no: r.unite_no,
      unite_ad: r.unite_ad, ad: r.ad, aciklama: r.aciklama,
      ders: r.ders, okul_tipi: r.okul_tipi,
    });
  }
  if (bilinmeyen.size > 0) {
    console.warn('⚠  Bilinmeyen branşlar atlandı:', [...bilinmeyen].join(', '));
  }

  console.log(`📤 ${insertRows.length} kazanım insert ediliyor (upsert, conflict on kod)...`);

  const BATCH = 200;
  let ok = 0, hata = 0;
  for (let i = 0; i < insertRows.length; i += BATCH) {
    const chunk = insertRows.slice(i, i + BATCH);
    // upsert ile mevcut kodu olan kayıtları atla
    const { error } = await supabase
      .from('kazanimlar')
      .upsert(chunk, { onConflict: 'kod', ignoreDuplicates: true });
    if (error) {
      console.error(`   ❌ batch ${i}: ${error.message}`);
      hata += chunk.length;
    } else {
      ok += chunk.length;
      const pct = Math.round((i + chunk.length) / insertRows.length * 100);
      process.stdout.write(`   [${pct}%] ${ok}/${insertRows.length}\r`);
    }
  }
  console.log(`\n✅ Tamamlandı: ${ok} ok, ${hata} hata`);

  // Doğrulama: tabloda toplam kazanım
  const { count } = await supabase.from('kazanimlar').select('*', { count: 'exact', head: true });
  console.log(`   DB'de toplam kazanım: ${count}`);
}

run().catch(err => { console.error('Hata:', err.message); process.exit(1); });
