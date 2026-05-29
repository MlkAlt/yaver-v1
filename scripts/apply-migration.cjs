// Supabase'e ham SQL çalıştırır (service_role ile)
// Kullanım: node scripts/apply-migration.cjs <dosya.sql>

const https = require('https')
const fs = require('fs')
const path = require('path')

function loadEnv() {
  const lines = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8').split('\n')
  const env = {}
  for (const line of lines) {
    const [key, ...rest] = line.split('=')
    if (key && rest.length) env[key.trim()] = rest.join('=').trim()
  }
  return env
}

const env = loadEnv()
const url = new URL(env.VITE_SUPABASE_URL)
const projectRef = url.hostname.split('.')[0]
const sqlFile = process.argv[2]

if (!sqlFile) { console.error('Kullanım: node apply-migration.cjs <dosya.sql>'); process.exit(1) }

const sql = fs.readFileSync(sqlFile, 'utf8')

const body = JSON.stringify({ query: sql })

const options = {
  hostname: `${projectRef}.supabase.co`,
  path: '/rest/v1/rpc/exec_sql',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': env.SUPABASE_SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Length': Buffer.byteLength(body),
  }
}

// Supabase'in SQL endpoint'i yoksa pg üzerinden deneyelim
// En basit yol: supabase JS client ile raw SQL
const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

supabase.rpc('exec_sql', { query: sql })
  .then(({ error }) => {
    if (error) {
      // exec_sql fonksiyonu yoksa direkt pg_catalog üzerinden dene
      console.error('RPC hatası:', error.message)
      console.log('\nAlternatif: Supabase Dashboard > SQL Editor\'a yapıştır:')
      console.log(sql)
      process.exit(1)
    }
    console.log('✓ Migration uygulandı')
  })
