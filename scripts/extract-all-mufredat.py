# -*- coding: utf-8 -*-
"""
MEB müfredat PDF → kazanım JSON çıkarıcı.
Girdi: scripts/pdf-brans-map.json
Çıktı: extracted/<slug>.json, extracted/_summary.txt, refs/kazanimlar_meb_2025.json

Kullanım:
  python scripts/extract-all-mufredat.py              # çıkar + birleştir
  python scripts/extract-all-mufredat.py --resume     # mevcut JSON'ları atla
  python scripts/extract-all-mufredat.py --force      # tümünü yeniden çıkar
  python scripts/extract-all-mufredat.py --audit-only # birleşik JSON diff audit
"""
from __future__ import annotations

import argparse
import io
import json
import os
import re
import sys
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

import pdfplumber

ROOT = Path(__file__).resolve().parents[1]
PDF_DIR = ROOT / "refs" / "mufredat-2025"
MAP_FILE = ROOT / "scripts" / "pdf-brans-map.json"
OUT_DIR = ROOT / "extracted"
LOG_DIR = OUT_DIR / "_logs"
MERGED_FILE = ROOT / "refs" / "kazanimlar_meb_2025.json"
AUDIT_FILE = ROOT / "refs" / "kazanimlar_audit_report.txt"
PROGRESS_FILE = OUT_DIR / "_progress.txt"

MIN_SEGMENTS_DEFAULT = 4  # örn. MAT.5.1.1 — ünite düzeyi MAT.5.1 elenir

UNITE_HEADER_RE = re.compile(
    r"(?:^|\s)(?:ÜNİTE|Ünite|Unite)\s*(\d+)\s*[-–:.]?\s*(.*)$",
    re.IGNORECASE,
)
UNITE_NUM_HEADER_RE = re.compile(
    r"^(\d+)\.\s*(?:ÜNİTE|Ünite)\s*[-–:]?\s*(.*)$",
    re.IGNORECASE,
)

BRANS_AD = {
    "matematik": "Matematik",
    "turkce": "Türkçe",
    "turk_dili_edebiyati": "Türk Dili ve Edebiyatı",
    "fen_bilimleri": "Fen Bilimleri",
    "sosyal_bilgiler": "Sosyal Bilgiler",
    "tarih": "Tarih",
    "cografya": "Coğrafya",
    "felsefe": "Felsefe",
    "fizik": "Fizik",
    "kimya": "Kimya",
    "biyoloji": "Biyoloji",
    "ingilizce": "İngilizce",
    "almanca": "Almanca",
    "din_kulturu": "Din Kültürü ve Ahlak Bilgisi",
    "arapca": "Arapça",
    "gorsel_sanatlar": "Görsel Sanatlar",
    "muzik": "Müzik",
    "beden_egitimi": "Beden Eğitimi ve Spor",
    "bilisim_teknolojileri": "Bilişim Teknolojileri",
    "teknoloji_tasarim": "Teknoloji ve Tasarım",
    "ihl_meslek_dersleri": "İHL Meslek Dersleri",
    "hayat_bilgisi": "Hayat Bilgisi",
    "sinif_ogretmeni": "Sınıf Öğretmenliği",
}


def slugify(name: str) -> str:
    base = name.rsplit(".pdf", 1)[0]
    parts = base.split("-", 1)
    rest = parts[1].strip() if len(parts) > 1 and parts[0].isdigit() else base
    rest = re.sub(r"[^\w\dçşöüğıİÇŞÖÜĞ_-]", "_", rest)
    rest = re.sub(r"_+", "_", rest).strip("_").lower()
    return rest


def make_pattern(prefix: str) -> str:
    p = re.escape(prefix)
    return p + r"(?:\.[A-Za-zİIVXÇŞÖÜĞçşöüğı]+\d*|\.\d+){1,6}"


def kod_segments(kod: str) -> list[str]:
    return [s for s in kod.split(".") if s]


def derive_unite_from_kod(kod: str) -> tuple[int | None, str]:
    parts = kod_segments(kod)
    if len(parts) < 4:
        return None, ""
    seg = parts[2]
    if seg.isdigit():
        return int(seg), ""
    return None, ""


