import { useState } from 'react'
import {
  Banknote,
  Search,
  Filter,
  User,
  Calendar,
  Phone,
  MapPin,
  AlertCircle,
  ArrowRight,
  Clock,
  AlertTriangle,
  PhoneCall,
  MessageSquare,
  Home,
  FileBadge,
  Plus,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  List,
  CalendarDays,
} from 'lucide-react'
import {
  StatCard,
  DataTable,
  StatusTag,
  RiskBadge,
  Timeline,
  ProgressBar,
} from '@/components/ui'
import type { DataTableColumn } from '@/components/ui'
import { repaymentSchedules, collectionRecords } from '@/data/repayments'
import type { RepaymentSchedule } from '@/data/repayments'
import {
  formatMoney,
  formatDate,
  formatDays,
  formatIdCard,
  formatPhone,
} from '@/utils/format'
import { cn, getInitials } from '@/utils/helpers'

const statusFilters = ['全部', '正常还款', '逾期', '已结清'] as const
const viewModes = ['列表视图', '日历视图'] as const

const loanScheduleData: RepaymentSchedule[] = [
  {
    id: 'HT001',
    planId: 'P001',
    termNo: 1,
    dueDate: '2026-04-15',
    principal: 7685.2,
    interest: 1541.67,
    totalAmount: 9226.87,
    repaidAmount: 9226.87,
    status: '已还',
    repaidDate: '2026-04-14',
    overdueDays: 0,
    overdueFee: 0,
  },
  {
    id: 'HT002',
    planId: 'P001',
    termNo: 2,
    dueDate: '2026-05-15',
    principal: 7804.1,
    interest: 1422.77,
    totalAmount: 9226.87,
    repaidAmount: 9226.87,
    status: '已还',
    repaidDate: '2026-05-15',
    overdueDays: 0,
    overdueFee: 0,
  },
  {
    id: 'HT003',
    planId: 'P001',
    termNo: 3,
    dueDate: '2026-06-15',
    principal: 7924.88,
    interest: 1301.99,
    totalAmount: 9226.87,
    repaidAmount: 8996.26,
    status: '已还',
    repaidDate: '2026-06-16',
    overdueDays: 0,
    overdueFee: 0,
  },
  {
    id: 'HT004',
    planId: 'P001',
    termNo: 4,
    dueDate: '2026-07-15',
    principal: 8047.51,
    interest: 1179.36,
    totalAmount: 9226.87,
    repaidAmount: 0,
    status: '逾期',
    overdueDays: 18,
    overdueFee: 284.56,
    remark: '还款日账户余额不足',
  },
  {
    id: 'HT005',
    planId: 'P001',
    termNo: 5,
    dueDate: '2026-08-15',
    principal: 8172.04,
    interest: 1054.83,
    totalAmount: 9226.87,
    repaidAmount: 0,
    status: '待还',
  },
  {
    id: 'HT006',
    planId: 'P001',
    termNo: 6,
    dueDate: '2026-09-15',
    principal: 8298.49,
    interest: 928.38,
    totalAmount: 9226.87,
    repaidAmount: 0,
    status: '待还',
  },
  {
    id: 'HT007',
    planId: 'P001',
    termNo: 7,
    dueDate: '2026-10-15',
    principal: 8426.9,
    interest: 799.97,
    totalAmount: 9226.87,
    repaidAmount: 0,
    status: '待还',
  },
  {
    id: 'HT008',
    planId: 'P001',
    termNo: 8,
    dueDate: '2026-11-15',
    principal: 8557.32,
    interest: 669.55,
    totalAmount: 9226.87,
    repaidAmount: 0,
    status: '待还',
  },
  {
    id: 'HT009',
    planId: 'P001',
    termNo: 9,
    dueDate: '2026-12-15',
    principal: 8689.77,
    interest: 537.1,
    totalAmount: 9226.87,
    repaidAmount: 0,
    status: '待还',
  },
  {
    id: 'HT010',
    planId: 'P001',
    termNo: 10,
    dueDate: '2027-01-15',
    principal: 8824.3,
    interest: 402.57,
    totalAmount: 9226.87,
    repaidAmount: 0,
    status: '待还',
  },
  {
    id: 'HT011',
    planId: 'P001',
    termNo: 11,
    dueDate: '2027-02-15',
    principal: 8960.95,
    interest: 265.92,
    totalAmount: 9226.87,
    repaidAmount: 0,
    status: '待还',
  },
  {
    id: 'HT012',
    planId: 'P001',
    termNo: 12,
    dueDate: '2027-03-15',
    principal: 9099.74,
    interest: 127.13,
    totalAmount: 9226.87,
    repaidAmount: 0,
    status: '待还',
  },
]

