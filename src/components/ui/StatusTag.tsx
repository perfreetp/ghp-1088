import { cn } from '@/utils/helpers'
import { getStatusInfo, getSeverityInfo } from '@/utils/helpers'

type StatusTagSize = 'sm' | 'md' | 'lg'

interface StatusTagBaseProps {
  size?: StatusTagSize
  className?: string
}

interface StatusTagStatusProps extends StatusTagBaseProps {
  status: string
}

interface StatusTagCustomProps extends StatusTagBaseProps {
  label: string
  color?: string
  bgColor?: string
}

type StatusTagProps = StatusTagStatusProps | StatusTagCustomProps

const sizeClasses: Record<StatusTagSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
}

function isStatusProps(props: StatusTagProps): props is StatusTagStatusProps {
  return 'status' in props
}

export default function StatusTag(props: StatusTagProps) {
  const { size = 'md', className } = props

  let label: string
  let color: string
  let bgColor: string

  if (isStatusProps(props)) {
    const statusInfo = getStatusInfo(props.status)
    const severityInfo = getSeverityInfo(props.status)
    const info = statusInfo.label === props.status ? severityInfo : statusInfo

    label = info.label
    color = info.color
    bgColor = info.bgColor
  } else {
    label = props.label
    color = props.color || 'text-gray-700 dark:text-gray-400'
    bgColor = props.bgColor || 'bg-gray-100 dark:bg-gray-900/30'
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        'transition-colors duration-200',
        sizeClasses[size],
        bgColor,
        color,
        className
      )}
    >
      <span className="relative flex h-1.5 w-1.5 mr-1.5">
        <span
          className={cn(
            'absolute inline-flex h-full w-full rounded-full opacity-75',
            color.includes('emerald') && 'bg-emerald-400',
            color.includes('blue') && 'bg-blue-400',
            color.includes('amber') && 'bg-amber-400',
            color.includes('orange') && 'bg-orange-400',
            color.includes('red') && 'bg-red-400',
            !color.includes('emerald') &&
              !color.includes('blue') &&
              !color.includes('amber') &&
              !color.includes('orange') &&
              !color.includes('red') &&
              'bg-gray-400'
          )}
        />
        <span
          className={cn(
            'relative inline-flex h-1.5 w-1.5 rounded-full',
            color.includes('emerald') && 'bg-emerald-500',
            color.includes('blue') && 'bg-blue-500',
            color.includes('amber') && 'bg-amber-500',
            color.includes('orange') && 'bg-orange-500',
            color.includes('red') && 'bg-red-500',
            !color.includes('emerald') &&
              !color.includes('blue') &&
              !color.includes('amber') &&
              !color.includes('orange') &&
              !color.includes('red') &&
              'bg-gray-500'
          )}
        />
      </span>
      {label}
    </span>
  )
}
