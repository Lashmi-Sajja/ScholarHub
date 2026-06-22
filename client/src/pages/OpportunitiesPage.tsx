import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/client'

const typeColors: Record<string, { color: string; border: string }> = {
  hackathon: { color: 'var(--neon-cyan)', border: 'var(--neon-cyan)' },
  internship: { color: 'var(--neon-green)', border: 'var(--neon-green)' },
  scholarship: { color: 'var(--neon-magenta)', border: 'var(--neon-magenta)' },
  competition: { color: 'var(--neon-yellow)', border: 'var(--neon-yellow)' },
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

  return (
    <div>
      <h1 className="text-sm neon-text-yellow mb-6 font-pixel">▸ QUESTS</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {opportunities?.map((opp) => {
          const tc = typeColors[opp.type] || { color: 'var(--text-dim)', border: '#333' }
          return (
            <div key={opp._id} className="card-retro p-4 space-y-3" style={{ borderColor: tc.border, boxShadow: `0 0 6px ${tc.color}15` }}>
              <div className="flex items-start justify-between">
                <span className="text-xs font-pixel px-2 py-1" style={{ background: `${tc.color}20`, color: tc.color, border: `1px solid ${tc.color}40` }}>
                  {opp.type.toUpperCase()}
                </span>
                <button onClick={() => bookmarkMutation.mutate({ id: opp._id, bookmarked: opp.bookmarked })}
                  className="text-lg"
                  style={{ color: opp.bookmarked ? 'var(--neon-yellow)' : 'var(--text-dim)' }}>
                  {opp.bookmarked ? '★' : '☆'}
                </button>
              </div>
              <h3 className="text-sm font-bold" style={{ color: 'var(--text-main)' }}>{opp.title}</h3>
              <p className="text-sm line-clamp-2" style={{ color: 'var(--text-dim)' }}>{opp.description}</p>
              <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-dim)' }}>
                <span>BY: {new Date(opp.deadline).toLocaleDateString()}</span>
                <a href={opp.url} target="_blank" rel="noopener noreferrer"
                  className="hover:underline" style={{ color: tc.color }}>VIEW</a>
              </div>
            </div>
          )
        })}
        {!opportunities?.length && (
          <p className="text-sm col-span-full" style={{ color: 'var(--text-dim)' }}>No quests available. Check back later.</p>
        )}
      </div>
    </div>
  )
}
