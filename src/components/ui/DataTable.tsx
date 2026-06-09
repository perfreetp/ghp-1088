import type { ReactNode } from 'react'
import { cn } from '@/utils/helpers'

export interface DataTableColumn<T> {
  key: string
  title: string
  width?: string | number
  render?: (row: T, index: number) => ReactNode
  align?: 'left' | 'center' | 'right'
  className?: string
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  data: T[]
  rowKey: keyof T | ((row: T) => string)
  onRowClick?: (row: T, index: number) => void
  striped?: boolean
  hoverable?: boolean
  emptyText?: string
  className?: string
  headerClassName?: string
}

function getRowKey<T>(
  row: T,
  rowKey: keyof T | ((row: T) => string),
  index: number
): string {
  if (typeof rowKey === 'function') {
    return rowKey(row)
  }
  const value = row[rowKey]
  return value !== undefined && value !== null ? String(value) : String(index)
}

export default function DataTable<T>({
  columns,
  data,
  rowKey,
  onRowClick,
  striped = true,
  hoverable = true,
  emptyText = '暂无数据',
  className,
  headerClassName,
}: DataTableProps<T>) {
  return (
    <div className={cn('overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700', className)}>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr
            className={cn(
              'bg-slate-50 dark:bg-slate-800/50',
              'border-b border-slate-200 dark:border-slate-700',
              headerClassName
            )}
          >
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width }}
                className={cn(
                  'px-4 py-3 text-left font-semibold',
                  'text-slate-700 dark:text-slate-300',
                  'whitespace-nowrap',
                  col.align === 'center' && 'text-center',
                  col.align === 'right' && 'text-right',
                  col.className
                )}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-16 text-center text-slate-500 dark:text-slate-400"
              >
                <div className="flex flex-col items-center gap-2">
                  <svg
                    className="h-12 w-12 text-slate-300 dark:text-slate-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <span className="text-sm">{emptyText}</span>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={getRowKey(row, rowKey, index)}
                onClick={() => onRowClick?.(row, index)}
                className={cn(
                  'border-b border-slate-100 dark:border-slate-700/50',
                  'transition-colors duration-150',
                  striped && index % 2 === 1 && 'bg-slate-50/30 dark:bg-slate-800/20',
                  hoverable &&
                    onRowClick &&
                    'cursor-pointer hover:bg-primary-50/60 dark:hover:bg-primary-900/20',
                  hoverable &&
                    !onRowClick &&
                    'hover:bg-slate-50 dark:hover:bg-slate-800/30'
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      'px-4 py-3',
                      'text-slate-700 dark:text-slate-300',
                      'whitespace-nowrap',
                      col.align === 'center' && 'text-center',
                      col.align === 'right' && 'text-right',
                      col.className
                    )}
                  >
                    {col.render
                      ? col.render(row, index)
                      : (row as Record<string, unknown>)[col.key] as ReactNode}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
