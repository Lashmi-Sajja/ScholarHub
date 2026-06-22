import { useState, useRef, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/client'

export default function AIAssistantPage() {
  const queryClient = useQueryClient()
  const [message, setMessage] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)

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
  const allMessages = latest?.messages ?? []

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [allMessages, askMutation.isPending])

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] animate-fade-in">
      <div className="flex items-center gap-3 mb-6 shrink-0">
        <div className="w-10 h-10 flex items-center justify-center text-lg"
          style={{ background: 'rgba(255,0,255,0.1)', border: '1px solid var(--neon-magenta)', color: 'var(--neon-magenta)' }}>
          ◈
        </div>
        <div>
          <h1 className="text-sm font-pixel" style={{ color: 'var(--neon-magenta)', textShadow: '0 0 10px var(--neon-magenta)' }}>
            AI ASSISTANT
          </h1>
          <p className="text-xs" style={{ color: 'var(--text-dim)' }}>Ask me anything about your studies</p>
        </div>
      </div>

      <div className="flex-1 card-retro p-5 mb-4 overflow-y-auto space-y-4" style={{ borderColor: '#2a2a5a' }}>
        {allMessages.length > 0 ? (
          allMessages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              style={{ animationDelay: `${i * 30}ms` }}>
              {msg.role !== 'user' && (
                <div className="w-8 h-8 flex items-center justify-center text-xs shrink-0 mt-1 mr-2"
                  style={{
                    background: 'rgba(255,0,255,0.1)',
                    border: '1px solid var(--neon-magenta)',
                    color: 'var(--neon-magenta)',
                  }}>
                  AI
                </div>
              )}
              <div className="max-w-[75%] p-3 text-sm" style={{
                background: msg.role === 'user' ? 'rgba(0,255,242,0.08)' : 'rgba(255,0,255,0.06)',
                border: '1px solid',
                borderColor: msg.role === 'user' ? 'rgba(0,255,242,0.3)' : 'rgba(255,0,255,0.25)',
                color: msg.role === 'user' ? 'var(--neon-cyan)' : 'var(--text-main)',
              }}>
                <div className="text-xs mb-1.5" style={{
                  color: msg.role === 'user' ? 'var(--neon-cyan)' : 'var(--neon-magenta)',
                  opacity: 0.7,
                }}>
                  {msg.role === 'user' ? '▸ YOU' : '◈ AI'}
                </div>
                <div className="leading-relaxed whitespace-pre-wrap">{msg.content}</div>
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 flex items-center justify-center text-xs shrink-0 mt-1 ml-2"
                  style={{
                    background: 'rgba(0,255,242,0.1)',
                    border: '1px solid var(--neon-cyan)',
                    color: 'var(--neon-cyan)',
                  }}>
                  U
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-3xl mb-4" style={{ color: 'var(--neon-magenta)', textShadow: '0 0 15px var(--neon-magenta)' }}>
              ◈
            </div>
            <p className="text-sm mb-2" style={{ color: 'var(--text-dim)' }}>No conversations yet.</p>
            <p className="text-xs" style={{ color: 'var(--text-dim)', opacity: 0.7 }}>
              Type a message below to start chatting with the AI.
            </p>
          </div>
        )}
        {askMutation.isPending && (
          <div className="flex justify-start animate-fade-in">
            <div className="w-8 h-8 flex items-center justify-center text-xs shrink-0 mt-1 mr-2"
              style={{
                background: 'rgba(255,0,255,0.1)',
                border: '1px solid var(--neon-magenta)',
                color: 'var(--neon-magenta)',
              }}>
              AI
            </div>
            <div className="p-3 text-sm" style={{
              background: 'rgba(255,0,255,0.06)',
              border: '1px solid rgba(255,0,255,0.25)',
              color: 'var(--text-dim)',
            }}>
              <span className="animate-pulse">THINKING</span>
              <span className="animate-terminal ml-1">▌</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={(e) => { e.preventDefault(); askMutation.mutate() }} className="flex gap-3 shrink-0">
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
