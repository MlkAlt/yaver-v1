// Yaver V1 — F2: Hayat Bilgisi branşı + kazanımlarını geri ekle
// Mig 015 ile silinmişti. Bu script:
//   1. branslar tablosuna Hayat Bilgisi'ni geri ekler (slug=hayat_bilgisi, kademe=ilkokul)
//   2. HAYAT BİLGİSİ DERSİ.json'dan 1-3. sınıf kazanımlarını insert eder
// Kullanım: NODE_TLS_REJECT_UNAUTHORIZED=0 node scripts/restore-hayat-bilgisi.cjs

'use strict';
const fs   = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  const env = {};
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const eq = line.indexOf('=');
    if (eq < 0) continue;
    env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
  }
  return env;
}

const env = loadEnv();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// ─── Kazanım filtreleme (generate-meb-kazanimlar.cjs ile aynı) ───────────────

function kodDerinlik(kod) { return kod.replace(/\.$/, '').split('.').length; }

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

  if (altLen > 0) return d >= 3;
  if (altLen === 0) return d >= 4;
  if (d >= 4 && len < 200) return true;
  return false;
}

function uniteNoKodan(kod) {
  const n = parseInt(kod.replace(/\.$/, '').split('.')[2], 10);
  return !isNaN(n) && n >= 1 && n <= 30 ? n : 1;
}

function buildUniteAdHaritasi(kazanimlar) {
  const map = {};
  for (const k of kazanimlar) {
    if (!k.kod || !k.kazanim) continue;
    if (kodDerinlik(k.kod) !== 3) continue;
    const len = k.kazanim.length;
    if (len < 2 || len > 80 || /^\d/.test(k.kazanim)) continue;
    const no = parseInt(k.kod.replace(/\.$/, '').split('.')[2], 10);
    if (!isNaN(no) && no >= 1 && no <= 30 && !map[no]) map[no] = k.kazanim.trim();
  }
  return map;
}

async function run() {
  // 1. Branş kontrolü / ekleme
  console.log('🔍 Hayat Bilgisi branşı kontrolü...');
  const { data: existing } = await supabase
    .from('branslar')
    .select('id, ad, slug')
    .eq('slug', 'hayat_bilgisi')
    .maybeSingle();

  let bransId;
  if (existing) {
    console.log(`   ✓ Mevcut: id=${existing.id}`);
    bransId = existing.id;
  } else {
    console.log('   ⚠ Yok, ekleniyor...');
    // sira: Sosyal Bilgiler'den sonra (mig 022 sonrası TDE Edebiyatı sira=7, en sonda)
    // En yüksek sirayı bul, +1
    const { data: maxSira } = await supabase.from('branslar').select('sira').order('sira', { ascending: false }).limit(1);
    const newSira = (maxSira?.[0]?.sira ?? 23) + 1;
    const { data: inserted, error: insErr } = await supabase
      .from('branslar')
      .insert({
        ad: 'Hayat Bilgisi',
        ikon: '🌱',
        renk: '#DCFCE7',
        sira: newSira,
        slug: 'hayat_bilgisi',
        kademe: ['ilkokul'],
      })
      .select()
      .single();
    if (insErr) throw new Error('Branş eklenemedi: ' + insErr.message);
    console.log(`   ✓ Eklendi: id=${inserted.id}, sira=${newSira}`);
    bransId = inserted.id;
  }

  // 2. JSON'dan kazanımları çek
  const dosya = path.join(__dirname, '..', 'supabase/seed-data/kazanimlar/HAYAT BİLGİSİ DERSİ.json');
  const data = JSON.parse(fs.readFileSync(dosya, 'utf8'));

  console.log('\n📖 HAYAT BİLGİSİ DERSİ.json okunuyor...');
  const seen = new Set();
  const rows = [];

  for (const sinifObj of data.siniflar ?? []) {
    const sinif = sinifObj.sinif;
    if (sinif < 1 || sinif > 4) continue; // ilkokul

    const kazanimlar = sinifObj.kazanimlar ?? [];
    const uniteAdMap = buildUniteAdHaritasi(kazanimlar);
    let sayac = 0;

    for (const k of kazanimlar) {
      if (!gecerliKazanim(k)) continue;
      const baseKod = k.kod.replace(/\.$/, '');
      let finalKod = baseKod;
      let i = 0;
      while (seen.has(finalKod)) { i++; finalKod = `${baseKod}.${String(i).padStart(3, '0')}`; }
      seen.add(finalKod);

      const uniteNo = uniteNoKodan(k.kod);
      const aciklama = Array.isArray(k.alt_kazanimlar)
        ? k.alt_kazanimlar.slice(0, 4).join(' ').slice(0, 500) : '';

      rows.push({
        kod: finalKod,
        brans_id: bransId,
        sinif,
        unite_no: uniteNo,
        unite_ad: uniteAdMap[uniteNo] ?? `Ünite ${uniteNo}`,
        ad: k.kazanim.trim(),
        aciklama,
        ders: 'Hayat Bilgisi',
        okul_tipi: 'ilkokul',
      });
      sayac++;
    }
    console.log(`   ${sinif}. sınıf → ${sayac} kazanım`);
  }

  console.log(`\n   Toplam: ${rows.length} kazanım`);

  if (rows.length === 0) {
    console.warn('⚠  Hiç kazanım üretilemedi.');
    return;
  }

  // 3. Insert
  console.log('\n📤 Insert ediliyor...');
  const BATCH = 200;
  let ok = 0;
  for (let i = 0; i < rows.length; i += BATCH) {
    const chunk = rows.slice(i, i + BATCH);
    const { error } = await supabase.from('kazanimlar').upsert(chunk, { onConflict: 'kod', ignoreDuplicates: true });
    if (error) { console.error(`   ❌ batch ${i}: ${error.message}`); }
    else { ok += chunk.length; }
  }
  console.log(`✅ ${ok}/${rows.length} kazanım eklendi`);

  const { count } = await supabase.from('kazanimlar').select('*', { count: 'exact', head: true });
  console.log(`\n   DB'de toplam kazanım: ${count}`);
}

run().catch(err => { console.error('Hata:', err.message); process.exit(1); });
