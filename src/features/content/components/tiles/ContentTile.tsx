import type { ConsumeItem } from '../../types'
import { useCategoryBySlug } from '../../store/categoryStore'
import { PortraitTile } from './PortraitTile'
import { LandscapeTile } from './LandscapeTile'
import { FeaturedTile } from './FeaturedTile'

interface ContentTileProps {
  item: ConsumeItem
  featured?: boolean
  className?: string
}

export function ContentTile({ item, featured = false, className }: ContentTileProps) {
  const category = useCategoryBySlug(item.type)

  if (featured) {
    return <FeaturedTile item={item} className={className} />
  }

  if (category.tileVariant === 'portrait') {
    return <PortraitTile item={item} className={className} />
  }

  return <LandscapeTile item={item} className={className} />
}
