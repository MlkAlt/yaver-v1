"""Migration 034 SQL'ini tde_lise.json'dan üretir."""
import json, os, sys
sys.stdout.reconfigure(encoding='utf-8')

JSON_FILE = r'brans\lise-mufredat-2025\tde_lise.json'
OUT_FILE  = r'supabase\migrations\20260416000034_reseed_kazanimlar_tde.sql'

def esc(s):
    if s is None: return 'NULL'
    return "'" + str(s).replace("'", "''") + "'"

with open(JSON_FILE, encoding='utf-8') as f:
    d = json.load(f)

rows = []
for k in d['kazanimlar']:
    sinif = int(k['sinif'])
    rows.append({
        'kod': k['kod'], 'slug': d['brans_slug'], 'sinif': sinif,
        'unite_no': k.get('tema_no') or 1, 'unite_ad': k.get('tema_ad') or '',
        'ad': k['ad'], 'ders': d['ders'],
        'okul_tipi': d['siniflar_okul_tipi'].get(sinif, 'lise'),
        'ders_turu': d['ders_turu'],
    })

print(f'Toplam kazanım: {len(rows)}')
by_sinif = {}
for r in rows:
    by_sinif[r['sinif']] = by_sinif.get(r['sinif'], 0) + 1
print(f'Sınıf dağılımı: {dict(sorted(by_sinif.items()))}')

lines = [
    '-- Migration 034: TDE (Türk Dili ve Edebiyatı) lise 9-12 kazanımları — MEB 2025',
    f'-- {len(rows)} kazanım, 4 sınıf × 4 tema × 12-16 çıktı.',
    '-- Synthetic kod: TDE.{sinif}.T{tema}.{grup}.{no}',
    '',
    'INSERT INTO kazanimlar (kod, brans_id, sinif, unite_no, unite_ad, ad, ders, okul_tipi, ders_turu)',
    'VALUES',
]

value_rows = []
for r in rows:
    brans_id_expr = f"(SELECT id FROM branslar WHERE slug = {esc(r['slug'])})"
    value_rows.append(
        f"  ({esc(r['kod'])}, {brans_id_expr}, "
        f"{r['sinif']}, {r['unite_no']}, "
        f"{esc(r['unite_ad'])}, {esc(r['ad'])}, "
        f"{esc(r['ders'])}, {esc(r['okul_tipi'])}, {esc(r['ders_turu'])})"
    )

lines.append(',\n'.join(value_rows))
lines += [
    'ON CONFLICT (kod) DO UPDATE SET',
    '  brans_id  = EXCLUDED.brans_id,',
    '  sinif     = EXCLUDED.sinif,',
    '  unite_no  = EXCLUDED.unite_no,',
    '  unite_ad  = EXCLUDED.unite_ad,',
    '  ad        = EXCLUDED.ad,',
    '  ders      = EXCLUDED.ders,',
    '  okul_tipi = EXCLUDED.okul_tipi,',
    '  ders_turu = EXCLUDED.ders_turu;',
]

sql = '\n'.join(lines)
with open(OUT_FILE, 'w', encoding='utf-8') as f:
    f.write(sql)

print(f'\nYazıldı: {OUT_FILE} ({os.path.getsize(OUT_FILE)//1024} KB)')
