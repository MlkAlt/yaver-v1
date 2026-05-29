// diff-report-*.json'dan SQL fix migration üret.
// Çıktı: supabase/migrations/<timestamp>_mufredat_dogrulama_fix.sql
// Group B: INSERT (eksik kazanımlar — branş ID lookup ile)
// Group C: UPDATE ad (Phase 3 manuel onaylı olanlar — şu an HEPSİNİ yazar, kullanıcı manuel filtreler)
// Group D: UPDATE metadata (sinif/ders) — şimdilik raporlu, otomatik yazılmaz (riskli)
// Group A: silme — KULLANICI ONAYINI GEREKTİRİR, otomatik silme yok

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const env = {};
fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8').split('\n').forEach(l => {
  const [k, ...r] = l.split('=');
  if (k && r.length) env[k.trim()] = r.join('=').trim();
});
const supabase = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

function sqlEscape(s) {
  if (s === null || s === undefined) return 'NULL';
  return `'${String(s).replace(/'/g, "''")}'`;
}

function timestamp() {
  const d = new Date();
  return d.toISOString().replace(/[-:T]/g, '').slice(0, 14);
}

(async () => {
  const diffFile = process.argv[2];
  if (!diffFile) {
    console.error('Kullanım: node build-fix-migration.cjs <diff-report-YYYY-MM-DD.json>');
    process.exit(1);
  }
  const diff = JSON.parse(fs.readFileSync(diffFile, 'utf8'));

  const { data: branslar } = await supabase.from('branslar').select('id, slug');
  const slugToId = new Map(branslar.map(b => [b.slug, b.id]));

  const ts = timestamp();
  const migrationFile = path.join(__dirname, '..', 'supabase', 'migrations', `${ts}_mufredat_dogrulama_fix.sql`);

  const sql = [];
  sql.push(`-- Müfredat doğrulama düzeltme migration'ı`);
  sql.push(`-- Otomatik üretildi: ${new Date().toISOString()}`);
  sql.push(`-- Kaynak: ${path.basename(diffFile)}`);
  sql.push(``);
  sql.push(`BEGIN;`);
  sql.push(``);

  // Group B — eksik kazanımları ekle
  if (diff.groupB && diff.groupB.length > 0) {
    sql.push(`-- ════════════════════════════════════════════════════════════`);
    sql.push(`-- Group B: PDF'de var, DB'de yok (${diff.groupB.length} eksik kazanım)`);
    sql.push(`-- ════════════════════════════════════════════════════════════`);
    sql.push(``);
    for (const e of diff.groupB) {
      const p = e.pdf;
      const bransId = slugToId.get(p.brans_slug);
      if (!bransId) {
        sql.push(`-- SKIP ${e.kod}: branş "${p.brans_slug}" branslar tablosunda yok`);
        continue;
      }
      if (p.sinif === null || p.sinif === undefined) {
        sql.push(`-- SKIP ${e.kod}: sinif belirlenemedi`);
        continue;
      }
      // okul_tipi sınıftan tahmin: 1-4=ilkokul (sinif_ogretmeni hariç), 5-8=ortaokul, 9-12=lise (IHL meslek=ihl)
      let okulTipi = 'ortaokul';
      if (p.sinif <= 4) okulTipi = 'ilkokul';
      else if (p.sinif <= 8) okulTipi = 'ortaokul';
      else okulTipi = 'lise';
      if (p.brans_slug === 'ihl_meslek_dersleri') okulTipi = 'ihl';
      if (p.brans_slug === 'arapca' && p.sinif >= 2 && p.sinif <= 8) okulTipi = 'iho';

      sql.push(`INSERT INTO kazanimlar (kod, brans_id, sinif, ders, okul_tipi, ad)`);
      sql.push(`  VALUES (${sqlEscape(e.kod)}, ${sqlEscape(bransId)}, ${p.sinif}, ${sqlEscape(p.ders)}, ${sqlEscape(okulTipi)}, ${sqlEscape(p.ad || '')})`);
      sql.push(`  ON CONFLICT (kod) DO NOTHING;`);
    }
    sql.push(``);
  }

  // Group C — ad farkı, UPDATE
  if (diff.groupC && diff.groupC.length > 0) {
    sql.push(`-- ════════════════════════════════════════════════════════════`);
    sql.push(`-- Group C: Ad farkı (${diff.groupC.length} kazanım)`);
    sql.push(`-- ⚠ PDF'deki metin DB'yi güncellesin. Manuel inceleme: yanlış değişiklikleri yorum satırına al.`);
    sql.push(`-- ════════════════════════════════════════════════════════════`);
    sql.push(``);
    for (const e of diff.groupC) {
      sql.push(`-- DB'den: ${(e.db_ad || '').slice(0, 80)}`);
      sql.push(`-- PDF'ten: ${(e.pdf_ad || '').slice(0, 80)}`);
      sql.push(`UPDATE kazanimlar SET ad = ${sqlEscape(e.pdf_ad)} WHERE kod = ${sqlEscape(e.kod)};`);
      sql.push(``);
    }
  }

  // Group D — metadata farkı (uyarı, otomatik yazma)
  if (diff.groupD && diff.groupD.length > 0) {
    sql.push(`-- ════════════════════════════════════════════════════════════`);
    sql.push(`-- Group D: Metadata farkı (${diff.groupD.length} kazanım) — RAPOR, OTOMATİK YAZILMADI`);
    sql.push(`-- Aşağıdaki satırları manuel gözden geçir; doğru olanları açığa al.`);
    sql.push(`-- ════════════════════════════════════════════════════════════`);
    sql.push(``);
    for (const e of diff.groupD) {
      sql.push(`-- ${e.kod}: PDF=${e.pdf.sinif}/${e.pdf.ders}/${e.pdf.brans_slug}  ⇄  DB=${e.db.sinif}/${e.db.ders}/${e.db.brans_slug}`);
    }
    sql.push(``);
  }

  // Group A — hayalet kod (raporlu, otomatik silme yok)
  if (diff.groupA && diff.groupA.length > 0) {
    sql.push(`-- ════════════════════════════════════════════════════════════`);
    sql.push(`-- Group A: DB'de var, PDF'de bulunamadı (${diff.groupA.length} kazanım) — SİLME OTOMATİK DEĞİL`);
    sql.push(`-- Bu kodlar PDF'de yakalanamadı. Sebep: regex eksik veya gerçekten silinmiş.`);
    sql.push(`-- Manuel kontrol et: gerçekten silinecekse aşağıdaki DELETE'i aç.`);
    sql.push(`-- ════════════════════════════════════════════════════════════`);
    sql.push(``);
    sql.push(`-- DELETE FROM kazanimlar WHERE kod IN (`);
    for (const e of diff.groupA) {
      sql.push(`--   ${sqlEscape(e.kod)},  -- ${e.db.brans_slug} ${e.db.sinif}: ${(e.db.ad || '').slice(0, 60)}`);
    }
    sql.push(`-- );`);
    sql.push(``);
  }

  sql.push(`COMMIT;`);
  sql.push(``);

  fs.mkdirSync(path.dirname(migrationFile), { recursive: true });
  fs.writeFileSync(migrationFile, sql.join('\n'), 'utf8');

  console.log(`Migration üretildi: ${migrationFile}`);
  console.log(`Group B (INSERT): ${diff.groupB.length}`);
  console.log(`Group C (UPDATE ad): ${diff.groupC.length}`);
  console.log(`Group D (RAPOR): ${diff.groupD.length}`);
  console.log(`Group A (SİLME ASKIDA): ${diff.groupA.length}`);
})().catch(e => { console.error(e); process.exit(1); });
