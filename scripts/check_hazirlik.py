import json, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
from pathlib import Path

ROOT = Path(__file__).parent.parent
hazir = json.loads((ROOT / "extracted/hazırlıkingilizce.json").read_text(encoding="utf-8"))
ing912 = json.loads((ROOT / "extracted/ingilizce912.json").read_text(encoding="utf-8"))

hazir_kodlar = {r["kazanim_kodu"] for r in hazir}
ing912_kodlar = {r["kazanim_kodu"] for r in ing912}

sadece_hazir = hazir_kodlar - ing912_kodlar
ortak = hazir_kodlar & ing912_kodlar

print(f"hazirlikingilizce.json: {len(hazir)} kayit")
print(f"ingilizce912.json:      {len(ing912)} kayit")
print()
print(f"Ortak kodlar:     {len(ortak)}  (bunlar zaten ingilizce912'de var)")
print(f"Sadece hazirlikta: {len(sadece_hazir)}  (bunlar kayip!)")
print()
if sadece_hazir:
    print("Hazirliga ozel kodlar (ilk 10):")
    for k in sorted(sadece_hazir)[:10]:
        r = next(x for x in hazir if x["kazanim_kodu"] == k)
        sinif = r.get("sinif")
        metin = r.get("kazanim_metni", "")[:60]
        print(f"  [{k}] s{sinif}: {metin}")
