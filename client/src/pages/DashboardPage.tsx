import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'

export default function DashboardPage() {
  const { data: stats } = useQuery({ queryKey: ['dashboard'], queryFn: () => api.dashboard.stats() })
  const { data: plans } = useQuery({ queryKey: ['plans'], queryFn: () => api.plans.list() })

  return (
    <div>
      <h1 className="text-sm neon-text-cyan mb-6 font-pixel">▸ DASHBOARD</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card-retro-glow p-5 text-center">
          <div className="text-xs font-pixel mb-2" style={{ color: 'var(--neon-cyan)' }}>UPCOMING TASKS</div>
          <div className="text-3xl neon-text-cyan font-pixel">{stats?.upcomingTasks ?? 0}</div>
        </div>
        <div className="card-retro p-5 text-center" style={{ borderColor: 'var(--neon-magenta)', boxShadow: '0 0 8px rgba(255,0,255,0.15)' }}>
          <div className="text-xs font-pixel mb-2" style={{ color: 'var(--neon-magenta)' }}>PLANS CREATED</div>
          <div className="text-3xl neon-text-magenta font-pixel">{stats?.plansCreated ?? 0}</div>
        </div>
        <div className="card-retro p-5 text-center" style={{ borderColor: 'var(--neon-green)', boxShadow: '0 0 8px rgba(57,255,20,0.15)' }}>
          <div className="text-xs font-pixel mb-2" style={{ color: 'var(--neon-green)' }}>DONE</div>
          <div className="text-3xl neon-text-green font-pixel">{stats?.tasksCompleted ?? 0}</div>
        </div>
      </div>
      <div className="card-retro p-5" style={{ borderColor: '#2a2a4a' }}>
        <h2 className="text-xs font-pixel mb-4" style={{ color: 'var(--neon-yellow)' }}>▸ RECENT PLANS</h2>
        {plans?.length ? (
          <ul className="space-y-2">
            {plans.map((plan) => (
              <li key={plan._id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-sm" style={{ color: 'var(--text-main)' }}>{plan.title}</span>
                <span className="text-xs" style={{ color: 'var(--text-dim)' }}>{new Date(plan.generatedAt).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm" style={{ color: 'var(--text-dim)' }}>No plans yet. Head to the Planner.</p>
        )}
      </div>
    </div>
  )
}
