import { useState } from 'react'
import { usePools } from '@/hooks/usePools'
import { PoolCard } from '@/components/PoolCard'
import { CreatePoolDialog } from '@/components/CreatePoolDialog'
import { Leaderboard } from '@/components/Leaderboard'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface PoolsSectionProps {
  userId: string
  totalGames: number
}

export function PoolsSection({ userId, totalGames }: PoolsSectionProps) {
  const { pools, loading, createPool, joinPool, leavePool, getLeaderboard, getInviteLink } =
    usePools(userId)

  const [joinCode, setJoinCode] = useState('')
  const [joiningByCode, setJoiningByCode] = useState(false)

  // Leaderboard state
  const [leaderboardOpen, setLeaderboardOpen] = useState(false)
  const [selectedPool, setSelectedPool] = useState<{ id: string; name: string } | null>(null)

  const handleJoinByCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!joinCode.trim()) return

    setJoiningByCode(true)
    await joinPool(joinCode.trim())
    setJoiningByCode(false)
    setJoinCode('')
  }

  const handleViewLeaderboard = (poolId: string, poolName: string) => {
    setSelectedPool({ id: poolId, name: poolName })
    setLeaderboardOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading pools...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Actions row */}
      <div className="flex flex-col sm:flex-row gap-4">
        <CreatePoolDialog onCreatePool={createPool} />
        <form onSubmit={handleJoinByCode} className="flex gap-2 flex-1">
          <Input
            placeholder="Enter invite code"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            className="font-mono"
            maxLength={6}
          />
          <Button
            type="submit"
            variant="secondary"
            disabled={joiningByCode || !joinCode.trim()}
          >
            {joiningByCode ? 'Joining...' : 'Join'}
          </Button>
        </form>
      </div>

      {/* Pools grid */}
      {pools.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              You haven't joined any pools yet
            </p>
            <p className="text-sm text-muted-foreground">
              Create a new pool or enter an invite code to get started
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pools.map((pool) => (
            <PoolCard
              key={pool.id}
              pool={pool}
              currentUserId={userId}
              onViewLeaderboard={handleViewLeaderboard}
              onLeave={leavePool}
              getInviteLink={getInviteLink}
            />
          ))}
        </div>
      )}

      {/* Leaderboard modal */}
      {selectedPool && (
        <Leaderboard
          open={leaderboardOpen}
          onOpenChange={setLeaderboardOpen}
          poolName={selectedPool.name}
          poolId={selectedPool.id}
          currentUserId={userId}
          getLeaderboard={getLeaderboard}
          totalGames={totalGames}
        />
      )}
    </div>
  )
}
