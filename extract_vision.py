# -*- coding: utf-8 -*-
"""
MEB müfredat PDF → kazanım JSON (Claude API native PDF desteği)

Kullanım:
  python extract_vision.py               # tüm PDF'leri işle
  python extract_vision.py --resume      # mevcut JSON'ları atla
  python extract_vision.py <pdf_adi>    # tek PDF (map'teki dosya adı)

Çıktı: extracted/<slug>.json  (mevcut şemayla uyumlu)
"""
from __future__ import annotations

import argparse
import base64
import json
import re
import sys
import time
from pathlib import Path

import ssl
import httpx
import anthropic

ROOT    = Path(__file__).resolve().parent
PDF_DIR = ROOT / "refs" / "mufredat-2025"
MAP_FILE = ROOT / "scripts" / "pdf-brans-map.json"
OUT_DIR  = ROOT / "extracted"

# Windows sertifika deposunu kullan (kurumsal CA dahil)
_ssl_ctx = ssl.create_default_context()
_ssl_ctx.load_default_certs()

client = anthropic.Anthropic(
    http_client=httpx.Client(verify=_ssl_ctx),
)

# Sistem prompt — tüm çağrılarda aynı → cache_control ile önbelleğe al
_SYSTEM: list[dict] = [
    {
        "type": "text",
        "text": (
            "Sen MEB (Milli Eğitim Bakanlığı) müfredat belgelerinden kazanım çıkaran uzmansın.\n\n"
            "Kazanım: Öğrencilerin edinmesi beklenen bilgi/beceri/tutumları ifade eden, "
            "belirli bir koda sahip maddelerdir.\n"
            "Kazanım kodu formatı: PREFIX.SINIF.UNITE.SIRA  "
            "(ör: MAT.5.1.1 | FB.3.2.4 | T.8.3.2 | DKAB.9.1.1)\n\n"
            "okul_turu kuralları:\n"
            "  sinif 1-4               → ilkokul\n"
            "  sinif 5-8 (genel)       → ortaokul\n"
            "  sinif 5-8 (imam hatip)  → iho\n"
            "  sinif 9-12 (genel)      → lise\n"
            "  sinif 9-12 (meslek/ihl) → ihl\n\n"
            "ÇIKTI KURALI: Yalnızca geçerli bir JSON array döndür. "
            "Markdown (```) veya açıklama ekleme.\n\n"
            "Şema:\n"
            "[\n"
            '  {\n'
            '    "brans_id":      "<branş slug, ör: matematik>",\n'
            '    "okul_turu":     "<ilkokul|ortaokul|lise|ihl|iho>",\n'
            '    "sinif":         <integer>,\n'
            '    "unite_no":      <integer, yoksa 0>,\n'
            '    "unite_adi":     "<ünite başlığı, yoksa boş string>",\n'
            '    "kazanim_kodu":  "<tam kod>",\n'
            '    "kazanim_metni": "<kazanım metni>"\n'
            '  }\n'
            "]"
        ),
        "cache_control": {"type": "ephemeral"},
    }
]


# ── Yardımcılar ────────────────────────────────────────────────────────────────

def slugify(name: str) -> str:
    base = name.rsplit(".pdf", 1)[0]
    parts = base.split("-", 1)
    rest = parts[1].strip() if len(parts) > 1 and parts[0].isdigit() else base
    rest = re.sub(r"[^\w\dçşöüğıİÇŞÖÜĞ_-]", "_", rest)
    return re.sub(r"_+", "_", rest).strip("_").lower()


def parse_json_response(text: str) -> list[dict]:
    text = text.strip()
    if text.startswith("["):
        return json.loads(text)
    m = re.search(r"\[[\s\S]*\]", text)
    if m:
        return json.loads(m.group(0))
    raise ValueError(f"JSON array bulunamadı — yanıt başlangıcı: {text[:300]}")


# ── Tek PDF işleme ─────────────────────────────────────────────────────────────

