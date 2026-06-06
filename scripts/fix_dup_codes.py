"""
Duplicate kod düzeltme:
  - kuranıkerimdöp.json (din_kulturu, lise): KK.* → KKLISE.*
  - dinibilgilerdöp.json (lise): TDB.* → TDBLISE.*
  - hazırlıkingilizce.json: ingilizce912 ile çakışan ENG kayıtları çıkar
"""
import json, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
from pathlib import Path

ROOT = Path(__file__).parent.parent
EXTRACTED = ROOT / "extracted"
ALL_JSON = EXTRACTED / "_all_kazanimlar.json"

def fix_json_file(json_name, old_prefix, new_prefix):
    path = EXTRACTED / f"{json_name}.json"
    records = json.loads(path.read_text(encoding="utf-8"))
    changed = 0
    for r in records:
        kod = r.get("kazanim_kodu", "")
        if kod.startswith(old_prefix + "."):
            r["kazanim_kodu"] = new_prefix + kod[len(old_prefix):]
            changed += 1
    path.write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"  {json_name}.json: {changed} kod {old_prefix}.* -> {new_prefix}.*")
    return changed

def main():
    # 1. kuranıkerimdöp: KK → KKLISE
    print("KK lise kodları prefix'leniyor...")
    fix_json_file("kuranıkerimdöp", "KK", "KKLISE")

    # 2. dinibilgilerdöp: TDB → TDBLISE
    print("TDB lise kodları prefix'leniyor...")
    fix_json_file("dinibilgilerdöp", "TDB", "TDBLISE")

    # 3. _all_kazanimlar.json'u sıfırdan individual JSON'lardan yeniden oluştur
    print("\n_all_kazanimlar.json yeniden oluşturuluyor...")
    all_records = []
    skip = {"_all_kazanimlar"}  # kendisini dahil etme

    # hazırlıkingilizce'yi tamamen çıkar (ingilizce912 zaten var)
    skip.add("hazırlıkingilizce")

    json_files = sorted(EXTRACTED.glob("*.json"))
    for jf in json_files:
        if jf.stem in skip:
            continue
        try:
            recs = json.loads(jf.read_text(encoding="utf-8"))
            if isinstance(recs, list):
                all_records.extend(recs)
        except Exception as e:
            print(f"  HATA {jf.name}: {e}")

    # Duplicate kontrolü
    from collections import Counter
    kodlar = [r["kazanim_kodu"] for r in all_records if "kazanim_kodu" in r]
    dups = {k: v for k, v in Counter(kodlar).items() if v > 1}
    if dups:
        print(f"  !! Hala {len(dups)} duplicate: {list(dups.items())[:5]}")
    else:
        print(f"  OK Duplicate yok")

    ALL_JSON.write_text(json.dumps(all_records, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"  Toplam: {len(all_records)} kayıt → {ALL_JSON.name}")

if __name__ == "__main__":
    main()
