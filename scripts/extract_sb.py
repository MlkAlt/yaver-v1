# -*- coding: utf-8 -*-
"""
Sosyal Bilgiler PDF özel extractor — v2.
Sadece 'VE SÜREÇ BİLEŞENLERİ' bloğundaki veya standalone satırdaki kodları al.
Önce tüm geçerli occurrenceları topla, sonra en iyi olanı seç.
"""
import re, json, subprocess, sys, io
from pathlib import Path
from collections import defaultdict

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

PDFTOTEXT = r"C:\Users\melik\AppData\Local\poppler\poppler-24.08.0\Library\bin\pdftotext.exe"
PDF = "refs/mufredat-2025/202582516728345-sosyal bilgiler.pdf"

r = subprocess.run([PDFTOTEXT, "-layout", "-enc", "UTF-8", PDF, "-"],
                   capture_output=True, text=True, encoding="utf-8")
raw = r.stdout
lines = raw.split("\n")

def collect_title(lines, start_idx, code_end_pos_in_line, line_text):
    """Collect full kazanım title starting from code position."""
    # Title starts after the code on the same line
    after_code = line_text[code_end_pos_in_line:].strip().rstrip(".")
    # Clean up column artifacts
    after_code = re.split(r'\s{4,}', after_code)[0].strip()
    after_code = re.sub(r'\s*(ÖĞRENME ÇIKTILARI|SÜREÇ BİLEŞENLERİ|BECERİLERİ|EĞİLİMLER).*$', '', after_code).strip()

    title_lines = [after_code] if after_code else []

    j = start_idx + 1
    # Collect continuation lines (word wraps — usually just 1-2 words)
    while j < len(lines):
        nxt = lines[j].strip()
        # Stop conditions
        if re.match(r'^[a-zçşğüöı]\)', nxt):
            break
        if re.search(r'(?<!\()(SB\.\d+\.\d+\.\d+)\.', nxt):
            break
        if re.search(r'ÖĞRENME-ÖĞRETME|Öğrenme-Öğretme|İÇERİK|DİSİPLİN|Uygulamaları', nxt):
            break
        if re.search(r'ALAN\s+BECERİLERİ|KAVRAMSAL\s+BECERİLER|EĞİLİMLER|PROGRAMLAR ARASI', nxt):
            break
        # Accept short continuation (word wrap) — max 4 words, no digits, starts with lowercase or is single word
        words = nxt.split()
        if nxt and len(words) <= 4 and not re.search(r'\d', nxt):
            # Check if it looks like a title continuation (ends with -bilme/-mek/-yabilme etc.)
            is_title_end = bool(re.search(r'(bilme|mek|abilme|yabilme|layabilme|rayabilme|ebilme|inebilme|lebilme)$', nxt, re.I))
            title_lines.append(nxt)
            j += 1
            if is_title_end:
                break  # Title complete
        else:
            break

    title = " ".join(title_lines).strip()
    # Fix hyphenated line breaks: "karşılaştırabil-me" → "karşılaştırabilme"
    title = re.sub(r'-\s*(me|bil|mek|abilme|yabilme|layabilme|rayabilme|bilme|lebilme|nebilme)$',
                   r'\1', title)
    title = re.sub(r'-\s+([a-zçşğüöı])', r'\1', title)
    title = title.rstrip('.')
    return title, j

def collect_alt(lines, start_idx):
    """Collect sub-outcomes starting from start_idx."""
    alt = []
    j = start_idx
    while j < len(lines):
        nxt = lines[j].strip()
        sub_m = re.match(r'^([a-zçşğüöı])\)\s+(.+)', nxt)
        if sub_m:
            sub_text = sub_m.group(2)
            k = j + 1
            while k < len(lines):
                cont = lines[k].strip()
                if re.match(r'^[a-zçşğüöı]\)', cont): break
                if re.search(r'(?<!\()(SB\.\d+)', cont): break
                if re.search(r'ÖĞRENME-ÖĞRETME|Öğrenme-Öğretme|Uygulamaları', cont): break
                if cont: sub_text += " " + cont
                k += 1
            alt.append(sub_text.strip())
            j = k
        else:
            if re.search(r'(?<!\()(SB\.\d+)|ÖĞRENME-ÖĞRETME|Öğrenme-Öğretme', nxt): break
            j += 1
    return alt, j

