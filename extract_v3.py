# -*- coding: utf-8 -*-
"""
extract_v3.py — MEB PDF → kazanım JSON (V3)

Kullanım:
  python extract_v3.py            # Tip A+B, tümü
  python extract_v3.py --tipA     # Sadece Tip A
  python extract_v3.py --debug dosya.pdf  # Tek PDF debug
"""
from __future__ import annotations
import argparse, contextlib, io, json, os, re, sys
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

try:
    import pdfplumber
    _HAS_PDFPLUMBER = True
except ImportError:
    _HAS_PDFPLUMBER = False
    print("[HATA] pdfplumber yüklü değil: pip install pdfplumber")
    sys.exit(1)

ROOT       = Path(__file__).resolve().parent
PDF_DIR    = ROOT / "refs" / "mufredat-2025"
KATALOG    = ROOT / "scripts" / "pdf-katalog.json"
OUT_DIR    = ROOT / "extracted"

MIN_SEG = 4  # varsayılan minimum kod segmenti

# ── Regex ──────────────────────────────────────────────────────────────────────

UNITE_RE   = re.compile(r"^(\d+)\.\s*(?:ÜNİTE|Ünite)\s*[:\s]\s*(.+)$", re.IGNORECASE)
SINIF_HDR  = re.compile(r"\b(\d{1,2})\.\s*SINIF\b", re.IGNORECASE)

_SKILL_CUT = re.compile(
    r"(?:bilme|etme|yapabilme|edebilme|yönetebilme|söyleyebilme|çalabilme|"
    r"oluşturabilme|karşılaştırabilme|çözümleyebilme|belirleyebilme|"
    r"değerlendirebilme|tanımlayabilme|sınıflandırabilme|açıklayabilme|"
    r"sergileyebilme|uygulayabilme|katılabilme|oynayabilme|keşfedebilme|"
    r"geliştirebilme|tanıyabilme|yorumlayabilme|çözebilme|tasarlayabilme|"
    r"tartışabilme|ifade edebilme|yansıtabilme|sunabilme|toplayabilme|"
    r"kaydedebilme|kurabilme|kopyalayabilme|seslendirebilme|getirebilme|"
    r"anlamlandırabilme|geçirebilme|yapılandırabilme|sorgulayabilme|"
    r"tahmin edebilme|bulabilme|genelleyebilme|savunabilme|"
    r"ilişkilendirebilme|fark edebilme|kullanabilme)[.;]?\s*",
    re.IGNORECASE,
)

_BOLUM_RE   = re.compile(r"\s*\d+\.\s*Bölüm\b", re.IGNORECASE)
_TRAIL_NUM  = re.compile(r"\s+\d+\s*$")
_TRAIL_DASH = re.compile(r"\s+[-–]\s*$")


# ── Yardımcı ───────────────────────────────────────────────────────────────────

def clean(text: str) -> str:
    t = re.sub(r"^[.\s\-–—]+", "", text.strip())
    return re.sub(r"\s+", " ", t)[:800]


def trim_metin(text: str) -> str:
    bm = _BOLUM_RE.search(text)
    if bm:
        text = text[:bm.start()].rstrip(" .")
    if len(text) <= 300:
        text = _TRAIL_NUM.sub("", text).strip()
        text = _TRAIL_DASH.sub("", text).strip()
        return text
    m = _SKILL_CUT.search(text)
    if m:
        return text[:m.end()].rstrip(". ")
    return text[:300]


def slugify(fname: str) -> str:
    base = re.sub(r"\.pdf$", "", fname, flags=re.IGNORECASE)
    parts = base.split("-", 1)
    rest = parts[1].strip() if len(parts) > 1 and parts[0].isdigit() else base
    rest = re.sub(r"[^\w\dçşöüğıİÇŞÖÜĞ_-]", "_", rest)
    return re.sub(r"_+", "_", rest).strip("_").lower()


def make_pattern(prefix: str) -> str:
    return re.escape(prefix) + r"(?:\.[A-Za-zİIVXÇŞÖÜĞçşöüğı]{1,4}\d*|\.\d+){1,6}"


def kod_parts(kod: str) -> list[str]:
    return [s for s in kod.split(".") if s]


def is_valid_kod(kod: str, min_seg: int) -> bool:
    parts = kod_parts(kod)
    if len(parts) < min_seg:
        return False
    if len(parts) >= 2 and parts[1].isdigit():
        s = int(parts[1])
        if not (1 <= s <= 12):
            return False
    if not any(c.isdigit() for c in parts[-1]):
        return False
    return True


