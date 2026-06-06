# -*- coding: utf-8 -*-
"""
MEB müfredat PDF → kazanım JSON çıkarıcı.

Kullanım:
  python3 extract.py refs/mufredat-2025/dosya.pdf   # tek PDF, validate görünür
  python3 extract.py                                  # toplu: tüm PDFler
  python3 extract.py --all                            # aynı
"""
from __future__ import annotations

import argparse
import contextlib
import importlib.util
import io
import json
import os
import re
import subprocess
import sys
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

try:
    import pdfplumber
    _HAS_PDFPLUMBER = True
except ImportError:
    _HAS_PDFPLUMBER = False

ROOT     = Path(__file__).resolve().parent
PDF_DIR  = ROOT / "refs" / "mufredat-2025"
MAP_FILE = ROOT / "scripts" / "pdf-brans-map.json"
OUT_DIR  = ROOT / "outputs"
MIN_SEG  = 4

# ── Regex ──────────────────────────────────────────────────────────────────────
UNITE_STRICT   = re.compile(r"^(\d+)\.\s*ÜNİTE\s*[:]\s*(.+)$",              re.IGNORECASE)
UNITE_COLON    = re.compile(r"^(\d+)\.\s*(?:ÜNİTE|Ünite)\s*[:\s]\s*(.+)$", re.IGNORECASE)
UNITE_KEYWORD  = re.compile(r"(?:^|\s)(?:ÜNİTE|Ünite|Unite)\s+(\d+)\s*[-–:.]?\s*(.*)", re.IGNORECASE)
UNITE_NUM      = re.compile(r"^(\d+)\.\s*(?:ÜNİTE|Ünite)\s*[-–:.]?\s*(.*)", re.IGNORECASE)

# Kapak sayfası tespiti için branş → anahtar kelimeler (harita yoksa fallback)
COVER_BRANS: dict[str, list[str]] = {
    "sinif_ogretmeni":       ["Sınıf Öğretmenliği", "İnsan Hakları Vatandaşlık", "Trafik Güvenliği"],
    "turkce":                ["Türkçe Dersi Öğretim", "İlkokul Türkçe", "Ortaokul Türkçe"],
    "turk_dili_edebiyati":   ["Türk Dili ve Edebiyatı"],
    "matematik":             ["Matematik Dersi Öğretim", "İlkokul Matematik", "Ortaokul Matematik"],
    "fen_bilimleri":         ["Fen Bilimleri"],
    "sosyal_bilgiler":       ["Sosyal Bilgiler", "İnkılap Tarihi ve Atatürkçülük"],
    "tarih":                 ["Tarih Dersi", "Tarih Öğretim", "Çağdaş Türk ve Dünya"],
    "cografya":              ["Coğrafya Dersi", "Coğrafya Öğretim", "İklim, Çevre"],
    "felsefe":               ["Felsefe Dersi", "Psikoloji Dersi", "Mantık Dersi", "Sosyoloji Dersi"],
    "fizik":                 ["Fizik Dersi", "Astronomi ve Uzay"],
    "kimya":                 ["Kimya Dersi"],
    "biyoloji":              ["Biyoloji Dersi"],
    "ingilizce":             ["İngilizce Dersi", "English Language Teaching"],
    "almanca":               ["Almanca Dersi"],
    "din_kulturu":           ["Din Kültürü ve Ahlak", "Kur'an-ı Kerim Dersi", "Peygamberimizin Hayatı", "Temel Dinî Bilgiler"],
    "arapca":                ["Arapça Dersi"],
    "gorsel_sanatlar":       ["Görsel Sanatlar"],
    "muzik":                 ["Müzik Dersi"],
    "beden_egitimi":         ["Beden Eğitimi ve Oyun", "Beden Eğitimi ve Spor", "Sağlık Bilgisi ve Trafik", "Takım Sporları"],
    "bilisim_teknolojileri": ["Bilişim Teknolojileri"],
    "teknoloji_tasarim":     ["Teknoloji ve Tasarım"],
    "ihl_meslek_dersleri":   [
        "Hadis", "Siyer", "Fıkıh", "Akaid", "Kelam", "Tefsir",
        "Hüsnühat", "Tezhip", "Ebru", "Dini Musiki",
        "Hitabet ve Mesleki", "İslam Felsefesi", "İslam Bilim Tarihi",
        "Mesleki Arapça", "Dinler Tarihi", "Kur'an'ın Ana Konuları",
        "Tasavvuf Kültürü", "İslam'da Çocuk Eğitimi", "Din Eğitimi",
    ],
}


