import { useState } from 'react'
import {
  Edit3,
  CheckCircle2,
  Camera,
  X,
  FileText,
  CreditCard,
  Briefcase,
  Receipt,
  IdCard,
  Eye,
  Save,
  RotateCcw,
} from 'lucide-react'
import { UploadZone } from '@/components/ui'
import { cn } from '@/utils/helpers'

function numberToChinese(num: number): string {
  if (!num && num !== 0) return ''
  const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  const units = ['', '拾', '佰', '仟', '万', '拾', '佰', '仟', '亿']
  const wan = num * 10000
  const intPart = Math.floor(wan)
  const decPart = Math.round((wan - intPart) * 100)

  let result = ''
  const intStr = intPart.toString()
  let zeroFlag = false
  for (let i = 0; i < intStr.length; i++) {
    const digit = parseInt(intStr[i])
    const unitIndex = intStr.length - 1 - i
    if (digit === 0) {
      zeroFlag = true
    } else {
      if (zeroFlag) {
        result += digits[0]
        zeroFlag = false
      }
      result += digits[digit] + units[unitIndex]
    }
  }
  result = result || '零'
  result += '元'

  if (decPart > 0) {
    const jiao = Math.floor(decPart / 10)
    const fen = decPart % 10
    if (jiao > 0) result += digits[jiao] + '角'
    if (fen > 0) result += digits[fen] + '分'
  } else {
    result += '整'
  }
  return result
}

interface Contact {
  name: string
  relation: string
  phone: string
  company: string
}

