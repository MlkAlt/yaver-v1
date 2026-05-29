// hifi-screens-b.jsx — Daily loop: Planım (Ray) + Hafta + Üretim + Çıktı
// Requires hifi-components.jsx

(function() {
const { useState } = React;

/* ══════════════════════════════════════════
   S6 — PLANIM (Var B — Ray Timeline)
══════════════════════════════════════════ */
const S6_Planum = () => {
  const weeks = [
    { w: 12, past: true,  label: 'Hafta 12', sub: '4 kazanım · tamamlandı',     k: 4 },
    { w: 13, past: true,  label: 'Hafta 13', sub: '3 kazanım · tamamlandı',     k: 3 },
    { w: 14, now: true,   label: 'Hafta 14', sub: '9-A, 9-B, 10-A',            k: 3,
      items: [
        { code: 'MAT.9.1.3', title: 'Üslü İfadeler',  cls: '9-A, 9-B', ready: false },
        { code: 'MAT.9.1.4', title: 'Köklü İfadeler', cls: '9-A, 9-B', ready: true,  origin: 'surprise' },
        { code: 'MAT.10.2.1',title: 'İkinci Derece Denklem', cls: '10-A', ready: false },
      ]
    },
    { w: 15, label: 'Hafta 15', sub: '4 kazanım', k: 4 },
    { w: 16, label: 'Hafta 16', sub: '3 kazanım', k: 3 },
    { w: 17, label: '···',      sub: '' },
  ];

  return (
    <HScreen navActive={0} style={{ height: 940, position: 'relative' }}>
      <HStatusBar />
      <HAppBar title="Planım" action="🔔" border={false} bg="transparent" />

      {/* Greeting */}
      <div style={{ padding: '4px 20px 16px' }}>
        <div style={{ fontSize: 13, color: 'var(--t2)', fontWeight: 500 }}>Salı, 22 Nisan 2025</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--t1)', marginTop: 2, letterSpacing: -.3 }}>
          Merhaba, Ayşe 👋
        </div>
      </div>

      {/* Today summary strip */}
      <div style={{ padding: '0 20px 16px' }}>
        <HCard style={{ padding: '14px 16px', background: 'var(--surface)', borderRadius: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div>
              <SLabel>BUGÜN</SLabel>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--t1)', marginTop: 3 }}>4 ders saati · Hafta 14</div>
            </div>
            <StatusBadge type="todo" />
          </div>
          <HDivider />
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 7 }}>
            {[
              { cls: '9-A · MAT.9.1.3', ready: false },
              { cls: '9-B · MAT.9.1.3', ready: true  },
              { cls: '10-A · MAT.10.2.1', ready: false },
            ].map((d, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--t2)', fontWeight: 500 }}>{d.cls}</span>
                <StatusBadge type={d.ready ? 'ready' : 'todo'} />
              </div>
            ))}
          </div>
        </HCard>
      </div>

      {/* Ray timeline */}
      <SLabel style={{ padding: '0 20px 10px' }}>YIL RAYI</SLabel>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 90px' }} className="hf-scroll">
        {weeks.map((wk, i) => (
          <div key={wk.w} style={{ display: 'flex', gap: 0 }}>
            {/* Rail */}
            <div style={{ width: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <div style={{
                width: wk.now ? 20 : 14, height: wk.now ? 20 : 14,
                borderRadius: '50%', marginTop: 2,
                background: wk.past ? 'var(--border)' : wk.now ? 'var(--orange)' : 'var(--surface)',
                border: wk.now ? 'none' : wk.past ? 'none' : '2.5px solid var(--border)',
                boxShadow: wk.now ? '0 0 0 4px var(--orange-lt)' : 'none',
                flexShrink: 0, zIndex: 1,
                transition: 'all .2s'
              }} />
              {i < weeks.length - 1 && (
                <div style={{
                  width: 2, flex: 1, minHeight: 24,
                  background: wk.past ? 'var(--border)' : wk.now ? 'linear-gradient(var(--orange), var(--border))' : 'var(--border)',
                  marginTop: 4
                }} />
              )}
            </div>

            {/* Content */}
            <div style={{ flex: 1, paddingLeft: 12, paddingBottom: wk.now ? 20 : 16 }}>
              {wk.now ? (
                /* EXPANDED current week */
                <HCard style={{
                  borderRadius: 18, padding: 0, overflow: 'hidden',
                  border: '2px solid var(--orange)',
                  boxShadow: '0 4px 24px rgba(229,99,26,.12)'
                }}>
                  {/* Card header */}
                  <div style={{
                    background: 'var(--orange)', padding: '10px 14px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', letterSpacing: -.2 }}>Hafta 14 · Şu an</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,.75)', marginTop: 1 }}>21–25 Nisan · {wk.sub}</div>
                    </div>
                    <div style={{
                      background: 'rgba(255,255,255,.2)', borderRadius: 100,
                      padding: '4px 10px', fontSize: 11, color: '#fff', fontWeight: 700
                    }}>● ŞU AN</div>
                  </div>
                  {/* Kazanımlar */}
                  <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {wk.items.map(item => (
                      <div key={item.code} style={{
                        borderRadius: 12, overflow: 'hidden',
                        background: item.ready ? 'var(--green-lt)' : 'var(--bg)',
                        border: item.ready ? '1px solid var(--green)' : '1.5px solid var(--border)',
                        padding: '10px 12px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 600, letterSpacing: .05 }}>{item.code} · {item.cls}</div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)', marginTop: 2 }}>{item.title}</div>
                          </div>
                          <StatusBadge type={item.ready ? (item.origin === 'surprise' ? 'surprise' : 'ready') : 'todo'} />
                        </div>
                        {!item.ready && (
                          <HBtn variant="orange" small style={{ marginTop: 10, fontSize: 13 }}>
                            Benim yerime hazırla →
                          </HBtn>
                        )}
                      </div>
                    ))}
                  </div>
                </HCard>
              ) : (
                /* Collapsed week */
                <div style={{ paddingTop: 0, paddingBottom: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: wk.past ? 500 : 600, color: wk.past ? 'var(--t3)' : 'var(--t2)' }}>
                        {wk.label}
                      </div>
                      {wk.sub && <div style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 400, marginTop: 1 }}>{wk.sub}</div>}
                    </div>
                    {wk.k && !wk.past && (
                      <div style={{
                        fontSize: 11, color: 'var(--t3)', fontWeight: 500,
                        background: 'var(--surface)', border: '1px solid var(--border)',
                        borderRadius: 100, padding: '3px 10px'
                      }}>{wk.k} kazanım</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <HFab />
    </HScreen>
  );
};

/* ══════════════════════════════════════════
   S7 — HAFTA DETAYI
══════════════════════════════════════════ */
const S7_Hafta = () => {
  const groups = [
    { cls: '9-A / 9-B', items: [
      { code: 'MAT.9.1.3', title: 'Üslü İfadeler',  ready: false },
      { code: 'MAT.9.1.4', title: 'Köklü İfadeler', ready: true, origin: 'surprise',
        detail: '10 soru · Karışık zorluk · ✨ Sürpriz' },
    ]},
    { cls: '10-A', items: [
      { code: 'MAT.10.2.1', title: 'İkinci Dereceden Denklemler', ready: false },
    ]},
  ];
  return (
    <HScreen navActive={0} bg="var(--surface)" style={{ height: 900 }}>
      <HStatusBar />
      <HAppBar back title="Hafta 14" action="···" />
      <div style={{ padding: '10px 20px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 100, padding: '4px 12px', fontSize: 12, fontWeight: 600, color: 'var(--t2)' }}>📅 21–25 Nisan</div>
        <StatusBadge type="todo" />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 20 }} className="hf-scroll">
        {groups.map(g => (
          <div key={g.cls}>
            <SLabel style={{ marginBottom: 10 }}>{g.cls}</SLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {g.items.map(item => (
                <HCard key={item.code} noBorder style={{
                  borderRadius: 18, padding: 0, overflow: 'hidden',
                  border: item.ready ? '1.5px solid var(--green)' : '2px solid var(--orange)',
                }}>
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <div>
                        <div style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 600, letterSpacing: .05 }}>{item.code}</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--t1)', marginTop: 3 }}>{item.title}</div>
                      </div>
                      <StatusBadge type={item.ready ? (item.origin === 'surprise' ? 'surprise' : 'ready') : 'todo'} />
                    </div>
                    {item.detail && (
                      <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--t2)', fontWeight: 500 }}>
                        {item.detail}
                      </div>
                    )}
                    {!item.ready && (
                      <HBtn variant="orange" style={{ marginTop: 12, fontSize: 14, padding: '12px 20px' }}>
                        Benim yerime hazırla →
                      </HBtn>
                    )}
                  </div>
                </HCard>
              ))}
            </div>
          </div>
        ))}

        {/* Bulk action */}
        <HCard tinted noBorder style={{ borderRadius: 18, textAlign: 'center', padding: '16px', cursor: 'pointer' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)' }}>☑ Bu haftayı toplu hazırla</div>
          <div style={{ fontSize: 12, color: 'var(--t2)', marginTop: 4 }}>3 kazanım için ayrı ayrı içerik seti</div>
        </HCard>
      </div>
    </HScreen>
  );
};

/* ══════════════════════════════════════════
   S8 — ÜRETİM EKRANI
══════════════════════════════════════════ */
const S8_Uretim = () => {
  const [tipSel, setTipSel] = useState('Sorular');
  const [sayi, setSayi] = useState(10);
  const [zorluk, setZorluk] = useState('Karışık');
  const types = [
    { t: 'Sorular',         s: 'Test / açık uç'      },
    { t: 'Etkinlik',        s: 'Sınıf aktivitesi'    },
    { t: 'Ders Planı',      s: 'Kazanım bazlı'       },
    { t: 'Çalışma Yaprağı', s: 'Bireysel çalışma'    },
  ];
  return (
    <HScreen navActive={0} bg="var(--surface)" style={{ height: 940 }}>
      <HStatusBar />
      <HAppBar back title="Benim yerime hazırla" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 28px', display: 'flex', flexDirection: 'column', gap: 16 }} className="hf-scroll">

        {/* Context card */}
        <HCard style={{ background: 'var(--orange-lt)', borderRadius: 18, border: 'none', boxShadow: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <SLabel>BAĞLAM</SLabel>
            <span style={{ fontSize: 12, color: 'var(--orange)', fontWeight: 700, cursor: 'pointer' }}>✏ Düzenle</span>
          </div>
          {[
            ['Kazanım', 'MAT.9.1.3 · Üslü İfadeler'],
            ['Sınıf',   '9-A, 9-B'],
            ['Süre',    '40 dk'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(229,99,26,.12)' }}>
              <span style={{ fontSize: 13, color: 'var(--t2)', fontWeight: 500 }}>{k}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>{v}</span>
            </div>
          ))}
        </HCard>

        {/* Type selector */}
        <div>
          <SLabel style={{ marginBottom: 10 }}>NE HAZIRLANSIN?</SLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {types.map(tp => {
              const sel = tp.t === tipSel;
              return (
                <div key={tp.t} onClick={() => setTipSel(tp.t)} style={{
                  background: sel ? 'var(--t1)' : 'var(--bg)',
                  borderRadius: 16, padding: '16px 14px', cursor: 'pointer',
                  border: sel ? 'none' : '1.5px solid var(--border)',
                  transition: 'all .15s',
                }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: sel ? '#fff' : 'var(--t1)' }}>{tp.t}</div>
                  <div style={{ fontSize: 12, color: sel ? 'rgba(255,255,255,.6)' : 'var(--t3)', marginTop: 3 }}>{tp.s}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Settings */}
        {tipSel === 'Sorular' && (
          <HCard noBorder style={{ borderRadius: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t2)', marginBottom: 8 }}>Soru sayısı</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[5, 10, 15, 20].map(n => (
                  <HChip key={n} active={n === sayi} onClick={() => setSayi(n)}>{n}</HChip>
                ))}
              </div>
            </div>
            <HDivider />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t2)', marginBottom: 8 }}>Zorluk</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {['Kolay', 'Karışık', 'Zor'].map(z => (
                  <HChip key={z} active={z === zorluk} onClick={() => setZorluk(z)}>{z}</HChip>
                ))}
              </div>
            </div>
            <HDivider />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t2)', marginBottom: 8 }}>Soru tipi</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['Çoktan Seçmeli', 'Açık Uçlu', 'Karışık'].map(z => (
                  <HChip key={z} active={z === 'Karışık'} style={{ fontSize: 12 }}>{z}</HChip>
                ))}
              </div>
            </div>
          </HCard>
        )}

        <HBtn style={{ fontSize: 17 }}>Benim yerime hazırla →</HBtn>
      </div>
    </HScreen>
  );
};

