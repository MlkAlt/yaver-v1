import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { PhoneCanvas } from '../../components/ReferenceUI'

const STATS = [
  { value: '36',  label: 'Hafta',    grad: 'from-[#dff5ff] to-[#efe4ff]', dot: '#c4b5fd' },
  { value: '248', label: 'Kazanım',  grad: 'from-[#e4ffe0] to-[#f5ffef]', dot: '#86efac' },
  { value: '2',   label: 'Sınıf',   grad: 'from-[#fff9e0] to-[#ffecd2]', dot: '#fbbf24' },
]

const PREVIEW_WEEKS = [
  { no: 1,  tarih: '15–19 Eyl',  kazanim: 3, tatil: false },
  { no: 2,  tarih: '22–26 Eyl',  kazanim: 4, tatil: false },
  { no: 3,  tarih: '29 Eyl–3 Eki', kazanim: 3, tatil: false },
  { no: 4,  tarih: '6–10 Eki',   kazanim: 4, tatil: false },
]

export default function WowMoment() {
  const navigate = useNavigate()

  return (
    <PhoneCanvas>
      {/* Başlık */}
      <div className="mt-8 text-center">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="font-body text-sm text-smoke"
        >
          Hazır 🎉
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
          className="mt-2 font-display text-[2.8rem] font-bold leading-[1.0] tracking-[-0.04em] text-ink"
        >
          Yılın<br /><em>kuruldu.</em>
        </motion.h1>
      </div>

      {/* Stat kartları */}
      <div className="mt-7 flex gap-3">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.08, duration: 0.4, ease: 'easeOut' }}
            className={`flex-1 rounded-[18px] bg-gradient-to-br ${stat.grad} p-[1px] shadow-[0_14px_26px_rgba(163,177,198,0.16)]`}
          >
            <div className="rounded-[17px] bg-white/82 px-3 py-4 text-center backdrop-blur-sm">
              <p className="font-display text-[1.9rem] font-bold leading-none tracking-[-0.04em] text-ink">
                {stat.value}
              </p>
              <p className="mt-1 font-body text-xs text-smoke">{stat.label}</p>
              <div
                className="mx-auto mt-2 h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: stat.dot }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Hafta önizleme */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.4, ease: 'easeOut' }}
        className="mt-5"
      >
        <p className="font-body text-xs uppercase tracking-[0.12em] text-mist">
          İlk haftalar
        </p>
        <div className="mt-3 space-y-2">
          {PREVIEW_WEEKS.map((hafta, i) => (
            <motion.div
              key={hafta.no}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.07, duration: 0.35, ease: 'easeOut' }}
              className="flex items-center gap-3 rounded-[16px] bg-white/80 px-4 py-3 shadow-[0_8px_18px_rgba(163,177,198,0.12)]"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink/6">
                <span className="font-body text-xs font-semibold text-ink">{hafta.no}</span>
              </div>
              <div className="flex-1">
                <p className="font-body text-sm font-medium text-ink">{hafta.tarih}</p>
                <p className="font-body text-xs text-smoke">{hafta.kazanim} kazanım</p>
              </div>
              <div className="h-1.5 w-1.5 rounded-full bg-[#86efac]" />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA'lar */}
      <div className="mt-auto pt-6 space-y-3">
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4, ease: 'easeOut' }}
          onClick={() => navigate('/planim')}
          className="w-full rounded-full bg-ink px-5 py-4 font-body text-base font-semibold text-white shadow-[0_18px_34px_rgba(28,27,23,0.18)]"
        >
          Yaver'i kullanmaya başla →
        </motion.button>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.82, duration: 0.35 }}
          className="w-full rounded-full bg-white/80 px-5 py-3.5 font-body text-sm font-medium text-ink shadow-[0_10px_22px_rgba(163,177,198,0.14)]"
        >
          ⬇ Yazdırmaya hazır indir
        </motion.button>
      </div>

      {/* Sürpriz hazırlık notu */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.95, duration: 0.4 }}
        className="mt-4 text-center font-body text-xs leading-5 text-mist"
      >
        Yaver sana ara sıra sürpriz hazırlıklar yapacak.{' '}
        <br />
        İstemezsen Profil &gt; Asistan'dan kapatabilirsin.
      </motion.p>
    </PhoneCanvas>
  )
}
