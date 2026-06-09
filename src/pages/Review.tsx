import { useState } from 'react'
import {
  Check,
  X,
  RefreshCw,
  ArrowUpCircle,
  Banknote,
  FileText,
  Search,
  Filter,
  ChevronDown,
  Paperclip,
  Bold,
  Italic,
  List,
  ListOrdered,
  Upload,
  Plus,
  AlertTriangle,
  User,
  Briefcase,
  CreditCard,
  BarChart3,
  Users,
  Clock,
  Star,
} from 'lucide-react'
import { RiskBadge, StatusTag, Timeline, type TimelineItem } from '@/components/ui'
import { cn, getInitials } from '@/utils/helpers'
import {
  formatMoney,
  formatPhone,
  formatIdCard,
} from '@/utils/format'

interface ApplicationItem {
  id: string
  name: string
  avatar: string
  amount: number
  term: number
  riskLevel: string
  status: string
  applyTime: string
}

interface SupplementItem {
  id: string
  name: string
  requirement: string
  deadline: string
  status: 'pending' | 'submitted'
}

interface CommentItem {
  id: string
  author: string
  role: string
  time: string
  content: string
  type: 'comment' | 'decision'
  decision?: string
}

const mockApplications: ApplicationItem[] = [
  { id: '1', name: '张三', avatar: '张', amount: 80000, term: 12, riskLevel: 'C', status: 'reviewing', applyTime: '2026-06-09 09:15' },
  { id: '2', name: '李四', avatar: '李', amount: 120000, term: 24, riskLevel: 'B', status: 'pending', applyTime: '2026-06-09 10:20' },
  { id: '3', name: '王五', avatar: '王', amount: 50000, term: 6, riskLevel: 'A', status: 'reviewing', applyTime: '2026-06-09 08:30' },
  { id: '4', name: '赵六', avatar: '赵', amount: 250000, term: 36, riskLevel: 'D', status: 'pending', applyTime: '2026-06-09 11:05' },
  { id: '5', name: '钱七', avatar: '钱', amount: 30000, term: 12, riskLevel: 'C', status: 'approved', applyTime: '2026-06-08 16:40' },
  { id: '6', name: '孙八', avatar: '孙', amount: 180000, term: 24, riskLevel: 'B', status: 'pending', applyTime: '2026-06-08 14:22' },
  { id: '7', name: '周九', avatar: '周', amount: 95000, term: 18, riskLevel: 'C', status: 'rejected', applyTime: '2026-06-08 09:15' },
  { id: '8', name: '吴十', avatar: '吴', amount: 60000, term: 12, riskLevel: 'A', status: 'pending', applyTime: '2026-06-08 10:30' },
]

const mockSupplements: SupplementItem[] = [
  { id: 's1', name: '近3个月银行流水', requirement: '需盖章', deadline: '2026-06-12', status: 'pending' },
  { id: 's2', name: '单位在职证明', requirement: '需HR签字', deadline: '2026-06-12', status: 'submitted' },
]

const mockComments: CommentItem[] = [
  { id: 'c1', author: '系统AI', role: '自动评估', time: '2026-06-09 09:17', content: '申请人征信记录良好，无逾期记录；但近3个月查询次数较多（8次），存在多头借贷风险。建议人工复核。', type: 'comment' },
  { id: 'c2', author: '王审核', role: '初审员', time: '2026-06-09 10:05', content: '已核实申请人基本信息，身份证与人脸识别匹配通过。工作信息需进一步确认，建议联系单位核实。', type: 'comment' },
  { id: 'c3', author: '李审核', role: '复核员', time: '2026-06-09 11:30', content: '申请人负债收入比为45%，略高于阈值，但考虑到其稳定的工作单位和良好的历史还款记录，建议有条件通过。', type: 'decision', decision: '建议通过' },
]

const auditTimeline: TimelineItem[] = [
  { title: '提交申请', time: '2026-06-09 09:15', operator: '借款人 张三', status: 'done' },
  { title: '系统核验', time: '2026-06-09 09:16', operator: '系统', status: 'done' },
  { title: '风险评分', time: '2026-06-09 09:17', operator: 'AI模型', description: '（675分）', status: 'done' },
  { title: '分配审核', time: '2026-06-09 09:20', operator: '李审核员', status: 'current' },
  { title: '主管复审', time: '等待中', status: 'pending' },
  { title: '确认放款', time: '等待中', status: 'pending' },
]

