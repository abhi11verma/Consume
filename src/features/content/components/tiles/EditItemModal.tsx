import { useState, useEffect, useRef } from 'react'
import { X, ImagePlus, Trash2 } from 'lucide-react'
import { useContentStore } from '../../store/contentStore'
import { useCategoryStore } from '../../store/categoryStore'
import type { ConsumeItem, ContentType } from '../../types'
import { api } from '@/lib/api'

interface EditItemModalProps {
  item: ConsumeItem
  onClose: () => void
}

const inputCls =
  'w-full rounded-xl px-3 py-2 text-sm bg-[var(--color-background)] border border-[var(--color-border)] ' +
  'text-[var(--color-foreground)] placeholder:text-[var(--color-muted-fg)] ' +
  'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition'

const labelCls = 'flex flex-col gap-1.5'
const labelTextCls = 'text-xs font-medium text-[var(--color-muted)]'

export function EditItemModal({ item, onClose }: EditItemModalProps) {
  const updateItem = useContentStore((s) => s.updateItem)
  const categories = useCategoryStore((s) => s.categories)

  const [title, setTitle] = useState(item.title)
  const [author, setAuthor] = useState(item.author ?? '')
  const [description, setDescription] = useState(item.description ?? '')
  const [type, setType] = useState<ContentType>(item.type)
  const [thumbnailUrl, setThumbnailUrl] = useState(item.thumbnail?.startsWith('/images/') ? '' : (item.thumbnail ?? ''))

  // Staged local file — shown as preview before save
  const [stagedFile, setStagedFile] = useState<File | null>(null)
  const [stagedPreview, setStagedPreview] = useState<string | null>(null)
  const [currentThumbCleared, setCurrentThumbCleared] = useState(false)
  const [pasteZoneHovered, setPasteZoneHovered] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const stageFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    setStagedFile(file)
    setStagedPreview(URL.createObjectURL(file))
    setThumbnailUrl('')
    setCurrentThumbCleared(false)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    const onPaste = (e: ClipboardEvent) => {
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
  }, [onClose])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) stageFile(file)
    e.target.value = ''
  }

  const handleClearImage = () => {
    if (stagedPreview) URL.revokeObjectURL(stagedPreview)
    setStagedFile(null)
    setStagedPreview(null)
    setCurrentThumbCleared(true)
  }

  const handleSave = async () => {
    let thumbnailValue: string | null = thumbnailUrl.trim() || null

    if (stagedFile) {
      const form = new FormData()
      form.append('image', stagedFile)
      const result = await api.postForm<{ thumbnail: string }>(`/api/items/${item.id}/image`, form)
      thumbnailValue = result.thumbnail
    } else if (!thumbnailUrl.trim() && item.thumbnail?.startsWith('/images/')) {
      // user cleared the uploaded image; pass null explicitly
      thumbnailValue = null
    }

    await updateItem(item.id, {
      title: title.trim() || item.title,
      author: author.trim() || null,
      description: description.trim() || null,
      type,
      thumbnail: thumbnailValue,
    })
    if (stagedPreview) URL.revokeObjectURL(stagedPreview)
    onClose()
  }

  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  const currentThumb = !currentThumbCleared && item.thumbnail?.startsWith('/images/') ? item.thumbnail : null
  const previewSrc = stagedPreview ?? (thumbnailUrl.trim() || currentThumb || null)

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center sm:items-center sm:p-4"
      onClick={handleBackdrop}
    >
      <div
        className="bg-[var(--color-card)] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-2xl border border-[var(--color-border)] flex flex-col overflow-hidden"
        style={{ maxHeight: 'min(85vh, 85dvh)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)] flex-shrink-0">
          <h2 className="text-sm font-semibold text-[var(--color-foreground)]">Edit item</h2>
          <button
            onClick={onClose}
            className="h-7 w-7 rounded-full flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-background)] transition cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Fields — scrollable */}
        <div className="px-5 py-4 flex flex-col gap-4 overflow-y-auto flex-1 min-h-0 overscroll-contain">
          <label className={labelCls}>
            <span className={labelTextCls}>Title</span>
            <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
          </label>

          <label className={labelCls}>
            <span className={labelTextCls}>Type</span>
            <select className={inputCls} value={type} onChange={(e) => setType(e.target.value as ContentType)}>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.label}
                </option>
              ))}
            </select>
          </label>

          <label className={labelCls}>
            <span className={labelTextCls}>Author / Channel</span>
            <input className={inputCls} value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Optional" />
          </label>

          <label className={labelCls}>
            <span className={labelTextCls}>Description</span>
            <textarea className={`${inputCls} resize-none`} rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional" />
          </label>

          {/* Thumbnail */}
          <div className={labelCls}>
            <span className={labelTextCls}>Thumbnail</span>

            <input
              className={inputCls}
              value={thumbnailUrl}
              onChange={(e) => {
                setThumbnailUrl(e.target.value)
                if (e.target.value) handleClearImage()
              }}
              placeholder={stagedFile ? 'Using uploaded image' : 'https://...'}
              disabled={!!stagedFile}
            />

            {/* Paste / upload zone */}
            <div
              onMouseEnter={() => setPasteZoneHovered(true)}
              onMouseLeave={() => setPasteZoneHovered(false)}
              className={`relative rounded-xl border-2 border-dashed overflow-hidden transition-colors cursor-pointer ${
                pasteZoneHovered ? 'border-[var(--color-accent)]' : 'border-[var(--color-border)]'
              }`}
              onClick={() => { if (!stagedFile) fileInputRef.current?.click() }}
            >
              {previewSrc ? (
                <div className="relative">
                  <img src={previewSrc} alt="Thumbnail preview" className="w-full object-contain max-h-36" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleClearImage()
                      setThumbnailUrl('')
                    }}
                    className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-500 transition cursor-pointer"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-24 gap-1.5 text-[var(--color-muted-fg)]">
                  <ImagePlus size={18} />
                  <span className="text-xs">Click to upload · or focus here and paste</span>
                </div>
              )}
            </div>

            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 px-5 py-4 border-t border-[var(--color-border)] flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl text-sm font-medium border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-background)] transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => void handleSave()}
            className="flex-1 py-2 rounded-xl text-sm font-medium bg-[var(--color-accent)] text-[var(--color-accent-fg)] hover:opacity-90 transition cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
