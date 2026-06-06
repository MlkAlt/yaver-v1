# -*- coding: utf-8 -*-
import json, os, sys

sys.stdout.reconfigure(encoding='utf-8')

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ref_all = json.load(open(os.path.join(ROOT, 'refs/kazanimlar_v2/kazanimlar_v2.json'), encoding='utf-8'))

GROUPS = {
    'beden_egitimi': [
        'outputs/beden_eğitimi_ve_oyun_dersi_öğretim_programı-23_07_2025_kazanimlar.json',
        'outputs/beden_eğitimi_ve_spor_dersi_öğretim_programı-23_07_2025_kazanimlar.json',
        'outputs/beden_eği̇ti̇m_program-21_07_2025_kazanimlar.json',
    ],
    'muzik': [
        'outputs/müzik18döp_kazanimlar.json',
        'outputs/müzikprogram912_kazanimlar.json',
    ],
    'fen_bilimleri': [
        'outputs/fen_bilimleri_kazanimlar.json',
    ],
}

for brans_id, out_files in GROUPS.items():
    ref = {r['kazanim_kodu']: r for r in ref_all if r['brans_id'] == brans_id}
    new_all = []
    for f in out_files:
        fp = os.path.join(ROOT, f)
        if os.path.exists(fp):
            new_all += json.load(open(fp, encoding='utf-8'))
    new = {r['kazanim_kodu']: r for r in new_all}

    only_ref = [k for k in ref if k not in new]
    only_new = [k for k in new if k not in ref]

    metin_better = 0
    metin_worse  = 0
    metin_diffs  = []
    for kod, rr in ref.items():
        nr = new.get(kod)
        if nr and rr['kazanim_metni'] != nr['kazanim_metni']:
            rl, nl = len(rr['kazanim_metni']), len(nr['kazanim_metni'])
            if nl > rl:
                metin_better += 1
            else:
                metin_worse += 1
            metin_diffs.append((kod, rl, nl, rr['kazanim_metni'][-40:], nr['kazanim_metni'][-40:]))

    print(f"=== {brans_id.upper()} ===")
    print(f"  Referans: {len(ref)} | Yeni: {len(new)}")
    print(f"  Sadece ref: {len(only_ref)} | Sadece yeni: {len(only_new)}")
    print(f"  Metin farki: {len(metin_diffs)}  (yeni uzun={metin_better}, yeni kisa={metin_worse})")
    for kod, rl, nl, rend, nend in metin_diffs[:3]:
        pad = " " * len(kod)
        print(f"  {kod}: ref({rl}k)  ...{rend}")
        print(f"  {pad}  yeni({nl}k) ...{nend}")
    if only_ref:
        print(f"  Eksik kodlar: {only_ref[:5]}")
    if only_new:
        print(f"  Fazla kodlar: {only_new[:5]}")
    print()
