# -*- coding: utf-8 -*-
import fitz, re, json
from collections import defaultdict

PDF = 'refs/mufredat-2025/202591115301147-almanca döp.pdf'
OUT = open('refs/mufredat-2025/almanca_extract.txt', 'w', encoding='utf-8')

def log(msg): OUT.write(msg + '\n'); OUT.flush()

doc = fitz.open(PDF)
log(f'Pages: {len(doc)}')

# Full code pattern: DE.5.1.H1.1. or DE.5.1.H1.1
# Grade in group 1, unit in group 2, skill in group 3, sub in group 4
PAT = re.compile(r'DE\.(\d+)\.(\d+)\.([A-Z]\d+)\.(\d+)')

all_codes = defaultdict(set)  # grade -> set of full codes

for p in range(len(doc)):
    text = doc[p].get_text()
    for m in PAT.finditer(text):
        grade = int(m.group(1))
        code = m.group(0).rstrip('.')
        all_codes[grade].add(code)

doc.close()

for g in sorted(all_codes.keys()):
    codes = sorted(all_codes[g])
    log(f'\n=== Sinif {g} ({len(codes)} kod) ===')

    # Group by skill type
    by_skill = defaultdict(list)
    for c in codes:
        m = PAT.match(c)
        if m:
            skill = m.group(3)  # e.g. H1, L2, P3, S4, G1, W2
            by_skill[skill].append(c)

    for skill in sorted(by_skill.keys()):
        log(f'  {skill}: {len(by_skill[skill])} — {by_skill[skill][:3]}')

    # Also show by unit
    by_unit = defaultdict(list)
    for c in codes:
        m = PAT.match(c)
        if m:
            unit = m.group(2)
            by_unit[unit].append(c)
    log(f'  Üniteler: {dict((u, len(v)) for u, v in sorted(by_unit.items()))}')

log('\nDone')
OUT.close()
print('Done. See refs/mufredat-2025/almanca_extract.txt')
