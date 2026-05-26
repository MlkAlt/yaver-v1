"""
Grup 2 lise seçmeli PDFlerinden kazanımları çıkarır.
2-part codes (PSK.X.Y, MAN.X.Y, ...) — sınıf sabit atanır.
Özel: mat_uygulama (MAT.U.X.Y.Z), sosyal_bil_c (I.X.Y)
Çıktı: brans/lise-mufredat-2025/{anahtar}.json
Kullanım: python scripts/extract_grup2_kazanimlar.py [anahtar|all]
"""
import fitz, re, json, os, sys
sys.stdout.reconfigure(encoding='utf-8')

PDF_DIR = r'refs\mufredat-2025'
OUT_DIR = r'brans\lise-mufredat-2025'

# ─── Metin temizleme (extract_lise_kazanimlar.py'den aynı) ───────────────────
def temizle(s):
    s = re.sub(r'-\n\s*', '', s)
    s = re.sub(r'[   ]', ' ', s)
    s = re.sub(r'\n', ' ', s)
    s = re.sub(r'\s{2,}', ' ', s)
    s = s.strip()
    s = re.sub(r'^\.?\s*', '', s)
    s = re.sub(r'^\d+\.\s+(?=[A-ZÇĞİŞÜ])', '', s)
    s = re.sub(r'[""].*', '', s).strip()
    s = re.sub(r'^[–—]\s*', '', s).strip()
    lz = s.find(' Lernziel:')
    if lz > 0: s = s[:lz].strip()
    if s.startswith('Öğrencilerden '):
        s = s[len('Öğrencilerden '):]
        bp = s.find(' beklenir.')
        if bp > 0: s = s[:bp]
        s = re.sub(r'leri$', '', s).strip()
        s = s[0].upper() + s[1:] if s else s
    return s.strip()

def pdf_metni(yol):
    doc = fitz.open(yol)
    return '\n'.join(p.get_text() for p in doc)

def tema_haritasi(metin):
    tema_re = re.compile(r'(\d+)\.\s+TEMA\s*[:：]\s*(.+?)(?=\n)', re.IGNORECASE)
    return [(m.start(), int(m.group(1)), temizle(m.group(2))) for m in tema_re.finditer(metin)]

def bul_tema(pos, temalar):
    tema_no, tema_ad = 1, ''
    for t_pos, t_no, t_ad in temalar:
        if t_pos <= pos: tema_no, tema_ad = t_no, t_ad
        else: break
    return tema_no, tema_ad

META_KEYWORDS = [
    'Ders Kodu', 'Sınıf Düzeyi', 'Ünite Numarası', 'Öğrenme Çıktısı Numarası',
    'Ders adı', 'Çıktı numarası', 'Sınıf Seviyesi',
    'belirli ilkeleri ifade eder', 'yaşantıları sonunda öğrenciye',
]

def parse_sabit_sinif(metin, kod_re, sinif_sabit):
    """2-part kodlar için: sınıf sabit, ünite no = grups[1]."""
    temalar = tema_haritasi(metin)
    alt_madde_re = re.compile(r'\n\s*[a-z]\)\s')
    bolum_re = re.compile(r'\n\s*(?:İÇERİK ÇERÇEVESİ|ÖĞRENME KANITLARI|ÖĞRENME-ÖĞRETME|DERS SAATİ|ALAN BECERİ|KAVRAMSAL BECERİ)')
    sonraki_kod_re = re.compile(kod_re.pattern)

    kazanimlar = []
    gorduk = set()

    for m in kod_re.finditer(metin):
        kod = m.group(1)
        if kod in gorduk: continue

        aciklama_bas = m.end()
        metin_sonrasi = metin[aciklama_bas:aciklama_bas + 600]
        bitis = len(metin_sonrasi)

        alt_m = alt_madde_re.search(metin_sonrasi)
        bol_m = bolum_re.search(metin_sonrasi)
        son_m = sonraki_kod_re.search(metin_sonrasi)
        if alt_m: bitis = min(bitis, alt_m.start())
        if bol_m: bitis = min(bitis, bol_m.start())
        if son_m: bitis = min(bitis, son_m.start())

        aciklama = temizle(metin_sonrasi[:bitis])
        if len(aciklama) < 15 or aciklama[0] in '),': continue
        if any(kw in aciklama for kw in META_KEYWORDS): continue

        grups = m.groups()
        unite_no = int(grups[1])

        tema_no, tema_ad = bul_tema(m.start(), temalar)
        gorduk.add(kod)
        kazanimlar.append({
            'kod': kod, 'ad': aciklama, 'sinif': sinif_sabit,
            'tema_no': unite_no, 'tema_ad': tema_ad,
        })

    return kazanimlar


