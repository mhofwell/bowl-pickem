import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Pool, Game, Pick as UserPick } from '@/types/database'
import { toast } from 'sonner'

export interface PoolWithMembers extends Pool {
  member_count: number
}

export interface LeaderboardEntry {
  user_id: string
  display_name: string
  email: string
  score: number
  picks_count: number
}

function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export function usePools(userId: string | undefined) {
  const [pools, setPools] = useState<PoolWithMembers[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch pools the user is a member of
  const fetchPools = useCallback(async () => {
    if (!userId) {
      setPools([])
      setLoading(false)
      return
    }

    setLoading(true)

    // Get pool IDs user is a member of
    const { data: memberships, error: memberError } = await supabase
      .from('pool_members')
      .select('pool_id')
      .eq('user_id', userId)

    if (memberError) {
      console.error('Error fetching memberships:', memberError)
      setLoading(false)
      return
    }

    if (!memberships || memberships.length === 0) {
      setPools([])
      setLoading(false)
      return
    }

    const poolIds = (memberships as { pool_id: string }[]).map((m) => m.pool_id)

    // Get pools with member counts
    const { data: poolsData, error: poolsError } = await supabase
      .from('pools')
      .select('*')
      .in('id', poolIds)
      .order('created_at', { ascending: false })

    if (poolsError) {
      console.error('Error fetching pools:', poolsError)
      setLoading(false)
      return
    }

    // Get member counts for each pool
    const poolsWithCounts: PoolWithMembers[] = await Promise.all(
      ((poolsData as Pool[]) || []).map(async (pool) => {
        const { count } = await supabase
          .from('pool_members')
          .select('*', { count: 'exact', head: true })
          .eq('pool_id', pool.id)

        return { ...pool, member_count: count || 0 }
      })
    )

    setPools(poolsWithCounts)
    setLoading(false)
  }, [userId])

  // Create a new pool
  const createPool = async (name: string): Promise<Pool | null> => {
    if (!userId) return null

    const inviteCode = generateInviteCode()

    const { data: pool, error: poolError } = await supabase
      .from('pools')
      .insert({ name, invite_code: inviteCode, created_by: userId } as never)
      .select()
      .single()

    if (poolError) {
      toast.error('Failed to create pool')
      console.error(poolError)
      return null
    }

    const typedPool = pool as Pool

    // Add creator as a member
    const { error: memberError } = await supabase
      .from('pool_members')
      .insert({ pool_id: typedPool.id, user_id: userId } as never)

    if (memberError) {
      toast.error('Failed to join pool')
      console.error(memberError)
      return null
    }

    toast.success('Pool created!')
    await fetchPools()
    return typedPool
  }

  // Join a pool by invite code
  const joinPool = async (inviteCode: string): Promise<boolean> => {
    if (!userId) return false

    // Find pool by invite code
    const { data: pool, error: poolError } = await supabase
      .from('pools')
      .select('*')
      .eq('invite_code', inviteCode.toUpperCase())
      .single()

    if (poolError || !pool) {
      toast.error('Invalid invite code')
      return false
    }

    const typedPool = pool as Pool

    // Check if already a member
    const { data: existing } = await supabase
      .from('pool_members')
      .select('id')
      .eq('pool_id', typedPool.id)
      .eq('user_id', userId)
      .single()

    if (existing) {
      toast.info('You are already in this pool')
      return true
    }

    // Join the pool
    const { error: joinError } = await supabase
      .from('pool_members')
      .insert({ pool_id: typedPool.id, user_id: userId } as never)

    if (joinError) {
      toast.error('Failed to join pool')
      console.error(joinError)
      return false
    }

    toast.success(`Joined ${typedPool.name}!`)
    await fetchPools()
    return true
  }

  // Get leaderboard for a specific pool
  const getLeaderboard = async (poolId: string): Promise<LeaderboardEntry[]> => {
    // Get all members of the pool
    const { data: members, error: membersError } = await supabase
      .from('pool_members')
      .select('user_id')
      .eq('pool_id', poolId)

    if (membersError || !members) {
      console.error('Error fetching members:', membersError)
      return []
    }

    const userIds = (members as { user_id: string }[]).map((m) => m.user_id)

    // Get profiles for all members
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, display_name')
      .in('id', userIds)

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError)
      return []
    }

    // Get all picks for these users
    const { data: picks, error: picksError } = await supabase
      .from('picks')
      .select('user_id, game_id, picked_team')
      .in('user_id', userIds)

    if (picksError) {
      console.error('Error fetching picks:', picksError)
      return []
    }

    // Get all games to calculate scores
    const { data: games, error: gamesError } = await supabase
      .from('games')
      .select('id, winner, is_final')

    if (gamesError) {
      console.error('Error fetching games:', gamesError)
      return []
    }

    const typedProfiles = (profiles || []) as { id: string; email: string; display_name: string | null }[]
    const typedPicks = (picks || []) as UserPick[]
    const typedGames = (games || []) as Game[]

    // Calculate scores
    const leaderboard: LeaderboardEntry[] = typedProfiles.map((profile) => {
      const userPicks = typedPicks.filter((p) => p.user_id === profile.id)
      const score = userPicks.reduce((total, pick) => {
        const game = typedGames.find((g) => g.id === pick.game_id)
        if (game?.is_final && game.winner === pick.picked_team) {
          return total + 1
        }
        return total
      }, 0)

      return {
        user_id: profile.id,
        display_name: profile.display_name || profile.email.split('@')[0],
        email: profile.email,
        score,
        picks_count: userPicks.length,
      }
    })

    // Sort by score (descending), then by picks_count (descending)
    return leaderboard.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return b.picks_count - a.picks_count
    })
  }

  // Get invite link for a pool
  const getInviteLink = (pool: Pool): string => {
    return `${window.location.origin}/join/${pool.invite_code}`
  }

  // Leave a pool
  const leavePool = async (poolId: string): Promise<boolean> => {
    if (!userId) return false

    const { error } = await supabase
      .from('pool_members')
      .delete()
      .eq('pool_id', poolId)
      .eq('user_id', userId)

    if (error) {
      toast.error('Failed to leave pool')
      console.error(error)
      return false
    }

    toast.success('Left pool')
    await fetchPools()
    return true
  }

  useEffect(() => {
    fetchPools()
  }, [fetchPools])

  return {
    pools,
    loading,
    createPool,
    joinPool,
    leavePool,
    getLeaderboard,
    getInviteLink,
    refreshPools: fetchPools,
  }
}
