"""Belirsiz PDFleri derinlemesine inceler."""
import fitz, re, sys, os
sys.stdout.reconfigure(encoding='utf-8')

PDF_DIR = r'refs\mufredat-2025'

def metin_al(dosya):
    doc = fitz.open(os.path.join(PDF_DIR, dosya))
    return '\n'.join(p.get_text() for p in doc)

# ─── sosyal_bil_c: Kod aramak ─────────────────────────────────────────────────
print('=== sosyal_bil_c ===')
m = metin_al('202632614151726-sosyalbilimc.pdf')
# Tüm büyük harf kısaltmalar
for pat in [r'([A-ZÇĞİÖŞÜ]{2,5}\.\d+\.\d+)', r'([A-ZÇĞİÖŞÜ]{2,5}\.U\.\d+\.\d+\.\d+)']:
    hits = set(re.findall(pat, m))
    if hits:
        print(f'  Pattern {pat}: {sorted(hits)[:10]}')
# İçindekiler tablosu kısmını oku
idx = m.find('İÇİNDEKİLER')
if idx >= 0:
    print(f'  İçindekiler: {m[idx:idx+800]}')

# ─── demokrasi: Kod aramak ─────────────────────────────────────────────────────
print('\n=== demokrasi ===')
m2 = metin_al('202632613560229-demokrasiinsanhak.pdf')
for pat in [r'([A-ZÇĞİÖŞÜ]{2,5}\.\d+\.\d+)', r'([A-ZÇĞİÖŞÜ]{2,4}[a-zA-Z]?\.\d\.\d)']:
    hits = set(re.findall(pat, m2))
    if hits:
        print(f'  Pattern {pat}: {sorted(hits)[:10]}')
idx2 = m2.find('İÇİNDEKİLER')
if idx2 >= 0:
    print(f'  İçindekiler: {m2[idx2:idx2+800]}')

# ─── turk_kultur: kod var mı? ─────────────────────────────────────────────────
print('\n=== turk_kultur ===')
m3 = metin_al('2026326135350307-türkkültürmedeniyt.pdf')
for pat in [r'([A-ZÇĞİÖŞÜ]{2,5}\.\d+\.\d+)', r'(TKM\.\d+\.\d+)', r'(TKD\.\d+\.\d+)', r'(TKE\.\d+\.\d+)']:
    hits = set(re.findall(pat, m3))
    if hits:
        print(f'  Pattern {pat}: {sorted(hits)[:10]}')
# İçindekiler
idx3 = m3.find('İÇİNDEKİLER')
if idx3 >= 0:
    print(f'  İçindekiler: {m3[idx3:idx3+600]}')

# ─── astronomi: 4 sınıf nasıl ayrışıyor? ─────────────────────────────────────
print('\n=== astronomi sınıf yapısı ===')
m4 = metin_al('2026326135719151-astronımiveuzay.pdf')
# Sınıf/Düzey belirten bölüm başlıkları
sinif_bolum = re.findall(r'(?:9|10|11|12)\. SINIF.{0,80}', m4)
print(f'  Sınıf bölümleri: {sinif_bolum[:8]}')
# Süre tablosu
sure_idx = m4.find('Süre')
if sure_idx >= 0:
    print(f'  Süre bölümü: {m4[sure_idx:sure_idx+400]}')
# AST kodları ile sınıf ilişkisi — koda komşu metne bak
ast_re = re.compile(r'(AST\.\d+\.\d+)')
for hit in ast_re.finditer(m4):
    ctx = m4[max(0,hit.start()-100):hit.start()]
    if any(s in ctx for s in ['9. SINIF', '10. SINIF', '11. SINIF', '12. SINIF']):
        print(f'  Sınıf context bulunan: {hit.group()} | {ctx[-50:]}')
        break

# ─── psikoloji: hangi sınıf? ──────────────────────────────────────────────────
print('\n=== psikoloji sınıf ===')
m5 = metin_al('202632613416463-psikoloji.pdf')
# Süre tablosu veya içindekiler
ders_cetveli = re.findall(r'(?:9|10|11|12)\.?\s*SINIF.{0,100}', m5)
print(f'  Sınıf refs: {ders_cetveli[:5]}')
sinif_all = re.findall(r'(\d{1,2})\.\s*SINIF', m5)
print(f'  Tüm SINIF refs: {sinif_all[:20]}')
# Süre tablosu
sure_m = m5.find('Süre')
if sure_m >= 0:
    print(f'  Süre: {m5[sure_m:sure_m+300]}')

# ─── iklim: hangi sınıf? ──────────────────────────────────────────────────────
print('\n=== iklim sınıf ===')
m6 = metin_al('2026326135915854-iklimçevre.pdf')
sinif_all2 = re.findall(r'(\d{1,2})\.\s*SINIF', m6)
print(f'  Tüm SINIF refs: {sinif_all2[:20]}')
sure_m2 = m6.find('Süre')
if sure_m2 >= 0:
    print(f'  Süre: {m6[sure_m2:sure_m2+300]}')

# ─── saglik: hangi sınıf? ────────────────────────────────────────────────────
print('\n=== saglik sınıf ===')
m7 = metin_al('20265139507417-Saglıkbiltrafik.pdf')
sinif_all3 = re.findall(r'(\d{1,2})\.\s*SINIF', m7)
print(f'  Tüm SINIF refs: {sinif_all3[:20]}')
sure_m3 = m7.find('Süre')
if sure_m3 >= 0:
    print(f'  Süre: {m7[sure_m3:sure_m3+300]}')

# ─── cagdas_turk: hangi sınıf? ───────────────────────────────────────────────
print('\n=== cagdas_turk sınıf ===')
m8 = metin_al('2026326134940604-çağdaştürk.pdf')
sinif_all4 = re.findall(r'(\d{1,2})\.\s*SINIF', m8)
print(f'  Tüm SINIF refs: {sinif_all4[:20]}')
sure_m4 = m8.find('Süre')
if sure_m4 >= 0:
    print(f'  Süre: {m8[sure_m4:sure_m4+300]}')

# ─── mantık: hangi sınıf? ─────────────────────────────────────────────────────
print('\n=== mantık sınıf ===')
m9 = metin_al('2026326134747604-mantık.pdf')
sinif_all5 = re.findall(r'(\d{1,2})\.\s*SINIF', m9)
print(f'  Tüm SINIF refs: {sinif_all5[:20]}')
sure_m5 = m9.find('Süre')
if sure_m5 >= 0:
    print(f'  Süre: {m9[sure_m5:sure_m5+300]}')
