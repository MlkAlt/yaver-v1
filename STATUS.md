# Yaver V1 — Proje Durumu

**Son güncelleme:** [16.04.2026 13:40 — ilk oturum öncesi]

## Şu An Ne Yapıyoruz
Proje iskeleti kurulumu + Ajan/Skill sistem mimarisi

## Son Oturumda Tamamlanan
- (henüz yok, ilk oturum)

## Şu An Üzerinde Çalışılan
- [ ] Proje iskeleti kurulumu (Spec P7 checklist)
  - [ ] Vite + React + TypeScript projesi oluştur
  - [ ] Tailwind config — design tokenları (Spec G4)
  - [ ] Framer Motion kur
  - [ ] Supabase client + .env setup
  - [ ] Klasör yapısı (src/pages, src/components, src/lib, src/data)
  - [ ] /refs klasörü oluştur (Spec G3 alt yapısı)
  - [ ] /templates klasörü oluştur (prompts + evraklar altı)
  - [ ] Git init + ilk commit + main branch protected
  - [ ] Package.json exact versions (Spec K6)
- [ ] Ajan + skill sistem mimarisi
  - [ ] Claude Code'un ajan mekanizmasını öğren
  - [ ] 4 ajanı tanımla (UI Designer, UX Critic, Prompt Engineer, QA Tester)
  - [ ] 3 custom skill oluştur (yaver-ui-kit, turk-mufredat, meb-evrak)
  - [ ] Supabase MCP entegrasyonu

## Sonraki Adımlar (öncelik sırasında)
1. İskelet + ajan/skill mimarisini tamamla
2. Supabase şeması + migration dosyaları (Spec B3)
3. Müfredat seed datasını yükle (15+ branş için JSON)
4. Ekran 1 — Karşılama (Spec D2) — UI Designer ajanı ile
5. Ekran 2 — Branş Seçimi — UX Critic ile kalite kontrolü
6. Ekran 3 — Sınıf Seçimi
7. Ekran 4 — Loading
8. Ekran 5 — Wow Moment
9. Yıllık plan üretim mantığı (deterministik)

## Kararlar / Notlar
- Spec V1.4 referans alındı, CLAUDE.md olarak projeye kopyalandı
- **Ajan sistemi kurulacak** (4 ajan + 3 custom skill) — DECISIONS.md'ye bak
- **Git feature branch workflow zorunlu** (main protected)
- **Version pinning politikası** (exact version, ^ yasak)
- **Destructive işlem koruması** (auto-approve mode yasak, haftalık DB snapshot)
- UI için /refs klasörüne 10 referans ekran görüntüsü toplanacak + 7 kaynak site (Mobbin, Dribbble, Figma Community, Page Flows, Refero, The U, UI Garage)

## Açık Sorunlar
- Müfredat PDF'leri hâlâ toplanmadı (hafta sonu için işaretlendi)
- Branş listesi finalize edilmedi (Coğrafya eklenecek mi)
- Karşılama ekranı görseli henüz belirsiz (maskot/soyut/tipografi)
- Claude Code'un ajan/subagent mekanizması araştırılacak (ilk oturumda)
- AI UI generator (Stitch/v0.dev/Lovable) kullanım kararı verilecek — Claude Code aşamasında

## Bir Sonraki Oturuma Not

### İlk oturumda Claude Code'a sor:
1. Subagent/ajan sistemi bu ortamda nasıl çalışıyor?
2. Custom skill'ler nereye yerleştiriliyor, nasıl tetikleniyor?
3. MCP server yapılandırması nasıl (.mcp.json var mı)?
4. Supabase MCP kurulum adımları

### Bu bilgileri aldıktan sonra:
- Ajan tanımlarını beraber yazın (Claude Code'un kendi syntax'ı ile)
- İskelet kurulumu paralel ilerlesin
- /refs klasörüne başlamadan önce en az 5 referans ekran görüntüsü topla

### AI UI Generator Kararı (Hafta 2 öncesi):
- Stitch (Google), v0.dev (Vercel), Lovable, RORK gibi AI UI generator'lar var
- Karşılama + Wow Moment için taslak oluşturmak mantıklı olabilir
- Ama UI Designer ajanı + design tokens + referans yaklaşımımız asıl yol
- Karar: Claude Code'da ilk ajanları kurduktan sonra UI Designer'a sor — "bu generator'lar işimize yarar mı?"

### Güvenlik Hatırlatması:
- Auto-approve mode kesinlikle açma
- Supabase snapshot her hafta
- Destructive işlem öncesi manuel onay

### Prompt Best Practices (video kaynağından):
- Her yeni Claude Code oturumunda CLAUDE.md otomatik okunur, sen bir şey demezsin
- STATUS.md'yi her oturum başı okut
- Destructive işlem prompt'larında: "önce bana sor" hatırlatması
