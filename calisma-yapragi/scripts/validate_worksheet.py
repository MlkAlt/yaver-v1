#!/usr/bin/env python3
"""Çalışma yaprağı JSON'unun deterministik doğrulaması.

Kullanım: validate_worksheet.py <yaprak.json> [<yaprak2.json> ...]
Çıkış kodu: 0 = temiz (WARN olabilir), 1 = en az bir ERROR.
Şema: references/worksheet_schema.md
"""
import json
import re
import sys

TIPLER = {"coktan_secmeli", "dogru_yanlis", "bosluk_doldurma", "eslestirme",
          "acik_uclu", "problem_cozme", "siralama", "tablo_doldurma"}
ZORLUKLAR = {"kolay", "orta", "zor"}
BOSLUK_RE = re.compile(r"____\((\d+)\)____")


class Rapor:
    def __init__(self, dosya):
        self.dosya = dosya
        self.errors, self.warns = [], []

    def e(self, msg): self.errors.append(msg)
    def w(self, msg): self.warns.append(msg)

    def yaz(self):
        print(f"\n=== {self.dosya} ===")
        for m in self.errors: print(f"  ERROR: {m}")
        for m in self.warns: print(f"  WARN : {m}")
        if not self.errors and not self.warns:
            print("  Temiz.")
        print(f"  Özet: {len(self.errors)} hata, {len(self.warns)} uyarı")


def norm(s):
    return re.sub(r"\s+", " ", (s or "").strip().lower())[:80]


def check_soru(s, i, r, bilesenler):
    sid = s.get("id", f"[{i}]")
    for alan in ("id", "tip", "zorluk", "puan", "govde_md", "cevap", "cozum_md"):
        if alan not in s or s[alan] in (None, "", []):
            if alan == "govde_md" and s.get("tip") in ("dogru_yanlis", "eslestirme",
                                                       "tablo_doldurma", "siralama"):
                continue  # bu tiplerde gövde yönergeyle kısa olabilir ama yine uyar
            r.e(f"{sid}: '{alan}' eksik/boş")
    tip = s.get("tip")
    if tip not in TIPLER:
        r.e(f"{sid}: bilinmeyen tip '{tip}'"); return
    if s.get("zorluk") not in ZORLUKLAR:
        r.e(f"{sid}: zorluk '{s.get('zorluk')}' geçersiz")
    sb = s.get("surec_bileseni")
    if bilesenler and sb not in bilesenler:
        r.e(f"{sid}: surec_bileseni '{sb}' kazanımın bileşenlerinde yok "
            f"({sorted(bilesenler)})")
    if not isinstance(s.get("puan"), (int, float)) or s.get("puan", 0) <= 0:
        r.e(f"{sid}: puan pozitif sayı olmalı")
    g = s.get("gorsel")
    if g and g.get("zorunlu") and len(g.get("betimleme", "")) < 30:
        r.e(f"{sid}: gorsel.zorunlu=true ama betimleme yetersiz")

    c = s.get("cevap") or {}
    if tip == "coktan_secmeli":
        sec = s.get("secenekler") or []
        harfler = [o.get("harf") for o in sec]
        if not 4 <= len(sec) <= 5:
            r.e(f"{sid}: seçenek sayısı {len(sec)} (4-5 olmalı)")
        if len(set(harfler)) != len(harfler):
            r.e(f"{sid}: seçenek harfleri tekrarlı")
        if c.get("dogru") not in harfler:
            r.e(f"{sid}: cevap.dogru '{c.get('dogru')}' seçeneklerde yok")
    elif tip == "dogru_yanlis":
        ifadeler = s.get("ifadeler") or []
        if not 2 <= len(ifadeler) <= 8:
            r.w(f"{sid}: ifade sayısı {len(ifadeler)} (3-6 önerilir)")
        for f in ifadeler:
            if not isinstance(f.get("cevap"), bool):
                r.e(f"{sid}: ifade {f.get('no')} cevabı bool değil")
            if f.get("cevap") is False and not f.get("gerekce_md"):
                r.w(f"{sid}: yanlış ifade {f.get('no')} için gerekce_md yok")
        ozet = c.get("ozet") or {}
        beklenen = {str(f.get("no")): f.get("cevap") for f in ifadeler}
        if {str(k): v for k, v in ozet.items()} != beklenen:
            r.e(f"{sid}: cevap.ozet ifadelerle tutarsız")
    elif tip == "bosluk_doldurma":
        markers = set(BOSLUK_RE.findall(s.get("govde_md", "")))
        keys = set(map(str, c.keys()))
        if not markers:
            r.e(f"{sid}: gövdede ____(n)____ işareti yok")
        if markers != keys:
            r.e(f"{sid}: boşluk işaretleri {sorted(markers)} ile "
                f"cevap anahtarları {sorted(keys)} uyuşmuyor")
    elif tip == "eslestirme":
        sol = s.get("sol") or []; sag = s.get("sag") or []
        if len(sol) < 3: r.w(f"{sid}: eşleştirmede {len(sol)} madde (az)")
        sol_no = {str(x.get("no")) for x in sol}
        sag_h = {x.get("harf") for x in sag}
        if set(map(str, c.keys())) != sol_no:
            r.e(f"{sid}: cevap anahtarları sol maddelerle uyuşmuyor")
        if not set(c.values()) <= sag_h:
            r.e(f"{sid}: cevaplarda sağda olmayan harf var")
        if len(set(c.values())) != len(c):
            r.w(f"{sid}: aynı sağ öğe birden çok kez kullanılmış (bilinçli mi?)")
    elif tip == "acik_uclu":
        if not c.get("ornek_cevap_md"):
            r.e(f"{sid}: ornek_cevap_md eksik")
        if not c.get("kabul_kriterleri"):
            r.w(f"{sid}: kabul_kriterleri boş (puanlama öznelleşir)")
    elif tip == "problem_cozme":
        if not isinstance(c.get("deger"), (int, float)):
            r.e(f"{sid}: cevap.deger sayısal değil")
        if not c.get("birim"):
            r.w(f"{sid}: birim belirtilmemiş (birimsiz büyüklükse sorun değil)")
    elif tip == "siralama":
        og = s.get("ogeler") or []
        ds = c.get("dogru_sira") or []
        if len(og) < 3: r.e(f"{sid}: en az 3 öğe gerekli")
        if sorted(ds) != list(range(len(og))):
            r.e(f"{sid}: dogru_sira {ds} geçerli bir permütasyon değil")
        if ds == list(range(len(og))):
            r.w(f"{sid}: öğeler zaten doğru sırada verilmiş (karıştır)")
    elif tip == "tablo_doldurma":
        t = s.get("tablo") or {}
        satirlar = t.get("satirlar") or []
        bos = {f"r{ri}c{ci}" for ri, row in enumerate(satirlar)
               for ci, cell in enumerate(row) if cell == "__?__"}
        if not bos:
            r.e(f"{sid}: tabloda __?__ hücresi yok")
        if bos != set(c.keys()):
            r.e(f"{sid}: __?__ hücreleri {sorted(bos)} ile cevap anahtarları "
                f"{sorted(c.keys())} uyuşmuyor")