# ── Yardımcı fonksiyonlar ──────────────────────────────────────────────────────

def slugify(name: str) -> str:
    base = name.rsplit(".pdf", 1)[0]
    parts = base.split("-", 1)
    rest = parts[1].strip() if len(parts) > 1 and parts[0].isdigit() else base
    rest = re.sub(r"[^\w\dçşöüğıİÇŞÖÜĞ_-]", "_", rest)
    return re.sub(r"_+", "_", rest).strip("_").lower()


def clean(text: str) -> str:
    t = text.strip()
    t = re.sub(r"^[.\s\-–—]+", "", t)
    return re.sub(r"\s+", " ", t)[:800]


# BRIEFING.md skill verb listesi — uzun metni ilk geçerli sonuçta kes
_SKILL_CUT = re.compile(
    r"(?:bilme|etme|yapabilme|edebilme|yönetebilme|söyleyebilme|çalabilme|"
    r"oluşturabilme|karşılaştırabilme|çözümleyebilme|belirleyebilme|"
    r"değerlendirebilme|tanımlayabilme|sınıflandırabilme|açıklayabilme|"
    r"sergileyebilme|uygulayabilme|katılabilme|oynayabilme|keşfedebilme|"
    r"geliştirebilme|tanıyabilme|yorumlayabilme|çözebilme|tasarlayabilme|"
    r"tartışabilme|ifade edebilme|yansıtabilme|sunabilme|toplayabilme|"
    r"kaydedebilme|kurabilme|kopyalayabilme|seslendirebilme|getirebilme|"
    r"anlamlandırabilme|geçirebilme|yapılandırabilme|sorgulayabilme|"
    r"tahmin edebilme|bulabilme|genelleyebilme|savunabilme|"
    r"ilişkilendirebilme|fark edebilme|kullanabilme)"
    r"[.;]?\s*",
    re.IGNORECASE,
)
# Devam satırı döngüsü için: skill verb SONUNDA olmalı (false positive engeller).
# Örn: "ulaşabilmek için temel" içinde "bilme" var ama sonunda değil → False döner.
_SKILL_CUT_END = re.compile(_SKILL_CUT.pattern + r'$', re.IGNORECASE)


_BOLUM_RE = re.compile(r"\s*\d+\.\s*Bölüm\b", re.IGNORECASE)

# Yapısal artıklar: iki sütunlu PDF'lerde sütun başlıkları kazanım metnine karışabilir
_STRUCTURAL_SUFFIX = re.compile(
    r'\s+(?:Öğrenme çıktıs(?:ı|ına|ıyla|ıyla ilişkilendirilen)?|Ders kodu|Ünite numarası|Ders seviyesi|numarası)\s*$',
    re.IGNORECASE,
)

_TRAIL_NUM  = re.compile(r'\s+\d+\s*$')   # sondaki sayfa numarası: "yapabilme 3"
_TRAIL_DASH = re.compile(r'\s+[-–]\s*$')   # sondaki tire: "bilgi -"

_LAYOUT_PAGE_INLINE = re.compile(
    r'([a-zçğışöüğ]{3,})\s+\d+\s+([a-zçğışöüğ]{2,})'
)
_DIGIT_IN_WORD = re.compile(r'(?<=[a-zçğışöüğ])\d+(?=[a-zçğışöüğ])')