const filterTabs = [
  { key: 'all', label: '全部', count: 18 },
  { key: 'mine', label: '待我审核', count: 12 },
  { key: 'reviewed', label: '我已审核', count: 23 },
  { key: 'starred', label: '关注列表', count: 5 },
]

const riskLevelOptions = ['全部', 'A级', 'B级', 'C级', 'D级', 'E级']
const statusOptions = ['全部', '待审核', '审核中', '已通过', '已拒绝']
const termOptions = [3, 6, 12, 18, 24, 36, 48, 60]

export default function Review() {
  const [activeTab, setActiveTab] = useState('mine')
  const [reviewMode, setReviewMode] = useState<'single' | 'joint'>('single')
  const [selectedAppId, setSelectedAppId] = useState('1')
  const [searchQuery, setSearchQuery] = useState('')
  const [riskFilter, setRiskFilter] = useState('全部')
  const [statusFilter, setStatusFilter] = useState('全部')
  const [showSupplements] = useState(true)
  const [reviewContent, setReviewContent] = useState('')
  const [approveAmount, setApproveAmount] = useState('80,000')
  const [approveTerm, setApproveTerm] = useState(12)
  const [approveRate, setApproveRate] = useState('18.5')

  const selectedApp = mockApplications.find((a) => a.id === selectedAppId) || mockApplications[0]

  const filteredApplications = mockApplications.filter((app) => {
    const matchesSearch = app.name.includes(searchQuery) || app.id.includes(searchQuery)
    const matchesRisk = riskFilter === '全部' || app.riskLevel === riskFilter.charAt(0)
    const matchesStatus = statusFilter === '全部'
    return matchesSearch && matchesRisk && matchesStatus
  })

  const InfoRow = ({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) => (
    <div className="flex items-start gap-2.5 py-2">
      <div className="mt-0.5 w-4 h-4 text-slate-400 flex-shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs text-slate-400 mb-0.5">{label}</div>
        <div className="text-sm text-slate-700 font-medium truncate">{value}</div>
      </div>
    </div>
  )

  const DecisionButton = ({
    icon: Icon,
    label,
    variant,
    size = 'normal',
    onClick,
  }: {
    icon: typeof Check
    label: string
    variant: 'success' | 'warning' | 'danger' | 'info' | 'confirm'
    size?: 'normal' | 'large'
    onClick?: () => void
  }) => {
    const variantClasses = {
      success: 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-emerald-200',
      warning: 'bg-amber-500 hover:bg-amber-600 text-white border-amber-500 shadow-amber-200',
      danger: 'bg-red-600 hover:bg-red-700 text-white border-red-600 shadow-red-200',
      info: 'bg-slate-600 hover:bg-slate-700 text-white border-slate-600 shadow-slate-200',
      confirm: 'bg-teal-700 hover:bg-teal-800 text-white border-teal-700 shadow-teal-200',
    }

    return (
      <button
        onClick={onClick}
        className={cn(
          'w-full flex items-center justify-center gap-2.5 rounded-xl font-semibold border transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]',
          size === 'large' ? 'px-5 py-4 text-base' : 'px-4 py-3 text-sm',
          variantClasses[variant]
        )}
      >
        <Icon className={cn(size === 'large' ? 'w-5 h-5' : 'w-4 h-4')} />
        {label}
      </button>
    )
  }

  return (
    <div className="min-h-screen pb-8">
      <div className="px-6 py-6 page-fade-enter">
        {/* 页面头部 */}
        <div className="card-base p-5 mb-5">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-shrink-0">
              <div className="flex items-center gap-3 mb-1.5">
                <div className="w-1.5 h-7 bg-primary-600 rounded-full" />
                <h1 className="text-2xl font-bold text-slate-900">人工审核审批</h1>
              </div>
              <p className="text-sm text-slate-500 ml-4.5">审核员对已评分申请进行审批决策</p>
            </div>

            <div className="flex items-center gap-6 flex-shrink-0">
              <div className="flex items-center bg-slate-100 rounded-xl p-1">
                {filterTabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                      activeTab === tab.key
                        ? 'bg-white text-primary-700 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    )}
                  >
                    {tab.label}
                    <span
                      className={cn(
                        'ml-1.5 px-1.5 py-0.5 rounded text-xs font-semibold',
                        activeTab === tab.key
                          ? 'bg-primary-100 text-primary-700'
                          : 'bg-slate-200 text-slate-500'
                      )}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex items-center bg-slate-100 rounded-xl p-1">
                <button
                  onClick={() => setReviewMode('single')}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all duration-200',
                    reviewMode === 'single'
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  )}
                >
                  <User className="w-3.5 h-3.5" />
                  单人审核
                </button>
                <button
                  onClick={() => setReviewMode('joint')}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all duration-200',
                    reviewMode === 'joint'
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  )}
                >
                  <Users className="w-3.5 h-3.5" />
                  会审模式
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 三栏主体布局 */}
        <div className="grid grid-cols-12 gap-5">
          {/* 左栏 - 申请列表 */}
          <div className="col-span-3 flex flex-col gap-4">
            <div className="card-base p-4">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-semibold text-slate-800 text-base">申请列表</h3>
                <button className="ml-auto p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="搜索申请人、申请编号..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <select
                      value={riskFilter}
                      onChange={(e) => setRiskFilter(e.target.value)}
                      className="w-full px-3 py-2 pr-8 border border-slate-200 rounded-lg text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all cursor-pointer appearance-none"
                    >
                      {riskLevelOptions.map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 pr-8 border border-slate-200 rounded-lg text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all cursor-pointer appearance-none"
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-2 max-h-[calc(100vh-380px)] overflow-y-auto pr-1">
                {filteredApplications.map((app) => {
                  const isSelected = app.id === selectedAppId
                  const avatarColor = {
                    A: 'bg-emerald-100 text-emerald-700',
                    B: 'bg-blue-100 text-blue-700',
                    C: 'bg-amber-100 text-amber-700',
                    D: 'bg-orange-100 text-orange-700',
                    E: 'bg-red-100 text-red-700',
                  }[app.riskLevel] || 'bg-slate-100 text-slate-700'

                  return (
                    <div
                      key={app.id}
                      onClick={() => setSelectedAppId(app.id)}
                      className={cn(
                        'relative rounded-xl border cursor-pointer transition-all duration-200 overflow-hidden',
                        isSelected
                          ? 'bg-primary-50/60 border-primary-200 shadow-sm'
                          : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                      )}
                    >
                      {isSelected && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-600" />
                      )}
                      <div className="p-3.5 pl-4">
                        <div className="flex items-start justify-between gap-3 mb-2.5">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={cn(
                                'w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0',
                                avatarColor
                              )}
                            >
                              {getInitials(app.name)}
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-slate-800 truncate">{app.name}</div>
                              <div className="text-xs text-slate-400 mt-0.5">{app.applyTime}</div>
                            </div>
                          </div>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className={cn(
                              'p-1 rounded-md transition-colors flex-shrink-0',
                              isSelected ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-amber-500 hover:bg-amber-50'
                            )}
                          >
                            <Star className="w-3.5 h-3.5" fill={isSelected ? 'currentColor' : 'none'} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-sm font-bold text-slate-700">
                            {formatMoney(app.amount)}
                          </div>
                          <div className="text-xs text-slate-400">{app.term}个月</div>
                        </div>
                        <div className="flex items-center gap-1.5 mt-2.5">
                          <RiskBadge level={app.riskLevel} size="sm" />
                          <StatusTag status={app.status} size="sm" />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* 中栏 - 审核主面板 */}
          <div className="col-span-6 flex flex-col gap-5">
            {/* 申请摘要卡 */}
            <div className="card-base p-5">
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center text-xl font-bold text-primary-700">
                    {getInitials(selectedApp.name)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold text-slate-900">{selectedApp.name}</h2>
                      <RiskBadge level={selectedApp.riskLevel} size="md" showLabel />
                      <StatusTag status="审核中" size="md" />
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                      <span>申请编号：LA20260609001</span>
                      <span>·</span>
                      <span>提交时间：2026-06-09 09:15</span>
                    </div>
                  </div>
                </div>
                <button className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  查看完整档案
                </button>
              </div>

              <div className="grid grid-cols-4 gap-5 pt-4 border-t border-slate-100">
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <User className="w-3.5 h-3.5 text-primary-500" />
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">基本信息</span>
                  </div>
                  <div className="space-y-0.5">
                    <InfoRow icon={CreditCard} label="身份证" value={formatIdCard('110101199001011234')} />
                    <InfoRow icon={CreditCard} label="手机号" value={formatPhone('13812345678')} />
                    <InfoRow icon={User} label="年龄" value="35岁" />
                    <InfoRow icon={Users} label="婚姻" value="已婚" />
                    <InfoRow icon={FileText} label="学历" value="本科" />
                    <InfoRow icon={Clock} label="城市" value="北京" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Briefcase className="w-3.5 h-3.5 text-primary-500" />
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">工作信息</span>
                  </div>
                  <div className="space-y-0.5">
                    <InfoRow icon={Briefcase} label="单位" value="某科技有限公司" />
                    <InfoRow icon={User} label="职位" value="高级工程师" />
                    <InfoRow icon={Clock} label="入职时间" value="2021-03" />
                    <InfoRow icon={CreditCard} label="月收入" value="¥25,000" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Banknote className="w-3.5 h-3.5 text-primary-500" />
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">贷款信息</span>
                  </div>
                  <div className="space-y-0.5">
                    <InfoRow icon={Banknote} label="金额" value={formatMoney(selectedApp.amount)} />
                    <InfoRow icon={Clock} label="期限" value={`${selectedApp.term}个月`} />
                    <InfoRow icon={FileText} label="产品" value="消费贷" />
                    <InfoRow icon={FileText} label="用途" value="家居装修" />
                    <InfoRow icon={CreditCard} label="还款方式" value="等额本息" />
                    <InfoRow icon={Users} label="渠道" value="线上APP" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <BarChart3 className="w-3.5 h-3.5 text-primary-500" />
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">评分信息</span>
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-start gap-2.5 py-2">
                      <div className="mt-0.5 w-4 h-4 text-slate-400 flex-shrink-0">
                        <BarChart3 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 mb-0.5">综合评分</div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-bold text-primary-700">675</span>
                          <span className="text-xs text-slate-400">/ 1000</span>
                        </div>
                      </div>
                    </div>
                    <InfoRow icon={AlertTriangle} label="命中规则" value="11条" />
                    <InfoRow icon={Banknote} label="建议额度" value="¥80,000" />
                    <InfoRow icon={CreditCard} label="建议利率" value="18.5%" />
                  </div>
                </div>
              </div>
            </div>

            {/* 人工批注区 */}
            <div className="card-base p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 bg-primary-500 rounded-full" />
                  <h3 className="text-base font-semibold text-slate-900">审核意见与批注</h3>
                </div>
                <span className="text-xs text-slate-400">将作为审批决策的重要依据</span>
              </div>

              {mockComments.length > 0 && (
                <div className="mb-5 space-y-3">
                  <div className="text-xs font-medium text-slate-500 mb-2">历史批注</div>
                  <div className="relative pl-5">
                    <div className="absolute left-1.5 top-1 bottom-1 w-0.5 bg-slate-100 rounded-full" />
                    {mockComments.map((comment) => (
                      <div key={comment.id} className="relative mb-4 last:mb-0">
                        <div
                          className={cn(
                            'absolute -left-3.5 top-1.5 w-3 h-3 rounded-full border-2 border-white',
                            comment.type === 'decision'
                              ? 'bg-primary-500'
                              : 'bg-slate-300'
                          )}
                        />
                        <div className="bg-slate-50 rounded-xl p-3.5">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-slate-800">{comment.author}</span>
                              <span className="text-xs text-slate-400">{comment.role}</span>
                              {comment.decision && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 font-medium">
                                  {comment.decision}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-400">{comment.time}</span>
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-medium text-slate-500">新建批注</span>
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                      <Bold className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                      <Italic className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-slate-200 mx-1" />
                    <button className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                      <List className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                      <ListOrdered className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-slate-200 mx-1" />
                    <button className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                      <Paperclip className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <textarea
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  placeholder="请输入审核意见，描述审批理由、风险关注点或补充要求..."
                  className="w-full min-h-[140px] px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all resize-y"
                />
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <Paperclip className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm text-emerald-700 font-medium">审批相关附件.zip</span>
                      <Check className="w-4 h-4 text-emerald-600" />
                    </div>
                    <button className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      重新上传
                    </button>
                  </div>
                  <span className="text-xs text-slate-400">{reviewContent.length}/500字</span>
                </div>
              </div>
            </div>

            {/* 补件清单 */}
            {showSupplements && (
              <div className="card-base p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-5 bg-amber-500 rounded-full" />
                    <h3 className="text-base font-semibold text-slate-900">补件材料清单</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                      {mockSupplements.filter((s) => s.status === 'pending').length} 项待补充
                    </span>
                  </div>
                  <button className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" />
                    添加补件项
                  </button>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-100">
                  <table className="w-full">
                    <thead>
                      <tr className="table-header">
                        <th className="px-4 py-3 text-left font-semibold">材料名称</th>
                        <th className="px-4 py-3 text-left font-semibold">要求说明</th>
                        <th className="px-4 py-3 text-left font-semibold">截止日期</th>
                        <th className="px-4 py-3 text-left font-semibold">状态</th>
                        <th className="px-4 py-3 text-right font-semibold">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {mockSupplements.map((item) => (
                        <tr key={item.id} className="table-row-hover">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-slate-400" />
                              <span className="text-sm font-medium text-slate-700">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-500">{item.requirement}</td>
                          <td className="px-4 py-3 text-sm text-slate-600 font-medium">{item.deadline}</td>
                          <td className="px-4 py-3">
                            {item.status === 'pending' ? (
                              <StatusTag label="待补充" color="text-amber-700" bgColor="bg-amber-100" size="sm" />
                            ) : (
                              <StatusTag label="已补充（待核验）" color="text-blue-700" bgColor="bg-blue-100" size="sm" />
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                              查看/催促
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* 右栏 - 操作+轨迹 */}
          <div className="col-span-3 flex flex-col gap-5">
            {/* 审核操作面板 */}
            <div className="card-base p-5">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-5 bg-primary-500 rounded-full" />
                <h3 className="text-base font-semibold text-slate-900">审批决策</h3>
              </div>

              <div className="space-y-3 mb-5">
                <DecisionButton icon={Check} label="通过审批" variant="success" size="large" />
                <DecisionButton icon={RefreshCw} label="退回补件" variant="warning" />
                <DecisionButton icon={X} label="拒绝申请" variant="danger" />
                <DecisionButton icon={ArrowUpCircle} label="提交复审" variant="info" />
                <DecisionButton icon={Banknote} label="确认放款" variant="confirm" />
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">审批额度</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">¥</span>
                    <input
                      type="text"
                      value={approveAmount}
                      onChange={(e) => setApproveAmount(e.target.value)}
                      className="w-full pl-7 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">审批期限</label>
                  <div className="relative">
                    <select
                      value={approveTerm}
                      onChange={(e) => setApproveTerm(Number(e.target.value))}
                      className="w-full px-3 py-2.5 pr-8 border border-slate-200 rounded-lg text-sm font-semibold bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all cursor-pointer appearance-none"
                    >
                      {termOptions.map((t) => (
                        <option key={t} value={t}>{t} 个月</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">执行利率</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={approveRate}
                      onChange={(e) => setApproveRate(e.target.value)}
                      className="w-full pl-3 pr-8 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">%</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4.5 h-4.5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-amber-800 mb-1">决策建议提醒</div>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      该申请为<span className="font-semibold">C级风险</span>，命中<span className="font-semibold">3条严重规则</span>，涉及多头借贷和收入稳定性疑点，建议谨慎审批。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 审核轨迹时间轴 */}
            <div className="card-base p-5">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-5 bg-accent-500 rounded-full" />
                <h3 className="text-base font-semibold text-slate-900">审核流程轨迹</h3>
              </div>
              <Timeline items={auditTimeline} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
