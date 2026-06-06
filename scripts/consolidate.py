# -*- coding: utf-8 -*-
"""
consolidate.py — 72 extracted/*.json → extracted/_all_kazanimlar.json
Ayrıca L1/L2/L3 doğrulama yapar ve özet basar.
"""
import sys, io, json, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
from pathlib import Path
from collections import Counter, defaultdict

OUT_DIR  = Path(__file__).parent.parent / "extracted"
ALL_FILE = OUT_DIR / "_all_kazanimlar.json"

REQUIRED_FIELDS = ["kazanim_kodu","kazanim_metni","sinif","okul_turu","brans_slug","ders","kaynak_pdf"]

# ── 1. Birleştir ───────────────────────────────────────────────────────────────
all_records: list[dict] = []
sources: dict[str, int] = {}

for f in sorted(OUT_DIR.glob("*.json")):
    if f.name.startswith("_"):
        continue
    try:
        data = json.loads(f.read_text(encoding="utf-8"))
    except Exception as e:
        print(f"PARSE HATA {f.name}: {e}")
        continue
    if not isinstance(data, list):
        continue
    all_records.extend(data)
    sources[f.name] = len(data)

print(f"Kaynak dosya: {len(sources)}")
print(f"Ham kayıt:    {len(all_records)}")

# ── 2. L1 — Zorunlu alan kontrolü ─────────────────────────────────────────────
l1_errors: list[dict] = []
valid_records: list[dict] = []
for r in all_records:
    missing = [f for f in REQUIRED_FIELDS if not r.get(f)]
    if missing:
        l1_errors.append({"kod": r.get("kazanim_kodu","?"), "eksik": missing})
    else:
        valid_records.append(r)

print(f"\nL1 (zorunlu alan): {len(l1_errors)} hata — {len(valid_records)} geçerli")
if l1_errors[:5]:
    for e in l1_errors[:5]:
        print(f"  {e}")

# ── 3. L2 — Sinif & okul_turu tutarlılığı ─────────────────────────────────────
OKUL_SINIF = {
    "ilkokul":  range(1, 5),
    "ortaokul": range(5, 9),
    "lise":     range(9, 13),
    "ihl":      range(9, 13),
    "iho":      range(5, 9),
}
l2_errors = 0
for r in valid_records:
    okul = r.get("okul_turu","")
    sinif = r.get("sinif")
    if sinif is None:
        l2_errors += 1
        continue
    expected = OKUL_SINIF.get(okul)
    if expected and sinif not in expected:
        l2_errors += 1

print(f"L2 (sinif↔okul_turu): {l2_errors} uyuşmazlık")

# ── 4. L3 — Duplikasyon tespiti ───────────────────────────────────────────────
seen: dict[tuple, list[str]] = defaultdict(list)
for r in valid_records:
    key = (r["kazanim_kodu"], r.get("sinif"), r["brans_slug"], r.get("ders",""))
    seen[key].append(r["kaynak_pdf"])

dups = {k: v for k, v in seen.items() if len(v) > 1}
print(f"L3 (duplikasyon):     {len(dups)} çakışan (kod, sinif, brans, ders) dörtlüsü")
if dups:
    top5 = list(dups.items())[:5]
    for k, pdfs in top5:
        print(f"  {k[0]} s{k[1]} [{k[2]}] — {pdfs}")

# ── 5. İstatistikler ───────────────────────────────────────────────────────────
print("\n── Branş bazlı kazanım sayısı ──")
by_brans: Counter = Counter(r["brans_slug"] for r in valid_records)
for brans, cnt in by_brans.most_common():
    print(f"  {brans:<35} {cnt:>5}")

print("\n── Okul türü dağılımı ──")
by_okul: Counter = Counter(r["okul_turu"] for r in valid_records)
for okul, cnt in by_okul.most_common():
    print(f"  {okul:<15} {cnt:>5}")

print("\n── Sınıf dağılımı ──")
by_sinif: Counter = Counter(r.get("sinif") for r in valid_records)
for sinif in sorted(by_sinif):
    print(f"  {sinif:>3}. sınıf   {by_sinif[sinif]:>5}")

print("\n── Extraction yöntemi ──")
by_yontem: Counter = Counter(r.get("extraction_yontemi","?") for r in valid_records)
for y, cnt in by_yontem.most_common():
    print(f"  {y:<20} {cnt:>5}")

# ── 6. Yaz ────────────────────────────────────────────────────────────────────
ALL_FILE.write_text(json.dumps(valid_records, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"\n→ {ALL_FILE.name} yazıldı: {len(valid_records)} kayıt")
