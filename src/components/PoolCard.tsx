import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Pool } from '@/types/database'
import type { PoolWithMembers } from '@/hooks/usePools'
import { toast } from 'sonner'

interface PoolCardProps {
  pool: PoolWithMembers
  currentUserId: string
  onViewLeaderboard: (poolId: string, poolName: string) => void
  onLeave?: (poolId: string) => void
  getInviteLink: (pool: Pool) => string
}

export function PoolCard({
  pool,
  currentUserId,
  onViewLeaderboard,
  onLeave,
  getInviteLink,
}: PoolCardProps) {
  const [copying, setCopying] = useState(false)
  const isOwner = pool.created_by === currentUserId

  const copyInviteLink = async () => {
    setCopying(true)
    try {
      await navigator.clipboard.writeText(getInviteLink(pool))
      toast.success('Invite link copied!')
    } catch {
      toast.error('Failed to copy link')
    }
    setCopying(false)
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{pool.name}</CardTitle>
          {isOwner && (
            <Badge variant="secondary" className="text-xs">
              Owner
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span>{pool.member_count} member{pool.member_count !== 1 ? 's' : ''}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>Code: {pool.invite_code}</span>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="default"
            size="sm"
            className="flex-1"
            onClick={() => onViewLeaderboard(pool.id, pool.name)}
          >
            Leaderboard
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={copyInviteLink}
            disabled={copying}
          >
            {copying ? 'Copied!' : 'Copy Link'}
          </Button>
        </div>

        {!isOwner && onLeave && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-muted-foreground hover:text-destructive"
            onClick={() => onLeave(pool.id)}
          >
            Leave Pool
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
