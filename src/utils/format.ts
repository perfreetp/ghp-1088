export function formatMoney(num: number): string {
  if (num === null || num === undefined || isNaN(num)) return '0.00 元'
  const fixed = Number(num).toFixed(2)
  const [intPart, decPart] = fixed.split('.')
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return `${formattedInt}.${decPart} 元`
}

export function formatPercent(num: number, decimals: number = 1): string {
  if (num === null || num === undefined || isNaN(num)) return `0.${'0'.repeat(decimals)}%`
  return `${(Number(num) * 100).toFixed(decimals)}%`
}

function padZero(n: number): string {
  return n < 10 ? `0${n}` : `${n}`
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  if (!(d instanceof Date) || isNaN(d.getTime())) return ''
  return `${d.getFullYear()}-${padZero(d.getMonth() + 1)}-${padZero(d.getDate())}`
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  if (!(d instanceof Date) || isNaN(d.getTime())) return ''
  return `${formatDate(d)} ${padZero(d.getHours())}:${padZero(d.getMinutes())}`
}

export function maskString(str: string, start: number, end: number): string {
  if (!str) return ''
  const len = str.length
  if (start + end >= len) return '*'.repeat(len)
  return str.slice(0, start) + '*'.repeat(len - start - end) + str.slice(len - end)
}

export function formatPhone(phone: string): string {
  if (!phone) return ''
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length < 7) return '*'.repeat(cleaned.length)
  return maskString(cleaned, 3, 4)
}

export function formatIdCard(idCard: string): string {
  if (!idCard) return ''
  const cleaned = idCard.trim()
  if (cleaned.length < 10) return '*'.repeat(cleaned.length)
  return maskString(cleaned, 6, 4)
}

export function formatDays(n: number): string {
  if (n === null || n === undefined || isNaN(n)) return '0天'
  const days = Math.floor(Number(n))
  if (days > 0) return `逾期${days}天`
  if (days < 0) return `${Math.abs(days)}天`
  return '0天'
}
