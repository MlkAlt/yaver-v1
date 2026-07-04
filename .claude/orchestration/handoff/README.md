# Handoff Notları

Her ajan işini bitirince buraya `<task-id>.md` (QA için `<task-id>-qa.md`) bırakır.
Şef bunları okuyup `board.json`'u günceller ve sıradaki görevi başlatır.

## Format

```markdown
# <task-id> — <başlık>
**Rol:** <ajan> · **Gate:** PASS/FAIL (npx tsc --noEmit)

## Ne yapıldı
- ...

## Dokunulan dosyalar
- src/...

## Sıradaki role ne gerek
- <rol>: ...

## Açık sorular / riskler
- ...
```

Not: Bu klasör süreç kaydıdır; şef oturum sonunda temizleyebilir veya arşivleyebilir.
