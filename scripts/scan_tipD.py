# -*- coding: utf-8 -*-
import sys, io, re, json
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
import pdfplumber
from pathlib import Path

pdf_dir = Path(__file__).parent.parent / "refs" / "mufredat-2025"
data = json.load(open(Path(__file__).parent / "pdf-katalog.json", encoding="utf-8"))
tipD = [d for d in data if d.get("tip") == "D"]

def ts(fname):
    m = re.match(r"^(\d+)", fname)
    return m.group(1) if m else ""

disk = {ts(f.name): f for f in pdf_dir.iterdir() if f.suffix.lower() == ".pdf"}

TARGETS = [
    ("matematik",           [9,10,11,12], "MAT",   r"MAT\.\d"),
    ("matematik",           [11,12],       "MAT",   r"MAT\.\d"),
    ("din_kulturu",         [7,8],         "TDB",   r"TDB\.\d"),
    ("turk_dili_edebiyati", [9,10,11,12],  "TDE1",  r"TDE\d\.\d"),
    ("tarih",               [10,11,12],    "SBC",   r"SBC[\.\d]"),
    ("ihl_meslek_dersleri", [9,10,11,12],  "KKIHL", r"KKIHL"),
    ("ihl_meslek_dersleri", [11,12],       "KAK",   r"KAK[\.\d]"),
    ("felsefe",             [10],          "MAN",   r"MAN[\.\d]"),
    ("fizik",               [9],           "AST",   r"AST[\.\d]"),
]

for brans, siniflar, prefix, pat_str in TARGETS:
    pat = re.compile(pat_str)
    entry = next((d for d in tipD if d["brans_slug"]==brans and d["siniflar"]==siniflar), None)
    if not entry:
        print(f"NOT FOUND in catalog: {brans} {siniflar}")
        continue
    t = ts(entry["dosya"])
    pdf = disk.get(t)
    if not pdf:
        print(f"PDF NOT ON DISK: {entry['dosya'][:50]}")
        continue

    found_page = None
    sample_text = ""
    try:
        with pdfplumber.open(pdf) as p:
            total = len(p.pages)
            for i, pg in enumerate(p.pages[:120]):
                text = pg.extract_text() or ""
                if pat.search(text):
                    codes = pat.findall(text)
                    found_page = i + 1
                    sample_text = text[:500]
                    break
    except Exception as e:
        print(f"ERROR {prefix}: {e}")
        continue

    if found_page:
        print(f"=== {prefix} ({brans}) p{found_page}/{total} ===")
        print(sample_text[:400])
    else:
        print(f"=== {prefix} ({brans}) NO CODES in first 120 pages / total={total} ===")
        # Show page 10-12 to understand structure
        try:
            with pdfplumber.open(pdf) as p:
                for i in [9, 10, 11]:
                    text = p.pages[i].extract_text() or ""
                    if text.strip():
                        print(f"  Page {i+1}: {text[:300]}")
                        break
        except:
            pass
    print()
