export interface DailyTrend {
  date: string;
  applyCount: number;
  approveCount: number;
  approveRate: number;
  applyAmount: number;
  approveAmount: number;
}

export interface ChannelStat {
  channel: string;
  applyCount: number;
  approveCount: number;
  approveRate: number;
  applyAmount: number;
  approveAmount: number;
  avgApproveAmount: number;
  overdueRate: number;
}

export interface CityStat {
  city: string;
  province: string;
  applyCount: number;
  approveCount: number;
  approveRate: number;
  applyAmount: number;
  approveAmount: number;
  riskLevelA: number;
  riskLevelB: number;
  riskLevelC: number;
  riskLevelD: number;
  riskLevelE: number;
}

export interface ProductStat {
  product: string;
  applyCount: number;
  approveCount: number;
  approveRate: number;
  applyAmount: number;
  approveAmount: number;
  avgTerm: number;
  avgRate: number;
  overdueCount: number;
  overdueRate: number;
}

export interface RiskLevelDist {
  level: string;
  levelName: string;
  count: number;
  ratio: number;
  applyAmount: number;
  approveAmount: number;
  avgApproveRate: number;
}

export interface ReportSummary {
  totalApplyCount: number;
  totalApproveCount: number;
  totalApproveRate: number;
  totalApplyAmount: number;
  totalApproveAmount: number;
  totalOverdueCount: number;
  totalOverdueRate: number;
  avgApproveAmount: number;
}

export const reportSummary: ReportSummary = {
  totalApplyCount: 4856,
  totalApproveCount: 3182,
  totalApproveRate: 65.5,
  totalApplyAmount: 825600000,
  totalApproveAmount: 518200000,
  totalOverdueCount: 412,
  totalOverdueRate: 12.9,
  avgApproveAmount: 162854,
};

