# -*- coding: utf-8 -*-
"""SB PDF - tüm SB kodlarının etrafını göster, patern bul."""
import sys, io, subprocess, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

PDFTOTEXT = r"C:\Users\melik\AppData\Local\poppler\poppler-24.08.0\Library\bin\pdftotext.exe"
PDF = "refs/mufredat-2025/202582516728345-sosyal bilgiler.pdf"

r = subprocess.run([PDFTOTEXT, "-layout", "-enc", "UTF-8", PDF, "-"],
                   capture_output=True, text=True, encoding="utf-8")
raw = r.stdout
lines = raw.split("\n")

# Find ALL lines containing SB codes — show format
print("=== Tüm SB kodu içeren satırlar (ilk 40) ===\n")
count = 0
for i, line in enumerate(lines):
    if re.search(r'SB\.\d+\.\d+\.\d+', line):
        # Show context: 2 lines before and after
        ctx_before = lines[max(0,i-1)].strip()
        ctx_after  = lines[min(len(lines)-1,i+1)].strip()
        print(f"Satir {i}: {line.strip()[:120]}")
        if ctx_before: print(f"  onceki: {ctx_before[:80]}")
        if ctx_after:  print(f"  sonraki: {ctx_after[:80]}")
        print()
        count += 1
        if count >= 40:
            break

# Also look for the kazanım title pattern (what comes BEFORE/AFTER the code in the main block)
print("\n=== ÖĞRENME ÇIKTISI içeren satirlar ===")
for i, line in enumerate(lines):
    if 'ÖĞRENME ÇIKTISI' in line and 'SB' in line:
        print(f"Satir {i}: {line.strip()[:120]}")