def trim_metin(text: str) -> str:
    """Metni temizle: Bölüm başlığı öncesi kes, skill verb'de bitir."""
    # pdftotext layout artefaktı: "toplayab 9 ilme" → "toplayabilme"
    text = _LAYOUT_PAGE_INLINE.sub(lambda m: m.group(1) + m.group(2), text)
    # pdftotext artefaktı: "yapabilm1e" → "yapabilme"
    text = _DIGIT_IN_WORD.sub('', text)
    # İki sütunlu PDF artefaktı: sütun başlıkları metnin sonuna karışabilir
    text = _STRUCTURAL_SUFFIX.sub('', text).strip()
    # "N. Bölüm:" tuzağı — bölüm başlığını kes
    bm = _BOLUM_RE.search(text)
    if bm:
        text = text[:bm.start()].rstrip(" .")

    if len(text) <= 300:
        # Trailing sayfa numarası / tire artığını temizle
        text = _TRAIL_NUM.sub('', text).strip()
        text = _TRAIL_DASH.sub('', text).strip()
        return text

    # 300 kardan uzunsa ilk skill verb bitişinde kes
    m = _SKILL_CUT.search(text)
    if m:
        return text[:m.end()].rstrip(". ")
    return text[:300]


def kod_parts(kod: str) -> list[str]:
    return [s for s in kod.split(".") if s]


def make_pattern(prefix: str) -> str:
    # \.\s* → PDF'te bazen "BES.7. 4.1" gibi noktadan sonra boşluk olabiliyor
    # Harf segmenti max 4 karakter — "Students" gibi uzun kelimeleri engeller
    # \d{1,3}(?!\d) → yıl numaralarını (1919, 1945) yakalamasın;
    # lookahead sayının ortasında bırakmayı engeller
    return re.escape(prefix) + r"(?:\.\s*[A-Za-zİIVXÇŞÖÜĞçşöüğı]{1,4}\d*|\.\s*\d{1,3}(?!\d)){1,6}"


def is_valid_kod(kod: str, min_seg: int) -> bool:
    parts = kod_parts(kod)
    if len(parts) < min_seg:
        return False
    if len(parts) >= 2 and parts[1].isdigit():
        s = int(parts[1])
        if not (1 <= s <= 12):
            return False
    # 4 haneli sayı segment → yıl/sayfa numarası tuzağı (ör: ÇTDT.1.1.1919)
    if any(p.isdigit() and len(p) >= 4 for p in parts):
        return False
    # Sayı segment > 30 → sayfa numarası (ör: TZHP.I.39.1); ünite/kazanım < 30 olmalı
    if any(p.isdigit() and int(p) > 30 for p in parts[1:]):
        return False
    # Son segment en az bir rakam içermeli (bölüm başlığı kodlarını eler)
    if not any(c.isdigit() for c in parts[-1]):
        return False
    return True


def derive_sinif(kod: str, info: dict) -> int | None:
    parts = kod_parts(kod)
    if info.get("sinif_kaynagi") == "kod":
        if len(parts) >= 2:
            if parts[1].isdigit():
                seg_map = info.get("sinif_segment_map")
                if seg_map and parts[1] in seg_map:
                    return seg_map[parts[1]]
                return int(parts[1])
            if parts[1] in ("I", "II", "III"):
                roman_map = info.get("sinif_roman_map") or {"I": 10, "II": 11, "III": 12}
                return roman_map.get(parts[1])
        # Türkçe tarzı: T.beceri.sınıf.no — parts[1] tek harf (D/O/K/Y)
        if (len(parts) >= 3
                and len(parts[1]) == 1 and parts[1].isalpha()
                and parts[2].isdigit()):
            seg_map = info.get("sinif_segment_map")
            if seg_map:
                return seg_map.get(parts[2])
            s = int(parts[2])
            if 1 <= s <= 12:
                return s
    if info.get("sinif_kaynagi") == "sabit" and len(info.get("siniflar", [])) == 1:
        return info["siniflar"][0]
    return None


