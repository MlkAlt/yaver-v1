# -*- coding: utf-8 -*-
"""Verify TDE and Coğrafya PDFs — names were swapped in full-audit.py"""
import fitz, re
from collections import defaultdict

tests = [
    ('cogdop',    'refs/mufredat-2025/2026518151120283-cogdöp.pdf',    re.compile(r'CO[ĞG]\.(\d+)\.')),
    ('edebiyat',  'refs/mufredat-2025/2026518151228236-edebiyatdöp.pdf', re.compile(r'TDE\.(\d+)\.')),
    ('sosyalbilimc', 'refs/mufredat-2025/202632614151726-sosyalbilimc.pdf', re.compile(r'SB\.(\d+)\.')),
]

for label, path, pat in tests:
    doc = fitz.open(path)
    all_codes = {}
    for p in range(len(doc)):
        text = doc[p].get_text()
        for m in pat.finditer(text):
            grade = int(m.group(1))
            code = m.group(0).rstrip('.')
            if code not in all_codes:
                all_codes[code] = grade
    page_count = len(doc)
    doc.close()
    by_grade = defaultdict(int)
    for code, g in all_codes.items():
        by_grade[g] += 1
    print(f'{label} ({page_count} pp): {dict(sorted(by_grade.items()))}')
    if all_codes:
        samples = sorted(list(all_codes.keys()))[:5]
        print(f'  sample: {samples}')
