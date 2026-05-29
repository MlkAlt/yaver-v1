# -*- coding: utf-8 -*-
import fitz
import re
import json

pdf_path = 'refs/mufredat-2025/2025825154137627-fen bilimleri.pdf'
doc = fitz.open(pdf_path)

grade_codes = {5: set(), 6: set(), 7: set(), 8: set()}
for page_num in range(len(doc)):
    text = doc[page_num].get_text()
    for grade in [5, 6, 7, 8]:
        pattern = r'FB\.' + str(grade) + r'\.(\d+)\.(\d+)'
        matches = re.findall(pattern, text)
        for unite, no in matches:
            code = 'FB.' + str(grade) + '.' + unite + '.' + no
            grade_codes[grade].add(code)

for grade in [5, 6, 7, 8]:
    parts = lambda c: [int(x) for x in c.split('.')[1:]]
    sorted_codes = sorted(grade_codes[grade], key=parts)
    print('Grade ' + str(grade) + ': ' + str(len(grade_codes[grade])) + ' unique codes')
    print('  ' + str(sorted_codes))
