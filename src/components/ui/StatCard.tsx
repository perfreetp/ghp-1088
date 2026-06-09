import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/utils/helpers'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: string
  trendUp?: boolean
  gradient?: string
}

const defaultGradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
]

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp = true,
  gradient,
}: StatCardProps) {
  const bgGradient = gradient || defaultGradients[Math.floor(Math.random() * defaultGradients.length)]

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl p-6 shadow-lg',
        'transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl'
      )}
      style={{ background: bgGradient }}
    >
      <div
        className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute -bottom-20 -right-12 h-40 w-40 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-white/70">{title}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>

      <div className="relative z-10 mt-5">
        <p className="font-mono text-2xl font-bold text-white md:text-3xl">
          {value}
        </p>
      </div>

      {trend && (
        <div className="relative z-10 mt-4 flex items-center gap-1.5">
          {trendUp ? (
            <TrendingUp className="h-4 w-4 text-emerald-200" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-200" />
          )}
          <span
            className={cn(
              'text-sm font-semibold',
              trendUp ? 'text-emerald-200' : 'text-red-200'
            )}
          >
            {trend}
          </span>
          <span className="text-xs text-white/50">较上期</span>
        </div>
      )}
    </div>
  )
}
