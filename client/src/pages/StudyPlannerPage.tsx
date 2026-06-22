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
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Study Planner</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Create a Study Plan</h2>
        <div className="space-y-3">
          {subjects.map((s, i) => (
            <div key={i} className="flex gap-3">
              <input type="text" placeholder="Subject name" value={s.name}
                onChange={(e) => updateSubject(i, 'name', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <input type="date" value={s.deadline}
                onChange={(e) => updateSubject(i, 'deadline', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          ))}
          <button onClick={addSubject} className="text-sm text-indigo-600 hover:underline">+ Add subject</button>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Available hours per day</label>
            <input type="number" min={1} max={16} value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <button onClick={() => createMutation.mutate()}
            disabled={createMutation.isPending || !subjects.some((s) => s.name)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors">
            {createMutation.isPending ? 'Generating...' : 'Generate Plan'}
          </button>
          {createMutation.isError && <p className="text-sm text-red-600">Failed to create plan</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Plans</h2>
          {plans?.length ? (
            <ul className="space-y-2">
              {plans.map((plan) => (
                <li key={plan._id} className="flex items-center justify-between">
                  <button onClick={() => setSelectedPlan(plan._id)}
                    className={`text-sm text-left ${selectedPlan === plan._id ? 'text-indigo-600 font-medium' : 'text-gray-700 hover:text-indigo-600'}`}>
                    {plan.title}
                  </button>
                  <button onClick={() => deleteMutation.mutate(plan._id)}
                    className="text-xs text-red-500 hover:underline">Delete</button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">No plans yet.</p>
          )}
        </div>

        {planDetail && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{planDetail.title}</h2>
            <div className="space-y-2">
              {planDetail.tasks.map((task, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${task.completed ? 'bg-green-50' : 'bg-gray-50'}`}>
                  <input type="checkbox" checked={task.completed}
                    onChange={() => toggleMutation.mutate({ planId: planDetail._id, taskId: (task as any)._id })}
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-medium">
                    {task.day}
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{task.subject}</div>
                    <div className={`text-xs ${task.completed ? 'text-gray-400' : 'text-gray-500'}`}>{task.description} &middot; {task.duration}min</div>
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
