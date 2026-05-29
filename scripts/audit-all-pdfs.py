# -*- coding: utf-8 -*-
"""
Kapsamlı PDF vs DB audit.
Her branş için PDF'den kazanım kodlarını çeker, DB ile karşılaştırır.
"""
import sys, io, re, json, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

import pdfplumber

PDF_DIR = 'refs/mufredat-2025/'

# Her branş: kod_prefix listesi + PDF dosya(ları)
# kod_prefix: PDF'te aranacak regex (grade pozisyonu dahil)
BRANCHES = {
    'turkce': {
        'pdfs': ['2025825154548470-ilkokul türkçe.pdf', '202582516532361-ortaokul türkçe.pdf'],
        'patterns': [r'T\.[A-ZÇŞÖÜİĞ]+\.(\d+)\.\d+'],
    },
    'matematik': {
        'pdfs': ['2025825154457392-ilkokul matematik.pdf', '202582516434252-ortaokul matematik.pdf', '2026518151640408-matedöp.pdf'],
        'patterns': [r'MAT\.(\d+)\.\d+\.?\d*'],
    },
    'ingilizce': {
        'pdfs': ['202591011405337-26-08-ekli-english-regular.pdf', '202591214813382-ingilizce912.pdf'],
        'patterns': [r'ENG\.(\d+)\.\d+\.[A-Z]\d*'],
    },
    'fen_bilimleri': {
        'pdfs': ['2025825154137627-fen bilimleri.pdf'],
        'patterns': [r'FB\.(\d+)\.\d+\.\d+\.?\d*'],
    },
    'sosyal_bilgiler': {
        'pdfs': ['202582516728345-sosyal bilgiler.pdf'],
        'patterns': [r'SB\.(\d+)\.\d+\.?\d*'],
    },
    'hayat_bilgisi': {
        'pdfs': ['2025825154255361-hayat bilgisi.pdf'],
        'patterns': [r'HB\.(\d+)\.\d+\.?\d*'],
    },
    'beden_egitimi': {
        'pdfs': [
            '202582511143139-Beden Eğitimi ve Oyun Dersi Öğretim Programı-23.07.2025.pdf',
            '2025825113012649-Beden Eğitimi ve Spor Dersi Öğretim Programı-23.07.2025.pdf',
            '2025826135315128-BEDEN EĞİTİM PROGRAM-21.07.2025.pdf',
        ],
        'patterns': [r'BE[OS]?\.(\d+)\.\d+\.?\d*', r'BEO\.(\d+)\.\d+\.?\d*', r'BES\.(\d+)\.\d+\.?\d*'],
    },
    'gorsel_sanatlar': {
        'pdfs': ['2025101416114957-görselsanat.pdf', '2025912101051975-görsel912.pdf'],
        'patterns': [r'GS\.(\d+)\.\d+\.?\d*'],
    },
    'muzik': {
        'pdfs': ['2025819135241760-müzik18döp.pdf', '202591210020850-müzikprogram912.pdf'],
        'patterns': [r'M[ÜU]Z\.(\d+)\.\d+\.?\d*'],
    },
    'din_kulturu': {
        'pdfs': ['202631310725635-dkab48.pdf', '2026313101155916-dkab912.pdf'],
        'patterns': [r'DKAB\.(\d+)\.\d+\.?\d*'],
    },
    'tarih': {
        'pdfs': ['202582695425908-tarih.pdf'],
        'patterns': [r'TAR\.(\d+)\.\d+\.?\d*', r'[İI]TA\.(\d+)\.\d+', r'[ÇC]TDT\.\d+\.\d+'],
    },
    'turk_dili_edebiyati': {
        'pdfs': ['2026518151120283-edebiyatdöp.pdf'],
        'patterns': [r'TDE\.(\d+)\.[A-Z]\d+\.?\d*\.?\d*'],
    },
    'kimya': {
        'pdfs': ['2026518151539674-kimya.pdf'],
        'patterns': [r'K[İI]M\.(\d+)\.\d+\.?\d*'],
    },
    'fizik': {
        'pdfs': ['2026518151437471-fizikdöp.pdf'],
        'patterns': [r'F[İI]Z\.(\d+)\.\d+\.?\d*', r'AST\.(\d+)\.\d+'],
    },
    'biyoloji': {
        'pdfs': ['202651815105221-biyolojidöp.pdf'],
        'patterns': [r'B[İI]Y\.(\d+)\.\d+\.?\d*'],
    },
    'cografya': {
        'pdfs': ['2026518151228236-cogdöp.pdf'],
        'patterns': [r'CO[ĞG]\.(\d+)\.\d+\.?\d*', r'[İI][ÇC]Y[ÇC]\.(\d+)\.\d+'],
    },
    'felsefe': {
        'pdfs': ['2026518151339111-felsefedöp.pdf', '202632613416463-psikoloji.pdf', '2026326134747604-mantık.pdf', '2026326135350307-türkkültürmedeniyt.pdf', '2026326134940604-çağdaştürk.pdf'],
        'patterns': [r'FEL\.(\d+)\.\d+\.?\d*', r'PSK\.(\d+)\.\d+\.?\d*', r'MNT\.(\d+)\.\d+'],
    },
    'almanca': {
        'pdfs': ['202591115301147-almanca döp.pdf'],
        'patterns': [r'DE\.(\d+)\.\d+\.[A-Z0-9]+\.?\d*'],
    },
    'teknoloji_tasarim': {
        'pdfs': ['202651415165252-teknotasardöp.pdf'],
        'patterns': [r'TT\.(\d+)\.\d+\.?\d*'],
    },
    'bilisim_teknolojileri': {
        'pdfs': ['202591115327350-bilişim döp.pdf'],
        'patterns': [r'BTY\.(\d+)\.\d+\.?\d*'],
    },
    'arapca': {
        'pdfs': ['2025912135022975-arapca24.pdf', '202591213515585-arapca58.pdf', '202591213531335-arapca910.pdf'],
        'patterns': [r'ARP\.(\d+)\.\d+\.\d+\.?\d*'],
    },
}

