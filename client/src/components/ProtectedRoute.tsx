import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center scanline" style={{ background: 'var(--bg-dark)' }}>
      <div className="text-center">
        <div className="text-2xl mb-4" style={{ color: 'var(--neon-cyan)' }}>LOADING</div>
        <div className="text-sm" style={{ color: 'var(--text-dim)' }}>
          <span className="animate-pulse">▸</span> INITIALIZING SYSTEM...
        </div>
      </div>
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}
