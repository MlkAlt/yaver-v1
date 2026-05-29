# -*- coding: utf-8 -*-
"""
MEB müfredat PDF extraction — pdftotext -layout tabanlı.
Standart format branşlar için: Kimya, Fizik, Biyoloji, Tarih,
Müzik, Görsel Sanatlar, Beden, Sosyal Bilgiler, Hayat Bilgisi,
Bilişim, Teknoloji Tasarım, Matematik, Din Kültürü.

Her kazanım format:
  ...SÜREÇ BİLEŞENLERİ  KÖD.sinif.ünite.no.  Başlık
                              a)  Alt kazanım 1
                              b)  Alt kazanım 2
  ...İÇERİK ÇERÇEVESİ   (yeni blok başlangıcı)
"""
import re, json, subprocess
from pathlib import Path
from collections import defaultdict

PDFTOTEXT = r"C:\Users\melik\AppData\Local\poppler\poppler-24.08.0\Library\bin\pdftotext.exe"
PDF_DIR   = Path("refs/mufredat-2025")
OUT_DIR   = Path("refs/mufredat-2025/extracted")
OUT_DIR.mkdir(exist_ok=True)

# Branş konfigürasyonu: slug → (prefix_regex, pdf_files, siniflar)
BRANSLAR = {
    "kimya": (
        r'KİM\.(\d+)\.(\d+)\.(\d+)',
        ["2026518151539674-kimya.pdf"],
        [9, 10, 11, 12],
    ),
    "fizik": (
        r'FİZ\.(\d+)\.(\d+)\.(\d+)',
        ["2026518151437471-fizikdöp.pdf"],
        [9, 10, 11, 12],
    ),
    "biyoloji": (
        r'BİY\.(\d+)\.(\d+)\.(\d+)',
        ["202651815105221-biyolojidöp.pdf"],
        [9, 10, 11, 12],
    ),
    "tarih": (
        r'TAR\.(\d+)\.(\d+)\.(\d+)',
        ["202582695425908-tarih.pdf"],
        [9, 10, 11],
    ),
    "gorsel_sanatlar": (
        r'GS\.(\d+)\.(\d+)\.(\d+)',
        ["2025101416114957-görselsanat.pdf",
         "2025912101051975-görsel912.pdf"],
        list(range(1, 13)),
    ),
    "muzik": (
        r'MÜZ\.(\d+)\.(\d+)\.(\d+)',
        ["2025819135241760-müzik18döp.pdf",
         "202591210020850-müzikprogram912.pdf"],
        list(range(1, 13)),
    ),
    "hayat_bilgisi": (
        r'HB\.(\d+)\.(\d+)\.(\d+)',
        ["2025825154255361-hayat bilgisi.pdf"],
        [1, 2, 3],
    ),
    "bilisim_teknolojileri": (
        r'BTY\.(\d+)\.(\d+)\.(\d+)',
        ["202591115327350-bilişim döp.pdf"],
        [5, 6],
    ),
    "teknoloji_tasarim": (
        r'TT\.(\d+)\.(\d+)\.(\d+)',
        ["202651415165252-teknotasardöp.pdf"],
        [7, 8],
    ),
    "sosyal_bilgiler": (
        r'SB\.(\d+)\.(\d+)\.(\d+)',
        ["202582516728345-sosyal bilgiler.pdf"],
        [4, 5, 6, 7],
    ),
    "din_kulturu": (
        r'DKAB\.0?(\d+)\.(\d+)\.(\d+)',
        ["202631310725635-dkab48.pdf",
         "2026313101155916-dkab912.pdf"],
        [4, 5, 6, 7, 8, 9, 10, 11, 12],
    ),
    "matematik": (
        r'MAT\.(\d+)\.(\d+)\.(\d+)',
        ["2025825154457392-ilkokul matematik.pdf",
         "202582516434252-ortaokul matematik.pdf",
         "2026518151640408-matedöp.pdf"],
        list(range(1, 13)),
    ),
    "beden_egitimi": (
        r'BE[OS]?\.(\d+)\.(\d+)\.(\d+)',
        ["202582511143139-Beden Eğitimi ve Oyun Dersi Öğretim Programı-23.07.2025.pdf",
         "2025825113012649-Beden Eğitimi ve Spor Dersi Öğretim Programı-23.07.2025.pdf"],
        list(range(1, 13)),
    ),
}

def pdf_to_text(pdf_path: str) -> str:
    r = subprocess.run(
        [PDFTOTEXT, "-layout", "-enc", "UTF-8", pdf_path, "-"],
        capture_output=True, text=True, encoding="utf-8"
    )
    return r.stdout

