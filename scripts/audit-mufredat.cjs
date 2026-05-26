// Yaver V1 — Müfredat audit script
// Supabase'den kazanım sayımları çekip kritik bulguları teyit eder.
// Çalıştırma: NODE_TLS_REJECT_UNAUTHORIZED=0 node scripts/audit-mufredat.cjs

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

function loadEnv() {
  const lines = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8').split('\n');
  const env = {};
  for (const line of lines) {
    const [key, ...rest] = line.split('=');
    if (key && rest.length) env[key.trim()] = rest.join('=').trim();
  }
  return env;
}

const env = loadEnv();
const supabase = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  YAVER V1 — MÜFREDAT AUDIT RAPORU');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // 1. Tüm branşlar
  const { data: branslar, error: bErr } = await supabase
    .from('branslar')
    .select('id, ad, slug, kademe, sira')
    .order('sira');
  if (bErr) throw bErr;

  console.log(`### 1. BRANŞ LİSTESİ (${branslar.length} branş)`);
  console.log('─'.repeat(63));
  for (const b of branslar) {
    const kademeStr = Array.isArray(b.kademe) ? b.kademe.join(',') : '?';
    console.log(`  ${String(b.sira).padStart(2)}. ${b.ad.padEnd(35)} slug=${(b.slug ?? '-').padEnd(25)} kademe=[${kademeStr}]`);
  }
  console.log('');

  // Hayat Bilgisi var mı?
  const hayatBilgisi = branslar.find(b => b.ad === 'Hayat Bilgisi' || b.slug === 'hayat_bilgisi');
  console.log(`  → Hayat Bilgisi branşı: ${hayatBilgisi ? 'VAR' : 'YOK (mig 015 ile silindi)'}\n`);

  // 2. Tüm kazanımları çek (paginated)
  console.log('### 2. KAZANIM ÇEKİMİ');
  console.log('─'.repeat(63));
  const allKazanimlar = [];
  const PAGE = 1000;
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from('kazanimlar')
      .select('brans_id, sinif, ders, okul_tipi, kod')
      .range(from, from + PAGE - 1);
    if (error) throw error;
    allKazanimlar.push(...data);
    if (data.length < PAGE) break;
    from += PAGE;
  }
  console.log(`  Toplam kazanım: ${allKazanimlar.length}\n`);

  const bransMap = new Map(branslar.map(b => [b.id, b]));

  // 3. Branş × sınıf sayım matrisi
  console.log('### 3. BRANŞ × SINIF KAZANIM SAYIMI');
  console.log('─'.repeat(63));
  const matrix = {};
  for (const k of allKazanimlar) {
    const b = bransMap.get(k.brans_id);
    const ad = b ? b.ad : `(unknown brans_id=${k.brans_id})`;
    if (!matrix[ad]) matrix[ad] = {};
    matrix[ad][k.sinif] = (matrix[ad][k.sinif] ?? 0) + 1;
  }

  const SINIFLAR = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const header = ' '.repeat(35) + SINIFLAR.map(s => String(s).padStart(5)).join('') + '  TOPLAM';
  console.log(header);
  console.log('  ' + '─'.repeat(header.length - 2));

  const eksikler = [];
  for (const b of branslar) {
    const m = matrix[b.ad] ?? {};
    const row = SINIFLAR.map(s => {
      const c = m[s] ?? 0;
      return c === 0 ? '   . ' : String(c).padStart(5);
    }).join('');
    const total = Object.values(m).reduce((a, b) => a + b, 0);
    console.log(`  ${b.ad.padEnd(33)}${row}  ${String(total).padStart(5)}`);

    // Beklenen sınıflara göre eksik tespit
    const kademe = Array.isArray(b.kademe) ? b.kademe : [];
    const beklenen = new Set();
    if (kademe.includes('ilkokul')) [1, 2, 3, 4].forEach(s => beklenen.add(s));
    if (kademe.includes('ortaokul')) [5, 6, 7, 8].forEach(s => beklenen.add(s));
    if (kademe.includes('iho')) [5, 6, 7, 8].forEach(s => beklenen.add(s));
    if (kademe.includes('lise')) [9, 10, 11, 12].forEach(s => beklenen.add(s));
    if (kademe.includes('ihl')) [9, 10, 11, 12].forEach(s => beklenen.add(s));

    const eksikSiniflar = [...beklenen].filter(s => !(m[s] > 0)).sort((a, b) => a - b);
    if (eksikSiniflar.length > 0) {
      eksikler.push({ brans: b.ad, eksik: eksikSiniflar, beklenen: [...beklenen].sort((a, b) => a - b) });
    }
  }
  console.log('');

  // 4. Eksiklik özeti
  console.log('### 4. EKSİK SINIF TESPİTİ (kademe vs kazanım)');
  console.log('─'.repeat(63));
  if (eksikler.length === 0) {
    console.log('  Hiçbir branşta eksik sınıf yok.\n');
  } else {
    for (const e of eksikler) {
      console.log(`  ✗ ${e.brans.padEnd(33)} beklenen=[${e.beklenen.join(',')}]  eksik=[${e.eksik.join(',')}]`);
    }
    console.log('');
  }

  // 5. Tarih branşı 12. sınıf ders adı kontrolü
  console.log('### 5. TARİH BRANŞI — 12. SINIF DERS ADI');
  console.log('─'.repeat(63));
  const tarih = branslar.find(b => b.slug === 'tarih');
  if (tarih) {
    const tarih12 = allKazanimlar.filter(k => k.brans_id === tarih.id && k.sinif === 12);
    const dersDagilim = {};
    for (const k of tarih12) dersDagilim[k.ders ?? '(NULL)'] = (dersDagilim[k.ders ?? '(NULL)'] ?? 0) + 1;
    console.log(`  Tarih branşı 12. sınıf kazanımları (toplam ${tarih12.length}):`);
    for (const [ders, count] of Object.entries(dersDagilim)) {
      console.log(`    ders="${ders}"  →  ${count} kazanım`);
    }
  }
  console.log('');

  // 6. Sosyal Bilgiler 8. sınıf
  console.log('### 6. SOSYAL BİLGİLER BRANŞI — 8. SINIF DERS ADI');
  console.log('─'.repeat(63));
  const sosyal = branslar.find(b => b.slug === 'sosyal_bilgiler');
  if (sosyal) {
    const sosyal8 = allKazanimlar.filter(k => k.brans_id === sosyal.id && k.sinif === 8);
    const dersDagilim = {};
    for (const k of sosyal8) dersDagilim[k.ders ?? '(NULL)'] = (dersDagilim[k.ders ?? '(NULL)'] ?? 0) + 1;
    console.log(`  Sosyal Bilgiler branşı 8. sınıf kazanımları (toplam ${sosyal8.length}):`);
    for (const [ders, count] of Object.entries(dersDagilim)) {
      console.log(`    ders="${ders}"  →  ${count} kazanım`);
    }
  }
  console.log('');

  // 7. İHL Meslek Dersleri — sinif × ders dağılımı
  console.log('### 7. İHL MESLEK DERSLERİ — SINIF × DERS DAĞILIMI');
  console.log('─'.repeat(63));
  const ihl = branslar.find(b => b.slug === 'ihl_meslek_dersleri');
  if (ihl) {
    const ihlK = allKazanimlar.filter(k => k.brans_id === ihl.id);
    console.log(`  Toplam İHL meslek dersleri kazanımı: ${ihlK.length}\n`);
    const sinifDersMatrix = {};
    for (const k of ihlK) {
      const ders = k.ders ?? '(NULL)';
      if (!sinifDersMatrix[ders]) sinifDersMatrix[ders] = {};
      sinifDersMatrix[ders][k.sinif] = (sinifDersMatrix[ders][k.sinif] ?? 0) + 1;
    }
    for (const [ders, sinifMap] of Object.entries(sinifDersMatrix).sort()) {
      const dist = Object.entries(sinifMap).sort((a, b) => +a[0] - +b[0])
        .map(([s, c]) => `${s}:${c}`).join('  ');
      console.log(`    ${ders.padEnd(35)} → ${dist}`);
    }
  } else {
    console.log('  İHL Meslek Dersleri branşı bulunamadı!');
  }
  console.log('');

  // 8. okul_tipi dağılımı
  console.log('### 8. OKUL_TİPİ DAĞILIMI');
  console.log('─'.repeat(63));
  const okulTipiDagilim = {};
  for (const k of allKazanimlar) {
    okulTipiDagilim[k.okul_tipi ?? '(NULL)'] = (okulTipiDagilim[k.okul_tipi ?? '(NULL)'] ?? 0) + 1;
  }
  for (const [t, c] of Object.entries(okulTipiDagilim).sort((a, b) => b[1] - a[1])) {
    console.log(`    ${t.padEnd(15)} ${c}`);
  }
  console.log('');

  // 9. ders kolonu NULL var mı?
  const dersNull = allKazanimlar.filter(k => !k.ders).length;
  console.log(`### 9. DERS KOLONU NULL OLAN KAZANIM SAYISI: ${dersNull}\n`);

  // 10. Sınıf Öğretmenliği için ders bazlı sayım (önemli!)
  console.log('### 10. SINIF ÖĞRETMENLİĞİ İÇİN İLKOKUL DERSLERİ');
  console.log('─'.repeat(63));
  const ilkokulKazanimlar = allKazanimlar.filter(k => k.okul_tipi === 'ilkokul');
  const ilkokulDersMatrix = {};
  for (const k of ilkokulKazanimlar) {
    const ders = k.ders ?? '(NULL)';
    if (!ilkokulDersMatrix[ders]) ilkokulDersMatrix[ders] = {};
    ilkokulDersMatrix[ders][k.sinif] = (ilkokulDersMatrix[ders][k.sinif] ?? 0) + 1;
  }
  console.log(`  Toplam ilkokul kazanımı: ${ilkokulKazanimlar.length}\n`);
  for (const [ders, sinifMap] of Object.entries(ilkokulDersMatrix).sort()) {
    const dist = [1, 2, 3, 4].map(s => `${s}:${sinifMap[s] ?? 0}`).join('  ');
    console.log(`    ${ders.padEnd(35)} → ${dist}`);
  }
  console.log('');

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  AUDIT TAMAMLANDI');
  console.log('═══════════════════════════════════════════════════════════════');
}

main().catch(err => {
  console.error('HATA:', err);
  process.exit(1);
});
