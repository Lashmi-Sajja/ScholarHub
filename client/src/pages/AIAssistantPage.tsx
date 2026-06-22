import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/client'

export default function AIAssistantPage() {
  const queryClient = useQueryClient()
  const [message, setMessage] = useState('')

  const { data: conversations } = useQuery({
    queryKey: ['assistant-history'],
    queryFn: () => api.assistant.history(),
  })

  const askMutation = useMutation({
    mutationFn: () => api.assistant.ask(message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assistant-history'] })
      setMessage('')
    },
  })

  const latest = conversations?.[conversations.length - 1]

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      <h1 className="text-sm neon-text-magenta mb-6 font-pixel">▸ AI ASSISTANT</h1>

      <div className="flex-1 card-retro p-5 mb-4 overflow-y-auto space-y-4" style={{ borderColor: '#2a2a4a' }}>
        {latest?.messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[70%] p-3 text-sm" style={{
              background: msg.role === 'user' ? 'rgba(0,255,242,0.1)' : 'rgba(255,0,255,0.08)',
              border: '1px solid',
              borderColor: msg.role === 'user' ? 'var(--neon-cyan)' : 'var(--neon-magenta)',
              color: msg.role === 'user' ? 'var(--neon-cyan)' : 'var(--text-main)',
            }}>
              <div className="text-xs mb-1 opacity-60">
                {msg.role === 'user' ? '> YOU' : '< AI'}
              </div>
              {msg.content}
            </div>
          </div>
        ))}
        {!latest && (
          <div className="text-center mt-16">
            <div className="text-2xl mb-2" style={{ color: 'var(--neon-magenta)' }}>?</div>
            <p className="text-sm" style={{ color: 'var(--text-dim)' }}>Ask me anything about your studies.</p>
          </div>
        )}
        {askMutation.isPending && (
          <div className="text-center">
            <span className="text-sm animate-pulse" style={{ color: 'var(--neon-cyan)' }}>THINKING...</span>
          </div>
        )}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); askMutation.mutate() }} className="flex gap-3">
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your question..."
          className="input-retro flex-1" />
        <button type="submit" disabled={!message || askMutation.isPending}
          className="btn-retro"
          style={{ background: 'var(--neon-magenta)', color: '#fff', borderColor: 'var(--neon-magenta)' }}>
          SEND
        </button>
      </form>
    </div>
  )
}
