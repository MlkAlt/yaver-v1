"""TDE PDF — TDE kodlarını tara, unique mi kontrol et, grade mapping bul."""
import fitz, re, sys, os, collections
sys.stdout.reconfigure(encoding='utf-8')

PDF_DIR = r'refs\mufredat-2025'
dosya = '2026518151228236-edebiyatdöp.pdf'
doc = fitz.open(os.path.join(PDF_DIR, dosya))

# Sayfa bazında oku, TDE kodlarını bul
tde_re = re.compile(r'TDE(\d+)\.(\d+)\.')

# Sinif belirleme — her sayfanın hangi sınıf bölümünde olduğunu takip et
# TOC: 9. SINIF = sayfa 65, 10. SINIF = 97, 11. SINIF = 132, 12. SINIF = 169
SINIF_SAYFALAR = {
    0: 'hazirlik',   # 0-64
    65: 9,
    97: 10,
    132: 11,
    169: 12,
}

def sinif_bul(sayfa_no):
    sinif = 'hazirlik'
    for p, s in sorted(SINIF_SAYFALAR.items()):
        if sayfa_no >= p:
            sinif = s
    return sinif

# Tüm TDE kodları ve sinifları topla
tum_kodlar = []  # (sayfa_no, sinif, tam_kod, grup, no)
for i, page in enumerate(doc):
    txt = page.get_text()
    sinif = sinif_bul(i + 1)  # sayfa numarası 1-indexed (TOC'daki numaralar sayfa numaraları)
    # Actually, PDF page index vs. PDF page number may differ. Let's use 0-indexed.
    for m in tde_re.finditer(txt):
        tum_kodlar.append({
            'sayfa': i,
            'sinif': sinif_bul(i),
            'kod': f'TDE{m.group(1)}.{m.group(2)}',
            'grup': int(m.group(1)),
            'no': int(m.group(2)),
        })

# Unique kod sayısı
kod_sayim = collections.Counter(k['kod'] for k in tum_kodlar)
print(f'Toplam TDE kod referansı: {len(tum_kodlar)}')
print(f'Benzersiz TDE kodları: {len(kod_sayim)}')
print(f'Tekrar edenler: {[(k,v) for k,v in kod_sayim.most_common(5)]}')

# Sinif başına sayım
sinif_sayim = collections.Counter(k['sinif'] for k in tum_kodlar)
print(f'Sinif dağılımı: {dict(sorted(sinif_sayim.items(), key=lambda x: str(x[0])))}')

# 9. sınıf TDE kodları neler?
sinif9_kodlar = sorted(set(k['kod'] for k in tum_kodlar if k['sinif'] == 9))
print(f'\n9. sınıf TDE kodları ({len(sinif9_kodlar)}): {sinif9_kodlar}')

# 10. sınıf
sinif10_kodlar = sorted(set(k['kod'] for k in tum_kodlar if k['sinif'] == 10))
print(f'10. sınıf TDE kodları ({len(sinif10_kodlar)}): {sinif10_kodlar}')

# TDE kodu ile açıklamasını görmek için — 9. sınıf, sayfa 65+ (page index 64+)
print('\n=== 9. SINIF TDE açıklamaları (sayfa 64-96) ===')
tde_acik_re = re.compile(r'TDE(\d+)\.(\d+)\.\s*(.{20,200}?)(?=\n|TDE|\Z)')
for i in range(64, 97):
    if i < doc.page_count:
        txt = doc[i].get_text()
        for m in tde_acik_re.finditer(txt):
            kod = f'TDE{m.group(1)}.{m.group(2)}'
            aciklama = m.group(3).strip().replace('\n', ' ')
            print(f'  {kod}: {aciklama[:80]}')