def derive_okul(info: dict, sinif: int | None, ders: str) -> str | None:
    if info.get("okul_tipi"):
        return info["okul_tipi"]
    slug = info.get("brans_slug", "")
    if slug == "ihl_meslek_dersleri":
        return "ihl"
    if sinif is None:
        return None
    iho_dersler = {
        "Kur'an-ı Kerim", "Peygamberimizin Hayatı",
        "Temel Dinî Bilgiler", "Temel Dini Bilgiler",
    }
    if sinif in (5, 6, 7, 8) and ders in iho_dersler and slug == "din_kulturu":
        return "iho"
    if sinif in (5, 6, 7, 8) and slug == "arapca" and "Mesleki" not in ders:
        return "iho"
    if sinif <= 4:
        return "ilkokul"
    if sinif <= 8:
        return "ortaokul"
    return "lise"


# ── Metin çıkarma ──────────────────────────────────────────────────────────────

_pdftotext_ok: bool | None = None


def _pdftotext_available() -> bool:
    global _pdftotext_ok
    if _pdftotext_ok is not None:
        return _pdftotext_ok
    try:
        subprocess.run(["pdftotext", "-v"], capture_output=True, timeout=5)
        _pdftotext_ok = True
    except (FileNotFoundError, subprocess.TimeoutExpired, OSError):
        _pdftotext_ok = False
        print("[UYARI] pdftotext bulunamadı → pdfplumber kullanılıyor", flush=True)
    return _pdftotext_ok


def _run_pdftotext(pdf: Path, layout: bool = False) -> str:
    cmd = ["pdftotext"] + (["-layout"] if layout else []) + [str(pdf), "-"]
    try:
        r = subprocess.run(cmd, capture_output=True, timeout=120)
        # UTF-8 dene; çok fazla bozuk karakter varsa cp1254 (Windows Türkçe) dene
        text = r.stdout.decode("utf-8", errors="replace")
        if text.count("�") > 5:
            try:
                text = r.stdout.decode("cp1254")
            except (UnicodeDecodeError, LookupError):
                pass
        return text
    except Exception:
        return ""


def _pdfplumber_text(pdf: Path) -> str:
    if not _HAS_PDFPLUMBER:
        return ""
    try:
        with pdfplumber.open(pdf) as p:
            return "\n".join(pg.extract_text() or "" for pg in p.pages)
    except Exception:
        return ""


def extract_text(pdf: Path) -> tuple[str, str]:
    """(normal_text, layout_text) döndürür.
    pdfplumber önce (encoding güvenilir); pdftotext layout sadece pdfplumber boşsa.
    """
    normal = _pdfplumber_text(pdf)
    if normal.strip():
        # layout text: pdftotext -layout daha iyi sütun hizalaması verir
        if _pdftotext_available():
            layout = _run_pdftotext(pdf, layout=True)
            # encoding kalitesi yeterliyse kullan
            if layout.strip() and layout.count("�") < 20:
                return normal, layout
        return normal, normal
    # pdfplumber başarısız → pdftotext ile dene
    if _pdftotext_available():
        n = _run_pdftotext(pdf, layout=False)
        l = _run_pdftotext(pdf, layout=True)
        return n, l or n
    return "", ""


# ── Ünite başlık haritası ──────────────────────────────────────────────────────

def extract_unite_map(pdf: Path) -> dict[int, dict[int, str]]:
    """pdfplumber ile ünite başlıklarını çıkar: {sinif: {unite_no: unite_adi}}"""
    if not _HAS_PDFPLUMBER:
        return {}
    result: dict[int, dict[int, str]] = {}
    try:
        with pdfplumber.open(pdf) as p:
            sinif = 0
            for page in p.pages:
                for line in (page.extract_text() or "").split("\n"):
                    l = line.strip()
                    sm = re.match(r"^(\d+)\.\s*SINIF", l, re.IGNORECASE)
                    if sm:
                        sinif = int(sm.group(1))
                        result.setdefault(sinif, {})
                        continue
                    if sinif:
                        m = UNITE_STRICT.match(l)
                        if m:
                            n, ad = int(m.group(1)), clean(m.group(2))
                            if n not in result.get(sinif, {}) and len(ad) > 3:
                                result[sinif][n] = ad[:200]
    except Exception:
        pass
    return result


