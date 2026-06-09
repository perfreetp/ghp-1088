import { useState, useMemo } from 'react'
import {
  RefreshCw,
  Download,
  FileSpreadsheet,
  FileText,
  Settings2,
  FileText as FileTextIcon,
  CheckCircle2,
  Wallet,
  Percent,
  AlertTriangle,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon,
  ScatterChart as ScatterChartIcon,
  Layers,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
  ReferenceLine,
  ComposedChart,
  Area,
} from 'recharts'
import {
  channelStats,
  cityStats,
  productStats,
  reportSummary,
  channelRiskLevels,
  funnelSteps,
  monthlyRiskDists,
  comparisonMetrics,
  cityHeatmap,
} from '@/data/reports'
import { StatCard, DataTable, RiskBadge } from '@/components/ui'
import { formatMoney } from '@/utils/format'
import { cn, getRiskLevelInfo } from '@/utils/helpers'
import type { DataTableColumn } from '@/components/ui'
import type { ChannelStat, CityStat, ProductStat } from '@/data/reports'

const TIME_OPTIONS = ['本月', '上月', '本季度', '今年', '自定义'] as const
const CHANNEL_OPTIONS = ['全部渠道', '线上APP', '合作门店', '电话营销', '线下推广', '老客户推荐', '第三方导流'] as const
const CITY_OPTIONS = ['全部城市', 'Top10城市'] as const
const PRODUCT_OPTIONS = ['全部产品', '消费贷', '经营贷', '装修贷', '教育贷', '医疗贷'] as const
const TABS = ['渠道分析', '城市分析', '产品分析', '综合对比'] as const

const TAB_ICONS = [BarChart3, BarChart3, PieChartIcon, Layers]

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444']
const RISK_COLORS: Record<string, string> = {
  A: '#10b981',
  B: '#3b82f6',
  C: '#f59e0b',
  D: '#f97316',
  E: '#ef4444',
}

function pct(num: number, decimals = 1): string {
  return `${num.toFixed(decimals)}%`
}

function formatWan(num: number): string {
  if (num >= 100000000) return `¥${(num / 100000000).toFixed(2)}亿`
  if (num >= 10000) return `¥${(num / 10000).toFixed(1)}万`
  return `¥${num.toLocaleString()}`
}

function formatAmountShort(num: number): string {
  if (num >= 100000000) return `${(num / 100000000).toFixed(1)}亿`
  if (num >= 10000) return `${(num / 10000).toFixed(0)}万`
  return num.toLocaleString()
}

function getHeatmapColor(value: number, max: number): string {
  const ratio = value / max
  if (ratio > 0.7) return 'bg-primary-600 text-white'
  if (ratio > 0.4) return 'bg-primary-400 text-white'
  if (ratio > 0.2) return 'bg-primary-200 text-primary-800'
  return 'bg-primary-50 text-primary-700'
}