export const dailyTrends: DailyTrend[] = [
  { date: '2026-05-11', applyCount: 128, approveCount: 85, approveRate: 66.4, applyAmount: 21500000, approveAmount: 13800000 },
  { date: '2026-05-12', applyCount: 145, approveCount: 92, approveRate: 63.4, applyAmount: 24800000, approveAmount: 15200000 },
  { date: '2026-05-13', applyCount: 162, approveCount: 108, approveRate: 66.7, applyAmount: 27600000, approveAmount: 17800000 },
  { date: '2026-05-14', applyCount: 138, approveCount: 95, approveRate: 68.8, applyAmount: 23500000, approveAmount: 15500000 },
  { date: '2026-05-15', applyCount: 172, approveCount: 115, approveRate: 66.9, applyAmount: 29500000, approveAmount: 19200000 },
  { date: '2026-05-16', applyCount: 185, approveCount: 122, approveRate: 65.9, applyAmount: 31200000, approveAmount: 20500000 },
  { date: '2026-05-17', applyCount: 198, approveCount: 128, approveRate: 64.6, applyAmount: 33800000, approveAmount: 21800000 },
  { date: '2026-05-18', applyCount: 156, approveCount: 102, approveRate: 65.4, applyAmount: 26800000, approveAmount: 17200000 },
  { date: '2026-05-19', applyCount: 142, approveCount: 95, approveRate: 66.9, applyAmount: 24200000, approveAmount: 15800000 },
  { date: '2026-05-20', applyCount: 168, approveCount: 110, approveRate: 65.5, applyAmount: 28500000, approveAmount: 18500000 },
  { date: '2026-05-21', applyCount: 175, approveCount: 118, approveRate: 67.4, applyAmount: 29800000, approveAmount: 19800000 },
  { date: '2026-05-22', applyCount: 182, approveCount: 115, approveRate: 63.2, applyAmount: 31000000, approveAmount: 18800000 },
  { date: '2026-05-23', applyCount: 195, approveCount: 132, approveRate: 67.7, applyAmount: 33500000, approveAmount: 22500000 },
  { date: '2026-05-24', applyCount: 208, approveCount: 138, approveRate: 66.3, applyAmount: 35200000, approveAmount: 23200000 },
  { date: '2026-05-25', applyCount: 165, approveCount: 108, approveRate: 65.5, applyAmount: 28200000, approveAmount: 17800000 },
  { date: '2026-05-26', applyCount: 148, approveCount: 98, approveRate: 66.2, applyAmount: 25500000, approveAmount: 16200000 },
  { date: '2026-05-27', applyCount: 172, approveCount: 112, approveRate: 65.1, applyAmount: 29500000, approveAmount: 18800000 },
  { date: '2026-05-28', applyCount: 185, approveCount: 125, approveRate: 67.6, applyAmount: 31800000, approveAmount: 21200000 },
  { date: '2026-05-29', applyCount: 192, approveCount: 122, approveRate: 63.5, applyAmount: 32800000, approveAmount: 19800000 },
  { date: '2026-05-30', applyCount: 205, approveCount: 135, approveRate: 65.9, applyAmount: 34800000, approveAmount: 22800000 },
  { date: '2026-05-31', applyCount: 218, approveCount: 142, approveRate: 65.1, applyAmount: 37200000, approveAmount: 24200000 },
  { date: '2026-06-01', applyCount: 175, approveCount: 115, approveRate: 65.7, applyAmount: 29800000, approveAmount: 19200000 },
  { date: '2026-06-02', applyCount: 158, approveCount: 105, approveRate: 66.5, applyAmount: 27200000, approveAmount: 17500000 },
  { date: '2026-06-03', applyCount: 182, approveCount: 118, approveRate: 64.8, applyAmount: 31000000, approveAmount: 19800000 },
  { date: '2026-06-04', applyCount: 195, approveCount: 130, approveRate: 66.7, applyAmount: 33500000, approveAmount: 22200000 },
  { date: '2026-06-05', applyCount: 188, approveCount: 120, approveRate: 63.8, applyAmount: 32200000, approveAmount: 19500000 },
  { date: '2026-06-06', applyCount: 212, approveCount: 140, approveRate: 66.0, applyAmount: 36200000, approveAmount: 23800000 },
  { date: '2026-06-07', applyCount: 225, approveCount: 148, approveRate: 65.8, applyAmount: 38500000, approveAmount: 25200000 },
  { date: '2026-06-08', applyCount: 168, approveCount: 110, approveRate: 65.5, applyAmount: 28800000, approveAmount: 18500000 },
  { date: '2026-06-09', applyCount: 145, approveCount: 96, approveRate: 66.2, applyAmount: 24800000, approveAmount: 16200000 },
];

export const channelStats: ChannelStat[] = [
  {
    channel: '线上APP',
    applyCount: 2158,
    approveCount: 1428,
    approveRate: 66.2,
    applyAmount: 325800000,
    approveAmount: 205200000,
    avgApproveAmount: 143700,
    overdueRate: 11.8,
  },
  {
    channel: '合作门店',
    applyCount: 1256,
    approveCount: 852,
    approveRate: 67.8,
    applyAmount: 268500000,
    approveAmount: 175800000,
    avgApproveAmount: 206300,
    overdueRate: 10.5,
  },
  {
    channel: '电话营销',
    applyCount: 685,
    approveCount: 438,
    approveRate: 63.9,
    applyAmount: 125600000,
    approveAmount: 78500000,
    avgApproveAmount: 179200,
    overdueRate: 15.2,
  },
  {
    channel: '线下推广',
    applyCount: 452,
    approveCount: 285,
    approveRate: 63.1,
    applyAmount: 68500000,
    approveAmount: 41200000,
    avgApproveAmount: 144600,
    overdueRate: 14.8,
  },
  {
    channel: '老客户推荐',
    applyCount: 185,
    approveCount: 128,
    approveRate: 69.2,
    applyAmount: 28200000,
    approveAmount: 12500000,
    avgApproveAmount: 97700,
    overdueRate: 8.5,
  },
  {
    channel: '第三方导流',
    applyCount: 120,
    approveCount: 51,
    approveRate: 42.5,
    applyAmount: 9000000,
    approveAmount: 5000000,
    avgApproveAmount: 98000,
    overdueRate: 22.5,
  },
];