def derive_okul_tipi(info: dict, sinif: int | None, ders: str) -> str | None:
    if info.get("okul_tipi"):
        return info["okul_tipi"]
    slug = info.get("brans_slug") or ""
    if slug == "ihl_meslek_dersleri":
        return "ihl"
    if sinif is None:
        return None
    # İmam hatip ortaokul: DKAB/PH/KK/TDB — map'teki ders + sınıf 5-8
    iho_dersler = {
        "Kur'an-ı Kerim",
        "Peygamberimizin Hayatı",
        "Temel Dinî Bilgiler",
        "Temel Dini Bilgiler",
    }
    if sinif in (5, 6, 7, 8) and ders in iho_dersler and slug == "din_kulturu":
        return "iho"
    if sinif in (5, 6, 7, 8) and slug == "arapca" and "Mesleki" not in ders:
        return "iho"
    if sinif <= 4:
        return "ilkokul"
    if sinif <= 8:
        return "ortaokul"
    return "lise"


def derive_sinif(kod: str, info: dict) -> int | None:
    if info.get("sinif_kaynagi") == "kod":
        parts = kod_segments(kod)
        if len(parts) >= 2 and parts[1].isdigit():
            return int(parts[1])
        # Roma: SBC.I → 10 (map notu)
        if parts[1] in ("I", "II", "III"):
            return {"I": 10, "II": 11, "III": 12}.get(parts[1])
    if info.get("sinif_kaynagi") == "sabit" and len(info.get("siniflar", [])) == 1:
        return info["siniflar"][0]
    return None


def clean_ad(text: str) -> str:
    t = text.strip()
    t = re.sub(r"^[\.\s]+", "", t)
    t = re.sub(r"\s+", " ", t)
    return t[:500]


def extract_ad(line: str, m: re.Match, next_start: int | None, lines: list[str], line_idx: int) -> str:
    end = next_start if next_start is not None else len(line)
    after = clean_ad(line[m.end() : end])
    if len(after) < 15 and line_idx + 1 < len(lines):
        nxt = lines[line_idx + 1].strip()
        if nxt and not re.match(r"^[A-ZÇĞİÖŞÜ]", nxt[:3]):
            after = clean_ad((after + " " + nxt).strip())
    return after


def is_valid_kod(kod: str, min_segments: int) -> bool:
    parts = kod_segments(kod)
    if len(parts) < min_segments:
        return False
    if len(parts) >= 2 and parts[1].isdigit():
        s = int(parts[1])
        if s < 1 or s > 12:
            return False
    return True


def filter_prefix_codes(rows: list[dict]) -> list[dict]:
    codes = {r["kod"] for r in rows}
    drop = set()
    for k in codes:
        prefix = k + "."
        if any(c.startswith(prefix) for c in codes if c != k):
            drop.add(k)
    return [r for r in rows if r["kod"] not in drop]


def write_progress(msg: str) -> None:
    ts = datetime.now(timezone.utc).strftime("%H:%M:%S")
    line = f"[{ts}] {msg}\n"
    print(line.rstrip())
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    with open(PROGRESS_FILE, "a", encoding="utf-8") as f:
        f.write(line)
        f.flush()
        os.fsync(f.fileno())


