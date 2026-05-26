"""Migration 033 SQL'ini brans/lise-mufredat-2025/ Grup 2 JSON'larından üretir."""
import json, os, sys
sys.stdout.reconfigure(encoding='utf-8')

JSON_DIR = r'brans\lise-mufredat-2025'
OUT_FILE = r'supabase\migrations\20260416000033_reseed_kazanimlar_lise_secmeli.sql'

# Grup 2 dosyaları (Grup 1 zaten Migration 032'de)
GRUP2_FILES = [
    'psikoloji.json',
    'mantik.json',
    'cagdas_turk.json',
    'astronomi.json',
    'iklim.json',
    'saglik.json',
    'mat_uygulama.json',
    'sosyal_bil_c.json',
]

def esc(s):
    if s is None: return 'NULL'
    return "'" + str(s).replace("'", "''") + "'"

rows = []
for fname in GRUP2_FILES:
    yol = os.path.join(JSON_DIR, fname)
    if not os.path.exists(yol):
        print(f'HATA: {yol} bulunamadı'); continue
    with open(yol, encoding='utf-8') as f:
        d = json.load(f)
    brans_slug = d['brans_slug']
    ders = d.get('ders') or ''
    ders_turu = d.get('ders_turu') or 'secmeli'
    siniflar_okul_tipi = {str(k): v for k, v in d.get('siniflar_okul_tipi', {}).items()}
    for k in d['kazanimlar']:
        sinif = int(k['sinif'])
        okul_tipi = siniflar_okul_tipi.get(str(sinif), 'lise')
        rows.append({
            'kod': k['kod'], 'slug': brans_slug, 'sinif': sinif,
            'unite_no': k.get('tema_no') or 1, 'unite_ad': k.get('tema_ad') or '',
            'ad': k['ad'], 'ders': ders, 'okul_tipi': okul_tipi, 'ders_turu': ders_turu,
        })

print(f'Toplam kazanım: {len(rows)}')
slug_counts = {}
for r in rows:
    slug_counts[r['slug']] = slug_counts.get(r['slug'], 0) + 1
for slug, cnt in sorted(slug_counts.items()):
    print(f'  {slug:<30} {cnt}')

lines = [
    '-- Migration 033: Lise seçmeli ders kazanımları (Grup 2) — MEB 2025',
    f'-- {len(GRUP2_FILES)} JSON dosyasından üretildi, toplam {len(rows)} kazanım.',
    '-- Psikoloji(11), Mantık(10), Çağdaş Türk(12), Astronomi(9),',
    '-- İklim Çevre(10), Sağlık Trafik(9), Mat Uygulamaları(9-10), Sosyal Bilim Çalışmaları(10-12)',
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
