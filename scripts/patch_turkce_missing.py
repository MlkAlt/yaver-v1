"""
Ortaokul Türkçe JSON'una PDF'de olan 5 eksik kazanımı ekle.
"""
import json
from pathlib import Path

ROOT = Path(__file__).parent.parent
JSON_PATH = ROOT / "extracted" / "ortaokul_türkçe.json"

MISSING = [
    {
        "kazanim_kodu": "T.D.6.21",
        "kazanim_metni": "Dinlediğini/izlediğini özetleyebilme",
        "sinif": 6, "okul_turu": "ortaokul", "brans_slug": "turkce", "ders": "Türkçe",
        "unite_no": 6, "unite_adi": "Ünite 6",
        "kaynak_pdf": "202582516532361-ortaokul türkçe.pdf", "kaynak_sayfa": 132,
        "extraction_yontemi": "regex_tipB", "confidence": "high",
    },
    {
        "kazanim_kodu": "T.D.7.26",
        "kazanim_metni": "Dinlediğindeki/izlediğindeki probleme çözüm üretebilme",
        "sinif": 7, "okul_turu": "ortaokul", "brans_slug": "turkce", "ders": "Türkçe",
        "unite_no": 7, "unite_adi": "Ünite 7",
        "kaynak_pdf": "202582516532361-ortaokul türkçe.pdf", "kaynak_sayfa": 154,
        "extraction_yontemi": "regex_tipB", "confidence": "high",
    },
    {
        "kazanim_kodu": "T.O.6.10",
        "kazanim_metni": "Metin içi karşılaştırma yapabilme",
        "sinif": 6, "okul_turu": "ortaokul", "brans_slug": "turkce", "ders": "Türkçe",
        "unite_no": 6, "unite_adi": "Ünite 6",
        "kaynak_pdf": "202582516532361-ortaokul türkçe.pdf", "kaynak_sayfa": 126,
        "extraction_yontemi": "regex_tipB", "confidence": "high",
    },
    {
        "kazanim_kodu": "T.Y.6.17",
        "kazanim_metni": "Yazısında düşünceyi geliştirme yollarını kullanabilme",
        "sinif": 6, "okul_turu": "ortaokul", "brans_slug": "turkce", "ders": "Türkçe",
        "unite_no": 6, "unite_adi": "Ünite 6",
        "kaynak_pdf": "202582516532361-ortaokul türkçe.pdf", "kaynak_sayfa": 132,
        "extraction_yontemi": "regex_tipB", "confidence": "high",
    },
    {
        "kazanim_kodu": "T.Y.6.19",
        "kazanim_metni": "Yazısında açık ve örtük ifade etmeye yönelik yapıları kullanabilme",
        "sinif": 6, "okul_turu": "ortaokul", "brans_slug": "turkce", "ders": "Türkçe",
        "unite_no": 6, "unite_adi": "Ünite 6",
        "kaynak_pdf": "202582516532361-ortaokul türkçe.pdf", "kaynak_sayfa": 143,
        "extraction_yontemi": "regex_tipB", "confidence": "high",
    },
]

records = json.loads(JSON_PATH.read_text(encoding="utf-8"))
mevcut_kodlar = {r["kazanim_kodu"] for r in records}

eklendi = 0
for rec in MISSING:
    if rec["kazanim_kodu"] not in mevcut_kodlar:
        records.append(rec)
        print(f"  + {rec['kazanim_kodu']}: {rec['kazanim_metni']}")
        eklendi += 1
    else:
        print(f"  = {rec['kazanim_kodu']}: zaten var, atlandı")

# Kod sırasına göre sırala
records.sort(key=lambda r: r["kazanim_kodu"])
JSON_PATH.write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"\nToplam: {len(records)} kayıt ({eklendi} eklendi)")
