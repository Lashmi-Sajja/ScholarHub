import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function DashboardPage() {
  const { user } = useAuth()
  const { data: stats } = useQuery({ queryKey: ['dashboard'], queryFn: () => api.dashboard.stats() })
  const { data: plans } = useQuery({ queryKey: ['plans'], queryFn: () => api.plans.list() })

  const statCards = [
    { label: 'UPCOMING TASKS', value: stats?.upcomingTasks ?? 0, color: 'var(--neon-cyan)', icon: '◈' },
    { label: 'PLANS CREATED', value: stats?.plansCreated ?? 0, color: 'var(--neon-magenta)', icon: '⚔' },
    { label: 'TASKS DONE', value: stats?.tasksCompleted ?? 0, color: 'var(--neon-green)', icon: '✦' },
  ]

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 flex items-center justify-center text-lg"
          style={{ background: 'rgba(0,255,242,0.1)', border: '1px solid var(--neon-cyan)', color: 'var(--neon-cyan)' }}>
          ❖
        </div>
        <div>
          <h1 className="text-sm font-pixel" style={{ color: 'var(--neon-cyan)', textShadow: '0 0 10px var(--neon-cyan)' }}>
            DASHBOARD
          </h1>
          <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
            Welcome back, {user?.name?.split(' ')[0] || 'Scholar'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {statCards.map((card, i) => (
          <div
            key={card.label}
            className="card-retro p-5 text-center card-enter relative overflow-hidden group"
            style={{
              borderColor: card.color,
              boxShadow: `0 0 8px ${card.color}15`,
              animation: `fadeIn 0.3s ease ${i * 0.1}s both`,
            }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: `radial-gradient(circle at center, ${card.color}08 0%, transparent 70%)` }} />
            <div className="relative">
              <div className="text-base mb-2" style={{ color: card.color }}>{card.icon}</div>
              <div className="text-xs font-pixel mb-3 tracking-wider" style={{ color: card.color }}>{card.label}</div>
              <div className="text-4xl font-pixel" style={{
                color: card.color,
                textShadow: `0 0 10px ${card.color}, 0 0 20px ${card.color}40`,
              }}>
                {card.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card-retro relative overflow-hidden" style={{ borderColor: '#2a2a5a' }}>
        <div className="p-5">
          <div className="flex items-center gap-2 pb-4 border-b border-white/5 mb-4">
            <span className="text-xs" style={{ color: 'var(--neon-yellow)' }}>▸</span>
            <h2 className="text-xs font-pixel" style={{ color: 'var(--neon-yellow)' }}>RECENT PLANS</h2>
          </div>
          {plans?.length ? (
            <ul className="space-y-1">
              {plans.map((plan, i) => (
                <li key={plan._id}
                  className="flex items-center justify-between py-3 px-3 transition-all duration-200"
                  style={{
                    animation: `fadeIn 0.3s ease ${i * 0.05}s both`,
                    borderBottom: i < plans.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,255,242,0.04)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full" style={{ background: 'var(--neon-cyan)', boxShadow: '0 0 4px var(--neon-cyan)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-main)' }}>{plan.title}</span>
                  </div>
                  <span className="text-xs px-2 py-0.5" style={{
                    background: 'rgba(0,255,242,0.08)',
                    border: '1px solid rgba(0,255,242,0.2)',
                    color: 'var(--neon-cyan)',
                  }}>
                    {new Date(plan.generatedAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <div className="text-2xl mb-2" style={{ color: 'var(--text-dim)' }}>⚔</div>
              <p className="text-sm" style={{ color: 'var(--text-dim)' }}>No plans yet. Head to the Planner to create one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
