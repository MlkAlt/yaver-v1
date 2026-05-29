// hifi-screens-c.jsx — Sürpriz + Evraklarım + Ders İçin
// Requires hifi-components.jsx

(function() {
const { useState } = React;

/* ══════════════════════════════════════════
   S10 — SÜRPRİZ HAZIRLIK
══════════════════════════════════════════ */
const S10_Surpriz = () => {
  const [liked, setLiked] = useState({ 0: true, 2: true });
  const [allLiked, setAllLiked] = useState(false);

  const cards = [
    { t: 'Sorular',         s: '10 çoktan seçmeli · Karışık zorluk', icon: '📝' },
    { t: 'Etkinlik',        s: 'Çift çalışma · 20 dk · Etkileşimli', icon: '🎯' },
    { t: 'Ders Planı',      s: '3 aşamalı · Giriş + Gelişme + Sonuç', icon: '📋' },
    { t: 'Çalışma Yaprağı', s: 'Bireysel · 15 alıştırma',            icon: '📄' },
  ];

  return (
    <HScreen navActive={0} style={{ height: 980 }}>
      <HStatusBar />
      <HAppBar back title="Sürpriz Hazırlıklar ✨" border={false} bg="transparent" />

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 28px', display: 'flex', flexDirection: 'column', gap: 14 }} className="hf-scroll">
        {/* Push notification card */}
        <HCard noBorder style={{
          background: 'var(--surface)', borderRadius: 18,
          padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, background: 'var(--t1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, flexShrink: 0
          }}>Y</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--t1)' }}>Yaver · bildirim</div>
            <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.4, marginTop: 3, fontStyle: 'italic' }}>
              "9-A için yarın üslü ifadeler var. Senin için hazırladım, bir bak."
            </div>
          </div>
        </HCard>

        {/* Context */}
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)' }}>9-A · Yarın · MAT.9.1.3</div>
          <div style={{ fontSize: 13, color: 'var(--t2)', marginTop: 2 }}>Üslü İfadeler — 4 materyal hazırladım</div>
        </div>

        {/* Content cards */}
        {cards.map((card, i) => {
          const isLiked = liked[i] || allLiked;
          return (
            <HCard key={i} noBorder style={{
              borderRadius: 18, padding: '14px 16px',
              border: isLiked ? '1.5px solid var(--green)' : '1.5px solid var(--border)',
              background: isLiked ? 'var(--green-lt)' : 'var(--surface)',
              transition: 'all .2s'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: isLiked ? 'var(--green)' : 'var(--bg)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, transition: 'all .2s'
                  }}>{card.icon}</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)' }}>{card.t}</div>
                    <div style={{ fontSize: 12, color: 'var(--t2)', marginTop: 1 }}>{card.s}</div>
                  </div>
                </div>
                {isLiked && (
                  <div style={{ background: 'var(--green)', color: '#fff', borderRadius: 100, padding: '4px 10px', fontSize: 11, fontWeight: 700 }}>✓</div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <HBtn variant="outline" small style={{ flex: 1, fontSize: 13 }}>Önizle</HBtn>
                <HBtn
                  variant={isLiked ? 'outline' : 'primary'}
                  small
                  style={{ flex: 1, fontSize: 13, opacity: isLiked ? .5 : 1 }}
                  onClick={() => setLiked(prev => ({ ...prev, [i]: true }))}
                >
                  {isLiked ? '✓ Beğendim' : 'Beğendim ✓'}
                </HBtn>
                <HBtn variant="outline" small style={{ padding: '8px 14px', fontSize: 13 }}>↻</HBtn>
              </div>
            </HCard>
          );
        })}

        {/* Bulk action */}
        <HBtn onClick={() => setAllLiked(true)} style={{ fontSize: 16 }}>
          {allLiked ? '✓ Hepsi plana kaydedildi' : 'Hepsini beğendim → Plana kaydet'}
        </HBtn>

        {/* Feedback */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 4 }}>
          {['😊', '👍', '👎'].map(f => (
            <div key={f} style={{
              width: 48, height: 48, borderRadius: 14, background: 'var(--surface)',
              border: '1.5px solid var(--border)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 22, cursor: 'pointer'
            }}>{f}</div>
          ))}
        </div>
      </div>
    </HScreen>
  );
};

