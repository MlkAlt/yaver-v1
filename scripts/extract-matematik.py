# -*- coding: utf-8 -*-
"""
Find exactly which MAT codes are in PDF but not in DB (grades 1-8).
DB counts: 1:19 2:25 3:33 4:34 5:23 6:24 7:30 8:23
PDF counts: 1:23 2:29 3:37 4:38 5:29 6:30 7:37 8:30
"""
import fitz, re
from collections import defaultdict

PDFS = [
    'refs/mufredat-2025/2025825154457392-ilkokul matematik.pdf',
    'refs/mufredat-2025/202582516434252-ortaokul matematik.pdf',
    'refs/mufredat-2025/2026518151640408-matedöp.pdf',
]
OUT = open('refs/mufredat-2025/matematik_extract.txt', 'w', encoding='utf-8')
def log(msg): OUT.write(msg + '\n'); OUT.flush()

PAT = re.compile(r'MAT\.(\d+)\.(\d+)\.?(\d*)')

all_codes = {}
for pdf_path in PDFS:
    doc = fitz.open(pdf_path)
    log(f'{pdf_path.split("/")[-1]} ({len(doc)} sayfa)')
    for p in range(len(doc)):
        text = doc[p].get_text()
        for m in PAT.finditer(text):
            grade = int(m.group(1))
            full_code = m.group(0).rstrip('.')
            if full_code not in all_codes:
                all_codes[full_code] = grade
    doc.close()

# Group by grade
by_grade = defaultdict(set)
for code, grade in all_codes.items():
    by_grade[grade].add(code)

log('\n=== CODES BY GRADE ===')
for g in sorted(by_grade.keys()):
    codes = sorted(by_grade[g], key=lambda c: [int(x) for x in c.split('.')[1:] if x])
    log(f'\nSinif {g} ({len(codes)} kod):')
    for c in codes:
        log(f'  {c}')

log('\nDone')
OUT.close()
print('Done. See refs/mufredat-2025/matematik_extract.txt')