export default function Application() {
  const [loanAmount, setLoanAmount] = useState<number>(50)

  const [contacts, setContacts] = useState<{
    family: Contact
    emergency: Contact
    colleague: Contact
  }>({
    family: { name: '', relation: '父母', phone: '', company: '' },
    emergency: { name: '', relation: '配偶', phone: '', company: '' },
    colleague: { name: '', relation: '同事', phone: '', company: '' },
  })

  const updateContact = (
    type: 'family' | 'emergency' | 'colleague',
    field: keyof Contact,
    value: string
  ) => {
    setContacts((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }))
  }

  const chineseAmount = numberToChinese(loanAmount)

  const steps = [
    { label: '基本信息', status: 'done' },
    { label: '证件上传', status: 'current' },
    { label: '联系人信息', status: 'pending' },
    { label: '贷款信息', status: 'pending' },
  ] as const

  const uploadedFiles = {
    idFront: { name: '身份证正面.jpg', uploaded: true },
  }

  return (
    <div className="min-h-screen pb-32">
      <div className="max-w-6xl mx-auto px-6 py-8 page-fade-enter">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-slate-900">进件录入</h1>
              <span className="px-2.5 py-1 text-xs font-medium bg-primary-50 text-primary-700 rounded-md border border-primary-100">
                进件编号：LA20260609001
              </span>
            </div>
            <p className="text-sm text-slate-500">请完整填写借款人信息并上传证件</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-secondary flex items-center gap-1.5">
              <X className="w-4 h-4" />
              取消
            </button>
            <button className="btn-primary flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              提交核验
            </button>
          </div>
        </div>

        <div className="card-base p-6 mb-6">
          <div className="flex items-center justify-between relative">
            {steps.map((step, index) => (
              <div key={step.label} className="flex-1 relative z-10">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300',
                      step.status === 'done' &&
                        'bg-emerald-500 text-white shadow-sm shadow-emerald-200',
                      step.status === 'current' &&
                        'bg-primary-500 text-white ring-4 ring-primary-100 shadow-sm shadow-primary-200',
                      step.status === 'pending' &&
                        'bg-slate-100 text-slate-400'
                    )}
                  >
                    {step.status === 'done' ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span
                    className={cn(
                      'mt-2 text-sm font-medium transition-colors',
                      step.status === 'done' && 'text-emerald-600',
                      step.status === 'current' && 'text-primary-600',
                      step.status === 'pending' && 'text-slate-400'
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="absolute top-5 left-[60%] right-[-40%] h-0.5 -z-0">
                    <div
                      className={cn(
                        'h-full transition-colors duration-300',
                        step.status === 'done' ? 'bg-emerald-300' : 'bg-slate-200'
                      )}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="card-base p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-primary-500 rounded-full" />
              <h2 className="text-lg font-semibold text-slate-900">借款人基本信息</h2>
            </div>
            <button className="btn-secondary flex items-center gap-1.5 text-sm py-1.5 px-3">
              <Edit3 className="w-3.5 h-3.5" />
              编辑
            </button>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            <div>
              <label className="label-base">
                姓名<span className="text-red-500 ml-0.5">*</span>
              </label>
              <input className="input-base" defaultValue="张三" />
            </div>
            <div>
              <label className="label-base">
                身份证号<span className="text-red-500 ml-0.5">*</span>
              </label>
              <input className="input-base" defaultValue="110101199001011234" />
            </div>
            <div>
              <label className="label-base">
                手机号<span className="text-red-500 ml-0.5">*</span>
              </label>
              <input className="input-base" defaultValue="13812345678" />
            </div>
            <div>
              <label className="label-base">
                性别<span className="text-red-500 ml-0.5">*</span>
              </label>
              <select className="select-base" defaultValue="男">
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
            </div>
            <div>
              <label className="label-base">年龄</label>
              <input className="input-base" type="number" defaultValue={35} />
            </div>
            <div>
              <label className="label-base">出生日期</label>
              <input className="input-base" type="date" defaultValue="1990-01-01" />
            </div>
            <div>
              <label className="label-base">民族</label>
              <select className="select-base" defaultValue="汉族">
                <option>汉族</option>
                <option>蒙古族</option>
                <option>回族</option>
                <option>藏族</option>
                <option>维吾尔族</option>
                <option>其他</option>
              </select>
            </div>
            <div>
              <label className="label-base">婚姻状况</label>
              <select className="select-base" defaultValue="已婚">
                <option>未婚</option>
                <option>已婚</option>
                <option>离异</option>
                <option>丧偶</option>
              </select>
            </div>
            <div>
              <label className="label-base">学历</label>
              <select className="select-base" defaultValue="本科">
                <option>高中及以下</option>
                <option>大专</option>
                <option>本科</option>
                <option>硕士</option>
                <option>博士</option>
              </select>
            </div>
            <div>
              <label className="label-base">邮箱</label>
              <input className="input-base" type="email" placeholder="example@email.com" />
            </div>
            <div className="col-span-2">
              <label className="label-base">
                居住地址<span className="text-red-500 ml-0.5">*</span>
              </label>
              <textarea
                className="input-base min-h-[80px] resize-y"
                defaultValue="北京市朝阳区建国路88号SOHO现代城A座1201室"
              />
            </div>
            <div className="col-span-2">
              <label className="label-base">户籍地址</label>
              <textarea
                className="input-base min-h-[80px] resize-y"
                placeholder="请输入户籍地址"
              />
            </div>
          </div>
        </div>

        <div className="card-base p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-primary-500 rounded-full" />
              <h2 className="text-lg font-semibold text-slate-900">证件材料上传</h2>
              <span className="text-xs text-slate-400">当前步骤</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <IdCard className="w-4 h-4 text-slate-500" />
                <label className="text-sm font-medium text-slate-700">
                  身份证正面<span className="text-red-500 ml-0.5">*</span>
                </label>
              </div>
              {uploadedFiles.idFront.uploaded ? (
                <div className="relative rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 overflow-hidden group">
                  <div className="aspect-[1.58/1] bg-slate-100 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-red-50" />
                    <div className="relative z-10 p-6 w-full h-full flex flex-col">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-xs text-slate-500 mb-1">姓 名</div>
                          <div className="text-sm font-medium text-slate-800">张 三</div>
                        </div>
                        <div className="w-16 h-20 bg-slate-200 rounded flex items-center justify-center text-slate-400 text-xs">
                          头像
                        </div>
                      </div>
                      <div className="mt-auto space-y-1">
                        <div className="flex gap-4 text-xs">
                          <span className="text-slate-500">性 别 男</span>
                          <span className="text-slate-500">民 族 汉</span>
                        </div>
                        <div className="text-xs text-slate-500">出 生 1990年01月01日</div>
                        <div className="text-xs text-slate-500">住 址 北京市朝阳区xxx</div>
                        <div className="text-xs text-slate-500">公民身份号码 110101199001011234</div>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-white border-t border-emerald-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-sm text-slate-700 truncate">{uploadedFiles.idFront.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-600 font-medium text-sm flex-shrink-0 ml-2">
                      <CheckCircle2 className="w-4 h-4" />
                      已上传
                    </div>
                  </div>
                </div>
              ) : (
                <UploadZone
                  label="上传身份证正面"
                  accept="image/*"
                  icon={IdCard}
                  hint="支持 JPG、PNG 格式"
                />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <IdCard className="w-4 h-4 text-slate-500" />
                <label className="text-sm font-medium text-slate-700">
                  身份证反面<span className="text-red-500 ml-0.5">*</span>
                </label>
              </div>
              <UploadZone
                label="上传身份证反面"
                accept="image/*"
                icon={IdCard}
                hint="支持 JPG、PNG 格式"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Camera className="w-4 h-4 text-slate-500" />
                <label className="text-sm font-medium text-slate-700">
                  人脸识别<span className="text-red-500 ml-0.5">*</span>
                </label>
              </div>
              <div className="aspect-square flex items-center justify-center">
                <div className="relative cursor-pointer group">
                  <div
                    className="w-[200px] h-[200px] rounded-full border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-3 transition-all duration-200 hover:border-primary-400 hover:bg-primary-50/30"
                    style={{ width: '200px', height: '200px' }}
                  >
                    <div className="w-14 h-14 rounded-full bg-slate-100 group-hover:bg-primary-100 flex items-center justify-center transition-colors duration-200">
                      <Camera className="w-7 h-7 text-slate-400 group-hover:text-primary-500 transition-colors duration-200" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-slate-700 group-hover:text-primary-600 transition-colors duration-200">
                        点击开始人脸采集
                      </p>
                      <p className="text-xs text-slate-400 mt-1">请保持光线充足，正对镜头</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-4 h-4 text-slate-500" />
                <label className="text-sm font-medium text-slate-700">
                  银行卡照片<span className="text-red-500 ml-0.5">*</span>
                </label>
              </div>
              <UploadZone
                label="上传银行卡照片"
                accept="image/*"
                icon={CreditCard}
                hint="清晰展示卡号"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="w-4 h-4 text-slate-500" />
                <label className="text-sm font-medium text-slate-700">
                  工作证明<span className="text-slate-400 text-xs font-normal ml-1">选填</span>
                </label>
              </div>
              <UploadZone
                label="上传工作证明"
                accept="image/*,.pdf"
                icon={Briefcase}
                hint="工牌/劳动合同/在职证明"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Receipt className="w-4 h-4 text-slate-500" />
                <label className="text-sm font-medium text-slate-700">
                  收入流水<span className="text-slate-400 text-xs font-normal ml-1">选填</span>
                </label>
              </div>
              <UploadZone
                label="上传收入流水"
                accept="image/*,.pdf"
                icon={Receipt}
                hint="近6个月银行流水"
                multiple
              />
            </div>
          </div>
        </div>

        <div className="card-base p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-primary-500 rounded-full" />
              <h2 className="text-lg font-semibold text-slate-900">联系人信息</h2>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-xs font-semibold">
                  1
                </div>
                <h3 className="text-sm font-semibold text-slate-800">直系亲属</h3>
                <span className="text-xs px-1.5 py-0.5 bg-red-50 text-red-600 rounded border border-red-100">
                  必填
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-5 pl-9">
                <div>
                  <label className="label-base">姓名<span className="text-red-500 ml-0.5">*</span></label>
                  <input
                    className="input-base"
                    value={contacts.family.name}
                    onChange={(e) => updateContact('family', 'name', e.target.value)}
                    placeholder="请输入联系人姓名"
                  />
                </div>
                <div>
                  <label className="label-base">关系<span className="text-red-500 ml-0.5">*</span></label>
                  <select
                    className="select-base"
                    value={contacts.family.relation}
                    onChange={(e) => updateContact('family', 'relation', e.target.value)}
                  >
                    <option>父母</option>
                    <option>子女</option>
                    <option>兄弟姐妹</option>
                    <option>配偶</option>
                  </select>
                </div>
                <div>
                  <label className="label-base">手机号<span className="text-red-500 ml-0.5">*</span></label>
                  <input
                    className="input-base"
                    value={contacts.family.phone}
                    onChange={(e) => updateContact('family', 'phone', e.target.value)}
                    placeholder="请输入手机号码"
                  />
                </div>
                <div>
                  <label className="label-base">工作单位</label>
                  <input
                    className="input-base"
                    value={contacts.family.company}
                    onChange={(e) => updateContact('family', 'company', e.target.value)}
                    placeholder="请输入工作单位（选填）"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center text-xs font-semibold">
                  2
                </div>
                <h3 className="text-sm font-semibold text-slate-800">紧急联系人</h3>
                <span className="text-xs px-1.5 py-0.5 bg-orange-50 text-orange-600 rounded border border-orange-100">
                  必填
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-5 pl-9">
                <div>
                  <label className="label-base">姓名<span className="text-red-500 ml-0.5">*</span></label>
                  <input
                    className="input-base"
                    value={contacts.emergency.name}
                    onChange={(e) => updateContact('emergency', 'name', e.target.value)}
                    placeholder="请输入联系人姓名"
                  />
                </div>
                <div>
                  <label className="label-base">关系<span className="text-red-500 ml-0.5">*</span></label>
                  <select
                    className="select-base"
                    value={contacts.emergency.relation}
                    onChange={(e) => updateContact('emergency', 'relation', e.target.value)}
                  >
                    <option>配偶</option>
                    <option>父母</option>
                    <option>子女</option>
                    <option>兄弟姐妹</option>
                    <option>朋友</option>
                  </select>
                </div>
                <div>
                  <label className="label-base">手机号<span className="text-red-500 ml-0.5">*</span></label>
                  <input
                    className="input-base"
                    value={contacts.emergency.phone}
                    onChange={(e) => updateContact('emergency', 'phone', e.target.value)}
                    placeholder="请输入手机号码"
                  />
                </div>
                <div>
                  <label className="label-base">工作单位</label>
                  <input
                    className="input-base"
                    value={contacts.emergency.company}
                    onChange={(e) => updateContact('emergency', 'company', e.target.value)}
                    placeholder="请输入工作单位（选填）"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-semibold">
                  3
                </div>
                <h3 className="text-sm font-semibold text-slate-800">同事联系人</h3>
                <span className="text-xs px-1.5 py-0.5 bg-slate-50 text-slate-500 rounded border border-slate-200">
                  选填
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-5 pl-9">
                <div>
                  <label className="label-base">姓名</label>
                  <input
                    className="input-base"
                    value={contacts.colleague.name}
                    onChange={(e) => updateContact('colleague', 'name', e.target.value)}
                    placeholder="请输入联系人姓名"
                  />
                </div>
                <div>
                  <label className="label-base">关系</label>
                  <select
                    className="select-base"
                    value={contacts.colleague.relation}
                    onChange={(e) => updateContact('colleague', 'relation', e.target.value)}
                  >
                    <option>同事</option>
                    <option>领导</option>
                    <option>下属</option>
                  </select>
                </div>
                <div>
                  <label className="label-base">手机号</label>
                  <input
                    className="input-base"
                    value={contacts.colleague.phone}
                    onChange={(e) => updateContact('colleague', 'phone', e.target.value)}
                    placeholder="请输入手机号码"
                  />
                </div>
                <div>
                  <label className="label-base">工作单位</label>
                  <input
                    className="input-base"
                    value={contacts.colleague.company}
                    onChange={(e) => updateContact('colleague', 'company', e.target.value)}
                    placeholder="请输入工作单位"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card-base p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-primary-500 rounded-full" />
              <h2 className="text-lg font-semibold text-slate-900">贷款产品信息</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            <div>
              <label className="label-base">
                申请金额<span className="text-red-500 ml-0.5">*</span>
              </label>
              <div className="relative">
                <input
                  className="input-base pr-16"
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value) || 0)}
                  min={0}
                  step={1}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  万元
                </span>
              </div>
              <p className="mt-1.5 text-xs text-primary-600 font-medium">
                大写金额：{chineseAmount}
              </p>
            </div>
            <div>
              <label className="label-base">
                贷款期限<span className="text-red-500 ml-0.5">*</span>
              </label>
              <select className="select-base" defaultValue={12}>
                <option value={3}>3 个月</option>
                <option value={6}>6 个月</option>
                <option value={12}>12 个月</option>
                <option value={24}>24 个月</option>
                <option value={36}>36 个月</option>
              </select>
            </div>
            <div>
              <label className="label-base">
                产品类型<span className="text-red-500 ml-0.5">*</span>
              </label>
              <select className="select-base" defaultValue="消费贷">
                <option>消费贷</option>
                <option>经营贷</option>
                <option>装修贷</option>
                <option>教育贷</option>
                <option>医疗贷</option>
              </select>
            </div>
            <div>
              <label className="label-base">
                还款方式<span className="text-red-500 ml-0.5">*</span>
              </label>
              <select className="select-base" defaultValue="等额本息">
                <option>等额本息</option>
                <option>等额本金</option>
                <option>先息后本</option>
                <option>到期一次还本付息</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="label-base">
                贷款用途<span className="text-red-500 ml-0.5">*</span>
              </label>
              <textarea
                className="input-base min-h-[80px] resize-y"
                placeholder="请详细说明贷款的具体用途，将用于风险审核参考..."
              />
            </div>
            <div>
              <label className="label-base">渠道来源</label>
              <select className="select-base" defaultValue="线上APP">
                <option>线上APP</option>
                <option>合作门店</option>
                <option>电话营销</option>
                <option>线下推广</option>
              </select>
            </div>
            <div>
              <label className="label-base">所属城市</label>
              <select className="select-base" defaultValue="北京">
                <option>北京</option>
                <option>上海</option>
                <option>广州</option>
                <option>深圳</option>
                <option>杭州</option>
                <option>成都</option>
                <option>武汉</option>
                <option>南京</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="label-base">推荐人</label>
              <input
                className="input-base"
                placeholder="请输入推荐人工号或手机号（选填）"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 shadow-lg z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button className="btn-secondary flex items-center gap-1.5">
            <Save className="w-4 h-4" />
            保存草稿
          </button>
          <div className="flex items-center gap-3">
            <button className="btn-secondary flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4" />
              重置
            </button>
            <button className="btn-secondary flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              预览申请
            </button>
            <button className="btn-primary flex items-center gap-1.5 px-6">
              <CheckCircle2 className="w-4 h-4" />
              提交核验
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