# ── Metadata arama ─────────────────────────────────────────────────────────────

_pdf_map: dict | None = None


def load_map() -> dict:
    global _pdf_map
    if _pdf_map is None:
        with open(MAP_FILE, encoding="utf-8") as f:
            _pdf_map = json.load(f)
    return _pdf_map


def lookup_info(pdf_name: str) -> dict | None:
    return load_map().get(pdf_name)


def detect_from_cover(cover: str, interactive: bool = False) -> dict | None:
    """Kapak sayfasından branş tespiti. Emin olunamazsa interactive=True ise sorar."""
    lower = cover.lower()
    candidates = [
        slug for slug, kws in COVER_BRANS.items()
        if any(kw.lower() in lower for kw in kws)
    ]
    if len(candidates) == 1:
        slug = candidates[0]
    elif interactive:
        print(f"\n[?] Branş adayları: {candidates if candidates else 'bulunamadı'}")
        print(f"Kapak metni (ilk 400 kar):\n{'─'*40}\n{cover[:400]}\n{'─'*40}")
        slug = input("brans_id girin (örn. matematik) veya boş bırak = atla: ").strip()
        if not slug:
            return None
    else:
        return None

    return {
        "brans_slug": slug,
        "ders": slug,
        "siniflar": list(range(1, 9)),
        "sinif_kaynagi": "kod",
        "kod_prefixleri": [],
    }


# ── Çekirdek çıkarma ───────────────────────────────────────────────────────────

def _score(rec: dict) -> int:
    """Kayıt kalitesi puanı: skill verb ile bitiyorsa +2, daha uzun metin +1."""
    metin = rec.get("kazanim_metni", "")
    return (2 if _SKILL_CUT.search(metin) else 0) + (1 if len(metin) > 20 else 0)


