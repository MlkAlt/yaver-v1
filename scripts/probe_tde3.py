"""TDE PDF — sayfa bazında oku, 9. sınıf bölümünü bul."""
import fitz, re, sys, os
sys.stdout.reconfigure(encoding='utf-8')

PDF_DIR = r'refs\mufredat-2025'
dosya = '2026518151228236-edebiyatdöp.pdf'
doc = fitz.open(os.path.join(PDF_DIR, dosya))

# Sayfa sayısını gör
print(f'Toplam sayfa: {doc.page_count}')

# Her sayfanın ilk 100 karakterini ve sınıf içerip içermediğini tara
sinif9_sayfa = None
for i, page in enumerate(doc):
    txt = page.get_text()
    if '9. SINIF' in txt.upper() and i > 10:  # TOC sayfalarını atla
        if sinif9_sayfa is None:
            sinif9_sayfa = i
            print(f'İlk "9. SINIF" sayfası: {i}')
            print(txt[:500])
            break

# İçindekiler sayfasını bul
for i, page in enumerate(doc[:5]):
    txt = page.get_text()
    if 'İÇİNDEKİLER' in txt or 'SINIF TEMALARI' in txt:
        print(f'\nTOC sayfası {i}:')
        print(txt[:800])

# 60-70. sayfaları oku (içindekiler 9. sınıf = sayfa 65)
print('\n=== Sayfa 60-70 (9. sınıf temalara ulaşım) ===')
for i in range(55, 70):
    if i < doc.page_count:
        txt = doc[i].get_text()
        if txt.strip():
            print(f'\n--- Sayfa {i} ---')
            print(txt[:300])
