import type { ReactNode, SVGProps } from 'react'

export function PhoneCanvas({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f8f6ff_0%,#f5fbff_34%,#ffffff_100%)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top_left,rgba(196,181,253,0.35),transparent_58%)]" />
      <div className="pointer-events-none absolute right-[-72px] top-24 h-44 w-44 rounded-full bg-[rgba(125,211,252,0.22)] blur-3xl" />
      <div className="pointer-events-none absolute left-[-56px] top-72 h-44 w-44 rounded-full bg-[rgba(250,204,21,0.14)] blur-3xl" />
      <div className="relative flex min-h-screen flex-col px-6 pb-8 pt-6">
        <div className="mx-auto h-1.5 w-20 rounded-full bg-black/6" />
        {children}
      </div>
    </div>
  )
}

export function TopBar({
  title,
  left,
  right,
}: {
  title?: string
  left?: ReactNode
  right?: ReactNode
}) {
  return (
    <div className="mt-4 flex items-center justify-between">
      <div className="flex min-w-[44px] items-center">{left}</div>
      <div className="flex-1 px-4 text-center">
        {title ? (
          <h1 className="font-body text-[1.55rem] font-semibold tracking-[-0.03em] text-ink">
            {title}
          </h1>
        ) : null}
      </div>
      <div className="flex min-w-[44px] justify-end">{right}</div>
    </div>
  )
}

export function CircleButton({
  children,
  tone = 'white',
  onClick,
}: {
  children: ReactNode
  tone?: 'white' | 'dark'
  onClick?: () => void
}) {
  const className = tone === 'dark'
    ? 'bg-ink text-white shadow-[0_14px_30px_rgba(28,27,23,0.2)]'
    : 'bg-white text-ink shadow-[0_12px_25px_rgba(146,163,184,0.18)]'

  return (
    <button
      onClick={onClick}
      className={`flex h-11 w-11 items-center justify-center rounded-full ${className}`}
    >
      {children}
    </button>
  )
}

export function SearchField({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string
  value?: string
  onChange?: (v: string) => void
}) {
  return (
    <div className="mt-5 flex items-center gap-3 rounded-full bg-white px-4 py-3 shadow-[0_14px_30px_rgba(146,163,184,0.14)]">
      <SearchIcon className="h-4 w-4 text-mist" />
      {onChange ? (
        <input
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent font-body text-sm text-ink placeholder:text-mist outline-none"
        />
      ) : (
        <span className="font-body text-sm text-mist">{placeholder}</span>
      )}
    </div>
  )
}

export function SectionHeader({
  title,
  action = 'See All',
}: {
  title: string
  action?: string
}) {
  return (
    <div className="mt-6 flex items-center justify-between">
      <h2 className="font-body text-[1.1rem] font-semibold tracking-[-0.02em] text-ink">
        {title}
      </h2>
      <button className="font-body text-xs font-medium text-[#9e94d8]">{action}</button>
    </div>
  )
}

export function HeroCard({
  title,
  subtitle,
  percent,
  tone,
  footer,
}: {
  title: string
  subtitle: string
  percent: string
  tone: 'pink' | 'blue' | 'green' | 'purple'
  footer: ReactNode
}) {
  const toneClasses = {
    pink: 'from-[#ff4ea6] via-[#ff59bc] to-[#ffa14f]',
    blue: 'from-[#79d5ff] via-[#8fd5ff] to-[#ffd769]',
    green: 'from-[#7be45f] via-[#95eb72] to-[#ddff9d]',
    purple: 'from-[#b17cff] via-[#c992ff] to-[#88d5ff]',
  }

  return (
    <div className={`mt-4 overflow-hidden rounded-[28px] bg-gradient-to-br ${toneClasses[tone]} p-[1px] shadow-[0_24px_44px_rgba(163,177,198,0.22)]`}>
      <div className="rounded-[27px] bg-white/18 px-5 py-5 backdrop-blur-md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-body text-[1.55rem] font-semibold leading-tight tracking-[-0.04em] text-white">
              {title}
            </h3>
            <p className="mt-2 font-body text-sm text-white/80">{subtitle}</p>
          </div>
          <button className="text-white/90">
            <DotsIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-body text-xs font-medium uppercase tracking-[0.16em] text-white/75">
              Progress
            </span>
            <span className="font-body text-sm font-semibold text-white">{percent}</span>
          </div>
          <div className="h-2 rounded-full bg-white/30">
            <div className="h-full w-[55%] rounded-full bg-white" />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          {footer}
        </div>
      </div>
    </div>
  )
}