def extract_records(text: str, info: dict, pdf: Path) -> list[dict]:
    """BRIEFING 7-alan şemasında kayıt listesi döndürür.
    Aynı kod birden fazla sayfada geçiyorsa en iyi metni (skill verb bitiyor → uzun) seçer.
    """
    prefixes = info.get("kod_prefixleri", [])
    if not prefixes:
        return []

    patterns = [(p, re.compile(make_pattern(p))) for p in prefixes]
    min_seg  = info.get("min_kod_segment", MIN_SEG)
    u_map    = extract_unite_map(pdf)
    sinif_kaynagi = info.get("sinif_kaynagi", "")
    # Satır normalizasyon kuralları: "KAK-I 1.1" → "KAK.I.1.1" gibi özel formatlar
    line_norm = [(re.compile(r[0]), r[1]) for r in info.get("line_normalize", [])]

    cur_unite_no: int | None = None
    cur_unite_ad = ""
    cur_sinif:    int | None = None  # seksiyon tabanlı sınıf tespiti (TDE vb.)
    _SINIF_HDR = re.compile(r'\b(\d{1,2})\.\s*SINIF\b', re.IGNORECASE)

    # (kod, sinif) → candidate records; aynı kod farklı sınıflarda tekrarsa ayrı tutulur
    candidates: dict[tuple, list[dict]] = {}

    lines = text.split("\n")
    for li, line in enumerate(lines):
        if line_norm:
            for rx, repl in line_norm:
                line = rx.sub(repl, line)
            lines[li] = line  # devam satırları için de normalize edilmiş hali kullan
        # Bölüm başlığından sınıf tespiti — TDE/sarmal yapılar için
        sh = _SINIF_HDR.search(line)
        if sh:
            s = int(sh.group(1))
            if 1 <= s <= 12:
                cur_sinif = s

        # Ünite başlığı kontrolü
        um = (
            UNITE_COLON.search(line)
            or UNITE_KEYWORD.search(line)
            or UNITE_NUM.search(line.strip())
        )
        if um:
            try:
                cur_unite_no = int(um.group(1))
            except (ValueError, IndexError):
                pass
            else:
                ad = clean(line[um.end():])
                if len(ad) < 10 and li + 1 < len(lines):
                    nxt = lines[li + 1].strip()
                    if nxt and not re.match(r"^\d+\.\s*(ÜNİTE|SINIF)", nxt, re.I):
                        ad = clean(ad + " " + nxt)
                cur_unite_ad = ad[:200]

        # Kazanım kodu arama
        for prefix, pat in patterns:
            matches = list(pat.finditer(line))
            for idx, m in enumerate(matches):
                kod = m.group(0).rstrip(".")
                kod = re.sub(r'\.\s+', '.', kod)  # "BES.7. 4.1" → "BES.7.4.1"

                # Greedy regex letter segmenti metin kelimelerini yutabilir (ör: ÇTDT.2.1.Çift).
                # Sayı içermeyen sondan segment(ler)i at; metin başlangıcını buna göre ayarla.
                raw_end = m.end()
                parts_raw = kod_parts(kod)
                while len(parts_raw) > min_seg and not any(c.isdigit() for c in parts_raw[-1]):
                    stripped = parts_raw.pop()
                    # Regex match'in sonundan bu segmenti geri al (nokta dahil)
                    raw_end -= len(stripped) + 1  # +1 ayırıcı nokta için

                kod = '.'.join(parts_raw)
                if not is_valid_kod(kod, min_seg):
                    continue

                end = matches[idx + 1].start() if idx + 1 < len(matches) else len(line)
                ad  = clean(line[raw_end:end])

                # _cont_next: kısa devam satırı döngüsünün başlangıç noktası.
                # Daha önce bir satır tüketen bloklar bunu ilerletir.
                _cont_next = li + 1

                # Tire ile bölünmüş satır: "metin yö-" → "metin yönetme"
                if ad.endswith("-") and li + 1 < len(lines):
                    _hi = 1
                    nxt = lines[li + _hi].strip()
                    while re.fullmatch(r'\d{1,3}', nxt) and li + _hi + 1 < len(lines):
                        _hi += 1
                        nxt = lines[li + _hi].strip()
                    if nxt and not any(p.search(nxt) for _, p in patterns):
                        ad = clean(ad[:-1] + nxt)
                        _cont_next = li + _hi + 1  # tüketilen satırın ötesi

                # Devam satırı: metin çok kısaysa bir sonraki satıra bak
                # Büyük harfle başlayan satırları alma — başlık/etiket olabilir
                elif len(ad) < 8 and li + 1 < len(lines):
                    nxt = lines[li + 1].strip()
                    if (nxt
                            and not re.match(r"^[A-ZÇĞİÖŞÜ]", nxt[:2])
                            and not any(p.search(nxt) for _, p in patterns)):
                        ad = clean(ad + " " + nxt)
                        _cont_next = li + 2  # li+1 tüketildi

                # Kısa devam satırı: skill verb ile bitene kadar maksimum 3 tur döner.
                # İki sütunlu PDF'lerde birden fazla fragment satır olabilir.
                for _ci in range(3):
                    _ad_check = _STRUCTURAL_SUFFIX.sub('', ad).strip()
                    if not (len(_ad_check) >= 8
                            and not _ad_check.rstrip().endswith(".")
                            and not _SKILL_CUT_END.search(_ad_check)
                            and _cont_next < len(lines)):
                        break
                    nxt = lines[_cont_next].strip()
                    _nxt_skip = 0
                    # Sayfa numarası veya kısa tamamen büyük harfli başlık satırı → atla
                    while (
                        (re.fullmatch(r'\d{1,3}', nxt)
                         or (nxt and len(nxt) <= 60 and re.fullmatch(r'[A-ZÇĞİÖŞÜÂÎ\s]+', nxt)))
                        and _cont_next + _nxt_skip + 1 < len(lines)
                    ):
                        _nxt_skip += 1
                        nxt = lines[_cont_next + _nxt_skip].strip()
                    # Çift sütun PDF'lerde "BÜYÜK BAŞLIK küçük devam" satırları olabilir;
                    # başlık bölümünü at, sadece küçük harfli devamı al
                    _col_m = re.match(
                        r'^[A-ZÇĞİÖŞÜ][A-ZÇĞİÖŞÜ\s,\-\.]{2,}\s+([a-zçğışöüğ].*)',
                        nxt)
                    if _col_m:
                        nxt = _col_m.group(1)
                    if (nxt
                            and len(nxt) <= 120
                            and (not re.match(r"^[A-ZÇĞİÖŞÜ]", nxt[:2])
                                 or _SKILL_CUT.search(nxt[-60:]))
                            and not any(p.search(nxt) for _, p in patterns)):
                        ad = clean(ad + " " + nxt)
                        _cont_next += _nxt_skip + 1
                        # Devam satırı kendisi tire ile bittiyse bir sonraki satırı da al
                        if ad.endswith("-") and _cont_next < len(lines):
                            nxt2 = lines[_cont_next].strip()
                            _cont_next += 1
                            if nxt2 and not any(p.search(nxt2) for _, p in patterns):
                                ad = clean(ad[:-1] + nxt2)
                    else:
                        break

                if len(ad) < 8:
                    continue
                if ad[0] in "(),-–":
                    continue
                ad = trim_metin(ad)

                sinif = derive_sinif(kod, info)
                # Fallback: bölüm başlığından tespit edilen sınıf (seksiyon yapılar)
                if sinif is None and sinif_kaynagi == "seksiyon" and cur_sinif is not None:
                    if not info.get("siniflar") or cur_sinif in info.get("siniflar", []):
                        sinif = cur_sinif
                if sinif is None:
                    continue
                if info.get("siniflar") and sinif not in info["siniflar"]:
                    continue

                # Ünite no: kodun 3. segmentinden türet (varsa)
                parts    = kod_parts(kod)
                unite_no = cur_unite_no
                if len(parts) >= 3 and parts[2].isdigit():
                    unite_no = int(parts[2])

                # Haritadan ünite adını al
                unite_ad = cur_unite_ad
                if unite_no and sinif:
                    mapped = u_map.get(sinif, {}).get(unite_no)
                    if mapped:
                        unite_ad = mapped

                rec = {
                    "brans_id":      info["brans_slug"],
                    "okul_turu":     derive_okul(info, sinif, info.get("ders", "")),
                    "sinif":         sinif,
                    "unite_no":      unite_no or 0,
                    "unite_adi":     unite_ad or (f"Ünite {unite_no}" if unite_no else ""),
                    "kazanim_kodu":  kod,
                    "kazanim_metni": ad,
                }
                candidates.setdefault((kod, sinif), []).append(rec)

    # Her (kod, sınıf) için en iyi kaydı seç (skill verb var → uzun metin)
    found = []
    for (_kod, _sinif), recs in candidates.items():
        best = max(recs, key=_score)
        found.append(best)

    # Prefix-only kodları çıkar (MAT.5.1 varken MAT.5.1.1 de varsa önce düşer)
    codes = {r["kazanim_kodu"] for r in found}
    drop  = {k for k in codes if any(c.startswith(k + ".") for c in codes if c != k)}
    return [r for r in found if r["kazanim_kodu"] not in drop]