export default function Reports() {
  const [timeRange, setTimeRange] = useState<(typeof TIME_OPTIONS)[number]>('本月')
  const [channelFilter, setChannelFilter] = useState<(typeof CHANNEL_OPTIONS)[number]>('全部渠道')
  const [cityFilter, setCityFilter] = useState<(typeof CITY_OPTIONS)[number]>('全部城市')
  const [productFilter, setProductFilter] = useState<(typeof PRODUCT_OPTIONS)[number]>('全部产品')
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>('渠道分析')
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [dateFrom, setDateFrom] = useState('2026-06-01')
  const [dateTo, setDateTo] = useState('2026-06-09')

  const totalApplyCount = useMemo(
    () => channelStats.reduce((s, c) => s + c.applyCount, 0),
    []
  )

  const channelBarData = useMemo(() => {
    return channelStats.map((c) => ({
      name: c.channel,
      申请量: c.applyCount,
      通过量: c.approveCount,
      放款额: Math.round(c.approveAmount / 10000),
    }))
  }, [])

  const channelTableData = useMemo(() => {
    return channelStats.map((c) => {
      const risk = channelRiskLevels.find((r) => r.channel === c.channel)
      const total = c.applyCount
      return {
        ...c,
        rejectCount: c.applyCount - c.approveCount,
        applyRatio: (c.applyCount / totalApplyCount) * 100,
        levelA: risk?.levelA ?? 0,
        levelB: risk?.levelB ?? 0,
        levelC: risk?.levelC ?? 0,
        levelD: risk?.levelD ?? 0,
        levelE: risk?.levelE ?? 0,
        avgRate: risk?.avgRate ?? 0,
        _total: total,
      }
    })
  }, [totalApplyCount])

  const channelTableTotals = useMemo(() => {
    const t = channelTableData.reduce(
      (acc, r) => {
        acc.applyCount += r.applyCount
        acc.approveCount += r.approveCount
        acc.rejectCount += r.rejectCount
        acc.approveAmount += r.approveAmount
        acc.levelA += r.levelA
        acc.levelB += r.levelB
        acc.levelC += r.levelC
        acc.levelD += r.levelD
        acc.levelE += r.levelE
        return acc
      },
      { applyCount: 0, approveCount: 0, rejectCount: 0, approveAmount: 0, levelA: 0, levelB: 0, levelC: 0, levelD: 0, levelE: 0 }
    )
    return t
  }, [channelTableData])

  const overdueBarData = useMemo(() => {
    return [...channelStats]
      .map((c) => ({ name: c.channel, 逾期率: c.overdueRate }))
      .sort((a, b) => a.逾期率 - b.逾期率)
  }, [])

  const cityBarData = useMemo(() => {
    return [...cityStats]
      .sort((a, b) => b.applyAmount - a.applyAmount)
      .map((c) => ({
        name: c.city,
        申请金额: Math.round(c.applyAmount / 10000),
        放款金额: Math.round(c.approveAmount / 10000),
      }))
  }, [])

  const cityTableData = useMemo(() => {
    return cityStats.map((c) => {
      const total = c.riskLevelA + c.riskLevelB + c.riskLevelC + c.riskLevelD + c.riskLevelE
      const de = c.riskLevelD + c.riskLevelE
      return {
        ...c,
        aRatio: total > 0 ? (c.riskLevelA / total) * 100 : 0,
        deRatio: total > 0 ? (de / total) * 100 : 0,
      }
    })
  }, [])

  const pieData = useMemo(() => {
    return productStats.map((p) => ({
      name: p.product,
      value: p.approveAmount,
      ratio: reportSummary.totalApproveAmount > 0 ? (p.approveAmount / reportSummary.totalApproveAmount) * 100 : 0,
    }))
  }, [])

  const scatterData = useMemo(() => {
    return productStats.map((p) => ({
      name: p.product,
      利率: p.avgRate,
      逾期率: p.overdueRate,
      放款额: p.approveAmount,
    }))
  }, [])

  const heatmapMaxValue = useMemo(() => {
    let max = 0
    cityHeatmap.forEach((r) => r.cities.forEach((c) => (max = Math.max(max, c.value))))
    return max
  }, [])

  const channelColumns: DataTableColumn<any>[] = [
    {
      key: 'channel',
      title: '渠道名称',
      width: 110,
      render: (r) => <span className="font-semibold text-slate-800">{r.channel}</span>,
    },
    {
      key: 'applyCount',
      title: '申请量',
      width: 85,
      align: 'right',
      render: (r) => <span className="font-mono">{r.applyCount.toLocaleString()}</span>,
    },
    {
      key: 'applyRatio',
      title: '占比',
      width: 75,
      align: 'right',
      render: (r) => <span className="font-mono text-slate-600">{pct(r.applyRatio)}</span>,
    },
    {
      key: 'approveCount',
      title: '通过量',
      width: 85,
      align: 'right',
      render: (r) => <span className="font-mono text-emerald-600">{r.approveCount.toLocaleString()}</span>,
    },
    {
      key: 'approveRate',
      title: '通过率',
      width: 75,
      align: 'right',
      render: (r) => <span className="font-mono">{pct(r.approveRate)}</span>,
    },
    {
      key: 'rejectCount',
      title: '拒绝量',
      width: 85,
      align: 'right',
      render: (r) => <span className="font-mono text-red-500">{r.rejectCount.toLocaleString()}</span>,
    },
    {
      key: 'approveAmount',
      title: '放款金额',
      width: 100,
      align: 'right',
      render: (r) => <span className="font-mono font-semibold">{formatWan(r.approveAmount)}</span>,
    },
    {
      key: 'avgApproveAmount',
      title: '平均金额',
      width: 100,
      align: 'right',
      render: (r) => <span className="font-mono">{formatWan(r.avgApproveAmount)}</span>,
    },
    {
      key: 'avgRate',
      title: '平均利率',
      width: 80,
      align: 'right',
      render: (r) => <span className="font-mono">{pct(r.avgRate)}</span>,
    },
    {
      key: 'overdueRate',
      title: '逾期率',
      width: 75,
      align: 'right',
      render: (r) => (
        <span className={cn('font-mono font-semibold', r.overdueRate > 15 ? 'text-red-600' : r.overdueRate > 10 ? 'text-orange-600' : 'text-slate-700')}>
          {pct(r.overdueRate)}
        </span>
      ),
    },
    {
      key: 'riskLevels',
      title: '风险等级分布(A/B/C/D/E)',
      width: 200,
      render: (r) => (
        <div className="flex items-center gap-1.5">
          {(['levelA', 'levelB', 'levelC', 'levelD', 'levelE'] as const).map((k, i) => {
            const level = ['A', 'B', 'C', 'D', 'E'][i]
            const count = r[k]
            return (
              <div
                key={k}
                className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs"
                style={{ backgroundColor: `${RISK_COLORS[level]}15`, color: RISK_COLORS[level] }}
                title={`${level}级: ${count}`}
              >
                <span className="font-bold">{level}</span>
                <span className="font-mono">{count}</span>
              </div>
            )
          })}
        </div>
      ),
    },
  ]

  const cityColumns: DataTableColumn<CityStat & { aRatio: number; deRatio: number }>[] = [
    { key: 'city', title: '城市', width: 80, render: (r) => <span className="font-semibold text-slate-800">{r.city}</span> },
    {
      key: 'applyCount',
      title: '申请数',
      width: 80,
      align: 'right',
      render: (r) => <span className="font-mono">{r.applyCount.toLocaleString()}</span>,
    },
    {
      key: 'approveRate',
      title: '通过率',
      width: 80,
      align: 'right',
      render: (r) => <span className="font-mono">{pct(r.approveRate)}</span>,
    },
    {
      key: 'approveAmount',
      title: '放款总额',
      width: 110,
      align: 'right',
      render: (r) => <span className="font-mono font-semibold">{formatWan(r.approveAmount)}</span>,
    },
    {
      key: 'avgAmount',
      title: '笔均金额',
      width: 110,
      align: 'right',
      render: (r) => <span className="font-mono">{r.approveCount > 0 ? formatWan(r.approveAmount / r.approveCount) : '-'}</span>,
    },
    {
      key: 'aRatio',
      title: 'A级占比',
      width: 85,
      align: 'right',
      render: (r) => <span className="font-mono text-emerald-600 font-semibold">{pct(r.aRatio)}</span>,
    },
    {
      key: 'deRatio',
      title: 'D+E级占比',
      width: 95,
      align: 'right',
      render: (r) => <span className="font-mono text-red-600 font-semibold">{pct(r.deRatio)}</span>,
    },
    {
      key: 'overdueRate',
      title: '逾期率',
      width: 80,
      align: 'right',
      render: (r) => (
        <span className="font-mono">
          {r.city === '重庆' ? pct(8.5) : r.city === '西安' ? pct(7.2) : r.city === '深圳' ? pct(6.8) : r.city === '成都' ? pct(6.5) : pct(5 + Math.random() * 1.5)}
        </span>
      ),
    },
  ]

  const productColumns: DataTableColumn<ProductStat>[] = [
    { key: 'product', title: '产品名称', width: 90, render: (r) => <span className="font-semibold text-slate-800">{r.product}</span> },
    {
      key: 'approveCount',
      title: '笔数',
      width: 80,
      align: 'right',
      render: (r) => <span className="font-mono">{r.approveCount.toLocaleString()}</span>,
    },
    {
      key: 'approveAmount',
      title: '放款总额',
      width: 110,
      align: 'right',
      render: (r) => <span className="font-mono font-semibold">{formatWan(r.approveAmount)}</span>,
    },
    {
      key: 'avgTerm',
      title: '平均期限',
      width: 85,
      align: 'right',
      render: (r) => <span className="font-mono">{r.avgTerm}期</span>,
    },
    {
      key: 'avgRate',
      title: '平均利率',
      width: 80,
      align: 'right',
      render: (r) => <span className="font-mono text-blue-600 font-semibold">{pct(r.avgRate)}</span>,
    },
    {
      key: 'avgAmount',
      title: '笔均金额',
      width: 110,
      align: 'right',
      render: (r) => <span className="font-mono">{r.approveCount > 0 ? formatWan(r.approveAmount / r.approveCount) : '-'}</span>,
    },
    {
      key: 'overdueAmount',
      title: '逾期金额',
      width: 110,
      align: 'right',
      render: (r) => <span className="font-mono text-orange-600">{formatWan(r.approveAmount * r.overdueRate / 100)}</span>,
    },
    {
      key: 'overdueRate',
      title: '逾期率',
      width: 75,
      align: 'right',
      render: (r) => (
        <span className={cn('font-mono font-semibold', r.overdueRate > 14 ? 'text-red-600' : r.overdueRate > 10 ? 'text-orange-600' : 'text-slate-700')}>
          {pct(r.overdueRate)}
        </span>
      ),
    },
    {
      key: 'expectedReturn',
      title: '预估收益率',
      width: 90,
      align: 'right',
      render: (r) => <span className="font-mono text-emerald-600 font-semibold">{pct(r.avgRate - r.overdueRate * 0.4)}</span>,
    },
  ]

  return (
    <div className="page-fade-enter space-y-6">
      {/* 页面头部 */}
      <div className="card-base p-6">
        <div className="flex flex-col gap-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">风险数据分析</h1>
              <p className="mt-1 text-sm text-slate-500">多维度分析贷款风险表现，辅助经营决策</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-colors">
                <RefreshCw className="h-4 w-4" />
                刷新
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  导出
                  <ChevronDown className={cn('h-4 w-4 transition-transform', showExportMenu && 'rotate-180')} />
                </button>
                {showExportMenu && (
                  <div className="absolute right-0 top-12 z-20 w-48 rounded-xl border border-slate-200 bg-white py-2 shadow-xl">
                    <button className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                      <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                      导出Excel
                    </button>
                    <button className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                      <FileText className="h-4 w-4 text-red-500" />
                      导出PDF
                    </button>
                    <div className="my-1 border-t border-slate-100" />
                    <button className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                      <Settings2 className="h-4 w-4 text-slate-500" />
                      自定义报表
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-500">时间范围</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="h-10 rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-700 shadow-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
              >
                {TIME_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            {timeRange === '自定义' && (
              <div className="flex items-end gap-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-500">开始日期</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="h-10 rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-700 shadow-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
                  />
                </div>
                <span className="pb-2.5 text-slate-400">~</span>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-500">结束日期</label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="h-10 rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-700 shadow-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
                  />
                </div>
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-500">渠道筛选</label>
              <select
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value as any)}
                className="h-10 rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-700 shadow-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
              >
                {CHANNEL_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-500">城市筛选</label>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value as any)}
                className="h-10 rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-700 shadow-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
              >
                {CITY_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-500">产品筛选</label>
              <select
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value as any)}
                className="h-10 rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-700 shadow-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
              >
                {PRODUCT_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* KPI汇总卡片 */}
      <div className="grid grid-cols-5 gap-6">
        <StatCard
          title="总申请量"
          value="4,856笔"
          icon={FileTextIcon}
          trend="+8.2%"
          trendUp={true}
          gradient="linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)"
        />
        <StatCard
          title="审批通过量"
          value="3,182笔"
          icon={CheckCircle2}
          trend="+2.1% 通过率65.5%"
          trendUp={true}
          gradient="linear-gradient(135deg, #34d399 0%, #10b981 100%)"
        />
        <StatCard
          title="实际放款额"
          value="¥5.18亿"
          icon={Wallet}
          trend="+11.5%"
          trendUp={true}
          gradient="linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%)"
        />
        <StatCard
          title="平均利率"
          value="17.8%"
          icon={Percent}
          trend="-0.3%"
          trendUp={false}
          gradient="linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)"
        />
        <StatCard
          title="当期逾期率"
          value="6.82%"
          icon={AlertTriangle}
          trend="+0.5%"
          trendUp={false}
          gradient="linear-gradient(135deg, #fb923c 0%, #f97316 100%)"
        />
      </div>

      {/* Tab切换 */}
      <div className="card-base">
        <div className="border-b border-slate-200 px-2 pt-2">
          <div className="flex gap-1">
            {TABS.map((tab, idx) => {
              const Icon = TAB_ICONS[idx]
              const isActive = activeTab === tab
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'relative inline-flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all duration-200 rounded-t-lg',
                    isActive
                      ? 'text-primary-700 bg-primary-50/60'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  )}
                >
                  <Icon className={cn('h-4.5 w-4.5', isActive && 'text-primary-600')} />
                  {tab}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t-full" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Tab 1: 渠道分析 */}
          {activeTab === '渠道分析' && (
            <>
              <div className="card-base p-6">
                <h3 className="mb-4 text-base font-semibold text-slate-800">核心指标对比</h3>
                <div className="h-[360px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={channelBarData} margin={{ top: 10, right: 50, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
                      <YAxis
                        yAxisId="left"
                        tick={{ fontSize: 12, fill: '#64748b' }}
                        tickLine={false}
                        axisLine={{ stroke: '#e2e8f0' }}
                        label={{ value: '笔数', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#64748b' } }}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        tick={{ fontSize: 12, fill: '#64748b' }}
                        tickLine={false}
                        axisLine={{ stroke: '#e2e8f0' }}
                        label={{ value: '放款额(万)', angle: 90, position: 'insideRight', style: { fontSize: 12, fill: '#64748b' } }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                          fontSize: '12px',
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} iconType="circle" />
                      <Bar yAxisId="left" dataKey="申请量" fill="#60a5fa" radius={[4, 4, 0, 0]} barSize={28} />
                      <Bar yAxisId="left" dataKey="通过量" fill="#34d399" radius={[4, 4, 0, 0]} barSize={28} />
                      <Area yAxisId="right" type="monotone" dataKey="放款额" name="放款额(万)" stroke="#f59e0b" fill="url(#colorLoan)" strokeWidth={2.5} />
                      <defs>
                        <linearGradient id="colorLoan" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card-base">
                <div className="px-6 pt-6">
                  <h3 className="text-base font-semibold text-slate-800">渠道详细数据</h3>
                </div>
                <div className="p-6 pt-4">
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          {channelColumns.map((col) => (
                            <th
                              key={col.key}
                              style={{ width: col.width }}
                              className={cn(
                                'px-4 py-3 text-left font-semibold text-slate-700 whitespace-nowrap',
                                col.align === 'center' && 'text-center',
                                col.align === 'right' && 'text-right'
                              )}
                            >
                              {col.title}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {channelTableData.map((row, idx) => (
                          <tr
                            key={row.channel}
                            className={cn(
                              'border-b border-slate-100 transition-colors hover:bg-slate-50',
                              idx % 2 === 1 && 'bg-slate-50/30'
                            )}
                          >
                            {channelColumns.map((col) => (
                              <td
                                key={col.key}
                                className={cn(
                                  'px-4 py-3 text-slate-700 whitespace-nowrap',
                                  col.align === 'center' && 'text-center',
                                  col.align === 'right' && 'text-right'
                                )}
                              >
                                {col.render ? col.render(row, idx) : (row as any)[col.key]}
                              </td>
                            ))}
                          </tr>
                        ))}
                        <tr className="bg-primary-50/60 font-semibold border-t-2 border-primary-200">
                          <td className="px-4 py-3 text-slate-800">合计</td>
                          <td className="px-4 py-3 text-right font-mono">{channelTableTotals.applyCount.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right font-mono text-slate-600">100.0%</td>
                          <td className="px-4 py-3 text-right font-mono text-emerald-600">{channelTableTotals.approveCount.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right font-mono">{pct(reportSummary.totalApproveRate)}</td>
                          <td className="px-4 py-3 text-right font-mono text-red-500">{channelTableTotals.rejectCount.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right font-mono">{formatWan(channelTableTotals.approveAmount)}</td>
                          <td className="px-4 py-3 text-right font-mono">{formatWan(channelTableTotals.approveAmount / channelTableTotals.approveCount)}</td>
                          <td className="px-4 py-3 text-right font-mono">17.8%</td>
                          <td className="px-4 py-3 text-right font-mono text-orange-600">6.82%</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              {(['A', 'B', 'C', 'D', 'E'] as const).map((lvl, i) => {
                                const k = `level${lvl}` as const
                                const counts = [channelTableTotals.levelA, channelTableTotals.levelB, channelTableTotals.levelC, channelTableTotals.levelD, channelTableTotals.levelE]
                                return (
                                  <div
                                    key={lvl}
                                    className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs"
                                    style={{ backgroundColor: `${RISK_COLORS[lvl]}15`, color: RISK_COLORS[lvl] }}
                                  >
                                    <span className="font-bold">{lvl}</span>
                                    <span className="font-mono">{counts[i]}</span>
                                  </div>
                                )
                              })}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="card-base p-6">
                <h3 className="mb-4 text-base font-semibold text-slate-800">渠道逾期率对比</h3>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={overdueBarData} layout="vertical" margin={{ top: 10, right: 60, left: 30, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={true} vertical={false} />
                      <XAxis type="number" domain={[0, 25]} tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} tickFormatter={(v) => `${v}%`} />
                      <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
                      <Tooltip
                        formatter={(v: number) => [`${v}%`, '逾期率']}
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                          fontSize: '12px',
                        }}
                      />
                      <ReferenceLine x={6.82} yAxisId={0} stroke="#ef4444" strokeDasharray="6 4" strokeWidth={2} label={{ value: '警戒线 6.82%', position: 'top', fill: '#ef4444', fontSize: 11, fontWeight: 600 }} />
                      <Bar dataKey="逾期率" radius={[0, 6, 6, 0]} barSize={28}>
                        {overdueBarData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.逾期率 > 15 ? '#ef4444' : entry.逾期率 > 10 ? '#f97316' : entry.逾期率 > 6.82 ? '#f59e0b' : '#34d399'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}

          {/* Tab 2: 城市分析 */}
          {activeTab === '城市分析' && (
            <>
              <div className="card-base p-6">
                <h3 className="mb-4 text-base font-semibold text-slate-800">城市Top10排名（申请金额降序）</h3>
                <div className="h-[360px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={cityBarData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
                      <YAxis tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} label={{ value: '金额(万)', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#64748b' } }} />
                      <Tooltip
                        formatter={(v: number) => [`${v.toLocaleString()}万`]}
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                          fontSize: '12px',
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} iconType="circle" />
                      <Bar dataKey="申请金额" fill="#60a5fa" radius={[4, 4, 0, 0]} barSize={32} />
                      <Bar dataKey="放款金额" fill="#34d399" radius={[4, 4, 0, 0]} barSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card-base p-6">
                <h3 className="mb-4 text-base font-semibold text-slate-800">城市详细数据</h3>
                <DataTable
                  columns={cityColumns}
                  data={cityTableData}
                  rowKey="city"
                  hoverable={false}
                />
              </div>

              <div className="card-base p-6">
                <h3 className="mb-5 text-base font-semibold text-slate-800">城市分布热力图</h3>
                <div className="space-y-5">
                  {cityHeatmap.map((region) => (
                    <div key={region.region} className="flex items-start gap-4">
                      <div className="w-14 shrink-0 pt-1.5 text-sm font-semibold text-slate-600 text-right">{region.region}</div>
                      <div className="flex flex-wrap gap-2 flex-1">
                        {region.cities.map((city) => (
                          <div
                            key={city.name}
                            className={cn(
                              'px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-default min-w-[92px] text-center shadow-sm',
                              getHeatmapColor(city.value, heatmapMaxValue)
                            )}
                            title={`${city.name}: ${city.value}笔申请`}
                          >
                            <div className="font-semibold">{city.name}</div>
                            <div className="mt-0.5 opacity-80 text-[11px]">{city.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <span className="text-xs text-slate-500">图例：</span>
                    <div className="flex items-center gap-1.5">
                      <div className="h-4 w-12 rounded bg-primary-50 border border-slate-200" />
                      <span className="text-xs text-slate-500">低</span>
                    </div>
                    <div className="h-4 w-12 rounded bg-primary-200" />
                    <div className="h-4 w-12 rounded bg-primary-400" />
                    <div className="flex items-center gap-1.5">
                      <div className="h-4 w-12 rounded bg-primary-600" />
                      <span className="text-xs text-slate-500">高</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Tab 3: 产品分析 */}
          {activeTab === '产品分析' && (
            <div className="grid grid-cols-2 gap-6">
              <div className="card-base p-6">
                <h3 className="mb-4 text-base font-semibold text-slate-800">产品放款金额占比</h3>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="48%"
                        innerRadius={65}
                        outerRadius={110}
                        paddingAngle={3}
                        dataKey="value"
                        label={({ name, ratio }) => `${name} ${ratio.toFixed(1)}%`}
                        labelLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                      >
                        {pieData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(v: number, _n: string, props: { payload: { ratio: number; name: string } }) => [
                          `${formatAmountShort(v)} (${props.payload.ratio.toFixed(1)}%)`,
                          props.payload.name,
                        ]}
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                          fontSize: '12px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 grid grid-cols-5 gap-3">
                  {pieData.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-2 rounded-lg bg-slate-50 px-2.5 py-2">
                      <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i] }} />
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-slate-700 truncate">{item.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{formatAmountShort(item.value)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-base p-6">
                <h3 className="mb-4 text-base font-semibold text-slate-800">产品收益与风险散点图</h3>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        type="number"
                        dataKey="利率"
                        name="平均利率"
                        unit="%"
                        domain={[8, 16]}
                        tick={{ fontSize: 12, fill: '#64748b' }}
                        tickLine={false}
                        axisLine={{ stroke: '#e2e8f0' }}
                        label={{ value: '平均利率 (收益)', position: 'bottom', offset: 0, style: { fontSize: 12, fill: '#64748b' } }}
                      />
                      <YAxis
                        type="number"
                        dataKey="逾期率"
                        name="逾期率"
                        unit="%"
                        domain={[5, 20]}
                        tick={{ fontSize: 12, fill: '#64748b' }}
                        tickLine={false}
                        axisLine={{ stroke: '#e2e8f0' }}
                        label={{ value: '逾期率 (风险)', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#64748b' } }}
                      />
                      <ZAxis type="number" dataKey="放款额" range={[120, 900]} name="放款额" />
                      <Tooltip
                        cursor={{ strokeDasharray: '3 3' }}
                        formatter={(value: number, name: string) => {
                          if (name === '放款额') return [formatAmountShort(value), name]
                          return [`${value}%`, name]
                        }}
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                          fontSize: '12px',
                        }}
                      />
                      <Scatter data={scatterData}>
                        {scatterData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} fillOpacity={0.85} stroke="#fff" strokeWidth={2} />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 flex flex-wrap gap-3 justify-center">
                  {scatterData.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                      <span className="text-xs font-medium text-slate-700">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-2 card-base p-6">
                <h3 className="mb-4 text-base font-semibold text-slate-800">产品详细数据</h3>
                <DataTable
                  columns={productColumns}
                  data={productStats}
                  rowKey="product"
                  hoverable={false}
                />
              </div>
            </div>
          )}

          {/* Tab 4: 综合对比 */}
          {activeTab === '综合对比' && (
            <>
              <div className="card-base p-6">
                <h3 className="mb-5 text-base font-semibold text-slate-800">申请漏斗转化</h3>
                <div className="space-y-3.5">
                  {funnelSteps.map((step, idx) => {
                    const maxRatio = funnelSteps[0].ratio
                    const widthPct = (step.ratio / maxRatio) * 100
                    const colors = [
                      'from-blue-500 to-blue-600',
                      'from-indigo-500 to-indigo-600',
                      'from-violet-500 to-violet-600',
                      'from-purple-500 to-purple-600',
                      'from-fuchsia-500 to-fuchsia-600',
                      'from-pink-500 to-pink-600',
                    ]
                    const prevRatio = idx > 0 ? funnelSteps[idx - 1].ratio : 100
                    const conversion = ((step.ratio / prevRatio) * 100).toFixed(1)
                    return (
                      <div key={step.name} className="flex items-center gap-4">
                        <div className="w-24 shrink-0 text-sm font-medium text-slate-700 text-right">{step.name}</div>
                        <div className="flex-1 relative h-12 bg-slate-50 rounded-xl overflow-hidden">
                          <div
                            className={cn(
                              'h-full bg-gradient-to-r rounded-xl flex items-center justify-between px-5 shadow-sm',
                              colors[idx]
                            )}
                            style={{ width: `${widthPct}%` }}
                          >
                            <span className="text-white font-semibold text-sm">{step.value.toLocaleString()}</span>
                            <span className="text-white/85 text-xs font-mono">{step.ratio}%</span>
                          </div>
                        </div>
                        <div className="w-24 shrink-0 text-right">
                          {idx > 0 ? (
                            <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                              {conversion}%
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">-</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="card-base p-6">
                <h3 className="mb-4 text-base font-semibold text-slate-800">风险等级分布趋势（近6个月）</h3>
                <div className="h-[340px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyRiskDists} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
                      <YAxis tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                          fontSize: '12px',
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} iconType="circle" />
                      <Bar dataKey="A" stackId="a" fill={RISK_COLORS.A} name="A级(低风险)" />
                      <Bar dataKey="B" stackId="a" fill={RISK_COLORS.B} name="B级(较低)" />
                      <Bar dataKey="C" stackId="a" fill={RISK_COLORS.C} name="C级(中风险)" />
                      <Bar dataKey="D" stackId="a" fill={RISK_COLORS.D} name="D级(较高)" />
                      <Bar dataKey="E" stackId="a" fill={RISK_COLORS.E} name="E级(高风险)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card-base p-6">
                <h3 className="mb-5 text-base font-semibold text-slate-800">核心指标同比环比汇总</h3>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-5 py-3.5 text-left font-semibold text-slate-700 w-44">指标名称</th>
                        <th className="px-5 py-3.5 text-right font-semibold text-slate-700 w-40">当期值</th>
                        <th className="px-5 py-3.5 text-right font-semibold text-slate-700 w-40">环比</th>
                        <th className="px-5 py-3.5 text-right font-semibold text-slate-700 w-40">同比</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonMetrics.map((m, idx) => (
                        <tr
                          key={m.name}
                          className={cn('border-b border-slate-100 transition-colors hover:bg-slate-50', idx % 2 === 1 && 'bg-slate-50/30')}
                        >
                          <td className="px-5 py-3.5">
                            <span className="font-medium text-slate-800">{m.name}</span>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <span className="font-mono font-semibold text-slate-800">{m.current}</span>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <span
                              className={cn(
                                'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold font-mono',
                                m.momUp
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-red-50 text-red-700'
                              )}
                            >
                              {m.momUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                              {m.mom}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <span
                              className={cn(
                                'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold font-mono',
                                m.yoyUp
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-red-50 text-red-700'
                              )}
                            >
                              {m.yoyUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                              {m.yoy}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
