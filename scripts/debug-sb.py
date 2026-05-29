# -*- coding: utf-8 -*-
"""Find missing SB codes and fix title truncation."""
import re, subprocess, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

PDFTOTEXT = r"C:\Users\melik\AppData\Local\poppler\poppler-24.08.0\Library\bin\pdftotext.exe"
PDF = "refs/mufredat-2025/202582516728345-sosyal bilgiler.pdf"

r = subprocess.run([PDFTOTEXT, "-layout", "-enc", "UTF-8", PDF, "-"],
                   capture_output=True, text=True, encoding="utf-8")
lines = r.stdout.split("\n")

# Find ALL valid SB codes (not in parens)
found = set()
for i, line in enumerate(lines):
    m = re.search(r'(?<!\()(SB\.(\d+)\.(\d+)\.(\d+))\.', line)
    if m:
        code = m.group(1)
        found.add(code)

# DB codes (from db_kazanimlar.json)
import json
db = json.loads(open("refs/mufredat-2025/db_kazanimlar.json", encoding='utf-8').read())
db_codes = {r['kod'] for r in db['sosyal_bilgiler']}

# Filter to SB.X codes only (not ITA)
db_sb = {c for c in db_codes if c.startswith('SB.')}
missing = db_sb - found
print(f"DB'de olup PDF'de bulunamayan: {sorted(missing)}")

# Also show SB.4.1.1 context in full — find where it appears as a standalone (non-paren)
print("\n=== SB.4.1.1 tam bağlam ===")
for i, line in enumerate(lines):
    if re.search(r'(?<!\()SB\.4\.1\.1\.', line):
        start = max(0, i-1)
        end = min(len(lines)-1, i+5)
        for j in range(start, end):
            print(f"{j:4d}| {lines[j]}")
        print()
