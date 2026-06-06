# -*- coding: utf-8 -*-
"""
pdf-brans-map.json'a min_kod_segment:3 ekler.
sabit sinif_kaynagi + non-empty prefix + min_seg yok → ekle.
TDE entry'sini de prefix+sinif_kaynagi güncellemesi ile günceller.
"""
import json, sys

MAP_PATH = 'scripts/pdf-brans-map.json'
m = json.load(open(MAP_PATH, encoding='utf-8'))

updated = []

for k, v in m.items():
    if not isinstance(v, dict):
        continue

    prefixes = v.get('kod_prefixleri', [])
    sinif_kaynagi = v.get('sinif_kaynagi', '')
    siniflar = v.get('siniflar', [])
    already_set = v.get('min_kod_segment') is not None

    # sabit sinif, prefix var, min_seg yok → add min_seg:3
    if sinif_kaynagi == 'sabit' and prefixes and not already_set:
        v['min_kod_segment'] = 3
        updated.append(f'{k}: min_kod_segment=3')

# TDE: prefix değişikliği + min_seg + sinif_kaynagi
tde_key = '2026518151228236-edebiyatdöp.pdf'
if tde_key in m:
    m[tde_key]['kod_prefixleri'] = ['TDE1', 'TDE2', 'TDE3', 'TDE4']
    m[tde_key]['min_kod_segment'] = 3
    m[tde_key]['sinif_kaynagi'] = 'seksiyon'  # section-header based
    updated.append(f'{tde_key}: prefix+min_seg+sinif_kaynagi guncellendi')

json.dump(m, open(MAP_PATH, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print(f'{len(updated)} guncelleme yapildi:')
for u in updated:
    print(f'  {u}')