def validate(path):
    r = Rapor(path)
    try:
        with open(path, encoding="utf-8") as f:
            d = json.load(f)
    except (OSError, json.JSONDecodeError) as e:
        r.e(f"JSON okunamadı: {e}"); r.yaz(); return r
    meta = d.get("meta") or {}
    for alan in ("sema_surumu", "tur", "baslik", "kazanim", "tahmini_sure_dk",
                 "toplam_puan", "qa"):
        if alan not in meta:
            r.e(f"meta.{alan} eksik")
    kz = meta.get("kazanim") or {}
    for alan in ("kod", "ad", "ders", "sinif", "unite", "surec_bilesenleri"):
        if not kz.get(alan):
            r.e(f"meta.kazanim.{alan} eksik")
    bilesenler = set((kz.get("surec_bilesenleri") or {}).keys())

    ko = d.get("konu_ozeti")
    if ko and len(ko.get("icerik_md", "")) > 300:
        r.w("konu_ozeti çok uzun (varsayılan hiç olmaması; istenirse ≤2 cümle)")

    bolumler = d.get("bolumler") or []
    if not bolumler:
        r.e("bolumler boş")
    ids, govdeler, toplam, kapsanan = [], {}, 0, set()
    for b in bolumler:
        if not b.get("sorular"):
            r.e(f"bölüm '{b.get('ad')}' soru içermiyor")
        for i, s in enumerate(b.get("sorular") or []):
            check_soru(s, i, r, bilesenler)
            ids.append(s.get("id"))
            toplam += s.get("puan") or 0
            kapsanan.add(s.get("surec_bileseni"))
            n = norm(s.get("govde_md"))
            if n and n in govdeler:
                r.w(f"{s.get('id')}: gövde {govdeler[n]} ile neredeyse aynı")
            govdeler[n] = s.get("id")
    if len(set(ids)) != len(ids):
        r.e("soru id'leri benzersiz değil")
    if meta.get("toplam_puan") not in (None, toplam):
        r.e(f"puan toplamı {toplam}, meta.toplam_puan {meta.get('toplam_puan')}")
    eksik = bilesenler - kapsanan
    if eksik:
        r.w(f"kapsanmayan süreç bileşenleri: {sorted(eksik)}")
    n_soru = len(ids)
    if not 6 <= n_soru <= 9 and meta.get("tur") == "calisma_yapragi":
        r.w(f"soru sayısı {n_soru} (tek sayfa bütçesi için 6-9 önerilir)")
    yogun = sum(1 for b in bolumler for s in (b.get("sorular") or [])
                if s.get("tip") in ("tablo_doldurma", "eslestirme", "dogru_yanlis"))
    acik = sum(1 for b in bolumler for s in (b.get("sorular") or [])
               if s.get("tip") in ("acik_uclu",))
    if yogun > 2:
        r.w(f"alan-yoğun tip sayısı {yogun} (tek sayfa için ≤2 önerilir)")
    if acik > 2:
        r.w(f"acik_uclu sayısı {acik} (tek sayfa için ≤2 önerilir)")
    r.yaz()
    return r


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__); sys.exit(1)
    raporlar = [validate(p) for p in sys.argv[1:]]
    sys.exit(1 if any(r.errors for r in raporlar) else 0)
