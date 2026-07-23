import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAddContent } from '@/features/content/context/AddContentContext'

export function ShareTargetScreen() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { open } = useAddContent()

  useEffect(() => {
    const sharedUrl = params.get('url') || params.get('text') || ''
    navigate('/', { replace: true })
    setTimeout(() => open(sharedUrl || undefined), 100)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
