const SUPABASE_URL = 'https://oelllamwceazolwpgavq.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lbGxsYW13Y2Vhem9sd3BnYXZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjMzMDU1MCwiZXhwIjoyMDkxOTA2NTUwfQ.rBRrafW73JIw_YWkIiTKj0kDcCcAA-lBtggx0jIfY_0';

async function queryAll(filter) {
  const PAGE = 1000; let offset = 0; const results = [];
  while (true) {
    const url = `${SUPABASE_URL}/rest/v1/kazanimlar?select=ders,okul_tipi,sinif_tipi,program${filter}&limit=${PAGE}&offset=${offset}`;
    const res = await fetch(url, { headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } });
    if (!res.ok) throw new Error(await res.text());
    const page = await res.json();
    if (!Array.isArray(page)) { console.error('Not array:', page); break; }
    results.push(...page);
    if (page.length < PAGE) break;
    offset += PAGE;
  }
  return results;
}

const all = await queryAll('&sinif=eq.0');

const byDers = {};
for (const r of all) {
  const key = `${r.ders} (${r.okul_tipi}) sinif_tipi=${r.sinif_tipi}`;
  byDers[key] = (byDers[key] || 0) + 1;
}

console.log(`sinif=0 toplam: ${all.length}`);
console.log('\nDers bazında:');
for (const [k, c] of Object.entries(byDers).sort()) {
  console.log(`  ${c.toString().padEnd(4)} ${k}`);
}

// Mantık, Çağdaş Türk, İklim sinif=0 var mı?
const check = ['Mantık', 'Çağdaş Türk ve Dünya Tarihi', 'İklim, Çevre ve Yenilikçi Çözümler'];
console.log('');
for (const ders of check) {
  const rows = all.filter(r => r.ders === ders);
  if (rows.length > 0) {
    console.log(`⚠️  ${ders}: hâlâ ${rows.length} sinif=0 kayıt var!`);
  } else {
    console.log(`✅ ${ders}: sinif=0 yok`);
  }
}
