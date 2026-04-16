import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { PhoneCanvas } from '../../components/ReferenceUI'

const PREVIEW_ITEMS = [
  {
    emoji: '📅',
    title: '36 hafta, tüm yıl',
    subtitle: 'MEB takvimine göre otomatik',
    dot: '#86efac',
    grad: 'from-[#dff5ff] to-[#efe4ff]',
    iconGrad: 'from-[#8fd5ff] to-[#c4b5fd]',
  },
  {
    emoji: '✨',
    title: 'Sürpriz hazırlıklar',
    subtitle: 'Yaver ara ara senin için hazırlar',
    dot: '#fbbf24',
    grad: 'from-[#fff9e0] to-[#ffecd2]',
    iconGrad: 'from-[#fde68a] to-[#fca5a1]',
  },
  {
    emoji: '📋',
    title: 'Evraklar hazır',
    subtitle: 'Zümre, ŞÖK, tüm resmi evraklar',
    dot: '#4ade80',
    grad: 'from-[#e4ffe0] to-[#f5ffef]',
    iconGrad: 'from-[#86efac] to-[#a7f3d0]',
  },
]

export default function Welcome() {
  const navigate = useNavigate()

  return (
    <PhoneCanvas>
      {/* Top bar */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink">
            <span className="font-body text-sm font-bold text-white">Y</span>
          </div>
          <span className="font-body text-sm font-semibold text-ink">Yaver</span>
        </div>
        <button className="font-body text-sm text-smoke">Hesabım var</button>
      </div>

      {/* Hero */}
      <div className="mt-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="font-display text-[3rem] font-bold leading-[1.0] tracking-[-0.04em] text-ink"
        >
          Yılını 30<br />saniyede<br /><em>kur.</em>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4, ease: 'easeOut' }}
          className="mt-5 font-body text-base leading-6 text-smoke"
        >
          Yıllık planını, evraklarını ve etkinliklerini senin yerine hazırlasın.
        </motion.p>
      </div>

      {/* Preview cards */}
      <div className="mt-8 space-y-3">
        {PREVIEW_ITEMS.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.1, duration: 0.4, ease: 'easeOut' }}
            className={`rounded-[20px] bg-gradient-to-br ${item.grad} p-[1px] shadow-[0_16px_30px_rgba(163,177,198,0.16)]`}
          >
            <div className="flex items-center gap-3 rounded-[19px] bg-white/80 px-4 py-3 backdrop-blur-sm">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${item.iconGrad}`}
              >
                <span className="text-base">{item.emoji}</span>
              </div>
              <div className="flex-1">
                <p className="font-body text-sm font-semibold text-ink">{item.title}</p>
                <p className="font-body text-xs text-smoke">{item.subtitle}</p>
              </div>
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: item.dot }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-auto pt-8">
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.4, ease: 'easeOut' }}
          onClick={() => navigate('/onboarding/brans')}
          className="w-full rounded-full bg-ink px-5 py-4 font-body text-base font-semibold text-white shadow-[0_18px_34px_rgba(28,27,23,0.18)]"
        >
          Başlayalım →
        </motion.button>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="mt-4 text-center font-body text-xs text-mist"
        >
          Üye olmana gerek yok. Önce planını gör.
        </motion.p>
      </div>
    </PhoneCanvas>
  )
}
