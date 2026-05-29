# -*- coding: utf-8 -*-
import fitz, re
from collections import defaultdict

PDFS = [
    'refs/mufredat-2025/202582511143139-Beden Eğitimi ve Oyun Dersi Öğretim Programı-23.07.2025.pdf',
    'refs/mufredat-2025/2025825113012649-Beden Eğitimi ve Spor Dersi Öğretim Programı-23.07.2025.pdf',
    'refs/mufredat-2025/2025826135315128-BEDEN EĞİTİM PROGRAM-21.07.2025.pdf',
]
OUT = open('refs/mufredat-2025/beden_extract.txt', 'w', encoding='utf-8')
def log(msg): OUT.write(msg + '\n'); OUT.flush()

PAT = re.compile(r'BE[OS]?\.(\d+)\.(\d+)\.?(\d*)')

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

by_grade = defaultdict(set)
for code, grade in all_codes.items():
    by_grade[grade].add(code)

log('\n=== CODES BY GRADE ===')
for g in sorted(by_grade.keys()):
    codes = sorted(by_grade[g])
    log(f'\nSinif {g} ({len(codes)} kod):')
    # Separate parent (2-part) from leaf (3-part)
    parents = [c for c in codes if c.count('.') == 2]
    leaves = [c for c in codes if c.count('.') >= 3]
    log(f'  Parents (2-part): {len(parents)} — {parents}')
    log(f'  Leaves (3-part): {len(leaves)} — {leaves}')

log('\nDone')
OUT.close()
print('Done. See refs/mufredat-2025/beden_extract.txt')