def parse_mat_uygulama(metin, kod_re):
    """MAT.U.LEVEL.UNITE.NO — level 1→sinif 9, level 2→sinif 10."""
    LEVEL_SINIF = {'1': 9, '2': 10}
    temalar = tema_haritasi(metin)
    alt_madde_re = re.compile(r'\n\s*[a-z]\)\s')
    bolum_re = re.compile(r'\n\s*(?:İÇERİK ÇERÇEVESİ|ÖĞRENME KANITLARI|ÖĞRENME-ÖĞRETME|DERS SAATİ|ALAN BECERİ|KAVRAMSAL BECERİ)')
    sonraki_kod_re = re.compile(kod_re.pattern)

    kazanimlar = []
    gorduk = set()

    for m in kod_re.finditer(metin):
        kod = m.group(1)   # MAT.U.1.2.3
        if kod in gorduk: continue

        aciklama_bas = m.end()
        metin_sonrasi = metin[aciklama_bas:aciklama_bas + 600]
        bitis = len(metin_sonrasi)

        alt_m = alt_madde_re.search(metin_sonrasi)
        bol_m = bolum_re.search(metin_sonrasi)
        son_m = sonraki_kod_re.search(metin_sonrasi)
        if alt_m: bitis = min(bitis, alt_m.start())
        if bol_m: bitis = min(bitis, bol_m.start())
        if son_m: bitis = min(bitis, son_m.start())

        aciklama = temizle(metin_sonrasi[:bitis])
        if len(aciklama) < 15 or aciklama[0] in '),': continue
        if any(kw in aciklama for kw in META_KEYWORDS): continue

        grups = m.groups()  # ('MAT.U.1.2.3', '1', '2', '3')
        level = grups[1]
        sinif = LEVEL_SINIF.get(level, 9)
        unite_no = int(grups[2])

        tema_no, tema_ad = bul_tema(m.start(), temalar)
        gorduk.add(kod)
        kazanimlar.append({
            'kod': kod, 'ad': aciklama, 'sinif': sinif,
            'tema_no': unite_no, 'tema_ad': tema_ad,
        })

    return kazanimlar