export const cityStats: CityStat[] = [
  {
    city: '北京',
    province: '北京',
    applyCount: 856,
    approveCount: 598,
    approveRate: 69.9,
    applyAmount: 185600000,
    approveAmount: 125800000,
    riskLevelA: 145, riskLevelB: 268, riskLevelC: 285, riskLevelD: 125, riskLevelE: 33,
  },
  {
    city: '上海',
    province: '上海',
    applyCount: 825,
    approveCount: 568,
    approveRate: 68.8,
    applyAmount: 178500000,
    approveAmount: 118500000,
    riskLevelA: 138, riskLevelB: 255, riskLevelC: 278, riskLevelD: 122, riskLevelE: 32,
  },
  {
    city: '广州',
    province: '广东',
    applyCount: 568,
    approveCount: 375,
    approveRate: 66.0,
    applyAmount: 98500000,
    approveAmount: 62500000,
    riskLevelA: 85, riskLevelB: 168, riskLevelC: 195, riskLevelD: 88, riskLevelE: 32,
  },
  {
    city: '深圳',
    province: '广东',
    applyCount: 612,
    approveCount: 395,
    approveRate: 64.5,
    applyAmount: 112500000,
    approveAmount: 68800000,
    riskLevelA: 88, riskLevelB: 175, riskLevelC: 208, riskLevelD: 102, riskLevelE: 39,
  },
  {
    city: '杭州',
    province: '浙江',
    applyCount: 458,
    approveCount: 312,
    approveRate: 68.1,
    applyAmount: 78500000,
    approveAmount: 52500000,
    riskLevelA: 75, riskLevelB: 142, riskLevelC: 152, riskLevelD: 65, riskLevelE: 24,
  },
  {
    city: '成都',
    province: '四川',
    applyCount: 385,
    approveCount: 242,
    approveRate: 62.9,
    applyAmount: 58500000,
    approveAmount: 35800000,
    riskLevelA: 52, riskLevelB: 108, riskLevelC: 135, riskLevelD: 65, riskLevelE: 25,
  },
  {
    city: '武汉',
    province: '湖北',
    applyCount: 325,
    approveCount: 205,
    approveRate: 63.1,
    applyAmount: 48200000,
    approveAmount: 29500000,
    riskLevelA: 45, riskLevelB: 95, riskLevelC: 112, riskLevelD: 52, riskLevelE: 21,
  },
  {
    city: '南京',
    province: '江苏',
    applyCount: 298,
    approveCount: 198,
    approveRate: 66.4,
    applyAmount: 45800000,
    approveAmount: 28800000,
    riskLevelA: 48, riskLevelB: 92, riskLevelC: 98, riskLevelD: 45, riskLevelE: 15,
  },
  {
    city: '西安',
    province: '陕西',
    applyCount: 285,
    approveCount: 168,
    approveRate: 58.9,
    applyAmount: 38500000,
    approveAmount: 22500000,
    riskLevelA: 35, riskLevelB: 78, riskLevelC: 102, riskLevelD: 52, riskLevelE: 18,
  },
  {
    city: '重庆',
    province: '重庆',
    applyCount: 244,
    approveCount: 121,
    approveRate: 49.6,
    applyAmount: 31000000,
    approveAmount: 18500000,
    riskLevelA: 28, riskLevelB: 65, riskLevelC: 88, riskLevelD: 45, riskLevelE: 18,
  },
];

