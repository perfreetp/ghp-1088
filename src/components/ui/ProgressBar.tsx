import { cn } from '@/utils/helpers'

type ProgressColor = 'emerald' | 'blue' | 'amber' | 'red' | 'primary'

interface ProgressBarProps {
  value: number
  color?: ProgressColor
  showLabel?: boolean
  height?: number
  striped?: boolean
  animated?: boolean
  className?: string
}

const colorClasses: Record<ProgressColor, string> = {
  emerald: 'bg-emerald-500',
  blue: 'bg-blue-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
  primary: 'bg-primary-500',
}

export default function ProgressBar({
  value,
  color = 'primary',
  showLabel = false,
  height = 8,
  striped = false,
  animated = false,
  className,
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value))
  const roundedValue = Math.round(clampedValue)

  return (
    <div className={cn('flex items-center gap-3 w-full', className)}>
      <div
        className={cn(
          'relative flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700/50'
        )}
        style={{ height: `${height}px` }}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            colorClasses[color],
            striped && [
              'bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)]',
              'bg-[length:1rem_1rem]',
            ],
            animated && 'animate-[progress_1.5s_linear_infinite]'
          )}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showLabel && (
        <span
          className={cn(
            'font-mono text-sm font-semibold whitespace-nowrap',
            color === 'emerald' && 'text-emerald-600 dark:text-emerald-400',
            color === 'blue' && 'text-blue-600 dark:text-blue-400',
            color === 'amber' && 'text-amber-600 dark:text-amber-400',
            color === 'red' && 'text-red-600 dark:text-red-400',
            color === 'primary' && 'text-primary-600 dark:text-primary-400'
          )}
        >
          {roundedValue}%
        </span>
      )}
    </div>
  )
}