const collectionTimelineItems = [
  {
    title: '电话催收 - 承诺还款',
    time: '2026-06-08 14:30',
    operator: '李催收员',
    description: '借款人承诺于6月12日前全额还款，态度良好',
    status: 'done' as const,
  },
  {
    title: '短信提醒',
    time: '2026-06-06 10:15',
    operator: '系统自动',
    description: '已送达，提醒已逾期并告知罚息计算方式',
    status: 'done' as const,
  },
  {
    title: '电话催收 - 资金困难',
    time: '2026-06-04 16:45',
    operator: '王催收员',
    description: '借款人称资金周转困难，需再等数日',
    status: 'done' as const,
  },
  {
    title: '到期首次提醒',
    time: '2026-06-02 09:00',
    operator: '系统自动',
    description: '发送还款到期提醒短信',
    status: 'done' as const,
  },
  {
    title: '电话催收 - 无人接听',
    time: '2026-05-30 11:20',
    operator: '李催收员',
    description: '拨打3次无人接听，发送语音留言',
    status: 'done' as const,
  },
  {
    title: '短信提醒 - 提前3天',
    time: '2026-05-28 08:30',
    operator: '系统自动',
    description: '提前3天提醒即将到期',
    status: 'done' as const,
  },
  {
    title: '账单生成通知',
    time: '2026-05-25 10:00',
    operator: '系统自动',
    description: '第4期账单已生成，金额¥9,226.87',
    status: 'done' as const,
  },
]

const migrationReasons = [
  { reason: '第4期严重逾期', impact: '-2级', type: 'critical' },
  { reason: '多头借贷新增大额申请', impact: '信用评分下降', type: 'high' },
  { reason: '联系方式变更未通知', impact: '失联风险', type: 'medium' },
  { reason: '工作单位核验异常', impact: '收入稳定性存疑', type: 'medium' },
]

const riskAlerts = [
  {
    type: 'warning',
    icon: AlertTriangle,
    text: '借款人关联联系人"李四"于昨日新申请3笔贷款',
    action: '点击查看',
  },
  {
    type: 'warning',
    icon: AlertTriangle,
    text: '检测到借款人所在公司有工商变更记录',
    action: null,
  },
  {
    type: 'success',
    icon: CheckCircle2,
    text: '已关联社交网络图谱，识别到1个黑名单关联人（远距离）',
    action: null,
  },
]

const collectionMethods = ['电话', '短信', '上门', '律师函']
const contactResults = ['本人接听', '无人接听', '关机', '他人接听', '承诺还款', '拒绝沟通']

