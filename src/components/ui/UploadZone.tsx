import { useRef, useState, useCallback, type DragEvent, type ChangeEvent } from 'react'
import { Upload } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/utils/helpers'

interface UploadZoneProps {
  label?: string
  accept?: string
  icon?: LucideIcon
  multiple?: boolean
  maxSize?: number
  onFilesSelected?: (files: FileList | null) => void
  className?: string
  hint?: string
}

export default function UploadZone({
  label = '拖拽文件到此处',
  accept,
  icon: Icon = Upload,
  multiple = false,
  maxSize,
  onFilesSelected,
  className,
  hint,
}: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const files = e.dataTransfer.files
      if (files && files.length > 0) {
        onFilesSelected?.(files)
      }
    },
    [onFilesSelected]
  )

  const handleClick = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      onFilesSelected?.(files)
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    },
    [onFilesSelected]
  )

  const defaultHint = accept
    ? `支持格式：${accept.split(',').map((t) => t.trim()).join('、')}`
    : ''

  const maxSizeHint = maxSize ? `，单个文件不超过 ${(maxSize / 1024 / 1024).toFixed(0)}MB` : ''

  return (
    <div
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={cn(
        'group relative cursor-pointer rounded-2xl border-2 border-dashed',
        'flex flex-col items-center justify-center gap-3 px-6 py-10',
        'transition-all duration-200',
        isDragging
          ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20 scale-[1.01]'
          : 'border-slate-300 dark:border-slate-600 hover:border-primary-400 hover:bg-slate-50/50 dark:hover:bg-slate-800/30',
        className
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
      />

      <div
        className={cn(
          'flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-200',
          isDragging
            ? 'bg-primary-500 text-white scale-110'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 group-hover:text-primary-500 dark:group-hover:text-primary-400'
        )}
      >
        <Icon className={cn('h-7 w-7 transition-transform duration-200', isDragging && 'animate-bounce')} />
      </div>

      <div className="text-center">
        <p
          className={cn(
            'text-base font-medium transition-colors duration-200',
            isDragging
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-slate-700 dark:text-slate-300 group-hover:text-primary-600 dark:group-hover:text-primary-400'
          )}
        >
          {label}
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          或点击选择
          {multiple && '（可多选）'}
        </p>
      </div>

      {(hint || defaultHint || maxSizeHint) && (
        <p className="text-xs text-slate-400 dark:text-slate-500">
          {hint || (defaultHint + maxSizeHint)}
        </p>
      )}

      {isDragging && (
        <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-primary-400 border-dashed animate-pulse" />
      )}
    </div>
  )
}
