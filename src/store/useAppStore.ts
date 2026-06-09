import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuditTrail } from '@/types'
import { LoanStatus } from '@/types'
import { applications as defaultApps } from '@/data/applications'

export interface UploadedFileInfo {
  name: string
  size: number
  type: string
  lastModified: number
  previewUrl?: string
  uploadedAt: string
  status: 'uploading' | 'success' | 'error'
  progress?: number
  errorMsg?: string
}

export type UploadZoneKey =
  | 'idCardFront'
  | 'idCardBack'
  | 'bankCard'
  | 'workProof'
  | 'incomeProof'
  | 'faceCapture'

export interface ReviewAnnotation {
  id: string
  applicationId: string
  author: string
  authorRole: string
  content: string
  createdAt: string
  attachments?: UploadedFileInfo[]
}

export interface DecisionRecord {
  id: string
  applicationId: string
  decision: 'approve' | 'reject' | 'supplement' | 'review' | 'disburse'
  operator: string
  operatorRole: string
  remark?: string
  createdAt: string
  oldStatus: string
  newStatus: string
}

interface AppState {
  applications: any[]
  currentApplicationId: string | null

  uploads: Record<string, Partial<Record<UploadZoneKey, UploadedFileInfo[]>>>

  annotations: ReviewAnnotation[]
  decisionRecords: DecisionRecord[]
  auditTrails: Record<string, AuditTrail[]>

  setCurrentApplication: (id: string | null) => void
  updateApplicationStatus: (id: string, status: any) => void

  setUploadedFiles: (
    applicationId: string,
    zoneKey: UploadZoneKey,
    files: UploadedFileInfo[]
  ) => void
  clearUploadedFiles: (applicationId: string, zoneKey: UploadZoneKey) => void

  addAnnotation: (annotation: Omit<ReviewAnnotation, 'id' | 'createdAt'>) => void
  addDecisionRecord: (record: Omit<DecisionRecord, 'id' | 'createdAt'>) => void
  appendAuditTrail: (applicationId: string, trail: any) => void
}

const STATUS_MAP: Record<DecisionRecord['decision'], any> = {
  approve: 'approved',
  reject: 'rejected',
  supplement: 'pending',
  review: 'reviewing',
  disburse: 'disbursed',
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      applications: [...defaultApps],
      currentApplicationId: defaultApps[0]?.id ?? null,

      uploads: {},
      annotations: [],
      decisionRecords: [],
      auditTrails: {},

      setCurrentApplication: (id) => set({ currentApplicationId: id }),

      updateApplicationStatus: (id, status) =>
        set((state) => ({
          applications: state.applications.map((a) =>
            a.id === id ? { ...a, status } : a
          ),
        })),

      setUploadedFiles: (applicationId, zoneKey, files) =>
        set((state) => ({
          uploads: {
            ...state.uploads,
            [applicationId]: {
              ...(state.uploads[applicationId] ?? {}),
              [zoneKey]: files,
            },
          },
        })),

      clearUploadedFiles: (applicationId, zoneKey) =>
        set((state) => ({
          uploads: {
            ...state.uploads,
            [applicationId]: {
              ...(state.uploads[applicationId] ?? {}),
              [zoneKey]: undefined,
            },
          },
        })),

      addAnnotation: (annotation) =>
        set((state) => ({
          annotations: [
            ...state.annotations,
            {
              ...annotation,
              id: `AN-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      addDecisionRecord: (record) => {
        const now = new Date()
        const nowStr = now.toISOString()
        const id = `DEC-${now.getTime()}-${Math.random().toString(36).slice(2, 6)}`

        const oldStatus =
          get().applications.find((a) => a.id === record.applicationId)?.status ??
          'pending'
        const newStatus = STATUS_MAP[record.decision]

        set((state) => ({
          decisionRecords: [
            ...state.decisionRecords,
            { ...record, id, createdAt: nowStr, oldStatus, newStatus },
          ],
          applications: state.applications.map((a) =>
            a.id === record.applicationId ? { ...a, status: newStatus } : a
          ),
        }))
      },

      appendAuditTrail: (applicationId, trail) =>
        set((state) => ({
          auditTrails: {
            ...state.auditTrails,
            [applicationId]: [
              ...(state.auditTrails[applicationId] ?? []),
              { ...trail, timestamp: new Date().toISOString() },
            ],
          },
        })),
    }),
    {
      name: 'risk-control-app-storage',
      partialize: (state) => ({
        annotations: state.annotations,
        decisionRecords: state.decisionRecords,
        auditTrails: state.auditTrails,
        uploads: state.uploads,
        applications: state.applications,
      }),
    }
  )
)

export const getApplicationStatusLabel = (status: any): string => {
  const labels: Record<string, string> = {
    pending: '待处理',
    verifying: '核验中',
    scoring: '评分中',
    reviewing: '审核中',
    approved: '已通过',
    rejected: '已拒绝',
    disbursing: '放款中',
    disbursed: '已放款',
    completed: '已结清',
  }
  return labels[status] ?? '未知'
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

export function createFileInfo(file: File): UploadedFileInfo {
  return {
    name: file.name,
    size: file.size,
    type: file.type || 'application/octet-stream',
    lastModified: file.lastModified,
    uploadedAt: new Date().toISOString(),
    status: 'success',
    progress: 100,
  }
}
