"""
Spot-check: extracted JSON vs kaynak PDF karşılaştırması
Kullanım: python scripts/spot_check.py
"""
import json, re, sys
from pathlib import Path
import pdfplumber

ROOT = Path(__file__).parent.parent
PDF_DIR = ROOT / "refs" / "mufredat-2025"
EXTRACTED_DIR = ROOT / "extracted"
KATALOG = ROOT / "scripts" / "pdf-katalog.json"

CHECKS = [
    # (katalog_dosya_adı, extracted_json_adi, tip)
    ("202591115301147-almanca dÃ¶p.pdf",       "almanca_döp",       "C"),
    ("2025825154255361-hayat bilgisi.pdf",      "hayat_bilgisi",     "A"),
    ("202632613416463-psikoloji.pdf",           "psikoloji",         "D"),
    ("202582516532361-ortaokul tÃ¼rkÃ§e.pdf",  "ortaokul_türkçe",   "B"),
]

def find_pdf(dosya_adi: str) -> Path | None:
    # Katalog adları encoding bozuk olabilir, PDF dizininde fuzzy ara
    for p in PDF_DIR.glob("*.pdf"):
        if p.name == dosya_adi:
            return p
    # Fallback: isim parçası ile eşleştir (encoding sorunlarını atla)
    stem_clean = re.sub(r'[^a-z0-9]', '', dosya_adi.lower())
    for p in PDF_DIR.glob("*.pdf"):
        p_clean = re.sub(r'[^a-z0-9]', '', p.name.lower())
        if stem_clean[:20] in p_clean or p_clean[:20] in stem_clean:
            return p
    return None

def count_in_pdf(pdf_path: Path, kod_prefix: str | None) -> int:
    """PDF'den kazanım satırlarını say — kod prefix varsa kodlu, yoksa kelime bazlı."""
    count = 0
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                text = page.extract_text() or ""
                if kod_prefix:
                    count += len(re.findall(rf'{re.escape(kod_prefix)}\.\d', text))
                else:
                    # Tip B/D için numara paterni: "1.", "1.1", satır başı
                    count += len(re.findall(r'^\s*\d+\.\s+\S', text, re.MULTILINE))
    except Exception as e:
        return -1
    return count

def load_json(name: str) -> list:
    path = EXTRACTED_DIR / f"{name}.json"
    if not path.exists():
        return []
    data = json.loads(path.read_text(encoding="utf-8"))
    return data if isinstance(data, list) else []

def sample_texts(records: list, n=3) -> list[str]:
    import random
    sample = random.sample(records, min(n, len(records)))
    return [f"  [{r.get('kazanim_kodu','?')}] {r.get('kazanim_metni','')[:80]}" for r in sample]

def main():
    katalog = json.loads((ROOT / "scripts" / "pdf-katalog.json").read_text(encoding="utf-8"))
    kat_map = {e["dosya"]: e for e in katalog}

    print("=" * 70)
    print("SPOT-CHECK: extracted JSON vs PDF")
    print("=" * 70)

    for dosya, json_name, tip in CHECKS:
        print(f"\n[Tip {tip}] {json_name}")
        print("-" * 50)

        # JSON yükle
        records = load_json(json_name)
        json_count = len(records)

        # PDF bul
        pdf_path = find_pdf(dosya)
        if not pdf_path:
            # Fuzzy: json adından bul
            for p in PDF_DIR.glob("*.pdf"):
                if json_name.split("_")[0][:6] in p.name.lower():
                    pdf_path = p
                    break

        print(f"  PDF: {pdf_path.name if pdf_path else 'BULUNAMADI'}")
        print(f"  JSON kayıt sayısı: {json_count}")

        # Katalog bilgisi
        entry = None
        for k, v in kat_map.items():
            # encoding-safe karşılaştırma
            if json_name.split("_")[0] in k.lower() or k.lower().split(".")[0][-6:] in (pdf_path.name.lower()[-10:] if pdf_path else ""):
                entry = v
                break
        if entry:
            print(f"  prev_count (referans): {entry.get('prev_count', '?')}")
            print(f"  Tip: {entry.get('tip', '?')} | Prefix: {entry.get('kod_prefixleri', [])}")

        # Örnek kazanımlar
        if records:
            print(f"  Örnek kazanımlar:")
            for t in sample_texts(records, 3):
                print(t)

        # Basit tutarlılık skoru
        if records:
            valid = sum(1 for r in records if r.get("kazanim_kodu") and r.get("kazanim_metni"))
            pct = valid / json_count * 100
            print(f"  kod+metin dolu: {valid}/{json_count} ({pct:.0f}%)")

    print("\n" + "=" * 70)

if __name__ == "__main__":
    main()
