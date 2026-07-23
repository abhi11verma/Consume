import { motion } from 'framer-motion'
import { ContentTile } from '../tiles/ContentTile'
import type { ConsumeItem } from '../../types'
import { CONTENT_TYPE_META } from '../../constants'
import type { ContentType } from '../../types'

interface TileGridProps {
  items: ConsumeItem[]
  type: ContentType
}

export function TileGrid({ items, type }: TileGridProps) {
  const { tileVariant } = CONTENT_TYPE_META[type]

  const colClass =
    tileVariant === 'portrait'
      ? 'grid-cols-[repeat(auto-fill,minmax(150px,1fr))]'
      : 'grid-cols-[repeat(auto-fill,minmax(260px,1fr))]'

  return (
    <div className={`grid ${colClass} gap-5`}>
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: Math.min(i * 0.03, 0.3) }}
        >
          <ContentTile item={item} />
        </motion.div>
      ))}
    </div>
  )
}
