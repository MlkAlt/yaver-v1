#!/usr/bin/env python3
"""Yaprak JSON -> yazdırılabilir A4 HTML (kompakt tek sayfa düzeni).

Kullanım: render_html.py <yaprak.json> [cikti.html]
Öğrenci sayfası + ayrı sayfada cevap anahtarı üretir.
Sayfa sayısı weasyprint ile GERÇEK ölçülür (yoksa: pip install weasyprint
--break-system-packages; o da yoksa kaba tahmine düşer). Öğrenci kısmı hedefi
1 sayfadır; 2'yi aşarsa hata koduyla çıkar — İÇERİĞİ kısalt, şablonu değil.
"""
import html
import json
import math
import re
import sys

TEMALAR = {
    "fizik": ("#1d4ed8", "#e8eefc"),
    "coğrafya": ("#047857", "#e3f3ec"),
    "cografya": ("#047857", "#e3f3ec"),
    "kimya": ("#b45309", "#fdf0e0"),
    "biyoloji": ("#15803d", "#e6f4e8"),
    "tarih": ("#9d174d", "#fbe8f0"),
    "matematik": ("#4338ca", "#e9e8fc"),
}
VARSAYILAN = ("#334155", "#eaeef3")
BOSLUK_RE = re.compile(r"____\((\d+)\)____")


def md(s):
    if not s:
        return ""
    out, table = [], []
    for line in s.split("\n"):
        if line.strip().startswith("|") and line.strip().endswith("|"):
            table.append(line.strip())
            continue
        if table:
            out.append(_table(table)); table = []
        out.append(_inline(line) + "<br>")
    if table:
        out.append(_table(table))
    r = "".join(out)
    return r[:-4] if r.endswith("<br>") else r


def _inline(line):
    t = html.escape(line)
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    t = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<i>\1</i>", t)
    t = re.sub(r"`([^`]+)`", r"<code>\1</code>", t)
    return t


def _table(lines):
    rows = [[c.strip() for c in ln.strip("|").split("|")] for ln in lines
            if not re.match(r"^\|[\s:|-]+\|$", ln)]
    h = "<table>"
    for i, row in enumerate(rows):
        tag = "th" if i == 0 else "td"
        h += "<tr>" + "".join(f"<{tag}>{_inline(c)}</{tag}>" for c in row) + "</tr>"
    return h + "</table>"


def _bosluk_cizgi(metin_html):
    """____(n)____ işaretini baskı için temiz bir çizgiye çevirir. Numara
    göstermez — sorular sırayla dizildiği ve cevap anahtarı aynı sırayı
    izlediği için ayrıca işarete gerek yok."""
    return BOSLUK_RE.sub("<span class='bosluk'></span>", metin_html)


def _cizgi_kutu(satir=3):
    return ("<div class='yanit'>" + "<span></span>" * satir + "</div>")


def soru_html(s, no):
    govde = md(s.get("govde_md", ""))
    if s.get("tip") == "bosluk_doldurma":
        govde = _bosluk_cizgi(govde)
    p = [f'<div class="soru"><div class="sgovde"><span class="sno">{no}</span>'
         f'<span class="spuan">{s.get("puan")}p</span>'
         f'<div class="smetin">{govde}</div></div>']
    g = s.get("gorsel")
    if g and g.get("betimleme"):
        p.append(f'<div class="gorsel">Görsel: {html.escape(g["betimleme"])}</div>')
    tip = s.get("tip")
    if tip == "coktan_secmeli":
        uzun = any(len(o.get("metin_md", "")) > 34 for o in s.get("secenekler", []))
        cls = "sec tek" if uzun else "sec"
        p.append(f"<div class='{cls}'>" + "".join(
            f"<div><b>{o['harf']})</b> {md(o.get('metin_md', ''))}</div>"
            for o in s.get("secenekler", [])) + "</div>")
    elif tip == "dogru_yanlis":
        p.append("<div class='dy'>" + "".join(
            f"<div><span class='kutu'>D</span><span class='kutu'>Y</span>"
            f"{md(f.get('metin_md', ''))}</div>"
            for f in s.get("ifadeler", [])) + "</div>")
    elif tip == "eslestirme":
        sol = s.get("sol", []); sag = s.get("sag", [])
        p.append("<div class='esle'><div>" + "".join(
            f"<div><span class='parantez'>(&nbsp;&nbsp;)</span> <b>{x['no']}.</b> "
            f"{md(x.get('metin_md', ''))}</div>" for x in sol)
            + "</div><div>" + "".join(
            f"<div><b>{x['harf']})</b> {md(x.get('metin_md', ''))}</div>"
            for x in sag) + "</div></div>")
    elif tip == "siralama":
        p.append("<div class='sira'>" + " • ".join(
            md(o) for o in s.get("ogeler", [])) + "</div>"
            + "<div class='sira-yanit'>Sıralama: " +
            " → ".join(["______"] * len(s.get("ogeler", []))) + "</div>")
    elif tip == "tablo_doldurma":
        t = s.get("tablo", {})
        rows = [t.get("basliklar", [])] + t.get("satirlar", [])
        p.append(_table(["|" + "|".join(" " if c == "__?__" else str(c)
                                        for c in r) + "|" for r in rows]))
    elif tip == "problem_cozme":
        p.append(_cizgi_kutu(3))
    elif tip == "acik_uclu":
        p.append(_cizgi_kutu(4))
    if tip == "bosluk_doldurma" and s.get("kelime_havuzu"):
        p.append("<div class='havuz'>" + "".join(
            f"<span>{html.escape(k)}</span>" for k in s["kelime_havuzu"]) + "</div>")
    p.append("</div>")
    return "".join(p)