def parse_sosyal_bil_c(metin):
    """Roman numeral codes: I.X.Y→sinif=10, II.X.Y→sinif=11, III.X.Y→sinif=12.
    Prefix SBC eklenerek kaydedilir: SBC.I.X.Y"""
    ROMAN_SINIF = {'I': 10, 'II': 11, 'III': 12}
    kod_re = re.compile(r'\b(I{1,3})\.((\d+)\.(\d+))\b')

    temalar = tema_haritasi(metin)
    alt_madde_re = re.compile(r'\n\s*[a-z]\)\s')
    bolum_re = re.compile(r'\n\s*(?:İÇERİK ÇERÇEVESİ|ÖĞRENME KANITLARI|ÖĞRENME-ÖĞRETME|DERS SAATİ|ALAN BECERİ|KAVRAMSAL BECERİ)')

    kazanimlar = []
    gorduk = set()
    sonraki_kod_re = re.compile(r'\b(?:I{1,3})\.\d+\.\d+\b')

    for m in kod_re.finditer(metin):
        roman = m.group(1)  # I, II, veya III
        kod_suffix = m.group(2)  # X.Y
        kod = f'SBC.{roman}.{kod_suffix}'
        if kod in gorduk: continue

        aciklama_bas = m.end()
        metin_sonrasi = metin[aciklama_bas:aciklama_bas + 600]
        bitis = len(metin_sonrasi)

        alt_m = alt_madde_re.search(metin_sonrasi)
        bol_m = bolum_re.search(metin_sonrasi)
        son_m = sonraki_kod_re.search(metin_sonrasi)
        if alt_m: bitis = min(bitis, alt_m.start())
        if bol_m: bitis = min(bitis, bol_m.start())
        if son_m: bitis = min(bitis, son_m.start())

        aciklama = temizle(metin_sonrasi[:bitis])
        if len(aciklama) < 15 or aciklama[0] in '),': continue
        if any(kw in aciklama for kw in META_KEYWORDS): continue

        sinif = ROMAN_SINIF.get(roman, 10)
        unite_no = int(m.group(3))
        tema_no, tema_ad = bul_tema(m.start(), temalar)
        gorduk.add(kod)
        kazanimlar.append({
            'kod': kod, 'ad': aciklama, 'sinif': sinif,
            'tema_no': unite_no, 'tema_ad': tema_ad,
        })

    return kazanimlar


# ─── PDF Konfigürasyonları ────────────────────────────────────────────────────
PDFS = {
    'psikoloji': {
        'dosya': '202632613416463-psikoloji.pdf',
        'brans': 'Felsefe', 'brans_slug': 'felsefe',
        'ders': 'Psikoloji', 'ders_turu': 'secmeli',
        'siniflar_okul_tipi': {11: 'lise'},
        'sinif_sabit': 11,
        'kod_re': re.compile(r'(PSK\.(\d+)\.(\d+))'),
        'parser': 'sabit_sinif',
    },
    'mantik': {
        'dosya': '2026326134747604-mantık.pdf',
        'brans': 'Felsefe', 'brans_slug': 'felsefe',
        'ders': 'Mantık', 'ders_turu': 'secmeli',
        'siniflar_okul_tipi': {10: 'lise'},
        'sinif_sabit': 10,
        'kod_re': re.compile(r'(MAN\.(\d+)\.(\d+))'),
        'parser': 'sabit_sinif',
    },
    'cagdas_turk': {
        'dosya': '2026326134940604-çağdaştürk.pdf',
        'brans': 'Tarih', 'brans_slug': 'tarih',
        'ders': 'Çağdaş Türk ve Dünya Tarihi', 'ders_turu': 'secmeli',
        'siniflar_okul_tipi': {12: 'lise'},
        'sinif_sabit': 12,
        'kod_re': re.compile(r'(ÇTDT\.(\d+)\.(\d+))'),
        'parser': 'sabit_sinif',
    },
    'astronomi': {
        'dosya': '2026326135719151-astronımiveuzay.pdf',
        'brans': 'Fizik', 'brans_slug': 'fizik',
        'ders': 'Astronomi ve Uzay Bilimleri', 'ders_turu': 'secmeli',
        'siniflar_okul_tipi': {9: 'lise'},
        'sinif_sabit': 9,
        'kod_re': re.compile(r'(AST\.(\d+)\.(\d+))'),
        'parser': 'sabit_sinif',
    },
    'iklim': {
        'dosya': '2026326135915854-iklimçevre.pdf',
        'brans': 'Coğrafya', 'brans_slug': 'cografya',
        'ders': 'İklim, Çevre ve Yenilikçi Çözümler', 'ders_turu': 'secmeli',
        'siniflar_okul_tipi': {10: 'lise'},
        'sinif_sabit': 10,
        'kod_re': re.compile(r'(İÇYÇ\.(\d+)\.(\d+))'),
        'parser': 'sabit_sinif',
    },
    'saglik': {
        'dosya': '20265139507417-Saglıkbiltrafik.pdf',
        'brans': 'Beden Eğitimi ve Spor', 'brans_slug': 'beden_egitimi',
        'ders': 'Sağlık Bilgisi ve Trafik Kültürü', 'ders_turu': 'secmeli',
        'siniflar_okul_tipi': {9: 'lise'},
        'sinif_sabit': 9,
        'kod_re': re.compile(r'(SBTK\.(\d+)\.(\d+))'),
        'parser': 'sabit_sinif',
    },
    'mat_uygulama': {
        'dosya': '202632614555417-matematikuygulamalar.pdf',
        'brans': 'Matematik', 'brans_slug': 'matematik',
        'ders': 'Matematik Uygulamaları', 'ders_turu': 'secmeli',
        'siniflar_okul_tipi': {9: 'lise', 10: 'lise'},
        'kod_re': re.compile(r'(MAT\.U\.(\d+)\.(\d+)\.(\d+))'),
        'parser': 'mat_uygulama',
    },
    'sosyal_bil_c': {
        'dosya': '202632614151726-sosyalbilimc.pdf',
        'brans': 'Tarih', 'brans_slug': 'tarih',
        'ders': 'Sosyal Bilim Çalışmaları', 'ders_turu': 'secmeli',
        'siniflar_okul_tipi': {10: 'lise', 11: 'lise', 12: 'lise'},
        'parser': 'sosyal_bil_c',
    },
}


