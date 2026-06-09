import { useState, useEffect } from 'react'
import {
  Wallet,
  Percent,
  AlertOctagon,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ArrowLeftRight,
  UserCheck,
  ExternalLink,
} from 'lucide-react'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts'
import { riskRules, hitRulesSummary } from '@/data/riskRules'
import { RiskBadge, ProgressBar, StatusTag } from '@/components/ui'
import { cn, getSeverityInfo } from '@/utils/helpers'
import { formatMoney } from '@/utils/format'
import type { RiskRule } from '@/data/riskRules'

type FilterTab = 'all' | 'critical' | 'high' | 'medium' | 'low'

const scoreRanges = [
  { level: 'A', min: 850, max: 1000, color: '#10b981' },
  { level: 'B', min: 750, max: 849, color: '#3b82f6' },
  { level: 'C', min: 650, max: 749, color: '#f59e0b' },
  { level: 'D', min: 550, max: 649, color: '#f97316' },
  { level: 'E', min: 0, max: 549, color: '#ef4444' },
]

const dimensionScores = [
  { name: '身份信息真实性', score: 92, warning: false },
  { name: '信用历史表现', score: 65, warning: true },
  { name: '偿债能力评估', score: 78, warning: false },
  { name: '工作稳定性', score: 85, warning: false },
  { name: '反欺诈检测', score: 71, warning: false },
  { name: '关联人风险', score: 88, warning: false },
]

const radarData = dimensionScores.map((d) => ({
  dimension: d.name,
  score: d.score,
  fullMark: 100,
}))

const filterTabs: { key: FilterTab; label: string; count: number }[] = [
  { key: 'all', label: '全部', count: hitRulesSummary.total },
  { key: 'critical', label: '严重', count: hitRulesSummary.critical },
  { key: 'high', label: '高', count: hitRulesSummary.high },
  { key: 'medium', label: '中', count: hitRulesSummary.medium },
  { key: 'low', label: '低', count: hitRulesSummary.low },
]

const summaryStats = [
  {
    severity: 'critical' as const,
    label: '严重规则',
    icon: AlertOctagon,
    count: hitRulesSummary.critical,
    total: riskRules.filter((r) => r.severity === 'critical').length,
  },
  {
    severity: 'high' as const,
    label: '高风险规则',
    icon: AlertTriangle,
    count: hitRulesSummary.high,
    total: riskRules.filter((r) => r.severity === 'high').length,
  },
  {
    severity: 'medium' as const,
    label: '中风险规则',
    icon: Info,
    count: hitRulesSummary.medium,
    total: riskRules.filter((r) => r.severity === 'medium').length,
  },
  {
    severity: 'low' as const,
    label: '低风险规则',
    icon: Info,
    count: hitRulesSummary.low,
    total: riskRules.filter((r) => r.severity === 'low').length,
  },
]

const rateTable = [
  { level: 'A级', range: '10.8-13.2%', current: false },
  { level: 'B级', range: '13.2-15.6%', current: false },
  { level: 'C级', range: '15.6-20.4%', current: true },
  { level: 'D级', range: '20.4-24.0%', current: false },
  { level: 'E级', range: '24.0%以上 或 拒绝', current: false },
]