# ── Validate ───────────────────────────────────────────────────────────────────

_validate_mod = None


def _load_validate():
    global _validate_mod
    if _validate_mod is not None:
        return _validate_mod
    vpath = ROOT / "validate_kazanimlar.py"
    if not vpath.exists():
        return None
    spec = importlib.util.spec_from_file_location("validate_kazanimlar", vpath)
    mod  = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    _validate_mod = mod
    return mod


def run_validate(out_path: Path, silent: bool = False) -> tuple[int, int]:
    mod = _load_validate()
    if mod is None:
        print("[UYARI] validate_kazanimlar.py bulunamadı")
        return 0, 0
    if silent:
        buf = io.StringIO()
        with contextlib.redirect_stdout(buf):
            errors, warnings = mod.validate_file(str(out_path))
    else:
        errors, warnings = mod.validate_file(str(out_path))
    return errors, warnings


# ── Tek PDF işle ───────────────────────────────────────────────────────────────

def process_pdf(pdf: Path, interactive: bool = True) -> tuple[str, int, int, int]:
    """(durum_str, hata, uyarı, kayıt_sayısı) döndürür."""
    info = lookup_info(pdf.name)
    if info is None:
        normal, _ = extract_text(pdf)
        info = detect_from_cover(normal[:2000], interactive=interactive)
        if info is None:
            return "SKIP (branş tespit edilemedi)", 0, 0, 0

    if not info.get("brans_slug"):
        return f"SKIP (brans_slug=null — {info.get('ders', '')})", 0, 0, 0
    if not info.get("kod_prefixleri"):
        return "SKIP (kod_prefixleri boş)", 0, 0, 0

    normal, layout = extract_text(pdf)
    if not normal.strip():
        return "HATA (metin çıkarılamadı)", 1, 0, 0

    # Normal metinle dene; 0 sonuç gelirse layout ile tekrar dene
    records = extract_records(normal, info, pdf)
    if not records and layout != normal:
        records = extract_records(layout, info, pdf)
    if not records:
        return "HATA (0 kazanım bulundu)", 1, 0, 0

    records.sort(key=lambda x: (x["sinif"] or 0, x["unite_no"], x["kazanim_kodu"]))

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    slug     = slugify(pdf.name)
    out_path = OUT_DIR / f"{slug}_kazanimlar.json"
    out_path.write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")

    errors, warnings = run_validate(out_path, silent=not interactive)
    return f"OK ({len(records)} kayıt, {errors}E {warnings}W)", errors, warnings, len(records)