def process_pdf(pdf_name: str, info: dict) -> list[dict]:
    pdf_path = PDF_DIR / pdf_name
    pdf_b64  = base64.standard_b64encode(pdf_path.read_bytes()).decode()

    okul_tipi = info.get("okul_tipi", "")
    okul_hint = (
        f"Bu PDF için okul_turu = '{okul_tipi}' (tüm kayıtlara uygula)"
        if okul_tipi
        else "okul_turu'nu sınıf numarasına ve branşa göre otomatik belirle"
    )

    user_text = (
        f"Branş slug : {info['brans_slug']}\n"
        f"Ders adı   : {info['ders']}\n"
        f"Sınıflar   : {info.get('siniflar', [])}\n"
        f"Kod prefix : {info.get('kod_prefixleri', [])}\n"
        f"{okul_hint}\n\n"
        "Bu PDF'deki tüm kazanımları JSON array olarak döndür."
    )

    response = client.beta.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=8192,
        system=_SYSTEM,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "document",
                        "source": {
                            "type": "base64",
                            "media_type": "application/pdf",
                            "data": pdf_b64,
                        },
                    },
                    {"type": "text", "text": user_text},
                ],
            }
        ],
        betas=["pdfs-2024-09-25"],
    )

    return parse_json_response(response.content[0].text)


# ── Tek PDF çalıştır + kaydet ─────────────────────────────────────────────────

def run_one(pdf_name: str, info: dict, resume: bool) -> tuple[str, int]:
    slug = slugify(pdf_name)
    out  = OUT_DIR / f"{slug}.json"

    if resume and out.exists():
        try:
            existing = json.loads(out.read_text(encoding="utf-8"))
            if len(existing) >= 3:
                return f"ATLA ({len(existing)} mevcut)", len(existing)
        except Exception:
            pass

    records = process_pdf(pdf_name, info)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")
    return f"OK ({len(records)} kazanım)", len(records)


# ── Toplu işlem ───────────────────────────────────────────────────────────────

def batch(resume: bool) -> None:
    with open(MAP_FILE, encoding="utf-8") as f:
        pdf_map = json.load(f)

    items = [
        (k, v) for k, v in pdf_map.items()
        if not k.startswith("_") and v.get("brans_slug") and v.get("kod_prefixleri")
    ]

    total = len(items)
    total_kaz = ok = skipped = errors = 0
    print(f"\n{total} PDF işlenecek → {OUT_DIR}\n{'─' * 64}")

    for i, (pdf_name, info) in enumerate(items, 1):
        if not (PDF_DIR / pdf_name).exists():
            print(f"[{i:>3}/{total}] PDF YOK: {pdf_name[:55]}", flush=True)
            errors += 1
            continue

        label = info.get("ders", pdf_name)[:35]
        tag   = f"[{i:>3}/{total}] {label:<35}"

        try:
            status, n = run_one(pdf_name, info, resume)
            total_kaz += n
            print(f"{tag} {status}", flush=True)
            if status.startswith("ATLA"):
                skipped += 1
            else:
                ok += 1
            # API rate limit: saatte çok fazla çağrı yapmamak için kısa bekleme
            if not status.startswith("ATLA"):
                time.sleep(1)
        except Exception as e:
            print(f"{tag} HATA — {e}", flush=True)
            errors += 1

    print(f"\n{'═' * 64}")
    print(f"ÖZET: {ok} OK | {skipped} atlandı | {errors} hata | {total_kaz} kazanım")
    print('═' * 64)


# ── Ana giriş ────────────────────────────────────────────────────────────────

def main() -> None:
    p = argparse.ArgumentParser(description="MEB müfredat PDF → kazanım JSON (Claude vision)")
    p.add_argument("pdf",      nargs="?", help="Tek PDF dosya adı (map'teki anahtar)")
    p.add_argument("--resume", action="store_true", help="Mevcut JSON'ları atla")
    args = p.parse_args()

    if not MAP_FILE.exists():
        print(f"Map dosyası bulunamadı: {MAP_FILE}")
        sys.exit(1)

    if args.pdf:
        with open(MAP_FILE, encoding="utf-8") as f:
            pdf_map = json.load(f)
        info = pdf_map.get(args.pdf)
        if not info:
            print(f"Map'te bulunamadı: {args.pdf}")
            sys.exit(1)
        status, _ = run_one(args.pdf, info, resume=False)
        print(f"{args.pdf}: {status}")
        return

    batch(resume=args.resume)


if __name__ == "__main__":
    main()
