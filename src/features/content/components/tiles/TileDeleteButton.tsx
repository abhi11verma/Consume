import { Trash2 } from 'lucide-react'
import { useContentStore } from '../../store/contentStore'

interface TileDeleteButtonProps {
  itemId: string
}

export function TileDeleteButton({ itemId }: TileDeleteButtonProps) {
  const removeItem = useContentStore((s) => s.removeItem)

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    removeItem(itemId)
  }

  return (
    <button
      onClick={handleDelete}
      aria-label="Remove item"
      className="absolute top-2 left-2 h-7 w-7 rounded-full bg-black/50 text-white
        flex items-center justify-center opacity-0 group-hover:opacity-100
        transition-opacity duration-150 hover:bg-red-500 cursor-pointer z-10"
    >
      <Trash2 size={12} />
    </button>
  )
}
