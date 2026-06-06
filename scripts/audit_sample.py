# -*- coding: utf-8 -*-
"""
audit_sample.py — Her branştan N kayıt örnekler, PDF sayfasında metin kontrolü yapar.
"""
import sys, io, json, re, random
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
import pdfplumber
from pathlib import Path

ALL_FILE = Path(__file__).parent.parent / "extracted" / "_all_kazanimlar.json"
PDF_DIR  = Path(__file__).parent.parent / "refs" / "mufredat-2025"

SAMPLE_N = 3
random.seed(42)

records = json.loads(ALL_FILE.read_text(encoding="utf-8"))

# Branş → kayıtlar
by_brans: dict[str, list] = {}
for r in records:
    by_brans.setdefault(r["brans_slug"], []).append(r)

# PDF timestamp → dosya eşlemesi
def ts(fname):
    m = re.match(r"^(\d+)", fname)
    return m.group(1) if m else ""

disk = {ts(f.name): f for f in PDF_DIR.iterdir() if f.suffix.lower() == ".pdf"}

def find_pdf(kaynak_pdf: str) -> Path | None:
    t = ts(kaynak_pdf)
    return disk.get(t)

def page_text(pdf_path: Path, page_no: int) -> str:
    try:
        with pdfplumber.open(pdf_path) as p:
            if page_no < 1 or page_no > len(p.pages):
                return ""
            return p.pages[page_no - 1].extract_text() or ""
    except Exception:
        return ""

def normalize(s: str) -> str:
    return re.sub(r"\s+", " ", s.lower().strip())

# ── Audit ─────────────────────────────────────────────────────────────────────
total = ok = warn = err = 0
results: list[dict] = []

for brans in sorted(by_brans):
    pool = by_brans[brans]
    sample = random.sample(pool, min(SAMPLE_N, len(pool)))
    for r in sample:
        total += 1
        kod   = r["kazanim_kodu"]
        metin = r["kazanim_metni"]
        sayfa = r.get("kaynak_sayfa")
        kaynak = r["kaynak_pdf"]
        sinif  = r.get("sinif")

        pdf = find_pdf(kaynak)
        if not pdf:
            status = "NO_PDF"
            err += 1
        elif not sayfa:
            status = "NO_PAGE"
            warn += 1
        else:
            text = page_text(pdf, sayfa)
            # İlk 30 karakterini PDF sayfasında ara
            snippet = normalize(metin[:30])
            if snippet and snippet in normalize(text):
                status = "OK"
                ok += 1
            else:
                # Bir önceki veya sonraki sayfada dene
                found = False
                for pg in [sayfa - 1, sayfa + 1]:
                    t2 = page_text(pdf, pg)
                    if snippet in normalize(t2):
                        found = True
                        break
                if found:
                    status = "OK±1"
                    ok += 1
                else:
                    status = "MISS"
                    warn += 1

        results.append({
            "brans": brans, "kod": kod, "sinif": sinif,
            "metin30": metin[:60], "sayfa": sayfa, "status": status
        })

# ── Rapor ─────────────────────────────────────────────────────────────────────
print(f"\n{'BRANS':<30} {'KOD':<20} {'S':>3}  {'SAYFA':>5}  {'DURUM':<8}  METIN")
print("─" * 110)
current_brans = None
for r in results:
    if r["brans"] != current_brans:
        current_brans = r["brans"]
        print()
    durum = r["status"]
    flag = "✓" if durum.startswith("OK") else ("?" if durum == "NO_PAGE" else "✗")
    print(f"  {r['brans']:<28} {r['kod']:<20} {str(r['sinif'] or '?'):>3}  "
          f"{str(r['sayfa'] or '-'):>5}  {flag} {durum:<7}  {r['metin30']}")

print(f"\n{'─'*60}")
print(f"Toplam örneklenen : {total}")
print(f"OK / OK±1         : {ok}  ({100*ok//total if total else 0}%)")
print(f"MISS / NO_PAGE    : {warn}")
print(f"NO_PDF (disk yok) : {err}")
