import { useState, useRef, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Link2, Loader2, AlertCircle } from 'lucide-react'
import { useMetadataFetch } from '../../hooks/useMetadataFetch'
import { useContentStore } from '../../store/contentStore'
import { extractDomain } from '../../services/urlDetection'
import { MetadataPreview } from './MetadataPreview'
import { CategoryOverride } from './CategoryOverride'
import type { ContentType } from '../../types'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'

interface AddContentModalProps {
  isOpen: boolean
  onClose: () => void
  initialUrl?: string
}

export function AddContentModal({ isOpen, onClose, initialUrl }: AddContentModalProps) {
  const [url, setUrl] = useState('')
  const [urlError, setUrlError] = useState('')
  const [editedTitle, setEditedTitle] = useState('')
  const [overriddenType, setOverriddenType] = useState<ContentType>('article')
  const [stagedFile, setStagedFile] = useState<File | null>(null)
  const [stagedPreview, setStagedPreview] = useState<string | null>(null)
  const [thumbnailCleared, setThumbnailCleared] = useState(false)

  const { fetchState, fetch, reset } = useMetadataFetch()
  const addItem = useContentStore((s) => s.addItem)
  const updateItem = useContentStore((s) => s.updateItem)
  const items = useContentStore((s) => s.items)
  const urlInputRef = useRef<HTMLInputElement>(null)

  const stageFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    if (stagedPreview) URL.revokeObjectURL(stagedPreview)
    setStagedFile(file)
    setStagedPreview(URL.createObjectURL(file))
    setThumbnailCleared(false)
  }

  const clearThumbnail = () => {
    if (stagedPreview) URL.revokeObjectURL(stagedPreview)
    setStagedFile(null)
    setStagedPreview(null)
    setThumbnailCleared(true)
  }

  useEffect(() => {
    if (isOpen) {
      if (initialUrl) {
        setUrl(initialUrl)
        setTimeout(() => fetch(initialUrl), 150)
      } else {
        setTimeout(() => urlInputRef.current?.focus(), 100)
      }
    } else {
      setUrl('')
      setUrlError('')
      setEditedTitle('')
      if (stagedPreview) URL.revokeObjectURL(stagedPreview)
      setStagedFile(null)
      setStagedPreview(null)
      setThumbnailCleared(false)
      reset()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, reset])

  useEffect(() => {
    if (fetchState.status === 'success') {
      setEditedTitle(fetchState.data.title)
      setOverriddenType(fetchState.data.detectedType)
    }
  }, [fetchState])

  const validateAndFetch = () => {
    setUrlError('')
    let parsed: URL
    try {
      parsed = new URL(url.trim())
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        setUrlError('Please enter a valid http or https URL.')
        return
      }
    } catch {
      setUrlError('Please enter a valid URL (e.g., https://example.com/article).')
      return
    }
    const normalize = (u: string) => u.replace(/\/$/, '').toLowerCase()
    const duplicate = items.find((i) => normalize(i.url) === normalize(parsed.href))
    if (duplicate) {
      setUrlError(`Already in your library: "${duplicate.title}"`)
      return
    }
    fetch(parsed.href)
  }

  const handleSave = useCallback(async () => {
    if (fetchState.status !== 'success') return
    const { data } = fetchState
    const thumbnail = thumbnailCleared ? null : (stagedPreview ? data.thumbnail : data.thumbnail)
    await addItem({
      type: overriddenType,
      url: url.trim(),
      title: editedTitle.trim() || data.title,
      thumbnail,
      description: data.description,
      domain: extractDomain(url.trim()),
      author: data.author,
      tags: [],
    })
    if (stagedFile) {
      const savedItem = useContentStore.getState().items[0]
      if (savedItem) {
        const form = new FormData()
        form.append('image', stagedFile)
        try {
          const result = await api.postForm<{ thumbnail: string }>(`/api/items/${savedItem.id}/image`, form)
          await updateItem(savedItem.id, { thumbnail: result.thumbnail })
        } catch { /* non-fatal */ }
      }
    } else if (thumbnailCleared) {
      const savedItem = useContentStore.getState().items[0]
      if (savedItem) await updateItem(savedItem.id, { thumbnail: null })
    }
    onClose()
  }, [fetchState, overriddenType, url, editedTitle, addItem, updateItem, onClose, stagedFile, stagedPreview, thumbnailCleared])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'Enter' && fetchState.status === 'success') {
        if (e.target instanceof HTMLTextAreaElement) return
        if (editedTitle.trim()) void handleSave()
      }
    }
    const onPaste = (e: ClipboardEvent) => {
      if (fetchState.status !== 'success') return
      const file = Array.from(e.clipboardData?.files ?? []).find((f) => f.type.startsWith('image/'))
      if (file) { e.preventDefault(); stageFile(file) }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('paste', onPaste)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('paste', onPaste)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, onClose, fetchState, editedTitle, handleSave])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && fetchState.status === 'idle') {
      validateAndFetch()
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleBackdropClick}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn(
              'fixed z-50 top-1/2 -translate-y-1/2',
              'left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-full md:max-w-lg',
              'rounded-2xl p-4 md:p-6',
              'bg-[var(--color-surface)] border border-[var(--color-border)]',
              'shadow-2xl',
            )}
            role="dialog"
            aria-modal="true"
            aria-label="Add content"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[var(--color-foreground)]">
                Add content
              </h2>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full
                  text-[var(--color-muted)] hover:text-[var(--color-foreground)]
                  hover:bg-[var(--color-card)] transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* URL input */}
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Link2
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
                />
                <input
                  ref={urlInputRef}
                  type="url"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value)
                    setUrlError('')
                    if (fetchState.status !== 'idle') reset()
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Paste a URL…"
                  disabled={fetchState.status === 'loading'}
                  className={cn(
                    'w-full pl-8 pr-3 py-2.5 text-sm rounded-xl',
                    'bg-[var(--color-background)] border border-[var(--color-border)]',
                    'text-[var(--color-foreground)] placeholder:text-[var(--color-muted-fg)]',
                    'focus:outline-none focus:border-[var(--color-accent)] transition-colors',
                    'disabled:opacity-60',
                    urlError && 'border-red-400',
                  )}
                />
              </div>
              <button
                onClick={validateAndFetch}
                disabled={!url.trim() || fetchState.status === 'loading'}
                className={cn(
                  'px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer',
                  'bg-[var(--color-accent)] text-[var(--color-accent-fg)]',
                  'hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed',
                  'flex items-center gap-2',
                )}
              >
                {fetchState.status === 'loading' ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : null}
                Fetch
              </button>
            </div>

            {urlError && (
              <p className="text-xs text-red-500 mb-4 flex items-center gap-1.5">
                <AlertCircle size={12} />
                {urlError}
              </p>
            )}

            {/* Error state */}
            {fetchState.status === 'error' && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 mb-4">
                <AlertCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-600 dark:text-red-400 leading-relaxed">
                  {fetchState.message}
                </p>
              </div>
            )}

            {/* Preview + category override */}
            {fetchState.status === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4 mb-6"
              >
                <MetadataPreview
                  metadata={fetchState.data}
                  type={overriddenType}
                  titleValue={editedTitle}
                  onTitleChange={setEditedTitle}
                  overrideThumbnail={thumbnailCleared ? null : (stagedPreview ?? undefined)}
                  onClearThumbnail={clearThumbnail}
                />
                <CategoryOverride
                  value={overriddenType}
                  onChange={setOverriddenType}
                />
              </motion.div>
            )}

            {/* Footer buttons */}
            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm font-medium
                  text-[var(--color-muted)] hover:text-[var(--color-foreground)]
                  hover:bg-[var(--color-card)] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              {fetchState.status === 'success' && (
                <button
                  onClick={() => void handleSave()}
                  disabled={!editedTitle.trim()}
                  className="px-5 py-2 rounded-xl text-sm font-medium
                    bg-[var(--color-accent)] text-[var(--color-accent-fg)]
                    hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all cursor-pointer"
                >
                  Save
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
