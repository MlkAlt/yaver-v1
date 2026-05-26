"""Grup 2 JSON'larını PDF ile karşılaştırır."""
import fitz, json, re, sys, os, random
sys.stdout.reconfigure(encoding='utf-8')

PDF_DIR  = r'refs\mufredat-2025'
JSON_DIR = r'brans\lise-mufredat-2025'

TESTS = [
    ('psikoloji',    '202632613416463-psikoloji.pdf'),
    ('mantik',       '2026326134747604-mantık.pdf'),
    ('cagdas_turk',  '2026326134940604-çağdaştürk.pdf'),
    ('astronomi',    '2026326135719151-astronımiveuzay.pdf'),
    ('iklim',        '2026326135915854-iklimçevre.pdf'),
    ('saglik',       '20265139507417-Saglıkbiltrafik.pdf'),
    ('mat_uygulama', '202632614555417-matematikuygulamalar.pdf'),
    ('sosyal_bil_c', '202632614151726-sosyalbilimc.pdf'),
]

def normalize(s):
    return re.sub(r'\s+', ' ', s).strip().lower()

toplam_ok = toplam_hata = 0

for anahtar, pdf_dosya in TESTS:
    json_yol = os.path.join(JSON_DIR, f'{anahtar}.json')
    pdf_yol  = os.path.join(PDF_DIR, pdf_dosya)
    with open(json_yol, encoding='utf-8') as f:
        d = json.load(f)
    kazanimlar = d['kazanimlar']
    doc = fitz.open(pdf_yol)
    pdf_norm = normalize('\n'.join(p.get_text() for p in doc))

    by_sinif = {}
    for k in kazanimlar:
        by_sinif.setdefault(k['sinif'], []).append(k)
    sample = []
    random.seed(42)
    for sinif_kaz in by_sinif.values():
        sample.extend(random.sample(sinif_kaz, min(2, len(sinif_kaz))))

    ok = hata = 0
    hatalar = []
    for k in sample:
        ara = normalize(k['ad'])[:25]
        if len(ara) < 10:
            continue
        if ara in pdf_norm:
            ok += 1
        else:
            hata += 1
            hatalar.append(f'    HATA {k["kod"]} | {k["ad"][:70]}')

    toplam_ok += ok
    toplam_hata += hata
    durum = 'OK' if hata == 0 else 'UYARI'
    print(f'[{durum}] {anahtar:<22} {ok:3}/{ok+hata} dogru | {len(kazanimlar):3} toplam')
    for h in hatalar:
        print(h)

print()
denom = toplam_ok + toplam_hata
oran = 100 * toplam_ok // denom if denom else 0
print(f'GENEL: {toplam_ok}/{denom} dogru ({oran}%)')
