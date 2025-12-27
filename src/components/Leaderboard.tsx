import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { LeaderboardEntry } from '@/hooks/usePools'

interface LeaderboardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  poolName: string
  poolId: string
  currentUserId: string
  getLeaderboard: (poolId: string) => Promise<LeaderboardEntry[]>
  totalGames: number
}

export function Leaderboard({
  open,
  onOpenChange,
  poolName,
  poolId,
  currentUserId,
  getLeaderboard,
  totalGames,
}: LeaderboardProps) {
  const navigate = useNavigate()
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (open && poolId) {
      setLoading(true)
      getLeaderboard(poolId).then((data) => {
        setEntries(data)
        setLoading(false)
      })
    }
  }, [open, poolId, getLeaderboard])

  const handleUserClick = (userId: string) => {
    onOpenChange(false) // Close the modal
    navigate(`/pool/${poolId}/user/${userId}`)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getRankDisplay = (index: number) => {
    if (index === 0) return '1st'
    if (index === 1) return '2nd'
    if (index === 2) return '3rd'
    return `${index + 1}th`
  }

  const getRankEmoji = (index: number) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return ''
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{poolName} Leaderboard</DialogTitle>
        </DialogHeader>
        <div className="overflow-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">No members yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead className="text-right w-24">Picks</TableHead>
                  <TableHead className="text-right w-24">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry, index) => (
                  <TableRow
                    key={entry.user_id}
                    className={`cursor-pointer hover:bg-muted/80 transition-colors ${
                      entry.user_id === currentUserId ? 'bg-muted/50' : ''
                    }`}
                    onClick={() => handleUserClick(entry.user_id)}
                  >
                    <TableCell className="font-medium">
                      <span className="mr-1">{getRankEmoji(index)}</span>
                      {getRankDisplay(index)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {getInitials(entry.display_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-primary hover:underline">
                            {entry.display_name}
                          </span>
                          {entry.user_id === currentUserId && (
                            <Badge
                              variant="secondary"
                              className="text-xs w-fit"
                            >
                              You
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {entry.picks_count}/{totalGames}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-bold text-lg">{entry.score}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