def score(rec: dict) -> int:
    metin = rec.get("kazanim_metni", "")
    return (200 if _SKILL_CUT.search(metin) else 0) + len(metin)


# ── Dosya adı eşleme ───────────────────────────────────────────────────────────

def _ts_prefix(fname: str) -> str:
    """'2025825154548470-ilkokul türkçe.pdf' → '2025825154548470'"""
    m = re.match(r"^(\d+)", fname)
    return m.group(1) if m else fname[:20]


def build_disk_index() -> dict[str, Path]:
    """timestamp → gerçek Path"""
    idx: dict[str, Path] = {}
    for f in PDF_DIR.iterdir():
        if f.suffix.lower() == ".pdf":
            idx[_ts_prefix(f.name)] = f
    return idx


# ── Text çıkarma ───────────────────────────────────────────────────────────────

def extract_text(pdf: Path) -> str:
    if not _HAS_PDFPLUMBER:
        return ""
    try:
        with pdfplumber.open(pdf) as p:
            return "\n".join(pg.extract_text() or "" for pg in p.pages)
    except Exception:
        return ""


def extract_pages(pdf: Path) -> list[str]:
    """Sayfa başına metin listesi (sayfa numarası için)."""
    if not _HAS_PDFPLUMBER:
        return []
    try:
        with pdfplumber.open(pdf) as p:
            return [pg.extract_text() or "" for pg in p.pages]
    except Exception:
        return []


# ── Ünite haritası ─────────────────────────────────────────────────────────────

def extract_unite_map(pages: list[str]) -> dict[int, dict[int, str]]:
    result: dict[int, dict[int, str]] = {}
    sinif = 0
    for text in pages:
        for line in text.split("\n"):
            sm = re.match(r"^(\d+)\.\s*SINIF", line.strip(), re.IGNORECASE)
            if sm:
                sinif = int(sm.group(1))
                result.setdefault(sinif, {})
                continue
            if sinif:
                m = UNITE_RE.match(line.strip())
                if m:
                    n, ad = int(m.group(1)), clean(m.group(2))
                    if n not in result.get(sinif, {}) and len(ad) > 3:
                        result[sinif][n] = ad[:200]
    return result


# ── Kategorizasyon ─────────────────────────────────────────────────────────────

_ROMAN = {"I": 0, "II": 1, "III": 2, "IV": 3}


def derive_sinif_tipA(kod: str, entry: dict) -> int | None:
    parts = kod_parts(kod)
    siniflar = entry.get("siniflar", [])
    kaynagi = entry.get("sinif_kaynagi", "")

    if kaynagi == "kod":
        if len(parts) >= 1:
            # Grade embedded in prefix (checked first): MARP11.1.2 → sinif=11
            m = re.search(r"(\d{1,2})$", parts[0])
            if m:
                s = int(m.group(1))
                if 1 <= s <= 12:
                    return s
        if len(parts) >= 2:
            if parts[1].isdigit():
                s = int(parts[1])
                if not siniflar or s in siniflar:
                    return s
                # Not an actual grade — treat as 1-based index into siniflar
                srt = sorted(siniflar)
                idx = s - 1
                if 0 <= idx < len(srt):
                    return srt[idx]
                return s
            # Roman numeral → nth grade in siniflar (I=first, II=second …)
            if parts[1] in _ROMAN and siniflar:
                idx = _ROMAN[parts[1]]
                srt = sorted(siniflar)
                if idx < len(srt):
                    return srt[idx]
        # T.PREFIX.sinif or T.D.sinif (alpha at pos 1, digit at pos 2)
        if len(parts) >= 3 and parts[1].isalpha() and parts[2].isdigit():
            s = int(parts[2])
            if 1 <= s <= 12:
                return s

    if kaynagi == "sabit" and len(siniflar) == 1:
        return siniflar[0]
    return None


def derive_okul(brans_slug: str, ders: str, sinif: int | None) -> str:
    if brans_slug == "ihl_meslek_dersleri":
        return "ihl"
    if sinif is None:
        return "lise"
    iho_dersler = {"Kur'an-ı Kerim", "Peygamberimizin Hayatı", "Temel Dinî Bilgiler", "Temel Dini Bilgiler"}
    if sinif in (5, 6, 7, 8) and ders in iho_dersler and brans_slug == "din_kulturu":
        return "iho"
    if sinif in (5, 6, 7, 8) and brans_slug == "arapca":
        return "iho"
    if sinif <= 4:
        return "ilkokul"
    if sinif <= 8:
        return "ortaokul"
    return "lise"


# ── Tip A+B core extraction ────────────────────────────────────────────────────