def cevap_html(s, no):
    c = s.get("cevap", {})
    tip = s.get("tip")
    if tip == "coktan_secmeli":
        cv = f"<b>{c.get('dogru')}</b>"
    elif tip == "dogru_yanlis":
        cv = ", ".join(f"{k}-{'D' if v else 'Y'}"
                       for k, v in (c.get("ozet") or {}).items())
    elif tip == "problem_cozme":
        cv = f"<b>{c.get('deger')} {c.get('birim', '')}</b>"
    elif tip == "siralama":
        og = s.get("ogeler", [])
        cv = " → ".join(og[i] for i in c.get("dogru_sira", []))
    elif tip == "eslestirme":
        cv = ", ".join(f"{k}-{v}" for k, v in c.items())
    elif tip == "bosluk_doldurma":
        cv = ", ".join(f"({k}) {v}" for k, v in c.items())
    elif tip == "acik_uclu":
        cv = md(c.get("ornek_cevap_md", ""))
    else:
        cv = html.escape(json.dumps(c, ensure_ascii=False))
    coz = md(s.get("cozum_md", ""))
    return (f"<div class='ak-soru'><b>{no}.</b> {cv}"
            f"<div class='ak-cozum'>{coz}</div></div>")


def kaba_tahmin(d):
    """weasyprint yoksa yedek sezgisel (bilinçli karamsar)."""
    satir = 7
    for b in d.get("bolumler", []):
        satir += 2
        for s in b.get("sorular", []):
            satir += max(1, len(s.get("govde_md", "")) / 80) + 0.8
            tip = s.get("tip")
            if tip == "coktan_secmeli":
                uzun = any(len(o.get("metin_md", "")) > 34
                           for o in s.get("secenekler", []))
                n = len(s.get("secenekler", []))
                satir += n if uzun else math.ceil(n / 2)
            elif tip == "dogru_yanlis":
                satir += len(s.get("ifadeler", []))
            elif tip == "eslestirme":
                satir += max(len(s.get("sol", [])), len(s.get("sag", [])))
            elif tip == "siralama":
                satir += 3
            elif tip == "tablo_doldurma":
                satir += (len(s.get("tablo", {}).get("satirlar", [])) + 1) * 1.5
            elif tip == "problem_cozme":
                satir += 3.6
            elif tip == "acik_uclu":
                satir += 4.6
            if s.get("kelime_havuzu"):
                satir += 1.4
            if (s.get("gorsel") or {}).get("betimleme"):
                satir += 1.8
    return satir / 42.0


def gercek_sayfa(doc):
    try:
        import logging
        from weasyprint import HTML
        logging.getLogger("weasyprint").setLevel(logging.ERROR)
        return len(HTML(string=doc).render().pages)
    except Exception:
        return None


def belge(css, m, govde_html):
    return (f"<!DOCTYPE html><html lang='tr'><head><meta charset='utf-8'>"
            f"<title>{html.escape(m.get('baslik', ''))}</title>"
            f"<style>{css}</style></head><body>{govde_html}</body></html>")


