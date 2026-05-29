# -*- coding: utf-8 -*-
"""PDF extraction vs DB metin karşılaştırması."""
import json, re, sys, io
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

EXTRACTED = Path("refs/mufredat-2025/extracted")
DB_FILE   = Path("refs/mufredat-2025/db_kazanimlar.json")

db_all = json.loads(DB_FILE.read_text(encoding='utf-8'))

def normalize(text: str) -> str:
    if not text:
        return ''
    t = text.strip()
    # Remove soft hyphens (U+00AD) and any trailing space after them
    t = re.sub(r'­\s*', '', t)
    # Join hyphenated line breaks: "word- continuation" → "wordcontinuation"
    t = re.sub(r'-\s+([a-zçşğüöıA-ZÇŞĞÜÖİ])', r'\1', t)
    # Remove column bleed artifacts
    t = re.sub(r'\s*(ÖĞRENME ÇIKTILARI|SÜREÇ BİLEŞENLERİ|BİLEŞENLERİ|EĞİLİMLER|PROGRAMLAR ARASI).*$', '', t, flags=re.DOTALL)
    # Remove trailing footnote/context artifacts (quoted strings at end)
    t = re.sub(r'[""].*$', '', t)
    t = t.lower().strip()
    t = re.sub(r'\s+', ' ', t)
    t = t.rstrip('.')
    return t

SLUGS = [
    'kimya', 'fizik', 'biyoloji',
    'gorsel_sanatlar', 'muzik', 'hayat_bilgisi',
    'bilisim_teknolojileri', 'teknoloji_tasarim',
    'sosyal_bilgiler', 'matematik', 'beden_egitimi',
]

grand_match = 0
grand_mismatch = 0
grand_only_pdf = 0
grand_only_db = 0

for slug in SLUGS:
    jf = EXTRACTED / f"{slug}.json"
    if not jf.exists():
        continue

    pdf_data = json.loads(jf.read_text(encoding='utf-8'))
    pdf_map  = {k['kod']: k['baslik'] for k in pdf_data['kazanimlar']}

    db_rows  = db_all.get(slug, [])
    db_map   = {r['kod']: (r['ad'] or '') for r in db_rows}

    only_pdf = set(pdf_map) - set(db_map)
    only_db  = set(db_map)  - set(pdf_map)
    both     = set(pdf_map) & set(db_map)

    match = 0
    mismatch = []
    for kod in both:
        pn = normalize(pdf_map[kod])
        dn = normalize(db_map[kod])
        if pn == dn:
            match += 1
        else:
            mismatch.append((kod, pdf_map[kod], db_map[kod]))

    grand_match    += match
    grand_mismatch += len(mismatch)
    grand_only_pdf += len(only_pdf)
    grand_only_db  += len(only_db)

    status = "OK" if len(mismatch) == 0 and len(only_pdf) == 0 else "FARK"
    print(f"\n{'='*55}")
    print(f"{slug.upper()} [{status}]")
    print(f"  PDF:{len(pdf_map)}  DB:{len(db_map)}  Eslesme:{len(both)}")
    print(f"  Metin OK:{match}  Metin FARK:{len(mismatch)}")

    if only_pdf:
        print(f"  Sadece PDF ({len(only_pdf)}): {sorted(only_pdf)[:5]}")
    if only_db and len(only_db) <= 20:
        print(f"  Sadece DB  ({len(only_db)}): {sorted(only_db)[:5]} (seçmeli/ek program?)")
    elif only_db:
        print(f"  Sadece DB  ({len(only_db)}): ek programlar (seçmeli vb.)")

    if mismatch:
        print(f"\n  --- Ilk 3 metin farki ---")
        for kod, pt, dt in mismatch[:3]:
            print(f"  [{kod}]")
            print(f"    PDF: {pt[:100]}")
            print(f"    DB : {dt[:100]}")

print(f"\n{'='*55}")
print(f"GENEL OZET")
print(f"  Metin eslesen  : {grand_match}")
print(f"  Metin farkli   : {grand_mismatch}")
print(f"  Sadece PDF     : {grand_only_pdf}")
print(f"  Sadece DB      : {grand_only_db} (ek programlar bekleniyor)")
