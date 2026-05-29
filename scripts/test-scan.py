# -*- coding: utf-8 -*-
# Search ALL pages for code patterns
import pdfplumber, re, fitz

outfile = open('refs/mufredat-2025/scan_test.txt', 'w', encoding='utf-8')
def log(msg): outfile.write(msg + '\n'); outfile.flush()

# Branch specific patterns and PDFs
tests = [
    ('kimya',   'refs/mufredat-2025/2026518151539674-kimya.pdf',             [r'K[İI]M\.\d+\.\d+', r'KIM\.\d+\.\d+']),
    ('almanca', 'refs/mufredat-2025/202591115301147-almanca döp.pdf',         [r'DE\.\d+\.', r'DEU\.\d+\.']),
    ('ingilizce','refs/mufredat-2025/202591011405337-26-08-ekli-english-regular.pdf', [r'ENG\.\d+\.', r'EN\.\d+\.']),
    ('turkce',  'refs/mufredat-2025/202582516532361-ortaokul türkçe.pdf',     [r'T\.[A-Z]+\.\d+\.', r'TK\.\d+\.']),
    ('felsefe', 'refs/mufredat-2025/2026518151339111-felsefedöp.pdf',         [r'FEL\.\d+\.', r'PSİ\.\d+\.', r'FL\.\d+\.']),
    ('dkab48',  'refs/mufredat-2025/202631310725635-dkab48.pdf',              [r'DKAB\.\d+\.', r'DK\.\d+\.']),
    ('dkab912', 'refs/mufredat-2025/2026313101155916-dkab912.pdf',            [r'DKAB\.\d+\.', r'DK\.\d+\.']),
]

for name, path, patterns in tests:
    log('\n=== ' + name + ' ===')
    found_codes = set()
    found_page = None
    try:
        with pdfplumber.open(path) as pdf:
            log('Total pages: ' + str(len(pdf.pages)))
            for i, page in enumerate(pdf.pages):
                text = page.extract_text() or ''
                for pat in patterns:
                    codes = re.findall(pat, text)
                    if codes:
                        for c in codes:
                            found_codes.add(c)
                        if found_page is None:
                            found_page = i + 1
                            log('First match on page ' + str(i+1) + ': ' + str(codes[:3]))
            if found_codes:
                log('Total unique prefixes: ' + str(len(found_codes)))
                log('Sample: ' + str(sorted(list(found_codes))[:10]))
            else:
                # Show a page from the middle that has content
                mid = len(pdf.pages) // 3
                t = pdf.pages[mid].extract_text() or ''
                log('No matches in any page. Page ' + str(mid+1) + ' sample:')
                log(t[:300].replace('\n', '|'))
                # Also try fitz for comparison
                doc = fitz.open(path)
                fitz_text = doc[mid].get_text()
                codes_fitz = []
                for pat in patterns:
                    codes_fitz += re.findall(pat, fitz_text)
                if codes_fitz:
                    log('fitz found: ' + str(codes_fitz[:5]))
                else:
                    log('fitz page ' + str(mid+1) + ' sample: ' + fitz_text[:200].replace('\n', '|'))
    except Exception as e:
        log('ERROR: ' + str(e))

log('\nDone')
outfile.close()