def extract_kazanimlar(raw: str, code_pat_str: str, slug: str) -> list:
    code_re = re.compile(code_pat_str)
    # Split text into lines
    lines = raw.split("\n")

    kazanimlar = []
    i = 0
    while i < len(lines):
        line = lines[i]
        m = code_re.search(line)
        if not m:
            i += 1
            continue

        # Extract code
        code_full = m.group(0).rstrip(".")
        try:
            sinif  = int(m.group(1))
            unite  = int(m.group(2))
            kaz_no = int(m.group(3))
        except (IndexError, ValueError):
            i += 1
            continue

        # Title: text after the code on same line
        after_code = line[m.end():].strip().rstrip(".")

        # Continue collecting title from next lines until sub-outcome or new code
        title_lines = [after_code] if after_code else []
        j = i + 1
        while j < len(lines):
            nxt = lines[j].strip()
            # Stop at sub-outcomes (a), b)...) or new code or section headers
            if re.match(r'^[a-zçşğüöı]\)', nxt):
                break
            if code_re.search(nxt):
                break
            if re.search(r'İÇERİK ÇERÇEVESİ|ÖĞRENME KANITLARI|ÖĞRENME-ÖĞRETME|SÜREÇ BİLEŞENLERİ', nxt):
                break
            if nxt:
                title_lines.append(nxt)
            j += 1

        title = " ".join(title_lines).strip()
        # Clean leading punctuation artifacts (trailing dot from code + space)
        title = re.sub(r'^[.\s]+', '', title).strip().rstrip(".")
        # Truncate at wide-gap column artifacts
        title = re.split(r'\s{4,}', title)[0].strip()
        # Remove trailing section headers that leaked in
        title = re.sub(r'\s*(SÜREÇ BİLEŞENLERİ|İÇERİK ÇERÇEVESİ|ÖĞRENME KANITLARI).*$', '', title).strip()

        # Collect sub-outcomes
        alt_kazanimlar = []
        while j < len(lines):
            nxt = lines[j].strip()
            sub_m = re.match(r'^([a-zçşğüöı])\)\s+(.+)', nxt)
            if sub_m:
                sub_text = sub_m.group(2).strip()
                # Continue multi-line sub-outcome
                k = j + 1
                while k < len(lines):
                    cont = lines[k].strip()
                    if re.match(r'^[a-zçşğüöı]\)', cont) or code_re.search(cont):
                        break
                    if re.search(r'İÇERİK ÇERÇEVESİ|ÖĞRENME KANITLARI', cont):
                        break
                    if cont:
                        sub_text += " " + cont
                    k += 1
                alt_kazanimlar.append(sub_text.strip())
                j = k
            else:
                if code_re.search(nxt):
                    break
                if re.search(r'İÇERİK ÇERÇEVESİ|ÖĞRENME KANITLARI', nxt):
                    break
                j += 1

        if title and sinif >= 1:
            kazanimlar.append({
                "kod": code_full,
                "sinif": sinif,
                "unite_no": unite,
                "brans": slug,
                "baslik": title,
                "alt_kazanimlar": alt_kazanimlar,
            })

        i = j if j > i else i + 1

    return kazanimlar

def process_brans(slug: str):
    code_pat_str, pdf_files, _ = BRANSLAR[slug]

    all_kazanimlar = {}  # kod -> kazanım (dedup)

    for pdf_file in pdf_files:
        pdf_path = PDF_DIR / pdf_file
        if not pdf_path.exists():
            print(f"  MISSING: {pdf_file}")
            continue
        raw = pdf_to_text(str(pdf_path))
        kazanimlar = extract_kazanimlar(raw, code_pat_str, slug)
        for k in kazanimlar:
            if k["kod"] not in all_kazanimlar:
                all_kazanimlar[k["kod"]] = k
        print(f"  {pdf_file}: {len(kazanimlar)} raw -> {len(all_kazanimlar)} unique")

    result = sorted(all_kazanimlar.values(), key=lambda x: (x["sinif"], x["unite_no"], x["kod"]))

    # Grade distribution
    by_grade = defaultdict(int)
    for k in result:
        by_grade[k["sinif"]] += 1

    return result, dict(sorted(by_grade.items()))

def main():
    summary = {}

    for slug in BRANSLAR:
        print(f"\n{'='*50}")
        print(f">>> {slug.upper()}")
        kazanimlar, by_grade = process_brans(slug)

        out_file = OUT_DIR / f"{slug}.json"
        out_file.write_text(
            json.dumps({"brans": slug, "toplam": len(kazanimlar),
                        "sinif_dagilimi": by_grade, "kazanimlar": kazanimlar},
                       ensure_ascii=False, indent=2),
            encoding="utf-8"
        )
        summary[slug] = {"toplam": len(kazanimlar), "sinif_dagilimi": by_grade}
        print(f"  -> {len(kazanimlar)} kazanim | {by_grade}")
        print(f"  -> Kaydedildi: {out_file}")

    print(f"\n{'='*50}")
    print("ÖZET:")
    total = 0
    for slug, s in summary.items():
        print(f"  {slug}: {s['toplam']} kazanım — {s['sinif_dagilimi']}")
        total += s["toplam"]
    print(f"\n  TOPLAM: {total} kazanım")

if __name__ == "__main__":
    main()
