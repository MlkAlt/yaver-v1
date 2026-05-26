"""
TDE (Türk Dili ve Edebiyatı) PDF'inden kazanımları çıkarır.
Kod formatı: TDE.{sinif}.T{tema_no}.{grup}.{no}
Sayfa sınırları (0-indexed): 9. sınıf=64, 10=96, 11=131, 12=168
Çıktı: brans/lise-mufredat-2025/tde_lise.json
"""
import fitz, re, json, os, sys
sys.stdout.reconfigure(encoding='utf-8')

PDF_DIR = r'refs\mufredat-2025'
OUT_DIR = r'brans\lise-mufredat-2025'
DOSYA   = '2026518151228236-edebiyatdöp.pdf'

# Sınıf sayfa sınırları (0-indexed başlangıç)
SINIF_SAYFALAR = [
    (9,  64,  96),
    (10, 96,  131),
    (11, 131, 168),
    (12, 168, 208),
]

TDE_KOD_RE = re.compile(r'TDE(\d+)\.(\d+)\.\s*(.{15,300}?)(?=\nTDE\d|\nAnahtar|\nÖğrenme|\nDinleme|\nOkuma|\nKonuşma|\nYazma|\nMetin|\nEdebiyat Atölyesi|\Z)', re.DOTALL)
TEMA_RE    = re.compile(r'(\d+)\.\s*TEMA\s*[:：]?\s*(.{5,60}?)(?:\n|\Z)')
OC_HEADER  = 'ÖĞRENME ÇIKTILARI'

def temizle(s):
    s = re.sub(r'\s+', ' ', s)
    s = s.strip()
    s = re.sub(r'^[.•\-]\s*', '', s)
    return s.strip()


def extract_sinif(doc, sinif, sayfa_bas, sayfa_son):
    """Belirli sınıf sayfalarındaki TDE kazanımlarını çıkarır."""
    kazanimlar = []
    gorduk = set()  # (tema_no, grup, no)

    tema_no = 0
    tema_ad = ''
    oc_aktif = False  # ÖĞRENME ÇIKTILARI bölümünde miyiz?

    for page_idx in range(sayfa_bas, min(sayfa_son, doc.page_count)):
        sayfa_txt = doc[page_idx].get_text()

        # Tema header'ı kontrol et
        tema_m = TEMA_RE.search(sayfa_txt)
        if tema_m:
            yeni_tema_no = int(tema_m.group(1))
            if yeni_tema_no != tema_no:
                tema_no = yeni_tema_no
                tema_ad = temizle(tema_m.group(2))
                oc_aktif = False  # Yeni tema, OC sıfırla

        # ÖĞRENME ÇIKTILARI bölümü başlayıp başlamadığını kontrol et
        if OC_HEADER in sayfa_txt:
            oc_aktif = True

        if not oc_aktif or tema_no == 0:
            continue

        # TDE kodlarını çıkar — sadece ÖĞRENME ÇIKTILARI sonrasındaki kısımdan
        oc_pos = sayfa_txt.find(OC_HEADER)
        if oc_pos < 0:
            # Bu sayfada OC header yok ama aktif — tüm sayfayı tara
            metin_parcasi = sayfa_txt
        else:
            metin_parcasi = sayfa_txt[oc_pos:]

        # ÖĞRENME-ÖĞRETME YAŞANTILARI bölümü gelirse bırak
        ooy_pos = metin_parcasi.find('ÖĞRENME-ÖĞRETME')
        if ooy_pos > 0:
            metin_parcasi = metin_parcasi[:ooy_pos]
            oc_aktif = False  # Bu tema bitti

        # TDE kodlarını tek tek bul
        # Açıklama; bir sonraki TDE kod, bölüm başlığı, ya da boş satırda kesilir
        kod_re = re.compile(
            r'TDE(\d+)\.(\d+)\.\s*(.{10,}?)'
            r'(?=\nTDE\d|\nAnahtar|\nÖğrenme|\nDinleme|\nOkuma|\nKonuşma|\nYazma'
            r'|\nMetin Tahlili|\nEdebiyat Atölyesi|\n\n|\Z)',
            re.DOTALL
        )
        for m in kod_re.finditer(metin_parcasi):
            grup = int(m.group(1))
            no   = int(m.group(2))
            anahtar = (tema_no, grup, no)
            if anahtar in gorduk:
                continue

            ad = temizle(m.group(3))
            if len(ad) < 10:
                continue

            # Fazla uzun açıklamaları kes
            if len(ad) > 250:
                ad = ad[:250].rsplit(' ', 1)[0]

            kod_synth = f'TDE.{sinif}.T{tema_no}.{grup}.{no}'
            gorduk.add(anahtar)
            kazanimlar.append({
                'kod': kod_synth,
                'ad': ad,
                'sinif': sinif,
                'tema_no': tema_no,
                'tema_ad': tema_ad,
            })

    return kazanimlar


def main():
    yol = os.path.join(PDF_DIR, DOSYA)
    print(f'Okunuyor: {DOSYA}')
    doc = fitz.open(yol)

    tum_kazanimlar = []
    for sinif, bas, son in SINIF_SAYFALAR:
        kaz = extract_sinif(doc, sinif, bas, son)
        by_tema = {}
        for k in kaz:
            by_tema[k['tema_no']] = by_tema.get(k['tema_no'], 0) + 1
        print(f'  {sinif}. sınıf: {dict(sorted(by_tema.items()))} | toplam={len(kaz)}')
        tum_kazanimlar.extend(kaz)

    print(f'Genel toplam: {len(tum_kazanimlar)}')

    os.makedirs(OUT_DIR, exist_ok=True)
    cikti = {
        'brans': 'Türk Dili ve Edebiyatı',
        'brans_slug': 'turk_dili_edebiyati',
        'ders': 'Türk Dili ve Edebiyatı',
        'ders_turu': 'zorunlu',
        'siniflar_okul_tipi': {9: 'lise', 10: 'lise', 11: 'lise', 12: 'lise'},
        'kaynak_pdf': DOSYA,
        'kaynak_yil': '2025',
        'kazanimlar': tum_kazanimlar,
    }
    cikti_yol = os.path.join(OUT_DIR, 'tde_lise.json')
    with open(cikti_yol, 'w', encoding='utf-8') as f:
        json.dump(cikti, f, ensure_ascii=False, indent=2)
    print(f'Kaydedildi: {cikti_yol}')


if __name__ == '__main__':
    main()
