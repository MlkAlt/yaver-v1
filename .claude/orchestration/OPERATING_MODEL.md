# Yaver — Ekip Operating Model

Dünya çapında bir mobil stüdyo gibi çalışan, dosya-tabanlı koordine olan ajan ekibi.

## Roller (`.claude/agents/`)
| Rol | Sorumluluk | Skill loadout | Model |
|---|---|---|---|
| **delivery-lead** | Pano, sıralama, bağımlılık/engel, kısa durum | — | opus |
| **evrak-engineer** | MEB evrak modülleri (data+HTML+wiring) | yaver-ui-kit | opus |
| **ui-craftsman** | Ekran UI/UX, premium kalite | ui-designer · ui-redesign · yaver-ui-kit · ux-critic | opus |
| **qa-verifier** | tsc + playwright görsel doğrulama | verify | sonnet |
| **refactor-engineer** | Teknik borç / sadeleştirme | simplify · code-review | sonnet |

## Şef (Conductor) modeli — orkestrasyon gerçeği
Claude Code'da alt-ajanı **yalnızca ana oturum (şef) başlatır**; ajan ajanı tetikleyemez.
Bu yüzden "biri bitince sıradakini tetikle" şöyle işler:

```
şef görevi başlatır (arka plan) → ajan biter → harness şefe haber verir
→ şef handoff notunu + board.cjs gate'i okur → sıradaki ready görevi başlatır
```

Script bir daemon DEĞİL: durum panosu + handoff geçidi. Tetikleyici = şef.

## Paralellik kuralı
İki görev **yalnızca dosya setleri ayrıksa** paralel koşar (çakışma/clobber olmaz).
- Ayrık örnek: `PlanimScreen.tsx` (F3a) ↔ `SablonDoldurmaScreen.tsx`/`EvraklarimScreen.tsx` (E1). ✅
- Aynı hot dosyaya iki ajan → sıraya al veya `isolation: worktree` kullan.

## Handoff protokolü
1. Ajan işini bitirir, `node scripts/board.cjs gate` (tsc) PASS olmalı.
2. Ajan `.claude/orchestration/handoff/<task-id>.md` yazar (format: `handoff/README.md`).
3. Şef notu okur → `board.json` durumunu günceller → bağımlılığı çözülen görevi `ready` yapar → sıradakini başlatır.

## Değişmez kurallar
- **Commit yalnızca şef**, oturum sonunda "kaydet" denince (K5: feature branch, main'e direkt push yok).
- **Referans disiplini:** gerçek örnek belgesi olmayan evrak yazılmaz (DECISIONS.md).
- Ajanlar kapsam dışı / başka owner'ın dosyasına dokunmaz.
- Tek gerçek kaynak: `board.json`. Canlı durum: `node scripts/board.cjs`.