def extract(anahtar):
    if anahtar not in PDFS:
        print(f'Bilinmeyen: {anahtar}'); return

    cfg = PDFS[anahtar]
    yol = os.path.join(PDF_DIR, cfg['dosya'])
    if not os.path.exists(yol):
        print(f'HATA: {yol}'); return

    print(f'[{anahtar}] Okunuyor...')
    metin = pdf_metni(yol)

    parser = cfg['parser']
    if parser == 'sabit_sinif':
        kazanimlar = parse_sabit_sinif(metin, cfg['kod_re'], cfg['sinif_sabit'])
    elif parser == 'mat_uygulama':
        kazanimlar = parse_mat_uygulama(metin, cfg['kod_re'])
    elif parser == 'sosyal_bil_c':
        kazanimlar = parse_sosyal_bil_c(metin)
    else:
        print(f'Bilinmeyen parser: {parser}'); return

    by_sinif = {}
    for k in kazanimlar:
        by_sinif[k['sinif']] = by_sinif.get(k['sinif'], 0) + 1
    print(f'  Sınıf: {dict(sorted(by_sinif.items()))} | toplam={len(kazanimlar)}')

    os.makedirs(OUT_DIR, exist_ok=True)
    cikti = {
        'brans': cfg['brans'],
        'brans_slug': cfg['brans_slug'],
        'ders': cfg['ders'],
        'ders_turu': cfg['ders_turu'],
        'siniflar_okul_tipi': cfg['siniflar_okul_tipi'],
        'kaynak_pdf': cfg['dosya'],
        'kaynak_yil': '2025',
        'kazanimlar': kazanimlar,
    }
    cikti_yol = os.path.join(OUT_DIR, f'{anahtar}.json')
    with open(cikti_yol, 'w', encoding='utf-8') as f:
        json.dump(cikti, f, ensure_ascii=False, indent=2)
    print(f'  Kaydedildi: {cikti_yol}')


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Kullanım: python scripts/extract_grup2_kazanimlar.py [anahtar|all]')
        print('Geçerli:', ', '.join(PDFS.keys()))
        sys.exit(0)
    keys = list(PDFS.keys()) if sys.argv[1] == 'all' else sys.argv[1:]
    for key in keys:
        extract(key)
