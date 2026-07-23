import type { ConsumeItem } from '../../types'
import { PortraitTile } from './PortraitTile'
import { LandscapeTile } from './LandscapeTile'
import { FeaturedTile } from './FeaturedTile'
import { CONTENT_TYPE_META } from '../../constants'

interface ContentTileProps {
  item: ConsumeItem
  featured?: boolean
  className?: string
}

export function ContentTile({ item, featured = false, className }: ContentTileProps) {
  const { tileVariant } = CONTENT_TYPE_META[item.type]

  if (featured) {
    return <FeaturedTile item={item} className={className} />
  }

  if (tileVariant === 'portrait') {
    return <PortraitTile item={item} className={className} />
  }

  return <LandscapeTile item={item} className={className} />
}
