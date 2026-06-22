import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/client'

export default function StudyPlannerPage() {
  const queryClient = useQueryClient()
  const [subjects, setSubjects] = useState([{ name: '', deadline: '' }])
  const [hours, setHours] = useState(4)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const { data: plans } = useQuery({ queryKey: ['plans'], queryFn: () => api.plans.list() })
  const { data: planDetail } = useQuery({
    queryKey: ['plan', selectedPlan],
    queryFn: () => api.plans.get(selectedPlan!),
    enabled: !!selectedPlan,
  })

  const createMutation = useMutation({
    mutationFn: () => api.plans.create({
      subjects: subjects.filter((s) => s.name),
      availableHoursPerDay: hours,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] })
      setSubjects([{ name: '', deadline: '' }])
      setHours(4)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.plans.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] })
      setSelectedPlan(null)
    },
  })

  const toggleMutation = useMutation({
    mutationFn: ({ planId, taskId }: { planId: string; taskId: string }) =>
      api.plans.updateTask(planId, taskId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['plan', selectedPlan] }),
  })

  const addSubject = () => setSubjects([...subjects, { name: '', deadline: '' }])
  const updateSubject = (i: number, field: 'name' | 'deadline', value: string) => {
    const copy = [...subjects]
    copy[i][field] = value
    setSubjects(copy)
  }

  return (
    <div>
      <h1 className="text-sm neon-text-cyan mb-6 font-pixel">▸ STUDY PLANNER</h1>

      <div className="card-retro p-5 mb-8" style={{ borderColor: '#2a2a4a' }}>
        <h2 className="text-xs font-pixel mb-4" style={{ color: 'var(--neon-green)' }}>▸ GENERATE PLAN</h2>
        <div className="space-y-3">
          {subjects.map((s, i) => (
            <div key={i} className="flex gap-3">
              <input type="text" placeholder="Subject name" value={s.name}
                onChange={(e) => updateSubject(i, 'name', e.target.value)}
                className="input-retro flex-1" />
              <input type="date" value={s.deadline}
                onChange={(e) => updateSubject(i, 'deadline', e.target.value)}
                className="input-retro w-40" />
            </div>
          ))}
          <button onClick={addSubject} className="text-xs hover:underline" style={{ color: 'var(--neon-cyan)' }}>
            + ADD SUBJECT
          </button>
          <div>
            <label className="block text-xs mb-1" style={{ color: 'var(--text-dim)' }}>HOURS PER DAY</label>
            <input type="number" min={1} max={16} value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="input-retro w-24" />
          </div>
          <button onClick={() => createMutation.mutate()}
            disabled={createMutation.isPending || !subjects.some((s) => s.name)}
            className="btn-retro"
            style={{ background: 'var(--neon-green)', color: 'var(--bg-dark)', borderColor: 'var(--neon-green)' }}>
            {createMutation.isPending ? '> GENERATING...' : '> GENERATE'}
          </button>
          {createMutation.isError && (
            <p className="text-xs" style={{ color: '#ff6b6b' }}>! FAILED TO GENERATE PLAN</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-retro p-5" style={{ borderColor: '#2a2a4a' }}>
          <h2 className="text-xs font-pixel mb-4" style={{ color: 'var(--neon-yellow)' }}>▸ YOUR PLANS</h2>
          {plans?.length ? (
            <ul className="space-y-2">
              {plans.map((plan) => (
                <li key={plan._id} className="flex items-center justify-between">
                  <button onClick={() => setSelectedPlan(plan._id)}
                    className="text-sm text-left hover:underline"
                    style={{ color: selectedPlan === plan._id ? 'var(--neon-cyan)' : 'var(--text-main)' }}>
                    {plan.title}
                  </button>
                  <button onClick={() => deleteMutation.mutate(plan._id)}
                    className="text-xs hover:underline" style={{ color: '#ff6b6b' }}>
                    DELETE
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm" style={{ color: 'var(--text-dim)' }}>No plans yet.</p>
          )}
        </div>

        {planDetail && (
          <div className="card-retro p-5" style={{ borderColor: 'var(--neon-cyan)', boxShadow: '0 0 8px rgba(0,255,242,0.1)' }}>
            <h2 className="text-xs font-pixel mb-4" style={{ color: 'var(--neon-cyan)' }}>▸ {planDetail.title}</h2>
            <div className="space-y-2">
              {planDetail.tasks.map((task, i) => (
                <div key={i} className="flex items-center gap-3 p-3"
                  style={{ background: task.completed ? 'rgba(57,255,20,0.08)' : 'rgba(255,255,255,0.03)', border: '1px solid', borderColor: task.completed ? 'rgba(57,255,20,0.2)' : 'transparent' }}>
                  <input type="checkbox" checked={task.completed}
                    onChange={() => toggleMutation.mutate({ planId: planDetail._id, taskId: (task as any)._id })}
                    className="w-4 h-4 accent-cyan-500 cursor-pointer"
                    style={{ accentColor: 'var(--neon-cyan)' }} />
                  <div className="w-7 h-7 flex items-center justify-center text-xs font-bold"
                    style={{ background: task.completed ? 'rgba(57,255,20,0.2)' : 'rgba(0,255,242,0.15)', color: task.completed ? 'var(--neon-green)' : 'var(--neon-cyan)', border: '1px solid', borderColor: task.completed ? 'var(--neon-green)' : 'var(--neon-cyan)' }}>
                    {task.day}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm" style={{ color: task.completed ? 'rgba(255,255,255,0.4)' : 'var(--text-main)', textDecoration: task.completed ? 'line-through' : 'none' }}>
                      {task.subject}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-dim)' }}>{task.description} | {task.duration}MIN</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
