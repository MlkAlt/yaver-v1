"""
Detaylı spot-check: PDF'den doğrudan kazanım sayısı çek, JSON ile karşılaştır
"""
import json, re
from pathlib import Path
import pdfplumber

ROOT = Path(__file__).parent.parent
PDF_DIR = ROOT / "refs" / "mufredat-2025"
EXTRACTED_DIR = ROOT / "extracted"

CHECKS = [
    {
        "label": "Psikoloji (Tip D)",
        "pdf": "202632613416463-psikoloji.pdf",
        "json": "psikoloji",
        "kod_re": r'\bPSK\.\d+\.\d+',
    },
    {
        "label": "Ortaokul Türkçe (Tip B)",
        "pdf": "202582516532361-ortaokul turkce.pdf",
        "json": "ortaokul_türkçe",
        "kod_re": r'\bT\.[A-Z]+\.\d+\.\d+',
    },
    {
        "label": "Hayat Bilgisi (Tip A) — doğrulama",
        "pdf": "2025825154255361-hayat bilgisi.pdf",
        "json": "hayat_bilgisi",
        "kod_re": r'\bHB\.\d+\.\d+\.\d+',
    },
    {
        "label": "Almanca (Tip C) — doğrulama",
        "pdf": "202591115301147-almanca döp.pdf",
        "json": "almanca_döp",
        "kod_re": r'\bDE\.\d+\.\d+',
    },
]

def find_pdf(name: str) -> Path | None:
    exact = PDF_DIR / name
    if exact.exists():
        return exact
    # Fuzzy: ilk 15 karakter
    prefix = re.sub(r'[^a-z0-9]', '', name.lower())[:20]
    for p in PDF_DIR.glob("*.pdf"):
        candidate = re.sub(r'[^a-z0-9]', '', p.name.lower())
        if prefix in candidate:
            return p
    return None

def pdf_kodlari_say(pdf_path: Path, kod_re: str) -> tuple[int, set]:
    """PDF'deki tüm kodları bul, unique setini döndür."""
    kodlar = set()
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text() or ""
            for m in re.finditer(kod_re, text):
                kodlar.add(m.group())
    return len(kodlar), kodlar

def main():
    for chk in CHECKS:
        print(f"\n{'='*60}")
        print(f"  {chk['label']}")
        print(f"{'='*60}")

        # JSON yükle
        jpath = EXTRACTED_DIR / f"{chk['json']}.json"
        records = json.loads(jpath.read_text(encoding="utf-8")) if jpath.exists() else []
        json_kodlar = {r["kazanim_kodu"] for r in records if "kazanim_kodu" in r}
        print(f"  JSON kayıt: {len(records)} | unique kod: {len(json_kodlar)}")

        # PDF oku
        pdf_path = find_pdf(chk["pdf"])
        if not pdf_path:
            print(f"  PDF BULUNAMADI: {chk['pdf']}")
            continue
        print(f"  PDF: {pdf_path.name}")

        try:
            pdf_count, pdf_kodlar = pdf_kodlari_say(pdf_path, chk["kod_re"])
        except Exception as e:
            print(f"  PDF okuma hatası: {e}")
            continue

        print(f"  PDF unique kod: {pdf_count}")
        print(f"  Fark (JSON - PDF): {len(json_kodlar) - pdf_count}")

        # Sadece JSON'da olanlar
        only_json = json_kodlar - pdf_kodlar
        # Sadece PDF'de olanlar
        only_pdf = pdf_kodlar - json_kodlar

        if only_json:
            sample = sorted(only_json)[:5]
            print(f"  !!  Sadece JSON'da ({len(only_json)}): {sample}")
        if only_pdf:
            sample = sorted(only_pdf)[:5]
            print(f"  !!  Sadece PDF'de ({len(only_pdf)}): {sample}")

        if not only_json and not only_pdf:
            print(f"  OK  Tam esleme - kod seti ayni")
        elif pdf_count == 0:
            print(f"  !!  PDF'de kod bulunamadi (regex uyusmuyor olabilir)")

        # 2 örnek metin
        import random
        sample_recs = random.sample(records, min(2, len(records)))
        for r in sample_recs:
            kod = r.get("kazanim_kodu", "?")
            metin = r.get("kazanim_metni", "")[:90]
            sinif = r.get("sinif", "?")
            print(f"    [{kod}] s{sinif}: {metin}")

if __name__ == "__main__":
    main()
