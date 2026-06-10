import pdfplumber, re, sys, io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

pdfs = {
    'astronomi': r'refs/mufredat-2025/2026326135719151-astronımiveuzay.pdf',
    'iklim': r'refs/mufredat-2025/2026326135915854-iklimçevre.pdf',
    'ibt': r'refs/mufredat-2025/2026326134623635-islambilimtarh.pdf',
    'ihvd': r'refs/mufredat-2025/2025825154829877-insan_haklari_vatandaslik.pdf',
}

for name, path in pdfs.items():
    print(f'\n=== {name} ===')
    try:
        with pdfplumber.open(path) as pdf:
            full_text = ''
            for page in pdf.pages:
                t = page.extract_text() or ''
                t = re.sub(r'-\n\s*', '', t)
                full_text += ' ' + t

            pattern = r'([A-ZÇĞİÖŞÜ]+[\.\s]+[\d\.]+)\s+(.{20,300}?(?:bilme|abilme|ebilme))'
            matches = re.findall(pattern, full_text, re.DOTALL)
            for kod, metin in matches:
                kod = re.sub(r'\s+', '', kod.strip().strip('.'))
                metin = re.sub(r'\s+', ' ', metin).strip()
                print(f'  {kod}: {metin[:150]}')
    except Exception as e:
        print(f'  ERROR: {e}')
