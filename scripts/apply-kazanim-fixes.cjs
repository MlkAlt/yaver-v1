// Kazanım başlık hatalarını düzelt
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

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
const supabase = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const fixes = [
  { kod: 'SB.7.1.1',   ad: 'Dâhil olduğu gruplarda ve sosyal hayatta etkili iletişimin önemini sorgulayabilme' },
  { kod: 'GS.11.1.1',  ad: 'Sanat ve özgünlük ilişkisini tartışabilme' },
  { kod: 'KİM.9.1.5',  ad: 'Elektronların atom orbitallerine yerleşimine ilişkin tümevarımsal akıl yürütebilme' },
  { kod: 'FİZ.9.2.1',  ad: 'Birimleri SI birim sisteminde verilen temel ve türetilmiş nicelikleri sınıflandırabilme' },
  { kod: 'MAT.1.3.3',  ad: 'Günlük yaşamdaki nesneleri biçimsel özelliklerine göre ayırt edebilme' },
  { kod: 'MAT.1.3.4',  ad: 'Günlük yaşamda karşılaşılan geometrik yapılardaki geometrik şekilleri çözümleyebilme' },
  { kod: 'MAT.1.3.5',  ad: 'Biçimsel özelliklerine göre geometrik şekilleri sınıflandırabilme' },
  { kod: 'TT.8.1.3',   ad: 'Fikrî ve Sınai Mülkiyet Haklarının Korunması hakkında bilgi toplayabilme' },
  { kod: 'BEO.3.6.3',  ad: "Mustafa Kemal Atatürk'ün ilgilendiği sporları açıklayabilme" },
  { kod: 'BES.7.4.1',  ad: 'Beden eğitimi ve spor alanının öncülerini tanıyabilme' },
  { kod: 'MAT.1.1.4',  ad: 'İki niceliğin büyüklüğünü "çok", "daha çok", "az", "daha az" veya "eşit" terimleriyle karşılaştırabilme' },
  { kod: 'MAT.4.4.1',  ad: 'Günlük yaşamdan herhangi bir olayın olasılığını "imkânsız, olabilir, kesin" olarak belirleyebilme' },
]

async function run() {
  let ok = 0, fail = 0
  for (const { kod, ad } of fixes) {
    const { error } = await supabase.from('kazanimlar').update({ ad }).eq('kod', kod)
    if (error) {
      console.error(`HATA [${kod}]: ${error.message}`)
      fail++
    } else {
      console.log(`OK [${kod}]`)
      ok++
    }
  }
  console.log(`\n${ok} başarili, ${fail} hatali`)
}

run()
