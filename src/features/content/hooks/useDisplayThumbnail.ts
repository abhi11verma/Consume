import type { ConsumeItem } from '../types'

export function useDisplayThumbnail(item: ConsumeItem): string | null {
  return item.thumbnail ?? null
}