def extract_records_tipAB(pages: list[str], entry: dict, pdf_name: str) -> list[dict]:
    prefixes    = entry.get("kod_prefixleri", [])
    siniflar    = entry.get("siniflar", [])
    min_seg     = entry.get("min_kod_segment", MIN_SEG)
    brans_slug  = entry["brans_slug"]
    ders        = entry["ders"]
    sinif_kaynagi = entry.get("sinif_kaynagi", "kod")

    if not prefixes:
        return []

    patterns   = [(p, re.compile(make_pattern(p))) for p in prefixes]
    u_map      = extract_unite_map(pages)
    full_text  = "\n".join(pages)
    lines      = full_text.split("\n")

    cur_unite_no: int | None = None
    cur_unite_ad = ""
    cur_sinif:   int | None = None

    candidates: dict[tuple, list[dict]] = {}

    # Sayfa numarası tespiti: hangi satır hangi sayfada?
    page_breaks: list[int] = []  # line index → page index
    line_idx = 0
    for pg_i, pg_text in enumerate(pages):
        for _ in pg_text.split("\n"):
            page_breaks.append(pg_i + 1)
            line_idx += 1

    for li, line in enumerate(lines):
        # Sınıf başlığı
        sh = SINIF_HDR.search(line)
        if sh:
            s = int(sh.group(1))
            if 1 <= s <= 12:
                cur_sinif = s

        # Ünite başlığı
        um = UNITE_RE.match(line.strip())
        if um:
            try:
                cur_unite_no = int(um.group(1))
                cur_unite_ad = clean(um.group(2))[:200]
            except (ValueError, IndexError):
                pass

        # Kazanım kodu arama
        for prefix, pat in patterns:
            matches = list(pat.finditer(line))
            for idx, m in enumerate(matches):
                kod = m.group(0).rstrip(".")
                if not is_valid_kod(kod, min_seg):
                    continue

                end = matches[idx + 1].start() if idx + 1 < len(matches) else len(line)
                ad = clean(line[m.end():end])

                # Tire kırığı düzeltme
                if ad.endswith("-") and li + 1 < len(lines):
                    nxt = lines[li + 1].strip()
                    if nxt and not any(p.search(nxt) for _, p in patterns):
                        ad = clean(ad[:-1] + nxt)
                # Kısa devam satırı
                elif len(ad) < 8 and li + 1 < len(lines):
                    nxt = lines[li + 1].strip()
                    if nxt and not re.match(r"^[A-ZÇĞİÖŞÜ]", nxt[:2]) and not any(p.search(nxt) for _, p in patterns):
                        ad = clean(ad + " " + nxt)
                # Cümle tamamlanmadıysa bir sonraki satıra bak
                if (len(ad) >= 8
                        and not ad.rstrip().endswith(".")
                        and not _SKILL_CUT.search(ad[-60:])
                        and li + 1 < len(lines)):
                    nxt = lines[li + 1].strip()
                    if (nxt and len(nxt) <= 80
                            and not re.match(r"^[A-ZÇĞİÖŞÜ]", nxt[:2])
                            and not any(p.search(nxt) for _, p in patterns)):
                        ad = clean(ad + " " + nxt)

                if len(ad) < 8:
                    continue
                if ad[0] in "(),-–":
                    continue
                ad = trim_metin(ad)

                # Sınıf tespiti
                sinif = derive_sinif_tipA(kod, entry)
                if sinif is None and sinif_kaynagi == "seksiyon" and cur_sinif is not None:
                    if not siniflar or cur_sinif in siniflar:
                        sinif = cur_sinif
                if sinif is None:
                    continue
                if siniflar and sinif not in siniflar:
                    continue

                # Ünite no
                parts    = kod_parts(kod)
                unite_no = cur_unite_no
                if len(parts) >= 3 and parts[2].isdigit():
                    unite_no = int(parts[2])

                # Ünite adı
                unite_ad = cur_unite_ad
                if unite_no and sinif:
                    mapped = u_map.get(sinif, {}).get(unite_no)
                    if mapped:
                        unite_ad = mapped

                page_no = page_breaks[li] if li < len(page_breaks) else 0

                rec = {
                    "kazanim_kodu":  kod,
                    "kazanim_metni": ad,
                    "sinif":         sinif,
                    "okul_turu":     derive_okul(brans_slug, ders, sinif),
                    "brans_slug":    brans_slug,
                    "ders":          ders,
                    "unite_no":      unite_no or 0,
                    "unite_adi":     unite_ad or (f"Ünite {unite_no}" if unite_no else ""),
                    "kaynak_pdf":    pdf_name,
                    "kaynak_sayfa":  page_no,
                    "extraction_yontemi": f"regex_tip{entry.get('tip', 'A')}",
                    "confidence":    "high",
                }
                candidates.setdefault((kod, sinif), []).append(rec)

    # Her (kod, sinif) için en iyi kaydı seç
    found = [max(recs, key=score) for recs in candidates.values()]

    # Prefix-only kodları düşür
    codes = {r["kazanim_kodu"] for r in found}
    drop  = {k for k in codes if any(c.startswith(k + ".") for c in codes if c != k)}
    result = [r for r in found if r["kazanim_kodu"] not in drop]
    result.sort(key=lambda x: (x["sinif"] or 0, x["unite_no"], x["kazanim_kodu"]))
    return result