def extract_codes_from_pdf(pdf_path, patterns):
    """PDF'den kod → set of unique full codes, grade → count döndür."""
    grade_codes = {}  # grade -> set of codes

    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                text = page.extract_text() or ''
                for pattern in patterns:
                    # Full code pattern: prefix + grade + rest
                    # We use the grade capture group
                    full_pattern = pattern.replace(r'(\d+)', r'(\d+)')
                    matches = re.findall(full_pattern, text)
                    if matches:
                        # Also find full codes for dedup
                        full_code_pattern = pattern.replace(r'(\d+)', r'\d+')
                        # Get full codes
                        full_matches = re.findall(
                            pattern.replace(r'(\d+)', r'(\d+)') + r'[^\s,;\n]*',
                            text
                        )
                        for m in full_matches:
                            if isinstance(m, tuple):
                                grade_str = m[0]
                            else:
                                grade_str = m
                            try:
                                grade = int(grade_str)
                                if 1 <= grade <= 12:
                                    if grade not in grade_codes:
                                        grade_codes[grade] = set()
                                    # Store just the grade for counting (we count unique occurrences differently)
                                    grade_codes[grade].add(str(grade) + '_' + str(len(grade_codes[grade])))
                            except (ValueError, IndexError):
                                pass
    except Exception as e:
        return {'error': str(e)}

    return {g: len(codes) for g, codes in grade_codes.items()}

def extract_unique_codes_from_pdf(pdf_path, patterns):
    """PDF'den tam benzersiz kod → grade mapping döndür."""
    all_codes = {}  # full_code -> grade

    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                text = page.extract_text() or ''

                for pat in patterns:
                    # Build full code regex - capture entire code
                    # Pattern like r'FB\.(\d+)\.\d+\.\d+\.?\d*'
                    # We want to capture the full match
                    full_match_pat = pat.replace(r'(\d+)', r'\d+')
                    # Also keep grade capture
                    grade_pat = pat

                    # Find all full codes
                    for m in re.finditer(grade_pat, text):
                        grade_str = m.group(1)
                        full_code = m.group(0)
                        # Clean trailing dots/spaces
                        full_code = full_code.rstrip('.')
                        try:
                            grade = int(grade_str)
                            if 1 <= grade <= 12 and full_code not in all_codes:
                                all_codes[full_code] = grade
                        except (ValueError, IndexError):
                            pass
    except Exception as e:
        return None, str(e)

    # Count per grade
    grade_counts = {}
    for code, grade in all_codes.items():
        grade_counts[grade] = grade_counts.get(grade, 0) + 1

    return grade_counts, list(all_codes.keys())[:5]  # return sample codes too

# Process each branch
results = {}
print("=" * 70)
print("PDF TARAMA BAŞLIYOR")
print("=" * 70)

for slug, config in sorted(BRANCHES.items()):
    grade_counts = {}
    sample_codes = []
    errors = []

    for pdf_file in config['pdfs']:
        pdf_path = PDF_DIR + pdf_file
        if not os.path.exists(pdf_path):
            errors.append('PDF yok: ' + pdf_file)
            continue

        counts, samples = extract_unique_codes_from_pdf(pdf_path, config['patterns'])
        if counts is None:
            errors.append(str(samples))
        else:
            for g, c in counts.items():
                grade_counts[g] = grade_counts.get(g, 0) + c
            if samples:
                sample_codes = samples[:3]

    results[slug] = {
        'grade_counts': grade_counts,
        'sample_codes': sample_codes,
        'errors': errors
    }

    status = str(dict(sorted(grade_counts.items()))) if grade_counts else 'BOŞ'
    err = ' [HATA: ' + ', '.join(errors) + ']' if errors else ''
    print(slug + ': ' + status + err)
    if sample_codes:
        print('  örnek: ' + str(sample_codes))

# Save
with open('refs/mufredat-2025/pdf_scan_results.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
print('\nKaydedildi: refs/mufredat-2025/pdf_scan_results.json')
