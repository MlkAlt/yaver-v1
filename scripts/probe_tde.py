"""TDE PDF yapısını inceler — sınıf bölümleri, kazanım formatı."""
import fitz, re, sys, os
sys.stdout.reconfigure(encoding='utf-8')

PDF_DIR = r'refs\mufredat-2025'
dosya = '2026518151228236-edebiyatdöp.pdf'

doc = fitz.open(os.path.join(PDF_DIR, dosya))
metin = '\n'.join(p.get_text() for p in doc)

# Sınıf bölüm başlıkları
sinif_re = re.compile(r'(\d{1,2})\.\s*SINIF', re.IGNORECASE)
sinif_hits = [(m.start(), m.group()) for m in sinif_re.finditer(metin)]
print(f'Toplam SINIF ref: {len(sinif_hits)}')
for pos, txt in sinif_hits[:30]:
    ctx = metin[pos:pos+80].replace('\n', ' ')
    print(f'  {pos:6d}: {ctx}')

# Ünite/Tema headers
unite_re = re.compile(r'(\d+)\.\s*(?:ÜNİTE|TEMA)\s*[:：]?\s*(.{0,80})', re.IGNORECASE)
uniteler = unite_re.findall(metin)
print(f'\nÜnite başlıkları (ilk 20): {uniteler[:20]}')

# Kazanım benzeri yapılar — kısa cümleler
kazanim_re = re.compile(r'\n([A-ZÇĞİÖŞÜ][^.\n]{20,120}(?:abilme|ebilme|bilme|abilir|ebilir|der|r\.|ir\.|er\.))', re.MULTILINE)
hits = kazanim_re.findall(metin[:5000])
print(f'\nKazanım benzeri satırlar (ilk 2000 karakter): {hits[:10]}')

# İçindekiler tablosunu oku
icerik_idx = metin.find('İÇİNDEKİLER')
if icerik_idx >= 0:
    print(f'\nİçindekiler:\n{metin[icerik_idx:icerik_idx+1500]}')