export default function PostLoan() {
  const [activeStatusFilter, setActiveStatusFilter] =
    useState<(typeof statusFilters)[number]>('全部')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeViewMode, setActiveViewMode] =
    useState<(typeof viewModes)[number]>('列表视图')
  const [showCollectionForm, setShowCollectionForm] = useState(false)
  const [formData, setFormData] = useState({
    method: '电话',
    result: '本人接听',
    contactName: '',
    remark: '',
    promiseDate: '',
  })

  const scheduleColumns: DataTableColumn<RepaymentSchedule>[] = [
    {
      key: 'termNo',
      title: '期数',
      width: 70,
      align: 'center',
      render: (row) => (
        <span className="font-semibold text-slate-700">第{row.termNo}期</span>
      ),
    },
    {
      key: 'dueDate',
      title: '应还日期',
      width: 110,
      align: 'center',
      render: (row) => <span>{formatDate(row.dueDate)}</span>,
    },
    {
      key: 'principal',
      title: '本金',
      width: 100,
      align: 'right',
      render: (row) => (
        <span className="font-mono">{formatMoney(row.principal)}</span>
      ),
    },
    {
      key: 'interest',
      title: '利息',
      width: 100,
      align: 'right',
      render: (row) => (
        <span className="font-mono">{formatMoney(row.interest)}</span>
      ),
    },
    {
      key: 'totalAmount',
      title: '应还金额',
      width: 110,
      align: 'right',
      render: (row) => (
        <span className="font-mono font-semibold text-slate-800">
          {formatMoney(row.totalAmount)}
        </span>
      ),
    },
    {
      key: 'repaidAmount',
      title: '实还金额',
      width: 110,
      align: 'right',
      render: (row) => (
        <span
          className={cn(
            'font-mono',
            row.repaidAmount > 0 ? 'text-emerald-600' : 'text-slate-400'
          )}
        >
          {row.repaidAmount > 0 ? formatMoney(row.repaidAmount) : '-'}
        </span>
      ),
    },
    {
      key: 'repaidDate',
      title: '还款日期',
      width: 110,
      align: 'center',
      render: (row) => (
        <span>{row.repaidDate ? formatDate(row.repaidDate) : '-'}</span>
      ),
    },
    {
      key: 'status',
      title: '状态',
      width: 100,
      align: 'center',
      render: (row) => {
        if (row.status === '已还') {
          return (
            <StatusTag
              label="已还"
              color="text-emerald-700 dark:text-emerald-400"
              bgColor="bg-emerald-100 dark:bg-emerald-900/30"
              size="sm"
            />
          )
        }
        if (row.status === '逾期') {
          return (
            <StatusTag
              label={`逾期${row.overdueDays}天`}
              color="text-red-700 dark:text-red-400"
              bgColor="bg-red-100 dark:bg-red-900/30"
              size="sm"
            />
          )
        }
        return (
          <StatusTag
            label="待还"
            color="text-slate-600 dark:text-slate-400"
            bgColor="bg-slate-100 dark:bg-slate-700/50"
            size="sm"
          />
        )
      },
    },
    {
      key: 'overdueDays',
      title: '逾期天数',
      width: 90,
      align: 'center',
      render: (row) =>
        row.overdueDays && row.overdueDays > 0 ? (
          <span className="text-red-600 font-semibold">
            {formatDays(row.overdueDays)}
          </span>
        ) : (
          <span className="text-slate-400">-</span>
        ),
    },
    {
      key: 'overdueFee',
      title: '滞纳金',
      width: 100,
      align: 'right',
      render: (row) =>
        row.overdueFee && row.overdueFee > 0 ? (
          <span className="font-mono font-semibold text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded">
            {formatMoney(row.overdueFee)}
          </span>
        ) : (
          <span className="text-slate-400">-</span>
        ),
    },
    {
      key: 'action',
      title: '操作',
      width: 90,
      align: 'center',
      render: (row) => (
        <div className="flex items-center justify-center gap-1">
          {row.status === '待还' && (
            <button className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 transition-colors">
              提醒
            </button>
          )}
          {row.status === '逾期' && (
            <button className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-white bg-red-500 hover:bg-red-600 transition-colors">
              催收
            </button>
          )}
        </div>
      ),
    },
  ]

  const totalPrincipal = loanScheduleData.reduce((s, r) => s + r.principal, 0)
  const totalInterest = loanScheduleData.reduce((s, r) => s + r.interest, 0)
  const totalAmount = loanScheduleData.reduce((s, r) => s + r.totalAmount, 0)
  const totalRepaid = loanScheduleData.reduce((s, r) => s + r.repaidAmount, 0)
  const totalOverdue = loanScheduleData
    .filter((r) => r.status === '逾期')
    .reduce((s, r) => s + r.totalAmount + (r.overdueFee || 0), 0)

  return (
    <div className="page-fade-enter space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            贷后管理中心
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            跟踪还款情况，进行逾期催收，监控风险变化
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="借款人姓名/身份证/合同编号"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full sm:w-80 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-10 pr-4 text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/50 transition"
            />
          </div>
          <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1 shadow-sm">
            <div className="flex items-center pl-2 pr-1 text-slate-400">
              <Filter className="h-4 w-4" />
            </div>
            {statusFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveStatusFilter(filter)}
                className={cn(
                  'px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200',
                  activeStatusFilter === filter
                    ? 'bg-primary-700 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700'
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="在贷余额"
          value="¥2.84亿"
          icon={Banknote}
          trend="+6.2%"
          trendUp={true}
          gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        />
        <div className="relative overflow-hidden rounded-2xl p-6 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)' }} />
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-white/70">正常还款</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="relative z-10 mt-5">
            <p className="font-mono text-2xl font-bold text-white md:text-3xl">1,285笔</p>
          </div>
          <div className="relative z-10 mt-4 flex items-center gap-2">
            <span className="text-sm font-semibold text-emerald-100">占比 82.6%</span>
            <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white/80 rounded-full" style={{ width: '82.6%' }} />
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl p-6 shadow-lg bg-gradient-to-br from-red-500 to-red-600 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)' }} />
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-white/70">逾期贷款</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="relative z-10 mt-5">
            <p className="font-mono text-2xl font-bold text-white md:text-3xl">271笔</p>
          </div>
          <div className="relative z-10 mt-4 flex items-center gap-2">
            <span className="text-sm font-semibold text-red-100">占比 17.4%</span>
            <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white/80 rounded-full" style={{ width: '17.4%' }} />
            </div>
            <span className="text-xs font-semibold text-white bg-white/20 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" />
              +9笔
            </span>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl p-6 shadow-lg bg-gradient-to-br from-rose-600 to-rose-800 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)' }} />
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-white/70">M3+逾期</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="relative z-10 mt-5">
            <p className="font-mono text-2xl font-bold text-white md:text-3xl">38笔</p>
            <p className="mt-1 text-sm text-white/70">¥456.8万</p>
          </div>
          <div className="relative z-10 mt-3 flex items-center gap-1.5">
            <TrendingDown className="h-4 w-4 text-emerald-200" />
            <span className="text-sm font-semibold text-emerald-200">同比 -3.1%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card-base p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-lg font-bold shadow-md">
                  {getInitials('张三')}
                </div>
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">张三</h3>
                    <span className="text-sm text-slate-500 dark:text-slate-400 font-mono">
                      HT20260315008
                    </span>
                    <StatusTag label="还款中" color="text-blue-700 dark:text-blue-400" bgColor="bg-blue-100 dark:bg-blue-900/30" size="sm" />
                    <RiskBadge level="D" size="sm" />
                  </div>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    最近更新：2026-06-09 10:30
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
              <div>
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                  <User className="h-4 w-4 text-primary-500" />
                  借款人信息
                </h4>
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between py-1.5 border-b border-slate-50 dark:border-slate-800">
                    <span className="text-xs text-slate-500 dark:text-slate-400">身份证号</span>
                    <span className="text-sm font-mono text-slate-700 dark:text-slate-300">{formatIdCard('110101199003071234')}</span>
                  </div>
                  <div className="flex items-start justify-between py-1.5 border-b border-slate-50 dark:border-slate-800">
                    <span className="text-xs text-slate-500 dark:text-slate-400">手机号</span>
                    <span className="text-sm font-mono text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      {formatPhone('13800138000')}
                    </span>
                  </div>
                  <div className="flex items-start justify-between py-1.5 border-b border-slate-50 dark:border-slate-800">
                    <span className="text-xs text-slate-500 dark:text-slate-400">月收入</span>
                    <span className="text-sm font-mono text-slate-700 dark:text-slate-300">{formatMoney(18000)}</span>
                  </div>
                  <div className="flex items-start justify-between py-1.5 border-b border-slate-50 dark:border-slate-800">
                    <span className="text-xs text-slate-500 dark:text-slate-400">联系地址</span>
                    <span className="text-sm text-slate-700 dark:text-slate-300 max-w-[55%] text-right">北京市朝阳区建国路88号</span>
                  </div>
                  <div className="flex items-start justify-between py-1.5">
                    <span className="text-xs text-slate-500 dark:text-slate-400">紧急联系人</span>
                    <span className="text-sm text-slate-700 dark:text-slate-300">李四 (妻子) {formatPhone('13900139000')}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                  <FileBadge className="h-4 w-4 text-primary-500" />
                  合同信息
                </h4>
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between py-1.5 border-b border-slate-50 dark:border-slate-800">
                    <span className="text-xs text-slate-500 dark:text-slate-400">放款日</span>
                    <span className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {formatDate('2026-03-15')}
                    </span>
                  </div>
                  <div className="flex items-start justify-between py-1.5 border-b border-slate-50 dark:border-slate-800">
                    <span className="text-xs text-slate-500 dark:text-slate-400">到期日</span>
                    <span className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {formatDate('2027-03-15')}
                    </span>
                  </div>
                  <div className="flex items-start justify-between py-1.5 border-b border-slate-50 dark:border-slate-800">
                    <span className="text-xs text-slate-500 dark:text-slate-400">合同金额</span>
                    <span className="text-sm font-mono font-semibold text-slate-800 dark:text-slate-200">{formatMoney(100000)}</span>
                  </div>
                  <div className="flex items-start justify-between py-1.5 border-b border-slate-50 dark:border-slate-800">
                    <span className="text-xs text-slate-500 dark:text-slate-400">年化利率</span>
                    <span className="text-sm font-mono text-slate-700 dark:text-slate-300">18.5%</span>
                  </div>
                  <div className="flex items-start justify-between py-1.5">
                    <span className="text-xs text-slate-500 dark:text-slate-400">还款方式</span>
                    <span className="text-sm text-slate-700 dark:text-slate-300">等额本息</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800/50 dark:to-blue-900/20 border border-slate-100 dark:border-slate-700">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">还款进度</p>
                  <p className="text-lg font-bold text-slate-800 dark:text-slate-200">3 / 12期</p>
                  <div className="mt-2 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary-500 to-blue-500 rounded-full transition-all duration-500" style={{ width: '25%' }} />
                  </div>
                </div>
                <div className="text-center border-x border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">已还金额</p>
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono">{formatMoney(27450)}</p>
                  <p className="text-xs text-slate-400 mt-2">占比 24.9%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">剩余金额</p>
                  <p className="text-lg font-bold text-slate-800 dark:text-slate-200 font-mono">{formatMoney(80550)}</p>
                  <p className="text-xs text-slate-400 mt-2">占比 75.1%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card-base p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">还款计划表</h2>
              <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1 shadow-sm">
                <button
                  onClick={() => setActiveViewMode('列表视图')}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200',
                    activeViewMode === '列表视图'
                      ? 'bg-primary-700 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700'
                  )}
                >
                  <List className="h-3.5 w-3.5" />
                  列表视图
                </button>
                <button
                  onClick={() => setActiveViewMode('日历视图')}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200',
                    activeViewMode === '日历视图'
                      ? 'bg-primary-700 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700'
                  )}
                >
                  <CalendarDays className="h-3.5 w-3.5" />
                  日历视图
                </button>
              </div>
            </div>

            {activeViewMode === '列表视图' ? (
              <div className="overflow-hidden rounded-xl">
                <DataTable<RepaymentSchedule>
                  columns={scheduleColumns}
                  data={loanScheduleData}
                  rowKey="id"
                  hoverable={false}
                  className="border-0"
                />
                <div className="mt-3 grid grid-cols-5 gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                  <div className="text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">合计本金</p>
                    <p className="text-sm font-mono font-semibold text-slate-700 dark:text-slate-300">{formatMoney(totalPrincipal)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">合计利息</p>
                    <p className="text-sm font-mono font-semibold text-slate-700 dark:text-slate-300">{formatMoney(totalInterest)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">应还总额</p>
                    <p className="text-sm font-mono font-bold text-slate-800 dark:text-slate-200">{formatMoney(totalAmount)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">已还金额</p>
                    <p className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400">{formatMoney(totalRepaid)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">逾期金额</p>
                    <p className="text-sm font-mono font-bold text-red-600 dark:text-red-400">{formatMoney(totalOverdue)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-500 dark:text-slate-400">
                <CalendarDays className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>日历视图开发中...</p>
                <button
                  onClick={() => setActiveViewMode('列表视图')}
                  className="mt-3 text-primary-600 dark:text-primary-400 hover:underline text-sm"
                >
                  返回列表视图
                </button>
              </div>
            )}
          </div>

          <div className="card-base p-6">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-5">风险等级迁移追踪</h2>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3">
                <div className="flex items-center justify-between gap-2 py-4">
                  <div className="flex flex-col items-center flex-1">
                    <div className="h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center ring-4 ring-blue-200 dark:ring-blue-800/50 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">B</span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-300">贷前评级</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">2026-03-15 放款时</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">中低风险</p>
                  </div>
                  <div className="flex flex-col items-center px-2">
                    <div className="flex items-center gap-1 text-blue-500">
                      <div className="w-8 h-0.5 bg-gradient-to-r from-blue-400 to-blue-500" />
                      <ArrowRight className="h-5 w-5 animate-pulse" />
                      <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-orange-400" />
                    </div>
                    <p className="text-xs font-medium text-red-500 mt-2">-2 级</p>
                  </div>
                  <div className="flex flex-col items-center flex-1">
                    <div className="h-20 w-20 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center ring-4 ring-orange-200 dark:ring-orange-800/50 shadow-[0_0_30px_rgba(249,115,22,0.4)]">
                      <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">D</span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-300">当前评级</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">2026-06-09 最新</p>
                    <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">中高风险</p>
                  </div>
                  <div className="flex flex-col items-center px-2">
                    <div className="flex items-center gap-1 text-red-500">
                      <div className="w-8 h-0.5 bg-gradient-to-r from-orange-400 to-red-500" />
                      <ArrowRight className="h-5 w-5 animate-pulse opacity-60" />
                      <div className="w-8 h-0.5 bg-gradient-to-r from-red-500 to-red-600 opacity-60" />
                    </div>
                    <p className="text-xs font-medium text-slate-400 mt-2">预测</p>
                  </div>
                  <div className="flex flex-col items-center flex-1 opacity-70">
                    <div className="h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center ring-4 ring-red-200 dark:ring-red-800/50 border-2 border-dashed border-red-300 dark:border-red-700">
                      <span className="text-2xl font-bold text-red-600 dark:text-red-400">E</span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-300">预测30天</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">若逾期继续恶化</p>
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">高风险</p>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  迁移原因分析
                </h4>
                <div className="space-y-2.5">
                  {migrationReasons.map((item, index) => (
                    <div
                      key={index}
                      className={cn(
                        'flex items-center justify-between p-3 rounded-lg border transition-all',
                        item.type === 'critical'
                          ? 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/50'
                          : item.type === 'high'
                          ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800/50'
                          : 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/50'
                      )}
                    >
                      <div className="flex items-start gap-2.5 flex-1">
                        <span className={cn(
                          'inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white flex-shrink-0 mt-0.5',
                          item.type === 'critical' ? 'bg-red-500' : item.type === 'high' ? 'bg-orange-500' : 'bg-amber-500'
                        )}>
                          {index + 1}
                        </span>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{item.reason}</p>
                      </div>
                      <span className={cn(
                        'text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ml-2',
                        item.type === 'critical'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400'
                          : item.type === 'high'
                          ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400'
                      )}>
                        {item.impact}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-base overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-white" />
                <h2 className="text-lg font-semibold text-white">逾期详情统计</h2>
              </div>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-200 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-200"></span>
              </span>
            </div>
            <div className="p-5 space-y-4">
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800/50">
                <p className="text-xs text-red-600 dark:text-red-400 mb-1">当前逾期天数</p>
                <p className="text-4xl font-bold text-red-600 dark:text-red-400 font-mono">18<span className="text-xl ml-1">天</span></p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">逾期金额</p>
                  <p className="text-base font-bold text-slate-800 dark:text-slate-200 font-mono">{formatMoney(9187.25)}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">累计滞纳金</p>
                  <p className="text-base font-bold text-orange-600 dark:text-orange-400 font-mono">{formatMoney(284.56)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">已催收次数</p>
                  <p className="text-base font-bold text-slate-800 dark:text-slate-200">4<span className="text-sm font-normal ml-1">次</span></p>
                </div>
                <button className="px-3 py-1.5 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors">
                  发起催收
                </button>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">逾期等级进度</p>
                </div>
                <div className="relative pt-6 pb-2">
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 rounded-full transition-all duration-700" style={{ width: '36%' }} />
                  </div>
                  <div className="absolute top-0 left-0 right-0 flex justify-between">
                    {['M0', 'M1', 'M2', 'M3', 'M3+'].map((level, index) => (
                      <div key={level} className="flex flex-col items-center" style={{ transform: `translateX(${index === 0 ? '-10%' : index === 4 ? '10%' : '0'})` }}>
                        <div className={cn(
                          'h-4 w-4 rounded-full border-2 flex items-center justify-center mb-1.5 transition-all',
                          index <= 1
                            ? 'bg-white dark:bg-slate-800 border-red-500'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600'
                        )}>
                          {index <= 1 && <div className="h-2 w-2 rounded-full bg-red-500" />}
                        </div>
                        <span className={cn(
                          'text-[10px] font-bold',
                          index === 1 ? 'text-red-600 dark:text-red-400' : 'text-slate-400'
                        )}>
                          {level}
                        </span>
                        <span className="text-[9px] text-slate-400">
                          {index === 0 ? '1-30' : index === 1 ? '31-60' : index === 2 ? '61-90' : index === 3 ? '91-180' : '180+'}天
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card-base overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <PhoneCall className="h-5 w-5 text-primary-500" />
                催收记录
              </h2>
              <button
                onClick={() => setShowCollectionForm(!showCollectionForm)}
                className={cn(
                  'inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                  showCollectionForm
                    ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    : 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/50'
                )}
              >
                {showCollectionForm ? (
                  <>
                    <ChevronUp className="h-3.5 w-3.5" />
                    收起
                  </>
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5" />
                    登记新催收
                  </>
                )}
              </button>
            </div>

            {showCollectionForm && (
              <div className="px-6 py-4 bg-blue-50/50 dark:bg-blue-900/10 border-b border-slate-100 dark:border-slate-700 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">催收方式</label>
                    <select
                      value={formData.method}
                      onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                      className="w-full h-8 rounded-md border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 text-xs text-slate-700 dark:text-slate-200 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-200 dark:focus:ring-primary-800 transition"
                    >
                      {collectionMethods.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">联系结果</label>
                    <select
                      value={formData.result}
                      onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                      className="w-full h-8 rounded-md border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 text-xs text-slate-700 dark:text-slate-200 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-200 dark:focus:ring-primary-800 transition"
                    >
                      {contactResults.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">联系人姓名</label>
                  <input
                    type="text"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    placeholder="如：借款人本人/配偶/父母等"
                    className="w-full h-8 rounded-md border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 text-xs text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-200 dark:focus:ring-primary-800 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">催收备注</label>
                  <textarea
                    rows={2}
                    value={formData.remark}
                    onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                    placeholder="详细记录催收过程中的沟通内容..."
                    className="w-full rounded-md border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1.5 text-xs text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-200 dark:focus:ring-primary-800 transition resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">承诺还款日期</label>
                  <input
                    type="date"
                    value={formData.promiseDate}
                    onChange={(e) => setFormData({ ...formData, promiseDate: e.target.value })}
                    className="w-full h-8 rounded-md border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 text-xs text-slate-700 dark:text-slate-200 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-200 dark:focus:ring-primary-800 transition"
                  />
                </div>
                <button className="w-full h-9 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors shadow-sm hover:shadow flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  提交登记
                </button>
              </div>
            )}

            <div className="p-5 max-h-[520px] overflow-y-auto">
              <Timeline items={collectionTimelineItems} />
            </div>
          </div>

          <div className="card-base p-6">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              关联风险预警
            </h2>
            <div className="space-y-3">
              {riskAlerts.map((alert, index) => {
                const Icon = alert.icon
                return (
                  <div
                    key={index}
                    className={cn(
                      'p-4 rounded-xl border transition-all hover:shadow-sm',
                      alert.type === 'warning'
                        ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/50'
                        : 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/50'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg',
                        alert.type === 'warning'
                          ? 'bg-amber-100 dark:bg-amber-800/50 text-amber-600 dark:text-amber-400'
                          : 'bg-emerald-100 dark:bg-emerald-800/50 text-emerald-600 dark:text-emerald-400'
                      )}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          'text-sm leading-relaxed',
                          alert.type === 'warning'
                            ? 'text-amber-800 dark:text-amber-300'
                            : 'text-emerald-800 dark:text-emerald-300'
                        )}>
                          {alert.text}
                        </p>
                        {alert.action && (
                          <button className="mt-2 text-xs font-medium text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 hover:underline transition-colors">
                            {alert.action} →
                          </button>
                        )}
                      </div>
                    </div>
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
