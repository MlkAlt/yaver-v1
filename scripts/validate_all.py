"""
_all_kazanimlar.json kapsamlı tutarlılık kontrolü — migration öncesi
"""
import json, re, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
from pathlib import Path
from collections import Counter, defaultdict

ROOT = Path(__file__).parent.parent
ALL_JSON = ROOT / "extracted" / "_all_kazanimlar.json"
KATALOG = ROOT / "scripts" / "pdf-katalog.json"

VALID_OKUL_TURU = {"ilkokul", "ortaokul", "lise", "ihl", "iho"}
VALID_SINIF = set(range(1, 13))
REQUIRED_FIELDS = ["kazanim_kodu", "kazanim_metni", "sinif", "okul_turu",
                   "brans_slug", "ders", "unite_no", "extraction_yontemi"]

def main():
    records = json.loads(ALL_JSON.read_text(encoding="utf-8-sig"))
    katalog = json.loads(KATALOG.read_text(encoding="utf-8"))
    print(f"Toplam kayıt: {len(records)}")
    print()

    errors = []
    warnings = []

    # 1. Zorunlu alan kontrolü
    missing_fields = defaultdict(list)
    for i, r in enumerate(records):
        for f in REQUIRED_FIELDS:
            if f not in r or r[f] is None or r[f] == "":
                missing_fields[f].append(r.get("kazanim_kodu", f"index:{i}"))

    if missing_fields:
        for f, kodlar in missing_fields.items():
            errors.append(f"[ALAN EKSİK] '{f}': {len(kodlar)} kayıt — örnek: {kodlar[:3]}")
    else:
        print("✓ Zorunlu alanlar: tümü dolu")

    # 2. Duplicate kazanim_kodu
    kodlar = [r["kazanim_kodu"] for r in records if "kazanim_kodu" in r]
    dups = {k: v for k, v in Counter(kodlar).items() if v > 1}
    if dups:
        errors.append(f"[DUPLICATE] {len(dups)} duplicate kod — örnek: {list(dups.items())[:5]}")
    else:
        print(f"✓ Duplicate kod: yok ({len(kodlar)} unique)")

    # 3. okul_turu geçerlilik
    invalid_okul = [r["kazanim_kodu"] for r in records
                    if r.get("okul_turu") not in VALID_OKUL_TURU]
    if invalid_okul:
        vals = Counter(r["okul_turu"] for r in records if r.get("okul_turu") not in VALID_OKUL_TURU)
        errors.append(f"[OKUL_TURU] Geçersiz değerler: {dict(vals)} — örnek: {invalid_okul[:5]}")
    else:
        dist = Counter(r.get("okul_turu") for r in records)
        print(f"✓ okul_turu: {dict(dist)}")

    # 4. sinif geçerlilik
    invalid_sinif = [r["kazanim_kodu"] for r in records
                     if r.get("sinif") not in VALID_SINIF]
    if invalid_sinif:
        vals = Counter(r["sinif"] for r in records if r.get("sinif") not in VALID_SINIF)
        errors.append(f"[SINIF] Geçersiz değerler: {dict(vals)} — örnek: {invalid_sinif[:5]}")
    else:
        dist = sorted(Counter(r.get("sinif") for r in records).items())
        print(f"✓ sinif dağılımı: {dict(dist)}")

    # 5. kazanim_metni çok kısa olanlar (< 10 karakter)
    short = [r["kazanim_kodu"] for r in records
             if len(str(r.get("kazanim_metni", ""))) < 10]
    if short:
        warnings.append(f"[KISA METİN] < 10 karakter: {len(short)} kayıt — {short[:5]}")
    else:
        print(f"✓ kazanim_metni uzunlukları: OK")

    # 6. brans_slug dağılımı
    slug_dist = Counter(r.get("brans_slug") for r in records)
    print(f"\nbrans_slug dağılımı ({len(slug_dist)} unique):")
    for slug, count in sorted(slug_dist.items(), key=lambda x: -x[1]):
        print(f"  {slug}: {count}")

    # 7. extraction_yontemi dağılımı
    yontem_dist = Counter(r.get("extraction_yontemi") for r in records)
    print(f"\nextraction_yontemi: {dict(yontem_dist)}")

    # 8. confidence dağılımı
    conf_dist = Counter(r.get("confidence", "YOK") for r in records)
    print(f"confidence: {dict(conf_dist)}")

    # 9. Katalog vs extracted karşılaştırması
    kat_branslar = set(e.get("brans_slug") for e in katalog)
    json_branslar = set(slug_dist.keys())
    only_kat = kat_branslar - json_branslar
    only_json = json_branslar - kat_branslar
    if only_kat:
        warnings.append(f"[KATALOG FARK] Sadece katalogda: {only_kat}")
    if only_json:
        warnings.append(f"[KATALOG FARK] Sadece JSON'da: {only_json}")

    # Özet
    print("\n" + "="*60)
    if errors:
        print(f"HATALAR ({len(errors)}):")
        for e in errors:
            print(f"  !! {e}")
    else:
        print("HATA: YOK")

    if warnings:
        print(f"\nUYARILAR ({len(warnings)}):")
        for w in warnings:
            print(f"  ~~ {w}")
    else:
        print("UYARI: YOK")

    print("="*60)
    if not errors:
        print("SONUÇ: JSON migration için hazır.")
    else:
        print("SONUÇ: Hatalar giderilmeden migration yapma!")

if __name__ == "__main__":
    main()
