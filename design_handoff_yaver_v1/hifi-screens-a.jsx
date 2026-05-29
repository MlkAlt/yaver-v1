// hifi-screens-a.jsx — Onboarding + Wow Moment screens
// Requires hifi-components.jsx loaded first

(function() {
const { useState, useEffect } = React;

/* ══════════════════════════════════════════
   S1 — WELCOME
══════════════════════════════════════════ */
const S1_Welcome = () => (
  <HScreen nav={false} style={{ height: 844 }}>
    <HStatusBar />
    {/* Hero area */}
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 28px 40px' }}>
      {/* Brand mark */}
      <div style={{ paddingTop: 32, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 12, background: 'var(--t1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 20, fontWeight: 800
        }}>Y</div>
        <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--t1)', letterSpacing: -.3 }}>Yaver</span>
      </div>

      {/* Illustration */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 0' }}>
        <div style={{
          width: 280, height: 260,
          background: 'linear-gradient(145deg, var(--orange-lt) 0%, oklch(96% 0.04 120) 100%)',
          borderRadius: 32, position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 12
        }}>
          {/* Abstract shapes */}
          <div style={{ position: 'absolute', top: 24, right: 24, width: 48, height: 48, borderRadius: '50%', background: 'var(--orange-md)', opacity: .6 }} />
          <div style={{ position: 'absolute', bottom: 32, left: 28, width: 32, height: 32, borderRadius: 8, background: 'var(--orange)', opacity: .3, transform: 'rotate(15deg)' }} />
          <div style={{ position: 'absolute', top: 60, left: 20, width: 20, height: 20, borderRadius: '50%', background: 'var(--green)', opacity: .5 }} />
          {/* Center icon */}
          <div style={{ width: 80, height: 80, borderRadius: 24, background: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>✦</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t2)', fontStyle: 'italic' }}>[ öğretmen illüstrasyonu ]</div>
        </div>
      </div>

      {/* Copy */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
        <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--t1)', lineHeight: 1.2, letterSpacing: -.5 }}>
          Merhaba,<br />
          <span style={{ color: 'var(--orange)' }}>öğretmenim.</span>
        </div>
        <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--t2)', lineHeight: 1.5, marginTop: 4 }}>
          Haftalık ders hazırlığını bitiren asistanın artık burada.
        </div>
      </div>

      {/* CTAs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <HBtn>Başlayalım →</HBtn>
        <HBtn variant="ghost" style={{ fontSize: 14 }}>Zaten hesabım var — Giriş yap</HBtn>
      </div>
    </div>
  </HScreen>
);

/* ══════════════════════════════════════════
   S2 — BRANŞ SEÇİMİ
══════════════════════════════════════════ */
const S2_Brans = () => {
  const [selected, setSelected] = useState('Matematik');
  const subjects = [
    { name: 'Matematik', icon: '∑' },
    { name: 'Türkçe',    icon: 'Aa' },
    { name: 'Fen Bil.',  icon: '⚗' },
    { name: 'Tarih',     icon: '⌛' },
    { name: 'Coğrafya',  icon: '🗺' },
    { name: 'Fizik',     icon: '⚛' },
    { name: 'Kimya',     icon: '⚗' },
    { name: 'Biyoloji',  icon: '🌿' },
    { name: 'İngilizce', icon: 'En' },
  ];
  return (
    <HScreen nav={false} bg="var(--surface)" style={{ height: 844 }}>
      <HStatusBar />
      <HProgress value={25} />
      <div style={{ padding: '20px 20px 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <SLabel>Adım 1 / 4</SLabel>
        <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--t1)', marginTop: 8, lineHeight: 1.2, letterSpacing: -.3 }}>
          Hangi branşı<br />öğretiyorsun?
        </div>
      </div>
      {/* Search */}
      <div style={{ padding: '16px 20px 8px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'var(--bg)', borderRadius: 14,
          padding: '12px 16px', border: '1.5px solid var(--border)'
        }}>
          <span style={{ color: 'var(--t3)', fontSize: 16 }}>🔍</span>
          <span style={{ fontSize: 14, color: 'var(--t3)', fontWeight: 500 }}>Ara…</span>
        </div>
      </div>
      {/* Grid */}
      <div style={{ flex: 1, padding: '0 20px', overflowY: 'auto' }} className="hf-scroll">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {subjects.map(s => {
            const isSel = s.name === selected;
            return (
              <div key={s.name} onClick={() => setSelected(s.name)} style={{
                background: isSel ? 'var(--orange-lt)' : 'var(--bg)',
                borderRadius: 16, padding: '16px 8px',
                border: isSel ? '2px solid var(--orange)' : '1.5px solid var(--border)',
                textAlign: 'center', cursor: 'pointer',
                transition: 'all .15s'
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, margin: '0 auto 8px',
                  background: isSel ? 'var(--orange)' : 'var(--surface)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, fontWeight: 800,
                  color: isSel ? '#fff' : 'var(--t2)',
                  boxShadow: isSel ? '0 4px 12px rgba(229,99,26,.3)' : 'var(--shd)'
                }}>{s.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: isSel ? 'var(--orange)' : 'var(--t2)', lineHeight: 1.2 }}>{s.name}</div>
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: 'center', padding: '16px 0 4px', fontSize: 12, color: 'var(--t3)', fontWeight: 500 }}>
          + 24 branş daha
        </div>
      </div>
      <div style={{ padding: '12px 20px 28px' }}>
        <HBtn>Devam →</HBtn>
      </div>
    </HScreen>
  );
};

/* ══════════════════════════════════════════
   S3 — SINIF SEÇİMİ
══════════════════════════════════════════ */
const S3_Sinif = () => {
  const [sel, setSel] = useState([9, 10]);
  const toggle = (c) => setSel(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  return (
    <HScreen nav={false} bg="var(--surface)" style={{ height: 844 }}>
      <HStatusBar />
      <HProgress value={50} />
      <div style={{ padding: '20px 20px 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <SLabel>Adım 2 / 4</SLabel>
        <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--t1)', marginTop: 8, lineHeight: 1.2, letterSpacing: -.3 }}>
          Hangi sınıflara<br />giriyorsun?
        </div>
        <div style={{ fontSize: 14, color: 'var(--t2)', marginTop: 4 }}>Birden fazla seçebilirsin</div>
      </div>
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Shortcut */}
        <div style={{
          border: '1.5px dashed var(--orange)', borderRadius: 14,
          padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12,
          background: 'var(--orange-lt)', cursor: 'pointer'
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'var(--orange)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 14, color: '#fff', flexShrink: 0
          }}>☑</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)' }}>Hepsine giriyorum</div>
            <div style={{ fontSize: 12, color: 'var(--t2)' }}>9, 10, 11 ve 12. sınıflar seçilir</div>
          </div>
        </div>
        {/* Class grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[9, 10, 11, 12].map(c => {
            const isSel = sel.includes(c);
            return (
              <div key={c} onClick={() => toggle(c)} style={{
                background: isSel ? 'var(--orange-lt)' : 'var(--bg)',
                border: isSel ? '2px solid var(--orange)' : '1.5px solid var(--border)',
                borderRadius: 18, padding: '24px 16px', textAlign: 'center', cursor: 'pointer',
                transition: 'all .15s', position: 'relative'
              }}>
                {isSel && (
                  <div style={{
                    position: 'absolute', top: 12, right: 12,
                    width: 22, height: 22, borderRadius: '50%',
                    background: 'var(--orange)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 12, color: '#fff', fontWeight: 700
                  }}>✓</div>
                )}
                <div style={{ fontSize: 28, fontWeight: 800, color: isSel ? 'var(--orange)' : 'var(--t1)' }}>{c}.</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: isSel ? 'var(--orange)' : 'var(--t2)', marginTop: 2 }}>Sınıf</div>
              </div>
            );
          })}
        </div>
        {/* Branch inputs */}
        {sel.length > 0 && (
          <div>
            <SLabel style={{ marginBottom: 8 }}>Şube bilgisi (opsiyonel)</SLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {sel.sort().map(c => (
                <div key={c} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: 'var(--bg)', borderRadius: 12, padding: '12px 16px',
                  border: '1.5px solid var(--border)'
                }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--orange-lt)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: 'var(--orange)', flexShrink: 0 }}>{c}</div>
                  <span style={{ fontSize: 14, color: 'var(--t3)', fontWeight: 500 }}>{c}-A, {c}-B, {c}-C…</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div style={{ padding: '4px 20px 28px', marginTop: 'auto' }}>
        <HBtn style={{ fontSize: 17 }}>Yılımı kur ✨</HBtn>
      </div>
    </HScreen>
  );
};

/* ══════════════════════════════════════════
   S4 — LOADING
══════════════════════════════════════════ */
const S4_Loading = () => {
  const [step, setStep] = useState(2);
  useEffect(() => {
    const t = setInterval(() => setStep(s => Math.min(s + 1, 4)), 1100);
    return () => clearInterval(t);
  }, []);
  const steps = [
    'MEB takvimi yükleniyor',
    'Kazanımlar eşleştiriliyor',
    'Haftalara dağıtılıyor',
    'Tatiller işaretleniyor',
  ];
  return (
    <HScreen nav={false} style={{ height: 844 }}>
      <HStatusBar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 28px', gap: 40 }}>
        {/* Animation area */}
        <div style={{
          width: 200, height: 200, borderRadius: 32,
          background: 'linear-gradient(135deg, var(--orange-lt), oklch(96% 0.04 150))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--shd-md)', position: 'relative', overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: `conic-gradient(var(--orange) ${step * 25}%, transparent 0)`,
            borderRadius: 32, opacity: .15
          }} />
          <div style={{ width: 80, height: 80, borderRadius: 24, background: '#fff', boxShadow: 'var(--shd)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, zIndex: 1 }}>⚙️</div>
          <div style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--t2)' }}></div>
        </div>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--t1)', letterSpacing: -.3 }}>Yılın kuruluyor…</div>
          <div style={{ fontSize: 14, color: 'var(--t2)', fontWeight: 500 }}>Az sabret, buna değecek.</div>
        </div>
        {/* Step list */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {steps.map((s, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  background: done ? 'var(--orange)' : active ? 'var(--orange-lt)' : 'var(--border)',
                  border: active ? '2px solid var(--orange)' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, color: done ? '#fff' : 'var(--t3)', fontWeight: 700,
                  transition: 'all .3s'
                }}>{done ? '✓' : ''}</div>
                <span style={{ fontSize: 15, fontWeight: done || active ? 600 : 400, color: done ? 'var(--t1)' : active ? 'var(--orange)' : 'var(--t3)', transition: 'color .3s' }}>{s}</span>
              </div>
            );
          })}
        </div>
        {/* Progress */}
        <div style={{ width: '100%', height: 6, background: 'var(--border)', borderRadius: 100, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${step * 25}%`, background: 'var(--orange)', borderRadius: 100, transition: 'width .8s ease' }} />
        </div>
      </div>
    </HScreen>
  );
};

/* ══════════════════════════════════════════
   S5 — WOW MOMENT (Var A — Stat Grid)
══════════════════════════════════════════ */
const S5_Wow = () => {
  const hafta    = useCountUp(36, 800, 300);
  const kazanim  = useCountUp(142, 1000, 500);
  const sinif    = useCountUp(4, 400, 700);

  const stats = [
    { num: hafta,   label: 'hafta', color: 'var(--orange)' },
    { num: kazanim, label: 'kazanım', color: 'oklch(52% 0.18 270)' },
    { num: sinif,   label: 'sınıf', color: 'var(--green)' },
  ];

  const weeks = [
    { w: 1, code: 'MAT.9.1.1', title: 'Doğal Sayılar' },
    { w: 2, code: 'MAT.9.1.2', title: 'Köklü Sayılar' },
    { w: 3, code: 'MAT.9.1.3', title: 'Üslü İfadeler' },
    { w: 4, code: 'MAT.9.1.4', title: 'Denklemler' },
  ];

  return (
    <HScreen nav={false} bg="var(--surface)" style={{ height: 900 }}>
      <HStatusBar />
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px 32px', display: 'flex', flexDirection: 'column', gap: 20 }} className="hf-scroll">
        {/* Header */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'var(--green-lt)', borderRadius: 100,
            padding: '5px 14px', alignSelf: 'center'
          }}>
            <span style={{ color: 'var(--green)', fontSize: 12, fontWeight: 700 }}>✓ Tamamlandı</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--t1)', letterSpacing: -.5, lineHeight: 1.15, marginTop: 4 }}>
            Yılın kuruldu.
          </div>
          <div style={{ fontSize: 14, color: 'var(--t2)', fontWeight: 500 }}>Matematik · 9–10. Sınıf · 2025–2026</div>
        </div>

        {/* STAT CARDS */}
        <div style={{ display: 'flex', gap: 10 }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              flex: 1, background: 'var(--bg)',
              borderRadius: 20, padding: '18px 8px',
              textAlign: 'center',
              boxShadow: 'var(--shd)',
              animation: `fadeUp .5s ease both`,
              animationDelay: `${.1 + i * .25}s`
            }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: s.color, lineHeight: 1, letterSpacing: -1 }}>{s.num}</div>
              <div style={{ fontSize: 12, color: 'var(--t2)', fontWeight: 500, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Year bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <SLabel>YIL ÇUBUĞu</SLabel>
            <span style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 500 }}>Eyl 2025 — Haz 2026</span>
          </div>
          <div style={{ height: 8, background: 'var(--border)', borderRadius: 100, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '3%', background: 'linear-gradient(90deg, var(--orange), oklch(62% 0.22 50))', borderRadius: 100 }} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 6, textAlign: 'center' }}>Hafta 1 / 36 — bugün başlıyor</div>
        </div>

        {/* Preview weeks */}
        <div>
          <SLabel style={{ marginBottom: 10 }}>İLK 4 HAFTA ÖNİZLEME</SLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {weeks.map((w, i) => (
              <div key={w.w} style={{
                background: 'var(--bg)', borderRadius: 14,
                padding: '12px 16px', display: 'flex',
                alignItems: 'center', justifyContent: 'space-between',
                boxShadow: 'var(--shd)',
                animation: 'fadeUp .5s ease both',
                animationDelay: `${.9 + i * .12}s`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: 'var(--orange-lt)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 800, color: 'var(--orange)'
                  }}>{w.w}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>{w.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 1 }}>{w.code}</div>
                  </div>
                </div>
                <span style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 500 }}>3 kazanım</span>
              </div>
            ))}
          </div>
        </div>

        {/* Teaser */}
        <div style={{
          background: 'linear-gradient(135deg, var(--orange-lt), oklch(96.5% 0.04 120))',
          borderRadius: 16, padding: '16px 18px', textAlign: 'center'
        }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)' }}>✨ Yaver sana sürpriz hazırlıklar yapacak</div>
          <div style={{ fontSize: 12, color: 'var(--t2)', marginTop: 4 }}>Her haftadan önce materyal hazır olacak</div>
        </div>

        <HBtn style={{ fontSize: 17 }}>Yaver'i kullanmaya başla →</HBtn>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </HScreen>
  );
};

Object.assign(window, { S1_Welcome, S2_Brans, S3_Sinif, S4_Loading, S5_Wow });
})();
