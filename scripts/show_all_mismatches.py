# -*- coding: utf-8 -*-
import json, re, sys, io
from pathlib import Path
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

EXTRACTED = Path("refs/mufredat-2025/extracted")
DB_FILE   = Path("refs/mufredat-2025/db_kazanimlar.json")
db_all = json.loads(DB_FILE.read_text(encoding='utf-8'))

def normalize(text):
    if not text:
        return ''
    t = text.strip()
    t = re.sub(r'­\s*', '', t)  # soft hyphen
    t = re.sub(r'-\s+([a-zçşğüöıA-ZÇŞĞÜÖİ])', r'\1', t)
    t = re.sub(r'\s*(OGRENME CIKTILARI|SUREC BILESENLERI|BILESENLERI|EGILIMLER|PROGRAMLAR ARASI).*$', '', t, flags=re.DOTALL)
    t = t.lower().strip()
    t = re.sub(r'\s+', ' ', t)
    t = t.rstrip('.')
    return t

SLUGS = [
    'kimya', 'fizik', 'biyoloji', 'gorsel_sanatlar', 'muzik',
    'hayat_bilgisi', 'bilisim_teknolojileri', 'teknoloji_tasarim',
    'sosyal_bilgiler', 'matematik', 'beden_egitimi',
]

for slug in SLUGS:
    jf = EXTRACTED / f"{slug}.json"
    if not jf.exists():
        continue
    pdf_data = json.loads(jf.read_text(encoding='utf-8'))
    pdf_map  = {k['kod']: k['baslik'] for k in pdf_data['kazanimlar']}
    db_rows  = db_all.get(slug, [])
    db_map   = {r['kod']: (r['ad'] or '') for r in db_rows}
    both = set(pdf_map) & set(db_map)
    mismatch = [(k, pdf_map[k], db_map[k]) for k in both if normalize(pdf_map[k]) != normalize(db_map[k])]
    if mismatch:
        print(f"\n=== {slug.upper()} ({len(mismatch)} mismatch) ===")
        for kod, pt, dt in sorted(mismatch):
            print(f"  [{kod}]")
            print(f"    PDF: {pt[:130]}")
            print(f"    DB : {dt[:130]}")
