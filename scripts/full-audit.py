# -*- coding: utf-8 -*-
"""
Tam PDF vs DB audit — tüm branşlar.
fitz kullanarak her PDF'den benzersiz kazanım kodlarını çeker.
"""
import fitz, re, json, os

PDF_DIR = 'refs/mufredat-2025/'
OUT = open('refs/mufredat-2025/full_audit_results.txt', 'w', encoding='utf-8')

def log(msg):
    OUT.write(msg + '\n')
    OUT.flush()

def count_codes(pdf_files, grade_patterns):
    """
    grade_patterns: list of (regex_with_grade_capture, grade_override_or_None)
    grade_override: if int, all matches belong to that grade (for codes without grade in them)
    Returns: {grade: count_of_unique_codes}
    """
    all_codes = {}  # full_code -> grade

    for pdf_file in pdf_files:
        path = PDF_DIR + pdf_file
        if not os.path.exists(path):
            log('  MISSING: ' + pdf_file)
            continue

        doc = fitz.open(path)
        log('  ' + pdf_file + ' (' + str(len(doc)) + ' sayfa)')

        for page_num in range(len(doc)):
            text = doc[page_num].get_text()

            for (pat, grade_override) in grade_patterns:
                if grade_override is not None:
                    # Grade comes from override, not from code
                    matches = re.findall(pat, text)
                    for m in matches:
                        full_code = m if isinstance(m, str) else m[0]
                        full_code = full_code.rstrip('.')
                        if full_code not in all_codes:
                            all_codes[full_code] = grade_override
                else:
                    # Grade is in capture group 1 of pattern
                    for m in re.finditer(pat, text):
                        try:
                            grade = int(m.group(1))
                            if 1 <= grade <= 12:
                                full_code = m.group(0).rstrip('.')
                                if full_code not in all_codes:
                                    all_codes[full_code] = grade
                        except (IndexError, ValueError):
                            pass
        doc.close()

    grade_counts = {}
    for code, grade in all_codes.items():
        grade_counts[grade] = grade_counts.get(grade, 0) + 1

    return grade_counts, list(all_codes.keys())[:5]

# DB counts (from audit - oturum 49)
DB = {
    'matematik':     {1:19, 2:25, 3:33, 4:34, 5:23, 6:24, 7:30, 8:23, 9:30, 10:33, 11:15, 12:21},
    'turkce':        {1:17, 2:20, 3:20, 4:20, 5:100, 6:100, 7:103, 8:103},
    'ingilizce':     {2:156, 3:156, 4:156, 5:160, 6:184, 7:191, 8:192, 9:192, 10:192, 11:192, 12:144},
    'fen_bilimleri': {3:20, 4:19, 5:28, 6:36, 7:36, 8:43},
    'sosyal_bilgiler':{4:17, 5:19, 6:18, 7:17, 8:15},
    'hayat_bilgisi': {1:23, 2:23, 3:20},
    'beden_egitimi': {1:13, 2:12, 3:14, 4:14, 5:16, 6:17, 7:15, 8:10, 9:48, 10:17, 11:19, 12:17},
    'gorsel_sanatlar':{1:11, 2:11, 3:11, 4:11, 5:10, 6:10, 7:10, 8:11, 9:28, 10:22, 11:25, 12:20},
    'muzik':         {1:13, 2:12, 3:12, 4:12, 5:14, 6:12, 7:15, 8:15, 9:12, 10:11, 11:10, 12:8},
    'din_kulturu':   {4:24, 5:46, 6:48, 7:65, 8:66, 9:42, 10:36, 11:38, 12:38},
    'tarih':         {9:13, 10:31, 11:23, 12:34},
    'turk_dili_edebiyati': {9:54, 10:63, 11:64, 12:64},
    'kimya':         {9:23, 10:21, 11:25, 12:24},
    'fizik':         {9:48, 10:22, 11:33, 12:27},
    'biyoloji':      {9:14, 10:19, 11:22, 12:20},
    'cografya':      {9:19, 10:36, 11:19, 12:20},
    'felsefe':       {10:27, 11:43, 12:3},
    'bilisim_teknolojileri': {5:24, 6:24},
    'teknoloji_tasarim': {7:27, 8:22},
    'almanca':       {5:48, 6:48, 7:54, 8:54},
    'arapca':        {2:77, 3:76, 4:85, 5:70, 6:81, 7:80, 8:80},
    'turkce_ilkokul':{1:17, 2:20, 3:20, 4:20},  # part of turkce
}

