# -*- coding: utf-8 -*-
import re

path = 'validate_kazanimlar.py'
content = open(path, encoding='utf-8').read()

old = "        if re.search(r'[\\u0600-\\u06FF]', metin):\n            warnings.append(f\"[UYARI] Arapça karakter: {kod}\")"
new = "        if not is_arabic and re.search(r'[\\u0600-\\u06FF]', metin):\n            warnings.append(f\"[UYARI] Arapça karakter: {kod}\")"

if old in content:
    open(path, 'w', encoding='utf-8').write(content.replace(old, new))
    print("OK - Arapca karakter check guncellendi")
else:
    # show the actual line for debugging
    for i, line in enumerate(content.splitlines(), 1):
        if '0600' in line or 'Arap' in line:
            print(f"L{i}: {repr(line)}")
