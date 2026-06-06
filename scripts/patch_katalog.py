# -*- coding: utf-8 -*-
"""Tip D katalog düzeltmelerini uygular (idempotent)."""
import sys, io, json
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
from pathlib import Path

KATALOG = Path(__file__).parent / "pdf-katalog.json"
data = json.loads(KATALOG.read_text(encoding="utf-8"))

def match(e, brans=None, prefix=None, siniflar=None):
    if brans and e["brans_slug"] != brans:
        return False
    if prefix and e.get("kod_prefixleri", [None])[0] != prefix:
        return False
    if siniflar and e.get("siniflar") != siniflar:
        return False
    return True

changes = 0

for e in data:
    if e.get("tip") != "D":
        continue

    # ── min_seg=3 entries (3-segment codes like PREFIX.unite.no) ──────────────
    MIN3 = [
        ("beden_egitimi",           "SBTK"),
        ("cografya",                "İÇYÇ"),
        ("felsefe",                 "MAN"),
        ("felsefe",                 "PSK"),
        ("fizik",                   "AST"),
        ("ihl_meslek_dersleri",     "İÇE"),
        ("ihl_meslek_dersleri",     "İF"),
        ("ihl_meslek_dersleri",     "TK"),
        ("ihl_meslek_dersleri",     "İBT"),
        ("tarih",                   "ÇTDT"),
        ("turk_dili_edebiyati",     "TDE1"),
    ]
    for brans, pfx in MIN3:
        if match(e, brans=brans, prefix=pfx):
            if e.get("min_kod_segment") != 3:
                e["min_kod_segment"] = 3
                changes += 1

    # ── TDB: sinif_kaynagi kod → seksiyon ─────────────────────────────────────
    if match(e, brans="din_kulturu", prefix="TDB"):
        if e.get("sinif_kaynagi") != "seksiyon":
            e["sinif_kaynagi"] = "seksiyon"
            changes += 1

    # ── IHL Roman numeral: sabit → kod (so derive_sinif uses Roman→siniflar) ──
    IHL_ROMAN = ["DMUS", "EBRU", "HH", "TZHP"]
    if match(e, brans="ihl_meslek_dersleri") and e.get("kod_prefixleri", [None])[0] in IHL_ROMAN:
        if e.get("sinif_kaynagi") != "kod":
            e["sinif_kaynagi"] = "kod"
            changes += 1

    # ── Temel Matematik [11,12]: prefix MAT → T.MAT ───────────────────────────
    if match(e, brans="matematik", siniflar=[11, 12], prefix="MAT"):
        e["kod_prefixleri"] = ["T.MAT"]
        changes += 1

    # ── MARP: prefix MARP → MARP11, MARP12 + min_seg=3 ──────────────────────
    if match(e, brans="ihl_meslek_dersleri", prefix="MARP"):
        e["kod_prefixleri"] = ["MARP11", "MARP12"]
        if e.get("min_kod_segment") != 3:
            e["min_kod_segment"] = 3
        changes += 1

KATALOG.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"{changes} değişiklik uygulandı → {KATALOG.name}")

# Kontrol: Tip D özetini bas
tipD = [d for d in data if d.get("tip") == "D"]
for d in tipD:
    print(f"  {d['brans_slug'][:22]:22} {str(d.get('kod_prefixleri',[])):20} "
          f"src={d.get('sinif_kaynagi'):8} min={d.get('min_kod_segment','–')}")
