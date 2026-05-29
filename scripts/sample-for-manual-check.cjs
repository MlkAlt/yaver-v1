// Her branştan rastgele 5 kazanım seçip PDF ↔ DB yan yana göster.
// Çıktı: audit-baseline/manual-check-YYYY-MM-DD.md
// Kullanıcı bunu gözle tarar, ✓/✗/? işaretler.

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const env = {};
fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8').split('\n').forEach(l => {
  const [k, ...r] = l.split('=');
  if (k && r.length) env[k.trim()] = r.join('=').trim();
});
const supabase = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const EXTRACTED_DIR = path.join(__dirname, '..', 'extracted');
const OUT_FILE = path.join(__dirname, '..', 'audit-baseline', `manual-check-${new Date().toISOString().slice(0, 10)}.md`);
const SAMPLES_PER_BRANS = 5;

function pickRandom(arr, n) {
  const copy = [...arr];
  const result = [];
  while (result.length < n && copy.length > 0) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

(async () => {
  // PDF kazanımları (her PDF'ten)
  const pdfKazanim = new Map();
  const files = fs.readdirSync(EXTRACTED_DIR).filter(f => f.endsWith('.json') && !f.startsWith('_'));
  for (const fname of files) {
    const arr = JSON.parse(fs.readFileSync(path.join(EXTRACTED_DIR, fname), 'utf8'));
    for (const k of arr) {
      if (!pdfKazanim.has(k.kod)) pdfKazanim.set(k.kod, k);
    }
  }

  // DB
  const dbAll = [];
  let from = 0;
  while (true) {
    const { data, error } = await supabase.from('kazanimlar').select('kod, ad, aciklama, sinif, ders, brans_id').range(from, from + 999);
    if (error) throw error;
    dbAll.push(...data);
    if (data.length < 1000) break;
    from += 1000;
  }
  const { data: branslar } = await supabase.from('branslar').select('id, slug, ad').order('sira');
  const bmap = new Map(branslar.map(b => [b.id, { slug: b.slug, ad: b.ad }]));

  // Branş bazlı gruplama
  const byBrans = {};
  for (const d of dbAll) {
    const b = bmap.get(d.brans_id);
    if (!b) continue;
    if (!byBrans[b.slug]) byBrans[b.slug] = { ad: b.ad, kazanimlar: [] };
    byBrans[b.slug].kazanimlar.push(d);
  }

  const out = [];
  out.push(`# Manuel Doğrulama Raporu — Örneklem`);
  out.push(``);
  out.push(`**Tarih:** ${new Date().toISOString().slice(0, 10)}`);
  out.push(`**Her branştan:** ${SAMPLES_PER_BRANS} rastgele kazanım`);
  out.push(`**Toplam örnek:** ~${Object.keys(byBrans).length * SAMPLES_PER_BRANS}`);
  out.push(``);
  out.push(`> Her satırda PDF'den çıkarılan metin ile DB'deki metni yan yana gör. Sağdaki "İşaret" kolonuna ✓ (eşleşti), ✗ (uyumsuz), ? (kararsız) yaz.`);
  out.push(``);

  let totalSamples = 0;
  let totalMatches = 0;

  for (const brans of branslar) {
    const grup = byBrans[brans.slug];
    if (!grup || grup.kazanimlar.length === 0) continue;
    const samples = pickRandom(grup.kazanimlar, SAMPLES_PER_BRANS);

    out.push(`## ${brans.ad}`);
    out.push(``);
    out.push(`| Kod | DB ad | PDF ad | Kaynak PDF (sayfa) | İşaret |`);
    out.push(`|---|---|---|---|---|`);

    for (const s of samples) {
      const pdf = pdfKazanim.get(s.kod);
      const pdfText = pdf ? (pdf.ad || '').slice(0, 100) : '(PDF\'de bulunamadı)';
      const dbText = (s.ad || '').slice(0, 100);
      const pdfRef = pdf ? `${pdf.kaynak_pdf.slice(0, 30)}:${pdf.kaynak_sayfa}` : '-';
      totalSamples++;
      // Heuristik ön-işaret (kelime başlangıçları benzer mi)
      let hint = '?';
      if (pdf && pdf.ad && s.ad) {
        const n1 = pdf.ad.toLowerCase().replace(/\s+/g, ' ').trim();
        const n2 = s.ad.toLowerCase().replace(/\s+/g, ' ').trim();
        if (n1.slice(0, 30) === n2.slice(0, 30)) {
          hint = '✓ (auto)';
          totalMatches++;
        }
      }
      out.push(`| ${s.kod} | ${dbText} | ${pdfText} | ${pdfRef} | ${hint} |`);
    }
    out.push(``);
  }

  out.push(`---`);
  out.push(``);
  out.push(`## Otomatik ön-işaret özeti`);
  out.push(``);
  out.push(`- **Toplam örnek:** ${totalSamples}`);
  out.push(`- **Otomatik ✓ (ilk 30 karakter eşleşti):** ${totalMatches}`);
  out.push(`- **Manuel inceleme gereken:** ${totalSamples - totalMatches}`);
  out.push(``);

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, out.join('\n'), 'utf8');

  console.log(`Rapor: ${OUT_FILE}`);
  console.log(`Toplam örnek: ${totalSamples}, otomatik eşleşen: ${totalMatches}`);
})().catch(e => { console.error(e); process.exit(1); });
