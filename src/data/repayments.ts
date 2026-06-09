export interface RepaymentPlan {
  id: string;
  applicationId: string;
  applyNo: string;
  applicantName: string;
  loanAmount: number;
  totalTerm: number;
  remainingTerm: number;
  annualRate: number;
  monthlyPayment: number;
  totalRepaid: number;
  totalOverdue: number;
  status: string;
  disbursementDate: string;
  firstRepayDate: string;
}

export interface RepaymentSchedule {
  id: string;
  planId: string;
  termNo: number;
  dueDate: string;
  principal: number;
  interest: number;
  totalAmount: number;
  repaidAmount: number;
  status: '已还' | '待还' | '逾期';
  repaidDate?: string;
  overdueDays?: number;
  overdueFee?: number;
  remark?: string;
}

export interface CollectionRecord {
  id: string;
  planId: string;
  applicationId: string;
  termNo: number;
  collectionTime: string;
  collectionMethod: '电话催收' | '短信提醒' | '上门催收' | '委外催收' | '律师函';
  collector: string;
  contactResult: '本人接听' | '无人接听' | '关机' | '空号' | '他人接听' | '承诺还款';
  overdueAmount: number;
  overdueDays: number;
  description: string;
  nextAction?: string;
  nextActionDate?: string;
}

export const repaymentPlans: RepaymentPlan[] = [
  {
    id: 'PLAN001',
    applicationId: 'APP007',
    applyNo: 'LN20260515007',
    applicantName: '赵敏',
    loanAmount: 20000,
    totalTerm: 6,
    remainingTerm: 1,
    annualRate: 15.6,
    monthlyPayment: 3468.56,
    totalRepaid: 17342.80,
    totalOverdue: 0,
    status: '还款中',
    disbursementDate: '2026-04-12',
    firstRepayDate: '2026-05-12',
  },
  {
    id: 'PLAN002',
    applicationId: 'APP013',
    applyNo: 'LN20260515013',
    applicantName: '许琳',
    loanAmount: 750000,
    totalTerm: 60,
    remainingTerm: 57,
    annualRate: 10.2,
    monthlyPayment: 16032.85,
    totalRepaid: 48098.55,
    totalOverdue: 0,
    status: '还款中',
    disbursementDate: '2026-03-18',
    firstRepayDate: '2026-04-18',
  },
  {
    id: 'PLAN003',
    applicationId: 'APP006',
    applyNo: 'LN20260515006',
    applicantName: '杨帆',
    loanAmount: 150000,
    totalTerm: 36,
    remainingTerm: 33,
    annualRate: 11.2,
    monthlyPayment: 4928.33,
    totalRepaid: 14785.00,
    totalOverdue: 4928.33,
    status: '还款中-有逾期',
    disbursementDate: '2026-05-22',
    firstRepayDate: '2026-06-22',
  },
  {
    id: 'PLAN004',
    applicationId: 'APP012',
    applyNo: 'LN20260515012',
    applicantName: '冯涛',
    loanAmount: 120000,
    totalTerm: 24,
    remainingTerm: 23,
    annualRate: 12.0,
    monthlyPayment: 5647.29,
    totalRepaid: 5647.29,
    totalOverdue: 0,
    status: '还款中',
    disbursementDate: '2026-05-27',
    firstRepayDate: '2026-06-27',
  },
];

export const repaymentSchedules: RepaymentSchedule[] = [
  {
    id: 'SCH001',
    planId: 'PLAN003',
    termNo: 1,
    dueDate: '2026-06-22',
    principal: 3528.33,
    interest: 1400.00,
    totalAmount: 4928.33,
    repaidAmount: 0,
    status: '逾期',
    overdueDays: 18,
    overdueFee: 265.18,
    remark: '还款日账户余额不足，扣款失败',
  },
  {
    id: 'SCH002',
    planId: 'PLAN003',
    termNo: 2,
    dueDate: '2026-07-22',
    principal: 3561.26,
    interest: 1367.07,
    totalAmount: 4928.33,
    repaidAmount: 0,
    status: '待还',
  },
  {
    id: 'SCH003',
    planId: 'PLAN003',
    termNo: 3,
    dueDate: '2026-08-22',
    principal: 3594.50,
    interest: 1333.83,
    totalAmount: 4928.33,
    repaidAmount: 0,
    status: '待还',
  },
  {
    id: 'SCH004',
    planId: 'PLAN003',
    termNo: 4,
    dueDate: '2026-09-22',
    principal: 3628.05,
    interest: 1300.28,
    totalAmount: 4928.33,
    repaidAmount: 0,
    status: '待还',
  },
  {
    id: 'SCH005',
    planId: 'PLAN003',
    termNo: 5,
    dueDate: '2026-10-22',
    principal: 3661.91,
    interest: 1266.42,
    totalAmount: 4928.33,
    repaidAmount: 0,
    status: '待还',
  },
  {
    id: 'SCH006',
    planId: 'PLAN003',
    termNo: 6,
    dueDate: '2026-11-22',
    principal: 3696.09,
    interest: 1232.24,
    totalAmount: 4928.33,
    repaidAmount: 0,
    status: '待还',
  },
  {
    id: 'SCH007',
    planId: 'PLAN003',
    termNo: 7,
    dueDate: '2026-12-22',
    principal: 3730.59,
    interest: 1197.74,
    totalAmount: 4928.33,
    repaidAmount: 0,
    status: '待还',
  },
  {
    id: 'SCH008',
    planId: 'PLAN003',
    termNo: 8,
    dueDate: '2027-01-22',
    principal: 3765.40,
    interest: 1162.93,
    totalAmount: 4928.33,
    repaidAmount: 0,
    status: '待还',
  },
  {
    id: 'SCH009',
    planId: 'PLAN003',
    termNo: 9,
    dueDate: '2027-02-22',
    principal: 3800.54,
    interest: 1127.79,
    totalAmount: 4928.33,
    repaidAmount: 0,
    status: '待还',
  },
  {
    id: 'SCH010',
    planId: 'PLAN003',
    termNo: 10,
    dueDate: '2027-03-22',
    principal: 3836.00,
    interest: 1092.33,
    totalAmount: 4928.33,
    repaidAmount: 0,
    status: '待还',
  },
  {
    id: 'SCH011',
    planId: 'PLAN003',
    termNo: 11,
    dueDate: '2027-04-22',
    principal: 3871.79,
    interest: 1056.54,
    totalAmount: 4928.33,
    repaidAmount: 0,
    status: '待还',
  },
  {
    id: 'SCH012',
    planId: 'PLAN003',
    termNo: 12,
    dueDate: '2027-05-22',
    principal: 3907.91,
    interest: 1020.42,
    totalAmount: 4928.33,
    repaidAmount: 0,
    status: '待还',
  },
];

