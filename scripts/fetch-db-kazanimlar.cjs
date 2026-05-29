// Karşılaştırılacak branşların kazanımlarını DB'den çekip JSON'a yaz
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const SLUGS = [
  'kimya', 'fizik', 'biyoloji', 'tarih',
  'gorsel_sanatlar', 'muzik', 'hayat_bilgisi',
  'bilisim_teknolojileri', 'teknoloji_tasarim',
  'sosyal_bilgiler', 'matematik', 'beden_egitimi',
];

async function fetchBrans(slug) {
  const { data: b } = await sb.from('branslar').select('id').eq('slug', slug).single();
  if (!b) return [];
  let all = [];
  let from = 0;
  while (true) {
    const { data } = await sb.from('kazanimlar')
      .select('kod,sinif,ad')
      .eq('brans_id', b.id)
      .range(from, from + 999);
    if (!data || data.length === 0) break;
    all = all.concat(data);
    if (data.length < 1000) break;
    from += 1000;
  }
  return all;
}

async function main() {
  const result = {};
  for (const slug of SLUGS) {
    process.stdout.write(`Fetching ${slug}...`);
    const rows = await fetchBrans(slug);
    result[slug] = rows;
    console.log(` ${rows.length} kazanim`);
  }
  fs.writeFileSync(
    'refs/mufredat-2025/db_kazanimlar.json',
    JSON.stringify(result, null, 2),
    'utf-8'
  );
  console.log('Kaydedildi: refs/mufredat-2025/db_kazanimlar.json');
}
main().catch(e => { console.error('HATA:', e.message); process.exit(1); });
