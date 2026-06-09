import { cn } from '@/utils/helpers'
import { Check, Clock, Loader2 } from 'lucide-react'

type TimelineItemStatus = 'done' | 'current' | 'pending'

export interface TimelineItem {
  title: string
  time: string
  operator?: string
  description?: string
  status?: TimelineItemStatus
}

interface TimelineProps {
  items: TimelineItem[]
  className?: string
}

const statusConfig: Record<
  TimelineItemStatus,
  {
    dotWrapper: string
    dot: string
    icon: typeof Check
    line: string
  }
> = {
  done: {
    dotWrapper: 'bg-emerald-100 dark:bg-emerald-900/30',
    dot: 'bg-emerald-500',
    icon: Check,
    line: 'bg-emerald-200 dark:bg-emerald-800',
  },
  current: {
    dotWrapper: 'bg-blue-100 dark:bg-blue-900/30',
    dot: 'bg-blue-500',
    icon: Loader2,
    line: 'bg-slate-200 dark:bg-slate-700',
  },
  pending: {
    dotWrapper: 'bg-slate-100 dark:bg-slate-800',
    dot: 'bg-slate-400 dark:bg-slate-500',
    icon: Clock,
    line: 'bg-slate-200 dark:bg-slate-700',
  },
}

export default function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn('relative', className)}>
      <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-700" />

      <ol className="space-y-6">
        {items.map((item, index) => {
          const status: TimelineItemStatus = item.status || 'pending'
          const config = statusConfig[status]
          const Icon = config.icon
          const isLast = index === items.length - 1

          return (
            <li key={index} className="relative flex gap-4 pl-2">
              <div className="relative z-10 flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full ring-4 ring-white dark:ring-slate-900',
                    config.dotWrapper
                  )}
                >
                  <div
                    className={cn(
                      'flex h-5 w-5 items-center justify-center rounded-full',
                      config.dot,
                      status === 'current' && 'animate-pulse'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-3 w-3 text-white',
                        status === 'current' && 'animate-spin'
                      )}
                    />
                  </div>
                </div>
                {!isLast && (
                  <div
                    className={cn(
                      'mt-1 w-0.5 flex-1 min-h-[24px]',
                      status === 'done' ? config.line : 'bg-slate-200 dark:bg-slate-700'
                    )}
                  />
                )}
              </div>

              <div className="flex-1 pb-2">
                <div className="flex items-start justify-between gap-4">
                  <h4
                    className={cn(
                      'font-semibold text-base',
                      status === 'done' && 'text-slate-900 dark:text-slate-100',
                      status === 'current' && 'text-blue-700 dark:text-blue-400',
                      status === 'pending' && 'text-slate-500 dark:text-slate-400'
                    )}
                  >
                    {item.title}
                  </h4>
                  <span className="flex-shrink-0 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {item.time}
                  </span>
                </div>

                {item.operator && (
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    <span className="font-medium">{item.operator}</span>
                    {item.description && (
                      <span className="ml-2 text-slate-500 dark:text-slate-400">
                        {item.description}
                      </span>
                    )}
                  </p>
                )}

                {!item.operator && item.description && (
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {item.description}
                  </p>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
