// DB'deki tüm kazanım kod prefixlerini (ilk segment) çek — extract script için ground truth
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const env = {};
fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8').split('\n').forEach(l => {
  const [k, ...r] = l.split('=');
  if (k && r.length) env[k.trim()] = r.join('=').trim();
});
const supabase = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

(async () => {
  const all = [];
  let from = 0;
  while (true) {
    const { data, error } = await supabase.from('kazanimlar').select('kod, brans_id, sinif, ders, okul_tipi').range(from, from + 999);
    if (error) throw error;
    all.push(...data);
    if (data.length < 1000) break;
    from += 1000;
  }
  const { data: branslar } = await supabase.from('branslar').select('id, ad, slug');
  const bmap = new Map(branslar.map(b => [b.id, b.slug]));

  const prefixMap = {};
  for (const k of all) {
    const pref = k.kod.split('.')[0];
    if (!prefixMap[pref]) prefixMap[pref] = { count: 0, branslar: new Set(), siniflar: new Set(), dersler: new Set(), sample: [] };
    prefixMap[pref].count++;
    prefixMap[pref].branslar.add(bmap.get(k.brans_id) || '?');
    prefixMap[pref].siniflar.add(k.sinif);
    prefixMap[pref].dersler.add(k.ders);
    if (prefixMap[pref].sample.length < 3) prefixMap[pref].sample.push(k.kod);
  }
  const rows = Object.entries(prefixMap).sort((a, b) => b[1].count - a[1].count);
  for (const [pref, info] of rows) {
    console.log(`${pref.padEnd(10)} ${String(info.count).padStart(5)}  brans=[${[...info.branslar].join(',')}]  sinif=[${[...info.siniflar].sort((a, b) => a - b).join(',')}]  ders=[${[...info.dersler].slice(0, 4).join('|')}]  örn=${info.sample.join(', ')}`);
  }
})().catch(e => { console.error(e); process.exit(1); });
