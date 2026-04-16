# Yaver V1 — Proje Durumu

**Son güncelleme:** 16.04.2026 14:30 — Oturum 1 kapanışı

## Şu An Ne Yapıyoruz
Skill sistemi kurulumuna hazırız. Sonraki oturumda 3 skill yazılacak, ardından seed data.

## Son Oturumda Tamamlanan (Oturum 1 — 16.04.2026)
- [x] Vite + React + TypeScript projesi oluşturuldu (react-ts template)
- [x] Tailwind CSS 3.4.4 kuruldu + tailwind.config.js'e Spec G4 design tokenları eklendi
  - colors: paper, ink, smoke, mist, sienna, moss, amber, card, divider
  - fontFamily: Bricolage Grotesque (display) + DM Sans (body)
  - borderRadius: sm/md/lg/full
- [x] Framer Motion 11.3.8 kuruldu
- [x] src/ klasör yapısı oluşturuldu (pages, components, lib, data)
- [x] /refs ve /templates klasörleri oluşturuldu
- [x] .gitignore düzenlendi (.env, .env.local, Supabase local eklendi)
- [x] Git init + main branch + ilk commit (34 dosya)
- [x] Package.json exact version pinning uygulandı (^ ve ~ temizlendi)
- [x] index.css: noise overlay + paper background + Google Fonts import
- [x] Claude Code ortamı araştırıldı (subagent, skill, MCP mekanizmaları)
- [x] Supabase proje açıldı: yaver-v1-dev (oelllamwceazolwpgavq)
- [x] .env.local oluşturuldu (gitignored, credentials güvenli)
- [x] .env.local.example oluşturuldu (şablon, credentials yok)
- [x] .mcp.json oluşturuldu (Supabase MCP config)
- [x] @supabase/supabase-js 2.45.0 + supabase CLI 2.91.3 kuruldu
- [x] src/lib/supabase.ts oluşturuldu (client)
- [x] supabase/migrations/20260416000001_initial_schema.sql yazıldı (Spec B3 — 13 tablo)
- [x] supabase/migrations/20260416000001_rollback.sql yazıldı (K7)
- [x] Migration Supabase Dashboard'da çalıştırıldı — 8 tablo bağlantı testi OK
- [x] RLS tüm tablolarda aktif
- [x] Skill sistemi mimarisi netleştirildi (4 ajan = 4 skill, .claude/skills/ altında)
- [x] Tüm değişiklikler 2 commit ile git'e kaydedildi

## Şu An Üzerinde Çalışılan
- [ ] Skill sistemi kurulumu
  - [ ] yaver-ui-kit skill (design tokens, component patterns, animasyon kuralları)
  - [ ] ux-critic skill (ekran kalite checklist)
  - [ ] ui-designer skill (ekran yazımı için rol tanımı)
  - [ ] (prompt-engineer, qa-tester, turk-mufredat, meb-evrak — ilgili haftalarda)

## Sonraki Adımlar (öncelik sırasında)
1. **Oturum 2 başı:** 3 skill yaz (yaver-ui-kit, ux-critic, ui-designer) — yarım gün
2. Seed data yükle: branslar (15 branş) + egitim_takvimi (2025-2026, 36 hafta)
3. Ekran 1 — Karşılama (Spec D2)
4. Ekran 2 — Branş Seçimi
5. Ekran 3 — Sınıf Seçimi
6. Ekran 4 — Loading
7. Ekran 5 — Wow Moment
8. Yıllık plan üretim mantığı (deterministik)

## Kararlar / Notlar
- **"Ajan" = "Skill":** Claude Code'da custom agent type tanımlanamıyor. 4 "ajan" = 4 skill dosyası. `context: fork` ile izole subagent gibi çalışır.
- **Skill konumu:** `.claude/skills/<skill-adı>/SKILL.md` (proje bazlı, git'e commit)
- **Skill öncelik sırası:** yaver-ui-kit → ux-critic → ui-designer (bugün). prompt-engineer Hafta 2, qa-tester Hafta 4.
- **Supabase project:** `yaver-v1-dev` (oelllamwceazolwpgavq) — development only, production ayrı açılacak (K7)
- **MCP:** .mcp.json hazır, SERVICE_ROLE_KEY .env.local'dan besleniyor
- **Güvenlik olayı çözüldü:** credentials yanlışlıkla .env.local.example'a girdi, amend ile git history'den temizlendi

## Açık Sorunlar
- Müfredat PDF'leri toplanmadı (seed data için gerekli — önce JSON elle yazılabilir)
- Branş listesi finalize edilmedi (Coğrafya dahil mi?)
- Karşılama ekranı görseli belirsiz (maskot/soyut/tipografi — Ekran 1 yazılırken karar)
- AI UI generator kullanımı (Stitch/v0.dev/Lovable) — Hafta 2 öncesi karar

## Bir Sonraki Oturuma Not

### Oturum 2 başlangıç komutu:
```
STATUS.md'yi oku, özetini ver. 3 skill yazacağız: yaver-ui-kit, 
ux-critic, ui-designer. Hepsi .claude/skills/ altına gidecek.
```

### 3 Skill için içerik rehberi:
- **yaver-ui-kit:** Spec G1-G7 + G9'daki tüm kurallar. Token'lar, font hiyerarşisi, animasyon kuralları (200-400ms, ease-out), empty state dili, ikon boyutları, boşluk hiyerarşisi. "Her ekranı Things 3'e koysam yakışır mı?" sorusu.
- **ux-critic:** Spec G7 kontrol listesi + J bölümü (10 UX ilkesi). Ekran bittikten sonra çalıştırılır. Saf beyaz var mı? Animasyon var mı? Hikâye empty state? Linear'a yakışır mı?
- **ui-designer:** Spec G9'daki UI prompt'u temel alarak. Design system kuralları, referans uygulamalar (Things 3, Linear), her ekranda uyulacak standartlar.

### Dikkat: npm install caret sorunu
npm install her seferinde package.json'a `^` ekliyor. Her paket kurulumundan sonra Edit ile temizle.

### Güvenlik hatırlatması:
- .env.local asla git'e ekleme
- Destructive komut öncesi sor
- Haftalık Supabase snapshot (henüz yapılmadı — Dashboard'dan ayarla)