function GaugeChart({ score }: { score: number }) {
  const min = 0
  const max = 1000
  const radius = 120
  const startAngle = 180
  const endAngle = 360
  const cx = 150
  const cy = 140

  const ratio = (score - min) / (max - min)
  const clampedRatio = Math.min(1, Math.max(0, ratio))
  const angle = startAngle + (endAngle - startAngle) * clampedRatio

  const polarToCartesian = (
    centerX: number,
    centerY: number,
    r: number,
    angleDeg: number
  ) => {
    const angleRad = ((angleDeg - 90) * Math.PI) / 180
    return {
      x: centerX + r * Math.cos(angleRad),
      y: centerY + r * Math.sin(angleRad),
    }
  }

  const describeArc = (
    centerX: number,
    centerY: number,
    r: number,
    start: number,
    end: number
  ) => {
    const startPoint = polarToCartesian(centerX, centerY, r, end)
    const endPoint = polarToCartesian(centerX, centerY, r, start)
    const largeArcFlag = end - start <= 180 ? '0' : '1'
    return `M ${startPoint.x} ${startPoint.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${endPoint.x} ${endPoint.y}`
  }

  const gradientStops = [
    { offset: '0%', color: '#10b981' },
    { offset: '25%', color: '#3b82f6' },
    { offset: '50%', color: '#f59e0b' },
    { offset: '75%', color: '#f97316' },
    { offset: '100%', color: '#ef4444' },
  ]

  const tickCount = 11
  const ticks = []
  for (let i = 0; i < tickCount; i++) {
    const tickAngle = startAngle + ((endAngle - startAngle) * i) / (tickCount - 1)
    const tickValue = Math.round(min + ((max - min) * i) / (tickCount - 1))
    const inner = polarToCartesian(cx, cy, radius - 10, tickAngle)
    const outer = polarToCartesian(cx, cy, radius, tickAngle)
    const labelPos = polarToCartesian(cx, cy, radius + 18, tickAngle)
    ticks.push(
      <g key={i}>
        <line
          x1={inner.x}
          y1={inner.y}
          x2={outer.x}
          y2={outer.y}
          stroke="#cbd5e1"
          strokeWidth="1.5"
        />
        {i % 2 === 0 && (
          <text
            x={labelPos.x}
            y={labelPos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-slate-500"
            fontSize="11"
            fontWeight="500"
          >
            {tickValue}
          </text>
        )}
      </g>
    )
  }

  const needleTip = polarToCartesian(cx, cy, radius - 18, angle)

  return (
    <div className="w-full flex justify-center">
      <svg width="320" height="170" viewBox="0 0 300 170">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            {gradientStops.map((stop, i) => (
              <stop key={i} offset={stop.offset} stopColor={stop.color} />
            ))}
          </linearGradient>
          <filter id="needleGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          d={describeArc(cx, cy, radius, startAngle, endAngle)}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="14"
          strokeLinecap="round"
        />

        <path
          d={describeArc(cx, cy, radius, startAngle, startAngle + (endAngle - startAngle) * clampedRatio)}
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="14"
          strokeLinecap="round"
        />

        {ticks}

        <g filter="url(#needleGlow)">
          <line
            x1={cx}
            y1={cy}
            x2={needleTip.x}
            y2={needleTip.y}
            stroke="#ef4444"
            strokeWidth="4"
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <circle cx={cx} cy={cy} r="10" fill="#ef4444" />
          <circle cx={cx} cy={cy} r="5" fill="#fff" />
        </g>
      </svg>
    </div>
  )
}

function AnimatedNumber({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let startTime: number | null = null
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setValue(Math.floor(easeOut * target))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [target, duration])

  return <>{value.toLocaleString()}</>
}

export default function Scoring() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')
  const [expandedRules, setExpandedRules] = useState<Set<string>>(new Set())

  const hitRules = riskRules.filter((r) => r.hit)

  const filteredRules =
    activeFilter === 'all'
      ? hitRules
      : hitRules.filter((r) => r.severity === activeFilter)

  const toggleRuleExpand = (id: string) => {
    setExpandedRules((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const minLimit = 50000
  const maxLimit = 120000
  const suggested = 80000
  const limitProgress = ((suggested - minLimit) / (maxLimit - minLimit)) * 100

  return (
    <div className="page-fade-enter space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">风险评分详情</h1>
          <p className="mt-1 text-sm text-slate-500">AI风控模型综合评估结果</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-700">
              <UserCheck className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-800">张伟</div>
              <div className="text-xs text-slate-500">LN20260515008</div>
            </div>
            <div className="ml-2">
              <RiskBadge level="C" size="sm" />
            </div>
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
            <RefreshCw className="h-4 w-4" />
            重新评分
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="card-base p-6">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-800">综合风险评分</h2>
            </div>

            <GaugeChart score={675} />

            <div className="mt-2 flex flex-col items-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                <AnimatedNumber target={675} />
              </div>
              <div className="mt-1 text-sm text-slate-500">综合风险分</div>
              <div className="mt-3">
                <RiskBadge level="C" size="md" showLabel />
              </div>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-4">
              <div className="grid grid-cols-5 gap-2 text-center">
                {scoreRanges.map((range) => (
                  <div key={range.level} className="space-y-1">
                    <div
                      className="mx-auto h-6 w-6 rounded-md flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: range.color }}
                    >
                      {range.level}
                    </div>
                    <div className="text-[10px] text-slate-500 leading-tight">
                      {range.min}-{range.max}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card-base p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <Wallet className="h-4 w-4" />
                </div>
                <h2 className="text-base font-semibold text-slate-800">授信额度建议</h2>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                ¥80,000
              </div>
              <div className="mt-1 text-xs text-slate-500">建议授信额度</div>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span>最低 ¥50,000</span>
                <span className="text-slate-600 font-medium">建议区间</span>
                <span>最高 ¥120,000</span>
              </div>
              <div className="relative h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-700"
                  style={{ width: `${limitProgress}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white border-2 border-emerald-500 shadow-md transition-all duration-700"
                  style={{ left: `calc(${limitProgress}% - 8px)` }}
                />
              </div>
            </div>

            <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs text-slate-500">月均收入</span>
                <span className="text-xs font-medium text-slate-700 text-right">
                  ¥18,500
                  <span className="ml-2 text-emerald-600">月供上限 ¥6,475</span>
                </span>
              </div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs text-slate-500">负债计算</span>
                <span className="text-xs font-medium text-slate-700 text-right">
                  现有负债 ¥2,300
                  <span className="ml-2 text-amber-600">剩余可承担 ¥4,175</span>
                </span>
              </div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs text-slate-500">期限建议</span>
                <span className="text-xs font-medium text-slate-700">12个月</span>
              </div>
            </div>
          </div>

          <div className="card-base p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <Percent className="h-4 w-4" />
                </div>
                <h2 className="text-base font-semibold text-slate-800">定价利率建议</h2>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                年化 18.5%
              </div>
              <div className="mt-1 text-xs text-slate-500">建议年化利率</div>
            </div>

            <div className="mt-5 space-y-1.5 border-t border-slate-100 pt-4">
              {rateTable.map((row) => (
                <div
                  key={row.level}
                  className={cn(
                    'flex items-center justify-between rounded-lg px-3 py-2 transition-colors',
                    row.current
                      ? 'bg-blue-50 ring-2 ring-blue-400/40'
                      : 'hover:bg-slate-50'
                  )}
                >
                  <span
                    className={cn(
                      'text-sm font-semibold',
                      row.current ? 'text-blue-700' : 'text-slate-600'
                    )}
                  >
                    {row.level}
                  </span>
                  <span
                    className={cn(
                      'text-xs',
                      row.current ? 'text-blue-600 font-medium' : 'text-slate-500'
                    )}
                  >
                    {row.range}
                    {row.current && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-blue-500 px-1.5 py-0.5 text-[10px] font-medium text-white">
                        当前
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-2 space-y-6">
          <div className="card-base p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-800">命中规则统计</h2>
              <span className="text-xs text-slate-500">
                共 {riskRules.length} 条规则，命中 {hitRulesSummary.total} 条
              </span>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {summaryStats.map((stat) => {
                const info = getSeverityInfo(stat.severity)
                const Icon = stat.icon
                return (
                  <div
                    key={stat.severity}
                    className={cn(
                      'rounded-xl p-4 border transition-all',
                      stat.count > 0
                        ? cn(info.bgColor, 'border-transparent')
                        : 'bg-slate-50 border-slate-100'
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-lg',
                          stat.count > 0
                            ? cn(info.bgColor, info.color)
                            : 'bg-slate-100 text-slate-400'
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <StatusTag status={stat.severity} size="sm" />
                    </div>
                    <div className="mt-3">
                      <div
                        className={cn(
                          'text-2xl font-bold',
                          stat.count > 0 ? info.color : 'text-slate-400'
                        )}
                      >
                        {stat.count}
                        <span className="ml-1 text-sm font-normal text-slate-500">
                          / {stat.total}
                        </span>
                      </div>
                      <div
                        className={cn(
                          'mt-0.5 text-xs',
                          stat.count > 0 ? 'text-slate-600' : 'text-slate-400'
                        )}
                      >
                        {stat.label}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="card-base overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-800">命中风控规则详情</h2>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {filterTabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveFilter(tab.key)}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200',
                      activeFilter === tab.key
                        ? 'bg-primary-700 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    )}
                  >
                    {tab.label}
                    <span
                      className={cn(
                        'inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold',
                        activeFilter === tab.key
                          ? 'bg-white/20 text-white'
                          : 'bg-white text-slate-500'
                      )}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="max-h-[600px] overflow-y-auto divide-y divide-slate-100">
              {filteredRules.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <Info className="h-6 w-6" />
                  </div>
                  <p className="mt-3 text-sm text-slate-500">暂无命中规则</p>
                </div>
              ) : (
                filteredRules.map((rule: RiskRule) => {
                  const sevInfo = getSeverityInfo(rule.severity)
                  const isExpanded = expandedRules.has(rule.id)
                  const barColor =
                    rule.severity === 'critical'
                      ? 'bg-red-500'
                      : rule.severity === 'high'
                      ? 'bg-orange-500'
                      : rule.severity === 'medium'
                      ? 'bg-amber-500'
                      : 'bg-blue-500'

                  return (
                    <div
                      key={rule.id}
                      className="flex transition-colors hover:bg-slate-50/50"
                    >
                      <div className="flex flex-col items-center py-4 pl-4 pr-2">
                        <div
                          className={cn(
                            'w-2 rounded-full min-h-[48px]',
                            isExpanded ? 'h-full' : 'h-12',
                            barColor
                          )}
                        />
                      </div>

                      <div className="flex-1 py-4 pr-4">
                        <div
                          className="flex cursor-pointer items-start justify-between gap-4"
                          onClick={() => toggleRuleExpand(rule.id)}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-semibold text-slate-800 truncate">
                                {rule.ruleName}
                              </h3>
                              <span className="text-xs text-slate-400 font-mono shrink-0">
                                {rule.ruleCode}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-slate-500 line-clamp-1">
                              {rule.description}
                            </p>
                            {isExpanded && (
                              <div className="mt-4 space-y-3 rounded-xl bg-slate-50 p-4 border border-slate-100">
                                <div>
                                  <div className="text-xs font-semibold text-slate-700 mb-1">
                                    规则详情说明
                                  </div>
                                  <div className="text-xs text-slate-600 leading-relaxed">
                                    {rule.description}该规则用于评估{rule.category}维度的{rule.dimension}指标。
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <div className="text-xs font-semibold text-slate-700 mb-1">
                                      命中原因
                                    </div>
                                    <div className="text-xs text-slate-600">
                                      实际值：
                                      <span className="font-medium text-red-600">
                                        {rule.hitValue || '未达标'}
                                      </span>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-xs font-semibold text-slate-700 mb-1">
                                      阈值要求
                                    </div>
                                    <div className="text-xs text-slate-600">
                                      {rule.threshold || '未设置'}
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs font-semibold text-slate-700 mb-1">
                                    建议处理方式
                                  </div>
                                  <div
                                    className={cn(
                                      'text-xs leading-relaxed rounded-lg px-3 py-2',
                                      sevInfo.bgColor,
                                      sevInfo.color
                                    )}
                                  >
                                    {rule.suggest || '建议人工复核'}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-sm font-bold text-red-600 whitespace-nowrap">
                              -{rule.score}分
                            </span>
                            <div
                              className={cn(
                                'flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors',
                                isExpanded && 'bg-slate-100 text-slate-600'
                              )}
                            >
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          <div className="card-base p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-800">评分模型维度分析</h2>
                <p className="mt-0.5 text-xs text-slate-500">六大维度综合评估结果</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis
                      dataKey="dimension"
                      tick={{ fontSize: 11, fill: '#64748b' }}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={{ fontSize: 10, fill: '#94a3b8' }}
                      tickCount={5}
                    />
                    <Radar
                      name="评分"
                      dataKey="score"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fill="#3b82f6"
                      fillOpacity={0.25}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4 py-2">
                {dimensionScores.map((dim) => (
                  <div key={dim.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-slate-700">{dim.name}</span>
                      <span
                        className={cn(
                          'text-sm font-bold',
                          dim.warning ? 'text-orange-600' : 'text-slate-800'
                        )}
                      >
                        {dim.score}%
                      </span>
                    </div>
                    <ProgressBar
                      value={dim.score}
                      color={dim.warning ? 'amber' : 'emerald'}
                      height={8}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
        <a
          href="#"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-700 hover:text-primary-800 transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          查看评分模型详情
        </a>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
            <ArrowLeftRight className="h-4 w-4" />
            退回重新核验
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl bg-primary-700 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary-800 transition-colors">
            <UserCheck className="h-4 w-4" />
            进入人工审核
          </button>
        </div>
      </div>
    </div>
  )
}
