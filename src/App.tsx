import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import Home from '@/pages/Home'
import JoinPool from '@/pages/JoinPool'
import AuthCallback from '@/pages/AuthCallback'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/join/:code" element={<JoinPool />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
        </Routes>
        <Toaster />
      </div>
    </BrowserRouter>
  )
}

export default App
