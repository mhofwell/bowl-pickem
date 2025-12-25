import { useState, useEffect, useMemo, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Game, Pick } from '@/types/database'
import { toast } from 'sonner'

// Lock time: Midnight ET on Dec 26, 2025 (5:00 AM UTC)
const LOCK_TIME = new Date('2025-12-26T05:00:00Z')

export function useGames(userId: string | undefined) {
  const [games, setGames] = useState<Game[]>([])
  const [picks, setPicks] = useState<Pick[]>([])
  const [loading, setLoading] = useState(true)

  const isLocked = useMemo(() => new Date() >= LOCK_TIME, [])

  const timeUntilLock = useMemo(() => {
    const now = new Date()
    if (now >= LOCK_TIME) return null
    return LOCK_TIME.getTime() - now.getTime()
  }, [])

  // Fetch games
  const fetchGames = useCallback(async () => {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .order('game_time', { ascending: true })

    if (error) {
      toast.error('Failed to load games')
      console.error(error)
    } else {
      setGames(data || [])
    }
  }, [])

  // Fetch user's picks
  const fetchPicks = useCallback(async () => {
    if (!userId) return

    const { data, error } = await supabase
      .from('picks')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      console.error(error)
    } else {
      setPicks(data || [])
    }
  }, [userId])

  // Make or update a pick
  const makePick = async (gameId: string, pickedTeam: 'team1' | 'team2') => {
    if (!userId || isLocked) return

    const existingPick = picks.find((p) => p.game_id === gameId)

    if (existingPick) {
      // Update existing pick
      const { error } = await supabase
        .from('picks')
        .update({ picked_team: pickedTeam } as never)
        .eq('id', existingPick.id)

      if (error) {
        toast.error('Failed to update pick')
        console.error(error)
      } else {
        setPicks((prev) =>
          prev.map((p) =>
            p.id === existingPick.id ? { ...p, picked_team: pickedTeam } : p
          )
        )
        toast.success('Pick updated!')
      }
    } else {
      // Create new pick
      const { data, error } = await supabase
        .from('picks')
        .insert({ user_id: userId, game_id: gameId, picked_team: pickedTeam } as never)
        .select()
        .single()

      if (error) {
        toast.error('Failed to save pick')
        console.error(error)
      } else if (data) {
        setPicks((prev) => [...prev, data as Pick])
        toast.success('Pick saved!')
      }
    }
  }

  // Get pick for a specific game
  const getPickForGame = (gameId: string) => {
    return picks.find((p) => p.game_id === gameId)
  }

  // Calculate score
  const score = useMemo(() => {
    return picks.reduce((total, pick) => {
      const game = games.find((g) => g.id === pick.game_id)
      if (game?.is_final && game.winner === pick.picked_team) {
        return total + 1
      }
      return total
    }, 0)
  }, [picks, games])

  // Initial fetch
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await fetchGames()
      await fetchPicks()
      setLoading(false)
    }
    loadData()
  }, [fetchGames, fetchPicks])

  // Group games by date
  const gamesByDate = useMemo(() => {
    const grouped: Record<string, Game[]> = {}
    games.forEach((game) => {
      const date = new Date(game.game_time).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        timeZone: 'America/New_York',
      })
      if (!grouped[date]) grouped[date] = []
      grouped[date].push(game)
    })
    return grouped
  }, [games])

  return {
    games,
    picks,
    gamesByDate,
    loading,
    isLocked,
    timeUntilLock,
    makePick,
    getPickForGame,
    score,
    totalGames: games.length,
    picksCount: picks.length,
  }
}