# ── Tek PDF işle ───────────────────────────────────────────────────────────────

def process_one(entry: dict, disk_idx: dict[str, Path], debug: bool = False) -> tuple[str, int]:
    """(durum_mesajı, kayıt_sayısı)"""
    tip = entry.get("tip", "A")
    fname = entry["dosya"]

    if tip not in ("A", "B", "C", "D"):
        return f"SKIP (bilinmeyen tip: {tip})", 0

    # Disk dosyasını bul
    ts = _ts_prefix(fname)
    pdf_path = disk_idx.get(ts)
    if pdf_path is None:
        return f"HATA (disk'te bulunamadı: {ts})", 0

    pages = extract_pages(pdf_path)
    if not pages or not any(p.strip() for p in pages):
        return "HATA (metin çıkarılamadı)", 0

    records = extract_records_tipAB(pages, entry, fname)

    if not records:
        return f"HATA (0 kazanım — tip={tip})", 0

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    slug     = slugify(fname)
    out_path = OUT_DIR / f"{slug}.json"
    out_path.write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")

    if debug:
        for r in records[:3]:
            print(f"  {r['kazanim_kodu']} s{r['sinif']} → {r['kazanim_metni'][:60]}")

    return f"OK ({len(records)} kazanım)", len(records)


# ── Toplu çalıştır ─────────────────────────────────────────────────────────────

def batch(tip_filter: str | None = None) -> None:
    with open(KATALOG, encoding="utf-8") as f:
        katalog: list[dict] = json.load(f)

    disk_idx = build_disk_index()
    ok = skip = fail = total = 0
    problems: list[tuple[str, str]] = []

    for entry in katalog:
        tip = entry.get("tip", "A")
        _allowed = {
            "A": {"A"}, "AB": {"A","B"}, "C": {"C"}, "D": {"D"},
        }.get(tip_filter, {"A","B","C","D"})
        if tip_filter and tip not in _allowed:
            continue

        ders = entry["ders"][:40]
        tag  = f"{ders:<42} [Tip {tip}]"

        status, count = process_one(entry, disk_idx)
        print(f"{tag}  {status}", flush=True)

        if status.startswith("OK"):
            ok += 1
            total += count
        elif status.startswith("SKIP"):
            skip += 1
        else:
            fail += 1
            problems.append((entry["dosya"][:50], status))

    print(f"\n{'='*70}")
    print(f"ÖZET: {ok} OK | {skip} skip | {fail} hata | {total} toplam kazanım")
    if problems:
        print(f"\nSorunlar:")
        for n, s in problems:
            print(f"  {n:<50} {s}")
    print("=" * 70)


# ── Giriş noktası ──────────────────────────────────────────────────────────────

def main() -> None:
    p = argparse.ArgumentParser(description="MEB PDF → kazanım JSON V3")
    p.add_argument("--tipA",  action="store_true", help="Sadece Tip A")
    p.add_argument("--tipAB", action="store_true", help="Tip A + B")
    p.add_argument("--tipC",  action="store_true", help="Sadece Tip C")
    p.add_argument("--tipD",  action="store_true", help="Sadece Tip D")
    p.add_argument("--debug", metavar="PDF", help="Tek PDF debug (dosya adı başı)")
    args = p.parse_args()

    if args.debug:
        with open(KATALOG, encoding="utf-8") as f:
            katalog = json.load(f)
        disk_idx = build_disk_index()
        hits = [e for e in katalog if args.debug.lower() in e["dosya"].lower()]
        if not hits:
            print(f"Bulunamadı: {args.debug}")
            return
        for entry in hits:
            print(f"\n=== {entry['ders']} (Tip {entry['tip']}) ===")
            status, count = process_one(entry, disk_idx, debug=True)
            print(f"Sonuç: {status}")
        return

    tip_filter = ("A" if args.tipA else
                  "C" if args.tipC else
                  "D" if args.tipD else "AB")
    batch(tip_filter)


if __name__ == "__main__":
    main()