def process_pdf(pdf_name: str, info: dict, min_segments: int) -> list[dict]:
    pdf_path = PDF_DIR / pdf_name
    prefixes = info.get("kod_prefixleri", [])
    patterns = [(p, re.compile(make_pattern(p))) for p in prefixes]

    current_unite_no: int | None = None
    current_unite_ad = ""
    found: list[dict] = []
    seen: set[str] = set()

    with pdfplumber.open(pdf_path) as pdf:
        for pnum, page in enumerate(pdf.pages, 1):
            text = page.extract_text() or ""
            lines = text.split("\n")
            for line in lines:
                um = UNITE_HEADER_RE.search(line) or UNITE_NUM_HEADER_RE.search(line.strip())
                if um:
                    current_unite_no = int(um.group(1))
                    current_unite_ad = (um.group(2) or "").strip()[:200]

            for line_idx, line in enumerate(lines):
                for prefix, pat in patterns:
                    matches = list(pat.finditer(line))
                    for i, m in enumerate(matches):
                        kod = m.group(0).rstrip(".")
                        if kod in seen:
                            continue
                        if not is_valid_kod(kod, min_segments):
                            continue

                        next_start = matches[i + 1].start() if i + 1 < len(matches) else None
                        ad = extract_ad(line, m, next_start, lines, line_idx)
                        if len(ad) < 8:
                            continue

                        sinif = derive_sinif(kod, info)
                        if sinif is None:
                            continue
                        if info.get("siniflar") and sinif not in info["siniflar"]:
                            continue

                        unite_no, unite_from_kod = derive_unite_from_kod(kod)
                        unite_ad = current_unite_ad
                        if not unite_no:
                            unite_no = current_unite_no
                        if unite_from_kod and not unite_ad:
                            unite_ad = ""

                        okul_tipi = derive_okul_tipi(info, sinif, info["ders"])

                        entry = {
                            "kod": kod,
                            "ad": ad,
                            "sinif": sinif,
                            "unite_no": unite_no or 0,
                            "unite_ad": unite_ad or f"Ünite {unite_no or 0}",
                            "ders": info["ders"],
                            "brans_slug": info["brans_slug"],
                            "okul_tipi": okul_tipi,
                            "kaynak_pdf": pdf_name,
                            "kaynak_sayfa": pnum,
                        }
                        seen.add(kod)
                        found.append(entry)

    return filter_prefix_codes(found)


def run_extract(resume: bool, force: bool) -> tuple[list[str], int, int, int]:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    LOG_DIR.mkdir(parents=True, exist_ok=True)

    with open(MAP_FILE, encoding="utf-8") as f:
        pdf_map = json.load(f)

    log_lines: list[str] = []
    total = 0
    processed = skipped = errors = 0
    pdf_items = [(k, v) for k, v in pdf_map.items() if not k.startswith("_")]

    write_progress(f"Başladı — {len(pdf_items)} PDF haritada")

    for idx, (pdf_name, info) in enumerate(pdf_items, 1):
        if not info.get("brans_slug"):
            log_lines.append(f"SKIP: {pdf_name} — branş yok")
            skipped += 1
            continue
        if not info.get("kod_prefixleri"):
            log_lines.append(f"PREFIX YOK: {pdf_name}")
            skipped += 1
            continue
        if not (PDF_DIR / pdf_name).exists():
            log_lines.append(f"PDF YOK: {pdf_name}")
            skipped += 1
            continue

        slug = slugify(pdf_name)
        out_path = OUT_DIR / f"{slug}.json"
        min_seg = info.get("min_kod_segment", MIN_SEGMENTS_DEFAULT)

        if resume and not force and out_path.exists():
            try:
                existing = json.loads(out_path.read_text(encoding="utf-8"))
                if len(existing) >= 3:
                    write_progress(f"[{idx}/{len(pdf_items)}] ATLA {pdf_name[:50]} ({len(existing)} kayıt)")
                    total += len(existing)
                    processed += 1
                    log_lines.append(f"SKIP(resume) {pdf_name[:55]} | {len(existing)}")
                    continue
            except Exception:
                pass

        write_progress(f"[{idx}/{len(pdf_items)}] İşleniyor {pdf_name[:55]}...")
        try:
            found = process_pdf(pdf_name, info, min_seg)
            out_path.write_text(json.dumps(found, ensure_ascii=False, indent=2), encoding="utf-8")

            sinif_d = Counter(str(x["sinif"]) for x in found)
            log_lines.append(
                f"OK  {pdf_name[:58].ljust(58)} | {len(found):4d} | sinif={dict(sorted(sinif_d.items()))}"
            )
            write_progress(f"[{idx}/{len(pdf_items)}] BİTTİ {pdf_name[:48]} → {len(found)} kazanım")
            total += len(found)
            processed += 1

            with open(LOG_DIR / f"{slug}.log", "w", encoding="utf-8") as lf:
                lf.write(f"PDF: {pdf_name}\nToplam: {len(found)}\n\nÖrnek:\n")
                for e in found[:8]:
                    lf.write(f"  {e['kod']}: {e['ad'][:90]}\n")
        except Exception as e:
            log_lines.append(f"HATA {pdf_name}: {e}")
            errors += 1
            write_progress(f"HATA {pdf_name}: {e}")

    summary_path = OUT_DIR / "_summary.txt"
    summary_path.write_text(
        "\n".join(log_lines)
        + f"\n\nİşlenen: {processed}, Skip: {skipped}, Hata: {errors}, Toplam kazanım: {total}\n",
        encoding="utf-8",
    )
    write_progress(f"Extract bitti — {processed} PDF, {total} kazanım, {errors} hata")
    return log_lines, processed, skipped, total


