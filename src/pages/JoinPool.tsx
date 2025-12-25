import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { usePools } from '@/hooks/usePools'
import { AuthForm } from '@/components/AuthForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function JoinPool() {
  const { code } = useParams()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const { joinPool } = usePools(user?.id)
  const [joining, setJoining] = useState(false)
  const [joined, setJoined] = useState(false)

  // Auto-join when user is logged in
  useEffect(() => {
    if (user && code && !joining && !joined) {
      handleJoin()
    }
  }, [user, code])

  const handleJoin = async () => {
    if (!code) return

    setJoining(true)
    const success = await joinPool(code)
    setJoining(false)

    if (success) {
      setJoined(true)
    }
  }

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
              <p className="text-muted-foreground mb-4">
                You've been invited to join a pool!
              </p>
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-2">Invite Code</p>
                  <p className="text-2xl font-mono font-bold">{code}</p>
                </CardContent>
              </Card>
              <p className="text-sm text-muted-foreground mb-4">
                Sign in to join the pool
              </p>
            </div>
            <AuthForm />
          </div>
        </div>
      </div>
    )
  }

  if (joining) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Joining pool...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {joined ? 'You\'re In!' : 'Join Pool'}
          </CardTitle>
          <CardDescription>
            {joined
              ? 'You have successfully joined the pool'
              : `Invite code: ${code}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {joined ? (
            <Button className="w-full" onClick={() => navigate('/')}>
              Start Making Picks
            </Button>
          ) : (
            <>
              <Button className="w-full" onClick={handleJoin} disabled={joining}>
                {joining ? 'Joining...' : 'Join Pool'}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/')}
              >
                Go to Home
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
