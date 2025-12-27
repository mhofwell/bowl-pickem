import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Game, Pick } from '@/types/database'

interface UserProfile {
  id: string
  email: string
  display_name: string | null
}

interface UseUserPicksResult {
  profile: UserProfile | null
  picks: Pick[]
  games: Game[]
  gamesByDate: Record<string, Game[]>
  loading: boolean
  error: string | null
  score: number
  picksCount: number
}

export function useUserPicks(userId: string | undefined): UseUserPicksResult {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [picks, setPicks] = useState<Pick[]>([])
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Fetch profile, picks, and games in parallel
      const [profileRes, picksRes, gamesRes] = await Promise.all([
        supabase.from('profiles').select('id, email, display_name').eq('id', userId).single(),
        supabase.from('picks').select('*').eq('user_id', userId),
        supabase.from('games').select('*').order('game_time', { ascending: true }),
      ])

      if (profileRes.error) {
        setError('User not found')
        setLoading(false)
        return
      }

      setProfile(profileRes.data as UserProfile)
      setPicks((picksRes.data as Pick[]) || [])
      setGames((gamesRes.data as Game[]) || [])
    } catch {
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Group games by date
  const gamesByDate = games.reduce(
    (acc, game) => {
      const date = new Date(game.game_time).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })
      if (!acc[date]) acc[date] = []
      acc[date].push(game)
      return acc
    },
    {} as Record<string, Game[]>
  )

  // Calculate score
  const score = picks.reduce((total, pick) => {
    const game = games.find((g) => g.id === pick.game_id)
    if (game?.is_final && game.winner === pick.picked_team) {
      return total + 1
    }
    return total
  }, 0)

  return {
    profile,
    picks,
    games,
    gamesByDate,
    loading,
    error,
    score,
    picksCount: picks.length,
  }
}
