import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeftIcon,
  CircleButton,
  PhoneCanvas,
  TopBar,
} from '../../components/ReferenceUI'

const SINIFLAR = [
  { seviye: 9,  label: '9. Sınıf',  renk: '#DBEAFE', ikon: '📘' },
  { seviye: 10, label: '10. Sınıf', renk: '#D1FAE5', ikon: '📗' },
  { seviye: 11, label: '11. Sınıf', renk: '#FEF3C7', ikon: '📙' },
  { seviye: 12, label: '12. Sınıf', renk: '#F3E8FF', ikon: '📕' },
]

export default function SinifSecimi() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<number[]>([])

  const toggle = (seviye: number) => {
    setSelected(prev =>
      prev.includes(seviye) ? prev.filter(s => s !== seviye) : [...prev, seviye]
    )
  }

  const selectAll = () => {
    setSelected(SINIFLAR.map(s => s.seviye))
  }

  const allSelected = selected.length === SINIFLAR.length

  return (
    <PhoneCanvas>
      <TopBar
        title=""
        left={
          <CircleButton onClick={() => navigate(-1)}>
            <ArrowLeftIcon className="h-5 w-5" />
          </CircleButton>
        }
      />

      <div className="mt-4">
        <p className="font-body text-xs uppercase tracking-[0.12em] text-mist">Adım 2 / 2</p>
        <h2 className="mt-2 font-display text-[2.2rem] font-bold leading-[1.05] tracking-[-0.04em] text-ink">
          Hangi<br />sınıflara<br /><em>giriyorsun?</em>
        </h2>
        <p className="mt-3 font-body text-sm text-smoke">
          Birden fazla seçebilirsin.
        </p>
      </div>

      {/* "Hepsine giriyorum" shortcut */}
      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3, ease: 'easeOut' }}
        onClick={selectAll}
        className={`mt-5 w-full rounded-[16px] px-4 py-3 text-left transition-all duration-200 ${
          allSelected
            ? 'bg-ink text-white shadow-[0_14px_28px_rgba(28,27,23,0.14)]'
            : 'bg-white/80 text-ink shadow-[0_10px_20px_rgba(163,177,198,0.14)]'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🏫</span>
            <div>
              <p className="font-body text-sm font-semibold">Hepsine giriyorum</p>
              <p className={`font-body text-xs ${allSelected ? 'text-white/70' : 'text-smoke'}`}>
                9, 10, 11 ve 12. sınıflar
              </p>
            </div>
          </div>
          {allSelected && (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
              <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="white" strokeWidth="2.2">
                <path d="M2 6l3 3 5-5" />
              </svg>
            </div>
          )}
        </div>
      </motion.button>

      {/* Sınıf kartları */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {SINIFLAR.map((sinif, index) => {
          const isSelected = selected.includes(sinif.seviye)
          return (
            <motion.button
              key={sinif.seviye}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.07, duration: 0.35, ease: 'easeOut' }}
              onClick={() => toggle(sinif.seviye)}
              className={`rounded-[20px] p-5 text-left transition-all duration-200 ${
                isSelected
                  ? 'ring-2 ring-ink shadow-[0_14px_28px_rgba(28,27,23,0.14)]'
                  : 'shadow-[0_10px_20px_rgba(163,177,198,0.14)]'
              }`}
              style={{ backgroundColor: sinif.renk }}
            >
              <span className="text-2xl">{sinif.ikon}</span>
              <p className="mt-3 font-body text-lg font-bold tracking-[-0.03em] text-ink">
                {sinif.seviye}.
              </p>
              <p className="font-body text-sm font-medium text-smoke">Sınıf</p>
              {isSelected && (
                <div className="mt-2 flex h-5 w-5 items-center justify-center rounded-full bg-ink">
                  <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="white" strokeWidth="2.2">
                    <path d="M2 6l3 3 5-5" />
                  </svg>
                </div>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Seçim özeti */}
      {selected.length > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-center font-body text-xs text-smoke"
        >
          {selected.sort().join(', ')}. sınıflar seçildi
        </motion.p>
      )}

      <button
        onClick={() => selected.length > 0 && navigate('/onboarding/yukleniyor')}
        disabled={selected.length === 0}
        className={`mt-auto rounded-full px-5 py-4 font-body text-base font-semibold transition-all duration-200 ${
          selected.length > 0
            ? 'bg-ink text-white shadow-[0_18px_34px_rgba(28,27,23,0.18)]'
            : 'cursor-not-allowed bg-ink/20 text-ink/40'
        }`}
      >
        Yılımı kur ✨
      </button>
    </PhoneCanvas>
  )
}
