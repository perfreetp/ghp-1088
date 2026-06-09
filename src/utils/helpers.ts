import { cn as cnUtils } from '@/lib/utils'

export { cnUtils as cn }

interface StyleInfo {
  color: string
  bgColor: string
}

interface RiskLevelInfo extends StyleInfo {
  label: string
  description: string
}

const riskLevelMap: Record<string, RiskLevelInfo> = {
  A: {
    color: 'text-emerald-700 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    label: 'A级',
    description: '低风险，信用优秀'
  },
  B: {
    color: 'text-blue-700 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    label: 'B级',
    description: '中低风险，信用良好'
  },
  C: {
    color: 'text-amber-700 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    label: 'C级',
    description: '中风险，信用一般'
  },
  D: {
    color: 'text-orange-700 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    label: 'D级',
    description: '中高风险，信用较差'
  },
  E: {
    color: 'text-red-700 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    label: 'E级',
    description: '高风险，信用很差'
  }
}

export function getRiskLevelInfo(level: string): RiskLevelInfo {
  const key = (level || '').toUpperCase()
  return riskLevelMap[key] || riskLevelMap.C
}

interface StatusInfo extends StyleInfo {
  label: string
}

const statusMap: Record<string, StatusInfo> = {
  pending: {
    color: 'text-amber-700 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    label: '待审核'
  },
  reviewing: {
    color: 'text-blue-700 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    label: '审核中'
  },
  approved: {
    color: 'text-emerald-700 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    label: '已通过'
  },
  rejected: {
    color: 'text-red-700 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    label: '已拒绝'
  },
  canceled: {
    color: 'text-gray-700 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-900/30',
    label: '已取消'
  },
  disbursed: {
    color: 'text-emerald-700 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    label: '已放款'
  },
  overdue: {
    color: 'text-red-700 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    label: '已逾期'
  },
  settled: {
    color: 'text-emerald-700 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    label: '已结清'
  }
}

export function getStatusInfo(status: string): StatusInfo {
  const key = (status || '').toLowerCase()
  return statusMap[key] || {
    color: 'text-gray-700 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-900/30',
    label: status || '未知'
  }
}

interface SeverityInfo extends StyleInfo {
  label: string
}

const severityMap: Record<string, SeverityInfo> = {
  critical: {
    color: 'text-red-700 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    label: '严重'
  },
  high: {
    color: 'text-orange-700 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    label: '高'
  },
  medium: {
    color: 'text-amber-700 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    label: '中'
  },
  low: {
    color: 'text-blue-700 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    label: '低'
  }
}

export function getSeverityInfo(severity: string): SeverityInfo {
  const key = (severity || '').toLowerCase()
  return severityMap[key] || severityMap.medium
}

export function getRandomId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)
}

export function getInitials(name: string): string {
  if (!name) return ''
  const trimmed = name.trim()
  if (!trimmed) return ''
  return trimmed.slice(0, 2)
}
