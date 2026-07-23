import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ContentTile } from '../tiles/ContentTile'
import type { ConsumeItem } from '../../types'
import { cn } from '@/lib/utils'

interface TileRowProps {
  items: ConsumeItem[]
  tileVariant: 'landscape' | 'portrait'
}

const TILE_WIDTH = {
  landscape: 'w-44 md:w-64 flex-shrink-0',
  portrait: 'w-28 md:w-40 flex-shrink-0',
}

export function TileRow({ items, tileVariant }: TileRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(false)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const update = () => {
      setShowLeft(el.scrollLeft > 8)
      setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [items])

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const amount = dir === 'left' ? -300 : 300
    el.scrollBy({ left: amount, behavior: 'smooth' })
  }

  const onScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setShowLeft(el.scrollLeft > 8)
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8)
  }

  if (items.length === 0) return null

  return (
    <div className="relative group/row">
      {/* Left arrow */}
      {showLeft && (
        <button
          onClick={() => scroll('left')}
          className={cn(
            'absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10',
            'flex h-8 w-8 items-center justify-center rounded-full',
            'bg-[var(--color-card)] border border-[var(--color-border)] shadow-md',
            'text-[var(--color-muted)] hover:text-[var(--color-foreground)]',
            'transition-all duration-150 cursor-pointer',
          )}
          aria-label="Scroll left"
        >
          <ChevronLeft size={16} />
        </button>
      )}

      {/* Scroll container */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide scroll-smooth py-1 px-0.5"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className={TILE_WIDTH[tileVariant]}
            style={{ scrollSnapAlign: 'start' }}
          >
            <ContentTile item={item} />
          </div>
        ))}
      </div>

      {/* Right arrow */}
      {showRight && (
        <button
          onClick={() => scroll('right')}
          className={cn(
            'absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10',
            'flex h-8 w-8 items-center justify-center rounded-full',
            'bg-[var(--color-card)] border border-[var(--color-border)] shadow-md',
            'text-[var(--color-muted)] hover:text-[var(--color-foreground)]',
            'transition-all duration-150 cursor-pointer',
          )}
          aria-label="Scroll right"
        >
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  )
}
