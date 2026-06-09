import { useState } from 'react'
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  ListTodo,
  Phone,
  ChevronRight,
  Eye,
  ShieldAlert,
  UserCheck,
  FileSignature,
  Clock,
} from 'lucide-react'
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { applications } from '@/data/applications'
import { dailyTrends, riskLevelDists } from '@/data/reports'
import { StatCard, DataTable, RiskBadge, StatusTag } from '@/components/ui'
import { formatMoney, formatDate } from '@/utils/format'
import { cn, getInitials } from '@/utils/helpers'
import type { DataTableColumn } from '@/components/ui'
import type { Application } from '@/data/applications'

const dateFilters = ['今日', '本周', '本月', '本季'] as const

const overdueCustomers = [
  { name: '刘建国', days: 92, amount: 285600 },
  { name: '王桂芳', days: 67, amount: 156800 },
  { name: '陈志强', days: 45, amount: 98500 },
  { name: '李秀英', days: 31, amount: 62400 },
  { name: '赵明远', days: 18, amount: 45200 },
]

const todoCategories = [
  { key: 'verify', label: '待核验', count: 8 },
  { key: 'review', label: '待审核', count: 14 },
  { key: 'supplement', label: '待补件', count: 6 },
  { key: 'collect', label: '待催收', count: 4 },
]

const todoList = [
  { icon: ShieldAlert, title: '核实申请人身份信息', time: '10分钟前', category: 'verify' },
  { icon: FileSignature, title: '审核 LN20260515008 进件', time: '30分钟前', category: 'review' },
  { icon: UserCheck, title: '补充客户征信报告', time: '1小时前', category: 'supplement' },
  { icon: Clock, title: '催收刘建国逾期款项', time: '2小时前', category: 'collect' },
]

const PIE_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#f97316', '#ef4444']

const AVATAR_COLORS = [
  'bg-rose-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-blue-500',
  'bg-violet-500',
]

export default function Dashboard() {
  const [activeFilter, setActiveFilter] = useState<(typeof dateFilters)[number]>('今日')
  const [activeTodoCategory, setActiveTodoCategory] = useState<string>('verify')

  const trendData = dailyTrends.slice(-30).map((item) => ({
    ...item,
    dateShort: item.date.slice(5),
  }))

  const pieData = riskLevelDists.map((item) => ({
    name: item.level,
    value: item.count,
    ratio: item.ratio,
  }))

  const applicationColumns: DataTableColumn<Application>[] = [
    { key: 'applyNo', title: '申请编号', width: 150 },
    { key: 'applicantName', title: '申请人', width: 90 },
    {
      key: 'applyAmount',
      title: '金额',
      width: 110,
      align: 'right',
      render: (row) => formatMoney(row.applyAmount),
    },
    {
      key: 'applyTerm',
      title: '期限',
      width: 80,
      align: 'center',
      render: (row) => `${row.applyTerm}期`,
    },
    {
      key: 'riskLevel',
      title: '风险等级',
      width: 100,
      align: 'center',
      render: (row) => <RiskBadge level={row.riskLevel} size="sm" />,
    },
    {
      key: 'status',
      title: '状态',
      width: 100,
      align: 'center',
      render: (row) => <StatusTag status={row.status} size="sm" />,
    },
    {
      key: 'action',
      title: '操作',
      width: 80,
      align: 'center',
      render: () => (
        <button className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 transition-colors">
          <Eye className="h-3.5 w-3.5" />
          详情
        </button>
      ),
    },
  ]

  return (
    <div className="page-fade-enter space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">风控数据概览</h1>
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
          {dateFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                'px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200',
                activeFilter === filter
                  ? 'bg-primary-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <StatCard
          title="今日申请量"
          value={186}
          icon={FileText}
          trend="+12.5%"
          trendUp={true}
          gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        />
        <StatCard
          title="本月通过率"
          value="68.3%"
          icon={CheckCircle2}
          trend="+2.1%"
          trendUp={true}
          gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
        />
        <StatCard
          title="逾期金额"
          value="¥856.4万"
          icon={AlertTriangle}
          trend="+5.8%"
          trendUp={false}
          gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
        />
        <StatCard
          title="待办任务"
          value={32}
          icon={ListTodo}
          trend="-8 今日新增"
          trendUp={true}
          gradient="linear-gradient(135deg, #30cfd0 0%, #330867 100%)"
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="card-base p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">申请量与通过率趋势</h2>
            </div>
            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="dateShort"
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    interval={2}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    domain={[50, 80]}
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
                  <Legend
                    wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
                    iconType="circle"
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="applyCount"
                    name="申请量"
                    stroke="#667eea"
                    fill="url(#colorApply)"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="approveRate"
                    name="通过率(%)"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    strokeDasharray="6 4"
                    dot={{ r: 3, fill: '#10b981' }}
                    activeDot={{ r: 5 }}
                  />
                  <defs>
                    <linearGradient id="colorApply" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#667eea" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#667eea" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card-base p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">最新进件</h2>
              <a
                href="#"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary-700 hover:text-primary-800 transition-colors"
              >
                查看全部
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
            <DataTable<Application>
              columns={applicationColumns}
              data={applications.slice(0, 6)}
              rowKey="id"
              hoverable={false}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-base p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-800">风险等级分布</h2>
            </div>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string, props: { payload: { ratio: number } }) => [
                      `${value} (${props.payload.ratio}%)`,
                      name,
                    ]}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2.5">
              {riskLevelDists.map((item, index) => (
                <div key={item.level} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: PIE_COLORS[index] }}
                    />
                    <span className="text-sm font-medium text-slate-700">{item.level}级</span>
                    <span className="text-xs text-slate-400">{item.levelName}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-slate-700">{item.count}</span>
                    <span className="text-xs text-slate-500 w-12 text-right">{item.ratio}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-base overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">逾期预警</h2>
            </div>
            <div className="p-5 space-y-4">
              {overdueCustomers.map((customer, index) => (
                <div
                  key={customer.name}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-semibold',
                        AVATAR_COLORS[index % AVATAR_COLORS.length]
                      )}
                    >
                      {getInitials(customer.name)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-800">{customer.name}</p>
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                          逾期{customer.days}天
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        逾期金额：{(customer.amount / 10000).toFixed(1)}万
                      </p>
                    </div>
                  </div>
                  <button className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-sm hover:shadow-md">
                    <Phone className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="card-base p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-800">我的待办</h2>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {todoCategories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveTodoCategory(cat.key)}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200',
                    activeTodoCategory === cat.key
                      ? 'bg-primary-700 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  )}
                >
                  {cat.label}
                  <span
                    className={cn(
                      'inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold',
                      activeTodoCategory === cat.key
                        ? 'bg-white/20 text-white'
                        : 'bg-white text-slate-500'
                    )}
                  >
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
            <div className="space-y-3">
              {todoList.map((todo, index) => {
                const Icon = todo.icon
                const isActive = todo.category === activeTodoCategory
                return (
                  <div
                    key={index}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-xl border transition-all duration-200',
                      isActive
                        ? 'border-primary-200 bg-primary-50/60'
                        : 'border-slate-100 bg-slate-50/60 opacity-70 hover:opacity-100'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'flex h-9 w-9 items-center justify-center rounded-lg',
                          isActive ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-500'
                        )}
                      >
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{todo.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{todo.time}</p>
                      </div>
                    </div>
                    <button className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
