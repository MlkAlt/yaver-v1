# -*- coding: utf-8 -*-
"""
PDF extraction sonuçlarını DB'deki kazanım metinleriyle karşılaştır.
node ile Supabase'den çeker, Python ile diff yapar.
"""
import json, re, subprocess, sys, io
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

EXTRACTED_DIR = Path("refs/mufredat-2025/extracted")

# Supabase'den kazanımları çek
JS = r"""
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const sb = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function main() {
    const slug = process.argv[2];
    const { data: b } = await sb.from('branslar').select('id').eq('slug', slug).single();
    if (!b) { console.error('Brans bulunamadi:', slug); process.exit(1); }
    let all = [];
    let from = 0;
    while (true) {
        const { data } = await sb.from('kazanimlar')
            .select('kod,sinif,ad')
            .eq('brans_id', b.id)
            .range(from, from+999);
        if (!data || data.length === 0) break;
        all = all.concat(data);
        if (data.length < 1000) break;
        from += 1000;
    }
    console.log(JSON.stringify(all));
}
main().catch(e => { console.error(e.message); process.exit(1); });
"""

def get_db_kazanimlar(slug: str) -> dict:
    """Returns {kod: ad} from DB."""
    result = subprocess.run(
        ['node', '-e', JS, slug],
        capture_output=True, text=True, cwd='.',
        env=None
    )
    if result.returncode != 0:
        print(f"  DB hatasi ({slug}): {result.stderr[:100]}")
        return {}
    try:
        rows = json.loads(result.stdout)
        return {r['kod']: (r['ad'] or '').strip() for r in rows}
    except Exception as e:
        print(f"  JSON parse hatasi: {e}")
        return {}

def normalize(text: str) -> str:
    """Normalize text for comparison."""
    t = text.strip().lower()
    t = re.sub(r'\s+', ' ', t)
    t = t.rstrip('.')
    return t

def compare(slug: str):
    json_file = EXTRACTED_DIR / f"{slug}.json"
    if not json_file.exists():
        print(f"  {slug}: extracted JSON yok, atla")
        return

    data = json.loads(json_file.read_text(encoding='utf-8'))
    pdf_kazanimlar = {k['kod']: k['baslik'] for k in data['kazanimlar']}

    print(f"\n{'='*55}")
    print(f"  {slug.upper()} — PDF:{len(pdf_kazanimlar)}")

    db_kazanimlar = get_db_kazanimlar(slug)
    if not db_kazanimlar:
        print("  DB verileri alinamadi (network?)")
        return

    print(f"  DB:{len(db_kazanimlar)}")

    # Codes only in PDF
    only_pdf = set(pdf_kazanimlar) - set(db_kazanimlar)
    # Codes only in DB
    only_db = set(db_kazanimlar) - set(pdf_kazanimlar)
    # In both
    both = set(pdf_kazanimlar) & set(db_kazanimlar)

    text_match = 0
    text_mismatch = []

    for kod in sorted(both):
        pdf_text = normalize(pdf_kazanimlar[kod])
        db_text  = normalize(db_kazanimlar[kod])
        if pdf_text == db_text:
            text_match += 1
        else:
            text_mismatch.append((kod, pdf_text, db_text))

    print(f"  Kod eslesmesi: {len(both)}/{max(len(pdf_kazanimlar),len(db_kazanimlar))}")
    print(f"  Metin eslesmesi: {text_match}/{len(both)}")

    if only_pdf:
        print(f"  Sadece PDF'de ({len(only_pdf)}): {sorted(only_pdf)[:5]}")
    if only_db:
        print(f"  Sadece DB'de ({len(only_db)}): {sorted(only_db)[:5]}")

    if text_mismatch:
        print(f"\n  --- Metin farkliliklari (ilk 5) ---")
        for kod, pdf_t, db_t in text_mismatch[:5]:
            print(f"  [{kod}]")
            print(f"    PDF: {pdf_t[:100]}")
            print(f"    DB:  {db_t[:100]}")
    else:
        if len(both) > 0:
            print(f"  Tum metinler eslesiyor! ({text_match} kazanim)")

# Test with kimya first, then others if network works
slugs = ["kimya", "biyoloji", "gorsel_sanatlar", "muzik",
         "hayat_bilgisi", "bilisim_teknolojileri", "teknoloji_tasarim",
         "sosyal_bilgiler", "matematik", "beden_egitimi"]

for slug in slugs:
    compare(slug)
