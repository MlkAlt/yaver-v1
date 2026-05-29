# -*- coding: utf-8 -*-
# Extract unite names per grade from Fen Bilimleri PDF
import sys, io, fitz, re, json
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

pdf_path = 'refs/mufredat-2025/2025825154137627-fen bilimleri.pdf'
doc = fitz.open(pdf_path)

# Find grade+unite pairs
# Pattern: "{grade}. SINIF" followed within same page by "{unite_no}. ÜNİTE: {name}"
grade_unite_names = {}  # (grade, unite_no) -> name

current_grade = None
for page_num in range(len(doc)):
    text = doc[page_num].get_text('text')

    # Detect grade marker
    for g in [3, 4, 5, 6, 7, 8]:
        if str(g) + '. SINIF' in text or str(g) + '.SINIF' in text:
            current_grade = g

    if current_grade is None:
        continue

    # Find ünite headers
    unite_matches = re.findall(
        r'(\d+)\.\s*[ÜüUu][NnN][İiI][Tt][Ee]\s*:\s*([A-ZÜÇŞÖİĞa-züçşöığ][^\n]{5,80})',
        text
    )
    for uno, uad in unite_matches:
        key = (current_grade, int(uno))
        uad = uad.strip()
        if key not in grade_unite_names and len(uad) > 4:
            grade_unite_names[key] = uad

# Print results
print("Grade/Unite name mapping:")
for (g, u), name in sorted(grade_unite_names.items()):
    print(f"  Grade {g} Unite {u}: {name}")

# Save
with open('refs/mufredat-2025/fen_unite_names.json', 'w', encoding='utf-8') as f:
    # Convert tuple keys to strings
    out = {str(g) + '_' + str(u): name for (g, u), name in grade_unite_names.items()}
    json.dump(out, f, ensure_ascii=False, indent=2)
print("Saved to fen_unite_names.json")