export const productStats: ProductStat[] = [
  {
    product: '消费贷',
    applyCount: 2158,
    approveCount: 1452,
    approveRate: 67.3,
    applyAmount: 258500000,
    approveAmount: 158200000,
    avgTerm: 18,
    avgRate: 13.5,
    overdueCount: 215,
    overdueRate: 14.8,
  },
  {
    product: '经营贷',
    applyCount: 856,
    approveCount: 512,
    approveRate: 59.8,
    applyAmount: 325800000,
    approveAmount: 215800000,
    avgTerm: 48,
    avgRate: 10.8,
    overdueCount: 85,
    overdueRate: 16.6,
  },
  {
    product: '装修贷',
    applyCount: 758,
    approveCount: 528,
    approveRate: 69.7,
    applyAmount: 145800000,
    approveAmount: 95800000,
    avgTerm: 36,
    avgRate: 9.8,
    overdueCount: 48,
    overdueRate: 9.1,
  },
  {
    product: '教育贷',
    applyCount: 568,
    approveCount: 402,
    approveRate: 70.8,
    applyAmount: 52500000,
    approveAmount: 32500000,
    avgTerm: 24,
    avgRate: 11.2,
    overdueCount: 35,
    overdueRate: 8.7,
  },
  {
    product: '医疗贷',
    applyCount: 516,
    approveCount: 288,
    approveRate: 55.8,
    applyAmount: 43000000,
    approveAmount: 25900000,
    avgTerm: 24,
    avgRate: 11.5,
    overdueCount: 29,
    overdueRate: 10.1,
  },
];

export const riskLevelDists: RiskLevelDist[] = [
  {
    level: 'A',
    levelName: '低风险',
    count: 743,
    ratio: 15.3,
    applyAmount: 185200000,
    approveAmount: 168500000,
    avgApproveRate: 91.0,
  },
  {
    level: 'B',
    levelName: '较低风险',
    count: 1446,
    ratio: 29.8,
    applyAmount: 268500000,
    approveAmount: 215800000,
    avgApproveRate: 80.4,
  },
  {
    level: 'C',
    levelName: '中等风险',
    count: 1655,
    ratio: 34.1,
    applyAmount: 225800000,
    approveAmount: 105200000,
    avgApproveRate: 46.6,
  },
  {
    level: 'D',
    levelName: '较高风险',
    count: 761,
    ratio: 15.7,
    applyAmount: 112500000,
    approveAmount: 25800000,
    avgApproveRate: 22.9,
  },
  {
    level: 'E',
    levelName: '高风险',
    count: 251,
    ratio: 5.1,
    applyAmount: 33600000,
    approveAmount: 2900000,
    avgApproveRate: 8.6,
  },
];

export interface ChannelRiskLevel {
  channel: string;
  levelA: number;
  levelB: number;
  levelC: number;
  levelD: number;
  levelE: number;
  avgRate: number;
}

export const channelRiskLevels: ChannelRiskLevel[] = [
  { channel: '线上APP', levelA: 332, levelB: 645, levelC: 712, levelD: 338, levelE: 131, avgRate: 13.5 },
  { channel: '合作门店', levelA: 212, levelB: 375, levelC: 418, levelD: 175, levelE: 76, avgRate: 12.8 },
  { channel: '电话营销', levelA: 85, levelB: 172, levelC: 245, levelD: 128, levelE: 55, avgRate: 15.2 },
  { channel: '线下推广', levelA: 58, levelB: 118, levelC: 162, levelD: 78, levelE: 36, avgRate: 14.8 },
  { channel: '老客户推荐', levelA: 38, levelB: 58, levelC: 52, levelD: 25, levelE: 12, avgRate: 11.2 },
  { channel: '第三方导流', levelA: 12, levelB: 25, levelC: 38, levelD: 28, levelE: 17, avgRate: 22.5 },
];

export interface FunnelStep {
  name: string;
  value: number;
  ratio: number;
}

export const funnelSteps: FunnelStep[] = [
  { name: '咨询', value: 11560, ratio: 100 },
  { name: '进件', value: 9017, ratio: 78 },
  { name: '通过核验', value: 7514, ratio: 65 },
  { name: '评分通过', value: 6705, ratio: 58 },
  { name: '人工通过', value: 5549, ratio: 48 },
  { name: '实际放款', value: 4855, ratio: 42 },
];

export interface MonthlyRiskDist {
  month: string;
  A: number;
  B: number;
  C: number;
  D: number;
  E: number;
}