def merge_all() -> dict:
    all_rows: list[dict] = []
    dupes: Counter[str] = Counter()

    for p in sorted(OUT_DIR.glob("*.json")):
        if p.name.startswith("_"):
            continue
        rows = json.loads(p.read_text(encoding="utf-8"))
        for r in rows:
            dupes[r["kod"]] += 1
            all_rows.append(r)

    unique: dict[str, dict] = {}
    for r in all_rows:
        k = r["kod"]
        if k not in unique or len(r.get("ad", "")) > len(unique[k].get("ad", "")):
            unique[k] = r

    merged_list = sorted(unique.values(), key=lambda x: (x.get("brans_slug", ""), x.get("sinif", 0), x.get("kod", "")))
    payload = {
        "meta": {
            "surum": "2025-07",
            "olusturma": datetime.now(timezone.utc).isoformat(),
            "toplam_kazanim": len(merged_list),
            "ham_satir": len(all_rows),
            "cift_kod": sum(1 for c, n in dupes.items() if n > 1),
        },
        "kazanimlar": merged_list,
    }
    MERGED_FILE.parent.mkdir(parents=True, exist_ok=True)
    MERGED_FILE.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    write_progress(f"Birleşik JSON: {MERGED_FILE} — {len(merged_list)} benzersiz kazanım")
    return payload


def quality_report(payload: dict) -> str:
    rows = payload["kazanimlar"]
    lines = ["=== KALİTE RAPORU ===", f"Toplam: {len(rows)}"]

    short_ad = [r for r in rows if len(r.get("ad", "")) < 20]
    no_unite = [r for r in rows if not r.get("unite_no")]
    no_okul = [r for r in rows if not r.get("okul_tipi")]
    kod_in_ad = [r for r in rows if re.search(r"[A-ZÇĞİÖŞÜ]{2,}\.\d", r.get("ad", ""))]

    lines.append(f"Kısa metin (<20 char): {len(short_ad)}")
    lines.append(f"okul_tipi eksik: {len(no_okul)}")
    lines.append(f"ünite_no=0: {sum(1 for r in rows if r.get('unite_no') == 0)}")
    lines.append(f"Metinde başka kod izi: {len(kod_in_ad)}")

    by_brans = Counter(r["brans_slug"] for r in rows)
    lines.append("\nBranş dağılımı:")
    for b, n in by_brans.most_common():
        lines.append(f"  {b}: {n}")

    lines.append("\nÖrnek kayıtlar (ilk 5):")
    for r in rows[:5]:
        lines.append(f"  {r['kod']} | s{r['sinif']} | {r['okul_tipi']} | {r['ad'][:70]}")

    lines.append("\nŞüpheli örnekler (kısa metin, max 5):")
    for r in short_ad[:5]:
        lines.append(f"  {r['kod']} → {r.get('ad', '')[:80]}")

    report = "\n".join(lines)
    (OUT_DIR / "_quality_report.txt").write_text(report, encoding="utf-8")
    return report