# ── Toplu işlem ────────────────────────────────────────────────────────────────

def batch() -> None:
    pdfs = sorted(PDF_DIR.glob("*.pdf"))
    if not pdfs:
        print(f"PDF bulunamadı: {PDF_DIR}")
        return

    total = len(pdfs)
    ok = skip = fail = total_kaz = 0
    problems: list[tuple[str, str]] = []

    print(f"\nToplu işlem: {total} PDF → {OUT_DIR}\n{'─' * 64}")

    for i, pdf in enumerate(pdfs, 1):
        info  = load_map().get(pdf.name, {})
        label = info.get("ders", pdf.stem)[:40]
        tag   = f"[{i:>3}/{total}] {label:<40}"

        status, errors, warnings, count = process_pdf(pdf, interactive=False)
        print(f"{tag} {status}", flush=True)

        if status.startswith("OK"):
            ok += 1
            total_kaz += count
            if errors or warnings:
                problems.append((pdf.name, status))
        elif status.startswith("SKIP"):
            skip += 1
        else:
            fail += 1
            problems.append((pdf.name, status))

    print(f"\n{'═' * 64}")
    print(f"ÖZET: {ok} OK | {skip} skip | {fail} hata | {total_kaz} toplam kazanım")
    if problems:
        print(f"\nDikkat gerektiren ({len(problems)}):")
        for name, st in problems:
            print(f"  {name[:55]:<55} {st}")
    print('═' * 64)


# ── Ana giriş noktası ──────────────────────────────────────────────────────────

def main() -> None:
    p = argparse.ArgumentParser(description="MEB müfredat PDF → kazanım JSON")
    p.add_argument("pdf",  nargs="?", help="Tek PDF dosyası yolu")
    p.add_argument("--all", action="store_true", help="Tüm PDFleri toplu işle")
    args = p.parse_args()

    if args.all or args.pdf is None:
        batch()
        return

    pdf_path = Path(args.pdf)
    if not pdf_path.exists():
        print(f"Dosya bulunamadı: {pdf_path}")
        sys.exit(1)

    print(f"\nİşleniyor: {pdf_path.name}")
    status, errors, warnings, _ = process_pdf(pdf_path, interactive=True)
    print(f"\nSonuç: {status}")
    sys.exit(1 if errors > 0 else 0)


if __name__ == "__main__":
    main()
