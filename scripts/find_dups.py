import json, sys, io
from pathlib import Path
from collections import Counter, defaultdict
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

ALL_JSON = Path(__file__).parent.parent / "extracted" / "_all_kazanimlar.json"
records = json.loads(ALL_JSON.read_text(encoding='utf-8-sig'))

kod_sources = defaultdict(list)
for r in records:
    kod_sources[r['kazanim_kodu']].append({
        'kaynak_pdf': r.get('kaynak_pdf', '?'),
        'brans_slug': r.get('brans_slug', '?'),
        'okul_turu': r.get('okul_turu', '?'),
        'sinif': r.get('sinif', '?'),
    })

dups = {k: v for k, v in kod_sources.items() if len(v) > 1}
print(f"Toplam duplicate kod: {len(dups)}")

prefixes = Counter(k.split('.')[0] for k in dups.keys())
print(f"Prefix dagilimi: {dict(prefixes)}")
print()

# Hangi kaynak PDF'ler çakışıyor?
pdf_pairs = Counter()
for kod, sources in dups.items():
    pdfs = tuple(sorted(set(s['kaynak_pdf'] for s in sources)))
    pdf_pairs[pdfs] += 1

print("Cakisan PDF ciftleri:")
for pair, count in pdf_pairs.most_common(10):
    print(f"  {count} kod: {pair}")

print()
print("Ilk 3 duplicate detay:")
for kod, sources in list(dups.items())[:3]:
    print(f"[{kod}]:")
    for s in sources:
        print(f"  {s['kaynak_pdf']} | {s['brans_slug']} | {s['okul_turu']} | sinif={s['sinif']}")
