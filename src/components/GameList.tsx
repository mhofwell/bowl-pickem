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
  lastScoresUpdate: string | null
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
  lastScoresUpdate,
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

  // Check if any games in a date group have started
  const hasGamesStarted = (games: Game[]) => {
    const now = new Date()
    return games.some((game) => new Date(game.game_time) <= now)
  }

  // Check if all games in a date group are final
  const allGamesFinal = (games: Game[]) => {
    return games.every((game) => game.is_final)
  }

  // Get status text for a date group
  const getDateStatus = (games: Game[]) => {
    if (allGamesFinal(games)) {
      return 'Final'
    }
    if (hasGamesStarted(games)) {
      return lastScoresUpdate ? `Updated ${lastScoresUpdate}` : null
    }
    return 'Upcoming'
  }

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
          <div className="flex items-center justify-between mb-3 sticky top-0 bg-background py-2">
            <h2 className="text-lg font-semibold">{date}</h2>
            <span className="text-xs text-muted-foreground">
              {getDateStatus(dateGames)}
            </span>
          </div>
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
