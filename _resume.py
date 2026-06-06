import json, sys, io, importlib.util
from pathlib import Path

spec = importlib.util.spec_from_file_location('ext', 'scripts/extract-all-mufredat.py')
mod = importlib.util.module_from_spec(spec)
sys.modules['ext'] = mod
spec.loader.exec_module(mod)

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

pdf_map = json.loads(Path('scripts/pdf-brans-map.json').read_text(encoding='utf-8'))
out_dir = Path('extracted')
out_dir.mkdir(exist_ok=True)

already = {f.stem for f in Path('extracted').glob('*.json')}
remaining = [(k, v) for k, v in pdf_map.items() if not k.startswith('_') and mod.slugify(k) not in already]

print(f"Kalan PDF: {len(remaining)}")
for i, (pdf_name, info) in enumerate(remaining):
    slug = mod.slugify(pdf_name)
    out_path = out_dir / f'{slug}.json'
    try:
        result = mod.process_pdf(pdf_name, info, 4)
        out_path.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
        print(f'[{i+1}/{len(remaining)}] {info.get("brans_slug","?")}: {len(result)} kazanım')
    except Exception as e:
        print(f'[{i+1}/{len(remaining)}] HATA: {pdf_name[:40]} — {e}')
