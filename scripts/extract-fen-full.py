# -*- coding: utf-8 -*-
# Extract Fen Bilimleri using FULL 5-part codes: FB.sinif.unite.bolum.no
import fitz
import re

pdf_path = 'refs/mufredat-2025/2025825154137627-fen bilimleri.pdf'
doc = fitz.open(pdf_path)

# Pattern: FB.grade.unite.bolum.no (5 parts)
grade_codes = {3: set(), 4: set(), 5: set(), 6: set(), 7: set(), 8: set()}
for page_num in range(len(doc)):
    text = doc[page_num].get_text()
    for grade in [3, 4, 5, 6, 7, 8]:
        # Match FB.grade.unite.bolum.no
        pattern = r'FB\.' + str(grade) + r'\.(\d+)\.(\d+)\.(\d+)'
        matches = re.findall(pattern, text)
        for unite, bolum, no in matches:
            code = 'FB.' + str(grade) + '.' + unite + '.' + bolum + '.' + no
            grade_codes[grade].add(code)

for grade in [3, 4, 5, 6, 7, 8]:
    def sort_key(c):
        parts = c.split('.')
        return [int(x) for x in parts[1:]]
    sorted_codes = sorted(grade_codes[grade], key=sort_key)
    print('Grade ' + str(grade) + ': ' + str(len(grade_codes[grade])) + ' unique 5-part codes')
    print('  ' + str(sorted_codes))
    print()