def audit_diff(payload: dict, sample_per_pdf: int = 15) -> str:
    """PDF metninde kod geçiyor mu + ad benzerliği kabaca."""
    rows = payload["kazanimlar"]
    by_pdf: dict[str, list[dict]] = defaultdict(list)
    for r in rows:
        by_pdf[r["kaynak_pdf"]].append(r)

    ok = miss = mismatch = 0
    lines = ["=== DIFF AUDIT (pdfplumber metin) ==="]

    for pdf_name, items in sorted(by_pdf.items()):
        path = PDF_DIR / pdf_name
        if not path.exists():
            continue
        try:
            with pdfplumber.open(path) as pdf:
                full = "\n".join((pg.extract_text() or "") for pg in pdf.pages)
        except Exception as e:
            lines.append(f"{pdf_name}: PDF okunamadı — {e}")
            continue

        for r in items[:sample_per_pdf]:
            kod = r["kod"]
            if kod not in full and kod.replace("İ", "I") not in full:
                miss += 1
                continue
            idx = full.find(kod)
            if idx < 0:
                idx = full.find(kod.replace("İ", "I"))
            snippet = clean_ad(full[idx + len(kod) : idx + len(kod) + 120])
            ad = r.get("ad", "")
            if not snippet or (len(ad) > 10 and snippet[:25] not in ad and ad[:25] not in snippet):
                mismatch += 1
            else:
                ok += 1

    lines.append(f"Örneklem eşleşme: ok={ok}, metin farkı={mismatch}, kod PDF'te yok={miss}")
    report = "\n".join(lines)
    AUDIT_FILE.write_text(report, encoding="utf-8")
    write_progress(f"Audit: ok={ok} mismatch={mismatch} miss={miss}")
    return report


def sql_escape(s: str) -> str:
    return s.replace("'", "''")