export function WhiteCard({
  title,
  subtitle,
  right,
  children,
  tone = 'sky',
}: {
  title: string
  subtitle?: string
  right?: ReactNode
  children?: ReactNode
  tone?: 'sky' | 'green' | 'purple' | 'yellow'
}) {
  const toneMap = {
    sky: 'from-[#d8f0ff] to-[#eaf8ff]',
    green: 'from-[#e4ffe0] to-[#f5ffef]',
    purple: 'from-[#f1e3ff] to-[#fbf5ff]',
    yellow: 'from-[#fff2cc] to-[#fff9e8]',
  }

  return (
    <div className={`rounded-[24px] bg-gradient-to-br ${toneMap[tone]} p-[1px] shadow-[0_20px_35px_rgba(163,177,198,0.18)]`}>
      <div className="rounded-[23px] bg-white/78 px-4 py-4 backdrop-blur-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-body text-[1.15rem] font-semibold leading-tight tracking-[-0.03em] text-ink">
              {title}
            </h3>
            {subtitle ? (
              <p className="mt-1 font-body text-sm text-smoke">{subtitle}</p>
            ) : null}
          </div>
          {right}
        </div>
        {children}
      </div>
    </div>
  )
}

export function MiniProgress({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-body text-xs text-smoke">{label}</span>
        <span className="font-body text-xs font-semibold text-ink">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-white/70">
        <div className="h-full w-[55%] rounded-full bg-ink" />
      </div>
    </div>
  )
}

export function AvatarStrip() {
  return (
    <div className="flex items-center">
      {['#7dd3fc', '#f9a8d4', '#86efac'].map((color, index) => (
        <div
          key={color}
          className="-ml-1.5 first:ml-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[10px] font-semibold text-ink"
          style={{ backgroundColor: color, zIndex: 3 - index }}
        >
          {index + 1}
        </div>
      ))}
    </div>
  )
}

export function BottomDock() {
  return (
    <div className="mt-6 rounded-full bg-white/95 px-3 py-2 shadow-[0_18px_38px_rgba(163,177,198,0.22)]">
      <div className="flex items-center justify-between">
        {[HomeIcon, BoardIcon, SparkIcon, MailIcon, UserIcon].map((Icon, index) => (
          <button
            key={index}
            className={`flex h-11 w-11 items-center justify-center rounded-full ${index === 0 ? 'bg-[#f2f4f8]' : ''}`}
          >
            <Icon className="h-5 w-5 text-ink" />
          </button>
        ))}
      </div>
    </div>
  )
}

export function TagChip({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <button
      className={`rounded-full px-4 py-2 font-body text-sm font-medium ${
        active
          ? 'bg-ink text-white shadow-[0_12px_24px_rgba(28,27,23,0.18)]'
          : 'bg-white text-smoke shadow-[0_10px_24px_rgba(163,177,198,0.14)]'
      }`}
    >
      {label}
    </button>
  )
}

function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

export function ArrowLeftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

export function DotsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <circle cx="12" cy="5" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="12" cy="19" r="1.8" />
    </svg>
  )
}

export function BoardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="4" y="5" width="6" height="14" rx="2" />
      <rect x="14" y="5" width="6" height="8" rx="2" />
      <rect x="14" y="15" width="6" height="4" rx="2" />
    </svg>
  )
}

function HomeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1z" />
    </svg>
  )
}

function SparkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="m12 4 1.4 4.6L18 10l-4.6 1.4L12 16l-1.4-4.6L6 10l4.6-1.4z" />
    </svg>
  )
}

function MailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="4" y="6" width="16" height="12" rx="3" />
      <path d="m5.5 8 6.5 5 6.5-5" />
    </svg>
  )
}

function UserIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 19c1.8-3 4-4.5 7-4.5S17.2 16 19 19" />
    </svg>
  )
}
