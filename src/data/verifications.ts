export interface VerificationDetail {
  name: string;
  status: 'pass' | 'warning' | 'fail';
  value?: string;
  expected?: string;
  remark?: string;
}

export interface VerificationCategory {
  category: 'identity' | 'phone' | 'bankcard' | 'employment' | 'blacklist';
  categoryName: string;
  overallStatus: 'pass' | 'warning' | 'fail';
  details: VerificationDetail[];
}

export interface Verification {
  id: string;
  applicationId: string;
  applyNo: string;
  applicantName: string;
  verifyTime: string;
  overallStatus: 'pass' | 'warning' | 'fail';
  categories: VerificationCategory[];
}

export const verifications: Verification[] = [
  {
    id: 'VER001',
    applicationId: 'APP001',
    applyNo: 'LN20260515001',
    applicantName: '张伟',
    verifyTime: '2026-06-01 09:20:15',
    overallStatus: 'pass',
    categories: [
      {
        category: 'identity',
        categoryName: '身份信息核验',
        overallStatus: 'pass',
        details: [
          { name: '身份证号校验', status: 'pass', value: '110101198505123456', expected: '有效身份证号', remark: '格式正确' },
          { name: '身份证姓名匹配', status: 'pass', value: '张伟', expected: '匹配一致', remark: '公安系统匹配成功' },
          { name: '身份证有效期', status: 'pass', value: '2040-12-31', expected: '有效期内', remark: '距到期14年' },
          { name: '人脸比对', status: 'pass', value: '98.5%', expected: '≥85%', remark: '活体检测通过' },
        ],
      },
      {
        category: 'phone',
        categoryName: '手机信息核验',
        overallStatus: 'pass',
        details: [
          { name: '手机号实名认证', status: 'pass', value: '13800138001', expected: '实名登记', remark: '机主张伟' },
          { name: '手机号在网时长', status: 'pass', value: '8年6个月', expected: '≥6个月', remark: '运营商数据' },
          { name: '常用联系人验证', status: 'warning', value: '2个', expected: '≥3个', remark: '联系人数量略少' },
          { name: '话费消费记录', status: 'pass', value: '正常', expected: '无异常', remark: '近6个月无欠费' },
        ],
      },
      {
        category: 'bankcard',
        categoryName: '银行卡核验',
        overallStatus: 'pass',
        details: [
          { name: '卡号有效性', status: 'pass', value: '622202****1234', expected: '有效卡号', remark: '工商银行储蓄卡' },
          { name: '卡户名匹配', status: 'pass', value: '张伟', expected: '匹配一致', remark: '银行系统验证' },
          { name: '预留手机号匹配', status: 'pass', value: '13800138001', expected: '匹配一致', remark: '银行预留一致' },
          { name: '银行卡状态', status: 'pass', value: '正常', expected: '正常可用', remark: '无冻结挂失' },
        ],
      },
      {
        category: 'employment',
        categoryName: '工作信息核验',
        overallStatus: 'warning',
        details: [
          { name: '工作单位验证', status: 'pass', value: '北京某科技有限公司', expected: '工商注册', remark: '企业存续状态' },
          { name: '社保缴纳记录', status: 'warning', value: '近3个月正常', expected: '近6个月连续', remark: '3个月前有断缴' },
          { name: '公积金缴纳', status: 'pass', value: '基数15000元', expected: '正常缴纳', remark: '连续缴纳2年' },
          { name: '工资流水', status: 'pass', value: '月均18500元', expected: '≥申请月供3倍', remark: '近6个月平均' },
        ],
      },
      {
        category: 'blacklist',
        categoryName: '黑名单核验',
        overallStatus: 'pass',
        details: [
          { name: '司法黑名单', status: 'pass', value: '未命中', expected: '未命中', remark: '最高法失信查询' },
          { name: '行业黑名单', status: 'pass', value: '未命中', expected: '未命中', remark: '小额贷款协会共享' },
          { name: '反欺诈名单', status: 'pass', value: '未命中', expected: '未命中', remark: '第三方反欺诈库' },
          { name: '多头借贷记录', status: 'warning', value: '近3个月2次', expected: '≤3次', remark: '均已正常结清' },
        ],
      },
    ],
  },
  {
    id: 'VER002',
    applicationId: 'APP004',
    applyNo: 'LN20260515004',
    applicantName: '刘洋',
    verifyTime: '2026-06-02 11:45:22',
    overallStatus: 'fail',
    categories: [
      {
        category: 'identity',
        categoryName: '身份信息核验',
        overallStatus: 'pass',
        details: [
          { name: '身份证号校验', status: 'pass', value: '440301199211287654', expected: '有效身份证号' },
          { name: '身份证姓名匹配', status: 'pass', value: '刘洋', expected: '匹配一致' },
          { name: '身份证有效期', status: 'pass', value: '2035-08-20', expected: '有效期内' },
          { name: '人脸比对', status: 'pass', value: '92.3%', expected: '≥85%' },
        ],
      },
      {
        category: 'phone',
        categoryName: '手机信息核验',
        overallStatus: 'warning',
        details: [
          { name: '手机号实名认证', status: 'pass', value: '13600136004', expected: '实名登记' },
          { name: '手机号在网时长', status: 'warning', value: '4个月', expected: '≥6个月', remark: '新入网用户' },
          { name: '常用联系人验证', status: 'fail', value: '1个', expected: '≥3个', remark: '联系人严重不足' },
          { name: '话费消费记录', status: 'pass', value: '正常', expected: '无异常' },
        ],
      },
      {
        category: 'bankcard',
        categoryName: '银行卡核验',
        overallStatus: 'pass',
        details: [
          { name: '卡号有效性', status: 'pass', value: '622588****5678', expected: '有效卡号' },
          { name: '卡户名匹配', status: 'pass', value: '刘洋', expected: '匹配一致' },
          { name: '预留手机号匹配', status: 'pass', value: '13600136004', expected: '匹配一致' },
          { name: '银行卡状态', status: 'pass', value: '正常', expected: '正常可用' },
        ],
      },
      {
        category: 'employment',
        categoryName: '工作信息核验',
        overallStatus: 'fail',
        details: [
          { name: '工作单位验证', status: 'warning', value: '深圳某贸易公司', expected: '工商注册', remark: '成立未满1年' },
          { name: '社保缴纳记录', status: 'fail', value: '无记录', expected: '近6个月连续', remark: '未缴纳社保' },
          { name: '公积金缴纳', status: 'fail', value: '无记录', expected: '正常缴纳', remark: '未缴纳公积金' },
          { name: '工资流水', status: 'fail', value: '无法验证', expected: '提供有效流水', remark: '流水异常波动' },
        ],
      },
      {
        category: 'blacklist',
        categoryName: '黑名单核验',
        overallStatus: 'fail',
        details: [
          { name: '司法黑名单', status: 'pass', value: '未命中', expected: '未命中' },
          { name: '行业黑名单', status: 'fail', value: '命中2条', expected: '未命中', remark: '2025年有逾期记录' },
          { name: '反欺诈名单', status: 'pass', value: '未命中', expected: '未命中' },
          { name: '多头借贷记录', status: 'fail', value: '近3个月8次', expected: '≤3次', remark: '严重多头借贷' },
        ],
      },
    ],
  },
  {
    id: 'VER003',
    applicationId: 'APP003',
    applyNo: 'LN20260515003',
    applicantName: '王强',
    verifyTime: '2026-06-02 09:10:45',
    overallStatus: 'pass',
    categories: [
      {
        category: 'identity',
        categoryName: '身份信息核验',
        overallStatus: 'pass',
        details: [
          { name: '身份证号校验', status: 'pass', value: '440101198703156789', expected: '有效身份证号' },
          { name: '身份证姓名匹配', status: 'pass', value: '王强', expected: '匹配一致' },
          { name: '身份证有效期', status: 'pass', value: '2038-05-10', expected: '有效期内' },
          { name: '人脸比对', status: 'pass', value: '96.8%', expected: '≥85%' },
        ],
      },
      {
        category: 'phone',
        categoryName: '手机信息核验',
        overallStatus: 'pass',
        details: [
          { name: '手机号实名认证', status: 'pass', value: '13700137003', expected: '实名登记' },
          { name: '手机号在网时长', status: 'pass', value: '10年2个月', expected: '≥6个月' },
          { name: '常用联系人验证', status: 'pass', value: '5个', expected: '≥3个' },
          { name: '话费消费记录', status: 'pass', value: '正常', expected: '无异常' },
        ],
      },
      {
        category: 'bankcard',
        categoryName: '银行卡核验',
        overallStatus: 'pass',
        details: [
          { name: '卡号有效性', status: 'pass', value: '622700****9012', expected: '有效卡号' },
          { name: '卡户名匹配', status: 'pass', value: '王强', expected: '匹配一致' },
          { name: '预留手机号匹配', status: 'pass', value: '13700137003', expected: '匹配一致' },
          { name: '银行卡状态', status: 'pass', value: '正常', expected: '正常可用' },
        ],
      },
      {
        category: 'employment',
        categoryName: '工作信息核验',
        overallStatus: 'pass',
        details: [
          { name: '工作单位验证', status: 'pass', value: '广州某餐饮连锁企业', expected: '工商注册', remark: '成立5年，法人王强' },
          { name: '营业执照核验', status: 'pass', value: '正常存续', expected: '有效执照' },
          { name: '企业纳税记录', status: 'pass', value: '年纳税18万元', expected: '正常纳税' },
          { name: '经营流水', status: 'pass', value: '月均55万元', expected: '≥申请月供3倍' },
        ],
      },
      {
        category: 'blacklist',
        categoryName: '黑名单核验',
        overallStatus: 'pass',
        details: [
          { name: '司法黑名单', status: 'pass', value: '未命中', expected: '未命中' },
          { name: '行业黑名单', status: 'pass', value: '未命中', expected: '未命中' },
          { name: '反欺诈名单', status: 'pass', value: '未命中', expected: '未命中' },
          { name: '多头借贷记录', status: 'pass', value: '近3个月1次', expected: '≤3次' },
        ],
      },
    ],
  },
  {
    id: 'VER004',
    applicationId: 'APP010',
    applyNo: 'LN20260515010',
    applicantName: '吴昊',
    verifyTime: '2026-06-05 10:05:30',
    overallStatus: 'fail',
    categories: [
      {
        category: 'identity',
        categoryName: '身份信息核验',
        overallStatus: 'warning',
        details: [
          { name: '身份证号校验', status: 'pass', value: '310104198906174567', expected: '有效身份证号' },
          { name: '身份证姓名匹配', status: 'pass', value: '吴昊', expected: '匹配一致' },
          { name: '身份证有效期', status: 'pass', value: '2032-11-05', expected: '有效期内' },
          { name: '人脸比对', status: 'warning', value: '83.2%', expected: '≥85%', remark: '接近阈值，建议人工复核' },
        ],
      },
      {
        category: 'phone',
        categoryName: '手机信息核验',
        overallStatus: 'warning',
        details: [
          { name: '手机号实名认证', status: 'pass', value: '13000130010', expected: '实名登记' },
          { name: '手机号在网时长', status: 'pass', value: '5年8个月', expected: '≥6个月' },
          { name: '常用联系人验证', status: 'warning', value: '2个', expected: '≥3个' },
          { name: '话费消费记录', status: 'warning', value: '异常', expected: '无异常', remark: '近2个月有欠费记录' },
        ],
      },
      {
        category: 'bankcard',
        categoryName: '银行卡核验',
        overallStatus: 'warning',
        details: [
          { name: '卡号有效性', status: 'pass', value: '621700****3456', expected: '有效卡号' },
          { name: '卡户名匹配', status: 'pass', value: '吴昊', expected: '匹配一致' },
          { name: '预留手机号匹配', status: 'pass', value: '13000130010', expected: '匹配一致' },
          { name: '银行卡状态', status: 'warning', value: '近期频繁交易', expected: '正常可用', remark: '风控关注' },
        ],
      },
      {
        category: 'employment',
        categoryName: '工作信息核验',
        overallStatus: 'fail',
        details: [
          { name: '工作单位验证', status: 'fail', value: '无法核实', expected: '工商注册', remark: '单位信息不符' },
          { name: '社保缴纳记录', status: 'fail', value: '无记录', expected: '近6个月连续', remark: '无社保缴纳' },
          { name: '公积金缴纳', status: 'fail', value: '无记录', expected: '正常缴纳' },
          { name: '工资流水', status: 'warning', value: '月均9000元', expected: '≥申请月供3倍', remark: '收入证明不充分' },
        ],
      },
      {
        category: 'blacklist',
        categoryName: '黑名单核验',
        overallStatus: 'fail',
        details: [
          { name: '司法黑名单', status: 'warning', value: '命中1条', expected: '未命中', remark: '2024年经济纠纷已结案' },
          { name: '行业黑名单', status: 'fail', value: '命中3条', expected: '未命中', remark: '多次逾期记录' },
          { name: '反欺诈名单', status: 'pass', value: '未命中', expected: '未命中' },
          { name: '多头借贷记录', status: 'fail', value: '近3个月12次', expected: '≤3次', remark: '极度频繁申请' },
        ],
      },
    ],
  },
  {
    id: 'VER005',
    applicationId: 'APP009',
    applyNo: 'LN20260515009',
    applicantName: '周婷',
    verifyTime: '2026-06-04 10:30:22',
    overallStatus: 'pass',
    categories: [
      {
        category: 'identity',
        categoryName: '身份信息核验',
        overallStatus: 'pass',
        details: [
          { name: '身份证号校验', status: 'pass', value: '110102199312056789', expected: '有效身份证号' },
          { name: '身份证姓名匹配', status: 'pass', value: '周婷', expected: '匹配一致' },
          { name: '身份证有效期', status: 'pass', value: '2042-03-15', expected: '有效期内' },
          { name: '人脸比对', status: 'pass', value: '99.1%', expected: '≥85%' },
        ],
      },
      {
        category: 'phone',
        categoryName: '手机信息核验',
        overallStatus: 'pass',
        details: [
          { name: '手机号实名认证', status: 'pass', value: '13100131009', expected: '实名登记' },
          { name: '手机号在网时长', status: 'pass', value: '7年3个月', expected: '≥6个月' },
          { name: '常用联系人验证', status: 'pass', value: '6个', expected: '≥3个' },
          { name: '话费消费记录', status: 'pass', value: '正常', expected: '无异常' },
        ],
      },
      {
        category: 'bankcard',
        categoryName: '银行卡核验',
        overallStatus: 'pass',
        details: [
          { name: '卡号有效性', status: 'pass', value: '622622****7890', expected: '有效卡号' },
          { name: '卡户名匹配', status: 'pass', value: '周婷', expected: '匹配一致' },
          { name: '预留手机号匹配', status: 'pass', value: '13100131009', expected: '匹配一致' },
          { name: '银行卡状态', status: 'pass', value: '正常', expected: '正常可用' },
        ],
      },
      {
        category: 'employment',
        categoryName: '工作信息核验',
        overallStatus: 'pass',
        details: [
          { name: '工作单位验证', status: 'pass', value: '北京某建筑设计院', expected: '工商注册' },
          { name: '社保缴纳记录', status: 'pass', value: '近36个月连续', expected: '近6个月连续' },
          { name: '公积金缴纳', status: 'pass', value: '基数22000元', expected: '正常缴纳' },
          { name: '工资流水', status: 'pass', value: '月均32000元', expected: '≥申请月供3倍' },
        ],
      },
      {
        category: 'blacklist',
        categoryName: '黑名单核验',
        overallStatus: 'pass',
        details: [
          { name: '司法黑名单', status: 'pass', value: '未命中', expected: '未命中' },
          { name: '行业黑名单', status: 'pass', value: '未命中', expected: '未命中' },
          { name: '反欺诈名单', status: 'pass', value: '未命中', expected: '未命中' },
          { name: '多头借贷记录', status: 'pass', value: '近3个月0次', expected: '≤3次' },
        ],
      },
    ],
  },
];