/* ══════════════════════════════════════════
   S11 — EVRAKLARIM
══════════════════════════════════════════ */
const S11_Evrak = () => {
  const templates = [
    { t: 'Zümre Tutanağı',  icon: '📋', hot: true  },
    { t: 'ŞÖK Belgesi',     icon: '📑', hot: false },
    { t: 'Dilekçe',         icon: '✉️', hot: true  },
    { t: 'Sınav Analizi',   icon: '📊', hot: false },
    { t: 'Ders Planı',      icon: '📓', hot: false },
    { t: 'Diğer…',          icon: '➕', hot: false },
  ];
  const history = [
    { t: 'Zümre Toplantı Tutanağı', d: '14 Nisan 2025', tag: 'Zümre'  },
    { t: 'Dilekçe — İzin Talebi',   d: '2 Nisan 2025',  tag: 'Dilekçe' },
  ];
  return (
    <HScreen navActive={2} bg="var(--surface)" style={{ height: 880 }}>
      <HStatusBar />
      <HAppBar title="Evraklarım" action="🔍" />
      <div style={{ flex: 1, overflowY: 'auto' }} className="hf-scroll">
        <SLabel style={{ padding: '12px 20px 10px' }}>HAZIR ŞABLONLAR</SLabel>
        <div style={{ padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {templates.map(t => (
            <HCard key={t.t} noBorder style={{
              borderRadius: 18, padding: '16px', cursor: 'pointer', textAlign: 'center',
              background: t.hot ? 'var(--orange-lt)' : 'var(--bg)',
              border: t.hot ? '1.5px solid var(--orange-md)' : '1.5px solid var(--border)',
              position: 'relative'
            }}>
              {t.hot && (
                <div style={{
                  position: 'absolute', top: 10, right: 10,
                  background: 'var(--orange)', color: '#fff',
                  borderRadius: 100, padding: '2px 8px', fontSize: 9, fontWeight: 800
                }}>YENİ</div>
              )}
              <div style={{ fontSize: 28, marginBottom: 8 }}>{t.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', lineHeight: 1.3 }}>{t.t}</div>
            </HCard>
          ))}
        </div>

        <SLabel style={{ padding: '20px 20px 10px' }}>GEÇMİŞ EVRAKLAR</SLabel>
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {history.map(ev => (
            <HCard key={ev.t} noBorder style={{ borderRadius: 18, padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>{ev.t}</div>
                  <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 2 }}>{ev.d}</div>
                </div>
                <div style={{
                  background: 'var(--bg)', border: '1px solid var(--border)',
                  borderRadius: 100, padding: '4px 10px', fontSize: 11, fontWeight: 600, color: 'var(--t2)'
                }}>{ev.tag}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <HBtn variant="outline" small style={{ flex: 1 }}>Görüntüle</HBtn>
                <HBtn variant="outline" small style={{ flex: 1 }}>⬇ İndir</HBtn>
              </div>
            </HCard>
          ))}
          {/* Empty state */}
          <HCard tinted noBorder style={{ borderRadius: 18, textAlign: 'center', padding: '20px 16px' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>Zümre toplantısı yaklaşıyor mu?</div>
            <div style={{ fontSize: 12, color: 'var(--t2)', marginTop: 4, lineHeight: 1.5 }}>İlk evrakın için yukarıdan şablon seç</div>
          </HCard>
        </div>
        <div style={{ height: 20 }} />
      </div>
    </HScreen>
  );
};

/* ══════════════════════════════════════════
   S13 — DERS İÇİN (ARŞİV)
══════════════════════════════════════════ */
const S13_DersIcin = () => {
  const [filter, setFilter] = useState('Tümü');
  const filters = ['Tümü', 'Sorular', 'Etkinlik', 'Ders Planı', 'Çalışma Yaprağı'];

  const originBadge = {
    '🖐 Manuel':  { bg: 'var(--bg)', color: 'var(--t2)' },
    '✨ Sürpriz': { bg: 'oklch(96% 0.05 300)', color: 'oklch(55% 0.18 300)' },
    '🌙 Otomatik':{ bg: 'oklch(96% 0.04 240)', color: 'oklch(52% 0.14 240)' },
  };

  const groups = [
    { g: 'Bu hafta', items: [
      { t: 'Üslü İfadeler — 10 Soru',        s: 'MAT.9.1.3 · 9-A, 9-B', o: '✨ Sürpriz',  d: 'Bugün', type: 'Sorular'   },
      { t: 'Ders Planı — Üslü İfadeler',      s: 'MAT.9.1.3 · 9-A',      o: '🖐 Manuel',   d: 'Dün',   type: 'Ders Planı'},
    ]},
    { g: 'Geçen hafta', items: [
      { t: 'Köklü İfadeler Çalışma Yaprağı',  s: 'MAT.9.1.2 · 9-A, 9-B', o: '🌙 Otomatik', d: '15 Nis', type: 'Çalışma Yaprağı' },
      { t: 'Fonksiyonlar Test',                s: 'MAT.10.1.4 · 10-A',     o: '🖐 Manuel',   d: '14 Nis', type: 'Sorular' },
    ]},
  ];

  const filtered = filter === 'Tümü' ? groups : groups.map(g => ({
    ...g, items: g.items.filter(i => i.type === filter)
  })).filter(g => g.items.length > 0);

  return (
    <HScreen navActive={1} style={{ height: 960, position: 'relative' }}>
      <HStatusBar />
      <HAppBar title="Ders İçin" action="🔍" border={false} bg="transparent" />

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 8, padding: '0 20px 14px', overflowX: 'auto' }} className="hf-scroll">
        {filters.map(f => (
          <HChip key={f} active={f === filter} onClick={() => setFilter(f)} style={{ flexShrink: 0 }}>{f}</HChip>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 90px' }} className="hf-scroll">
        {filtered.map(gr => (
          <div key={gr.g} style={{ marginBottom: 20 }}>
            <SLabel style={{ marginBottom: 10 }}>{gr.g}</SLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {gr.items.map(item => {
                const ob = originBadge[item.o];
                return (
                  <HCard key={item.t} noBorder style={{ borderRadius: 18, padding: '14px 16px', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)', lineHeight: 1.3 }}>{item.t}</div>
                        <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 2 }}>{item.s}</div>
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 500, flexShrink: 0, marginLeft: 8 }}>{item.d}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{
                        background: ob.bg, color: ob.color,
                        borderRadius: 100, padding: '4px 10px', fontSize: 11, fontWeight: 700
                      }}>{item.o}</div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <HBtn variant="outline" small style={{ fontSize: 12 }}>Görüntüle</HBtn>
                        <HBtn variant="outline" small style={{ fontSize: 12, padding: '8px 12px' }}>⬇</HBtn>
                      </div>
                    </div>
                  </HCard>
                );
              })}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 40 }}>📭</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)' }}>Henüz {filter.toLowerCase()} yok</div>
            <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.5 }}>
              Plana git, bir kazanıma<br />"Benim yerime hazırla" de.
            </div>
          </div>
        )}
      </div>
      <HFab />
    </HScreen>
  );
};

