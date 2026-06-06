import json, sys, io
from pathlib import Path
from collections import Counter, defaultdict
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

ALL_JSON = Path(__file__).parent.parent / "extracted" / "_all_kazanimlar.json"
records = json.loads(ALL_JSON.read_text(encoding='utf-8-sig'))

kod_sources = defaultdict(list)
for r in records:
    kod_sources[r['kazanim_kodu']].append(r)

dups = {k: v for k, v in kod_sources.items() if len(v) > 1}

# --- ENG duplicates ---
eng_dups = {k: v for k, v in dups.items() if k.startswith('ENG')}
print(f"=== ENG duplicates: {len(eng_dups)} ===")
for kod, recs in list(eng_dups.items())[:5]:
    print(f"[{kod}]:")
    for r in recs:
        print(f"  sinif={r['sinif']} okul={r['okul_turu']} pdf={r.get('kaynak_pdf','?')[:40]}")
        print(f"  metin: {r.get('kazanim_metni','')[:60]}")
print()

# --- KK duplicates ---
kk_dups = {k: v for k, v in dups.items() if k.startswith('KK')}
print(f"=== KK duplicates: {len(kk_dups)} ===")
for kod, recs in list(kk_dups.items())[:5]:
    print(f"[{kod}]:")
    for r in recs:
        print(f"  sinif={r['sinif']} okul={r['okul_turu']} pdf={r.get('kaynak_pdf','?')[:40]}")
        print(f"  metin: {r.get('kazanim_metni','')[:60]}")
print()

# --- TDB duplicates ---
tdb_dups = {k: v for k, v in dups.items() if k.startswith('TDB')}
print(f"=== TDB duplicates: {len(tdb_dups)} ===")
for kod, recs in list(tdb_dups.items())[:5]:
    print(f"[{kod}]:")
    for r in recs:
        print(f"  sinif={r['sinif']} okul={r['okul_turu']} pdf={r.get('kaynak_pdf','?')[:40]}")
        print(f"  metin: {r.get('kazanim_metni','')[:60]}")
print()

# ENG: aynı mı farklı mı içerik?
print("=== ENG içerik karşılaştırması (ilk 3) ===")
for kod, recs in list(eng_dups.items())[:3]:
    metinler = [r.get('kazanim_metni','') for r in recs]
    ayni = len(set(metinler)) == 1
    siniflar = [r['sinif'] for r in recs]
    print(f"[{kod}] siniflar={siniflar} metin_ayni={ayni}")
    if not ayni:
        for m in metinler:
            print(f"  - {m[:60]}")
