import { useAuth } from '../context/AuthContext'
import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'

export default function ProfilePage() {
  const { user } = useAuth()
  const { data: stats } = useQuery({ queryKey: ['dashboard'], queryFn: () => api.dashboard.stats() })

  const initials = user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?'

  const totalTasks = (stats?.upcomingTasks ?? 0) + (stats?.tasksCompleted ?? 0)
  const xp = totalTasks * 10

  return (
    <div className="animate-fade-in max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 flex items-center justify-center text-lg"
          style={{ background: 'rgba(57,255,20,0.1)', border: '1px solid var(--neon-green)', color: 'var(--neon-green)' }}>
          ♛
        </div>
        <div>
          <h1 className="text-sm font-pixel" style={{ color: 'var(--neon-green)', textShadow: '0 0 10px var(--neon-green)' }}>
            PLAYER PROFILE
          </h1>
          <p className="text-xs" style={{ color: 'var(--text-dim)' }}>Your scholar stats and progress</p>
        </div>
      </div>

      <div className="card-retro p-6 space-y-5" style={{ borderColor: '#2a2a5a' }}>
        <div className="flex items-center gap-4 pb-5 border-b border-white/5">
          <div className="w-16 h-16 flex items-center justify-center text-xl font-bold shrink-0"
            style={{
              background: 'rgba(57,255,20,0.08)',
              border: '2px solid var(--neon-green)',
              color: 'var(--neon-green)',
              textShadow: '0 0 8px var(--neon-green)',
              boxShadow: '0 0 12px rgba(57,255,20,0.15)',
            }}>
            {initials}
          </div>
          <div className="min-w-0">
            <div className="text-base font-pixel mb-1" style={{ color: 'var(--neon-green)' }}>{user?.name}</div>
            <div className="text-xs flex items-center gap-2" style={{ color: 'var(--text-dim)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shadow-sm shadow-green-400" />
              ONLINE
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-xs font-pixel mb-1.5 tracking-wider" style={{ color: 'var(--text-dim)' }}>E-MAIL</div>
            <div className="text-sm px-3 py-2" style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              color: 'var(--text-main)',
            }}>
              {user?.email}
            </div>
          </div>
          <div>
            <div className="text-xs font-pixel mb-1.5 tracking-wider" style={{ color: 'var(--text-dim)' }}>ROLE</div>
            <div className="text-sm px-3 py-2 flex items-center gap-2" style={{
              background: 'rgba(57,255,20,0.05)',
              border: '1px solid rgba(57,255,20,0.15)',
              color: 'var(--neon-green)',
            }}>
              <span>♛</span>
              <span>LEVEL 1 SCHOLAR</span>
            </div>
          </div>
          <div>
            <div className="text-xs font-pixel mb-1.5 tracking-wider" style={{ color: 'var(--text-dim)' }}>XP</div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span style={{ color: 'var(--text-dim)' }}>{xp} / 100 XP</span>
                <span style={{ color: 'var(--neon-cyan)' }}>{Math.min(100, xp)}%</span>
              </div>
              <div className="h-2 w-full rounded-sm overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)' }}>
                <div className="h-full rounded-sm transition-all duration-700 ease-out"
                  style={{
                    width: `${Math.min(100, xp)}%`,
                    background: 'linear-gradient(90deg, var(--neon-green), var(--neon-cyan))',
                    boxShadow: '0 0 8px var(--neon-green)',
                  }} />
              </div>
              <p className="text-xs" style={{ color: 'var(--text-dim)', opacity: 0.7 }}>
                Complete tasks and create plans to earn XP
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
