"""
Ortaokul Türkçe: PDF'deki 5 eksik kazanımı bul ve metin içeriğini göster
"""
import json, re
from pathlib import Path
import pdfplumber

ROOT = Path(__file__).parent.parent
PDF_DIR = ROOT / "refs" / "mufredat-2025"
EXTRACTED_DIR = ROOT / "extracted"

MISSING = ["T.D.6.21", "T.D.7.26", "T.O.6.10", "T.Y.6.17", "T.Y.6.19"]

def main():
    pdf_path = PDF_DIR / "202582516532361-ortaokul_turkce.pdf"
    json_path = EXTRACTED_DIR / "ortaokul_türkçe.json"

    records = json.loads(json_path.read_text(encoding="utf-8"))
    print(f"JSON toplam: {len(records)}")

    # JSON'daki T.D.6.*, T.D.7.* kodlarını listele (eksik komşuları bul)
    for prefix in ["T.D.6", "T.D.7", "T.O.6", "T.Y.6"]:
        mevcut = sorted([r["kazanim_kodu"] for r in records if r["kazanim_kodu"].startswith(prefix)])
        print(f"  {prefix}.* JSON'da ({len(mevcut)}): {mevcut}")

    print()
    print("PDF'de eksik 5 kodun bağlamı:")
    print("-" * 60)

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text() or ""
            for kod in MISSING:
                if kod in text:
                    # Kod etrafındaki 3 satırı göster
                    lines = text.split("\n")
                    for i, line in enumerate(lines):
                        if kod in line:
                            context = lines[max(0, i-1):i+3]
                            print(f"[{kod}] sayfa {page.page_number}:")
                            for l in context:
                                print(f"  {l.strip()}")
                            print()

if __name__ == "__main__":
    main()
