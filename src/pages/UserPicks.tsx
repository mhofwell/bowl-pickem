import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft } from 'lucide-react'
import { useUserPicks } from '@/hooks/useUserPicks'
import { GameCard } from '@/components/GameCard'

export default function UserPicks() {
  const { poolId: _poolId, userId } = useParams<{ poolId: string; userId: string }>()
  const navigate = useNavigate()
  const { profile, picks, gamesByDate, loading, error, score, picksCount } = useUserPicks(userId)

  const totalGames = Object.values(gamesByDate).flat().length

  const handleBack = () => {
    navigate(-1)
  }

  const getPick = (gameId: string) => picks.find((p) => p.game_id === gameId)

  const displayName = profile?.display_name || profile?.email?.split('@')[0] || 'User'

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading picks...</p>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">{error || 'User not found'}</p>
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold">{displayName}'s Picks</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Stats Banner */}
          <Card>
            <CardContent className="py-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Picks Made</p>
                    <p className="text-2xl font-bold">
                      {picksCount} / {totalGames}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Score</p>
                    <p className="text-2xl font-bold">{score}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-sm">
                  Viewing {displayName}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Games by Date */}
          {Object.entries(gamesByDate).map(([date, dateGames]) => (
            <div key={date}>
              <div className="flex items-center justify-between mb-3 sticky top-[57px] bg-background py-2 z-5">
                <h2 className="text-lg font-semibold">{date}</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {dateGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    pick={getPick(game.id)}
                    isLocked={true}
                    onPick={() => {}}
                    readOnly
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
