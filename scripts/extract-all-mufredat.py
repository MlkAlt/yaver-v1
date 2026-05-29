# -*- coding: utf-8 -*-
"""
79 MEB müfredat PDF'inden kazanım kod + metin çıkar.
Girdi: scripts/pdf-brans-map.json
Çıktı: extracted/<slug>.json + extracted/_logs/<slug>.log + extracted/_summary.txt
"""
import sys, io, json, re, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

import pdfplumber

PDF_DIR = 'refs/mufredat-2025/'
MAP_FILE = 'scripts/pdf-brans-map.json'
OUT_DIR = 'extracted/'
LOG_DIR = 'extracted/_logs/'

os.makedirs(OUT_DIR, exist_ok=True)
os.makedirs(LOG_DIR, exist_ok=True)

with open(MAP_FILE, encoding='utf-8') as f:
    pdf_map = json.load(f)

def slugify(name):
    base = name.rsplit('.pdf', 1)[0]
    parts = base.split('-', 1)
    if len(parts) > 1 and parts[0].isdigit():
        rest = parts[1].strip()
    else:
        rest = base
    # Clean for filename
    rest = re.sub(r'[^\w\dçşöüğıİÇŞÖÜĞ_-]', '_', rest)
    rest = re.sub(r'_+', '_', rest).strip('_').lower()
    return rest

def make_pattern(prefix):
    """Prefix sonrası 1-5 nokta-ayrılmış token (rakam, harf+rakam, Roma)."""
    p = re.escape(prefix)
    return p + r'(?:\.[A-Za-zİIVXÇŞÖÜĞçşöüğı]+\d*|\.\d+){1,5}'

log_lines = []
total_kazanim = 0
processed_count = 0
skipped_count = 0

for pdf_name, info in pdf_map.items():
    if pdf_name.startswith('_'):
        continue
    if not info.get('brans_slug'):
        log_lines.append(f"SKIP: {pdf_name} — branş yok ({info.get('_not', '')})")
        skipped_count += 1
        continue
    pdf_path = PDF_DIR + pdf_name
    if not os.path.exists(pdf_path):
        log_lines.append(f"PDF YOK: {pdf_path}")
        skipped_count += 1
        continue

    slug = slugify(pdf_name)
    out_path = OUT_DIR + slug + '.json'
    log_path = LOG_DIR + slug + '.log'

    prefixes = info.get('kod_prefixleri', [])
    if not prefixes:
        log_lines.append(f"PREFIX YOK: {pdf_name}")
        skipped_count += 1
        continue

    patterns = [(p, make_pattern(p)) for p in prefixes]

    found = []
    seen_codes = set()
    page_kod_count = {}

    try:
        with pdfplumber.open(pdf_path) as pdf:
            for pnum, page in enumerate(pdf.pages, 1):
                text = page.extract_text() or ''
                lines = text.split('\n')
                for line_idx, line in enumerate(lines):
                    for prefix, pat in patterns:
                        for m in re.finditer(pat, line):
                            kod = m.group(0).rstrip('.')
                            if kod in seen_codes:
                                continue

                            # "ad" yakala: kod sonrası satır kalanı
                            after = line[m.end():].strip()
                            # Eğer kısa, sonraki satıra bak (yeni kod başlatmıyorsa)
                            if len(after) < 10 and line_idx + 1 < len(lines):
                                next_line = lines[line_idx + 1].strip()
                                if next_line and not any(re.match(p2, next_line) for _, p2 in patterns):
                                    after = (after + ' ' + next_line).strip() if after else next_line

                            # Sınıf belirle
                            sinif = None
                            if info['sinif_kaynagi'] == 'kod':
                                parts = kod.split('.')
                                if len(parts) >= 2 and parts[1].isdigit():
                                    sinif = int(parts[1])
                            if sinif is None and info['sinif_kaynagi'] == 'sabit' and len(info['siniflar']) == 1:
                                sinif = info['siniflar'][0]

                            entry = {
                                'kod': kod,
                                'ad': after[:500] if after else '',
                                'sinif': sinif,
                                'ders': info['ders'],
                                'brans_slug': info['brans_slug'],
                                'kaynak_pdf': pdf_name,
                                'kaynak_sayfa': pnum
                            }
                            seen_codes.add(kod)
                            found.append(entry)
                            page_kod_count[pnum] = page_kod_count.get(pnum, 0) + 1
    except Exception as e:
        log_lines.append(f"HATA {pdf_name}: {e}")
        continue

    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(found, f, ensure_ascii=False, indent=2)

    sinif_dagilim = {}
    for entry in found:
        s = str(entry['sinif']) if entry['sinif'] is not None else 'None'
        sinif_dagilim[s] = sinif_dagilim.get(s, 0) + 1

    log_lines.append(f"OK  {pdf_name[:60].ljust(60)} | {len(found):4d} kod | sinif={dict(sorted(sinif_dagilim.items()))}")
    total_kazanim += len(found)
    processed_count += 1

    with open(log_path, 'w', encoding='utf-8') as f:
        f.write(f"PDF: {pdf_name}\n")
        f.write(f"Brans: {info['brans_slug']}\nDers: {info['ders']}\nPrefixler: {prefixes}\n")
        f.write(f"Toplam: {len(found)} kazanım\nSinif: {sinif_dagilim}\n")
        f.write(f"Sayfa: {page_kod_count}\n\nİlk 10 örnek:\n")
        for entry in found[:10]:
            f.write(f"  {entry['kod']:25s} → {entry['ad'][:100]}\n")

with open(OUT_DIR + '_summary.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(log_lines))
    f.write(f"\n\n──────────────────────────────────────────────────────────\n")
    f.write(f"İşlenen: {processed_count}, Skip: {skipped_count}, Toplam kazanım: {total_kazanim}\n")

print('\n'.join(log_lines))
print(f"\n──────────────────────────────────────────────────────────")
print(f"İşlenen: {processed_count}, Skip: {skipped_count}, Toplam kazanım: {total_kazanim}")
