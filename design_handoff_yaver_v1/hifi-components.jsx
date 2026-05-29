// hifi-components.jsx — Design tokens + shared atoms for Yaver Hi-Fi
// Exports all primitives to window for use in other Babel scripts

(function() {
const { useState, useEffect, useRef } = React;

// ── INJECT GLOBAL CSS ────────────────────────────────────────
const style = document.createElement('style');
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:      oklch(97.5% 0.012 75);
    --surface: #FFFFFF;
    --orange:  oklch(62% 0.22 38);
    --orange-lt: oklch(96.5% 0.055 60);
    --orange-md: oklch(92% 0.09 50);
    --green:   oklch(52% 0.17 152);
    --green-lt: oklch(96% 0.05 152);
    --t1: #1A1A1A;
    --t2: #6B6B6B;
    --t3: #B8B8B8;
    --border: #EBEBEB;
    --r: 20px;
    --r-btn: 100px;
    --r-sm: 12px;
    --shd: 0 2px 16px rgba(0,0,0,0.06);
    --shd-md: 0 6px 28px rgba(0,0,0,0.10);
  }
  .hf * { font-family: 'Plus Jakarta Sans', sans-serif !important; -webkit-font-smoothing: antialiased; }
  .hf-scroll::-webkit-scrollbar { display: none; }
`;
document.head.appendChild(style);

// ── SCREEN SHELL ────────────────────────────────────────────
const Screen = ({ children, nav = true, navActive = 0, bg, style: sx }) => (
  <div className="hf" style={{
    width: 390, background: bg || 'var(--bg)',
    display: 'flex', flexDirection: 'column',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    position: 'relative', overflow: 'hidden',
    ...sx
  }}>
    {children}
    {nav && <BottomNav active={navActive} />}
  </div>
);

// ── ANDROID STATUS BAR ──────────────────────────────────────
const StatusBar = ({ dark = false }) => (
  <div style={{
    height: 28, display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', padding: '0 20px',
    background: 'transparent'
  }}>
    <span style={{ fontSize: 12, fontWeight: 700, color: dark ? '#fff' : 'var(--t1)', letterSpacing: .3 }}>9:41</span>
    <span style={{ fontSize: 11, color: dark ? 'rgba(255,255,255,.8)' : 'var(--t2)', letterSpacing: 1.5 }}>●●● ▮▮ ◉</span>
  </div>
);

// ── APP BAR ────────────────────────────────────────────────
const AppBar = ({ back, title, action, border = true, bg = 'var(--surface)' }) => (
  <div style={{
    height: 56, display: 'flex', alignItems: 'center',
    padding: '0 20px', gap: 12, background: bg,
    borderBottom: border ? '1px solid var(--border)' : 'none',
    boxShadow: border ? '0 1px 0 var(--border)' : 'none'
  }}>
    {back && (
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: 'var(--bg)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
        fontSize: 18, color: 'var(--t1)'
      }}>←</div>
    )}
    <span style={{ flex: 1, fontSize: 18, fontWeight: 700, color: 'var(--t1)', lineHeight: 1.2 }}>{title}</span>
    {action && (
      <div style={{
        width: 36, height: 36, borderRadius: '50%', background: 'var(--bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', fontSize: 16, flexShrink: 0
      }}>{action}</div>
    )}
  </div>
);

// ── BOTTOM NAV ─────────────────────────────────────────────
const BottomNav = ({ active = 0 }) => {
  const tabs = [
    { l: 'Planım',     i: '◧' },
    { l: 'Ders İçin',  i: '◈' },
    { l: 'Evraklarım', i: '◉' },
    { l: 'Profil',     i: '◎' },
  ];
  return (
    <div style={{
      height: 68, borderTop: '1px solid var(--border)',
      background: 'var(--surface)', display: 'flex',
      alignItems: 'center', justifyContent: 'space-around',
      paddingBottom: 6, flexShrink: 0,
      boxShadow: '0 -1px 0 var(--border)'
    }}>
      {tabs.map((t, i) => {
        const isActive = i === active;
        return (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, cursor: 'pointer' }}>
            <div style={{
              width: 44, height: 28, borderRadius: 100,
              background: isActive ? 'var(--orange-lt)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background .2s'
            }}>
              <span style={{ fontSize: 18, color: isActive ? 'var(--orange)' : 'var(--t3)' }}>{t.i}</span>
            </div>
            <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500, color: isActive ? 'var(--orange)' : 'var(--t3)', letterSpacing: .2 }}>{t.l}</span>
          </div>
        );
      })}
    </div>
  );
};

// ── CARDS ──────────────────────────────────────────────────
const HCard = ({ children, style: sx, tinted, warn, ok, noBorder }) => (
  <div style={{
    background: warn ? 'var(--orange-lt)' : ok ? 'var(--green-lt)' : tinted ? 'var(--bg)' : 'var(--surface)',
    borderRadius: 'var(--r)',
    boxShadow: noBorder ? 'none' : 'var(--shd)',
    border: noBorder ? '1px solid var(--border)' : 'none',
    padding: '14px 16px',
    ...sx
  }}>
    {children}
  </div>
);

// ── BUTTONS ────────────────────────────────────────────────
const HBtn = ({ children, variant = 'primary', style: sx, small, ...props }) => {
  const variants = {
    primary: { background: 'var(--t1)', color: '#fff', border: 'none' },
    orange:  { background: 'var(--orange)', color: '#fff', border: 'none' },
    outline: { background: 'transparent', color: 'var(--t1)', border: '1.5px solid var(--border)' },
    ghost:   { background: 'transparent', color: 'var(--t2)', border: 'none' },
    danger:  { background: 'var(--orange-lt)', color: 'var(--orange)', border: '1.5px solid var(--orange-md)' },
  };
  return (
    <div style={{
      borderRadius: 'var(--r-btn)',
      padding: small ? '8px 16px' : '14px 20px',
      textAlign: 'center', cursor: 'pointer',
      fontSize: small ? 13 : 16, fontWeight: 700,
      letterSpacing: .2,
      userSelect: 'none',
      ...variants[variant],
      ...sx
    }} {...props}>
      {children}
    </div>
  );
};

// ── CHIP ──────────────────────────────────────────────────
const HChip = ({ children, active, style: sx }) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap',
    borderRadius: 100, padding: '6px 14px',
    background: active ? 'var(--t1)' : 'var(--surface)',
    color: active ? '#fff' : 'var(--t2)',
    border: active ? 'none' : '1.5px solid var(--border)',
    fontSize: 13, fontWeight: active ? 700 : 500,
    cursor: 'pointer',
    ...sx
  }}>
    {children}
  </div>
);

// ── STATUS BADGE ──────────────────────────────────────────
const StatusBadge = ({ type }) => {
  const cfg = {
    todo:     { bg: 'var(--orange-lt)', color: 'var(--orange)', text: '⚠ Hazırlanmadı' },
    ready:    { bg: 'var(--green-lt)',  color: 'var(--green)',  text: '✓ Hazır' },
    surprise: { bg: 'oklch(96% 0.05 300)', color: 'oklch(55% 0.18 300)', text: '✨ Sürpriz' },
    auto:     { bg: 'oklch(96% 0.04 240)', color: 'oklch(55% 0.14 240)', text: '🌙 Otomatik' },
  };
  const c = cfg[type] || cfg.todo;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center',
      background: c.bg, color: c.color,
      borderRadius: 100, padding: '4px 10px',
      fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap'
    }}>{c.text}</div>
  );
};

// ── SECTION LABEL ─────────────────────────────────────────
const SLabel = ({ children, style: sx }) => (
  <div style={{
    fontSize: 11, fontWeight: 700, letterSpacing: '.1em',
    textTransform: 'uppercase', color: 'var(--t3)',
    ...sx
  }}>{children}</div>
);

// ── DIVIDER ───────────────────────────────────────────────
const HDivider = ({ style: sx }) => (
  <div style={{ height: 1, background: 'var(--border)', ...sx }} />
);

// ── PROGRESS BAR ──────────────────────────────────────────
const HProgress = ({ value = 0 }) => (
  <div style={{ height: 3, background: 'var(--border)', borderRadius: 100, overflow: 'hidden', margin: '0 20px' }}>
    <div style={{ height: '100%', width: `${value}%`, background: 'var(--orange)', borderRadius: 100, transition: 'width .4s ease' }} />
  </div>
);

// ── ILLUSTRATION AREA ─────────────────────────────────────
const Illo = ({ label, height = 180, accent = 'var(--orange-lt)' }) => (
  <div style={{
    height, borderRadius: 'var(--r)',
    background: `linear-gradient(135deg, ${accent} 0%, var(--bg) 100%)`,
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', gap: 8, color: 'var(--t3)',
    fontSize: 12, fontWeight: 500, fontStyle: 'italic'
  }}>
    <div style={{
      width: 64, height: 64, borderRadius: '50%',
      background: 'rgba(255,255,255,.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 28
    }}>✦</div>
    <span>{label}</span>
  </div>
);

// ── COUNT-UP HOOK ─────────────────────────────────────────
const useCountUp = (target, duration = 1000, delay = 0) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const step = target / (duration / 16);
      const interval = setInterval(() => {
        start += step;
        if (start >= target) { setCount(target); clearInterval(interval); }
        else setCount(Math.floor(start));
      }, 16);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [target, delay]);
  return count;
};

// ── FAB ───────────────────────────────────────────────────
const HFab = ({ style: sx }) => (
  <div style={{
    position: 'absolute', bottom: 82, right: 20,
    width: 56, height: 56, borderRadius: 16,
    background: 'var(--t1)', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 24, boxShadow: 'var(--shd-md)', cursor: 'pointer',
    userSelect: 'none', ...sx
  }}>+</div>
);

// ── EXPORT ────────────────────────────────────────────────
Object.assign(window, {
  HScreen: Screen, HStatusBar: StatusBar, HAppBar: AppBar,
  HBottomNav: BottomNav, HCard, HBtn, HChip,
  StatusBadge, SLabel, HDivider, HProgress, Illo, HFab,
  useCountUp
});
})();
