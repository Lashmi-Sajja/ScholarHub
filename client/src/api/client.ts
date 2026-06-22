const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('token')
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(err.message || 'Request failed')
  }
  return res.json()
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ token: string; user: { id: string; name: string; email: string } }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    register: (name: string, email: string, password: string) =>
      request<{ token: string; user: { id: string; name: string; email: string } }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      }),
    me: () => request<{ id: string; name: string; email: string }>('/auth/me'),
  },
  plans: {
    list: () => request<{ _id: string; title: string; generatedAt: string }[]>('/plans'),
    get: (id: string) => request<{ _id: string; title: string; tasks: { day: number; subject: string; description: string; duration: number; completed: boolean }[] }>(`/plans/${id}`),
    create: (data: { subjects: { name: string; deadline: string }[]; availableHoursPerDay: number }) =>
      request<{ _id: string; title: string }>('/plans', { method: 'POST', body: JSON.stringify(data) }),
    updateTask: (planId: string, taskId: string) =>
      request<{ _id: string; title: string; tasks: { _id: string; day: number; subject: string; description: string; duration: number; completed: boolean }[] }>(`/plans/${planId}/tasks/${taskId}`, { method: 'PATCH' }),
    delete: (id: string) => request<void>(`/plans/${id}`, { method: 'DELETE' }),
  },
  assistant: {
    ask: (message: string) =>
      request<{ reply: string }>('/assistant/ask', { method: 'POST', body: JSON.stringify({ message }) }),
    history: () => request<{ _id: string; messages: { role: string; content: string }[] }[]>('/assistant/history'),
  },
  opportunities: {
    list: () => request<{ _id: string; title: string; type: string; description: string; url: string; deadline: string; bookmarked: boolean }[]>('/opportunities'),
    bookmark: (id: string) => request<void>(`/opportunities/${id}/bookmark`, { method: 'POST' }),
    unbookmark: (id: string) => request<void>(`/opportunities/${id}/bookmark`, { method: 'DELETE' }),
  },
  dashboard: {
    stats: () => request<{ upcomingTasks: number; plansCreated: number; tasksCompleted: number }>('/dashboard'),
  },
}
