import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'var(--bg-dark)' }}>
      <div className="absolute inset-0 opacity-[0.02]" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, var(--neon-cyan) 3px, var(--neon-cyan) 4px)' }} />
      <div className="text-center relative">
        <div className="text-lg font-pixel mb-4" style={{
          color: 'var(--neon-cyan)',
          textShadow: '0 0 10px var(--neon-cyan), 0 0 20px var(--neon-cyan)',
        }}>
          SCHOLARHUB
        </div>
        <div className="text-sm mb-3" style={{ color: 'var(--text-dim)' }}>
          INITIALIZING SYSTEM
          <span className="animate-terminal ml-1">▌</span>
        </div>
        <div className="w-32 h-1 mx-auto rounded-full overflow-hidden" style={{ background: 'rgba(0,255,242,0.1)' }}>
          <div className="h-full rounded-full animate-pulse" style={{
            width: '60%',
            background: 'var(--neon-cyan)',
            boxShadow: '0 0 6px var(--neon-cyan)',
          }} />
        </div>
      </div>
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}
