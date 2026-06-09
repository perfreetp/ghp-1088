import { cn } from '@/utils/helpers'
import { getRiskLevelInfo } from '@/utils/helpers'

type RiskLevel = 'A' | 'B' | 'C' | 'D' | 'E'
type RiskBadgeSize = 'sm' | 'md' | 'lg'

interface RiskBadgeProps {
  level: RiskLevel | string
  size?: RiskBadgeSize
  showLabel?: boolean
  className?: string
}

const sizeConfig: Record<
  RiskBadgeSize,
  { container: string; text: string; labelSize: string }
> = {
  sm: {
    container: 'h-6 w-9 rounded-md',
    text: 'text-xs font-bold',
    labelSize: 'text-xs',
  },
  md: {
    container: 'h-10 w-10 rounded-full',
    text: 'text-base font-bold',
    labelSize: 'text-sm',
  },
  lg: {
    container: 'h-16 w-16 rounded-full',
    text: 'text-2xl font-bold',
    labelSize: 'text-base',
  },
}

const glowClasses: Record<string, string> = {
  A: 'shadow-[0_0_20px_rgba(16,185,129,0.4)] ring-2 ring-emerald-400/30',
  B: 'shadow-[0_0_20px_rgba(59,130,246,0.4)] ring-2 ring-blue-400/30',
  C: 'shadow-[0_0_20px_rgba(245,158,11,0.4)] ring-2 ring-amber-400/30',
  D: 'shadow-[0_0_20px_rgba(249,115,22,0.4)] ring-2 ring-orange-400/30',
  E: 'shadow-[0_0_20px_rgba(239,68,68,0.4)] ring-2 ring-red-400/30',
}

export default function RiskBadge({
  level,
  size = 'md',
  showLabel = false,
  className,
}: RiskBadgeProps) {
  const info = getRiskLevelInfo(level)
  const config = sizeConfig[size]
  const levelKey = (level || '').toUpperCase()

  return (
    <div className={cn('inline-flex items-center gap-3', className)}>
      <div
        className={cn(
          'flex items-center justify-center transition-all duration-300',
          config.container,
          info.bgColor,
          size === 'lg' && glowClasses[levelKey] || ''
        )}
      >
        <span className={cn(config.text, info.color)}>
          {levelKey || '?'}
        </span>
      </div>
      {showLabel && (
        <div className="flex flex-col">
          <span className={cn('font-semibold', config.labelSize, info.color)}>
            {info.label}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {info.description}
          </span>
        </div>
      )}
    </div>
  )
}
