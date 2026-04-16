# Yaver V1 — Karar Günlüğü

Bu dosyaya sadece ekleme yapılır, silme yok.
Her karar: tarih + ne + neden + revizyon tetikleyicisi.

---

## 2026-04-17 — Sıfırdan başlanacak, eski Yaver projesi terk edildi
**Ne:** Yeni `yaver-v1` klasörü oluşturulacak. Eski `yıllık_plan_app` projesinden sadece müfredat datası (varsa), MEB takvim mantığı, Supabase credentials ve branş listesi taşınacak. React component'ları, state management, eski mockup kararları taşınmayacak.
**Neden:** V1.4 spec mevcut projenin mimarisinden çok farklı (plan-as-organism omurga, 4 tab yapısı, asistan mekanizmaları, UI dili). Eski kodu uyarlamak sıfırdan yazmaktan uzun sürer.
**Ne zaman revize:** Geçerli değil, geri dönülmez karar.

---

## 2026-04-17 — V1'de ders kitabı RAG kullanılmayacak
**Ne:** V1'de sadece müfredat (kazanımlar) datası kullanılacak. Ders kitabı PDF'leri V1.5'te eklenecek (premium feature olarak).
**Neden:** Telif hakkı belirsizliği (MEB ders kitapları telif altında). Token maliyeti patlatır. PDF parsing + chunking + embedding + vector search V1 için 1-2 hafta ekstra iş. Kalite artışı belirsiz. AI Türk müfredatını zaten biliyor, kazanım kodu yeterli.
**Ne zaman revize:** V1 stabil olduktan sonra, premium tier yapılanmasında.

---

## 2026-04-17 — Fiyatlandırma V1'de netleştirilmeyecek
**Ne:** V1 için tier yapısı ve fiyatlandırma belirlenmedi. V1 sadece cömert bir free tier ile çıkacak.
**Neden:** Reel kullanım datası olmadan fiyat belirlemek tahmin. V1 acquisition layer, V1.5 monetization layer. Fiyatlandırma öğretmen davranışı datasıyla netleştirilecek (Spec Bölüm N metrikleri).
**Ne zaman revize:** V1 canlıda 100+ aktif kullanıcı + 4+ haftalık usage datası olduğunda.

---

## 2026-04-17 — Sürpriz hazırlık default açık, sıklık haftada 3-4
**Ne:** Mekanizma 2 (Sürpriz Hazırlık) default olarak açık gelecek. Haftada 3-4 sürpriz hazırlık yapılacak.
**Neden:** Cesur karar — Yaver kendini hemen kanıtlayarak alışkanlık yaratır. Default kapalı olursa kullanıcı bu mekanizmayı keşfetmeyebilir.
**Ne zaman revize:** Bu bir hipotez, kilitli karar değil. Eğer "Beğendin mi?" feedback'inde 3. sürprizden sonra beğeni oranı düşüyorsa sıklık indirilecek.

---

## 2026-04-17 — Hızlı mod V1.5'e ertelendi
**Ne:** Üretim ekranının "Hızlı mod" varyantı V1'de yapılmayacak. Sadece Detaylı mod (form tabanlı) olacak.
**Neden:** Hızlı modun gerçekten gerekli olup olmadığı V1 datasıyla test edilecek. Sürpriz Hazırlık zaten benzer bir değer veriyor (form doldurmadan hazır içerik). İki mod V1'i karmaşıklaştırır.
**Ne zaman revize:** V1 datasında öğretmenlerin form doldurma oranı düşükse veya feedback olarak "hızlı seçenek istiyorum" geliyorsa V1.5'te eklenecek.

---

## 2026-04-17 — [REVİZE EDİLDİ] Ajan + Skill sistemi V1'de KURULACAK
**Önceki karar:** V1'de ajan sistemi kurulmayacak, tek oturum + disiplin yeterli.
**Revize sebebi:** Kullanıcı kalite odaklı strateji tercih etti. UI kalitesinin ürünün ana diferansiyatörü olduğu, "AI çıktısı gibi görünmemesi" gerektiği gerçeği bu yatırımı değerli kılıyor. Kullanıcının mevcut `~/.agents/core/` deneyimi de risk azaltıyor.

**Yeni karar:** V1'de 4 ajan + 3 custom skill kurulacak.

