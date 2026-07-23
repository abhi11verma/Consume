import { useState, useCallback } from 'react'
import type { FetchState } from '../types'
import { api } from '@/lib/api'
import type { FetchedMetadata } from '../types'

export function useMetadataFetch() {
  const [fetchState, setFetchState] = useState<FetchState>({ status: 'idle' })

  const fetch = useCallback(async (url: string) => {
    setFetchState({ status: 'loading' })
    try {
      const data = await api.get<FetchedMetadata>(`/api/metadata?url=${encodeURIComponent(url)}`)
      setFetchState({ status: 'success', data })
    } catch {
      setFetchState({
        status: 'error',
        message: 'Failed to fetch metadata. You can fill in the details manually.',
      })
    }
  }, [])

  const reset = useCallback(() => {
    setFetchState({ status: 'idle' })
  }, [])

  return { fetchState, fetch, reset }
}