def generate_migration(payload: dict) -> Path:
    rows = payload["kazanimlar"]
    mig_path = ROOT / "supabase" / "migrations" / "20260416000044_seed_kazanimlar_meb_2025.sql"
    lines = [
        "-- Migration 044: MEB 2025 müfredat kazanımları (extract-all-mufredat.py)",
        f"-- {len(rows)} kazanım — {datetime.now(timezone.utc).date().isoformat()}",
        "",
        "ALTER TABLE kazanimlar ADD COLUMN IF NOT EXISTS ders TEXT;",
        "ALTER TABLE kazanimlar ADD COLUMN IF NOT EXISTS okul_tipi TEXT;",
        "ALTER TABLE branslar ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;",
        "ALTER TABLE branslar ADD COLUMN IF NOT EXISTS kademe TEXT;",
        "",
        "INSERT INTO branslar (ad, ikon, renk, sira, slug, kademe) VALUES",
        "  ('İHL Meslek Dersleri', '🕌', '#F5F5F4', 22, 'ihl_meslek_dersleri', 'lise'),",
        "  ('Teknoloji ve Tasarım', '🔧', '#F1F5F9', 23, 'teknoloji_tasarim', 'ortaokul')",
        "ON CONFLICT (ad) DO UPDATE SET slug = EXCLUDED.slug, kademe = EXCLUDED.kademe;",
        "",
        "UPDATE branslar SET slug = 'matematik', kademe = 'tum' WHERE ad = 'Matematik';",
        "UPDATE branslar SET slug = 'turkce', kademe = 'ilkokul' WHERE ad = 'Türkçe';",
        "UPDATE branslar SET slug = 'turk_dili_edebiyati', kademe = 'lise' WHERE ad = 'Türk Dili ve Edebiyatı';",
        "UPDATE branslar SET slug = 'fen_bilimleri', kademe = 'ortaokul' WHERE ad = 'Fen Bilimleri';",
        "UPDATE branslar SET slug = 'sosyal_bilgiler', kademe = 'ortaokul' WHERE ad = 'Sosyal Bilgiler';",
        "UPDATE branslar SET slug = 'tarih', kademe = 'lise' WHERE ad = 'Tarih';",
        "UPDATE branslar SET slug = 'cografya', kademe = 'lise' WHERE ad = 'Coğrafya';",
        "UPDATE branslar SET slug = 'felsefe', kademe = 'lise' WHERE ad = 'Felsefe';",
        "UPDATE branslar SET slug = 'fizik', kademe = 'lise' WHERE ad = 'Fizik';",
        "UPDATE branslar SET slug = 'kimya', kademe = 'lise' WHERE ad = 'Kimya';",
        "UPDATE branslar SET slug = 'biyoloji', kademe = 'lise' WHERE ad = 'Biyoloji';",
        "UPDATE branslar SET slug = 'ingilizce', kademe = 'tum' WHERE ad = 'İngilizce';",
        "UPDATE branslar SET slug = 'almanca', kademe = 'tum' WHERE ad = 'Almanca';",
        "UPDATE branslar SET slug = 'din_kulturu', kademe = 'tum' WHERE ad = 'Din Kültürü ve Ahlak Bilgisi';",
        "UPDATE branslar SET slug = 'arapca', kademe = 'tum' WHERE ad = 'Arapça';",
        "UPDATE branslar SET slug = 'gorsel_sanatlar', kademe = 'tum' WHERE ad = 'Görsel Sanatlar';",
        "UPDATE branslar SET slug = 'muzik', kademe = 'tum' WHERE ad = 'Müzik';",
        "UPDATE branslar SET slug = 'beden_egitimi', kademe = 'tum' WHERE ad = 'Beden Eğitimi ve Spor';",
        "UPDATE branslar SET slug = 'bilisim_teknolojileri', kademe = 'ortaokul' WHERE ad = 'Bilişim Teknolojileri';",
        "UPDATE branslar SET slug = 'hayat_bilgisi', kademe = 'ilkokul' WHERE ad = 'Hayat Bilgisi';",
        "UPDATE branslar SET slug = 'sinif_ogretmeni', kademe = 'ilkokul' WHERE ad = 'Sınıf Öğretmenliği';",
        "",
        "INSERT INTO kazanimlar (kod, brans_id, sinif, unite_no, unite_ad, ad, ders, okul_tipi) VALUES",
    ]

    values = []
    for r in rows:
        slug = r["brans_slug"]
        brans_ad = BRANS_AD.get(slug, slug)
        unite_no = int(r.get("unite_no") or 0) or 1
        unite_ad = sql_escape(r.get("unite_ad") or f"Ünite {unite_no}")
        ad = sql_escape(r.get("ad") or "")
        ders = sql_escape(r.get("ders") or "")
        okul = sql_escape(r.get("okul_tipi") or "lise")
        kod = sql_escape(r["kod"])
        sinif = int(r["sinif"])
        values.append(
            f"  ('{kod}', (SELECT id FROM branslar WHERE slug = '{slug}' LIMIT 1), "
            f"{sinif}, {unite_no}, '{unite_ad}', '{ad}', '{ders}', '{okul}')"
        )

    batch = 80
    for i in range(0, len(values), batch):
        chunk = values[i : i + batch]
        if i > 0:
            lines.append("INSERT INTO kazanimlar (kod, brans_id, sinif, unite_no, unite_ad, ad, ders, okul_tipi) VALUES")
        lines.append(",\n".join(chunk))
        lines.append("ON CONFLICT (kod) DO UPDATE SET")
        lines.append("  ad = EXCLUDED.ad, unite_no = EXCLUDED.unite_no, unite_ad = EXCLUDED.unite_ad,")
        lines.append("  ders = EXCLUDED.ders, okul_tipi = EXCLUDED.okul_tipi, brans_id = EXCLUDED.brans_id;")
        lines.append("")

    mig_path.write_text("\n".join(lines), encoding="utf-8")
    write_progress(f"Migration yazıldı: {mig_path.name} ({len(rows)} satır)")
    return mig_path


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--resume", action="store_true", help="Mevcut JSON dosyalarını atla")
    parser.add_argument("--force", action="store_true", help="Tüm PDF'leri yeniden işle")
    parser.add_argument("--audit-only", action="store_true", help="Sadece birleşik dosyada audit")
    parser.add_argument("--no-migrate", action="store_true", help="SQL üretme")
    args = parser.parse_args()

    if args.audit_only:
        if not MERGED_FILE.exists():
            print("Önce extract çalıştırın.")
            sys.exit(1)
        payload = json.loads(MERGED_FILE.read_text(encoding="utf-8"))
        print(audit_diff(payload))
        print(quality_report(payload))
        return

    if args.force:
        for p in OUT_DIR.glob("*.json"):
            if not p.name.startswith("_"):
                p.unlink()

    run_extract(resume=args.resume and not args.force, force=args.force)
    payload = merge_all()
    print(quality_report(payload))
    print(audit_diff(payload))
    if not args.no_migrate:
        generate_migration(payload)


if __name__ == "__main__":
    main()
