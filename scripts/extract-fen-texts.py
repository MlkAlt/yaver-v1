# -*- coding: utf-8 -*-
# Extract full Fen Bilimleri kazanim texts from PDF with 5-part codes
import sys
import io
import fitz
import re
import json

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

pdf_path = 'refs/mufredat-2025/2025825154137627-fen bilimleri.pdf'
doc = fitz.open(pdf_path)

# Invalid text markers (table headers, etc.)
INVALID_MARKERS = ['Ders Kodu', 'Sınıf Düzeyi', 'Ünite Numarası', 'Öğrenme Çıktısı Sayısı']

code_text_map = {}

# Process all pages, store ALL occurrences to find best one
code_occurrences = {}  # code -> list of texts

for page_num in range(len(doc)):
    text = doc[page_num].get_text('text')

    for grade in [5, 6, 7, 8]:
        pattern = r'(FB\.' + str(grade) + r'\.(\d+)\.(\d+)\.(\d+))\.\s*([^\n]+(?:\n(?!FB\.|[A-Z]{2}\.|\d+\. [A-ZÜÖÇŞİĞ]|\xa0)[^\n]{5,}){0,2})'
        matches = re.finditer(pattern, text)
        for m in matches:
            code = m.group(1)
            unite_no = int(m.group(2))
            text_content = m.group(5).strip()
            text_content = re.sub(r'\s+', ' ', text_content).strip()

            # Check if this is a valid kazanim text
            is_invalid = any(marker in text_content for marker in INVALID_MARKERS)
            if is_invalid:
                continue

            if code not in code_occurrences:
                code_occurrences[code] = []
            code_occurrences[code].append({
                'grade': grade,
                'unite_no': unite_no,
                'ad_raw': text_content,
                'page': page_num + 1
            })

# For each code, pick the best occurrence (longest valid text that ends with -bilme or -me)
def clean_ad(raw):
    # Take only up to the first sentence ending with Turkish verb infinitive
    # or up to "a)" sub-item marker
    # First try: everything up to first sub-item indicator
    cleaned = re.sub(r'\s+[a-zçşöüığ]\)', ' ', raw)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    # If too long, truncate at last sentence ending with -bilme/-me/-ebilme
    if len(cleaned) > 300:
        # Try to find a natural cut at -bilme/-me with period
        m = re.search(r'^(.{30,250}(?:bilme|ebilme|abilme|ulabilme|ileme))', cleaned)
        if m:
            cleaned = m.group(1)
    return cleaned

for code, occurrences in code_occurrences.items():
    # Pick the occurrence with best text (not table header, preferably ends with -me)
    best = None
    for occ in occurrences:
        raw = occ['ad_raw']
        # Prefer texts ending in Turkish infinitive form
        score = 0
        if re.search(r'bilme|ebilme|abilme', raw):
            score += 10
        score += min(len(raw), 200)
        if best is None or score > best['score']:
            best = {**occ, 'score': score}

    if best:
        grade = best['grade']
        code_text_map[code] = {
            'grade': grade,
            'unite_no': best['unite_no'],
            'ad': clean_ad(best['ad_raw'])
        }

# Extract ünite names - look for "X. ÜNİTE:" pattern per grade
unite_names = {}
for page_num in range(len(doc)):
    text = doc[page_num].get_text('text')
    # Pattern: digit. UNITE: name
    matches = re.findall(r'(\d+)\.\s*[ÜÚü][NnN][İiI][Tt][Ee]\s*:\s*([A-ZÜÇŞÖİĞ][^\n]{5,60})', text, re.IGNORECASE)
    for uno, uad in matches:
        uad = uad.strip()
        if uad not in unite_names:
            unite_names[int(uno)] = uad

# Report counts
for grade in [5, 6, 7, 8]:
    grade_items = {k: v for k, v in code_text_map.items() if v['grade'] == grade}
    print('Grade ' + str(grade) + ': ' + str(len(grade_items)) + ' kazanim extracted')

# Save to JSON
out = {}
for grade in [5, 6, 7, 8]:
    grade_items = {k: v for k, v in code_text_map.items() if v['grade'] == grade}
    def sort_key(item):
        parts = item[0].split('.')
        return [int(x) for x in parts[1:]]
    out[str(grade)] = dict(sorted(grade_items.items(), key=sort_key))

with open('refs/mufredat-2025/fen_bilimleri_extracted.json', 'w', encoding='utf-8') as f:
    json.dump(out, f, ensure_ascii=False, indent=2)

print('Saved to refs/mufredat-2025/fen_bilimleri_extracted.json')
print('Unite names found: ' + str(unite_names))
