import { useRef, useState, useCallback, useEffect, type DragEvent, type ChangeEvent } from 'react'
import { Upload, CheckCircle2, Loader2, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/utils/helpers'
import { formatFileSize } from '@/store/useAppStore'

export interface UploadedFileItem {
  name: string
  size: number
  status: 'uploading' | 'success' | 'error'
  uploadedAt?: string
  progress?: number
  errorMsg?: string
}

interface UploadZoneProps {
  label?: string
  accept?: string
  icon?: LucideIcon
  multiple?: boolean
  maxSize?: number
  onFilesSelected?: (files: FileList | null) => void
  className?: string
  hint?: string
  uploadedFiles?: UploadedFileItem[]
  onRemove?: (index: number) => void
  showList?: boolean
}

export { formatFileSize }

function formatDateTime(iso?: string): string {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
  } catch {
    return ''
  }
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
  uploadedFiles,
  onRemove,
  showList = true,
}: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [internalFiles, setInternalFiles] = useState<UploadedFileItem[]>([])
  const progressTimers = useRef<Map<number, number>>(new Map())

  const isControlled = uploadedFiles !== undefined
  const displayFiles = isControlled ? uploadedFiles : internalFiles
  const hasFiles = showList && displayFiles && displayFiles.length > 0

  const simulateUploadProgress = useCallback((files: FileList, startIndex: number) => {
    const newItems: UploadedFileItem[] = Array.from(files).map((file) => ({
      name: file.name,
      size: file.size,
      status: 'uploading',
      uploadedAt: new Date().toISOString(),
      progress: 0,
    }))

    setInternalFiles((prev) => [...prev, ...newItems])

    newItems.forEach((_, idx) => {
      const globalIdx = startIndex + idx
      let progress = 0
      const timerId = window.setInterval(() => {
        progress += Math.random() * 8 + 2
        if (progress >= 100) {
          progress = 100
          window.clearInterval(timerId)
          progressTimers.current.delete(globalIdx)
          setInternalFiles((prev) =>
            prev.map((f, i) =>
              i === globalIdx
                ? { ...f, progress: 100, status: 'success' }
                : f
            )
          )
        } else {
          setInternalFiles((prev) =>
            prev.map((f, i) =>
              i === globalIdx ? { ...f, progress: Math.floor(progress) } : f
            )
          )
        }
      }, 50)
      progressTimers.current.set(globalIdx, timerId)
    })
  }, [])

  useEffect(() => {
    return () => {
      progressTimers.current.forEach((id) => window.clearInterval(id))
      progressTimers.current.clear()
    }
  }, [])

  const triggerFileSelect = useCallback(() => {
    inputRef.current?.click()
  }, [])

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
        if (!isControlled) {
          const startIndex = internalFiles.length
          simulateUploadProgress(files, startIndex)
        }
      }
    },
    [onFilesSelected, isControlled, simulateUploadProgress, internalFiles.length]
  )

  const handleZoneClick = useCallback(() => {
    triggerFileSelect()
  }, [triggerFileSelect])

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      onFilesSelected?.(files)
      if (!isControlled && files && files.length > 0) {
        const startIndex = internalFiles.length
        simulateUploadProgress(files, startIndex)
      }
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    },
    [onFilesSelected, isControlled, simulateUploadProgress, internalFiles.length]
  )

  const handleRemove = useCallback(
    (e: React.MouseEvent, index: number) => {
      e.stopPropagation()
      if (isControlled) {
        onRemove?.(index)
      } else {
        const timerId = progressTimers.current.get(index)
        if (timerId) {
          window.clearInterval(timerId)
          progressTimers.current.delete(index)
        }
        const newTimers = new Map<number, number>()
        progressTimers.current.forEach((id, idx) => {
          if (idx > index) {
            newTimers.set(idx - 1, id)
          } else if (idx < index) {
            newTimers.set(idx, id)
          }
        })
        progressTimers.current = newTimers
        setInternalFiles((prev) => prev.filter((_, i) => i !== index))
      }
    },
    [isControlled, onRemove]
  )

  const handleReselect = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      triggerFileSelect()
    },
    [triggerFileSelect]
  )

  const defaultHint = accept
    ? `支持格式：${accept.split(',').map((t) => t.trim()).join('、')}`
    : ''

  const maxSizeHint = maxSize ? `，单个文件不超过 ${(maxSize / 1024 / 1024).toFixed(0)}MB` : ''

  const getStatusIcon = (status: UploadedFileItem['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
      case 'uploading':
        return <Loader2 className="h-5 w-5 text-primary-500 animate-spin flex-shrink-0" />
      case 'error':
        return <X className="h-5 w-5 text-red-500 flex-shrink-0" />
    }
  }

  const emptyZone = (
    <div
      onClick={handleZoneClick}
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

  if (!hasFiles) {
    return emptyZone
  }

  return (
    <div className="space-y-3">
      <div
        onClick={handleZoneClick}
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

      <div className="space-y-2">
        {displayFiles!.map((file, index) => (
          <div
            key={`${file.name}-${index}`}
            className={cn(
              'flex items-center gap-3 p-3 rounded-xl border cursor-pointer',
              'bg-white dark:bg-slate-900',
              'border-slate-200 dark:border-slate-700',
              'hover:border-primary-300 dark:hover:border-slate-600 hover:shadow-sm',
              'transition-all duration-200'
            )}
            onClick={handleZoneClick}
          >
            <div className="flex-shrink-0">
              {getStatusIcon(file.status)}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">
                {file.name}
              </p>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                <span>{formatFileSize(file.size)}</span>
                {file.uploadedAt && (
                  <>
                    <span className="text-slate-300 dark:text-slate-600">·</span>
                    <span>{formatDateTime(file.uploadedAt)}</span>
                  </>
                )}
                {file.status === 'error' && file.errorMsg && (
                  <>
                    <span className="text-slate-300 dark:text-slate-600">·</span>
                    <span className="text-red-500">{file.errorMsg}</span>
                  </>
                )}
              </div>
              {file.status === 'uploading' && (
                <div className="mt-2 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500 rounded-full transition-all duration-75"
                    style={{ width: `${file.progress ?? 0}%` }}
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              {file.status !== 'uploading' && (
                <button
                  type="button"
                  onClick={handleReselect}
                  className={cn(
                    'px-2.5 py-1 text-xs font-medium rounded-lg',
                    'text-primary-600 dark:text-primary-400',
                    'bg-primary-50 dark:bg-primary-900/30',
                    'hover:bg-primary-100 dark:hover:bg-primary-900/50',
                    'transition-colors duration-150'
                  )}
                >
                  重新选择
                </button>
              )}
              <button
                type="button"
                onClick={(e) => handleRemove(e, index)}
                className={cn(
                  'p-1.5 rounded-lg',
                  'text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400',
                  'hover:bg-red-50 dark:hover:bg-red-900/20',
                  'transition-colors duration-150'
                )}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
