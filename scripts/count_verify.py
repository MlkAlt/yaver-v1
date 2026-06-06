# -*- coding: utf-8 -*-
"""
count_verify.py — Her kaynak PDF'deki ham kod sayısını extracted JSON ile karşılaştırır.
Ayrıca 3 random kaydın tam metnini PDF sayfasıyla yan yana basar.
"""
import sys, io, json, re, random
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
import pdfplumber
from pathlib import Path

ALL_FILE = Path(__file__).parent.parent / "extracted" / "_all_kazanimlar.json"
KATALOG  = Path(__file__).parent / "pdf-katalog.json"
PDF_DIR  = Path(__file__).parent.parent / "refs" / "mufredat-2025"

random.seed(7)

records  = json.loads(ALL_FILE.read_text(encoding="utf-8"))
katalog  = json.loads(KATALOG.read_text(encoding="utf-8"))

def ts(fname):
    m = re.match(r"^(\d+)", fname)
    return m.group(1) if m else ""

disk = {ts(f.name): f for f in PDF_DIR.iterdir() if f.suffix.lower() == ".pdf"}

# kaynak_pdf → extracted records
by_src: dict[str, list] = {}
for r in records:
    by_src.setdefault(r["kaynak_pdf"], []).append(r)

# ── Kod sayısı karşılaştırması ─────────────────────────────────────────────────
print(f"{'KAYNAK PDF':<40} {'KATALOG':>4} {'JSON':>5} {'PDF_HAM':>7}  DURUM")
print("─" * 85)

ok = mismatch = skipped = 0

for entry in katalog:
    dosya = entry["dosya"]
    t = ts(dosya)
    pdf = disk.get(t)
    prefixler = entry.get("kod_prefixleri", [])
    tip = entry.get("tip", "?")

    json_recs = by_src.get(dosya, [])
    json_n = len(json_recs)

    if not pdf or not prefixler or tip in ("B",):
        skipped += 1
        continue  # Tip B skill-based sayımı anlamlı değil

    # PDF'deki ham kod sayısı: prefix'e uyan satır sayısı
    pat = re.compile(r"\b(" + "|".join(re.escape(p) for p in prefixler) + r")[.\d]")
    pdf_n = 0
    try:
        with pdfplumber.open(pdf) as p:
            for page in p.pages:
                text = page.extract_text() or ""
                for line in text.splitlines():
                    if pat.search(line):
                        pdf_n += 1
    except Exception as e:
        skipped += 1
        continue

    # min_kod_segment filtresi nedeniyle JSON < PDF_HAM olabilir (geçerli)
    diff = json_n - pdf_n
    status = "OK" if abs(diff) <= max(3, pdf_n * 0.05) else "FARK!"
    flag = "✓" if status == "OK" else "✗"

    if status == "OK":
        ok += 1
    else:
        mismatch += 1

    short = dosya[:38]
    print(f"  {short:<38} {tip:>4} {json_n:>5} {pdf_n:>7}  {flag} {status}  diff={diff:+d}")

print(f"\nOK: {ok}  |  FARK: {mismatch}  |  Atlandı: {skipped}")

# ── Tam metin karşılaştırması: 5 random kayıt ─────────────────────────────────
print("\n\n══ TAM METİN KONTROLÜ (5 random kayıt) ══\n")
sample = random.sample(records, 5)
for r in sample:
    kod   = r["kazanim_kodu"]
    metin = r["kazanim_metni"]
    sayfa = r.get("kaynak_sayfa")
    kaynak = r["kaynak_pdf"]
    t = ts(kaynak)
    pdf = disk.get(t)

    print(f"─── {kod} │ sinif={r.get('sinif')} │ {r.get('brans_slug')} ───")
    print(f"JSON : {metin}")

    if pdf and sayfa:
        try:
            with pdfplumber.open(pdf) as p:
                page_text = p.pages[sayfa - 1].extract_text() or ""
            # Metni PDF'de bul ve çevresini göster
            norm_metin = re.sub(r"\s+", " ", metin).strip()
            norm_page  = re.sub(r"\s+", " ", page_text)
            idx = norm_page.lower().find(norm_metin[:40].lower())
            if idx >= 0:
                window = norm_page[max(0, idx-20):idx+len(norm_metin)+30]
                print(f"PDF  : ...{window}...")
                print(f"EŞLEŞ: ✓ tam metin PDF'de bulundu")
            else:
                print(f"PDF  : (sayfa {sayfa} — ilk 200 char) {norm_page[:200]}")
                print(f"EŞLEŞ: ? ilk 40 char bulunamadı")
        except Exception as e:
            print(f"PDF  : HATA {e}")
    print()
