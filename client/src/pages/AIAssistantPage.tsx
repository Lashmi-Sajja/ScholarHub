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
    <div className="p-8 flex flex-col h-[calc(100vh-4rem)]">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">AI Academic Assistant</h1>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4 overflow-y-auto space-y-4">
        {latest?.messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] p-3 rounded-xl text-sm ${
              msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-900'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {!latest && <p className="text-sm text-gray-400 text-center">Ask a question to get started.</p>}
        {askMutation.isPending && <p className="text-sm text-gray-400 text-center">Thinking...</p>}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); askMutation.mutate() }} className="flex gap-3">
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask a question about your studies..."
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <button type="submit" disabled={!message || askMutation.isPending}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors">
          Send
        </button>
      </form>
    </div>
  )
}
