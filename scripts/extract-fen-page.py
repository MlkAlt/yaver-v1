# -*- coding: utf-8 -*-
# Look at pages around FB.5 content to understand structure
import fitz
import re

pdf_path = 'refs/mufredat-2025/2025825154137627-fen bilimleri.pdf'
doc = fitz.open(pdf_path)

# Find pages that have FB.5 content
print("=== Scanning for FB.5 content pages ===")
for page_num in range(80, 120):
    text = doc[page_num].get_text()
    if 'FB.5' in text or '5. SINIF' in text or '5.SINIF' in text:
        codes = re.findall(r'FB\.5\.\d+\.\d+', text)
        unique = list(set(codes))
        print(f"\n--- Page {page_num+1} (has {len(unique)} unique FB.5 codes) ---")
        # Show first 2000 chars
        print(text[:2000])
        print("...")
        if page_num > 115:
            break