/* ══════════════════════════════════════════
   S9 — ÇIKTI ÖNİZLEME
══════════════════════════════════════════ */
const S9_Cikti = () => {
  const [liked, setLiked] = useState(null);
  return (
    <HScreen navActive={0} bg="var(--surface)" style={{ height: 920 }}>
      <HStatusBar />
      <HAppBar back title="Çıktı Önizleme" action="⋮" />

      <div style={{ padding: '10px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 600, letterSpacing: .06 }}>MAT.9.1.3 · Sorular · 9-A, 9-B</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--t1)', marginTop: 2, letterSpacing: -.2 }}>Üslü İfadeler — 10 Soru</div>
        </div>
        <div style={{ background: 'var(--green-lt)', color: 'var(--green)', borderRadius: 100, padding: '4px 12px', fontSize: 11, fontWeight: 700 }}>Hafta 14</div>
      </div>

      {/* Content preview */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 12 }} className="hf-scroll">
        <HCard noBorder style={{ borderRadius: 18, padding: '16px' }}>
          {[1, 2, 3].map(q => (
            <div key={q} style={{ marginBottom: q < 3 ? 18 : 0, paddingBottom: q < 3 ? 18 : 0, borderBottom: q < 3 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)', marginBottom: 8 }}>Soru {q}.</div>
              <div style={{
                height: 20, background: 'var(--bg)', borderRadius: 6,
                marginBottom: 10, width: `${70 + q * 8}%`
              }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {['A', 'B', 'C', 'D'].map(o => (
                  <div key={o} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', border: '1.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--t3)', flexShrink: 0 }}>{o}</div>
                    <div style={{ height: 14, background: 'var(--bg)', borderRadius: 4, flex: 1, opacity: .8 }} />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div style={{ textAlign: 'center', paddingTop: 12, fontSize: 12, color: 'var(--t3)', fontWeight: 500 }}>
            … 7 soru daha ↓
          </div>
        </HCard>

        {/* Snackbar */}
        <div style={{
          background: 'var(--t1)', color: '#fff', borderRadius: 14,
          padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>✓ Plana kaydedildi — Hafta 14</div>
          <div style={{ fontSize: 12, color: 'var(--orange)', fontWeight: 700, cursor: 'pointer' }}>GÖR</div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <HBtn variant="outline" style={{ flex: 1, padding: '12px', fontSize: 14 }}>↻ Yeniden</HBtn>
          <HBtn variant="outline" style={{ flex: 1, padding: '12px', fontSize: 14 }}>✏ Düzenle</HBtn>
          <HBtn variant="primary" style={{ flex: 1, padding: '12px', fontSize: 14 }}>⬇ İndir</HBtn>
        </div>

        {/* Feedback */}
        <div style={{ textAlign: 'center' }}>
          <SLabel style={{ marginBottom: 10 }}>NASIL BULDUN?</SLabel>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            {[
              { emoji: '😊', label: 'Çok güzel', val: 'great' },
              { emoji: '👍', label: 'İyiydi',    val: 'ok'    },
              { emoji: '👎', label: 'Beğenmedim',val: 'bad'   },
            ].map(f => (
              <div key={f.val} onClick={() => setLiked(f.val)} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                cursor: 'pointer', padding: '10px 14px', borderRadius: 14,
                background: liked === f.val ? 'var(--orange-lt)' : 'var(--bg)',
                border: liked === f.val ? '1.5px solid var(--orange)' : '1.5px solid var(--border)',
                transition: 'all .15s', minWidth: 74
              }}>
                <span style={{ fontSize: 22 }}>{f.emoji}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: liked === f.val ? 'var(--orange)' : 'var(--t2)' }}>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </HScreen>
  );
};

Object.assign(window, { S6_Planum, S7_Hafta, S8_Uretim, S9_Cikti });
})();
