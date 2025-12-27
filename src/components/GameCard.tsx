import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getTeamLogoUrl } from '@/lib/teamLogos'
import type { Game, Pick } from '@/types/database'

interface GameCardProps {
  game: Game
  pick?: Pick
  isLocked: boolean
  onPick: (gameId: string, team: 'team1' | 'team2') => void
}

export function GameCard({ game, pick, isLocked, onPick }: GameCardProps) {
  const gameTime = new Date(game.game_time)
  const isPast = gameTime < new Date()
  const isDisabled = isLocked || game.is_final

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'America/New_York',
    })
  }

  const getPickResult = (team: 'team1' | 'team2') => {
    if (!game.is_final || !pick) return null
    if (pick.picked_team === team) {
      return game.winner === team ? 'correct' : 'incorrect'
    }
    return null
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        {/* Bowl name and time */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-sm">{game.name}</h3>
            <p className="text-xs text-muted-foreground">
              {formatTime(gameTime)} ET • {game.tv_channel}
            </p>
          </div>
          {game.is_final && (
            <Badge variant="secondary">Final</Badge>
          )}
          {!game.is_final && isPast && (
            <Badge variant="outline">In Progress</Badge>
          )}
        </div>

        {/* Teams */}
        <div className="space-y-2">
          {/* Team 1 */}
          <TeamButton
            teamName={game.team1}
            score={game.team1_score}
            isSelected={pick?.picked_team === 'team1'}
            result={getPickResult('team1')}
            isWinner={game.winner === 'team1'}
            isDisabled={isDisabled}
            onClick={() => onPick(game.id, 'team1')}
          />

          {/* Team 2 */}
          <TeamButton
            teamName={game.team2}
            score={game.team2_score}
            isSelected={pick?.picked_team === 'team2'}
            result={getPickResult('team2')}
            isWinner={game.winner === 'team2'}
            isDisabled={isDisabled}
            onClick={() => onPick(game.id, 'team2')}
          />
        </div>

        {/* Location */}
        <p className="text-xs text-muted-foreground mt-2">{game.location}</p>
      </CardContent>
    </Card>
  )
}

interface TeamButtonProps {
  teamName: string
  score: number | null
  isSelected: boolean
  result: 'correct' | 'incorrect' | null
  isWinner: boolean
  isDisabled: boolean
  onClick: () => void
}

function TeamButton({
  teamName,
  score,
  isSelected,
  result,
  isWinner,
  isDisabled,
  onClick,
}: TeamButtonProps) {
  const [imgError, setImgError] = useState(false)
  const logoUrl = getTeamLogoUrl(teamName)

  // Determine button styling based on selection and result
  let variant: 'default' | 'outline' | 'secondary' | 'destructive' = 'outline'
  let extraClasses = ''

  if (isSelected) {
    if (result === 'correct') {
      // Green for correct picks - override default variant colors
      variant = 'default'
      extraClasses = '!bg-green-600 hover:!bg-green-700 !text-white'
    } else if (result === 'incorrect') {
      // Use built-in destructive variant (red)
      variant = 'destructive'
    } else {
      // Purple/indigo for pending picks (game not final yet)
      variant = 'default'
    }
  }

  return (
    <Button
      variant={variant}
      className={`w-full justify-between h-auto py-2 px-3 ${extraClasses}`}
      disabled={isDisabled}
      onClick={onClick}
    >
      <span className={`flex items-center gap-2 text-left ${isWinner ? 'font-bold' : ''}`}>
        {logoUrl && !imgError && (
          <img
            src={logoUrl}
            alt={`${teamName} logo`}
            className="w-6 h-6 object-contain flex-shrink-0"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}
        {teamName}
      </span>
      <span className={`${isWinner ? 'font-bold' : ''}`}>{score ?? 0}</span>
    </Button>
  )
}
