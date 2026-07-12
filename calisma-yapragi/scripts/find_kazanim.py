#!/usr/bin/env python3
"""Kazanım arama aracı.

Kullanım:
  find_kazanim.py FİZ.9.1.2                    # kodla tam eşleşme
  find_kazanim.py "mekanik enerji"             # ad/açıklamada metin arama
  find_kazanim.py --ders fizik --sinif 10      # filtreli listeleme
  find_kazanim.py --ders cografya --uniteler   # ünite listesi
Çıktı: eşleşen kazanım(lar) JSON olarak (tam kayıt).
"""
import argparse
import glob
import json
import os
import sys


def tr_fold(s: str) -> str:
    """Türkçe duyarlı küçük harfe çevirme (İ→i, I→ı)."""
    return (s or "").replace("İ", "i").replace("I", "ı").lower()


def load_all(data_dir: str):
    items = []
    for path in sorted(glob.glob(os.path.join(data_dir, "*.json"))):
        try:
            with open(path, encoding="utf-8") as f:
                data = json.load(f)
            if isinstance(data, list):
                items.extend(data)
        except (json.JSONDecodeError, OSError) as e:
            print(f"UYARI: {path} okunamadı: {e}", file=sys.stderr)
    return items


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("sorgu", nargs="?", default=None,
                    help="kazanım kodu veya arama metni")
    ap.add_argument("--data-dir", default=None,
                    help="kazanım JSON klasörü (varsayılan: ../data)")
    ap.add_argument("--ders", help="ders/branş filtresi (ör. fizik)")
    ap.add_argument("--sinif", type=int, help="sınıf filtresi (9-12)")
    ap.add_argument("--unite", help="ünite adında geçen metin")
    ap.add_argument("--uniteler", action="store_true",
                    help="sadece ünite listesini yaz")
    ap.add_argument("--ozet", action="store_true",
                    help="kod + ad satırları (tam JSON yerine)")
    args = ap.parse_args()

    data_dir = args.data_dir or os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "..", "data")
    items = load_all(data_dir)
    if not items:
        print(f"HATA: {data_dir} içinde kazanım verisi yok.", file=sys.stderr)
        sys.exit(1)

    def keep(k):
        if args.ders and tr_fold(args.ders) not in (
                tr_fold(k.get("brans", "")) + " " + tr_fold(k.get("ders", ""))):
            return False
        if args.sinif and k.get("sinif") != args.sinif:
            return False
        if args.unite and tr_fold(args.unite) not in tr_fold(k.get("unite", "")):
            return False
        return True

    items = [k for k in items if keep(k)]

    if args.sorgu:
        q = tr_fold(args.sorgu)
        exact = [k for k in items if tr_fold(k.get("kod", "")) == q]
        if exact:
            items = exact
        else:
            items = [k for k in items
                     if q in tr_fold(k.get("kod", ""))
                     or q in tr_fold(k.get("ad", ""))
                     or q in tr_fold(k.get("aciklama", ""))]

    if not items:
        print("Eşleşme yok. Filtreleri gevşetmeyi veya --ozet ile "
              "listelemeyi dene.", file=sys.stderr)
        sys.exit(2)

    if args.uniteler:
        seen = []
        for k in items:
            key = (k.get("ders"), k.get("sinif"), k.get("unite"))
            if key not in seen:
                seen.append(key)
        for ders, sinif, unite in seen:
            print(f"{ders} {sinif}. sınıf | {unite}")
        return

    if args.ozet:
        for k in items:
            print(f"{k.get('kod')} | {k.get('sinif')}. sınıf | {k.get('ad')}")
        print(f"\nToplam: {len(items)} kazanım", file=sys.stderr)
        return

    print(json.dumps(items if len(items) > 1 else items[0],
                     ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
