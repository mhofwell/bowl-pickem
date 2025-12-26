import { useAuth } from '@/hooks/useAuth'
import { useGames } from '@/hooks/useGames'
import { useAppMetadata } from '@/hooks/useAppMetadata'
import { AuthForm } from '@/components/AuthForm'
import { Header } from '@/components/Header'
import { GameList } from '@/components/GameList'
import { PoolsSection } from '@/components/PoolsSection'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Home() {
  const { user, loading: authLoading } = useAuth()
  const {
    gamesByDate,
    picks,
    loading: gamesLoading,
    isLocked,
    timeUntilLock,
    makePick,
    score,
    totalGames,
    picksCount,
  } = useGames(user?.id)
  const { lastScoresUpdateFormatted } = useAppMetadata()

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-2">Bowl Pick'em 2025</h1>
              <p className="text-muted-foreground">
                Make your picks for the college football bowl season
              </p>
            </div>
            <AuthForm />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto p-4">
        <Tabs defaultValue="picks" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px] mx-auto mb-6">
            <TabsTrigger value="picks">My Picks</TabsTrigger>
            <TabsTrigger value="pools">Pools</TabsTrigger>
          </TabsList>

          <TabsContent value="picks">
            {gamesLoading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">Loading games...</p>
              </div>
            ) : (
              <GameList
                gamesByDate={gamesByDate}
                picks={picks}
                isLocked={isLocked}
                timeUntilLock={timeUntilLock}
                picksCount={picksCount}
                totalGames={totalGames}
                score={score}
                lastScoresUpdate={lastScoresUpdateFormatted}
                onPick={makePick}
              />
            )}
          </TabsContent>

          <TabsContent value="pools">
            <PoolsSection userId={user.id} totalGames={totalGames} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
