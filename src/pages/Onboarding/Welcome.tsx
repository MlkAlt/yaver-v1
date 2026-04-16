import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

// Dekoratif plan önizleme kartı — ürünün çıktısını gösterir, maskot yok
function PlanPreviewCard({
  week, subject, sinif, done, delay, rotate,
}: {
  week: string
  subject: string
  sinif: string
  done: boolean
  delay: number
  rotate: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotate: rotate - 4 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      className="absolute bg-card rounded-md px-3 py-2.5 shadow-sm border border-divider w-44"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-body text-xs text-mist">{week}</span>
        {done ? (
          <span className="text-moss text-xs">✓</span>
        ) : (
          <span className="text-amber text-xs">⚠</span>
        )}
      </div>
      <p className="font-body text-sm font-medium text-ink leading-tight">{subject}</p>
      <p className="font-body text-xs text-smoke mt-0.5">{sinif}</p>
    </motion.div>
  )
}

// Stagger animasyon ayarları — Spec G5
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

export default function Welcome() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-paper flex flex-col">

      {/* Üst bar — "Hesabım var" */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="flex justify-end px-6 pt-12"
      >
        <button
          onClick={() => {/* auth flow Hafta 5 */}}
          className="font-body text-sm text-smoke hover:text-ink transition-colors"
        >
          Hesabım var
        </button>
      </motion.div>

      {/* Hero görsel — plan önizleme kartları */}
      <div className="relative h-56 mx-6 mt-8">
        {/* Arka plan dekorasyon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.6, ease: 'easeOut' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-40 h-40 rounded-full bg-sienna/8" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="absolute top-4 right-8 w-24 h-24 rounded-full bg-moss/6"
        />

        {/* Plan önizleme kartları */}
        <div className="absolute inset-0">
          {/* Arka kart */}
          <div className="absolute top-12 left-2">
            <PlanPreviewCard
              week="Hafta 3"
              subject="Üslü İfadeler"
              sinif="9-A"
              done={false}
              delay={0.3}
              rotate={-6}
            />
          </div>
          {/* Orta kart */}
          <div className="absolute top-6 left-10">
            <PlanPreviewCard
              week="Hafta 2"
              subject="Doğal Sayılar"
              sinif="9-A · 9-B"
              done={true}
              delay={0.4}
              rotate={-2}
            />
          </div>
          {/* Öne kart */}
          <div className="absolute top-2 left-20">
            <PlanPreviewCard
              week="Hafta 1"
              subject="Kümeler"
              sinif="9-A · 9-B · 10-A"
              done={true}
              delay={0.5}
              rotate={3}
            />
          </div>
        </div>

        {/* "36 hafta" badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.65, duration: 0.3, ease: 'easeOut' }}
          className="absolute bottom-0 right-4 bg-sienna text-white font-body
            text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm"
        >
          36 hafta hazır ✓
        </motion.div>
      </div>

      {/* İçerik — başlık + alt metin */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 flex flex-col px-6 pt-10"
      >
        {/* Hero başlık — Spec G2 mikro-imza: italik kelime */}
        <motion.h1
          variants={itemVariants}
          className="font-display text-[2.1rem] leading-[1.15] font-bold text-ink"
        >
          Yılını <em className="not-italic italic">30 saniyede</em> kur.
        </motion.h1>

        {/* Alt metin */}
        <motion.p
          variants={itemVariants}
          className="font-body text-base text-smoke mt-4 leading-relaxed"
        >
          Yıllık planını, evraklarını ve ders hazırlıklarını
          senin yerine hazırlasın.
        </motion.p>

        {/* Güven notu — Spec D2 */}
        <motion.p
          variants={itemVariants}
          className="font-body text-sm text-mist mt-3"
        >
          Üye olmana gerek yok. Önce planını gör.
        </motion.p>

        {/* Boş alan */}
        <div className="flex-1" />

        {/* CTA — Spec G8: "Başlayalım" */}
        <motion.div variants={itemVariants} className="pb-10">
          <button
            onClick={() => navigate('/onboarding/brans')}
            className="w-full bg-sienna text-white font-body font-semibold
              text-base py-4 rounded-md flex items-center justify-center gap-2
              active:opacity-90 transition-opacity"
          >
            Başlayalım
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}