def main():
    src = sys.argv[1]
    dst = sys.argv[2] if len(sys.argv) > 2 else re.sub(r"\.json$", "", src) + ".html"
    with open(src, encoding="utf-8") as f:
        d = json.load(f)
    m = d["meta"]; kz = m["kazanim"]
    koyu, acik = TEMALAR.get(str(kz.get("ders", "")).lower(), VARSAYILAN)

    head = (
        "<header><div class='baslik-sol'>"
        f"<h1>{html.escape(m.get('baslik', ''))}</h1>"
        f"<div class='chips'><span class='chip dolu'>{html.escape(kz['kod'])}</span>"
        f"<span class='chip'>{html.escape(kz['ders'])} • {kz['sinif']}. Sınıf</span>"
        f"<span class='chip'>{html.escape(kz.get('unite', '').title())}</span>"
        f"<span class='chip'>{m.get('tahmini_sure_dk')} dk • {m.get('toplam_puan')} puan</span>"
        "</div></div>"
        "<div class='adsoyad'>Ad Soyad: ______________________<br>"
        "Sınıf / No: __________</div></header>"
        f"<div class='kazanim-satiri'><b>Kazanım:</b> {html.escape(kz.get('ad', ''))}</div>")

    ogrenci = [head]
    ko = d.get("konu_ozeti") or {}
    if ko.get("icerik_md"):
        ogrenci.append(f"<div class='ozet'>{md(ko['icerik_md'])}</div>")

    no = 0
    cevaplar = []
    for b in d.get("bolumler", []):
        yon = md(b.get("yonerge", ""))
        bpuan = sum(s.get("puan", 0) for s in b.get("sorular", []))
        ogrenci.append(f"<div class='bolum'><span>{html.escape(b.get('ad', ''))}</span>"
                       f"<em>{yon}</em><span class='bpuan'>{bpuan} P</span></div>")
        for s in b.get("sorular", []):
            no += 1
            ogrenci.append(soru_html(s, no))
            cevaplar.append(cevap_html(s, no))

    anahtar = ("<header class='ak-band'><div class='baslik-sol'>"
               f"<h1>Cevap Anahtarı</h1><div class='chips'>"
               f"<span class='chip dolu'>{html.escape(kz['kod'])}</span>"
               f"<span class='chip'>{html.escape(m.get('baslik', ''))}</span>"
               "</div></div><div class='adsoyad'>Öğretmen içindir —<br>"
               "dağıtmadan önce ayırınız.</div></header>"
               "<div class='ak-grid'>" + "".join(cevaplar) + "</div>")

    css = f"""
:root {{ --koyu: {koyu}; --acik: {acik}; }}
@page {{ size: A4; margin: 10mm 11mm; }}
* {{ box-sizing: border-box; }}
body {{ font-family: 'Segoe UI', 'Calibri', 'DejaVu Sans', Arial, sans-serif;
  font-size: 9.5pt; line-height: 1.26; color: #1e2430; max-width: 188mm; margin: auto; }}
header {{ display: flex; justify-content: space-between; align-items: flex-start;
  border-bottom: 2.5px solid var(--koyu); padding-bottom: 4px; margin-bottom: 3px; }}
h1 {{ font-size: 13pt; margin: 0 0 2px; color: var(--koyu); }}
.chips {{ display: flex; flex-wrap: wrap; gap: 3px; }}
.chip {{ display: inline-block; font-size: 7pt; border: 1px solid var(--koyu);
  color: var(--koyu); border-radius: 8px; padding: 0 6px; white-space: nowrap; }}
.chip.dolu {{ background: var(--koyu); color: #fff; font-weight: 600; }}
.adsoyad {{ font-size: 8.5pt; text-align: right; line-height: 1.8; white-space: nowrap; }}
.kazanim-satiri {{ font-size: 8pt; color: #444; margin: 1px 0 4px; }}
.ozet {{ background: var(--acik); border-left: 3px solid var(--koyu);
  padding: 4px 8px; font-size: 8.5pt; margin-bottom: 4px; border-radius: 0 4px 4px 0; }}
.bolum {{ display: flex; align-items: baseline; gap: 8px;
  background: var(--acik); border-left: 4px solid var(--koyu); padding: 2px 7px;
  margin: 6px 0 3px; border-radius: 0 4px 4px 0; font-weight: 700; font-size: 10pt;
  color: var(--koyu); page-break-after: avoid; }}
.bolum em {{ font-weight: 400; font-size: 8pt; color: #3c4454; flex: 1; }}
.bolum .bpuan {{ font-size: 7.5pt; }}
.soru {{ margin: 4px 0; page-break-inside: avoid; }}
.sgovde {{ display: flex; gap: 5px; align-items: baseline; }}
.sno {{ background: var(--koyu); color: #fff; border-radius: 50%; min-width: 14px;
  height: 14px; font-size: 8pt; font-weight: 700; display: inline-flex;
  align-items: center; justify-content: center; flex: none; position: relative; top: 1px; }}
.spuan {{ order: 3; font-size: 7pt; color: #667; flex: none; }}
.smetin {{ flex: 1; }}
.bosluk {{ display: inline-block; min-width: 22mm; border-bottom: 1.2px solid #555;
  height: 10px; position: relative; margin: 0 2px; }}
.sec {{ columns: 2; column-gap: 18px; margin: 2px 0 0 19px; font-size: 9pt; }}
.sec.tek {{ columns: 1; }}
.sec > div {{ break-inside: avoid; padding: 0.5px 0; }}
.dy {{ margin: 2px 0 0 19px; font-size: 9pt; }}
.dy .kutu {{ display: inline-block; border: 1px solid #888; border-radius: 3px;
  width: 12px; text-align: center; font-size: 7pt; margin-right: 3px; color: #888; }}
.esle {{ display: flex; gap: 22px; margin: 2px 0 0 19px; font-size: 9pt; }}
.esle > div {{ flex: 1; }}
.esle .parantez {{ color: #778; }}
.sira {{ margin: 2px 0 0 19px; font-size: 9pt; background: #f4f6f9;
  padding: 2px 7px; border-radius: 4px; display: inline-block; }}
.sira-yanit {{ margin: 2px 0 0 19px; font-size: 9pt; }}
.havuz {{ margin: 2px 0 0 19px; display: flex; gap: 4px; flex-wrap: wrap; }}
.havuz span {{ display: inline-block; background: #f4f6f9; border: 1px dashed #99a;
  border-radius: 8px; padding: 0 7px; font-size: 8pt; }}
.yanit {{ margin: 3px 0 0 19px; }}
.yanit span {{ display: block; border-bottom: 1px dotted #9aa; height: 13px; }}
.gorsel {{ margin: 2px 0 0 19px; font-size: 8pt; color: #556; font-style: italic;
  border: 1px dashed #aab; padding: 2px 7px; border-radius: 4px; }}
table {{ border-collapse: collapse; margin: 3px 0 2px 19px; font-size: 8.5pt;
  width: calc(100% - 19px); }}
td, th {{ border: 1px solid #8892a0; padding: 2px 6px; text-align: left; }}
th {{ background: var(--acik); color: var(--koyu); }}
code {{ background: #f0f2f5; padding: 0 3px; border-radius: 3px; font-size: 8.5pt; }}
.kir {{ page-break-before: always; }}
.ak-grid {{ column-count: 2; column-gap: 20px; margin-top: 5px; }}
.ak-soru {{ font-size: 8.5pt; margin-bottom: 5px; break-inside: avoid; }}
.ak-cozum {{ font-size: 7.5pt; color: #445; margin: 1px 0 0 11px; }}
@media print {{ body {{ max-width: none; }} }}
@media screen {{
  html {{ background: #e9e7e1; }}
  body {{ background: #fff; padding: 12mm 11mm; margin: 14px auto;
    box-shadow: 0 2px 10px rgba(0,0,0,.15); }}
}}
"""
    ogrenci_html = "".join(ogrenci)
    tam = belge(css, m, ogrenci_html + "<div class='kir'></div>" + anahtar)
    with open(dst, "w", encoding="utf-8") as f:
        f.write(tam)

    n_ogr = gercek_sayfa(belge(css, m, ogrenci_html))
    if n_ogr is not None:
        n_tam = gercek_sayfa(tam)
        print(f"Yazıldı: {dst} | GERÇEK ölçüm: öğrenci {n_ogr} sayfa, "
              f"toplam {n_tam} sayfa (anahtar dahil)")
        if n_ogr > 2:
            print("HATA: öğrenci kısmı 2 sayfayı aşıyor — içeriği kısalt.",
                  file=sys.stderr)
            sys.exit(3)
        if n_ogr > 1:
            print("UYARI: hedef 1 sayfa; 1-2 soru azaltmayı değerlendir.",
                  file=sys.stderr)
    else:
        t = kaba_tahmin(d)
        print(f"Yazıldı: {dst} | kaba tahmin: ~{t:.1f} sayfa "
              f"(weasyprint kurulu değil; gerçek ölçüm için: "
              f"pip install weasyprint --break-system-packages)")
        if t > 2.0:
            sys.exit(3)


if __name__ == "__main__":
    main()
