import json, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
from pathlib import Path

EXTRACTED = Path(__file__).parent.parent / "extracted"

# TDE1.2.1 duplicate bul
for jf in sorted(EXTRACTED.glob("*.json")):
    if jf.stem.startswith("_"):
        continue
    try:
        recs = json.loads(jf.read_text(encoding="utf-8"))
        if not isinstance(recs, list):
            continue
        matches = [r for r in recs if r.get("kazanim_kodu") == "TDE1.2.1"]
        if matches:
            print(f"{jf.name}: {len(matches)} kayit")
            for r in matches:
                sinif = r.get("sinif")
                okul = r.get("okul_turu")
                metin = r.get("kazanim_metni", "")[:60]
                print(f"  sinif={sinif} okul={okul} metin={metin}")
    except Exception as e:
        pass

# edebiyatdöp.json'daki TDE1.2.1 duplicate'i temizle (ilkini tut)
edebiyat_path = EXTRACTED / "edebiyatdöp.json"
if edebiyat_path.exists():
    recs = json.loads(edebiyat_path.read_text(encoding="utf-8"))
    seen = set()
    cleaned = []
    removed = 0
    for r in recs:
        kod = r.get("kazanim_kodu", "")
        if kod in seen:
            removed += 1
        else:
            seen.add(kod)
            cleaned.append(r)
    if removed:
        edebiyat_path.write_text(json.dumps(cleaned, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"\nedebiyatdop.json: {removed} duplicate kaldirildi, {len(cleaned)} kayit kaldi")
    else:
        print("\nedebiyatdop.json: duplicate yok")
