"""Grup 2 PDFlerini inceler: kod formatı, sınıf bilgisi, bölüm yapısı."""
import fitz, re, sys, os
sys.stdout.reconfigure(encoding='utf-8')

PDF_DIR = r'refs\mufredat-2025'

PDFS = {
    'psikoloji':    '202632613416463-psikoloji.pdf',
    'mantik':       '2026326134747604-mantık.pdf',
    'cagdas_turk':  '2026326134940604-çağdaştürk.pdf',
    'astronomi':    '2026326135719151-astronımiveuzay.pdf',
    'iklim':        '2026326135915854-iklimçevre.pdf',
    'sosyal_bil_c': '202632614151726-sosyalbilimc.pdf',
    'mat_uygulama': '202632614555417-matematikuygulamalar.pdf',
    'saglik':       '20265139507417-Saglıkbiltrafik.pdf',
    'islam_bilim':  '2026326134623635-islambilimtarh.pdf',
    'demokrasi':    '202632613560229-demokrasiinsanhak.pdf',
    'turk_kultur':  '2026326135350307-türkkültürmedeniyt.pdf',
}

# Known 2-part code patterns
CODE_RES = {
    'psikoloji':    re.compile(r'(PSK\.(\d+)\.(\d+))'),
    'mantik':       re.compile(r'(MAN\.(\d+)\.(\d+))'),
    'cagdas_turk':  re.compile(r'((?:ÇTDT|CTDT|ÇTD)\.(\d+)\.(\d+))'),
    'astronomi':    re.compile(r'(AST\.(\d+)\.(\d+))'),
    'iklim':        re.compile(r'((?:İÇYÇ|IÇYÇ|IÇ)\.(\d+)\.(\d+))'),
    'sosyal_bil_c': re.compile(r'(SBC\.(\d+)\.(\d+))'),
    'mat_uygulama': re.compile(r'(MAT\.U\.(\d+)\.(\d+)\.(\d+))'),
    'saglik':       re.compile(r'((?:SBT|SBTK)\.(\d+)\.(\d+))'),
    'islam_bilim':  re.compile(r'(İBT\.(\d+)\.(\d+))'),
    'demokrasi':    re.compile(r'((?:OB|DIH|DİH)\.(\d+)\.(\d+))'),
    'turk_kultur':  re.compile(r'((?:TKM|TKD|TK|TKÜ)\.(\d+)\.(\d+))'),
}

SINIF_RE = re.compile(r'(\d{1,2})\.\s*SINIF', re.IGNORECASE)
BOLUM_RE = re.compile(r'(\d+)\.\s*(?:ÜNİTE|TEMA|DERS|BÖLÜM|MODÜL|DÜZEY|LEVEL|KADEME)\s*[:：]?\s*(.{0,60})', re.IGNORECASE)

for anahtar, dosya in PDFS.items():
    yol = os.path.join(PDF_DIR, dosya)
    doc = fitz.open(yol)
    metin = '\n'.join(p.get_text() for p in doc)

    # Kod tara
    kod_re = CODE_RES[anahtar]
    kodlar = kod_re.findall(metin)

    # Benzersiz kodlar + sayım
    benzersiz = sorted(set(k[0] for k in kodlar))

    # Sınıf headers
    sinif_hits = SINIF_RE.findall(metin)
    sinif_sayim = {}
    for s in sinif_hits:
        sinif_sayim[int(s)] = sinif_sayim.get(int(s), 0) + 1

    # Bölüm headers
    bolumler = BOLUM_RE.findall(metin[:3000])

    print(f'\n{"="*60}')
    print(f'[{anahtar}] — {dosya}')
    print(f'  Kod sayısı: {len(benzersiz)} benzersiz ({len(kodlar)} toplam)')
    if benzersiz:
        print(f'  İlk 8 kod: {benzersiz[:8]}')
    if sinif_sayim:
        print(f'  SINIF headers: {dict(sorted(sinif_sayim.items()))}')
    if bolumler:
        print(f'  Bölümler (ilk 2000): {bolumler[:5]}')

    # İlk 500 karakter metin
    print(f'  Metin[0:300]: {metin[:300].replace(chr(10), " ")}')
