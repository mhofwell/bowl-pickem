import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        navigate('/')
      }
    })
  }, [navigate])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-muted-foreground">Signing in...</p>
    </div>
  )
}
