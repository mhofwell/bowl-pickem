import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GameCard } from '@/components/GameCard'
import type { Game, Pick } from '@/types/database'

interface GameListProps {
  gamesByDate: Record<string, Game[]>
  picks: Pick[]
  isLocked: boolean
  timeUntilLock: number | null
  picksCount: number
  totalGames: number
  score: number
  onPick: (gameId: string, team: 'team1' | 'team2') => void
}

export function GameList({
  gamesByDate,
  picks,
  isLocked,
  timeUntilLock,
  picksCount,
  totalGames,
  score,
  onPick,
}: GameListProps) {
  const formatTimeRemaining = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const getPick = (gameId: string) => picks.find((p) => p.game_id === gameId)

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Your Picks</p>
                <p className="text-2xl font-bold">
                  {picksCount} / {totalGames}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Score</p>
                <p className="text-2xl font-bold">{score}</p>
              </div>
            </div>
            <div className="text-right">
              {isLocked ? (
                <Badge variant="destructive" className="text-sm">
                  Picks Locked
                </Badge>
              ) : timeUntilLock ? (
                <div>
                  <p className="text-sm text-muted-foreground">Time to lock</p>
                  <p className="text-lg font-semibold text-orange-500">
                    {formatTimeRemaining(timeUntilLock)}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Games by Date */}
      {Object.entries(gamesByDate).map(([date, dateGames]) => (
        <div key={date}>
          <h2 className="text-lg font-semibold mb-3 sticky top-0 bg-background py-2">
            {date}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {dateGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                pick={getPick(game.id)}
                isLocked={isLocked}
                onPick={onPick}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
