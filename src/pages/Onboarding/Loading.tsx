import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PhoneCanvas } from '../../components/ReferenceUI'

const STEPS = [
  { label: 'MEB takvimi yükleniyor',      emoji: '📅', grad: 'from-[#dff5ff] to-[#efe4ff]' },
  { label: 'Kazanımlar eşleştiriliyor',   emoji: '📚', grad: 'from-[#e4ffe0] to-[#f5ffef]' },
  { label: 'Haftalara dağıtılıyor',       emoji: '🗓️', grad: 'from-[#fff9e0] to-[#ffecd2]' },
  { label: 'Tatiller işaretleniyor',      emoji: '✈️', grad: 'from-[#f1e3ff] to-[#fbf5ff]' },
]

export default function Loading() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate('/onboarding/hazir')
    }, 4000)
    return () => window.clearTimeout(timer)
  }, [navigate])

  return (
    <PhoneCanvas>
      <div className="mt-12 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
          className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border-2 border-ink/10 border-t-ink"
        />
        <h2 className="font-display text-[2rem] font-bold leading-[1.05] tracking-[-0.04em] text-ink">
          Yılın kuruluyor
        </h2>
        <p className="mt-3 font-body text-sm leading-6 text-smoke">
          Branş, sınıf ve MEB takvimine göre<br />36 haftalık planını hazırlıyoruz.
        </p>
      </div>

      <div className="mt-8 space-y-3">
        {STEPS.map((step, index) => (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.7, duration: 0.45, ease: 'easeOut' }}
            className={`rounded-[20px] bg-gradient-to-br ${step.grad} p-[1px] shadow-[0_14px_26px_rgba(163,177,198,0.15)]`}
          >
            <div className="flex items-center gap-3 rounded-[19px] bg-white/82 px-4 py-3 backdrop-blur-sm">
              <span className="text-xl">{step.emoji}</span>
              <p className="flex-1 font-body text-sm font-medium text-ink">{step.label}</p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.7 + 0.3 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                  className="h-4 w-4 rounded-full border-[1.5px] border-ink/20 border-t-ink"
                />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-auto rounded-[20px] bg-gradient-to-br from-[#dff5ff] to-[#efe4ff] p-[1px] shadow-[0_18px_32px_rgba(163,177,198,0.16)]">
        <div className="rounded-[19px] bg-white/82 px-5 py-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="font-body text-xs text-smoke">Tamamlanma</span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="font-body text-xs font-semibold text-ink"
            >
              Az kaldı…
            </motion.span>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white">
            <motion.div
              initial={{ width: '5%' }}
              animate={{ width: '92%' }}
              transition={{ duration: 3.6, ease: 'easeInOut' }}
              className="h-full rounded-full bg-[linear-gradient(90deg,#8fd5ff,#c4b5fd,#f9a8d4)]"
            />
          </div>
        </div>
      </div>
    </PhoneCanvas>
  )
}
