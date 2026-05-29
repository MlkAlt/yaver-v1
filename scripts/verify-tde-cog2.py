# -*- coding: utf-8 -*-
"""Check actual code patterns in both PDFs."""
import fitz, re
from collections import defaultdict

def scan_pdf(path, patterns, n_pages=None):
    doc = fitz.open(path)
    total = len(doc)
    pages = total if n_pages is None else min(n_pages, total)
    print(f'{path.split("/")[-1]} ({total} pp)')
    for label, pat in patterns:
        all_codes = {}
        for p in range(pages):
            text = doc[p].get_text()
            for m in re.finditer(pat, text):
                code = m.group(0).rstrip('.')
                grade_m = re.search(r'\.(\d+)', code)
                if grade_m:
                    grade = int(grade_m.group(1))
                    if code not in all_codes:
                        all_codes[code] = grade
        by_g = defaultdict(int)
        for c, g in all_codes.items(): by_g[g] += 1
        print(f'  [{label}]: {dict(sorted(by_g.items()))} — eg: {list(all_codes.keys())[:3]}')
    # Show raw lines from page 10 for debug
    if total > 10:
        text = doc[10].get_text()
        codes_on_page = [l.strip() for l in text.split('\n') if re.match(r'[A-Z]{2,5}\.', l.strip())]
        print(f'  page 11 code-like lines: {codes_on_page[:8]}')
    doc.close()

print('=== COGDOP ===')
scan_pdf('refs/mufredat-2025/2026518151120283-cogdöp.pdf', [
    ('COG_ascii', r'COG\.(\d+)\.\d+\.?\d*'),
    ('COG_broad', r'CO.\.(\d+)\.\d+\.?\d*'),
    ('any_3part', r'[A-Z][A-Z.]{1,5}\.(\d+)\.\d+\.\d+'),
])

print('\n=== EDEBIYAT ===')
scan_pdf('refs/mufredat-2025/2026518151228236-edebiyatdöp.pdf', [
    ('TDE', r'TDE\.(\d+)\.'),
    ('TDL', r'TDL\.(\d+)\.'),
    ('TDE_broad', r'TD.\.(\d+)\.'),
    ('any_3part', r'[A-Z][A-Z.]{1,5}\.(\d+)\.\d+\.\d+'),
])
