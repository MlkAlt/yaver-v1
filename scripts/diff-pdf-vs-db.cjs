// PDF (extracted/) vs DB (Supabase) diff raporu.
// Çıktı: audit-baseline/diff-report-YYYY-MM-DD.md
// Group A: DB'de var, PDF'de yok (hayalet kod)
// Group B: PDF'de var, DB'de yok (eksik kod)
// Group C: Aynı kod, farklı ad/aciklama (metin farkı)
// Group D: Aynı kod, farklı sinif/ders/okul_tipi (metadata farkı)
// Group E: Tam eşleşme

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
const OUT_FILE = path.join(__dirname, '..', 'audit-baseline', `diff-report-${new Date().toISOString().slice(0, 10)}.md`);

function normalize(s) {
  if (!s) return '';
  return s.replace(/\s+/g, ' ').trim().toLowerCase()
    // Tirelemeli karakter normalize
    .replace(/[''']/g, "'")
    .replace(/[""]/g, '"');
}

(async () => {
  // 1. PDF kazanımlarını topla (extracted/*.json)
  const pdfKazanim = new Map();  // kod -> { ad, sinif, ders, brans_slug, pdf, sayfa }
  const files = fs.readdirSync(EXTRACTED_DIR).filter(f => f.endsWith('.json') && !f.startsWith('_'));
  for (const fname of files) {
    const arr = JSON.parse(fs.readFileSync(path.join(EXTRACTED_DIR, fname), 'utf8'));
    for (const k of arr) {
      if (!pdfKazanim.has(k.kod)) {
        pdfKazanim.set(k.kod, k);
      }
      // else: dup across PDFs — keep first (we could collect both for inspection)
    }
  }
  console.log(`PDF'lerden ${pdfKazanim.size} benzersiz kod yakalandı (${files.length} JSON dosyasından).`);

  // 2. DB'den çek
  const dbAll = [];
  let from = 0;
  while (true) {
    const { data, error } = await supabase.from('kazanimlar').select('kod, ad, aciklama, sinif, ders, okul_tipi, brans_id').range(from, from + 999);
    if (error) throw error;
    dbAll.push(...data);
    if (data.length < 1000) break;
    from += 1000;
  }
  const { data: branslar } = await supabase.from('branslar').select('id, slug, ad');
  const bmap = new Map(branslar.map(b => [b.id, b.slug]));
  const dbMap = new Map();
  for (const d of dbAll) {
    dbMap.set(d.kod, { ...d, brans_slug: bmap.get(d.brans_id) });
  }
  console.log(`DB'den ${dbMap.size} kazanım çekildi.`);

  // 3. Diff
  const groupA = [];  // DB'de var, PDF'de yok
  const groupB = [];  // PDF'de var, DB'de yok
  const groupC = [];  // ad farklı
  const groupD = [];  // metadata farklı (sinif/ders/brans)
  let groupE = 0;     // tam eşleşme

  for (const [kod, pdf] of pdfKazanim) {
    const db = dbMap.get(kod);
    if (!db) {
      groupB.push({ kod, pdf });
      continue;
    }
    const adFarkli = normalize(pdf.ad) !== normalize(db.ad);
    const metaFarkli =
      (pdf.sinif !== null && pdf.sinif !== db.sinif) ||
      (pdf.ders && pdf.ders !== db.ders) ||
      (pdf.brans_slug && pdf.brans_slug !== db.brans_slug);

    if (adFarkli) groupC.push({ kod, pdf_ad: pdf.ad, db_ad: db.ad });
    if (metaFarkli) groupD.push({ kod, pdf, db });
    if (!adFarkli && !metaFarkli) groupE++;
  }
  for (const [kod, db] of dbMap) {
    if (!pdfKazanim.has(kod)) {
      groupA.push({ kod, db });
    }
  }

  // 4. Rapor
  const out = [];
  out.push(`# PDF ↔ DB Diff Raporu`);
  out.push(``);
  out.push(`**Tarih:** ${new Date().toISOString().slice(0, 10)}`);
  out.push(`**PDF kazanım sayısı:** ${pdfKazanim.size}`);
  out.push(`**DB kazanım sayısı:** ${dbMap.size}`);
  out.push(``);
  out.push(`## Özet`);
  out.push(``);
  out.push(`| Grup | Açıklama | Sayı |`);
  out.push(`|---|---|---|`);
  out.push(`| A | DB'de var, PDF'de yok (hayalet) | ${groupA.length} |`);
  out.push(`| B | PDF'de var, DB'de yok (eksik) | ${groupB.length} |`);
  out.push(`| C | Ad/açıklama farklı | ${groupC.length} |`);
  out.push(`| D | Metadata farklı (sınıf/ders/branş) | ${groupD.length} |`);
  out.push(`| E | Tam eşleşme | ${groupE} |`);
  out.push(``);

  out.push(`## Group A — DB'de var, PDF'de yok (${groupA.length})`);
  out.push(``);
  out.push(`> Hayalet kod adayları. PDF'de bulunamadı — regex yakalayamamış olabilir veya gerçekten silinmiş kazanım.`);
  out.push(``);
  if (groupA.length === 0) {
    out.push(`(Yok)`);
  } else {
    out.push(`| Kod | Branş | Sınıf | Ders | Ad (DB) |`);
    out.push(`|---|---|---|---|---|`);
    for (const e of groupA.slice(0, 100)) {
      out.push(`| ${e.kod} | ${e.db.brans_slug} | ${e.db.sinif} | ${e.db.ders} | ${(e.db.ad || '').slice(0, 80)} |`);
    }
    if (groupA.length > 100) out.push(`\n_(+${groupA.length - 100} more)_`);
  }
  out.push(``);

  out.push(`## Group B — PDF'de var, DB'de yok (${groupB.length})`);
  out.push(``);
  out.push(`> Yeni seedlenmesi gereken kazanımlar. Phase 4.5 migration adayı.`);
  out.push(``);
  if (groupB.length === 0) {
    out.push(`(Yok)`);
  } else {
    out.push(`| Kod | Branş | Sınıf | Ders | Ad (PDF) | Kaynak PDF |`);
    out.push(`|---|---|---|---|---|---|`);
    for (const e of groupB.slice(0, 200)) {
      out.push(`| ${e.kod} | ${e.pdf.brans_slug} | ${e.pdf.sinif} | ${e.pdf.ders} | ${(e.pdf.ad || '').slice(0, 80)} | ${e.pdf.kaynak_pdf.slice(0, 40)} |`);
    }
    if (groupB.length > 200) out.push(`\n_(+${groupB.length - 200} more)_`);
  }
  out.push(``);

  out.push(`## Group C — Ad farklı (${groupC.length})`);
  out.push(``);
  out.push(`> DB ile PDF aynı kod, ama "ad" farklı. Manuel inceleme: PDF doğru ise UPDATE migration.`);
  out.push(``);
  if (groupC.length === 0) {
    out.push(`(Yok)`);
  } else {
    out.push(`| Kod | PDF ad | DB ad |`);
    out.push(`|---|---|---|`);
    for (const e of groupC.slice(0, 100)) {
      out.push(`| ${e.kod} | ${(e.pdf_ad || '').slice(0, 80)} | ${(e.db_ad || '').slice(0, 80)} |`);
    }
    if (groupC.length > 100) out.push(`\n_(+${groupC.length - 100} more)_`);
  }
  out.push(``);

  out.push(`## Group D — Metadata farklı (${groupD.length})`);
  out.push(``);
  if (groupD.length === 0) {
    out.push(`(Yok)`);
  } else {
    out.push(`| Kod | PDF sınıf/ders/branş | DB sınıf/ders/branş |`);
    out.push(`|---|---|---|`);
    for (const e of groupD.slice(0, 100)) {
      out.push(`| ${e.kod} | ${e.pdf.sinif}/${e.pdf.ders}/${e.pdf.brans_slug} | ${e.db.sinif}/${e.db.ders}/${e.db.brans_slug} |`);
    }
    if (groupD.length > 100) out.push(`\n_(+${groupD.length - 100} more)_`);
  }
  out.push(``);

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, out.join('\n'), 'utf8');

  // Ayrıca tam JSON dump (Phase 4 fix migration üretimi için)
  const jsonOut = OUT_FILE.replace(/\.md$/, '.json');
  fs.writeFileSync(jsonOut, JSON.stringify({ groupA, groupB, groupC, groupD, groupE }, null, 2), 'utf8');

  console.log(`\nRapor: ${OUT_FILE}`);
  console.log(`JSON dump: ${jsonOut}`);
  console.log(`\nÖZET: A=${groupA.length}, B=${groupB.length}, C=${groupC.length}, D=${groupD.length}, E=${groupE}`);
})().catch(e => { console.error(e); process.exit(1); });