**4 Ajan:**
1. **UI Designer** — Her ekranın Things 3/Linear seviyesinde görünmesinden sorumlu. yaver-ui-kit + frontend-design skills'leri kullanır.
2. **UX Critic** — Ekran bittikten sonra spec'e uyum ve kalite kontrolü yapar. Checklist'ten geçirir.
3. **Prompt Engineer** — AI üretim prompt'larını Türk müfredatına göre optimize eder. turk-mufredat skill'ini kullanır.
4. **QA Tester** — Öğretmen senaryolarını test eder, regression kontrolü yapar.

**3 Custom Skill:**
1. **yaver-ui-kit** — Design tokens, component patterns, animation rules, typography hierarchy
2. **turk-mufredat** — MEB formatları, kazanım yapıları, Türk eğitim dili ve terminolojisi
3. **meb-evrak** — Resmi evrak şablonları (zümre, ŞÖK, kulüp), MEB standartları

**MCP:**
- Supabase MCP (mutlaka)
- Figma MCP (freelance tasarımcı tutulursa)
- Playwright MCP (Hafta 3-4'te, test ajanı için)

**Neden:** 
- UI kalitesi = ürünün satılabilirliği (spec Bölüm G'de detaylı)
- Sistemik kalite kontrolü (UX Critic) tutarlı sonuç verir
- Türk müfredatı için özel prompt optimizasyonu AI çıktılarını diferansiyel yapar
- Setup maliyeti 1-2 gün ama uzun vadede zaman kazandırır

**Ne zaman revize:** Ajan sistemi overhead yaratıyor, proje yavaşlatıyorsa Hafta 2 sonunda sadeleştirilir. Tam tersine işliyorsa V1.5'te ajan sayısı artırılabilir (Content Curator, Teacher Behavior Analyst gibi).

---

## 2026-04-17 — Git feature branch workflow zorunlu
**Ne:** Her feature ayrı branch'te geliştirilecek. Main branch protected olacak, direkt push yasak. Branch adlandırma: `feature/[ekran-veya-sistem]-[kısa-açıklama]`.
**Neden:** Tek bir hatalı commit'in main'i bozmaması için. Ajan sisteminde birden fazla görev paralel çalışabilir, çakışmalar branch izolasyonuyla önlenir. UX Critic ajanı her merge öncesi kontrol yapacak.
**Detaylar:**
- Haftalık release tag (`v0.1.0-week1`, `v0.2.0-week2`)
- Commit mesajları insan diliyle (AI generated mesaj yasağı)
- Merge öncesi: kod çalışır, UX Critic onaylı, DECISIONS.md güncel
**Ne zaman revize:** Geçerli değil, kalıcı kural.

---

## 2026-04-17 — Version pinning politikası (kararlı son sürüm)
**Ne:** Package.json'da exact version kullanılacak, `^` veya `~` yasak. Kararlı son sürüm (latest stable), bleeding edge değil. Package-lock.json git'e commit edilecek.
**Neden:** "Son sürüm" ≠ "en iyi sürüm". Yeni çıkmış sürümler test edilmemiş hata barındırır. Bugün çalışan kod yarın çalışmayabilir. Reproducible builds için exact version gerekir. Referans videodaki kullanıcının yaşadığı sürüm uyumsuzluğu sorunlarından kaçınmak için.
**Detaylar:**
- Her paket eklerken Claude Code'a: "latest stable, exact version, pin et" talimatı
- Her sürüm yükseltmesi DECISIONS.md'ye kayıt (hangi bug fix için)
- Özel istisna: aktif geliştirme altındaki paketler (claude-api vb.) — haftalık update gerekebilir
**Ne zaman revize:** Geçerli değil, kalıcı kural.

---

## 2026-04-17 — Destructive işlem koruması (DB koruma disiplini)
**Ne:** Claude Code'a "yes / auto-approve" modu açılmayacak. Her destructive komut manuel onay gerektirecek. Haftalık Supabase snapshot. Production ve development ortamları ayrı.
**Neden:** Referans videodaki kullanıcının Supabase DB'si iki kez silindi çünkü "full access" modu açıktı. Bu kaçınılabilir bir hata. Kullanıcı datasının kaybı ürünün sonu olur.
**Detaylar:**
- Auto-approve mode kapalı
- Haftalık otomatik snapshot (Supabase Dashboard > Database > Backups)
- Önemli migration öncesi manuel snapshot
- Migration dosyaları: `supabase/migrations/YYYYMMDD-description.sql`
- Rollback dosyaları hazır
- V1 launch'ta ikinci Supabase project (production)
- Claude Code production'a direkt bağlanmayacak
- Prompt'larda destructive işlem uyarısı: "DROP, DELETE, TRUNCATE, rm -rf, force push yapacaksan önce sor"
**Ne zaman revize:** Geçerli değil, güvenlik kuralı.

---

## 2026-04-17 — Referans görsel kütüphanesi genişletildi
**Ne:** /refs klasörü için kaynak listesi genişletildi. Önceki 10 uygulama referansına ek olarak 7 referans sitesi eklendi: Mobbin, Dribbble, Figma Community, Page Flows, Refero, The U, UI Garage.
**Neden:** UI kalitesi referansa bakmakla doğru orantılı. Tek bir kaynak yetersiz, çoklu kaynak tasarım esneklik sağlar. Yaver'in ekranları için 5-10 referans ekran görüntüsü ideal.
**Detaylar:**
- /refs klasörü alt yapısı: onboarding/, dashboard/, detail-views/, forms/, empty-states/, animations/
- Her ekran başlangıcında Claude Code'a ilgili referansı göster
- Ücretli abonelik Mobbin'e değerli (opsiyonel)
**Ne zaman revize:** V1.5'te ders kitabı RAG eklenirken, referans kütüphanesi de zenginleşecek.

---

## 2026-04-16 — Supabase project ismi ve yapısı
**Ne:** Development Supabase project'i `yaver-v1-dev` adıyla açıldı (project ref: oelllamwceazolwpgavq). Region: EU. Migration dosyası çalıştırıldı, 13 tablo + RLS + triggerlar kurulu.
**Neden:** Spec K2 — eski Yaver projesini terk et, sıfırdan başla. Spec K7 — production ile dev ayrı. V1 launch'ta ikinci bir production project açılacak.
**Ne zaman revize:** V1 kullanıcılara açılacağında production project ayrılacak. O ana kadar bu project hem dev hem staging görevi görür.

---

## 2026-04-16 — "4 Ajan" gerçekte "4 Skill" olarak uygulanacak
**Ne:** DECISIONS.md'deki önceki kararda "4 ajan" yazıyordu. Claude Code'da custom agent type tanımlanamıyor — sadece skill tanımlanabiliyor. 4 "ajan" (UI Designer, UX Critic, Prompt Engineer, QA Tester), `.claude/skills/<isim>/SKILL.md` formatında skill dosyaları olarak yazılacak.
**Neden:** Claude Code'un gerçek mekanizması bu. Skill'ler `context: fork` frontmatter'ı ile izole subagent olarak çalışabiliyor — fonksiyonel olarak "ajan" gibi davranıyor. Terminoloji farkı, sonuç aynı.
**Ne zaman revize:** Claude Code yeni bir "custom agent type" mekanizması sunarsa migrate edilebilir.

---

## 2026-04-16 — Skill klasör yapısı ve öncelik sırası
**Ne:** Skill'ler `.claude/skills/` altında (proje kökü, git'e commit). Global (`~/.claude/skills/`) değil — Yaver'e özel kurallar başka projelere taşınmamalı.
Öncelik: yaver-ui-kit → ux-critic → ui-designer (Oturum 2, Hafta 1). prompt-engineer (Hafta 2), qa-tester + turk-mufredat + meb-evrak (ilgili haftalarda).
**Neden:** "Perfect is the enemy of done." Tüm 7 skill'i başta yazmak 2-3 gün kaybettirir. Sadece o anda lazım olanı yaz.
**Ne zaman revize:** Her skill ilgili haftada gerektiğinde eklenecek.

---

## 2026-04-16 — npm install caret sorunu — manuel düzeltme politikası
**Ne:** `npm install` her çalıştırmada package.json'a `^` prefix ekliyor (version pinning'i bozuyor). Çözüm: her `npm install` sonrası package.json Edit ile manuel düzeltilecek. Alternatif denenmedi (`.npmrc` ile `save-exact=true` — bir sonraki oturumda eklenebilir).
**Neden:** Spec K6 gereği exact version zorunlu. npm'in davranışı değiştirilemez, ancak `.npmrc` ile kontrol altına alınabilir.
**Ne zaman revize:** `.npmrc`'ye `save-exact=true` eklenirse bu problem otomatik çözülür. Oturum 2'de yapılabilir.

---

[Sonraki kararlar buradan devam...]