/* ══════════════════════════════════════════
   S12 — ŞABLON DOLDURMA
══════════════════════════════════════════ */
const S12_Sablon = () => {
  const autoFields = [
    { l: 'Okul Adı',     v: 'Atatürk Anadolu Lisesi', auto: true  },
    { l: 'Tarih',        v: '22 Nisan 2025',           auto: true  },
    { l: 'Tutanak No',   v: '2025/04-003',             auto: true  },
    { l: 'Branş',        v: 'Matematik',               auto: true  },
    { l: 'Toplantı Yeri',v: 'Öğretmenler Odası',       auto: false },
  ];
  return (
    <HScreen navActive={2} bg="var(--surface)" style={{ height: 900 }}>
      <HStatusBar />
      <HAppBar back title="Zümre Toplantı Tutanağı" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 28px', display: 'flex', flexDirection: 'column', gap: 14 }} className="hf-scroll">

        {/* Auto-filled card */}
        <HCard style={{ background: 'var(--orange-lt)', borderRadius: 18, border: 'none', boxShadow: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <SLabel>GENEL BİLGİLER</SLabel>
            <div style={{ fontSize: 11, color: 'var(--orange)', fontWeight: 700, background: 'var(--orange-md)', borderRadius: 100, padding: '3px 10px' }}>
              ● Otomatik dolu
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {autoFields.map(f => (
              <div key={f.l}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--t3)', marginBottom: 4, letterSpacing: '.04em' }}>{f.l}</div>
                <div style={{
                  background: f.auto ? 'rgba(255,255,255,.6)' : 'var(--surface)',
                  borderRadius: 12, padding: '11px 14px',
                  border: f.auto ? '1px solid rgba(229,99,26,.15)' : '1.5px solid var(--border)',
                  fontSize: 14, fontWeight: f.auto ? 600 : 400,
                  color: f.auto ? 'var(--t1)' : 'var(--t3)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <span>{f.auto ? f.v : f.l + '…'}</span>
                  {f.auto && <span style={{ fontSize: 10, color: 'var(--orange)', fontWeight: 700 }}>oto</span>}
                </div>
              </div>
            ))}
          </div>
        </HCard>

        {/* Manual fields */}
        <HCard noBorder style={{ borderRadius: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <SLabel>TOPLANTI İÇERİĞİ</SLabel>
          {[
            { l: 'Gündem Maddeleri', placeholder: '1. Dönem değerlendirmesi\n2. Sınav takvimi…', rows: 3 },
            { l: 'Alınan Kararlar',  placeholder: 'Ortak sınav 5 Mayıs\'ta yapılacak…',          rows: 3 },
            { l: 'Katılımcılar',     placeholder: 'Ahmet Yılmaz, Zeynep Kaya…',                  rows: 2 },
          ].map(f => (
            <div key={f.l}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--t2)', marginBottom: 6 }}>{f.l}</div>
              <div style={{
                background: 'var(--bg)', borderRadius: 12, padding: '12px 14px',
                border: '1.5px solid var(--border)', minHeight: f.rows * 32,
                fontSize: 13, color: 'var(--t3)', lineHeight: 1.5, fontStyle: 'italic'
              }}>{f.placeholder}</div>
            </div>
          ))}
        </HCard>

        {/* Signature row */}
        <HCard noBorder style={{ borderRadius: 18 }}>
          <SLabel style={{ marginBottom: 10 }}>İMZALAR</SLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {['Zümre Başkanı', 'Okul Müdürü'].map(r => (
              <div key={r} style={{ textAlign: 'center' }}>
                <div style={{ height: 48, borderBottom: '1.5px solid var(--border)', marginBottom: 6 }} />
                <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 500 }}>{r}</div>
              </div>
            ))}
          </div>
        </HCard>

        <HBtn style={{ fontSize: 17 }}>Evrakı oluştur →</HBtn>
      </div>
    </HScreen>
  );
};

Object.assign(window, { S10_Surpriz, S11_Evrak, S12_Sablon, S13_DersIcin });
})();
