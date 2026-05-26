"""TDE PDF — kazanım formatını anlamak için tema bölümlerini oku."""
import fitz, re, sys, os
sys.stdout.reconfigure(encoding='utf-8')

PDF_DIR = r'refs\mufredat-2025'
dosya = '2026518151228236-edebiyatdöp.pdf'
doc = fitz.open(os.path.join(PDF_DIR, dosya))
metin = '\n'.join(p.get_text() for p in doc)

# 9. SINIF içerik bölümünü bul (TOC değil, gerçek içerik)
# İçindekiler tablosunda: "9. SINIF TEMALARI\n65"
# Gerçek içerik: "9. SINIF) Temaların Doğası"
sinif9_start = metin.find('9. SINIF) Temaların Doğası')
sinif10_start = metin.find('10. SINIF) Temaların Doğası')
sinif11_start = metin.find('11. SINIF) Temaların Doğası')
sinif12_start = metin.find('12. SINIF) Temaların Doğası')

print(f'9. sınıf içerik başlangıcı: {sinif9_start}')
print(f'10. sınıf içerik başlangıcı: {sinif10_start}')
print(f'11. sınıf içerik başlangıcı: {sinif11_start}')
print(f'12. sınıf içerik başlangıcı: {sinif12_start}')

# 9. sınıf ilk tema içeriğini oku
if sinif9_start >= 0:
    segment = metin[sinif9_start:sinif9_start + 3000]
    print(f'\n9. SINIF İlk Tema Bölümü:\n{segment}')
