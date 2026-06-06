"""
_all_kazanimlar.json → Migration 044 SQL üret
"""
import json
from pathlib import Path
from datetime import date

ROOT = Path(__file__).parent.parent
ALL_JSON = ROOT / "extracted" / "_all_kazanimlar.json"
MIG_PATH = ROOT / "supabase" / "migrations" / "20260416000044_seed_kazanimlar_meb_2025.sql"

def esc(s):
    return str(s).replace("'", "''")

def main():
    records = json.loads(ALL_JSON.read_text(encoding="utf-8"))
    today = date.today().isoformat()
    total = len(records)

    lines = [
        f"-- Migration 044: MEB 2025 müfredat kazanımları",
        f"-- {total} kazanım — {today}",
        "",
        "ALTER TABLE kazanimlar ADD COLUMN IF NOT EXISTS ders TEXT;",
        "ALTER TABLE kazanimlar ADD COLUMN IF NOT EXISTS okul_tipi TEXT;",
        "",
        "INSERT INTO kazanimlar (kod, brans_id, sinif, unite_no, unite_ad, ad, ders, okul_tipi) VALUES",
    ]

    rows = []
    for r in records:
        kod      = esc(r["kazanim_kodu"])
        slug     = esc(r["brans_slug"])
        sinif    = int(r["sinif"])
        unite_no = int(r.get("unite_no") or 0)
        unite_ad = esc(r.get("unite_adi") or "")
        ad       = esc(r.get("kazanim_metni") or "")
        ders     = esc(r.get("ders") or "")
        okul     = esc(r.get("okul_turu") or "")

        rows.append(
            f"  ('{kod}', (SELECT id FROM branslar WHERE slug = '{slug}' LIMIT 1), "
            f"{sinif}, {unite_no}, '{unite_ad}', '{ad}', '{ders}', '{okul}')"
        )

    lines.append(",\n".join(rows))
    lines.append("ON CONFLICT (kod) DO UPDATE SET")
    lines.append("  ad = EXCLUDED.ad, unite_no = EXCLUDED.unite_no, unite_ad = EXCLUDED.unite_ad,")
    lines.append("  ders = EXCLUDED.ders, okul_tipi = EXCLUDED.okul_tipi, brans_id = EXCLUDED.brans_id;")

    sql = "\n".join(lines)
    MIG_PATH.write_text(sql, encoding="utf-8")
    print(f"Migration yazildi: {MIG_PATH.name}")
    print(f"Toplam: {total} kazanim, {len(sql):,} karakter")

if __name__ == "__main__":
    main()
