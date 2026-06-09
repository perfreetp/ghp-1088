import { useState } from 'react';
import {
  User,
  Smartphone,
  CreditCard,
  Briefcase,
  ShieldAlert,
  Search,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileX,
  ArrowRight,
  Calendar,
  UserCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { cn } from '@/utils/helpers';
import ProgressBar from '@/components/ui/ProgressBar';
import DataTable, { DataTableColumn } from '@/components/ui/DataTable';
import StatusTag from '@/components/ui/StatusTag';
import RiskBadge from '@/components/ui/RiskBadge';
import { formatPhone, formatIdCard, formatMoney } from '@/utils/format';
import { verifications } from '@/data/verifications';

type VerificationStatus = 'pass' | 'warning' | 'fail';

interface StatusStyle {
  label: string;
  color: string;
  bgColor: string;
  dotColor: string;
}

const statusStyles: Record<VerificationStatus, StatusStyle> = {
  pass: {
    label: '通过',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    dotColor: 'bg-emerald-500',
  },
  warning: {
    label: '警告',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    dotColor: 'bg-amber-500',
  },
  fail: {
    label: '失败',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    dotColor: 'bg-red-500',
  },
};

const iconBgMap: Record<string, string> = {
  identity: 'bg-blue-500',
  phone: 'bg-emerald-500',
  bankcard: 'bg-violet-500',
  employment: 'bg-cyan-500',
  blacklist: 'bg-rose-500',
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  identity: User,
  phone: Smartphone,
  bankcard: CreditCard,
  employment: Briefcase,
  blacklist: ShieldAlert,
};

interface VerificationDetailRow {
  id: string;
  name: string;
  value: string;
  result: string;
  status: VerificationStatus;
  remark?: string;
}

function StatusIcon({ status, className }: { status: VerificationStatus; className?: string }) {
  if (status === 'pass') {
    return <CheckCircle2 className={cn('w-5 h-5 text-emerald-500', className)} />;
  }
  if (status === 'warning') {
    return <AlertTriangle className={cn('w-5 h-5 text-amber-500', className)} />;
  }
  return <XCircle className={cn('w-5 h-5 text-red-500', className)} />;
}

function buildDetailColumns(): DataTableColumn<VerificationDetailRow>[] {
  return [
    {
      key: 'name',
      title: '核验项目',
      width: '22%',
      render: (row) => (
        <span className="font-medium text-slate-800 dark:text-slate-200">{row.name}</span>
      ),
    },
    {
      key: 'value',
      title: '核验结果',
      width: '30%',
      render: (row) => (
        <span className="text-slate-700 dark:text-slate-300">{row.value}</span>
      ),
    },
    {
      key: 'result',
      title: '匹配情况',
      width: '18%',
      render: (row) => (
        <span className="text-slate-700 dark:text-slate-300">{row.result}</span>
      ),
    },
    {
      key: 'status',
      title: '状态',
      width: '12%',
      align: 'center',
      render: (row) => (
        <div className="flex justify-center">
          <StatusIcon status={row.status} />
        </div>
      ),
    },
    {
      key: 'remark',
      title: '备注',
      render: (row) => (
        <span className="text-slate-500 dark:text-slate-400 text-xs">
          {row.remark || '-'}
        </span>
      ),
    },
  ];
}

export default function Verification() {
  void verifications;
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    identity: true,
    phone: true,
    bankcard: true,
    employment: true,
    blacklist: true,
  });
  const [searchNo, setSearchNo] = useState('');

  const toggleModule = (key: string) => {
    setExpandedModules((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const applicantSummary = {
    name: '张三',
    riskLevel: 'C',
    idCard: formatIdCard('110101199001011234'),
    phone: formatPhone('13800138000'),
    amount: 150000,
    term: 12,
    status: '核验中',
    progress: 60,
    applyTime: '2026-06-08 14:23:45',
    reviewer: '李审核（工号A028）',
  };

  const categoryConfigs = [
    {
      key: 'identity',
      name: '身份核验',
      status: 'pass' as VerificationStatus,
      confidence: 90,
      color: 'blue',
      details: [
        { id: 'i1', name: '身份证OCR识别', value: '姓名"张三"', result: '匹配 ✓', status: 'pass' as VerificationStatus },
        { id: 'i2', name: '人脸比对', value: '相似度 96.8%', result: '匹配 ✓', status: 'pass' as VerificationStatus },
        { id: 'i3', name: '公安系统校验', value: '证件有效', result: '通过 ✓', status: 'pass' as VerificationStatus },
        { id: 'i4', name: '防伪特征检测', value: '通过', result: '通过 ✓', status: 'pass' as VerificationStatus },
      ],
      extra: (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">OCR识别证件缩略图</div>
          <div className="flex gap-4">
            <div className="w-44 h-28 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800/40 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">身份证正面</div>
                <div className="text-[10px] text-blue-500 dark:text-blue-500/70 mt-1">点击查看大图</div>
              </div>
            </div>
            <div className="w-44 h-28 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800/40 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">身份证反面</div>
                <div className="text-[10px] text-blue-500 dark:text-blue-500/70 mt-1">点击查看大图</div>
              </div>
            </div>
            <div className="w-44 h-28 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">人脸快照</div>
                <div className="text-[10px] text-emerald-500 dark:text-emerald-500/70 mt-1">活体检测通过</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      name: '手机号核验',
      status: 'pass' as VerificationStatus,
      confidence: 88,
      color: 'emerald',
      details: [
        { id: 'p1', name: '运营商认证', value: '中国移动', result: '通过 ✓', status: 'pass' as VerificationStatus },
        { id: 'p2', name: '在网时长', value: '5年8个月', result: '通过 ✓', status: 'pass' as VerificationStatus },
        { id: 'p3', name: '实名认证', value: '已实名', result: '通过 ✓', status: 'pass' as VerificationStatus },
        { id: 'p4', name: '近3月话费', value: '平均¥128', result: '通过 ✓', status: 'pass' as VerificationStatus },
      ],
      extra: (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">常用归属地：</span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
            北京市
          </span>
        </div>
      ),
    },
    {
      key: 'bankcard',
      name: '银行卡核验',
      status: 'warning' as VerificationStatus,
      confidence: 82,
      color: 'amber',
      details: [
        { id: 'b1', name: '卡号有效性', value: '格式正确', result: '通过 ✓', status: 'pass' as VerificationStatus },
        { id: 'b2', name: '四要素验证', value: '持卡人姓名匹配', result: '通过 ✓', status: 'pass' as VerificationStatus },
        { id: 'b3', name: '开户行信息', value: '工商银行北京朝阳支行', result: '通过 ✓', status: 'pass' as VerificationStatus },
        { id: 'b4', name: '银行卡状态', value: '近30天有3次小额非柜面交易', result: '需关注 ⚠', status: 'warning' as VerificationStatus, remark: '建议人工复核交易记录' },
      ],
      extra: null,
    },
    {
      key: 'employment',
      name: '工作信息核验',
      status: 'pass' as VerificationStatus,
      confidence: 92,
      color: 'cyan',
      details: [
        { id: 'e1', name: '单位名称', value: '北京某某科技有限公司', result: '通过 ✓', status: 'pass' as VerificationStatus },
        { id: 'e2', name: '职位信息', value: '产品经理', result: '通过 ✓', status: 'pass' as VerificationStatus },
        { id: 'e3', name: '入职时间', value: '2022年3月，在职3年3个月', result: '通过 ✓', status: 'pass' as VerificationStatus },
        { id: 'e4', name: '薪资流水', value: '近6个月月均¥18,500', result: '通过 ✓', status: 'pass' as VerificationStatus },
        { id: 'e5', name: '社保公积金', value: '连续缴纳24个月', result: '通过 ✓', status: 'pass' as VerificationStatus },
      ],
      extra: (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">单位座机：</span>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">010-88889999</span>
        </div>
      ),
    },
    {
      key: 'blacklist',
      name: '黑名单检查',
      status: 'warning' as VerificationStatus,
      confidence: 75,
      color: 'rose',
      details: [
        { id: 'k1', name: '司法黑名单', value: '无记录', result: '通过 ✓', status: 'pass' as VerificationStatus },
        { id: 'k2', name: '失信被执行人', value: '无记录', result: '通过 ✓', status: 'pass' as VerificationStatus },
        { id: 'k3', name: '多头借贷', value: '近30天6次申请，超过阈值', result: '警告 ⚠', status: 'warning' as VerificationStatus, remark: '阈值≤3次，建议人工复核' },
        { id: 'k4', name: '逾期历史记录', value: '2023年有1次30天内逾期', result: '警告 ⚠', status: 'warning' as VerificationStatus, remark: '已结清，后续无逾期' },
      ],
      extra: (
        <div className="mt-4 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <span className="font-semibold text-amber-700 dark:text-amber-400">提示：</span>
              <span className="text-amber-700 dark:text-amber-400/90">建议人工复核，重点关注多头借贷情况</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const conclusion = {
    overall: '核验完成，建议人工复核',
    totalScore: 86.5,
    indicators: [
      { status: 'pass' as VerificationStatus },
      { status: 'pass' as VerificationStatus },
      { status: 'warning' as VerificationStatus },
      { status: 'pass' as VerificationStatus },
      { status: 'warning' as VerificationStatus },
    ],
  };

  return (
    <div className="p-6 space-y-6 max-w-[1440px] mx-auto">
      {/* 页面头部 */}
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div className="flex-shrink-0">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">多维度核验中心</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">系统自动核验申请人信息真实性</p>
        </div>

        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="输入申请编号..."
              value={searchNo}
              onChange={(e) => setSearchNo(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
            />
          </div>
          <button className="px-4 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors">
            查询
          </button>
        </div>

        <button className="px-5 py-2.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium shadow-sm shadow-primary-500/25 transition-colors flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" />
          一键核验所有
        </button>
      </div>

      {/* 申请人摘要卡片 */}
      <div className="card-base rounded-xl p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <div className="flex items-start justify-between gap-8 flex-wrap">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-lg shadow-blue-500/20">
              张
            </div>
            <div className="space-y-3 flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xl font-bold text-slate-900 dark:text-white">{applicantSummary.name}</span>
                <RiskBadge level={applicantSummary.riskLevel} size="md" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">身份证：</span>
                  <span className="text-sm font-mono text-slate-700 dark:text-slate-300">{applicantSummary.idCard}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">手机号：</span>
                  <span className="text-sm font-mono text-slate-700 dark:text-slate-300">{applicantSummary.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">申请金额：</span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">¥{formatMoney(applicantSummary.amount).replace(' 元', '').replace('.00', '')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">期限：</span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{applicantSummary.term}个月</span>
                </div>
              </div>
              <div className="flex items-center gap-4 pt-1">
                <StatusTag status="reviewing" />
                <div className="flex-1 max-w-sm">
                  <ProgressBar value={applicantSummary.progress} showLabel height={6} color="blue" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-1 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500 dark:text-slate-400">进件时间：</span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{applicantSummary.applyTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500 dark:text-slate-400">分配审核员：</span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{applicantSummary.reviewer}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5个核验模块 */}
      <div className="space-y-6">
        {categoryConfigs.map((config) => {
          const statusInfo = statusStyles[config.status];
          const IconComponent = iconMap[config.key];
          const progressColor = config.status === 'pass' ? 'emerald' : config.status === 'warning' ? 'amber' : 'red';
          const isExpanded = expandedModules[config.key];

          return (
            <div
              key={config.key}
              className="card-base rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              {/* 模块头部 */}
              <div
                className="p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors"
                onClick={() => toggleModule(config.key)}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div
                    className={cn(
                      'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md',
                      iconBgMap[config.key],
                      'shadow-slate-900/5'
                    )}
                  >
                    {IconComponent && <IconComponent className="w-5 h-5 text-white" />}
                  </div>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">{config.name}</h3>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                        statusInfo.bgColor,
                        statusInfo.color,
                        'border',
                        config.status === 'pass' && 'border-emerald-200 dark:border-emerald-800/40',
                        config.status === 'warning' && 'border-amber-200 dark:border-amber-800/40',
                        config.status === 'fail' && 'border-red-200 dark:border-red-800/40'
                      )}
                    >
                      <span className={cn('w-1.5 h-1.5 rounded-full', statusInfo.dotColor)} />
                      {statusInfo.label}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="w-40 hidden sm:block">
                    <ProgressBar value={config.confidence} color={progressColor as 'emerald' | 'amber' | 'red'} showLabel height={5} />
                  </div>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600/50 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    重新核验
                  </button>
                  <div className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* 内容区 */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-0 border-t border-slate-200/60 dark:border-slate-700/60">
                  <div className="pt-5">
                    {config.key === 'blacklist' ? (
                      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                        <table className="w-full border-collapse text-sm">
                          <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                              {buildDetailColumns().map((col) => (
                                <th
                                  key={col.key}
                                  style={{ width: col.width }}
                                  className={cn(
                                    'px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap',
                                    col.align === 'center' && 'text-center'
                                  )}
                                >
                                  {col.title}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {config.details.map((row, index) => {
                              const isWarning = row.status === 'warning';
                              return (
                                <tr
                                  key={row.id}
                                  className={cn(
                                    'border-b border-slate-100 dark:border-slate-700/50 transition-colors duration-150',
                                    index % 2 === 1 && !isWarning && 'bg-slate-50/30 dark:bg-slate-800/20',
                                    isWarning && 'bg-amber-50/70 dark:bg-amber-900/15 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                                  )}
                                >
                                  <td className="px-4 py-3 text-slate-800 dark:text-slate-200 whitespace-nowrap font-medium">
                                    {row.name}
                                  </td>
                                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                                    {row.value}
                                  </td>
                                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                                    {row.result}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-center">
                                    <div className="flex justify-center">
                                      <StatusIcon status={row.status} />
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">
                                    {row.remark || '-'}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <DataTable<VerificationDetailRow>
                        columns={buildDetailColumns()}
                        data={config.details}
                        rowKey="id"
                      />
                    )}
                    {config.extra}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 核验结论卡片 */}
      <div className="card-base rounded-xl p-6 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center justify-between gap-8 flex-wrap">
          <div className="flex items-center gap-5 flex-1 min-w-0">
            <div className="px-5 py-3 rounded-xl bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800/40">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                <span className="text-base font-bold text-amber-700 dark:text-amber-400 whitespace-nowrap">
                  {conclusion.overall}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500 dark:text-slate-400">模块状态：</span>
              <div className="flex items-center gap-2">
                {conclusion.indicators.map((ind, idx) => {
                  const style = statusStyles[ind.status];
                  return (
                    <div
                      key={idx}
                      className={cn(
                        'w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-800 shadow-sm',
                        style.dotColor
                      )}
                      title={style.label}
                    />
                  );
                })}
              </div>
              <div className="flex items-center gap-2 ml-2 text-xs">
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> 3 通过
                </span>
                <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> 2 警告
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 flex-shrink-0">
            <div className="text-center pr-6 border-r border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">综合评分</div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold bg-gradient-to-br from-amber-500 to-orange-500 bg-clip-text text-transparent">
                  {String(Math.floor(conclusion.totalScore))}
                </span>
                <span className="text-lg font-bold text-amber-500">
                  .{String(Math.round((conclusion.totalScore % 1) * 10))}
                </span>
                <span className="text-sm font-medium text-slate-400 ml-1">分</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <FileX className="w-4 h-4" />
                退回补件
              </button>
              <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium shadow-sm shadow-primary-500/25 transition-colors">
                进入评分
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
