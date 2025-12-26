import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { AppMetadata } from '@/types/database'

export function useAppMetadata() {
  const [lastScoresUpdate, setLastScoresUpdate] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchMetadata = useCallback(async () => {
    const { data, error } = await supabase
      .from('app_metadata')
      .select('value')
      .eq('key', 'last_scores_update')
      .single<Pick<AppMetadata, 'value'>>()

    if (!error && data?.value) {
      setLastScoresUpdate(new Date(data.value))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchMetadata()
  }, [fetchMetadata])

  // Format as relative time (e.g., "5 min ago")
  const formatRelativeTime = (date: Date | null): string | null => {
    if (!date) return null

    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffHours < 24) return `${diffHours} hr ago`
    return date.toLocaleDateString()
  }

  return {
    lastScoresUpdate,
    lastScoresUpdateFormatted: formatRelativeTime(lastScoresUpdate),
    loading,
    refresh: fetchMetadata,
  }
}
