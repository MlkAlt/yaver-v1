# -*- coding: utf-8 -*-
"""Investigate Arapça — why PDF=24 but DB=70-85 per grade."""
import fitz, re
from collections import defaultdict

PDFS = [
    ('refs/mufredat-2025/2025912135022975-arapca24.pdf',   'grade2-4'),
    ('refs/mufredat-2025/202591213515585-arapca58.pdf',    'grade5-8'),
    ('refs/mufredat-2025/202591213531335-arapca910.pdf',   'grade9-10'),
]
OUT = open('refs/mufredat-2025/arapca_extract.txt', 'w', encoding='utf-8')
def log(msg): OUT.write(msg + '\n'); OUT.flush()

# Try multiple patterns
PATTERNS = [
    ('full_4part', re.compile(r'ARP\.(\d+)\.(\d+)\.(\d+)\.?(\d*)')),
    ('full_3part', re.compile(r'ARP\.(\d+)\.(\d+)\.(\d+)')),
]

for pdf_path, label in PDFS:
    doc = fitz.open(pdf_path)
    log(f'\n=== {label}: {pdf_path.split("/")[-1]} ({len(doc)} sayfa) ===')

    all_codes_4 = {}
    all_codes_3 = {}

    for p in range(len(doc)):
        text = doc[p].get_text()
        for m in PATTERNS[0][1].finditer(text):
            grade = int(m.group(1))
            code = m.group(0).rstrip('.')
            all_codes_4[code] = grade
        for m in PATTERNS[1][1].finditer(text):
            grade = int(m.group(1))
            code = m.group(0).rstrip('.')
            all_codes_3[code] = grade

    # Count by grade
    by_grade_4 = defaultdict(int)
    for code, g in all_codes_4.items():
        by_grade_4[g] += 1
    by_grade_3 = defaultdict(int)
    for code, g in all_codes_3.items():
        by_grade_3[g] += 1

    log(f'  4-part codes: {dict(sorted(by_grade_4.items()))}')
    log(f'  3-part codes: {dict(sorted(by_grade_3.items()))}')

    # Show sample codes for first grade found
    if all_codes_3:
        first_grade = min(by_grade_3.keys())
        samples = [c for c, g in all_codes_3.items() if g == first_grade][:10]
        log(f'  Sinif {first_grade} sample (3-part): {sorted(samples)}')
    if all_codes_4:
        first_grade = min(by_grade_4.keys())
        samples = [c for c, g in all_codes_4.items() if g == first_grade][:10]
        log(f'  Sinif {first_grade} sample (4-part): {sorted(samples)[:10]}')

    # Check a mid-page for raw text to see code format
    mid = len(doc) // 3
    text = doc[mid].get_text()
    arp_lines = [l.strip() for l in text.split('\n') if 'ARP.' in l]
    if arp_lines:
        log(f'  Sayfa {mid+1} ARP satırları: {arp_lines[:5]}')

    doc.close()

log('\nDone')
OUT.close()
print('Done.')
