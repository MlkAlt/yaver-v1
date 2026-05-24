// Yaver V1 — Eksik Kazanımlar Seed Generator
// Generate-meb-kazanimlar.cjs'in atladığı branşları işler:
// 1. İHL Meslek Dersleri (14 JSON dosyası)
// 2. Din Kültürü ortaokul seçmeli (Kur'an-ı Kerim, Peygamberimizin Hayatı — ortaokul)
// Çıktı: supabase/migrations/20260416000025_seed_eksik_branslar.sql

'use strict';
const fs   = require('fs');
const path = require('path');

const SEED_DIR   = path.join(__dirname, '../supabase/seed-data/kazanimlar');
const OUTPUT_SQL = path.join(__dirname, '../supabase/migrations/20260416000025_seed_ihl_meslek_dersleri.sql');

// ─── Yardımcı fonksiyonlar (generate-meb-kazanimlar.cjs'den) ─────────────────

function escape(str) {
  if (!str) return '';
  return String(str)
    .replace(/'/g, "''")
    .replace(/\n/g, ' ')
    .replace(/\r/g, '')
    .trim();
}

function kodDerinlik(kod) {
  return kod.replace(/\.$/, '').split('.').length;
}

function uniteNoKodan(kod) {
  const parts = kod.replace(/\.$/, '').split('.');
  const n = parseInt(parts[2], 10);
  if (!isNaN(n) && n >= 1 && n <= 30) return n;
  return 1;
}

function buildUniteAdHaritasi(kazanimlar) {
  const map = {};
  for (const k of kazanimlar) {
    if (!k.kod || !k.kazanim) continue;
    const d = kodDerinlik(k.kod);
    if (d !== 3) continue;
    const len = k.kazanim.length;
    if (len < 2 || len > 80) continue;
    if (/^\d/.test(k.kazanim)) continue;
    const parts = k.kod.replace(/\.$/, '').split('.');
    const no = parseInt(parts[2], 10);
    if (!isNaN(no) && no >= 1 && no <= 30 && !map[no]) {
      map[no] = k.kazanim.trim();
    }
  }
  return map;
}

function gecerliKazanim(k) {
  if (!k.kazanim || !k.kod) return false;
  const d = kodDerinlik(k.kod);
  const len = k.kazanim.length;
  const altLen = Array.isArray(k.alt_kazanimlar) ? k.alt_kazanimlar.length : -1;

  if (len < 10 || len > 400) return false;
  if (/^\d+\s/.test(k.kazanim)) return false;
  if (/^\s*\/\s*T\.\w/.test(k.kazanim) || k.kazanim.startsWith('/ ')) return false;
  if (/^T\.[A-Z]\.\d+\.\d+\./.test(k.kazanim)) return false;
  if (k.kod.includes('.H.')) return false;

  if (altLen > 0) {
    if (d < 3) return false;
    return true;
  }
  if (altLen === 0) {
    if (d < 4) return false;
    return true;
  }
  if (d >= 4 && len < 200) return true;
  return false;
}

// ─── Branş → Kaynak dosya + Ders adı eşleştirmesi ────────────────────────────
// Her satır: bir JSON dosyası, hangi branşa, hangi ders adıyla, hangi sınıflar için, hangi okul_tipi

// V1 kararı: yalnızca sinif alanı DOĞRU girilmiş dosyalar seed edilir.
// Yanlış sinif alanı (1-6 ama gerçek 9-12) olan dosyalar V1.5'te düzeltilecek:
//   Dini Musiki, Ebru, Hüsnühat, Tezhip, İslam Felsefesi, İslam'da Çocuk Eğitimi,
//   Tasavvuf Kültürü, Din Eğitimi — bu dosyalardaki sinif değerleri MEB müfredatına uymuyor.
// Kur'an-ı Kerim 5-8 → DKAB ortaokul seçmeli için (ayrı mig'de).
const KAYNAK = [
  { brans: 'İHL Meslek Dersleri', ders: 'Akaid',                  okul_tipi: 'ihl', dosya: 'ANADOLU İMAM HATİP LİSESİ AKAİD DERSİ.json' },
  { brans: 'İHL Meslek Dersleri', ders: 'Mesleki Arapça',         okul_tipi: 'ihl', dosya: 'ANADOLU İMAM HATİP LİSESİ ARAPÇA DERSİ.json' },
  { brans: 'İHL Meslek Dersleri', ders: 'Fıkıh',                  okul_tipi: 'ihl', dosya: 'ANADOLU İMAM HATİP LİSESİ FIKIH DERSİ.json' },
  { brans: 'İHL Meslek Dersleri', ders: 'Hadis',                  okul_tipi: 'ihl', dosya: 'ANADOLU İMAM HATİP LİSESİ HADİS DERSİ.json' },
  { brans: 'İHL Meslek Dersleri', ders: 'Siyer',                  okul_tipi: 'ihl', dosya: 'ANADOLU İMAM HATİP LİSESİ SİYER DERSİ.json' },
  { brans: 'İHL Meslek Dersleri', ders: 'Temel Dini Bilgiler',    okul_tipi: 'ihl', dosya: 'ANADOLU İMAM HATİP LİSESİ TEMEL DİNÎ BİLGİLER.json' },
  { brans: 'İHL Meslek Dersleri', ders: 'Peygamberimizin Hayatı', okul_tipi: 'ihl', dosya: 'PEYGAMBERİMİZİN HAYATI.json' },
];

// ─── Kazanım toplama ──────────────────────────────────────────────────────────

const rows    = [];
const seenKod = new Set();
const rapor   = {}; // dosya → { sinif → count }

for (const { brans, ders, okul_tipi, dosya } of KAYNAK) {
  const key = `${dosya} (→${ders})`;
  rapor[key] = {};

  const dosyaYolu = path.join(SEED_DIR, dosya);
  if (!fs.existsSync(dosyaYolu)) {
    console.warn(`⚠  Dosya bulunamadı: ${dosya}`);
    continue;
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(dosyaYolu, 'utf8'));
  } catch (e) {
    console.warn(`⚠  JSON parse hatası (${dosya}): ${e.message}`);
    continue;
  }

  if (!Array.isArray(data.siniflar)) continue;

  for (const sinifObj of data.siniflar) {
    const sinif = sinifObj.sinif;
    if (sinif < 1 || sinif > 12) continue;

    const kazanimlar = sinifObj.kazanimlar || [];
    const uniteAdMap = buildUniteAdHaritasi(kazanimlar);

    let sayac = 0;
    for (const k of kazanimlar) {
      if (!gecerliKazanim(k)) continue;

      const baseKod = k.kod.replace(/\.$/, '');
      // Aynı kod birden fazla yerde geçebilir (örn. AKID.10.1.1 hem giriş hem detay) — synthetic sayaç
      let finalKod = baseKod;
      let suffix = 0;
      while (seenKod.has(finalKod)) {
        suffix++;
        finalKod = `${baseKod}.${String(suffix).padStart(3, '0')}`;
      }
      seenKod.add(finalKod);

      const uniteNo  = uniteNoKodan(k.kod);
      const uniteAd  = uniteAdMap[uniteNo] ?? `Ünite ${uniteNo}`;

      const aciklama = Array.isArray(k.alt_kazanimlar)
        ? k.alt_kazanimlar.slice(0, 4).join(' ').slice(0, 500)
        : '';

      rows.push({ brans, ders, okul_tipi, sinif, uniteNo, uniteAd, kod: finalKod, ad: k.kazanim.trim(), aciklama });
      sayac++;
    }
    if (!rapor[key][sinif]) rapor[key][sinif] = 0;
    rapor[key][sinif] += sayac;
  }
}