# PDF configurations: slug -> (pdfs, patterns)
# Pattern format: (regex, grade_override_or_None)
# If grade_override=None → extract grade from capture group 1
SCANS = [
    ('turkce', [
        '2025825154548470-ilkokul türkçe.pdf',
        '202582516532361-ortaokul türkçe.pdf'
    ], [
        (r'T\.[A-ZÇŞÖÜİĞ]+\.(\d+)\.\d+', None),
    ]),
    ('matematik', [
        '2025825154457392-ilkokul matematik.pdf',
        '202582516434252-ortaokul matematik.pdf',
        '2026518151640408-matedöp.pdf',
    ], [
        (r'MAT\.(\d+)\.\d+\.?\d*', None),
    ]),
    ('ingilizce', [
        '202591011405337-26-08-ekli-english-regular.pdf',
        '202591214813382-ingilizce912.pdf',
    ], [
        (r'ENG\.(\d+)\.\d+\.[A-Z]\d+', None),
    ]),
    ('sosyal_bilgiler', [
        '202582516728345-sosyal bilgiler.pdf',
    ], [
        (r'SB\.(\d+)\.\d+\.?\d*', None),
    ]),
    ('hayat_bilgisi', [
        '2025825154255361-hayat bilgisi.pdf',
    ], [
        (r'HB\.(\d+)\.\d+\.?\d*', None),
    ]),
    ('beden_egitimi', [
        '202582511143139-Beden Eğitimi ve Oyun Dersi Öğretim Programı-23.07.2025.pdf',
        '2025825113012649-Beden Eğitimi ve Spor Dersi Öğretim Programı-23.07.2025.pdf',
        '2025826135315128-BEDEN EĞİTİM PROGRAM-21.07.2025.pdf',
    ], [
        (r'BE[OS]?\.(\d+)\.\d+\.?\d*', None),
    ]),
    ('gorsel_sanatlar', [
        '2025101416114957-görselsanat.pdf',
        '2025912101051975-görsel912.pdf',
    ], [
        (r'GS\.(\d+)\.\d+\.?\d*', None),
    ]),
    ('muzik', [
        '2025819135241760-müzik18döp.pdf',
        '202591210020850-müzikprogram912.pdf',
    ], [
        (r'M[ÜU][ZS]?\.(\d+)\.\d+\.?\d*', None),
    ]),
    ('din_kulturu', [
        '202631310725635-dkab48.pdf',
        '2026313101155916-dkab912.pdf',
    ], [
        (r'DKAB\.0?(\d+)\.\d+\.?\d*', None),
    ]),
    ('tarih', [
        '202582695425908-tarih.pdf',
    ], [
        (r'TAR\.(\d+)\.\d+\.?\d*', None),
        (r'[İI]TA\.(\d+)\.\d+\.?\d*', None),
        (r'[ÇC]TDT\.(\d+)\.\d+\.?\d*', None),
        (r'SÇDT\.(\d+)\.\d+\.?\d*', None),
    ]),
    ('turk_dili_edebiyati', [
        '2026518151120283-edebiyatdöp.pdf',
    ], [
        (r'TDE\.(\d+)\.[A-Z]\d+\.\d+\.?\d*', None),
    ]),
    ('kimya', [
        '2026518151539674-kimya.pdf',
    ], [
        (r'K[İI]M\.(\d+)\.\d+\.?\d*', None),
    ]),
    ('fizik', [
        '2026518151437471-fizikdöp.pdf',
    ], [
        (r'F[İI]Z\.(\d+)\.\d+\.?\d*', None),
        (r'AST\.(\d+)\.\d+\.?\d*', None),  # Astronomi (grade 9 seçmeli)
    ]),
    ('biyoloji', [
        '202651815105221-biyolojidöp.pdf',
    ], [
        (r'B[İI]Y\.(\d+)\.\d+\.?\d*', None),
    ]),
    ('cografya', [
        '2026518151228236-cogdöp.pdf',
    ], [
        (r'CO[ĞG]\.(\d+)\.\d+\.?\d*', None),
        (r'[İI][ÇC]Y[ÇC]\.(\d+)\.\d+\.?\d*', None),  # İklim, Çevre ve Yenilikçi Çözümler
    ]),
    ('felsefe', [
        '2026518151339111-felsefedöp.pdf',
        '202632613416463-psikoloji.pdf',
        '2026326134747604-mantık.pdf',
    ], [
        (r'FEL\.(\d+)\.\d+\.?\d*', None),
        (r'PSK\.(\d+)\.\d+\.?\d*', None),
        (r'MNT\.(\d+)\.\d+\.?\d*', None),
        # PSK might not have grade in code - check
    ]),
    ('bilisim_teknolojileri', [
        '202591115327350-bilişim döp.pdf',
    ], [
        (r'BTY\.(\d+)\.\d+\.?\d*', None),
    ]),
    ('teknoloji_tasarim', [
        '202651415165252-teknotasardöp.pdf',
    ], [
        (r'TT\.(\d+)\.\d+\.?\d*', None),
    ]),
    ('almanca', [
        '202591115301147-almanca döp.pdf',
    ], [
        (r'DE\.(\d+)\.\d+\.[A-Z]\d+\.?\d*', None),
    ]),
    ('arapca', [
        '2025912135022975-arapca24.pdf',
        '202591213515585-arapca58.pdf',
        '202591213531335-arapca910.pdf',
    ], [
        (r'ARP\.(\d+)\.\d+\.\d+\.?\d*', None),
    ]),
]

