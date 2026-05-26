"""Sınıf bilgisini belirlemek için ders çizelgesi bölümlerini tarar."""
import fitz, re, sys, os
sys.stdout.reconfigure(encoding='utf-8')

PDF_DIR = r'refs\mufredat-2025'

def metin_al(dosya):
    doc = fitz.open(os.path.join(PDF_DIR, dosya))
    return '\n'.join(p.get_text() for p in doc)

# Sosyal Bilim Çalışmaları: Roman numeral kodları tara
print('=== sosyal_bil_c — tüm Roman numeral kodlar ===')
m = metin_al('202632614151726-sosyalbilimc.pdf')
# I, II, III prefix ile kodlar
pat_roman = re.compile(r'(I{1,3}|IV|V[I]{0,3})\.\d+\.\d+')
roman_hits = sorted(set(pat_roman.findall(m)))
print(f'  Roman levels: {roman_hits}')
pat_full = re.compile(r'((?:I{1,3}|IV|V[I]{0,3})\.\d+\.\d+)')
full_hits = sorted(set(pat_full.findall(m)))
print(f'  Tüm kodlar ({len(full_hits)}): {full_hits}')
# Ders süre tablosu
sure_idx = m.find('SÜRE TABLOSU')
if sure_idx >= 0:
    print(f'  Süre Tablosu: {m[sure_idx:sure_idx+600]}')

# Demokrasi: herhangi bir öğrenme çıktısı kodu var mı?
print('\n=== demokrasi — derinlemesine tarama ===')
m2 = metin_al('202632613560229-demokrasiinsanhak.pdf')
# Tüm kısa kod benzeri şeyler
for pat in [
    r'([A-ZÇĞİÖŞÜ]{2,6}\.[\d\.]+)',
    r'(OB\.\d+\.\d+)',
    r'(DIH\.\d+\.\d+)',
    r'(DİH\.\d+\.\d+)',
    r'(D[İI][AH]\.[\d\.]+)',
    r'(\d+\.\d+\.[\d]+)',
]:
    hits = set(re.findall(pat, m2))
    if hits:
        print(f'  {pat}: {sorted(hits)[:8]}')
# Üniteler bölümü
unite_idx = m2.find('ÜNİTELERİ')
if unite_idx < 0:
    unite_idx = m2.find('2. DEMOKRASİ')
if unite_idx >= 0:
    print(f'  Üniteler: {m2[unite_idx:unite_idx+800]}')

# Türk Kültür: derinlemesine
print('\n=== turk_kultur — derinlemesine tarama ===')
m3 = metin_al('2026326135350307-türkkültürmedeniyt.pdf')
for pat in [
    r'([A-ZÇĞİÖŞÜ]{2,6}\.[\d\.]+)',
    r'(TKM\.\d+\.\d+)',
    r'(TK\.\d+\.\d+)',
]:
    hits = set(re.findall(pat, m3))
    if hits:
        print(f'  {pat}: {sorted(hits)[:8]}')
unite_idx3 = m3.find('2. TÜRK KÜLTÜR')
if unite_idx3 >= 0:
    print(f'  Üniteler: {m3[unite_idx3:unite_idx3+600]}')

# Astronomi: sinif-kazanım ilişkisi
print('\n=== astronomi — kazanım-sınıf yapısı ===')
m4 = metin_al('2026326135719151-astronımiveuzay.pdf')
sure_idx4 = m4.find('SÜRE TABLOSU')
if sure_idx4 >= 0:
    print(f'  Süre Tablosu: {m4[sure_idx4:sure_idx4+800]}')
# Sinif özel bölüm var mı?
sinif_bolum = re.findall(r'((?:9|10|11|12)\. SINIF.{0,200})', m4)
print(f'  Sınıf bölümleri: {sinif_bolum[:3]}')

# mat_uygulama: MAT.U kodları ve düzey yapısı
print('\n=== mat_uygulama — düzey-kod yapısı ===')
m5 = metin_al('202632614555417-matematikuygulamalar.pdf')
sure_idx5 = m5.find('SÜRE TABLOSU')
if sure_idx5 >= 0:
    print(f'  Süre Tablosu: {m5[sure_idx5:sure_idx5+800]}')
# MAT.U kodları
matu_re = re.compile(r'(MAT\.U\.(\d+)\.(\d+)\.(\d+))')
matu_hits = sorted(set(m.group(1) for m in matu_re.finditer(m5)))
print(f'  Tüm MAT.U kodları ({len(matu_hits)}): {matu_hits}')
# Düzey bölüm başlıkları
duzey_bolum = re.findall(r'(?:I{1,2})\.\s*(?:DÜZEY|DÖNEM|LEVEL|MATEMATİK UYGULAMA).{0,100}', m5, re.IGNORECASE)
print(f'  Düzey bölümleri: {duzey_bolum[:5]}')