// ─── Rapor ────────────────────────────────────────────────────────────────────

console.log('\n=== KAYNAK RAPORU ===');
let grandTotal = 0;
for (const [key, sinifler] of Object.entries(rapor)) {
  const total = Object.values(sinifler).reduce((a, b) => a + b, 0);
  grandTotal += total;
  const sinifStr = Object.entries(sinifler)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([s, c]) => `${s}.sınıf(${c})`)
    .join(', ');
  const durum = total === 0 ? '⚠ BOŞ' : '';
  console.log(`  ${key.padEnd(80)} | ${String(total).padStart(4)} | ${sinifStr} ${durum}`);
}
console.log(`\n  TOPLAM: ${grandTotal} kazanım, ${rows.length} satır`);

if (rows.length === 0) {
  console.error('\n❌ Hiç satır üretilemedi.');
  process.exit(1);
}

// Ders bazlı sınıf dağılımı (final özet)
console.log('\n=== DERS BAZLI SINIF DAĞILIMI ===');
const dersDist = {};
for (const r of rows) {
  if (!dersDist[r.ders]) dersDist[r.ders] = {};
  dersDist[r.ders][r.sinif] = (dersDist[r.ders][r.sinif] ?? 0) + 1;
}
for (const [ders, sinifler] of Object.entries(dersDist).sort()) {
  const total = Object.values(sinifler).reduce((a, b) => a + b, 0);
  const sinifStr = Object.entries(sinifler).sort((a,b)=>+a[0]-+b[0]).map(([s,c]) => `${s}:${c}`).join('  ');
  console.log(`  ${ders.padEnd(30)} (${String(total).padStart(3)}) → ${sinifStr}`);
}

// ─── SQL üretimi ──────────────────────────────────────────────────────────────

const header = [
  '-- Migration 025: İHL Meslek Dersleri kazanımları seed',
  `-- ${rows.length} kazanım, ${KAYNAK.length} kaynak dosyası`,
  `-- Oluşturulma: ${new Date().toISOString()}`,
  '-- Mig 016 din_kulturu→ihl_meslek_dersleri taşıma 0 satır taşıdı; bu mig ilk gerçek seed.',
  '',
  'INSERT INTO kazanimlar (kod, brans_id, sinif, unite_no, unite_ad, ad, aciklama, ders, okul_tipi)',
  'SELECT v.kod, b.id, v.sinif::integer, v.unite_no::integer, v.unite_ad, v.ad, v.aciklama, v.ders, v.okul_tipi',
  'FROM (VALUES',
];

const valueLines = rows.map((r, i) => {
  const comma = i < rows.length - 1 ? ',' : '';
  return `  ('${escape(r.kod)}', '${escape(r.brans)}', ${r.sinif}, ${r.uniteNo}, '${escape(r.uniteAd)}', '${escape(r.ad)}', '${escape(r.aciklama)}', '${escape(r.ders)}', '${escape(r.okul_tipi)}')${comma}`;
});

const footer = [
  ') AS v(kod, brans_ad, sinif, unite_no, unite_ad, ad, aciklama, ders, okul_tipi)',
  'JOIN branslar b ON b.ad = v.brans_ad',
  'ON CONFLICT (kod) DO NOTHING;',
  '',
];

const sql = [...header, ...valueLines, ...footer].join('\n');
fs.writeFileSync(OUTPUT_SQL, sql, 'utf8');
console.log(`\n✅ SQL: ${OUTPUT_SQL}`);
