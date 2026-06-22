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
      if (selectedPlan) setSelectedPlan(null)
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

  const completedTasks = planDetail?.tasks.filter(t => t.completed).length ?? 0
  const totalTasks = planDetail?.tasks.length ?? 0
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 flex items-center justify-center text-lg"
          style={{ background: 'rgba(57,255,20,0.1)', border: '1px solid var(--neon-green)', color: 'var(--neon-green)' }}>
          ⚔
        </div>
        <div>
          <h1 className="text-sm font-pixel" style={{ color: 'var(--neon-green)', textShadow: '0 0 10px var(--neon-green)' }}>
            STUDY PLANNER
          </h1>
          <p className="text-xs" style={{ color: 'var(--text-dim)' }}>Generate AI-powered study plans</p>
        </div>
      </div>

      <div className="card-retro p-5 mb-8 relative overflow-hidden" style={{ borderColor: '#2a2a5a' }}>
        <div className="absolute inset-0 opacity-[0.02]" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, var(--neon-green) 2px, var(--neon-green) 3px)' }} />
        <div className="relative">
          <div className="flex items-center gap-2 pb-4 border-b border-white/5 mb-5">
            <span className="text-xs" style={{ color: 'var(--neon-green)' }}>▸</span>
            <h2 className="text-xs font-pixel" style={{ color: 'var(--neon-green)' }}>GENERATE PLAN</h2>
          </div>
          <div className="space-y-4">
            {subjects.map((s, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="flex-1">
                  <label className="block text-xs mb-1 font-pixel tracking-wider" style={{ color: 'var(--text-dim)' }}>
                    SUBJECT {i + 1}
                  </label>
                  <input type="text" placeholder="e.g. Calculus, Physics, History" value={s.name}
                    onChange={(e) => updateSubject(i, 'name', e.target.value)}
                    className="input-retro w-full" />
                </div>
                <div className="w-44">
                  <label className="block text-xs mb-1 font-pixel tracking-wider" style={{ color: 'var(--text-dim)' }}>
                    DEADLINE
                  </label>
                  <input type="date" value={s.deadline}
                    onChange={(e) => updateSubject(i, 'deadline', e.target.value)}
                    className="input-retro w-full" />
                </div>
              </div>
            ))}
            <button onClick={addSubject}
              className="flex items-center gap-2 text-xs px-3 py-2 transition-all duration-200"
              style={{ color: 'var(--neon-cyan)', border: '1px dashed rgba(0,255,242,0.2)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--neon-cyan)'; e.currentTarget.style.background = 'rgba(0,255,242,0.05)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0,255,242,0.2)'; e.currentTarget.style.background = 'transparent' }}>
              <span>+</span> ADD SUBJECT
            </button>
            <div className="flex items-end gap-6 pt-2">
              <div>
                <label className="block text-xs mb-1 font-pixel tracking-wider" style={{ color: 'var(--text-dim)' }}>
                  HOURS PER DAY
                </label>
                <div className="flex items-center gap-2">
                  <input type="number" min={1} max={16} value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                    className="input-retro w-20 text-center" />
                  <span className="text-xs" style={{ color: 'var(--text-dim)' }}>HRS</span>
                </div>
              </div>
              <button onClick={() => createMutation.mutate()}
                disabled={createMutation.isPending || !subjects.some((s) => s.name)}
                className="btn-retro flex-1"
                style={{ background: 'var(--neon-green)', color: 'var(--bg-dark)', borderColor: 'var(--neon-green)' }}>
                {createMutation.isPending ? '> GENERATING...' : '> GENERATE'}
              </button>
            </div>
            {createMutation.isError && (
              <div className="text-xs p-3 flex items-center gap-2" style={{
                background: 'rgba(255, 51, 85, 0.1)',
                border: '1px solid rgba(255, 51, 85, 0.3)',
                color: '#ff6b6b',
              }}>
                <span>⚠</span>
                <span>FAILED TO GENERATE PLAN</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-retro relative overflow-hidden" style={{ borderColor: '#2a2a5a' }}>
          <div className="p-5">
            <div className="flex items-center gap-2 pb-4 border-b border-white/5 mb-4">
              <span className="text-xs" style={{ color: 'var(--neon-yellow)' }}>▸</span>
              <h2 className="text-xs font-pixel" style={{ color: 'var(--neon-yellow)' }}>YOUR PLANS</h2>
              {plans && plans.length > 0 && (
                <span className="text-xs px-2 py-0.5 ml-auto" style={{
                  background: 'rgba(255,255,0,0.1)',
                  border: '1px solid rgba(255,255,0,0.2)',
                  color: 'var(--neon-yellow)',
                }}>
                  {plans.length}
                </span>
              )}
            </div>
            {plans?.length ? (
              <ul className="space-y-1">
                {plans.map((plan, i) => (
                  <li key={plan._id}
                    className="flex items-center justify-between px-3 py-2.5 transition-all duration-200"
                    style={{
                      animation: `fadeIn 0.3s ease ${i * 0.04}s both`,
                      border: '1px solid',
                      borderColor: selectedPlan === plan._id ? 'rgba(0,255,242,0.3)' : 'transparent',
                      background: selectedPlan === plan._id ? 'rgba(0,255,242,0.05)' : 'transparent',
                    }}
                    onMouseEnter={(e) => { if (selectedPlan !== plan._id) { e.currentTarget.style.background = 'rgba(0,255,242,0.03)' } }}
                    onMouseLeave={(e) => { if (selectedPlan !== plan._id) { e.currentTarget.style.background = 'transparent' } }}>
                    <button onClick={() => setSelectedPlan(plan._id)}
                      className="text-sm text-left flex items-center gap-2"
                      style={{ color: selectedPlan === plan._id ? 'var(--neon-cyan)' : 'var(--text-main)' }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{
                        background: selectedPlan === plan._id ? 'var(--neon-cyan)' : 'var(--text-dim)',
                        boxShadow: selectedPlan === plan._id ? '0 0 4px var(--neon-cyan)' : 'none',
                      }} />
                      {plan.title}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(plan._id) }}
                      className="text-xs px-2 py-1 transition-all duration-200"
                      style={{ color: 'rgba(255,51,85,0.6)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--neon-red)'; e.currentTarget.style.background = 'rgba(255,51,85,0.1)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,51,85,0.6)'; e.currentTarget.style.background = 'transparent' }}>
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8">
                <div className="text-2xl mb-2" style={{ color: 'var(--text-dim)' }}>⚔</div>
                <p className="text-sm" style={{ color: 'var(--text-dim)' }}>No plans yet. Generate one above.</p>
              </div>
            )}
          </div>
        </div>

        {planDetail && (
          <div className="card-retro relative overflow-hidden" style={{
            borderColor: 'var(--neon-cyan)',
            boxShadow: '0 0 8px rgba(0,255,242,0.1)',
          }}>
            <div className="p-5">
              <div className="flex items-center gap-2 pb-4 border-b border-white/5 mb-4">
                <span className="text-xs" style={{ color: 'var(--neon-cyan)' }}>▸</span>
                <h2 className="text-xs font-pixel truncate" style={{ color: 'var(--neon-cyan)' }}>{planDetail.title}</h2>
              </div>
              {totalTasks > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span style={{ color: 'var(--text-dim)' }}>PROGRESS: {completedTasks}/{totalTasks}</span>
                    <span style={{ color: 'var(--neon-green)' }}>{progress}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${progress}%`,
                        background: 'linear-gradient(90deg, var(--neon-cyan), var(--neon-green))',
                        boxShadow: '0 0 6px var(--neon-cyan)',
                      }} />
                  </div>
                </div>
              )}
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                {planDetail.tasks.map((task, i) => (
                  <div key={i}
                    className="flex items-center gap-3 p-3 transition-all duration-200 animate-fade-in"
                    style={{
                      background: task.completed ? 'rgba(57,255,20,0.06)' : 'rgba(255,255,255,0.02)',
                      border: '1px solid',
                      borderColor: task.completed ? 'rgba(57,255,20,0.15)' : 'transparent',
                      animationDelay: `${i * 30}ms`,
                    }}
                    onMouseEnter={(e) => { if (!task.completed) e.currentTarget.style.background = 'rgba(0,255,242,0.04)' }}
                    onMouseLeave={(e) => { if (!task.completed) e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}>
                    <input type="checkbox" checked={task.completed}
                      onChange={() => toggleMutation.mutate({ planId: planDetail._id, taskId: (task as any)._id })}
                      className="w-4 h-4 cursor-pointer shrink-0 accent-cyan-500"
                      style={{ accentColor: 'var(--neon-cyan)' }} />
                    <div className="w-8 h-8 flex items-center justify-center text-xs font-bold shrink-0"
                      style={{
                        background: task.completed ? 'rgba(57,255,20,0.15)' : 'rgba(0,255,242,0.1)',
                        border: '1px solid',
                        borderColor: task.completed ? 'var(--neon-green)' : 'var(--neon-cyan)',
                        color: task.completed ? 'var(--neon-green)' : 'var(--neon-cyan)',
                      }}>
                      {task.day}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm" style={{
                        color: task.completed ? 'rgba(255,255,255,0.35)' : 'var(--text-main)',
                        textDecoration: task.completed ? 'line-through' : 'none',
                      }}>
                        {task.subject}
                      </div>
                      <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-dim)' }}>
                        <span>{task.description}</span>
                        <span className="w-1 h-1 rounded-full" style={{ background: 'var(--text-dim)' }} />
                        <span>{task.duration}MIN</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
