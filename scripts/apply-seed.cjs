// Yaver V1 — Seed Uygulama Scripti
// Supabase JS client ile branslar + kazanimlar seed'lerini yükler
// Kullanım: node scripts/apply-seed.cjs

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// .env.local'dan oku
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local')
  const lines = fs.readFileSync(envPath, 'utf8').split('\n')
  const env = {}
  for (const line of lines) {
    const [key, ...rest] = line.split('=')
    if (key && rest.length) env[key.trim()] = rest.join('=').trim()
  }
  return env
}

const env = loadEnv()
const supabase = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const MUFREDAT_DIR = 'C:/Users/melik/Desktop/Devam eden projeler/Öğretmen Yaver App/src/data/mufredat'

const BRANS_MAP = {
  'matematik':          'Matematik',
  'fizik':              'Fizik',
  'kimya':              'Kimya',
  'biyoloji':           'Biyoloji',
  'tarih':              'Tarih',
  'cografya':           'Coğrafya',
  'ingilizce':          'İngilizce',
  'turk-dili-edebiyat': 'Türk Dili ve Edebiyatı',
  'turkce':             'Türkçe',
  'fen-bilimleri':      'Fen Bilimleri',
  'sosyal-bilgiler':    'Sosyal Bilgiler',
  'hayat-bilgisi':      'Hayat Bilgisi',
}

function parseSinif(s) {
  const m = (s || '').match(/(\d+)/); return m ? parseInt(m[1]) : null
}

function parseKazanimStr(s) {
  const em = s.indexOf(' — ')
  if (em !== -1) return { kod: s.slice(0, em).trim(), ad: s.slice(em + 3).trim() }
  const dot = s.match(/^([A-ZÇĞİÖŞÜa-z0-9]+(?:\.[0-9]+)+\.?)\s+(.+)$/)
  if (dot) return { kod: dot[1].replace(/\.$/, ''), ad: dot[2].trim() }
  return null
}

function getBransPrefix(filename) {
  const name = filename.replace('.json', '')
  const m = name.match(/-(\d+)$/)
  if (!m) return null
  return name.slice(0, name.lastIndexOf('-' + m[1]))
}

async function main() {
  // 1. Yeni branşları ekle
  console.log('📌 Yeni branşlar ekleniyor...')
  const { error: bransErr } = await supabase.from('branslar').upsert([
    { ad: 'Türkçe',          ikon: '✏️', renk: '#FEF9C3', sira: 15 },
    { ad: 'Fen Bilimleri',   ikon: '🔬', renk: '#CCFBF1', sira: 16 },
    { ad: 'Sosyal Bilgiler', ikon: '🌐', renk: '#E0E7FF', sira: 17 },
    { ad: 'Hayat Bilgisi',   ikon: '🌱', renk: '#DCFCE7', sira: 18 },
  ], { onConflict: 'ad' })
  if (bransErr) { console.error('Branş hatası:', bransErr.message); process.exit(1) }
  console.log('  ✓ Branşlar hazır')

  // 2. Branş ID haritasını al
  const { data: branslar } = await supabase.from('branslar').select('id, ad')
  const bransIdMap = {}
  for (const b of branslar) bransIdMap[b.ad] = b.id

  // 3. JSON'ları oku, kazanımları topla
  console.log('\n📚 Kazanımlar okunuyor...')
  const files = fs.readdirSync(MUFREDAT_DIR).filter(f => f.endsWith('.json'))
  const rows = []
  const seenKods = new Set()

  for (const file of files) {
    const prefix = getBransPrefix(file)
    const bransAd = BRANS_MAP[prefix]
    if (!bransAd) continue

    const brans_id = bransIdMap[bransAd]
    if (!brans_id) { console.warn(`  ⚠ brans_id bulunamadı: ${bransAd}`); continue }

    const data = JSON.parse(fs.readFileSync(path.join(MUFREDAT_DIR, file), 'utf8'))
    const sinif = parseSinif(data.sinif)
    if (!sinif) continue

    if (Array.isArray(data.haftalar)) {
      for (const h of data.haftalar) {
        if (h.unite === 0) continue
        const p = parseKazanimStr(h.kazanim)
        if (!p || seenKods.has(p.kod)) continue
        seenKods.add(p.kod)
        rows.push({ kod: p.kod, brans_id, sinif, unite_no: h.unite, unite_ad: h.uniteAdi, ad: p.ad, aciklama: h.kazanimDetay || '', hafta_no: h.haftaNo })
      }
    } else if (Array.isArray(data.uniteler)) {
      for (const u of data.uniteler) {
        if (!Array.isArray(u.kazanimlar)) continue
        for (const k of u.kazanimlar) {
          if (!k.kod || !k.baslik || seenKods.has(k.kod)) continue
          seenKods.add(k.kod)
          rows.push({ kod: k.kod, brans_id, sinif, unite_no: u.no, unite_ad: u.ad, ad: k.baslik, aciklama: Array.isArray(k.adimlar) ? k.adimlar.join(' ') : '', hafta_no: null })
        }
      }
    }
  }

  console.log(`  ${rows.length} kazanım toplandı`)

  // 4. Batch insert (500'erli)
  console.log('\n⬆ Supabase\'e yukleniyor...')
  const BATCH = 500
  let inserted = 0
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH)
    const { error } = await supabase.from('kazanimlar').upsert(batch, { onConflict: 'kod' })
    if (error) { console.error(`  ✗ Batch ${i/BATCH + 1} hatası:`, error.message); process.exit(1) }
    inserted += batch.length
    process.stdout.write(`  ${inserted}/${rows.length}\r`)
  }

  // 5. Özet
  console.log(`\n\n✅ Tamamlandı! ${inserted} kazanım yüklendi.\n`)
  const byBrans = {}
  for (const r of rows) {
    const ad = Object.entries(bransIdMap).find(([, id]) => id === r.brans_id)?.[0] || r.brans_id
    byBrans[ad] = (byBrans[ad] || 0) + 1
  }
  for (const [b, c] of Object.entries(byBrans).sort((a,b) => b[1]-a[1]))
    console.log(`  ${b}: ${c}`)
}

main().catch(e => { console.error(e); process.exit(1) })