log('=' * 70)
log('FULL PDF vs DB AUDIT')
log('=' * 70)

gap_report = []

for (slug, pdfs, patterns) in SCANS:
    log('\n### ' + slug.upper() + ' ###')
    pdf_counts, samples = count_codes(pdfs, patterns)
    db_counts = DB.get(slug, {})

    log('  PDF: ' + str(dict(sorted(pdf_counts.items()))))
    log('  DB:  ' + str(dict(sorted(db_counts.items()))))
    if samples:
        log('  Örnek kodlar: ' + str(samples))

    # Compare
    all_grades = sorted(set(list(pdf_counts.keys()) + list(db_counts.keys())))
    issues = []
    for g in all_grades:
        pdf_c = pdf_counts.get(g, 0)
        db_c = db_counts.get(g, 0)
        if pdf_c == 0 and db_c > 0:
            issues.append('sinif ' + str(g) + ': DB=' + str(db_c) + ' PDF=YOK')
        elif db_c == 0 and pdf_c > 0:
            issues.append('sinif ' + str(g) + ': EKSİK ' + str(pdf_c) + ' kazanım')
        elif pdf_c > 0 and abs(pdf_c - db_c) > 2:
            diff = pdf_c - db_c
            issues.append('sinif ' + str(g) + ': PDF=' + str(pdf_c) + ' DB=' + str(db_c) + ' FARK=' + str(diff))

    if issues:
        log('  ⚠️  SORUNLAR:')
        for issue in issues:
            log('     ' + issue)
        gap_report.append({'slug': slug, 'issues': issues})
    else:
        log('  ✓ Eşleşiyor')

log('\n' + '=' * 70)
log('ÖZET — SORUNLU BRANŞLAR')
log('=' * 70)
for item in gap_report:
    log(item['slug'] + ':')
    for issue in item['issues']:
        log('  ' + issue)

log('\nTamamlandı.')
OUT.close()
print('Done. Output: refs/mufredat-2025/full_audit_results.txt')