export const monthlyRiskDists: MonthlyRiskDist[] = [
  { month: '1月', A: 580, B: 1120, C: 1280, D: 620, E: 220 },
  { month: '2月', A: 610, B: 1180, C: 1320, D: 640, E: 230 },
  { month: '3月', A: 640, B: 1250, C: 1420, D: 680, E: 240 },
  { month: '4月', A: 680, B: 1320, C: 1520, D: 720, E: 245 },
  { month: '5月', A: 710, B: 1380, C: 1580, D: 740, E: 248 },
  { month: '6月', A: 743, B: 1446, C: 1655, D: 761, E: 251 },
];

export interface ComparisonMetric {
  name: string;
  current: string;
  mom: string;
  momUp: boolean;
  yoy: string;
  yoyUp: boolean;
}

export const comparisonMetrics: ComparisonMetric[] = [
  { name: '总申请量', current: '4,856笔', mom: '+8.2%', momUp: true, yoy: '+15.6%', yoyUp: true },
  { name: '审批通过量', current: '3,182笔', mom: '+2.1%', momUp: true, yoy: '+10.3%', yoyUp: true },
  { name: '审批通过率', current: '65.5%', mom: '-1.2%', momUp: false, yoy: '-2.8%', yoyUp: false },
  { name: '实际放款额', current: '¥5.18亿', mom: '+11.5%', momUp: true, yoy: '+22.4%', yoyUp: true },
  { name: '平均利率', current: '17.8%', mom: '-0.3%', momUp: false, yoy: '-1.5%', yoyUp: false },
  { name: '笔均金额', current: '¥16.28万', mom: '+3.1%', momUp: true, yoy: '+8.7%', yoyUp: true },
  { name: '当期逾期率', current: '6.82%', mom: '+0.5%', momUp: false, yoy: '+1.2%', yoyUp: false },
  { name: '逾期金额', current: '¥3,528万', mom: '+7.8%', momUp: false, yoy: '+18.5%', yoyUp: false },
];

export interface CityHeatmapItem {
  region: string;
  cities: { name: string; value: number }[];
}

export const cityHeatmap: CityHeatmapItem[] = [
  {
    region: '华北',
    cities: [
      { name: '北京', value: 856 },
      { name: '天津', value: 215 },
      { name: '石家庄', value: 168 },
      { name: '太原', value: 125 },
      { name: '呼和浩特', value: 78 },
    ],
  },
  {
    region: '华东',
    cities: [
      { name: '上海', value: 825 },
      { name: '杭州', value: 458 },
      { name: '南京', value: 298 },
      { name: '苏州', value: 268 },
      { name: '宁波', value: 185 },
      { name: '合肥', value: 152 },
      { name: '福州', value: 142 },
      { name: '济南', value: 168 },
      { name: '青岛', value: 158 },
    ],
  },
  {
    region: '华南',
    cities: [
      { name: '广州', value: 568 },
      { name: '深圳', value: 612 },
      { name: '东莞', value: 235 },
      { name: '佛山', value: 198 },
      { name: '南宁', value: 125 },
      { name: '海口', value: 68 },
    ],
  },
  {
    region: '华中',
    cities: [
      { name: '武汉', value: 325 },
      { name: '郑州', value: 218 },
      { name: '长沙', value: 195 },
      { name: '南昌', value: 142 },
    ],
  },
  {
    region: '西南',
    cities: [
      { name: '成都', value: 385 },
      { name: '重庆', value: 244 },
      { name: '昆明', value: 158 },
      { name: '贵阳', value: 105 },
    ],
  },
  {
    region: '西北',
    cities: [
      { name: '西安', value: 285 },
      { name: '兰州', value: 95 },
      { name: '乌鲁木齐', value: 72 },
      { name: '银川', value: 48 },
    ],
  },
  {
    region: '东北',
    cities: [
      { name: '沈阳', value: 185 },
      { name: '大连', value: 168 },
      { name: '长春', value: 125 },
      { name: '哈尔滨', value: 142 },
    ],
  },
];
