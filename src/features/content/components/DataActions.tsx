import { useRef, useState } from 'react'
import { Download, Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useContentStore } from '../store/contentStore'
import { cn } from '@/lib/utils'
import { api } from '@/lib/api'
import type { ConsumeItem } from '../types'

type Status = 'idle' | 'loading' | 'success' | 'error'

interface Feedback {
  status: Status
  message?: string
}

function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function DataActions() {
  const items = useContentStore((s) => s.items)
  const loadItems = useContentStore((s) => s.loadItems)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [exportFeedback, setExportFeedback] = useState<Feedback>({ status: 'idle' })
  const [importFeedback, setImportFeedback] = useState<Feedback>({ status: 'idle' })

  const handleExport = async () => {
    setExportFeedback({ status: 'loading' })
    try {
      const date = new Date().toISOString().split('T')[0]
      downloadJson({ version: 1, exportedAt: new Date().toISOString(), items }, `consume-${date}.json`)
      setExportFeedback({ status: 'success', message: 'Exported' })
      setTimeout(() => setExportFeedback({ status: 'idle' }), 2500)
    } catch {
      setExportFeedback({ status: 'error', message: 'Export failed' })
      setTimeout(() => setExportFeedback({ status: 'idle' }), 3000)
    }
  }

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    setImportFeedback({ status: 'loading' })
    try {
      const text = await file.text()
      const parsed = JSON.parse(text) as { version?: number; items?: ConsumeItem[] }
      if (!Array.isArray(parsed.items)) throw new Error('Invalid export file')

      let added = 0
      let skipped = 0
      const existingUrls = new Set(items.map((i) => i.url.toLowerCase().replace(/\/$/, '')))

      for (const item of parsed.items) {
        const norm = item.url?.toLowerCase().replace(/\/$/, '')
        if (!norm || existingUrls.has(norm)) {
          skipped++
          continue
        }
        try {
          await api.post('/api/items', item)
          existingUrls.add(norm)
          added++
        } catch {
          skipped++
        }
      }

      await loadItems()
      setImportFeedback({
        status: 'success',
        message: `+${added} added${skipped ? `, ${skipped} skipped` : ''}`,
      })
      setTimeout(() => setImportFeedback({ status: 'idle' }), 3000)
    } catch (err) {
      setImportFeedback({ status: 'error', message: err instanceof Error ? err.message : 'Import failed' })
      setTimeout(() => setImportFeedback({ status: 'idle' }), 3000)
    }
  }

  return (
    <div className="flex flex-col gap-1.5 px-2 py-1">
      <ActionButton
        icon={exportFeedback.status === 'loading' ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
        label={exportFeedback.status === 'success' ? (exportFeedback.message ?? 'Exported') : 'Export'}
        feedback={exportFeedback}
        onClick={() => void handleExport()}
        disabled={exportFeedback.status === 'loading' || items.length === 0}
      />

      <ActionButton
        icon={importFeedback.status === 'loading' ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
        label={
          importFeedback.status === 'success'
            ? (importFeedback.message ?? 'Imported')
            : importFeedback.status === 'error'
              ? (importFeedback.message ?? 'Error')
              : 'Import'
        }
        feedback={importFeedback}
        onClick={() => fileInputRef.current?.click()}
        disabled={importFeedback.status === 'loading'}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(e) => void handleImportFile(e)}
      />
    </div>
  )
}

function ActionButton({
  icon,
  label,
  feedback,
  onClick,
  disabled,
}: {
  icon: React.ReactNode
  label: string
  feedback: Feedback
  onClick: () => void
  disabled: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer',
        'text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-card)]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        feedback.status === 'success' && 'text-green-600 dark:text-green-400',
        feedback.status === 'error' && 'text-red-500',
      )}
    >
      <span className="flex-shrink-0">
        {feedback.status === 'success' ? (
          <CheckCircle size={14} className="text-green-500" />
        ) : feedback.status === 'error' ? (
          <AlertCircle size={14} className="text-red-500" />
        ) : (
          icon
        )}
      </span>
      <span className="truncate">{label}</span>
    </button>
  )
}
