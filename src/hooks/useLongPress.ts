import { useRef, useCallback } from 'react'

interface UseLongPressOptions {
  onLongPress: () => void
  delay?: number
}

export function useLongPress({ onLongPress, delay = 500 }: UseLongPressOptions) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const moved = useRef(false)

  const start = useCallback((e: React.TouchEvent) => {
    moved.current = false
    timer.current = setTimeout(() => {
      if (!moved.current) {
        e.preventDefault()
        onLongPress()
      }
    }, delay)
  }, [onLongPress, delay])

  const cancel = useCallback(() => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  const move = useCallback(() => {
    moved.current = true
    cancel()
  }, [cancel])

  return {
    onTouchStart: start,
    onTouchEnd: cancel,
    onTouchMove: move,
  }
}
