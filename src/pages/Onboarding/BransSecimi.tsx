import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeftIcon,
  CircleButton,
  PhoneCanvas,
  SearchField,
  TopBar,
} from '../../components/ReferenceUI'

const BRANSLAR = [
  { ad: 'Matematik',                    ikon: '📐', renk: '#DBEAFE' },
  { ad: 'Türk Dili ve Edebiyatı',       ikon: '📖', renk: '#FEE2E2' },
  { ad: 'Fizik',                        ikon: '⚡', renk: '#EDE9FE' },
  { ad: 'Kimya',                        ikon: '🧪', renk: '#D1FAE5' },
  { ad: 'Biyoloji',                     ikon: '🌿', renk: '#DCFCE7' },
  { ad: 'Tarih',                        ikon: '🏛️', renk: '#FEF3C7' },
  { ad: 'Coğrafya',                     ikon: '🗺️', renk: '#CCFBF1' },
  { ad: 'Felsefe',                      ikon: '💭', renk: '#F3E8FF' },
  { ad: 'İngilizce',                    ikon: '🌍', renk: '#E0F2FE' },
  { ad: 'Bilişim Teknolojileri',        ikon: '💻', renk: '#F1F5F9' },
  { ad: 'Müzik',                        ikon: '🎵', renk: '#FCE7F3' },
  { ad: 'Beden Eğitimi ve Spor',        ikon: '⚽', renk: '#FFEDD5' },
  { ad: 'Din Kültürü ve Ahlak Bilgisi', ikon: '📿', renk: '#F5F5F4' },
  { ad: 'Görsel Sanatlar',              ikon: '🎨', renk: '#FFE4E6' },
]

export default function BransSecimi() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const filtered = BRANSLAR.filter(b =>
    b.ad.toLowerCase().includes(search.toLowerCase())
  )

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
        <p className="font-body text-xs uppercase tracking-[0.12em] text-mist">Adım 1 / 2</p>
        <h2 className="mt-2 font-display text-[2.2rem] font-bold leading-[1.05] tracking-[-0.04em] text-ink">
          Hangi<br />branştasın?
        </h2>
      </div>

      <SearchField placeholder="Branş ara..." value={search} onChange={setSearch} />

      <div className="mt-4 grid grid-cols-2 gap-3">
        {filtered.map((brans, index) => {
          const isSelected = selected === brans.ad
          return (
            <motion.button
              key={brans.ad}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.035, duration: 0.3, ease: 'easeOut' }}
              onClick={() => setSelected(brans.ad)}
              className={`rounded-[20px] p-4 text-left transition-all duration-200 ${
                isSelected
                  ? 'ring-2 ring-ink shadow-[0_14px_28px_rgba(28,27,23,0.14)]'
                  : 'shadow-[0_10px_20px_rgba(163,177,198,0.14)]'
              }`}
              style={{ backgroundColor: brans.renk }}
            >
              <span className="text-2xl">{brans.ikon}</span>
              <p className="mt-3 font-body text-sm font-semibold leading-tight text-ink">
                {brans.ad}
              </p>
              {isSelected && (
                <div className="mt-2 flex items-center gap-1">
                  <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-ink">
                    <svg viewBox="0 0 12 12" className="h-2 w-2" fill="none" stroke="white" strokeWidth="2.2">
                      <path d="M2 6l3 3 5-5" />
                    </svg>
                  </div>
                  <span className="font-body text-[10px] font-medium text-ink">Seçildi</span>
                </div>
              )}
            </motion.button>
          )
        })}

        {filtered.length === 0 && (
          <div className="col-span-2 py-8 text-center font-body text-sm text-mist">
            "{search}" için sonuç bulunamadı
          </div>
        )}
      </div>

      <button
        onClick={() => selected && navigate('/onboarding/sinif')}
        disabled={!selected}
        className={`mt-auto rounded-full px-5 py-4 font-body text-base font-semibold transition-all duration-200 ${
          selected
            ? 'bg-ink text-white shadow-[0_18px_34px_rgba(28,27,23,0.18)]'
            : 'cursor-not-allowed bg-ink/20 text-ink/40'
        }`}
      >
        Devam et →
      </button>
    </PhoneCanvas>
  )
}
