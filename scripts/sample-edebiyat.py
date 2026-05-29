# -*- coding: utf-8 -*-
"""Show raw text from edebiyat PDF to find code format."""
import fitz

doc = fitz.open('refs/mufredat-2025/2026518151228236-edebiyatdöp.pdf')
print(f'Total pages: {len(doc)}')
for p in [12, 15, 20, 30]:
    text = doc[p].get_text()
    print(f'\n--- Page {p+1} (first 600 chars) ---')
    print(text[:600])
doc.close()
