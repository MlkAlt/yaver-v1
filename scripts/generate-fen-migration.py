# -*- coding: utf-8 -*-
# Generate migration SQL for Fen Bilimleri grades 5-8 fix
import sys, io, json, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

with open('refs/mufredat-2025/fen_bilimleri_extracted.json', encoding='utf-8') as f:
    data = json.load(f)

with open('refs/mufredat-2025/fen_unite_names.json', encoding='utf-8') as f:
    unite_names_raw = json.load(f)

# Parse unite names: "5_1" -> name
unite_names = {}
for key, name in unite_names_raw.items():
    g, u = key.split('_')
    unite_names[(int(g), int(u))] = name

def clean_ad(raw):
    """Extract just the main kazanim title - the part ending with -me/-bilme."""
    # Many texts look like:
    # "Güneşin yapısı ve ... toplayabilme Güneş'in yapısı..."
    # We want just: "Güneş'in yapısı ve ... toplayabilme"
    # Strategy: find the first match of a Turkish verb infinitive pattern
    m = re.search(r'^(.{10,}?(?:bilme|ebilme|abilme|yabilme|ulabilme|ileme|alabilme|elebilme|yebilme))', raw)
    if m:
        result = m.group(1).strip()
        # Remove soft hyphen artifacts
        result = result.replace('\xad', '').replace('­', '')
        result = re.sub(r'\s+', ' ', result).strip()
        return result
    # Fallback: first sentence
    result = raw.split('\n')[0].strip()
    result = result.replace('\xad', '').replace('­', '')
    return re.sub(r'\s+', ' ', result).strip()

# Generate SQL
lines = []
lines.append("-- Migration 039: Fen Bilimleri sinif 5-8 tam re-seed")
lines.append("-- Mevcut kısa kodlu (FB.x.y.z) kayıtları sil, doğru 5-parçalı kodlarla (FB.x.y.z.w) ekle")
lines.append("-- PDF: refs/mufredat-2025/2025825154137627-fen bilimleri.pdf")
lines.append("-- Toplam: 28+36+36+43 = 143 yeni kayıt")
lines.append("")
lines.append("DO $$")
lines.append("DECLARE")
lines.append("  fb_id UUID;")
lines.append("BEGIN")
lines.append("  SELECT id INTO fb_id FROM branslar WHERE slug = 'fen_bilimleri';")
lines.append("")
lines.append("  -- Mevcut sinif 5-8 kayıtlarını sil (kod format yanlıştı: FB.x.y.z)")
lines.append("  DELETE FROM kazanimlar WHERE brans_id = fb_id AND sinif IN (5, 6, 7, 8);")
lines.append("")
lines.append("  -- Yeni kayıtları ekle (doğru 5-parçalı kod formatı: FB.x.y.z.w)")
lines.append("  INSERT INTO kazanimlar (brans_id, kod, sinif, unite_no, unite_ad, ad, aciklama, ders, okul_tipi, ders_turu) VALUES")

rows = []
for grade_str in ['5', '6', '7', '8']:
    grade = int(grade_str)
    okul_tipi = 'ortaokul'
    grade_data = data[grade_str]
    for kod, item in grade_data.items():
        unite_no = item['unite_no']
        unite_ad = unite_names.get((grade, unite_no), '')
        ad = clean_ad(item['ad'])
        # Escape all apostrophe variants for SQL
        def sql_escape(s):
            return s.replace("'", "''").replace('’', "''").replace('‘', "''").replace('ʼ', "''")
        ad_esc = sql_escape(ad)
        unite_ad_esc = sql_escape(unite_ad)
        row = (
            "  (fb_id, '" + kod + "', " + str(grade) + ", " + str(unite_no) +
            ", '" + unite_ad_esc + "', '" + ad_esc + "', NULL, 'Fen Bilimleri', '" +
            okul_tipi + "', 'zorunlu')"
        )
        rows.append(row)

lines.append(',\n'.join(rows) + ';')
lines.append("")
lines.append("  RAISE NOTICE 'Fen Bilimleri sinif 5-8: % kayıt eklendi', " + str(len(rows)) + ";")
lines.append("END $$;")

sql = '\n'.join(lines)

out_path = 'supabase/migrations/20260416000039_fen_bilimleri_sinif_5_8_reseed.sql'
with open(out_path, 'w', encoding='utf-8') as f:
    f.write(sql)

print('Generated: ' + out_path)
print('Total rows: ' + str(len(rows)))
print('Sample:')
print(rows[0])
print(rows[5])
print(rows[15])
