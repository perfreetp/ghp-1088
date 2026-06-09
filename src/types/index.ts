export enum LoanStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  VERIFYING = 'verifying',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  FUNDING = 'funding',
  FUNDED = 'funded',
  COMPLETED = 'completed'
}

export enum RiskLevel {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E'
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

export enum MaritalStatus {
  SINGLE = 'single',
  MARRIED = 'married',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed'
}

export enum Education {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  HIGH_SCHOOL = 'high_school',
  BACHELOR = 'bachelor',
  MASTER = 'master',
  DOCTOR = 'doctor'
}

export enum RepaymentMethod {
  EQUAL_INSTALLMENT = 'equal_installment',
  EQUAL_PRINCIPAL = 'equal_principal',
  INTEREST_FIRST = 'interest_first',
  BULLET = 'bullet'
}

export enum ContactType {
  EMERGENCY = 'emergency',
  REFERENCE = 'reference',
  SPOUSE = 'spouse',
  COLLEAGUE = 'colleague'
}

export enum DocumentType {
  ID_CARD_FRONT = 'id_card_front',
  ID_CARD_BACK = 'id_card_back',
  BANK_CARD = 'bank_card',
  INCOME_PROOF = 'income_proof',
  EMPLOYMENT_PROOF = 'employment_proof',
  ADDRESS_PROOF = 'address_proof',
  OTHER = 'other'
}

export enum DocumentStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected'
}

export enum VerificationType {
  IDENTITY = 'identity',
  PHONE = 'phone',
  BANKCARD = 'bankcard',
  EMPLOYMENT = 'employment',
  BLACKLIST = 'blacklist'
}

export enum VerificationStatus {
  PASS = 'pass',
  WARNING = 'warning',
  FAIL = 'fail'
}

export enum ItemStatus {
  PASS = 'pass',
  WARNING = 'warning',
  FAIL = 'fail'
}

export enum Severity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export enum RepaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue',
  PARTIAL = 'partial'
}

export enum CollectionMethod {
  PHONE = 'phone',
  SMS = 'sms',
  ONSITE = 'onsite',
  LETTER = 'letter'
}

export interface Contact {
  type: ContactType
  name: string
  relationship: string
  phone: string
  workplace: string
}

export interface Document {
  type: DocumentType
  url: string
  uploadedAt: string
  status: DocumentStatus
}

export interface VerificationDetail {
  name: string
  value: string
  status: ItemStatus
  description: string
}

export interface VerificationResult {
  type: VerificationType
  status: VerificationStatus
  confidence: number
  details: VerificationDetail[]
  verifiedAt: string
}

export interface RiskRule {
  id: string
  name: string
  severity: Severity
  deductionScore: number
  description: string
  hit: boolean
}

export interface RepaymentItem {
  period: number
  dueDate: string
  principal: number
  interest: number
  dueAmount: number
  paidAmount: number
  status: RepaymentStatus
  overdueDays: number
  lateFee: number
}

export interface CollectionRecord {
  method: CollectionMethod
  operator: string
  result: string
  contactPerson: string
  remark: string
  promisedDate: string | null
  createdAt: string
}

export interface AuditTrail {
  node: string
  operator: string
  operatedAt: string
  remark: string
  status: LoanStatus
}

export interface LoanApplication {
  id: string
  applicantName: string
  idNumber: string
  phone: string
  gender: Gender
  age: number
  maritalStatus: MaritalStatus
  education: Education
  address: string
  amount: number
  term: number
  purpose: string
  repaymentMethod: RepaymentMethod
  product: string
  channel: string
  city: string
  status: LoanStatus
  riskLevel: RiskLevel
  riskScore: number
  createdAt: string
  auditor: string | null
  documents: Document[]
  contacts: Contact[]
  verifications?: VerificationResult[]
  riskRules?: RiskRule[]
  repaymentPlan?: RepaymentItem[]
  collectionRecords?: CollectionRecord[]
  auditTrail?: AuditTrail[]
}

export interface ChannelReport {
  channel: string
  applicationCount: number
  approvedCount: number
  rejectionCount: number
  approvalRate: number
  totalAmount: number
  fundedAmount: number
  averageAmount: number
}

export interface CityReport {
  city: string
  applicationCount: number
  approvedCount: number
  rejectionCount: number
  approvalRate: number
  totalAmount: number
  fundedAmount: number
  averageAmount: number
}

export interface ProductReport {
  product: string
  applicationCount: number
  approvedCount: number
  rejectionCount: number
  approvalRate: number
  totalAmount: number
  fundedAmount: number
  averageAmount: number
  averageTerm: number
  overdueRate: number
}

export interface ReportData {
  totalApplications: number
  pendingCount: number
  underReviewCount: number
  approvedCount: number
  rejectedCount: number
  fundedCount: number
  completedCount: number
  totalAmount: number
  fundedAmount: number
  averageAmount: number
  averageRiskScore: number
  riskLevelDistribution: {
    level: RiskLevel
    count: number
    percentage: number
  }[]
  channelReports: ChannelReport[]
  cityReports: CityReport[]
  productReports: ProductReport[]
  dailyTrend: {
    date: string
    applications: number
    approvals: number
    rejections: number
    funded: number
  }[]
}
