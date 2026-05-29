// Yaver V1 — Üretim Edge Function
// Spec B4: Cache-first, sonra Claude API çağrısı
// Model seçimi: sorular → Haiku (ucuz), diğerleri → Sonnet

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type UretimTip = 'sorular' | 'etkinlik' | 'ders_plani' | 'calisma_yapragi'

interface GenerateRequest {
  kazanimKod: string
  kazanimAd: string
  sinif: number
  uniteAd?: string | null
  tip: UretimTip
  ayarlar: Record<string, unknown>
}

async function hashParams(tip: string, ayarlar: Record<string, unknown>): Promise<string> {
  const str = tip + JSON.stringify(ayarlar, Object.keys(ayarlar).sort())
  const data = new TextEncoder().encode(str)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 16)
}

function buildPrompt(req: GenerateRequest): string {
  const { kazanimKod, kazanimAd, sinif, uniteAd, tip, ayarlar } = req

  const baglamSatir = [
    `KAZANIM: ${kazanimAd}`,
    `KOD: ${kazanimKod}`,
    `SINIF: ${sinif}. Sınıf`,
    uniteAd ? `ÜNİTE: ${uniteAd}` : null,
  ].filter(Boolean).join('\n')

  if (tip === 'sorular') {
    const sayi = ayarlar.sayi as number
    const zorluk = ayarlar.zorluk as string
    const format = ayarlar.format as string
    const formatTr = { coktan_secmeli: 'çoktan seçmeli', dogru_yanlis: 'doğru/yanlış', kisa_cevap: 'kısa cevap' }[format] ?? format

    return `Sen deneyimli bir Türk ortaöğretim öğretmenisin. MEB müfredatına uygun sorular hazırlıyorsun.

${baglamSatir}

${sayi} adet ${formatTr} soru hazırla. Zorluk düzeyi: ${zorluk}.

Kurallar:
- Başlık: "# ${sayi} Soru — ${kazanimAd}"
- Her soruyu numaralandır (1., 2., ...)
- Çoktan seçmeli: A) B) C) D) şıkları
- Doğru/Yanlış: ifadeyi yaz, altına (D / Y) işaret et
- Kısa cevap: soruyu yaz, altına boş satır bırak
- Sonda "## Cevap Anahtarı" bölümü ekle
- Türkçe pedagoji diline uy, açık ve net ol`
  }

  if (tip === 'etkinlik') {
    const sure = ayarlar.sure as number
    const yapi = ayarlar.yapi as string
    const yapiTr = { bireysel: 'bireysel', grup: 'grup', sinif: 'sınıf geneli' }[yapi] ?? yapi

    return `Sen deneyimli bir Türk ortaöğretim öğretmenisin.

${baglamSatir}

${sure} dakikalık ${yapiTr} bir sınıf etkinliği hazırla.

Şu bölümleri içersin:
## Etkinlik Adı
## Amaç
## Malzemeler (varsa)
## Süre Planı
## Uygulama Adımları (madde madde)
## Değerlendirme ve Kapanış

Türkçe pedagoji diline uy. Pratik ve sınıfta uygulanabilir olsun.`
  }

  if (tip === 'ders_plani') {
    const sure = ayarlar.sure as number

    return `Sen deneyimli bir Türk ortaöğretim öğretmenisin. MEB standartlarına uygun ders planı hazırlıyorsun.

${baglamSatir}
DERS SÜRESİ: ${sure} dakika

Kapsamlı bir ders planı hazırla:

## Kazanım
## Anahtar Kavramlar
## Yöntem ve Teknikler
## Materyal ve Araçlar
## Süre Planı
### Giriş (${Math.round(sure * 0.15)} dk)
### Geliştirme (${Math.round(sure * 0.65)} dk)
### Sonuç ve Değerlendirme (${Math.round(sure * 0.2)} dk)
## Ödev / Uzantı Etkinliği (opsiyonel)

Türkçe pedagoji diline uy. Her aşama net, uygulanabilir ve öğretmene yol gösterici olsun.`
  }

  if (tip === 'calisma_yapragi') {
    const sayi = ayarlar.sayi as number
    const format = ayarlar.format as string
    const formatTr = { karisik: 'karma (çoktan seçmeli + kısa cevap + boşluk doldurma)', coktan_secmeli: 'çoktan seçmeli' }[format] ?? format

    return `Sen deneyimli bir Türk ortaöğretim öğretmenisin.

${baglamSatir}

${sayi} soruluk öğrenci çalışma yaprağı hazırla. Format: ${formatTr}.

Yapı:
# Çalışma Yaprağı
**Konu:** ${kazanimAd}
**Sınıf:** ${sinif}. Sınıf
**Ad Soyad:** _________________________  **Tarih:** _____________

---

[${sayi} soru buraya — numaralı]

---

## Öğretmen Cevap Anahtarı

Öğrencinin düzeyine uygun, anlaşılır Türkçe kullan.`
  }

  return `${baglamSatir}\n\n${tip} hazırla.`
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS })
  }

  try {
    const body = await req.json() as GenerateRequest
    const { kazanimKod, tip, ayarlar } = body

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // 1. Cache kontrolü (Spec B4 Katman 1)
    const paramsHash = await hashParams(tip, ayarlar)
    const cacheKey = `${kazanimKod}::${tip}::${paramsHash}`

    const { data: cached } = await supabase
      .from('uretim_cache')
      .select('id, icerik')
      .eq('cache_key', cacheKey)
      .single()

    if (cached) {
      // Cache hit — kullanım sayısını artır
      await supabase
        .from('uretim_cache')
        .update({ kullanim_sayisi: supabase.rpc('increment', { x: 1 }), son_kullanim: new Date().toISOString() })
        .eq('id', cached.id)

      return new Response(JSON.stringify({ icerik: cached.icerik, kaynakCache: true }), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    // 2. Cache miss — Claude API çağrısı
    const model = tip === 'sorular' ? 'claude-haiku-4-5-20251001' : 'claude-sonnet-4-6'
    const prompt = buildPrompt(body)

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text()
      throw new Error(`Claude API hatası: ${anthropicRes.status} — ${errText}`)
    }

    const anthropicData = await anthropicRes.json()
    const icerik: string = anthropicData.content?.[0]?.text ?? ''

    if (!icerik) throw new Error('Claude API boş yanıt döndü')

    // 3. Cache'e yaz
    await supabase.from('uretim_cache').insert({
      cache_key: cacheKey,
      kazanim_kodu: kazanimKod,
      tip,
      parametreler_hash: paramsHash,
      icerik,
    })

    return new Response(JSON.stringify({ icerik, kaynakCache: false }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }
})
