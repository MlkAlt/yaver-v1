// 6 branş × sınıf kombinasyonu için planUret çıktısını dump et.
// Çıktı: audit-baseline/manual-plan-review.md + audit-baseline/plan-samples.json
// planUret.ts mantığının Node kopyası.

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const env = {};
fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8').split('\n').forEach(l => {
  const [k, ...r] = l.split('=');
  if (k && r.length) env[k.trim()] = r.join('=').trim();
});
const supabase = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const SAMPLES = [
  { label: 'Matematik / 5. sınıf',                brans_slug: 'matematik',           siniflar: [5],           okulTipi: 'ortaokul' },
  { label: 'Fizik / 9. sınıf',                    brans_slug: 'fizik',               siniflar: [9],           okulTipi: 'lise' },
  { label: 'Sınıf Öğretmenliği / 3. sınıf',       brans_slug: 'sinif_ogretmeni',     siniflar: [3],           okulTipi: 'ilkokul', seciliDersler: ['Türkçe', 'Matematik', 'Hayat Bilgisi', 'Görsel Sanatlar', 'Müzik', 'Beden Eğitimi ve Oyun'] },
  { label: 'İHL / 11. sınıf (Fıkıh+Hadis+Siyer)', brans_slug: 'ihl_meslek_dersleri', siniflar: [11],          okulTipi: 'ihl' },
  { label: 'Türkçe / 6. sınıf',                   brans_slug: 'turkce',              siniflar: [6],           okulTipi: 'ortaokul' },
  { label: 'Coğrafya / 10. sınıf',                brans_slug: 'cografya',            siniflar: [10],          okulTipi: 'lise' },
];

async function planUret(bransId, siniflar, okulTipi, seciliDersler) {
  let q = supabase.from('kazanimlar')
    .select('kod, ad, unite_no, unite_ad, sinif, ders')
    .in('sinif', siniflar).order('sinif').order('unite_no').order('kod');

  if (seciliDersler && seciliDersler.length > 0) {
    q = q.in('ders', seciliDersler);
  } else {
    q = q.eq('brans_id', bransId);
  }
  if (okulTipi) q = q.eq('okul_tipi', okulTipi);
  const { data, error } = await q;
  if (error) throw error;
  let tumKazanimlar = data || [];

  if (seciliDersler && seciliDersler.length > 1) {
    const ingBySinif = new Map();
    tumKazanimlar = tumKazanimlar.filter(k => {
      if (k.ders !== 'İngilizce') return true;
      const c = ingBySinif.get(k.sinif) ?? 0;
      if (c >= 20) return false;
      ingBySinif.set(k.sinif, c + 1);
      return true;
    });
  }

  const { data: takvim } = await supabase.from('egitim_takvimi')
    .select('hafta_no, baslangic, bitis, tatil_mi, tatil_adi')
    .eq('yil', 2025).order('hafta_no');
  const tumHaftalar = takvim || [];
  const aktifHafta = tumHaftalar.filter(h => !h.tatil_mi).length || 1;

  const byGroup = new Map();
  for (const k of tumKazanimlar) {
    const key = `${k.sinif}:${k.ders ?? ''}`;
    if (!byGroup.has(key)) byGroup.set(key, []);
    byGroup.get(key).push(k);
  }

  let aktifIdx = 0;
  const haftalar = tumHaftalar.map(h => {
    if (h.tatil_mi) return { ...h, kazanimlar: [] };
    const i = aktifIdx++;
    const out = [];
    for (const items of byGroup.values()) {
      const N = items.length;
      const start = Math.floor(i * N / aktifHafta);
      const end = Math.min(Math.floor((i + 1) * N / aktifHafta), N);
      if (end > start) out.push(...items.slice(start, end));
      else if (N > 0) out.push(items[Math.min(start, N - 1)]);
    }
    return { ...h, kazanimlar: out };
  });

  return { toplam_kazanim: tumKazanimlar.length, haftalar };
}

(async () => {
  const { data: branslar } = await supabase.from('branslar').select('id, slug, ad');
  const bmap = new Map(branslar.map(b => [b.slug, b]));

  const out = [];
  out.push(`# Yıllık Plan Dağıtım Örnek Raporu`);
  out.push(``);
  out.push(`**Tarih:** ${new Date().toISOString().slice(0, 10)}`);
  out.push(`**Algoritma:** planUret.ts orantılı dağıtım (N kazanım / aktif hafta)`);
  out.push(``);

  const allSamples = [];
  for (const s of SAMPLES) {
    const b = bmap.get(s.brans_slug);
    if (!b) { out.push(`\n## ⚠ ${s.label} — branş bulunamadı (${s.brans_slug})`); continue; }
    const plan = await planUret(b.id, s.siniflar, s.okulTipi, s.seciliDersler);

    out.push(`## ${s.label}`);
    out.push(``);
    out.push(`**Toplam kazanım:** ${plan.toplam_kazanim}`);
    out.push(`**Aktif hafta:** ${plan.haftalar.filter(h => !h.tatil_mi).length} (toplam ${plan.haftalar.length})`);
    out.push(``);
    out.push(`| Hafta | Tarih | Tatil | Kazanım | Kodlar |`);
    out.push(`|---|---|---|---|---|`);
    for (const h of plan.haftalar) {
      const tatil = h.tatil_mi ? `🔴 ${h.tatil_adi}` : '';
      const kodlar = h.kazanimlar.map(k => k.kod).join(', ').slice(0, 100);
      out.push(`| ${h.hafta_no} | ${h.baslangic}→${h.bitis} | ${tatil} | ${h.kazanimlar.length} | ${kodlar} |`);
    }
    out.push(``);
    allSamples.push({ label: s.label, plan });
  }

  const outFile = path.join(__dirname, '..', 'audit-baseline', 'manual-plan-review.md');
  const jsonFile = path.join(__dirname, '..', 'audit-baseline', 'plan-samples.json');
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, out.join('\n'), 'utf8');
  fs.writeFileSync(jsonFile, JSON.stringify(allSamples, null, 2), 'utf8');

  console.log(`Rapor: ${outFile}`);
  console.log(`JSON: ${jsonFile}`);
})().catch(e => { console.error(e); process.exit(1); });
