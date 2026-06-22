import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/client'

const typeConfig: Record<string, { color: string; border: string; icon: string }> = {
  hackathon: { color: 'var(--neon-cyan)', border: 'var(--neon-cyan)', icon: '⚡' },
  internship: { color: 'var(--neon-green)', border: 'var(--neon-green)', icon: '💼' },
  scholarship: { color: 'var(--neon-magenta)', border: 'var(--neon-magenta)', icon: '🎓' },
  competition: { color: 'var(--neon-yellow)', border: 'var(--neon-yellow)', icon: '🏆' },
}

export default function OpportunitiesPage() {
  const queryClient = useQueryClient()

  const { data: opportunities } = useQuery({
    queryKey: ['opportunities'],
    queryFn: () => api.opportunities.list(),
  })

  const bookmarkMutation = useMutation({
    mutationFn: ({ id, bookmarked }: { id: string; bookmarked: boolean }) =>
      bookmarked ? api.opportunities.unbookmark(id) : api.opportunities.bookmark(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['opportunities'] }),
  })

  const getDeadlineLabel = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    if (days < 0) return 'EXPIRED'
    if (days === 0) return 'DUE TODAY'
    if (days === 1) return '1 DAY LEFT'
    if (days <= 7) return `${days} DAYS LEFT`
    return `${Math.ceil(days / 7)} WEEKS LEFT`
  }

  const getDeadlineColor = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    if (days < 0) return 'var(--neon-red)'
    if (days <= 3) return 'var(--neon-yellow)'
    return 'var(--text-dim)'
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 flex items-center justify-center text-lg"
          style={{ background: 'rgba(255,255,0,0.1)', border: '1px solid var(--neon-yellow)', color: 'var(--neon-yellow)' }}>
          ⚑
        </div>
        <div>
          <h1 className="text-sm font-pixel" style={{ color: 'var(--neon-yellow)', textShadow: '0 0 10px var(--neon-yellow)' }}>
            QUESTS
          </h1>
          <p className="text-xs" style={{ color: 'var(--text-dim)' }}>Discover opportunities and level up</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {opportunities?.map((opp, i) => {
          const cfg = typeConfig[opp.type] || { color: 'var(--text-dim)', border: '#333', icon: '?' }
          return (
            <div key={opp._id}
              className="card-retro p-4 space-y-3 card-enter relative overflow-hidden group"
              style={{
                borderColor: opp.bookmarked ? cfg.border : '#2a2a5a',
                boxShadow: opp.bookmarked ? `0 0 8px ${cfg.color}20` : 'none',
                animation: `fadeIn 0.3s ease ${i * 0.06}s both`,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                if (!opp.bookmarked) { el.style.borderColor = cfg.border; el.style.boxShadow = `0 0 8px ${cfg.color}20` }
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                if (!opp.bookmarked) { el.style.borderColor = '#2a2a5a'; el.style.boxShadow = 'none' }
              }}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-pixel px-2 py-1 flex items-center gap-1" style={{
                    background: `${cfg.color}15`,
                    border: `1px solid ${cfg.color}30`,
                    color: cfg.color,
                  }}>
                    <span>{cfg.icon}</span>
                    <span>{opp.type.toUpperCase()}</span>
                  </span>
                </div>
                <button onClick={() => bookmarkMutation.mutate({ id: opp._id, bookmarked: opp.bookmarked })}
                  className="text-lg transition-all duration-200 hover:scale-110"
                  style={{ color: opp.bookmarked ? 'var(--neon-yellow)' : 'var(--text-dim)' }}>
                  {opp.bookmarked ? '★' : '☆'}
                </button>
              </div>
              <h3 className="text-sm font-bold leading-snug" style={{ color: 'var(--text-main)' }}>{opp.title}</h3>
              <p className="text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--text-dim)' }}>{opp.description}</p>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: getDeadlineColor(opp.deadline) }} />
                  <span style={{ color: getDeadlineColor(opp.deadline) }}>
                    {getDeadlineLabel(opp.deadline)}
                  </span>
                </span>
                <a href={opp.url} target="_blank" rel="noopener noreferrer"
                  className="px-3 py-1 transition-all duration-200 text-xs font-pixel"
                  style={{
                    color: cfg.color,
                    border: `1px solid ${cfg.color}40`,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = `${cfg.color}15`; e.currentTarget.style.borderColor = cfg.color }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = `${cfg.color}40` }}>
                  VIEW &gt;
                </a>
              </div>
            </div>
          )
        })}
        {!opportunities?.length && (
          <div className="col-span-full text-center py-16">
            <div className="text-3xl mb-4" style={{ color: 'var(--text-dim)' }}>⚑</div>
            <p className="text-sm" style={{ color: 'var(--text-dim)' }}>No quests available. Check back later.</p>
          </div>
        )}
      </div>
    </div>
  )
}