# Two-pass: collect all occurrences
# Prefer: "VE SÜREÇ BİLEŞENLERİ SB.X.X.X." line (has full text on one line)
# Fallback: standalone "SB.X.X.X. text" line

occurrences = {}  # code -> list of (priority, line_idx, title, alt)

CODE_RE = re.compile(r'(?<!\()(SB[. ](\d+)\.(\d+)\.(\d+))\.')

i = 0
while i < len(lines):
    line = lines[i]
    m = CODE_RE.search(line)
    if not m:
        i += 1
        continue

    code_full = f"SB.{m.group(2)}.{m.group(3)}.{m.group(4)}"  # normalize "SB 7.1.1" → "SB.7.1.1"
    sinif = int(m.group(2))
    unite = int(m.group(3))
    kaz_no = int(m.group(4))

    # Skip if code is only in parentheses on this line (no standalone occurrence)
    line_no_parens = re.sub(r'\([^)]*\)', '', line)
    if not CODE_RE.search(line_no_parens):
        i += 1
        continue

    # Determine priority
    has_surec = bool(re.search(r'SÜREÇ BİLEŞENLERİ', line))
    priority = 2 if has_surec else 1

    title, j = collect_title(lines, i, m.end(), line)
    alt, j2 = collect_alt(lines, j)

    entry = (priority, i, sinif, unite, kaz_no, title, alt)

    if code_full not in occurrences or priority > occurrences[code_full][0]:
        occurrences[code_full] = entry

    i = i + 1

# Build final dict
all_codes = {}
for code_full, (priority, line_idx, sinif, unite, kaz_no, title, alt) in occurrences.items():
    if title:
        all_codes[code_full] = {
            "kod": code_full,
            "sinif": sinif,
            "unite_no": unite,
            "brans": "sosyal_bilgiler",
            "baslik": title,
            "alt_kazanimlar": alt,
        }

# Check missing — compare with DB
db = json.loads(Path("refs/mufredat-2025/db_kazanimlar.json").read_text(encoding='utf-8'))
db_sb = {r['kod'] for r in db['sosyal_bilgiler'] if r['kod'].startswith('SB.')}
missing = db_sb - set(all_codes.keys())
extra = set(all_codes.keys()) - db_sb

by_grade = defaultdict(int)
for k in all_codes.values():
    by_grade[k['sinif']] += 1

print(f"Toplam: {len(all_codes)} kazanim")
print(f"Sinif dagilimi: {dict(sorted(by_grade.items()))}")
print(f"Beklenen:       {{4: 17, 5: 19, 6: 18, 7: 17}}")
if missing: print(f"Eksik: {sorted(missing)}")
if extra:   print(f"Fazla: {sorted(extra)}")

print("\n=== Ilk 5 kazanim ===")
for k in sorted(all_codes.values(), key=lambda x: (x['sinif'], x['unite_no'], x['kod']))[:5]:
    print(f"  {k['kod']}: {k['baslik']}")

# Save
out = {
    "brans": "sosyal_bilgiler",
    "toplam": len(all_codes),
    "sinif_dagilimi": dict(sorted(by_grade.items())),
    "kazanimlar": sorted(all_codes.values(), key=lambda x: (x['sinif'], x['unite_no'], x['kod']))
}
Path("refs/mufredat-2025/extracted/sosyal_bilgiler.json").write_text(
    json.dumps(out, ensure_ascii=False, indent=2), encoding='utf-8')
print(f"\nKaydedildi.")
