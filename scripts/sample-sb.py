# -*- coding: utf-8 -*-
"""SB PDF layout'unu anlamak için ham text."""
import sys, io, subprocess, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

PDFTOTEXT = r"C:\Users\melik\AppData\Local\poppler\poppler-24.08.0\Library\bin\pdftotext.exe"
PDF = "refs/mufredat-2025/202582516728345-sosyal bilgiler.pdf"

r = subprocess.run([PDFTOTEXT, "-layout", "-enc", "UTF-8", PDF, "-"],
                   capture_output=True, text=True, encoding="utf-8")
raw = r.stdout
lines = raw.split("\n")

# Find first SB code and show 40 lines around it
for i, line in enumerate(lines):
    if re.search(r'SB\.\d+\.\d+\.\d+', line):
        start = max(0, i-3)
        end = min(len(lines)-1, i+40)
        print(f"=== First SB code at line {i} ===")
        for j in range(start, end):
            print(f"{j:4d}| {lines[j]}")
        break