export const collectionRecords: CollectionRecord[] = [
  {
    id: 'COL001',
    planId: 'PLAN003',
    applicationId: 'APP006',
    termNo: 1,
    collectionTime: '2026-06-23 09:30:00',
    collectionMethod: '短信提醒',
    collector: '系统自动',
    contactResult: '本人接听',
    overdueAmount: 4928.33,
    overdueDays: 1,
    description: '发送还款提醒短信，告知客户已逾期1天，提醒尽快处理',
    nextAction: 'T+3日内电话联系',
    nextActionDate: '2026-06-26',
  },
  {
    id: 'COL002',
    planId: 'PLAN003',
    applicationId: 'APP006',
    termNo: 1,
    collectionTime: '2026-06-26 10:15:00',
    collectionMethod: '电话催收',
    collector: '催收专员-李明',
    contactResult: '本人接听',
    overdueAmount: 4928.33,
    overdueDays: 4,
    description: '电话联系客户本人，客户称近期资金周转困难，承诺下周一前还款',
    nextAction: '跟进承诺还款日期',
    nextActionDate: '2026-06-29',
  },
  {
    id: 'COL003',
    planId: 'PLAN003',
    applicationId: 'APP006',
    termNo: 1,
    collectionTime: '2026-06-29 14:20:00',
    collectionMethod: '电话催收',
    collector: '催收专员-李明',
    contactResult: '无人接听',
    overdueAmount: 4928.33,
    overdueDays: 7,
    description: '拨打客户电话3次，均无人接听，已发送催收短信',
    nextAction: '拨打紧急联系人电话',
    nextActionDate: '2026-07-01',
  },
  {
    id: 'COL004',
    planId: 'PLAN003',
    applicationId: 'APP006',
    termNo: 1,
    collectionTime: '2026-07-01 11:00:00',
    collectionMethod: '电话催收',
    collector: '催收专员-王芳',
    contactResult: '他人接听',
    overdueAmount: 5193.51,
    overdueDays: 9,
    description: '联系到客户配偶张先生，张先生表示会转告客户尽快处理还款',
    nextAction: '再次联系客户本人',
    nextActionDate: '2026-07-03',
  },
  {
    id: 'COL005',
    planId: 'PLAN003',
    applicationId: 'APP006',
    termNo: 1,
    collectionTime: '2026-07-03 16:45:00',
    collectionMethod: '电话催收',
    collector: '催收主管-张伟',
    contactResult: '承诺还款',
    overdueAmount: 5193.51,
    overdueDays: 11,
    description: '客户本人接听，态度良好，说明家中突发情况导致逾期，承诺7月8日前全额还款并承担罚息',
    nextAction: '跟进7月8日还款情况',
    nextActionDate: '2026-07-08',
  },
  {
    id: 'COL006',
    planId: 'PLAN003',
    applicationId: 'APP006',
    termNo: 1,
    collectionTime: '2026-07-06 10:30:00',
    collectionMethod: '上门催收',
    collector: '外勤催收-刘强、外勤催收-陈刚',
    contactResult: '本人接听',
    overdueAmount: 5193.51,
    overdueDays: 14,
    description: '按照客户预留地址上门核实，客户本人在家，当面确认还款承诺，签署还款保证书',
    nextAction: '等待7月8日还款',
    nextActionDate: '2026-07-08',
  },
  {
    id: 'COL007',
    planId: 'PLAN003',
    applicationId: 'APP006',
    termNo: 1,
    collectionTime: '2026-07-09 09:00:00',
    collectionMethod: '电话催收',
    collector: '催收主管-张伟',
    contactResult: '关机',
    overdueAmount: 5193.51,
    overdueDays: 17,
    description: '客户承诺还款日已过，再次拨打电话已关机，建议升级催收措施',
    nextAction: '发送律师函通知',
    nextActionDate: '2026-07-10',
  },
];
